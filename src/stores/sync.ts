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
export async function saveToCloud(): Promise<void> {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn || !authStore.uid) return

  const userStore = useUserStore()
  const learningStore = useLearningStore()
  const badgesStore = useBadgesStore()

  const data: CloudUserData = {
    totalXp: userStore.totalXp,
    currentStreak: userStore.currentStreak,
    longestStreak: userStore.longestStreak,
    lastActiveDate: userStore.lastActiveDate,
    dailyLog: userStore.dailyLog,
    wordsLearnedTotal: userStore.wordsLearnedTotal,
    sessionsCompletedTotal: userStore.sessionsCompletedTotal,
    displayName: userStore.displayName,
    avatarDataUrl: userStore.avatarDataUrl,
    placementLevel: userStore.placementLevel,
    cardProgress: learningStore.cardProgress,
    earnedBadges: badgesStore.earnedBadges,
    lastSyncedAt: new Date().toISOString(),
  }

  try {
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
      // First time: upload local data to cloud
      await saveToCloud()
      return true
    }

    const cloud = snapshot.data() as CloudUserData
    mergeCloudData(cloud)

    // Mark onboarding as done if cloud has data (returning user on new device)
    if (cloud.totalXp > 0 || cloud.cardProgress?.length > 0) {
      localStorage.setItem('nihongo_onboarding_done', 'true')
      localStorage.setItem('nihongo_placement_done', 'true')
    }

    return true
  } catch (e) {
    console.error('Failed to load from cloud:', e)
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
  if (cloud.currentStreak > userStore.currentStreak) {
    userStore.currentStreak = cloud.currentStreak
    localStorage.setItem('nihongo_streak', JSON.stringify(cloud.currentStreak))
  }
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
  if (cloud.displayName && !userStore.displayName) {
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
