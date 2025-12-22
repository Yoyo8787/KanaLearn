import { useEffect, useMemo, useState } from 'react'
import { CategoryFilter } from './components/CategoryFilter'
import { ExampleModal } from './components/ExampleModal'
import { KanaTable } from './components/KanaTable'
import { Listening } from './components/Listening'
import { ModeTabs } from './components/ModeTabs'
import { ProgressLegend } from './components/ProgressLegend'
import { Quiz } from './components/Quiz'
import { ScriptToggle } from './components/ScriptToggle'
import { CATEGORY_LABELS } from './data/kanaData'
import type { KanaItem } from './data/kanaData'
import type { StatsByKanaId, UIPreferences } from './utils/storage'
import { defaultUIPreferences, loadStats, loadUIPreferences, resetStats, saveStats, saveUIPreferences } from './utils/storage'
import { isSpeechSupported } from './utils/speech'

function App() {
  const [prefs, setPrefs] = useState<UIPreferences>(defaultUIPreferences)
  const [stats, setStats] = useState<StatsByKanaId>({})
  const [mode, setMode] = useState(defaultUIPreferences.lastMode)
  const [exampleItem, setExampleItem] = useState<KanaItem | undefined>()

  const speechSupported = useMemo(() => isSpeechSupported(), [])

  useEffect(() => {
    setPrefs(loadUIPreferences())
    setStats(loadStats())
  }, [])

  useEffect(() => {
    saveUIPreferences({ ...prefs, lastMode: mode })
  }, [prefs, mode])

  const updatePrefs = (partial: Partial<UIPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...partial }))
  }

  const recordResult = (id: string, correct: boolean) => {
    setStats((prev) => {
      const stat = prev[id] ?? { correct: 0, wrong: 0, lastSeenAt: 0 }
      const next: StatsByKanaId = {
        ...prev,
        [id]: {
          correct: stat.correct + (correct ? 1 : 0),
          wrong: stat.wrong + (correct ? 0 : 1),
          lastSeenAt: Date.now(),
        },
      }
      saveStats(next)
      return next
    })
  }

  const handleReset = () => {
    resetStats()
    setStats({})
  }

  const selectedCategories = prefs.selectedCategories

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">Kana Learn</p>
            <h1 className="text-3xl font-bold text-slate-900">日文假名 練習站</h1>
            <p className="text-sm text-slate-600">學習 / 測驗 / 聽力 三合一，支援平假名、片假名與混合模式</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ModeTabs
              value={mode}
              onChange={(m) => {
                setMode(m)
                updatePrefs({ lastMode: m })
              }}
            />
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>語速</span>
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.1}
                value={prefs.speechRate}
                onChange={(e) => updatePrefs({ speechRate: Number(e.target.value) })}
              />
              <span className="font-semibold text-indigo-600">{prefs.speechRate.toFixed(1)}x</span>
            </div>
            {!speechSupported && (
              <span className="text-xs text-rose-600">瀏覽器不支援 SpeechSynthesis，播放將停用</span>
            )}
          </div>
        </header>

        <div className="rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ScriptToggle value={prefs.scriptMode} onChange={(v) => updatePrefs({ scriptMode: v })} />
            <CategoryFilter selected={selectedCategories} onChange={(v) => updatePrefs({ selectedCategories: v })} />
            <button
              onClick={handleReset}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              重設進度
            </button>
          </div>
        </div>

        {mode === 'learning' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">學習模式</h2>
              <ProgressLegend />
            </div>
            <KanaTable
              scriptMode={prefs.scriptMode}
              selectedCategories={selectedCategories}
              stats={stats}
              speechSupported={speechSupported}
              speechRate={prefs.speechRate}
              onOpenExample={(item) => setExampleItem(item)}
            />
          </div>
        )}

        {mode === 'quiz' && (
          <Quiz
            scriptMode={prefs.scriptMode}
            categories={selectedCategories}
            quizType={prefs.quizType}
            stats={stats}
            speechSupported={speechSupported}
            speechRate={prefs.speechRate}
            onChangeQuizType={(type) => updatePrefs({ quizType: type })}
            onRecordResult={recordResult}
          />
        )}

        {mode === 'listening' && (
          <Listening
            scriptMode={prefs.scriptMode}
            categories={selectedCategories}
            stats={stats}
            speechSupported={speechSupported}
            speechRate={prefs.speechRate}
            onRecordResult={recordResult}
          />
        )}

        <div className="rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
          <h3 className="text-xl font-semibold text-slate-900">目前類別</h3>
          <p className="text-sm text-slate-600">支援平假名、片假名、混合出題，錯得越多會越常出現。</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCategories.map((c) => (
              <span key={c} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                {CATEGORY_LABELS[c]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ExampleModal
        item={exampleItem}
        open={!!exampleItem}
        onClose={() => setExampleItem(undefined)}
        speechRate={prefs.speechRate}
        speechSupported={speechSupported}
      />
    </div>
  )
}

export default App
