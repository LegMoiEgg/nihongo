export interface KanjiCard {
  id: string
  character: string
  meanings: string[]
  onyomi: string[]    // Chinese reading
  kunyomi: string[]   // Japanese reading
  jlpt: string
  strokes: number
  examples: { word: string; reading: string; meaning: string }[]
  group: string
}

export const kanjiData: KanjiCard[] = [
  // JLPT N5 - Numbers & Basic
  { id: 'kj-ichi', character: '一', meanings: ['Eins'], onyomi: ['イチ'], kunyomi: ['ひと(つ)'], jlpt: 'N5', strokes: 1, group: 'Zahlen', examples: [{ word: '一つ', reading: 'ひとつ', meaning: 'eins (Zähler)' }, { word: '一人', reading: 'ひとり', meaning: 'eine Person' }] },
  { id: 'kj-ni', character: '二', meanings: ['Zwei'], onyomi: ['ニ'], kunyomi: ['ふた(つ)'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '二つ', reading: 'ふたつ', meaning: 'zwei (Zähler)' }, { word: '二人', reading: 'ふたり', meaning: 'zwei Personen' }] },
  { id: 'kj-san', character: '三', meanings: ['Drei'], onyomi: ['サン'], kunyomi: ['み(つ)'], jlpt: 'N5', strokes: 3, group: 'Zahlen', examples: [{ word: '三つ', reading: 'みっつ', meaning: 'drei (Zähler)' }, { word: '三月', reading: 'さんがつ', meaning: 'März' }] },
  { id: 'kj-yon', character: '四', meanings: ['Vier'], onyomi: ['シ'], kunyomi: ['よ(つ)', 'よん'], jlpt: 'N5', strokes: 5, group: 'Zahlen', examples: [{ word: '四つ', reading: 'よっつ', meaning: 'vier (Zähler)' }, { word: '四月', reading: 'しがつ', meaning: 'April' }] },
  { id: 'kj-go', character: '五', meanings: ['Fünf'], onyomi: ['ゴ'], kunyomi: ['いつ(つ)'], jlpt: 'N5', strokes: 4, group: 'Zahlen', examples: [{ word: '五つ', reading: 'いつつ', meaning: 'fünf (Zähler)' }, { word: '五月', reading: 'ごがつ', meaning: 'Mai' }] },
  { id: 'kj-roku', character: '六', meanings: ['Sechs'], onyomi: ['ロク'], kunyomi: ['む(つ)'], jlpt: 'N5', strokes: 4, group: 'Zahlen', examples: [{ word: '六つ', reading: 'むっつ', meaning: 'sechs (Zähler)' }] },
  { id: 'kj-nana', character: '七', meanings: ['Sieben'], onyomi: ['シチ'], kunyomi: ['なな(つ)'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '七つ', reading: 'ななつ', meaning: 'sieben (Zähler)' }] },
  { id: 'kj-hachi', character: '八', meanings: ['Acht'], onyomi: ['ハチ'], kunyomi: ['や(つ)'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '八つ', reading: 'やっつ', meaning: 'acht (Zähler)' }] },
  { id: 'kj-kyuu', character: '九', meanings: ['Neun'], onyomi: ['キュウ', 'ク'], kunyomi: ['ここの(つ)'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '九つ', reading: 'ここのつ', meaning: 'neun (Zähler)' }] },
  { id: 'kj-juu', character: '十', meanings: ['Zehn'], onyomi: ['ジュウ'], kunyomi: ['とお'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '十', reading: 'じゅう', meaning: 'zehn' }] },

  // Nature & Elements
  { id: 'kj-hi', character: '日', meanings: ['Tag', 'Sonne'], onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', 'か'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '日曜日', reading: 'にちようび', meaning: 'Sonntag' }, { word: '今日', reading: 'きょう', meaning: 'heute' }] },
  { id: 'kj-tsuki', character: '月', meanings: ['Monat', 'Mond'], onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '月曜日', reading: 'げつようび', meaning: 'Montag' }, { word: '一月', reading: 'いちがつ', meaning: 'Januar' }] },
  { id: 'kj-mizu', character: '水', meanings: ['Wasser'], onyomi: ['スイ'], kunyomi: ['みず'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '水曜日', reading: 'すいようび', meaning: 'Mittwoch' }, { word: 'お水', reading: 'おみず', meaning: 'Wasser' }] },
  { id: 'kj-hi2', character: '火', meanings: ['Feuer'], onyomi: ['カ'], kunyomi: ['ひ'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '火曜日', reading: 'かようび', meaning: 'Dienstag' }, { word: '火事', reading: 'かじ', meaning: 'Brand' }] },
  { id: 'kj-ki', character: '木', meanings: ['Baum', 'Holz'], onyomi: ['モク', 'ボク'], kunyomi: ['き'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '木曜日', reading: 'もくようび', meaning: 'Donnerstag' }] },
  { id: 'kj-kane', character: '金', meanings: ['Gold', 'Geld', 'Metall'], onyomi: ['キン', 'コン'], kunyomi: ['かね'], jlpt: 'N5', strokes: 8, group: 'Natur', examples: [{ word: '金曜日', reading: 'きんようび', meaning: 'Freitag' }, { word: 'お金', reading: 'おかね', meaning: 'Geld' }] },
  { id: 'kj-tsuchi', character: '土', meanings: ['Erde', 'Boden'], onyomi: ['ド', 'ト'], kunyomi: ['つち'], jlpt: 'N5', strokes: 3, group: 'Natur', examples: [{ word: '土曜日', reading: 'どようび', meaning: 'Samstag' }] },
  { id: 'kj-yama', character: '山', meanings: ['Berg'], onyomi: ['サン'], kunyomi: ['やま'], jlpt: 'N5', strokes: 3, group: 'Natur', examples: [{ word: '富士山', reading: 'ふじさん', meaning: 'Berg Fuji' }] },
  { id: 'kj-kawa', character: '川', meanings: ['Fluss'], onyomi: ['セン'], kunyomi: ['かわ'], jlpt: 'N5', strokes: 3, group: 'Natur', examples: [{ word: '川', reading: 'かわ', meaning: 'Fluss' }] },

  // People & Body
  { id: 'kj-hito', character: '人', meanings: ['Mensch', 'Person'], onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'], jlpt: 'N5', strokes: 2, group: 'Menschen', examples: [{ word: '日本人', reading: 'にほんじん', meaning: 'Japaner' }, { word: '大人', reading: 'おとな', meaning: 'Erwachsener' }] },
  { id: 'kj-otoko', character: '男', meanings: ['Mann', 'männlich'], onyomi: ['ダン'], kunyomi: ['おとこ'], jlpt: 'N5', strokes: 7, group: 'Menschen', examples: [{ word: '男の人', reading: 'おとこのひと', meaning: 'Mann' }] },
  { id: 'kj-onna', character: '女', meanings: ['Frau', 'weiblich'], onyomi: ['ジョ'], kunyomi: ['おんな'], jlpt: 'N5', strokes: 3, group: 'Menschen', examples: [{ word: '女の人', reading: 'おんなのひと', meaning: 'Frau' }] },
  { id: 'kj-ko', character: '子', meanings: ['Kind'], onyomi: ['シ', 'ス'], kunyomi: ['こ'], jlpt: 'N5', strokes: 3, group: 'Menschen', examples: [{ word: '子ども', reading: 'こども', meaning: 'Kind' }, { word: '女の子', reading: 'おんなのこ', meaning: 'Mädchen' }] },
  { id: 'kj-me', character: '目', meanings: ['Auge'], onyomi: ['モク'], kunyomi: ['め'], jlpt: 'N5', strokes: 5, group: 'Menschen', examples: [{ word: '目', reading: 'め', meaning: 'Auge' }] },
  { id: 'kj-te', character: '手', meanings: ['Hand'], onyomi: ['シュ'], kunyomi: ['て'], jlpt: 'N5', strokes: 4, group: 'Menschen', examples: [{ word: '手紙', reading: 'てがみ', meaning: 'Brief' }] },
  { id: 'kj-ashi', character: '足', meanings: ['Fuß', 'Bein', 'genug'], onyomi: ['ソク'], kunyomi: ['あし', 'た(りる)'], jlpt: 'N5', strokes: 7, group: 'Menschen', examples: [{ word: '足', reading: 'あし', meaning: 'Fuß/Bein' }] },

  // Size & Direction
  { id: 'kj-ookii', character: '大', meanings: ['Groß'], onyomi: ['ダイ', 'タイ'], kunyomi: ['おお(きい)'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '大きい', reading: 'おおきい', meaning: 'groß' }, { word: '大学', reading: 'だいがく', meaning: 'Universität' }] },
  { id: 'kj-chiisai', character: '小', meanings: ['Klein'], onyomi: ['ショウ'], kunyomi: ['ちい(さい)', 'こ'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '小さい', reading: 'ちいさい', meaning: 'klein' }, { word: '小学校', reading: 'しょうがっこう', meaning: 'Grundschule' }] },
  { id: 'kj-naka', character: '中', meanings: ['Mitte', 'Innen', 'während'], onyomi: ['チュウ'], kunyomi: ['なか'], jlpt: 'N5', strokes: 4, group: 'Größe', examples: [{ word: '中国', reading: 'ちゅうごく', meaning: 'China' }, { word: '中', reading: 'なか', meaning: 'Mitte/Innen' }] },
  { id: 'kj-ue', character: '上', meanings: ['Oben', 'Auf', 'hinauf'], onyomi: ['ジョウ'], kunyomi: ['うえ', 'あ(げる)', 'のぼ(る)'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '上', reading: 'うえ', meaning: 'oben' }] },
  { id: 'kj-shita', character: '下', meanings: ['Unten', 'Unter', 'hinunter'], onyomi: ['カ', 'ゲ'], kunyomi: ['した', 'さ(げる)', 'くだ(る)'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '下', reading: 'した', meaning: 'unten' }] },
]

export const kanjiGroups = [...new Set(kanjiData.map(k => k.group))]
