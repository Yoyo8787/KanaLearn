import type { Mode } from '../utils/storage'

interface Props {
  value: Mode
  onChange: (mode: Mode) => void
}

const MODES: { value: Mode; label: string }[] = [
  { value: 'learning', label: '學習' },
  { value: 'quiz', label: '測驗' },
  { value: 'listening', label: '聽力' },
]

export function ModeTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1 shadow-inner dark:bg-slate-800">
      {MODES.map((mode) => {
        const active = value === mode.value
        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              active ? 'bg-white shadow text-indigo-600 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-200'
            }`}
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}
