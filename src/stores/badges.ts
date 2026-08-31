import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { useLearningStore } from './learning'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'

export interface BadgeDefinition {
  id: string
  icon: string
  name: string
  description: string
  category: 'streak' | 'mastery' | 'xp' | 'sessions' | 'special'
}

export interface EarnedBadge {
  id: string
  earnedAt: string // ISO date
}

// ── All badge definitions ──
export const ALL_BADGES: BadgeDefinition[] = [
  // Streak badges
  { id: 'streak-7', icon: '🔥', name: '1 Woche Streak', description: '7 Tage am Stück gelernt', category: 'streak' },
  { id: 'streak-14', icon: '🔥', name: '2 Wochen Streak', description: '14 Tage am Stück gelernt', category: 'streak' },
  { id: 'streak-30', icon: '🔥', name: '1 Monat Streak', description: '30 Tage am Stück gelernt', category: 'streak' },
  { id: 'streak-60', icon: '🔥', name: '2 Monate Streak', description: '60 Tage am Stück gelernt', category: 'streak' },
  { id: 'streak-100', icon: '💎', name: '100 Tage Streak', description: '100 Tage am Stück gelernt', category: 'streak' },
  { id: 'streak-200', icon: '💎', name: '200 Tage Streak', description: '200 Tage am Stück gelernt', category: 'streak' },
  { id: 'streak-365', icon: '👑', name: '1 Jahr Streak', description: '365 Tage am Stück gelernt', category: 'streak' },

  // Perfect week
  { id: 'perfect-week', icon: '🏆', name: 'Perfekte Woche', description: 'Alle 7 Tage einer Woche abgeschlossen', category: 'special' },
  { id: 'perfect-test', icon: '💯', name: 'Perfekter Test', description: 'Vokabeltest ohne Fehler bestanden', category: 'special' },

  // Mastery badges
  { id: 'hiragana-all', icon: '🎌', name: 'Hiragana Meister', description: 'Alle Hiragana gemeistert', category: 'mastery' },
  { id: 'katakana-all', icon: '🎌', name: 'Katakana Meister', description: 'Alle Katakana gemeistert', category: 'mastery' },
  { id: 'kana-all', icon: '🏅', name: 'Kana Meister', description: 'Alle Hiragana und Katakana gemeistert', category: 'mastery' },
  { id: 'vocab-10', icon: '📖', name: 'Erste 10 Wörter', description: '10 Vokabeln gemeistert', category: 'mastery' },
  { id: 'vocab-25', icon: '📖', name: '25 Wörter', description: '25 Vokabeln gemeistert', category: 'mastery' },
  { id: 'vocab-50', icon: '📚', name: '50 Wörter', description: '50 Vokabeln gemeistert', category: 'mastery' },

  // XP milestones
  { id: 'xp-500', icon: '⭐', name: '500 XP', description: '500 XP gesammelt', category: 'xp' },
  { id: 'xp-1000', icon: '⭐', name: '1.000 XP', description: '1.000 XP gesammelt', category: 'xp' },
  { id: 'xp-5000', icon: '🌟', name: '5.000 XP', description: '5.000 XP gesammelt', category: 'xp' },
  { id: 'xp-10000', icon: '🌟', name: '10.000 XP', description: '10.000 XP gesammelt', category: 'xp' },
  { id: 'xp-25000', icon: '💫', name: '25.000 XP', description: '25.000 XP gesammelt', category: 'xp' },
  { id: 'xp-50000', icon: '💫', name: '50.000 XP', description: '50.000 XP gesammelt', category: 'xp' },
  { id: 'xp-100000', icon: '🏆', name: '100.000 XP', description: '100.000 XP gesammelt', category: 'xp' },

  // Session milestones
  { id: 'first-lesson', icon: '🎉', name: 'Erste Lektion', description: 'Erste Lektion abgeschlossen', category: 'sessions' },
  { id: 'sessions-10', icon: '📝', name: '10 Lektionen', description: '10 Lektionen abgeschlossen', category: 'sessions' },
  { id: 'sessions-50', icon: '📝', name: '50 Lektionen', description: '50 Lektionen abgeschlossen', category: 'sessions' },
  { id: 'sessions-100', icon: '🎓', name: '100 Lektionen', description: '100 Lektionen abgeschlossen', category: 'sessions' },
  { id: 'sessions-500', icon: '🎓', name: '500 Lektionen', description: '500 Lektionen abgeschlossen', category: 'sessions' },
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

export const useBadgesStore = defineStore('badges', () => {
  const earnedBadges = ref<EarnedBadge[]>([])
  const newlyEarned = ref<string[]>([]) // IDs of badges earned this session (for toast/popup)

  function initialize() {
    earnedBadges.value = loadFromStorage('nihongo_badges', [])
  }

  const earnedIds = computed(() => new Set(earnedBadges.value.map(b => b.id)))
  const earnedCount = computed(() => earnedBadges.value.length)
  const totalBadges = computed(() => ALL_BADGES.length)

  function hasBadge(id: string): boolean {
    return earnedIds.value.has(id)
  }

  function awardBadge(id: string) {
    if (hasBadge(id)) return
    if (!ALL_BADGES.find(b => b.id === id)) return

    earnedBadges.value.push({
      id,
      earnedAt: new Date().toISOString(),
    })
    newlyEarned.value.push(id)
    saveToStorage('nihongo_badges', earnedBadges.value)
  }

  function clearNewlyEarned() {
    newlyEarned.value = []
  }

  /** Check all badge conditions and award any that are newly met */
  function checkAllBadges() {
    const userStore = useUserStore()
    const learningStore = useLearningStore()

    const xp = userStore.totalXp
    const streak = userStore.currentStreak
    const sessions = userStore.sessionsCompletedTotal

    // Streak badges
    if (streak >= 7) awardBadge('streak-7')
    if (streak >= 14) awardBadge('streak-14')
    if (streak >= 30) awardBadge('streak-30')
    if (streak >= 60) awardBadge('streak-60')
    if (streak >= 100) awardBadge('streak-100')
    if (streak >= 200) awardBadge('streak-200')
    if (streak >= 365) awardBadge('streak-365')

    // XP milestones
    if (xp >= 500) awardBadge('xp-500')
    if (xp >= 1000) awardBadge('xp-1000')
    if (xp >= 5000) awardBadge('xp-5000')
    if (xp >= 10000) awardBadge('xp-10000')
    if (xp >= 25000) awardBadge('xp-25000')
    if (xp >= 50000) awardBadge('xp-50000')
    if (xp >= 100000) awardBadge('xp-100000')

    // Session milestones
    if (sessions >= 1) awardBadge('first-lesson')
    if (sessions >= 10) awardBadge('sessions-10')
    if (sessions >= 50) awardBadge('sessions-50')
    if (sessions >= 100) awardBadge('sessions-100')
    if (sessions >= 500) awardBadge('sessions-500')

    // Mastery badges
    const masteredHiragana = hiraganaData.filter(c => {
      const p = learningStore.cardProgress.find(cp => cp.id === c.id)
      return p && (p.consecutiveCorrect ?? 0) >= learningStore.MASTERY_STREAK
    }).length

    const masteredKatakana = katakanaData.filter(c => {
      const p = learningStore.cardProgress.find(cp => cp.id === c.id)
      return p && (p.consecutiveCorrect ?? 0) >= learningStore.MASTERY_STREAK
    }).length

    if (masteredHiragana >= hiraganaData.length) awardBadge('hiragana-all')
    if (masteredKatakana >= katakanaData.length) awardBadge('katakana-all')
    if (masteredHiragana >= hiraganaData.length && masteredKatakana >= katakanaData.length) awardBadge('kana-all')

    const masteredVocab = learningStore.masteredVocabCount
    if (masteredVocab >= 10) awardBadge('vocab-10')
    if (masteredVocab >= 25) awardBadge('vocab-25')
    if (masteredVocab >= 50) awardBadge('vocab-50')
  }

  /** Called when a perfect week is detected */
  function checkPerfectWeek() {
    awardBadge('perfect-week')
  }

  /** Called when a vocab test is completed with 100% */
  function checkPerfectTest(score: number, total: number) {
    if (total > 0 && score === total) {
      awardBadge('perfect-test')
    }
  }

  return {
    earnedBadges,
    newlyEarned,
    earnedIds,
    earnedCount,
    totalBadges,
    initialize,
    hasBadge,
    awardBadge,
    clearNewlyEarned,
    checkAllBadges,
    checkPerfectWeek,
    checkPerfectTest,
  }
})
