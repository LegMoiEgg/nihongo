/**
 * Verb conjugation helper: turns a dictionary-form verb reading into the
 * polite -masu form. Needed because the vocabulary stores verbs in dictionary
 * form (たべる, のむ, いく …) but sentences use the polite form (たべます …).
 *
 * Japanese verbs fall into three groups:
 *   - ichidan (る-verbs / group 2): drop る, add ます          たべる → たべます
 *   - godan (う-verbs / group 1): change the final u-sound to
 *     its i-sound, then add ます                               のむ → のみます
 *   - irregular: する → します, くる → きます
 *
 * You cannot tell ichidan from godan by the ending alone (みる is ichidan,
 * かえる would be godan). So we keep an explicit list of the N5 ichidan verbs
 * and treat everything else ending in an u-sound as godan.
 */

// Verb IDs that are ichidan (group 2) — drop る, add ます.
const ICHIDAN_IDS = new Set([
  'v-taberu',   // たべる
  'v-miru',     // みる
  'v-neru',     // ねる
  'v-okiru',    // おきる
])

// Verb IDs that are irregular.
const IRREGULAR: Record<string, string> = {
  'v-kuru': 'きます',            // くる
  'v-benkyousuru': 'べんきょうします', // べんきょうする
  'v-shigotosuru': 'しごとします',    // しごとする
}

// Godan final-kana → its i-row counterpart (used before ます).
const GODAN_STEM: Record<string, string> = {
  'う': 'い',
  'く': 'き',
  'ぐ': 'ぎ',
  'す': 'し',
  'つ': 'ち',
  'ぬ': 'に',
  'ぶ': 'び',
  'む': 'み',
  'る': 'り',
}

/**
 * Convert a verb (by id + dictionary reading) to its polite -masu form.
 * Returns null if it can't be conjugated confidently.
 */
export function toMasu(id: string, reading: string): string | null {
  if (!reading) return null

  // Irregular verbs first.
  if (IRREGULAR[id]) return IRREGULAR[id]

  // Generic する-verbs (compound nouns + する) not in the explicit list.
  if (reading.endsWith('する')) {
    return reading.slice(0, -2) + 'します'
  }

  // Ichidan: drop the final る, add ます.
  if (ICHIDAN_IDS.has(id)) {
    if (!reading.endsWith('る')) return null
    return reading.slice(0, -1) + 'ます'
  }

  // Godan: swap the final kana to its i-row form, add ます.
  const last = reading.slice(-1)
  const stem = GODAN_STEM[last]
  if (!stem) return null
  return reading.slice(0, -1) + stem + 'ます'
}
