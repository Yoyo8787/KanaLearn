import { useEffect, useMemo, useState } from 'react'
import { KANA_ITEMS } from '../data/kanaData'
import type { KanaCategory, KanaItem, ScriptMode } from '../data/kanaData'
import { pickScript, pickWithWeights, updateRecentQueue } from '../utils/quiz'
import type { StatsByKanaId } from '../utils/storage'
import { speakJapanese } from '../utils/speech'

interface Props {
  scriptMode: ScriptMode
  categories: KanaCategory[]
  stats: StatsByKanaId
  onRecordResult: (id: string, correct: boolean) => void
  speechSupported: boolean
  speechRate: number
}

export function Listening({ scriptMode, categories, stats, onRecordResult, speechSupported, speechRate }: Props) {
  const [question, setQuestion] = useState<KanaItem | null>(null)
  const [options, setOptions] = useState<KanaItem[]>([])
  const [recentQueue, setRecentQueue] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')

  const pool = useMemo(() => KANA_ITEMS.filter((item) => categories.includes(item.category)), [categories])

  const pickQuestion = () => {
    if (pool.length === 0) return
    const item = pickWithWeights(pool, stats, recentQueue)
    const others = pool.filter((p) => p.id !== item.id).sort(() => 0.5 - Math.random()).slice(0, 3)
    const nextOptions = [...others, item].sort(() => 0.5 - Math.random())

    setQuestion(item)
    setOptions(nextOptions)
    setFeedback('')
    setRecentQueue((q) => updateRecentQueue(q, item.id))

    if (speechSupported) speakJapanese(pickScript(item, scriptMode), { rate: speechRate })
  }

  useEffect(() => {
    pickQuestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptMode, categories])

  const handleSelect = (opt: KanaItem) => {
    if (!question) return
    const correct = opt.id === question.id
    setFeedback(correct ? '答對了！' : `正確答案是 ${pickScript(question, scriptMode)}`)
    onRecordResult(question.id, correct)
    if (speechSupported) speakJapanese(pickScript(question, scriptMode), { rate: speechRate })
    if (correct) {
      setTimeout(() => pickQuestion(), 700)
    }
  }

  if (pool.length === 0) {
    return <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-600">請至少選擇一個類別開始聽力練習。</p>
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">會依類別篩選題庫</p>
          <h3 className="text-2xl font-semibold text-slate-800">聽力</h3>
        </div>
        <button
          disabled={!speechSupported}
          onClick={() => question && speakJapanese(pickScript(question, scriptMode), { rate: speechRate })}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            speechSupported ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {speechSupported ? '重播' : '瀏覽器不支援語音'}
        </button>
      </div>

      {question && (
        <div className="mt-6 space-y-4">
          <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            聆聽後選出正確的假名（按重播再聽一次）
          </p>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-slate-800 shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
              >
                {pickScript(opt, scriptMode)}
              </button>
            ))}
          </div>
          {feedback && <div className="text-sm font-semibold text-indigo-600">{feedback}</div>}
          <button
            onClick={pickQuestion}
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            下一題
          </button>
        </div>
      )}
    </div>
  )
}
