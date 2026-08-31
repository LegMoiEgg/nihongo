<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: 'Home', icon: '🏠', name: 'dashboard' },
  { path: '/learn', label: 'Lernen', icon: '📚', name: 'learn' },
  { path: '/sentences', label: 'Sätze', icon: '🧩', name: 'sentences' },
  { path: '/test', label: 'Test', icon: '📝', name: 'test' },
  { path: '/progress', label: 'Stats', icon: '📊', name: 'progress' },
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
      <span class="nav-icon">{{ item.icon }}</span>
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
</style>
