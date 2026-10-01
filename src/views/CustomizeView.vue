<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  SHOP_ITEMS,
  CATEGORY_LABELS,
  type ShopItem,
} from '../data/shop'
import { applyCosmetics, frameStyle } from '../composables/useCosmetics'

const router = useRouter()
const userStore = useUserStore()

const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2000)
}

// Only cosmetic categories can be customized (utility items aren't equippable).
const CUSTOMIZE_ORDER = ['accent', 'theme', 'frame'] as const

const groups = computed(() =>
  CUSTOMIZE_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: SHOP_ITEMS.filter(i => i.category === cat && userStore.owns(i.id)),
  })),
)

const hasAnything = computed(() => groups.value.some(g => g.items.length > 0))

function equipped(item: ShopItem): boolean {
  if (item.category === 'accent') return userStore.equippedAccent === item.id
  if (item.category === 'theme') return userStore.equippedTheme === item.id
  if (item.category === 'frame') return userStore.equippedFrame === item.id
  return false
}

function toggleEquip(item: ShopItem) {
  const cat = item.category as 'accent' | 'theme' | 'frame'
  const wasEquipped = equipped(item)
  userStore.equipCosmetic(cat, wasEquipped ? '' : item.id)
  applyCosmetics()
  showToast(wasEquipped ? `${item.name} abgelegt` : `${item.name} ausgerüstet`)
}
</script>

<template>
  <div class="customize-view">
    <header class="customize-header">
      <button class="btn-ghost back-btn" aria-label="Zurück" @click="router.back()">←</button>
      <h1>Anpassen</h1>
    </header>

    <p class="customize-intro">
      Rüste deine freigeschalteten Gegenstände aus. Mehr gibt es im Shop.
    </p>

    <!-- Empty state -->
    <div v-if="!hasAnything" class="empty-state card">
      <span class="empty-icon">🎨</span>
      <p>Du hast noch nichts freigeschaltet.</p>
      <router-link to="/shop" class="btn btn-primary">Zum Shop</router-link>
    </div>

    <template v-else>
      <section v-for="group in groups" :key="group.category" class="customize-section">
        <h2 class="section-title">{{ group.label }}</h2>

        <p v-if="group.items.length === 0" class="empty-cat">
          Noch nichts freigeschaltet.
        </p>

        <div v-else class="item-grid">
          <div
            v-for="item in group.items"
            :key="item.id"
            class="item-card card"
            :class="{ equipped: equipped(item) }"
            @click="toggleEquip(item)"
          >
            <div class="item-preview">
              <span
                v-if="item.category === 'frame'"
                class="frame-preview"
                :style="frameStyle(item.id) || {}"
              >
                <span class="frame-inner">{{ item.icon }}</span>
              </span>
              <span
                v-else-if="item.category === 'accent'"
                class="accent-swatch"
                :style="{ background: item.accent }"
              >{{ item.icon }}</span>
              <span v-else class="item-emoji">{{ item.icon }}</span>
            </div>

            <p class="item-name">{{ item.name }}</p>
            <span class="equip-state" :class="{ on: equipped(item) }">
              {{ equipped(item) ? 'Ausgerüstet ✓' : 'Antippen' }}
            </span>
          </div>
        </div>
      </section>
    </template>

    <div class="bottom-spacer" />

    <transition name="fade">
      <div v-if="toast" class="customize-toast">{{ toast }}</div>
    </transition>
  </div>
</template>

<style scoped>
.customize-view {
  padding: var(--content-padding);
  max-width: 640px;
  margin: 0 auto;
}

.customize-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.customize-header h1 {
  font-size: 1.4rem;
}

.back-btn {
  font-size: 1.4rem;
  line-height: 1;
  padding: 4px 10px;
}

.customize-intro {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.5;
}

.empty-state {
  text-align: center;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 2.6rem;
}

.customize-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.empty-cat {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: border-color var(--transition-fast);
  border: 2px solid transparent;
}

.item-card.equipped {
  border-color: var(--accent-primary);
}

.item-preview {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-emoji {
  font-size: 2.6rem;
  line-height: 1;
}

.accent-swatch {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: var(--shadow-card);
}

.frame-preview {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
}

.frame-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.item-name {
  font-weight: 700;
  font-size: 0.9rem;
}

.equip-state {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.equip-state.on {
  color: var(--accent-primary);
  font-weight: 700;
}

.bottom-spacer {
  height: 20px;
}

.customize-toast {
  position: fixed;
  bottom: calc(var(--nav-height) + 16px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--accent-primary);
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 0.88rem;
  font-weight: 600;
  z-index: 300;
  box-shadow: var(--shadow-elevated);
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
