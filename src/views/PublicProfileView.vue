<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '../stores/social'
import { levelInfoForXp } from '../stores/user'
import { ALL_BADGES, type BadgeDefinition } from '../stores/badges'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData } from '../data/kanji'
import { vocabularyData } from '../data/vocabulary'

const props = defineProps<{ uid: string }>()

const router = useRouter()
const socialStore = useSocialStore()

const MASTERY_STREAK = 5

onMounted(() => {
  socialStore.loadPublicProfile(props.uid)
})

const profile = computed(() => socialStore.publicProfile)

// Level info from the other user's XP + placement level
const levelInfo = computed(() => {
  const p = profile.value
  if (!p) return null
  return levelInfoForXp(p.totalXp, p.placementLevel)
})

// Latest 3 earned badges (newest first)
const latestBadges = computed((): BadgeDefinition[] => {
  const p = profile.value
  if (!p) return []
  return [...p.earnedBadges]
    .sort((a, b) => b.earnedAt.localeCompare(a.earnedAt))
    .slice(0, 3)
    .map(eb => ALL_BADGES.find(b => b.id === eb.id))
    .filter((b): b is BadgeDefinition => !!b)
})

const earnedCount = computed(() => profile.value?.earnedBadges.length ?? 0)
const totalBadges = ALL_BADGES.length

/** Category stats computed from the other user's cardProgress. */
function categoryStats(category: string) {
  const p = profile.value
  if (!p) return { accuracy: 0, mastered: 0 }
  const cards = p.cardProgress.filter((c: any) => c.category === category)
  if (cards.length === 0) return { accuracy: 0, mastered: 0 }
  const totalCorrect = cards.reduce((s: number, c: any) => s + (c.correctCount || 0), 0)
  const totalAnswers = cards.reduce(
    (s: number, c: any) => s + (c.correctCount || 0) + (c.incorrectCount || 0), 0
  )
  return {
    accuracy: totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0,
    mastered: cards.filter((c: any) => (c.consecutiveCorrect || 0) >= MASTERY_STREAK).length,
  }
}

const categories = computed(() => [
  { id: 'hiragana', label: 'Hiragana', icon: 'あ', totalCards: hiraganaData.length, color: '#e94560', ...categoryStats('hiragana') },
  { id: 'katakana', label: 'Katakana', icon: 'ア', totalCards: katakanaData.length, color: '#533483', ...categoryStats('katakana') },
  { id: 'kanji', label: 'Kanji', icon: '漢', totalCards: kanjiData.length, color: '#0f3460', ...categoryStats('kanji') },
  { id: 'vocabulary', label: 'Vokabeln', icon: '📝', totalCards: vocabularyData.length, color: '#00c853', ...categoryStats('vocabulary') },
])

const totalMastered = computed(() =>
  categories.value.reduce((sum, c) => sum + c.mastered, 0)
)

const weeklyActivity = computed(() => {
  const p = profile.value
  const days: { label: string; xp: number; date: string }[] = []
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const log = p?.dailyLog.find(l => l.date === dateStr)
    days.push({ label: dayNames[d.getDay()], xp: log?.xpEarned || 0, date: dateStr })
  }
  return days
})

const maxWeeklyXp = computed(() => Math.max(...weeklyActivity.value.map(d => d.xp), 1))
const weeklyTotal = computed(() => weeklyActivity.value.reduce((s, d) => s + d.xp, 0))

function goBack() {
  router.back()
}
</script>

<template>
  <div class="profile-page">
    <header class="pub-header-bar">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>Profil</h1>
      <span class="header-spacer" />
    </header>

    <div v-if="socialStore.loading" class="pub-loading">
      <p>Laden…</p>
    </div>

    <p v-else-if="socialStore.error" class="pub-error">{{ socialStore.error }}</p>

    <template v-else-if="profile && levelInfo">
      <!-- Profile Header -->
      <section class="profile-header">
        <div class="avatar-wrapper-static">
          <img
            v-if="profile.avatarDataUrl"
            :src="profile.avatarDataUrl"
            alt="Profilbild"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            <svg viewBox="0 0 24 24" fill="none" class="avatar-icon">
              <circle cx="12" cy="8" r="4" fill="currentColor"/>
              <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <span class="display-name">{{ profile.displayName }}</span>

        <div class="profile-badges">
          <span class="badge badge-level">Lv. {{ levelInfo.current.level }}</span>
          <span class="badge badge-xp">{{ profile.totalXp }} XP</span>
          <span class="badge badge-streak">🔥 {{ profile.currentStreak }}</span>
        </div>
      </section>

      <!-- Badges Preview -->
      <section class="badges-section card">
        <div class="badges-header">
          <h2>🏅 Erfolge</h2>
          <span class="badges-count">{{ earnedCount }} / {{ totalBadges }}</span>
        </div>
        <div v-if="latestBadges.length > 0" class="badges-preview">
          <div v-for="badge in latestBadges" :key="badge.id" class="badge-preview-cell">
            <span class="badge-icon">{{ badge.icon }}</span>
            <div class="badge-preview-info">
              <span class="badge-preview-name">{{ badge.name }}</span>
              <span class="badge-preview-desc">{{ badge.description }}</span>
            </div>
          </div>
        </div>
        <p v-else class="no-badges-text">Noch keine Erfolge freigeschaltet.</p>
      </section>

      <!-- Overview Cards -->
      <section class="overview-cards">
        <div class="overview-card card-flat">
          <span class="overview-value">{{ profile.totalXp }}</span>
          <span class="overview-label">Gesamt XP</span>
        </div>
        <div class="overview-card card-flat">
          <span class="overview-value">Lv. {{ levelInfo.current.level }}</span>
          <span class="overview-label">{{ levelInfo.current.jlpt }}</span>
        </div>
        <div class="overview-card card-flat">
          <span class="overview-value">🔥 {{ profile.currentStreak }}</span>
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
          Gesamt: <strong>{{ weeklyTotal }} XP</strong> diese Woche
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
            <span class="streak-item-value">{{ profile.currentStreak }}</span>
            <span class="streak-item-label">Aktuell</span>
          </div>
          <div class="streak-divider" />
          <div class="streak-item">
            <span class="streak-item-value">{{ profile.longestStreak }}</span>
            <span class="streak-item-label">Rekord</span>
          </div>
        </div>
      </section>

      <!-- Level Progress -->
      <section class="level-section card">
        <h2>Level-Fortschritt</h2>
        <div class="level-info">
          <div class="level-current">
            <span class="level-badge badge badge-level">Lv. {{ levelInfo.current.level }}</span>
            <span>{{ levelInfo.current.label }}</span>
          </div>
          <div v-if="levelInfo.next" class="level-next">
            <span class="level-badge badge badge-level">Lv. {{ levelInfo.next.level }}</span>
            <span>{{ levelInfo.next.label }}</span>
          </div>
        </div>
        <div class="progress-bar progress-bar-xp" style="height: 10px; margin: 12px 0;">
          <div class="progress-bar-fill" :style="{ width: levelInfo.progress + '%' }" />
        </div>
        <p class="level-xp-text" v-if="levelInfo.next">
          Noch {{ levelInfo.xpToNext }} XP bis zum nächsten Level
        </p>
        <p class="level-xp-text" v-else>🎉 Maximales Level erreicht!</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--content-padding);
  padding-bottom: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.pub-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 8px;
}

.pub-header-bar h1 {
  font-size: 1.3rem;
  font-weight: 700;
}

.header-spacer {
  width: 36px;
}

.back-btn {
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  border-radius: 50%;
}

.pub-loading,
.pub-error {
  text-align: center;
  padding: 40px 16px;
  color: var(--text-secondary);
}

/* ── Profile Header ── */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 0 20px;
}

.avatar-wrapper-static {
  width: 96px;
  height: 96px;
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

.display-name {
  font-size: 1.3rem;
  font-weight: 700;
}

.profile-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

/* ── Badges ── */
.badges-section {
  margin-bottom: 16px;
}

.badges-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.badges-header h2 {
  font-size: 1rem;
  font-weight: 700;
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
}

.badge-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.badge-preview-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.badge-preview-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.badge-preview-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.no-badges-text {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
}

/* ── Overview ── */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
}

.overview-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.overview-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── Weekly ── */
.weekly-section {
  margin-bottom: 16px;
}

.weekly-section h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.weekly-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  gap: 6px;
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
  justify-content: center;
}

.bar-fill {
  width: 70%;
  border-radius: 4px 4px 0 0;
  min-height: 2px;
  transition: height 0.4s ease;
}

.bar-label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.bar-value {
  font-size: 0.65rem;
  color: var(--text-secondary);
}

.weekly-total {
  margin-top: 12px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* ── Categories ── */
.categories-section {
  margin-bottom: 16px;
}

.categories-section h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.category-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cat-stat {
  padding: 14px;
}

.cat-stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.cat-stat-icon {
  font-size: 1.2rem;
}

.cat-stat-name {
  font-weight: 600;
  font-size: 0.9rem;
  flex: 1;
}

.cat-stat-mastered {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.cat-stat-details {
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── Streak ── */
.streak-section {
  margin-bottom: 16px;
}

.streak-section h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.streak-info {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.streak-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.streak-item-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.streak-item-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.streak-divider {
  width: 1px;
  height: 40px;
  background: var(--bg-accent);
}

/* ── Level ── */
.level-section {
  margin-bottom: 16px;
}

.level-section h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.level-info {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.level-current,
.level-next {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.level-next {
  text-align: right;
  align-items: flex-end;
}

.level-badge {
  align-self: flex-start;
}

.level-next .level-badge {
  align-self: flex-end;
}

.level-xp-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}
</style>
