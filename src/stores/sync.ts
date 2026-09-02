import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from './auth'
import { useUserStore } from './user'
import { useLearningStore } from './learning'
import { useBadgesStore } from './badges'

/**
 * Shape of the user document in Firestore.
 * Mirrors the localStorage data, stored under users/{uid}.
 */
interface CloudUserData {
  // user store
  totalXp: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  dailyLog: any[]
  wordsLearnedTotal: number
  sessionsCompletedTotal: number
  displayName: string
  avatarDataUrl: string
  placementLevel: number
  // learning store
  cardProgress: any[]
  // badges store
  earnedBadges: any[]
  // metadata
  lastSyncedAt: string
}

function getUserDocRef(uid: string) {
  return doc(db, 'users', uid)
}

/**
 * Save all current local state to Firestore.
 * Called after login/register and periodically during use.
 */
/**
 * Guard against overwriting cloud data with empty local state.
 * After login, local state starts empty (0 XP) until loadFromCloud() merges
 * the real data. If a save fired during that window it would wipe the cloud
 * doc. We only allow saving once the cloud has been loaded this session.
 */
let cloudLoaded = false

export function markCloudLoaded() {
  cloudLoaded = true
}

/**
 * Resolves once auth state is known AND (if logged in) the initial cloud load
 * has finished. The router waits for this before deciding onboarding vs. home,
 * so a returning user is never sent to onboarding before their cloud data has
 * loaded. App.vue calls resolveAuthSettled() when the initial flow completes.
 */
let _resolveAuthSettled: (() => void) | null = null
export const authSettled: Promise<void> = new Promise((resolve) => {
  _resolveAuthSettled = resolve
})
export function resolveAuthSettled() {
  if (_resolveAuthSettled) {
    _resolveAuthSettled()
    _resolveAuthSettled = null
  }
}

export async function saveToCloud(): Promise<void> {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn || !authStore.uid) return

  // Don't save before the initial cloud load completed — prevents wiping
  // existing progress with the empty post-login local state.
  if (!cloudLoaded) return

  const userStore = useUserStore()
  const learningStore = useLearningStore()
  const badgesStore = useBadgesStore()

  try {
    // ── Safety: re-read the cloud doc right before writing. NEVER let a
    //    write REDUCE progress (lower XP, fewer cards, lost placement level).
    //    This makes it impossible for an empty/stale local state to wipe
    //    real cloud data, regardless of any timing/race condition. ──
    const existingSnap = await getDoc(getUserDocRef(authStore.uid))
    const cloud = existingSnap.exists() ? (existingSnap.data() as Partial<CloudUserData>) : null

    const cloudXp = cloud?.totalXp ?? 0
    const cloudCards = cloud?.cardProgress?.length ?? 0
    const localCards = learningStore.cardProgress.length

    // Detect a suspicious write where our PROGRESS is behind the cloud (e.g.
    // a save fired before the initial load finished). In that case we must
    // not touch progress fields — but we STILL want to persist identity
    // fields the user just changed (username, avatar). So instead of skipping
    // the whole write, we keep progress at the cloud values via Math.max and
    // only update the identity fields.
    const progressBehind = !!cloud && (cloudXp > userStore.totalXp || cloudCards > localCards)

    const data: CloudUserData = {
      // Never write a lower value for monotonic progress fields.
      totalXp: Math.max(userStore.totalXp, cloudXp),
      currentStreak: Math.max(userStore.currentStreak, cloud?.currentStreak ?? 0),
      longestStreak: Math.max(userStore.longestStreak, cloud?.longestStreak ?? 0),
      lastActiveDate: userStore.lastActiveDate || cloud?.lastActiveDate || '',
      // If our progress is behind the cloud, keep the cloud's richer arrays.
      dailyLog: progressBehind ? (cloud?.dailyLog ?? userStore.dailyLog) : userStore.dailyLog,
      wordsLearnedTotal: Math.max(userStore.wordsLearnedTotal, cloud?.wordsLearnedTotal ?? 0),
      sessionsCompletedTotal: Math.max(userStore.sessionsCompletedTotal, cloud?.sessionsCompletedTotal ?? 0),
      // Identity fields: always write what the user currently has locally.
      // (An empty string is allowed — the user may clear their name.)
      displayName: userStore.displayName,
      avatarDataUrl: userStore.avatarDataUrl,
      placementLevel: Math.max(userStore.placementLevel, cloud?.placementLevel ?? 0),
      cardProgress: progressBehind ? (cloud?.cardProgress ?? learningStore.cardProgress) : learningStore.cardProgress,
      earnedBadges: badgesStore.earnedBadges,
      lastSyncedAt: new Date().toISOString(),
    }

    await setDoc(getUserDocRef(authStore.uid), data, { merge: true })
  } catch (e) {
    console.error('Failed to save to cloud:', e)
  }
}

/**
 * Load cloud data and merge with local state.
 * Strategy: take the HIGHER value for XP, streaks, counts.
 * For arrays (cardProgress, badges, dailyLog): merge, keeping the better entry per item.
 */
export async function loadFromCloud(): Promise<boolean> {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn || !authStore.uid) return false

  try {
    const snapshot = await getDoc(getUserDocRef(authStore.uid))
    if (!snapshot.exists()) {
      // Genuinely brand-new account (Firestore reachable, no doc exists).
      // Apply the suggested username (registration name / Google email prefix)
      // now — but only here, so an existing account never inherits it.
      const userStore = useUserStore()
      const suggested = authStore.consumeSuggestedName()
      if (suggested && !userStore.displayName) {
        userStore.setDisplayName(suggested)
      }
      markCloudLoaded()
      await saveToCloud()
      return false
    }

    // Existing account → the suggested name is irrelevant, discard it so it
    // can't leak into a later login.
    authStore.consumeSuggestedName()

    // If a DIFFERENT account than last time is logging in (account switch in
    // the same session), clear the previous account's identity fields first
    // so they don't leak into this account before the merge overwrites them.
    const lastUid = localStorage.getItem('nihongo_last_uid')
    if (lastUid && lastUid !== authStore.uid) {
      const userStore = useUserStore()
      userStore.setDisplayName('')
      userStore.setAvatar('')
    }
    localStorage.setItem('nihongo_last_uid', authStore.uid)

    const cloud = snapshot.data() as CloudUserData
    mergeCloudData(cloud)

    // Cloud data is now merged into local state → future saves are safe.
    markCloudLoaded()

    // Returning user only if the cloud actually had meaningful progress.
    const hadRealData = (cloud.totalXp > 0) ||
      (cloud.cardProgress?.length > 0) ||
      ((cloud.placementLevel ?? 0) > 0)

    if (hadRealData) {
      localStorage.setItem('nihongo_onboarding_done', 'true')
      localStorage.setItem('nihongo_placement_done', 'true')
    }

    // Only signal "returning user" when there was real data to come back to.
    return hadRealData
  } catch (e) {
    console.error('Failed to load from cloud:', e)
    // On error, don't permanently block saving — but also don't risk
    // wiping cloud data. Leave cloudLoaded false so saves stay blocked
    // until a successful load; the user's cloud data remains intact.
    return false
  }
}

function mergeCloudData(cloud: CloudUserData) {
  const userStore = useUserStore()
  const learningStore = useLearningStore()
  const badgesStore = useBadgesStore()

  // ── User store: take higher values ──
  if (cloud.totalXp > userStore.totalXp) {
    userStore.totalXp = cloud.totalXp
    localStorage.setItem('nihongo_xp', JSON.stringify(cloud.totalXp))
  }
  // Streak belongs together with lastActiveDate: adopt the streak from
  // whichever side was active more recently. Do NOT just take the higher
  // streak, or a broken streak (missed day) would be revived by a stale
  // cloud value. updateStreak() below then re-validates against today.
  if ((cloud.lastActiveDate || '') > (userStore.lastActiveDate || '')) {
    userStore.currentStreak = cloud.currentStreak
    localStorage.setItem('nihongo_streak', JSON.stringify(cloud.currentStreak))
  }
  // longestStreak is a lifetime record → higher always wins.
  if (cloud.longestStreak > userStore.longestStreak) {
    userStore.longestStreak = cloud.longestStreak
    localStorage.setItem('nihongo_longest_streak', JSON.stringify(cloud.longestStreak))
  }
  if (cloud.wordsLearnedTotal > userStore.wordsLearnedTotal) {
    userStore.wordsLearnedTotal = cloud.wordsLearnedTotal
    localStorage.setItem('nihongo_words_total', JSON.stringify(cloud.wordsLearnedTotal))
  }
  if (cloud.sessionsCompletedTotal > userStore.sessionsCompletedTotal) {
    userStore.sessionsCompletedTotal = cloud.sessionsCompletedTotal
    localStorage.setItem('nihongo_sessions_total', JSON.stringify(cloud.sessionsCompletedTotal))
  }
  // Username: prefer the cloud value if it has one; otherwise keep whatever
  // is local. This restores a saved name on reload AND doesn't wipe a name
  // the user just set. (Account-switch leaks are prevented by clearing the
  // name on logout / account change, not here.)
  if (cloud.displayName) {
    userStore.displayName = cloud.displayName
    localStorage.setItem('nihongo_display_name', JSON.stringify(cloud.displayName))
  }
  if (cloud.avatarDataUrl && !userStore.avatarDataUrl) {
    userStore.avatarDataUrl = cloud.avatarDataUrl
    localStorage.setItem('nihongo_avatar', JSON.stringify(cloud.avatarDataUrl))
  }
  // Placement level: keep the higher one (from the placement test)
  if ((cloud.placementLevel ?? 0) > userStore.placementLevel) {
    userStore.setPlacementLevel(cloud.placementLevel)
  }
  if (cloud.lastActiveDate > userStore.lastActiveDate) {
    userStore.lastActiveDate = cloud.lastActiveDate
    localStorage.setItem('nihongo_last_active', JSON.stringify(cloud.lastActiveDate))
  }

  // ── Daily log: merge by date, take higher XP per day ──
  if (cloud.dailyLog?.length) {
    const localMap = new Map(userStore.dailyLog.map(d => [d.date, d]))
    for (const cloudDay of cloud.dailyLog) {
      const local = localMap.get(cloudDay.date)
      if (!local || cloudDay.xpEarned > local.xpEarned) {
        localMap.set(cloudDay.date, cloudDay)
      }
    }
    userStore.dailyLog = Array.from(localMap.values()).sort((a, b) => a.date.localeCompare(b.date))
    localStorage.setItem('nihongo_daily_log', JSON.stringify(userStore.dailyLog))
  }

  // ── Card progress: merge by id, take the one with more correct answers ──
  if (cloud.cardProgress?.length) {
    const localMap = new Map(learningStore.cardProgress.map(c => [c.id, c]))
    for (const cloudCard of cloud.cardProgress) {
      const local = localMap.get(cloudCard.id)
      if (!local || cloudCard.correctCount > local.correctCount) {
        localMap.set(cloudCard.id, {
          ...cloudCard,
          consecutiveCorrect: cloudCard.consecutiveCorrect ?? 0,
        })
      }
    }
    learningStore.cardProgress = Array.from(localMap.values())
    localStorage.setItem('nihongo_card_progress', JSON.stringify(learningStore.cardProgress))
  }

  // ── Badges: union of both sets ──
  if (cloud.earnedBadges?.length) {
    const localIds = new Set(badgesStore.earnedBadges.map(b => b.id))
    for (const cloudBadge of cloud.earnedBadges) {
      if (!localIds.has(cloudBadge.id)) {
        badgesStore.earnedBadges.push(cloudBadge)
      }
    }
    localStorage.setItem('nihongo_badges', JSON.stringify(badgesStore.earnedBadges))
  }

  // Re-validate the streak against today: if the last active day is older
  // than yesterday, this resets it to 0 — so a stale cloud streak that was
  // just merged in cannot survive a missed day.
  userStore.updateStreak()
}

/**
 * Debounced cloud save — call this after any meaningful state change.
 * Saves at most once every 30 seconds to avoid excessive writes.
 */
let saveTimeout: ReturnType<typeof setTimeout> | null = null

export function scheduleSave() {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn) return

  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveToCloud()
    saveTimeout = null
  }, 5000) // 5 second debounce — keeps Firestore fresh for the Cloud Function
}

/**
 * Immediately flush any pending save. Call this when the app is about to
 * go to the background so the Cloud Function reads up-to-date dailyLog data
 * (fixes: notifications despite reaching the daily goal).
 */
export function flushSave(): Promise<void> {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn) return Promise.resolve()

  if (saveTimeout) {
    clearTimeout(saveTimeout)
    saveTimeout = null
  }
  return saveToCloud()
}

let flushHandlerRegistered = false

/**
 * Registers a visibilitychange handler that flushes pending saves when the
 * app is hidden (tab switch, app minimized, screen lock). Idempotent.
 */
export function registerFlushOnHide() {
  if (flushHandlerRegistered) return
  if (typeof document === 'undefined') return
  flushHandlerRegistered = true

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && saveTimeout) {
      flushSave()
    }
  })
}
