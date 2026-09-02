<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/notifications'
import { useBadgesStore, ALL_BADGES, type BadgeDefinition } from '../stores/badges'
import { saveToCloud, scheduleSave, flushSave } from '../stores/sync'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData } from '../data/kanji'
import { vocabularyData } from '../data/vocabulary'

const userStore = useUserStore()
const learningStore = useLearningStore()
const authStore = useAuthStore()
const notifStore = useNotificationsStore()
const badgesStore = useBadgesStore()
learningStore.initialize()
badgesStore.initialize()

// Latest 3 earned badges (newest first)
const latestBadges = computed((): BadgeDefinition[] => {
  const sorted = [...badgesStore.earnedBadges]
    .sort((a, b) => b.earnedAt.localeCompare(a.earnedAt))
    .slice(0, 3)
  return sorted
    .map(eb => ALL_BADGES.find(b => b.id === eb.id))
    .filter((b): b is BadgeDefinition => !!b)
})

// ── Profile editing ──
const isEditingName = ref(false)
const nameInput = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

function startEditName() {
  nameInput.value = userStore.displayName
  isEditingName.value = true
}

async function saveName() {
  userStore.setDisplayName(nameInput.value)
  isEditingName.value = false
  await saveToCloud() // immediate sync, not debounced
}

function cancelEditName() {
  isEditingName.value = false
}

/**
 * Log out and fully reset the local state. All progress is saved to the
 * cloud first (so it isn't lost — it comes back on next login), then the
 * local progress is cleared so the next account starts fresh at onboarding.
 */
async function handleLogout() {
  // 1. Save current progress to the cloud so nothing is lost.
  try {
    await flushSave()
  } catch { /* offline — proceed with logout anyway */ }

  // 2. Sign out of Firebase.
  await authStore.logout()

  // 3. Clear all local progress so the next account doesn't inherit it.
  const keysToClear = [
    'nihongo_xp', 'nihongo_streak', 'nihongo_longest_streak', 'nihongo_last_active',
    'nihongo_daily_log', 'nihongo_words_total', 'nihongo_sessions_total',
    'nihongo_display_name', 'nihongo_avatar', 'nihongo_placement_level',
    'nihongo_card_progress', 'nihongo_badges', 'nihongo_nudged',
    'nihongo_onboarding_done', 'nihongo_placement_done', 'nihongo_open_group',
  ]
  for (const key of keysToClear) localStorage.removeItem(key)

  // 4. Hard reload to '/', re-initializing every store from clean storage.
  // The router guard then sends the fresh user to onboarding.
  window.location.href = '/'
}

const notifTestResult = ref('')
async function runNotifTest() {
  notifTestResult.value = 'Sende…'
  notifTestResult.value = await notifStore.sendTestNotification()
}

// ── Hidden dev tools (tap the "Entwickler" title 5x to reveal) ──
const showDev = ref(false)
const devTapCount = ref(0)
const devLevel = ref(28)
const devResult = ref('')

function devTap() {
  devTapCount.value++
  if (devTapCount.value >= 5) showDev.value = true
}

function setDevLevel() {
  const lvl = Math.min(60, Math.max(1, Math.floor(devLevel.value || 1)))
  userStore.setPlacementLevel(lvl)
  saveToCloud() // persist immediately
  devResult.value = `Level auf ${lvl} gesetzt.`
}

function triggerAvatarUpload() {
  fileInput.value?.click()
}

function onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Resize to max 200x200 and convert to data URL
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 200
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      // Center crop
      const minDim = Math.min(img.width, img.height)
      const sx = (img.width - minDim) / 2
      const sy = (img.height - minDim) / 2
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      userStore.setAvatar(dataUrl)
      saveToCloud() // immediate sync
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
  // Reset input so same file can be re-selected
  input.value = ''
}

// ── Stats ──
const categories = computed(() => [
  {
    id: 'hiragana', label: 'Hiragana', icon: 'あ',
    totalCards: hiraganaData.length,
    ...learningStore.getCategoryStats('hiragana'),
    color: '#e94560'
  },
  {
    id: 'katakana', label: 'Katakana', icon: 'ア',
    totalCards: katakanaData.length,
    ...learningStore.getCategoryStats('katakana'),
    color: '#533483'
  },
  {
    id: 'kanji', label: 'Kanji', icon: '漢',
    totalCards: kanjiData.length,
    ...learningStore.getCategoryStats('kanji'),
    color: '#0f3460'
  },
  {
    id: 'vocabulary', label: 'Vokabeln', icon: '📝',
    totalCards: vocabularyData.length,
    ...learningStore.getCategoryStats('vocabulary'),
    color: '#00c853'
  },
])

const totalMastered = computed(() =>
  categories.value.reduce((sum, c) => sum + c.mastered, 0)
)

const weeklyActivity = computed(() => {
  const days: { label: string; xp: number; date: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    const log = userStore.dailyLog.find(l => l.date === dateStr)
    days.push({
      label: dayNames[d.getDay()],
      xp: log?.xpEarned || 0,
      date: dateStr,
    })
  }
  return days
})

const maxWeeklyXp = computed(() =>
  Math.max(...weeklyActivity.value.map(d => d.xp), 1)
)
</script>

<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <section class="profile-header">
      <div class="avatar-wrapper" @click="triggerAvatarUpload">
        <img
          v-if="userStore.avatarDataUrl"
          :src="userStore.avatarDataUrl"
          alt="Profilbild"
          class="avatar-img"
        />
        <div v-else class="avatar-placeholder">
          <svg viewBox="0 0 24 24" fill="none" class="avatar-icon">
            <circle cx="12" cy="8" r="4" fill="currentColor"/>
            <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" fill="currentColor"/>
          </svg>
        </div>
        <span class="avatar-edit-badge">📷</span>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="avatar-file-input"
          @change="onAvatarSelected"
          aria-label="Profilbild hochladen"
        />
      </div>

      <div class="profile-name-area">
        <div v-if="!isEditingName" class="name-display" @click="startEditName">
          <span class="display-name">{{ userStore.displayName || 'Name festlegen' }}</span>
          <span class="name-edit-icon">✏️</span>
        </div>
        <div v-else class="name-edit">
          <input
            v-model="nameInput"
            class="name-input"
            placeholder="Dein Name"
            maxlength="20"
            @keydown.enter="saveName"
            @keydown.escape="cancelEditName"
          />
          <button class="btn btn-primary name-save-btn" @click="saveName">OK</button>
        </div>
      </div>

      <div class="profile-badges">
        <span class="badge badge-level">Lv. {{ userStore.currentLevel.level }}</span>
        <span class="badge badge-xp">{{ userStore.totalXp }} XP</span>
        <span class="badge badge-streak">🔥 {{ userStore.currentStreak }}</span>
      </div>
    </section>

    <!-- Badges Preview -->
    <section class="badges-section card">
      <div class="badges-header">
        <h2>🏅 Erfolge</h2>
        <span class="badges-count">{{ badgesStore.earnedCount }} / {{ badgesStore.totalBadges }}</span>
      </div>

      <!-- Latest 3 earned -->
      <div v-if="latestBadges.length > 0" class="badges-preview">
        <div
          v-for="badge in latestBadges"
          :key="badge.id"
          class="badge-preview-cell"
        >
          <span class="badge-icon">{{ badge.icon }}</span>
          <div class="badge-preview-info">
            <span class="badge-preview-name">{{ badge.name }}</span>
            <span class="badge-preview-desc">{{ badge.description }}</span>
          </div>
        </div>
      </div>
      <p v-else class="no-badges-text">Noch keine Erfolge freigeschaltet. Lerne weiter!</p>

      <router-link to="/badges" class="badges-more-link">
        Alle Erfolge anzeigen →
      </router-link>
    </section>

    <!-- Account Section -->
    <section class="account-section card">
      <h2>👤 Account</h2>
      <div v-if="authStore.isLoggedIn" class="account-logged-in">
        <div class="account-info">
          <span class="account-email">{{ authStore.email }}</span>
          <span class="account-status">✅ Angemeldet</span>
        </div>
        <button class="btn btn-ghost" @click="handleLogout">Abmelden</button>
      </div>
      <div v-else class="account-logged-out">
        <p class="account-hint">Melde dich an um deinen Fortschritt zu sichern und mit Freunden zu vergleichen.</p>
        <router-link to="/auth" class="btn btn-primary account-login-btn">
          Anmelden / Registrieren
        </router-link>
      </div>
    </section>

    <!-- Hidden dev tools: tap the section title below 5x to reveal -->
    <section class="dev-section card">
      <h2 @click="devTap">🛠️ Entwickler</h2>
      <div v-if="showDev" class="dev-tools">
        <p class="dev-hint">Aktuelles Level: {{ userStore.currentLevel.level }} · {{ userStore.totalXp }} XP</p>
        <div class="dev-row">
          <input v-model.number="devLevel" type="number" min="1" max="60" class="dev-input" />
          <button class="btn btn-secondary" @click="setDevLevel">Level setzen</button>
        </div>
        <p v-if="devResult" class="dev-result">{{ devResult }}</p>
      </div>
    </section>

    <!-- Notifications -->
    <section v-if="notifStore.supported" class="notif-section card">
      <h2>🔔 Benachrichtigungen</h2>
      <div v-if="notifStore.isEnabled" class="notif-enabled">
        <span class="notif-status">✅ Aktiviert</span>
        <p class="notif-hint">Du bekommst Erinnerungen zum Lernen.</p>
        <button class="btn btn-ghost notif-test-btn" @click="runNotifTest">
          Test-Benachrichtigung senden
        </button>
        <p v-if="notifTestResult" class="notif-test-result">{{ notifTestResult }}</p>
      </div>
      <div v-else-if="notifStore.canAsk" class="notif-ask">
        <p class="notif-hint">Aktiviere Benachrichtigungen um an deine tägliche Lektion erinnert zu werden.</p>
        <button class="btn btn-secondary" @click="notifStore.requestPermission()">
          🔔 Aktivieren
        </button>
      </div>
      <div v-else class="notif-denied">
        <p class="notif-hint">Benachrichtigungen wurden blockiert. Ändere die Einstellung in deinem Browser.</p>
      </div>
    </section>

    <!-- Overview Cards -->
    <section class="overview-cards">
      <div class="overview-card card-flat">
        <span class="overview-value">{{ userStore.totalXp }}</span>
        <span class="overview-label">Gesamt XP</span>
      </div>
      <div class="overview-card card-flat">
        <span class="overview-value">Lv. {{ userStore.currentLevel.level }}</span>
        <span class="overview-label">{{ userStore.currentLevel.jlpt }}</span>
      </div>
      <div class="overview-card card-flat">
        <span class="overview-value">🔥 {{ userStore.currentStreak }}</span>
        <span class="overview-label">Streak</span>
      </div>
      <div class="overview-card card-flat">
        <span class="overview-value">{{ totalMastered }}</span>
        <span class="overview-label">Gemeistert</span>
      </div>
    </section>

    <!-- Weekly Activity -->
    <section class="weekly-section card">
      <h2>Wochenaktivität</h2>
      <div class="weekly-chart">
        <div v-for="day in weeklyActivity" :key="day.date" class="chart-bar">
          <div class="bar-container">
            <div
              class="bar-fill"
              :style="{
                height: (day.xp / maxWeeklyXp) * 100 + '%',
                background: day.xp > 0 ? 'var(--gradient-xp)' : 'var(--bg-accent)'
              }"
            />
          </div>
          <span class="bar-label">{{ day.label }}</span>
          <span class="bar-value">{{ day.xp }}</span>
        </div>
      </div>
      <div class="weekly-total">
        Gesamt: <strong>{{ userStore.weeklyXp }} XP</strong> diese Woche
      </div>
    </section>

    <!-- Category Breakdown -->
    <section class="categories-section">
      <h2>Kategorien</h2>
      <div class="category-breakdown">
        <div v-for="cat in categories" :key="cat.id" class="cat-stat card-flat">
          <div class="cat-stat-header">
            <span class="cat-stat-icon jp">{{ cat.icon }}</span>
            <span class="cat-stat-name">{{ cat.label }}</span>
            <span class="cat-stat-mastered">{{ cat.mastered }} / {{ cat.totalCards }}</span>
          </div>
          <div class="progress-bar" style="height: 6px;">
            <div
              class="progress-bar-fill"
              :style="{
                width: (cat.totalCards > 0 ? (cat.mastered / cat.totalCards) * 100 : 0) + '%',
                background: cat.color
              }"
            />
          </div>
          <div class="cat-stat-details">
            <span>Genauigkeit: {{ cat.accuracy }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Streak Info -->
    <section class="streak-section card">
      <h2>🔥 Streak</h2>
      <div class="streak-info">
        <div class="streak-item">
          <span class="streak-item-value">{{ userStore.currentStreak }}</span>
          <span class="streak-item-label">Aktuell</span>
        </div>
        <div class="streak-divider" />
        <div class="streak-item">
          <span class="streak-item-value">{{ userStore.longestStreak }}</span>
          <span class="streak-item-label">Rekord</span>
        </div>
      </div>
    </section>

    <!-- Level Progress -->
    <section class="level-section card">
      <h2>Level-Fortschritt</h2>
      <div class="level-info">
        <div class="level-current">
          <span class="level-badge badge badge-level">Lv. {{ userStore.currentLevel.level }}</span>
          <span>{{ userStore.currentLevel.label }}</span>
        </div>
        <div v-if="userStore.nextLevel" class="level-next">
          <span class="level-badge badge badge-level">Lv. {{ userStore.nextLevel.level }}</span>
          <span>{{ userStore.nextLevel.label }}</span>
        </div>
      </div>
      <div class="progress-bar progress-bar-xp" style="height: 10px; margin: 12px 0;">
        <div class="progress-bar-fill" :style="{ width: userStore.levelProgress + '%' }" />
      </div>
      <p class="level-xp-text" v-if="userStore.nextLevel">
        Noch {{ userStore.xpForNextLevel }} XP bis zum nächsten Level
      </p>
      <p class="level-xp-text" v-else>🎉 Maximales Level erreicht!</p>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--content-padding);
  padding-bottom: 32px;
  max-width: 600px;
  margin: 0 auto;
}

/* ── Profile Header ── */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0 20px;
}

.avatar-wrapper {
  position: relative;
  width: 96px;
  height: 96px;
  cursor: pointer;
}

.avatar-img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-primary);
}

.avatar-placeholder {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 3px solid var(--bg-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  width: 48px;
  height: 48px;
  color: var(--text-muted);
}

.avatar-edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: var(--bg-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: 2px solid var(--bg-primary);
}

.avatar-file-input {
  display: none;
}

/* Name */
.profile-name-area {
  text-align: center;
}

.name-display {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.name-display:hover {
  background: var(--bg-card);
}

.display-name {
  font-size: 1.3rem;
  font-weight: 700;
}

.name-edit-icon {
  font-size: 0.85rem;
  opacity: 0.5;
}

.name-edit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-input {
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  width: 180px;
  text-align: center;
}

.name-input:focus {
  border-color: var(--accent-primary);
}

.name-save-btn {
  padding: 8px 16px;
  font-size: 0.85rem;
}

/* Profile badges */
.profile-badges {
  display: flex;
  gap: 8px;
}

/* ── Badges Preview ── */
.badges-section {
  margin-bottom: 20px;
}

.badges-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.badges-header h2 {
  font-size: 1rem;
  font-weight: 600;
}

.badges-count {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.badges-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.badge-preview-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: var(--radius-sm);
}

.badge-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.badge-preview-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.badge-preview-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.badge-preview-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.no-badges-text {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
  padding: 8px 0;
}

.badges-more-link {
  display: block;
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--bg-accent);
  color: var(--accent-primary);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.badges-more-link:hover {
  opacity: 0.8;
}

/* ── Account Section ── */
.account-section {
  margin-bottom: 20px;
}

.account-section h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.account-logged-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account-email {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

.dev-section h2 {
  cursor: default;
  user-select: none;
}

.dev-tools {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dev-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.dev-row {
  display: flex;
  gap: 8px;
}

.dev-input {
  width: 80px;
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  padding: 8px 10px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
}

.dev-result {
  font-size: 0.85rem;
  color: var(--accent-success);
}

.account-status {
  font-size: 0.75rem;
  color: var(--accent-success);
}

.account-logged-out {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.account-hint {
  color: var(--text-secondary);
  font-size: 0.85rem;
  text-align: center;
}

.account-login-btn {
  width: 100%;
  text-align: center;
  text-decoration: none;
  padding: 12px;
  font-size: 0.95rem;
}

/* ── Notifications ── */
.notif-section {
  margin-bottom: 20px;
}

.notif-section h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.notif-enabled {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notif-status {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-success);
}

.notif-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.notif-test-btn {
  margin-top: 10px;
  font-size: 0.85rem;
}

.notif-test-result {
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.notif-ask {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.notif-denied .notif-hint {
  color: var(--text-muted);
  text-align: center;
}

/* ── Stats (same as before) ── */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  text-align: center;
}

.overview-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.overview-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.weekly-section {
  margin-bottom: 20px;
}

.weekly-section h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.weekly-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  gap: 8px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  transition: height var(--transition-normal);
}

.bar-label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.bar-value {
  font-size: 0.65rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.weekly-total {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--bg-accent);
}

.categories-section {
  margin-bottom: 20px;
}

.categories-section h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.category-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cat-stat { padding: 14px; }

.cat-stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.cat-stat-icon { font-size: 1.3rem; }
.cat-stat-name { font-weight: 600; font-size: 0.95rem; }
.cat-stat-mastered { margin-left: auto; color: var(--text-secondary); font-size: 0.8rem; }
.cat-stat-details { margin-top: 8px; font-size: 0.8rem; color: var(--text-muted); }

.streak-section { margin-bottom: 20px; }
.streak-section h2 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }

.streak-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.streak-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.streak-item-value { font-size: 2rem; font-weight: 700; }
.streak-item-label { font-size: 0.8rem; color: var(--text-muted); }

.streak-divider {
  width: 1px;
  height: 48px;
  background: var(--bg-accent);
}

.level-section { margin-bottom: 20px; }
.level-section h2 { font-size: 1rem; font-weight: 600; margin-bottom: 12px; }

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.level-current,
.level-next {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.level-xp-text {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
}
</style>
