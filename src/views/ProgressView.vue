<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData } from '../data/kanji'
import { vocabularyData } from '../data/vocabulary'

const userStore = useUserStore()
const learningStore = useLearningStore()
learningStore.initialize()

const categories = computed(() => [
  {
    id: 'hiragana',
    label: 'Hiragana',
    icon: 'あ',
    totalCards: hiraganaData.length,
    ...learningStore.getCategoryStats('hiragana'),
    color: '#e94560'
  },
  {
    id: 'katakana',
    label: 'Katakana',
    icon: 'ア',
    totalCards: katakanaData.length,
    ...learningStore.getCategoryStats('katakana'),
    color: '#533483'
  },
  {
    id: 'kanji',
    label: 'Kanji',
    icon: '漢',
    totalCards: kanjiData.length,
    ...learningStore.getCategoryStats('kanji'),
    color: '#0f3460'
  },
  {
    id: 'vocabulary',
    label: 'Vokabeln',
    icon: '📝',
    totalCards: vocabularyData.length,
    ...learningStore.getCategoryStats('vocabulary'),
    color: '#00c853'
  },
])

const totalMastered = computed(() =>
  categories.value.reduce((sum, c) => sum + c.mastered, 0)
)

const totalCards = computed(() =>
  categories.value.reduce((sum, c) => sum + c.totalCards, 0)
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

const maxWeeklyXp = computed(() => {
  const max = Math.max(...weeklyActivity.value.map(d => d.xp), 1)
  return max
})
</script>

<template>
  <div class="progress-page">
    <header class="page-header">
      <h1>📊 Fortschritt</h1>
    </header>

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
        <div
          v-for="day in weeklyActivity"
          :key="day.date"
          class="chart-bar"
        >
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
      <p class="streak-tip">
        💡 Lerne jeden Tag, um deinen Streak nicht zu verlieren!
      </p>
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
      <p class="level-xp-text" v-else>
        🎉 Maximales Level erreicht!
      </p>
    </section>
  </div>
</template>

<style scoped>
.progress-page {
  padding: var(--content-padding);
  padding-bottom: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  padding: 20px 0;
}

.page-header h1 {
  font-size: 1.6rem;
  font-weight: 700;
}

/* Overview */
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

/* Weekly Chart */
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

/* Categories */
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

.cat-stat {
  padding: 14px;
}

.cat-stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.cat-stat-icon {
  font-size: 1.3rem;
}

.cat-stat-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.cat-stat-mastered {
  margin-left: auto;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.cat-stat-details {
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Streak */
.streak-section {
  margin-bottom: 20px;
}

.streak-section h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

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

.streak-item-value {
  font-size: 2rem;
  font-weight: 700;
}

.streak-item-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.streak-divider {
  width: 1px;
  height: 48px;
  background: var(--bg-accent);
}

.streak-tip {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--bg-accent);
}

/* Level */
.level-section {
  margin-bottom: 20px;
}

.level-section h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

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
