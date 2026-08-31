<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { sentenceData, type SentenceChallenge } from '../data/sentences'

const userStore = useUserStore()

// State
const currentChallengeIndex = ref(0)
const selectedBlocks = ref<string[]>([])
const availableBlocks = ref<string[]>([])
const isChecked = ref(false)
const isCorrect = ref(false)
const showHint = ref(false)
const sessionScore = ref(0)
const sessionTotal = ref(0)
const sessionXp = ref(0)
const sessionComplete = ref(false)
const difficulty = ref<'easy' | 'medium' | 'hard'>('easy')
const challenges = ref<SentenceChallenge[]>([])

const currentChallenge = computed(() => challenges.value[currentChallengeIndex.value])

const progress = computed(() => {
  if (challenges.value.length === 0) return 0
  return Math.round((currentChallengeIndex.value / challenges.value.length) * 100)
})

function initSession() {
  const filtered = sentenceData.filter(s => s.difficulty === difficulty.value)
  challenges.value = filtered.sort(() => Math.random() - 0.5).slice(0, 10)
  currentChallengeIndex.value = 0
  sessionScore.value = 0
  sessionTotal.value = 0
  sessionXp.value = 0
  sessionComplete.value = false
  loadChallenge()
}

function loadChallenge() {
  if (!currentChallenge.value) return

  const challenge = currentChallenge.value
  const allBlocks = [...challenge.correctOrder, ...(challenge.distractors || [])]
  availableBlocks.value = allBlocks.sort(() => Math.random() - 0.5)
  selectedBlocks.value = []
  isChecked.value = false
  isCorrect.value = false
  showHint.value = false
}

function selectBlock(block: string, index: number) {
  if (isChecked.value) return
  selectedBlocks.value.push(block)
  availableBlocks.value.splice(index, 1)
}

function removeBlock(index: number) {
  if (isChecked.value) return
  const block = selectedBlocks.value[index]
  availableBlocks.value.push(block)
  selectedBlocks.value.splice(index, 1)
}

function checkAnswer() {
  if (!currentChallenge.value || selectedBlocks.value.length === 0) return

  isChecked.value = true
  sessionTotal.value++

  const correct = currentChallenge.value.correctOrder
  isCorrect.value =
    selectedBlocks.value.length === correct.length &&
    selectedBlocks.value.every((block, i) => block === correct[i])

  if (isCorrect.value) {
    sessionScore.value++
    const xp = difficulty.value === 'easy' ? 10 : difficulty.value === 'medium' ? 20 : 30
    sessionXp.value += xp
    userStore.addXp(xp)
  } else {
    userStore.addXp(2)
  }
}

function nextChallenge() {
  if (currentChallengeIndex.value < challenges.value.length - 1) {
    currentChallengeIndex.value++
    loadChallenge()
  } else {
    sessionComplete.value = true
    userStore.completeSession()
  }
}

function showCorrectAnswer() {
  if (!currentChallenge.value) return
  selectedBlocks.value = [...currentChallenge.value.correctOrder]
  availableBlocks.value = [...(currentChallenge.value.distractors || [])]
}

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="sentence-builder">
    <header class="page-header">
      <h1>🧩 Sätze bauen</h1>
      <div class="difficulty-selector">
        <button
          v-for="d in ['easy', 'medium', 'hard'] as const"
          :key="d"
          class="diff-btn"
          :class="{ active: difficulty === d }"
          @click="difficulty = d; initSession()"
        >
          {{ d === 'easy' ? 'Einfach' : d === 'medium' ? 'Mittel' : 'Schwer' }}
        </button>
      </div>
    </header>

    <div class="progress-bar" style="margin: 0 16px 16px;">
      <div class="progress-bar-fill" :style="{ width: progress + '%', background: 'var(--gradient-xp)' }" />
    </div>

    <!-- Session Complete -->
    <div v-if="sessionComplete" class="session-complete animate-fade-in">
      <div class="complete-icon">🎉</div>
      <h2>Runde geschafft!</h2>
      <div class="complete-stats">
        <div class="complete-stat">
          <span class="stat-number correct">{{ sessionScore }}</span>
          <span>Richtig</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number incorrect">{{ sessionTotal - sessionScore }}</span>
          <span>Falsch</span>
        </div>
        <div class="complete-stat">
          <span class="stat-number xp">+{{ sessionXp }}</span>
          <span>XP</span>
        </div>
      </div>
      <button class="btn btn-primary" @click="initSession()">Nochmal spielen</button>
    </div>

    <!-- Challenge -->
    <div v-else-if="currentChallenge" class="challenge-area">
      <div class="challenge-prompt card-flat">
        <p class="challenge-label">Übersetze:</p>
        <p class="challenge-text">{{ currentChallenge.meaning }}</p>
        <button
          v-if="!showHint && currentChallenge.hint"
          class="hint-btn btn-ghost"
          @click="showHint = true"
        >
          💡 Hinweis anzeigen
        </button>
        <p v-if="showHint && currentChallenge.hint" class="hint-text">
          💡 {{ currentChallenge.hint }}
        </p>
      </div>

      <!-- Answer area -->
      <div class="answer-area" :class="{ 'is-correct': isChecked && isCorrect, 'is-wrong': isChecked && !isCorrect }">
        <div class="answer-blocks">
          <button
            v-for="(block, i) in selectedBlocks"
            :key="'sel-' + i"
            class="word-block selected jp"
            :class="{ disabled: isChecked }"
            @click="removeBlock(i)"
          >
            {{ block }}
          </button>
          <span v-if="selectedBlocks.length === 0" class="answer-placeholder">
            Tippe auf die Wörter unten
          </span>
        </div>
      </div>

      <!-- Available blocks -->
      <div class="available-area">
        <button
          v-for="(block, i) in availableBlocks"
          :key="'avail-' + i"
          class="word-block available jp"
          :class="{ disabled: isChecked }"
          @click="selectBlock(block, i)"
        >
          {{ block }}
        </button>
      </div>

      <!-- Feedback -->
      <div v-if="isChecked" class="feedback animate-slide-up">
        <div v-if="isCorrect" class="feedback-correct">
          <span>✅ Richtig!</span>
        </div>
        <div v-else class="feedback-incorrect">
          <span>❌ Nicht ganz richtig</span>
          <button class="btn-ghost" @click="showCorrectAnswer">Lösung zeigen</button>
          <p class="correct-answer jp">
            {{ currentChallenge.correctOrder.join(' ') }}
          </p>
        </div>
        <button class="btn btn-primary next-btn" @click="nextChallenge">
          Weiter →
        </button>
      </div>

      <!-- Check Button -->
      <button
        v-else
        class="btn btn-primary check-btn"
        :disabled="selectedBlocks.length === 0"
        @click="checkAnswer"
      >
        Prüfen
      </button>
    </div>
  </div>
</template>

<style scoped>
.sentence-builder {
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 16px;
}

.page-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.difficulty-selector {
  display: flex;
  gap: 8px;
}

.diff-btn {
  padding: 6px 16px;
  border: 1px solid var(--bg-accent);
  border-radius: var(--radius-xl);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.diff-btn.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.challenge-area {
  flex: 1;
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.challenge-prompt {
  text-align: center;
  padding: 20px;
}

.challenge-label {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.challenge-text {
  font-size: 1.2rem;
  font-weight: 600;
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

/* Answer area */
.answer-area {
  min-height: 80px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 2px dashed var(--bg-accent);
  padding: 12px;
  transition: all var(--transition-fast);
}

.answer-area.is-correct {
  border-color: var(--accent-success);
  background: rgba(0, 200, 83, 0.05);
}

.answer-area.is-wrong {
  border-color: var(--accent-primary);
  background: rgba(233, 69, 96, 0.05);
}

.answer-blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 48px;
  align-items: center;
}

.answer-placeholder {
  color: var(--text-muted);
  font-size: 0.9rem;
  width: 100%;
  text-align: center;
}

/* Word blocks */
.word-block {
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all var(--transition-fast);
  touch-action: manipulation;
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

.word-block.selected:hover {
  opacity: 0.9;
}

.word-block.disabled {
  pointer-events: none;
  opacity: 0.7;
}

.available-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

/* Feedback */
.feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.feedback-correct span,
.feedback-incorrect span {
  font-size: 1.1rem;
  font-weight: 600;
}

.feedback-correct span {
  color: var(--accent-success);
}

.feedback-incorrect span {
  color: var(--accent-primary);
}

.correct-answer {
  color: var(--accent-success);
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 4px;
}

.check-btn,
.next-btn {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  padding: 16px;
  font-size: 1.05rem;
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
</style>
