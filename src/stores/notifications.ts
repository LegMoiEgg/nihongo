import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc } from 'firebase/firestore'
import { getMessagingInstance, VAPID_KEY } from '../firebase'
import { db } from '../firebase'
import { useAuthStore } from './auth'

export const useNotificationsStore = defineStore('notifications', () => {
  const permission = ref<NotificationPermission>('default')
  const token = ref<string | null>(null)
  const supported = ref(false)
  const lastNotification = ref<{ title: string; body: string } | null>(null)

  const isEnabled = computed(() => permission.value === 'granted' && !!token.value)
  const canAsk = computed(() => supported.value && permission.value !== 'denied')

  async function initialize() {
    // Check if browser supports notifications
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      supported.value = false
      return
    }
    supported.value = true
    permission.value = Notification.permission

    // If already granted, get token.
    // Streak reminders are handled server-side by a Cloud Function,
    // so no local timer is needed (avoids duplicate notifications).
    if (permission.value === 'granted') {
      await fetchToken()
    }

    // Listen for foreground messages
    const messaging = await getMessagingInstance()
    if (messaging) {
      onMessage(messaging, (payload) => {
        lastNotification.value = {
          title: payload.notification?.title || 'NihonGo',
          body: payload.notification?.body || '',
        }
        // Show as browser notification even in foreground
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'NihonGo', {
            body: payload.notification?.body || '',
            icon: '/favicon.svg',
          })
        }
      })
    }
  }

  async function requestPermission(): Promise<boolean> {
    if (!supported.value) return false

    try {
      const result = await Notification.requestPermission()
      permission.value = result

      if (result === 'granted') {
        await fetchToken()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function fetchToken() {
    try {
      const messaging = await getMessagingInstance()
      if (!messaging) return

      // Register the firebase messaging service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      })

      if (fcmToken) {
        token.value = fcmToken
        await saveTokenToFirestore(fcmToken)
      }
    } catch (e) {
      console.error('Failed to get FCM token:', e)
    }
  }

  /**
   * Ensure the FCM token is saved to Firestore for the current user.
   * Call this on login: if notifications were enabled before the user was
   * fully authenticated, the token may not have been written yet — this
   * fixes the "can't be nudged" case for freshly-registered users.
   */
  async function syncTokenIfEnabled() {
    if (permission.value !== 'granted') return
    await fetchToken() // re-fetches and saves the token to Firestore
  }

  async function saveTokenToFirestore(fcmToken: string) {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.uid) return

    try {
      await setDoc(
        doc(db, 'users', authStore.uid),
        { fcmToken, fcmTokenUpdatedAt: new Date().toISOString() },
        { merge: true }
      )
    } catch (e) {
      console.error('Failed to save FCM token:', e)
    }
  }

  /**
   * Fire a LOCAL test notification via the service worker — no Cloud Function,
   * no FCM token involved. Used to verify that the device can display
   * notifications at all. Returns a short status string for the UI.
   */
  async function sendTestNotification(): Promise<string> {
    if (typeof Notification === 'undefined') return 'Nicht unterstützt'
    if (permission.value !== 'granted') return 'Benachrichtigungen sind nicht erlaubt'
    try {
      const reg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
        || await navigator.serviceWorker.ready
      if (reg) {
        await reg.showNotification('NihonGo — Test', {
          body: 'Wenn du das siehst, funktionieren Benachrichtigungen! 🎉',
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: 'test',
        })
        return 'Test-Benachrichtigung gesendet'
      }
      // Fallback: direct Notification API
      new Notification('NihonGo — Test', {
        body: 'Wenn du das siehst, funktionieren Benachrichtigungen! 🎉',
      })
      return 'Test-Benachrichtigung gesendet'
    } catch (e) {
      console.error('Test notification failed:', e)
      return 'Fehler beim Senden der Test-Benachrichtigung'
    }
  }

  return {
    permission,
    token,
    supported,
    lastNotification,
    isEnabled,
    canAsk,
    initialize,
    requestPermission,
    syncTokenIfEnabled,
    sendTestNotification,
  }
})
