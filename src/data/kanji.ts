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
  { id: 'kj-ichi', character: '一', meanings: ['Eins', 'erste', 'ganz'], onyomi: ['イチ', 'イツ'], kunyomi: ['ひと(つ)'], jlpt: 'N5', strokes: 1, group: 'Zahlen', examples: [{ word: '一つ', reading: 'ひとつ', meaning: 'eins (Zähler)' }, { word: '一人', reading: 'ひとり', meaning: 'eine Person' }] },
  { id: 'kj-ni', character: '二', meanings: ['Zwei', 'zweite', 'doppelt'], onyomi: ['ニ'], kunyomi: ['ふた(つ)'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '二つ', reading: 'ふたつ', meaning: 'zwei (Zähler)' }, { word: '二人', reading: 'ふたり', meaning: 'zwei Personen' }] },
  { id: 'kj-san', character: '三', meanings: ['Drei', 'dritte'], onyomi: ['サン'], kunyomi: ['み(つ)', 'みっ(つ)'], jlpt: 'N5', strokes: 3, group: 'Zahlen', examples: [{ word: '三つ', reading: 'みっつ', meaning: 'drei (Zähler)' }, { word: '三月', reading: 'さんがつ', meaning: 'März' }] },
  { id: 'kj-yon', character: '四', meanings: ['Vier', 'vierte'], onyomi: ['シ'], kunyomi: ['よ(つ)', 'よん', 'よっ(つ)'], jlpt: 'N5', strokes: 5, group: 'Zahlen', examples: [{ word: '四つ', reading: 'よっつ', meaning: 'vier (Zähler)' }, { word: '四月', reading: 'しがつ', meaning: 'April' }] },
  { id: 'kj-go', character: '五', meanings: ['Fünf', 'fünfte'], onyomi: ['ゴ'], kunyomi: ['いつ(つ)'], jlpt: 'N5', strokes: 4, group: 'Zahlen', examples: [{ word: '五つ', reading: 'いつつ', meaning: 'fünf (Zähler)' }, { word: '五月', reading: 'ごがつ', meaning: 'Mai' }] },
  { id: 'kj-roku', character: '六', meanings: ['Sechs', 'sechste'], onyomi: ['ロク'], kunyomi: ['む(つ)', 'むっ(つ)'], jlpt: 'N5', strokes: 4, group: 'Zahlen', examples: [{ word: '六つ', reading: 'むっつ', meaning: 'sechs (Zähler)' }] },
  { id: 'kj-nana', character: '七', meanings: ['Sieben', 'siebte'], onyomi: ['シチ'], kunyomi: ['なな(つ)', 'なの'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '七つ', reading: 'ななつ', meaning: 'sieben (Zähler)' }] },
  { id: 'kj-hachi', character: '八', meanings: ['Acht', 'achte'], onyomi: ['ハチ'], kunyomi: ['や(つ)', 'やっ(つ)', 'よう'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '八つ', reading: 'やっつ', meaning: 'acht (Zähler)' }] },
  { id: 'kj-kyuu', character: '九', meanings: ['Neun', 'neunte'], onyomi: ['キュウ', 'ク'], kunyomi: ['ここの(つ)'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '九つ', reading: 'ここのつ', meaning: 'neun (Zähler)' }] },
  { id: 'kj-juu', character: '十', meanings: ['Zehn', 'zehnte', 'voll'], onyomi: ['ジュウ', 'ジッ'], kunyomi: ['とお', 'と'], jlpt: 'N5', strokes: 2, group: 'Zahlen', examples: [{ word: '十', reading: 'じゅう', meaning: 'zehn' }] },

  // Nature & Elements
  { id: 'kj-hi', character: '日', meanings: ['Tag', 'Sonne'], onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', 'か'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '日曜日', reading: 'にちようび', meaning: 'Sonntag' }, { word: '今日', reading: 'きょう', meaning: 'heute' }] },
  { id: 'kj-tsuki', character: '月', meanings: ['Monat', 'Mond'], onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '月曜日', reading: 'げつようび', meaning: 'Montag' }, { word: '一月', reading: 'いちがつ', meaning: 'Januar' }] },
  { id: 'kj-mizu', character: '水', meanings: ['Wasser'], onyomi: ['スイ'], kunyomi: ['みず'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '水曜日', reading: 'すいようび', meaning: 'Mittwoch' }, { word: 'お水', reading: 'おみず', meaning: 'Wasser' }] },
  { id: 'kj-hi2', character: '火', meanings: ['Feuer'], onyomi: ['カ'], kunyomi: ['ひ', 'ほ'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '火曜日', reading: 'かようび', meaning: 'Dienstag' }, { word: '火事', reading: 'かじ', meaning: 'Brand' }] },
  { id: 'kj-ki', character: '木', meanings: ['Baum', 'Holz'], onyomi: ['モク', 'ボク'], kunyomi: ['き', 'こ'], jlpt: 'N5', strokes: 4, group: 'Natur', examples: [{ word: '木曜日', reading: 'もくようび', meaning: 'Donnerstag' }] },
  { id: 'kj-kane', character: '金', meanings: ['Gold', 'Geld', 'Metall'], onyomi: ['キン', 'コン'], kunyomi: ['かね', 'かな'], jlpt: 'N5', strokes: 8, group: 'Natur', examples: [{ word: '金曜日', reading: 'きんようび', meaning: 'Freitag' }, { word: 'お金', reading: 'おかね', meaning: 'Geld' }] },
  { id: 'kj-tsuchi', character: '土', meanings: ['Erde', 'Boden'], onyomi: ['ド', 'ト'], kunyomi: ['つち'], jlpt: 'N5', strokes: 3, group: 'Natur', examples: [{ word: '土曜日', reading: 'どようび', meaning: 'Samstag' }] },
  { id: 'kj-yama', character: '山', meanings: ['Berg'], onyomi: ['サン'], kunyomi: ['やま'], jlpt: 'N5', strokes: 3, group: 'Natur', examples: [{ word: '富士山', reading: 'ふじさん', meaning: 'Berg Fuji' }] },
  { id: 'kj-kawa', character: '川', meanings: ['Fluss'], onyomi: ['セン'], kunyomi: ['かわ'], jlpt: 'N5', strokes: 3, group: 'Natur', examples: [{ word: '川', reading: 'かわ', meaning: 'Fluss' }] },

  // People & Body
  { id: 'kj-hito', character: '人', meanings: ['Mensch', 'Person', 'Leute'], onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'], jlpt: 'N5', strokes: 2, group: 'Menschen', examples: [{ word: '日本人', reading: 'にほんじん', meaning: 'Japaner' }, { word: '大人', reading: 'おとな', meaning: 'Erwachsener' }] },
  { id: 'kj-otoko', character: '男', meanings: ['Mann', 'männlich', 'Junge'], onyomi: ['ダン', 'ナン'], kunyomi: ['おとこ'], jlpt: 'N5', strokes: 7, group: 'Menschen', examples: [{ word: '男の人', reading: 'おとこのひと', meaning: 'Mann' }] },
  { id: 'kj-onna', character: '女', meanings: ['Frau', 'weiblich', 'Mädchen'], onyomi: ['ジョ', 'ニョ'], kunyomi: ['おんな', 'め'], jlpt: 'N5', strokes: 3, group: 'Menschen', examples: [{ word: '女の人', reading: 'おんなのひと', meaning: 'Frau' }] },
  { id: 'kj-ko', character: '子', meanings: ['Kind', 'Nachkomme'], onyomi: ['シ', 'ス'], kunyomi: ['こ'], jlpt: 'N5', strokes: 3, group: 'Menschen', examples: [{ word: '子ども', reading: 'こども', meaning: 'Kind' }, { word: '女の子', reading: 'おんなのこ', meaning: 'Mädchen' }] },
  { id: 'kj-me', character: '目', meanings: ['Auge', 'Blick'], onyomi: ['モク', 'ボク'], kunyomi: ['め', 'ま'], jlpt: 'N5', strokes: 5, group: 'Menschen', examples: [{ word: '目', reading: 'め', meaning: 'Auge' }] },
  { id: 'kj-te', character: '手', meanings: ['Hand'], onyomi: ['シュ'], kunyomi: ['て', 'た'], jlpt: 'N5', strokes: 4, group: 'Menschen', examples: [{ word: '手紙', reading: 'てがみ', meaning: 'Brief' }] },
  { id: 'kj-ashi', character: '足', meanings: ['Fuß', 'Bein', 'genug', 'hinzufügen'], onyomi: ['ソク'], kunyomi: ['あし', 'た(りる)', 'た(す)'], jlpt: 'N5', strokes: 7, group: 'Menschen', examples: [{ word: '足', reading: 'あし', meaning: 'Fuß/Bein' }] },

  // Size & Direction
  { id: 'kj-ookii', character: '大', meanings: ['Groß', 'gewaltig', 'sehr'], onyomi: ['ダイ', 'タイ'], kunyomi: ['おお(きい)'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '大きい', reading: 'おおきい', meaning: 'groß' }, { word: '大学', reading: 'だいがく', meaning: 'Universität' }] },
  { id: 'kj-chiisai', character: '小', meanings: ['Klein', 'gering'], onyomi: ['ショウ'], kunyomi: ['ちい(さい)', 'こ', 'お'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '小さい', reading: 'ちいさい', meaning: 'klein' }, { word: '小学校', reading: 'しょうがっこう', meaning: 'Grundschule' }] },
  { id: 'kj-naka', character: '中', meanings: ['Mitte', 'Innen', 'während', 'Zentrum'], onyomi: ['チュウ'], kunyomi: ['なか'], jlpt: 'N5', strokes: 4, group: 'Größe', examples: [{ word: '中国', reading: 'ちゅうごく', meaning: 'China' }, { word: '中', reading: 'なか', meaning: 'Mitte/Innen' }] },
  { id: 'kj-ue', character: '上', meanings: ['Oben', 'Auf', 'hinauf', 'steigen'], onyomi: ['ジョウ'], kunyomi: ['うえ', 'あ(げる)', 'のぼ(る)'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '上', reading: 'うえ', meaning: 'oben' }] },
  { id: 'kj-shita', character: '下', meanings: ['Unten', 'Unter', 'hinunter', 'senken'], onyomi: ['カ', 'ゲ'], kunyomi: ['した', 'さ(げる)', 'くだ(る)', 'お(りる)'], jlpt: 'N5', strokes: 3, group: 'Größe', examples: [{ word: '下', reading: 'した', meaning: 'unten' }] },

  // ───────────────────────── Erweiterung: N5 vervollständigen ──
  // Richtung & Position
  { id: 'kj-hidari', character: '左', meanings: ['Links'], onyomi: ['サ'], kunyomi: ['ひだり'], jlpt: 'N5', strokes: 5, group: 'Richtung', examples: [{ word: '左', reading: 'ひだり', meaning: 'links' }, { word: '左手', reading: 'ひだりて', meaning: 'linke Hand' }] },
  { id: 'kj-migi', character: '右', meanings: ['Rechts'], onyomi: ['ウ', 'ユウ'], kunyomi: ['みぎ'], jlpt: 'N5', strokes: 5, group: 'Richtung', examples: [{ word: '右', reading: 'みぎ', meaning: 'rechts' }, { word: '右手', reading: 'みぎて', meaning: 'rechte Hand' }] },
  { id: 'kj-mae', character: '前', meanings: ['Vorne', 'vor', 'früher'], onyomi: ['ゼン'], kunyomi: ['まえ'], jlpt: 'N5', strokes: 9, group: 'Richtung', examples: [{ word: '前', reading: 'まえ', meaning: 'vorne' }, { word: '午前', reading: 'ごぜん', meaning: 'Vormittag' }] },
  { id: 'kj-ushiro', character: '後', meanings: ['Hinten', 'nach', 'später'], onyomi: ['ゴ', 'コウ'], kunyomi: ['うし(ろ)', 'あと', 'のち'], jlpt: 'N5', strokes: 9, group: 'Richtung', examples: [{ word: '後ろ', reading: 'うしろ', meaning: 'hinten' }, { word: '午後', reading: 'ごご', meaning: 'Nachmittag' }] },
  { id: 'kj-higashi', character: '東', meanings: ['Osten'], onyomi: ['トウ'], kunyomi: ['ひがし'], jlpt: 'N5', strokes: 8, group: 'Richtung', examples: [{ word: '東', reading: 'ひがし', meaning: 'Osten' }, { word: '東京', reading: 'とうきょう', meaning: 'Tokio' }] },
  { id: 'kj-nishi', character: '西', meanings: ['Westen'], onyomi: ['セイ', 'サイ'], kunyomi: ['にし'], jlpt: 'N5', strokes: 6, group: 'Richtung', examples: [{ word: '西', reading: 'にし', meaning: 'Westen' }] },
  { id: 'kj-minami', character: '南', meanings: ['Süden'], onyomi: ['ナン'], kunyomi: ['みなみ'], jlpt: 'N5', strokes: 9, group: 'Richtung', examples: [{ word: '南', reading: 'みなみ', meaning: 'Süden' }] },
  { id: 'kj-kita', character: '北', meanings: ['Norden'], onyomi: ['ホク'], kunyomi: ['きた'], jlpt: 'N5', strokes: 5, group: 'Richtung', examples: [{ word: '北', reading: 'きた', meaning: 'Norden' }] },

  // Zeit
  { id: 'kj-nen', character: '年', meanings: ['Jahr'], onyomi: ['ネン'], kunyomi: ['とし'], jlpt: 'N5', strokes: 6, group: 'Zeit', examples: [{ word: '今年', reading: 'ことし', meaning: 'dieses Jahr' }, { word: '来年', reading: 'らいねん', meaning: 'nächstes Jahr' }] },
  { id: 'kj-ima', character: '今', meanings: ['Jetzt'], onyomi: ['コン', 'キン'], kunyomi: ['いま'], jlpt: 'N5', strokes: 4, group: 'Zeit', examples: [{ word: '今', reading: 'いま', meaning: 'jetzt' }, { word: '今日', reading: 'きょう', meaning: 'heute' }] },
  { id: 'kj-ji', character: '時', meanings: ['Zeit', 'Uhr', 'Stunde'], onyomi: ['ジ'], kunyomi: ['とき'], jlpt: 'N5', strokes: 10, group: 'Zeit', examples: [{ word: '時間', reading: 'じかん', meaning: 'Zeit' }, { word: '何時', reading: 'なんじ', meaning: 'wie viel Uhr' }] },
  { id: 'kj-kan', character: '間', meanings: ['Zwischenraum', 'Intervall', 'zwischen'], onyomi: ['カン', 'ケン'], kunyomi: ['あいだ', 'ま'], jlpt: 'N5', strokes: 12, group: 'Zeit', examples: [{ word: '時間', reading: 'じかん', meaning: 'Zeit' }, { word: '人間', reading: 'にんげん', meaning: 'Mensch' }] },
  { id: 'kj-mae-half', character: '半', meanings: ['Hälfte', 'halb'], onyomi: ['ハン'], kunyomi: ['なか(ば)'], jlpt: 'N5', strokes: 5, group: 'Zeit', examples: [{ word: '半分', reading: 'はんぶん', meaning: 'Hälfte' }, { word: '半', reading: 'はん', meaning: 'halb (Uhrzeit)' }] },

  // Verben-Kanji (Aktionen)
  { id: 'kj-iku', character: '行', meanings: ['Gehen', 'ausführen'], onyomi: ['コウ', 'ギョウ'], kunyomi: ['い(く)', 'おこな(う)'], jlpt: 'N5', strokes: 6, group: 'Aktionen', examples: [{ word: '行く', reading: 'いく', meaning: 'gehen' }, { word: '銀行', reading: 'ぎんこう', meaning: 'Bank' }] },
  { id: 'kj-kuru', character: '来', meanings: ['Kommen'], onyomi: ['ライ'], kunyomi: ['く(る)', 'き(ます)'], jlpt: 'N5', strokes: 7, group: 'Aktionen', examples: [{ word: '来る', reading: 'くる', meaning: 'kommen' }, { word: '来年', reading: 'らいねん', meaning: 'nächstes Jahr' }] },
  { id: 'kj-miru', character: '見', meanings: ['Sehen'], onyomi: ['ケン'], kunyomi: ['み(る)'], jlpt: 'N5', strokes: 7, group: 'Aktionen', examples: [{ word: '見る', reading: 'みる', meaning: 'sehen' }] },
  { id: 'kj-kiku', character: '聞', meanings: ['Hören', 'fragen'], onyomi: ['ブン', 'モン'], kunyomi: ['き(く)'], jlpt: 'N5', strokes: 14, group: 'Aktionen', examples: [{ word: '聞く', reading: 'きく', meaning: 'hören' }, { word: '新聞', reading: 'しんぶん', meaning: 'Zeitung' }] },
  { id: 'kj-iu', character: '言', meanings: ['Sagen', 'Wort'], onyomi: ['ゲン', 'ゴン'], kunyomi: ['い(う)', 'こと'], jlpt: 'N5', strokes: 7, group: 'Aktionen', examples: [{ word: '言う', reading: 'いう', meaning: 'sagen' }, { word: '言葉', reading: 'ことば', meaning: 'Wort' }] },
  { id: 'kj-taberu', character: '食', meanings: ['Essen'], onyomi: ['ショク'], kunyomi: ['た(べる)', 'く(う)'], jlpt: 'N5', strokes: 9, group: 'Aktionen', examples: [{ word: '食べる', reading: 'たべる', meaning: 'essen' }, { word: '食事', reading: 'しょくじ', meaning: 'Mahlzeit' }] },
  { id: 'kj-nomu', character: '飲', meanings: ['Trinken'], onyomi: ['イン'], kunyomi: ['の(む)'], jlpt: 'N5', strokes: 12, group: 'Aktionen', examples: [{ word: '飲む', reading: 'のむ', meaning: 'trinken' }, { word: '飲み物', reading: 'のみもの', meaning: 'Getränk' }] },
  { id: 'kj-yomu', character: '読', meanings: ['Lesen'], onyomi: ['ドク', 'トク'], kunyomi: ['よ(む)'], jlpt: 'N5', strokes: 14, group: 'Aktionen', examples: [{ word: '読む', reading: 'よむ', meaning: 'lesen' }, { word: '読書', reading: 'どくしょ', meaning: 'Lektüre' }] },
  { id: 'kj-kaku', character: '書', meanings: ['Schreiben'], onyomi: ['ショ'], kunyomi: ['か(く)'], jlpt: 'N5', strokes: 10, group: 'Aktionen', examples: [{ word: '書く', reading: 'かく', meaning: 'schreiben' }, { word: '辞書', reading: 'じしょ', meaning: 'Wörterbuch' }] },
  { id: 'kj-hanasu', character: '話', meanings: ['Sprechen', 'Geschichte'], onyomi: ['ワ'], kunyomi: ['はな(す)', 'はなし'], jlpt: 'N5', strokes: 13, group: 'Aktionen', examples: [{ word: '話す', reading: 'はなす', meaning: 'sprechen' }, { word: '電話', reading: 'でんわ', meaning: 'Telefon' }] },
  { id: 'kj-kau', character: '買', meanings: ['Kaufen'], onyomi: ['バイ'], kunyomi: ['か(う)'], jlpt: 'N5', strokes: 12, group: 'Aktionen', examples: [{ word: '買う', reading: 'かう', meaning: 'kaufen' }, { word: '買い物', reading: 'かいもの', meaning: 'Einkauf' }] },
  { id: 'kj-deru', character: '出', meanings: ['Herausgehen', 'herausnehmen'], onyomi: ['シュツ'], kunyomi: ['で(る)', 'だ(す)'], jlpt: 'N5', strokes: 5, group: 'Aktionen', examples: [{ word: '出る', reading: 'でる', meaning: 'hinausgehen' }, { word: '出口', reading: 'でぐち', meaning: 'Ausgang' }] },
  { id: 'kj-hairu', character: '入', meanings: ['Hineingehen', 'eintreten'], onyomi: ['ニュウ'], kunyomi: ['はい(る)', 'い(れる)'], jlpt: 'N5', strokes: 2, group: 'Aktionen', examples: [{ word: '入る', reading: 'はいる', meaning: 'hineingehen' }, { word: '入口', reading: 'いりぐち', meaning: 'Eingang' }] },
  { id: 'kj-tatsu', character: '立', meanings: ['Stehen', 'aufstehen'], onyomi: ['リツ'], kunyomi: ['た(つ)'], jlpt: 'N5', strokes: 5, group: 'Aktionen', examples: [{ word: '立つ', reading: 'たつ', meaning: 'stehen' }] },
  { id: 'kj-yasumu', character: '休', meanings: ['Ausruhen', 'Pause'], onyomi: ['キュウ'], kunyomi: ['やす(む)'], jlpt: 'N5', strokes: 6, group: 'Aktionen', examples: [{ word: '休む', reading: 'やすむ', meaning: 'sich ausruhen' }, { word: '休日', reading: 'きゅうじつ', meaning: 'Feiertag' }] },

  // Schule & Alltag
  { id: 'kj-gaku', character: '学', meanings: ['Lernen', 'Studium', 'Wissenschaft'], onyomi: ['ガク'], kunyomi: ['まな(ぶ)'], jlpt: 'N5', strokes: 8, group: 'Schule', examples: [{ word: '学生', reading: 'がくせい', meaning: 'Schüler' }, { word: '大学', reading: 'だいがく', meaning: 'Universität' }] },
  { id: 'kj-kou', character: '校', meanings: ['Schule'], onyomi: ['コウ'], kunyomi: [], jlpt: 'N5', strokes: 10, group: 'Schule', examples: [{ word: '学校', reading: 'がっこう', meaning: 'Schule' }, { word: '高校', reading: 'こうこう', meaning: 'Oberschule' }] },
  { id: 'kj-sei', character: '生', meanings: ['Leben', 'geboren werden', 'Schüler'], onyomi: ['セイ', 'ショウ'], kunyomi: ['い(きる)', 'う(まれる)', 'なま'], jlpt: 'N5', strokes: 5, group: 'Schule', examples: [{ word: '学生', reading: 'がくせい', meaning: 'Schüler' }, { word: '先生', reading: 'せんせい', meaning: 'Lehrer' }] },
  { id: 'kj-sen', character: '先', meanings: ['Vorher', 'Spitze', 'voraus'], onyomi: ['セン'], kunyomi: ['さき'], jlpt: 'N5', strokes: 6, group: 'Schule', examples: [{ word: '先生', reading: 'せんせい', meaning: 'Lehrer' }, { word: '先週', reading: 'せんしゅう', meaning: 'letzte Woche' }] },
  { id: 'kj-bun', character: '文', meanings: ['Text', 'Satz', 'Schrift'], onyomi: ['ブン', 'モン'], kunyomi: ['ふみ'], jlpt: 'N5', strokes: 4, group: 'Schule', examples: [{ word: '文', reading: 'ぶん', meaning: 'Satz' }, { word: '作文', reading: 'さくぶん', meaning: 'Aufsatz' }] },
  { id: 'kj-dokugo', character: '語', meanings: ['Sprache', 'Wort'], onyomi: ['ゴ'], kunyomi: ['かた(る)'], jlpt: 'N5', strokes: 14, group: 'Schule', examples: [{ word: '日本語', reading: 'にほんご', meaning: 'Japanisch' }, { word: '英語', reading: 'えいご', meaning: 'Englisch' }] },
  { id: 'kj-hon', character: '本', meanings: ['Buch', 'Ursprung', 'Haupt-'], onyomi: ['ホン'], kunyomi: ['ほん', 'もと'], jlpt: 'N5', strokes: 5, group: 'Schule', examples: [{ word: '本', reading: 'ほん', meaning: 'Buch' }, { word: '日本', reading: 'にほん', meaning: 'Japan' }] },
  { id: 'kj-mei', character: '名', meanings: ['Name', 'berühmt'], onyomi: ['メイ', 'ミョウ'], kunyomi: ['な'], jlpt: 'N5', strokes: 6, group: 'Schule', examples: [{ word: '名前', reading: 'なまえ', meaning: 'Name' }, { word: '有名', reading: 'ゆうめい', meaning: 'berühmt' }] },

  // Geld & Mengen
  { id: 'kj-en', character: '円', meanings: ['Yen', 'rund', 'Kreis'], onyomi: ['エン'], kunyomi: ['まる(い)'], jlpt: 'N5', strokes: 4, group: 'Alltag', examples: [{ word: '百円', reading: 'ひゃくえん', meaning: '100 Yen' }] },
  { id: 'kj-hyaku', character: '百', meanings: ['Hundert'], onyomi: ['ヒャク'], kunyomi: [], jlpt: 'N5', strokes: 6, group: 'Alltag', examples: [{ word: '百', reading: 'ひゃく', meaning: 'hundert' }] },
  { id: 'kj-sen-thousand', character: '千', meanings: ['Tausend'], onyomi: ['セン'], kunyomi: ['ち'], jlpt: 'N5', strokes: 3, group: 'Alltag', examples: [{ word: '千', reading: 'せん', meaning: 'tausend' }] },
  { id: 'kj-man', character: '万', meanings: ['Zehntausend', 'zahllos'], onyomi: ['マン', 'バン'], kunyomi: [], jlpt: 'N5', strokes: 3, group: 'Alltag', examples: [{ word: '一万', reading: 'いちまん', meaning: 'zehntausend' }] },
  { id: 'kj-kuni', character: '国', meanings: ['Land', 'Nation'], onyomi: ['コク'], kunyomi: ['くに'], jlpt: 'N5', strokes: 8, group: 'Alltag', examples: [{ word: '国', reading: 'くに', meaning: 'Land' }, { word: '中国', reading: 'ちゅうごく', meaning: 'China' }] },
  { id: 'kj-sha', character: '車', meanings: ['Wagen', 'Fahrzeug', 'Rad'], onyomi: ['シャ'], kunyomi: ['くるま'], jlpt: 'N5', strokes: 7, group: 'Alltag', examples: [{ word: '車', reading: 'くるま', meaning: 'Auto' }, { word: '電車', reading: 'でんしゃ', meaning: 'Zug' }] },
  { id: 'kj-den', character: '電', meanings: ['Elektrizität', 'Blitz'], onyomi: ['デン'], kunyomi: [], jlpt: 'N5', strokes: 13, group: 'Alltag', examples: [{ word: '電車', reading: 'でんしゃ', meaning: 'Zug' }, { word: '電話', reading: 'でんわ', meaning: 'Telefon' }] },
  { id: 'kj-ki-spirit', character: '気', meanings: ['Geist', 'Energie', 'Stimmung'], onyomi: ['キ', 'ケ'], kunyomi: [], jlpt: 'N5', strokes: 6, group: 'Alltag', examples: [{ word: '元気', reading: 'げんき', meaning: 'munter' }, { word: '天気', reading: 'てんき', meaning: 'Wetter' }] },
  { id: 'kj-ame-rain', character: '雨', meanings: ['Regen'], onyomi: ['ウ'], kunyomi: ['あめ'], jlpt: 'N5', strokes: 8, group: 'Natur', examples: [{ word: '雨', reading: 'あめ', meaning: 'Regen' }] },
  { id: 'kj-hana-flower', character: '花', meanings: ['Blume'], onyomi: ['カ'], kunyomi: ['はな'], jlpt: 'N5', strokes: 7, group: 'Natur', examples: [{ word: '花', reading: 'はな', meaning: 'Blume' }, { word: '花火', reading: 'はなび', meaning: 'Feuerwerk' }] },
  { id: 'kj-sora', character: '空', meanings: ['Himmel', 'Leere', 'leer'], onyomi: ['クウ'], kunyomi: ['そら', 'あ(く)', 'から'], jlpt: 'N5', strokes: 8, group: 'Natur', examples: [{ word: '空', reading: 'そら', meaning: 'Himmel' }, { word: '空港', reading: 'くうこう', meaning: 'Flughafen' }] },

  // ───────────────────────── N4-Block ──
  { id: 'kj-kai', character: '会', meanings: ['Treffen', 'Versammlung'], onyomi: ['カイ', 'エ'], kunyomi: ['あ(う)'], jlpt: 'N4', strokes: 6, group: 'N4 Alltag', examples: [{ word: '会社', reading: 'かいしゃ', meaning: 'Firma' }, { word: '会う', reading: 'あう', meaning: 'sich treffen' }] },
  { id: 'kj-sha-company', character: '社', meanings: ['Firma', 'Gesellschaft', 'Schrein'], onyomi: ['シャ'], kunyomi: ['やしろ'], jlpt: 'N4', strokes: 7, group: 'N4 Alltag', examples: [{ word: '会社', reading: 'かいしゃ', meaning: 'Firma' }, { word: '神社', reading: 'じんじゃ', meaning: 'Schrein' }] },
  { id: 'kj-dou', character: '道', meanings: ['Weg', 'Straße', 'Pfad'], onyomi: ['ドウ', 'トウ'], kunyomi: ['みち'], jlpt: 'N4', strokes: 12, group: 'N4 Alltag', examples: [{ word: '道', reading: 'みち', meaning: 'Straße' }, { word: '北海道', reading: 'ほっかいどう', meaning: 'Hokkaido' }] },
  { id: 'kj-eki', character: '駅', meanings: ['Bahnhof'], onyomi: ['エキ'], kunyomi: [], jlpt: 'N4', strokes: 14, group: 'N4 Alltag', examples: [{ word: '駅', reading: 'えき', meaning: 'Bahnhof' }] },
  { id: 'kj-ryou', character: '料', meanings: ['Gebühr', 'Material', 'Zutat'], onyomi: ['リョウ'], kunyomi: [], jlpt: 'N4', strokes: 10, group: 'N4 Alltag', examples: [{ word: '料理', reading: 'りょうり', meaning: 'Kochen/Gericht' }] },
  { id: 'kj-ri', character: '理', meanings: ['Logik', 'Vernunft', 'Prinzip'], onyomi: ['リ'], kunyomi: [], jlpt: 'N4', strokes: 11, group: 'N4 Alltag', examples: [{ word: '料理', reading: 'りょうり', meaning: 'Kochen' }, { word: '理由', reading: 'りゆう', meaning: 'Grund' }] },
  { id: 'kj-motsu', character: '持', meanings: ['Halten', 'besitzen'], onyomi: ['ジ'], kunyomi: ['も(つ)'], jlpt: 'N4', strokes: 9, group: 'N4 Aktionen', examples: [{ word: '持つ', reading: 'もつ', meaning: 'halten' }, { word: '気持ち', reading: 'きもち', meaning: 'Gefühl' }] },
  { id: 'kj-matsu', character: '待', meanings: ['Warten'], onyomi: ['タイ'], kunyomi: ['ま(つ)'], jlpt: 'N4', strokes: 9, group: 'N4 Aktionen', examples: [{ word: '待つ', reading: 'まつ', meaning: 'warten' }] },
  { id: 'kj-mochiiru', character: '使', meanings: ['Benutzen', 'Gesandter'], onyomi: ['シ'], kunyomi: ['つか(う)'], jlpt: 'N4', strokes: 8, group: 'N4 Aktionen', examples: [{ word: '使う', reading: 'つかう', meaning: 'benutzen' }] },
  { id: 'kj-oshieru', character: '教', meanings: ['Lehren', 'Religion'], onyomi: ['キョウ'], kunyomi: ['おし(える)', 'おそ(わる)'], jlpt: 'N4', strokes: 11, group: 'N4 Aktionen', examples: [{ word: '教える', reading: 'おしえる', meaning: 'lehren' }, { word: '教室', reading: 'きょうしつ', meaning: 'Klassenzimmer' }] },
  { id: 'kj-shiru', character: '知', meanings: ['Wissen', 'kennen'], onyomi: ['チ'], kunyomi: ['し(る)'], jlpt: 'N4', strokes: 8, group: 'N4 Aktionen', examples: [{ word: '知る', reading: 'しる', meaning: 'wissen' }] },
  { id: 'kj-kangaeru', character: '考', meanings: ['Denken', 'überlegen'], onyomi: ['コウ'], kunyomi: ['かんが(える)'], jlpt: 'N4', strokes: 6, group: 'N4 Aktionen', examples: [{ word: '考える', reading: 'かんがえる', meaning: 'nachdenken' }] },
  { id: 'kj-ryokou', character: '旅', meanings: ['Reise'], onyomi: ['リョ'], kunyomi: ['たび'], jlpt: 'N4', strokes: 10, group: 'N4 Alltag', examples: [{ word: '旅行', reading: 'りょこう', meaning: 'Reise' }] },
  { id: 'kj-kou-travel', character: '工', meanings: ['Handwerk', 'Konstruktion'], onyomi: ['コウ', 'ク'], kunyomi: [], jlpt: 'N4', strokes: 3, group: 'N4 Alltag', examples: [{ word: '工場', reading: 'こうじょう', meaning: 'Fabrik' }] },
  { id: 'kj-ryoku', character: '力', meanings: ['Kraft', 'Stärke'], onyomi: ['リョク', 'リキ'], kunyomi: ['ちから'], jlpt: 'N4', strokes: 2, group: 'N4 Alltag', examples: [{ word: '力', reading: 'ちから', meaning: 'Kraft' }, { word: '電力', reading: 'でんりょく', meaning: 'elektrische Leistung' }] },
  { id: 'kj-kokoro', character: '心', meanings: ['Herz', 'Geist', 'Gemüt'], onyomi: ['シン'], kunyomi: ['こころ'], jlpt: 'N4', strokes: 4, group: 'N4 Alltag', examples: [{ word: '心', reading: 'こころ', meaning: 'Herz' }, { word: '心配', reading: 'しんぱい', meaning: 'Sorge' }] },
  { id: 'kj-oto', character: '音', meanings: ['Klang', 'Geräusch'], onyomi: ['オン', 'イン'], kunyomi: ['おと', 'ね'], jlpt: 'N4', strokes: 9, group: 'N4 Alltag', examples: [{ word: '音楽', reading: 'おんがく', meaning: 'Musik' }, { word: '音', reading: 'おと', meaning: 'Klang' }] },
  { id: 'kj-gaku-music', character: '楽', meanings: ['Freude', 'bequem', 'Musik'], onyomi: ['ガク', 'ラク'], kunyomi: ['たの(しい)'], jlpt: 'N4', strokes: 13, group: 'N4 Alltag', examples: [{ word: '音楽', reading: 'おんがく', meaning: 'Musik' }, { word: '楽しい', reading: 'たのしい', meaning: 'spaßig' }] },
  { id: 'kj-ten', character: '天', meanings: ['Himmel', 'Wetter'], onyomi: ['テン'], kunyomi: ['あま', 'あめ'], jlpt: 'N4', strokes: 4, group: 'N4 Alltag', examples: [{ word: '天気', reading: 'てんき', meaning: 'Wetter' }] },
  { id: 'kj-shiro-white', character: '白', meanings: ['Weiß'], onyomi: ['ハク', 'ビャク'], kunyomi: ['しろ', 'しろ(い)'], jlpt: 'N4', strokes: 5, group: 'N4 Farben', examples: [{ word: '白い', reading: 'しろい', meaning: 'weiß' }] },
  { id: 'kj-kuro', character: '黒', meanings: ['Schwarz'], onyomi: ['コク'], kunyomi: ['くろ', 'くろ(い)'], jlpt: 'N4', strokes: 11, group: 'N4 Farben', examples: [{ word: '黒い', reading: 'くろい', meaning: 'schwarz' }] },
  { id: 'kj-aka', character: '赤', meanings: ['Rot'], onyomi: ['セキ'], kunyomi: ['あか', 'あか(い)'], jlpt: 'N4', strokes: 7, group: 'N4 Farben', examples: [{ word: '赤い', reading: 'あかい', meaning: 'rot' }] },
  { id: 'kj-ao', character: '青', meanings: ['Blau', 'grün (unreif)'], onyomi: ['セイ', 'ショウ'], kunyomi: ['あお', 'あお(い)'], jlpt: 'N4', strokes: 8, group: 'N4 Farben', examples: [{ word: '青い', reading: 'あおい', meaning: 'blau' }] },
]

export const kanjiGroups = [...new Set(kanjiData.map(k => k.group))]
