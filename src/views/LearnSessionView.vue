<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore, type CardCategory } from '../stores/learning'
import { hiraganaData, type KanaCard } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData, type KanjiCard } from '../data/kanji'
import { vocabularyData, type VocabCard } from '../data/vocabulary'

const props = defineProps<{ category: CardCategory }>()

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()

learningStore.initialize()

const isKanaMode = computed(() => props.category === 'hiragana' || props.category === 'katakana')

// Session state
const currentIndex = ref(0)
const isFlipped = ref(false)
const sessionCards = ref<(KanaCard | KanjiCard | VocabCard)[]>([])
const sessionCorrect = ref(0)
const sessionIncorrect = ref(0)
const sessionComplete = ref(false)
const answerFeedback = ref<'correct' | 'incorrect' | null>(null)
const sessionXp = ref(0)

// Kana multiple-choice state
const mcOptions = ref<string[]>([])
const selectedOption = ref<string | null>(null)
const showExample = ref(false)

const categoryTitle = computed(() => {
  const titles: Record<CardCategory, string> = {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    vocabulary: 'Vokabeln',
  }
  return titles[props.category]
})

const currentCard = computed(() => sessionCards.value[currentIndex.value])

const progress = computed(() => {
  if (sessionCards.value.length === 0) return 0
  return Math.round((currentIndex.value / sessionCards.value.length) * 100)
})

function isKanaCard(card: KanaCard | KanjiCard | VocabCard): card is KanaCard {
  return 'romaji' in card
}

function isKanjiCard(card: KanaCard | KanjiCard | VocabCard): card is KanjiCard {
  return 'onyomi' in card
}

function isVocabCard(card: KanaCard | KanjiCard | VocabCard): card is VocabCard {
  return 'japanese' in card
}

function getDisplayCharacter(card: KanaCard | KanjiCard | VocabCard): string {
  if (isKanaCard(card)) return card.character
  if (isKanjiCard(card)) return card.character
  if (isVocabCard(card)) return card.japanese
  return ''
}

function getAllKanaForCategory(): KanaCard[] {
  return props.category === 'hiragana' ? hiraganaData : katakanaData
}

function generateMcOptions(correctCard: KanaCard): string[] {
  const allKana = getAllKanaForCategory()
  const wrongOptions = allKana
    .filter(k => k.romaji !== correctCard.romaji)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(k => k.romaji)

  const options = [correctCard.romaji, ...wrongOptions]
  return options.sort(() => Math.random() - 0.5)
}

function initSession() {
  let allCards: (KanaCard | KanjiCard | VocabCard)[]

  switch (props.category) {
    case 'hiragana':
      allCards = [...hiraganaData]
      break
    case 'katakana':
      allCards = [...katakanaData]
      break
    case 'kanji':
      allCards = [...kanjiData]
      break
    case 'vocabulary':
      allCards = [...vocabularyData]
      break
    default:
      allCards = []
  }

  // Initialize progress for all cards
  for (const card of allCards) {
    learningStore.getOrCreateProgress(card.id, props.category)
  }

  // Get due cards first, then new cards, limit to 20
  const dueCards = learningStore.getDueCardsForCategory(props.category, 20)
  const dueIds = new Set(dueCards.map(c => c.id))

  let selected = allCards.filter(c => dueIds.has(c.id))

  // If we have fewer than 10 due, add some new ones
  if (selected.length < 10) {
    const newCards = allCards.filter(c => !dueIds.has(c.id))
    const shuffled = newCards.sort(() => Math.random() - 0.5)
    selected = [...selected, ...shuffled.slice(0, 10 - selected.length)]
  }

  // Shuffle
  sessionCards.value = selected.sort(() => Math.random() - 0.5)
  currentIndex.value = 0
  sessionCorrect.value = 0
  sessionIncorrect.value = 0
  sessionComplete.value = false
  sessionXp.value = 0
  isFlipped.value = false
  selectedOption.value = null
  showExample.value = false

  // Generate MC options for first kana card
  if (isKanaMode.value && sessionCards.value.length > 0) {
    const card = sessionCards.value[0]
    if (isKanaCard(card)) {
      mcOptions.value = generateMcOptions(card)
    }
  }
}

function loadNextKanaMcOptions() {
  const card = currentCard.value
  if (card && isKanaCard(card)) {
    mcOptions.value = generateMcOptions(card)
  }
  selectedOption.value = null
  showExample.value = false
}

function selectKanaOption(option: string) {
  if (selectedOption.value !== null) return // already answered
  if (!currentCard.value || !isKanaCard(currentCard.value)) return

  selectedOption.value = option
  const correct = option === currentCard.value.romaji

  learningStore.recordAnswer(currentCard.value.id, props.category, correct)

  if (correct) {
    sessionCorrect.value++
    const xp = 10
    sessionXp.value += xp
    userStore.addXp(xp, 1)
    answerFeedback.value = 'correct'
    showExample.value = true
  } else {
    sessionIncorrect.value++
    userStore.addXp(2)
    answerFeedback.value = 'incorrect'
    // Show example too so they can learn from it
    showExample.value = true
  }
}

function nextKanaCard() {
  answerFeedback.value = null

  if (currentIndex.value < sessionCards.value.length - 1) {
    currentIndex.value++
    loadNextKanaMcOptions()
  } else {
    sessionComplete.value = true
    userStore.completeSession()
  }
}

// Flashcard mode (Kanji / Vocabulary)
function flipCard() {
  isFlipped.value = true
}

function answer(correct: boolean) {
  if (!currentCard.value) return

  answerFeedback.value = correct ? 'correct' : 'incorrect'
  learningStore.recordAnswer(currentCard.value.id, props.category, correct)

  if (correct) {
    sessionCorrect.value++
    const xp = props.category === 'kanji' ? 15 : 10
    sessionXp.value += xp
    userStore.addXp(xp, 1)
  } else {
    sessionIncorrect.value++
    userStore.addXp(2)
  }

  setTimeout(() => {
    answerFeedback.value = null

    if (currentIndex.value < sessionCards.value.length - 1) {
      currentIndex.value++
      isFlipped.value = false
    } else {
      sessionComplete.value = true
      userStore.completeSession()
    }
  }, 600)
}

function restartSession() {
  initSession()
}

function goBack() {
  router.push('/learn')
}

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="learn-session">
    <!-- Header -->
    <header class="session-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">← Zurück</button>
      <h1>{{ categoryTitle }}</h1>
      <span class="card-counter">{{ currentIndex + 1 }} / {{ sessionCards.length }}</span>
    </header>

    <!-- Progress Bar -->
    <div class="progress-bar" style="margin: 0 16px 16px;">
      <div class="progress-bar-fill" :style="{ width: progress + '%', background: 'var(--gradient-xp)' }" />
    </div>

    <!-- Session Complete -->
    <div v-if="sessionComplete" class="session-complete animate-fade-in">
      <div class="complete-icon">🎉</div>
      <h2>Session abgeschlossen!</h2>
      <div class="complete-stats">
        <div class="complete-stat">
          <span class="stat-number correct">{{ sessionCorrect }}</span>
          <span>Richtig</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number incorrect">{{ sessionIncorrect }}</span>
          <span>Falsch</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number xp">+{{ sessionXp }}</span>
          <span>XP</span>
        </div>
      </div>
      <div class="complete-accuracy">
        Genauigkeit: {{ sessionCards.length > 0 ? Math.round((sessionCorrect / sessionCards.length) * 100) : 0 }}%
      </div>
      <div class="complete-actions">
        <button class="btn btn-primary" @click="restartSession">Nochmal üben</button>
        <button class="btn btn-secondary" @click="goBack">Zurück</button>
      </div>
    </div>

    <!-- ==================== KANA: Multiple Choice Mode ==================== -->
    <div v-else-if="currentCard && isKanaMode && isKanaCard(currentCard)" class="kana-mc-container">
      <!-- Character Display -->
      <div class="kana-display" :class="answerFeedback ? `feedback-${answerFeedback}` : ''">
        <span class="kana-character jp">{{ currentCard.character }}</span>
        <p v-if="!selectedOption" class="kana-prompt">Was ist die Lesung?</p>
      </div>

      <!-- Answer Options -->
      <div v-if="!showExample" class="mc-options">
        <button
          v-for="option in mcOptions"
          :key="option"
          class="mc-option"
          :class="{
            selected: selectedOption === option,
            correct: selectedOption !== null && option === currentCard.romaji,
            wrong: selectedOption === option && option !== currentCard.romaji,
          }"
          :disabled="selectedOption !== null"
          @click="selectKanaOption(option)"
        >
          {{ option }}
        </button>
      </div>

      <!-- Example Word (shown after answering) -->
      <div v-if="showExample" class="kana-example animate-slide-up">
        <div class="example-result">
          <span v-if="answerFeedback === 'correct'" class="result-icon">✅</span>
          <span v-else class="result-icon">❌</span>
          <span class="result-reading">{{ currentCard.romaji }}</span>
        </div>

        <div v-if="currentCard.example" class="example-card card-flat">
          <p class="example-label">Beispielwort</p>
          <p class="example-word jp-medium">{{ currentCard.example }}</p>
          <p class="example-meaning">{{ currentCard.exampleMeaning }}</p>
        </div>

        <button class="btn btn-primary next-btn" @click="nextKanaCard">
          Weiter →
        </button>
      </div>
    </div>

    <!-- ==================== Flashcard Mode (Kanji / Vocabulary) ==================== -->
    <div v-else-if="currentCard" class="flashcard-container">
      <div
        class="flashcard"
        :class="[
          { flipped: isFlipped },
          answerFeedback ? `feedback-${answerFeedback}` : ''
        ]"
        @click="!isFlipped && flipCard()"
        role="button"
        :aria-label="isFlipped ? 'Antwort angezeigt' : 'Tippe zum Aufdecken'"
        tabindex="0"
        @keydown.enter="!isFlipped && flipCard()"
        @keydown.space.prevent="!isFlipped && flipCard()"
      >
        <!-- Front -->
        <div class="flashcard-front" v-if="!isFlipped">
          <span class="card-character jp">{{ getDisplayCharacter(currentCard) }}</span>
          <p class="card-hint">Tippe zum Aufdecken</p>
        </div>

        <!-- Back - Kanji -->
        <div class="flashcard-back" v-else-if="isKanjiCard(currentCard)">
          <span class="card-character jp">{{ currentCard.character }}</span>
          <div class="kanji-info">
            <div class="kanji-meaning">{{ currentCard.meanings.join(', ') }}</div>
            <div class="kanji-readings">
              <span class="reading-label">On:</span> {{ currentCard.onyomi.join(', ') }}
              <br />
              <span class="reading-label">Kun:</span> {{ currentCard.kunyomi.join(', ') }}
            </div>
            <div class="kanji-meta">{{ currentCard.strokes }} Striche</div>
          </div>
        </div>

        <!-- Back - Vocabulary -->
        <div class="flashcard-back" v-else-if="isVocabCard(currentCard)">
          <span class="card-character jp">{{ currentCard.japanese }}</span>
          <span class="card-reading jp">{{ currentCard.reading }}</span>
          <span class="card-meaning">{{ currentCard.meaning }}</span>
          <span class="card-pos badge badge-level">{{ currentCard.partOfSpeech }}</span>
        </div>
      </div>

      <!-- Answer Buttons (Flashcard mode) -->
      <div v-if="isFlipped && !answerFeedback" class="answer-buttons animate-slide-up">
        <button class="btn answer-btn incorrect-btn" @click="answer(false)">
          ✕ Falsch
        </button>
        <button class="btn answer-btn correct-btn" @click="answer(true)">
          ✓ Richtig
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>Keine Karten für diese Kategorie verfügbar.</p>
      <button class="btn btn-primary" @click="goBack">Zurück</button>
    </div>
  </div>
</template>

<style scoped>
.learn-session {
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}

.session-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.session-header h1 {
  font-size: 1.1rem;
  font-weight: 600;
}

.card-counter {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.back-btn {
  font-size: 0.85rem;
}

/* ===================== Kana Multiple Choice ===================== */
.kana-mc-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 24px;
}

.kana-display {
  width: 100%;
  max-width: 350px;
  padding: 40px 24px 32px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 2px solid transparent;
  transition: border-color var(--transition-fast);
}

.kana-display.feedback-correct {
  border-color: var(--accent-success);
}

.kana-display.feedback-incorrect {
  border-color: var(--accent-primary);
}

.kana-character {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1.1;
}

.kana-prompt {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* MC Options */
.mc-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 350px;
}

.mc-option {
  padding: 18px 16px;
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
  font-family: inherit;
  touch-action: manipulation;
}

.mc-option:hover:not(:disabled) {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.mc-option:active:not(:disabled) {
  transform: scale(0.97);
}

.mc-option.correct {
  border-color: var(--accent-success);
  background: rgba(0, 200, 83, 0.12);
  color: var(--accent-success);
}

.mc-option.wrong {
  border-color: var(--accent-primary);
  background: rgba(233, 69, 96, 0.12);
  color: var(--accent-primary);
  animation: shake 0.35s ease;
}

.mc-option:disabled {
  cursor: default;
  opacity: 0.6;
}

.mc-option.correct:disabled {
  opacity: 1;
}

/* Example after answer */
.kana-example {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 350px;
}

.example-result {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-icon {
  font-size: 1.4rem;
}

.result-reading {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.example-card {
  width: 100%;
  text-align: center;
  padding: 20px;
}

.example-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.example-word {
  margin-bottom: 6px;
}

.example-meaning {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.next-btn {
  width: 100%;
  padding: 16px;
  font-size: 1.05rem;
}

/* ===================== Flashcard Mode (Kanji/Vocab) ===================== */
.flashcard-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 24px;
}

.flashcard {
  width: 100%;
  max-width: 350px;
  min-height: 300px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  user-select: none;
}

.flashcard:not(.flipped):hover {
  transform: scale(1.02);
  border-color: var(--bg-accent);
}

.flashcard.feedback-correct {
  border-color: var(--accent-success);
  animation: pulse 0.3s ease;
}

.flashcard.feedback-incorrect {
  border-color: var(--accent-primary);
  animation: shake 0.3s ease;
}

.flashcard-front,
.flashcard-back {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  text-align: center;
  width: 100%;
}

.card-character {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.2;
}

.card-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.card-reading {
  font-size: 1.5rem;
  color: var(--accent-primary);
  font-weight: 600;
}

.card-meaning {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.card-pos {
  margin-top: 4px;
}

/* Kanji specific */
.kanji-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.kanji-meaning {
  font-size: 1.3rem;
  font-weight: 600;
}

.kanji-readings {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.reading-label {
  color: var(--accent-primary);
  font-weight: 600;
}

.kanji-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Answer Buttons */
.answer-buttons {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 350px;
}

.answer-btn {
  flex: 1;
  padding: 16px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: var(--radius-md);
}

.incorrect-btn {
  background: rgba(233, 69, 96, 0.15);
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
}

.correct-btn {
  background: rgba(0, 200, 83, 0.15);
  color: var(--accent-success);
  border: 2px solid var(--accent-success);
}

/* ===================== Session Complete ===================== */
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
  margin-top: 16px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary);
}
</style>
