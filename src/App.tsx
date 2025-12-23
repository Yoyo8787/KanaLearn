import { useEffect, useMemo, useState } from 'react'
import { ExampleModal } from './components/ExampleModal'
import { ModeTabs } from './components/ModeTabs'
import { ScriptToggle } from './components/ScriptToggle'
import type { KanaItem } from './data/kanaData'
import type { StatsByKanaId, UIPreferences } from './utils/storage'
import { LearningPage } from './pages/LearningPage'
import { ListeningPage } from './pages/ListeningPage'
import { QuizPage } from './pages/QuizPage'
import { SettingsPage } from './pages/SettingsPage'
import {
  loadStats,
  loadUIPreferences,
  resetStats,
  saveStats,
  saveUIPreferences,
} from './utils/storage'
import { isSpeechSupported } from './utils/speech'

function App() {
  const [prefs, setPrefs] = useState<UIPreferences>(() => loadUIPreferences())
  const [stats, setStats] = useState<StatsByKanaId>(() => loadStats())
  const [exampleItem, setExampleItem] = useState<KanaItem | undefined>()

  const mode = prefs.lastMode
  const speechSupported = useMemo(() => isSpeechSupported(), [])

  useEffect(() => {
    saveUIPreferences(prefs)
  }, [prefs])

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
      <div className="mx-auto max-w-6xl space-y-6 pb-48 md:pb-24">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-b border-secondary pb-6  backdrop-blur dark:shadow-xl">
          <div>
            <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-primary">
              Kana Learn
            </h1>
            <p className="text-sm text-muted hidden md:inline">
              學習 / 測驗 / 聽力 三合一，支援平假名、片假名與混合模式
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ModeTabs
              value={mode}
              onChange={(m) => updatePrefs({ lastMode: m })}
              className="hidden md:inline-flex"
            />
            <ScriptToggle
              value={prefs.scriptMode}
              onChange={(v) => updatePrefs({ scriptMode: v })}
            />
          </div>
        </header>

        {mode === 'settings' && (
          <SettingsPage
            prefs={prefs}
            speechSupported={speechSupported}
            onUpdatePrefs={updatePrefs}
            onResetStats={handleReset}
          />
        )}

        {mode === 'learning' && (
          <LearningPage
            scriptMode={prefs.scriptMode}
            selectedCategories={selectedCategories}
            stats={stats}
            speechSupported={speechSupported}
            speechRate={prefs.speechRate}
            onOpenExample={(item) => setExampleItem(item)}
          />
        )}

        {mode === 'quiz' && (
          <QuizPage
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
          <ListeningPage
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
      <ModeTabs
        value={mode}
        onChange={(m) => updatePrefs({ lastMode: m })}
        className="fixed! left-1/2 -translate-x-1/2 bottom-2 h-16 w-11/12 md:hidden border border-primary inline-flex "
      />
    </div>
  )
}

export default App
