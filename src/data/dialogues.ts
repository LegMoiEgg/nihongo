/**
 * Dialogue exercises: a question is shown (in German, with the Japanese
 * question for context) and the learner picks the sentence that correctly
 * ANSWERS it from several options. This trains comprehension + natural
 * responses, and adds variety beyond vocab/sentence-building.
 *
 * Each dialogue is tagged with a vocabulary `category` so the daily lesson
 * can show dialogues that match the current theme (red thread).
 */

export interface DialogueExercise {
  id: string
  category: string          // matches VocabCard.category → ties it to a lesson theme
  questionDe: string        // the question shown to the learner (German)
  questionJp: string        // the Japanese question (shown for context)
  correct: string           // the correct answer sentence (Japanese reading)
  correctDe: string         // German translation of the correct answer
  wrong: string[]           // 2-3 wrong answer sentences (Japanese reading)
}

export const dialogueData: DialogueExercise[] = [
  // ── Begrüßung ──
  {
    id: 'd-greet-1',
    category: 'Begrüßung',
    questionDe: 'Jemand sagt "ありがとう" (Danke). Was antwortest du?',
    questionJp: 'ありがとう。',
    correct: 'どういたしまして。',
    correctDe: 'Gern geschehen.',
    wrong: ['さようなら。', 'おはようございます。', 'はじめまして。'],
  },
  {
    id: 'd-greet-2',
    category: 'Begrüßung',
    questionDe: 'Du triffst jemanden morgens. Was sagst du?',
    questionJp: '(あさ)',
    correct: 'おはようございます。',
    correctDe: 'Guten Morgen.',
    wrong: ['こんばんは。', 'さようなら。', 'おやすみなさい。'],
  },

  // ── Familie ──
  {
    id: 'd-fam-1',
    category: 'Familie',
    questionDe: 'Wer ist das? (zeigt auf eine ältere Frau in deiner Familie)',
    questionJp: 'だれですか。',
    correct: 'わたしの おかあさんです。',
    correctDe: 'Das ist meine Mutter.',
    wrong: ['わたしの くるまです。', 'わたしの がっこうです。', 'わたしの ほんです。'],
  },
  {
    id: 'd-fam-2',
    category: 'Familie',
    questionDe: 'Hast du Geschwister?',
    questionJp: 'きょうだいが いますか。',
    correct: 'おとうとが います。',
    correctDe: 'Ich habe einen jüngeren Bruder.',
    wrong: ['みずを のみます。', 'がっこうに いきます。', 'ほんを よみます。'],
  },

  // ── Essen ──
  {
    id: 'd-food-1',
    category: 'Essen',
    questionDe: 'Was möchtest du trinken?',
    questionJp: 'なにを のみますか。',
    correct: 'おちゃを のみます。',
    correctDe: 'Ich trinke Tee.',
    wrong: ['ほんを よみます。', 'がっこうに いきます。', 'ねこが います。'],
  },
  {
    id: 'd-food-2',
    category: 'Essen',
    questionDe: 'Was isst du?',
    questionJp: 'なにを たべますか。',
    correct: 'さかなを たべます。',
    correctDe: 'Ich esse Fisch.',
    wrong: ['みずを のみます。', 'テレビを みます。', 'うたを うたいます。'],
  },

  // ── Orte ──
  {
    id: 'd-place-1',
    category: 'Orte',
    questionDe: 'Wohin gehst du?',
    questionJp: 'どこに いきますか。',
    correct: 'がっこうに いきます。',
    correctDe: 'Ich gehe zur Schule.',
    wrong: ['ごはんを たべます。', 'みずを のみます。', 'ほんを よみます。'],
  },

  // ── Zeit / Wochentage ──
  {
    id: 'd-time-1',
    category: 'Wochentage',
    questionDe: 'Wann lernst du Japanisch?',
    questionJp: 'いつ べんきょうしますか。',
    correct: 'にちようびに べんきょうします。',
    correctDe: 'Sonntags lerne ich.',
    wrong: ['がっこうに いきます。', 'みずを のみます。', 'ねこが います。'],
  },
  {
    id: 'd-time-2',
    category: 'Zeit',
    questionDe: 'Wann stehst du auf?',
    questionJp: 'いつ おきますか。',
    correct: 'あさ おきます。',
    correctDe: 'Ich wache morgens auf.',
    wrong: ['よる たべます。', 'ほんを かいます。', 'うみに いきます。'],
  },

  // ── Verben ──
  {
    id: 'd-verb-1',
    category: 'Verben',
    questionDe: 'Was machst du gerade?',
    questionJp: 'なにを しますか。',
    correct: 'ほんを よみます。',
    correctDe: 'Ich lese ein Buch.',
    wrong: ['いぬが います。', 'あかいです。', 'がっこうです。'],
  },

  // ── Tiere ──
  {
    id: 'd-animal-1',
    category: 'Tiere',
    questionDe: 'Was ist das für ein Tier? (klein, miaut)',
    questionJp: 'なにが いますか。',
    correct: 'ねこが います。',
    correctDe: 'Es ist eine Katze.',
    wrong: ['くるまが あります。', 'みずを のみます。', 'がっこうに いきます。'],
  },

  // ── Transport ──
  {
    id: 'd-trans-1',
    category: 'Transport',
    questionDe: 'Womit fährst du zur Schule?',
    questionJp: 'なにで がっこうに いきますか。',
    correct: 'でんしゃで いきます。',
    correctDe: 'Ich fahre mit dem Zug.',
    wrong: ['ほんを よみます。', 'さかなを たべます。', 'ねこが います。'],
  },
]

/** Dialogues whose category is in the given set (the current lesson theme). */
export function getDialoguesForCategories(categories: string[]): DialogueExercise[] {
  const set = new Set(categories)
  return dialogueData.filter(d => set.has(d.category))
}
