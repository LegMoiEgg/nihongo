/**
 * Japanese grammar particles (助詞 joshi).
 *
 * Particles are the small connecting words that mark the grammatical role of
 * the word before them. Getting them right is essential in Japanese, so we
 * teach them both as study cards (explanation + examples) and as fill-in-the-
 * blank exercises ("which particle goes in the gap?").
 */

export interface ParticleExample {
  japanese: string   // full sentence with the particle in place
  reading: string    // hiragana reading of the sentence
  meaning: string    // German translation
}

export interface ParticleQuiz {
  /** Sentence with the blank marked as ＿ (full-width underscore). */
  sentence: string
  /** Reading of the full sentence (for the hint / after answering). */
  reading: string
  /** German translation of the sentence. */
  meaning: string
  /** The correct particle for the blank. */
  answer: string
  /** A short reason why this particle is correct. */
  why: string
}

export interface ParticleCard {
  id: string
  particle: string        // the kana, e.g. は
  romaji: string          // how it is pronounced, e.g. "wa"
  name: string            // short German name, e.g. "Themen-Partikel"
  short: string           // one-line summary
  explanation: string     // full explanation for the study card
  examples: ParticleExample[]
  quizzes: ParticleQuiz[]
}

export const particleData: ParticleCard[] = [
  {
    id: 'p-wa',
    particle: 'は',
    romaji: 'wa',
    name: 'Themen-Partikel',
    short: 'Markiert das Thema des Satzes ("Was das betrifft, …").',
    explanation:
      'は (gesprochen "wa", nicht "ha") markiert das THEMA des Satzes — worüber gesprochen wird. Es steht hinter dem Wort, das das Thema ist. Übersetzt oft mit "Was … betrifft" oder einfach durch die Betonung des Themas.',
    examples: [
      { japanese: 'わたしは がくせいです。', reading: 'わたしは がくせいです。', meaning: 'Ich bin Student. (Was mich betrifft: Student.)' },
      { japanese: 'これは ほんです。', reading: 'これは ほんです。', meaning: 'Das ist ein Buch.' },
      { japanese: 'きょうは あついです。', reading: 'きょうは あついです。', meaning: 'Heute ist es heiß.' },
    ],
    quizzes: [
      { sentence: 'わたし＿ せんせいです。', reading: 'わたしは せんせいです。', meaning: 'Ich bin Lehrer.', answer: 'は', why: 'は markiert das Thema "ich".' },
      { sentence: 'これ＿ みずです。', reading: 'これは みずです。', meaning: 'Das ist Wasser.', answer: 'は', why: 'は markiert das Thema "das".' },
    ],
  },
  {
    id: 'p-ga',
    particle: 'が',
    romaji: 'ga',
    name: 'Subjekt-Partikel',
    short: 'Markiert das Subjekt, oft bei neuer Information oder Betonung.',
    explanation:
      'が markiert das SUBJEKT — wer oder was etwas tut oder existiert. Man nutzt が, wenn das Subjekt neu/wichtig ist oder etwas existiert (bei あります/います). Unterschied zu は: は betont das Thema, が betont, WER genau handelt.',
    examples: [
      { japanese: 'ねこが います。', reading: 'ねこが います。', meaning: 'Es gibt eine Katze. / Eine Katze ist da.' },
      { japanese: 'だれが きましたか。', reading: 'だれが きましたか。', meaning: 'Wer ist gekommen?' },
    ],
    quizzes: [
      { sentence: 'いぬ＿ います。', reading: 'いぬが います。', meaning: 'Es gibt einen Hund.', answer: 'が', why: 'が markiert das existierende Subjekt bei います.' },
      { sentence: 'だれ＿ たべますか。', reading: 'だれが たべますか。', meaning: 'Wer isst?', answer: 'が', why: 'Bei Fragewörtern wie だれ nutzt man が.' },
    ],
  },
  {
    id: 'p-o',
    particle: 'を',
    romaji: 'o',
    name: 'Objekt-Partikel',
    short: 'Markiert das direkte Objekt einer Handlung.',
    explanation:
      'を (gesprochen "o") markiert das direkte OBJEKT — das Ding, mit dem etwas getan wird. Es steht direkt vor dem Verb: [Objekt] を [Verb]. Beispiel: ごはん を たべます = Reis essen.',
    examples: [
      { japanese: 'ごはんを たべます。', reading: 'ごはんを たべます。', meaning: 'Ich esse Reis.' },
      { japanese: 'みずを のみます。', reading: 'みずを のみます。', meaning: 'Ich trinke Wasser.' },
      { japanese: 'ほんを よみます。', reading: 'ほんを よみます。', meaning: 'Ich lese ein Buch.' },
    ],
    quizzes: [
      { sentence: 'おちゃ＿ のみます。', reading: 'おちゃを のみます。', meaning: 'Ich trinke Tee.', answer: 'を', why: 'を markiert das Objekt "Tee" der Handlung "trinken".' },
      { sentence: 'にほんご＿ べんきょうします。', reading: 'にほんごを べんきょうします。', meaning: 'Ich lerne Japanisch.', answer: 'を', why: 'を markiert das Objekt "Japanisch".' },
    ],
  },
  {
    id: 'p-ni',
    particle: 'に',
    romaji: 'ni',
    name: 'Ziel-/Zeit-Partikel',
    short: 'Markiert Ziel/Richtung, Zeitpunkt oder Ort des Seins.',
    explanation:
      'に hat mehrere Kernbedeutungen: (1) ZIEL einer Bewegung (がっこうに いきます = zur Schule gehen), (2) ZEITPUNKT (7じに = um 7 Uhr), (3) Ort, an dem etwas EXISTIERT (へやに います = im Zimmer sein). Merksatz: に zeigt einen Punkt an — im Raum oder in der Zeit.',
    examples: [
      { japanese: 'がっこうに いきます。', reading: 'がっこうに いきます。', meaning: 'Ich gehe zur Schule.' },
      { japanese: 'えきに いきます。', reading: 'えきに いきます。', meaning: 'Ich gehe zum Bahnhof.' },
    ],
    quizzes: [
      { sentence: 'がっこう＿ いきます。', reading: 'がっこうに いきます。', meaning: 'Ich gehe zur Schule.', answer: 'に', why: 'に markiert das Ziel der Bewegung.' },
      { sentence: 'えき＿ きます。', reading: 'えきに きます。', meaning: 'Ich komme zum Bahnhof.', answer: 'に', why: 'に markiert das Ziel bei きます (kommen).' },
    ],
  },
  {
    id: 'p-de',
    particle: 'で',
    romaji: 'de',
    name: 'Orts-/Mittel-Partikel',
    short: 'Ort, an dem eine Handlung passiert, oder das benutzte Mittel.',
    explanation:
      'で markiert (1) den ORT, an dem eine Handlung STATTFINDET (がっこうで べんきょうします = in der Schule lernen), oder (2) das MITTEL/Werkzeug (ペンで かきます = mit dem Stift schreiben). Wichtig: に = Ort des Seins, で = Ort einer Handlung.',
    examples: [
      { japanese: 'がっこうで べんきょうします。', reading: 'がっこうで べんきょうします。', meaning: 'Ich lerne in der Schule.' },
      { japanese: 'ペンで かきます。', reading: 'ペンで かきます。', meaning: 'Ich schreibe mit einem Stift.' },
    ],
    quizzes: [
      { sentence: 'えき＿ たべます。', reading: 'えきで たべます。', meaning: 'Ich esse am Bahnhof.', answer: 'で', why: 'で markiert den Ort, an dem die Handlung "essen" passiert.' },
      { sentence: 'ペン＿ かきます。', reading: 'ペンで かきます。', meaning: 'Ich schreibe mit einem Stift.', answer: 'で', why: 'で markiert das Mittel "Stift".' },
    ],
  },
  {
    id: 'p-no',
    particle: 'の',
    romaji: 'no',
    name: 'Besitz-Partikel',
    short: 'Verbindet zwei Nomen: Besitz oder Zugehörigkeit (A von B).',
    explanation:
      'の verbindet zwei Nomen und zeigt BESITZ oder ZUGEHÖRIGKEIT: [A] の [B] = "Bs A" bzw. "A von B". Beispiel: わたしの ほん = mein Buch (wörtlich: "ich-von Buch"). Das erste Nomen beschreibt das zweite.',
    examples: [
      { japanese: 'わたしの ほん', reading: 'わたしの ほん', meaning: 'mein Buch' },
      { japanese: 'にほんごの せんせい', reading: 'にほんごの せんせい', meaning: 'Japanisch-Lehrer' },
    ],
    quizzes: [
      { sentence: 'わたし＿ ほんです。', reading: 'わたしの ほんです。', meaning: 'Es ist mein Buch.', answer: 'の', why: 'の verbindet "ich" und "Buch" → Besitz.' },
      { sentence: 'にほんご＿ せんせいです。', reading: 'にほんごの せんせいです。', meaning: 'Er ist Japanisch-Lehrer.', answer: 'の', why: 'の verbindet "Japanisch" und "Lehrer" → Zugehörigkeit.' },
    ],
  },
  {
    id: 'p-e',
    particle: 'へ',
    romaji: 'e',
    name: 'Richtungs-Partikel',
    short: 'Zeigt die Richtung einer Bewegung (gesprochen "e").',
    explanation:
      'へ (gesprochen "e", nicht "he") zeigt die RICHTUNG einer Bewegung an — wohin man geht. Sehr ähnlich zu に bei Bewegungen; へ betont eher die Richtung, に eher das genaue Ziel. Für Anfänger sind beide bei "gehen/kommen" meist austauschbar.',
    examples: [
      { japanese: 'がっこうへ いきます。', reading: 'がっこうへ いきます。', meaning: 'Ich gehe (Richtung) Schule.' },
      { japanese: 'えきへ いきます。', reading: 'えきへ いきます。', meaning: 'Ich gehe (Richtung) Bahnhof.' },
    ],
    quizzes: [
      { sentence: 'がっこう＿ いきます。', reading: 'がっこうへ いきます。', meaning: 'Ich gehe Richtung Schule.', answer: 'へ', why: 'へ zeigt die Richtung der Bewegung an.' },
    ],
  },
]

/** All particle characters — used as the distractor pool for fill-in quizzes. */
export const allParticles: string[] = particleData.map(p => p.particle)

/** Look up a particle card by its kana. */
export function findParticleByChar(particle: string): ParticleCard | undefined {
  return particleData.find(p => p.particle === particle)
}
