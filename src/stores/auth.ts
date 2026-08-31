import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '../firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref('')

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => user.value?.displayName || '')
  const email = computed(() => user.value?.email || '')
  const uid = computed(() => user.value?.uid || '')

  /** Initialize auth listener — call once on app start */
  function initAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        loading.value = false
        resolve()
      })
    })
  }

  async function register(email: string, password: string, name: string) {
    error.value = ''
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name) {
        await updateProfile(cred.user, { displayName: name })
      }
      user.value = cred.user
    } catch (e: any) {
      error.value = mapFirebaseError(e.code)
      throw e
    }
  }

  async function login(email: string, password: string) {
    error.value = ''
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      user.value = cred.user
    } catch (e: any) {
      error.value = mapFirebaseError(e.code)
      throw e
    }
  }

  async function logout() {
    error.value = ''
    await signOut(auth)
    user.value = null
  }

  function clearError() {
    error.value = ''
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    displayName,
    email,
    uid,
    initAuth,
    register,
    login,
    logout,
    clearError,
  }
})

function mapFirebaseError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'Diese E-Mail wird bereits verwendet.',
    'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
    'auth/weak-password': 'Passwort muss mindestens 6 Zeichen lang sein.',
    'auth/user-not-found': 'Kein Account mit dieser E-Mail gefunden.',
    'auth/wrong-password': 'Falsches Passwort.',
    'auth/invalid-credential': 'E-Mail oder Passwort falsch.',
    'auth/too-many-requests': 'Zu viele Versuche. Bitte warte kurz.',
    'auth/network-request-failed': 'Netzwerkfehler. Bist du online?',
  }
  return map[code] || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
}
