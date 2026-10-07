/**
 * Applies the user's equipped cosmetics (accent color + theme) to the DOM by
 * overriding the global CSS custom properties on <html>. Because the whole app
 * reads colors from these variables (see src/styles/global.css :root), setting
 * them here recolors everything consistently.
 *
 * Order of precedence when both a theme and an accent are equipped:
 *   1. Theme variables are applied first (backgrounds + its own accent).
 *   2. A separately equipped accent then overrides --accent-primary on top,
 *      so you can run e.g. the Ocean theme with a pink accent.
 *
 * Frames are NOT applied here — they're rendered per-avatar in the Social tab
 * (and on the profile) from the equipped frame id.
 */
import { getShopItem } from '../data/shop'
import { useUserStore } from '../stores/user'

// The theme variables we may override, so we can cleanly RESET them when the
// user unequips a theme (removing the inline style falls back to :root).
const THEME_VARS = [
  '--bg-primary',
  '--bg-secondary',
  '--bg-card',
  '--bg-card-hover',
  '--bg-accent',
  '--accent-primary',
  '--accent-secondary',
  '--gradient-primary',
  '--gradient-xp',
  // Text vars — needed so LIGHT themes can switch to dark text (and get
  // cleanly reset back to the dark-theme defaults when unequipped).
  '--text-primary',
  '--text-secondary',
  '--text-muted',
]

export function applyCosmetics(): void {
  if (typeof document === 'undefined') return
  const userStore = useUserStore()
  const root = document.documentElement

  // Reset anything we might have set before, so switching/unequipping is clean.
  for (const v of THEME_VARS) root.style.removeProperty(v)
  // Reset the themed body background (falls back to the global default).
  document.body.style.removeProperty('background')
  document.body.style.removeProperty('background-attachment')

  // 1) Theme (full background + accent set).
  const theme = userStore.equippedTheme ? getShopItem(userStore.equippedTheme) : undefined
  if (theme?.theme) {
    for (const [key, value] of Object.entries(theme.theme)) {
      root.style.setProperty(key, value)
    }
    // Rich layered background (gradients + faint emoji pattern) on the body,
    // so the themed look fills the whole screen behind the UI.
    if (theme.themeBackground) {
      document.body.style.setProperty('background', theme.themeBackground)
      document.body.style.setProperty('background-attachment', 'fixed')
    }
  }

  // 2) Accent on top (overrides the theme's accent if one is equipped).
  const accent = userStore.equippedAccent ? getShopItem(userStore.equippedAccent) : undefined
  if (accent?.accent) {
    root.style.setProperty('--accent-primary', accent.accent)
    // Keep the primary gradient in sync so buttons/XP bars pick up the color.
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${accent.accent}, var(--accent-secondary))`)
    root.style.setProperty('--gradient-xp', `linear-gradient(90deg, ${accent.accent}, ${accent.accent})`)
  }
}

/**
 * Styling for the small avatar RING (shop/profile preview thumbnails).
 * Returns a gradient background + soft glow, or null if no frame.
 */
export function frameStyle(frameId: string | undefined | null): { background: string; boxShadow: string } | null {
  if (!frameId) return null
  const item = getShopItem(frameId)
  if (!item?.frame) return null
  return {
    background: item.frame.ring,
    boxShadow: `0 0 10px ${item.frame.glow}`,
  }
}

/**
 * Styling for a WHOLE user ROW (Social-tab leaderboard entry). Uses the
 * frame's gradient as a border-image around the entire row plus a coloured
 * glow. Returns null if the user has no frame equipped.
 */
export function frameRowStyle(frameId: string | undefined | null): Record<string, string> | null {
  if (!frameId) return null
  const item = getShopItem(frameId)
  if (!item?.frame) return null
  // Gradient border that KEEPS the row's rounded corners: paint the card
  // colour as a padding-box layer and the frame gradient as a border-box
  // layer, with a transparent 2px border acting as the window for the
  // gradient. A coloured glow lifts the whole row.
  return {
    border: '2px solid transparent',
    background:
      'linear-gradient(var(--bg-card), var(--bg-card)) padding-box, ' +
      `${item.frame.rowBorder} border-box`,
    boxShadow: `0 0 12px ${item.frame.glow}`,
  }
}
