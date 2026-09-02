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
  { id: 'v-oyogu', japanese: '泳ぐ', reading: 'およぐ', meaning: 'schwimmen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tobu', japanese: '飛ぶ', reading: 'とぶ', meaning: 'fliegen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tatsu', japanese: '立つ', reading: 'たつ', meaning: 'stehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-suwaru', japanese: '座る', reading: 'すわる', meaning: 'sitzen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-aruku', japanese: '歩く', reading: 'あるく', meaning: 'laufen / gehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-hashiru', japanese: '走る', reading: 'はしる', meaning: 'rennen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-utau', japanese: '歌う', reading: 'うたう', meaning: 'singen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tsukuru', japanese: '作る', reading: 'つくる', meaning: 'machen / herstellen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tsukau', japanese: '使う', reading: 'つかう', meaning: 'benutzen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-oshieru', japanese: '教える', reading: 'おしえる', meaning: 'lehren / beibringen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-narau', japanese: '習う', reading: 'ならう', meaning: 'lernen (von jdm.)', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-oboeru', japanese: '覚える', reading: 'おぼえる', meaning: 'sich merken', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-wasureru', japanese: '忘れる', reading: 'わすれる', meaning: 'vergessen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-shiru', japanese: '知る', reading: 'しる', meaning: 'wissen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-omou', japanese: '思う', reading: 'おもう', meaning: 'denken / meinen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-iu', japanese: '言う', reading: 'いう', meaning: 'sagen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-yobu', japanese: '呼ぶ', reading: 'よぶ', meaning: 'rufen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-morau', japanese: 'もらう', reading: 'もらう', meaning: 'bekommen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-ageru', japanese: 'あげる', reading: 'あげる', meaning: 'geben', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kariru', japanese: '借りる', reading: 'かりる', meaning: 'ausleihen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kaesu', japanese: '返す', reading: 'かえす', meaning: 'zurückgeben', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-akeru', japanese: '開ける', reading: 'あける', meaning: 'öffnen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-shimeru', japanese: '閉める', reading: 'しめる', meaning: 'schließen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tsukeru', japanese: 'つける', reading: 'つける', meaning: 'anmachen / einschalten', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kesu', japanese: '消す', reading: 'けす', meaning: 'ausmachen / löschen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-arau', japanese: '洗う', reading: 'あらう', meaning: 'waschen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-suteru', japanese: '捨てる', reading: 'すてる', meaning: 'wegwerfen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },

  // Weekdays
  { id: 'v-getsuyoubi', japanese: '月曜日', reading: 'げつようび', meaning: 'Montag', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },
  { id: 'v-kayoubi', japanese: '火曜日', reading: 'かようび', meaning: 'Dienstag', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },
  { id: 'v-suiyoubi', japanese: '水曜日', reading: 'すいようび', meaning: 'Mittwoch', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },
  { id: 'v-mokuyoubi', japanese: '木曜日', reading: 'もくようび', meaning: 'Donnerstag', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },
  { id: 'v-kinyoubi', japanese: '金曜日', reading: 'きんようび', meaning: 'Freitag', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },
  { id: 'v-doyoubi', japanese: '土曜日', reading: 'どようび', meaning: 'Samstag', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },
  { id: 'v-nichiyoubi', japanese: '日曜日', reading: 'にちようび', meaning: 'Sonntag', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },
  { id: 'v-shuumatsu', japanese: '週末', reading: 'しゅうまつ', meaning: 'Wochenende', jlpt: 'N5', category: 'Wochentage', partOfSpeech: 'Nomen' },

  // Animals
  { id: 'v-inu', japanese: '犬', reading: 'いぬ', meaning: 'Hund', jlpt: 'N5', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-neko', japanese: '猫', reading: 'ねこ', meaning: 'Katze', jlpt: 'N5', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-tori', japanese: '鳥', reading: 'とり', meaning: 'Vogel', jlpt: 'N5', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-sakana-animal', japanese: '魚', reading: 'さかな', meaning: 'Fisch (Tier)', jlpt: 'N5', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-uma', japanese: '馬', reading: 'うま', meaning: 'Pferd', jlpt: 'N5', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-ushi', japanese: '牛', reading: 'うし', meaning: 'Kuh / Rind', jlpt: 'N5', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-buta', japanese: '豚', reading: 'ぶた', meaning: 'Schwein', jlpt: 'N5', category: 'Tiere', partOfSpeech: 'Nomen' },

  // Clothing
  { id: 'v-fuku', japanese: '服', reading: 'ふく', meaning: 'Kleidung', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-boushi', japanese: '帽子', reading: 'ぼうし', meaning: 'Hut / Mütze', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-kutsu', japanese: '靴', reading: 'くつ', meaning: 'Schuhe', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-kutsushita', japanese: '靴下', reading: 'くつした', meaning: 'Socken', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-shatsu', japanese: 'シャツ', reading: 'シャツ', meaning: 'Hemd', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-meganeg', japanese: '眼鏡', reading: 'めがね', meaning: 'Brille', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-tokei', japanese: '時計', reading: 'とけい', meaning: 'Uhr', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },

  // Furniture & home
  { id: 'v-tsukue', japanese: '机', reading: 'つくえ', meaning: 'Schreibtisch', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-isu', japanese: '椅子', reading: 'いす', meaning: 'Stuhl', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-beddo', japanese: 'ベッド', reading: 'ベッド', meaning: 'Bett', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-mado', japanese: '窓', reading: 'まど', meaning: 'Fenster', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-doa', japanese: 'ドア', reading: 'ドア', meaning: 'Tür', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-terebi', japanese: 'テレビ', reading: 'テレビ', meaning: 'Fernseher', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-denwa', japanese: '電話', reading: 'でんわ', meaning: 'Telefon', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-heya', japanese: '部屋', reading: 'へや', meaning: 'Zimmer', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-kagi', japanese: '鍵', reading: 'かぎ', meaning: 'Schlüssel', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-hon-book', japanese: '本', reading: 'ほん', meaning: 'Buch', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-kami', japanese: '紙', reading: 'かみ', meaning: 'Papier', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-pen', japanese: 'ペン', reading: 'ペン', meaning: 'Stift', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },

  // Transport
  { id: 'v-kuruma', japanese: '車', reading: 'くるま', meaning: 'Auto', jlpt: 'N5', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-densha', japanese: '電車', reading: 'でんしゃ', meaning: 'Zug', jlpt: 'N5', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-basu', japanese: 'バス', reading: 'バス', meaning: 'Bus', jlpt: 'N5', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-jitensha', japanese: '自転車', reading: 'じてんしゃ', meaning: 'Fahrrad', jlpt: 'N5', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-hikouki', japanese: '飛行機', reading: 'ひこうき', meaning: 'Flugzeug', jlpt: 'N5', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-chikatetsu', japanese: '地下鉄', reading: 'ちかてつ', meaning: 'U-Bahn', jlpt: 'N5', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-takushii', japanese: 'タクシー', reading: 'タクシー', meaning: 'Taxi', jlpt: 'N5', category: 'Transport', partOfSpeech: 'Nomen' },

  // School & work
  { id: 'v-sensei', japanese: '先生', reading: 'せんせい', meaning: 'Lehrer', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-gakusei', japanese: '学生', reading: 'がくせい', meaning: 'Student', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-daigaku', japanese: '大学', reading: 'だいがく', meaning: 'Universität', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-kyoushitsu', japanese: '教室', reading: 'きょうしつ', meaning: 'Klassenzimmer', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-shukudai', japanese: '宿題', reading: 'しゅくだい', meaning: 'Hausaufgabe', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-tesuto', japanese: 'テスト', reading: 'テスト', meaning: 'Test / Prüfung', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-jisho', japanese: '辞書', reading: 'じしょ', meaning: 'Wörterbuch', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-shinbun', japanese: '新聞', reading: 'しんぶん', meaning: 'Zeitung', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-namae', japanese: '名前', reading: 'なまえ', meaning: 'Name', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-shigoto', japanese: '仕事', reading: 'しごと', meaning: 'Arbeit', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },

  // More food
  { id: 'v-pan', japanese: 'パン', reading: 'パン', meaning: 'Brot', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-tamago', japanese: '卵', reading: 'たまご', meaning: 'Ei', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-gyuunyuu', japanese: '牛乳', reading: 'ぎゅうにゅう', meaning: 'Milch', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-koohii', japanese: 'コーヒー', reading: 'コーヒー', meaning: 'Kaffee', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-ringo', japanese: 'りんご', reading: 'りんご', meaning: 'Apfel', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-mikan', japanese: 'みかん', reading: 'みかん', meaning: 'Mandarine', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-okashi', japanese: 'お菓子', reading: 'おかし', meaning: 'Süßigkeiten', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-sake', japanese: 'お酒', reading: 'おさけ', meaning: 'Alkohol / Sake', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-tamanegi', japanese: '玉ねぎ', reading: 'たまねぎ', meaning: 'Zwiebel', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-ryouri', japanese: '料理', reading: 'りょうり', meaning: 'Gericht / Kochen', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },

  // Question words
  { id: 'v-nani', japanese: '何', reading: 'なに', meaning: 'was', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-dare', japanese: '誰', reading: 'だれ', meaning: 'wer', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-doko', japanese: 'どこ', reading: 'どこ', meaning: 'wo', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-itsu', japanese: 'いつ', reading: 'いつ', meaning: 'wann', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-naze', japanese: 'なぜ', reading: 'なぜ', meaning: 'warum', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-dou', japanese: 'どう', reading: 'どう', meaning: 'wie', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-ikura', japanese: 'いくら', reading: 'いくら', meaning: 'wie viel (Preis)', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-dono', japanese: 'どの', reading: 'どの', meaning: 'welche(r)', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },

  // Adverbs
  { id: 'v-takusan', japanese: 'たくさん', reading: 'たくさん', meaning: 'viel', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-sukoshi', japanese: '少し', reading: 'すこし', meaning: 'ein wenig', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-totemo', japanese: 'とても', reading: 'とても', meaning: 'sehr', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-itsumo', japanese: 'いつも', reading: 'いつも', meaning: 'immer', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-tokidoki', japanese: '時々', reading: 'ときどき', meaning: 'manchmal', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-sugu', japanese: 'すぐ', reading: 'すぐ', meaning: 'sofort', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-mada', japanese: 'まだ', reading: 'まだ', meaning: 'noch (nicht)', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-mou', japanese: 'もう', reading: 'もう', meaning: 'schon / bereits', jlpt: 'N5', category: 'Adverbien', partOfSpeech: 'Adverb' },

  // More adjectives
  { id: 'v-nagai', japanese: '長い', reading: 'ながい', meaning: 'lang', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-mijikai', japanese: '短い', reading: 'みじかい', meaning: 'kurz', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-hiroi', japanese: '広い', reading: 'ひろい', meaning: 'weit / breit', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-semai', japanese: '狭い', reading: 'せまい', meaning: 'eng / schmal', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-omoi', japanese: '重い', reading: 'おもい', meaning: 'schwer', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-karui', japanese: '軽い', reading: 'かるい', meaning: 'leicht (Gewicht)', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-akarui', japanese: '明るい', reading: 'あかるい', meaning: 'hell', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-kurai', japanese: '暗い', reading: 'くらい', meaning: 'dunkel', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-isogashii', japanese: '忙しい', reading: 'いそがしい', meaning: 'beschäftigt', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-omoshiroi', japanese: '面白い', reading: 'おもしろい', meaning: 'interessant', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-suki', japanese: '好き', reading: 'すき', meaning: 'mögen / beliebt', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-kirai', japanese: '嫌い', reading: 'きらい', meaning: 'nicht mögen', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-yuumei', japanese: '有名', reading: 'ゆうめい', meaning: 'berühmt', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-shizuka', japanese: '静か', reading: 'しずか', meaning: 'ruhig / still', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-benri', japanese: '便利', reading: 'べんり', meaning: 'praktisch', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-daijoubu', japanese: '大丈夫', reading: 'だいじょうぶ', meaning: 'in Ordnung', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },

  // More family
  { id: 'v-otouto', japanese: '弟', reading: 'おとうと', meaning: 'jüngerer Bruder', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-imouto', japanese: '妹', reading: 'いもうと', meaning: 'jüngere Schwester', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-sofu', japanese: '祖父', reading: 'そふ', meaning: 'Großvater', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-sobo', japanese: '祖母', reading: 'そぼ', meaning: 'Großmutter', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-kodomo', japanese: '子供', reading: 'こども', meaning: 'Kind', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-tomodachi', japanese: '友達', reading: 'ともだち', meaning: 'Freund', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },

  // More time
  { id: 'v-jikan', japanese: '時間', reading: 'じかん', meaning: 'Zeit / Stunde', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-mainichi', japanese: '毎日', reading: 'まいにち', meaning: 'jeden Tag', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-maiasa', japanese: '毎朝', reading: 'まいあさ', meaning: 'jeden Morgen', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-maiban', japanese: '毎晩', reading: 'まいばん', meaning: 'jeden Abend', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-gozen', japanese: '午前', reading: 'ごぜん', meaning: 'Vormittag', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-gogo', japanese: '午後', reading: 'ごご', meaning: 'Nachmittag', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-shuukan', japanese: '週間', reading: 'しゅうかん', meaning: 'Woche', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-toshi', japanese: '年', reading: 'とし', meaning: 'Jahr', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },

  // Names (Katakana)
  { id: 'v-miku', japanese: 'ミク', reading: 'ミク', meaning: 'Miku (Name)', jlpt: 'N5', category: 'Namen', partOfSpeech: 'Name' },
  { id: 'v-teto', japanese: 'テト', reading: 'テト', meaning: 'Teto (Name)', jlpt: 'N5', category: 'Namen', partOfSpeech: 'Name' },
]

export const vocabCategories = [...new Set(vocabularyData.map(v => v.category))]
