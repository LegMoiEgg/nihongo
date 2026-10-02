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

  // ───────────────────────── Erweiterung: mehr Dialoge ──
  // ── Begrüßung ──
  {
    id: 'd-greet-3',
    category: 'Begrüßung',
    questionDe: 'Du gehst abends ins Bett. Was sagst du?',
    questionJp: '(よる、ねる まえ)',
    correct: 'おやすみなさい。',
    correctDe: 'Gute Nacht.',
    wrong: ['おはようございます。', 'こんにちは。', 'いただきます。'],
  },
  {
    id: 'd-greet-4',
    category: 'Begrüßung',
    questionDe: 'Jemand stellt sich zum ersten Mal vor. Was antwortest du?',
    questionJp: 'はじめまして。',
    correct: 'はじめまして、どうぞ よろしく。',
    correctDe: 'Freut mich, angenehm.',
    wrong: ['さようなら。', 'おやすみなさい。', 'ごちそうさま。'],
  },

  // ── Familie ──
  {
    id: 'd-fam-3',
    category: 'Familie',
    questionDe: 'Wie viele Personen sind in deiner Familie?',
    questionJp: 'なんにん かぞくですか。',
    correct: 'よにんです。',
    correctDe: 'Wir sind vier.',
    wrong: ['みずです。', 'がっこうです。', 'あかいです。'],
  },

  // ── Essen ──
  {
    id: 'd-food-3',
    category: 'Essen',
    questionDe: 'Vor dem Essen – was sagt man?',
    questionJp: '(たべる まえ)',
    correct: 'いただきます。',
    correctDe: 'Guten Appetit (wörtl. "ich nehme dankend an").',
    wrong: ['ごちそうさま。', 'おやすみなさい。', 'はじめまして。'],
  },
  {
    id: 'd-food-4',
    category: 'Essen',
    questionDe: 'Wie schmeckt das Essen?',
    questionJp: 'ごはんは どうですか。',
    correct: 'とても おいしいです。',
    correctDe: 'Es ist sehr lecker.',
    wrong: ['がっこうに いきます。', 'でんしゃで いきます。', 'ほんを かいます。'],
  },

  // ── Orte ──
  {
    id: 'd-place-2',
    category: 'Orte',
    questionDe: 'Wo bist du gerade?',
    questionJp: 'いま どこですか。',
    correct: 'としょかんに います。',
    correctDe: 'Ich bin in der Bibliothek.',
    wrong: ['ごはんを たべます。', 'あついです。', 'いぬが います。'],
  },
  {
    id: 'd-place-3',
    category: 'Orte',
    questionDe: 'Wo kaufst du Essen?',
    questionJp: 'どこで かいものを しますか。',
    correct: 'スーパーで かいます。',
    correctDe: 'Ich kaufe im Supermarkt.',
    wrong: ['がっこうで ねます。', 'ほんを のみます。', 'でんわを たべます。'],
  },

  // ── Zeit ──
  {
    id: 'd-time-3',
    category: 'Zeit',
    questionDe: 'Wann isst du zu Abend?',
    questionJp: 'いつ ばんごはんを たべますか。',
    correct: 'よる たべます。',
    correctDe: 'Ich esse abends.',
    wrong: ['あさ おきます。', 'ほんを よみます。', 'あかいです。'],
  },

  // ── Wochentage ──
  {
    id: 'd-week-2',
    category: 'Wochentage',
    questionDe: 'Welcher Tag ist heute?',
    questionJp: 'きょうは なんようびですか。',
    correct: 'げつようびです。',
    correctDe: 'Heute ist Montag.',
    wrong: ['みずです。', 'あついです。', 'がっこうです。'],
  },

  // ── Verben ──
  {
    id: 'd-verb-2',
    category: 'Verben',
    questionDe: 'Was machst du am Wochenende?',
    questionJp: 'しゅうまつ なにを しますか。',
    correct: 'ともだちに あいます。',
    correctDe: 'Ich treffe Freunde.',
    wrong: ['みずが あかいです。', 'ほんが たべます。', 'がっこうを のみます。'],
  },

  // ── Adjektive ──
  {
    id: 'd-adj-1',
    category: 'Adjektive',
    questionDe: 'Wie ist der neue Film?',
    questionJp: 'あたらしい えいがは どうですか。',
    correct: 'とても おもしろいです。',
    correctDe: 'Er ist sehr interessant.',
    wrong: ['みずを のみます。', 'がっこうに いきます。', 'ねこが います。'],
  },

  // ── Farben ──
  {
    id: 'd-color-1',
    category: 'Farben',
    questionDe: 'Welche Farbe hat das Auto?',
    questionJp: 'くるまは なにいろですか。',
    correct: 'あかいです。',
    correctDe: 'Es ist rot.',
    wrong: ['おいしいです。', 'がっこうです。', 'みずです。'],
  },

  // ── Körper ──
  {
    id: 'd-body-1',
    category: 'Körper',
    questionDe: 'Was tut dir weh?',
    questionJp: 'どこが いたいですか。',
    correct: 'あたまが いたいです。',
    correctDe: 'Mein Kopf tut weh.',
    wrong: ['みずを のみます。', 'でんしゃで いきます。', 'ほんを よみます。'],
  },

  // ── Gefühle ──
  {
    id: 'd-feel-1',
    category: 'Gefühle',
    questionDe: 'Wie geht es dir heute?',
    questionJp: 'きょうは どんな きぶんですか。',
    correct: 'とても うれしいです。',
    correctDe: 'Ich bin sehr glücklich.',
    wrong: ['がっこうに いきます。', 'みずが あります。', 'ほんを かいます。'],
  },

  // ── Wetter ──
  {
    id: 'd-weather-1',
    category: 'Wetter',
    questionDe: 'Wie ist das Wetter heute?',
    questionJp: 'きょうの てんきは どうですか。',
    correct: 'はれです。',
    correctDe: 'Es ist sonnig.',
    wrong: ['あかいです。', 'がくせいです。', 'としょかんです。'],
  },
  {
    id: 'd-weather-2',
    category: 'Wetter',
    questionDe: 'Regnet es draußen?',
    questionJp: 'そとは あめですか。',
    correct: 'はい、あめが ふっています。',
    correctDe: 'Ja, es regnet.',
    wrong: ['はい、ほんを よみます。', 'はい、ねこが います。', 'はい、がっこうです。'],
  },

  // ── Hobby ──
  {
    id: 'd-hobby-1',
    category: 'Hobby',
    questionDe: 'Was ist dein Hobby?',
    questionJp: 'しゅみは なんですか。',
    correct: 'おんがくを きくことです。',
    correctDe: 'Musik hören.',
    wrong: ['がっこうに いきます。', 'みずが つめたいです。', 'でんしゃです。'],
  },
  {
    id: 'd-hobby-2',
    category: 'Hobby',
    questionDe: 'Was machst du gern in der Freizeit?',
    questionJp: 'ひまな とき なにを しますか。',
    correct: 'えいがを みます。',
    correctDe: 'Ich schaue Filme.',
    wrong: ['みずを かきます。', 'ほんを のみます。', 'くるまを たべます。'],
  },

  // ── Beruf ──
  {
    id: 'd-job-1',
    category: 'Beruf',
    questionDe: 'Was bist du von Beruf?',
    questionJp: 'おしごとは なんですか。',
    correct: 'いしゃです。',
    correctDe: 'Ich bin Arzt.',
    wrong: ['みずです。', 'あかいです。', 'がっこうに いきます。'],
  },

  // ── Einkaufen ──
  {
    id: 'd-shop-1',
    category: 'Einkaufen',
    questionDe: 'Wie viel kostet das?',
    questionJp: 'いくらですか。',
    correct: 'せんえんです。',
    correctDe: 'Es kostet 1000 Yen.',
    wrong: ['あさです。', 'あついです。', 'がくせいです。'],
  },

  // ── Reisen ──
  {
    id: 'd-travel-1',
    category: 'Reisen',
    questionDe: 'Wohin reist du?',
    questionJp: 'どこへ りょこうしますか。',
    correct: 'きょうとへ いきます。',
    correctDe: 'Ich fahre nach Kyoto.',
    wrong: ['ほんを よみます。', 'みずを のみます。', 'ねこが います。'],
  },

  // ── Schule ──
  {
    id: 'd-school-1',
    category: 'Schule',
    questionDe: 'Hast du schon deine Hausaufgaben gemacht?',
    questionJp: 'しゅくだいは しましたか。',
    correct: 'はい、しました。',
    correctDe: 'Ja, habe ich.',
    wrong: ['はい、たべました。', 'はい、あかいです。', 'はい、でんしゃです。'],
  },

  // ── Zuhause ──
  {
    id: 'd-home-1',
    category: 'Zuhause',
    questionDe: 'Wo ist die Toilette?',
    questionJp: 'トイレは どこですか。',
    correct: 'あそこです。',
    correctDe: 'Dort drüben.',
    wrong: ['あかいです。', 'おいしいです。', 'がくせいです。'],
  },

  // ── Position ──
  {
    id: 'd-pos-1',
    category: 'Position',
    questionDe: 'Wo ist die Katze?',
    questionJp: 'ねこは どこに いますか。',
    correct: 'つくえの うえに います。',
    correctDe: 'Auf dem Tisch.',
    wrong: ['みずを のみます。', 'がっこうに いきます。', 'ほんを よみます。'],
  },
]

/** Dialogues whose category is in the given set (the current lesson theme). */
export function getDialoguesForCategories(categories: string[]): DialogueExercise[] {
  const set = new Set(categories)
  return dialogueData.filter(d => set.has(d.category))
}
