/**
 * In-app scavenger hunts ("Entdecker-Jagden") — supports MULTIPLE events.
 *
 * Each event has its own id, date window, stations and reward type. Progress is
 * tracked PER EVENT on the user profile (see scavengerProgress), so completing
 * one event never affects another. The Dashboard shows whichever event is
 * active for today's date.
 *
 * A station's TARGET is something the user must tap somewhere in the app:
 *  - kana  : a specific kana in the Hiragana/Katakana overview (targetId = id)
 *  - flame : the streak flame on the Dashboard
 *  - spot  : a fixed, always-present UI element elsewhere (targetId = a known
 *            spot key the view checks, e.g. 'profile-coins'); the `where` text
 *            and the station's `route` nudge the user to the right tab.
 *
 * Only reachable-by-everyone targets are used (no level-gated Kanji/Vocab, no
 * dynamic items), so brand-new beginners can finish every hunt.
 */

export type ScavengerTargetKind = 'kana' | 'flame' | 'spot'

export interface ScavengerStation {
  hint: string
  targetKind: ScavengerTargetKind
  /** kana card id (kana) or spot key (spot). Unused for flame. */
  targetId?: string
  /** Short "where to go" nudge shown under the hint. */
  where: string
}

export type ScavengerRewardKind = 'randomFrame' | 'randomAccent'

export interface ScavengerEvent {
  id: string
  title: string
  /** Validity window (Berlin YYYY-MM-DD), inclusive. */
  from: string
  until: string
  reward: ScavengerRewardKind
  /** Coins given if the user already owns everything of the reward category. */
  fallbackCoins: number
  stations: ScavengerStation[]
}

/**
 * Known "spot" target keys. A view that contains the element checks for the
 * matching key and makes that element tappable while the hunt is on it.
 */
export const SPOT = {
  profileCoins: 'profile-coins',
  shopCodeField: 'shop-code-field',
  socialGroups: 'social-groups',
  dashboardWeek: 'dashboard-week',
} as const

export const SCAVENGER_EVENTS: ScavengerEvent[] = [
  // ── Oktober 2026: Entdecker-Jagd (frame reward) ──
  {
    id: 'okt2026',
    title: 'Entdecker-Jagd',
    from: '2026-10-14',
    until: '2026-10-21',
    reward: 'randomFrame',
    fallbackCoins: 250,
    stations: [
      {
        hint: 'Alles beginnt mit einem Laut: dem allerersten der fünf Vokale. Finde ihn.',
        targetKind: 'kana',
        targetId: 'h-a',
        where: 'Hiragana-Übersicht',
      },
      {
        hint: 'Ein Schlüssel öffnet jede Tür — auf Englisch „key". Welches Hiragana klingt so?',
        targetKind: 'kana',
        targetId: 'h-ki',
        where: 'Hiragana-Übersicht',
      },
      {
        hint: 'Jetzt zur eckigen Schrift der Fremdwörter. Such dort den ersten Vokal.',
        targetKind: 'kana',
        targetId: 'k-a',
        where: 'Katakana-Übersicht',
      },
      {
        hint: 'Fast geschafft! Deine Leidenschaft brennt — tippe auf deine Flamme.',
        targetKind: 'flame',
        where: 'Hier auf dem Dashboard',
      },
    ],
  },

  // ── November 2026: Spurensuche (accent reward, 10 stations, app-wide) ──
  {
    id: 'nov2026',
    title: 'Spurensuche',
    from: '2026-11-01',
    until: '2026-11-11',
    reward: 'randomAccent',
    fallbackCoins: 150,
    stations: [
      {
        hint: 'Zwei Zeichen wie Zwillinge — eines reckt seine Striche nach oben und klingt wie „schi". Finde es im Katakana.',
        targetKind: 'kana',
        targetId: 'k-shi', // シ
        where: 'Katakana-Übersicht',
      },
      {
        hint: 'Und nun sein Gegenstück, das nach unten greift: „tsu".',
        targetKind: 'kana',
        targetId: 'k-tsu', // ツ
        where: 'Katakana-Übersicht',
      },
      {
        hint: 'Ein Hiragana mit zwei Strichelchen, das summt wie eine Biene — „zu".',
        targetKind: 'kana',
        targetId: 'h-zu', // ず
        where: 'Hiragana-Übersicht',
      },
      {
        hint: 'Verlass das Rätsel und geh dorthin, wo dein Münzschatz steht.',
        targetKind: 'spot',
        targetId: SPOT.profileCoins,
        where: 'Profil — tippe auf deine Münzen 🪙',
      },
      {
        hint: 'Wo man geheime Codes eingibt, liegt die nächste Spur verborgen.',
        targetKind: 'spot',
        targetId: SPOT.shopCodeField,
        where: 'Shop — das Code-Eingabefeld',
      },
      {
        hint: 'Ein Laut aus zwei Teilen, gesprochen „kyo" — wie in „Tōkyō".',
        targetKind: 'kana',
        targetId: 'h-kyo', // きょ
        where: 'Hiragana-Übersicht',
      },
      {
        hint: 'Dort, wo du dich mit anderen misst, findest du Gruppen. Tippe diesen Bereich an.',
        targetKind: 'spot',
        targetId: SPOT.socialGroups,
        where: 'Social-Tab',
      },
      {
        hint: 'Zurück zur eckigen Schrift: finde „ra".',
        targetKind: 'kana',
        targetId: 'k-ra', // ラ
        where: 'Katakana-Übersicht',
      },
      {
        hint: 'Dein Wochenplan zeigt dir alle sieben Tage. Tippe ihn an.',
        targetKind: 'spot',
        targetId: SPOT.dashboardWeek,
        where: 'Hier auf dem Dashboard',
      },
      {
        hint: 'Deine Reise endet, wo sie begann — an deiner brennenden Flamme.',
        targetKind: 'flame',
        where: 'Hier auf dem Dashboard',
      },
    ],
  },
]

/** The event active for the given Berlin date, or null. */
export function activeScavengerEvent(todayStr: string): ScavengerEvent | null {
  return (
    SCAVENGER_EVENTS.find(e => todayStr >= e.from && todayStr <= e.until) ?? null
  )
}

export function getScavengerEvent(id: string): ScavengerEvent | undefined {
  return SCAVENGER_EVENTS.find(e => e.id === id)
}
