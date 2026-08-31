import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyAdhVCaOXIHKIGHBgp3RNS9iLwL0YAfkmw',
  authDomain: 'nihongo-5d259.firebaseapp.com',
  projectId: 'nihongo-5d259',
  storageBucket: 'nihongo-5d259.firebasestorage.app',
  messagingSenderId: '967576095197',
  appId: '1:967576095197:web:2923ab67cff0fbabca0e34',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Messaging is only available in secure contexts with service worker support
export const VAPID_KEY = 'BBtrzWz3pgKAR-cZMl36CTTerpsa859QUNCptbTLrY6wW1OeBzyt0XGbJu1pmoKD3sppDa2w7Yu5N94h783AiuY'

let messagingInstance: Awaited<ReturnType<typeof getMessaging>> | null = null

export async function getMessagingInstance() {
  if (messagingInstance) return messagingInstance
  const supported = await isSupported()
  if (supported) {
    messagingInstance = getMessaging(app)
    return messagingInstance
  }
  return null
}
