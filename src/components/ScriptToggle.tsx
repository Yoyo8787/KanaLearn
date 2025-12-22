import type { ScriptMode } from '../utils/storage'

interface Props {
  scriptMode: ScriptMode
  onChange: (mode: ScriptMode) => void
}

const OPTIONS: { key: ScriptMode; label: string }[] = [
  { key: 'hiragana', label: '平假名' },
  { key: 'katakana', label: '片假名' },
  { key: 'mixed', label: '混合' },
]

export const ScriptToggle = ({ scriptMode, onChange }: Props) => (
  <div className="flex flex-wrap gap-2">
    {OPTIONS.map((option) => (
      <button
        key={option.key}
        onClick={() => onChange(option.key)}
        className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
          scriptMode === option.key
            ? 'border-sky-500 bg-sky-50 text-sky-700'
            : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
)
