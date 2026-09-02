<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import { useBadgesStore } from './stores/badges'
import { loadFromCloud, registerFlushOnHide, resolveAuthSettled } from './stores/sync'
import { useNotificationsStore } from './stores/notifications'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

const userStore = useUserStore()
const authStore = useAuthStore()
const badgesStore = useBadgesStore()
const notifStore = useNotificationsStore()
const router = useRouter()

// Initialize on app start
userStore.initializeUser()
badgesStore.initialize()
badgesStore.checkAllBadges()
notifStore.initialize()

// Wait for Firebase to restore the auth session, then load cloud data BEFORE
// the router decides onboarding vs. home. This prevents a returning user from
// being sent to onboarding just because localStorage was empty after a reload.
;(async () => {
  await authStore.initAuth() // resolves once onAuthStateChanged first fires
  if (authStore.isLoggedIn) {
    notifStore.syncTokenIfEnabled()
    const isReturningUser = await loadFromCloud()
    if (isReturningUser) {
      const currentRoute = router.currentRoute.value.name
      if (currentRoute === 'onboarding') {
        router.replace('/')
      }
    }
  }
  // Unblock the router guard now that auth + initial load are done.
  resolveAuthSettled()
})()

// Flush pending saves to Firestore when the app is hidden, so the
// server-side streak-reminder Cloud Function reads fresh dailyLog data.
registerFlushOnHide()

// Check for remote reset trigger from Firestore
async function checkRemoteReset() {
  try {
    const snap = await getDoc(doc(db, 'config', 'app'))
    if (!snap.exists()) return
    const remoteVersion = snap.data().resetVersion || 0
    const localVersion = parseInt(localStorage.getItem('nihongo_reset_version') || '0')
    if (remoteVersion > localVersion) {
      // Remote reset triggered — clear everything and reload
      const newVersion = remoteVersion.toString()
      localStorage.clear()
      localStorage.setItem('nihongo_reset_version', newVersion)
      window.location.href = '/'
    }
  } catch {
    // Firestore not reachable (offline) — skip check
  }
}
checkRemoteReset()

// Handle login/logout that happens DURING the session (after initial load),
// e.g. logging in from the onboarding screen. The initial restore is handled
// by the IIFE above.
let initialAuthHandled = false
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  // Skip the very first fire — the IIFE already handled the initial state.
  if (!initialAuthHandled) { initialAuthHandled = true; return }
  if (loggedIn) {
    notifStore.syncTokenIfEnabled()
    const isReturningUser = await loadFromCloud()
    if (isReturningUser) {
      const currentRoute = router.currentRoute.value.name
      if (currentRoute === 'onboarding') {
        router.replace('/')
      }
    }
  }
})
</script>

<template>
  <div class="app-container">
    <main class="app-content" :class="{ 'no-nav': $route.name === 'onboarding' || $route.name === 'placement' }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <BottomNav v-if="$route.name !== 'onboarding' && $route.name !== 'placement'" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.app-content {
  flex: 1;
  padding-bottom: var(--nav-height);
  overflow-y: auto;
}

.app-content.no-nav {
  padding-bottom: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
