/**
 * Shop catalog for the coin / cosmetics system.
 *
 * Coins are earned by reaching the daily XP goal (chest reward + streak bonus,
 * capped per day — see user store). They are spent here on cosmetics:
 *   - accent  : recolors buttons/highlights (cheap, ~100)
 *   - theme   : changes the whole app's look (expensive, ~1000)
 *   - frame   : avatar frame shown to OTHER users in the Social tab (~1000)
 *   - utility : non-cosmetic consumables, e.g. a Streak Freeze
 *
 * The item IDs are persisted (owned/equipped) in the user doc, so they must be
 * stable — never rename an existing id.
 */

export type ShopCategory = 'accent' | 'theme' | 'frame' | 'utility'

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: ShopCategory
  /** Small emoji/preview shown on the shop card. */
  icon: string
  /**
   * Cosmetic payload consumed by applyCosmetics():
   *  - accent: { accent } hex color for --accent-primary
   *  - theme : a set of CSS variable overrides keyed by var name
   *  - frame : { frame } CSS gradient/color for the avatar ring + a glow flag
   */
  accent?: string
  theme?: Record<string, string>
  frame?: { ring: string; glow?: string }
}

// ────────────────────────────────────────────────────────────────────────
//  ACCENT COLORS — cheap, only recolor the primary accent + its gradient.
// ────────────────────────────────────────────────────────────────────────
const ACCENTS: ShopItem[] = [
  {
    id: 'accent-matcha',
    name: 'Matcha-Grün',
    description: 'Färbt Buttons und Highlights grün.',
    price: 100,
    category: 'accent',
    icon: '🍵',
    accent: '#3fa34d',
  },
  {
    id: 'accent-sakura',
    name: 'Sakura-Pink',
    description: 'Zartes Kirschblüten-Pink für Akzente.',
    price: 100,
    category: 'accent',
    icon: '🌸',
    accent: '#ff5c8a',
  },
  {
    id: 'accent-ume',
    name: 'Ume-Lila',
    description: 'Kräftiges Pflaumen-Lila.',
    price: 100,
    category: 'accent',
    icon: '🔮',
    accent: '#8b5cf6',
  },
  {
    id: 'accent-mikan',
    name: 'Mikan-Orange',
    description: 'Warmes Mandarinen-Orange.',
    price: 100,
    category: 'accent',
    icon: '🍊',
    accent: '#ff8c42',
  },
  {
    id: 'accent-sora',
    name: 'Sora-Blau',
    description: 'Frisches Himmelblau.',
    price: 100,
    category: 'accent',
    icon: '💧',
    accent: '#2f9be0',
  },
]

// ────────────────────────────────────────────────────────────────────────
//  THEMES — expensive, retheme the whole app (backgrounds + accents).
// ────────────────────────────────────────────────────────────────────────
const THEMES: ShopItem[] = [
  {
    id: 'theme-sakura',
    name: 'Sakura',
    description: 'Helles, verträumtes Kirschblüten-Theme.',
    price: 1000,
    category: 'theme',
    icon: '🌸',
    theme: {
      '--bg-primary': '#2b1b24',
      '--bg-secondary': '#3a2531',
      '--bg-card': '#432b39',
      '--bg-card-hover': '#52343f',
      '--bg-accent': '#5c3a4a',
      '--accent-primary': '#ff5c8a',
      '--accent-secondary': '#c86b9c',
      '--gradient-primary': 'linear-gradient(135deg, #ff5c8a, #c86b9c)',
      '--gradient-xp': 'linear-gradient(90deg, #ff5c8a, #ffa0c0)',
    },
  },
  {
    id: 'theme-matcha',
    name: 'Matcha',
    description: 'Beruhigendes Grüntee-Theme.',
    price: 1000,
    category: 'theme',
    icon: '🍵',
    theme: {
      '--bg-primary': '#10261a',
      '--bg-secondary': '#163626',
      '--bg-card': '#1a3f2c',
      '--bg-card-hover': '#214d36',
      '--bg-accent': '#285c40',
      '--accent-primary': '#3fa34d',
      '--accent-secondary': '#2f7d3a',
      '--gradient-primary': 'linear-gradient(135deg, #3fa34d, #2f7d3a)',
      '--gradient-xp': 'linear-gradient(90deg, #3fa34d, #7bd389)',
    },
  },
  {
    id: 'theme-ocean',
    name: 'Dark Ocean',
    description: 'Tiefes Blau wie die See bei Nacht.',
    price: 1000,
    category: 'theme',
    icon: '🌊',
    theme: {
      '--bg-primary': '#071a2b',
      '--bg-secondary': '#0b2540',
      '--bg-card': '#0f2d4e',
      '--bg-card-hover': '#143a63',
      '--bg-accent': '#17497d',
      '--accent-primary': '#19c3c9',
      '--accent-secondary': '#2f6ebf',
      '--gradient-primary': 'linear-gradient(135deg, #19c3c9, #2f6ebf)',
      '--gradient-xp': 'linear-gradient(90deg, #19c3c9, #6ef0f4)',
    },
  },
]

// ────────────────────────────────────────────────────────────────────────
//  FRAMES — expensive, shown around the avatar to OTHER users (Social tab).
// ────────────────────────────────────────────────────────────────────────
const FRAMES: ShopItem[] = [
  {
    id: 'frame-gold',
    name: 'Goldrahmen',
    description: 'Edler goldener Rahmen um deinen Avatar.',
    price: 1000,
    category: 'frame',
    icon: '🥇',
    frame: { ring: 'linear-gradient(135deg, #ffd700, #ffb300)', glow: 'rgba(255, 215, 0, 0.5)' },
  },
  {
    id: 'frame-neon',
    name: 'Neonrahmen',
    description: 'Leuchtender Neon-Rahmen.',
    price: 1000,
    category: 'frame',
    icon: '💠',
    frame: { ring: 'linear-gradient(135deg, #19c3c9, #8b5cf6)', glow: 'rgba(25, 195, 201, 0.5)' },
  },
  {
    id: 'frame-sakura',
    name: 'Sakura-Rahmen',
    description: 'Rosa Kirschblüten-Rahmen.',
    price: 1000,
    category: 'frame',
    icon: '🌸',
    frame: { ring: 'linear-gradient(135deg, #ff5c8a, #ffa0c0)', glow: 'rgba(255, 92, 138, 0.5)' },
  },
]

// ────────────────────────────────────────────────────────────────────────
//  UTILITY — consumables. Streak Freeze protects a missed day.
// ────────────────────────────────────────────────────────────────────────
export const STREAK_FREEZE_ID = 'streak-freeze'

/** The most streak freezes a user may hold at once. */
export const MAX_STREAK_FREEZES = 2

const UTILITIES: ShopItem[] = [
  {
    id: STREAK_FREEZE_ID,
    name: 'Streak-Freeze',
    description: 'Rettet deine Streak, wenn du einen Tag vergisst. Wird automatisch eingesetzt.',
    price: 500,
    category: 'utility',
    icon: '🧊',
  },
]

export const SHOP_ITEMS: ShopItem[] = [...ACCENTS, ...THEMES, ...FRAMES, ...UTILITIES]

const ITEM_BY_ID = new Map(SHOP_ITEMS.map(i => [i.id, i]))

export function getShopItem(id: string): ShopItem | undefined {
  return ITEM_BY_ID.get(id)
}

export function itemsByCategory(category: ShopCategory): ShopItem[] {
  return SHOP_ITEMS.filter(i => i.category === category)
}

/** Human-readable section titles for the shop UI. */
export const CATEGORY_LABELS: Record<ShopCategory, string> = {
  accent: 'Akzentfarben',
  theme: 'App-Themes',
  frame: 'Profilrahmen',
  utility: 'Verbrauchsgegenstände',
}

// ────────────────────────────────────────────────────────────────────────
//  DAILY SHOP ROTATION
//  Each cosmetic category offers up to ROTATION_SIZE items per day, chosen
//  deterministically from a seed (date + user id) so the selection is stable
//  for a given user on a given day but shuffles day to day. Utility items
//  (Streak-Freeze) are NOT rotated — they are always available.
// ────────────────────────────────────────────────────────────────────────

export const ROTATION_SIZE = 3

/** Simple string hash → 32-bit int (deterministic, no deps). */
function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Mulberry32 PRNG — deterministic sequence from a numeric seed. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic Fisher–Yates shuffle driven by a seeded PRNG. */
function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * The cosmetic items offered TODAY for a given category, for a given user.
 * Deterministic per (category, dateStr, userKey): same inputs → same list.
 * Returns up to ROTATION_SIZE items. If a category has ≤ ROTATION_SIZE items
 * they all show (just in a stable daily order).
 */
export function rotatedItems(
  category: ShopCategory,
  dateStr: string,
  userKey: string,
): ShopItem[] {
  const pool = SHOP_ITEMS.filter(i => i.category === category)
  const seed = hashString(`${category}|${dateStr}|${userKey}`)
  const shuffled = seededShuffle(pool, mulberry32(seed))
  return shuffled.slice(0, ROTATION_SIZE)
}
