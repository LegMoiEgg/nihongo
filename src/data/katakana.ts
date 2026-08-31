import type { KanaCard } from './hiragana'

export const katakanaData: KanaCard[] = [
  // ── Vowels ──
  { id: 'k-a', character: 'ア', romaji: 'a', group: 'Vokale', example: 'アメリカ', exampleMeaning: 'Amerika' },
  { id: 'k-i', character: 'イ', romaji: 'i', group: 'Vokale', example: 'イギリス', exampleMeaning: 'England' },
  { id: 'k-u', character: 'ウ', romaji: 'u', group: 'Vokale', example: 'ウイスキー', exampleMeaning: 'Whisky' },
  { id: 'k-e', character: 'エ', romaji: 'e', group: 'Vokale', example: 'エレベーター', exampleMeaning: 'Aufzug' },
  { id: 'k-o', character: 'オ', romaji: 'o', group: 'Vokale', example: 'オレンジ', exampleMeaning: 'Orange' },

  // ── K-row ──
  { id: 'k-ka', character: 'カ', romaji: 'ka', group: 'K-Reihe', example: 'カメラ', exampleMeaning: 'Kamera' },
  { id: 'k-ki', character: 'キ', romaji: 'ki', group: 'K-Reihe', example: 'キッチン', exampleMeaning: 'Küche' },
  { id: 'k-ku', character: 'ク', romaji: 'ku', group: 'K-Reihe', example: 'クラス', exampleMeaning: 'Klasse' },
  { id: 'k-ke', character: 'ケ', romaji: 'ke', group: 'K-Reihe', example: 'ケーキ', exampleMeaning: 'Kuchen' },
  { id: 'k-ko', character: 'コ', romaji: 'ko', group: 'K-Reihe', example: 'コーヒー', exampleMeaning: 'Kaffee' },

  // ── S-row ──
  { id: 'k-sa', character: 'サ', romaji: 'sa', group: 'S-Reihe', example: 'サッカー', exampleMeaning: 'Fußball' },
  { id: 'k-shi', character: 'シ', romaji: 'shi', group: 'S-Reihe', example: 'シャツ', exampleMeaning: 'Hemd' },
  { id: 'k-su', character: 'ス', romaji: 'su', group: 'S-Reihe', example: 'スーパー', exampleMeaning: 'Supermarkt' },
  { id: 'k-se', character: 'セ', romaji: 'se', group: 'S-Reihe', example: 'セーター', exampleMeaning: 'Pullover' },
  { id: 'k-so', character: 'ソ', romaji: 'so', group: 'S-Reihe', example: 'ソファー', exampleMeaning: 'Sofa' },

  // ── T-row ──
  { id: 'k-ta', character: 'タ', romaji: 'ta', group: 'T-Reihe', example: 'タクシー', exampleMeaning: 'Taxi' },
  { id: 'k-chi', character: 'チ', romaji: 'chi', group: 'T-Reihe', example: 'チーズ', exampleMeaning: 'Käse' },
  { id: 'k-tsu', character: 'ツ', romaji: 'tsu', group: 'T-Reihe', example: 'ツアー', exampleMeaning: 'Tour' },
  { id: 'k-te', character: 'テ', romaji: 'te', group: 'T-Reihe', example: 'テレビ', exampleMeaning: 'Fernseher' },
  { id: 'k-to', character: 'ト', romaji: 'to', group: 'T-Reihe', example: 'トイレ', exampleMeaning: 'Toilette' },

  // ── N-row ──
  { id: 'k-na', character: 'ナ', romaji: 'na', group: 'N-Reihe', example: 'ナイフ', exampleMeaning: 'Messer' },
  { id: 'k-ni', character: 'ニ', romaji: 'ni', group: 'N-Reihe', example: 'ニュース', exampleMeaning: 'Nachrichten' },
  { id: 'k-nu', character: 'ヌ', romaji: 'nu', group: 'N-Reihe', example: 'カヌー', exampleMeaning: 'Kanu' },
  { id: 'k-ne', character: 'ネ', romaji: 'ne', group: 'N-Reihe', example: 'ネクタイ', exampleMeaning: 'Krawatte' },
  { id: 'k-no', character: 'ノ', romaji: 'no', group: 'N-Reihe', example: 'ノート', exampleMeaning: 'Notizbuch' },

  // ── H-row ──
  { id: 'k-ha', character: 'ハ', romaji: 'ha', group: 'H-Reihe', example: 'ハンバーガー', exampleMeaning: 'Hamburger' },
  { id: 'k-hi', character: 'ヒ', romaji: 'hi', group: 'H-Reihe', example: 'ヒーター', exampleMeaning: 'Heizung' },
  { id: 'k-fu', character: 'フ', romaji: 'fu', group: 'H-Reihe', example: 'フランス', exampleMeaning: 'Frankreich' },
  { id: 'k-he', character: 'ヘ', romaji: 'he', group: 'H-Reihe', example: 'ヘリコプター', exampleMeaning: 'Helikopter' },
  { id: 'k-ho', character: 'ホ', romaji: 'ho', group: 'H-Reihe', example: 'ホテル', exampleMeaning: 'Hotel' },

  // ── M-row ──
  { id: 'k-ma', character: 'マ', romaji: 'ma', group: 'M-Reihe', example: 'マンション', exampleMeaning: 'Wohnung' },
  { id: 'k-mi', character: 'ミ', romaji: 'mi', group: 'M-Reihe', example: 'ミルク', exampleMeaning: 'Milch' },
  { id: 'k-mu', character: 'ム', romaji: 'mu', group: 'M-Reihe', example: 'ムービー', exampleMeaning: 'Film' },
  { id: 'k-me', character: 'メ', romaji: 'me', group: 'M-Reihe', example: 'メニュー', exampleMeaning: 'Menü' },
  { id: 'k-mo', character: 'モ', romaji: 'mo', group: 'M-Reihe', example: 'モデル', exampleMeaning: 'Model' },

  // ── Y-row ──
  { id: 'k-ya', character: 'ヤ', romaji: 'ya', group: 'Y-Reihe', example: 'ヤフー', exampleMeaning: 'Yahoo' },
  { id: 'k-yu', character: 'ユ', romaji: 'yu', group: 'Y-Reihe', example: 'ユーロ', exampleMeaning: 'Euro' },
  { id: 'k-yo', character: 'ヨ', romaji: 'yo', group: 'Y-Reihe', example: 'ヨーロッパ', exampleMeaning: 'Europa' },

  // ── R-row ──
  { id: 'k-ra', character: 'ラ', romaji: 'ra', group: 'R-Reihe', example: 'ラーメン', exampleMeaning: 'Ramen' },
  { id: 'k-ri', character: 'リ', romaji: 'ri', group: 'R-Reihe', example: 'リモコン', exampleMeaning: 'Fernbedienung' },
  { id: 'k-ru', character: 'ル', romaji: 'ru', group: 'R-Reihe', example: 'ルール', exampleMeaning: 'Regel' },
  { id: 'k-re', character: 'レ', romaji: 're', group: 'R-Reihe', example: 'レストラン', exampleMeaning: 'Restaurant' },
  { id: 'k-ro', character: 'ロ', romaji: 'ro', group: 'R-Reihe', example: 'ロボット', exampleMeaning: 'Roboter' },

  // ── W-row + N ──
  { id: 'k-wa', character: 'ワ', romaji: 'wa', group: 'W-Reihe', example: 'ワイン', exampleMeaning: 'Wein' },
  { id: 'k-wo', character: 'ヲ', romaji: 'wo', group: 'W-Reihe', example: 'ヲ (selten)', exampleMeaning: 'Partikel (selten)' },
  { id: 'k-n', character: 'ン', romaji: 'n', group: 'W-Reihe', example: 'パン', exampleMeaning: 'Brot' },

  // ══════════ Dakuten (゛) ══════════

  // ── G-row ──
  { id: 'k-ga', character: 'ガ', romaji: 'ga', group: 'G-Reihe (濁)', example: 'ガス', exampleMeaning: 'Gas' },
  { id: 'k-gi', character: 'ギ', romaji: 'gi', group: 'G-Reihe (濁)', example: 'ギター', exampleMeaning: 'Gitarre' },
  { id: 'k-gu', character: 'グ', romaji: 'gu', group: 'G-Reihe (濁)', example: 'グラス', exampleMeaning: 'Glas' },
  { id: 'k-ge', character: 'ゲ', romaji: 'ge', group: 'G-Reihe (濁)', example: 'ゲーム', exampleMeaning: 'Spiel' },
  { id: 'k-go', character: 'ゴ', romaji: 'go', group: 'G-Reihe (濁)', example: 'ゴルフ', exampleMeaning: 'Golf' },

  // ── Z-row ──
  { id: 'k-za', character: 'ザ', romaji: 'za', group: 'Z-Reihe (濁)', example: 'ザック', exampleMeaning: 'Rucksack' },
  { id: 'k-ji', character: 'ジ', romaji: 'ji', group: 'Z-Reihe (濁)', example: 'ジュース', exampleMeaning: 'Saft' },
  { id: 'k-zu', character: 'ズ', romaji: 'zu', group: 'Z-Reihe (濁)', example: 'ズボン', exampleMeaning: 'Hose' },
  { id: 'k-ze', character: 'ゼ', romaji: 'ze', group: 'Z-Reihe (濁)', example: 'ゼロ', exampleMeaning: 'Null' },
  { id: 'k-zo', character: 'ゾ', romaji: 'zo', group: 'Z-Reihe (濁)', example: 'ゾーン', exampleMeaning: 'Zone' },

  // ── D-row ──
  { id: 'k-da', character: 'ダ', romaji: 'da', group: 'D-Reihe (濁)', example: 'ダンス', exampleMeaning: 'Tanz' },
  { id: 'k-di', character: 'ヂ', romaji: 'ji', group: 'D-Reihe (濁)', example: 'ヂ (selten)', exampleMeaning: 'Selten genutzt' },
  { id: 'k-du', character: 'ヅ', romaji: 'zu', group: 'D-Reihe (濁)', example: 'ヅ (selten)', exampleMeaning: 'Selten genutzt' },
  { id: 'k-de', character: 'デ', romaji: 'de', group: 'D-Reihe (濁)', example: 'デザイン', exampleMeaning: 'Design' },
  { id: 'k-do', character: 'ド', romaji: 'do', group: 'D-Reihe (濁)', example: 'ドイツ', exampleMeaning: 'Deutschland' },

  // ── B-row ──
  { id: 'k-ba', character: 'バ', romaji: 'ba', group: 'B-Reihe (濁)', example: 'バス', exampleMeaning: 'Bus' },
  { id: 'k-bi', character: 'ビ', romaji: 'bi', group: 'B-Reihe (濁)', example: 'ビール', exampleMeaning: 'Bier' },
  { id: 'k-bu', character: 'ブ', romaji: 'bu', group: 'B-Reihe (濁)', example: 'ブログ', exampleMeaning: 'Blog' },
  { id: 'k-be', character: 'ベ', romaji: 'be', group: 'B-Reihe (濁)', example: 'ベッド', exampleMeaning: 'Bett' },
  { id: 'k-bo', character: 'ボ', romaji: 'bo', group: 'B-Reihe (濁)', example: 'ボール', exampleMeaning: 'Ball' },

  // ══════════ Handakuten (゜) ══════════

  // ── P-row ──
  { id: 'k-pa', character: 'パ', romaji: 'pa', group: 'P-Reihe (半濁)', example: 'パン', exampleMeaning: 'Brot' },
  { id: 'k-pi', character: 'ピ', romaji: 'pi', group: 'P-Reihe (半濁)', example: 'ピアノ', exampleMeaning: 'Klavier' },
  { id: 'k-pu', character: 'プ', romaji: 'pu', group: 'P-Reihe (半濁)', example: 'プール', exampleMeaning: 'Pool' },
  { id: 'k-pe', character: 'ペ', romaji: 'pe', group: 'P-Reihe (半濁)', example: 'ペン', exampleMeaning: 'Stift' },
  { id: 'k-po', character: 'ポ', romaji: 'po', group: 'P-Reihe (半濁)', example: 'ポスト', exampleMeaning: 'Briefkasten' },

  // ══════════ Sokuon ══════════
  { id: 'k-xtsu', character: 'ッ', romaji: '(ッ)', group: 'Sokuon', example: 'ロケット', exampleMeaning: 'Rakete (Doppelkonsonant)' },

  // ══════════ Kombinations-Silben ══════════

  // ── K-combos ──
  { id: 'k-kya', character: 'キャ', romaji: 'kya', group: 'K-Kombi', example: 'キャンプ', exampleMeaning: 'Camping' },
  { id: 'k-kyu', character: 'キュ', romaji: 'kyu', group: 'K-Kombi', example: 'キュート', exampleMeaning: 'Süß' },
  { id: 'k-kyo', character: 'キョ', romaji: 'kyo', group: 'K-Kombi', example: 'トーキョー', exampleMeaning: 'Tokio' },

  // ── S-combos ──
  { id: 'k-sha', character: 'シャ', romaji: 'sha', group: 'S-Kombi', example: 'シャワー', exampleMeaning: 'Dusche' },
  { id: 'k-shu', character: 'シュ', romaji: 'shu', group: 'S-Kombi', example: 'シュート', exampleMeaning: 'Schuss' },
  { id: 'k-sho', character: 'ショ', romaji: 'sho', group: 'S-Kombi', example: 'ショッピング', exampleMeaning: 'Einkaufen' },

  // ── T-combos ──
  { id: 'k-cha', character: 'チャ', romaji: 'cha', group: 'T-Kombi', example: 'チャンス', exampleMeaning: 'Chance' },
  { id: 'k-chu', character: 'チュ', romaji: 'chu', group: 'T-Kombi', example: 'チューリップ', exampleMeaning: 'Tulpe' },
  { id: 'k-cho', character: 'チョ', romaji: 'cho', group: 'T-Kombi', example: 'チョコレート', exampleMeaning: 'Schokolade' },

  // ── N-combos ──
  { id: 'k-nya', character: 'ニャ', romaji: 'nya', group: 'N-Kombi', example: 'ニャン', exampleMeaning: 'Miau' },
  { id: 'k-nyu', character: 'ニュ', romaji: 'nyu', group: 'N-Kombi', example: 'ニュース', exampleMeaning: 'Nachrichten' },
  { id: 'k-nyo', character: 'ニョ', romaji: 'nyo', group: 'N-Kombi', example: 'ニョッキ', exampleMeaning: 'Gnocchi' },

  // ── H-combos ──
  { id: 'k-hya', character: 'ヒャ', romaji: 'hya', group: 'H-Kombi', example: 'ヒャク', exampleMeaning: 'Hundert' },
  { id: 'k-hyu', character: 'ヒュ', romaji: 'hyu', group: 'H-Kombi', example: 'ヒューズ', exampleMeaning: 'Sicherung' },
  { id: 'k-hyo', character: 'ヒョ', romaji: 'hyo', group: 'H-Kombi', example: 'ヒョウ', exampleMeaning: 'Leopard' },

  // ── M-combos ──
  { id: 'k-mya', character: 'ミャ', romaji: 'mya', group: 'M-Kombi', example: 'ミャンマー', exampleMeaning: 'Myanmar' },
  { id: 'k-myu', character: 'ミュ', romaji: 'myu', group: 'M-Kombi', example: 'ミュージック', exampleMeaning: 'Musik' },
  { id: 'k-myo', character: 'ミョ', romaji: 'myo', group: 'M-Kombi', example: 'ミョウガ', exampleMeaning: 'Ingwerknospe' },

  // ── R-combos ──
  { id: 'k-rya', character: 'リャ', romaji: 'rya', group: 'R-Kombi', example: 'リャク', exampleMeaning: 'Abkürzung' },
  { id: 'k-ryu', character: 'リュ', romaji: 'ryu', group: 'R-Kombi', example: 'リュック', exampleMeaning: 'Rucksack' },
  { id: 'k-ryo', character: 'リョ', romaji: 'ryo', group: 'R-Kombi', example: 'リョカン', exampleMeaning: 'Gasthof' },

  // ── G-combos ──
  { id: 'k-gya', character: 'ギャ', romaji: 'gya', group: 'G-Kombi', example: 'ギャラリー', exampleMeaning: 'Galerie' },
  { id: 'k-gyu', character: 'ギュ', romaji: 'gyu', group: 'G-Kombi', example: 'ギュウドン', exampleMeaning: 'Rindfleischbowl' },
  { id: 'k-gyo', character: 'ギョ', romaji: 'gyo', group: 'G-Kombi', example: 'ギョウザ', exampleMeaning: 'Gyoza' },

  // ── Z-combos ──
  { id: 'k-ja', character: 'ジャ', romaji: 'ja', group: 'Z-Kombi', example: 'ジャケット', exampleMeaning: 'Jacke' },
  { id: 'k-ju', character: 'ジュ', romaji: 'ju', group: 'Z-Kombi', example: 'ジュース', exampleMeaning: 'Saft' },
  { id: 'k-jo', character: 'ジョ', romaji: 'jo', group: 'Z-Kombi', example: 'ジョギング', exampleMeaning: 'Joggen' },

  // ── B-combos ──
  { id: 'k-bya', character: 'ビャ', romaji: 'bya', group: 'B-Kombi', example: 'ビャクヤ', exampleMeaning: 'Weiße Nacht' },
  { id: 'k-byu', character: 'ビュ', romaji: 'byu', group: 'B-Kombi', example: 'ビュッフェ', exampleMeaning: 'Büffet' },
  { id: 'k-byo', character: 'ビョ', romaji: 'byo', group: 'B-Kombi', example: 'ビョウイン', exampleMeaning: 'Krankenhaus' },

  // ── P-combos ──
  { id: 'k-pya', character: 'ピャ', romaji: 'pya', group: 'P-Kombi', example: 'ピャッと', exampleMeaning: 'Plötzlich' },
  { id: 'k-pyu', character: 'ピュ', romaji: 'pyu', group: 'P-Kombi', example: 'ピュア', exampleMeaning: 'Rein' },
  { id: 'k-pyo', character: 'ピョ', romaji: 'pyo', group: 'P-Kombi', example: 'ピョン', exampleMeaning: 'Hüpf' },
]

export const katakanaGroups = [...new Set(katakanaData.map(k => k.group))]
