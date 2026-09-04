import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type CardCategory = 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'grammar'
export type CardStatus = 'new' | 'learning' | 'reviewing' | 'mastered'

export interface CardProgress {
  id: string
  category: CardCategory
  status: CardStatus
  correctCount: number
  incorrectCount: number
  consecutiveCorrect: number  // resets on any wrong answer
  lastReviewed: string | null
  nextReview: string | null
  interval: number
  easeFactor: number
}

/** How many consecutive correct answers to consider a word "mastered" */
const MASTERY_STREAK = 5

/**
 * How many vocab items are unlocked per level bracket.
 * At level 1 the first 8 vocab are available, at level 2 the first 16, etc.
 * This controls the "don't overwhelm the learner" flow.
 */
/** New vocabulary unlocked per level. The pool grows by this many words
 *  with every level-up (Level 1 → 10 words, Level 2 → 20, Level 5 → 50 …). */
const VOCAB_PER_LEVEL = 10

function getVocabPoolSize(level: number): number {
  const lvl = Math.max(1, level)
  // 10 words per level, growing with each level-up.
  return lvl * VOCAB_PER_LEVEL
}

/**
 * Row-by-row learning curriculum for kana.
 * Instead of quizzing characters cross-wise, beginners learn one row at a
 * time, then mix rows together, then move on to the next rows.
 *
 * Each lesson lists the `group` names (matching the `group` field in the
 * kana data) that it covers. A lesson with multiple rows is a "mix" lesson.
 * `newGroups` marks rows introduced for the first time in this lesson —
 * these are the rows that must be mastered to progress.
 */
export interface KanaLesson {
  groups: string[]      // all rows practiced in this lesson
  newGroups: string[]   // rows newly introduced (drives progression)
  isMix: boolean        // true = review/mix of already-seen rows
}

export const KANA_CURRICULUM: KanaLesson[] = [
  // ── Basic syllables, one row at a time, then mixed ──
  { groups: ['Vokale'], newGroups: ['Vokale'], isMix: false },
  { groups: ['K-Reihe'], newGroups: ['K-Reihe'], isMix: false },
  { groups: ['S-Reihe'], newGroups: ['S-Reihe'], isMix: false },
  { groups: ['Vokale', 'K-Reihe', 'S-Reihe'], newGroups: [], isMix: true },

  { groups: ['T-Reihe'], newGroups: ['T-Reihe'], isMix: false },
  { groups: ['N-Reihe'], newGroups: ['N-Reihe'], isMix: false },
  { groups: ['T-Reihe', 'N-Reihe'], newGroups: [], isMix: true },

  { groups: ['H-Reihe'], newGroups: ['H-Reihe'], isMix: false },
  { groups: ['M-Reihe'], newGroups: ['M-Reihe'], isMix: false },
  { groups: ['H-Reihe', 'M-Reihe'], newGroups: [], isMix: true },

  { groups: ['Y-Reihe'], newGroups: ['Y-Reihe'], isMix: false },
  { groups: ['R-Reihe'], newGroups: ['R-Reihe'], isMix: false },
  { groups: ['W-Reihe'], newGroups: ['W-Reihe'], isMix: false },
  { groups: ['Y-Reihe', 'R-Reihe', 'W-Reihe'], newGroups: [], isMix: true },

  // Big review of all basic syllables
  {
    groups: [
      'Vokale', 'K-Reihe', 'S-Reihe', 'T-Reihe', 'N-Reihe',
      'H-Reihe', 'M-Reihe', 'Y-Reihe', 'R-Reihe', 'W-Reihe',
    ],
    newGroups: [],
    isMix: true,
  },

  // ── Dakuten ──
  { groups: ['G-Reihe (濁)'], newGroups: ['G-Reihe (濁)'], isMix: false },
  { groups: ['Z-Reihe (濁)'], newGroups: ['Z-Reihe (濁)'], isMix: false },
  { groups: ['D-Reihe (濁)'], newGroups: ['D-Reihe (濁)'], isMix: false },
  { groups: ['B-Reihe (濁)'], newGroups: ['B-Reihe (濁)'], isMix: false },
  {
    groups: ['G-Reihe (濁)', 'Z-Reihe (濁)', 'D-Reihe (濁)', 'B-Reihe (濁)'],
    newGroups: [],
    isMix: true,
  },

  // ── Handakuten + Sokuon ──
  { groups: ['P-Reihe (半濁)'], newGroups: ['P-Reihe (半濁)'], isMix: false },
  { groups: ['Sokuon'], newGroups: ['Sokuon'], isMix: false },

  // ── Combination syllables (yōon) ──
  { groups: ['K-Kombi'], newGroups: ['K-Kombi'], isMix: false },
  { groups: ['S-Kombi'], newGroups: ['S-Kombi'], isMix: false },
  { groups: ['T-Kombi'], newGroups: ['T-Kombi'], isMix: false },
  { groups: ['N-Kombi'], newGroups: ['N-Kombi'], isMix: false },
  { groups: ['H-Kombi'], newGroups: ['H-Kombi'], isMix: false },
  { groups: ['M-Kombi'], newGroups: ['M-Kombi'], isMix: false },
  { groups: ['R-Kombi'], newGroups: ['R-Kombi'], isMix: false },
  {
    groups: ['K-Kombi', 'S-Kombi', 'T-Kombi', 'N-Kombi', 'H-Kombi', 'M-Kombi', 'R-Kombi'],
    newGroups: [],
    isMix: true,
  },
  { groups: ['G-Kombi'], newGroups: ['G-Kombi'], isMix: false },
  { groups: ['Z-Kombi'], newGroups: ['Z-Kombi'], isMix: false },
  { groups: ['B-Kombi'], newGroups: ['B-Kombi'], isMix: false },
  { groups: ['P-Kombi'], newGroups: ['P-Kombi'], isMix: false },
]

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export const useLearningStore = defineStore('learning', () => {
  const cardProgress = ref<CardProgress[]>([])

  // ── Computed ──
  const progressByCategory = computed(() => {
    const categories: CardCategory[] = ['hiragana', 'katakana', 'kanji', 'vocabulary', 'grammar']
    const result: Record<CardCategory, { total: number; new: number; learning: number; reviewing: number; mastered: number }> = {} as any

    for (const cat of categories) {
      const cards = cardProgress.value.filter(c => c.category === cat)
      result[cat] = {
        total: cards.length,
        new: cards.filter(c => c.status === 'new').length,
        learning: cards.filter(c => c.status === 'learning').length,
        reviewing: cards.filter(c => c.status === 'reviewing').length,
        mastered: cards.filter(c => c.status === 'mastered').length,
      }
    }
    return result
  })

  const dueCards = computed(() => {
    const today = getToday()
    return cardProgress.value.filter(c => {
      if (c.status === 'new') return true
      if (c.status === 'mastered') return false
      if (!c.nextReview) return true
      return c.nextReview <= today
    })
  })

  const dueByCategory = computed(() => {
    const result: Record<CardCategory, number> = {
      hiragana: 0,
      katakana: 0,
      kanji: 0,
      vocabulary: 0,
      grammar: 0,
    }
    for (const card of dueCards.value) {
      result[card.category]++
    }
    return result
  })

  /** Number of vocab cards that have consecutiveCorrect >= MASTERY_STREAK */
  const masteredVocabCount = computed(() =>
    cardProgress.value.filter(
      c => c.category === 'vocabulary' && c.consecutiveCorrect >= MASTERY_STREAK
    ).length
  )

  // ── Actions ──
  function initialize() {
    const stored = loadFromStorage<CardProgress[]>('nihongo_card_progress', [])
    // Migrate old data that may lack consecutiveCorrect
    cardProgress.value = stored.map(c => ({
      ...c,
      consecutiveCorrect: c.consecutiveCorrect ?? 0,
    }))
  }

  function getOrCreateProgress(id: string, category: CardCategory): CardProgress {
    let progress = cardProgress.value.find(c => c.id === id)
    if (!progress) {
      progress = {
        id,
        category,
        status: 'new',
        correctCount: 0,
        incorrectCount: 0,
        consecutiveCorrect: 0,
        lastReviewed: null,
        nextReview: null,
        interval: 0,
        easeFactor: 2.5,
      }
      cardProgress.value.push(progress)
    }
    return progress
  }

  function recordAnswer(id: string, category: CardCategory, correct: boolean) {
    const progress = getOrCreateProgress(id, category)
    const today = getToday()

    progress.lastReviewed = today

    if (correct) {
      progress.correctCount++
      progress.consecutiveCorrect++

      // SRS logic
      if (progress.status === 'new') {
        progress.status = 'learning'
        progress.interval = 1
      } else if (progress.status === 'learning') {
        progress.interval = 3
        if (progress.consecutiveCorrect >= MASTERY_STREAK) {
          progress.status = 'mastered'
        } else if (progress.consecutiveCorrect >= 3) {
          progress.status = 'reviewing'
        }
      } else if (progress.status === 'reviewing') {
        progress.interval = Math.round(progress.interval * progress.easeFactor)
        progress.easeFactor = Math.min(3.0, progress.easeFactor + 0.1)
        if (progress.consecutiveCorrect >= MASTERY_STREAK) {
          progress.status = 'mastered'
        }
      }
    } else {
      progress.incorrectCount++
      progress.consecutiveCorrect = 0 // reset streak!
      progress.easeFactor = Math.max(1.3, progress.easeFactor - 0.2)
      progress.interval = 1

      if (progress.status === 'reviewing' || progress.status === 'mastered') {
        progress.status = 'learning'
      }
    }

    // Next review date
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + progress.interval)
    progress.nextReview = nextDate.toISOString().split('T')[0]

    saveToStorage('nihongo_card_progress', cardProgress.value)
  }

  /**
   * Returns the vocab IDs the learner has access to, based on their level.
   * Vocab is released in order (first items in the vocabulary array first).
   * New words are only added once existing unmastered ones are under control.
   */
  /**
   * The full set of vocab available at the given level (level × 10), without
   * the "don't flood me" throttle. Used by the overview to show everything
   * the learner has access to at their level.
   */
  function getLevelVocabIds(allVocabIds: string[], userLevel: number): string[] {
    return allVocabIds.slice(0, getVocabPoolSize(userLevel))
  }

  function getUnlockedVocabIds(allVocabIds: string[], userLevel: number): string[] {
    const poolSize = getVocabPoolSize(userLevel)
    const candidateIds = allVocabIds.slice(0, poolSize)

    // Split the level pool into words the learner has already seen and
    // brand-new (never-answered) words.
    const seenIds: string[] = []
    const unseenIds: string[] = []
    for (const id of candidateIds) {
      const p = cardProgress.value.find(c => c.id === id)
      if (p && p.status !== 'new') seenIds.push(id)
      else unseenIds.push(id)
    }

    // How many of the seen words are still not mastered (need more practice)?
    const activeUnmastered = seenIds.filter(id => {
      const p = cardProgress.value.find(c => c.id === id)
      return !p || p.consecutiveCorrect < MASTERY_STREAK
    }).length

    // Keep a healthy queue of new words flowing, but don't flood the learner:
    // allow up to MAX_ACTIVE_NEW unmastered words in rotation at once.
    const MAX_ACTIVE_NEW = 10
    const roomForNew = Math.max(0, MAX_ACTIVE_NEW - activeUnmastered)

    return [...seenIds, ...unseenIds.slice(0, roomForNew)]
  }

  /**
   * Returns vocab cards for the daily lesson, prioritizing:
   * 1. Unmastered words that need practice (consecutiveCorrect < 5)
   * 2. A few new words (max 2-3 per session)
   */
  function getVocabForDailyLesson(allVocabIds: string[], userLevel: number, limit = 10): { id: string; isNew: boolean }[] {
    const unlocked = getUnlockedVocabIds(allVocabIds, userLevel)

    // Proper Fisher-Yates shuffle. The previous `sort(() => Math.random()-0.5)`
    // is statistically biased and barely reorders — that's a big reason the
    // daily lesson felt like the SAME words every day.
    const shuffleIds = (arr: string[]): string[] => {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }

    const mastered: string[] = []
    const inProgress: string[] = []
    const brandNew: string[] = []

    for (const id of unlocked) {
      const p = cardProgress.value.find(c => c.id === id)
      if (!p || p.status === 'new') {
        brandNew.push(id)
      } else if (p.consecutiveCorrect >= MASTERY_STREAK) {
        mastered.push(id)
      } else {
        inProgress.push(id)
      }
    }

    const result: { id: string; isNew: boolean }[] = []

    // Priority 1: in-progress words (properly shuffled so the SELECTION —
    // not just the order — varies between sessions).
    const shuffledInProgress = shuffleIds(inProgress)
    for (const id of shuffledInProgress.slice(0, limit)) {
      result.push({ id, isNew: false })
    }

    // Priority 2: add up to 3 new words if we have room.
    const maxNew = Math.min(3, limit - result.length)
    for (const id of shuffleIds(brandNew).slice(0, maxNew)) {
      result.push({ id, isNew: true })
    }

    // Priority 3: fill remaining with mastered words for review.
    if (result.length < limit) {
      const shuffledMastered = shuffleIds(mastered)
      for (const id of shuffledMastered.slice(0, limit - result.length)) {
        result.push({ id, isNew: false })
      }
    }

    // If we STILL have fewer than the limit but there are more unlocked words
    // available overall, top up with a random review sample so higher-level
    // users with a large vocabulary see fresh mixes instead of the same core.
    if (result.length < limit) {
      const already = new Set(result.map(r => r.id))
      const extras = shuffleIds(unlocked.filter(id => !already.has(id)))
      for (const id of extras.slice(0, limit - result.length)) {
        result.push({ id, isNew: false })
      }
    }

    return shuffleIds(result.map(r => r.id)).map(id => result.find(r => r.id === id)!)
  }

  function isCardMastered(id: string): boolean {
    const p = cardProgress.value.find(c => c.id === id)
    return !!p && p.consecutiveCorrect >= MASTERY_STREAK
  }

  function getConsecutiveCorrect(id: string): number {
    const p = cardProgress.value.find(c => c.id === id)
    return p?.consecutiveCorrect ?? 0
  }

  function getDueCardsForCategory(category: CardCategory, limit = 20): CardProgress[] {
    const today = getToday()
    const categoryCards = cardProgress.value.filter(c => c.category === category)

    const due = categoryCards.filter(c => {
      if (c.status === 'mastered') return false
      if (!c.nextReview) return true
      return c.nextReview <= today
    })

    due.sort((a, b) => {
      if (a.status === 'new' && b.status !== 'new') return -1
      if (a.status !== 'new' && b.status === 'new') return 1
      return (a.nextReview || '').localeCompare(b.nextReview || '')
    })

    return due.slice(0, limit)
  }

  /**
   * Determine which curriculum lesson the learner should do next for a kana
   * category. A lesson's newly-introduced rows count as "done" once every
   * character in those rows has been answered correctly at least twice.
   *
   * @param allCards  all kana cards for the category (need id + group)
   * @returns the index into KANA_CURRICULUM to study next
   */
  function getCurrentKanaLessonIndex(allCards: { id: string; group: string }[]): number {
    const ADVANCE_STREAK = 2 // correct answers per char to advance past a row

    function rowLearned(group: string): boolean {
      const cardsInRow = allCards.filter(c => c.group === group)
      if (cardsInRow.length === 0) return true // row not in data → skip
      return cardsInRow.every(c => {
        const p = cardProgress.value.find(cp => cp.id === c.id)
        return p && p.consecutiveCorrect >= ADVANCE_STREAK
      })
    }

    for (let i = 0; i < KANA_CURRICULUM.length; i++) {
      const lesson = KANA_CURRICULUM[i]
      // A single-row lesson is complete when its new row is learned.
      // A mix lesson is complete once all its rows are learned too.
      const groupsToCheck = lesson.newGroups.length > 0 ? lesson.newGroups : lesson.groups
      const complete = groupsToCheck.every(g => rowLearned(g))
      if (!complete) return i
    }
    // All lessons done → keep offering the last big review
    return KANA_CURRICULUM.length - 1
  }

  /**
   * Returns the kana card IDs to include in the next session, following the
   * row-by-row curriculum. Includes the current lesson's rows plus, for mix
   * lessons, a light review of previously-learned rows.
   */
  function getCurriculumCardIds(allCards: { id: string; group: string }[]): string[] {
    const idx = getCurrentKanaLessonIndex(allCards)
    const lesson = KANA_CURRICULUM[idx]
    const groups = new Set(lesson.groups)
    return allCards.filter(c => groups.has(c.group)).map(c => c.id)
  }

  function getCategoryStats(category: CardCategory) {
    const cards = cardProgress.value.filter(c => c.category === category)
    const total = cards.length
    if (total === 0) return { accuracy: 0, mastered: 0, total: 0 }

    const totalCorrect = cards.reduce((sum, c) => sum + c.correctCount, 0)
    const totalAnswers = cards.reduce((sum, c) => sum + c.correctCount + c.incorrectCount, 0)

    return {
      accuracy: totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0,
      mastered: cards.filter(c => c.consecutiveCorrect >= MASTERY_STREAK).length,
      total,
    }
  }

  return {
    cardProgress,
    progressByCategory,
    dueCards,
    dueByCategory,
    masteredVocabCount,
    MASTERY_STREAK,
    initialize,
    getOrCreateProgress,
    recordAnswer,
    getUnlockedVocabIds,
    getLevelVocabIds,
    getVocabForDailyLesson,
    isCardMastered,
    getConsecutiveCorrect,
    getDueCardsForCategory,
    getCategoryStats,
    getCurrentKanaLessonIndex,
    getCurriculumCardIds,
  }
})
