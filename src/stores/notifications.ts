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

    // If already granted, get token and start reminder
    if (permission.value === 'granted') {
      await fetchToken()
      startStreakReminderTimer()
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
        startStreakReminderTimer()
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

  function startStreakReminder() {
    startStreakReminderTimer()
  }

  function stopStreakReminder() {
    stopStreakReminderTimer()
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
    startStreakReminder,
    stopStreakReminder,
  }
})

// ── Streak reminder: local notifications from 20:00–23:00 if daily goal not met ──
let reminderInterval: ReturnType<typeof setInterval> | null = null
let lastReminderHour = -1

function startStreakReminderTimer() {
  if (reminderInterval) return

  // Check immediately, then every 15 minutes
  checkAndRemind()
  reminderInterval = setInterval(checkAndRemind, 15 * 60 * 1000)
}

function stopStreakReminderTimer() {
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
  }
  lastReminderHour = -1
}

function checkAndRemind() {
  if (Notification.permission !== 'granted') return

  const now = new Date()
  const hour = now.getHours()

  // Only remind between 20:00 and 23:00 (4 hours before midnight)
  if (hour < 20 || hour > 23) {
    lastReminderHour = -1
    return
  }

  // Only one notification per hour
  if (hour === lastReminderHour) return

  // Check if daily goal is already met
  const today = now.toISOString().split('T')[0]
  const dailyLogRaw = localStorage.getItem('nihongo_daily_log')
  if (dailyLogRaw) {
    try {
      const log = JSON.parse(dailyLogRaw) as { date: string; xpEarned: number }[]
      const todayEntry = log.find(d => d.date === today)
      if (todayEntry && todayEntry.xpEarned >= 100) {
        // Goal already met, no reminder needed
        return
      }
    } catch { /* ignore parse errors */ }
  }

  // Send local notification
  lastReminderHour = hour
  const messages = [
    'Dein Streak wartet auf dich! 🔥',
    'Noch eine kurze Lektion? Du schaffst das! 💪',
    'Vergiss nicht deine tägliche Lektion! 📚',
    'Dein Japanisch wartet auf dich! 🇯🇵',
  ]
  const body = messages[Math.floor(Math.random() * messages.length)]

  new Notification('NihonGo', {
    body,
    icon: '/favicon.svg',
    tag: 'streak-reminder', // replaces previous reminder
  })
}
