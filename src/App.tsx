import { useEffect, useMemo, useState } from 'react'
import { CategoryFilter } from './components/CategoryFilter'
import { ExampleModal } from './components/ExampleModal'
import { KanaTable } from './components/KanaTable'
import { Listening } from './components/Listening'
import { ModeTabs } from './components/ModeTabs'
import { ProgressLegend } from './components/ProgressLegend'
import { Quiz } from './components/Quiz'
import { ScriptToggle } from './components/ScriptToggle'
import type { KanaItem } from './data/kanaData'
import type { StatsByKanaId, UIPreferences } from './utils/storage'
import {
  defaultUIPreferences,
  loadStats,
  loadUIPreferences,
  resetStats,
  saveStats,
  saveUIPreferences,
} from './utils/storage'
import { isSpeechSupported } from './utils/speech'

function App() {
  const [prefs, setPrefs] = useState<UIPreferences>(defaultUIPreferences)
  const [stats, setStats] = useState<StatsByKanaId>({})
  const [mode, setMode] = useState(defaultUIPreferences.lastMode)
  const [exampleItem, setExampleItem] = useState<KanaItem | undefined>()
  const [hydrated, setHydrated] = useState(false)

  const speechSupported = useMemo(() => isSpeechSupported(), [])

  useEffect(() => {
    setPrefs(loadUIPreferences())
    setStats(loadStats())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveUIPreferences({ ...prefs, lastMode: mode })
  }, [prefs, mode, hydrated])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', prefs.darkMode)
    root.style.setProperty('color-scheme', prefs.darkMode ? 'dark' : 'light')
  }, [prefs.darkMode])

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
    <div className="min-h-screen bg-app-with-accents p-4 text-secondary">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-secondary bg-secondary p-6 shadow-lg backdrop-blur dark:shadow-xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Kana Learn
            </p>
            <h1 className="text-3xl font-bold text-secondary">日文假名 練習</h1>
            <p className="text-sm text-muted">
              學習 / 測驗 / 聽力 三合一，支援平假名、片假名與混合模式
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ModeTabs
              value={mode}
              onChange={(m) => {
                setMode(m)
                updatePrefs({ lastMode: m })
              }}
            />
            <div className="flex items-center gap-3 text-sm text-muted">
              <span>語速</span>
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.1}
                value={prefs.speechRate}
                onChange={(e) => updatePrefs({ speechRate: Number(e.target.value) })}
                className="accent-primary"
              />
              <span className="font-semibold text-primary">{prefs.speechRate.toFixed(1)}x</span>
            </div>
            <button
              onClick={() => updatePrefs({ darkMode: !prefs.darkMode })}
              className="flex items-center gap-2 rounded-full border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-primary hover:border-primary"
              aria-pressed={prefs.darkMode}
            >
              <span className="text-lg">{prefs.darkMode ? '🌙' : '☀️'}</span>
              {prefs.darkMode ? '深色模式' : '淺色模式'}
            </button>
            {!speechSupported && (
              <span className="text-xs text-danger">瀏覽器不支援 SpeechSynthesis，播放將停用</span>
            )}
          </div>
        </header>

        <div className="rounded-3xl border border-secondary bg-secondary p-6 shadow-lg backdrop-blur dark:shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ScriptToggle
              value={prefs.scriptMode}
              onChange={(v) => updatePrefs({ scriptMode: v })}
            />
            <CategoryFilter
              selected={selectedCategories}
              onChange={(v) => updatePrefs({ selectedCategories: v })}
            />
            <button
              onClick={handleReset}
              className="rounded-full border border-danger bg-danger px-4 py-2 text-sm font-semibold text-danger hover:bg-danger"
            >
              重設進度
            </button>
          </div>
        </div>

        {mode === 'learning' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-secondary">學習模式</h2>
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
