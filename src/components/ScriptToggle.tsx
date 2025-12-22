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
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
