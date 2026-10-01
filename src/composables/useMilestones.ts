/**
 * One-time milestone coin rewards.
 *
 *   - Hiragana fully mastered (every character ≥ 5★):     50 coins
 *   - Katakana fully mastered (every character ≥ 5★):     50 coins
 *   - A vocabulary CATEGORY fully mastered (all its words ≥ 5★): 10 coins each
 *   - (Level-ups are handled in the user store's addXp, not here.)
 *
 * Each milestone pays at most once — tracked by a stable id in the user store's
 * claimedMilestones. Dropping below mastery and re-reaching it does NOT pay
 * again, because the id stays claimed forever.
 *
 * NOT retroactive: on the first run after this feature shipped,
 * initMilestoneBaseline() silently marks everything already achieved as
 * claimed (no payout) and records the current level as the level baseline. So
 * neither pre-existing progress nor a placement-test jump ever pays out.
 */
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { vocabularyData } from '../data/vocabulary'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'

const MASTERY = 5

/** Vocab categories mapped to their word ids (built once from the data). */
function vocabCategoryMap(): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const v of vocabularyData) {
    const list = map.get(v.category) ?? []
    list.push(v.id)
    map.set(v.category, list)
  }
  return map
}

/** The full set of milestones that are CURRENTLY achieved (ids + payout meta). */
function achievedMilestones(): { id: string; amount: number; label: string }[] {
  const learning = useLearningStore()

  const mastered = (id: string) =>
    learning.getConsecutiveCorrect(id) >= MASTERY

  const allMastered = (ids: string[]) =>
    ids.length > 0 && ids.every(mastered)

  const result: { id: string; amount: number; label: string }[] = []

  if (allMastered(hiraganaData.map(c => c.id))) {
    result.push({ id: 'hiragana', amount: 50, label: 'Hiragana gemeistert!' })
  }
  if (allMastered(katakanaData.map(c => c.id))) {
    result.push({ id: 'katakana', amount: 50, label: 'Katakana gemeistert!' })
  }
  for (const [category, ids] of vocabCategoryMap()) {
    if (allMastered(ids)) {
      result.push({
        id: `vocab-${category}`,
        amount: 10,
        label: `Kategorie „${category}" gemeistert!`,
      })
    }
  }
  return result
}

/**
 * Establish the no-payout baseline. Call ONCE per account after login/cloud
 * load. Marks every currently-achieved milestone as claimed (silently) and
 * sets the level baseline, so nothing already earned pays retroactively.
 * Idempotent: once the baseline flag is set it does nothing.
 */
export function initMilestoneBaseline(): void {
  const userStore = useUserStore()

  // Level baseline: only set it the first time (−1 = unset).
  if (userStore.levelMilestoneBaseline < 0) {
    userStore.setLevelMilestoneBaseline(userStore.currentLevel.level)
    // Silently claim everything already achieved — no coins for past progress.
    for (const m of achievedMilestones()) {
      userStore.markMilestoneClaimed(m.id)
    }
  }
}

/**
 * Check for newly-achieved milestones and pay them out (once each). Only pays
 * milestones NOT already claimed. Safe to call after any learning session.
 * Returns the number of milestones paid this call.
 */
export function checkMilestones(): number {
  const userStore = useUserStore()
  // Guard: never pay before the baseline is set (would be retroactive).
  if (userStore.levelMilestoneBaseline < 0) return 0

  const newlyPaid: { label: string; amount: number }[] = []
  for (const m of achievedMilestones()) {
    if (userStore.hasClaimedMilestone(m.id)) continue
    // Claim without raising a toast per item; we show one combined toast below
    // so finishing several categories at once doesn't flash multiple toasts.
    if (userStore.claimMilestone(m.id, m.amount, m.label, false)) {
      newlyPaid.push({ label: m.label, amount: m.amount })
    }
  }

  if (newlyPaid.length === 1) {
    userStore.pendingMilestoneToast = newlyPaid[0]
  } else if (newlyPaid.length > 1) {
    const total = newlyPaid.reduce((s, m) => s + m.amount, 0)
    userStore.pendingMilestoneToast = {
      label: `${newlyPaid.length} Meilensteine erreicht!`,
      amount: total,
    }
  }
  return newlyPaid.length
}
