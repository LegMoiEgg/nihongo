<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningStore } from '../stores/learning'
import { hiraganaData, type KanaCard } from '../data/hiragana'
import { katakanaData } from '../data/katakana'

const props = defineProps<{ category: 'hiragana' | 'katakana' }>()

const router = useRouter()
const learningStore = useLearningStore()
learningStore.initialize()

const title = computed(() => props.category === 'hiragana' ? 'Hiragana' : 'Katakana')
const allCards = computed(() => props.category === 'hiragana' ? hiraganaData : katakanaData)

const sectionOrder = computed(() => {
  const basic = [
    'Vokale', 'K-Reihe', 'S-Reihe', 'T-Reihe', 'N-Reihe',
    'H-Reihe', 'M-Reihe', 'Y-Reihe', 'R-Reihe', 'W-Reihe',
  ]
  const dakuten = ['G-Reihe (濁)', 'Z-Reihe (濁)', 'D-Reihe (濁)', 'B-Reihe (濁)']
  const handakuten = ['P-Reihe (半濁)']
  const sokuon = ['Sokuon']
  const combos = [
    'K-Kombi', 'S-Kombi', 'T-Kombi', 'N-Kombi',
    'H-Kombi', 'M-Kombi', 'R-Kombi',
    'G-Kombi', 'Z-Kombi', 'B-Kombi', 'P-Kombi',
  ]
  return [
    { label: 'Grundsilben', groups: basic },
    { label: 'Dakuten (゛)', groups: dakuten },
    { label: 'Handakuten (゜)', groups: handakuten },
    { label: 'Sokuon (っ)', groups: sokuon },
    { label: 'Kombinations-Silben', groups: combos },
  ]
})

interface CardWithProgress extends KanaCard {
  consecutiveCorrect: number
  status: 'new' | 'learning' | 'mastered'
}

function getCardProgress(card: KanaCard): CardWithProgress {
  const p = learningStore.cardProgress.find(c => c.id === card.id)
  const cc = p?.consecutiveCorrect ?? 0
  let status: 'new' | 'learning' | 'mastered' = 'new'
  if (cc >= learningStore.MASTERY_STREAK) status = 'mastered'
  else if (p && p.status !== 'new') status = 'learning'
  return { ...card, consecutiveCorrect: cc, status }
}

// Stats
const totalCards = computed(() => allCards.value.length)
const masteredCount = computed(() =>
  allCards.value.filter(c => {
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && (p.consecutiveCorrect ?? 0) >= learningStore.MASTERY_STREAK
  }).length
)
const learningCount = computed(() =>
  allCards.value.filter(c => {
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && p.status !== 'new' && (p.consecutiveCorrect ?? 0) < learningStore.MASTERY_STREAK
  }).length
)
const progressPercent = computed(() =>
  totalCards.value > 0 ? Math.round((masteredCount.value / totalCards.value) * 100) : 0
)

function startLearning() {
  router.push(`/learn/${props.category}`)
}

function goBack() {
  router.push('/learn')
}
</script>

<template>
  <div class="kana-overview">
    <header class="overview-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>{{ title }}</h1>
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

    <!-- Character Grid by Section -->
    <div v-for="section in sectionOrder" :key="section.label" class="section">
      <h2 class="section-title">{{ section.label }}</h2>

      <template v-for="group in section.groups" :key="group">
        <div
          v-if="allCards.filter(c => c.group === group).length > 0"
          class="group-block"
        >
          <h3 class="group-label">{{ group }}</h3>
          <div class="char-grid" :class="{ 'combo-grid': group.includes('Kombi') || group === 'Sokuon' }">
            <div
              v-for="card in allCards.filter(c => c.group === group).map(getCardProgress)"
              :key="card.id"
              class="char-cell"
              :class="{
                'is-new': card.status === 'new',
                'is-learning': card.status === 'learning',
                'is-mastered': card.status === 'mastered',
              }"
              :title="`${card.character} (${card.romaji}) — ${card.consecutiveCorrect}/${learningStore.MASTERY_STREAK}`"
            >
              <span class="char-jp jp">{{ card.character }}</span>
              <span class="char-romaji">{{ card.romaji }}</span>
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
      </template>
    </div>

    <!-- Bottom spacer so content doesn't hide behind sticky button -->
    <div class="bottom-spacer" />

    <!-- Sticky Learn Button -->
    <div class="sticky-learn-bar">
      <button class="btn btn-primary sticky-learn-btn" @click="startLearning">
        ▶ Lernen starten
      </button>
    </div>
  </div>
</template>

<style scoped>
.kana-overview {
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
  font-size: 1.4rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
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

.group-block {
  margin-bottom: 14px;
}

.group-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}

/* Character Grid */
.char-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.char-grid.combo-grid {
  grid-template-columns: repeat(3, 1fr);
  max-width: 65%;
}

.char-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 4px 8px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
  min-width: 0;
}

.char-cell.is-new {
  border-color: var(--bg-accent);
  opacity: 0.6;
}

.char-cell.is-learning {
  border-color: var(--accent-warning);
  background: rgba(255, 152, 0, 0.06);
}

.char-cell.is-mastered {
  border-color: var(--accent-success);
  background: rgba(0, 200, 83, 0.06);
}

.char-jp {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
}

.char-romaji {
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
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

/* Bottom spacer to prevent content behind sticky bar */
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
