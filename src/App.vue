<script setup lang="ts">
import BottomNav from './components/BottomNav.vue'
import { useUserStore } from './stores/user'
import { useBadgesStore } from './stores/badges'

const userStore = useUserStore()
const badgesStore = useBadgesStore()

// Initialize on app start
userStore.initializeUser()
badgesStore.initialize()
badgesStore.checkAllBadges()
</script>

<template>
  <div class="app-container">
    <main class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <BottomNav />
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
