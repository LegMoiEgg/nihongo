export interface KanaCard {
  id: string
  character: string
  romaji: string
  group: string
  example?: string
  exampleMeaning?: string
}

export const hiraganaData: KanaCard[] = [
  // ── Vowels ──
  { id: 'h-a', character: 'あ', romaji: 'a', group: 'Vokale', example: 'あめ', exampleMeaning: 'Regen' },
  { id: 'h-i', character: 'い', romaji: 'i', group: 'Vokale', example: 'いぬ', exampleMeaning: 'Hund' },
  { id: 'h-u', character: 'う', romaji: 'u', group: 'Vokale', example: 'うみ', exampleMeaning: 'Meer' },
  { id: 'h-e', character: 'え', romaji: 'e', group: 'Vokale', example: 'えき', exampleMeaning: 'Bahnhof' },
  { id: 'h-o', character: 'お', romaji: 'o', group: 'Vokale', example: 'おかね', exampleMeaning: 'Geld' },

  // ── K-row ──
  { id: 'h-ka', character: 'か', romaji: 'ka', group: 'K-Reihe', example: 'かさ', exampleMeaning: 'Regenschirm' },
  { id: 'h-ki', character: 'き', romaji: 'ki', group: 'K-Reihe', example: 'きって', exampleMeaning: 'Briefmarke' },
  { id: 'h-ku', character: 'く', romaji: 'ku', group: 'K-Reihe', example: 'くるま', exampleMeaning: 'Auto' },
  { id: 'h-ke', character: 'け', romaji: 'ke', group: 'K-Reihe', example: 'けしゴム', exampleMeaning: 'Radiergummi' },
  { id: 'h-ko', character: 'こ', romaji: 'ko', group: 'K-Reihe', example: 'こども', exampleMeaning: 'Kind' },

  // ── S-row ──
  { id: 'h-sa', character: 'さ', romaji: 'sa', group: 'S-Reihe', example: 'さくら', exampleMeaning: 'Kirschblüte' },
  { id: 'h-shi', character: 'し', romaji: 'shi', group: 'S-Reihe', example: 'しごと', exampleMeaning: 'Arbeit' },
  { id: 'h-su', character: 'す', romaji: 'su', group: 'S-Reihe', example: 'すし', exampleMeaning: 'Sushi' },
  { id: 'h-se', character: 'せ', romaji: 'se', group: 'S-Reihe', example: 'せんせい', exampleMeaning: 'Lehrer' },
  { id: 'h-so', character: 'そ', romaji: 'so', group: 'S-Reihe', example: 'そと', exampleMeaning: 'Draußen' },

  // ── T-row ──
  { id: 'h-ta', character: 'た', romaji: 'ta', group: 'T-Reihe', example: 'たまご', exampleMeaning: 'Ei' },
  { id: 'h-chi', character: 'ち', romaji: 'chi', group: 'T-Reihe', example: 'ちず', exampleMeaning: 'Karte' },
  { id: 'h-tsu', character: 'つ', romaji: 'tsu', group: 'T-Reihe', example: 'つくえ', exampleMeaning: 'Schreibtisch' },
  { id: 'h-te', character: 'て', romaji: 'te', group: 'T-Reihe', example: 'てがみ', exampleMeaning: 'Brief' },
  { id: 'h-to', character: 'と', romaji: 'to', group: 'T-Reihe', example: 'ともだち', exampleMeaning: 'Freund' },

  // ── N-row ──
  { id: 'h-na', character: 'な', romaji: 'na', group: 'N-Reihe', example: 'なつ', exampleMeaning: 'Sommer' },
  { id: 'h-ni', character: 'に', romaji: 'ni', group: 'N-Reihe', example: 'にほん', exampleMeaning: 'Japan' },
  { id: 'h-nu', character: 'ぬ', romaji: 'nu', group: 'N-Reihe', example: 'ぬいぐるみ', exampleMeaning: 'Stofftier' },
  { id: 'h-ne', character: 'ね', romaji: 'ne', group: 'N-Reihe', example: 'ねこ', exampleMeaning: 'Katze' },
  { id: 'h-no', character: 'の', romaji: 'no', group: 'N-Reihe', example: 'のみもの', exampleMeaning: 'Getränk' },

  // ── H-row ──
  { id: 'h-ha', character: 'は', romaji: 'ha', group: 'H-Reihe', example: 'はな', exampleMeaning: 'Blume' },
  { id: 'h-hi', character: 'ひ', romaji: 'hi', group: 'H-Reihe', example: 'ひと', exampleMeaning: 'Mensch' },
  { id: 'h-fu', character: 'ふ', romaji: 'fu', group: 'H-Reihe', example: 'ふゆ', exampleMeaning: 'Winter' },
  { id: 'h-he', character: 'へ', romaji: 'he', group: 'H-Reihe', example: 'へや', exampleMeaning: 'Zimmer' },
  { id: 'h-ho', character: 'ほ', romaji: 'ho', group: 'H-Reihe', example: 'ほん', exampleMeaning: 'Buch' },

  // ── M-row ──
  { id: 'h-ma', character: 'ま', romaji: 'ma', group: 'M-Reihe', example: 'まど', exampleMeaning: 'Fenster' },
  { id: 'h-mi', character: 'み', romaji: 'mi', group: 'M-Reihe', example: 'みず', exampleMeaning: 'Wasser' },
  { id: 'h-mu', character: 'む', romaji: 'mu', group: 'M-Reihe', example: 'むし', exampleMeaning: 'Insekt' },
  { id: 'h-me', character: 'め', romaji: 'me', group: 'M-Reihe', example: 'め', exampleMeaning: 'Auge' },
  { id: 'h-mo', character: 'も', romaji: 'mo', group: 'M-Reihe', example: 'もり', exampleMeaning: 'Wald' },

  // ── Y-row ──
  { id: 'h-ya', character: 'や', romaji: 'ya', group: 'Y-Reihe', example: 'やま', exampleMeaning: 'Berg' },
  { id: 'h-yu', character: 'ゆ', romaji: 'yu', group: 'Y-Reihe', example: 'ゆき', exampleMeaning: 'Schnee' },
  { id: 'h-yo', character: 'よ', romaji: 'yo', group: 'Y-Reihe', example: 'よる', exampleMeaning: 'Nacht' },

  // ── R-row ──
  { id: 'h-ra', character: 'ら', romaji: 'ra', group: 'R-Reihe', example: 'らいねん', exampleMeaning: 'Nächstes Jahr' },
  { id: 'h-ri', character: 'り', romaji: 'ri', group: 'R-Reihe', example: 'りんご', exampleMeaning: 'Apfel' },
  { id: 'h-ru', character: 'る', romaji: 'ru', group: 'R-Reihe', example: 'るす', exampleMeaning: 'Abwesend' },
  { id: 'h-re', character: 'れ', romaji: 're', group: 'R-Reihe', example: 'れきし', exampleMeaning: 'Geschichte' },
  { id: 'h-ro', character: 'ろ', romaji: 'ro', group: 'R-Reihe', example: 'ろく', exampleMeaning: 'Sechs' },

  // ── W-row + N ──
  { id: 'h-wa', character: 'わ', romaji: 'wa', group: 'W-Reihe', example: 'わたし', exampleMeaning: 'Ich' },
  { id: 'h-wo', character: 'を', romaji: 'wo', group: 'W-Reihe', example: 'を (Partikel)', exampleMeaning: 'Objektpartikel' },
  { id: 'h-n', character: 'ん', romaji: 'n', group: 'W-Reihe', example: 'にほん', exampleMeaning: 'Japan' },

  // ══════════ Dakuten (゛) ══════════

  // ── G-row (ka → ga) ──
  { id: 'h-ga', character: 'が', romaji: 'ga', group: 'G-Reihe (濁)', example: 'がっこう', exampleMeaning: 'Schule' },
  { id: 'h-gi', character: 'ぎ', romaji: 'gi', group: 'G-Reihe (濁)', example: 'ぎんこう', exampleMeaning: 'Bank' },
  { id: 'h-gu', character: 'ぐ', romaji: 'gu', group: 'G-Reihe (濁)', example: 'ぐうぜん', exampleMeaning: 'Zufall' },
  { id: 'h-ge', character: 'げ', romaji: 'ge', group: 'G-Reihe (濁)', example: 'げんき', exampleMeaning: 'Gesund' },
  { id: 'h-go', character: 'ご', romaji: 'go', group: 'G-Reihe (濁)', example: 'ごはん', exampleMeaning: 'Reis/Essen' },

  // ── Z-row (sa → za) ──
  { id: 'h-za', character: 'ざ', romaji: 'za', group: 'Z-Reihe (濁)', example: 'ざっし', exampleMeaning: 'Zeitschrift' },
  { id: 'h-ji', character: 'じ', romaji: 'ji', group: 'Z-Reihe (濁)', example: 'じかん', exampleMeaning: 'Zeit' },
  { id: 'h-zu', character: 'ず', romaji: 'zu', group: 'Z-Reihe (濁)', example: 'すず', exampleMeaning: 'Glocke' },
  { id: 'h-ze', character: 'ぜ', romaji: 'ze', group: 'Z-Reihe (濁)', example: 'ぜんぶ', exampleMeaning: 'Alles' },
  { id: 'h-zo', character: 'ぞ', romaji: 'zo', group: 'Z-Reihe (濁)', example: 'ぞう', exampleMeaning: 'Elefant' },

  // ── D-row (ta → da) ──
  { id: 'h-da', character: 'だ', romaji: 'da', group: 'D-Reihe (濁)', example: 'だれ', exampleMeaning: 'Wer' },
  { id: 'h-di', character: 'ぢ', romaji: 'ji', group: 'D-Reihe (濁)', example: 'ちぢむ', exampleMeaning: 'Schrumpfen' },
  { id: 'h-du', character: 'づ', romaji: 'zu', group: 'D-Reihe (濁)', example: 'つづく', exampleMeaning: 'Fortsetzen' },
  { id: 'h-de', character: 'で', romaji: 'de', group: 'D-Reihe (濁)', example: 'でんしゃ', exampleMeaning: 'Zug' },
  { id: 'h-do', character: 'ど', romaji: 'do', group: 'D-Reihe (濁)', example: 'どこ', exampleMeaning: 'Wo' },

  // ── B-row (ha → ba) ──
  { id: 'h-ba', character: 'ば', romaji: 'ba', group: 'B-Reihe (濁)', example: 'ばしょ', exampleMeaning: 'Ort' },
  { id: 'h-bi', character: 'び', romaji: 'bi', group: 'B-Reihe (濁)', example: 'びじゅつ', exampleMeaning: 'Kunst' },
  { id: 'h-bu', character: 'ぶ', romaji: 'bu', group: 'B-Reihe (濁)', example: 'ぶたにく', exampleMeaning: 'Schweinefleisch' },
  { id: 'h-be', character: 'べ', romaji: 'be', group: 'B-Reihe (濁)', example: 'べんきょう', exampleMeaning: 'Lernen' },
  { id: 'h-bo', character: 'ぼ', romaji: 'bo', group: 'B-Reihe (濁)', example: 'ぼうし', exampleMeaning: 'Hut' },

  // ══════════ Handakuten (゜) ══════════

  // ── P-row (ha → pa) ──
  { id: 'h-pa', character: 'ぱ', romaji: 'pa', group: 'P-Reihe (半濁)', example: 'ぱん', exampleMeaning: 'Brot' },
  { id: 'h-pi', character: 'ぴ', romaji: 'pi', group: 'P-Reihe (半濁)', example: 'ぴあの', exampleMeaning: 'Klavier' },
  { id: 'h-pu', character: 'ぷ', romaji: 'pu', group: 'P-Reihe (半濁)', example: 'ぷーる', exampleMeaning: 'Pool' },
  { id: 'h-pe', character: 'ぺ', romaji: 'pe', group: 'P-Reihe (半濁)', example: 'ぺん', exampleMeaning: 'Stift' },
  { id: 'h-po', character: 'ぽ', romaji: 'po', group: 'P-Reihe (半濁)', example: 'たんぽぽ', exampleMeaning: 'Löwenzahn' },

  // ══════════ Sokuon (kleines っ) ══════════
  { id: 'h-xtsu', character: 'っ', romaji: '(っ)', group: 'Sokuon', example: 'きって', exampleMeaning: 'Briefmarke (Doppelkonsonant)' },

  // ══════════ Kombinations-Silben (拗音 yōon) ══════════

  // ── K-combos ──
  { id: 'h-kya', character: 'きゃ', romaji: 'kya', group: 'K-Kombi', example: 'きゃく', exampleMeaning: 'Gast' },
  { id: 'h-kyu', character: 'きゅ', romaji: 'kyu', group: 'K-Kombi', example: 'きゅう', exampleMeaning: 'Neun' },
  { id: 'h-kyo', character: 'きょ', romaji: 'kyo', group: 'K-Kombi', example: 'きょう', exampleMeaning: 'Heute' },

  // ── S-combos ──
  { id: 'h-sha', character: 'しゃ', romaji: 'sha', group: 'S-Kombi', example: 'しゃしん', exampleMeaning: 'Foto' },
  { id: 'h-shu', character: 'しゅ', romaji: 'shu', group: 'S-Kombi', example: 'しゅくだい', exampleMeaning: 'Hausaufgabe' },
  { id: 'h-sho', character: 'しょ', romaji: 'sho', group: 'S-Kombi', example: 'しょうがつ', exampleMeaning: 'Neujahr' },

  // ── T-combos ──
  { id: 'h-cha', character: 'ちゃ', romaji: 'cha', group: 'T-Kombi', example: 'おちゃ', exampleMeaning: 'Tee' },
  { id: 'h-chu', character: 'ちゅ', romaji: 'chu', group: 'T-Kombi', example: 'ちゅうごく', exampleMeaning: 'China' },
  { id: 'h-cho', character: 'ちょ', romaji: 'cho', group: 'T-Kombi', example: 'ちょっと', exampleMeaning: 'Ein bisschen' },

  // ── N-combos ──
  { id: 'h-nya', character: 'にゃ', romaji: 'nya', group: 'N-Kombi', example: 'にゃん', exampleMeaning: 'Miau' },
  { id: 'h-nyu', character: 'にゅ', romaji: 'nyu', group: 'N-Kombi', example: 'にゅうがく', exampleMeaning: 'Einschulung' },
  { id: 'h-nyo', character: 'にょ', romaji: 'nyo', group: 'N-Kombi', example: 'にょうぼう', exampleMeaning: 'Ehefrau' },

  // ── H-combos ──
  { id: 'h-hya', character: 'ひゃ', romaji: 'hya', group: 'H-Kombi', example: 'ひゃく', exampleMeaning: 'Hundert' },
  { id: 'h-hyu', character: 'ひゅ', romaji: 'hyu', group: 'H-Kombi', example: 'ひゅう', exampleMeaning: 'Windgeräusch' },
  { id: 'h-hyo', character: 'ひょ', romaji: 'hyo', group: 'H-Kombi', example: 'ひょう', exampleMeaning: 'Hagel' },

  // ── M-combos ──
  { id: 'h-mya', character: 'みゃ', romaji: 'mya', group: 'M-Kombi', example: 'みゃく', exampleMeaning: 'Puls' },
  { id: 'h-myu', character: 'みゅ', romaji: 'myu', group: 'M-Kombi', example: 'みゅーじっく', exampleMeaning: 'Musik' },
  { id: 'h-myo', character: 'みょ', romaji: 'myo', group: 'M-Kombi', example: 'みょうじ', exampleMeaning: 'Nachname' },

  // ── R-combos ──
  { id: 'h-rya', character: 'りゃ', romaji: 'rya', group: 'R-Kombi', example: 'りゃく', exampleMeaning: 'Abkürzung' },
  { id: 'h-ryu', character: 'りゅ', romaji: 'ryu', group: 'R-Kombi', example: 'りゅう', exampleMeaning: 'Drache' },
  { id: 'h-ryo', character: 'りょ', romaji: 'ryo', group: 'R-Kombi', example: 'りょこう', exampleMeaning: 'Reise' },

  // ── G-combos ──
  { id: 'h-gya', character: 'ぎゃ', romaji: 'gya', group: 'G-Kombi', example: 'ぎゃく', exampleMeaning: 'Umgekehrt' },
  { id: 'h-gyu', character: 'ぎゅ', romaji: 'gyu', group: 'G-Kombi', example: 'ぎゅうにゅう', exampleMeaning: 'Milch' },
  { id: 'h-gyo', character: 'ぎょ', romaji: 'gyo', group: 'G-Kombi', example: 'ぎょうざ', exampleMeaning: 'Gyoza' },

  // ── Z-combos ──
  { id: 'h-ja', character: 'じゃ', romaji: 'ja', group: 'Z-Kombi', example: 'じゃあね', exampleMeaning: 'Tschüss' },
  { id: 'h-ju', character: 'じゅ', romaji: 'ju', group: 'Z-Kombi', example: 'じゅうしょ', exampleMeaning: 'Adresse' },
  { id: 'h-jo', character: 'じょ', romaji: 'jo', group: 'Z-Kombi', example: 'じょせい', exampleMeaning: 'Frau' },

  // ── B-combos ──
  { id: 'h-bya', character: 'びゃ', romaji: 'bya', group: 'B-Kombi', example: 'びゃくや', exampleMeaning: 'Weiße Nacht' },
  { id: 'h-byu', character: 'びゅ', romaji: 'byu', group: 'B-Kombi', example: 'びゅう', exampleMeaning: 'Windgeräusch' },
  { id: 'h-byo', character: 'びょ', romaji: 'byo', group: 'B-Kombi', example: 'びょういん', exampleMeaning: 'Krankenhaus' },

  // ── P-combos ──
  { id: 'h-pya', character: 'ぴゃ', romaji: 'pya', group: 'P-Kombi', example: 'ぴゃっと', exampleMeaning: 'Plötzlich' },
  { id: 'h-pyu', character: 'ぴゅ', romaji: 'pyu', group: 'P-Kombi', example: 'ぴゅう', exampleMeaning: 'Pfeifgeräusch' },
  { id: 'h-pyo', character: 'ぴょ', romaji: 'pyo', group: 'P-Kombi', example: 'ぴょん', exampleMeaning: 'Hüpf' },
]

export const hiraganaGroups = [...new Set(hiraganaData.map(h => h.group))]
