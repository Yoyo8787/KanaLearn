import { Fragment } from 'react'
import { CATEGORY_LABELS, KANA_TABLE_BASIC } from '../data/kanaData'
import type { KanaCategory, KanaItem, ScriptMode, TableCell } from '../data/kanaData'
import { computeMastery, masteryColor } from '../utils/mastery'
import type { StatsByKanaId } from '../utils/storage'
import { speakJapanese } from '../utils/speech'

interface Props {
  scriptMode: ScriptMode
  selectedCategories: KanaCategory[]
  stats: StatsByKanaId
  speechRate: number
  speechSupported: boolean
  onOpenExample: (item: KanaItem) => void
}

const vowelHeaders = ['a', 'i', 'u', 'e', 'o']

// 功能: 顯示假名表格，根據選擇的書寫系統和分類顯示假名單元格
export function KanaTable({
  scriptMode,
  selectedCategories,
  stats,
  speechRate,
  speechSupported,
  onOpenExample,
}: Props) {
  const renderCell = (cell: TableCell, rowIndex: number, colIndex: number) => {
    if (!cell) {
      return <div key={`${rowIndex}-${colIndex}`} className="h-20 rounded-xl bg-muted" />
    }

    const mastery = computeMastery(stats[cell.id])
    const bg = masteryColor(mastery)
    const script =
      scriptMode === 'hiragana'
        ? cell.hiragana
        : scriptMode === 'katakana'
        ? cell.katakana
        : `${cell.hiragana}・${cell.katakana}`
    const romaji = cell.romaji.toLowerCase()
    const inactive = !selectedCategories.includes(cell.category)

    return (
      <div
        key={cell.id}
        className={`group relative flex h-20 flex-col justify-center rounded-xl border text-center transition ${
          inactive
            ? 'border-dashed border-secondary bg-muted text-muted'
            : `border-transparent ${bg} text-secondary`
        }`}
      >
        <button
          disabled={inactive}
          onClick={() => onOpenExample(cell)}
          className="text-2xl font-bold tracking-wide"
        >
          {script}
        </button>
        <button
          disabled={inactive}
          onClick={() =>
            speakJapanese(scriptMode === 'katakana' ? cell.katakana : cell.hiragana, {
              rate: speechRate,
            })
          }
          className="text-xs font-semibold tracking-wide text-secondary underline decoration-dotted"
        >
          {romaji}
        </button>
        {!speechSupported && (
          <span className="absolute bottom-1 left-1 rounded bg-secondary px-2 py-0.5 text-[10px] text-danger shadow">
            無語音
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-175 rounded-2xl border border-secondary bg-secondary p-4 shadow-md dark:shadow-xl">
        <div className="grid grid-cols-[60px_repeat(5,minmax(0,1fr))] items-center gap-2 text-sm font-semibold text-muted">
          <div></div>
          {vowelHeaders.map((v) => (
            <div key={v} className="text-center uppercase">
              {v}
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[60px_repeat(5,minmax(0,1fr))] items-center gap-2">
          {KANA_TABLE_BASIC.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              <div className="text-center font-semibold uppercase text-muted">
                {['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'][rowIndex]}
              </div>
              {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
            </Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">灰色表示未選擇的類別，可透過類別過濾勾選啟用。</p>
        <div className="mt-4 rounded-xl border border-secondary bg-muted p-4 text-sm text-secondary">
          <p className="font-semibold">其他類別</p>
          <p>濁音、半濁音、拗音等會出現在測驗/聽力題庫中，開啟類別即可練習。</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <span key={key} className="rounded-full bg-secondary px-3 py-1 text-secondary shadow">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
