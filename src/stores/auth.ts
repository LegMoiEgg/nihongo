import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '../firebase'
import { useUserStore } from './user'

const googleProvider = new GoogleAuthProvider()

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
      // Adopt the entered name as the in-game username (if none set yet).
      if (name) applyDefaultUsername(name)
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

  async function loginWithGoogle() {
    error.value = ''
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      user.value = cred.user
      // Use the part before the @ of the Google email as the username
      // (if none set yet). Falls back to the Google display name.
      const emailLocal = cred.user.email ? cred.user.email.split('@')[0] : ''
      applyDefaultUsername(emailLocal || cred.user.displayName || '')
    } catch (e: any) {
      console.error('Google login error:', e.code, e.message)
      if (e.code === 'auth/popup-closed-by-user') return
      if (e.code === 'auth/cancelled-popup-request') return
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

  /**
   * Set the in-game username from a suggested value (registration name or
   * Google email local part), but only if the user hasn't set one yet — so
   * a returning user's chosen name is never overwritten.
   */
  function applyDefaultUsername(suggested: string) {
    const name = (suggested || '').trim()
    if (!name) return
    const userStore = useUserStore()
    if (!userStore.displayName) {
      userStore.setDisplayName(name.slice(0, 20))
    }
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
    loginWithGoogle,
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
    'auth/unauthorized-domain': 'Diese Domain ist nicht autorisiert. Füge sie in Firebase Console unter Authentication → Settings → Authorized domains hinzu.',
    'auth/popup-blocked': 'Popup wurde vom Browser blockiert. Erlaube Popups für diese Seite.',
    'auth/account-exists-with-different-credential': 'Ein Account mit dieser E-Mail existiert bereits mit einer anderen Anmeldemethode.',
  }
  return map[code] || `Ein Fehler ist aufgetreten (${code}). Bitte versuche es erneut.`
}
