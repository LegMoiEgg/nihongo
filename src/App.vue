<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import { useBadgesStore } from './stores/badges'
import { loadFromCloud, registerFlushOnHide } from './stores/sync'
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
authStore.initAuth()
badgesStore.initialize()
badgesStore.checkAllBadges()
notifStore.initialize()

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

// When user logs in/out, sync with cloud
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    // Ensure the FCM token is written now that we have a uid (fixes the
    // race where notifications were enabled before login completed).
    notifStore.syncTokenIfEnabled()
    const isReturningUser = await loadFromCloud()
    // Only a RETURNING user (with existing cloud progress) gets sent straight
    // to the home screen. A newly registered account stays in the onboarding
    // flow — and we never interrupt an in-progress placement test.
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
