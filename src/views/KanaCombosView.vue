<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { useBadgesStore } from '../stores/badges'
import { hiraganaData, type KanaCard } from '../data/hiragana'
import { katakanaData } from '../data/katakana'

const props = defineProps<{ category: 'hiragana' | 'katakana' }>()

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
const badgesStore = useBadgesStore()
learningStore.initialize()

const title = computed(() => props.category === 'hiragana' ? 'Hiragana Lese-Kombis' : 'Katakana Lese-Kombis')

// Only use kana the user has actually practiced (non-new, single characters only — skip combos/sokuon for generating)
const learnedKana = computed((): KanaCard[] => {
  const all = props.category === 'hiragana' ? hiraganaData : katakanaData
  return all.filter(c => {
    // Skip combo syllables and sokuon for building combos — they'd make romaji confusing
    if (c.character.length > 1) return false
    if (c.group === 'Sokuon') return false
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && p.status !== 'new'
  })
})

interface ComboQuestion {
  kanaString: string      // e.g. "かき"
  correctRomaji: string   // e.g. "kaki"
  options: string[]       // 4 romaji options
}

// ── State ──
const questions = ref<ComboQuestion[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const isChecked = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const totalXp = ref(0)
const sessionComplete = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progress = computed(() => {
  if (questions.value.length === 0) return 0
  return Math.round((currentIndex.value / questions.value.length) * 100)
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Generate a random kana combination of 2-4 characters from learned kana */
function generateCombo(length: number): { kana: string; romaji: string } {
  const pool = learnedKana.value
  let kana = ''
  let romaji = ''
  for (let i = 0; i < length; i++) {
    const card = pickRandom(pool)
    kana += card.character
    romaji += card.romaji
  }
  return { kana, romaji }
}

/** Generate a wrong romaji answer by swapping some syllables */
function generateWrongRomaji(correctRomaji: string, length: number): string {
  const pool = learnedKana.value
  // Build a new combo of same length but different
  let romaji = ''
  for (let i = 0; i < length; i++) {
    romaji += pickRandom(pool).romaji
  }
  // Make sure it's actually different
  return romaji === correctRomaji ? pickRandom(pool).romaji + romaji.slice(0, -pickRandom(pool).romaji.length) || romaji + 'a' : romaji
}

function generateQuestions(): ComboQuestion[] {
  const pool = learnedKana.value
  if (pool.length < 5) return []

  const result: ComboQuestion[] = []

  for (let i = 0; i < 15; i++) {
    // Vary length: mostly 2-3, sometimes 4
    const len = i < 6 ? 2 : i < 12 ? 3 : 4
    const combo = generateCombo(len)

    // Generate 3 unique wrong answers
    const wrongs = new Set<string>()
    let attempts = 0
    while (wrongs.size < 3 && attempts < 20) {
      const wrong = generateWrongRomaji(combo.romaji, len)
      if (wrong !== combo.romaji) wrongs.add(wrong)
      attempts++
    }

    // Fill remaining if needed
    while (wrongs.size < 3) {
      wrongs.add(generateCombo(len).romaji + '?')
    }

    result.push({
      kanaString: combo.kana,
      correctRomaji: combo.romaji,
      options: shuffle([combo.romaji, ...wrongs]),
    })
  }

  return result
}

function initSession() {
  questions.value = generateQuestions()
  currentIndex.value = 0
  score.value = 0
  totalXp.value = 0
  sessionComplete.value = false
  resetState()
}

function resetState() {
  selectedAnswer.value = null
  isChecked.value = false
  isCorrect.value = false
}

function selectAnswer(option: string) {
  if (isChecked.value) return
  selectedAnswer.value = option
  isChecked.value = true
  isCorrect.value = option === currentQuestion.value.correctRomaji

  if (isCorrect.value) {
    score.value++
    const xp = userStore.xpPerCorrect
    totalXp.value += xp
    userStore.addXp(xp)
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    resetState()
  } else {
    sessionComplete.value = true
    userStore.completeSession()
    badgesStore.checkAllBadges()
  }
}

function goBack() {
  router.push(`/learn/${props.category}/overview`)
}

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="combos-view">
    <header class="combos-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>{{ title }}</h1>
      <span class="counter">{{ currentIndex + 1 }}/{{ questions.length }}</span>
    </header>

    <div class="progress-bar" style="margin: 0 16px 16px;">
      <div class="progress-bar-fill" :style="{ width: progress + '%', background: 'var(--gradient-xp)' }" />
    </div>

    <!-- No kana learned yet -->
    <div v-if="questions.length === 0 && !sessionComplete" class="empty-state">
      <p>Du brauchst mindestens 10 gelernte Silben für Lese-Kombis.</p>
      <button class="btn btn-primary" @click="goBack">Zurück zur Übersicht</button>
    </div>

    <!-- Session Complete -->
    <div v-else-if="sessionComplete" class="session-complete animate-fade-in">
      <div class="complete-icon">{{ score >= questions.length * 0.8 ? '🌟' : score >= questions.length * 0.5 ? '👏' : '💪' }}</div>
      <h2>Geschafft!</h2>
      <div class="complete-stats">
        <div class="complete-stat">
          <span class="stat-number correct">{{ score }}</span>
          <span>Richtig</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number incorrect">{{ questions.length - score }}</span>
          <span>Falsch</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number xp">+{{ totalXp }}</span>
          <span>XP</span>
        </div>
      </div>
      <div class="complete-accuracy">
        Genauigkeit: {{ questions.length > 0 ? Math.round((score / questions.length) * 100) : 0 }}%
      </div>
      <div class="complete-actions">
        <button class="btn btn-primary" @click="initSession">Nochmal</button>
        <button class="btn btn-secondary" @click="goBack">Übersicht</button>
      </div>
    </div>

    <!-- Active Question -->
    <div v-else-if="currentQuestion" class="question-area">
      <div class="combo-display card-flat">
        <p class="combo-label">Wie liest man das?</p>
        <p class="combo-kana jp">{{ currentQuestion.kanaString }}</p>
      </div>

      <div class="mc-options">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="mc-option"
          :class="{
            correct: isChecked && option === currentQuestion.correctRomaji,
            wrong: isChecked && selectedAnswer === option && option !== currentQuestion.correctRomaji,
            dimmed: isChecked && option !== currentQuestion.correctRomaji && selectedAnswer !== option,
          }"
          :disabled="isChecked"
          @click="selectAnswer(option)"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="isChecked" class="feedback animate-slide-up">
        <p :class="isCorrect ? 'fb-correct' : 'fb-wrong'">
          {{ isCorrect ? '✅ Richtig!' : '❌ Falsch' }}
        </p>
        <p class="fb-answer">
          <span class="jp">{{ currentQuestion.kanaString }}</span>
          <span class="fb-sep">＝</span>
          <span class="fb-romaji">{{ currentQuestion.correctRomaji }}</span>
        </p>
        <button class="btn btn-primary next-btn" @click="nextQuestion">
          {{ currentIndex < questions.length - 1 ? 'Weiter →' : 'Fertig' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.combos-view {
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}

.combos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.combos-header h1 {
  font-size: 1.05rem;
  font-weight: 600;
}

.counter {
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

/* Question */
.question-area {
  flex: 1;
  padding: 0 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.combo-display {
  text-align: center;
  padding: 32px 20px;
}

.combo-label {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.combo-kana {
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.2;
}

/* MC Options */
.mc-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mc-option {
  padding: 16px 20px;
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1.15rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
  font-family: inherit;
  touch-action: manipulation;
  letter-spacing: 0.05em;
}

.mc-option:hover:not(:disabled) {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
}

.mc-option.correct {
  border-color: var(--accent-success);
  background: rgba(0, 200, 83, 0.12);
  color: var(--accent-success);
  opacity: 1 !important;
}

.mc-option.wrong {
  border-color: var(--accent-primary);
  background: rgba(233, 69, 96, 0.12);
  color: var(--accent-primary);
  animation: shake 0.35s ease;
}

.mc-option.dimmed {
  opacity: 0.4;
}

.mc-option:disabled {
  cursor: default;
}

/* Feedback */
.feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 0;
  text-align: center;
}

.fb-correct {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent-success);
}

.fb-wrong {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent-primary);
}

.fb-answer {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
}

.fb-answer .jp {
  font-weight: 700;
}

.fb-sep {
  color: var(--text-muted);
}

.fb-romaji {
  color: var(--accent-primary);
  font-weight: 600;
}

.next-btn {
  width: 100%;
  max-width: 400px;
  margin-top: 8px;
  padding: 14px;
  font-size: 1rem;
}

/* Session Complete */
.session-complete {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 20px;
}

.complete-icon {
  font-size: 4rem;
}

.session-complete h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

.complete-stats {
  display: flex;
  gap: 32px;
}

.complete-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
}

.stat-number.correct { color: var(--accent-success); }
.stat-number.incorrect { color: var(--accent-primary); }
.stat-number.xp { color: var(--accent-warning); }

.complete-accuracy {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.complete-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary);
  text-align: center;
  padding: 32px;
}
</style>
