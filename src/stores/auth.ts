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
