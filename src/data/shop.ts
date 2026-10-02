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
  {
    id: 'accent-benihi',
    name: 'Beni-Rot',
    description: 'Kräftiges japanisches Rot.',
    price: 100,
    category: 'accent',
    icon: '🔴',
    accent: '#e63946',
  },
  {
    id: 'accent-mizuiro',
    name: 'Türkis',
    description: 'Klares Türkisgrün.',
    price: 100,
    category: 'accent',
    icon: '🩵',
    accent: '#17c3b2',
  },
  {
    id: 'accent-yamabuki',
    name: 'Yamabuki-Gold',
    description: 'Warmes Gold-Gelb.',
    price: 100,
    category: 'accent',
    icon: '🟡',
    accent: '#f4b000',
  },
  {
    id: 'accent-ai',
    name: 'Ai-Indigo',
    description: 'Tiefes Indigoblau.',
    price: 100,
    category: 'accent',
    icon: '🔵',
    accent: '#3f51b5',
  },
  {
    id: 'accent-sango',
    name: 'Koralle',
    description: 'Frisches Korallenrosa.',
    price: 100,
    category: 'accent',
    icon: '🪸',
    accent: '#ff6f61',
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
  {
    id: 'theme-sunset',
    name: 'Sonnenuntergang',
    description: 'Warmes Abendrot in Orange und Violett.',
    price: 1000,
    category: 'theme',
    icon: '🌇',
    theme: {
      '--bg-primary': '#2a1120',
      '--bg-secondary': '#3b1a2a',
      '--bg-card': '#48202f',
      '--bg-card-hover': '#5a2a3a',
      '--bg-accent': '#6e3144',
      '--accent-primary': '#ff7b54',
      '--accent-secondary': '#b14b8a',
      '--gradient-primary': 'linear-gradient(135deg, #ff7b54, #b14b8a)',
      '--gradient-xp': 'linear-gradient(90deg, #ff7b54, #ffb26b)',
    },
  },
  {
    id: 'theme-forest',
    name: 'Wald',
    description: 'Dunkles Tannengrün mit Moosakzent.',
    price: 1000,
    category: 'theme',
    icon: '🌲',
    theme: {
      '--bg-primary': '#0c1f17',
      '--bg-secondary': '#122b20',
      '--bg-card': '#163528',
      '--bg-card-hover': '#1d4433',
      '--bg-accent': '#235240',
      '--accent-primary': '#5fb98a',
      '--accent-secondary': '#8a9a3f',
      '--gradient-primary': 'linear-gradient(135deg, #5fb98a, #8a9a3f)',
      '--gradient-xp': 'linear-gradient(90deg, #5fb98a, #a8e6a1)',
    },
  },
  {
    id: 'theme-midnight',
    name: 'Mitternacht',
    description: 'Fast schwarzes Blau für den Nachtmodus.',
    price: 1000,
    category: 'theme',
    icon: '🌑',
    theme: {
      '--bg-primary': '#05060f',
      '--bg-secondary': '#0b0d1a',
      '--bg-card': '#111424',
      '--bg-card-hover': '#1a1e33',
      '--bg-accent': '#232a44',
      '--accent-primary': '#6c7bff',
      '--accent-secondary': '#3f4a8a',
      '--gradient-primary': 'linear-gradient(135deg, #6c7bff, #3f4a8a)',
      '--gradient-xp': 'linear-gradient(90deg, #6c7bff, #a0a9ff)',
    },
  },
  // ── Helle Themes (dunkler Text auf hellem Grund) ──
  {
    id: 'theme-sakura-light',
    name: 'Sakura Hell',
    description: 'Helles Theme in zartem Kirschblüten-Rosa.',
    price: 1000,
    category: 'theme',
    icon: '🌸',
    theme: {
      '--bg-primary': '#fff5f8',
      '--bg-secondary': '#ffe9f0',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#ffeef4',
      '--bg-accent': '#ffd6e4',
      '--accent-primary': '#e5447d',
      '--accent-secondary': '#c86b9c',
      '--text-primary': '#2a1a22',
      '--text-secondary': '#6b4a57',
      '--text-muted': '#9a7a87',
      '--gradient-primary': 'linear-gradient(135deg, #e5447d, #c86b9c)',
      '--gradient-xp': 'linear-gradient(90deg, #e5447d, #ff9ec0)',
    },
  },
  {
    id: 'theme-washi',
    name: 'Washi',
    description: 'Helles, papierfarbenes Theme – ruhig und klar.',
    price: 1000,
    category: 'theme',
    icon: '📜',
    theme: {
      '--bg-primary': '#f6f1e7',
      '--bg-secondary': '#efe7d6',
      '--bg-card': '#fffdf8',
      '--bg-card-hover': '#f3ecdd',
      '--bg-accent': '#e4d8bf',
      '--accent-primary': '#c0562f',
      '--accent-secondary': '#8a6d3b',
      '--text-primary': '#2b241a',
      '--text-secondary': '#5f5440',
      '--text-muted': '#938770',
      '--gradient-primary': 'linear-gradient(135deg, #c0562f, #8a6d3b)',
      '--gradient-xp': 'linear-gradient(90deg, #c0562f, #e0a87a)',
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
  {
    id: 'frame-silver',
    name: 'Silberrahmen',
    description: 'Klarer silberner Rahmen.',
    price: 1000,
    category: 'frame',
    icon: '🔘',
    frame: { ring: 'linear-gradient(135deg, #e0e0e0, #a8b2bd)', glow: 'rgba(200, 210, 220, 0.5)' },
  },
  {
    id: 'frame-fire',
    name: 'Feuerrahmen',
    description: 'Loderndes Rot-Orange.',
    price: 1000,
    category: 'frame',
    icon: '🔥',
    frame: { ring: 'linear-gradient(135deg, #ff512f, #f09819)', glow: 'rgba(255, 81, 47, 0.5)' },
  },
  {
    id: 'frame-rainbow',
    name: 'Regenbogenrahmen',
    description: 'Schillernder Regenbogen-Rahmen.',
    price: 1000,
    category: 'frame',
    icon: '🌈',
    frame: { ring: 'linear-gradient(135deg, #ff5c8a, #ffd700, #19c3c9, #8b5cf6)', glow: 'rgba(139, 92, 246, 0.5)' },
  },
  {
    id: 'frame-emerald',
    name: 'Smaragdrahmen',
    description: 'Edles Smaragdgrün.',
    price: 1000,
    category: 'frame',
    icon: '💚',
    frame: { ring: 'linear-gradient(135deg, #2ecc71, #0f8a5f)', glow: 'rgba(46, 204, 113, 0.5)' },
  },
  {
    id: 'frame-royal',
    name: 'Royal-Rahmen',
    description: 'Königliches Violett mit Goldstich.',
    price: 1000,
    category: 'frame',
    icon: '👑',
    frame: { ring: 'linear-gradient(135deg, #6a3093, #a044ff)', glow: 'rgba(160, 68, 255, 0.5)' },
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
