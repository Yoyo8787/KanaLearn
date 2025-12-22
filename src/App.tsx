import { useEffect, useMemo, useState } from 'react'
import { CategoryFilter } from './components/CategoryFilter'
import { ExampleModal } from './components/ExampleModal'
import { KanaTable } from './components/KanaTable'
import { Listening } from './components/Listening'
import { ModeTabs } from './components/ModeTabs'
import { ProgressLegend } from './components/ProgressLegend'
import { Quiz } from './components/Quiz'
import { ScriptToggle } from './components/ScriptToggle'
import { KANA_ITEMS } from './data/kanaData'
import {
  loadStats,
  loadUIPreferences,
  resetProgress,
  saveStats,
  saveUIPreferences,
} from './utils/storage'
import type { UIPreferences, StatsMap, UIScriptMode } from './utils/storage'
import type { KanaItem } from './data/kanaData'
import { canUseSpeech, speakJapanese } from './utils/speech'

function App() {
  const [prefs, setPrefs] = useState<UIPreferences>(loadUIPreferences())
  const [stats, setStats] = useState<StatsMap>(loadStats())
  const [selectedItem, setSelectedItem] = useState<KanaItem | undefined>(undefined)

  useEffect(() => {
    saveUIPreferences(prefs)
  }, [prefs])

  useEffect(() => {
    saveStats(stats)
  }, [stats])

  const filteredItems = useMemo(
    () => KANA_ITEMS.filter((k) => prefs.selectedCategories.includes(k.category)),
    [prefs.selectedCategories]
  )

  const updateStats = (id: string, result: 'correct' | 'wrong') => {
    setStats((prev) => {
      const current = prev[id] || { correct: 0, wrong: 0, lastSeenAt: Date.now() }
      const updated = {
        ...current,
        correct: current.correct + (result === 'correct' ? 1 : 0),
        wrong: current.wrong + (result === 'wrong' ? 1 : 0),
        lastSeenAt: Date.now(),
      }
      return { ...prev, [id]: updated }
    })
  }

  const handleRomajiClick = (id: string) => {
    const item = KANA_ITEMS.find((k) => k.id === id)
    if (item && canUseSpeech) speakJapanese(item.hiragana, { rate: prefs.speechRate })
  }

  const handleSelectItem = (id: string) => {
    const item = KANA_ITEMS.find((k) => k.id === id)
    setSelectedItem(item)
  }

  const handleReset = () => {
    resetProgress()
    setStats({})
  }

  const handlePrefChange = (updates: Partial<UIPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">KanaLearn</p>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">學日文假名 線上練習</h1>
            <p className="mt-2 text-slate-600">平假名 / 片假名、選擇題、輸入題、聽力一次搞定</p>
          </div>
          <div className="flex items-center gap-3">
            <ScriptToggle
              value={prefs.scriptMode}
              onChange={(value) => handlePrefChange({ scriptMode: value })}
            />
          </div>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <ModeTabs mode={prefs.lastMode} onChange={(mode) => handlePrefChange({ lastMode: mode })} />
          <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm">
            <span>語速</span>
            <input
              type="range"
              min={0.6}
              max={1.4}
              step={0.1}
              value={prefs.speechRate}
              onChange={(e) => handlePrefChange({ speechRate: Number(e.target.value) })}
            />
            <span className="font-semibold text-indigo-700">{prefs.speechRate.toFixed(1)}</span>
          </div>
          <button
            onClick={handleReset}
            className="ml-auto rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-100"
          >
            重設進度
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryFilter
              selected={prefs.selectedCategories}
              onChange={(value) => handlePrefChange({ selectedCategories: value })}
            />
            <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <span>語音：</span>
              <span className={canUseSpeech ? 'text-emerald-600' : 'text-amber-600'}>
                {canUseSpeech ? '瀏覽器支援 SpeechSynthesis' : '未支援，播放將被停用'}
              </span>
            </div>
          </div>
        </div>

        {prefs.lastMode === 'learning' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ProgressLegend />
              <p className="text-sm text-slate-500">點羅馬音播放、點假名看例詞</p>
            </div>
            <KanaTable
              scriptMode={prefs.scriptMode as UIScriptMode}
              selectedCategories={prefs.selectedCategories}
              onRomajiClick={handleRomajiClick}
              onSelectItem={handleSelectItem}
              stats={stats}
            />
          </section>
        )}

        {prefs.lastMode === 'quiz' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-sm">
                <button
                  onClick={() => handlePrefChange({ quizType: 'multiple-choice' })}
                  className={`rounded-full px-3 py-1 font-medium ${
                    prefs.quizType === 'multiple-choice'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  選擇題
                </button>
                <button
                  onClick={() => handlePrefChange({ quizType: 'input' })}
                  className={`rounded-full px-3 py-1 font-medium ${
                    prefs.quizType === 'input'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  輸入題
                </button>
              </div>
              <p className="text-sm text-slate-500">題庫：{filteredItems.length} 個假名</p>
            </div>
            <Quiz
              items={filteredItems}
              stats={stats}
              quizType={prefs.quizType}
              scriptMode={prefs.scriptMode}
              speechRate={prefs.speechRate}
              onUpdateStats={updateStats}
            />
          </section>
        )}

        {prefs.lastMode === 'listening' && (
          <section className="space-y-4">
            <p className="text-sm text-slate-600">系統會先播音，請挑選正確假名。</p>
            <Listening
              items={filteredItems}
              stats={stats}
              scriptMode={prefs.scriptMode}
              speechRate={prefs.speechRate}
              onUpdateStats={updateStats}
            />
          </section>
        )}
      </div>

      <ExampleModal
        item={selectedItem}
        scriptMode={prefs.scriptMode as UIScriptMode}
        speechRate={prefs.speechRate}
        onClose={() => setSelectedItem(undefined)}
      />
    </div>
  )
}

export default App
