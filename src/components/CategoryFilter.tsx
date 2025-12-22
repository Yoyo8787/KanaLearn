import type { KanaCategory } from '../data/kanaData'

interface Props {
  selected: KanaCategory[]
  onChange: (value: KanaCategory[]) => void
}

const ALL_CATEGORIES: Array<{ key: KanaCategory; label: string; desc: string }> = [
  { key: 'basic', label: '基本', desc: 'あ〜ん' },
  { key: 'dakuten', label: '濁音', desc: 'が・ざ・だ・ば' },
  { key: 'handakuten', label: '半濁音', desc: 'ぱ行' },
  { key: 'youon', label: '拗音', desc: 'きゃ・しゃ・ちゃ…' },
]

export function CategoryFilter({ selected, onChange }: Props) {
  const toggle = (key: KanaCategory) => {
    const exists = selected.includes(key)
    if (exists) {
      onChange(selected.filter((c) => c !== key))
    } else {
      onChange([...selected, key])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((item) => {
        const active = selected.includes(item.key)
        return (
          <button
            key={item.key}
            onClick={() => toggle(item.key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              active
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-slate-500">{item.desc}</div>
          </button>
        )
      })}
    </div>
  )
}
