/**
 * In-app scavenger hunt ("Entdecker-Jagd").
 *
 * A hint box on the Dashboard shows the current station's riddle. Each station
 * has a TARGET the user must tap somewhere in the app (a specific kana in an
 * overview, or the streak flame on the Dashboard). Tapping the right target
 * advances to the next station. After the last station the user gets a reward
 * (a random not-yet-owned frame, or coins if they own all frames).
 *
 * Only reachable-by-everyone targets are used (Hiragana/Katakana overviews are
 * never level-gated; the streak flame is on the Dashboard). No Kanji/Vocab, so
 * brand-new beginners can complete it too.
 *
 * Progress + completion are stored on the user profile (synced like other
 * progress flags). The hunt is only active within its date window.
 */

export interface ScavengerStation {
  /** Riddle shown in the Dashboard hint box. */
  hint: string
  /**
   * Where the target lives, so the UI knows which element to make tappable:
   *  - kana: a character in the Hiragana/Katakana overview (targetId = card id)
   *  - flame: the streak flame on the Dashboard (final station)
   */
  targetKind: 'kana' | 'flame'
  /** Card id of the kana to tap (for targetKind 'kana'). */
  targetId?: string
  /** Short "where to go" nudge shown under the hint. */
  where: string
}

/** Validity window (Berlin YYYY-MM-DD), inclusive. */
export const SCAVENGER_FROM = '2026-10-14'
export const SCAVENGER_UNTIL = '2026-10-21'

/** Coins given if the user already owns every frame when finishing. */
export const SCAVENGER_FALLBACK_COINS = 250

export const SCAVENGER_STATIONS: ScavengerStation[] = [
  {
    hint: 'Alles beginnt mit einem Laut: dem allerersten der fünf Vokale. Finde ihn.',
    targetKind: 'kana',
    targetId: 'h-a', // あ
    where: 'Hiragana-Übersicht',
  },
  {
    hint: 'Ein Schlüssel öffnet jede Tür — auf Englisch „key". Welches Hiragana klingt so?',
    targetKind: 'kana',
    targetId: 'h-ki', // き (klingt wie "key")
    where: 'Hiragana-Übersicht',
  },
  {
    hint: 'Jetzt zur eckigen Schrift der Fremdwörter. Such dort den ersten Vokal.',
    targetKind: 'kana',
    targetId: 'k-a', // ア
    where: 'Katakana-Übersicht',
  },
  {
    hint: 'Fast geschafft! Deine Leidenschaft brennt — tippe auf deine Flamme.',
    targetKind: 'flame',
    where: 'Hier auf dem Dashboard',
  },
]

export const SCAVENGER_TOTAL = SCAVENGER_STATIONS.length

/** Is the hunt within its active date window for the given Berlin date? */
export function isScavengerActive(todayStr: string): boolean {
  return todayStr >= SCAVENGER_FROM && todayStr <= SCAVENGER_UNTIL
}
