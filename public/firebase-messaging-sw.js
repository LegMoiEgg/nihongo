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

firebase.messaging()

// NOTE: We intentionally do NOT implement onBackgroundMessage here.
// The Cloud Function sends a `webpush.notification` payload, which the
// browser displays automatically. Adding onBackgroundMessage would show
// a SECOND notification (the duplicate the tester saw).

// Handle notification clicks — open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = event.notification.data?.FCM_MSG?.notification?.click_action
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
