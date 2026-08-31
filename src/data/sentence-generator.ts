import { vocabularyData, type VocabCard } from './vocabulary'

export interface SentenceChallenge {
  id: string
  meaning: string
  correctOrder: string[]
  distractors: string[]
  hint?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

/**
 * Verb dictionary-form → masu-form mapping for sentence building.
 * We store the reading (hiragana) since that's what low-level learners see.
 */
const verbToMasu: Record<string, { masu: string; meaningDe: string }> = {
  'たべる': { masu: 'たべます', meaningDe: 'essen' },
  'のむ': { masu: 'のみます', meaningDe: 'trinken' },
  'いく': { masu: 'いきます', meaningDe: 'gehen' },
  'くる': { masu: 'きます', meaningDe: 'kommen' },
  'みる': { masu: 'みます', meaningDe: 'sehen' },
  'きく': { masu: 'ききます', meaningDe: 'hören' },
  'よむ': { masu: 'よみます', meaningDe: 'lesen' },
  'かく': { masu: 'かきます', meaningDe: 'schreiben' },
  'はなす': { masu: 'はなします', meaningDe: 'sprechen' },
  'べんきょうする': { masu: 'べんきょうします', meaningDe: 'lernen' },
  'しごとする': { masu: 'しごとします', meaningDe: 'arbeiten' },
  'ねる': { masu: 'ねます', meaningDe: 'schlafen' },
  'おきる': { masu: 'おきます', meaningDe: 'aufwachen' },
  'かう': { masu: 'かいます', meaningDe: 'kaufen' },
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getByPos(learned: VocabCard[], pos: string): VocabCard[] {
  return learned.filter(v => v.partOfSpeech === pos)
}

function getDistractorBlocks(correct: string[], all: string[], count = 2): string[] {
  const distractors = all.filter(b => !correct.includes(b))
  return shuffle(distractors).slice(0, count)
}

// All possible particle/grammar blocks for distractor pool
const particlePool = ['は', 'を', 'に', 'で', 'が', 'の', 'も', 'と', 'へ', 'から']
const verbMasuPool = Object.values(verbToMasu).map(v => v.masu)

let idCounter = 0

/**
 * Generate dynamic sentences from learned vocabulary.
 * Uses grammar patterns and fills slots with actual learned words.
 */
export function generateDynamicSentences(
  learnedVocabIds: string[],
  count: number
): SentenceChallenge[] {
  const learned = vocabularyData.filter(v => learnedVocabIds.includes(v.id))
  const nouns = getByPos(learned, 'Nomen')
  const verbs = learned.filter(v => v.partOfSpeech === 'Verb' && verbToMasu[v.reading])
  const iAdj = getByPos(learned, 'i-Adjektiv')
  const naAdj = getByPos(learned, 'na-Adjektiv')
  const pronouns = getByPos(learned, 'Pronomen')
  const timeWords = learned.filter(v => v.category === 'Zeit')
  const placeWords = learned.filter(v => v.category === 'Orte')

  const allAdj = [...iAdj, ...naAdj]
  const subject = pronouns.length > 0 ? pronouns : [{ reading: 'わたし', meaning: 'Ich' } as VocabCard]

  const generators: (() => SentenceChallenge | null)[] = []

  // ── Pattern 1: [Subject] は [Noun] です (X is Y)
  if (nouns.length > 0) {
    generators.push(() => {
      const subj = pick(subject)
      const noun = pick(nouns)
      const correct = [subj.reading, 'は', noun.reading, 'です']
      const distractors = getDistractorBlocks(correct, [...particlePool, ...nouns.map(n => n.reading)])
      return {
        id: `gen-${++idCounter}`,
        meaning: `${subj.meaning.split('/')[0].trim()} ist ${noun.meaning.split('/')[0].trim()}.`,
        correctOrder: correct,
        distractors,
        hint: `は = Thema-Partikel, です = sein`,
        difficulty: 'easy',
      }
    })
  }

  // ── Pattern 2: [Subject] は [Object] を [Verb-masu] (S does V with O)
  if (verbs.length > 0 && nouns.length > 0) {
    generators.push(() => {
      const subj = pick(subject)
      const verb = pick(verbs)
      const obj = pick(nouns)
      const masu = verbToMasu[verb.reading]
      if (!masu) return null
      const correct = [subj.reading, 'は', obj.reading, 'を', masu.masu]
      const distractors = getDistractorBlocks(correct, [...particlePool, ...verbMasuPool])
      return {
        id: `gen-${++idCounter}`,
        meaning: `${subj.meaning.split('/')[0].trim()} ${masu.meaningDe}t ${obj.meaning.split('/')[0].trim()}.`,
        correctOrder: correct,
        distractors,
        hint: `を = Objekt-Partikel`,
        difficulty: 'medium',
      }
    })
  }

  // ── Pattern 3: [Subject] は [Place] に [Verb-masu] (S goes to Place)
  if (verbs.length > 0 && placeWords.length > 0) {
    generators.push(() => {
      const subj = pick(subject)
      const place = pick(placeWords)
      const goVerbs = verbs.filter(v => ['いく', 'くる'].includes(v.reading))
      if (goVerbs.length === 0) return null
      const verb = pick(goVerbs)
      const masu = verbToMasu[verb.reading]
      if (!masu) return null
      const correct = [subj.reading, 'は', place.reading, 'に', masu.masu]
      const distractors = getDistractorBlocks(correct, [...particlePool, ...placeWords.map(p => p.reading)])
      return {
        id: `gen-${++idCounter}`,
        meaning: `${subj.meaning.split('/')[0].trim()} ${masu.meaningDe}t zum/zur ${place.meaning.split('/')[0].trim()}.`,
        correctOrder: correct,
        distractors,
        hint: `に = Richtungspartikel`,
        difficulty: 'medium',
      }
    })
  }

  // ── Pattern 4: [Noun] は [Adjektiv] です (X is adjective)
  if (nouns.length > 0 && allAdj.length > 0) {
    generators.push(() => {
      const noun = pick(nouns)
      const adj = pick(allAdj)
      const correct = [noun.reading, 'は', adj.reading, 'です']
      const distractors = getDistractorBlocks(correct, [...particlePool, ...allAdj.map(a => a.reading)])
      return {
        id: `gen-${++idCounter}`,
        meaning: `${noun.meaning.split('/')[0].trim()} ist ${adj.meaning.split('/')[0].trim()}.`,
        correctOrder: correct,
        distractors,
        hint: `は = Thema, です = sein`,
        difficulty: 'easy',
      }
    })
  }

  // ── Pattern 5: [Time] [Subject] は [Object] を [Verb-masu] (Time + S V O)
  if (verbs.length > 0 && nouns.length > 0 && timeWords.length > 0) {
    generators.push(() => {
      const time = pick(timeWords)
      const subj = pick(subject)
      const verb = pick(verbs)
      const obj = pick(nouns)
      const masu = verbToMasu[verb.reading]
      if (!masu) return null
      const correct = [time.reading, subj.reading, 'は', obj.reading, 'を', masu.masu]
      const distractors = getDistractorBlocks(correct, [...particlePool, ...timeWords.map(t => t.reading)])
      return {
        id: `gen-${++idCounter}`,
        meaning: `${time.meaning.split('/')[0].trim()} ${masu.meaningDe}t ${subj.meaning.split('/')[0].trim()} ${obj.meaning.split('/')[0].trim()}.`,
        correctOrder: correct,
        distractors,
        hint: `Zeitwort kommt am Anfang`,
        difficulty: 'hard',
      }
    })
  }

  // ── Pattern 6: [Subject] は [Place] で [Object] を [Verb-masu] (S does V at Place)
  if (verbs.length > 0 && nouns.length > 0 && placeWords.length > 0) {
    generators.push(() => {
      const subj = pick(subject)
      const place = pick(placeWords)
      const verb = pick(verbs)
      const obj = pick(nouns)
      const masu = verbToMasu[verb.reading]
      if (!masu) return null
      const correct = [subj.reading, 'は', place.reading, 'で', obj.reading, 'を', masu.masu]
      const distractors = getDistractorBlocks(correct, [...particlePool, ...placeWords.map(p => p.reading)])
      return {
        id: `gen-${++idCounter}`,
        meaning: `${subj.meaning.split('/')[0].trim()} ${masu.meaningDe}t ${obj.meaning.split('/')[0].trim()} in/bei ${place.meaning.split('/')[0].trim()}.`,
        correctOrder: correct,
        distractors,
        hint: `で = Ortspartikel (wo etwas passiert)`,
        difficulty: 'hard',
      }
    })
  }

  // Generate requested number of sentences
  if (generators.length === 0) return []

  const results: SentenceChallenge[] = []
  let attempts = 0
  const maxAttempts = count * 5

  while (results.length < count && attempts < maxAttempts) {
    attempts++
    const gen = pick(generators)
    const sentence = gen()
    if (sentence) {
      // Avoid exact duplicates
      const key = sentence.correctOrder.join('|')
      if (!results.some(r => r.correctOrder.join('|') === key)) {
        results.push(sentence)
      }
    }
  }

  return shuffle(results)
}
