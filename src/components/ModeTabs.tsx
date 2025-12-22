interface Props {
  mode: 'learning' | 'quiz' | 'listening'
  onChange: (mode: 'learning' | 'quiz' | 'listening') => void
}

const MODES: Array<{ key: Props['mode']; label: string; desc: string }> = [
  { key: 'learning', label: '學習', desc: '查看五十音表 + 例詞' },
  { key: 'quiz', label: '測驗', desc: '選擇題 / 輸入題' },
  { key: 'listening', label: '聽力', desc: '聽發音選假名' },
]

export function ModeTabs({ mode, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {MODES.map((item) => {
        const active = mode === item.key
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`rounded-xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow ${
              active
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                : 'border-slate-200 bg-white text-slate-800'
            }`}
          >
            <div className="font-semibold">{item.label}</div>
            <div className="text-sm text-slate-500">{item.desc}</div>
          </button>
        )
      })}
    </div>
  )
}
