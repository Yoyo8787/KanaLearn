import type { UIScriptMode } from '../utils/storage'

interface Props {
  value: UIScriptMode
  onChange: (value: UIScriptMode) => void
}

const OPTIONS: Array<{ key: UIScriptMode; label: string }> = [
  { key: 'hiragana', label: '平假名' },
  { key: 'katakana', label: '片假名' },
  { key: 'mixed', label: '混合' },
]

export function ScriptToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {OPTIONS.map((opt) => {
        const active = opt.key === value
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
