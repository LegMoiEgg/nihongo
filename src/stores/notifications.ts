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

    // If already granted, get token
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

  return {
    permission,
    token,
    supported,
    lastNotification,
    isEnabled,
    canAsk,
    initialize,
    requestPermission,
  }
})
