export interface KanaCard {
  id: string
  character: string
  romaji: string
  group: string
  example?: string
  exampleMeaning?: string
}

export const hiraganaData: KanaCard[] = [
  // Vowels
  { id: 'h-a', character: 'あ', romaji: 'a', group: 'Vokale', example: 'あめ', exampleMeaning: 'Regen' },
  { id: 'h-i', character: 'い', romaji: 'i', group: 'Vokale', example: 'いぬ', exampleMeaning: 'Hund' },
  { id: 'h-u', character: 'う', romaji: 'u', group: 'Vokale', example: 'うみ', exampleMeaning: 'Meer' },
  { id: 'h-e', character: 'え', romaji: 'e', group: 'Vokale', example: 'えき', exampleMeaning: 'Bahnhof' },
  { id: 'h-o', character: 'お', romaji: 'o', group: 'Vokale', example: 'おかね', exampleMeaning: 'Geld' },

  // K-row
  { id: 'h-ka', character: 'か', romaji: 'ka', group: 'K-Reihe', example: 'かさ', exampleMeaning: 'Regenschirm' },
  { id: 'h-ki', character: 'き', romaji: 'ki', group: 'K-Reihe', example: 'きって', exampleMeaning: 'Briefmarke' },
  { id: 'h-ku', character: 'く', romaji: 'ku', group: 'K-Reihe', example: 'くるま', exampleMeaning: 'Auto' },
  { id: 'h-ke', character: 'け', romaji: 'ke', group: 'K-Reihe', example: 'けしゴム', exampleMeaning: 'Radiergummi' },
  { id: 'h-ko', character: 'こ', romaji: 'ko', group: 'K-Reihe', example: 'こども', exampleMeaning: 'Kind' },

  // S-row
  { id: 'h-sa', character: 'さ', romaji: 'sa', group: 'S-Reihe', example: 'さくら', exampleMeaning: 'Kirschblüte' },
  { id: 'h-shi', character: 'し', romaji: 'shi', group: 'S-Reihe', example: 'しごと', exampleMeaning: 'Arbeit' },
  { id: 'h-su', character: 'す', romaji: 'su', group: 'S-Reihe', example: 'すし', exampleMeaning: 'Sushi' },
  { id: 'h-se', character: 'せ', romaji: 'se', group: 'S-Reihe', example: 'せんせい', exampleMeaning: 'Lehrer' },
  { id: 'h-so', character: 'そ', romaji: 'so', group: 'S-Reihe', example: 'そと', exampleMeaning: 'Draußen' },

  // T-row
  { id: 'h-ta', character: 'た', romaji: 'ta', group: 'T-Reihe', example: 'たまご', exampleMeaning: 'Ei' },
  { id: 'h-chi', character: 'ち', romaji: 'chi', group: 'T-Reihe', example: 'ちず', exampleMeaning: 'Karte' },
  { id: 'h-tsu', character: 'つ', romaji: 'tsu', group: 'T-Reihe', example: 'つくえ', exampleMeaning: 'Schreibtisch' },
  { id: 'h-te', character: 'て', romaji: 'te', group: 'T-Reihe', example: 'てがみ', exampleMeaning: 'Brief' },
  { id: 'h-to', character: 'と', romaji: 'to', group: 'T-Reihe', example: 'ともだち', exampleMeaning: 'Freund' },

  // N-row
  { id: 'h-na', character: 'な', romaji: 'na', group: 'N-Reihe', example: 'なつ', exampleMeaning: 'Sommer' },
  { id: 'h-ni', character: 'に', romaji: 'ni', group: 'N-Reihe', example: 'にほん', exampleMeaning: 'Japan' },
  { id: 'h-nu', character: 'ぬ', romaji: 'nu', group: 'N-Reihe', example: 'ぬいぐるみ', exampleMeaning: 'Stofftier' },
  { id: 'h-ne', character: 'ね', romaji: 'ne', group: 'N-Reihe', example: 'ねこ', exampleMeaning: 'Katze' },
  { id: 'h-no', character: 'の', romaji: 'no', group: 'N-Reihe', example: 'のみもの', exampleMeaning: 'Getränk' },

  // H-row
  { id: 'h-ha', character: 'は', romaji: 'ha', group: 'H-Reihe', example: 'はな', exampleMeaning: 'Blume' },
  { id: 'h-hi', character: 'ひ', romaji: 'hi', group: 'H-Reihe', example: 'ひと', exampleMeaning: 'Mensch' },
  { id: 'h-fu', character: 'ふ', romaji: 'fu', group: 'H-Reihe', example: 'ふゆ', exampleMeaning: 'Winter' },
  { id: 'h-he', character: 'へ', romaji: 'he', group: 'H-Reihe', example: 'へや', exampleMeaning: 'Zimmer' },
  { id: 'h-ho', character: 'ほ', romaji: 'ho', group: 'H-Reihe', example: 'ほん', exampleMeaning: 'Buch' },

  // M-row
  { id: 'h-ma', character: 'ま', romaji: 'ma', group: 'M-Reihe', example: 'まど', exampleMeaning: 'Fenster' },
  { id: 'h-mi', character: 'み', romaji: 'mi', group: 'M-Reihe', example: 'みず', exampleMeaning: 'Wasser' },
  { id: 'h-mu', character: 'む', romaji: 'mu', group: 'M-Reihe', example: 'むし', exampleMeaning: 'Insekt' },
  { id: 'h-me', character: 'め', romaji: 'me', group: 'M-Reihe', example: 'め', exampleMeaning: 'Auge' },
  { id: 'h-mo', character: 'も', romaji: 'mo', group: 'M-Reihe', example: 'もり', exampleMeaning: 'Wald' },

  // Y-row
  { id: 'h-ya', character: 'や', romaji: 'ya', group: 'Y-Reihe', example: 'やま', exampleMeaning: 'Berg' },
  { id: 'h-yu', character: 'ゆ', romaji: 'yu', group: 'Y-Reihe', example: 'ゆき', exampleMeaning: 'Schnee' },
  { id: 'h-yo', character: 'よ', romaji: 'yo', group: 'Y-Reihe', example: 'よる', exampleMeaning: 'Nacht' },

  // R-row
  { id: 'h-ra', character: 'ら', romaji: 'ra', group: 'R-Reihe', example: 'らいねん', exampleMeaning: 'Nächstes Jahr' },
  { id: 'h-ri', character: 'り', romaji: 'ri', group: 'R-Reihe', example: 'りんご', exampleMeaning: 'Apfel' },
  { id: 'h-ru', character: 'る', romaji: 'ru', group: 'R-Reihe', example: 'るす', exampleMeaning: 'Abwesend' },
  { id: 'h-re', character: 'れ', romaji: 're', group: 'R-Reihe', example: 'れきし', exampleMeaning: 'Geschichte' },
  { id: 'h-ro', character: 'ろ', romaji: 'ro', group: 'R-Reihe', example: 'ろく', exampleMeaning: 'Sechs' },

  // W-row + N
  { id: 'h-wa', character: 'わ', romaji: 'wa', group: 'W-Reihe', example: 'わたし', exampleMeaning: 'Ich' },
  { id: 'h-wo', character: 'を', romaji: 'wo', group: 'W-Reihe', example: 'を (Partikel)', exampleMeaning: 'Objektpartikel' },
  { id: 'h-n', character: 'ん', romaji: 'n', group: 'W-Reihe', example: 'にほん', exampleMeaning: 'Japan' },
]

export const hiraganaGroups = [...new Set(hiraganaData.map(h => h.group))]
