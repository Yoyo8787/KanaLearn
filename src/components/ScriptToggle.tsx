import type { ScriptMode } from '../data/kanaData'

interface Props {
  value: ScriptMode
  onChange: (mode: ScriptMode) => void
}

const OPTIONS: { value: ScriptMode; label: string }[] = [
  { value: 'hiragana', label: '平假名' },
  { value: 'katakana', label: '片假名' },
  { value: 'mixed', label: '混合' },
]

// 功能: 顯示書寫系統切換按鈕，允許用戶在平假名、片假名和混合模式之間切換
export function ScriptToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      {OPTIONS.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              active
                ? 'border-primary bg-primary text-primary shadow-sm'
                : 'border-secondary bg-secondary text-secondary hover:border-primary'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
