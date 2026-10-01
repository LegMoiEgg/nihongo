<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'
import {
  SHOP_ITEMS,
  CATEGORY_LABELS,
  STREAK_FREEZE_ID,
  MAX_STREAK_FREEZES,
  rotatedItems,
  type ShopItem,
  type ShopCategory,
} from '../data/shop'
import { applyCosmetics, frameStyle } from '../composables/useCosmetics'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

// Today's date (Berlin-ish via local date is fine for a daily rotation) and a
// per-user key so each user sees their own stable daily selection.
const todayStr = new Date().toISOString().split('T')[0]
const userKey = computed(() => authStore.uid || 'guest')

const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2200)
}

const CATEGORY_ORDER: ShopCategory[] = ['accent', 'theme', 'frame', 'utility']

const groupedItems = computed(() =>
  CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    // Cosmetic categories rotate daily (up to 3 per day, per user). Utility
    // (Streak-Freeze) is always fully available.
    items: cat === 'utility'
      ? SHOP_ITEMS.filter(i => i.category === 'utility')
      : rotatedItems(cat, todayStr, userKey.value),
  })),
)

const freezeAtMax = computed(() => userStore.streakFreezes >= MAX_STREAK_FREEZES)

function isConsumable(item: ShopItem): boolean {
  return item.category === 'utility'
}

function owned(item: ShopItem): boolean {
  return userStore.owns(item.id)
}

function equipped(item: ShopItem): boolean {
  if (item.category === 'accent') return userStore.equippedAccent === item.id
  if (item.category === 'theme') return userStore.equippedTheme === item.id
  if (item.category === 'frame') return userStore.equippedFrame === item.id
  return false
}

function canAfford(item: ShopItem): boolean {
  return userStore.coins >= item.price
}

function buy(item: ShopItem) {
  const consumable = isConsumable(item)
  if (consumable && freezeAtMax.value) {
    showToast(`Maximal ${MAX_STREAK_FREEZES} Streak-Freezes.`)
    return
  }
  const ok = userStore.buyItem(item.id, item.price, consumable)
  if (!ok) {
    showToast(canAfford(item) ? 'Schon gekauft.' : 'Nicht genug Münzen.')
    return
  }
  if (consumable) {
    showToast(`${item.name} gekauft 🧊 (${userStore.streakFreezes}x)`)
  } else {
    showToast(`${item.name} gekauft!`)
  }
}

function toggleEquip(item: ShopItem) {
  if (item.category === 'utility') return
  const cat = item.category as 'accent' | 'theme' | 'frame'
  // Clicking an equipped item unequips it (back to default).
  userStore.equipCosmetic(cat, equipped(item) ? '' : item.id)
  applyCosmetics()
  showToast(equipped(item) ? `${item.name} ausgerüstet` : `${item.name} abgelegt`)
}

const freezeCount = computed(() => userStore.streakFreezes)
</script>

<template>
  <div class="shop-view">
    <header class="shop-header">
      <button class="btn-ghost back-btn" aria-label="Zurück" @click="router.back()">←</button>
      <h1>Shop</h1>
      <div class="coin-pill">
        <span class="coin-emoji">🪙</span>
        <span>{{ userStore.coins }}</span>
      </div>
    </header>

    <p class="shop-intro">
      Erreiche jeden Tag dein XP-Ziel, um Münzen aus der Kiste zu bekommen.
      Dein Streak gibt dir pro Tag extra Münzen obendrauf.
    </p>

    <section v-for="group in groupedItems" :key="group.category" class="shop-section">
      <h2 class="section-title">{{ group.label }}</h2>

      <!-- Streak-freeze count hint -->
      <p v-if="group.category === 'utility'" class="freeze-hint">
        Du hast aktuell <strong>{{ freezeCount }}</strong> / {{ MAX_STREAK_FREEZES }} Streak-Freeze{{ freezeCount === 1 ? '' : 's' }}.
      </p>
      <!-- Daily rotation hint for cosmetic categories -->
      <p v-else class="rotation-hint">Täglich wechselndes Angebot 🔄</p>

      <div class="item-grid">
        <div
          v-for="item in group.items"
          :key="item.id"
          class="item-card card"
          :class="{ equipped: equipped(item) }"
        >
          <!-- Preview -->
          <div class="item-preview">
            <!-- Frame preview: ring around a dummy avatar -->
            <span
              v-if="item.category === 'frame'"
              class="frame-preview"
              :style="frameStyle(item.id) || {}"
            >
              <span class="frame-inner">{{ item.icon }}</span>
            </span>
            <!-- Accent preview: color swatch -->
            <span
              v-else-if="item.category === 'accent'"
              class="accent-swatch"
              :style="{ background: item.accent }"
            >{{ item.icon }}</span>
            <!-- Theme / utility: emoji -->
            <span v-else class="item-emoji">{{ item.icon }}</span>
          </div>

          <div class="item-body">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-desc">{{ item.description }}</p>
          </div>

          <!-- Actions -->
          <div class="item-actions">
            <!-- Consumable: buyable until the max is reached -->
            <template v-if="item.id === STREAK_FREEZE_ID">
              <button
                class="btn btn-primary buy-btn"
                :disabled="!canAfford(item) || freezeAtMax"
                @click="buy(item)"
              >
                <template v-if="freezeAtMax">Max. erreicht ({{ MAX_STREAK_FREEZES }}/{{ MAX_STREAK_FREEZES }})</template>
                <template v-else>🪙 {{ item.price }}</template>
              </button>
            </template>

            <!-- Cosmetic owned: equip / unequip toggle -->
            <template v-else-if="owned(item)">
              <button
                class="btn equip-btn"
                :class="equipped(item) ? 'btn-ghost' : 'btn-primary'"
                @click="toggleEquip(item)"
              >
                {{ equipped(item) ? 'Ausgerüstet ✓' : 'Ausrüsten' }}
              </button>
            </template>

            <!-- Cosmetic not owned: buy -->
            <template v-else>
              <button
                class="btn btn-primary buy-btn"
                :disabled="!canAfford(item)"
                @click="buy(item)"
              >
                🪙 {{ item.price }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </section>

    <div class="bottom-spacer" />

    <transition name="fade">
      <div v-if="toast" class="shop-toast">{{ toast }}</div>
    </transition>
  </div>
</template>

<style scoped>
.shop-view {
  padding: var(--content-padding);
  max-width: 640px;
  margin: 0 auto;
}

.shop-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.shop-header h1 {
  font-size: 1.4rem;
  flex: 1;
}

.back-btn {
  font-size: 1.4rem;
  line-height: 1;
  padding: 4px 10px;
}

.coin-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--accent-gold);
  border-radius: 999px;
  padding: 6px 14px;
  font-weight: 800;
  color: var(--accent-gold);
}

.coin-emoji {
  font-size: 1.1rem;
}

.shop-intro {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.5;
}

.shop-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.freeze-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.rotation-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.item-grid {
  display: grid;
  /* Fixed 3 columns per category (as requested) — never 2+1. */
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

.item-body {
  flex: 1;
}

.item-name {
  font-weight: 700;
  font-size: 0.95rem;
}

.item-desc {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.35;
}

.item-actions {
  width: 100%;
}

.buy-btn,
.equip-btn {
  width: 100%;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 700;
}

.buy-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.bottom-spacer {
  height: 20px;
}

.shop-toast {
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
