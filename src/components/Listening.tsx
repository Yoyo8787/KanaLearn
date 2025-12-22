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

// 功能: 聽力練習元件，根據選擇的書寫系統和分類進行聽力測驗
export function Listening({
  scriptMode,
  categories,
  stats,
  onRecordResult,
  speechSupported,
  speechRate,
}: Props) {
  const [question, setQuestion] = useState<KanaItem | null>(null)
  const [options, setOptions] = useState<KanaItem[]>([])
  const [recentQueue, setRecentQueue] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')

  const pool = useMemo(
    () => KANA_ITEMS.filter((item) => categories.includes(item.category)),
    [categories],
  )

  const pickQuestion = () => {
    if (pool.length === 0) return
    const item = pickWithWeights(pool, stats, recentQueue)
    const others = pool
      .filter((p) => p.id !== item.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
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
    return (
      <p className="rounded-lg bg-danger p-4 text-sm text-danger">
        請至少選擇一個類別開始聽力練習。
      </p>
    )
  }

  return (
    <div className="rounded-2xl border border-secondary bg-secondary p-6 shadow-lg dark:shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-secondary">聽力</h3>
        </div>
      </div>

      {question && (
        <div className="mt-6 space-y-4">
          <p className="rounded-xl bg-primary px-4 py-3 text-sm text-primary">
            聆聽後選出正確的假名
          </p>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="rounded-xl border border-secondary bg-secondary px-4 py-3 text-lg font-semibold text-secondary shadow-sm hover:border-primary hover:bg-primary"
              >
                {pickScript(opt, scriptMode)}
              </button>
            ))}
          </div>
          {feedback && <div className="text-sm font-semibold text-primary">{feedback}</div>}
          <div className="flex gap-2">
            <button
              disabled={!speechSupported}
              onClick={() =>
                question && speakJapanese(pickScript(question, scriptMode), { rate: speechRate })
              }
              className={`rounded-lg border border-secondary px-4 py-2 ${
                speechSupported
                  ? 'bg-primary hover:bg-primary text-primary'
                  : 'bg-muted text-secondary'
              }`}
            >
              {speechSupported ? '重播' : '瀏覽器不支援語音'}
            </button>
            <button
              onClick={pickQuestion}
              className="rounded-lg border border-secondary px-4 py-2 bg-secondary hover:bg-secondary"
            >
              下一題
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
