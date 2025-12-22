import { useEffect, useMemo, useRef, useState } from 'react'
import { buildOptions, pickWeightedItem, updateRecentQueue } from '../utils/quiz'
import { canUseSpeech, speakJapanese } from '../utils/speech'
import type { StatsMap, UIScriptMode } from '../utils/storage'
import type { KanaItem } from '../data/kanaData'

interface Props {
  items: KanaItem[]
  stats: StatsMap
  scriptMode: UIScriptMode
  speechRate: number
  onUpdateStats: (id: string, result: 'correct' | 'wrong') => void
}

export function Listening({ items, stats, scriptMode, speechRate, onUpdateStats }: Props) {
  const [question, setQuestion] = useState<{ target: KanaItem; options: KanaItem[] } | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const recentRef = useRef<string[]>([])

  const pool = useMemo(() => items, [items])

  useEffect(() => {
    buildQuestion()
  }, [pool])

  function buildQuestion() {
    if (pool.length === 0) return
    const target = pickWeightedItem(pool, stats, recentRef.current)
    recentRef.current = updateRecentQueue(recentRef.current, target.id)
    const options = buildOptions(target, pool)
    setQuestion({ target, options })
    setFeedback(null)
    if (canUseSpeech) speakJapanese(target.hiragana, { rate: speechRate })
  }

  function getGlyph(item: KanaItem) {
    if (scriptMode === 'mixed') return Math.random() > 0.5 ? item.hiragana : item.katakana
    return scriptMode === 'katakana' ? item.katakana : item.hiragana
  }

  function handleSelect(option: KanaItem) {
    if (!question) return
    const correct = option.id === question.target.id
    setFeedback(correct ? 'correct' : 'wrong')
    onUpdateStats(question.target.id, correct ? 'correct' : 'wrong')
    if (canUseSpeech) speakJapanese(question.target.hiragana, { rate: speechRate })
  }

  if (pool.length === 0) return <p className="text-sm text-slate-600">請選擇至少一個分類。</p>

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-500">聽力練習</p>
          <h3 className="text-2xl font-semibold text-slate-900">請聽音後選出對應的假名</h3>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            onClick={() => question && speakJapanese(question.target.hiragana, { rate: speechRate })}
            disabled={!canUseSpeech || !question}
          >
            重播
          </button>
          <button
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100"
            onClick={buildQuestion}
          >
            下一題
          </button>
        </div>
      </div>

      {!canUseSpeech && (
        <p className="mt-3 text-sm text-amber-600">瀏覽器不支援語音合成，聽力題僅顯示按鈕。</p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {question?.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt)}
            className={`rounded-xl border px-4 py-4 text-2xl font-bold transition ${
              feedback && opt.id === question.target.id
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-900 hover:border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            {getGlyph(opt)}
          </button>
        ))}
      </div>

      {feedback && question && (
        <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${feedback === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-rose-400 bg-rose-50 text-rose-900'}`}>
          {feedback === 'correct' ? '答對了！' : '再接再厲。'} 正確答案：{question.target.romaji} ({getGlyph(question.target)})
        </div>
      )}
    </div>
  )
}
