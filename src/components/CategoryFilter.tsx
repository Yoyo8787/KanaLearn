import { CATEGORY_LABELS } from '../data/kanaData'
import type { KanaCategory } from '../data/kanaData'

interface Props {
  selected: KanaCategory[]
  onChange: (categories: KanaCategory[]) => void
}

export function CategoryFilter({ selected, onChange }: Props) {
  const toggle = (category: KanaCategory) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category))
    } else {
      onChange([...selected, category])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(CATEGORY_LABELS) as KanaCategory[]).map((category) => {
        const active = selected.includes(category)
        return (
          <button
            key={category}
            onClick={() => toggle(category)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              active
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            <input type="checkbox" checked={active} readOnly className="accent-indigo-600" />
            <span>{CATEGORY_LABELS[category]}</span>
          </button>
        )
      })}
    </div>
  )
}
