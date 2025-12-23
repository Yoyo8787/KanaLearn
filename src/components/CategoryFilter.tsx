import { CATEGORY_LABELS } from '../data/kanaData'
import type { KanaCategory } from '../data/kanaData'

interface Props {
  selected: KanaCategory[]
  onChange: (categories: KanaCategory[]) => void
}

// 功能: 顯示假名分類篩選按鈕，允許用戶選擇多個分類
// 包含基本、浊音、半浊音、拗音等分類
export function CategoryFilter({ selected, onChange }: Props) {
  const toggle = (category: KanaCategory) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category))
    } else {
      onChange([...selected, category])
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2  max-w-xl">
      {(Object.keys(CATEGORY_LABELS) as KanaCategory[]).map((category) => {
        const active = selected.includes(category)
        return (
          <button
            key={category}
            onClick={() => toggle(category)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              active
                ? 'border-primary bg-primary text-primary shadow'
                : 'border-secondary bg-secondary text-secondary hover:border-primary'
            }`}
          >
            <input
              type="checkbox"
              checked={active}
              readOnly
              className="accent-primary h-4 w-4 rounded border-primary bg-primary"
            />
            <span>{CATEGORY_LABELS[category]}</span>
          </button>
        )
      })}
    </div>
  )
}
