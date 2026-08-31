export interface SentenceChallenge {
  id: string
  meaning: string           // German translation
  correctOrder: string[]    // Correct word blocks in order
  distractors?: string[]    // Extra wrong blocks
  hint?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const sentenceData: SentenceChallenge[] = [
  // Easy - Basic patterns
  {
    id: 's-1',
    meaning: 'Ich bin Student.',
    correctOrder: ['わたし', 'は', 'がくせい', 'です'],
    distractors: ['あなた', 'も'],
    hint: 'わたし = Ich, は = Thema-Partikel',
    difficulty: 'easy'
  },
  {
    id: 's-2',
    meaning: 'Das ist ein Buch.',
    correctOrder: ['これ', 'は', 'ほん', 'です'],
    distractors: ['それ', 'の'],
    hint: 'これ = Dies, ほん = Buch',
    difficulty: 'easy'
  },
  {
    id: 's-3',
    meaning: 'Guten Tag.',
    correctOrder: ['こんにち', 'は'],
    distractors: ['こんばん', 'おはよう'],
    hint: 'Tagesbegrüßung',
    difficulty: 'easy'
  },
  {
    id: 's-4',
    meaning: 'Ich bin Japaner.',
    correctOrder: ['わたし', 'は', 'にほんじん', 'です'],
    distractors: ['ドイツじん', 'あなた'],
    hint: 'にほんじん = Japaner',
    difficulty: 'easy'
  },
  {
    id: 's-5',
    meaning: 'Das ist lecker.',
    correctOrder: ['これ', 'は', 'おいしい', 'です'],
    distractors: ['それ', 'たかい'],
    hint: 'おいしい = lecker',
    difficulty: 'easy'
  },

  // Medium - Object + Verb patterns
  {
    id: 's-6',
    meaning: 'Ich esse Reis.',
    correctOrder: ['わたし', 'は', 'ごはん', 'を', 'たべます'],
    distractors: ['のみます', 'パン'],
    hint: 'を = Objekt-Partikel, たべます = essen',
    difficulty: 'medium'
  },
  {
    id: 's-7',
    meaning: 'Ich trinke Wasser.',
    correctOrder: ['わたし', 'は', 'みず', 'を', 'のみます'],
    distractors: ['たべます', 'おちゃ'],
    hint: 'のみます = trinken',
    difficulty: 'medium'
  },
  {
    id: 's-8',
    meaning: 'Ich gehe zur Schule.',
    correctOrder: ['わたし', 'は', 'がっこう', 'に', 'いきます'],
    distractors: ['きます', 'えき'],
    hint: 'に = Richtungspartikel, いきます = gehen',
    difficulty: 'medium'
  },
  {
    id: 's-9',
    meaning: 'Ich lese ein Buch.',
    correctOrder: ['わたし', 'は', 'ほん', 'を', 'よみます'],
    distractors: ['かきます', 'しんぶん'],
    hint: 'よみます = lesen',
    difficulty: 'medium'
  },
  {
    id: 's-10',
    meaning: 'Ich lerne Japanisch.',
    correctOrder: ['わたし', 'は', 'にほんご', 'を', 'べんきょうします'],
    distractors: ['えいご', 'はなします'],
    hint: 'べんきょうします = lernen/studieren',
    difficulty: 'medium'
  },
  {
    id: 's-11',
    meaning: 'Heute ist es heiß.',
    correctOrder: ['きょう', 'は', 'あつい', 'です'],
    distractors: ['さむい', 'あした'],
    hint: 'きょう = heute, あつい = heiß',
    difficulty: 'medium'
  },
  {
    id: 's-12',
    meaning: 'Ich kaufe Obst.',
    correctOrder: ['わたし', 'は', 'くだもの', 'を', 'かいます'],
    distractors: ['やさい', 'たべます'],
    hint: 'かいます = kaufen',
    difficulty: 'medium'
  },

  // Hard - Complex patterns
  {
    id: 's-13',
    meaning: 'Ich gehe morgen zum Bahnhof.',
    correctOrder: ['わたし', 'は', 'あした', 'えき', 'に', 'いきます'],
    distractors: ['きょう', 'がっこう', 'きます'],
    hint: 'あした = morgen, えき = Bahnhof',
    difficulty: 'hard'
  },
  {
    id: 's-14',
    meaning: 'Ich esse morgens Reis und trinke Tee.',
    correctOrder: ['あさ', 'ごはん', 'を', 'たべて', 'おちゃ', 'を', 'のみます'],
    distractors: ['よる', 'みず', 'たべます'],
    hint: 'たべて = essen (te-Form für Aufzählung)',
    difficulty: 'hard'
  },
  {
    id: 's-15',
    meaning: 'Die Schwester liest in der Bibliothek ein Buch.',
    correctOrder: ['おねえさん', 'は', 'としょかん', 'で', 'ほん', 'を', 'よみます'],
    distractors: ['がっこう', 'に', 'かきます'],
    hint: 'で = Ortspartikel (wo etwas stattfindet)',
    difficulty: 'hard'
  },
  {
    id: 's-16',
    meaning: 'Das Essen in diesem Restaurant ist lecker.',
    correctOrder: ['この', 'レストラン', 'の', 'たべもの', 'は', 'おいしい', 'です'],
    distractors: ['あの', 'のみもの', 'たかい'],
    hint: 'この = dieses, の = Besitz-Partikel',
    difficulty: 'hard'
  },
  {
    id: 's-17',
    meaning: 'Ich spreche ein bisschen Japanisch.',
    correctOrder: ['わたし', 'は', 'にほんご', 'を', 'すこし', 'はなします'],
    distractors: ['たくさん', 'えいご', 'べんきょうします'],
    hint: 'すこし = ein bisschen',
    difficulty: 'hard'
  },
  {
    id: 's-18',
    meaning: 'Gestern habe ich mit meinem Freund einen Film gesehen.',
    correctOrder: ['きのう', 'ともだち', 'と', 'えいが', 'を', 'みました'],
    distractors: ['きょう', 'に', 'ほん', 'よみました'],
    hint: 'と = mit, みました = gesehen (Vergangenheit)',
    difficulty: 'hard'
  },
]
