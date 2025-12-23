import type { Mode } from '../utils/storage'

interface Props {
  value: Mode
  onChange: (mode: Mode) => void
  className?: string
}

const MODES: { value: Mode; label: string }[] = [
  { value: 'learning', label: '學習' },
  { value: 'quiz', label: '測驗' },
  { value: 'listening', label: '聽力' },
  { value: 'settings', label: '設定' },
]

// 功能: 顯示模式切換標籤，允許用戶在學習、測驗、聽力與設定之間切換
export function ModeTabs({ value, onChange, className }: Props) {
  const activeIndex = Math.max(
    0,
    MODES.findIndex((mode) => mode.value === value)
  )
  const indicatorStyle = {
    width: `calc((100% - 0.5rem) / ${MODES.length})`,
    transform: `translateX(${activeIndex * 100}%)`,
  }

  return (
    <div
      className={`relative isolate flex items-center overflow-hidden rounded-2xl border border-muted bg-muted p-1 shadow-inner ${className ?? ''}`}
      role="tablist"
      aria-label="模式切換"
    >
      <div
        className="absolute inset-y-1 left-1 rounded-xl border border-primary bg-primary shadow-lg transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={indicatorStyle}
        aria-hidden="true"
      />
      {MODES.map((mode) => {
        const active = value === mode.value
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            role="tab"
            aria-selected={active}
            className={`relative z-10 flex-1 rounded-xl px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
              active
                ? 'text-secondary drop-shadow-sm'
                : 'text-muted hover:text-secondary'
            }`}
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}
