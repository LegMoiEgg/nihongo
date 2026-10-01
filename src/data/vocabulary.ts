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

  // ── Additional N5 vocabulary (more material for higher levels) ──
  // More verbs
  { id: 'v-oyogu2', japanese: '泳ぐ', reading: 'およぐ', meaning: 'schwimmen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-noru', japanese: '乗る', reading: 'のる', meaning: 'einsteigen / fahren', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-oriru', japanese: '降りる', reading: 'おりる', meaning: 'aussteigen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tomaru', japanese: '止まる', reading: 'とまる', meaning: 'anhalten', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-hajimaru', japanese: '始まる', reading: 'はじまる', meaning: 'beginnen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-owaru', japanese: '終わる', reading: 'おわる', meaning: 'enden', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-dekiru', japanese: 'できる', reading: 'できる', meaning: 'können', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-wakaru2', japanese: '分かる', reading: 'わかる', meaning: 'verstehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },

  // More food
  { id: 'v-cha-han', japanese: 'チャーハン', reading: 'チャーハン', meaning: 'Gebratener Reis', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-ramen', japanese: 'ラーメン', reading: 'ラーメン', meaning: 'Ramen', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-sushi', japanese: 'すし', reading: 'すし', meaning: 'Sushi', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-juusu', japanese: 'ジュース', reading: 'ジュース', meaning: 'Saft', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },

  // More places
  { id: 'v-koen', japanese: '公園', reading: 'こうえん', meaning: 'Park', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-toshokan', japanese: '図書館', reading: 'としょかん', meaning: 'Bibliothek', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-ginkou', japanese: '銀行', reading: 'ぎんこう', meaning: 'Bank', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-yuubinkyoku', japanese: '郵便局', reading: 'ゆうびんきょく', meaning: 'Post', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-resutoran', japanese: 'レストラン', reading: 'レストラン', meaning: 'Restaurant', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },

  // More adjectives
  { id: 'v-tooi', japanese: '遠い', reading: 'とおい', meaning: 'weit entfernt', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-chikai', japanese: '近い', reading: 'ちかい', meaning: 'nah', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-tsuyoi', japanese: '強い', reading: 'つよい', meaning: 'stark', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-yowai', japanese: '弱い', reading: 'よわい', meaning: 'schwach', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-wakai', japanese: '若い', reading: 'わかい', meaning: 'jung', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-amai', japanese: '甘い', reading: 'あまい', meaning: 'süß', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-karai', japanese: '辛い', reading: 'からい', meaning: 'scharf', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },

  // More school/work
  { id: 'v-enpitsu', japanese: '鉛筆', reading: 'えんぴつ', meaning: 'Bleistift', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-nooto', japanese: 'ノート', reading: 'ノート', meaning: 'Heft', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },
  { id: 'v-kaigi', japanese: '会議', reading: 'かいぎ', meaning: 'Besprechung', jlpt: 'N5', category: 'Schule', partOfSpeech: 'Nomen' },

  // More nature / weather
  { id: 'v-tenki', japanese: '天気', reading: 'てんき', meaning: 'Wetter', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-taiyou', japanese: '太陽', reading: 'たいよう', meaning: 'Sonne', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-hoshi', japanese: '星', reading: 'ほし', meaning: 'Stern', jlpt: 'N5', category: 'Natur', partOfSpeech: 'Nomen' },

  // ───────────────────────────── Etappe 1: bestehende Kategorien auffüllen ──
  // Essen
  { id: 'v-asagohan', japanese: '朝ご飯', reading: 'あさごはん', meaning: 'Frühstück', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-hirugohan', japanese: '昼ご飯', reading: 'ひるごはん', meaning: 'Mittagessen', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-bangohan', japanese: '晩ご飯', reading: 'ばんごはん', meaning: 'Abendessen', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-yasai2', japanese: 'サラダ', reading: 'サラダ', meaning: 'Salat', jlpt: 'N5', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-chiizu', japanese: 'チーズ', reading: 'チーズ', meaning: 'Käse', jlpt: 'N4', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-bataa', japanese: 'バター', reading: 'バター', meaning: 'Butter', jlpt: 'N4', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-satou', japanese: '砂糖', reading: 'さとう', meaning: 'Zucker', jlpt: 'N4', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-shio', japanese: '塩', reading: 'しお', meaning: 'Salz', jlpt: 'N4', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-tamago2', japanese: '卵焼き', reading: 'たまごやき', meaning: 'Omelett', jlpt: 'N4', category: 'Essen', partOfSpeech: 'Nomen' },
  { id: 'v-kome', japanese: '米', reading: 'こめ', meaning: 'Reis (ungekocht)', jlpt: 'N4', category: 'Essen', partOfSpeech: 'Nomen' },

  // Orte
  { id: 'v-depaato', japanese: 'デパート', reading: 'デパート', meaning: 'Kaufhaus', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-konbini', japanese: 'コンビニ', reading: 'コンビニ', meaning: 'Kiosk / Convenience Store', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-kuukou', japanese: '空港', reading: 'くうこう', meaning: 'Flughafen', jlpt: 'N4', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-hoteru', japanese: 'ホテル', reading: 'ホテル', meaning: 'Hotel', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-kissaten', japanese: '喫茶店', reading: 'きっさてん', meaning: 'Café', jlpt: 'N4', category: 'Orte', partOfSpeech: 'Nomen' },
  { id: 'v-machi', japanese: '町', reading: 'まち', meaning: 'Stadt / Viertel', jlpt: 'N5', category: 'Orte', partOfSpeech: 'Nomen' },

  // Zeit
  { id: 'v-shuu', japanese: '週', reading: 'しゅう', meaning: 'Woche', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-tsuki2', japanese: '月', reading: 'つき', meaning: 'Monat', jlpt: 'N5', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-ototoi', japanese: 'おととい', reading: 'おととい', meaning: 'vorgestern', jlpt: 'N4', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-asatte', japanese: 'あさって', reading: 'あさって', meaning: 'übermorgen', jlpt: 'N4', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-konshuu', japanese: '今週', reading: 'こんしゅう', meaning: 'diese Woche', jlpt: 'N4', category: 'Zeit', partOfSpeech: 'Nomen' },
  { id: 'v-raishuu', japanese: '来週', reading: 'らいしゅう', meaning: 'nächste Woche', jlpt: 'N4', category: 'Zeit', partOfSpeech: 'Nomen' },

  // Familie
  { id: 'v-ani', japanese: '兄', reading: 'あに', meaning: 'älterer Bruder (eigener)', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-ane', japanese: '姉', reading: 'あね', meaning: 'ältere Schwester (eigene)', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-haha', japanese: '母', reading: 'はは', meaning: 'Mutter (eigene)', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-chichi', japanese: '父', reading: 'ちち', meaning: 'Vater (eigener)', jlpt: 'N5', category: 'Familie', partOfSpeech: 'Nomen' },
  { id: 'v-ryoushin', japanese: '両親', reading: 'りょうしん', meaning: 'Eltern', jlpt: 'N4', category: 'Familie', partOfSpeech: 'Nomen' },

  // Körper
  { id: 'v-kao', japanese: '顔', reading: 'かお', meaning: 'Gesicht', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-kami-hair', japanese: '髪', reading: 'かみ', meaning: 'Haar', jlpt: 'N4', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-ha-tooth', japanese: '歯', reading: 'は', meaning: 'Zahn', jlpt: 'N5', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-onaka', japanese: 'お腹', reading: 'おなか', meaning: 'Bauch', jlpt: 'N4', category: 'Körper', partOfSpeech: 'Nomen' },
  { id: 'v-koe', japanese: '声', reading: 'こえ', meaning: 'Stimme', jlpt: 'N4', category: 'Körper', partOfSpeech: 'Nomen' },

  // Farben
  { id: 'v-murasaki', japanese: '紫', reading: 'むらさき', meaning: 'lila', jlpt: 'N4', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-pinku', japanese: 'ピンク', reading: 'ピンク', meaning: 'rosa', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-orenji', japanese: 'オレンジ', reading: 'オレンジ', meaning: 'orange', jlpt: 'N5', category: 'Farben', partOfSpeech: 'Nomen' },
  { id: 'v-haiiro', japanese: '灰色', reading: 'はいいろ', meaning: 'grau', jlpt: 'N4', category: 'Farben', partOfSpeech: 'Nomen' },

  // Tiere
  { id: 'v-usagi', japanese: 'うさぎ', reading: 'うさぎ', meaning: 'Hase', jlpt: 'N4', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-kuma', japanese: '熊', reading: 'くま', meaning: 'Bär', jlpt: 'N4', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-zou', japanese: '象', reading: 'ぞう', meaning: 'Elefant', jlpt: 'N4', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-saru', japanese: '猿', reading: 'さる', meaning: 'Affe', jlpt: 'N4', category: 'Tiere', partOfSpeech: 'Nomen' },
  { id: 'v-mushi', japanese: '虫', reading: 'むし', meaning: 'Insekt', jlpt: 'N4', category: 'Tiere', partOfSpeech: 'Nomen' },

  // Natur
  { id: 'v-mori', japanese: '森', reading: 'もり', meaning: 'Wald', jlpt: 'N4', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-ishi', japanese: '石', reading: 'いし', meaning: 'Stein', jlpt: 'N4', category: 'Natur', partOfSpeech: 'Nomen' },
  { id: 'v-kumo', japanese: '雲', reading: 'くも', meaning: 'Wolke', jlpt: 'N4', category: 'Natur', partOfSpeech: 'Nomen' },

  // Transport
  { id: 'v-fune', japanese: '船', reading: 'ふね', meaning: 'Schiff', jlpt: 'N4', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-shinkansen', japanese: '新幹線', reading: 'しんかんせん', meaning: 'Shinkansen (Schnellzug)', jlpt: 'N4', category: 'Transport', partOfSpeech: 'Nomen' },
  { id: 'v-michi', japanese: '道', reading: 'みち', meaning: 'Straße / Weg', jlpt: 'N4', category: 'Transport', partOfSpeech: 'Nomen' },

  // Kleidung
  { id: 'v-zubon', japanese: 'ズボン', reading: 'ズボン', meaning: 'Hose', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-sukaato', japanese: 'スカート', reading: 'スカート', meaning: 'Rock', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-kouto', japanese: 'コート', reading: 'コート', meaning: 'Mantel', jlpt: 'N5', category: 'Kleidung', partOfSpeech: 'Nomen' },
  { id: 'v-sebiro', japanese: '背広', reading: 'せびろ', meaning: 'Anzug', jlpt: 'N4', category: 'Kleidung', partOfSpeech: 'Nomen' },

  // Zuhause
  { id: 'v-daidokoro', japanese: '台所', reading: 'だいどころ', meaning: 'Küche', jlpt: 'N4', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-furo', japanese: 'お風呂', reading: 'おふろ', meaning: 'Bad', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-toire', japanese: 'トイレ', reading: 'トイレ', meaning: 'Toilette', jlpt: 'N5', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-niwa', japanese: '庭', reading: 'にわ', meaning: 'Garten', jlpt: 'N4', category: 'Zuhause', partOfSpeech: 'Nomen' },
  { id: 'v-reizouko', japanese: '冷蔵庫', reading: 'れいぞうこ', meaning: 'Kühlschrank', jlpt: 'N4', category: 'Zuhause', partOfSpeech: 'Nomen' },

  // Fragewörter / Adverbien
  { id: 'v-dochira', japanese: 'どちら', reading: 'どちら', meaning: 'welche(r) von beiden / wohin', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-nannin', japanese: '何人', reading: 'なんにん', meaning: 'wie viele Personen', jlpt: 'N5', category: 'Fragewörter', partOfSpeech: 'Fragewort' },
  { id: 'v-zenbu', japanese: '全部', reading: 'ぜんぶ', meaning: 'alles', jlpt: 'N4', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-taitei', japanese: 'たいてい', reading: 'たいてい', meaning: 'meistens', jlpt: 'N4', category: 'Adverbien', partOfSpeech: 'Adverb' },
  { id: 'v-yukkuri', japanese: 'ゆっくり', reading: 'ゆっくり', meaning: 'langsam / gemütlich', jlpt: 'N4', category: 'Adverbien', partOfSpeech: 'Adverb' },

  // ───────────────────────────── Etappe 2: Verben + Adjektive ──
  // Verben (godan unless noted ichidan/irregular in verb-conjugation.ts)
  { id: 'v-kaeru-home', japanese: '帰る', reading: 'かえる', meaning: 'nach Hause gehen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-noboru', japanese: '登る', reading: 'のぼる', meaning: 'steigen / klettern', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-okuru', japanese: '送る', reading: 'おくる', meaning: 'senden / schicken', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-harau', japanese: '払う', reading: 'はらう', meaning: 'bezahlen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tetsudau', japanese: '手伝う', reading: 'てつだう', meaning: 'helfen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kayou', japanese: '通う', reading: 'かよう', meaning: 'pendeln / regelmäßig gehen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-naku', japanese: '泣く', reading: 'なく', meaning: 'weinen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-warau', japanese: '笑う', reading: 'わらう', meaning: 'lachen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-isogu', japanese: '急ぐ', reading: 'いそぐ', meaning: 'sich beeilen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-yasumu', japanese: '休む', reading: 'やすむ', meaning: 'sich ausruhen / fehlen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-shinu', japanese: '死ぬ', reading: 'しぬ', meaning: 'sterben', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-motsu', japanese: '持つ', reading: 'もつ', meaning: 'halten / besitzen', jlpt: 'N5', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kangaeru', japanese: '考える', reading: 'かんがえる', meaning: 'nachdenken', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-shiraberu', japanese: '調べる', reading: 'しらべる', meaning: 'nachschlagen / untersuchen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-miseru', japanese: '見せる', reading: 'みせる', meaning: 'zeigen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-kimeru', japanese: '決める', reading: 'きめる', meaning: 'entscheiden', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-tsukareru', japanese: '疲れる', reading: 'つかれる', meaning: 'müde werden', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-ryokousuru', japanese: '旅行する', reading: 'りょこうする', meaning: 'reisen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-sentakusuru', japanese: '洗濯する', reading: 'せんたくする', meaning: 'Wäsche waschen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },
  { id: 'v-soujisuru', japanese: '掃除する', reading: 'そうじする', meaning: 'putzen / aufräumen', jlpt: 'N4', category: 'Verben', partOfSpeech: 'Verb' },

  // Adjektive
  { id: 'v-tsumetai', japanese: '冷たい', reading: 'つめたい', meaning: 'kalt (Berührung)', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-atatakai', japanese: '暖かい', reading: 'あたたかい', meaning: 'warm', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-suzushii', japanese: '涼しい', reading: 'すずしい', meaning: 'kühl / angenehm', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-kitanai', japanese: '汚い', reading: 'きたない', meaning: 'schmutzig', jlpt: 'N5', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-mezurashii', japanese: '珍しい', reading: 'めずらしい', meaning: 'selten / ungewöhnlich', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-kowai', japanese: '怖い', reading: 'こわい', meaning: 'beängstigend', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-itai', japanese: '痛い', reading: 'いたい', meaning: 'schmerzhaft', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-nemui', japanese: '眠い', reading: 'ねむい', meaning: 'schläfrig', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-sabishii', japanese: '寂しい', reading: 'さびしい', meaning: 'einsam', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-ureshii', japanese: '嬉しい', reading: 'うれしい', meaning: 'erfreut / glücklich', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-kanashii', japanese: '悲しい', reading: 'かなしい', meaning: 'traurig', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-asai', japanese: '浅い', reading: 'あさい', meaning: 'flach / seicht', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-fukai', japanese: '深い', reading: 'ふかい', meaning: 'tief', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-futoi', japanese: '太い', reading: 'ふとい', meaning: 'dick', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-hosoi', japanese: '細い', reading: 'ほそい', meaning: 'dünn / schmal', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'i-Adjektiv' },
  { id: 'v-daiji', japanese: '大事', reading: 'だいじ', meaning: 'wichtig', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-shinsetsu', japanese: '親切', reading: 'しんせつ', meaning: 'freundlich / hilfsbereit', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-hima', japanese: '暇', reading: 'ひま', meaning: 'frei (Zeit) / Muße', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-fuben', japanese: '不便', reading: 'ふべん', meaning: 'unpraktisch', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-anzen', japanese: '安全', reading: 'あんぜん', meaning: 'sicher', jlpt: 'N4', category: 'Adjektive', partOfSpeech: 'na-Adjektiv' },

  // ───────────────────────────── Etappe 3: neue Kategorien ──
  // Beruf
  { id: 'v-isha', japanese: '医者', reading: 'いしゃ', meaning: 'Arzt', jlpt: 'N5', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-kangoshi', japanese: '看護師', reading: 'かんごし', meaning: 'Krankenpfleger/-in', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-keikan', japanese: '警官', reading: 'けいかん', meaning: 'Polizist', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-untenshu', japanese: '運転手', reading: 'うんてんしゅ', meaning: 'Fahrer', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-kaishain', japanese: '会社員', reading: 'かいしゃいん', meaning: 'Angestellter', jlpt: 'N5', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-tenin', japanese: '店員', reading: 'てんいん', meaning: 'Verkäufer/-in', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-kashu', japanese: '歌手', reading: 'かしゅ', meaning: 'Sänger/-in', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-cook', japanese: '料理人', reading: 'りょうりにん', meaning: 'Koch', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-gakusha', japanese: '学者', reading: 'がくしゃ', meaning: 'Wissenschaftler', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },
  { id: 'v-shufu', japanese: '主婦', reading: 'しゅふ', meaning: 'Hausfrau/-mann', jlpt: 'N4', category: 'Beruf', partOfSpeech: 'Nomen' },

  // Hobby
  { id: 'v-shumi', japanese: '趣味', reading: 'しゅみ', meaning: 'Hobby', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-supootsu', japanese: 'スポーツ', reading: 'スポーツ', meaning: 'Sport', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-ongaku', japanese: '音楽', reading: 'おんがく', meaning: 'Musik', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-eiga2', japanese: '映画', reading: 'えいが', meaning: 'Film', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-ryokou', japanese: '旅行', reading: 'りょこう', meaning: 'Reise', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-shashin', japanese: '写真', reading: 'しゃしん', meaning: 'Foto', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-e-picture', japanese: '絵', reading: 'え', meaning: 'Bild / Malerei', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-geemu', japanese: 'ゲーム', reading: 'ゲーム', meaning: 'Spiel / Videospiel', jlpt: 'N5', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-dokusho', japanese: '読書', reading: 'どくしょ', meaning: 'Lesen (als Hobby)', jlpt: 'N4', category: 'Hobby', partOfSpeech: 'Nomen' },
  { id: 'v-tsuri', japanese: '釣り', reading: 'つり', meaning: 'Angeln', jlpt: 'N4', category: 'Hobby', partOfSpeech: 'Nomen' },

  // Gefühle
  { id: 'v-kimochi', japanese: '気持ち', reading: 'きもち', meaning: 'Gefühl / Stimmung', jlpt: 'N4', category: 'Gefühle', partOfSpeech: 'Nomen' },
  { id: 'v-shiawase', japanese: '幸せ', reading: 'しあわせ', meaning: 'Glück', jlpt: 'N4', category: 'Gefühle', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-shinpai', japanese: '心配', reading: 'しんぱい', meaning: 'Sorge / besorgt', jlpt: 'N4', category: 'Gefühle', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-anshin', japanese: '安心', reading: 'あんしん', meaning: 'Erleichterung / beruhigt', jlpt: 'N4', category: 'Gefühle', partOfSpeech: 'na-Adjektiv' },
  { id: 'v-bikkuri', japanese: 'びっくり', reading: 'びっくり', meaning: 'Überraschung', jlpt: 'N4', category: 'Gefühle', partOfSpeech: 'Adverb' },
  { id: 'v-okoru', japanese: '怒る', reading: 'おこる', meaning: 'wütend werden', jlpt: 'N4', category: 'Gefühle', partOfSpeech: 'Verb' },
  { id: 'v-kibun', japanese: '気分', reading: 'きぶん', meaning: 'Laune / Befinden', jlpt: 'N4', category: 'Gefühle', partOfSpeech: 'Nomen' },

  // Wetter
  { id: 'v-hare', japanese: '晴れ', reading: 'はれ', meaning: 'sonnig / heiter', jlpt: 'N4', category: 'Wetter', partOfSpeech: 'Nomen' },
  { id: 'v-kumori', japanese: '曇り', reading: 'くもり', meaning: 'bewölkt', jlpt: 'N4', category: 'Wetter', partOfSpeech: 'Nomen' },
  { id: 'v-taifuu', japanese: '台風', reading: 'たいふう', meaning: 'Taifun', jlpt: 'N4', category: 'Wetter', partOfSpeech: 'Nomen' },
  { id: 'v-kion', japanese: '気温', reading: 'きおん', meaning: 'Temperatur', jlpt: 'N4', category: 'Wetter', partOfSpeech: 'Nomen' },
  { id: 'v-kaminari', japanese: '雷', reading: 'かみなり', meaning: 'Donner / Blitz', jlpt: 'N4', category: 'Wetter', partOfSpeech: 'Nomen' },
  { id: 'v-kiri', japanese: '霧', reading: 'きり', meaning: 'Nebel', jlpt: 'N4', category: 'Wetter', partOfSpeech: 'Nomen' },

  // Einkaufen
  { id: 'v-okane', japanese: 'お金', reading: 'おかね', meaning: 'Geld', jlpt: 'N5', category: 'Einkaufen', partOfSpeech: 'Nomen' },
  { id: 'v-nedan', japanese: '値段', reading: 'ねだん', meaning: 'Preis', jlpt: 'N4', category: 'Einkaufen', partOfSpeech: 'Nomen' },
  { id: 'v-kaimono', japanese: '買い物', reading: 'かいもの', meaning: 'Einkauf', jlpt: 'N5', category: 'Einkaufen', partOfSpeech: 'Nomen' },
  { id: 'v-saifu', japanese: '財布', reading: 'さいふ', meaning: 'Geldbörse', jlpt: 'N4', category: 'Einkaufen', partOfSpeech: 'Nomen' },
  { id: 'v-reji', japanese: 'レジ', reading: 'レジ', meaning: 'Kasse', jlpt: 'N4', category: 'Einkaufen', partOfSpeech: 'Nomen' },
  { id: 'v-fukuro', japanese: '袋', reading: 'ふくろ', meaning: 'Tüte / Beutel', jlpt: 'N4', category: 'Einkaufen', partOfSpeech: 'Nomen' },
  { id: 'v-shouhin', japanese: '商品', reading: 'しょうひん', meaning: 'Ware / Produkt', jlpt: 'N4', category: 'Einkaufen', partOfSpeech: 'Nomen' },
  { id: 'v-waribiki', japanese: '割引', reading: 'わりびき', meaning: 'Rabatt', jlpt: 'N4', category: 'Einkaufen', partOfSpeech: 'Nomen' },

  // ───────────────────────────── Etappe 4: weitere Kategorien + N3 ──
  // Reisen
  { id: 'v-kippu', japanese: '切符', reading: 'きっぷ', meaning: 'Fahrkarte', jlpt: 'N5', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-chizu', japanese: '地図', reading: 'ちず', meaning: 'Karte / Landkarte', jlpt: 'N5', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-ryokan', japanese: '旅館', reading: 'りょかん', meaning: 'traditionelles Gasthaus', jlpt: 'N4', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-nimotsu', japanese: '荷物', reading: 'にもつ', meaning: 'Gepäck', jlpt: 'N4', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-pasupooto', japanese: 'パスポート', reading: 'パスポート', meaning: 'Reisepass', jlpt: 'N4', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-yoyaku', japanese: '予約', reading: 'よやく', meaning: 'Reservierung', jlpt: 'N4', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-kankou', japanese: '観光', reading: 'かんこう', meaning: 'Besichtigung / Tourismus', jlpt: 'N4', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-omiyage', japanese: 'お土産', reading: 'おみやげ', meaning: 'Souvenir', jlpt: 'N4', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-kokunai', japanese: '国', reading: 'くに', meaning: 'Land', jlpt: 'N5', category: 'Reisen', partOfSpeech: 'Nomen' },
  { id: 'v-sekai', japanese: '世界', reading: 'せかい', meaning: 'Welt', jlpt: 'N4', category: 'Reisen', partOfSpeech: 'Nomen' },

  // Küche / Haushalt
  { id: 'v-naifu', japanese: 'ナイフ', reading: 'ナイフ', meaning: 'Messer', jlpt: 'N5', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-fooku', japanese: 'フォーク', reading: 'フォーク', meaning: 'Gabel', jlpt: 'N5', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-supuun', japanese: 'スプーン', reading: 'スプーン', meaning: 'Löffel', jlpt: 'N5', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-ohashi', japanese: 'お箸', reading: 'おはし', meaning: 'Essstäbchen', jlpt: 'N5', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-sara', japanese: 'お皿', reading: 'おさら', meaning: 'Teller', jlpt: 'N5', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-koppu', japanese: 'コップ', reading: 'コップ', meaning: 'Becher / Glas', jlpt: 'N5', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-chawan', japanese: '茶碗', reading: 'ちゃわん', meaning: 'Reisschale', jlpt: 'N4', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-nabe', japanese: '鍋', reading: 'なべ', meaning: 'Topf', jlpt: 'N4', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-taoru', japanese: 'タオル', reading: 'タオル', meaning: 'Handtuch', jlpt: 'N4', category: 'Küche', partOfSpeech: 'Nomen' },
  { id: 'v-sekken', japanese: '石鹸', reading: 'せっけん', meaning: 'Seife', jlpt: 'N4', category: 'Küche', partOfSpeech: 'Nomen' },

  // Stadt / Gebäude
  { id: 'v-tatemono', japanese: '建物', reading: 'たてもの', meaning: 'Gebäude', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-biru', japanese: 'ビル', reading: 'ビル', meaning: 'Hochhaus', jlpt: 'N5', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-kouban', japanese: '交番', reading: 'こうばん', meaning: 'Polizeiwache', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-jinja', japanese: '神社', reading: 'じんじゃ', meaning: 'Shinto-Schrein', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-otera', japanese: 'お寺', reading: 'おてら', meaning: 'Tempel', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-hashi-bridge', japanese: '橋', reading: 'はし', meaning: 'Brücke', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-kado', japanese: '角', reading: 'かど', meaning: 'Ecke', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-shingou', japanese: '信号', reading: 'しんごう', meaning: 'Ampel', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-koujou', japanese: '工場', reading: 'こうじょう', meaning: 'Fabrik', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },
  { id: 'v-chuushajou', japanese: '駐車場', reading: 'ちゅうしゃじょう', meaning: 'Parkplatz', jlpt: 'N4', category: 'Stadt', partOfSpeech: 'Nomen' },

  // Richtung / Position
  { id: 'v-migi', japanese: '右', reading: 'みぎ', meaning: 'rechts', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-hidari', japanese: '左', reading: 'ひだり', meaning: 'links', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-ue', japanese: '上', reading: 'うえ', meaning: 'oben / auf', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-shita', japanese: '下', reading: 'した', meaning: 'unten / unter', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-naka', japanese: '中', reading: 'なか', meaning: 'drinnen / Mitte', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-soto', japanese: '外', reading: 'そと', meaning: 'draußen', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-mae', japanese: '前', reading: 'まえ', meaning: 'vorne / vor', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-ushiro', japanese: '後ろ', reading: 'うしろ', meaning: 'hinten / hinter', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-tonari', japanese: '隣', reading: 'となり', meaning: 'neben / Nachbar', jlpt: 'N5', category: 'Position', partOfSpeech: 'Nomen' },
  { id: 'v-aida', japanese: '間', reading: 'あいだ', meaning: 'zwischen', jlpt: 'N4', category: 'Position', partOfSpeech: 'Nomen' },

  // Zähler / Mengen
  { id: 'v-hitotsu', japanese: '一つ', reading: 'ひとつ', meaning: 'ein Stück', jlpt: 'N5', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-futatsu', japanese: '二つ', reading: 'ふたつ', meaning: 'zwei Stück', jlpt: 'N5', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-mittsu', japanese: '三つ', reading: 'みっつ', meaning: 'drei Stück', jlpt: 'N5', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-hitori', japanese: '一人', reading: 'ひとり', meaning: 'eine Person / allein', jlpt: 'N5', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-futari', japanese: '二人', reading: 'ふたり', meaning: 'zwei Personen', jlpt: 'N5', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-ippon', japanese: '一本', reading: 'いっぽん', meaning: 'ein (langer Gegenstand)', jlpt: 'N4', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-ichimai', japanese: '一枚', reading: 'いちまい', meaning: 'ein (flacher Gegenstand)', jlpt: 'N4', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-ikko', japanese: '一個', reading: 'いっこ', meaning: 'ein (kleines Objekt)', jlpt: 'N4', category: 'Zähler', partOfSpeech: 'Zähler' },
  { id: 'v-hankbun', japanese: '半分', reading: 'はんぶん', meaning: 'Hälfte', jlpt: 'N4', category: 'Zähler', partOfSpeech: 'Nomen' },
  { id: 'v-ryouhou', japanese: '両方', reading: 'りょうほう', meaning: 'beide', jlpt: 'N4', category: 'Zähler', partOfSpeech: 'Nomen' },

  // Kommunikation (N4/N3)
  { id: 'v-hanashi', japanese: '話', reading: 'はなし', meaning: 'Gespräch / Geschichte', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-henji', japanese: '返事', reading: 'へんじ', meaning: 'Antwort', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-shitsumon', japanese: '質問', reading: 'しつもん', meaning: 'Frage', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-kotae', japanese: '答え', reading: 'こたえ', meaning: 'Antwort / Lösung', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-imi', japanese: '意味', reading: 'いみ', meaning: 'Bedeutung', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-kotoba', japanese: '言葉', reading: 'ことば', meaning: 'Wort / Sprache', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-yakusoku', japanese: '約束', reading: 'やくそく', meaning: 'Versprechen', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-setsumei', japanese: '説明', reading: 'せつめい', meaning: 'Erklärung', jlpt: 'N4', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-renraku', japanese: '連絡', reading: 'れんらく', meaning: 'Kontakt / Mitteilung', jlpt: 'N3', category: 'Kommunikation', partOfSpeech: 'Nomen' },
  { id: 'v-soudan', japanese: '相談', reading: 'そうだん', meaning: 'Beratung / Rücksprache', jlpt: 'N3', category: 'Kommunikation', partOfSpeech: 'Nomen' },

  // Abstrakt / N3-Grundstock
  { id: 'v-riyuu', japanese: '理由', reading: 'りゆう', meaning: 'Grund', jlpt: 'N4', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-kikai', japanese: '機会', reading: 'きかい', meaning: 'Gelegenheit', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-keiken', japanese: '経験', reading: 'けいけん', meaning: 'Erfahrung', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-yotei', japanese: '予定', reading: 'よてい', meaning: 'Plan / Vorhaben', jlpt: 'N4', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-mokuteki', japanese: '目的', reading: 'もくてき', meaning: 'Ziel / Zweck', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-houhou', japanese: '方法', reading: 'ほうほう', meaning: 'Methode', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-mondai', japanese: '問題', reading: 'もんだい', meaning: 'Problem / Aufgabe', jlpt: 'N4', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-kekka', japanese: '結果', reading: 'けっか', meaning: 'Ergebnis', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-genin', japanese: '原因', reading: 'げんいん', meaning: 'Ursache', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-chigai', japanese: '違い', reading: 'ちがい', meaning: 'Unterschied', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-yousu', japanese: '様子', reading: 'ようす', meaning: 'Zustand / Anschein', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-bubun', japanese: '部分', reading: 'ぶぶん', meaning: 'Teil / Abschnitt', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-kankei', japanese: '関係', reading: 'かんけい', meaning: 'Beziehung / Zusammenhang', jlpt: 'N3', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-chikara', japanese: '力', reading: 'ちから', meaning: 'Kraft / Stärke', jlpt: 'N4', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-yume', japanese: '夢', reading: 'ゆめ', meaning: 'Traum', jlpt: 'N4', category: 'Abstrakt', partOfSpeech: 'Nomen' },
  { id: 'v-kokoro', japanese: '心', reading: 'こころ', meaning: 'Herz / Gemüt', jlpt: 'N4', category: 'Abstrakt', partOfSpeech: 'Nomen' },
]

export const vocabCategories = [...new Set(vocabularyData.map(v => v.category))]
