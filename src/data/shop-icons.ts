/**
 * Resolves a shop item's `iconImage` filename to a bundled asset URL.
 *
 * All images placed in `src/assets/shop-icons/` are picked up at build time by
 * Vite's import.meta.glob (eager), so an item can reference one simply by file
 * name (e.g. iconImage: 'power.png'). If the file isn't present, resolution
 * returns null and the UI falls back to the item's emoji.
 */

// Eagerly import every image in the shop-icons folder as a URL.
const modules = import.meta.glob(
  '../assets/shop-icons/*.{png,jpg,jpeg,webp,svg,gif}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

// Map bare filename -> resolved URL.
const byName: Record<string, string> = {}
for (const path in modules) {
  const file = path.split('/').pop()
  if (file) byName[file] = modules[path]
}

/** Returns the bundled URL for a given icon filename, or null if not found. */
export function shopIconUrl(iconImage: string | undefined | null): string | null {
  if (!iconImage) return null
  return byName[iconImage] ?? null
}
