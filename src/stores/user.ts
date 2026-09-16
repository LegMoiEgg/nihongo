import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface DailyLog {
  date: string // YYYY-MM-DD
  xpEarned: number
  sessionsCompleted: number
  wordsLearned: number
}

export const LEVEL_THRESHOLDS = [
  // ── N5: Levels 1–30 ──
  // At ~100 XP/day, each level takes roughly 3–7 days
  { level: 1, label: 'Anfänger', jlpt: 'N5', xpRequired: 0 },
  { level: 2, label: 'Anfänger II', jlpt: 'N5', xpRequired: 150 },
  { level: 3, label: 'Anfänger III', jlpt: 'N5', xpRequired: 350 },
  { level: 4, label: 'N5 · Kana Einsteiger', jlpt: 'N5', xpRequired: 600 },
  { level: 5, label: 'N5 · Kana Lerner', jlpt: 'N5', xpRequired: 900 },
  { level: 6, label: 'N5 · Kana Kenner', jlpt: 'N5', xpRequired: 1250 },
  { level: 7, label: 'N5 · Erste Wörter', jlpt: 'N5', xpRequired: 1650 },
  { level: 8, label: 'N5 · Wortschatz I', jlpt: 'N5', xpRequired: 2100 },
  { level: 9, label: 'N5 · Wortschatz II', jlpt: 'N5', xpRequired: 2600 },
  { level: 10, label: 'N5 · Erste Sätze', jlpt: 'N5', xpRequired: 3150 },
  { level: 11, label: 'N5 · Satzbau I', jlpt: 'N5', xpRequired: 3750 },
  { level: 12, label: 'N5 · Satzbau II', jlpt: 'N5', xpRequired: 4400 },
  { level: 13, label: 'N5 · Grundlagen', jlpt: 'N5', xpRequired: 5100 },
  { level: 14, label: 'N5 · Grundlagen II', jlpt: 'N5', xpRequired: 5850 },
  { level: 15, label: 'N5 · Kanji Einsteiger', jlpt: 'N5', xpRequired: 6650 },
  { level: 16, label: 'N5 · Kanji Lerner', jlpt: 'N5', xpRequired: 7500 },
  { level: 17, label: 'N5 · Kanji & Vokabeln', jlpt: 'N5', xpRequired: 8400 },
  { level: 18, label: 'N5 · Aufbau I', jlpt: 'N5', xpRequired: 9350 },
  { level: 19, label: 'N5 · Aufbau II', jlpt: 'N5', xpRequired: 10350 },
  { level: 20, label: 'N5 · Fortgeschritten', jlpt: 'N5', xpRequired: 11400 },
  { level: 21, label: 'N5 · Fortgeschritten II', jlpt: 'N5', xpRequired: 12500 },
  { level: 22, label: 'N5 · Fortgeschritten III', jlpt: 'N5', xpRequired: 13650 },
  { level: 23, label: 'N5 · Vertiefung I', jlpt: 'N5', xpRequired: 14850 },
  { level: 24, label: 'N5 · Vertiefung II', jlpt: 'N5', xpRequired: 16100 },
  { level: 25, label: 'N5 · Vertiefung III', jlpt: 'N5', xpRequired: 17400 },
  { level: 26, label: 'N5 · Prüfungsvorbereitung', jlpt: 'N5', xpRequired: 18750 },
  { level: 27, label: 'N5 · Prüfungsreif I', jlpt: 'N5', xpRequired: 20150 },
  { level: 28, label: 'N5 · Prüfungsreif II', jlpt: 'N5', xpRequired: 21600 },
  { level: 29, label: 'N5 · Fast Meister', jlpt: 'N5', xpRequired: 23100 },
  { level: 30, label: 'N5 · Meister', jlpt: 'N5', xpRequired: 24650 },

  // ── N4: Levels 31–45 ──
  { level: 31, label: 'N4 · Einsteiger', jlpt: 'N4', xpRequired: 26250 },
  { level: 32, label: 'N4 · Einsteiger II', jlpt: 'N4', xpRequired: 27900 },
  { level: 33, label: 'N4 · Basis I', jlpt: 'N4', xpRequired: 29600 },
  { level: 34, label: 'N4 · Basis II', jlpt: 'N4', xpRequired: 31350 },
  { level: 35, label: 'N4 · Basis III', jlpt: 'N4', xpRequired: 33150 },
  { level: 36, label: 'N4 · Wortschatz I', jlpt: 'N4', xpRequired: 35000 },
  { level: 37, label: 'N4 · Wortschatz II', jlpt: 'N4', xpRequired: 36900 },
  { level: 38, label: 'N4 · Grammatik I', jlpt: 'N4', xpRequired: 38850 },
  { level: 39, label: 'N4 · Grammatik II', jlpt: 'N4', xpRequired: 40850 },
  { level: 40, label: 'N4 · Aufbau', jlpt: 'N4', xpRequired: 42900 },
  { level: 41, label: 'N4 · Aufbau II', jlpt: 'N4', xpRequired: 45000 },
  { level: 42, label: 'N4 · Fortgeschritten', jlpt: 'N4', xpRequired: 47150 },
  { level: 43, label: 'N4 · Fortgeschritten II', jlpt: 'N4', xpRequired: 49350 },
  { level: 44, label: 'N4 · Vertiefung', jlpt: 'N4', xpRequired: 51600 },
  { level: 45, label: 'N4 · Meister', jlpt: 'N4', xpRequired: 53900 },

  // ── N3: Levels 46–53 ──
  { level: 46, label: 'N3 · Einsteiger', jlpt: 'N3', xpRequired: 56250 },
  { level: 47, label: 'N3 · Basis', jlpt: 'N3', xpRequired: 58650 },
  { level: 48, label: 'N3 · Wortschatz', jlpt: 'N3', xpRequired: 61100 },
  { level: 49, label: 'N3 · Grammatik', jlpt: 'N3', xpRequired: 63600 },
  { level: 50, label: 'N3 · Aufbau', jlpt: 'N3', xpRequired: 66150 },
  { level: 51, label: 'N3 · Fortgeschritten', jlpt: 'N3', xpRequired: 68750 },
  { level: 52, label: 'N3 · Vertiefung', jlpt: 'N3', xpRequired: 71400 },
  { level: 53, label: 'N3 · Meister', jlpt: 'N3', xpRequired: 74100 },

  // ── N2: Levels 54–57 ──
  { level: 54, label: 'N2 · Einsteiger', jlpt: 'N2', xpRequired: 76850 },
  { level: 55, label: 'N2 · Basis', jlpt: 'N2', xpRequired: 79650 },
  { level: 56, label: 'N2 · Fortgeschritten', jlpt: 'N2', xpRequired: 82500 },
  { level: 57, label: 'N2 · Meister', jlpt: 'N2', xpRequired: 85400 },

  // ── N1: Levels 58–60 ──
  { level: 58, label: 'N1 · Einsteiger', jlpt: 'N1', xpRequired: 88350 },
  { level: 59, label: 'N1 · Fortgeschritten', jlpt: 'N1', xpRequired: 91350 },
  { level: 60, label: 'N1 · Meister', jlpt: 'N1', xpRequired: 94400 },
]

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * XP required to advance FROM `level` to `level + 1`.
 * Derived from the cumulative thresholds: threshold(level+1) − threshold(level).
 * Returns 0 at (or above) the max level.
 */
export function xpForLevel(level: number): number {
  const idx = LEVEL_THRESHOLDS.findIndex(t => t.level === level)
  if (idx < 0 || idx >= LEVEL_THRESHOLDS.length - 1) return 0
  return LEVEL_THRESHOLDS[idx + 1].xpRequired - LEVEL_THRESHOLDS[idx].xpRequired
}

/**
 * Convert a CUMULATIVE XP value (old model / placement threshold) into the
 * per-level representation: which level you're on and how much XP you've
 * earned within it. Used only for one-time migration.
 */
export function levelFromCumulative(cumulativeXp: number): { level: number; within: number } {
  let lvl = LEVEL_THRESHOLDS[0]
  for (const t of LEVEL_THRESHOLDS) {
    if (cumulativeXp >= t.xpRequired) lvl = t
    else break
  }
  return { level: lvl.level, within: Math.max(0, cumulativeXp - lvl.xpRequired) }
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
  const totalXp = ref(0)      // lifetime XP — STATISTICS ONLY, never drives level
  // Per-level progression (independent of totalXp):
  //   levelNum = the current level number
  //   levelXp  = XP earned WITHIN the current level (resets to 0 on level-up,
  //              overflow carries into the next level)
  const levelNum = ref(1)
  const levelXp = ref(0)
  const currentStreak = ref(0)
  const longestStreak = ref(0)
  const lastActiveDate = ref('')
  const dailyXpGoal = ref(100)
  const dailyLog = ref<DailyLog[]>([])
  const wordsLearnedTotal = ref(0)
  const sessionsCompletedTotal = ref(0)

  // Profile
  const displayName = ref('')
  const avatarDataUrl = ref('')
  const placementLevel = ref(0) // minimum level from placement test (0 = not taken) // base64 data URL from file upload

  // Set when the user levels up (via addXp). App.vue watches this to show a
  // congratulations popup, then clears it. Persisted so it survives a reload
  // (e.g. if the app is closed right after a session).
  const pendingLevelUp = ref<{ level: number; label: string } | null>(
    loadFromStorage('nihongo_pending_levelup', null)
  )
  function clearLevelUp() {
    pendingLevelUp.value = null
    localStorage.removeItem('nihongo_pending_levelup')
  }

  // Computed
  // Level progression is PER-LEVEL: levelNum is the current level, levelXp is
  // the XP earned inside it. Each level needs xpForLevel(levelNum) XP; on
  // reaching it we increment levelNum and keep the overflow (see addXp).
  const currentLevel = computed(() => {
    return LEVEL_THRESHOLDS.find(t => t.level === levelNum.value) ?? LEVEL_THRESHOLDS[0]
  })

  const nextLevel = computed(() => {
    const idx = LEVEL_THRESHOLDS.findIndex(t => t.level === levelNum.value)
    return idx >= 0 && idx < LEVEL_THRESHOLDS.length - 1 ? LEVEL_THRESHOLDS[idx + 1] : null
  })

  /** XP required to complete the CURRENT level (0 if at max level). */
  const xpNeededThisLevel = computed(() => xpForLevel(levelNum.value))

  /** XP still remaining to reach the next level. */
  const xpForNextLevel = computed(() => {
    if (!nextLevel.value) return 0
    return Math.max(0, xpNeededThisLevel.value - levelXp.value)
  })

  const levelProgress = computed(() => {
    if (!nextLevel.value) return 100
    const need = xpNeededThisLevel.value
    if (need <= 0) return 100
    return Math.min(100, Math.max(0, Math.round((levelXp.value / need) * 100)))
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
    // Per-level progression. Prefer the new (levelNum + within-level levelXp)
    // storage. Migrate from older data otherwise.
    const storedLevelNum = loadFromStorage<number | null>('nihongo_level_num', null)
    if (storedLevelNum !== null) {
      levelNum.value = storedLevelNum
      levelXp.value = loadFromStorage('nihongo_level_xp', 0)
    } else {
      // Migrate: derive from whichever gives the higher starting point —
      //   (a) an old CUMULATIVE levelXp value, or
      //   (b) the placement level's threshold, or
      //   (c) lifetime totalXp.
      // Convert that cumulative XP into levelNum + within-level overflow.
      const oldCumulative = loadFromStorage<number>('nihongo_level_xp', 0)
      const placement = loadFromStorage('nihongo_placement_level', 0)
      const placementFloor = placement > 0
        ? (LEVEL_THRESHOLDS.find(t => t.level === placement)?.xpRequired ?? 0)
        : 0
      const cumulative = Math.max(oldCumulative, placementFloor, totalXp.value)
      const seeded = levelFromCumulative(cumulative)
      levelNum.value = seeded.level
      levelXp.value = seeded.within
      saveToStorage('nihongo_level_num', levelNum.value)
      saveToStorage('nihongo_level_xp', levelXp.value)
    }
    currentStreak.value = loadFromStorage('nihongo_streak', 0)
    longestStreak.value = loadFromStorage('nihongo_longest_streak', 0)
    lastActiveDate.value = loadFromStorage('nihongo_last_active', '')
    dailyXpGoal.value = 100 // fixed, not user-configurable yet
    dailyLog.value = loadFromStorage('nihongo_daily_log', [])
    wordsLearnedTotal.value = loadFromStorage('nihongo_words_total', 0)
    sessionsCompletedTotal.value = loadFromStorage('nihongo_sessions_total', 0)
    displayName.value = loadFromStorage('nihongo_display_name', '')
    avatarDataUrl.value = loadFromStorage('nihongo_avatar', '')
    placementLevel.value = loadFromStorage('nihongo_placement_level', 0)

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

    const levelBefore = levelNum.value

    // totalXp = lifetime statistic (never reset).
    totalXp.value += amount
    saveToStorage('nihongo_xp', totalXp.value)

    // levelXp = XP within the current level. Roll over into the next level(s)
    // while there's enough, carrying the overflow. Example: 1513 + 10 with a
    // 1500 need → level up, levelXp becomes 23 for the next level.
    levelXp.value += amount
    let need = xpForLevel(levelNum.value)
    while (need > 0 && levelXp.value >= need) {
      levelXp.value -= need
      levelNum.value += 1
      need = xpForLevel(levelNum.value) // 0 at max level → loop stops
    }
    // At max level, don't let levelXp grow unbounded — cap display at "done".
    if (xpForLevel(levelNum.value) === 0) levelXp.value = 0
    saveToStorage('nihongo_level_num', levelNum.value)
    saveToStorage('nihongo_level_xp', levelXp.value)

    if (levelNum.value > levelBefore) {
      pendingLevelUp.value = { level: currentLevel.value.level, label: currentLevel.value.label }
      saveToStorage('nihongo_pending_levelup', pendingLevelUp.value)
    }

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

  function setPlacementLevel(level: number) {
    placementLevel.value = level
    saveToStorage('nihongo_placement_level', level)
    // Placement raises the level as a FLOOR. totalXp (statistic) is untouched.
    // Set the current level and reset within-level XP so progression starts
    // cleanly at the beginning of that level.
    if (level > levelNum.value) {
      levelNum.value = level
      levelXp.value = 0
      saveToStorage('nihongo_level_num', levelNum.value)
      saveToStorage('nihongo_level_xp', levelXp.value)
    }
  }

  return {
    // State
    totalXp,
    levelNum,
    levelXp,
    currentStreak,
    longestStreak,
    lastActiveDate,
    dailyXpGoal,
    dailyLog,
    wordsLearnedTotal,
    sessionsCompletedTotal,
    displayName,
    avatarDataUrl,
    placementLevel,
    // Computed
    currentLevel,
    nextLevel,
    xpForNextLevel,
    xpNeededThisLevel,
    levelProgress,
    todayLog,
    dailyGoalProgress,
    dailyGoalReached,
    xpPerCorrect,
    weeklyXp,
    pendingLevelUp,
    clearLevelUp,
    // Actions
    initializeUser,
    updateStreak,
    addXp,
    completeSession,
    setDisplayName,
    setAvatar,
    setPlacementLevel,
  }
})

/**
 * Returns the level number for a given total XP, using the same thresholds
 * as the user store. Shared so other stores (e.g. social) show correct levels.
 */
export function levelForXp(xp: number): number {
  let level = LEVEL_THRESHOLDS[0].level
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.xpRequired) level = t.level
    else break
  }
  return level
}

export interface LevelInfo {
  current: { level: number; label: string; jlpt: string; xpRequired: number }
  next: { level: number; label: string; jlpt: string; xpRequired: number } | null
  progress: number       // 0-100 within the current level
  xpToNext: number       // XP remaining to the next level
}

/**
 * Full level info for an arbitrary user (used e.g. for public profiles) in the
 * per-level model: `levelNum` = current level, `levelXpWithin` = XP earned
 * inside it. `placementLevel` is used as a floor for legacy data.
 */
export function levelInfoForXp(levelNum: number, levelXpWithin = 0, placementLevel = 0): LevelInfo {
  let lvlNum = Math.max(levelNum || 1, placementLevel || 0, 1)
  let current = LEVEL_THRESHOLDS.find(t => t.level === lvlNum) ?? LEVEL_THRESHOLDS[0]

  const idx = LEVEL_THRESHOLDS.findIndex(t => t.level === current.level)
  const next = idx >= 0 && idx < LEVEL_THRESHOLDS.length - 1 ? LEVEL_THRESHOLDS[idx + 1] : null

  let progress = 100
  let xpToNext = 0
  if (next) {
    const need = next.xpRequired - current.xpRequired
    if (need > 0) {
      const into = Math.max(0, Math.min(levelXpWithin, need))
      progress = Math.min(100, Math.max(0, Math.round((into / need) * 100)))
      xpToNext = Math.max(0, need - into)
    }
  }

  return { current, next, progress, xpToNext }
}
