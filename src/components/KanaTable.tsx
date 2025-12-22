import { useMemo } from 'react'
import { KANA_ITEMS, KANA_TABLE_BASIC } from '../data/kanaData'
import type { KanaCategory, TableCell } from '../data/kanaData'
import { accuracyBadge, masteryColor } from '../utils/mastery'
import type { UIScriptMode, StatsMap } from '../utils/storage'

interface Props {
  scriptMode: UIScriptMode
  selectedCategories: KanaCategory[]
  onRomajiClick: (id: string) => void
  onSelectItem: (id: string) => void
  stats: StatsMap
}

const itemMap = Object.fromEntries(KANA_ITEMS.map((item) => [item.id, item]))

function renderGlyph(id: string, script: UIScriptMode) {
  const item = itemMap[id]
  if (!item) return ''
  if (script === 'mixed') {
    return Math.random() > 0.5 ? item.hiragana : item.katakana
  }
  return script === 'katakana' ? item.katakana : item.hiragana
}

export function KanaTable({ scriptMode, selectedCategories, onRomajiClick, onSelectItem, stats }: Props) {
  const filteredIds = useMemo(
    () => new Set(KANA_ITEMS.filter((k) => selectedCategories.includes(k.category)).map((k) => k.id)),
    [selectedCategories]
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="overflow-auto">
        <table className="min-w-full table-fixed border-collapse">
          <tbody className="text-center">
            {KANA_TABLE_BASIC.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell: TableCell, colIndex) => {
                  if (!cell.itemId) {
                    return <td key={colIndex} className="h-16 border border-slate-100"></td>
                  }
                  const item = itemMap[cell.itemId]
                  const visible = filteredIds.has(cell.itemId)
                  const stat = stats[cell.itemId]
                  const badge = accuracyBadge(stat)
                  return (
                    <td
                      key={colIndex}
                      className={`h-24 border border-slate-100 p-1 transition ${
                        visible ? 'cursor-pointer' : 'opacity-30'
                      }`}
                    >
                      <div
                        className={`flex h-full flex-col items-center justify-center rounded-xl p-2 ${
                          masteryColor(stat)
                        }`}
                      >
                        <button
                          onClick={() => onSelectItem(cell.itemId!)}
                          disabled={!visible}
                          className="text-2xl font-bold tracking-wide disabled:cursor-not-allowed"
                        >
                          {renderGlyph(cell.itemId, scriptMode)}
                        </button>
                        <button
                          onClick={() => onRomajiClick(cell.itemId!)}
                          disabled={!visible}
                          className="mt-1 text-xs text-slate-700 underline-offset-2 hover:underline disabled:cursor-not-allowed"
                        >
                          {item.romaji}
                        </button>
                        <span className="mt-1 rounded-full bg-white/80 px-2 text-[11px] font-medium text-slate-700">
                          {badge}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
