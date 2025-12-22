import { useEffect, useMemo, useState } from 'react'
import { CategoryFilter } from './components/CategoryFilter'
import { ExampleModal } from './components/ExampleModal'
import { KanaTable } from './components/KanaTable'
import { Listening } from './components/Listening'
import { ModeTabs } from './components/ModeTabs'
import { ProgressLegend } from './components/ProgressLegend'
import { Quiz } from './components/Quiz'
import { ScriptToggle } from './components/ScriptToggle'
import type { KanaItem, KanaCategory } from './data/kanaData'
import { KANA_ITEMS } from './data/kanaData'
import { speakJapanese, supportsSpeech } from './utils/speech'
import { loadPrefs, loadStats, resetStats, savePrefs, saveStats } from './utils/storage'
import type { Mode, QuizType, ScriptMode } from './utils/storage'

function App() {
  const [mode, setMode] = useState<Mode>('learning')
  const [scriptMode, setScriptMode] = useState<ScriptMode>('hiragana')
  const [categories, setCategories] = useState<KanaCategory[]>(['basic'])
  const [quizType, setQuizType] = useState<QuizType>('multiple')
  const [stats, setStats] = useState(loadStats())
  const [speechRate, setSpeechRate] = useState(1)
  const [exampleItem, setExampleItem] = useState<KanaItem>()

  useEffect(() => {
    const prefs = loadPrefs()
    setMode(prefs.lastMode)
    setScriptMode(prefs.scriptMode)
    setCategories(prefs.selectedCategories)
    setQuizType(prefs.quizType)
    setSpeechRate(prefs.speechRate)
  }, [])

  useEffect(() => {
    savePrefs({
      lastMode: mode,
      scriptMode,
      selectedCategories: categories,
      quizType,
      speechRate,
    })
  }, [mode, scriptMode, categories, quizType, speechRate])

  useEffect(() => {
    saveStats(stats)
  }, [stats])

  const filteredItems = useMemo(() => KANA_ITEMS.filter((item) => categories.includes(item.category)), [categories])

  const updateStats = (id: string, correct: boolean) => {
    setStats((prev) => {
      const current = prev[id] || { correct: 0, wrong: 0, lastSeenAt: 0 }
      const next = {
        ...prev,
        [id]: {
          correct: current.correct + (correct ? 1 : 0),
          wrong: current.wrong + (correct ? 0 : 1),
          lastSeenAt: Date.now(),
        },
      }
      return next
    })
  }

  const handleReset = () => {
    resetStats()
    setStats({})
  }

  const scriptForExample = scriptMode === 'mixed' ? 'hiragana' : scriptMode

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">KanaLearn 假名練習室</h1>
            <p className="text-sm text-slate-600">平假名 / 片假名學習、測驗、聽力一次完成</p>
          </div>
          <ModeTabs mode={mode} onChange={setMode} />
        </header>

        <section className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:grid-cols-2">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-700">假名顯示</div>
            <ScriptToggle scriptMode={scriptMode} onChange={setScriptMode} />
          </div>
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-700">類別</div>
            <CategoryFilter selected={categories} onChange={setCategories} />
          </div>
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-700">語速</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.1}
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="text-sm text-slate-600">{speechRate.toFixed(1)}x</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReset}
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              重設熟練度
            </button>
            {!supportsSpeech() && <span className="text-xs text-amber-700">瀏覽器不支援語音，播放按鈕已停用</span>}
          </div>
        </section>

        {mode === 'learning' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-lg font-semibold text-slate-800">五十音表</div>
              <ProgressLegend />
            </div>
            <KanaTable
              script={scriptMode}
              stats={stats}
              onOpenExample={(item) => {
                setExampleItem(item)
                speakJapanese(item.romaji, { rate: speechRate })
              }}
              speechRate={speechRate}
            />
          </div>
        )}

        {mode === 'quiz' && (
          <Quiz
            pool={filteredItems}
            scriptMode={scriptMode}
            quizType={quizType}
            onQuizTypeChange={setQuizType}
            stats={stats}
            onUpdateStats={updateStats}
            speechRate={speechRate}
          />
        )}

        {mode === 'listening' && (
          <Listening
            pool={filteredItems}
            scriptMode={scriptMode}
            stats={stats}
            onUpdateStats={updateStats}
            speechRate={speechRate}
          />
        )}
      </div>

      <ExampleModal
        open={Boolean(exampleItem)}
        item={exampleItem}
        script={scriptForExample}
        onClose={() => setExampleItem(undefined)}
        speechRate={speechRate}
      />
    </div>
  )
}

export default App
