import { useMemo, useState } from 'react'
import { KANA_TABLE_BASIC } from '../data/kanaData'
import type { KanaItem, TableCell } from '../data/kanaData'
import { masteryBadge, masteryColor, masteryScore } from '../utils/mastery'
import { speakJapanese, supportsSpeech } from '../utils/speech'

interface Props {
  script: 'hiragana' | 'katakana' | 'mixed'
  stats: Record<string, { correct: number; wrong: number; lastSeenAt: number }>
  onOpenExample: (item: KanaItem) => void
  speechRate: number
}

const columnLabels = ['a', 'i', 'u', 'e', 'o']

export const KanaTable = ({ script, stats, onOpenExample, speechRate }: Props) => {
  const [speechReady] = useState(supportsSpeech())

  const tableData = useMemo<TableCell[][]>(() => KANA_TABLE_BASIC, [])

  const renderGlyph = (item: KanaItem) => {
    if (script === 'mixed') return `${item.hiragana} / ${item.katakana}`
    return script === 'hiragana' ? item.hiragana : item.katakana
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="p-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">行</th>
            {columnLabels.map((col) => (
              <th key={col} className="p-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-slate-100">
              <td className="p-3 text-xs font-semibold uppercase text-slate-500">{rowIndex + 1}</td>
              {row.map((cell, colIndex) => {
                if (!cell)
                  return <td key={`${rowIndex}-${colIndex}`} className="p-2 text-center text-slate-300">—</td>
                const score = masteryScore(stats, cell.id)
                return (
                  <td key={cell.id} className="p-1">
                    <div
                      className="group relative flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-slate-100 px-2 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200"
                      style={{ backgroundColor: masteryColor(score) }}
                    >
                      <button
                        className="text-2xl font-semibold text-slate-800"
                        onClick={() => onOpenExample(cell)}
                        aria-label={`開啟 ${cell.romaji} 範例`}
                      >
                        {renderGlyph(cell)}
                      </button>
                      <button
                        onClick={() => speechReady && speakJapanese(cell.romaji, { rate: speechRate })}
                        disabled={!speechReady}
                        className="text-xs font-semibold text-slate-500 underline decoration-dotted underline-offset-4 disabled:text-slate-400"
                        aria-label={`播放 ${cell.romaji} 發音`}
                      >
                        {cell.romaji}
                      </button>
                      <span className="absolute right-2 top-2 rounded-full bg-white/80 px-2 text-[10px] font-bold text-slate-600">
                        {masteryBadge(stats, cell.id)}
                      </span>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {!speechReady && <div className="p-3 text-xs text-amber-600">瀏覽器未支援語音合成，播放按鈕已停用。</div>}
    </div>
  )
}
