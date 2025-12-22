import type { KanaCategory } from '../data/kanaData'

interface Props {
  selected: KanaCategory[]
  onChange: (next: KanaCategory[]) => void
}

const OPTIONS: { key: KanaCategory; label: string; color: string }[] = [
  { key: 'basic', label: '基本', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { key: 'dakuten', label: '濁音', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { key: 'handakuten', label: '半濁音', color: 'bg-orange-50 text-orange-700 border-orange-100' },
  { key: 'youon', label: '拗音', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100' },
]

export const CategoryFilter = ({ selected, onChange }: Props) => {
  const toggle = (key: KanaCategory) => {
    if (selected.includes(key)) {
      onChange(selected.filter((item) => item !== key))
    } else {
      onChange([...selected, key])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => {
        const active = selected.includes(opt.key)
        return (
          <button
            key={opt.key}
            onClick={() => toggle(opt.key)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold transition ${
              active ? opt.color : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => toggle(opt.key)}
              className="accent-sky-500"
            />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
