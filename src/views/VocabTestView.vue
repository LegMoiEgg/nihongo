<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { useBadgesStore } from '../stores/badges'
import { scheduleSave } from '../stores/sync'
import { playCorrectSound, playWrongSound } from '../composables/useSounds'
import { vocabularyData, type VocabCard } from '../data/vocabulary'
import { hiraganaData, type KanaCard } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData, type KanjiCard } from '../data/kanji'
import { generateDynamicSentences, type SentenceChallenge } from '../data/sentence-generator'
import { useSentenceBlocks } from '../composables/useSentenceBlocks'

const userStore = useUserStore()
const learningStore = useLearningStore()
const badgesStore = useBadgesStore()
learningStore.initialize()

type TestMode = 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'mixed'

interface TestQuestion {
  id: string
  type: 'mc' | 'multi-select' | 'sentence'
  prompt: string
  promptJp?: string
  correctAnswer?: string
  correctAnswers?: string[]  // for multi-select
  options?: string[]
  sentence?: SentenceChallenge
}

// ── State ──
const testMode = ref<TestMode | null>(null)
const testStarted = ref(false)
const currentIndex = ref(0)
const questions = ref<TestQuestion[]>([])
const selectedAnswer = ref<string | null>(null)
const selectedMulti = ref<Set<string>>(new Set())
const sentenceBlocks = useSentenceBlocks()
const isChecked = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const totalXp = ref(0)
const testComplete = ref(false)
const timeLeft = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progress = computed(() => questions.value.length > 0 ? Math.round((currentIndex.value / questions.value.length) * 100) : 0)
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

// ── Test mode descriptions ──
const testModes = computed(() => [
  { id: 'hiragana' as TestMode, icon: 'あ', label: 'Hiragana', desc: 'Teste deine Hiragana-Kenntnisse', available: getLearnedKana('hiragana').length >= 5 },
  { id: 'katakana' as TestMode, icon: 'ア', label: 'Katakana', desc: 'Teste deine Katakana-Kenntnisse', available: getLearnedKana('katakana').length >= 5 },
  { id: 'kanji' as TestMode, icon: '漢', label: 'Kanji', desc: 'Teste Kanji-Bedeutungen & Lesungen', available: userStore.currentLevel.level >= 15 },
  { id: 'vocabulary' as TestMode, icon: '📝', label: 'Vokabeln', desc: 'Teste gelernte Vokabeln', available: getLearnedVocab().length >= 4 },
  { id: 'mixed' as TestMode, icon: '🎯', label: 'Gemischt', desc: 'Alles: Kana, Vokabeln, Sätze & mehr', available: getLearnedVocab().length >= 4 },
])

function getLearnedKana(type: 'hiragana' | 'katakana'): KanaCard[] {
  const all = type === 'hiragana' ? hiraganaData : katakanaData
  return all.filter(c => {
    const p = learningStore.cardProgress.find(cp => cp.id === c.id)
    return p && p.status !== 'new'
  })
}

function getLearnedVocab(): VocabCard[] {
  return vocabularyData.filter(v => {
    const p = learningStore.cardProgress.find(c => c.id === v.id)
    return p && p.status !== 'new'
  })
}

// ── Question generators per mode ──
function generateHiraganaQuestions(): TestQuestion[] {
  return generateKanaQuestions('hiragana')
}

function generateKatakanaQuestions(): TestQuestion[] {
  return generateKanaQuestions('katakana')
}

function generateKanaQuestions(type: 'hiragana' | 'katakana'): TestQuestion[] {
  const learned = getLearnedKana(type)
  const all = type === 'hiragana' ? hiraganaData : katakanaData
  const qs: TestQuestion[] = []

  // Kana → Romaji
  for (const card of shuffle(learned).slice(0, 10)) {
    const wrong = shuffle(all.filter(k => k.romaji !== card.romaji)).slice(0, 3).map(k => k.romaji)
    qs.push({ id: `k2r-${card.id}`, type: 'mc', prompt: 'Wie liest man dieses Zeichen?', promptJp: card.character, correctAnswer: card.romaji, options: shuffle([card.romaji, ...wrong]) })
  }
  // Romaji → Kana
  for (const card of shuffle(learned).slice(0, 10)) {
    const wrong = shuffle(all.filter(k => k.character !== card.character)).slice(0, 3).map(k => k.character)
    qs.push({ id: `r2k-${card.id}`, type: 'mc', prompt: `Welches Zeichen ist "${card.romaji}"?`, correctAnswer: card.character, options: shuffle([card.character, ...wrong]) })
  }

  return shuffle(qs)
}

function generateKanjiQuestions(): TestQuestion[] {
  const qs: TestQuestion[] = []
  const pool = shuffle(kanjiData)

  // Kanji → Meaning (multi-select)
  for (const k of pool.slice(0, 8)) {
    const wrong = shuffle(kanjiData.filter(x => x.id !== k.id)).flatMap(x => x.meanings).slice(0, Math.max(4, 6 - k.meanings.length))
    qs.push({ id: `km-${k.id}`, type: 'multi-select', prompt: 'Wähle alle Bedeutungen:', promptJp: k.character, correctAnswers: k.meanings, options: shuffle([...k.meanings, ...wrong]) })
  }
  // Kanji → Reading
  for (const k of pool.slice(8, 14)) {
    const correct = k.kunyomi[0] || k.onyomi[0]
    const wrong = shuffle(kanjiData.filter(x => x.id !== k.id)).slice(0, 3).map(x => x.kunyomi[0] || x.onyomi[0])
    qs.push({ id: `kr-${k.id}`, type: 'mc', prompt: 'Wie liest man dieses Kanji?', promptJp: k.character, correctAnswer: correct, options: shuffle([correct, ...wrong]) })
  }

  return shuffle(qs)
}

function generateVocabQuestions(): TestQuestion[] {
  const learned = getLearnedVocab()
  const qs: TestQuestion[] = []

  for (const v of shuffle(learned)) {
    // DE → JP
    const wrongJp = shuffle(learned.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.reading)
    qs.push({ id: `dj-${v.id}`, type: 'mc', prompt: v.meaning, promptJp: undefined, correctAnswer: v.reading, options: shuffle([v.reading, ...wrongJp]) })
    // JP → DE
    const wrongDe = shuffle(learned.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.meaning)
    qs.push({ id: `jd-${v.id}`, type: 'mc', prompt: 'Was bedeutet dieses Wort?', promptJp: v.reading, correctAnswer: v.meaning, options: shuffle([v.meaning, ...wrongDe]) })
  }

  return shuffle(qs)
}

function generateMixedQuestions(): TestQuestion[] {
  const qs: TestQuestion[] = []

  // Some kana
  const hiraLearned = getLearnedKana('hiragana')
  if (hiraLearned.length >= 3) {
    for (const card of shuffle(hiraLearned).slice(0, 4)) {
      const wrong = shuffle(hiraganaData.filter(k => k.romaji !== card.romaji)).slice(0, 3).map(k => k.romaji)
      qs.push({ id: `mx-h-${card.id}`, type: 'mc', prompt: 'Wie liest man das?', promptJp: card.character, correctAnswer: card.romaji, options: shuffle([card.romaji, ...wrong]) })
    }
  }

  // Vocab both directions
  const learned = getLearnedVocab()
  for (const v of shuffle(learned).slice(0, 6)) {
    const wrongJp = shuffle(learned.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.reading)
    qs.push({ id: `mx-vdj-${v.id}`, type: 'mc', prompt: `Was heißt "${v.meaning}"?`, correctAnswer: v.reading, options: shuffle([v.reading, ...wrongJp]) })
  }
  for (const v of shuffle(learned).slice(0, 4)) {
    const wrongDe = shuffle(learned.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.meaning)
    qs.push({ id: `mx-vjd-${v.id}`, type: 'mc', prompt: 'Was bedeutet das?', promptJp: v.reading, correctAnswer: v.meaning, options: shuffle([v.meaning, ...wrongDe]) })
  }

  // Sentences (if level 10+)
  if (userStore.currentLevel.level >= 10) {
    const learnedIds = learned.map(v => v.id)
    const sentences = generateDynamicSentences(learnedIds, 3)
    for (const s of sentences) {
      qs.push({ id: `mx-s-${s.id}`, type: 'sentence', prompt: s.meaning, sentence: s })
    }
  }

  // Kanji (if level 15+)
  if (userStore.currentLevel.level >= 15) {
    for (const k of shuffle(kanjiData).slice(0, 3)) {
      const wrong = shuffle(kanjiData.filter(x => x.id !== k.id)).slice(0, 3).map(x => x.meanings[0])
      qs.push({ id: `mx-k-${k.id}`, type: 'mc', prompt: 'Was bedeutet dieses Kanji?', promptJp: k.character, correctAnswer: k.meanings[0], options: shuffle([k.meanings[0], ...wrong]) })
    }
  }

  return shuffle(qs)
}

// ── Test lifecycle ──
function selectMode(mode: TestMode) {
  testMode.value = mode
}

function startTest() {
  if (!testMode.value) return

  switch (testMode.value) {
    case 'hiragana': questions.value = generateHiraganaQuestions(); break
    case 'katakana': questions.value = generateKatakanaQuestions(); break
    case 'kanji': questions.value = generateKanjiQuestions(); break
    case 'vocabulary': questions.value = generateVocabQuestions(); break
    case 'mixed': questions.value = generateMixedQuestions(); break
  }

  if (questions.value.length === 0) return

  currentIndex.value = 0
  score.value = 0
  totalXp.value = 0
  testComplete.value = false
  testStarted.value = true
  resetQuestionState()
  timeLeft.value = 15 * 60
  startTimer()
}

function resetQuestionState() {
  selectedAnswer.value = null
  selectedMulti.value = new Set()
  isChecked.value = false
  isCorrect.value = false

  const q = currentQuestion.value
  if (q?.type === 'sentence' && q.sentence) {
    sentenceBlocks.initBlocks(q.sentence.correctOrder, q.sentence.distractors || [])
  }
}

function selectMcAnswer(option: string) {
  if (isChecked.value) return
  selectedAnswer.value = option
  isChecked.value = true
  isCorrect.value = option === currentQuestion.value?.correctAnswer

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

function toggleMulti(option: string) {
  if (isChecked.value) return
  const s = new Set(selectedMulti.value)
  s.has(option) ? s.delete(option) : s.add(option)
  selectedMulti.value = s
}

function checkMulti() {
  if (isChecked.value || selectedMulti.value.size === 0) return
  isChecked.value = true
  const correct = currentQuestion.value?.correctAnswers || []
  isCorrect.value = correct.every(m => selectedMulti.value.has(m)) && selectedMulti.value.size === correct.length

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

function checkSentence() {
  const q = currentQuestion.value
  if (!q?.sentence || sentenceBlocks.selectedBlocks.value.length === 0) return
  isChecked.value = true
  sentenceBlocks.lock()
  const correct = q.sentence.correctOrder
  isCorrect.value = sentenceBlocks.selectedBlocks.value.length === correct.length && sentenceBlocks.selectedBlocks.value.every((b, i) => b === correct[i])

  if (isCorrect.value) {
    score.value++
    const xp = userStore.xpPerCorrect
    totalXp.value += xp
    userStore.addXp(xp)
    playCorrectSound()
  } else {
    playWrongSound()
  }
}

function showSentenceAnswer() {
  const q = currentQuestion.value
  if (q?.sentence) sentenceBlocks.showCorrectAnswer(q.sentence.correctOrder, q.sentence.distractors)
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    resetQuestionState()
  } else {
    finishTest()
  }
}

function finishTest() {
  testComplete.value = true
  if (timer) { clearInterval(timer); timer = null }
  userStore.completeSession()
  badgesStore.checkAllBadges()
  badgesStore.checkPerfectTest(score.value, questions.value.length)
  scheduleSave()
}

function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => { timeLeft.value--; if (timeLeft.value <= 0) finishTest() }, 1000)
}

function backToSelect() {
  testStarted.value = false
  testMode.value = null
  if (timer) { clearInterval(timer); timer = null }
}

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="vocab-test">
    <!-- Mode Selection -->
    <div v-if="!testStarted" class="test-select animate-fade-in">
      <div class="select-header">
        <div class="select-icon">📝</div>
        <h1>Test</h1>
        <p>Wähle einen Testtyp</p>
      </div>

      <div class="mode-list">
        <button
          v-for="mode in testModes"
          :key="mode.id"
          class="mode-card card"
          :class="{ selected: testMode === mode.id, disabled: !mode.available }"
          :disabled="!mode.available"
          @click="selectMode(mode.id)"
        >
          <span class="mode-icon jp">{{ mode.icon }}</span>
          <div class="mode-info">
            <span class="mode-label">{{ mode.label }}</span>
            <span class="mode-desc">{{ mode.available ? mode.desc : '🔒 Noch nicht freigeschaltet' }}</span>
          </div>
        </button>
      </div>

      <button class="btn btn-primary start-btn" :disabled="!testMode" @click="startTest">
        Test starten
      </button>
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
        <div class="complete-stat"><span class="stat-number xp">+{{ totalXp }}</span><span>XP</span></div>
      </div>
      <div class="grade-message">
        <template v-if="score >= questions.length * 0.9">🌟 Ausgezeichnet!</template>
        <template v-else-if="score >= questions.length * 0.7">👍 Gut gemacht!</template>
        <template v-else-if="score >= questions.length * 0.5">📚 Nicht schlecht, übe weiter!</template>
        <template v-else>💪 Übung macht den Meister!</template>
      </div>
      <div class="complete-actions">
        <button class="btn btn-primary" @click="startTest">Nochmal</button>
        <button class="btn btn-secondary" @click="backToSelect">Anderer Test</button>
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
        <!-- MC Question -->
        <template v-if="currentQuestion.type === 'mc'">
          <div class="question-prompt card-flat">
            <p class="question-text">{{ currentQuestion.prompt }}</p>
            <p v-if="currentQuestion.promptJp" class="question-jp jp">{{ currentQuestion.promptJp }}</p>
          </div>
          <div class="mc-options">
            <button
              v-for="option in currentQuestion.options" :key="option"
              class="mc-option" :class="{ 'jp': !currentQuestion.promptJp, correct: isChecked && option === currentQuestion.correctAnswer, wrong: isChecked && selectedAnswer === option && option !== currentQuestion.correctAnswer, dimmed: isChecked && option !== currentQuestion.correctAnswer && selectedAnswer !== option }"
              :disabled="isChecked" @click="selectMcAnswer(option)"
            >{{ option }}</button>
          </div>
        </template>

        <!-- Multi-Select Question (Kanji meanings) -->
        <template v-else-if="currentQuestion.type === 'multi-select'">
          <div class="question-prompt card-flat">
            <p class="question-text">{{ currentQuestion.prompt }}</p>
            <p v-if="currentQuestion.promptJp" class="question-jp jp">{{ currentQuestion.promptJp }}</p>
          </div>
          <div v-if="!isChecked" class="mc-options">
            <button
              v-for="option in currentQuestion.options" :key="option"
              class="mc-option" :class="{ selected: selectedMulti.has(option) }"
              @click="toggleMulti(option)"
            >{{ option }}</button>
          </div>
          <div v-else class="mc-options">
            <button
              v-for="option in currentQuestion.options" :key="option"
              class="mc-option" :class="{ correct: currentQuestion.correctAnswers?.includes(option), wrong: selectedMulti.has(option) && !currentQuestion.correctAnswers?.includes(option), dimmed: !selectedMulti.has(option) && !currentQuestion.correctAnswers?.includes(option) }"
              disabled
            >{{ option }}</button>
          </div>
          <button v-if="!isChecked" class="btn btn-primary check-btn" :disabled="selectedMulti.size === 0" @click="checkMulti">Prüfen</button>
        </template>

        <!-- Sentence Question -->
        <template v-else-if="currentQuestion.type === 'sentence' && currentQuestion.sentence">
          <div class="question-prompt card-flat">
            <p class="question-text">Übersetze: {{ currentQuestion.sentence.meaning }}</p>
          </div>
          <div class="sentence-answer" :class="{ 'is-correct': isChecked && isCorrect, 'is-wrong': isChecked && !isCorrect }">
            <div class="answer-blocks">
              <button v-for="(block, i) in sentenceBlocks.selectedBlocks.value" :key="'s-'+i" class="word-block selected jp" :class="{ disabled: isChecked, swapping: sentenceBlocks.swapIndex.value === i }" @click="sentenceBlocks.tapPlacedBlock(i)" @dblclick="sentenceBlocks.removePlacedBlock(i)">{{ block }}</button>
              <span v-if="sentenceBlocks.selectedBlocks.value.length === 0" class="answer-placeholder">Tippe auf die Wörter</span>
            </div>
          </div>
          <div class="block-pool">
            <button v-for="(block, i) in sentenceBlocks.availableBlocks.value" :key="'a-'+i" class="word-block available jp" :class="{ disabled: isChecked }" @click="sentenceBlocks.selectBlock(i)">{{ block }}</button>
          </div>
          <button v-if="!isChecked" class="btn btn-primary check-btn" :disabled="sentenceBlocks.selectedBlocks.value.length === 0" @click="checkSentence">Prüfen</button>
        </template>

        <!-- Feedback -->
        <div v-if="isChecked" class="question-feedback animate-slide-up">
          <p v-if="isCorrect" class="feedback-text correct">✅ Richtig!</p>
          <template v-else>
            <p class="feedback-text wrong">❌ Falsch</p>
            <p v-if="currentQuestion.correctAnswer" class="feedback-detail">Richtig: <span class="jp">{{ currentQuestion.correctAnswer }}</span></p>
            <p v-else-if="currentQuestion.correctAnswers" class="feedback-detail">Richtig: {{ currentQuestion.correctAnswers.join(', ') }}</p>
            <template v-if="currentQuestion.type === 'sentence' && currentQuestion.sentence">
              <button class="btn-ghost" @click="showSentenceAnswer" style="margin-top:4px">Lösung zeigen</button>
              <p class="feedback-detail jp">{{ currentQuestion.sentence.correctOrder.join(' ') }}</p>
            </template>
          </template>
          <button class="btn btn-primary" @click="nextQuestion">{{ currentIndex < questions.length - 1 ? 'Weiter →' : 'Test beenden' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vocab-test { max-width: 600px; margin: 0 auto; min-height: calc(100vh - var(--nav-height)); display: flex; flex-direction: column; }

/* Mode Selection */
.test-select { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 24px 16px; gap: 20px; }
.select-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.select-icon { font-size: 3rem; }
.select-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.select-header p { color: var(--text-secondary); font-size: 0.9rem; }

.mode-list { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.mode-card { display: flex; align-items: center; gap: 14px; cursor: pointer; border: 2px solid transparent; transition: all var(--transition-fast); }
.mode-card.selected { border-color: var(--accent-primary); background: rgba(233, 69, 96, 0.08); }
.mode-card.disabled { opacity: 0.4; cursor: not-allowed; }
.mode-card.disabled:hover { transform: none; box-shadow: var(--shadow-card); }
.mode-icon { font-size: 1.8rem; width: 48px; text-align: center; flex-shrink: 0; }
.mode-info { display: flex; flex-direction: column; gap: 2px; }
.mode-label { font-weight: 600; font-size: 0.95rem; color: var(--text-primary); }
.mode-desc { font-size: 0.8rem; color: var(--text-muted); }

.start-btn { width: 100%; padding: 14px; font-size: 1.05rem; margin-top: 8px; }
.start-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Test Header */
.test-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
.test-timer { font-weight: 600; font-size: 0.9rem; }
.test-timer.low-time { color: var(--accent-primary); animation: pulse 1s infinite; }
.test-progress-text { color: var(--text-muted); font-size: 0.85rem; }
.test-score { font-weight: 600; font-size: 0.9rem; }

/* Question */
.question-area { flex: 1; padding: 0 16px 16px; display: flex; flex-direction: column; gap: 16px; }
.question-prompt { text-align: center; padding: 20px; }
.question-text { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); }
.question-jp { font-size: 2.5rem; font-weight: 700; margin-top: 8px; line-height: 1.2; color: var(--text-primary); }

/* MC Options */
.mc-options { display: flex; flex-direction: column; gap: 10px; }
.mc-option { padding: 16px 20px; background: var(--bg-card); border: 2px solid var(--bg-accent); border-radius: var(--radius-md); color: var(--text-primary); font-size: 1.05rem; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); text-align: left; font-family: 'Noto Sans JP', 'Inter', sans-serif; touch-action: manipulation; }
.mc-option:hover:not(:disabled) { border-color: var(--accent-primary); background: var(--bg-card-hover); }
.mc-option.selected { border-color: var(--accent-primary); background: rgba(233, 69, 96, 0.15); color: var(--accent-primary); }
.mc-option.correct { border-color: var(--accent-success); background: rgba(0, 200, 83, 0.12); color: var(--accent-success); opacity: 1 !important; }
.mc-option.wrong { border-color: var(--accent-primary); background: rgba(233, 69, 96, 0.12); color: var(--accent-primary); animation: shake 0.35s ease; }
.mc-option.dimmed { opacity: 0.4; }
.mc-option:disabled { cursor: default; }

.check-btn { width: 100%; padding: 14px; font-size: 1rem; }
.check-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Sentence */
.sentence-answer { min-height: 64px; background: var(--bg-card); border: 2px dashed var(--bg-accent); border-radius: var(--radius-md); padding: 12px; transition: all var(--transition-fast); }
.sentence-answer.is-correct { border-color: var(--accent-success); }
.sentence-answer.is-wrong { border-color: var(--accent-primary); }
.answer-blocks { display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px; align-items: center; }
.answer-placeholder { color: var(--text-muted); font-size: 0.9rem; width: 100%; text-align: center; }
.block-pool { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.word-block { padding: 10px 18px; border-radius: var(--radius-sm); font-size: 1.05rem; font-weight: 500; cursor: pointer; border: none; transition: all var(--transition-fast); touch-action: manipulation; font-family: 'Noto Sans JP', 'Inter', sans-serif; }
.word-block.available { background: var(--bg-accent); color: var(--text-primary); }
.word-block.selected { background: var(--gradient-accent); color: white; }
.word-block.selected.swapping { border: 2px solid var(--accent-warning); box-shadow: 0 0 8px rgba(255, 152, 0, 0.4); transform: scale(1.05); }
.word-block.disabled { pointer-events: none; opacity: 0.7; }

/* Feedback */
.question-feedback { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px 0; }
.feedback-text { font-size: 1.1rem; font-weight: 600; }
.feedback-text.correct { color: var(--accent-success); }
.feedback-text.wrong { color: var(--accent-primary); }
.feedback-detail { color: var(--text-secondary); font-size: 0.95rem; }
.question-feedback .btn { width: 100%; margin-top: 4px; padding: 14px; }

/* Complete */
.test-complete { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; gap: 20px; text-align: center; }
.complete-icon { font-size: 4rem; }
.test-complete h2 { font-size: 1.5rem; font-weight: 700; }
.score-circle { display: flex; flex-direction: column; align-items: center; width: 140px; height: 140px; border-radius: 50%; background: var(--bg-card); border: 4px solid var(--accent-primary); justify-content: center; }
.score-value { font-size: 2.2rem; font-weight: 700; }
.score-label { color: var(--text-secondary); font-size: 0.9rem; }
.complete-stats { display: flex; gap: 32px; }
.complete-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.85rem; color: var(--text-secondary); }
.stat-number { font-size: 2rem; font-weight: 700; }
.stat-number.xp { color: var(--accent-warning); }
.grade-message { color: var(--text-secondary); font-size: 1rem; }
.complete-actions { display: flex; gap: 12px; margin-top: 8px; }
</style>
