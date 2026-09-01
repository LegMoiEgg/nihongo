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
  { id: 'v-hayai', japanese: '早い', reading: 'はやい', meaning: 'früh / schnell', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-osoi', japanese: '遅い', reading: 'おそい', meaning: 'langsam / spät', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-atarashii', japanese: '新しい', reading: 'あたらしい', meaning: 'neu', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-furui', japanese: '古い', reading: 'ふるい', meaning: 'alt (Sachen)', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-muzukashii', japanese: '難しい', reading: 'むずかしい', meaning: 'schwierig', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-yasashii', japanese: '易しい', reading: 'やさしい', meaning: 'leicht / einfach', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-ii', japanese: 'いい', reading: 'いい', meaning: 'gut', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-warui', japanese: '悪い', reading: 'わるい', meaning: 'schlecht', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },

  // Numbers
  { id: 'v-ichi', japanese: '一', reading: 'いち', meaning: 'eins', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-ni', japanese: '二', reading: 'に', meaning: 'zwei', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-san', japanese: '三', reading: 'さん', meaning: 'drei', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-yon', japanese: '四', reading: 'よん', meaning: 'vier', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-go', japanese: '五', reading: 'ご', meaning: 'fünf', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-roku', japanese: '六', reading: 'ろく', meaning: 'sechs', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-nana', japanese: '七', reading: 'なな', meaning: 'sieben', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-hachi', japanese: '八', reading: 'はち', meaning: 'acht', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-kyuu', japanese: '九', reading: 'きゅう', meaning: 'neun', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-juu', japanese: '十', reading: 'じゅう', meaning: 'zehn', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-hyaku', japanese: '百', reading: 'ひゃく', meaning: 'hundert', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },
  { id: 'v-sen', japanese: '千', reading: 'せん', meaning: 'tausend', jlpt: 'N5', category: 'Zahlen', partOfSpeech: 'Zahl' },

  // Colors
  { id: 'v-aka', japanese: '赤', reading: 'あか', meaning: 'rot', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-ao', japanese: '青', reading: 'あお', meaning: 'blau', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-shiro', japanese: '白', reading: 'しろ', meaning: 'weiß', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-kuro', japanese: '黒', reading: 'くろ', meaning: 'schwarz', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-midori', japanese: '緑', reading: 'みどり', meaning: 'grün', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-kiiro', japanese: '黄色', reading: 'きいろ', meaning: 'gelb', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-chairo', japanese: '茶色', reading: 'ちゃいろ', meaning: 'braun', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },

  // Body
  { id: 'v-atama', japanese: '頭', reading: 'あたま', meaning: 'Kopf', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-me', japanese: '目', reading: 'め', meaning: 'Auge', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-mimi', japanese: '耳', reading: 'みみ', meaning: 'Ohr', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-kuchi', japanese: '口', reading: 'くち', meaning: 'Mund', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-hana-body', japanese: '鼻', reading: 'はな', meaning: 'Nase', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-te', japanese: '手', reading: 'て', meaning: 'Hand', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-ashi', japanese: '足', reading: 'あし', meaning: 'Fuß / Bein', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },

  // Nature & weather
  { id: 'v-sora', japanese: '空', reading: 'そら', meaning: 'Himmel', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-yama', japanese: '山', reading: 'やま', meaning: 'Berg', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-kawa', japanese: '川', reading: 'かわ', meaning: 'Fluss', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-umi', japanese: '海', reading: 'うみ', meaning: 'Meer', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-ame', japanese: '雨', reading: 'あめ', meaning: 'Regen', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-yuki', japanese: '雪', reading: 'ゆき', meaning: 'Schnee', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-kaze', japanese: '風', reading: 'かぜ', meaning: 'Wind', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-hana-flower', japanese: '花', reading: 'はな', meaning: 'Blume', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-ki', japanese: '木', reading: 'き', meaning: 'Baum', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },

  // More verbs
  { id: 'v-suru', japanese: 'する', reading: 'する', meaning: 'machen / tun', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-aru', japanese: 'ある', reading: 'ある', meaning: 'existieren (Sachen)', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-iru', japanese: 'いる', reading: 'いる', meaning: 'existieren (Lebewesen)', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-wakaru', japanese: '分かる', reading: 'わかる', meaning: 'verstehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-hairu', japanese: '入る', reading: 'はいる', meaning: 'hineingehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-deru', japanese: '出る', reading: 'でる', meaning: 'hinausgehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-matsu', japanese: '待つ', reading: 'まつ', meaning: 'warten', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-au', japanese: '会う', reading: 'あう', meaning: 'treffen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-asobu', japanese: '遊ぶ', reading: 'あそぶ', meaning: 'spielen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-hataraku', japanese: '働く', reading: 'はたらく', meaning: 'arbeiten', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
]

export const vocabCategories = [...new Set(vocabularyData.map(v => v.category))]
