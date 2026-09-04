import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, onMessage, deleteToken } from 'firebase/messaging'
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
        // Messages are now data-only, so read title/body from payload.data
        // (fall back to notification.* for older cached payloads).
        const title = payload.data?.title || payload.notification?.title || 'NihonGo'
        const body = payload.data?.body || payload.notification?.body || ''
        lastNotification.value = { title, body }
        // Show as browser notification even in foreground
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
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

      // Register the firebase messaging service worker AND wait until it is
      // active. Calling getToken() before the SW is ready is the most common
      // silent failure on other devices (getToken rejects/returns empty and
      // the error is only logged). Waiting for `ready` makes token retrieval
      // reliable across devices, not just the dev's own.
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      await navigator.serviceWorker.ready

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
    // Read the LIVE permission (not the cached ref, which may not be set yet
    // due to init ordering) so the token is written reliably on login.
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return
    permission.value = 'granted'
    await fetchToken() // re-fetches and saves the token to Firestore
  }

  /**
   * Force-refresh the FCM token and write it to Firestore. Returns a status
   * string (with the token tail) so the user can confirm on-device that a
   * valid token was stored — used to diagnose the "nudge doesn't arrive" case.
   */
  async function refreshTokenWithStatus(): Promise<string> {
    if (Notification.permission !== 'granted') {
      return '❌ Benachrichtigungen nicht erlaubt'
    }
    try {
      const messaging = await getMessagingInstance()
      if (!messaging) return '❌ Messaging nicht verfügbar'
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      })
      if (!fcmToken) return '❌ Kein Token erhalten (Play Services / Berechtigung?)'
      token.value = fcmToken
      await saveTokenToFirestore(fcmToken)
      return `✅ Token gespeichert (…${fcmToken.slice(-8)})`
    } catch (e: any) {
      console.error('refreshToken failed:', e)
      return `❌ Fehler: ${e?.message || e}`
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

  /**
   * On logout: remove the FCM token from THIS account's Firestore doc and
   * delete the local token. On a shared device (multiple test accounts, or a
   * family device) FCM hands out the SAME token to the next account that
   * requests one. Without clearing it, two accounts end up with the same
   * token — FCM binds a token to one instance, so nudges to the "other"
   * account silently fail to arrive. Clearing on logout guarantees the next
   * login writes a fresh token bound to that account.
   */
  async function clearTokenOnLogout(uid: string) {
    try {
      await setDoc(
        doc(db, 'users', uid),
        { fcmToken: null, fcmTokenUpdatedAt: new Date().toISOString() },
        { merge: true }
      )
    } catch (e) {
      console.error('Failed to clear FCM token in Firestore:', e)
    }
    try {
      const messaging = await getMessagingInstance()
      if (messaging) await deleteToken(messaging)
    } catch {
      // deleteToken can throw if none exists — safe to ignore.
    }
    token.value = null
  }

  /**
   * Fire a LOCAL test notification via the service worker — no Cloud Function,
   * no FCM token involved. Used to verify that the device can display
   * notifications at all. Returns a short status string for the UI.
   */
  async function sendTestNotification(): Promise<string> {
    // Report the exact state so we can diagnose why nothing shows up.
    if (typeof Notification === 'undefined') {
      return '❌ Dieser Browser unterstützt keine Notifications'
    }

    const perm = Notification.permission // read live, not cached
    if (perm !== 'granted') {
      return `❌ Berechtigung: "${perm}" (nicht erlaubt). In den Chrome-Website-Einstellungen freigeben.`
    }

    if (!('serviceWorker' in navigator)) {
      return '❌ Kein Service Worker verfügbar'
    }

    try {
      const reg =
        (await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')) ||
        (await navigator.serviceWorker.getRegistration()) ||
        (await navigator.serviceWorker.ready)

      if (!reg) {
        return '❌ Service Worker nicht registriert'
      }

      await reg.showNotification('NihonGo — Test 🔔', {
        body: 'Wenn du das siehst, funktionieren Benachrichtigungen!',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'test',
        requireInteraction: true, // stays until dismissed (helps on Android)
      })

      // Verify the notification actually got created
      const active = await reg.getNotifications({ tag: 'test' })
      if (active.length === 0) {
        return '⚠️ showNotification lief, aber das System zeigt nichts an → Android blockt die Anzeige (Systemeinstellungen prüfen)'
      }
      return '✅ Gesendet — wenn nichts erscheint, blockt Android die Anzeige'
    } catch (e: any) {
      console.error('Test notification failed:', e)
      return `❌ Fehler: ${e?.message || e}`
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
    clearTokenOnLogout,
    sendTestNotification,
    refreshTokenWithStatus,
  }
})
