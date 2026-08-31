import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface DailyLog {
  date: string // YYYY-MM-DD
  xpEarned: number
  sessionsCompleted: number
  wordsLearned: number
}

const LEVEL_THRESHOLDS = [
  { level: 1, label: 'Anfänger', jlpt: 'N5', xpRequired: 0 },
  { level: 2, label: 'N5 Basis', jlpt: 'N5', xpRequired: 500 },
  { level: 3, label: 'N5 Fortgeschritten', jlpt: 'N5', xpRequired: 1500 },
  { level: 4, label: 'N5 Meister', jlpt: 'N5', xpRequired: 3000 },
  { level: 5, label: 'N4 Basis', jlpt: 'N4', xpRequired: 5000 },
  { level: 6, label: 'N4 Fortgeschritten', jlpt: 'N4', xpRequired: 8000 },
  { level: 7, label: 'N4 Meister', jlpt: 'N4', xpRequired: 12000 },
  { level: 8, label: 'N3 Basis', jlpt: 'N3', xpRequired: 17000 },
  { level: 9, label: 'N3 Fortgeschritten', jlpt: 'N3', xpRequired: 23000 },
  { level: 10, label: 'N3 Meister', jlpt: 'N3', xpRequired: 30000 },
  { level: 11, label: 'N2 Basis', jlpt: 'N2', xpRequired: 40000 },
  { level: 12, label: 'N2 Fortgeschritten', jlpt: 'N2', xpRequired: 55000 },
  { level: 13, label: 'N2 Meister', jlpt: 'N2', xpRequired: 75000 },
  { level: 14, label: 'N1 Basis', jlpt: 'N1', xpRequired: 100000 },
  { level: 15, label: 'N1 Meister', jlpt: 'N1', xpRequired: 150000 },
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
  const dailyXpGoal = ref(50)
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
    dailyXpGoal.value = loadFromStorage('nihongo_daily_goal', 50)
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
    weeklyXp,
    // Actions
    initializeUser,
    addXp,
    completeSession,
    setDisplayName,
    setAvatar,
  }
})
