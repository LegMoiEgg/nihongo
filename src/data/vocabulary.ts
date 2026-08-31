export interface VocabCard {
  id: string
  japanese: string      // Written form (kanji + kana)
  reading: string       // Full reading in hiragana
  meaning: string       // German translation
  jlpt: string
  category: string
  partOfSpeech: string
}

export const vocabularyData: VocabCard[] = [
  // Greetings
  { id: 'v-konnichiwa', japanese: 'こんにちは', reading: 'こんにちは', meaning: 'Hallo / Guten Tag', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },
  { id: 'v-ohayou', japanese: 'おはようございます', reading: 'おはようございます', meaning: 'Guten Morgen', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },
  { id: 'v-konbanwa', japanese: 'こんばんは', reading: 'こんばんは', meaning: 'Guten Abend', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },
  { id: 'v-sayounara', japanese: 'さようなら', reading: 'さようなら', meaning: 'Auf Wiedersehen', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },
  { id: 'v-arigatou', japanese: 'ありがとうございます', reading: 'ありがとうございます', meaning: 'Vielen Dank', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },
  { id: 'v-sumimasen', japanese: 'すみません', reading: 'すみません', meaning: 'Entschuldigung', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },
  { id: 'v-hajimemashite', japanese: 'はじめまして', reading: 'はじめまして', meaning: 'Freut mich (erstmals)', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },
  { id: 'v-onegaishimasu', japanese: 'おねがいします', reading: 'おねがいします', meaning: 'Bitte', jlpt: 'N5', category: 'Begrüßung', partOfSpeech: 'Ausdruck' },

  // Pronouns
  { id: 'v-watashi', japanese: 'わたし', reading: 'わたし', meaning: 'Ich', jlpt: 'N5', category: 'Pronomen', partOfSpeech: 'Pronomen' },
  { id: 'v-anata', japanese: 'あなた', reading: 'あなた', meaning: 'Du / Sie', jlpt: 'N5', category: 'Pronomen', partOfSpeech: 'Pronomen' },
  { id: 'v-kare', japanese: '彼', reading: 'かれ', meaning: 'Er', jlpt: 'N5', category: 'Pronomen', partOfSpeech: 'Pronomen' },
  { id: 'v-kanojo', japanese: '彼女', reading: 'かのじょ', meaning: 'Sie (weiblich)', jlpt: 'N5', category: 'Pronomen', partOfSpeech: 'Pronomen' },

  // Family
  { id: 'v-kazoku', japanese: '家族', reading: 'かぞく', meaning: 'Familie', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-okaasan', japanese: 'お母さん', reading: 'おかあさん', meaning: 'Mutter', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-otousan', japanese: 'お父さん', reading: 'おとうさん', meaning: 'Vater', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-oniisan', japanese: 'お兄さん', reading: 'おにいさん', meaning: 'Älterer Bruder', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-oneesan', japanese: 'お姉さん', reading: 'おねえさん', meaning: 'Ältere Schwester', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },

  // Food & Drink
  { id: 'v-tabemono', japanese: '食べ物', reading: 'たべもの', meaning: 'Essen', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-nomimono', japanese: '飲み物', reading: 'のみもの', meaning: 'Getränk', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-gohan', japanese: 'ご飯', reading: 'ごはん', meaning: 'Reis / Mahlzeit', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-mizu', japanese: '水', reading: 'みず', meaning: 'Wasser', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-ocha', japanese: 'お茶', reading: 'おちゃ', meaning: 'Tee', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-niku', japanese: '肉', reading: 'にく', meaning: 'Fleisch', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-sakana', japanese: '魚', reading: 'さかな', meaning: 'Fisch', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-kudamono', japanese: '果物', reading: 'くだもの', meaning: 'Obst', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-yasai', japanese: '野菜', reading: 'やさい', meaning: 'Gemüse', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },

  // Places
  { id: 'v-gakkou', japanese: '学校', reading: 'がっこう', meaning: 'Schule', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-eki', japanese: '駅', reading: 'えき', meaning: 'Bahnhof', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-byouin', japanese: '病院', reading: 'びょういん', meaning: 'Krankenhaus', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-mise', japanese: 'お店', reading: 'おみせ', meaning: 'Geschäft', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-uchi', japanese: '家', reading: 'いえ/うち', meaning: 'Haus / Zuhause', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-kaisha', japanese: '会社', reading: 'かいしゃ', meaning: 'Firma', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },

  // Time
  { id: 'v-kyou', japanese: '今日', reading: 'きょう', meaning: 'Heute', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-ashita', japanese: '明日', reading: 'あした', meaning: 'Morgen', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-kinou', japanese: '昨日', reading: 'きのう', meaning: 'Gestern', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-ima', japanese: '今', reading: 'いま', meaning: 'Jetzt', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-asa', japanese: '朝', reading: 'あさ', meaning: 'Morgen (Zeit)', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-hiru', japanese: '昼', reading: 'ひる', meaning: 'Mittag', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-yoru', japanese: '夜', reading: 'よる', meaning: 'Nacht', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },

  // Common Verbs
  { id: 'v-taberu', japanese: '食べる', reading: 'たべる', meaning: 'essen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-nomu', japanese: '飲む', reading: 'のむ', meaning: 'trinken', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-iku', japanese: '行く', reading: 'いく', meaning: 'gehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kuru', japanese: '来る', reading: 'くる', meaning: 'kommen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-miru', japanese: '見る', reading: 'みる', meaning: 'sehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kiku', japanese: '聞く', reading: 'きく', meaning: 'hören / fragen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-yomu', japanese: '読む', reading: 'よむ', meaning: 'lesen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kaku', japanese: '書く', reading: 'かく', meaning: 'schreiben', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-hanasu', japanese: '話す', reading: 'はなす', meaning: 'sprechen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-benkyousuru', japanese: '勉強する', reading: 'べんきょうする', meaning: 'lernen / studieren', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-shigotosuru', japanese: '仕事する', reading: 'しごとする', meaning: 'arbeiten', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-neru', japanese: '寝る', reading: 'ねる', meaning: 'schlafen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-okiru', japanese: '起きる', reading: 'おきる', meaning: 'aufwachen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kau', japanese: '買う', reading: 'かう', meaning: 'kaufen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },

  // Adjectives
  { id: 'v-ookii', japanese: '大きい', reading: 'おおきい', meaning: 'groß', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-chiisai', japanese: '小さい', reading: 'ちいさい', meaning: 'klein', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-atsui', japanese: '暑い', reading: 'あつい', meaning: 'heiß (Wetter)', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-samui', japanese: '寒い', reading: 'さむい', meaning: 'kalt (Wetter)', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-oishii', japanese: 'おいしい', reading: 'おいしい', meaning: 'lecker', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-takai', japanese: '高い', reading: 'たかい', meaning: 'teuer / hoch', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-yasui', japanese: '安い', reading: 'やすい', meaning: 'günstig', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-tanoshii', japanese: '楽しい', reading: 'たのしい', meaning: 'lustig / spaßig', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-kirei', japanese: 'きれい', reading: 'きれい', meaning: 'schön / sauber', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-genki', japanese: '元気', reading: 'げんき', meaning: 'gesund / munter', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
]

export const vocabCategories = [...new Set(vocabularyData.map(v => v.category))]
