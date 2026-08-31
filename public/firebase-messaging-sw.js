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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'NihonGo'
  const options = {
    body: payload.notification?.body || 'Zeit zum Lernen!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
  }
  self.registration.showNotification(title, options)
})
