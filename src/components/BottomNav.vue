<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const userStore = useUserStore()

const navItems = [
  { path: '/', label: 'Home', icon: '🏠', name: 'dashboard' },
  { path: '/learn', label: 'Lernen', icon: '📚', name: 'learn' },
  { path: '/social', label: 'Social', icon: '👥', name: 'social' },
  { path: '/test', label: 'Test', icon: '📝', name: 'test' },
  { path: '/profile', label: 'Profil', icon: '', name: 'profile' },
]

function isActive(item: typeof navItems[0]): boolean {
  if (item.name === 'learn') {
    return route.path.startsWith('/learn')
  }
  return route.name === item.name
}
</script>

<template>
  <nav class="bottom-nav" role="navigation" aria-label="Hauptnavigation">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item) }"
      :aria-label="item.label"
      :aria-current="isActive(item) ? 'page' : undefined"
    >
      <!-- Profile tab: show avatar or placeholder -->
      <template v-if="item.name === 'profile'">
        <span class="nav-icon nav-avatar-wrap">
          <img
            v-if="userStore.avatarDataUrl"
            :src="userStore.avatarDataUrl"
            alt=""
            class="nav-avatar-img"
            :class="{ 'avatar-active': isActive(item) }"
          />
          <svg v-else viewBox="0 0 24 24" fill="none" class="nav-avatar-placeholder" :class="{ 'avatar-active': isActive(item) }">
            <circle cx="12" cy="8" r="4" fill="currentColor"/>
            <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" fill="currentColor"/>
          </svg>
        </span>
      </template>
      <!-- Normal tabs -->
      <template v-else>
        <span class="nav-icon">{{ item.icon }}</span>
      </template>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--bg-secondary);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--text-muted);
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
  min-width: 56px;
}

.nav-item.active {
  color: var(--accent-primary);
}

.nav-item:hover {
  color: var(--text-primary);
}

.nav-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.nav-label {
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* Profile avatar in nav */
.nav-avatar-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
}

.nav-avatar-img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-accent);
  transition: border-color var(--transition-fast);
}

.nav-avatar-img.avatar-active {
  border-color: var(--accent-primary);
}

.nav-avatar-placeholder {
  width: 26px;
  height: 26px;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.nav-avatar-placeholder.avatar-active {
  color: var(--accent-primary);
}
</style>
