<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { useBadgesStore } from '../stores/badges'
import { scheduleSave } from '../stores/sync'
import { playCorrectSound, playWrongSound } from '../composables/useSounds'
import { hiraganaData, type KanaCard } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { vocabularyData, type VocabCard } from '../data/vocabulary'
import { generateSentencesFromVocab, type SentenceChallenge } from '../data/sentence-generator'
import { useSentenceBlocks } from '../composables/useSentenceBlocks'
import { markWeeklyTestDone } from '../composables/useWeeklyTest'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
const badgesStore = useBadgesStore()
learningStore.initialize()

const PERFECT_BONUS_XP = 50

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Q =
  | { kind: 'kana'; kana: KanaCard; options: string[] }
  | { kind: 'vocab'; vocab: VocabCard; options: string[] }
  | { kind: 'sentence'; sentence: SentenceChallenge }

const questions = ref<Q[]>([])
const index = ref(0)
const current = computed<Q | null>(() => questions.value[index.value] ?? null)

const correctCount = ref(0)
const mistakes = ref(0)
const sessionXp = ref(0)
const complete = ref(false)
const noItems = ref(false)

// MC state
const selected = ref<string | null>(null)
const checked = ref(false)
const wasCorrect = ref(false)

// Sentence state
const blocks = useSentenceBlocks()
const sentenceChecked = ref(false)
const sentenceCorrect = ref(false)

const progress = computed(() =>
  questions.value.length > 0 ? Math.round((index.value / questions.value.length) * 100) : 0
)

function allKana(): KanaCard[] {
  return [...hiraganaData, ...katakanaData]
}

function buildQuestions() {
  const learned = learningStore.getItemsLearnedRecently(7)

  // Split by category.
  const kanaIds = new Set(
    learned.filter(c => c.category === 'hiragana' || c.category === 'katakana').map(c => c.id)
  )
  const vocabIds = learned.filter(c => c.category === 'vocabulary').map(c => c.id)

  const qs: Q[] = []

  // Kana → romaji.
  const kanaCards = allKana().filter(k => kanaIds.has(k.id))
  for (const kana of shuffle(kanaCards).slice(0, 8)) {
    const wrong = shuffle(allKana().filter(k => k.romaji !== kana.romaji))
      .slice(0, 3).map(k => k.romaji)
    qs.push({ kind: 'kana', kana, options: shuffle([kana.romaji, ...wrong]) })
  }

  // Vocab JP → DE.
  const vocabCards = vocabIds
    .map(id => vocabularyData.find(v => v.id === id))
    .filter((v): v is VocabCard => !!v)
  for (const vocab of shuffle(vocabCards).slice(0, 8)) {
    const wrong = shuffle(vocabularyData.filter(v => v.id !== vocab.id))
      .slice(0, 3).map(v => v.meaning)
    qs.push({ kind: 'vocab', vocab, options: shuffle([vocab.meaning, ...wrong]) })
  }

  // Sentences built around this week's vocab (level 10+ makes sense, but we
  // just try — if no sentence can be built, none are added).
  if (vocabIds.length > 0 && userStore.currentLevel.level >= 10) {
    const allLearnedVocab = learningStore.cardProgress
      .filter(c => c.category === 'vocabulary' && c.status !== 'new')
      .map(c => c.id)
    const sentences = generateSentencesFromVocab(
      vocabIds,
      Array.from(new Set([...allLearnedVocab, ...vocabIds])),
      3,
      userStore.currentLevel.level
    )
    for (const s of sentences) qs.push({ kind: 'sentence', sentence: s })
  }

  questions.value = shuffle(qs)
  if (questions.value.length === 0) {
    noItems.value = true
  }
  loadCurrent()
}

function loadCurrent() {
  selected.value = null
  checked.value = false
  wasCorrect.value = false
  sentenceChecked.value = false
  sentenceCorrect.value = false
  const q = current.value
  if (q?.kind === 'sentence') {
    blocks.initBlocks(q.sentence.correctOrder, q.sentence.distractors || [])
  }
}

function correctAnswerFor(q: Q): string {
  if (q.kind === 'kana') return q.kana.romaji
  if (q.kind === 'vocab') return q.vocab.meaning
  return ''
}

function selectOption(option: string) {
  if (checked.value) return
  const q = current.value
  if (!q || q.kind === 'sentence') return
  selected.value = option
  checked.value = true
  wasCorrect.value = option === correctAnswerFor(q)

  if (wasCorrect.value) {
    correctCount.value++
    const xp = userStore.xpPerCorrect
    sessionXp.value += xp
    userStore.addXp(xp, 0)
    playCorrectSound()
  } else {
    mistakes.value++
    playWrongSound()
  }

  // Track progress on the item too.
  if (q.kind === 'kana') {
    learningStore.recordAnswer(q.kana.id, q.kana.id.startsWith('h-') ? 'hiragana' : 'katakana', wasCorrect.value)
  } else if (q.kind === 'vocab') {
    learningStore.recordAnswer(q.vocab.id, 'vocabulary', wasCorrect.value)
  }
}

function checkSentence() {
  const q = current.value
  if (!q || q.kind !== 'sentence' || blocks.selectedBlocks.value.length === 0) return
  sentenceChecked.value = true
  blocks.lock()
  const correct = q.sentence.correctOrder
  sentenceCorrect.value =
    blocks.selectedBlocks.value.length === correct.length &&
    blocks.selectedBlocks.value.every((b, i) => b === correct[i])

  if (sentenceCorrect.value) {
    correctCount.value++
    const xp = userStore.xpPerCorrect
    sessionXp.value += xp
    userStore.addXp(xp, 0)
    playCorrectSound()
  } else {
    mistakes.value++
    playWrongSound()
  }
}

function next() {
  if (index.value < questions.value.length - 1) {
    index.value++
    loadCurrent()
  } else {
    finish()
  }
}

function finish() {
  complete.value = true
  // Perfect run → bonus XP.
  if (mistakes.value === 0 && questions.value.length > 0) {
    userStore.addXp(PERFECT_BONUS_XP, 0)
    sessionXp.value += PERFECT_BONUS_XP
  }
  userStore.completeSession()
  badgesStore.checkAllBadges()
  markWeeklyTestDone()
  scheduleSave()
}

function leave() {
  // Leaving early still counts the test as "done this week" (user's choice).
  markWeeklyTestDone()
  router.push('/')
}

onMounted(() => {
  buildQuestions()
})
</script>

<template>
  <div class="weekly-test">
    <header class="wt-header">
      <button class="btn-ghost back-btn" @click="leave" aria-label="Zurück">‹</button>
      <h1>Wochentest</h1>
      <span class="counter" v-if="!complete && !noItems">{{ index + 1 }} / {{ questions.length }}</span>
      <span class="counter" v-else></span>
    </header>

    <div class="progress-bar" style="margin: 0 16px 16px;">
      <div class="progress-bar-fill" :style="{ width: progress + '%', background: 'var(--gradient-xp)' }" />
    </div>

    <!-- No items this week -->
    <div v-if="noItems" class="wt-empty animate-fade-in">
      <div class="wt-icon">🗓️</div>
      <h2>Diese Woche noch nichts Neues</h2>
      <p>Lerne ein paar neue Silben oder Vokabeln, dann gibt es nächsten Sonntag einen Test dazu.</p>
      <button class="btn btn-primary" @click="leave">Zurück</button>
    </div>

    <!-- Complete -->
    <div v-else-if="complete" class="wt-complete animate-fade-in">
      <div class="wt-icon">{{ mistakes === 0 ? '🏆' : '🎉' }}</div>
      <h2>{{ mistakes === 0 ? 'Perfekt! Alles richtig!' : 'Wochentest geschafft!' }}</h2>
      <div class="wt-stats">
        <div class="wt-stat"><span class="num correct">{{ correctCount }}</span><span>Richtig</span></div>
        <div class="wt-stat"><span class="num wrong">{{ mistakes }}</span><span>Falsch</span></div>
        <div class="wt-stat"><span class="num xp">+{{ sessionXp }}</span><span>XP</span></div>
      </div>
      <p v-if="mistakes === 0" class="wt-bonus">🌟 Perfekt-Bonus: +{{ PERFECT_BONUS_XP }} XP!</p>
      <p v-else class="wt-bonus-miss">Ohne Fehler hättest du +{{ PERFECT_BONUS_XP }} XP Bonus bekommen. Nächste Woche!</p>
      <button class="btn btn-primary" @click="router.push('/')">Fertig</button>
    </div>

    <!-- Question: kana or vocab (MC) -->
    <div v-else-if="current && current.kind !== 'sentence'" class="wt-area">
      <div class="wt-badge-row">
        <span v-if="current.kind === 'kana'" class="badge badge-streak">あ Silbe</span>
        <span v-else class="badge badge-xp">🇯🇵 → 🇩🇪 Vokabel</span>
      </div>

      <div class="prompt-card card-flat">
        <p class="prompt-label">{{ current.kind === 'kana' ? 'Wie liest man das?' : 'Was bedeutet das?' }}</p>
        <p class="prompt-text jp-large" v-if="current.kind === 'kana'">{{ current.kana.character }}</p>
        <p class="prompt-text jp" v-else>{{ current.vocab.reading }}</p>
      </div>

      <div class="mc-grid">
        <button
          v-for="option in current.options" :key="option"
          class="mc-option"
          :class="{
            correct: checked && option === correctAnswerFor(current),
            wrong: checked && selected === option && option !== correctAnswerFor(current),
            dimmed: checked && option !== correctAnswerFor(current) && selected !== option,
          }"
          :disabled="checked" @click="selectOption(option)"
        >{{ option }}</button>
      </div>

      <div v-if="checked" class="feedback animate-slide-up">
        <p :class="wasCorrect ? 'fb-correct' : 'fb-wrong'">{{ wasCorrect ? '✅ Richtig!' : '❌ Falsch' }}</p>
        <button class="btn btn-primary next-btn" @click="next">Weiter →</button>
      </div>
    </div>

    <!-- Question: sentence -->
    <div v-else-if="current && current.kind === 'sentence'" class="wt-area">
      <div class="wt-badge-row"><span class="badge badge-streak">🧩 Satz bauen</span></div>
      <div class="prompt-card card-flat">
        <p class="prompt-label">Übersetze den Satz:</p>
        <p class="prompt-text">{{ current.sentence.meaning }}</p>
      </div>

      <div class="sentence-answer" :class="{ 'is-correct': sentenceChecked && sentenceCorrect, 'is-wrong': sentenceChecked && !sentenceCorrect }">
        <div class="answer-blocks">
          <button
            v-for="(block, i) in blocks.selectedBlocks.value" :key="'sel-' + i"
            class="word-block selected jp"
            :class="{ disabled: sentenceChecked }"
            @click="blocks.tapPlacedBlock(i)"
            @dblclick="blocks.removePlacedBlock(i)"
          >{{ block }}</button>
          <span v-if="blocks.selectedBlocks.value.length === 0" class="answer-placeholder">Tippe auf die Wörter unten</span>
        </div>
      </div>

      <div class="block-pool">
        <button
          v-for="(block, i) in blocks.availableBlocks.value" :key="'avail-' + i"
          class="word-block available jp"
          :class="{ disabled: sentenceChecked }"
          @click="blocks.selectBlock(i)"
        >{{ block }}</button>
      </div>

      <div v-if="sentenceChecked" class="feedback animate-slide-up">
        <p v-if="sentenceCorrect" class="fb-correct">✅ Richtig!</p>
        <div v-else>
          <p class="fb-wrong">❌ Nicht ganz</p>
          <p class="fb-detail jp">{{ current.sentence.correctOrder.join(' ') }}</p>
        </div>
        <button class="btn btn-primary next-btn" @click="next">Weiter →</button>
      </div>
      <button
        v-else class="btn btn-primary check-btn"
        :disabled="blocks.selectedBlocks.value.length === 0"
        @click="checkSentence"
      >Prüfen</button>
    </div>
  </div>
</template>

<style scoped>
.weekly-test { max-width: 600px; margin: 0 auto; min-height: calc(100vh - var(--nav-height)); display: flex; flex-direction: column; }
.wt-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
.wt-header h1 { font-size: 1.1rem; font-weight: 600; }
.counter { color: var(--text-muted); font-size: 0.85rem; min-width: 44px; text-align: right; }
.back-btn { font-size: 1.2rem; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }

.wt-area { padding: 0 16px 24px; display: flex; flex-direction: column; gap: 18px; }
.wt-badge-row { display: flex; gap: 8px; }

.prompt-card { padding: 28px 20px; text-align: center; }
.prompt-label { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 12px; }
.prompt-text { font-size: 1.4rem; font-weight: 600; }
.prompt-text.jp-large { font-size: 3rem; }

.mc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.mc-option { padding: 16px; font-size: 1.05rem; border-radius: var(--radius-md); background: var(--bg-card); border: 2px solid var(--border-color); cursor: pointer; transition: transform 0.1s, border-color 0.2s; }
.mc-option:hover:not(:disabled) { border-color: var(--accent-primary); transform: translateY(-2px); }
.mc-option.correct { border-color: var(--color-success, #00c853); background: rgba(0,200,83,0.12); }
.mc-option.wrong { border-color: var(--color-danger, #e94560); background: rgba(233,69,96,0.12); }
.mc-option.dimmed { opacity: 0.5; }
.mc-option:disabled { cursor: default; }

.feedback { display: flex; flex-direction: column; gap: 12px; align-items: center; }
.fb-correct { color: var(--color-success, #00c853); font-weight: 700; }
.fb-wrong { color: var(--color-danger, #e94560); font-weight: 700; }
.fb-detail { margin-top: 4px; font-size: 1.1rem; }
.next-btn, .check-btn { width: 100%; }

/* Sentence building (reuse look from daily lesson) */
.sentence-answer { min-height: 60px; border: 2px dashed var(--border-color); border-radius: var(--radius-md); padding: 12px; }
.sentence-answer.is-correct { border-color: var(--color-success, #00c853); }
.sentence-answer.is-wrong { border-color: var(--color-danger, #e94560); }
.answer-blocks { display: flex; flex-wrap: wrap; gap: 8px; }
.answer-placeholder { color: var(--text-muted); font-size: 0.9rem; }
.block-pool { display: flex; flex-wrap: wrap; gap: 8px; }
.word-block { padding: 10px 14px; border-radius: var(--radius-md); background: var(--bg-card); border: 2px solid var(--border-color); cursor: pointer; font-size: 1.1rem; }
.word-block.disabled { pointer-events: none; opacity: 0.7; }

/* Complete / empty */
.wt-complete, .wt-empty { padding: 40px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
.wt-icon { font-size: 3.5rem; }
.wt-stats { display: flex; gap: 28px; }
.wt-stat { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: var(--text-muted); }
.num { font-size: 1.6rem; font-weight: 700; }
.num.correct { color: var(--color-success, #00c853); }
.num.wrong { color: var(--color-danger, #e94560); }
.num.xp { color: var(--accent-primary); }
.wt-bonus { color: var(--accent-primary); font-weight: 700; }
.wt-bonus-miss { color: var(--text-secondary); font-size: 0.9rem; }
</style>
