<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { useBadgesStore } from '../stores/badges'
import { scheduleSave } from '../stores/sync'
import { playCorrectSound, playWrongSound } from '../composables/useSounds'
import { particleData, allParticles, type ParticleCard, type ParticleQuiz } from '../data/particles'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
const badgesStore = useBadgesStore()

learningStore.initialize()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Study phase: show particle cards (explanation + examples) first ──
const studyPhase = ref(false)
const studyCards = ref<ParticleCard[]>([])
const studyIndex = ref(0)
const studyCard = computed<ParticleCard | null>(() => studyCards.value[studyIndex.value] ?? null)
const studyProgress = computed(() =>
  studyCards.value.length > 0 ? Math.round((studyIndex.value / studyCards.value.length) * 100) : 0
)

// ── Quiz: fill-in-the-blank (which particle?) ──
interface QuizItem {
  quiz: ParticleQuiz
  particleId: string      // for progress tracking (e.g. 'p-wa')
  options: string[]       // particle choices
}
const quizItems = ref<QuizItem[]>([])
const currentIndex = ref(0)
const currentItem = computed<QuizItem | null>(() => quizItems.value[currentIndex.value] ?? null)

const selectedOption = ref<string | null>(null)
const checked = ref(false)
const isCorrect = ref(false)

const sessionCorrect = ref(0)
const sessionIncorrect = ref(0)
const sessionXp = ref(0)
const sessionComplete = ref(false)

const progress = computed(() =>
  quizItems.value.length > 0 ? Math.round((currentIndex.value / quizItems.value.length) * 100) : 0
)

/** Options: correct particle + 3 distractors from the other particles. */
function buildOptions(answer: string): string[] {
  const wrong = shuffle(allParticles.filter(p => p !== answer)).slice(0, 3)
  return shuffle([answer, ...wrong])
}

function isNew(id: string): boolean {
  const p = learningStore.cardProgress.find(cp => cp.id === id)
  return !p || p.status === 'new'
}

function initSession() {
  // Ensure progress entries exist for all particles.
  for (const p of particleData) {
    learningStore.getOrCreateProgress(p.id, 'grammar')
  }

  // Build quiz items from every particle's quiz sentences.
  const items: QuizItem[] = []
  for (const p of particleData) {
    for (const quiz of p.quizzes) {
      items.push({ quiz, particleId: p.id, options: buildOptions(quiz.answer) })
    }
  }
  quizItems.value = shuffle(items)

  currentIndex.value = 0
  selectedOption.value = null
  checked.value = false
  isCorrect.value = false
  sessionCorrect.value = 0
  sessionIncorrect.value = 0
  sessionXp.value = 0
  sessionComplete.value = false

  // Study phase: show cards for particles the learner hasn't seen yet.
  const newOnes = particleData.filter(p => isNew(p.id))
  if (newOnes.length > 0) {
    studyCards.value = newOnes
    studyIndex.value = 0
    studyPhase.value = true
  } else {
    studyPhase.value = false
  }
}

function nextStudyCard() {
  if (studyIndex.value < studyCards.value.length - 1) {
    studyIndex.value++
  } else {
    studyPhase.value = false
  }
}
function prevStudyCard() {
  if (studyIndex.value > 0) studyIndex.value--
}
function skipStudy() {
  studyPhase.value = false
}

function selectOption(option: string) {
  if (checked.value) return
  selectedOption.value = option
  checked.value = true
  const item = currentItem.value
  if (!item) return

  isCorrect.value = option === item.quiz.answer
  learningStore.recordAnswer(item.particleId, 'grammar', isCorrect.value)

  if (isCorrect.value) {
    sessionCorrect.value++
    const xp = userStore.xpPerCorrect
    sessionXp.value += xp
    userStore.addXp(xp, 1)
    playCorrectSound()
  } else {
    sessionIncorrect.value++
    playWrongSound()
  }
}

function nextItem() {
  if (currentIndex.value < quizItems.value.length - 1) {
    currentIndex.value++
    selectedOption.value = null
    checked.value = false
    isCorrect.value = false
  } else {
    sessionComplete.value = true
    userStore.completeSession()
    badgesStore.checkAllBadges()
    scheduleSave()
  }
}

/** Render the quiz sentence with the blank highlighted. */
function sentenceParts(sentence: string): { before: string; after: string } {
  const idx = sentence.indexOf('＿')
  if (idx === -1) return { before: sentence, after: '' }
  return { before: sentence.slice(0, idx), after: sentence.slice(idx + 1) }
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
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>Grammatik — Partikel</h1>
      <span class="card-counter">
        {{ studyPhase ? `${studyIndex + 1} / ${studyCards.length}` : `${currentIndex + 1} / ${quizItems.length}` }}
      </span>
    </header>

    <!-- Progress Bar -->
    <div class="progress-bar" style="margin: 0 16px 16px;">
      <div
        class="progress-bar-fill"
        :style="{ width: (studyPhase ? studyProgress : progress) + '%', background: 'var(--gradient-xp)' }"
      />
    </div>

    <!-- ==================== STUDY PHASE ==================== -->
    <div v-if="studyPhase && studyCard" class="study-phase animate-fade-in">
      <div class="study-intro">
        <span class="study-badge">Lernen</span>
        <p class="study-hint">Schau dir den Partikel an. Danach wird abgefragt.</p>
      </div>

      <div class="study-card grammar-study-card">
        <span class="study-character jp">{{ studyCard.particle }}</span>
        <span class="study-romaji">{{ studyCard.romaji }} · {{ studyCard.name }}</span>

        <p class="grammar-explanation">{{ studyCard.explanation }}</p>

        <div class="study-examples">
          <p class="study-examples-title">Beispiele</p>
          <div v-for="(ex, i) in studyCard.examples" :key="i" class="study-example grammar-example">
            <span class="study-example-word jp">{{ ex.japanese }}</span>
            <span class="study-example-meaning">{{ ex.meaning }}</span>
          </div>
        </div>
      </div>

      <div class="study-actions">
        <button class="btn btn-secondary" :disabled="studyIndex === 0" @click="prevStudyCard">Zurück</button>
        <button class="btn btn-primary" @click="nextStudyCard">
          {{ studyIndex < studyCards.length - 1 ? 'Weiter' : 'Los geht\'s!' }}
        </button>
      </div>

      <button class="btn-ghost study-skip" @click="skipStudy">Überspringen</button>
    </div>

    <!-- ==================== QUIZ ==================== -->
    <template v-if="!studyPhase">
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
          Genauigkeit: {{ quizItems.length > 0 ? Math.round((sessionCorrect / quizItems.length) * 100) : 0 }}%
        </div>
        <div class="complete-actions">
          <button class="btn btn-primary" @click="restartSession">Nochmal üben</button>
          <button class="btn btn-secondary" @click="goBack">Zurück</button>
        </div>
      </div>

      <!-- Fill-in-the-blank -->
      <div v-else-if="currentItem" class="kana-mc-container">
        <div class="grammar-prompt-card" :class="checked ? (isCorrect ? 'feedback-correct' : 'feedback-incorrect') : ''">
          <p class="grammar-meaning">{{ currentItem.quiz.meaning }}</p>
          <p class="grammar-sentence jp">
            <span>{{ sentenceParts(currentItem.quiz.sentence).before }}</span>
            <span class="grammar-blank">{{ checked ? currentItem.quiz.answer : '＿' }}</span>
            <span>{{ sentenceParts(currentItem.quiz.sentence).after }}</span>
          </p>
          <p v-if="!checked" class="kana-prompt">Welcher Partikel passt?</p>
        </div>

        <div v-if="!checked" class="mc-options">
          <button
            v-for="option in currentItem.options"
            :key="option"
            class="mc-option jp"
            :disabled="selectedOption !== null"
            @click="selectOption(option)"
          >
            {{ option }}
          </button>
        </div>

        <div v-else class="kana-example animate-slide-up">
          <div class="example-result">
            <span v-if="isCorrect" class="result-icon">✅</span>
            <span v-else class="result-icon">❌</span>
            <span class="result-reading jp">{{ currentItem.quiz.answer }}</span>
          </div>

          <div class="example-card card-flat">
            <p class="example-word jp-medium">{{ currentItem.quiz.reading }}</p>
            <p class="example-meaning">{{ currentItem.quiz.why }}</p>
          </div>

          <button class="btn btn-primary next-btn" @click="nextItem">Weiter →</button>
        </div>
      </div>
    </template>
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
.session-header h1 { font-size: 1.1rem; font-weight: 600; }
.card-counter { color: var(--text-muted); font-size: 0.85rem; }
.back-btn {
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Study phase */
.study-phase {
  padding: 0 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.study-intro { text-align: center; }
.study-badge {
  display: inline-block;
  background: var(--gradient-xp);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 999px;
}
.study-hint { color: var(--text-secondary); font-size: 0.85rem; margin-top: 6px; }

.study-card {
  width: 100%;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.grammar-study-card { align-items: stretch; }
.study-character {
  font-size: 4rem;
  font-weight: 700;
  text-align: center;
  line-height: 1;
}
.study-romaji {
  color: var(--text-secondary);
  font-size: 1rem;
  text-align: center;
  margin-bottom: 8px;
}
.grammar-explanation {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-accent);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}
.study-examples { margin-top: 8px; }
.study-examples-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.study-example { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; border-bottom: 1px solid var(--border-color); }
.grammar-example:last-child { border-bottom: none; }
.study-example-word { font-size: 1.1rem; }
.study-example-meaning { font-size: 0.85rem; color: var(--text-secondary); }

.study-actions { display: flex; gap: 12px; width: 100%; }
.study-actions .btn { flex: 1; }
.study-skip { color: var(--text-muted); font-size: 0.85rem; }

/* Quiz */
.kana-mc-container {
  padding: 0 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}
.grammar-prompt-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 28px 20px;
  text-align: center;
  transition: box-shadow 0.2s;
}
.grammar-meaning { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 14px; }
.grammar-sentence { font-size: 1.6rem; line-height: 1.5; word-break: break-word; }
.grammar-blank {
  display: inline-block;
  min-width: 1.4em;
  color: var(--accent-primary);
  font-weight: 700;
  border-bottom: 2px dashed var(--accent-primary);
  margin: 0 2px;
}
.kana-prompt { color: var(--text-muted); font-size: 0.9rem; margin-top: 14px; }
.feedback-correct { box-shadow: 0 0 0 2px var(--color-success, #00c853); }
.feedback-incorrect { box-shadow: 0 0 0 2px var(--color-danger, #e94560); }

.mc-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.mc-option {
  padding: 18px;
  font-size: 1.5rem;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: transform 0.1s, border-color 0.2s;
}
.mc-option:hover:not(:disabled) { border-color: var(--accent-primary); transform: translateY(-2px); }
.mc-option:disabled { cursor: default; }

.kana-example { display: flex; flex-direction: column; gap: 16px; align-items: center; }
.example-result { display: flex; align-items: center; gap: 10px; }
.result-icon { font-size: 1.6rem; }
.result-reading { font-size: 1.4rem; font-weight: 700; }
.example-card { width: 100%; padding: 16px; text-align: center; }
.example-word { margin-bottom: 6px; }
.example-meaning { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4; }
.next-btn { width: 100%; }

/* Session complete */
.session-complete {
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
}
.complete-icon { font-size: 3.5rem; }
.complete-stats { display: flex; gap: 28px; }
.complete-stat { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: var(--text-muted); }
.stat-number { font-size: 1.6rem; font-weight: 700; }
.stat-number.correct { color: var(--color-success, #00c853); }
.stat-number.incorrect { color: var(--color-danger, #e94560); }
.stat-number.xp { color: var(--accent-primary); }
.complete-accuracy { color: var(--text-secondary); }
.complete-actions { display: flex; gap: 12px; }
</style>
