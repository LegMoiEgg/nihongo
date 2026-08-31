<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningStore } from '../stores/learning'
import { kanjiData, type KanjiCard } from '../data/kanji'

const router = useRouter()
const learningStore = useLearningStore()
learningStore.initialize()

const groupOrder = ['Zahlen', 'Natur', 'Menschen', 'Größe']

interface KanjiWithProgress extends KanjiCard {
  consecutiveCorrect: number
  status: 'new' | 'learning' | 'mastered'
}

function getCardProgress(card: KanjiCard): KanjiWithProgress {
  const p = learningStore.cardProgress.find(c => c.id === card.id)
  const cc = p?.consecutiveCorrect ?? 0
  let status: 'new' | 'learning' | 'mastered' = 'new'
  if (cc >= learningStore.MASTERY_STREAK) status = 'mastered'
  else if (p && p.status !== 'new') status = 'learning'
  return { ...card, consecutiveCorrect: cc, status }
}

const totalCards = computed(() => kanjiData.length)
const masteredCount = computed(() =>
  kanjiData.filter(c => {
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && (p.consecutiveCorrect ?? 0) >= learningStore.MASTERY_STREAK
  }).length
)
const learningCount = computed(() =>
  kanjiData.filter(c => {
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && p.status !== 'new' && (p.consecutiveCorrect ?? 0) < learningStore.MASTERY_STREAK
  }).length
)
const progressPercent = computed(() =>
  totalCards.value > 0 ? Math.round((masteredCount.value / totalCards.value) * 100) : 0
)

function startLearning() {
  router.push('/learn/kanji')
}

function goBack() {
  router.push('/learn')
}
</script>

<template>
  <div class="kanji-overview">
    <header class="overview-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>Kanji</h1>
      <span class="overview-count">{{ masteredCount }}/{{ totalCards }}</span>
    </header>

    <!-- Progress Summary -->
    <div class="progress-summary card">
      <div class="progress-row">
        <div class="progress-stat">
          <span class="stat-val mastered-color">{{ masteredCount }}</span>
          <span class="stat-lbl">Gemeistert</span>
        </div>
        <div class="progress-stat">
          <span class="stat-val learning-color">{{ learningCount }}</span>
          <span class="stat-lbl">Am Lernen</span>
        </div>
        <div class="progress-stat">
          <span class="stat-val new-color">{{ totalCards - masteredCount - learningCount }}</span>
          <span class="stat-lbl">Neu</span>
        </div>
      </div>
      <div class="progress-bar" style="height: 8px; margin-top: 12px;">
        <div class="progress-bar-fill" :style="{ width: progressPercent + '%', background: 'var(--accent-success)' }" />
      </div>
      <span class="progress-pct">{{ progressPercent }}%</span>
    </div>

    <!-- Legend -->
    <div class="legend">
      <span class="legend-item"><span class="legend-dot dot-new" /> Neu</span>
      <span class="legend-item"><span class="legend-dot dot-learning" /> Am Lernen</span>
      <span class="legend-item"><span class="legend-dot dot-mastered" /> Gemeistert</span>
    </div>

    <!-- Kanji Grid by Group -->
    <div v-for="group in groupOrder" :key="group" class="section">
      <h2 class="section-title">{{ group }}</h2>
      <div class="kanji-grid">
        <div
          v-for="card in kanjiData.filter(k => k.group === group).map(getCardProgress)"
          :key="card.id"
          class="kanji-cell"
          :class="{
            'is-new': card.status === 'new',
            'is-learning': card.status === 'learning',
            'is-mastered': card.status === 'mastered',
          }"
        >
          <span class="kanji-char jp">{{ card.character }}</span>
          <span class="kanji-meaning">{{ card.meanings[0] }}</span>
          <div class="kanji-readings-mini">
            <span class="reading-on">{{ card.onyomi[0] }}</span>
            <span class="reading-kun">{{ card.kunyomi[0] }}</span>
          </div>
          <div class="char-dots">
            <span
              v-for="i in learningStore.MASTERY_STREAK"
              :key="i"
              class="mini-dot"
              :class="{ filled: i <= card.consecutiveCorrect }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom spacer -->
    <div class="bottom-spacer" />

    <!-- Sticky Learn Button -->
    <div class="sticky-learn-bar">
      <button class="btn btn-primary sticky-learn-btn" @click="startLearning">
        ▶ Kanji üben
      </button>
    </div>
  </div>
</template>

<style scoped>
.kanji-overview {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--content-padding);
  padding-bottom: 0;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 16px;
}

.overview-header h1 {
  font-size: 1.3rem;
  font-weight: 700;
}

.overview-count {
  color: var(--text-muted);
  font-size: 0.85rem;
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

/* Progress Summary */
.progress-summary {
  margin-bottom: 16px;
  position: relative;
}

.progress-row {
  display: flex;
  justify-content: space-around;
}

.progress-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-val {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-lbl {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mastered-color { color: var(--accent-success); }
.learning-color { color: var(--accent-warning); }
.new-color { color: var(--text-muted); }

.progress-pct {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Legend */
.legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 8px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-new { background: var(--bg-accent); }
.dot-learning { background: var(--accent-warning); }
.dot-mastered { background: var(--accent-success); }

/* Sections */
.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--bg-accent);
}

/* Kanji Grid */
.kanji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.kanji-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px 10px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.kanji-cell.is-new {
  border-color: var(--bg-accent);
  opacity: 0.6;
}

.kanji-cell.is-learning {
  border-color: var(--accent-warning);
  background: rgba(255, 152, 0, 0.06);
}

.kanji-cell.is-mastered {
  border-color: var(--accent-success);
  background: rgba(0, 200, 83, 0.06);
}

.kanji-char {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.kanji-meaning {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
}

.kanji-readings-mini {
  display: flex;
  gap: 6px;
  font-size: 0.6rem;
}

.reading-on {
  color: var(--accent-primary);
}

.reading-kun {
  color: var(--text-muted);
}

.char-dots {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}

.mini-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--bg-accent);
}

.mini-dot.filled {
  background: var(--accent-success);
}

/* Bottom spacer */
.bottom-spacer {
  height: 80px;
}

/* Sticky Learn Button */
.sticky-learn-bar {
  position: fixed;
  bottom: var(--nav-height);
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(to top, var(--bg-primary) 60%, transparent);
  z-index: 50;
  display: flex;
  justify-content: center;
}

.sticky-learn-btn {
  width: 100%;
  max-width: 568px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: var(--radius-md);
  box-shadow: 0 -2px 20px rgba(233, 69, 96, 0.3);
}
</style>
