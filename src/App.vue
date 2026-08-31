<script setup lang="ts">
import { watch } from 'vue'
import BottomNav from './components/BottomNav.vue'
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import { useBadgesStore } from './stores/badges'
import { loadFromCloud, saveToCloud } from './stores/sync'
import { useNotificationsStore } from './stores/notifications'

const userStore = useUserStore()
const authStore = useAuthStore()
const badgesStore = useBadgesStore()
const notifStore = useNotificationsStore()

// Initialize on app start
userStore.initializeUser()
authStore.initAuth()
badgesStore.initialize()
badgesStore.checkAllBadges()
notifStore.initialize()

// When user logs in/out, sync with cloud
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    await loadFromCloud()
  }
})
</script>

<template>
  <div class="app-container">
    <main class="app-content" :class="{ 'no-nav': $route.name === 'onboarding' }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <BottomNav v-if="$route.name !== 'onboarding'" />
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
