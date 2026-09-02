<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { useBadgesStore } from '../stores/badges'
import { scheduleSave } from '../stores/sync'
import { playCorrectSound, playWrongSound } from '../composables/useSounds'
import { vocabularyData, type VocabCard } from '../data/vocabulary'
import { hiraganaData, type KanaCard } from '../data/hiragana'
import { kanjiData, type KanjiCard } from '../data/kanji'
import { generateDynamicSentences, type SentenceChallenge } from '../data/sentence-generator'
import { useSentenceBlocks } from '../composables/useSentenceBlocks'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
const badgesStore = useBadgesStore()
learningStore.initialize()

const level = computed(() => userStore.currentLevel.level)

// ── Display mode for vocab: should we show kanji or only hiragana? ──
// Level 1-4: hiragana only
// Level 5+:  kanji with furigana
const showKanjiForm = computed(() => level.value >= 15)

/**
 * Returns the display form of a vocab word depending on current level.
 * Low levels → reading (pure hiragana), high levels → japanese (kanji form).
 */
function vocabDisplay(v: VocabCard): string {
  return showKanjiForm.value ? v.japanese : v.reading
}

/** Whether this vocab has a kanji form different from its reading */
function vocabHasFurigana(v: VocabCard): boolean {
  return showKanjiForm.value && v.japanese !== v.reading
}

// ── Exercise types ──
type ExerciseType = 'kana-char' | 'kana-romaji' | 'vocab-study' | 'vocab-de-jp' | 'vocab-jp-de' | 'kanji-meaning' | 'kanji-reading' | 'sentence'

interface Exercise {
  type: ExerciseType
  isNewWord?: boolean
  isRetry?: boolean  // requeued after a wrong answer — no XP on retries
  vocab?: VocabCard
  vocabOptions?: string[]
  kanji?: KanjiCard
  kanjiOptions?: string[]
  sentence?: SentenceChallenge
  kana?: KanaCard
  kanaOptions?: string[]
}

// ── State ──
const exercises = ref<Exercise[]>([])
const currentIndex = ref(0)
const score = ref(0)
const totalXp = ref(0)
const sessionComplete = ref(false)
const newWordsInSession = ref(0)
const originalCount = ref(0) // exercise count before any retries were requeued

// MC state
const selectedMcAnswer = ref<string | null>(null)
const mcChecked = ref(false)
const mcCorrect = ref(false)
const kanaHintShown = ref(false) // tap-to-reveal romaji hint when stuck

// Sentence state
const sentenceBlocks = useSentenceBlocks()
const sentenceChecked = ref(false)
const sentenceCorrect = ref(false)
const showHint = ref(false)

const currentExercise = computed(() => exercises.value[currentIndex.value])
const progress = computed(() => {
  if (exercises.value.length === 0) return 0
  return Math.round((currentIndex.value / exercises.value.length) * 100)
})

/** Mastery progress for current vocab card (0-5) */
const currentMasteryProgress = computed(() => {
  const ex = currentExercise.value
  if (!ex?.vocab) return 0
  return Math.min(learningStore.getConsecutiveCorrect(ex.vocab.id), learningStore.MASTERY_STREAK)
})

// ── Helpers ──
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Generate exercises based on level ──
// Level 1-4: Kana only (Hiragana + Katakana recognition)
// Level 5-9: Kana + Vocabulary
// Level 10+: Vocab + Sentences
// Level 15+: Vocab + Sentences + Kanji
function generateExercises(): Exercise[] {
  const result: Exercise[] = []
  const lvl = level.value

  // ── Level 1-4: KANA ONLY, row-by-row curriculum ──
  // Beginners practise the SAME rows as their current Hiragana lesson, in the
  // curriculum order (A, K, S, mixed, …) — never cross-wise across all kana.
  // Always kana-on-top → pick romaji, matching the learn sessions.
  if (lvl <= 4) {
    const allHira = hiraganaData.filter(h => h.group !== 'Sokuon')

    // Which rows is the learner currently on? Use the curriculum.
    const lessonIds = new Set(
      learningStore.getCurriculumCardIds(
        allHira.map(c => ({ id: c.id, group: c.group }))
      )
    )
    let lessonCards = allHira.filter(c => lessonIds.has(c.id))

    // Initialize progress for these kana
    for (const card of lessonCards) {
      learningStore.getOrCreateProgress(card.id, 'hiragana')
    }

    // Short rows (e.g. Y-row = 3 chars) are topped up with a review of
    // already-learned kana so the daily lesson isn't over in 3 questions.
    const MIN_KANA = 10
    let pool = shuffle(lessonCards)
    if (pool.length < MIN_KANA) {
      const learned = allHira.filter(c => {
        if (lessonIds.has(c.id)) return false
        const p = learningStore.cardProgress.find(cp => cp.id === c.id)
        return p && p.status !== 'new'
      })
      pool = [...pool, ...shuffle(learned).slice(0, MIN_KANA - pool.length)]
    }
    // If still under the minimum (brand-new learner with almost nothing seen),
    // repeat the current row so the lesson has a bit of substance.
    while (pool.length < 6 && lessonCards.length > 0) {
      pool = [...pool, ...shuffle(lessonCards)]
    }

    for (const card of pool) {
      const wrong = shuffle(allHira.filter(h => h.romaji !== card.romaji))
        .slice(0, 3).map(h => h.romaji)
      result.push({
        type: 'kana-romaji',
        kana: card,
        kanaOptions: shuffle([card.romaji, ...wrong]),
      })
    }

    return shuffle(result)
  }

  // ── Level 5+: Vocabulary (+ sentences + kanji at higher levels) ──
  const allVocabIds = vocabularyData.map(v => v.id)
  const vocabSlots = learningStore.getVocabForDailyLesson(allVocabIds, lvl, 10)
  const vocabCards = vocabSlots
    .map(slot => {
      const card = vocabularyData.find(v => v.id === slot.id)
      return card ? { card, isNew: slot.isNew } : null
    })
    .filter((v): v is { card: VocabCard; isNew: boolean } => v !== null)

  newWordsInSession.value = vocabCards.filter(v => v.isNew).length

  // Every vocab word in BOTH directions
  for (const { card, isNew } of vocabCards) {
    // For a brand-new word, show a flashcard first (word + reading + meaning)
    // so it isn't quizzed cold — like the kana study cards.
    if (isNew) {
      result.push({ type: 'vocab-study', isNewWord: true, vocab: card })
    }

    const wrongJp = shuffle(vocabularyData.filter(v => v.id !== card.id))
      .slice(0, 3).map(v => vocabDisplay(v))
    result.push({
      type: 'vocab-de-jp',
      isNewWord: isNew,
      vocab: card,
      vocabOptions: shuffle([vocabDisplay(card), ...wrongJp]),
    })

    const wrongDe = shuffle(vocabularyData.filter(v => v.id !== card.id))
      .slice(0, 3).map(v => v.meaning)
    result.push({
      type: 'vocab-jp-de',
      isNewWord: isNew,
      vocab: card,
      vocabOptions: shuffle([card.meaning, ...wrongDe]),
    })
  }

  // Sentences (level 10+)
  if (lvl >= 10) {
    const learnedIds = vocabCards.map(v => v.card.id)
    const sentenceCount = lvl >= 15 ? 5 : 3
    const generated = generateDynamicSentences(learnedIds, sentenceCount)
    for (const sentence of generated) {
      result.push({ type: 'sentence', sentence })
    }
  }

  // Kanji (level 15+)
  if (lvl >= 15) {
    const kanjiPool = shuffle(kanjiData)
    const kanjiCount = lvl >= 20 ? 4 : 3

    for (const kanji of kanjiPool.slice(0, kanjiCount)) {
      const wrong = shuffle(kanjiData.filter(k => k.id !== kanji.id))
        .slice(0, 3).map(k => k.meanings[0])
      result.push({
        type: 'kanji-meaning',
        kanji,
        kanjiOptions: shuffle([kanji.meanings[0], ...wrong]),
      })
    }

    if (lvl >= 17) {
      for (const kanji of kanjiPool.slice(kanjiCount, kanjiCount + 3)) {
        const correctReading = kanji.kunyomi[0] || kanji.onyomi[0]
        const wrong = shuffle(kanjiData.filter(k => k.id !== kanji.id))
          .slice(0, 3).map(k => k.kunyomi[0] || k.onyomi[0])
        result.push({
          type: 'kanji-reading',
          kanji,
          kanjiOptions: shuffle([correctReading, ...wrong]),
        })
      }
    }
  }

  // Study cards for new words come FIRST (learn before quizzing), keeping
  // their generated order. Then: DE→JP block, JP→DE block, mixed rest.
  const study = result.filter(e => e.type === 'vocab-study')
  const deJp = shuffle(result.filter(e => e.type === 'vocab-de-jp'))
  const jpDe = shuffle(result.filter(e => e.type === 'vocab-jp-de'))
  const rest = shuffle(result.filter(e =>
    e.type !== 'vocab-study' && e.type !== 'vocab-de-jp' && e.type !== 'vocab-jp-de'
  ))

  // Interleave: study first, then DE→JP block, some rest, JP→DE block, remaining rest
  const restHalf = Math.ceil(rest.length / 2)
  return [
    ...study,
    ...deJp,
    ...rest.slice(0, restHalf),
    ...jpDe,
    ...rest.slice(restHalf),
  ]
}

// ── Session lifecycle ──
function initSession() {
  exercises.value = generateExercises()
  // Study cards aren't questions → don't count them in the accuracy total.
  originalCount.value = exercises.value.filter(e => e.type !== 'vocab-study').length
  currentIndex.value = 0
  score.value = 0
  totalXp.value = 0
  sessionComplete.value = false
  resetCurrentState()
}

function resetCurrentState() {
  selectedMcAnswer.value = null
  mcChecked.value = false
  mcCorrect.value = false
  kanaHintShown.value = false
  sentenceChecked.value = false
  sentenceCorrect.value = false
  showHint.value = false

  const ex = currentExercise.value
  if (ex?.type === 'sentence' && ex.sentence) {
    sentenceBlocks.initBlocks(ex.sentence.correctOrder, ex.sentence.distractors || [])
  }
}

// ── MC handlers ──
function getCorrectMcAnswer(): string {
  const ex = currentExercise.value
  if (!ex) return ''
  if (ex.type === 'kana-char' && ex.kana) return ex.kana.character
  if (ex.type === 'kana-romaji' && ex.kana) return ex.kana.romaji
  if (ex.type === 'vocab-de-jp') return vocabDisplay(ex.vocab!)
  if (ex.type === 'vocab-jp-de') return ex.vocab!.meaning
  if (ex.type === 'kanji-meaning') return ex.kanji!.meanings[0]
  if (ex.type === 'kanji-reading') return ex.kanji!.kunyomi[0] || ex.kanji!.onyomi[0]
  return ''
}

function selectMcOption(option: string) {
  if (mcChecked.value) return
  selectedMcAnswer.value = option
  mcChecked.value = true

  const correct = option === getCorrectMcAnswer()
  mcCorrect.value = correct

  const ex = currentExercise.value!
  if (correct) {
    // Retries (requeued after a wrong answer) don't grant XP or score again
    if (!ex.isRetry) {
      score.value++
      // Kana exercises always 1 XP, vocab/kanji use dynamic XP
      const xp = (ex.type === 'kana-char' || ex.type === 'kana-romaji') ? 1 : userStore.xpPerCorrect
      totalXp.value += xp
      userStore.addXp(xp, ex.type.startsWith('kana') ? 0 : 1)
    }
    playCorrectSound()
  } else {
    playWrongSound()
  }

  if (ex.vocab) learningStore.recordAnswer(ex.vocab.id, 'vocabulary', correct)
  if (ex.kanji) learningStore.recordAnswer(ex.kanji.id, 'kanji', correct)
  if (ex.kana) learningStore.recordAnswer(ex.kana.id, ex.kana.id.startsWith('h-') ? 'hiragana' : 'katakana', correct)
}

// ── Sentence handlers ──
function checkSentence() {
  const ex = currentExercise.value
  if (!ex?.sentence || sentenceBlocks.selectedBlocks.value.length === 0) return

  sentenceChecked.value = true
  sentenceBlocks.lock()
  const correct = ex.sentence.correctOrder
  sentenceCorrect.value =
    sentenceBlocks.selectedBlocks.value.length === correct.length &&
    sentenceBlocks.selectedBlocks.value.every((b, i) => b === correct[i])

  if (sentenceCorrect.value) {
    if (!ex.isRetry) {
      score.value++
      const xp = userStore.xpPerCorrect
      totalXp.value += xp
      userStore.addXp(xp)
    }
    playCorrectSound()
  } else {
    playWrongSound()
  }
}

function showSentenceAnswer() {
  const ex = currentExercise.value
  if (!ex?.sentence) return
  sentenceBlocks.showCorrectAnswer(ex.sentence.correctOrder, ex.sentence.distractors)
}

// ── Navigation ──
function nextExercise() {
  const ex = currentExercise.value
  // Study cards aren't answered → never requeue them.
  // If a real exercise was answered wrong, requeue it at the very end so it
  // comes back later — the learner must eventually get it right.
  const wasWrong =
    ex && ex.type !== 'vocab-study' &&
    (ex.type === 'sentence' ? !sentenceCorrect.value : !mcCorrect.value)
  if (ex && wasWrong) {
    exercises.value.push({ ...ex, isRetry: true })
  }

  if (currentIndex.value < exercises.value.length - 1) {
    currentIndex.value++
    resetCurrentState()
  } else {
    sessionComplete.value = true
    userStore.completeSession()
    badgesStore.checkAllBadges()
    scheduleSave()
  }
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="daily-lesson">
    <!-- Header -->
    <header class="lesson-header">
      <button class="btn-ghost back-btn" @click="goHome" aria-label="Zurück">‹</button>
      <h1>Tägliche Lektion</h1>
      <span class="counter">{{ currentIndex + 1 }} / {{ exercises.length }}</span>
    </header>

    <div class="progress-bar" style="margin: 0 16px 16px;">
      <div class="progress-bar-fill" :style="{ width: progress + '%', background: 'var(--gradient-xp)' }" />
    </div>

    <!-- ==================== SESSION COMPLETE ==================== -->
    <div v-if="sessionComplete" class="session-complete animate-fade-in">
      <div class="complete-icon">{{ score >= originalCount * 0.8 ? '🌟' : score >= originalCount * 0.5 ? '👏' : '💪' }}</div>
      <h2>Lektion geschafft!</h2>
      <div class="complete-stats">
        <div class="complete-stat">
          <span class="stat-number correct">{{ score }}</span>
          <span>Richtig</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number incorrect">{{ Math.max(0, originalCount - score) }}</span>
          <span>Falsch</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number xp">+{{ totalXp }}</span>
          <span>XP</span>
        </div>
      </div>
      <div class="complete-accuracy">
        Genauigkeit: {{ originalCount > 0 ? Math.round((score / originalCount) * 100) : 0 }}%
      </div>
      <p v-if="newWordsInSession > 0" class="new-words-info">
        🆕 {{ newWordsInSession }} neue Wörter in dieser Lektion
      </p>
      <div class="complete-actions">
        <button class="btn btn-primary" @click="initSession">Nochmal</button>
        <button class="btn btn-secondary" @click="goHome">Home</button>
      </div>
    </div>

    <!-- ==================== EXERCISES ==================== -->
    <div v-else-if="currentExercise" class="exercise-area">

      <!-- Exercise Type Badge + New Word indicator -->
      <div class="type-badge-row">
        <span v-if="currentExercise.type === 'kana-char'" class="badge badge-streak">あ Zeichen erkennen</span>
        <span v-else-if="currentExercise.type === 'kana-romaji'" class="badge badge-streak">あ → Lesung</span>
        <span v-else-if="currentExercise.type === 'vocab-de-jp'" class="badge badge-xp">🇩🇪 → 🇯🇵 Vokabel</span>
        <span v-else-if="currentExercise.type === 'vocab-jp-de'" class="badge badge-xp">🇯🇵 → 🇩🇪 Vokabel</span>
        <span v-else-if="currentExercise.type === 'kanji-meaning'" class="badge badge-level">漢字 Bedeutung</span>
        <span v-else-if="currentExercise.type === 'kanji-reading'" class="badge badge-level">漢字 Lesung</span>
        <span v-else-if="currentExercise.type === 'sentence'" class="badge badge-streak">🧩 Satz bauen</span>
        <span v-if="currentExercise.isNewWord && currentExercise.type !== 'vocab-study'" class="badge badge-new">🆕 Neues Wort</span>
        <span v-if="currentExercise.isRetry" class="badge badge-streak">🔁 Wiederholung</span>
      </div>

      <!-- Mastery dots for vocab (not on the study flashcard) -->
      <div v-if="currentExercise.vocab && currentExercise.type !== 'vocab-study' && !mcChecked" class="mastery-dots">
        <span
          v-for="i in learningStore.MASTERY_STREAK"
          :key="i"
          class="mastery-dot"
          :class="{ filled: i <= currentMasteryProgress }"
        />
        <span class="mastery-label">{{ currentMasteryProgress }}/{{ learningStore.MASTERY_STREAK }}</span>
      </div>

      <!-- ══════════ KANA: Show romaji, pick character ══════════ -->
      <template v-if="currentExercise.type === 'kana-char' && currentExercise.kana">
        <div class="prompt-card card-flat">
          <p class="prompt-label">Welches Zeichen ist das?</p>
          <p class="prompt-romaji">{{ currentExercise.kana.romaji }}</p>
        </div>
        <div class="mc-grid">
          <button
            v-for="option in currentExercise.kanaOptions" :key="option"
            class="mc-option mc-option-kana jp"
            :class="{ correct: mcChecked && option === currentExercise.kana!.character, wrong: mcChecked && selectedMcAnswer === option && option !== currentExercise.kana!.character, dimmed: mcChecked && option !== currentExercise.kana!.character && selectedMcAnswer !== option }"
            :disabled="mcChecked" @click="selectMcOption(option)"
          >{{ option }}</button>
        </div>
        <div v-if="mcChecked" class="feedback animate-slide-up">
          <p :class="mcCorrect ? 'fb-correct' : 'fb-wrong'">{{ mcCorrect ? '✅ Richtig!' : '❌ Falsch' }}</p>
          <div v-if="currentExercise.kana.example" class="fb-example">
            <span class="jp">{{ currentExercise.kana.example }}</span>
            <span class="fb-example-meaning">{{ currentExercise.kana.exampleMeaning }}</span>
          </div>
          <button class="btn btn-primary next-btn" @click="nextExercise">Weiter →</button>
        </div>
      </template>

      <!-- ══════════ KANA: Show character, pick romaji ══════════ -->
      <template v-else-if="currentExercise.type === 'kana-romaji' && currentExercise.kana">
        <div class="prompt-card card-flat">
          <p class="prompt-label">Wie liest man das?</p>
          <p class="prompt-text jp-large">{{ currentExercise.kana.character }}</p>
          <p v-if="kanaHintShown" class="prompt-hint-romaji">{{ currentExercise.kana.romaji }}</p>
        </div>
        <div class="mc-grid">
          <button
            v-for="option in currentExercise.kanaOptions" :key="option"
            class="mc-option"
            :class="{ correct: mcChecked && option === currentExercise.kana!.romaji, wrong: mcChecked && selectedMcAnswer === option && option !== currentExercise.kana!.romaji, dimmed: mcChecked && option !== currentExercise.kana!.romaji && selectedMcAnswer !== option }"
            :disabled="mcChecked" @click="selectMcOption(option)"
          >{{ option }}</button>
        </div>
        <button
          v-if="!mcChecked && !kanaHintShown"
          class="btn-ghost kana-hint-btn"
          @click="kanaHintShown = true"
        >💡 Ich weiß nicht weiter</button>
        <div v-if="mcChecked" class="feedback animate-slide-up">
          <p :class="mcCorrect ? 'fb-correct' : 'fb-wrong'">{{ mcCorrect ? '✅ Richtig!' : '❌ Falsch' }}</p>
          <div v-if="currentExercise.kana.example" class="fb-example">
            <span class="jp">{{ currentExercise.kana.example }}</span>
            <span class="fb-example-meaning">{{ currentExercise.kana.exampleMeaning }}</span>
          </div>
          <button class="btn btn-primary next-btn" @click="nextExercise">Weiter →</button>
        </div>
      </template>

      <!-- ══════════ VOCAB STUDY (flashcard for new words) ══════════ -->
      <template v-else-if="currentExercise.type === 'vocab-study' && currentExercise.vocab">
        <div class="vocab-study-intro">
          <span class="badge badge-new">🆕 Neues Wort</span>
          <p class="vocab-study-hint">Schau es dir an. Danach wird es abgefragt.</p>
        </div>
        <div class="vocab-study-card card-flat">
          <span class="vocab-study-word jp">{{ vocabDisplay(currentExercise.vocab) }}</span>
          <span v-if="vocabHasFurigana(currentExercise.vocab)" class="vocab-study-reading">
            {{ currentExercise.vocab.reading }}
          </span>
          <span class="vocab-study-meaning">{{ currentExercise.vocab.meaning }}</span>
        </div>
        <button class="btn btn-primary next-btn" @click="nextExercise">Verstanden →</button>
      </template>

      <!-- ══════════ VOCAB DE→JP ══════════ -->
      <template v-else-if="currentExercise.type === 'vocab-de-jp' && currentExercise.vocab">
        <div class="prompt-card card-flat">
          <p class="prompt-label">Was heißt das auf Japanisch?</p>
          <p class="prompt-text">{{ currentExercise.vocab.meaning }}</p>
        </div>
        <div class="mc-grid">
          <button
            v-for="option in currentExercise.vocabOptions"
            :key="option"
            class="mc-option jp"
            :class="{
              correct: mcChecked && option === vocabDisplay(currentExercise.vocab!),
              wrong: mcChecked && selectedMcAnswer === option && option !== vocabDisplay(currentExercise.vocab!),
              dimmed: mcChecked && option !== vocabDisplay(currentExercise.vocab!) && selectedMcAnswer !== option,
            }"
            :disabled="mcChecked"
            @click="selectMcOption(option)"
          >
            {{ option }}
          </button>
        </div>
        <div v-if="mcChecked" class="feedback animate-slide-up">
          <p :class="mcCorrect ? 'fb-correct' : 'fb-wrong'">
            {{ mcCorrect ? '✅ Richtig!' : '❌ Falsch' }}
          </p>
          <div class="fb-vocab-detail">
            <!-- Furigana display if kanji mode -->
            <div v-if="vocabHasFurigana(currentExercise.vocab)" class="furigana-display">
              <ruby class="jp furigana-word">
                {{ currentExercise.vocab.japanese }}
                <rt>{{ currentExercise.vocab.reading }}</rt>
              </ruby>
            </div>
            <p v-else class="fb-detail jp">{{ currentExercise.vocab.reading }}</p>
            <p class="fb-meaning">{{ currentExercise.vocab.meaning }}</p>
          </div>
          <button class="btn btn-primary next-btn" @click="nextExercise">Weiter →</button>
        </div>
      </template>

      <!-- ══════════ VOCAB JP→DE ══════════ -->
      <template v-else-if="currentExercise.type === 'vocab-jp-de' && currentExercise.vocab">
        <div class="prompt-card card-flat">
          <p class="prompt-label">Was bedeutet dieses Wort?</p>
          <!-- Furigana display for kanji mode -->
          <div v-if="vocabHasFurigana(currentExercise.vocab)" class="furigana-display prompt-furigana">
            <ruby class="jp furigana-word">
              {{ currentExercise.vocab.japanese }}
              <rt>{{ currentExercise.vocab.reading }}</rt>
            </ruby>
          </div>
          <p v-else class="prompt-text jp-large">{{ currentExercise.vocab.reading }}</p>
        </div>
        <div class="mc-grid">
          <button
            v-for="option in currentExercise.vocabOptions"
            :key="option"
            class="mc-option"
            :class="{
              correct: mcChecked && option === currentExercise.vocab!.meaning,
              wrong: mcChecked && selectedMcAnswer === option && option !== currentExercise.vocab!.meaning,
              dimmed: mcChecked && option !== currentExercise.vocab!.meaning && selectedMcAnswer !== option,
            }"
            :disabled="mcChecked"
            @click="selectMcOption(option)"
          >
            {{ option }}
          </button>
        </div>
        <div v-if="mcChecked" class="feedback animate-slide-up">
          <p :class="mcCorrect ? 'fb-correct' : 'fb-wrong'">
            {{ mcCorrect ? '✅ Richtig!' : '❌ Falsch' }}
          </p>
          <p class="fb-detail">{{ currentExercise.vocab.meaning }}</p>
          <button class="btn btn-primary next-btn" @click="nextExercise">Weiter →</button>
        </div>
      </template>

      <!-- ══════════ KANJI MEANING ══════════ -->
      <template v-else-if="currentExercise.type === 'kanji-meaning' && currentExercise.kanji">
        <div class="prompt-card card-flat">
          <p class="prompt-label">Was bedeutet dieses Kanji?</p>
          <div class="furigana-display prompt-furigana">
            <ruby class="jp furigana-kanji">
              {{ currentExercise.kanji.character }}
              <rt>{{ currentExercise.kanji.kunyomi[0] || currentExercise.kanji.onyomi[0] }}</rt>
            </ruby>
          </div>
        </div>
        <div class="mc-grid">
          <button
            v-for="option in currentExercise.kanjiOptions"
            :key="option"
            class="mc-option"
            :class="{
              correct: mcChecked && option === currentExercise.kanji!.meanings[0],
              wrong: mcChecked && selectedMcAnswer === option && option !== currentExercise.kanji!.meanings[0],
              dimmed: mcChecked && option !== currentExercise.kanji!.meanings[0] && selectedMcAnswer !== option,
            }"
            :disabled="mcChecked"
            @click="selectMcOption(option)"
          >
            {{ option }}
          </button>
        </div>
        <div v-if="mcChecked" class="feedback animate-slide-up">
          <p :class="mcCorrect ? 'fb-correct' : 'fb-wrong'">
            {{ mcCorrect ? '✅ Richtig!' : '❌ Falsch' }}
          </p>
          <div class="fb-kanji-detail">
            <span class="jp">{{ currentExercise.kanji.character }}</span>
            <span>= {{ currentExercise.kanji.meanings.join(', ') }}</span>
          </div>
          <p class="fb-readings">
            <span class="reading-label">On:</span> {{ currentExercise.kanji.onyomi.join(', ') }}
            ・ <span class="reading-label">Kun:</span> {{ currentExercise.kanji.kunyomi.join(', ') }}
          </p>
          <button class="btn btn-primary next-btn" @click="nextExercise">Weiter →</button>
        </div>
      </template>

      <!-- ══════════ KANJI READING ══════════ -->
      <template v-else-if="currentExercise.type === 'kanji-reading' && currentExercise.kanji">
        <div class="prompt-card card-flat">
          <p class="prompt-label">Wie liest man dieses Kanji?</p>
          <p class="prompt-kanji jp">{{ currentExercise.kanji.character }}</p>
          <p class="prompt-sub">{{ currentExercise.kanji.meanings[0] }}</p>
        </div>
        <div class="mc-grid">
          <button
            v-for="option in currentExercise.kanjiOptions"
            :key="option"
            class="mc-option jp"
            :class="{
              correct: mcChecked && option === (currentExercise.kanji!.kunyomi[0] || currentExercise.kanji!.onyomi[0]),
              wrong: mcChecked && selectedMcAnswer === option && option !== (currentExercise.kanji!.kunyomi[0] || currentExercise.kanji!.onyomi[0]),
              dimmed: mcChecked && option !== (currentExercise.kanji!.kunyomi[0] || currentExercise.kanji!.onyomi[0]) && selectedMcAnswer !== option,
            }"
            :disabled="mcChecked"
            @click="selectMcOption(option)"
          >
            {{ option }}
          </button>
        </div>
        <div v-if="mcChecked" class="feedback animate-slide-up">
          <p :class="mcCorrect ? 'fb-correct' : 'fb-wrong'">
            {{ mcCorrect ? '✅ Richtig!' : '❌ Falsch' }}
          </p>
          <p class="fb-readings">
            <span class="reading-label">On:</span> {{ currentExercise.kanji.onyomi.join(', ') }}
            ・ <span class="reading-label">Kun:</span> {{ currentExercise.kanji.kunyomi.join(', ') }}
          </p>
          <button class="btn btn-primary next-btn" @click="nextExercise">Weiter →</button>
        </div>
      </template>

      <!-- ══════════ SENTENCE BUILDING ══════════ -->
      <template v-else-if="currentExercise.type === 'sentence' && currentExercise.sentence">
        <div class="prompt-card card-flat">
          <p class="prompt-label">Übersetze den Satz:</p>
          <p class="prompt-text">{{ currentExercise.sentence.meaning }}</p>
          <button
            v-if="!showHint && currentExercise.sentence.hint"
            class="hint-btn btn-ghost"
            @click="showHint = true"
          >💡 Hinweis</button>
          <p v-if="showHint && currentExercise.sentence.hint" class="hint-text">
            💡 {{ currentExercise.sentence.hint }}
          </p>
        </div>

        <div class="sentence-answer" :class="{ 'is-correct': sentenceChecked && sentenceCorrect, 'is-wrong': sentenceChecked && !sentenceCorrect }">
          <div class="answer-blocks">
            <button
              v-for="(block, i) in sentenceBlocks.selectedBlocks.value"
              :key="'sel-' + i"
              class="word-block selected jp"
              :class="{ disabled: sentenceChecked, swapping: sentenceBlocks.swapIndex.value === i }"
              @click="sentenceBlocks.tapPlacedBlock(i)"
              @dblclick="sentenceBlocks.removePlacedBlock(i)"
            >{{ block }}</button>
            <span v-if="sentenceBlocks.selectedBlocks.value.length === 0" class="answer-placeholder">Tippe auf die Wörter unten</span>
          </div>
        </div>

        <div class="block-pool">
          <button
            v-for="(block, i) in sentenceBlocks.availableBlocks.value"
            :key="'avail-' + i"
            class="word-block available jp"
            :class="{ disabled: sentenceChecked }"
            @click="sentenceBlocks.selectBlock(i)"
          >{{ block }}</button>
        </div>

        <div v-if="sentenceChecked" class="feedback animate-slide-up">
          <p v-if="sentenceCorrect" class="fb-correct">✅ Richtig!</p>
          <div v-else>
            <p class="fb-wrong">❌ Nicht ganz</p>
            <button class="btn-ghost" @click="showSentenceAnswer" style="margin-top:4px">Lösung zeigen</button>
            <p class="fb-detail jp">{{ currentExercise.sentence.correctOrder.join(' ') }}</p>
          </div>
          <button class="btn btn-primary next-btn" @click="nextExercise">Weiter →</button>
        </div>

        <button
          v-else
          class="btn btn-primary check-btn"
          :disabled="sentenceBlocks.selectedBlocks.value.length === 0"
          @click="checkSentence"
        >Prüfen</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.daily-lesson {
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}

.lesson-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.lesson-header h1 {
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

/* Type badge row */
.type-badge-row {
  padding: 0 16px 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge-new {
  background: rgba(0, 200, 83, 0.2);
  color: var(--accent-success);
}

/* Mastery dots */
.mastery-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px 12px;
}

.mastery-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--bg-accent);
  transition: background var(--transition-fast);
}

.mastery-dot.filled {
  background: var(--accent-success);
}

.mastery-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-left: 4px;
}

/* Exercise area */
.exercise-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
}

/* Prompt card */
.prompt-card {
  margin: 0 16px 20px;
  text-align: center;
  padding: 24px 20px;
}

.prompt-label {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.prompt-text {
  font-size: 1.2rem;
  font-weight: 600;
}

.prompt-kanji {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 4px 0;
}

.prompt-sub {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-top: 4px;
}

.prompt-romaji {
  font-size: 3rem;
  font-weight: 700;
  color: var(--accent-primary);
  letter-spacing: 0.05em;
}

.prompt-hint-romaji {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-top: 6px;
}

/* Vocab study flashcard (new word intro) */
.vocab-study-intro {
  text-align: center;
  margin-bottom: 8px;
}

.vocab-study-hint {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.vocab-study-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 24px;
  text-align: center;
}

.vocab-study-word {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
}

.vocab-study-reading {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.vocab-study-meaning {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--accent-primary);
  margin-top: 4px;
}

.kana-hint-btn {
  display: block;
  margin: 12px auto 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.mc-option-kana {
  font-size: 1.8rem !important;
  text-align: center !important;
  padding: 14px 20px !important;
}

.fb-example {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.fb-example-meaning {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.hint-btn {
  margin-top: 8px;
  font-size: 0.8rem;
}

.hint-text {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* ── Furigana (ruby) display ── */
.furigana-display {
  display: flex;
  justify-content: center;
}

.furigana-word {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.4;
}

.furigana-word rt {
  font-size: 0.55em;
  font-weight: 400;
  color: var(--text-secondary);
}

.furigana-kanji {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.3;
}

.furigana-kanji rt {
  font-size: 0.35em;
  font-weight: 400;
  color: var(--text-secondary);
}

.prompt-furigana {
  margin: 8px 0;
}

/* MC options */
.mc-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 16px;
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
.feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
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

.fb-vocab-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.fb-detail {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.fb-meaning {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.fb-reading {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.fb-kanji-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.fb-kanji-detail .jp {
  font-size: 1.6rem;
  font-weight: 700;
}

.fb-readings {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.reading-label {
  color: var(--accent-primary);
  font-weight: 600;
}

.next-btn {
  width: calc(100% - 32px);
  max-width: 400px;
  margin-top: 8px;
  padding: 14px;
  font-size: 1rem;
}

/* Sentence building */
.sentence-answer {
  min-height: 72px;
  margin: 0 16px 12px;
  background: var(--bg-card);
  border: 2px dashed var(--bg-accent);
  border-radius: var(--radius-md);
  padding: 12px;
  transition: all var(--transition-fast);
}

.sentence-answer.is-correct {
  border-color: var(--accent-success);
  background: rgba(0, 200, 83, 0.05);
}

.sentence-answer.is-wrong {
  border-color: var(--accent-primary);
  background: rgba(233, 69, 96, 0.05);
}

.answer-blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 44px;
  align-items: center;
}

.answer-placeholder {
  color: var(--text-muted);
  font-size: 0.9rem;
  width: 100%;
  text-align: center;
}

.block-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 0 16px;
}

.word-block {
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all var(--transition-fast);
  touch-action: manipulation;
  font-family: 'Noto Sans JP', 'Inter', sans-serif;
}

.word-block.available {
  background: var(--bg-accent);
  color: var(--text-primary);
}

.word-block.available:hover {
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.word-block.selected {
  background: var(--gradient-accent);
  color: white;
}

.word-block.selected.swapping {
  border: 2px solid var(--accent-warning);
  box-shadow: 0 0 8px rgba(255, 152, 0, 0.4);
  transform: scale(1.05);
}

.word-block.disabled {
  pointer-events: none;
  opacity: 0.7;
}

.check-btn {
  width: calc(100% - 32px);
  margin: 16px auto 0;
  padding: 14px;
  font-size: 1rem;
  display: block;
}

.check-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

.new-words-info {
  color: var(--accent-success);
  font-size: 0.9rem;
  font-weight: 500;
}

.complete-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
</style>
