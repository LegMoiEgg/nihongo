<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData } from '../data/kanji'
import { vocabularyData } from '../data/vocabulary'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
learningStore.initialize()

// ── Question types across difficulty tiers ──
interface PlacementQuestion {
  id: string
  tier: number        // 1=easiest, 5=hardest
  prompt: string
  promptJp?: string   // big Japanese text if applicable
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

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateQuestions(): PlacementQuestion[] {
  const questions: PlacementQuestion[] = []
  const hira = shuffle(hiraganaData.filter(h => h.character.length === 1 && h.group !== 'Sokuon'))
  const kata = shuffle(katakanaData.filter(k => k.character.length === 1 && k.group !== 'Sokuon'))
  const kanji = shuffle(kanjiData)
  const vocab = shuffle(vocabularyData.filter(v => v.partOfSpeech !== 'Ausdruck'))

  // ── Tier 1: Basic Hiragana (romaji → kana) ──
  for (const card of hira.slice(0, 5)) {
    const wrong = shuffle(hira.filter(h => h.character !== card.character)).slice(0, 3).map(h => h.character)
    questions.push({
      id: `t1-${card.id}`,
      tier: 1,
      prompt: `Welches Zeichen ist "${card.romaji}"?`,
      correctAnswer: card.character,
      options: shuffle([card.character, ...wrong]),
    })
  }

  // ── Tier 2: Hiragana reading (kana → romaji) + basic Katakana ──
  for (const card of hira.slice(5, 8)) {
    const wrong = shuffle(hira.filter(h => h.romaji !== card.romaji)).slice(0, 3).map(h => h.romaji)
    questions.push({
      id: `t2h-${card.id}`,
      tier: 2,
      prompt: 'Wie liest man dieses Zeichen?',
      promptJp: card.character,
      correctAnswer: card.romaji,
      options: shuffle([card.romaji, ...wrong]),
    })
  }
  for (const card of kata.slice(0, 3)) {
    const wrong = shuffle(kata.filter(k => k.character !== card.character)).slice(0, 3).map(k => k.character)
    questions.push({
      id: `t2k-${card.id}`,
      tier: 2,
      prompt: `Welches Katakana ist "${card.romaji}"?`,
      correctAnswer: card.character,
      options: shuffle([card.character, ...wrong]),
    })
  }

  // ── Tier 3: Vocabulary (meaning → reading) ──
  for (const v of vocab.slice(0, 5)) {
    const wrong = shuffle(vocab.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.reading)
    questions.push({
      id: `t3-${v.id}`,
      tier: 3,
      prompt: `Was heißt "${v.meaning}" auf Japanisch?`,
      correctAnswer: v.reading,
      options: shuffle([v.reading, ...wrong]),
    })
  }

  // ── Tier 4: Vocabulary reverse (reading → meaning) + Kanji meaning ──
  for (const v of vocab.slice(5, 8)) {
    const wrong = shuffle(vocab.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.meaning)
    questions.push({
      id: `t4v-${v.id}`,
      tier: 4,
      prompt: 'Was bedeutet dieses Wort?',
      promptJp: v.reading,
      correctAnswer: v.meaning,
      options: shuffle([v.meaning, ...wrong]),
    })
  }
  for (const k of kanji.slice(0, 3)) {
    const wrong = shuffle(kanji.filter(x => x.id !== k.id)).slice(0, 3).map(x => x.meanings[0])
    questions.push({
      id: `t4k-${k.id}`,
      tier: 4,
      prompt: 'Was bedeutet dieses Kanji?',
      promptJp: k.character,
      correctAnswer: k.meanings[0],
      options: shuffle([k.meanings[0], ...wrong]),
    })
  }

  // ── Tier 5: Kanji reading + advanced vocab ──
  for (const k of kanji.slice(3, 6)) {
    const correct = k.kunyomi[0] || k.onyomi[0]
    const wrong = shuffle(kanji.filter(x => x.id !== k.id)).slice(0, 3).map(x => x.kunyomi[0] || x.onyomi[0])
    questions.push({
      id: `t5k-${k.id}`,
      tier: 5,
      prompt: 'Wie liest man dieses Kanji?',
      promptJp: k.character,
      correctAnswer: correct,
      options: shuffle([correct, ...wrong]),
    })
  }
  for (const v of vocab.slice(8, 11)) {
    const wrong = shuffle(vocab.filter(x => x.id !== v.id)).slice(0, 3).map(x => x.reading)
    questions.push({
      id: `t5v-${v.id}`,
      tier: 5,
      prompt: `Was heißt "${v.meaning}"?`,
      correctAnswer: v.reading,
      options: shuffle([v.reading, ...wrong]),
    })
  }

  // Sort by tier
  return questions.sort((a, b) => a.tier - b.tier)
}

// ── State ──
const questions = ref<PlacementQuestion[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const isChecked = ref(false)
const isCorrect = ref(false)
const tierScores = ref<Record<number, { correct: number; total: number }>>({
  1: { correct: 0, total: 0 },
  2: { correct: 0, total: 0 },
  3: { correct: 0, total: 0 },
  4: { correct: 0, total: 0 },
  5: { correct: 0, total: 0 },
})
const testComplete = ref(false)
const resultLevel = ref(1)
const resultXp = ref(0)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progress = computed(() =>
  questions.value.length > 0 ? Math.round((currentIndex.value / questions.value.length) * 100) : 0
)
const totalCorrect = computed(() =>
  Object.values(tierScores.value).reduce((sum, t) => sum + t.correct, 0)
)

function selectAnswer(option: string) {
  if (isChecked.value) return
  selectedAnswer.value = option
  isChecked.value = true
  isCorrect.value = option === currentQuestion.value.correctAnswer

  const tier = currentQuestion.value.tier
  tierScores.value[tier].total++
  if (isCorrect.value) tierScores.value[tier].correct++
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

  // Calculate weighted score — higher tiers worth more
  let level = 1

  // Tier 1 passed (≥60%): level 3 (knows basic hiragana)
  if (scores[1].total > 0 && scores[1].correct / scores[1].total >= 0.6) level = 3

  // Tier 2 passed: level 5 (knows hiragana + basic katakana)
  if (scores[2].total > 0 && scores[2].correct / scores[2].total >= 0.6) level = 5

  // Tier 3 passed: level 8 (knows vocabulary)
  if (scores[3].total > 0 && scores[3].correct / scores[3].total >= 0.6) level = 8

  // Tier 4 passed: level 12 (knows vocab reverse + basic kanji)
  if (scores[4].total > 0 && scores[4].correct / scores[4].total >= 0.5) level = 12

  // Tier 5 passed: level 15+ (knows kanji readings)
  if (scores[5].total > 0 && scores[5].correct / scores[5].total >= 0.5) level = 16

  resultLevel.value = level

  // Calculate XP needed to reach that level (look up threshold)
  const thresholds = [
    0, 200, 500, 900, 1400, 2000, 2800, 3800, 5000, 6500,
    8200, 10000, 12000, 14500, 17000, 20000, 23500, 27000, 31000, 35500,
  ]
  resultXp.value = thresholds[Math.min(level - 1, thresholds.length - 1)] || 0
}

function applyResult() {
  // Set XP to match the determined level
  if (resultXp.value > userStore.totalXp) {
    const diff = resultXp.value - userStore.totalXp
    userStore.addXp(diff)
  }

  // Mark basic kana as "seen" if tier 1-2 passed
  const scores = tierScores.value
  if (scores[1].correct / Math.max(scores[1].total, 1) >= 0.6) {
    // Mark basic hiragana as learning
    for (const card of hiraganaData.filter(h => h.character.length === 1 && !h.group.includes('濁') && !h.group.includes('半濁') && !h.group.includes('Kombi'))) {
      const p = learningStore.getOrCreateProgress(card.id, 'hiragana')
      if (p.status === 'new') {
        p.status = 'learning'
        p.correctCount = 2
        p.consecutiveCorrect = 2
      }
    }
  }
  if (scores[2].correct / Math.max(scores[2].total, 1) >= 0.6) {
    for (const card of katakanaData.filter(k => k.character.length === 1 && !k.group.includes('濁') && !k.group.includes('半濁') && !k.group.includes('Kombi'))) {
      const p = learningStore.getOrCreateProgress(card.id, 'katakana')
      if (p.status === 'new') {
        p.status = 'learning'
        p.correctCount = 2
        p.consecutiveCorrect = 2
      }
    }
  }
  // Mark some vocab as seen if tier 3+ passed
  if (scores[3].correct / Math.max(scores[3].total, 1) >= 0.6) {
    for (const v of vocabularyData.slice(0, 20)) {
      const p = learningStore.getOrCreateProgress(v.id, 'vocabulary')
      if (p.status === 'new') {
        p.status = 'learning'
        p.correctCount = 1
        p.consecutiveCorrect = 1
      }
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

onMounted(() => {
  questions.value = generateQuestions()
})
</script>

<template>
  <div class="placement-test">
    <!-- Test Complete -->
    <div v-if="testComplete" class="result-screen animate-fade-in">
      <div class="result-icon">🎯</div>
      <h1>Dein Ergebnis</h1>

      <div class="result-level-card card">
        <span class="result-level-number">Level {{ resultLevel }}</span>
        <span class="result-level-label">Empfohlenes Startlevel</span>
      </div>

      <div class="result-stats">
        <span>{{ totalCorrect }} / {{ questions.length }} richtig</span>
      </div>

      <div class="tier-breakdown">
        <div v-for="tier in 5" :key="tier" class="tier-row">
          <span class="tier-label">
            {{ ['Hiragana', 'Kana', 'Vokabeln', 'Kanji Basis', 'Kanji Fortg.'][tier - 1] }}
          </span>
          <div class="tier-bar">
            <div
              class="tier-fill"
              :style="{
                width: (tierScores[tier].total > 0 ? (tierScores[tier].correct / tierScores[tier].total) * 100 : 0) + '%'
              }"
            />
          </div>
          <span class="tier-score">{{ tierScores[tier].correct }}/{{ tierScores[tier].total }}</span>
        </div>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" @click="applyResult">
          Mit Level {{ resultLevel }} starten
        </button>
        <button class="btn btn-ghost" @click="skipResult">
          Lieber bei Level 1 anfangen
        </button>
      </div>
    </div>

    <!-- Active Test -->
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
            v-for="option in currentQuestion.options"
            :key="option"
            class="mc-option"
            :class="{
              'jp': currentQuestion.tier <= 2 && currentQuestion.prompt.includes('Welches'),
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

        <div v-if="isChecked" class="feedback animate-slide-up">
          <p :class="isCorrect ? 'fb-correct' : 'fb-wrong'">
            {{ isCorrect ? '✅ Richtig!' : '❌ Falsch' }}
          </p>
          <p v-if="!isCorrect" class="fb-answer">
            Richtig: <span class="jp">{{ currentQuestion.correctAnswer }}</span>
          </p>
          <button class="btn btn-primary next-btn" @click="nextQuestion">
            {{ currentIndex < questions.length - 1 ? 'Weiter →' : 'Ergebnis anzeigen' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.placement-test {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* Header */
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.test-tier {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--accent-primary);
}

.test-counter {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Question */
.question-area {
  flex: 1;
  padding: 0 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  text-align: center;
  padding: 24px 20px;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.question-jp {
  font-size: 3rem;
  font-weight: 700;
  margin-top: 8px;
  line-height: 1.2;
}

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

.mc-option.dimmed { opacity: 0.4; }
.mc-option:disabled { cursor: default; }

/* Feedback */
.feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
}

.fb-correct { font-size: 1.1rem; font-weight: 600; color: var(--accent-success); }
.fb-wrong { font-size: 1.1rem; font-weight: 600; color: var(--accent-primary); }
.fb-answer { color: var(--text-secondary); font-size: 0.95rem; }

.next-btn {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  font-size: 1rem;
}

/* Result Screen */
.result-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 20px;
}

.result-icon { font-size: 3.5rem; }

.result-screen h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.result-level-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 24px 40px;
  border: 2px solid var(--accent-primary);
}

.result-level-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.result-level-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.result-stats {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Tier breakdown */
.tier-breakdown {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tier-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tier-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  width: 85px;
  flex-shrink: 0;
  text-align: right;
}

.tier-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-accent);
  border-radius: 4px;
  overflow: hidden;
}

.tier-fill {
  height: 100%;
  background: var(--gradient-xp);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.tier-score {
  font-size: 0.75rem;
  color: var(--text-muted);
  width: 30px;
}

/* Actions */
.result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 350px;
  margin-top: 8px;
}

.result-actions .btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
}
</style>
