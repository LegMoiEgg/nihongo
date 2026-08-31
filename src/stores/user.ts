import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface DailyLog {
  date: string // YYYY-MM-DD
  xpEarned: number
  sessionsCompleted: number
  wordsLearned: number
}

const LEVEL_THRESHOLDS = [
  // ── N5: Levels 1–30 (Beginner → JLPT N5 ready) ──
  // ~100 XP/day target. N5 takes several months.
  { level: 1, label: 'Anfänger', jlpt: 'N5', xpRequired: 0 },
  { level: 2, label: 'Anfänger II', jlpt: 'N5', xpRequired: 200 },
  { level: 3, label: 'Anfänger III', jlpt: 'N5', xpRequired: 500 },
  { level: 4, label: 'N5 · Kana Einsteiger', jlpt: 'N5', xpRequired: 900 },
  { level: 5, label: 'N5 · Kana Lerner', jlpt: 'N5', xpRequired: 1400 },
  { level: 6, label: 'N5 · Kana Kenner', jlpt: 'N5', xpRequired: 2000 },
  { level: 7, label: 'N5 · Erste Wörter', jlpt: 'N5', xpRequired: 2800 },
  { level: 8, label: 'N5 · Wortschatz I', jlpt: 'N5', xpRequired: 3800 },
  { level: 9, label: 'N5 · Wortschatz II', jlpt: 'N5', xpRequired: 5000 },
  { level: 10, label: 'N5 · Erste Sätze', jlpt: 'N5', xpRequired: 6500 },
  { level: 11, label: 'N5 · Satzbau I', jlpt: 'N5', xpRequired: 8200 },
  { level: 12, label: 'N5 · Satzbau II', jlpt: 'N5', xpRequired: 10000 },
  { level: 13, label: 'N5 · Grundlagen', jlpt: 'N5', xpRequired: 12000 },
  { level: 14, label: 'N5 · Grundlagen II', jlpt: 'N5', xpRequired: 14500 },
  { level: 15, label: 'N5 · Kanji Einsteiger', jlpt: 'N5', xpRequired: 17000 },
  { level: 16, label: 'N5 · Kanji Lerner', jlpt: 'N5', xpRequired: 20000 },
  { level: 17, label: 'N5 · Kanji & Vokabeln', jlpt: 'N5', xpRequired: 23500 },
  { level: 18, label: 'N5 · Aufbau I', jlpt: 'N5', xpRequired: 27000 },
  { level: 19, label: 'N5 · Aufbau II', jlpt: 'N5', xpRequired: 31000 },
  { level: 20, label: 'N5 · Fortgeschritten', jlpt: 'N5', xpRequired: 35500 },
  { level: 21, label: 'N5 · Fortgeschritten II', jlpt: 'N5', xpRequired: 40000 },
  { level: 22, label: 'N5 · Fortgeschritten III', jlpt: 'N5', xpRequired: 45000 },
  { level: 23, label: 'N5 · Vertiefung I', jlpt: 'N5', xpRequired: 50500 },
  { level: 24, label: 'N5 · Vertiefung II', jlpt: 'N5', xpRequired: 56000 },
  { level: 25, label: 'N5 · Vertiefung III', jlpt: 'N5', xpRequired: 62000 },
  { level: 26, label: 'N5 · Prüfungsvorbereitung', jlpt: 'N5', xpRequired: 68500 },
  { level: 27, label: 'N5 · Prüfungsreif I', jlpt: 'N5', xpRequired: 75000 },
  { level: 28, label: 'N5 · Prüfungsreif II', jlpt: 'N5', xpRequired: 82000 },
  { level: 29, label: 'N5 · Fast Meister', jlpt: 'N5', xpRequired: 90000 },
  { level: 30, label: 'N5 · Meister', jlpt: 'N5', xpRequired: 100000 },

  // ── N4: Levels 31–55 ──
  { level: 31, label: 'N4 · Einsteiger', jlpt: 'N4', xpRequired: 110000 },
  { level: 32, label: 'N4 · Einsteiger II', jlpt: 'N4', xpRequired: 121000 },
  { level: 33, label: 'N4 · Basis I', jlpt: 'N4', xpRequired: 133000 },
  { level: 34, label: 'N4 · Basis II', jlpt: 'N4', xpRequired: 146000 },
  { level: 35, label: 'N4 · Basis III', jlpt: 'N4', xpRequired: 160000 },
  { level: 36, label: 'N4 · Wortschatz I', jlpt: 'N4', xpRequired: 175000 },
  { level: 37, label: 'N4 · Wortschatz II', jlpt: 'N4', xpRequired: 192000 },
  { level: 38, label: 'N4 · Grammatik I', jlpt: 'N4', xpRequired: 210000 },
  { level: 39, label: 'N4 · Grammatik II', jlpt: 'N4', xpRequired: 230000 },
  { level: 40, label: 'N4 · Aufbau', jlpt: 'N4', xpRequired: 252000 },
  { level: 41, label: 'N4 · Aufbau II', jlpt: 'N4', xpRequired: 276000 },
  { level: 42, label: 'N4 · Fortgeschritten', jlpt: 'N4', xpRequired: 302000 },
  { level: 43, label: 'N4 · Fortgeschritten II', jlpt: 'N4', xpRequired: 330000 },
  { level: 44, label: 'N4 · Vertiefung', jlpt: 'N4', xpRequired: 360000 },
  { level: 45, label: 'N4 · Meister', jlpt: 'N4', xpRequired: 400000 },

  // ── N3: Levels 46–60 ──
  { level: 46, label: 'N3 · Einsteiger', jlpt: 'N3', xpRequired: 440000 },
  { level: 47, label: 'N3 · Basis', jlpt: 'N3', xpRequired: 485000 },
  { level: 48, label: 'N3 · Wortschatz', jlpt: 'N3', xpRequired: 535000 },
  { level: 49, label: 'N3 · Grammatik', jlpt: 'N3', xpRequired: 590000 },
  { level: 50, label: 'N3 · Aufbau', jlpt: 'N3', xpRequired: 650000 },
  { level: 51, label: 'N3 · Fortgeschritten', jlpt: 'N3', xpRequired: 720000 },
  { level: 52, label: 'N3 · Vertiefung', jlpt: 'N3', xpRequired: 800000 },
  { level: 53, label: 'N3 · Meister', jlpt: 'N3', xpRequired: 900000 },

  // ── N2: Levels 54–60 ──
  { level: 54, label: 'N2 · Einsteiger', jlpt: 'N2', xpRequired: 1000000 },
  { level: 55, label: 'N2 · Basis', jlpt: 'N2', xpRequired: 1150000 },
  { level: 56, label: 'N2 · Fortgeschritten', jlpt: 'N2', xpRequired: 1350000 },
  { level: 57, label: 'N2 · Meister', jlpt: 'N2', xpRequired: 1600000 },

  // ── N1: Levels 58–60 ──
  { level: 58, label: 'N1 · Einsteiger', jlpt: 'N1', xpRequired: 1900000 },
  { level: 59, label: 'N1 · Fortgeschritten', jlpt: 'N1', xpRequired: 2300000 },
  { level: 60, label: 'N1 · Meister', jlpt: 'N1', xpRequired: 2800000 },
]

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

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

export const useUserStore = defineStore('user', () => {
  // State
  const totalXp = ref(0)
  const currentStreak = ref(0)
  const longestStreak = ref(0)
  const lastActiveDate = ref('')
  const dailyXpGoal = ref(100)
  const dailyLog = ref<DailyLog[]>([])
  const wordsLearnedTotal = ref(0)
  const sessionsCompletedTotal = ref(0)

  // Profile
  const displayName = ref('')
  const avatarDataUrl = ref('') // base64 data URL from file upload

  // Computed
  const currentLevel = computed(() => {
    let lvl = LEVEL_THRESHOLDS[0]
    for (const threshold of LEVEL_THRESHOLDS) {
      if (totalXp.value >= threshold.xpRequired) {
        lvl = threshold
      } else {
        break
      }
    }
    return lvl
  })

  const nextLevel = computed(() => {
    const idx = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel.value.level)
    return idx < LEVEL_THRESHOLDS.length - 1 ? LEVEL_THRESHOLDS[idx + 1] : null
  })

  const xpForNextLevel = computed(() => {
    if (!nextLevel.value) return 0
    return nextLevel.value.xpRequired - totalXp.value
  })

  const levelProgress = computed(() => {
    if (!nextLevel.value) return 100
    const currentLevelXp = currentLevel.value.xpRequired
    const nextLevelXp = nextLevel.value.xpRequired
    const range = nextLevelXp - currentLevelXp
    const progress = totalXp.value - currentLevelXp
    return Math.round((progress / range) * 100)
  })

  const todayLog = computed((): DailyLog => {
    const today = getToday()
    return dailyLog.value.find(d => d.date === today) || {
      date: today,
      xpEarned: 0,
      sessionsCompleted: 0,
      wordsLearned: 0,
    }
  })

  const dailyGoalProgress = computed(() => {
    return Math.min(100, Math.round((todayLog.value.xpEarned / dailyXpGoal.value) * 100))
  })

  /** Whether the daily XP goal has been reached today */
  const dailyGoalReached = computed(() => todayLog.value.xpEarned >= dailyXpGoal.value)

  /** XP to award for a correct answer: 2 before daily goal, 1 after */
  const xpPerCorrect = computed(() => dailyGoalReached.value ? 1 : 2)

  const weeklyXp = computed(() => {
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split('T')[0]
    return dailyLog.value
      .filter(d => d.date >= weekAgoStr)
      .reduce((sum, d) => sum + d.xpEarned, 0)
  })

  // Actions
  function initializeUser() {
    totalXp.value = loadFromStorage('nihongo_xp', 0)
    currentStreak.value = loadFromStorage('nihongo_streak', 0)
    longestStreak.value = loadFromStorage('nihongo_longest_streak', 0)
    lastActiveDate.value = loadFromStorage('nihongo_last_active', '')
    dailyXpGoal.value = 100 // fixed, not user-configurable yet
    dailyLog.value = loadFromStorage('nihongo_daily_log', [])
    wordsLearnedTotal.value = loadFromStorage('nihongo_words_total', 0)
    sessionsCompletedTotal.value = loadFromStorage('nihongo_sessions_total', 0)
    displayName.value = loadFromStorage('nihongo_display_name', '')
    avatarDataUrl.value = loadFromStorage('nihongo_avatar', '')

    updateStreak()
  }

  function updateStreak() {
    const today = getToday()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastActiveDate.value === today) {
      // Already active today, streak is fine
      return
    } else if (lastActiveDate.value === yesterdayStr) {
      // Was active yesterday, streak continues (will be incremented on activity)
      return
    } else if (lastActiveDate.value && lastActiveDate.value < yesterdayStr) {
      // Missed a day, reset streak
      currentStreak.value = 0
      saveToStorage('nihongo_streak', 0)
    }
  }

  function addXp(amount: number, wordsLearned = 0) {
    const today = getToday()

    totalXp.value += amount
    saveToStorage('nihongo_xp', totalXp.value)

    // Update daily log
    let todayEntry = dailyLog.value.find(d => d.date === today)
    if (!todayEntry) {
      todayEntry = { date: today, xpEarned: 0, sessionsCompleted: 0, wordsLearned: 0 }
      dailyLog.value.push(todayEntry)
    }
    todayEntry.xpEarned += amount
    todayEntry.wordsLearned += wordsLearned

    // Keep only last 90 days
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 90)
    const cutoffStr = cutoff.toISOString().split('T')[0]
    dailyLog.value = dailyLog.value.filter(d => d.date >= cutoffStr)
    saveToStorage('nihongo_daily_log', dailyLog.value)

    // Update streak
    if (lastActiveDate.value !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (lastActiveDate.value === yesterdayStr || lastActiveDate.value === '') {
        currentStreak.value += 1
      } else {
        currentStreak.value = 1
      }

      if (currentStreak.value > longestStreak.value) {
        longestStreak.value = currentStreak.value
        saveToStorage('nihongo_longest_streak', longestStreak.value)
      }

      lastActiveDate.value = today
      saveToStorage('nihongo_streak', currentStreak.value)
      saveToStorage('nihongo_last_active', today)
    }

    // Update totals
    if (wordsLearned > 0) {
      wordsLearnedTotal.value += wordsLearned
      saveToStorage('nihongo_words_total', wordsLearnedTotal.value)
    }
  }

  function completeSession() {
    const today = getToday()
    const todayEntry = dailyLog.value.find(d => d.date === today)
    if (todayEntry) {
      todayEntry.sessionsCompleted += 1
      saveToStorage('nihongo_daily_log', dailyLog.value)
    }
    sessionsCompletedTotal.value += 1
    saveToStorage('nihongo_sessions_total', sessionsCompletedTotal.value)
  }

  function setDisplayName(name: string) {
    displayName.value = name.trim()
    saveToStorage('nihongo_display_name', displayName.value)
  }

  function setAvatar(dataUrl: string) {
    avatarDataUrl.value = dataUrl
    saveToStorage('nihongo_avatar', dataUrl)
  }

  return {
    // State
    totalXp,
    currentStreak,
    longestStreak,
    lastActiveDate,
    dailyXpGoal,
    dailyLog,
    wordsLearnedTotal,
    sessionsCompletedTotal,
    displayName,
    avatarDataUrl,
    // Computed
    currentLevel,
    nextLevel,
    xpForNextLevel,
    levelProgress,
    todayLog,
    dailyGoalProgress,
    dailyGoalReached,
    xpPerCorrect,
    weeklyXp,
    // Actions
    initializeUser,
    addXp,
    completeSession,
    setDisplayName,
    setAvatar,
  }
})
