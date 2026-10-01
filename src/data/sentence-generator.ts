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
const EDIBLE = [
  'v-gohan', 'v-niku', 'v-sakana', 'v-kudamono', 'v-yasai', 'v-tabemono',
  'v-pan', 'v-tamago', 'v-ringo', 'v-mikan', 'v-okashi', 'v-tamanegi', 'v-ryouri',
  'v-sushi', 'v-ramen', 'v-cha-han',
]
const DRINKABLE = ['v-mizu', 'v-ocha', 'v-nomimono', 'v-gyuunyuu', 'v-koohii', 'v-sake', 'v-juusu']
const READABLE = ['v-hon-book', 'v-shinbun', 'v-jisho']
const PLACES = [
  'v-gakkou', 'v-eki', 'v-byouin', 'v-mise', 'v-kaisha', 'v-uchi', 'v-umi',
  'v-yama', 'v-daigaku', 'v-kyoushitsu', 'v-koen', 'v-toshokan', 'v-ginkou',
  'v-yuubinkyoku', 'v-resutoran',
]
// Nouns that can be bought (object of 買う / kaufen).
const BUYABLE = [
  'v-hon-book', 'v-kuruma', 'v-fuku', 'v-boushi', 'v-kutsu', 'v-pen',
  'v-tabemono', 'v-nomimono', 'v-kudamono', 'v-yasai', 'v-niku', 'v-sakana',
  'v-pan', 'v-tamago', 'v-ringo', 'v-okashi', 'v-jitensha', 'v-shinbun',
  'v-jisho', 'v-tokei', 'v-shatsu', 'v-kutsushita', 'v-koohii',
]
// Concrete nouns that can be the object of 見る / sehen.
const WATCHABLE = [
  'v-terebi', 'v-sora', 'v-yama', 'v-umi', 'v-hana-flower', 'v-tori', 'v-inu',
  'v-neko', 'v-shinbun', 'v-densha', 'v-hikouki', 'v-uma',
]
// Living things → [Noun] が います ("Es gibt einen …").
const LIVING = [
  'v-inu', 'v-neko', 'v-tori', 'v-uma', 'v-ushi', 'v-buta', 'v-sakana-animal',
  'v-okaasan', 'v-otousan', 'v-oniisan', 'v-oneesan', 'v-sensei', 'v-gakusei',
  'v-tomodachi', 'v-kodomo', 'v-otouto', 'v-imouto', 'v-sofu', 'v-sobo',
  'v-kazoku', 'v-kare', 'v-kanojo',
]
// Non-living things → [Noun] が あります ("Es gibt ein …").
const INANIMATE_EXISTS = [
  'v-hon-book', 'v-kuruma', 'v-tsukue', 'v-isu', 'v-pen', 'v-kagi', 'v-tokei',
  'v-denwa', 'v-terebi', 'v-mado', 'v-kami', 'v-tabemono', 'v-nomimono',
  'v-yama', 'v-kawa', 'v-umi', 'v-ki', 'v-jitensha', 'v-shinbun', 'v-jisho',
  'v-shukudai', 'v-tesuto', 'v-beddo', 'v-doa', 'v-heya',
]
// Nouns that pair naturally with a possessor via の (mein/dein …).
const POSSESSABLE = [
  'v-hon-book', 'v-kuruma', 'v-fuku', 'v-boushi', 'v-kutsu', 'v-pen', 'v-kagi',
  'v-tokei', 'v-inu', 'v-neko', 'v-heya', 'v-namae', 'v-tomodachi',
  // Family / people — "Das ist meine Mutter" etc.
  'v-okaasan', 'v-otousan', 'v-oniisan', 'v-oneesan', 'v-otouto', 'v-imouto',
  'v-sofu', 'v-sobo', 'v-kodomo', 'v-kazoku', 'v-sensei',
  // Body — "Das sind meine Augen" etc.
  'v-atama', 'v-me', 'v-mimi', 'v-kuchi', 'v-te', 'v-ashi',
  // Things
  'v-jitensha', 'v-shatsu', 'v-jisho',
]
// Nouns that can sensibly take a plain "[Noun] は [i-Adjective] です".
const DESCRIBABLE = [
  // food & drink
  'v-gohan', 'v-niku', 'v-sakana', 'v-kudamono', 'v-yasai', 'v-tabemono',
  'v-mizu', 'v-ocha', 'v-pan', 'v-ringo', 'v-koohii', 'v-ryouri', 'v-okashi',
  // things / places
  'v-hon-book', 'v-kuruma', 'v-gakkou', 'v-eki', 'v-heya', 'v-tsukue', 'v-isu',
  'v-kutsu', 'v-fuku', 'v-tokei', 'v-jitensha', 'v-densha', 'v-mise',
  'v-daigaku', 'v-kyoushitsu',
  // nature / animals
  'v-yama', 'v-umi', 'v-sora', 'v-kawa', 'v-hana-flower', 'v-ki',
  'v-inu', 'v-neko', 'v-tori', 'v-uma', 'v-ushi',
  // people
  'v-okaasan', 'v-otousan', 'v-sensei', 'v-tomodachi', 'v-kodomo',
  // body
  'v-atama', 'v-me', 'v-te', 'v-ashi',
  // school / abstract
  'v-shukudai', 'v-tesuto', 'v-nihongo', 'v-shigoto',
]
const I_ADJECTIVES = [
  'v-ookii', 'v-chiisai', 'v-oishii', 'v-takai', 'v-yasui', 'v-atarashii',
  'v-furui', 'v-ii', 'v-warui', 'v-atsui', 'v-samui', 'v-tanoshii',
  'v-muzukashii', 'v-yasashii', 'v-hayai', 'v-osoi',
  'v-nagai', 'v-mijikai', 'v-hiroi', 'v-semai', 'v-omoi', 'v-karui',
  'v-akarui', 'v-kurai', 'v-isogashii', 'v-omoshiroi',
  'v-tooi', 'v-chikai', 'v-tsuyoi', 'v-yowai', 'v-wakai', 'v-amai', 'v-karai',
]

const SUBJECT_PRONOUNS = ['v-watashi', 'v-kare', 'v-kanojo']

// Weekdays → take the に particle: "[Weekday] に [Verb]" (am … tue ich …).
const WEEKDAYS: Record<string, string> = {
  'v-getsuyoubi': 'montags',
  'v-kayoubi': 'dienstags',
  'v-suiyoubi': 'mittwochs',
  'v-mokuyoubi': 'donnerstags',
  'v-kinyoubi': 'freitags',
  'v-doyoubi': 'samstags',
  'v-nichiyoubi': 'sonntags',
}
// Time words that work WITHOUT a particle as a sentence-initial adverb:
// "[Time] [Pronoun] は [Verb]" (heute/morgens/jeden Tag … tue ich …).
const TIME_ADVERBS: Record<string, string> = {
  'v-kyou': 'heute',
  'v-ashita': 'morgen',
  'v-kinou': 'gestern',
  'v-asa': 'morgens',
  'v-hiru': 'mittags',
  'v-yoru': 'abends',
  'v-mainichi': 'jeden Tag',
  'v-maiasa': 'jeden Morgen',
  'v-maiban': 'jeden Abend',
  'v-shuumatsu': 'am Wochenende',
}
// Verbs usable in a plain time sentence (intransitive / activity verbs).
const TIME_VERBS = [
  'v-benkyousuru', 'v-hataraku', 'v-asobu', 'v-neru', 'v-okiru',
  'v-oyogu', 'v-hashiru', 'v-utau', 'v-yomu', 'v-kuru',
]

// Intransitive verbs: build "[Pron] は [Verb-masu]" (no object needed).
// This unlocks verbs like 寝る/分かる/知る that have no object pattern, so a
// freshly-learned verb actually appears in a sentence instead of being unused.
const INTRANSITIVE_VERBS = [
  'v-neru', 'v-okiru', 'v-wakaru', 'v-shiru', 'v-omou', 'v-iku', 'v-kuru',
  'v-hairu', 'v-deru', 'v-matsu', 'v-asobu', 'v-hataraku', 'v-oyogu',
  'v-tatsu', 'v-suwaru', 'v-aruku', 'v-hashiru', 'v-utau', 'v-benkyousuru',
]

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
  // transitive
  'v-taberu': { ich: 'esse', er: 'isst' },
  'v-nomu': { ich: 'trinke', er: 'trinkt' },
  'v-yomu': { ich: 'lese', er: 'liest' },
  'v-kau': { ich: 'kaufe', er: 'kauft' },
  'v-miru': { ich: 'sehe', er: 'sieht' },
  // movement
  'v-iku': { ich: 'gehe', er: 'geht' },
  'v-kuru': { ich: 'komme', er: 'kommt' },
  // intransitive
  'v-neru': { ich: 'schlafe', er: 'schläft' },
  'v-okiru': { ich: 'wache auf', er: 'wacht auf' },
  'v-wakaru': { ich: 'verstehe', er: 'versteht' },
  'v-shiru': { ich: 'weiß es', er: 'weiß es' },
  'v-omou': { ich: 'denke', er: 'denkt' },
  'v-hairu': { ich: 'gehe hinein', er: 'geht hinein' },
  'v-deru': { ich: 'gehe hinaus', er: 'geht hinaus' },
  'v-matsu': { ich: 'warte', er: 'wartet' },
  'v-asobu': { ich: 'spiele', er: 'spielt' },
  'v-hataraku': { ich: 'arbeite', er: 'arbeitet' },
  'v-oyogu': { ich: 'schwimme', er: 'schwimmt' },
  'v-tatsu': { ich: 'stehe', er: 'steht' },
  'v-suwaru': { ich: 'sitze', er: 'sitzt' },
  'v-aruku': { ich: 'laufe', er: 'läuft' },
  'v-hashiru': { ich: 'renne', er: 'rennt' },
  'v-utau': { ich: 'singe', er: 'singt' },
  'v-benkyousuru': { ich: 'lerne', er: 'lernt' },
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
  const all = buildAllSentencesForNoun(nounId, opts)
  return all.length ? shuffle(all)[0] : null
}

/** Clean a German noun gloss: take the first variant, drop parentheticals. */
function cleanDe(s: string): string {
  return s.split(' /')[0].split(' (')[0].trim()
}

/**
 * Build EVERY grammatically sensible sentence we can make around `nounId`
 * from the learner's known words. Returning several (not just one) gives the
 * daily lesson real variety and keeps sentences tied to the session's words.
 */
function buildAllSentencesForNoun(nounId: string, opts: DynOptions): SentenceChallenge[] {
  const { learnedSet } = opts
  const nounR = reading(nounId)
  const nounDe = meaningDe(nounId)
  if (!nounR || !nounDe) return []

  const has = (id: string) => learnedSet.has(id)
  const pron = SUBJECT_PRONOUNS.filter(has)
  const pickPronoun = () => (pron.length ? pron[Math.floor(Math.random() * pron.length)] : 'v-watashi')
  const out: SentenceChallenge[] = []

  // Pattern A: [Pronoun] は [Noun] を [Verb-masu]  (object + verb)
  const tryTransitive = (verbId: string) => {
    if (!has(verbId)) return
    const vr = reading(verbId)
    const masu = vr ? toMasu(verbId, vr) : null
    if (!masu) return
    const pId = pickPronoun()
    const pr = reading(pId) || 'わたし'
    const vde = VERB_DE[verbId]
    const pde = PRONOUN_DE[pId] || 'Ich'
    const verbDe = vde ? (pId === 'v-watashi' ? vde.ich : vde.er) : ''
    out.push({
      id: `dyn-${++idCounter}`,
      meaning: `${pde} ${verbDe} ${cleanDe(nounDe)}.`,
      correctOrder: [pr, 'は', nounR, 'を', masu],
      distractors: opts.pickDistractorReadings([pr, 'は', nounR, 'を', masu], 'noun'),
      hint: 'は = Thema, を = Objekt',
      difficulty: 'medium',
    })
  }
  if (EDIBLE.includes(nounId)) tryTransitive('v-taberu')
  if (DRINKABLE.includes(nounId)) tryTransitive('v-nomu')
  if (READABLE.includes(nounId)) tryTransitive('v-yomu')
  if (BUYABLE.includes(nounId)) tryTransitive('v-kau')
  if (WATCHABLE.includes(nounId)) tryTransitive('v-miru')

  // Pattern B: [Pronoun] は [Place] に いきます  (go to a place)
  if (PLACES.includes(nounId) && has('v-iku')) {
    const masu = toMasu('v-iku', reading('v-iku')!)
    if (masu) {
      const pId = pickPronoun()
      const pr = reading(pId) || 'わたし'
      const pde = PRONOUN_DE[pId] || 'Ich'
      const article = nounDe === 'Schule' ? 'zur' : 'zum'
      out.push({
        id: `dyn-${++idCounter}`,
        meaning: `${pde} ${pId === 'v-watashi' ? 'gehe' : 'geht'} ${article} ${cleanDe(nounDe)}.`,
        correctOrder: [pr, 'は', nounR, 'に', masu],
        distractors: opts.pickDistractorReadings([pr, 'は', nounR, 'に', masu], 'noun'),
        hint: 'に = Zielpartikel, いきます = gehen',
        difficulty: 'medium',
      })
    }
  }

  // Pattern C: [Noun] は [i-Adjective] です  (description)
  if (DESCRIBABLE.includes(nounId)) {
    const adjs = I_ADJECTIVES.filter(has)
    if (adjs.length > 0) {
      const adjId = shuffle(adjs)[0]
      const ar = reading(adjId)
      const ade = meaningDe(adjId)
      if (ar && ade) {
        out.push({
          id: `dyn-${++idCounter}`,
          meaning: `${cleanDe(nounDe)} ist ${cleanDe(ade)}.`,
          correctOrder: [nounR, 'は', ar, 'です'],
          distractors: opts.pickDistractorReadings([nounR, 'は', ar, 'です'], 'adj'),
          hint: 'は = Thema, です = sein',
          difficulty: 'easy',
        })
      }
    }
  }

  // Pattern D: Existence. Living → います, inanimate → あります.
  const existVerb = LIVING.includes(nounId) ? 'います'
    : INANIMATE_EXISTS.includes(nounId) ? 'あります' : null
  if (existVerb) {
    out.push({
      id: `dyn-${++idCounter}`,
      meaning: `Es gibt ${cleanDe(nounDe)}.`,
      correctOrder: [nounR, 'が', existVerb],
      distractors: opts.pickDistractorReadings([nounR, 'が', existVerb], 'noun'),
      hint: 'が = Subjekt-Partikel',
      difficulty: 'easy',
    })
  }

  // Pattern E: Possession. [Pronoun] の [Noun] です  (mein/dein …).
  if (POSSESSABLE.includes(nounId) && pron.length > 0) {
    const pId = pickPronoun()
    const pr = reading(pId) || 'わたし'
    const posDe = pId === 'v-watashi' ? 'mein' : pId === 'v-kare' ? 'sein' : 'ihr'
    out.push({
      id: `dyn-${++idCounter}`,
      meaning: `Das ist ${posDe} ${cleanDe(nounDe)}.`,
      correctOrder: [pr, 'の', nounR, 'です'],
      distractors: opts.pickDistractorReadings([pr, 'の', nounR, 'です'], 'noun'),
      hint: 'の = Besitz-Partikel',
      difficulty: 'easy',
    })
  }

  return out
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
 * Build "[Pronoun] は [Verb-masu]" for an intransitive verb (no object).
 * Lets a freshly-learned verb (schlafen, verstehen, wissen …) appear in a
 * sentence even if it has no object pattern. Returns null if not buildable.
 */
function buildSentenceForVerb(verbId: string, opts: DynOptions): SentenceChallenge | null {
  if (!INTRANSITIVE_VERBS.includes(verbId)) return null
  const vr = reading(verbId)
  const masu = vr ? toMasu(verbId, vr) : null
  const vde = VERB_DE[verbId]
  if (!masu || !vde) return null

  const pron = SUBJECT_PRONOUNS.filter(id => opts.learnedSet.has(id))
  const pId = pron.length ? pron[Math.floor(Math.random() * pron.length)] : 'v-watashi'
  const pr = reading(pId) || 'わたし'
  const pde = PRONOUN_DE[pId] || 'Ich'
  const verbDe = pId === 'v-watashi' ? vde.ich : vde.er
  return {
    id: `dyn-${++idCounter}`,
    meaning: `${pde} ${verbDe}.`,
    correctOrder: [pr, 'は', masu],
    distractors: opts.pickDistractorReadings([pr, 'は', masu], 'verb'),
    hint: 'は = Thema-Partikel',
    difficulty: 'easy',
  }
}

/**
 * Build time-based sentences for a weekday or time word — exactly the kind of
 * sentence that makes sense when the lesson is about days/time, and great для
 * practising に and は.
 *   Weekday:    [Weekday] に [Verb-masu]      "Montags lerne ich."
 *   Time adverb:[Time] [Pron] は [Verb-masu]  "Heute lerne ich."
 */
function buildSentencesForTime(timeId: string, opts: DynOptions): SentenceChallenge[] {
  const timeR = reading(timeId)
  if (!timeR) return []
  const out: SentenceChallenge[] = []

  // Pick a learned, usable verb.
  const verbs = TIME_VERBS.filter(id => opts.learnedSet.has(id))
  const verbId = verbs.length ? shuffle(verbs)[0] : 'v-benkyousuru'
  const masu = toMasu(verbId, reading(verbId) || '')
  const vde = VERB_DE[verbId]
  if (!masu || !vde) return out

  const pron = SUBJECT_PRONOUNS.filter(id => opts.learnedSet.has(id))
  const pId = pron.length ? shuffle(pron)[0] : 'v-watashi'
  const pr = reading(pId) || 'わたし'
  const pde = PRONOUN_DE[pId] || 'Ich'
  const verbDe = pId === 'v-watashi' ? vde.ich : vde.er

  if (WEEKDAYS[timeId]) {
    // [Weekday] に [Pron] は [Verb]  — に marks the time point.
    // German: "Montags lerne ich." / "Montags lernt er." (adverb-first inversion)
    const subj = pId === 'v-watashi' ? 'ich' : pId === 'v-kare' ? 'er' : 'sie'
    out.push({
      id: `dyn-${++idCounter}`,
      meaning: `${WEEKDAYS[timeId].charAt(0).toUpperCase()}${WEEKDAYS[timeId].slice(1)} ${verbDe} ${subj}.`,
      correctOrder: [timeR, 'に', pr, 'は', masu],
      distractors: opts.pickDistractorReadings([timeR, 'に', pr, 'は', masu], 'verb'),
      hint: 'に = Zeitpunkt-Partikel, は = Thema',
      difficulty: 'medium',
    })
  } else if (TIME_ADVERBS[timeId]) {
    // [Time] [Pron] は [Verb]  — time adverb needs no particle.
    out.push({
      id: `dyn-${++idCounter}`,
      meaning: `${pde} ${verbDe} ${TIME_ADVERBS[timeId]}.`,
      correctOrder: [timeR, pr, 'は', masu],
      distractors: opts.pickDistractorReadings([timeR, pr, 'は', masu], 'verb'),
      hint: 'Zeitangabe am Satzanfang, は = Thema',
      difficulty: 'medium',
    })
  }
  return out
}

// Places that take で (location of an action) for the complex pattern.
const ACTION_PLACES = ['v-gakkou', 'v-uchi', 'v-mise', 'v-kaisha', 'v-kyoushitsu', 'v-heya']
// Time words (both weekday-に and adverb-type) usable at the start.
const COMPLEX_TIME = [
  'v-asa', 'v-hiru', 'v-yoru', 'v-kyou', 'v-mainichi', 'v-maiasa', 'v-maiban',
]

/**
 * Build a COMPLEX sentence for advanced learners, combining time + subject +
 * place + object + verb:
 *   [Time] [Pron] は [Place] で [Object] を [Verb-masu]
 *   "Morgens esse ich zuhause Fisch." → あさ わたし は うち で さかな を たべます
 * Returns null if the learner doesn't know enough of the needed pieces.
 */
function buildComplexSentence(opts: DynOptions): SentenceChallenge | null {
  const has = (id: string) => opts.learnedSet.has(id)

  // Pick an object + its verb (eat/drink/read) that the learner knows.
  const objVerb: Array<[string[], string, string]> = [
    [EDIBLE, 'v-taberu', 'esse'],
    [DRINKABLE, 'v-nomu', 'trinke'],
    [READABLE, 'v-yomu', 'lese'],
  ]
  const usableObjVerb = objVerb.filter(([objs, verb]) => has(verb) && objs.some(has))
  if (usableObjVerb.length === 0) return null
  const [objs, verbId] = shuffle(usableObjVerb)[0]
  const objId = shuffle(objs.filter(has))[0]
  const masu = toMasu(verbId, reading(verbId) || '')
  const objR = reading(objId)
  const objDe = meaningDe(objId)
  if (!masu || !objR || !objDe) return null

  // Place (で) — optional but preferred.
  const places = ACTION_PLACES.filter(has)
  const placeId = places.length ? shuffle(places)[0] : null
  const placeR = placeId ? reading(placeId) : null
  const placeDe = placeId ? meaningDe(placeId) : null

  // Time — optional but preferred.
  const times = COMPLEX_TIME.filter(has)
  const timeId = times.length ? shuffle(times)[0] : null
  const timeR = timeId ? reading(timeId) : null
  const timeDeMap: Record<string, string> = {
    'v-asa': 'morgens', 'v-hiru': 'mittags', 'v-yoru': 'abends', 'v-kyou': 'heute',
    'v-mainichi': 'jeden Tag', 'v-maiasa': 'jeden Morgen', 'v-maiban': 'jeden Abend',
  }

  // Need at least a place OR a time to make it "complex"; otherwise skip.
  if (!placeId && !timeId) return null

  const pron = SUBJECT_PRONOUNS.filter(has)
  const pId = pron.length ? shuffle(pron)[0] : 'v-watashi'
  const pr = reading(pId) || 'わたし'
  const verbDeIch = VERB_DE[verbId]?.ich ?? ''

  // Assemble JP block order: [Time] [Pron] は [Place] で [Obj] を [Verb]
  const order: string[] = []
  if (timeR) order.push(timeR)
  order.push(pr, 'は')
  if (placeR) order.push(placeR, 'で')
  order.push(objR, 'を', masu)

  // German place phrasing with a sensible preposition per place word.
  const placePhrase: Record<string, string> = {
    'v-gakkou': 'in der Schule', 'v-uchi': 'zu Hause', 'v-mise': 'im Geschäft',
    'v-kaisha': 'in der Firma', 'v-kyoushitsu': 'im Klassenzimmer', 'v-heya': 'im Zimmer',
  }
  // German: "[Zeit] [verb] ich [Ort] [Objekt]."
  const parts: string[] = []
  if (timeId) parts.push(timeDeMap[timeId] ?? '')
  parts.push(verbDeIch, 'ich')
  if (placeId && placePhrase[placeId]) parts.push(placePhrase[placeId])
  parts.push(objDe.split(' /')[0])
  const meaning = parts.filter(Boolean).join(' ').replace(/^\w/, c => c.toUpperCase()) + '.'

  return {
    id: `dyn-${++idCounter}`,
    meaning,
    correctOrder: order,
    distractors: opts.pickDistractorReadings(order, 'noun'),
    hint: 'に/は/で/を — Zeit, Thema, Ort, Objekt',
    difficulty: 'hard',
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

  // Interleave noun-based and verb-based builders for the session's words so a
  // freshly-learned VERB (schlafen, wissen …) also shows up — not just nouns.
  const sessionNouns = shuffle(
    sessionVocabIds.filter(id => vocabById.get(id)?.partOfSpeech === 'Nomen')
  )
  const sessionVerbs = shuffle(
    sessionVocabIds.filter(id => vocabById.get(id)?.partOfSpeech === 'Verb')
  )

  const tryAdd = (s: SentenceChallenge | null | undefined) => {
    if (!s) return
    const key = s.correctOrder.join('|')
    if (usedMeanings.has(key)) return
    usedMeanings.add(key)
    out.push(s)
  }

  // ── Difficulty scales with level ──
  // How many of the `count` sentences should be COMPLEX (time+place+object+
  // verb). Grows with level so the lesson gets genuinely harder over time:
  //   <12 → 0, 12-19 → 1, 20-29 → 2, 30-39 → most, 40+ → (almost) all.
  let complexWanted = 0
  if (userLevel >= 40) complexWanted = count
  else if (userLevel >= 30) complexWanted = Math.max(1, count - 1)
  else if (userLevel >= 20) complexWanted = 2
  else if (userLevel >= 12) complexWanted = 1

  for (let i = 0; i < complexWanted; i++) {
    if (out.length >= count) break
    tryAdd(buildComplexSentence(opts))
  }

  // Build a big pool of candidate sentences that each USE a session word, so
  // the lesson's sentences are tied to the words being practised right now.
  const sessionCandidates: SentenceChallenge[] = []
  for (const verbId of sessionVerbs) {
    const s = buildSentenceForVerb(verbId, opts)
    if (s) sessionCandidates.push(s)
  }
  for (const nounId of sessionNouns) {
    // Time/weekday nouns get dedicated time sentences (… に … / adverb-first).
    if (WEEKDAYS[nounId] || TIME_ADVERBS[nounId]) {
      sessionCandidates.push(...buildSentencesForTime(nounId, opts))
    }
    sessionCandidates.push(...buildAllSentencesForNoun(nounId, opts))
  }
  // At higher levels, drop the simplest "X ist Y" / existence sentences so the
  // remaining pool is tougher. Below 20 everything stays available.
  let pool = sessionCandidates
  if (userLevel >= 30) {
    const harder = pool.filter(s => s.difficulty !== 'easy')
    if (harder.length > 0) pool = harder
  } else if (userLevel >= 20) {
    // Keep easy ones only as a minority: push them to the back.
    pool = [...pool.filter(s => s.difficulty !== 'easy'), ...pool.filter(s => s.difficulty === 'easy')]
  }
  // Shuffle (within the difficulty-ordered pool) and fill.
  const easyBack = userLevel >= 20 && userLevel < 30
  const ordered = easyBack ? pool : shuffle(pool)
  for (const s of ordered) {
    if (out.length >= count) break
    tryAdd(s)
  }

  // NOTE: We deliberately do NOT fill with sentences from unrelated other
  // learned words. That was the cause of off-topic sentences (e.g. "inu ga
  // imasu" while learning weekdays). Sentences must stay tied to the lesson —
  // fewer, relevant sentences beat many irrelevant ones.

  // 3) Curated templates — but ONLY ones whose CONTENT word is a session word.
  //    Pronouns (わたし/かれ/…) appear in almost every template, so matching on
  //    them would let unrelated sentences through ("Ich lerne Japanisch" during
  //    a Family lesson). We therefore ignore pronouns when deciding relevance.
  if (out.length < count) {
    const sessionSet = new Set(sessionVocabIds)
    const isPronoun = (id: string) => vocabById.get(id)?.partOfSpeech === 'Pronomen'
    const sessionTemplates = SENTENCE_TEMPLATES.filter(t =>
      t.requiredVocab.some(id => sessionSet.has(id) && !isPronoun(id))
    )
    for (const t of shuffle(sessionTemplates)) {
      if (out.length >= count) break
      // Only if the learner knows all required (existing) vocab.
      const ok = t.requiredVocab.every(id => !vocabById.has(id) || learnedSet.has(id))
      if (!ok) continue
      tryAdd({
        id: `tpl-${++idCounter}`,
        meaning: t.meaning,
        correctOrder: t.blocks,
        distractors: shuffle(t.extraDistractors || []).slice(0, 2),
        hint: t.hint,
        difficulty: t.difficulty,
      })
    }
  }

  // 4) Last resort: generic templates ONLY for brand-new learners (very few
  //    known words), where we can't yet build lesson-specific sentences. For
  //    everyone else we return fewer sentences rather than off-topic ones.
  if (out.length === 0 && learnedVocabIds.length < 15) {
    for (const t of generateDynamicSentences(learnedVocabIds, count, userLevel)) {
      if (out.length >= count) break
      tryAdd(t)
    }
  }

  return out.slice(0, count)
}

// ────────────────────────────────────────────────────────────────────────
//  PARTICLE FILL-IN-THE-BLANK FROM LESSON SENTENCES
//  Turns a generated lesson sentence into a "which particle fits the gap?"
//  exercise, so particle practice uses the SAME words as the current lesson
//  instead of unrelated fixed examples like "Ich schreibe mit einem Stift".
// ────────────────────────────────────────────────────────────────────────

/** Particles that appear as standalone blocks in generated sentences. */
const PARTICLE_BLOCKS = ['は', 'を', 'に', 'で', 'の', 'が', 'へ']

export interface GeneratedParticleQuiz {
  sentence: string   // reading with the blank marked ＿
  reading: string    // full reading
  meaning: string    // German translation
  answer: string     // the correct particle
  why: string
}

const PARTICLE_WHY: Record<string, string> = {
  'は': 'は markiert das Thema des Satzes.',
  'を': 'を markiert das direkte Objekt.',
  'に': 'に markiert Ziel, Zeitpunkt oder Ort des Seins.',
  'で': 'で markiert den Ort einer Handlung oder das Mittel.',
  'の': 'の verbindet zwei Nomen (Besitz/Zugehörigkeit).',
  'が': 'が markiert das Subjekt.',
  'へ': 'へ zeigt die Richtung einer Bewegung.',
}

/**
 * Build a particle fill-in-the-blank from a generated sentence. Picks one of
 * the sentence's particle blocks at random and blanks it out. Returns null if
 * the sentence contains no particle block.
 */
export function buildParticleQuizFromSentence(s: SentenceChallenge): GeneratedParticleQuiz | null {
  const particleIndices = s.correctOrder
    .map((b, i) => (PARTICLE_BLOCKS.includes(b) ? i : -1))
    .filter(i => i >= 0)
  if (particleIndices.length === 0) return null

  const idx = particleIndices[Math.floor(Math.random() * particleIndices.length)]
  const answer = s.correctOrder[idx]
  const blanked = s.correctOrder.map((b, i) => (i === idx ? '＿' : b)).join(' ')
  const full = s.correctOrder.join(' ')
  return {
    sentence: blanked,
    reading: full,
    meaning: s.meaning,
    answer,
    why: PARTICLE_WHY[answer] ?? '',
  }
}
