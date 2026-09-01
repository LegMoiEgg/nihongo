<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningStore } from '../stores/learning'
import { useUserStore } from '../stores/user'
import { vocabularyData, type VocabCard } from '../data/vocabulary'

const router = useRouter()
const learningStore = useLearningStore()
const userStore = useUserStore()
learningStore.initialize()

// Category display order (matches the grouping in vocabulary.ts)
const groupOrder = [
  'Begrüßung', 'Pronomen', 'Familie', 'Essen',
  'Orte', 'Zuhause', 'Transport', 'Schule',
  'Zeit', 'Wochentage', 'Zahlen', 'Farben',
  'Körper', 'Natur', 'Tiere', 'Kleidung',
  'Fragewörter', 'Adverbien', 'Verben', 'Adjektive',
]

// Vocabulary unlocks with the user's level (10 new words per level).
// The overview only shows unlocked words; the rest is still locked.
const allVocabIds = vocabularyData.map(v => v.id)
const unlockedIds = computed(() =>
  new Set(learningStore.getUnlockedVocabIds(allVocabIds, userStore.currentLevel.level))
)
const unlockedVocab = computed(() =>
  vocabularyData.filter(v => unlockedIds.value.has(v.id))
)
const lockedCount = computed(() => vocabularyData.length - unlockedVocab.value.length)

interface VocabWithProgress extends VocabCard {
  consecutiveCorrect: number
  status: 'new' | 'learning' | 'mastered'
}

function getCardProgress(card: VocabCard): VocabWithProgress {
  const p = learningStore.cardProgress.find(c => c.id === card.id)
  const cc = p?.consecutiveCorrect ?? 0
  let status: 'new' | 'learning' | 'mastered' = 'new'
  if (cc >= learningStore.MASTERY_STREAK) status = 'mastered'
  else if (p && p.status !== 'new') status = 'learning'
  return { ...card, consecutiveCorrect: cc, status }
}

/** Show the reading below the word only when it differs (kanji words) */
function hasFurigana(card: VocabCard): boolean {
  return card.japanese !== card.reading
}

const totalCards = computed(() => unlockedVocab.value.length)
const masteredCount = computed(() =>
  unlockedVocab.value.filter(c => {
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && (p.consecutiveCorrect ?? 0) >= learningStore.MASTERY_STREAK
  }).length
)
const learningCount = computed(() =>
  unlockedVocab.value.filter(c => {
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && p.status !== 'new' && (p.consecutiveCorrect ?? 0) < learningStore.MASTERY_STREAK
  }).length
)
const progressPercent = computed(() =>
  totalCards.value > 0 ? Math.round((masteredCount.value / totalCards.value) * 100) : 0
)

// Only show groups that have at least one UNLOCKED word
const visibleGroups = computed(() =>
  groupOrder.filter(g => unlockedVocab.value.some(v => v.category === g))
)

function startLearning() {
  router.push('/learn/vocabulary')
}

function goBack() {
  router.push('/learn')
}
</script>

<template>
  <div class="vocab-overview">
    <header class="overview-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>Vokabeln</h1>
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

    <!-- Empty state (brand-new learner with nothing unlocked yet) -->
    <div v-if="unlockedVocab.length === 0" class="vocab-empty">
      <p>Noch keine Vokabeln freigeschaltet.</p>
      <p class="vocab-empty-hint">Steige im Level auf, um deine ersten Wörter zu lernen!</p>
    </div>

    <!-- Vocab list by category (only unlocked words) -->
    <div v-for="group in visibleGroups" :key="group" class="section">
      <h2 class="section-title">{{ group }}</h2>
      <div class="vocab-list">
        <div
          v-for="card in unlockedVocab.filter(v => v.category === group).map(getCardProgress)"
          :key="card.id"
          class="vocab-cell"
          :class="{
            'is-new': card.status === 'new',
            'is-learning': card.status === 'learning',
            'is-mastered': card.status === 'mastered',
          }"
        >
          <div class="vocab-jp-block">
            <span class="vocab-word jp">{{ card.japanese }}</span>
            <span v-if="hasFurigana(card)" class="vocab-reading">{{ card.reading }}</span>
          </div>
          <span class="vocab-meaning">{{ card.meaning }}</span>
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

    <!-- Locked words hint -->
    <div v-if="lockedCount > 0" class="locked-hint">
      🔒 {{ lockedCount }} weitere {{ lockedCount === 1 ? 'Wort' : 'Wörter' }} schaltest du mit dem nächsten Level frei
    </div>

    <!-- Bottom spacer -->
    <div class="bottom-spacer" />

    <!-- Sticky Learn Button -->
    <div class="sticky-learn-bar">
      <button class="btn btn-primary sticky-learn-btn" @click="startLearning">
        ▶ Vokabeln üben
      </button>
    </div>
  </div>
</template>

<style scoped>
.vocab-overview {
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

/* Vocab list — one row per word */
.vocab-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vocab-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.vocab-cell.is-new {
  border-color: var(--bg-accent);
  opacity: 0.6;
}

.vocab-cell.is-learning {
  border-color: var(--accent-warning);
  background: rgba(255, 152, 0, 0.06);
}

.vocab-cell.is-mastered {
  border-color: var(--accent-success);
  background: rgba(0, 200, 83, 0.06);
}

.vocab-jp-block {
  display: flex;
  flex-direction: column;
  min-width: 90px;
  flex-shrink: 0;
}

.vocab-word {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2;
}

.vocab-reading {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.vocab-meaning {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-secondary);
  min-width: 0;
}

.char-dots {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
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

/* Empty state */
.vocab-empty {
  text-align: center;
  padding: 40px 16px;
  color: var(--text-secondary);
}

.vocab-empty-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 6px;
}

/* Locked words hint */
.locked-hint {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 12px 16px;
  margin-top: 4px;
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
