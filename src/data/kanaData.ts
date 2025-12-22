export type KanaCategory = 'basic' | 'dakuten' | 'handakuten' | 'youon'

export interface KanaItem {
  id: string
  category: KanaCategory
  row: number
  col: number
  hiragana: string
  katakana: string
  romaji: string
  example: {
    word: string
    reading: string
    meaning: string
  }
}

export interface TableCell {
  itemId?: string
  label?: string
}

const baseItems: Array<Omit<KanaItem, 'id' | 'example'> & { example?: KanaItem['example'] }> = []

function buildItem(
  category: KanaCategory,
  row: number,
  col: number,
  hiragana: string,
  katakana: string,
  romaji: string,
  example: KanaItem['example']
) {
  baseItems.push({ category, row, col, hiragana, katakana, romaji, example })
}

// Basic gojūon
const basicExamples: Record<string, KanaItem['example']> = {
  a: { word: 'あさ', reading: 'asa', meaning: 'morning' },
  i: { word: 'いえ', reading: 'ie', meaning: 'house' },
  u: { word: 'うみ', reading: 'umi', meaning: 'sea' },
  e: { word: 'えき', reading: 'eki', meaning: 'station' },
  o: { word: 'おちゃ', reading: 'ocha', meaning: 'tea' },
  ka: { word: 'かさ', reading: 'kasa', meaning: 'umbrella' },
  ki: { word: 'きつね', reading: 'kitsune', meaning: 'fox' },
  ku: { word: 'くも', reading: 'kumo', meaning: 'cloud' },
  ke: { word: 'けむり', reading: 'kemuri', meaning: 'smoke' },
  ko: { word: 'こえ', reading: 'koe', meaning: 'voice' },
  sa: { word: 'さくら', reading: 'sakura', meaning: 'cherry blossom' },
  shi: { word: 'しお', reading: 'shio', meaning: 'salt' },
  su: { word: 'すし', reading: 'sushi', meaning: 'sushi' },
  se: { word: 'せかい', reading: 'sekai', meaning: 'world' },
  so: { word: 'そら', reading: 'sora', meaning: 'sky' },
  ta: { word: 'たこ', reading: 'tako', meaning: 'octopus' },
  chi: { word: 'ちず', reading: 'chizu', meaning: 'map' },
  tsu: { word: 'つき', reading: 'tsuki', meaning: 'moon' },
  te: { word: 'てがみ', reading: 'tegami', meaning: 'letter' },
  to: { word: 'とり', reading: 'tori', meaning: 'bird' },
  na: { word: 'なつ', reading: 'natsu', meaning: 'summer' },
  ni: { word: 'にく', reading: 'niku', meaning: 'meat' },
  nu: { word: 'ぬの', reading: 'nuno', meaning: 'cloth' },
  ne: { word: 'ねこ', reading: 'neko', meaning: 'cat' },
  no: { word: 'のり', reading: 'nori', meaning: 'seaweed' },
  ha: { word: 'はな', reading: 'hana', meaning: 'flower' },
  hi: { word: 'ひかり', reading: 'hikari', meaning: 'light' },
  fu: { word: 'ふね', reading: 'fune', meaning: 'boat' },
  he: { word: 'へや', reading: 'heya', meaning: 'room' },
  ho: { word: 'ほし', reading: 'hoshi', meaning: 'star' },
  ma: { word: 'まど', reading: 'mado', meaning: 'window' },
  mi: { word: 'みず', reading: 'mizu', meaning: 'water' },
  mu: { word: 'むし', reading: 'mushi', meaning: 'insect' },
  me: { word: 'めがね', reading: 'megane', meaning: 'glasses' },
  mo: { word: 'もり', reading: 'mori', meaning: 'forest' },
  ya: { word: 'やま', reading: 'yama', meaning: 'mountain' },
  yu: { word: 'ゆき', reading: 'yuki', meaning: 'snow' },
  yo: { word: 'よる', reading: 'yoru', meaning: 'night' },
  ra: { word: 'らくだ', reading: 'rakuda', meaning: 'camel' },
  ri: { word: 'りんご', reading: 'ringo', meaning: 'apple' },
  ru: { word: 'るす', reading: 'rusu', meaning: 'absence' },
  re: { word: 'れきし', reading: 'rekishi', meaning: 'history' },
  ro: { word: 'ろうそく', reading: 'rousoku', meaning: 'candle' },
  wa: { word: 'わに', reading: 'wani', meaning: 'crocodile' },
  wo: { word: 'をとこ', reading: 'otoko', meaning: 'man' },
  n: { word: 'パン', reading: 'pan', meaning: 'bread' },
}

const gojuonRows = [
  ['', 'a', 'i', 'u', 'e', 'o'],
  ['k', 'ka', 'ki', 'ku', 'ke', 'ko'],
  ['s', 'sa', 'shi', 'su', 'se', 'so'],
  ['t', 'ta', 'chi', 'tsu', 'te', 'to'],
  ['n', 'na', 'ni', 'nu', 'ne', 'no'],
  ['h', 'ha', 'hi', 'fu', 'he', 'ho'],
  ['m', 'ma', 'mi', 'mu', 'me', 'mo'],
  ['y', 'ya', '', 'yu', '', 'yo'],
  ['r', 'ra', 'ri', 'ru', 're', 'ro'],
  ['w', 'wa', '', '', '', 'wo'],
  ['n', '', '', '', '', 'n'],
]

gojuonRows.forEach((row, rowIndex) => {
  row.forEach((romaji, colIndex) => {
    if (!romaji || (romaji.length === 1 && rowIndex === 0 && colIndex === 0)) return
    const example = basicExamples[romaji as keyof typeof basicExamples] || {
      word: 'ことば',
      reading: 'kotoba',
      meaning: 'word',
    }
    const hiraTable = [
      ['あ', 'い', 'う', 'え', 'お'],
      ['か', 'き', 'く', 'け', 'こ'],
      ['さ', 'し', 'す', 'せ', 'そ'],
      ['た', 'ち', 'つ', 'て', 'と'],
      ['な', 'に', 'ぬ', 'ね', 'の'],
      ['は', 'ひ', 'ふ', 'へ', 'ほ'],
      ['ま', 'み', 'む', 'め', 'も'],
      ['や', '', 'ゆ', '', 'よ'],
      ['ら', 'り', 'る', 'れ', 'ろ'],
      ['わ', '', '', '', 'を'],
      ['', '', '', '', 'ん'],
    ]
    const kataTable = [
      ['ア', 'イ', 'ウ', 'エ', 'オ'],
      ['カ', 'キ', 'ク', 'ケ', 'コ'],
      ['サ', 'シ', 'ス', 'セ', 'ソ'],
      ['タ', 'チ', 'ツ', 'テ', 'ト'],
      ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
      ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
      ['マ', 'ミ', 'ム', 'メ', 'モ'],
      ['ヤ', '', 'ユ', '', 'ヨ'],
      ['ラ', 'リ', 'ル', 'レ', 'ロ'],
      ['ワ', '', '', '', 'ヲ'],
      ['', '', '', '', 'ン'],
    ]
    buildItem(
      'basic',
      rowIndex,
      colIndex - 1,
      hiraTable[rowIndex][colIndex - 1],
      kataTable[rowIndex][colIndex - 1],
      romaji,
      example
    )
  })
})

// Dakuten base rows
const dakutenBase: Array<[string, string[]]> = [
  ['g', ['ga', 'gi', 'gu', 'ge', 'go']],
  ['z', ['za', 'ji', 'zu', 'ze', 'zo']],
  ['d', ['da', 'ji', 'zu', 'de', 'do']],
  ['b', ['ba', 'bi', 'bu', 'be', 'bo']],
]

const dakutenHira = [
  ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  ['だ', 'ぢ', 'づ', 'で', 'ど'],
  ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
]
const dakutenKata = [
  ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'],
  ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
  ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'],
  ['バ', 'ビ', 'ブ', 'ベ', 'ボ'],
]
const dakutenExamples: KanaItem['example'][] = [
  { word: 'がいこく', reading: 'gaikoku', meaning: 'foreign country' },
  { word: 'じしょ', reading: 'jisho', meaning: 'dictionary' },
  { word: 'でんしゃ', reading: 'densha', meaning: 'train' },
  { word: 'ばら', reading: 'bara', meaning: 'rose' },
]

dakutenBase.forEach(([, romajiList], i) => {
  romajiList.forEach((romaji, idx) => {
    buildItem(
      'dakuten',
      10 + i,
      idx,
      dakutenHira[i][idx],
      dakutenKata[i][idx],
      romaji,
      dakutenExamples[i]
    )
  })
})

// Handakuten
const handakutenRomaji = ['pa', 'pi', 'pu', 'pe', 'po']
const handakutenHira = ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']
const handakutenKata = ['パ', 'ピ', 'プ', 'ペ', 'ポ']
handakutenRomaji.forEach((romaji, idx) => {
  buildItem(
    'handakuten',
    14,
    idx,
    handakutenHira[idx],
    handakutenKata[idx],
    romaji,
    { word: 'パンダ', reading: 'panda', meaning: 'panda' }
  )
})

// Youon (contracted sounds)
const youonSet = [
  { base: 'k', hira: 'き', kata: 'キ', romajiBase: 'ky' },
  { base: 's', hira: 'し', kata: 'シ', romajiBase: 'sh' },
  { base: 't', hira: 'ち', kata: 'チ', romajiBase: 'ch' },
  { base: 'n', hira: 'に', kata: 'ニ', romajiBase: 'ny' },
  { base: 'h', hira: 'ひ', kata: 'ヒ', romajiBase: 'hy' },
  { base: 'm', hira: 'み', kata: 'ミ', romajiBase: 'my' },
  { base: 'r', hira: 'り', kata: 'リ', romajiBase: 'ry' },
  { base: 'g', hira: 'ぎ', kata: 'ギ', romajiBase: 'gy' },
  { base: 'j', hira: 'じ', kata: 'ジ', romajiBase: 'j' },
  { base: 'b', hira: 'び', kata: 'ビ', romajiBase: 'by' },
  { base: 'p', hira: 'ぴ', kata: 'ピ', romajiBase: 'py' },
]

const youonVowels = [
  { suffix: 'a', hira: 'ゃ', kata: 'ャ', label: 'ya' },
  { suffix: 'u', hira: 'ゅ', kata: 'ュ', label: 'yu' },
  { suffix: 'o', hira: 'ょ', kata: 'ョ', label: 'yo' },
]

youonSet.forEach((set, setIndex) => {
  youonVowels.forEach((vowel, idx) => {
    buildItem(
      'youon',
      15 + setIndex,
      idx,
      `${set.hira}${vowel.hira}`,
      `${set.kata}${vowel.kata}`,
      `${set.romajiBase}${vowel.suffix}`,
      {
        word: `${set.hira}${vowel.hira}くん`,
        reading: `${set.romajiBase}${vowel.suffix}kun`,
        meaning: 'nickname example',
      }
    )
  })
})

export const KANA_ITEMS: KanaItem[] = baseItems.map((item) => ({
  id: item.romaji,
  ...item,
  example: item.example || { word: 'ことば', reading: 'kotoba', meaning: 'word' },
}))

export const KANA_TABLE_BASIC: TableCell[][] = (() => {
  const table: TableCell[][] = []
  const map: Record<string, string> = {}
  KANA_ITEMS.forEach((item) => {
    map[`${item.row}-${item.col}-${item.category}`] = item.id
  })

  // Base gojūon + modifiers
  const rows: Array<{ cols: number; label?: string; category?: KanaCategory }> = [
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'basic' },
    { cols: 5, label: 'dakuten' },
    { cols: 5, label: 'dakuten' },
    { cols: 5, label: 'dakuten' },
    { cols: 5, label: 'dakuten' },
    { cols: 5, label: 'handakuten' },
  ]

  for (let r = 0; r < rows.length; r++) {
    const rowCells: TableCell[] = []
    for (let c = 0; c < rows[r].cols; c++) {
      const itemId = map[`${r}-${c}-${rows[r].label}`]
      rowCells.push(itemId ? { itemId } : { label: '' })
    }
    table.push(rowCells)
  }

  // Youon condensed table (3 columns)
  for (let r = 0; r < youonSet.length; r++) {
    const rowCells: TableCell[] = []
    for (let c = 0; c < 3; c++) {
      const itemId = map[`${15 + r}-${c}-youon`]
      rowCells.push(itemId ? { itemId } : { label: '' })
    }
    table.push(rowCells)
  }

  return table
})()
