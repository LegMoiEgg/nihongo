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
            members.push({
              uid,
              displayName: data.displayName || 'Anonym',
              avatarDataUrl: data.avatarDataUrl || '',
              totalXp: data.totalXp || 0,
              currentStreak: data.currentStreak || 0,
              level: levelForXp(data.totalXp || 0),
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
    joinGroup,
    leaveGroup,
    loadGroupDetails,
    clearError,
  }
})


