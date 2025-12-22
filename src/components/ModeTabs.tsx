import type { Mode } from '../utils/storage'

interface Props {
  mode: Mode
  onChange: (mode: Mode) => void
}

const MODES: { key: Mode; label: string }[] = [
  { key: 'learning', label: '學習' },
  { key: 'quiz', label: '測驗' },
  { key: 'listening', label: '聽力' },
]

export const ModeTabs = ({ mode, onChange }: Props) => {
  return (
    <div className="flex rounded-lg bg-slate-100 p-1 text-sm font-medium shadow-inner">
      {MODES.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`flex-1 rounded-md px-4 py-2 transition ${
            mode === item.key ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-sky-700'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
