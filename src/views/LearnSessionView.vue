<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore, type CardCategory } from '../stores/learning'
import { useBadgesStore } from '../stores/badges'
import { scheduleSave } from '../stores/sync'
import { playCorrectSound, playWrongSound } from '../composables/useSounds'
import { hiraganaData, type KanaCard } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData, type KanjiCard } from '../data/kanji'
import { vocabularyData, type VocabCard } from '../data/vocabulary'

const props = defineProps<{ category: CardCategory }>()

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
const badgesStore = useBadgesStore()

learningStore.initialize()

const isKanaMode = computed(() => props.category === 'hiragana' || props.category === 'katakana')

// Session state
const currentIndex = ref(0)
const isFlipped = ref(false)
const sessionCards = ref<(KanaCard | KanjiCard | VocabCard)[]>([])

// ── Study phase (beginner kana flashcards shown BEFORE the quiz) ──
// The tester wanted to first SEE the character + romaji + example words
// instead of having to guess ("durch testen müssen").
const studyPhase = ref(false)
const studyCards = ref<KanaCard[]>([])
const studyIndex = ref(0)
const studyCard = computed<KanaCard | null>(() => studyCards.value[studyIndex.value] ?? null)
const studyProgress = computed(() =>
  studyCards.value.length > 0 ? Math.round((studyIndex.value / studyCards.value.length) * 100) : 0
)
const sessionCorrect = ref(0)
const sessionIncorrect = ref(0)
const sessionComplete = ref(false)
const answerFeedback = ref<'correct' | 'incorrect' | null>(null)
const sessionXp = ref(0)

// Kana multiple-choice state
const mcOptions = ref<string[]>([])
const selectedOption = ref<string | null>(null)
const showExample = ref(false)
const kanaHintShown = ref(false) // tap-to-reveal romaji hint when stuck

// Combo reading state (interleaved for kana sessions)
const isComboQuestion = ref(false)
const comboKana = ref('')
const comboCorrectRomaji = ref('')
const comboOptions = ref<string[]>([])
const comboSelected = ref<string | null>(null)
const comboChecked = ref(false)
const comboCorrect = ref(false)

// Kanji multi-select meaning state
const kanjiMeaningOptions = ref<string[]>([])
const kanjiSelectedMeanings = ref<Set<string>>(new Set())
const kanjiChecked = ref(false)
const kanjiCorrect = ref(false)
const kanjiCorrectMeanings = ref<string[]>([])
const kanjiShowDetail = ref(false)

const categoryTitle = computed(() => {
  const titles: Record<CardCategory, string> = {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    vocabulary: 'Vokabeln',
  }
  return titles[props.category]
})

const currentCard = computed(() => {
  const item = sessionItems.value[currentIndex.value]
  if (!item) return null
  if (item.type === 'kana') return item.card ?? null
  return null // combo items have no card
})

const progress = computed(() => {
  if (sessionItems.value.length === 0) return 0
  return Math.round((currentIndex.value / sessionItems.value.length) * 100)
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

/** Session items: either a kana card or a combo reading question */
interface SessionItem {
  type: 'kana' | 'combo'
  card?: KanaCard  // for type=kana
  comboKana?: string   // for type=combo, e.g. "かき"
  comboRomaji?: string // for type=combo, e.g. "kaki"
  comboOptions?: string[] // 4 romaji options
}

const sessionItems = ref<SessionItem[]>([])

function generateComboItem(learned: KanaCard[]): SessionItem {
  const len = Math.random() < 0.5 ? 2 : 3
  let kana = ''
  let romaji = ''
  for (let i = 0; i < len; i++) {
    const c = pickRandom(learned)
    kana += c.character
    romaji += c.romaji
  }
  // Generate 3 wrong options
  const wrongs = new Set<string>()
  let attempts = 0
  while (wrongs.size < 3 && attempts < 20) {
    let w = ''
    for (let i = 0; i < len; i++) w += pickRandom(learned).romaji
    if (w !== romaji) wrongs.add(w)
    attempts++
  }
  while (wrongs.size < 3) wrongs.add(romaji + 'x')

  return {
    type: 'combo',
    comboKana: kana,
    comboRomaji: romaji,
    comboOptions: shuffle([romaji, ...wrongs]),
  }
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

  for (const card of allCards) {
    learningStore.getOrCreateProgress(card.id, props.category)
  }

  let selected: (KanaCard | KanjiCard | VocabCard)[]

  if (isKanaMode.value) {
    // ── Row-by-row curriculum: practise the current lesson's rows ──
    const kanaCards = allCards.filter(isKanaCard)
    const lessonIds = new Set(
      learningStore.getCurriculumCardIds(
        kanaCards.map(c => ({ id: c.id, group: c.group }))
      )
    )
    let lessonCards = kanaCards.filter(c => lessonIds.has(c.id))

    // A single row can be very short (e.g. Y-row = 3 chars). To keep sessions
    // substantial, top up with a review of already-learned kana from earlier
    // rows until we reach at least MIN_SESSION cards.
    const MIN_SESSION = 12
    if (lessonCards.length < MIN_SESSION) {
      const alreadyLearned = kanaCards.filter(c => {
        if (lessonIds.has(c.id)) return false
        const p = learningStore.cardProgress.find(cp => cp.id === c.id)
        return p && p.status !== 'new' // only cards the learner has seen
      })
      const review = alreadyLearned
        .sort(() => Math.random() - 0.5)
        .slice(0, MIN_SESSION - lessonCards.length)
      lessonCards = [...lessonCards, ...review]
    }

    selected = lessonCards.sort(() => Math.random() - 0.5)
  } else {
    // ── Kanji / Vocabulary: keep SRS due-card selection ──
    const dueCards = learningStore.getDueCardsForCategory(props.category, 20)
    const dueIds = new Set(dueCards.map(c => c.id))

    selected = allCards.filter(c => dueIds.has(c.id))

    if (selected.length < 10) {
      const newCards = allCards.filter(c => !dueIds.has(c.id))
      const shuffled = newCards.sort(() => Math.random() - 0.5)
      selected = [...selected, ...shuffled.slice(0, 10 - selected.length)]
    }

    selected = selected.sort(() => Math.random() - 0.5)
  }

  sessionCards.value = selected

  // Build session items: kana cards + interleaved combos for kana mode
  const items: SessionItem[] = []

  if (isKanaMode.value) {
    // Combos are built ONLY from the single characters in this lesson,
    // so reading practice stays within the rows currently being learned.
    const lessonSingles = selected.filter(
      (c): c is KanaCard =>
        isKanaCard(c) && c.character.length === 1 && c.group !== 'Sokuon'
    )
    // Only offer combos once the learner has a few characters in this lesson
    // (i.e. mixed/review lessons), so single-row intro lessons stay pure.
    const canDoCombo = lessonSingles.length >= 5

    for (let i = 0; i < selected.length; i++) {
      const card = selected[i]
      if (isKanaCard(card)) {
        items.push({ type: 'kana', card })
      }
      // After every 3 kana cards, insert a combo question if possible
      if (canDoCombo && (i + 1) % 3 === 0) {
        items.push(generateComboItem(lessonSingles))
      }
    }
    // Add a few more combos at the end if we have enough characters
    if (canDoCombo) {
      const extraCombos = Math.min(3, Math.floor(lessonSingles.length / 5))
      for (let i = 0; i < extraCombos; i++) {
        items.push(generateComboItem(lessonSingles))
      }
    }
  } else {
    for (const card of selected) {
      items.push({ type: 'kana', card: card as KanaCard })
    }
  }

  sessionItems.value = items
  currentIndex.value = 0
  sessionCorrect.value = 0
  sessionIncorrect.value = 0
  sessionComplete.value = false
  sessionXp.value = 0
  isFlipped.value = false
  selectedOption.value = null
  showExample.value = false
  isComboQuestion.value = false

  // ── Decide whether to show a study phase first ──
  // For kana mode, gather the "new" cards (never answered before) in this
  // session and let the learner view them as flashcards before quizzing.
  if (isKanaMode.value) {
    const newKana = selected.filter((c): c is KanaCard => {
      if (!isKanaCard(c)) return false
      const p = learningStore.cardProgress.find(cp => cp.id === c.id)
      return !p || p.status === 'new'
    })
    if (newKana.length > 0) {
      studyCards.value = newKana
      studyIndex.value = 0
      studyPhase.value = true
    } else {
      studyPhase.value = false
    }
  } else {
    studyPhase.value = false
  }

  loadCurrentItem()
}

/** Example words starting with this kana's syllable (for the study card) */
function getStudyExamples(card: KanaCard): { word: string; meaning: string }[] {
  const examples: { word: string; meaning: string }[] = []
  if (card.example && card.exampleMeaning) {
    examples.push({ word: card.example, meaning: card.exampleMeaning })
  }
  // Find additional example words from other kana that start with this character
  const all = getAllKanaForCategory()
  for (const k of all) {
    if (examples.length >= 3) break
    if (k.id === card.id) continue
    if (k.example && k.exampleMeaning && k.example.startsWith(card.character)) {
      if (!examples.some(e => e.word === k.example)) {
        examples.push({ word: k.example, meaning: k.exampleMeaning })
      }
    }
  }
  return examples
}

function nextStudyCard() {
  if (studyIndex.value < studyCards.value.length - 1) {
    studyIndex.value++
  } else {
    // Study phase done → start the quiz
    studyPhase.value = false
    loadCurrentItem()
  }
}

function prevStudyCard() {
  if (studyIndex.value > 0) studyIndex.value--
}

function skipStudy() {
  studyPhase.value = false
  loadCurrentItem()
}

function loadCurrentItem() {
  const item = sessionItems.value[currentIndex.value]
  if (!item) return

  if (item.type === 'combo') {
    isComboQuestion.value = true
    comboKana.value = item.comboKana!
    comboCorrectRomaji.value = item.comboRomaji!
    comboOptions.value = item.comboOptions!
    comboSelected.value = null
    comboChecked.value = false
    comboCorrect.value = false
  } else {
    isComboQuestion.value = false
    selectedOption.value = null
    showExample.value = false
    kanaHintShown.value = false
    if (item.card && isKanaCard(item.card)) {
      mcOptions.value = generateMcOptions(item.card)
    }
    if (item.card && isKanjiCard(item.card)) {
      loadKanjiQuiz()
    }
  }
}

function loadNextKanaMcOptions() {
  loadCurrentItem()
}

function selectComboOption(option: string) {
  if (comboChecked.value) return
  comboSelected.value = option
  comboChecked.value = true
  comboCorrect.value = option === comboCorrectRomaji.value

  if (comboCorrect.value) {
    sessionCorrect.value++
    const xp = 1 // kana combos always 1 XP
    sessionXp.value += xp
    userStore.addXp(xp)
    playCorrectSound()
  } else {
    sessionIncorrect.value++
    playWrongSound()
  }
}

function selectKanaOption(option: string) {
  if (selectedOption.value !== null) return
  const item = sessionItems.value[currentIndex.value]
  if (!item || item.type !== 'kana' || !item.card || !isKanaCard(item.card)) return

  selectedOption.value = option

  // Kana is always shown on top; the learner picks the correct romaji.
  const correct = option === item.card.romaji

  learningStore.recordAnswer(item.card.id, props.category, correct)

  if (correct) {
    sessionCorrect.value++
    const xp = 1 // kana MC always 1 XP
    sessionXp.value += xp
    userStore.addXp(xp, 1)
    answerFeedback.value = 'correct'
    showExample.value = true
    playCorrectSound()
  } else {
    sessionIncorrect.value++
    answerFeedback.value = 'incorrect'
    showExample.value = true
    playWrongSound()
  }
}

function nextItem() {
  answerFeedback.value = null

  if (currentIndex.value < sessionItems.value.length - 1) {
    currentIndex.value++
    loadCurrentItem()
  } else {
    sessionComplete.value = true
    userStore.completeSession()
    badgesStore.checkAllBadges()
    scheduleSave()
  }
}

// Flashcard mode (Kanji / Vocabulary)
function flipCard() {
  isFlipped.value = true
}

/** Generate multi-select meaning options for a kanji card */
function generateKanjiMeaningOptions(card: KanjiCard): string[] {
  const correctMeanings = card.meanings
  // Get wrong meanings from other kanji
  const allMeanings = kanjiData
    .filter(k => k.id !== card.id)
    .flatMap(k => k.meanings)
  const wrongMeanings = shuffle(allMeanings)
    .filter(m => !correctMeanings.includes(m))
    .slice(0, Math.max(4, 6 - correctMeanings.length))
  return shuffle([...correctMeanings, ...wrongMeanings])
}

function loadKanjiQuiz() {
  const card = currentCard.value
  if (!card || !isKanjiCard(card)) return
  kanjiCorrectMeanings.value = card.meanings
  kanjiMeaningOptions.value = generateKanjiMeaningOptions(card)
  kanjiSelectedMeanings.value = new Set()
  kanjiChecked.value = false
  kanjiCorrect.value = false
  kanjiShowDetail.value = false
}

function toggleKanjiMeaning(meaning: string) {
  if (kanjiChecked.value) return
  const selected = new Set(kanjiSelectedMeanings.value)
  if (selected.has(meaning)) {
    selected.delete(meaning)
  } else {
    selected.add(meaning)
  }
  kanjiSelectedMeanings.value = selected
}

function checkKanjiMeanings() {
  if (kanjiSelectedMeanings.value.size === 0) return
  kanjiChecked.value = true

  const selected = kanjiSelectedMeanings.value
  const correct = kanjiCorrectMeanings.value

  // Correct if: selected all correct meanings AND no wrong ones
  kanjiCorrect.value =
    correct.every(m => selected.has(m)) &&
    selected.size === correct.length

  const card = currentCard.value
  if (card) {
    learningStore.recordAnswer(card.id, props.category, kanjiCorrect.value)
  }

  if (kanjiCorrect.value) {
    sessionCorrect.value++
    const xp = userStore.xpPerCorrect
    sessionXp.value += xp
    userStore.addXp(xp, 1)
    answerFeedback.value = 'correct'
    playCorrectSound()
  } else {
    sessionIncorrect.value++
    answerFeedback.value = 'incorrect'
    playWrongSound()
  }
  kanjiShowDetail.value = true
}

function nextKanjiCard() {
  answerFeedback.value = null
  if (currentIndex.value < sessionItems.value.length - 1) {
    currentIndex.value++
    loadCurrentItem()
    // Load kanji quiz if next card is kanji
    const nextCard = currentCard.value
    if (nextCard && isKanjiCard(nextCard)) loadKanjiQuiz()
  } else {
    sessionComplete.value = true
    userStore.completeSession()
    badgesStore.checkAllBadges()
    scheduleSave()
  }
}

function answer(correct: boolean) {
  if (!currentCard.value) return

  answerFeedback.value = correct ? 'correct' : 'incorrect'
  learningStore.recordAnswer(currentCard.value.id, props.category, correct)

  if (correct) {
    sessionCorrect.value++
    const xp = userStore.xpPerCorrect
    sessionXp.value += xp
    userStore.addXp(xp, 1)
    playCorrectSound()
  } else {
    sessionIncorrect.value++
    playWrongSound()
  }

  setTimeout(() => {
    answerFeedback.value = null

    if (currentIndex.value < sessionItems.value.length - 1) {
      currentIndex.value++
      isFlipped.value = false
    } else {
      sessionComplete.value = true
      userStore.completeSession()
      badgesStore.checkAllBadges()
      scheduleSave()
    }
  }, 600)
}

function restartSession() {
  initSession()
}

function goBack() {
  if (isKanaMode.value) {
    router.push(`/learn/${props.category}/overview`)
  } else {
    router.push('/learn')
  }
}

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="learn-session">
    <!-- Header -->
    <header class="session-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>{{ categoryTitle }}</h1>
      <span class="card-counter">
        {{ studyPhase ? `${studyIndex + 1} / ${studyCards.length}` : `${currentIndex + 1} / ${sessionItems.length}` }}
      </span>
    </header>

    <!-- Progress Bar -->
    <div class="progress-bar" style="margin: 0 16px 16px;">
      <div
        class="progress-bar-fill"
        :style="{ width: (studyPhase ? studyProgress : progress) + '%', background: 'var(--gradient-xp)' }"
      />
    </div>

    <!-- ==================== STUDY PHASE (beginner flashcards) ==================== -->
    <div v-if="studyPhase && studyCard" class="study-phase animate-fade-in">
      <div class="study-intro">
        <span class="study-badge">Lernen</span>
        <p class="study-hint">Schau dir das Zeichen an. Danach wird abgefragt.</p>
      </div>

      <div class="study-card">
        <span class="study-character jp">{{ studyCard.character }}</span>
        <span class="study-romaji">{{ studyCard.romaji }}</span>

        <div v-if="getStudyExamples(studyCard).length > 0" class="study-examples">
          <p class="study-examples-title">Beispielwörter</p>
          <div
            v-for="ex in getStudyExamples(studyCard)"
            :key="ex.word"
            class="study-example"
          >
            <span class="study-example-word jp">{{ ex.word }}</span>
            <span class="study-example-meaning">{{ ex.meaning }}</span>
          </div>
        </div>
      </div>

      <div class="study-counter">{{ studyIndex + 1 }} / {{ studyCards.length }}</div>

      <div class="study-actions">
        <button
          class="btn btn-secondary"
          :disabled="studyIndex === 0"
          @click="prevStudyCard"
        >
          Zurück
        </button>
        <button class="btn btn-primary" @click="nextStudyCard">
          {{ studyIndex < studyCards.length - 1 ? 'Weiter' : 'Los geht\'s!' }}
        </button>
      </div>

      <button class="btn-ghost study-skip" @click="skipStudy">Überspringen</button>
    </div>

    <!-- Session Complete -->
    <div v-if="!studyPhase && sessionComplete" class="session-complete animate-fade-in">
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
        Genauigkeit: {{ sessionItems.length > 0 ? Math.round((sessionCorrect / sessionItems.length) * 100) : 0 }}%
      </div>
      <div class="complete-actions">
        <button class="btn btn-primary" @click="restartSession">Nochmal üben</button>
        <button class="btn btn-secondary" @click="goBack">Zurück</button>
      </div>
    </div>

    <!-- ==================== KANA: Multiple Choice Mode ==================== -->
    <div v-else-if="!studyPhase && currentCard && isKanaMode && isKanaCard(currentCard)" class="kana-mc-container">
      <!-- Character Display: kana on top, learner picks the romaji -->
      <div class="kana-display" :class="answerFeedback ? `feedback-${answerFeedback}` : ''">
        <span class="kana-character jp">{{ currentCard.character }}</span>
        <!-- Tap-to-reveal hint (like Duolingo) when you're stuck -->
        <span v-if="kanaHintShown" class="kana-hint-romaji">{{ currentCard.romaji }}</span>
        <p v-if="!selectedOption" class="kana-prompt">Was ist die Lesung?</p>
      </div>

      <!-- Answer Options: romaji -->
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

      <!-- "Ich weiß nicht weiter" — reveals the reading without penalty -->
      <button
        v-if="!showExample && !selectedOption && !kanaHintShown"
        class="btn-ghost kana-hint-btn"
        @click="kanaHintShown = true"
      >
        💡 Ich weiß nicht weiter
      </button>

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

        <button class="btn btn-primary next-btn" @click="nextItem">
          Weiter →
        </button>
      </div>
    </div>

    <!-- ==================== COMBO: Reading Combination ==================== -->
    <div v-else-if="!studyPhase && isComboQuestion && isKanaMode" class="kana-mc-container">
      <div class="combo-badge badge badge-streak">🔗 Lese-Kombi</div>
      <div class="kana-display">
        <span class="kana-character jp">{{ comboKana }}</span>
        <p v-if="!comboChecked" class="kana-prompt">Wie liest man das?</p>
      </div>

      <div v-if="!comboChecked" class="mc-options">
        <button
          v-for="option in comboOptions"
          :key="option"
          class="mc-option"
          :class="{
            correct: comboChecked && option === comboCorrectRomaji,
            wrong: comboChecked && comboSelected === option && option !== comboCorrectRomaji,
          }"
          :disabled="comboChecked"
          @click="selectComboOption(option)"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="comboChecked" class="kana-example animate-slide-up">
        <div class="example-result">
          <span v-if="comboCorrect" class="result-icon">✅</span>
          <span v-else class="result-icon">❌</span>
          <span class="result-reading">{{ comboCorrectRomaji }}</span>
        </div>
        <button class="btn btn-primary next-btn" @click="nextItem">
          Weiter →
        </button>
      </div>
    </div>

    <!-- ==================== Kanji: Multi-Select Meaning Quiz ==================== -->
    <div v-else-if="currentCard && isKanjiCard(currentCard)" class="kanji-quiz-container">
      <div class="kanji-quiz-display" :class="answerFeedback ? `feedback-${answerFeedback}` : ''">
        <span class="kanji-quiz-char jp">{{ currentCard.character }}</span>
        <p class="kanji-quiz-meta">{{ currentCard.strokes }} Striche</p>
        <p v-if="!kanjiChecked" class="kanji-quiz-prompt">Wähle alle richtigen Bedeutungen:</p>
      </div>

      <div v-if="!kanjiShowDetail" class="kanji-options">
        <button
          v-for="option in kanjiMeaningOptions"
          :key="option"
          class="kanji-option"
          :class="{ selected: kanjiSelectedMeanings.has(option) }"
          @click="toggleKanjiMeaning(option)"
        >
          {{ option }}
        </button>
      </div>

      <button
        v-if="!kanjiChecked"
        class="btn btn-primary check-kanji-btn"
        :disabled="kanjiSelectedMeanings.size === 0"
        @click="checkKanjiMeanings"
      >Prüfen</button>

      <div v-if="kanjiShowDetail" class="kanji-feedback animate-slide-up">
        <p :class="kanjiCorrect ? 'fb-correct' : 'fb-wrong'">
          {{ kanjiCorrect ? '✅ Richtig!' : '❌ Nicht ganz' }}
        </p>
        <div class="kanji-detail card-flat">
          <p class="kanji-detail-meanings">{{ currentCard.meanings.join(', ') }}</p>
          <p class="kanji-detail-readings">
            <span class="reading-label">On:</span> {{ currentCard.onyomi.join(', ') }}
            <br />
            <span class="reading-label">Kun:</span> {{ currentCard.kunyomi.join(', ') }}
          </p>
          <div v-if="currentCard.examples.length > 0" class="kanji-detail-example">
            <span class="jp">{{ currentCard.examples[0].word }}</span>
            <span class="kanji-detail-example-reading">{{ currentCard.examples[0].reading }}</span>
            <span class="kanji-detail-example-meaning">{{ currentCard.examples[0].meaning }}</span>
          </div>
        </div>
        <button class="btn btn-primary next-btn" @click="nextKanjiCard">Weiter →</button>
      </div>
    </div>

    <!-- ==================== Flashcard Mode (Vocabulary only) ==================== -->
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

/* ===================== Kana Multiple Choice ===================== */
/* ===================== Study Phase (beginner flashcards) ===================== */
.study-phase {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

.study-intro {
  text-align: center;
}

.study-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: var(--gradient-xp);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.study-hint {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.study-card {
  width: 100%;
  max-width: 350px;
  padding: 32px 24px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.study-character {
  font-size: 6rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-primary);
}

.study-romaji {
  font-size: 2rem;
  font-weight: 600;
  color: var(--accent-primary);
  margin-bottom: 8px;
}

.study-examples {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.study-examples-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.study-example {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.study-example-word {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
}

.study-example-meaning {
  font-size: 1rem;
  color: var(--text-secondary);
}

.study-counter {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.study-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 350px;
}

.study-actions .btn {
  flex: 1;
}

.study-skip {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-decoration: underline;
}

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

.combo-badge {
  align-self: flex-start;
  margin-bottom: -8px;
}

/* Tap-to-reveal hint */
.kana-hint-romaji {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-top: 4px;
}

.kana-hint-btn {
  margin-top: 4px;
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

/* ===================== Kanji Multi-Select Quiz ===================== */
.kanji-quiz-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 20px;
}

.kanji-quiz-display {
  width: 100%;
  max-width: 350px;
  padding: 32px 24px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 2px solid transparent;
  transition: border-color var(--transition-fast);
}

.kanji-quiz-display.feedback-correct { border-color: var(--accent-success); }
.kanji-quiz-display.feedback-incorrect { border-color: var(--accent-primary); }

.kanji-quiz-char {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1.1;
}

.kanji-quiz-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.kanji-quiz-prompt {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

.kanji-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
  max-width: 350px;
}

.kanji-option {
  padding: 12px 20px;
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
  touch-action: manipulation;
}

.kanji-option:hover {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
}

.kanji-option.selected {
  border-color: var(--accent-primary);
  background: rgba(233, 69, 96, 0.15);
  color: var(--accent-primary);
  font-weight: 600;
}

.check-kanji-btn {
  width: 100%;
  max-width: 350px;
  padding: 14px;
  font-size: 1rem;
}

.check-kanji-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.kanji-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 350px;
}

.kanji-detail {
  width: 100%;
  text-align: center;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kanji-detail-meanings {
  font-size: 1.2rem;
  font-weight: 600;
}

.kanji-detail-readings {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.kanji-detail-example {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--bg-accent);
  font-size: 0.9rem;
}

.kanji-detail-example-reading {
  color: var(--text-secondary);
}

.kanji-detail-example-meaning {
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* ===================== Flashcard Mode (Vocab) ===================== */
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
