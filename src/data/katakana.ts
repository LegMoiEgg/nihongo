import type { KanaCard } from './hiragana'

export const katakanaData: KanaCard[] = [
  // Vowels
  { id: 'k-a', character: 'ア', romaji: 'a', group: 'Vokale', example: 'アメリカ', exampleMeaning: 'Amerika' },
  { id: 'k-i', character: 'イ', romaji: 'i', group: 'Vokale', example: 'イギリス', exampleMeaning: 'England' },
  { id: 'k-u', character: 'ウ', romaji: 'u', group: 'Vokale', example: 'ウイスキー', exampleMeaning: 'Whisky' },
  { id: 'k-e', character: 'エ', romaji: 'e', group: 'Vokale', example: 'エレベーター', exampleMeaning: 'Aufzug' },
  { id: 'k-o', character: 'オ', romaji: 'o', group: 'Vokale', example: 'オレンジ', exampleMeaning: 'Orange' },

  // K-row
  { id: 'k-ka', character: 'カ', romaji: 'ka', group: 'K-Reihe', example: 'カメラ', exampleMeaning: 'Kamera' },
  { id: 'k-ki', character: 'キ', romaji: 'ki', group: 'K-Reihe', example: 'キッチン', exampleMeaning: 'Küche' },
  { id: 'k-ku', character: 'ク', romaji: 'ku', group: 'K-Reihe', example: 'クラス', exampleMeaning: 'Klasse' },
  { id: 'k-ke', character: 'ケ', romaji: 'ke', group: 'K-Reihe', example: 'ケーキ', exampleMeaning: 'Kuchen' },
  { id: 'k-ko', character: 'コ', romaji: 'ko', group: 'K-Reihe', example: 'コーヒー', exampleMeaning: 'Kaffee' },

  // S-row
  { id: 'k-sa', character: 'サ', romaji: 'sa', group: 'S-Reihe', example: 'サッカー', exampleMeaning: 'Fußball' },
  { id: 'k-shi', character: 'シ', romaji: 'shi', group: 'S-Reihe', example: 'シャツ', exampleMeaning: 'Hemd' },
  { id: 'k-su', character: 'ス', romaji: 'su', group: 'S-Reihe', example: 'スーパー', exampleMeaning: 'Supermarkt' },
  { id: 'k-se', character: 'セ', romaji: 'se', group: 'S-Reihe', example: 'セーター', exampleMeaning: 'Pullover' },
  { id: 'k-so', character: 'ソ', romaji: 'so', group: 'S-Reihe', example: 'ソファー', exampleMeaning: 'Sofa' },

  // T-row
  { id: 'k-ta', character: 'タ', romaji: 'ta', group: 'T-Reihe', example: 'タクシー', exampleMeaning: 'Taxi' },
  { id: 'k-chi', character: 'チ', romaji: 'chi', group: 'T-Reihe', example: 'チーズ', exampleMeaning: 'Käse' },
  { id: 'k-tsu', character: 'ツ', romaji: 'tsu', group: 'T-Reihe', example: 'ツアー', exampleMeaning: 'Tour' },
  { id: 'k-te', character: 'テ', romaji: 'te', group: 'T-Reihe', example: 'テレビ', exampleMeaning: 'Fernseher' },
  { id: 'k-to', character: 'ト', romaji: 'to', group: 'T-Reihe', example: 'トイレ', exampleMeaning: 'Toilette' },

  // N-row
  { id: 'k-na', character: 'ナ', romaji: 'na', group: 'N-Reihe', example: 'ナイフ', exampleMeaning: 'Messer' },
  { id: 'k-ni', character: 'ニ', romaji: 'ni', group: 'N-Reihe', example: 'ニュース', exampleMeaning: 'Nachrichten' },
  { id: 'k-nu', character: 'ヌ', romaji: 'nu', group: 'N-Reihe', example: 'カヌー', exampleMeaning: 'Kanu' },
  { id: 'k-ne', character: 'ネ', romaji: 'ne', group: 'N-Reihe', example: 'ネクタイ', exampleMeaning: 'Krawatte' },
  { id: 'k-no', character: 'ノ', romaji: 'no', group: 'N-Reihe', example: 'ノート', exampleMeaning: 'Notizbuch' },

  // H-row
  { id: 'k-ha', character: 'ハ', romaji: 'ha', group: 'H-Reihe', example: 'ハンバーガー', exampleMeaning: 'Hamburger' },
  { id: 'k-hi', character: 'ヒ', romaji: 'hi', group: 'H-Reihe', example: 'ヒーター', exampleMeaning: 'Heizung' },
  { id: 'k-fu', character: 'フ', romaji: 'fu', group: 'H-Reihe', example: 'フランス', exampleMeaning: 'Frankreich' },
  { id: 'k-he', character: 'ヘ', romaji: 'he', group: 'H-Reihe', example: 'ヘリコプター', exampleMeaning: 'Helikopter' },
  { id: 'k-ho', character: 'ホ', romaji: 'ho', group: 'H-Reihe', example: 'ホテル', exampleMeaning: 'Hotel' },

  // M-row
  { id: 'k-ma', character: 'マ', romaji: 'ma', group: 'M-Reihe', example: 'マンション', exampleMeaning: 'Wohnung' },
  { id: 'k-mi', character: 'ミ', romaji: 'mi', group: 'M-Reihe', example: 'ミルク', exampleMeaning: 'Milch' },
  { id: 'k-mu', character: 'ム', romaji: 'mu', group: 'M-Reihe', example: 'ムービー', exampleMeaning: 'Film' },
  { id: 'k-me', character: 'メ', romaji: 'me', group: 'M-Reihe', example: 'メニュー', exampleMeaning: 'Menü' },
  { id: 'k-mo', character: 'モ', romaji: 'mo', group: 'M-Reihe', example: 'モデル', exampleMeaning: 'Model' },

  // Y-row
  { id: 'k-ya', character: 'ヤ', romaji: 'ya', group: 'Y-Reihe', example: 'ヤフー', exampleMeaning: 'Yahoo' },
  { id: 'k-yu', character: 'ユ', romaji: 'yu', group: 'Y-Reihe', example: 'ユーロ', exampleMeaning: 'Euro' },
  { id: 'k-yo', character: 'ヨ', romaji: 'yo', group: 'Y-Reihe', example: 'ヨーロッパ', exampleMeaning: 'Europa' },

  // R-row
  { id: 'k-ra', character: 'ラ', romaji: 'ra', group: 'R-Reihe', example: 'ラーメン', exampleMeaning: 'Ramen' },
  { id: 'k-ri', character: 'リ', romaji: 'ri', group: 'R-Reihe', example: 'リモコン', exampleMeaning: 'Fernbedienung' },
  { id: 'k-ru', character: 'ル', romaji: 'ru', group: 'R-Reihe', example: 'ルール', exampleMeaning: 'Regel' },
  { id: 'k-re', character: 'レ', romaji: 're', group: 'R-Reihe', example: 'レストラン', exampleMeaning: 'Restaurant' },
  { id: 'k-ro', character: 'ロ', romaji: 'ro', group: 'R-Reihe', example: 'ロボット', exampleMeaning: 'Roboter' },

  // W-row + N
  { id: 'k-wa', character: 'ワ', romaji: 'wa', group: 'W-Reihe', example: 'ワイン', exampleMeaning: 'Wein' },
  { id: 'k-wo', character: 'ヲ', romaji: 'wo', group: 'W-Reihe', example: 'ヲ (selten)', exampleMeaning: 'Partikel (selten)' },
  { id: 'k-n', character: 'ン', romaji: 'n', group: 'W-Reihe', example: 'パン', exampleMeaning: 'Brot' },
]

export const katakanaGroups = [...new Set(katakanaData.map(k => k.group))]
