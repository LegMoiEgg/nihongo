import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from './auth'
import { levelForXp } from './user'

export interface GroupMember {
  uid: string
  displayName: string
  avatarDataUrl: string
  totalXp: number
  currentStreak: number
  level: number
  goalReachedToday: boolean  // has this member reached their daily XP goal today?
  canBeNudged: boolean       // has an FCM token → can receive a reminder push
}

const DAILY_XP_GOAL = 100

/** Public, non-sensitive profile data of another user (for group profiles). */
export interface PublicProfile {
  uid: string
  displayName: string
  avatarDataUrl: string
  totalXp: number
  placementLevel: number
  currentStreak: number   // effective (validated against today/yesterday)
  longestStreak: number
  earnedBadges: { id: string; earnedAt: string }[]
  cardProgress: any[]
  dailyLog: { date: string; xpEarned: number }[]
}

export interface SocialGroup {
  id: string
  name: string
  password?: string  // optional group access code
  createdBy: string
  createdAt: string
  memberUids: string[]
  members?: GroupMember[] // populated client-side
}

export const useSocialStore = defineStore('social', () => {
  const myGroups = ref<SocialGroup[]>([])
  const allGroups = ref<SocialGroup[]>([])
  const currentGroup = ref<SocialGroup | null>(null)
  const loading = ref(false)
  const error = ref('')

  /** Load ALL groups (public directory). Password-protected groups are shown
   *  too, but require a password to join. */
  async function loadAllGroups() {
    loading.value = true
    error.value = ''
    try {
      const snapshot = await getDocs(collection(db, 'groups'))
      allGroups.value = snapshot.docs.map(d => {
        const data = d.data() as SocialGroup
        // Don't expose the actual password to the directory — only whether
        // the group is protected. The real check happens server-side-ish in
        // joinGroup (which re-reads the single doc).
        return {
          ...data,
          id: d.id,
          password: data.password ? '__protected__' : undefined,
        }
      }) as SocialGroup[]
      // Sort: most members first
      allGroups.value.sort((a, b) => (b.memberUids?.length || 0) - (a.memberUids?.length || 0))
    } catch (e: any) {
      error.value = 'Gruppen konnten nicht geladen werden.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  /** Load all groups the current user is a member of */
  async function loadMyGroups() {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.uid) {
      myGroups.value = []
      return
    }

    loading.value = true
    error.value = ''

    try {
      const q = query(
        collection(db, 'groups'),
        where('memberUids', 'array-contains', authStore.uid)
      )
      const snapshot = await getDocs(q)
      myGroups.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as SocialGroup[]
    } catch (e: any) {
      error.value = 'Gruppen konnten nicht geladen werden.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  /** Create a new group */
  async function createGroup(name: string, password?: string): Promise<string | null> {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.uid) return null

    error.value = ''
    const groupId = name.toLowerCase().replace(/[^a-z0-9äöü]/g, '-').replace(/-+/g, '-').slice(0, 30) + '-' + Date.now().toString(36)

    try {
      const groupData: Omit<SocialGroup, 'id' | 'members'> = {
        name,
        createdBy: authStore.uid,
        createdAt: new Date().toISOString(),
        memberUids: [authStore.uid],
        ...(password ? { password } : {}),
      }
      await setDoc(doc(db, 'groups', groupId), groupData)
      await loadMyGroups()
      return groupId
    } catch (e: any) {
      error.value = 'Gruppe konnte nicht erstellt werden.'
      console.error(e)
      return null
    }
  }

  /**
   * Verify a group's password WITHOUT joining. Used to gate viewing the
   * members of a protected group before deciding to join.
   */
  async function verifyGroupPassword(groupId: string, password: string): Promise<boolean> {
    error.value = ''
    try {
      const snapshot = await getDoc(doc(db, 'groups', groupId))
      if (!snapshot.exists()) {
        error.value = 'Gruppe nicht gefunden.'
        return false
      }
      const groupData = snapshot.data() as SocialGroup
      if (!groupData.password) return true // not protected → always ok
      if (password !== groupData.password) {
        error.value = 'Falsches Passwort.'
        return false
      }
      return true
    } catch (e: any) {
      error.value = 'Passwort konnte nicht geprüft werden.'
      console.error(e)
      return false
    }
  }

  /** Join a group by ID */
  async function joinGroup(groupId: string, password?: string): Promise<boolean> {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.uid) return false

    error.value = ''

    try {
      const groupRef = doc(db, 'groups', groupId)
      const snapshot = await getDoc(groupRef)

      if (!snapshot.exists()) {
        error.value = 'Gruppe nicht gefunden.'
        return false
      }

      const groupData = snapshot.data() as SocialGroup

      // Check password if group has one
      if (groupData.password) {
        if (!password) {
          error.value = 'Diese Gruppe erfordert ein Passwort.'
          return false
        }
        if (password !== groupData.password) {
          error.value = 'Falsches Passwort.'
          return false
        }
      }

      await updateDoc(groupRef, {
        memberUids: arrayUnion(authStore.uid),
      })

      await loadMyGroups()
      return true
    } catch (e: any) {
      error.value = 'Konnte der Gruppe nicht beitreten.'
      console.error(e)
      return false
    }
  }

  /** Leave a group */
  async function leaveGroup(groupId: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.uid) return

    try {
      await updateDoc(doc(db, 'groups', groupId), {
        memberUids: arrayRemove(authStore.uid),
      })
      await loadMyGroups()
      currentGroup.value = null
    } catch (e: any) {
      error.value = 'Konnte die Gruppe nicht verlassen.'
      console.error(e)
    }
  }

  /** Load group details with member data (from users collection) */
  async function loadGroupDetails(groupId: string): Promise<void> {
    loading.value = true
    error.value = ''

    try {
      const groupSnap = await getDoc(doc(db, 'groups', groupId))
      if (!groupSnap.exists()) {
        error.value = 'Gruppe nicht gefunden.'
        loading.value = false
        return
      }

      const group = { id: groupSnap.id, ...groupSnap.data() } as SocialGroup

      // Fetch member data
      const members: GroupMember[] = []
      for (const uid of group.memberUids) {
        try {
          const userSnap = await getDoc(doc(db, 'users', uid))
          if (userSnap.exists()) {
            const data = userSnap.data()
            const today = new Date().toISOString().split('T')[0]
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split('T')[0]

            const dailyLog: { date: string; xpEarned: number }[] = data.dailyLog || []
            const todayEntry = dailyLog.find(d => d.date === today)
            const todayXp = todayEntry ? todayEntry.xpEarned : 0
            // The level is the higher of the XP-based level and any level set
            // by the placement test (which grants a level without XP).
            const xpLevel = levelForXp(data.totalXp || 0)
            const placement = data.placementLevel || 0
            // Effective streak: a stored streak is only still valid if the
            // member was active today or yesterday. Otherwise it's broken —
            // show 0 even if their doc hasn't been updated yet (they haven't
            // opened the app since missing a day).
            const lastActive = data.lastActiveDate || ''
            const storedStreak = data.currentStreak || 0
            const effectiveStreak =
              lastActive === today || lastActive === yesterdayStr ? storedStreak : 0
            members.push({
              uid,
              displayName: data.displayName || 'Anonym',
              avatarDataUrl: data.avatarDataUrl || '',
              totalXp: data.totalXp || 0,
              currentStreak: effectiveStreak,
              level: Math.max(xpLevel, placement),
              goalReachedToday: todayXp >= DAILY_XP_GOAL,
              canBeNudged: !!data.fcmToken,
            })
          }
        } catch {
          // Skip members we can't load
        }
      }

      // Sort by XP descending
      members.sort((a, b) => b.totalXp - a.totalXp)
      group.members = members
      currentGroup.value = group
    } catch (e: any) {
      error.value = 'Gruppendetails konnten nicht geladen werden.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // ── Public profile of another group member ──
  const publicProfile = ref<PublicProfile | null>(null)

  async function loadPublicProfile(uid: string): Promise<void> {
    loading.value = true
    error.value = ''
    publicProfile.value = null
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      if (!snap.exists()) {
        error.value = 'Profil nicht gefunden.'
        return
      }
      const data = snap.data()

      // Validate streak the same way the leaderboard does.
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const lastActive = data.lastActiveDate || ''
      const storedStreak = data.currentStreak || 0
      const effectiveStreak =
        lastActive === today || lastActive === yesterdayStr ? storedStreak : 0

      // Only copy public, non-sensitive fields (no email/fcmToken).
      publicProfile.value = {
        uid,
        displayName: data.displayName || 'Anonym',
        avatarDataUrl: data.avatarDataUrl || '',
        totalXp: data.totalXp || 0,
        placementLevel: data.placementLevel || 0,
        currentStreak: effectiveStreak,
        longestStreak: data.longestStreak || 0,
        earnedBadges: data.earnedBadges || [],
        cardProgress: data.cardProgress || [],
        dailyLog: data.dailyLog || [],
      }
    } catch (e: any) {
      error.value = 'Profil konnte nicht geladen werden.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // Track who the current user has nudged today (so the bell disables).
  const nudgedUids = ref<Set<string>>(new Set())

  // The nudge history is stored PER ACCOUNT (key includes the uid), not
  // per device. Otherwise a second account logging in on the same device
  // would inherit the first account's "already nudged" list and be wrongly
  // blocked from nudging someone it never nudged.
  function nudgedStorageKey(): string {
    const authStore = useAuthStore()
    return authStore.uid ? `nihongo_nudged_${authStore.uid}` : 'nihongo_nudged'
  }

  function loadNudgedToday() {
    const today = new Date().toISOString().split('T')[0]
    const key = nudgedStorageKey()
    const raw = localStorage.getItem(key)
    try {
      const parsed = raw ? JSON.parse(raw) as { date: string; uids: string[] } : null
      if (parsed && parsed.date === today) {
        nudgedUids.value = new Set(parsed.uids)
        return
      }
    } catch { /* ignore */ }
    // New day (or new account) → reset
    nudgedUids.value = new Set()
    localStorage.setItem(key, JSON.stringify({ date: today, uids: [] }))
  }

  function hasNudged(uid: string): boolean {
    return nudgedUids.value.has(uid)
  }

  /**
   * Nudge a group member who hasn't reached their daily goal.
   * Writes a nudge request to Firestore; a Cloud Function sends the push.
   * Limited to once per target per day (client-side + deterministic doc id).
   */
  async function nudge(targetUid: string, fromName: string, groupName: string): Promise<boolean> {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.uid) return false
    if (targetUid === authStore.uid) return false

    const today = new Date().toISOString().split('T')[0]
    const nudgeId = `${targetUid}_${authStore.uid}_${today}`

    try {
      await setDoc(doc(db, 'nudges', nudgeId), {
        targetUid,
        fromUid: authStore.uid,
        fromName: fromName || 'Ein Freund',
        groupName: groupName || '',
        date: today,
        createdAt: serverTimestamp(),
        sent: false,  // Cloud Function flips this to true after sending
      })

      // Remember locally (per account) so the bell disables immediately
      nudgedUids.value.add(targetUid)
      localStorage.setItem(
        nudgedStorageKey(),
        JSON.stringify({ date: today, uids: [...nudgedUids.value] })
      )
      return true
    } catch (e) {
      console.error('Nudge failed:', e)
      error.value = 'Erinnerung konnte nicht gesendet werden.'
      return false
    }
  }

  function clearError() {
    error.value = ''
  }

  return {
    myGroups,
    allGroups,
    currentGroup,
    loading,
    error,
    loadMyGroups,
    loadAllGroups,
    createGroup,
    verifyGroupPassword,
    joinGroup,
    leaveGroup,
    loadGroupDetails,
    publicProfile,
    loadPublicProfile,
    nudge,
    hasNudged,
    loadNudgedToday,
    clearError,
  }
})


