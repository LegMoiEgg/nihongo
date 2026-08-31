<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'

const userStore = useUserStore()
const learningStore = useLearningStore()

learningStore.initialize()

// ── Week calendar logic ──
// Week runs Mon–Sun. Sunday is test day.
interface WeekDay {
  label: string
  date: string       // YYYY-MM-DD
  isToday: boolean
  isFuture: boolean
  isTestDay: boolean  // Sunday
  completed: boolean  // daily XP goal reached
}

const weekDays = computed((): WeekDay[] => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentDayOfWeek = now.getDay() // 0=Sun, 1=Mon...

  // Find Monday of this week
  const monday = new Date(now)
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek
  monday.setDate(monday.getDate() + diffToMonday)

  const labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const days: WeekDay[] = []

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const log = userStore.dailyLog.find(l => l.date === dateStr)
    const xpEarned = log?.xpEarned ?? 0

    days.push({
      label: labels[i],
      date: dateStr,
      isToday: dateStr === today,
      isFuture: dateStr > today,
      isTestDay: i === 6, // Sunday
      completed: xpEarned >= userStore.dailyXpGoal,
    })
  }

  return days
})

// All 7 days completed → gold week
const isGoldWeek = computed(() =>
  weekDays.value.every(d => d.completed)
)

// Number of completed days this week
const completedDays = computed(() =>
  weekDays.value.filter(d => d.completed).length
)
</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-top">
        <div>
          <h1 class="app-title">NihonGo</h1>
          <p class="greeting">{{ userStore.currentLevel.label }}</p>
        </div>
        <div class="streak-badge" :class="{ 'has-streak': userStore.currentStreak > 0 }">
          <span class="streak-fire">🔥</span>
          <span class="streak-count">{{ userStore.currentStreak }}</span>
        </div>
      </div>

      <!-- XP Progress -->
      <div class="xp-section">
        <div class="xp-header">
          <span class="badge badge-level">Lv. {{ userStore.currentLevel.level }}</span>
          <span class="xp-text">{{ userStore.totalXp }} XP</span>
          <span v-if="userStore.nextLevel" class="xp-next">
            {{ userStore.xpForNextLevel }} bis Lv. {{ userStore.nextLevel.level }}
          </span>
        </div>
        <div class="progress-bar progress-bar-xp">
          <div class="progress-bar-fill" :style="{ width: userStore.levelProgress + '%' }" />
        </div>
      </div>
    </header>

    <!-- Week Calendar -->
    <section class="week-calendar card" :class="{ 'gold-week': isGoldWeek }">
      <div class="week-header">
        <h2>Diese Woche</h2>
        <span class="week-progress">{{ completedDays }} / 7</span>
      </div>
      <div class="week-days">
        <div
          v-for="day in weekDays"
          :key="day.date"
          class="week-day"
          :class="{
            'is-today': day.isToday,
            'is-future': day.isFuture,
            'is-completed': day.completed && !day.isFuture,
            'is-missed': !day.completed && !day.isFuture && !day.isToday,
            'is-gold': isGoldWeek && day.completed,
            'is-test-day': day.isTestDay,
          }"
        >
          <span class="day-label">{{ day.label }}</span>
          <span class="day-dot">
            <template v-if="day.completed && !day.isFuture">
              <template v-if="isGoldWeek">★</template>
              <template v-else>✓</template>
            </template>
            <template v-else-if="day.isTestDay && !day.isFuture && !day.isToday">📝</template>
            <template v-else-if="day.isTestDay">📝</template>
          </span>
        </div>
      </div>
      <p v-if="isGoldWeek" class="gold-message">🏆 Perfekte Woche! Alle Tage abgeschlossen!</p>
    </section>

    <!-- Daily Goal -->
    <section class="daily-goal card">
      <div class="goal-header">
        <h2>Tagesziel</h2>
        <span class="goal-progress-text">{{ userStore.todayLog.xpEarned }} / {{ userStore.dailyXpGoal }} XP</span>
      </div>
      <div class="progress-bar progress-bar-xp">
        <div class="progress-bar-fill" :style="{ width: userStore.dailyGoalProgress + '%' }" />
      </div>
      <p v-if="userStore.dailyGoalProgress >= 100" class="goal-done">🎉 Tagesziel erreicht!</p>
    </section>

    <!-- Big Daily Lesson Button -->
    <router-link to="/daily" class="daily-lesson-btn">
      <div class="lesson-btn-inner">
        <span class="lesson-btn-icon">▶</span>
      </div>
      <span class="lesson-btn-label">Tägliche Lektion</span>
      <span class="lesson-btn-sub">Vokabeln, Kanji &amp; Sätze</span>
    </router-link>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <h2>Weiterlernen</h2>
      <div class="action-grid">
        <router-link to="/learn/hiragana" class="action-card card">
          <span class="action-icon jp-large">あ</span>
          <span class="action-label">Hiragana</span>
          <span class="action-due badge badge-xp" v-if="learningStore.dueByCategory.hiragana > 0">
            {{ learningStore.dueByCategory.hiragana }} fällig
          </span>
        </router-link>
        <router-link to="/learn/katakana" class="action-card card">
          <span class="action-icon jp-large">ア</span>
          <span class="action-label">Katakana</span>
          <span class="action-due badge badge-xp" v-if="learningStore.dueByCategory.katakana > 0">
            {{ learningStore.dueByCategory.katakana }} fällig
          </span>
        </router-link>
        <router-link to="/learn/kanji" class="action-card card">
          <span class="action-icon jp-large">漢</span>
          <span class="action-label">Kanji</span>
          <span class="action-due badge badge-xp" v-if="learningStore.dueByCategory.kanji > 0">
            {{ learningStore.dueByCategory.kanji }} fällig
          </span>
        </router-link>
        <router-link to="/learn/vocabulary" class="action-card card">
          <span class="action-icon">📝</span>
          <span class="action-label">Vokabeln</span>
          <span class="action-due badge badge-xp" v-if="learningStore.dueByCategory.vocabulary > 0">
            {{ learningStore.dueByCategory.vocabulary }} fällig
          </span>
        </router-link>
      </div>
    </section>

    <!-- Continue Section -->
    <section class="continue-section">
      <router-link to="/sentences" class="continue-card card">
        <div class="continue-info">
          <span class="continue-icon">🧩</span>
          <div>
            <h3>Sätze bauen</h3>
            <p>Übe mit gelernten Wörtern Sätze zu bilden</p>
          </div>
        </div>
        <span class="continue-arrow">→</span>
      </router-link>
      <router-link to="/test" class="continue-card card">
        <div class="continue-info">
          <span class="continue-icon">📝</span>
          <div>
            <h3>Vokabeltest</h3>
            <p>Teste dein Wissen mit dem wöchentlichen Quiz</p>
          </div>
        </div>
        <span class="continue-arrow">→</span>
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--content-padding);
  padding-bottom: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.dashboard-header {
  padding: 16px 0 24px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.greeting {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 2px;
}

.streak-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px solid var(--bg-accent);
}

.streak-badge.has-streak {
  border-color: var(--accent-warning);
  background: rgba(255, 152, 0, 0.1);
}

.streak-fire {
  font-size: 1.2rem;
}

.streak-count {
  font-size: 1.1rem;
  font-weight: 700;
}

.xp-section {
  margin-top: 8px;
}

.xp-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.xp-text {
  font-weight: 600;
  font-size: 0.95rem;
}

.xp-next {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* ── Week Calendar ── */
.week-calendar {
  margin-bottom: 16px;
  transition: border-color var(--transition-normal);
}

.week-calendar.gold-week {
  border: 2px solid var(--accent-gold);
  background: linear-gradient(135deg, var(--bg-card), rgba(255, 215, 0, 0.05));
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.week-header h2 {
  font-size: 1rem;
  font-weight: 600;
}

.week-progress {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.week-days {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.week-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.day-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-muted);
}

.week-day.is-today .day-label {
  color: var(--accent-primary);
}

.day-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all var(--transition-fast);
  background: var(--bg-accent);
  color: var(--text-muted);
}

/* Today: outlined ring */
.week-day.is-today .day-dot {
  border: 2px solid var(--accent-primary);
  background: rgba(233, 69, 96, 0.1);
  color: var(--accent-primary);
}

/* Future: grey */
.week-day.is-future .day-dot {
  background: var(--bg-accent);
  color: var(--text-muted);
  opacity: 0.5;
}

/* Completed: green */
.week-day.is-completed .day-dot {
  background: var(--accent-success);
  color: white;
}

/* Completed today */
.week-day.is-today.is-completed .day-dot {
  background: var(--accent-success);
  border-color: var(--accent-success);
  color: white;
}

/* Missed past day: subtle red */
.week-day.is-missed .day-dot {
  background: rgba(233, 69, 96, 0.15);
  color: var(--accent-primary);
  opacity: 0.7;
}

/* Gold week: all dots become gold */
.week-day.is-gold .day-dot {
  background: var(--accent-gold);
  color: #1a1a2e;
}

.week-day.is-gold.is-today .day-dot {
  border-color: var(--accent-gold);
}

/* Test day Sunday icon */
.week-day.is-test-day .day-label {
  color: var(--accent-secondary);
}

.gold-message {
  text-align: center;
  margin-top: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-gold);
}

/* Daily Goal */
.daily-goal {
  margin-bottom: 24px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.goal-header h2 {
  font-size: 1rem;
  font-weight: 600;
}

.goal-progress-text {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.goal-done {
  margin-top: 8px;
  text-align: center;
  font-weight: 600;
  color: var(--accent-success);
}

/* Daily Lesson Button */
.daily-lesson-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 16px;
  margin-bottom: 28px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  text-decoration: none;
  color: var(--text-primary);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.daily-lesson-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-elevated);
}

.daily-lesson-btn:active {
  transform: scale(0.98);
}

.lesson-btn-inner {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.35);
  transition: box-shadow var(--transition-normal);
}

.daily-lesson-btn:hover .lesson-btn-inner {
  box-shadow: 0 6px 28px rgba(233, 69, 96, 0.5);
}

.lesson-btn-icon {
  font-size: 2rem;
  color: white;
  margin-left: 4px;
}

.lesson-btn-label {
  font-size: 1.2rem;
  font-weight: 700;
}

.lesson-btn-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 24px;
}

.quick-actions h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  text-decoration: none;
  color: var(--text-primary);
  text-align: center;
}

.action-icon {
  font-size: 2rem;
}

.action-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.action-due {
  font-size: 0.7rem;
}

/* Continue Section */
.continue-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.continue-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: var(--text-primary);
}

.continue-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.continue-icon {
  font-size: 1.5rem;
}

.continue-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
}

.continue-info p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.continue-arrow {
  font-size: 1.2rem;
  color: var(--text-muted);
}
</style>
