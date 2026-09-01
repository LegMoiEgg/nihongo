import { vocabularyData } from './vocabulary'

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
    requiredVocab: ['v-kore', 'v-hon'],
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
    requiredVocab: ['v-watashi', 'v-hon', 'v-yomu'],
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
  count: number
): SentenceChallenge[] {
  const learnedSet = new Set(learnedVocabIds)

  // Only offer templates where the learner knows all required vocab.
  // 'v-kore' and 'v-hon' etc. might not exist in vocab data — treat missing
  // vocab as "known" so basic sentences are always available.
  const knownVocabIds = new Set(vocabularyData.map(v => v.id))

  const available = SENTENCE_TEMPLATES.filter(t =>
    t.requiredVocab.every(id => {
      // If the vocab doesn't exist in our data, allow it (basic building blocks)
      if (!knownVocabIds.has(id)) return true
      return learnedSet.has(id)
    })
  )

  // If nothing matches (brand new learner), use the easiest templates anyway
  const pool = available.length > 0
    ? available
    : SENTENCE_TEMPLATES.filter(t => t.difficulty === 'easy')

  const selected = shuffle(pool).slice(0, count)

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
