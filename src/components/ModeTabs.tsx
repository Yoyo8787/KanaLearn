import type { Mode } from '../utils/storage'

interface Props {
  value: Mode
  onChange: (mode: Mode) => void
}

const MODES: { value: Mode; label: string }[] = [
  { value: 'learning', label: '學習' },
  { value: 'quiz', label: '測驗' },
  { value: 'listening', label: '聽力' },
  { value: 'settings', label: '設定' },
]

// 功能: 顯示模式切換標籤，允許用戶在學習、測驗、聽力與設定之間切換
export function ModeTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl bg-muted p-1 shadow-inner">
      {MODES.map((mode) => {
        const active = value === mode.value
        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              active
                ? 'bg-secondary text-primary shadow'
                : 'text-muted'
            }`}
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}
