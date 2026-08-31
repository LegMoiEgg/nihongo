<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { useBadgesStore } from '../stores/badges'
import { scheduleSave } from '../stores/sync'
import { playCorrectSound, playWrongSound } from '../composables/useSounds'
import { vocabularyData, type VocabCard } from '../data/vocabulary'

const userStore = useUserStore()
const learningStore = useLearningStore()
const badgesStore = useBadgesStore()
learningStore.initialize()

interface TestQuestion {
  id: string
  direction: 'de-jp' | 'jp-de'
  vocab: VocabCard
  prompt: string
  promptJp?: string
  correctAnswer: string
  options: string[]
}

// State
const testStarted = ref(false)
const currentIndex = ref(0)
const questions = ref<TestQuestion[]>([])
const selectedAnswer = ref<string | null>(null)
const isChecked = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const totalXp = ref(0)
const testComplete = ref(false)
const timeLeft = ref(0)
const noWordsLearned = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progress = computed(() => {
  if (questions.value.length === 0) return 0
  return Math.round((currentIndex.value / questions.value.length) * 100)
})

const formattedTime = computed(() => {
  const min = Math.floor(timeLeft.value / 60)
  const sec = timeLeft.value % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Only include vocab the user has actually practiced (status !== 'new').
 * This ensures the test only covers words they've seen in daily lessons.
 */
function getLearnedVocab(): VocabCard[] {
  return vocabularyData.filter(v => {
    const p = learningStore.cardProgress.find(c => c.id === v.id)
    return p && p.status !== 'new'
  })
}

function generateQuestions(): TestQuestion[] {
  const learned = getLearnedVocab()

  if (learned.length < 4) {
    noWordsLearned.value = true
    return []
  }
  noWordsLearned.value = false

  const result: TestQuestion[] = []
  const pool = shuffle(learned)

  for (const vocab of pool) {
    // Direction 1: Deutsch → Japanisch
    const wrongJp = shuffle(learned.filter(v => v.id !== vocab.id))
      .slice(0, 3)
      .map(v => v.reading)
    result.push({
      id: `de-jp-${vocab.id}`,
      direction: 'de-jp',
      vocab,
      prompt: vocab.meaning,
      correctAnswer: vocab.reading,
      options: shuffle([vocab.reading, ...wrongJp]),
    })

    // Direction 2: Japanisch → Deutsch
    const wrongDe = shuffle(learned.filter(v => v.id !== vocab.id))
      .slice(0, 3)
      .map(v => v.meaning)
    result.push({
      id: `jp-de-${vocab.id}`,
      direction: 'jp-de',
      vocab,
      prompt: vocab.meaning,
      promptJp: vocab.reading,
      correctAnswer: vocab.meaning,
      options: shuffle([vocab.meaning, ...wrongDe]),
    })
  }

  // Shuffle, but keep a nice mix — don't put both directions of the same word next to each other
  const deJp = shuffle(result.filter(q => q.direction === 'de-jp'))
  const jpDe = shuffle(result.filter(q => q.direction === 'jp-de'))

  const interleaved: TestQuestion[] = []
  const maxLen = Math.max(deJp.length, jpDe.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < deJp.length) interleaved.push(deJp[i])
    if (i < jpDe.length) interleaved.push(jpDe[i])
  }

  return interleaved
}

function startTest() {
  questions.value = generateQuestions()
  if (noWordsLearned.value) return

  currentIndex.value = 0
  score.value = 0
  totalXp.value = 0
  testComplete.value = false
  testStarted.value = true
  selectedAnswer.value = null
  isChecked.value = false
  isCorrect.value = false

  // 15 minutes timer
  timeLeft.value = 15 * 60
  startTimer()
}

function selectAnswer(answer: string) {
  if (isChecked.value) return
  selectedAnswer.value = answer
  isChecked.value = true

  isCorrect.value = answer === currentQuestion.value.correctAnswer

  if (isCorrect.value) {
    score.value++
    const xp = userStore.xpPerCorrect
    totalXp.value += xp
    userStore.addXp(xp, 1)
    playCorrectSound()
  } else {
    playWrongSound()
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    isChecked.value = false
    isCorrect.value = false
  } else {
    finishTest()
  }
}

function finishTest() {
  testComplete.value = true
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  userStore.completeSession()
  badgesStore.checkAllBadges()
  badgesStore.checkPerfectTest(score.value, questions.value.length)
  scheduleSave()
}

function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      finishTest()
    }
  }, 1000)
}

onMounted(() => {
  // Check if there are enough learned words
  const learned = getLearnedVocab()
  if (learned.length < 4) {
    noWordsLearned.value = true
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="vocab-test">
    <!-- Start Screen -->
    <div v-if="!testStarted" class="test-intro animate-fade-in">
      <div class="intro-icon">📝</div>
      <h1>Vokabeltest</h1>

      <!-- Not enough words learned -->
      <div v-if="noWordsLearned" class="no-words">
        <p>Du hast noch nicht genug Wörter gelernt um einen Test zu machen.</p>
        <p class="no-words-hint">Mache zuerst ein paar tägliche Lektionen, dann komm zurück!</p>
        <router-link to="/daily" class="btn btn-primary start-btn">Zur Lektion →</router-link>
      </div>

      <!-- Ready to test -->
      <template v-else>
        <p>Teste dein Wissen mit allen Wörtern die du bisher gelernt hast.</p>

        <div class="test-info card-flat">
          <div class="info-item">
            <span class="info-icon">⏱️</span>
            <span>15 Minuten Zeitlimit</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📖</span>
            <span>Nur gelernte Wörter</span>
          </div>
          <div class="info-item">
            <span class="info-icon">🔄</span>
            <span>Deutsch ↔ Japanisch</span>
          </div>
          <div class="info-item">
            <span class="info-icon">⭐</span>
            <span>2 XP pro richtige Antwort</span>
          </div>
        </div>

        <button class="btn btn-primary start-btn" @click="startTest">
          Test starten
        </button>
      </template>
    </div>

    <!-- Test Complete -->
    <div v-else-if="testComplete" class="test-complete animate-fade-in">
      <div class="complete-icon">{{ score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.5 ? '👏' : '💪' }}</div>
      <h2>Test abgeschlossen!</h2>

      <div class="score-circle">
        <span class="score-value">{{ questions.length > 0 ? Math.round((score / questions.length) * 100) : 0 }}%</span>
        <span class="score-label">{{ score }} / {{ questions.length }}</span>
      </div>

      <div class="complete-stats">
        <div class="complete-stat">
          <span class="stat-number xp">+{{ totalXp }}</span>
          <span>XP verdient</span>
        </div>
      </div>

      <div class="grade-message">
        <template v-if="score >= questions.length * 0.9">🌟 Ausgezeichnet! Du bist ein Meister!</template>
        <template v-else-if="score >= questions.length * 0.7">👍 Gut gemacht! Weiter so!</template>
        <template v-else-if="score >= questions.length * 0.5">📚 Nicht schlecht, aber übe weiter!</template>
        <template v-else>💪 Übung macht den Meister! Versuch es nochmal.</template>
      </div>

      <div class="complete-actions">
        <button class="btn btn-primary" @click="startTest">Nochmal testen</button>
        <button class="btn btn-secondary" @click="testStarted = false">Zurück</button>
      </div>
    </div>

    <!-- Active Test -->
    <div v-else-if="currentQuestion" class="test-active">
      <header class="test-header">
        <span class="test-timer" :class="{ 'low-time': timeLeft < 60 }">⏱️ {{ formattedTime }}</span>
        <span class="test-progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
        <span class="test-score">✅ {{ score }}</span>
      </header>

      <div class="progress-bar" style="margin: 0 16px 16px;">
        <div class="progress-bar-fill" :style="{ width: progress + '%', background: 'var(--gradient-xp)' }" />
      </div>

      <div class="question-area">
        <!-- Direction badge -->
        <div class="direction-badge-row">
          <span v-if="currentQuestion.direction === 'de-jp'" class="badge badge-xp">🇩🇪 → 🇯🇵</span>
          <span v-else class="badge badge-xp">🇯🇵 → 🇩🇪</span>
        </div>

        <!-- DE → JP: show German meaning, pick Japanese -->
        <div v-if="currentQuestion.direction === 'de-jp'" class="question-prompt card-flat">
          <p class="question-label">Was heißt das auf Japanisch?</p>
          <p class="question-text">{{ currentQuestion.prompt }}</p>
        </div>

        <!-- JP → DE: show Japanese, pick German meaning -->
        <div v-else class="question-prompt card-flat">
          <p class="question-label">Was bedeutet dieses Wort?</p>
          <p class="question-text jp-large">{{ currentQuestion.promptJp }}</p>
        </div>

        <!-- Answer options -->
        <div class="mc-options">
          <button
            v-for="option in currentQuestion.options"
            :key="option"
            class="mc-option"
            :class="{
              'jp': currentQuestion.direction === 'de-jp',
              correct: isChecked && option === currentQuestion.correctAnswer,
              wrong: isChecked && selectedAnswer === option && option !== currentQuestion.correctAnswer,
              dimmed: isChecked && option !== currentQuestion.correctAnswer && selectedAnswer !== option,
            }"
            :disabled="isChecked"
            @click="selectAnswer(option)"
          >
            {{ option }}
          </button>
        </div>

        <!-- Feedback -->
        <div v-if="isChecked" class="question-feedback animate-slide-up">
          <p v-if="isCorrect" class="feedback-text correct">✅ Richtig!</p>
          <p v-else class="feedback-text wrong">
            ❌ Falsch
          </p>
          <p class="feedback-detail">
            <span class="jp">{{ currentQuestion.vocab.reading }}</span>
            <span class="feedback-sep">＝</span>
            <span>{{ currentQuestion.vocab.meaning }}</span>
          </p>
          <button class="btn btn-primary" @click="nextQuestion">
            {{ currentIndex < questions.length - 1 ? 'Weiter →' : 'Test beenden' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vocab-test {
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}

/* Intro */
.test-intro {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 16px;
  text-align: center;
}

.intro-icon {
  font-size: 4rem;
}

.test-intro h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.test-intro > p {
  color: var(--text-secondary);
  max-width: 300px;
}

.no-words {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 300px;
}

.no-words p {
  color: var(--text-secondary);
}

.no-words-hint {
  font-size: 0.9rem;
  color: var(--text-muted) !important;
}

.test-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  width: 100%;
  max-width: 300px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.info-icon {
  font-size: 1.2rem;
}

.start-btn {
  margin-top: 16px;
  padding: 16px 48px;
  font-size: 1.1rem;
  text-decoration: none;
}

/* Test Header */
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.test-timer {
  font-weight: 600;
  font-size: 0.9rem;
}

.test-timer.low-time {
  color: var(--accent-primary);
  animation: pulse 1s infinite;
}

.test-progress-text {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.test-score {
  font-weight: 600;
  font-size: 0.9rem;
}

/* Question */
.question-area {
  flex: 1;
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.direction-badge-row {
  padding: 0 0 4px;
}

.question-prompt {
  text-align: center;
  padding: 24px 20px;
}

.question-label {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.question-text {
  font-size: 1.2rem;
  font-weight: 600;
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
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
  font-family: 'Noto Sans JP', 'Inter', sans-serif;
  touch-action: manipulation;
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
.question-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 0;
}

.feedback-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.feedback-text.correct { color: var(--accent-success); }
.feedback-text.wrong { color: var(--accent-primary); }

.feedback-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: var(--text-secondary);
}

.feedback-detail .jp {
  font-weight: 600;
  color: var(--text-primary);
}

.feedback-sep {
  color: var(--text-muted);
}

.question-feedback .btn {
  width: 100%;
  margin-top: 4px;
  padding: 14px;
}

/* Test Complete */
.test-complete {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 20px;
  text-align: center;
}

.complete-icon {
  font-size: 4rem;
}

.test-complete h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

.score-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 4px solid var(--accent-primary);
  justify-content: center;
}

.score-value {
  font-size: 2.2rem;
  font-weight: 700;
}

.score-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
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

.stat-number.xp { color: var(--accent-warning); }

.grade-message {
  color: var(--text-secondary);
  font-size: 1rem;
}

.complete-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
</style>
