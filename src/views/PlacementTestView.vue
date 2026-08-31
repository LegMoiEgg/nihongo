<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData } from '../data/kanji'
import { vocabularyData } from '../data/vocabulary'
import { playCorrectSound, playWrongSound } from '../composables/useSounds'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
learningStore.initialize()

interface PlacementQuestion {
  id: string
  tier: number
  prompt: string
  promptJp?: string
  correctAnswer: string
  options: string[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions(): PlacementQuestion[] {
  const questions: PlacementQuestion[] = []

  const basicHira = shuffle(hiraganaData.filter(h => h.character.length === 1 && !h.group.includes('濁') && !h.group.includes('半濁') && h.group !== 'Sokuon'))
  const dakutenHira = shuffle(hiraganaData.filter(h => h.character.length === 1 && (h.group.includes('濁') || h.group.includes('半濁'))))
  const comboHira = shuffle(hiraganaData.filter(h => h.character.length > 1 && h.group.includes('Kombi')))
  const basicKata = shuffle(katakanaData.filter(k => k.character.length === 1 && !k.group.includes('濁') && !k.group.includes('半濁') && k.group !== 'Sokuon'))
  const kanji = shuffle(kanjiData)
  const vocab = shuffle(vocabularyData.filter(v => v.partOfSpeech !== 'Ausdruck'))

  // ── Tier 1: Basic Hiragana (8 questions) ──
  for (const card of basicHira.slice(0, 4)) {
    const wrong = shuffle(basicHira.filter(h => h.character !== card.character)).slice(0, 3).map(h => h.character)
    questions.push({ id: `t1a-${card.id}`, tier: 1, prompt: `Welches Zeichen ist "${card.romaji}"?`, correctAnswer: card.character, options: shuffle([card.character, ...wrong]) })
  }
  for (const card of basicHira.slice(4, 8)) {
    const wrong = shuffle(basicHira.filter(h => h.romaji !== card.romaji)).slice(0, 3).map(h => h.romaji)
    questions.push({ id: `t1b-${card.id}`, tier: 1, prompt: 'Wie liest man dieses Zeichen?', promptJp: card.character, correctAnswer: card.romaji, options: shuffle([card.romaji, ...wrong]) })
  }

  // ── Tier 2: Dakuten + Katakana + Combos (8 questions) ──
  for (const card of dakutenHira.slice(0, 3)) {
    const wrong = shuffle(dakutenHira.filter(h => h.romaji !== card.romaji)).slice(0, 3).map(h => h.romaji)
    questions.push({ id: `t2d-${card.id}`, tier: 2, prompt: 'Wie liest man dieses Zeichen?', promptJp: card.character, correctAnswer: card.romaji, options: shuffle([card.romaji, ...wrong]) })
  }
  for (const card of basicKata.slice(0, 3)) {
    const wrong = shuffle(basicKata.filter(k => k.romaji !== card.romaji)).slice(0, 3).map(k => k.romaji)
    questions.push({ id: `t2k-${card.id}`, tier: 2, prompt: 'Wie liest man dieses Katakana?', promptJp: card.character, correctAnswer: card.romaji, options: shuffle([card.romaji, ...wrong]) })
  }
  for (const card of comboHira.slice(0, 2)) {
    const wrong = shuffle(comboHira.filter(h => h.romaji !== card.romaji)).slice(0, 3).map(h => h.romaji)
    questions.push({ id: `t2c-${card.id}`, tier: 2, prompt: 'Wie liest man diese Kombination?', promptJp: card.character, correctAnswer: card.romaji, options: shuffle([card.romaji, ...wrong]) })
  }

  // ── Tier 3: Word reading + vocab (8 questions) ──
  const kanaWords = [
    { word: 'さくら', meaning: 'Kirschblüte' },
    { word: 'ともだち', meaning: 'Freund' },
    { word: 'でんしゃ', meaning: 'Zug' },
    { word: 'がっこう', meaning: 'Schule' },
  ]
  for (const kw of shuffle(kanaWords).slice(0, 3)) {
    const allMeanings = [...kanaWords.map(w => w.meaning), 'Katze', 'Berg', 'Regen', 'Sommer']
    const wrong = shuffle(allMeanings.filter(m => m !== kw.meaning)).slice(0, 3)
    questions.push({ id: `t3w-${kw.word}`, tier: 3, prompt: 'Was bedeutet dieses Wort?', promptJp: kw.word, correctAnswer: kw.meaning, options: shuffle([kw.meaning, ...wrong]) })
  }
  for (const v of vocab.slice(0, 5)) {
    const wrong = shuffle(vocab.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.reading)
    questions.push({ id: `t3v-${v.id}`, tier: 3, prompt: `Was heißt "${v.meaning}" auf Japanisch?`, correctAnswer: v.reading, options: shuffle([v.reading, ...wrong]) })
  }

  // ── Tier 4: Vocab reverse + Kanji meaning (8 questions) ──
  for (const v of vocab.slice(5, 9)) {
    const wrong = shuffle(vocab.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.meaning)
    questions.push({ id: `t4v-${v.id}`, tier: 4, prompt: 'Was bedeutet dieses Wort?', promptJp: v.reading, correctAnswer: v.meaning, options: shuffle([v.meaning, ...wrong]) })
  }
  for (const k of kanji.slice(0, 4)) {
    const wrong = shuffle(kanji.filter(x => x.id !== k.id)).slice(0, 3).map(x => x.meanings[0])
    questions.push({ id: `t4k-${k.id}`, tier: 4, prompt: 'Was bedeutet dieses Kanji?', promptJp: k.character, correctAnswer: k.meanings[0], options: shuffle([k.meanings[0], ...wrong]) })
  }

  // ── Tier 5: Kanji reading + sentence understanding (8 questions) ──
  for (const k of kanji.slice(4, 7)) {
    const correct = k.kunyomi[0] || k.onyomi[0]
    const wrong = shuffle(kanji.filter(x => x.id !== k.id)).slice(0, 3).map(x => x.kunyomi[0] || x.onyomi[0])
    questions.push({ id: `t5k-${k.id}`, tier: 5, prompt: 'Wie liest man dieses Kanji?', promptJp: k.character, correctAnswer: correct, options: shuffle([correct, ...wrong]) })
  }
  const sentenceQs = [
    { jp: 'わたし は みず を のみます', ans: 'Ich trinke Wasser', w: ['Ich esse Reis', 'Ich lese ein Buch', 'Ich gehe zur Schule'] },
    { jp: 'きょう は あつい です', ans: 'Heute ist es heiß', w: ['Gestern war es kalt', 'Morgen ist Sonntag', 'Das Essen ist lecker'] },
    { jp: 'おかあさん は ほん を よみます', ans: 'Mutter liest ein Buch', w: ['Vater kauft Obst', 'Schwester trinkt Tee', 'Bruder geht zur Schule'] },
  ]
  for (const sq of shuffle(sentenceQs)) {
    questions.push({ id: `t5s-${sq.jp.slice(0, 8)}`, tier: 5, prompt: 'Was bedeutet dieser Satz?', promptJp: sq.jp, correctAnswer: sq.ans, options: shuffle([sq.ans, ...sq.w]) })
  }
  // Kanji compound words
  const compoundQs = [
    { jp: '日本', ans: 'Japan', w: ['China', 'Berg', 'Fluss'] },
    { jp: '大学', ans: 'Universität', w: ['Grundschule', 'Krankenhaus', 'Bahnhof'] },
  ]
  for (const cq of compoundQs) {
    questions.push({ id: `t5c-${cq.jp}`, tier: 5, prompt: 'Was bedeutet dieses Wort?', promptJp: cq.jp, correctAnswer: cq.ans, options: shuffle([cq.ans, ...cq.w]) })
  }

  // ── Tier 6: Kanji sentences + grammar + tricky readings (8 questions) ──
  const kanjiSentences = [
    { jp: '私は毎日学校に行きます', ans: 'Ich gehe jeden Tag zur Schule', w: ['Ich kaufe jeden Tag Wasser', 'Ich lese jeden Tag ein Buch', 'Ich esse jeden Tag Fisch'] },
    { jp: '母は魚を食べます', ans: 'Mutter isst Fisch', w: ['Vater trinkt Tee', 'Schwester liest ein Buch', 'Bruder geht nach Hause'] },
    { jp: '今日は天気がいいです', ans: 'Heute ist das Wetter gut', w: ['Morgen ist es kalt', 'Gestern war es heiß', 'Das Essen ist teuer'] },
    { jp: '友達と映画を見ました', ans: 'Ich habe mit meinem Freund einen Film gesehen', w: ['Ich habe alleine ein Buch gelesen', 'Wir haben zusammen gegessen', 'Mein Freund hat geschlafen'] },
  ]
  for (const ks of shuffle(kanjiSentences)) {
    questions.push({ id: `t6s-${ks.jp.slice(0, 6)}`, tier: 6, prompt: 'Was bedeutet dieser Satz?', promptJp: ks.jp, correctAnswer: ks.ans, options: shuffle([ks.ans, ...ks.w]) })
  }
  // Particle usage
  const particleQs = [
    { prompt: 'Welcher Partikel fehlt? 学校___行きます', ans: 'に', w: ['を', 'で', 'が'] },
    { prompt: 'Welcher Partikel fehlt? 本___読みます', ans: 'を', w: ['に', 'は', 'で'] },
    { prompt: 'Welcher Partikel fehlt? レストラン___食べます', ans: 'で', w: ['に', 'を', 'は'] },
    { prompt: 'Welcher Partikel fehlt? 私___学生です', ans: 'は', w: ['が', 'を', 'に'] },
  ]
  for (const pq of shuffle(particleQs)) {
    questions.push({ id: `t6p-${pq.ans}-${Math.random().toString(36).slice(2, 5)}`, tier: 6, prompt: pq.prompt, correctAnswer: pq.ans, options: shuffle([pq.ans, ...pq.w]) })
  }

  // ── Tier 7: Advanced — verb conjugation, complex Kanji, long sentences (8 questions) ──
  const conjugationQs = [
    { prompt: 'Was ist die Vergangenheitsform von 食べる?', ans: '食べた', w: ['食べます', '食べて', '食べない'] },
    { prompt: 'Was ist die te-Form von 行く?', ans: '行って', w: ['行った', '行かない', '行きます'] },
    { prompt: 'Was ist die Verneinung von 飲む?', ans: '飲まない', w: ['飲んだ', '飲みます', '飲んで'] },
    { prompt: 'Was bedeutet 食べたい?', ans: 'Ich möchte essen', w: ['Ich esse', 'Ich habe gegessen', 'Ich esse nicht'] },
  ]
  for (const cq of shuffle(conjugationQs)) {
    questions.push({ id: `t7c-${cq.ans.slice(0, 3)}`, tier: 7, prompt: cq.prompt, correctAnswer: cq.ans, options: shuffle([cq.ans, ...cq.w]) })
  }
  const advancedSentences = [
    { jp: '来週の月曜日に東京へ出張に行かなければなりません', ans: 'Nächsten Montag muss ich für eine Geschäftsreise nach Tokyo', w: ['Letzten Montag war ich in Osaka', 'Morgen fahre ich nach Kyoto', 'Ich möchte nächste Woche frei haben'] },
    { jp: '日本語を勉強するのは楽しいですが、漢字は難しいです', ans: 'Japanisch lernen macht Spaß, aber Kanji sind schwierig', w: ['Japanisch ist einfach und Kanji auch', 'Ich lerne kein Japanisch mehr', 'Kanji sind einfacher als Hiragana'] },
    { jp: '昨日、図書館で三時間勉強しました', ans: 'Gestern habe ich 3 Stunden in der Bibliothek gelernt', w: ['Heute lerne ich zu Hause', 'Morgen gehe ich zur Schule', 'Letzte Woche habe ich nicht gelernt'] },
    { jp: '電車が遅れたので、会社に遅刻しました', ans: 'Weil der Zug Verspätung hatte, kam ich zu spät zur Firma', w: ['Der Zug war pünktlich und ich war früh da', 'Ich bin mit dem Bus gefahren', 'Die Firma war heute geschlossen'] },
  ]
  for (const as of shuffle(advancedSentences)) {
    questions.push({ id: `t7s-${as.jp.slice(0, 6)}`, tier: 7, prompt: 'Was bedeutet dieser Satz?', promptJp: as.jp, correctAnswer: as.ans, options: shuffle([as.ans, ...as.w]) })
  }

  return questions.sort((a, b) => a.tier - b.tier)
}

// ── State ──
const questions = ref<PlacementQuestion[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const isChecked = ref(false)
const isCorrect = ref(false)
const tierScores = ref<Record<number, { correct: number; total: number }>>({
  1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 },
  4: { correct: 0, total: 0 }, 5: { correct: 0, total: 0 }, 6: { correct: 0, total: 0 },
  7: { correct: 0, total: 0 },
})
const testComplete = ref(false)
const resultLevel = ref(1)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progress = computed(() => questions.value.length > 0 ? Math.round((currentIndex.value / questions.value.length) * 100) : 0)
const totalCorrect = computed(() => Object.values(tierScores.value).reduce((sum, t) => sum + t.correct, 0))

function selectAnswer(option: string) {
  if (isChecked.value) return
  selectedAnswer.value = option
  isChecked.value = true
  isCorrect.value = option === currentQuestion.value.correctAnswer
  tierScores.value[currentQuestion.value.tier].total++
  if (isCorrect.value) {
    tierScores.value[currentQuestion.value.tier].correct++
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
    calculateResult()
    testComplete.value = true
  }
}

function calculateResult() {
  const scores = tierScores.value
  let level = 1
  if (scores[1].total > 0 && scores[1].correct / scores[1].total >= 0.6) level = 3
  if (scores[2].total > 0 && scores[2].correct / scores[2].total >= 0.5) level = 6
  if (scores[3].total > 0 && scores[3].correct / scores[3].total >= 0.5) level = 9
  if (scores[4].total > 0 && scores[4].correct / scores[4].total >= 0.5) level = 13
  if (scores[5].total > 0 && scores[5].correct / scores[5].total >= 0.4) level = 17
  if (scores[6].total > 0 && scores[6].correct / scores[6].total >= 0.4) level = 22
  if (scores[7].total > 0 && scores[7].correct / scores[7].total >= 0.3) level = 28
  resultLevel.value = level
}

/**
 * Apply placement result:
 * - Sets XP DIRECTLY (bypasses addXp → no daily log, no streak, no badge triggers)
 * - Marks relevant kana/vocab as "seen" in learning store
 */
function applyResult() {
  // Set placement level — no XP awarded, no daily/badge triggers
  userStore.setPlacementLevel(resultLevel.value)

  const scores = tierScores.value

  // Mark kana/vocab as learned based on tier results
  if (scores[1].correct / Math.max(scores[1].total, 1) >= 0.6) {
    for (const card of hiraganaData.filter(h => h.character.length === 1 && !h.group.includes('濁') && !h.group.includes('半濁') && !h.group.includes('Kombi'))) {
      const p = learningStore.getOrCreateProgress(card.id, 'hiragana')
      if (p.status === 'new') { p.status = 'learning'; p.correctCount = 2; p.consecutiveCorrect = 2 }
    }
  }
  if (scores[2].correct / Math.max(scores[2].total, 1) >= 0.5) {
    for (const card of hiraganaData.filter(h => h.character.length === 1)) {
      const p = learningStore.getOrCreateProgress(card.id, 'hiragana')
      if (p.status === 'new') { p.status = 'learning'; p.correctCount = 2; p.consecutiveCorrect = 2 }
    }
    for (const card of katakanaData.filter(k => k.character.length === 1 && !k.group.includes('濁') && !k.group.includes('半濁') && !k.group.includes('Kombi'))) {
      const p = learningStore.getOrCreateProgress(card.id, 'katakana')
      if (p.status === 'new') { p.status = 'learning'; p.correctCount = 2; p.consecutiveCorrect = 2 }
    }
  }
  if (scores[3].correct / Math.max(scores[3].total, 1) >= 0.5) {
    for (const v of vocabularyData.slice(0, 25)) {
      const p = learningStore.getOrCreateProgress(v.id, 'vocabulary')
      if (p.status === 'new') { p.status = 'learning'; p.correctCount = 1; p.consecutiveCorrect = 1 }
    }
  }
  if (scores[4].correct / Math.max(scores[4].total, 1) >= 0.5) {
    for (const v of vocabularyData.slice(0, 40)) {
      const p = learningStore.getOrCreateProgress(v.id, 'vocabulary')
      if (p.status === 'new') { p.status = 'learning'; p.correctCount = 2; p.consecutiveCorrect = 2 }
    }
  }

  localStorage.setItem('nihongo_card_progress', JSON.stringify(learningStore.cardProgress))
  localStorage.setItem('nihongo_placement_done', 'true')
  router.replace('/')
}

function skipResult() {
  localStorage.setItem('nihongo_placement_done', 'true')
  router.replace('/')
}

onMounted(() => { questions.value = generateQuestions() })
</script>

<template>
  <div class="placement-test">
    <div v-if="testComplete" class="result-screen animate-fade-in">
      <div class="result-icon">🎯</div>
      <h1>Dein Ergebnis</h1>
      <div class="result-level-card card">
        <span class="result-level-number">Level {{ resultLevel }}</span>
        <span class="result-level-label">Empfohlenes Startlevel</span>
      </div>
      <div class="result-stats">{{ totalCorrect }} / {{ questions.length }} richtig</div>
      <div class="tier-breakdown">
        <div v-for="tier in 7" :key="tier" class="tier-row">
          <span class="tier-label">{{ ['Hiragana', 'Kana erweitert', 'Vokabeln', 'Kanji', 'Sätze', 'Grammatik', 'Fortgeschritten'][tier - 1] }}</span>
          <div class="tier-bar"><div class="tier-fill" :style="{ width: (tierScores[tier].total > 0 ? (tierScores[tier].correct / tierScores[tier].total) * 100 : 0) + '%' }" /></div>
          <span class="tier-score">{{ tierScores[tier].correct }}/{{ tierScores[tier].total }}</span>
        </div>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary" @click="applyResult">Mit Level {{ resultLevel }} starten</button>
        <button class="btn btn-ghost" @click="skipResult">Lieber bei Level 1 anfangen</button>
      </div>
    </div>

    <div v-else-if="currentQuestion" class="test-active">
      <header class="test-header">
        <span class="test-tier">Stufe {{ currentQuestion.tier }}/5</span>
        <span class="test-counter">{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </header>
      <div class="progress-bar" style="margin: 0 16px 20px;">
        <div class="progress-bar-fill" :style="{ width: progress + '%', background: 'var(--gradient-xp)' }" />
      </div>
      <div class="question-area">
        <div class="question-card card-flat">
          <p class="question-text">{{ currentQuestion.prompt }}</p>
          <p v-if="currentQuestion.promptJp" class="question-jp jp">{{ currentQuestion.promptJp }}</p>
        </div>
        <div class="mc-options">
          <button
            v-for="option in currentQuestion.options" :key="option"
            class="mc-option"
            :class="{ 'jp': currentQuestion.tier <= 2 && currentQuestion.prompt.includes('Welches'), correct: isChecked && option === currentQuestion.correctAnswer, wrong: isChecked && selectedAnswer === option && option !== currentQuestion.correctAnswer, dimmed: isChecked && option !== currentQuestion.correctAnswer && selectedAnswer !== option }"
            :disabled="isChecked" @click="selectAnswer(option)"
          >{{ option }}</button>
        </div>
        <div v-if="isChecked" class="feedback animate-slide-up">
          <p :class="isCorrect ? 'fb-correct' : 'fb-wrong'">{{ isCorrect ? '✅ Richtig!' : '❌ Falsch' }}</p>
          <p v-if="!isCorrect" class="fb-answer">Richtig: <span class="jp">{{ currentQuestion.correctAnswer }}</span></p>
          <button class="btn btn-primary next-btn" @click="nextQuestion">{{ currentIndex < questions.length - 1 ? 'Weiter →' : 'Ergebnis anzeigen' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.placement-test { max-width: 600px; margin: 0 auto; min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column; }
.test-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
.test-tier { font-weight: 600; font-size: 0.9rem; color: var(--accent-primary); }
.test-counter { font-size: 0.85rem; color: var(--text-muted); }
.question-area { flex: 1; padding: 0 16px 24px; display: flex; flex-direction: column; gap: 16px; }
.question-card { text-align: center; padding: 24px 20px; }
.question-text { font-size: 1.1rem; font-weight: 600; }
.question-jp { font-size: 2.5rem; font-weight: 700; margin-top: 8px; line-height: 1.3; }
.mc-options { display: flex; flex-direction: column; gap: 10px; }
.mc-option { padding: 16px 20px; background: var(--bg-card); border: 2px solid var(--bg-accent); border-radius: var(--radius-md); color: var(--text-primary); font-size: 1.05rem; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); text-align: left; font-family: 'Noto Sans JP', 'Inter', sans-serif; touch-action: manipulation; }
.mc-option:hover:not(:disabled) { border-color: var(--accent-primary); background: var(--bg-card-hover); }
.mc-option.correct { border-color: var(--accent-success); background: rgba(0, 200, 83, 0.12); color: var(--accent-success); opacity: 1 !important; }
.mc-option.wrong { border-color: var(--accent-primary); background: rgba(233, 69, 96, 0.12); color: var(--accent-primary); animation: shake 0.35s ease; }
.mc-option.dimmed { opacity: 0.4; }
.mc-option:disabled { cursor: default; }
.feedback { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 0; }
.fb-correct { font-size: 1.1rem; font-weight: 600; color: var(--accent-success); }
.fb-wrong { font-size: 1.1rem; font-weight: 600; color: var(--accent-primary); }
.fb-answer { color: var(--text-secondary); font-size: 0.95rem; }
.next-btn { width: 100%; margin-top: 8px; padding: 14px; font-size: 1rem; }
.result-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; gap: 20px; }
.result-icon { font-size: 3.5rem; }
.result-screen h1 { font-size: 1.5rem; font-weight: 700; }
.result-level-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 24px 40px; border: 2px solid var(--accent-primary); }
.result-level-number { font-size: 2rem; font-weight: 700; color: var(--accent-primary); }
.result-level-label { font-size: 0.85rem; color: var(--text-secondary); }
.result-stats { color: var(--text-muted); font-size: 0.9rem; }
.tier-breakdown { width: 100%; max-width: 350px; display: flex; flex-direction: column; gap: 8px; }
.tier-row { display: flex; align-items: center; gap: 10px; }
.tier-label { font-size: 0.75rem; color: var(--text-secondary); width: 95px; flex-shrink: 0; text-align: right; }
.tier-bar { flex: 1; height: 8px; background: var(--bg-accent); border-radius: 4px; overflow: hidden; }
.tier-fill { height: 100%; background: var(--gradient-xp); border-radius: 4px; transition: width 0.5s ease; }
.tier-score { font-size: 0.75rem; color: var(--text-muted); width: 30px; }
.result-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 350px; margin-top: 8px; }
.result-actions .btn { width: 100%; padding: 14px; font-size: 1rem; }
</style>
