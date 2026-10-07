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
import { applyCosmetics, frameStyle, frameRowStyle } from '../composables/useCosmetics'

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

// ── Preview popup ──
// Tapping an item opens a preview showing how the cosmetic looks in use.
const previewItem = ref<ShopItem | null>(null)
function openPreview(item: ShopItem) {
  previewItem.value = item
}
function closePreview() {
  previewItem.value = null
}

/** CSS variable overrides (+ themed background) for a theme/accent mock. */
function previewVars(item: ShopItem): Record<string, string> {
  if (item.category === 'theme' && item.theme) {
    const vars: Record<string, string> = { ...item.theme }
    // Show the rich layered backdrop (gradients + faint emoji) in the mock.
    if (item.themeBackground) vars.background = item.themeBackground
    return vars
  }
  if (item.category === 'accent' && item.accent) {
    return {
      '--accent-primary': item.accent,
      '--gradient-primary': `linear-gradient(135deg, ${item.accent}, ${item.accent})`,
    }
  }
  return {}
}

// ── Event codes ──
const codeInput = ref('')
function redeemCode() {
  const typed = codeInput.value.trim()
  if (!typed) return
  const res = userStore.redeemEventCode(typed)
  if (res.ok) {
    showToast(`${res.label}: +${res.reward} 🪙`)
    codeInput.value = ''
  } else {
    const msg: Record<string, string> = {
      unknown: 'Code ungültig.',
      expired: 'Dieser Code ist abgelaufen.',
      'not-yet': 'Dieser Code ist noch nicht aktiv.',
      already: 'Code bereits eingelöst.',
    }
    showToast(msg[res.reason] ?? 'Code ungültig.')
  }
}

/** Buy from inside the preview, then keep the popup open to show the result. */
function buyFromPreview(item: ShopItem) {
  buy(item)
}
function equipFromPreview(item: ShopItem) {
  toggleEquip(item)
}
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
        <button
          v-for="item in group.items"
          :key="item.id"
          class="item-card card"
          :class="{ equipped: equipped(item) }"
          @click="openPreview(item)"
        >
          <!-- Preview thumbnail -->
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

          <div class="item-body">
            <p class="item-name">{{ item.name }}</p>
          </div>

          <!-- Status line: owned/equipped or price -->
          <span class="item-status">
            <template v-if="equipped(item)">Ausgerüstet ✓</template>
            <template v-else-if="owned(item)">Besitzt</template>
            <template v-else>🪙 {{ item.price }}</template>
          </span>
        </button>
      </div>
    </section>

    <!-- ══════════ Event code redemption ══════════ -->
    <section class="code-section">
      <h2 class="section-title">Code einlösen</h2>
      <p class="code-hint">Hast du einen Aktionscode? Gib ihn hier ein.</p>
      <form class="code-form" @submit.prevent="redeemCode">
        <input
          v-model="codeInput"
          class="code-input"
          type="text"
          placeholder="z. B. NihonGo"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          aria-label="Aktionscode"
        />
        <button class="btn btn-primary code-btn" type="submit" :disabled="!codeInput.trim()">
          Einlösen
        </button>
      </form>
    </section>

    <div class="bottom-spacer" />

    <!-- ══════════ Preview popup ══════════ -->
    <transition name="fade">
      <div v-if="previewItem" class="preview-overlay" @click.self="closePreview">
        <div class="preview-card card">
          <button class="preview-close" aria-label="Schließen" @click="closePreview">✕</button>
          <h3 class="preview-title">{{ previewItem.name }}</h3>
          <p class="preview-desc">{{ previewItem.description }}</p>

          <!-- Theme / Accent: mini mock of the app look in use -->
          <div
            v-if="previewItem.category === 'theme' || previewItem.category === 'accent'"
            class="theme-mock"
            :style="previewVars(previewItem)"
          >
            <div class="mock-topbar">
              <span class="mock-dot" />
              <span class="mock-title">NihonGo</span>
            </div>
            <p class="mock-text">So sieht die App mit diesem Design aus.</p>
            <div class="mock-xpbar"><span class="mock-xpfill" /></div>
            <button class="mock-btn" type="button">Beispiel-Button</button>
          </div>

          <!-- Frame: a whole example row as it appears in the Social tab -->
          <div v-else-if="previewItem.category === 'frame'" class="frame-mock-wrap">
            <p class="frame-mock-hint">So sieht deine Zeile im Social-Tab aus:</p>
            <div class="frame-mock-row" :style="frameRowStyle(previewItem.id) || {}">
              <span class="frame-mock-rank">4</span>
              <span class="frame-mock-avatar">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="currentColor"/>
                  <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" fill="currentColor"/>
                </svg>
              </span>
              <div class="frame-mock-info">
                <span class="frame-mock-name">Du</span>
                <span class="frame-mock-meta">Lv. {{ userStore.currentLevel.level }} · 🔥 {{ userStore.currentStreak }}</span>
              </div>
              <span class="frame-mock-xp">{{ userStore.totalXp }} XP</span>
            </div>
          </div>

          <!-- Utility (Streak-Freeze): just the icon -->
          <div v-else class="util-mock">
            <span class="util-mock-icon">{{ previewItem.icon }}</span>
          </div>

          <!-- Action -->
          <div class="preview-action">
            <template v-if="previewItem.id === STREAK_FREEZE_ID">
              <button
                class="btn btn-primary preview-btn"
                :disabled="!canAfford(previewItem) || freezeAtMax"
                @click="buyFromPreview(previewItem)"
              >
                <template v-if="freezeAtMax">Max. erreicht ({{ MAX_STREAK_FREEZES }}/{{ MAX_STREAK_FREEZES }})</template>
                <template v-else>Kaufen · 🪙 {{ previewItem.price }}</template>
              </button>
            </template>
            <template v-else-if="owned(previewItem)">
              <button
                class="btn preview-btn"
                :class="equipped(previewItem) ? 'btn-ghost' : 'btn-primary'"
                @click="equipFromPreview(previewItem)"
              >
                {{ equipped(previewItem) ? 'Ablegen' : 'Ausrüsten' }}
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn-primary preview-btn"
                :disabled="!canAfford(previewItem)"
                @click="buyFromPreview(previewItem)"
              >
                Kaufen · 🪙 {{ previewItem.price }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </transition>

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
  /* Each category scrolls horizontally on its own — items keep a uniform size
     and never wrap, so the whole page never becomes horizontally scrollable.
     Vertical padding keeps the card border + shadow from being clipped. */
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 2px 10px;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

/* Slim, unobtrusive horizontal scrollbar. */
.item-grid::-webkit-scrollbar {
  height: 6px;
}
.item-grid::-webkit-scrollbar-thumb {
  background: var(--bg-accent);
  border-radius: 999px;
}

.item-card {
  /* Fixed, uniform size for every item regardless of category. */
  flex: 0 0 130px;
  width: 130px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px;
  text-align: center;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
  border: 2px solid transparent;
  scroll-snap-align: start;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.item-card:active {
  transform: scale(0.97);
}

.item-card.equipped {
  border-color: var(--accent-primary);
}

.item-status {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin-top: auto;
}

.item-card.equipped .item-status {
  color: var(--accent-primary);
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

/* ── Event code ── */
.code-section {
  margin-top: 8px;
  margin-bottom: 20px;
}

.code-hint {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.code-form {
  display: flex;
  gap: 10px;
}

.code-input {
  flex: 1;
  min-width: 0;
  background: var(--bg-card);
  border: 1px solid var(--bg-accent);
  border-radius: var(--radius-sm);
  padding: 11px 14px;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.code-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.code-btn {
  padding: 11px 18px;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.code-btn:disabled {
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

/* ══════════ Preview popup ══════════ */
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
  backdrop-filter: blur(2px);
}

.preview-card {
  position: relative;
  max-width: 340px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  text-align: center;
}

.preview-close {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
  line-height: 1;
}

.preview-title {
  font-size: 1.2rem;
  font-weight: 700;
}

.preview-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* ── Theme / accent mock ── */
.theme-mock {
  width: 100%;
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--bg-accent);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.mock-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mock-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-primary);
  flex-shrink: 0;
}

.mock-title {
  font-weight: 800;
  color: var(--text-primary);
}

.mock-text {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.mock-xpbar {
  height: 10px;
  border-radius: 999px;
  background: var(--bg-accent);
  overflow: hidden;
}

.mock-xpfill {
  display: block;
  width: 65%;
  height: 100%;
  background: var(--gradient-primary);
}

.mock-btn {
  align-self: flex-start;
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: default;
}

/* ── Frame mock (whole Social-tab row) ── */
.frame-mock-wrap {
  width: 100%;
}

.frame-mock-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-align: left;
}

.frame-mock-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 12px;
}

.frame-mock-rank {
  width: 24px;
  text-align: center;
  font-weight: 700;
  color: var(--text-muted);
  flex-shrink: 0;
}

.frame-mock-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.frame-mock-avatar svg {
  width: 26px;
  height: 26px;
}

.frame-mock-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.frame-mock-name {
  font-weight: 700;
}

.frame-mock-meta {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.frame-mock-xp {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent-primary);
}

/* ── Utility mock ── */
.util-mock-icon {
  font-size: 3.4rem;
  line-height: 1;
}

.preview-action {
  width: 100%;
  margin-top: 4px;
}

.preview-btn {
  width: 100%;
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 700;
}

.preview-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
