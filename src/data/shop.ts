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
   *  - theme : a set of CSS variable overrides keyed by var name, plus an
   *            optional bodyBackground (layered gradients + faint emoji/pattern)
   *            applied to document.body for a richer look.
   *  - frame : ring  = gradient for the small avatar ring (shop/profile preview)
   *            rowBorder = gradient used as a border-image around the WHOLE
   *                        user row in the Social tab
   *            glow  = coloured glow (box-shadow) around the row/avatar
   */
  accent?: string
  theme?: Record<string, string>
  themeBackground?: string
  frame?: {
    ring: string
    rowBorder: string
    glow: string
    /** Faint emoji tiled inside the row to match the frame's theme. */
    rowEmoji: string
    /** Soft tint behind the emoji pattern (rgba), layered over the card bg. */
    rowTint: string
  }
}

/** Tiny deterministic PRNG (mulberry32) so a pattern looks the same every time. */
function seededRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic numeric seed from a string (so each emoji maps to a layout). */
function seedFromString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Builds a faint, SCATTERED emoji pattern as a repeating SVG data-URI layer.
 * Instead of one emoji in a strict grid, a large tile holds several emojis at
 * pseudo-random positions, sizes and rotations — so the background looks
 * randomly sprinkled, not gridded. The layout is deterministic (seeded from
 * the emoji) so it never changes between reloads.
 *
 * `opacity` keeps it subtle; `size` is the tile edge (bigger = more spread out,
 * less obvious repetition).
 */
export function emojiPattern(emoji: string, opacity = 0.14, size = 300): string {
  const rng = seededRng(seedFromString(emoji))
  const count = 11 // emojis per tile
  const margin = 24 // keep emojis off the hard edges
  let items = ''
  for (let i = 0; i < count; i++) {
    const x = Math.round(margin + rng() * (size - margin * 2))
    const y = Math.round(margin + rng() * (size - margin * 2))
    const fontSize = Math.round(22 + rng() * 20) // 22–42px
    const rot = Math.round(-35 + rng() * 70)     // −35°…+35°
    const op = (opacity * (0.75 + rng() * 0.5)).toFixed(3) // vary each a bit
    items +=
      `<text x='${x}' y='${y}' font-size='${fontSize}' opacity='${op}' ` +
      `text-anchor='middle' dominant-baseline='central' ` +
      `transform='rotate(${rot} ${x} ${y})'>${emoji}</text>`
  }
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${items}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/**
 * Composes a theme body background: a faint emoji tile on top of two soft
 * radial glows plus the base colour. Layer order = top → bottom in CSS.
 */
function themeBg(emoji: string, glowA: string, glowB: string, base: string): string {
  return (
    `${emojiPattern(emoji)}, ` +
    `radial-gradient(circle at 15% 15%, ${glowA}, transparent 45%), ` +
    `radial-gradient(circle at 85% 80%, ${glowB}, transparent 50%), ` +
    `${base}`
  )
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
  // ── Charakter-Akzente ──
  {
    id: 'accent-power',
    name: 'Power-Pink',
    description: 'Grelles Blut-Pink des Blut-Teufels.',
    price: 100,
    category: 'accent',
    icon: '😈',
    accent: '#ff3d84',
  },
  {
    id: 'accent-miku',
    name: 'Miku-Türkis',
    description: 'Das ikonische Vocaloid-Türkis.',
    price: 100,
    category: 'accent',
    icon: '🎤',
    accent: '#39c5bb',
  },
  {
    id: 'accent-frieren',
    name: 'Frieren-Mint',
    description: 'Das kühle Mintgrün von Frierens Augen.',
    price: 100,
    category: 'accent',
    icon: '🧝',
    accent: '#6fcf97',
  },
]

// ────────────────────────────────────────────────────────────────────────
//  THEMES — expensive, retheme the whole app (backgrounds + accents).
// ────────────────────────────────────────────────────────────────────────
const THEMES: ShopItem[] = [
  {
    id: 'theme-sakura',
    name: 'Sakura',
    description: 'Verträumtes Kirschblüten-Theme mit blassen Blüten im Hintergrund.',
    price: 1000,
    category: 'theme',
    icon: '🌸',
    themeBackground: themeBg('🌸', 'rgba(255,92,138,0.18)', 'rgba(200,107,156,0.16)', '#2b1b24'),
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
    description: 'Beruhigendes Grüntee-Theme mit sanften Teeschalen im Hintergrund.',
    price: 1000,
    category: 'theme',
    icon: '🍵',
    themeBackground: themeBg('🍵', 'rgba(63,163,77,0.18)', 'rgba(123,211,137,0.14)', '#10261a'),
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
    description: 'Tiefes Nachtblau mit Wellen, die leise im Hintergrund schimmern.',
    price: 1000,
    category: 'theme',
    icon: '🌊',
    themeBackground: themeBg('🌊', 'rgba(25,195,201,0.20)', 'rgba(47,110,191,0.18)', '#071a2b'),
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
    description: 'Warmes Abendrot in Orange und Violett mit Sonnen-Schimmer.',
    price: 1000,
    category: 'theme',
    icon: '🌇',
    themeBackground: themeBg('🌇', 'rgba(255,123,84,0.22)', 'rgba(177,75,138,0.20)', '#2a1120'),
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
    description: 'Dunkles Tannengrün mit stillen Bäumen im Hintergrund.',
    price: 1000,
    category: 'theme',
    icon: '🌲',
    themeBackground: themeBg('🌲', 'rgba(95,185,138,0.18)', 'rgba(138,154,63,0.16)', '#0c1f17'),
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
    description: 'Fast schwarzes Blau mit funkelnden Sternen im Hintergrund.',
    price: 1000,
    category: 'theme',
    icon: '🌙',
    themeBackground: themeBg('✨', 'rgba(108,123,255,0.18)', 'rgba(63,74,138,0.18)', '#05060f'),
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
    description: 'Helles Kirschblüten-Theme mit zarten Blüten im Hintergrund.',
    price: 1000,
    category: 'theme',
    icon: '🌸',
    themeBackground:
      `${emojiPattern('🌸', 0.16)}, ` +
      'radial-gradient(circle at 15% 15%, rgba(229,68,125,0.12), transparent 45%), ' +
      'radial-gradient(circle at 85% 80%, rgba(255,158,192,0.14), transparent 50%), ' +
      '#fff5f8',
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
    description: 'Papierfarbenes Theme mit blassen Schriftzeichen im Hintergrund.',
    price: 1000,
    category: 'theme',
    icon: '📜',
    themeBackground:
      `${emojiPattern('あ', 0.13)}, ` +
      'radial-gradient(circle at 15% 15%, rgba(192,86,47,0.10), transparent 45%), ' +
      'radial-gradient(circle at 85% 80%, rgba(138,109,59,0.12), transparent 50%), ' +
      '#f6f1e7',
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
  // ── Charakter-Themes ──
  {
    id: 'theme-power',
    name: 'Power',
    description: 'Blut-Teufel-Theme in grellem Pink mit roten Akzenten.',
    price: 1000,
    category: 'theme',
    icon: '😈',
    themeBackground: themeBg('🩸', 'rgba(255,61,132,0.22)', 'rgba(214,40,70,0.20)', '#26101a'),
    theme: {
      '--bg-primary': '#26101a',
      '--bg-secondary': '#361524',
      '--bg-card': '#431a2d',
      '--bg-card-hover': '#552138',
      '--bg-accent': '#6b2546',
      '--accent-primary': '#ff3d84',
      '--accent-secondary': '#e02846',
      '--gradient-primary': 'linear-gradient(135deg, #ff3d84, #e02846)',
      '--gradient-xp': 'linear-gradient(90deg, #ff3d84, #ffd23f)',
    },
  },
  {
    id: 'theme-miku',
    name: 'Hatsune Miku',
    description: 'Vocaloid-Theme in Türkis und tiefem Nachtblau.',
    price: 1000,
    category: 'theme',
    icon: '🎤',
    themeBackground: themeBg('🎵', 'rgba(57,197,187,0.22)', 'rgba(45,110,160,0.20)', '#071a22'),
    theme: {
      '--bg-primary': '#071a22',
      '--bg-secondary': '#0c2630',
      '--bg-card': '#103240',
      '--bg-card-hover': '#164250',
      '--bg-accent': '#1c5565',
      '--accent-primary': '#39c5bb',
      '--accent-secondary': '#2d6ea0',
      '--gradient-primary': 'linear-gradient(135deg, #39c5bb, #2d6ea0)',
      '--gradient-xp': 'linear-gradient(90deg, #39c5bb, #86f0e8)',
    },
  },
  {
    id: 'theme-frieren',
    name: 'Frieren',
    description: 'Ruhiges Magier-Theme in Mint und Silber mit zartem Funkeln.',
    price: 1000,
    category: 'theme',
    icon: '🧝',
    themeBackground: themeBg('✨', 'rgba(111,207,151,0.20)', 'rgba(174,198,207,0.16)', '#111c1a'),
    theme: {
      '--bg-primary': '#111c1a',
      '--bg-secondary': '#182824',
      '--bg-card': '#1d322d',
      '--bg-card-hover': '#264139',
      '--bg-accent': '#315049',
      '--accent-primary': '#6fcf97',
      '--accent-secondary': '#aec6cf',
      '--gradient-primary': 'linear-gradient(135deg, #6fcf97, #aec6cf)',
      '--gradient-xp': 'linear-gradient(90deg, #6fcf97, #d6ead9)',
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
    description: 'Edler goldener Rahmen mit Glanz rund um deine ganze Zeile.',
    price: 500,
    category: 'frame',
    icon: '🥇',
    frame: {
      ring: 'linear-gradient(135deg, #fff3b0, #ffd700, #b8860b, #ffd700)',
      rowBorder: 'linear-gradient(135deg, #fff3b0, #ffd700 40%, #b8860b 70%, #ffd700)',
      glow: 'rgba(255, 200, 0, 0.55)',
      rowEmoji: '⭐',
      rowTint: 'rgba(255, 200, 0, 0.12)',
    },
  },
  {
    id: 'frame-neon',
    name: 'Neonrahmen',
    description: 'Leuchtender Neon-Verlauf, der deine Zeile pulsieren lässt.',
    price: 500,
    category: 'frame',
    icon: '💠',
    frame: {
      ring: 'linear-gradient(135deg, #00f0ff, #19c3c9, #8b5cf6, #00f0ff)',
      rowBorder: 'linear-gradient(120deg, #00f0ff, #19c3c9 45%, #8b5cf6 100%)',
      glow: 'rgba(25, 220, 230, 0.6)',
      rowEmoji: '💠',
      rowTint: 'rgba(25, 220, 230, 0.12)',
    },
  },
  {
    id: 'frame-sakura',
    name: 'Sakura-Rahmen',
    description: 'Zarter Kirschblüten-Verlauf in Rosatönen.',
    price: 500,
    category: 'frame',
    icon: '🌸',
    frame: {
      ring: 'linear-gradient(135deg, #ffd1e3, #ff5c8a, #ff85a1, #ffd1e3)',
      rowBorder: 'linear-gradient(120deg, #ffd1e3, #ff5c8a 50%, #ff85a1 100%)',
      glow: 'rgba(255, 92, 138, 0.55)',
      rowEmoji: '🌸',
      rowTint: 'rgba(255, 92, 138, 0.12)',
    },
  },
  {
    id: 'frame-silver',
    name: 'Silberrahmen',
    description: 'Kühler, polierter Silber-Verlauf mit Metallglanz.',
    price: 500,
    category: 'frame',
    icon: '🔘',
    frame: {
      ring: 'linear-gradient(135deg, #ffffff, #c7ced6, #8a97a5, #e3e8ee)',
      rowBorder: 'linear-gradient(120deg, #ffffff, #c7ced6 45%, #8a97a5 100%)',
      glow: 'rgba(200, 210, 220, 0.5)',
      rowEmoji: '✦',
      rowTint: 'rgba(200, 210, 220, 0.12)',
    },
  },
  {
    id: 'frame-fire',
    name: 'Feuerrahmen',
    description: 'Loderndes Rot-Orange mit heißem Glühen.',
    price: 500,
    category: 'frame',
    icon: '🔥',
    frame: {
      ring: 'linear-gradient(135deg, #ffd500, #ff8c00, #ff512f, #c1121f)',
      rowBorder: 'linear-gradient(120deg, #ffd500, #ff8c00 40%, #ff512f 75%, #c1121f 100%)',
      glow: 'rgba(255, 90, 30, 0.6)',
      rowEmoji: '🔥',
      rowTint: 'rgba(255, 90, 30, 0.13)',
    },
  },
  {
    id: 'frame-rainbow',
    name: 'Regenbogenrahmen',
    description: 'Schillernder Regenbogen über die ganze Zeile.',
    price: 500,
    category: 'frame',
    icon: '🌈',
    frame: {
      ring: 'linear-gradient(135deg, #ff5c8a, #ffd700, #2ecc71, #19c3c9, #8b5cf6)',
      rowBorder: 'linear-gradient(120deg, #ff5c8a, #ffd700 25%, #2ecc71 50%, #19c3c9 75%, #8b5cf6 100%)',
      glow: 'rgba(139, 92, 246, 0.55)',
      rowEmoji: '🌈',
      rowTint: 'rgba(139, 92, 246, 0.12)',
    },
  },
  {
    id: 'frame-emerald',
    name: 'Smaragdrahmen',
    description: 'Tiefes Smaragdgrün mit edlem Schimmer.',
    price: 500,
    category: 'frame',
    icon: '💚',
    frame: {
      ring: 'linear-gradient(135deg, #a8ffce, #2ecc71, #0f8a5f, #2ecc71)',
      rowBorder: 'linear-gradient(120deg, #a8ffce, #2ecc71 45%, #0f8a5f 100%)',
      glow: 'rgba(46, 204, 113, 0.55)',
      rowEmoji: '💎',
      rowTint: 'rgba(46, 204, 113, 0.12)',
    },
  },
  {
    id: 'frame-royal',
    name: 'Royal-Rahmen',
    description: 'Königliches Violett mit goldenem Einschlag.',
    price: 500,
    category: 'frame',
    icon: '👑',
    frame: {
      ring: 'linear-gradient(135deg, #ffd700, #a044ff, #6a3093, #a044ff)',
      rowBorder: 'linear-gradient(120deg, #ffd700, #a044ff 40%, #6a3093 100%)',
      glow: 'rgba(160, 68, 255, 0.55)',
      rowEmoji: '👑',
      rowTint: 'rgba(160, 68, 255, 0.12)',
    },
  },
  // ── Charakter-Rahmen ──
  {
    id: 'frame-power',
    name: 'Power-Rahmen',
    description: 'Blut-Teufel-Rahmen in Pink mit roten Hörnern.',
    price: 500,
    category: 'frame',
    icon: '😈',
    frame: {
      ring: 'linear-gradient(135deg, #ffd23f, #ff3d84, #e02846, #ff3d84)',
      rowBorder: 'linear-gradient(120deg, #ffd23f, #ff3d84 45%, #e02846 100%)',
      glow: 'rgba(255, 61, 132, 0.6)',
      rowEmoji: '😈',
      rowTint: 'rgba(255, 61, 132, 0.13)',
    },
  },
  {
    id: 'frame-miku',
    name: 'Miku-Rahmen',
    description: 'Vocaloid-Rahmen in leuchtendem Türkis.',
    price: 500,
    category: 'frame',
    icon: '🎤',
    frame: {
      ring: 'linear-gradient(135deg, #86f0e8, #39c5bb, #2d6ea0, #39c5bb)',
      rowBorder: 'linear-gradient(120deg, #86f0e8, #39c5bb 45%, #2d6ea0 100%)',
      glow: 'rgba(57, 197, 187, 0.6)',
      rowEmoji: '🎵',
      rowTint: 'rgba(57, 197, 187, 0.13)',
    },
  },
  {
    id: 'frame-frieren',
    name: 'Frieren-Rahmen',
    description: 'Magier-Rahmen in Mint und Silber mit sanftem Funkeln.',
    price: 500,
    category: 'frame',
    icon: '🧝',
    frame: {
      ring: 'linear-gradient(135deg, #d6ead9, #6fcf97, #aec6cf, #6fcf97)',
      rowBorder: 'linear-gradient(120deg, #d6ead9, #6fcf97 45%, #aec6cf 100%)',
      glow: 'rgba(111, 207, 151, 0.6)',
      rowEmoji: '✨',
      rowTint: 'rgba(111, 207, 151, 0.13)',
    },
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
