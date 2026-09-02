/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAdhVCaOXIHKIGHBgp3RNS9iLwL0YAfkmw',
  authDomain: 'nihongo-5d259.firebaseapp.com',
  projectId: 'nihongo-5d259',
  storageBucket: 'nihongo-5d259.firebasestorage.app',
  messagingSenderId: '967576095197',
  appId: '1:967576095197:web:2923ab67cff0fbabca0e34',
})

const messaging = firebase.messaging()

// Background message handler. The Cloud Functions now send DATA-ONLY messages
// (no top-level `notification` / `webpush.notification`), so the browser does
// NOT auto-display anything — this handler is the single place that shows the
// notification. That guarantees exactly one notification and reliable delivery
// on Android/Chrome when the app is closed or backgrounded.
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {}
  const title = data.title || 'NihonGo'
  const body = data.body || ''
  const link = data.link || 'https://nihongo-learn-gg.vercel.app'

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: data.tag || 'nihongo',
    data: { link },
    requireInteraction: true,
  })
})

// Handle notification clicks — open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = event.notification.data?.link
    || event.notification.data?.FCM_MSG?.notification?.click_action
    || 'https://nihongo-learn-gg.vercel.app'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus an already-open window if there is one
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      // Otherwise open a new window
      if (clients.openWindow) return clients.openWindow(urlToOpen)
    })
  )
})
