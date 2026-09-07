import { vocabularyData } from './vocabulary'
import { toMasu } from './verb-conjugation'

export interface SentenceChallenge {
  id: string
  meaning: string
  correctOrder: string[]
  distractors: string[]
  hint?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

/**
 * Curated sentence templates with correct German translations and
 * semantically sensible word combinations. Each template lists which
 * vocabulary IDs must be learned for it to be available.
 *
 * This replaces the old random generator which produced ungrammatical
 * and nonsensical sentences.
 */
interface SentenceTemplate {
  requiredVocab: string[]  // vocab IDs that must all be learned
  meaning: string          // correct German sentence
  blocks: string[]         // correct order of Japanese blocks (readings)
  extraDistractors?: string[]
  hint?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  // ── Easy: X は Y です ──
  {
    requiredVocab: ['v-watashi'],
    meaning: 'Ich bin Student.',
    blocks: ['わたし', 'は', 'がくせい', 'です'],
    extraDistractors: ['あなた', 'せんせい'],
    hint: 'は = Thema-Partikel, です = sein',
    difficulty: 'easy',
  },
  {
    requiredVocab: ['v-kore', 'v-hon-book'],
    meaning: 'Das ist ein Buch.',
    blocks: ['これ', 'は', 'ほん', 'です'],
    extraDistractors: ['それ', 'みず'],
    hint: 'これ = Dies',
    difficulty: 'easy',
  },
  {
    requiredVocab: ['v-mizu'],
    meaning: 'Das ist Wasser.',
    blocks: ['これ', 'は', 'みず', 'です'],
    extraDistractors: ['おちゃ', 'は'],
    hint: 'これ = Dies, です = sein',
    difficulty: 'easy',
  },

  // ── Easy: Noun は Adjektiv です ──
  {
    requiredVocab: ['v-mizu', 'v-tsumetai'],
    meaning: 'Das Wasser ist kalt.',
    blocks: ['みず', 'は', 'つめたい', 'です'],
    extraDistractors: ['あつい', 'たかい'],
    hint: 'は = Thema, です = sein',
    difficulty: 'easy',
  },
  {
    requiredVocab: ['v-gohan', 'v-oishii'],
    meaning: 'Das Essen ist lecker.',
    blocks: ['ごはん', 'は', 'おいしい', 'です'],
    extraDistractors: ['たかい', 'やすい'],
    hint: 'おいしい = lecker',
    difficulty: 'easy',
  },

  // ── Medium: Ich esse/trinke X ──
  {
    requiredVocab: ['v-watashi', 'v-gohan', 'v-taberu'],
    meaning: 'Ich esse Reis.',
    blocks: ['わたし', 'は', 'ごはん', 'を', 'たべます'],
    extraDistractors: ['のみます', 'みず'],
    hint: 'を = Objekt-Partikel, たべます = essen',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-mizu', 'v-nomu'],
    meaning: 'Ich trinke Wasser.',
    blocks: ['わたし', 'は', 'みず', 'を', 'のみます'],
    extraDistractors: ['たべます', 'ごはん'],
    hint: 'のみます = trinken',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-ocha', 'v-nomu'],
    meaning: 'Ich trinke Tee.',
    blocks: ['わたし', 'は', 'おちゃ', 'を', 'のみます'],
    extraDistractors: ['たべます', 'みず'],
    hint: 'おちゃ = Tee',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-hon-book', 'v-yomu'],
    meaning: 'Ich lese ein Buch.',
    blocks: ['わたし', 'は', 'ほん', 'を', 'よみます'],
    extraDistractors: ['かきます', 'みます'],
    hint: 'よみます = lesen',
    difficulty: 'medium',
  },

  // ── Medium: Ich gehe zu X ──
  {
    requiredVocab: ['v-watashi', 'v-gakkou', 'v-iku'],
    meaning: 'Ich gehe zur Schule.',
    blocks: ['わたし', 'は', 'がっこう', 'に', 'いきます'],
    extraDistractors: ['きます', 'えき'],
    hint: 'に = Richtungspartikel, いきます = gehen',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-eki', 'v-iku'],
    meaning: 'Ich gehe zum Bahnhof.',
    blocks: ['わたし', 'は', 'えき', 'に', 'いきます'],
    extraDistractors: ['がっこう', 'きます'],
    hint: 'えき = Bahnhof',
    difficulty: 'medium',
  },

  // ── Hard: Time + Subject + Object + Verb ──
  {
    requiredVocab: ['v-watashi', 'v-asa', 'v-gohan', 'v-taberu'],
    meaning: 'Ich esse morgens Reis.',
    blocks: ['わたし', 'は', 'あさ', 'ごはん', 'を', 'たべます'],
    extraDistractors: ['よる', 'のみます'],
    hint: 'あさ = Morgen (Tageszeit)',
    difficulty: 'hard',
  },
  {
    requiredVocab: ['v-kyou', 'v-atsui'],
    meaning: 'Heute ist es heiß.',
    blocks: ['きょう', 'は', 'あつい', 'です'],
    extraDistractors: ['さむい', 'あした'],
    hint: 'きょう = heute, あつい = heiß',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-nihongo', 'v-benkyousuru'],
    meaning: 'Ich lerne Japanisch.',
    blocks: ['わたし', 'は', 'にほんご', 'を', 'べんきょうします'],
    extraDistractors: ['はなします', 'えいご'],
    hint: 'べんきょうします = lernen',
    difficulty: 'hard',
  },

  // ── More Easy: X は Y です ──
  {
    requiredVocab: ['v-watashi', 'v-sensei'],
    meaning: 'Ich bin Lehrer.',
    blocks: ['わたし', 'は', 'せんせい', 'です'],
    extraDistractors: ['がくせい', 'あなた'],
    hint: 'せんせい = Lehrer',
    difficulty: 'easy',
  },
  {
    requiredVocab: ['v-kore', 'v-ocha'],
    meaning: 'Das ist Tee.',
    blocks: ['これ', 'は', 'おちゃ', 'です'],
    extraDistractors: ['みず', 'ほん'],
    hint: 'おちゃ = Tee',
    difficulty: 'easy',
  },
  {
    requiredVocab: ['v-sore', 'v-hon-book'],
    meaning: 'Das (dort) ist ein Buch.',
    blocks: ['それ', 'は', 'ほん', 'です'],
    extraDistractors: ['これ', 'みず'],
    hint: 'それ = das (dort)',
    difficulty: 'easy',
  },

  // ── More Easy: Noun は Adjektiv です ──
  {
    requiredVocab: ['v-ocha', 'v-atsui'],
    meaning: 'Der Tee ist heiß.',
    blocks: ['おちゃ', 'は', 'あつい', 'です'],
    extraDistractors: ['つめたい', 'おいしい'],
    hint: 'あつい = heiß',
    difficulty: 'easy',
  },
  {
    requiredVocab: ['v-hon-book', 'v-takai'],
    meaning: 'Das Buch ist teuer.',
    blocks: ['ほん', 'は', 'たかい', 'です'],
    extraDistractors: ['やすい', 'おいしい'],
    hint: 'たかい = teuer',
    difficulty: 'easy',
  },

  // ── More Medium: essen/trinken/lesen ──
  {
    requiredVocab: ['v-watashi', 'v-tabemono', 'v-taberu'],
    meaning: 'Ich esse Essen.',
    blocks: ['わたし', 'は', 'たべもの', 'を', 'たべます'],
    extraDistractors: ['のみます', 'みず'],
    hint: 'たべもの = Essen',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-nihongo', 'v-hanasu'],
    meaning: 'Ich spreche Japanisch.',
    blocks: ['わたし', 'は', 'にほんご', 'を', 'はなします'],
    extraDistractors: ['えいご', 'べんきょうします'],
    hint: 'はなします = sprechen',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-eigo', 'v-hanasu'],
    meaning: 'Ich spreche Englisch.',
    blocks: ['わたし', 'は', 'えいご', 'を', 'はなします'],
    extraDistractors: ['にほんご', 'よみます'],
    hint: 'えいご = Englisch',
    difficulty: 'medium',
  },

  // ── More Medium: gehen/kommen ──
  {
    requiredVocab: ['v-watashi', 'v-gakkou', 'v-kuru'],
    meaning: 'Ich komme zur Schule.',
    blocks: ['わたし', 'は', 'がっこう', 'に', 'きます'],
    extraDistractors: ['いきます', 'えき'],
    hint: 'きます = kommen',
    difficulty: 'medium',
  },

  // ── More Hard: Zeit + Objekt + Verb ──
  {
    requiredVocab: ['v-watashi', 'v-yoru', 'v-hon-book', 'v-yomu'],
    meaning: 'Ich lese abends ein Buch.',
    blocks: ['わたし', 'は', 'よる', 'ほん', 'を', 'よみます'],
    extraDistractors: ['あさ', 'たべます'],
    hint: 'よる = Nacht/Abend',
    difficulty: 'hard',
  },
  {
    requiredVocab: ['v-watashi', 'v-asa', 'v-ocha', 'v-nomu'],
    meaning: 'Ich trinke morgens Tee.',
    blocks: ['わたし', 'は', 'あさ', 'おちゃ', 'を', 'のみます'],
    extraDistractors: ['よる', 'たべます'],
    hint: 'あさ = Morgen',
    difficulty: 'hard',
  },
  {
    requiredVocab: ['v-kyou', 'v-samui'],
    meaning: 'Heute ist es kalt.',
    blocks: ['きょう', 'は', 'さむい', 'です'],
    extraDistractors: ['あつい', 'あした'],
    hint: 'さむい = kalt (Wetter)',
    difficulty: 'medium',
  },
  {
    requiredVocab: ['v-watashi', 'v-eki', 'v-iku'],
    meaning: 'Ich gehe morgen zum Bahnhof.',
    blocks: ['わたし', 'は', 'あした', 'えき', 'に', 'いきます'],
    extraDistractors: ['きょう', 'がっこう'],
    hint: 'あした = morgen',
    difficulty: 'hard',
  },
]

/**
 * German translation / explanation for individual sentence blocks.
 * Used for the tap-to-translate feature (like Duolingo): tapping a single
 * word block reveals just that word's meaning, not the whole sentence.
 */
const BLOCK_TRANSLATIONS: Record<string, string> = {
  // Particles
  'は': 'Themen-Partikel (wa)',
  'を': 'Objekt-Partikel (o)',
  'に': 'Richtungs-/Zielpartikel (ni)',
  'で': 'Ortspartikel – wo etwas passiert (de)',
  'が': 'Subjekt-Partikel (ga)',
  'の': 'Besitz-Partikel (no)',
  'も': 'auch (mo)',
  'と': 'und / mit (to)',
  'へ': 'Richtungspartikel (e)',
  'から': 'von / weil (kara)',
  // Copula / verbs
  'です': 'ist / sein (höflich)',
  'たべます': 'essen (höflich)',
  'のみます': 'trinken (höflich)',
  'いきます': 'gehen (höflich)',
  'きます': 'kommen (höflich)',
  'よみます': 'lesen (höflich)',
  'かきます': 'schreiben (höflich)',
  'みます': 'sehen (höflich)',
  'べんきょうします': 'lernen / studieren (höflich)',
  // Nouns / pronouns
  'わたし': 'ich',
  'あなた': 'du / Sie',
  'これ': 'dies (hier)',
  'それ': 'das (dort)',
  'ほん': 'Buch',
  'みず': 'Wasser',
  'おちゃ': 'Tee',
  'ごはん': 'Reis / Mahlzeit',
  'がくせい': 'Student',
  'せんせい': 'Lehrer',
  'がっこう': 'Schule',
  'えき': 'Bahnhof',
  'にほんご': 'Japanisch (Sprache)',
  'えいご': 'Englisch (Sprache)',
  'たべもの': 'Essen',
  // Time words
  'あさ': 'Morgen (Tageszeit)',
  'よる': 'Nacht',
  'きょう': 'heute',
  'あした': 'morgen (Tag)',
  // Adjectives
  'つめたい': 'kalt (Getränk/Objekt)',
  'あつい': 'heiß',
  'さむい': 'kalt (Wetter)',
  'おいしい': 'lecker',
  'たかい': 'teuer / hoch',
  'やすい': 'günstig',
}

/** Returns a German translation for a single sentence block, if known. */
export function translateBlock(block: string): string | null {
  return BLOCK_TRANSLATIONS[block] ?? null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

let idCounter = 0

/**
 * Returns curated sentences whose required vocab the learner has seen.
 * Falls back to easy templates if the learner knows very little.
 */
export function generateDynamicSentences(
  learnedVocabIds: string[],
  count: number,
  userLevel = 1
): SentenceChallenge[] {
  const learnedSet = new Set(learnedVocabIds)

  // Only offer templates where the learner knows all required vocab.
  // 'v-kore' and 'v-hon' etc. might not exist in vocab data — treat missing
  // vocab as "known" so basic sentences are always available.
  const knownVocabIds = new Set(vocabularyData.map(v => v.id))

  let available = SENTENCE_TEMPLATES.filter(t =>
    t.requiredVocab.every(id => {
      // If the vocab doesn't exist in our data, allow it (basic building blocks)
      if (!knownVocabIds.has(id)) return true
      return learnedSet.has(id)
    })
  )

  // Level-based difficulty gating so higher-level users stop getting the same
  // trivial "Das ist ein Buch." every day:
  //   < 12  → easy + medium
  //   12-17 → medium + hard (drop easy)
  //   >= 18 → hard first, medium as backup (no easy)
  const allowedByLevel = (t: SentenceTemplate): boolean => {
    if (userLevel >= 18) return t.difficulty !== 'easy'
    if (userLevel >= 12) return t.difficulty !== 'easy'
    return true
  }
  const preferredByLevel = (t: SentenceTemplate): boolean => {
    if (userLevel >= 18) return t.difficulty === 'hard'
    if (userLevel >= 12) return t.difficulty === 'medium' || t.difficulty === 'hard'
    return t.difficulty === 'easy' || t.difficulty === 'medium'
  }

  const leveled = available.filter(allowedByLevel)
  if (leveled.length > 0) available = leveled

  // Prefer the level-appropriate difficulty, but keep the rest as fallback so
  // we can always reach `count`.
  const preferred = shuffle(available.filter(preferredByLevel))
  const fallback = shuffle(available.filter(t => !preferredByLevel(t)))
  let pool = [...preferred, ...fallback]

  // If nothing matches at all (brand new learner), use the easiest templates.
  if (pool.length === 0) {
    pool = shuffle(SENTENCE_TEMPLATES.filter(t => t.difficulty === 'easy'))
  }

  const selected = pool.slice(0, count)

  return selected.map(t => {
    const distractors = shuffle(t.extraDistractors || []).slice(0, 2)
    return {
      id: `gen-${++idCounter}`,
      meaning: t.meaning,
      correctOrder: t.blocks,
      distractors,
      hint: t.hint,
      difficulty: t.difficulty,
    }
  })
}

// ────────────────────────────────────────────────────────────────────────
//  DYNAMIC SENTENCE GENERATION
//  Builds correct sentences from the words the learner actually knows, so a
//  freshly-learned noun (さかな, にく, …) shows up in a real sentence like
//  わたし は さかな を たべます. This complements the hand-written templates.
// ────────────────────────────────────────────────────────────────────────

const vocabById = new Map(vocabularyData.map(v => [v.id, v]))

/** Semantic groups: which nouns work as the object of which verb. */
const EDIBLE = ['v-gohan', 'v-niku', 'v-sakana', 'v-kudamono', 'v-yasai', 'v-tabemono']
const DRINKABLE = ['v-mizu', 'v-ocha', 'v-nomimono']
const READABLE = ['v-hon-book', 'v-shinbun', 'v-tegami', 'v-jisho']
const PLACES = ['v-gakkou', 'v-eki', 'v-byouin', 'v-mise', 'v-kaisha', 'v-uchi']
// Nouns that can sensibly take a plain "[Noun] は [i-Adjective] です".
const DESCRIBABLE = [
  'v-gohan', 'v-niku', 'v-sakana', 'v-kudamono', 'v-yasai', 'v-tabemono',
  'v-mizu', 'v-ocha', 'v-hon-book', 'v-kuruma', 'v-inu', 'v-neko',
  'v-gakkou', 'v-eki', 'v-heya',
]
const I_ADJECTIVES = [
  'v-ookii', 'v-chiisai', 'v-oishii', 'v-takai', 'v-yasui', 'v-atarashii',
  'v-furui', 'v-ii', 'v-warui', 'v-atsui', 'v-samui',
]

const SUBJECT_PRONOUNS = ['v-watashi', 'v-kare', 'v-kanojo']

function reading(id: string): string | null {
  const v = vocabById.get(id)
  return v ? v.reading : null
}
function meaningDe(id: string): string | null {
  const v = vocabById.get(id)
  return v ? v.meaning : null
}

/** German subject word for the pronoun (nominative). */
const PRONOUN_DE: Record<string, string> = {
  'v-watashi': 'Ich',
  'v-kare': 'Er',
  'v-kanojo': 'Sie',
}
/** German verb form matching the subject (only 1st/3rd person singular here). */
const VERB_DE: Record<string, { ich: string; er: string }> = {
  'v-taberu': { ich: 'esse', er: 'isst' },
  'v-nomu': { ich: 'trinke', er: 'trinkt' },
  'v-yomu': { ich: 'lese', er: 'liest' },
  'v-iku': { ich: 'gehe', er: 'geht' },
}

interface DynOptions {
  learnedSet: Set<string>
  pickDistractorReadings: (correct: string[], pos: 'noun' | 'verb' | 'adj') => string[]
}

/**
 * Try to build ONE sentence that uses `nounId`. Returns null if the required
 * partner words (verb / adjective / pronoun) aren't learned yet.
 */
function buildSentenceForNoun(nounId: string, opts: DynOptions): SentenceChallenge | null {
  const { learnedSet } = opts
  const nounR = reading(nounId)
  const nounDe = meaningDe(nounId)
  if (!nounR || !nounDe) return null

  const has = (id: string) => learnedSet.has(id)
  const pron = SUBJECT_PRONOUNS.filter(has)
  const pickPronoun = () => (pron.length ? pron[Math.floor(Math.random() * pron.length)] : 'v-watashi')

  // Pattern A: [Pronoun] は [Noun] を [Verb-masu]  (edible/drinkable/readable)
  const tryTransitive = (verbId: string): SentenceChallenge | null => {
    if (!has(verbId)) return null
    const vr = reading(verbId)
    const masu = vr ? toMasu(verbId, vr) : null
    if (!masu) return null
    const pId = pickPronoun()
    const pr = reading(pId) || 'わたし'
    const vde = VERB_DE[verbId]
    const pde = PRONOUN_DE[pId] || 'Ich'
    const verbDe = vde ? (pId === 'v-watashi' ? vde.ich : vde.er) : ''
    const de = `${pde} ${verbDe} ${nounDe.split(' /')[0]}.`
    const distr = opts.pickDistractorReadings([pr, 'は', nounR, 'を', masu], 'noun')
    return {
      id: `dyn-${++idCounter}`,
      meaning: de,
      correctOrder: [pr, 'は', nounR, 'を', masu],
      distractors: distr,
      hint: 'は = Thema, を = Objekt',
      difficulty: 'medium',
    }
  }

  if (EDIBLE.includes(nounId)) { const s = tryTransitive('v-taberu'); if (s) return s }
  if (DRINKABLE.includes(nounId)) { const s = tryTransitive('v-nomu'); if (s) return s }
  if (READABLE.includes(nounId)) { const s = tryTransitive('v-yomu'); if (s) return s }

  // Pattern B: [Pronoun] は [Place] に いきます  (place + go)
  if (PLACES.includes(nounId) && has('v-iku')) {
    const masu = toMasu('v-iku', reading('v-iku')!)
    if (masu) {
      const pId = pickPronoun()
      const pr = reading(pId) || 'わたし'
      const pde = PRONOUN_DE[pId] || 'Ich'
      const de = `${pde} ${pId === 'v-watashi' ? 'gehe' : 'geht'} zu${nounDe === 'Schule' ? 'r' : 'm'} ${nounDe.split(' /')[0]}.`
      return {
        id: `dyn-${++idCounter}`,
        meaning: de,
        correctOrder: [pr, 'は', nounR, 'に', masu],
        distractors: opts.pickDistractorReadings([pr, 'は', nounR, 'に', masu], 'noun'),
        hint: 'に = Zielpartikel, いきます = gehen',
        difficulty: 'medium',
      }
    }
  }

  // Pattern C: [Noun] は [i-Adjective] です  (noun + adjective description)
  if (DESCRIBABLE.includes(nounId)) {
    const adjs = I_ADJECTIVES.filter(has)
    if (adjs.length > 0) {
      const adjId = adjs[Math.floor(Math.random() * adjs.length)]
      const ar = reading(adjId)
      const ade = meaningDe(adjId)
      if (ar && ade) {
        const de = `${nounDe.split(' /')[0]} ist ${ade.split(' (')[0].split(' /')[0]}.`
        return {
          id: `dyn-${++idCounter}`,
          meaning: de,
          correctOrder: [nounR, 'は', ar, 'です'],
          distractors: opts.pickDistractorReadings([nounR, 'は', ar, 'です'], 'adj'),
          hint: 'は = Thema, です = sein',
          difficulty: 'easy',
        }
      }
    }
  }

  return null
}

/** Build a distractor picker that pulls plausible wrong readings by role. */
function makeDistractorPicker(learnedIds: string[]) {
  const learnedNouns = learnedIds.filter(id => vocabById.get(id)?.partOfSpeech === 'Nomen')
  const learnedVerbsMasu = learnedIds
    .filter(id => vocabById.get(id)?.partOfSpeech === 'Verb')
    .map(id => toMasu(id, reading(id) || ''))
    .filter((x): x is string => !!x)
  const learnedAdjs = learnedIds.filter(id => vocabById.get(id)?.partOfSpeech === 'i-Adjektiv')

  return (correct: string[], pos: 'noun' | 'verb' | 'adj'): string[] => {
    const correctSet = new Set(correct)
    let pool: string[] = []
    if (pos === 'noun') {
      pool = learnedNouns.map(id => reading(id)!).filter(Boolean)
      pool.push(...learnedVerbsMasu)
    } else if (pos === 'adj') {
      pool = learnedAdjs.map(id => reading(id)!).filter(Boolean)
    } else {
      pool = learnedVerbsMasu
    }
    const distinct = shuffle([...new Set(pool)].filter(r => !correctSet.has(r)))
    return distinct.slice(0, 2)
  }
}

/**
 * Generate sentences that USE the given vocab (typically the words learned in
 * this session). Falls back to the curated templates if not enough dynamic
 * sentences can be built.
 *
 * @param sessionVocabIds  words to build sentences around (prioritized)
 * @param learnedVocabIds  all words the learner knows (for distractors + partners)
 * @param count            how many sentences to return
 * @param userLevel        difficulty gating for the template fallback
 */
export function generateSentencesFromVocab(
  sessionVocabIds: string[],
  learnedVocabIds: string[],
  count: number,
  userLevel = 1
): SentenceChallenge[] {
  const learnedSet = new Set(learnedVocabIds)
  const opts: DynOptions = {
    learnedSet,
    pickDistractorReadings: makeDistractorPicker(learnedVocabIds),
  }

  const out: SentenceChallenge[] = []
  const usedMeanings = new Set<string>()

  // 1) Prefer sentences built around the session's nouns.
  const sessionNouns = shuffle(
    sessionVocabIds.filter(id => vocabById.get(id)?.partOfSpeech === 'Nomen')
  )
  for (const nounId of sessionNouns) {
    if (out.length >= count) break
    const s = buildSentenceForNoun(nounId, opts)
    if (s && !usedMeanings.has(s.meaning)) {
      out.push(s)
      usedMeanings.add(s.meaning)
    }
  }

  // 2) Top up with sentences from any other learned noun.
  if (out.length < count) {
    const otherNouns = shuffle(
      learnedVocabIds.filter(
        id => vocabById.get(id)?.partOfSpeech === 'Nomen' && !sessionVocabIds.includes(id)
      )
    )
    for (const nounId of otherNouns) {
      if (out.length >= count) break
      const s = buildSentenceForNoun(nounId, opts)
      if (s && !usedMeanings.has(s.meaning)) {
        out.push(s)
        usedMeanings.add(s.meaning)
      }
    }
  }

  // 3) Fall back to curated templates for the remaining slots.
  if (out.length < count) {
    const templates = generateDynamicSentences(learnedVocabIds, count - out.length, userLevel)
    for (const t of templates) {
      if (out.length >= count) break
      if (!usedMeanings.has(t.meaning)) {
        out.push(t)
        usedMeanings.add(t.meaning)
      }
    }
  }

  return out.slice(0, count)
}
