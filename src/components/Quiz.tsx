import { useEffect, useMemo, useState } from 'react'
import { KANA_ITEMS } from '../data/kanaData'
import type { KanaCategory, KanaItem, ScriptMode } from '../data/kanaData'
import { normalizeRomaji, pickScript, pickWithWeights, updateRecentQueue } from '../utils/quiz'
import type { QuizType, StatsByKanaId } from '../utils/storage'
import { speakJapanese } from '../utils/speech'

interface Props {
  scriptMode: ScriptMode
  categories: KanaCategory[]
  quizType: QuizType
  stats: StatsByKanaId
  onRecordResult: (id: string, correct: boolean) => void
  speechSupported: boolean
  speechRate: number
  onChangeQuizType: (type: QuizType) => void
}

interface QuizQuestion {
  item: KanaItem
  prompt: string
  options: string[]
  answer: string
}

// 功能: 測驗元件，根據選擇的書寫系統、分類和測驗類型進行假名測驗
export function Quiz({
  scriptMode,
  categories,
  quizType,
  stats,
  onRecordResult,
  speechSupported,
  speechRate,
  onChangeQuizType,
}: Props) {
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [recentQueue, setRecentQueue] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')

  const pool = useMemo(
    () => KANA_ITEMS.filter((item) => categories.includes(item.category)),
    [categories],
  )

  useEffect(() => {
    pickQuestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizType, scriptMode, categories])

  const pickQuestion = () => {
    if (pool.length === 0) return
    const item = pickWithWeights(pool, stats, recentQueue)
    const script = pickScript(item, scriptMode)
    const isPromptKana = quizType === 'multiple-choice' ? Math.random() > 0.5 : true
    const prompt = isPromptKana ? script : item.romaji

    let options: string[] = []
    if (quizType === 'multiple-choice') {
      const others = pool.filter((p) => p.id !== item.id)
      const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 3)
      options = [...shuffled, item].map((opt) =>
        isPromptKana ? opt.romaji : pickScript(opt, scriptMode),
      )
      options = options.sort(() => 0.5 - Math.random())
    } else {
      options = []
    }

    const answer = isPromptKana ? item.romaji : pickScript(item, scriptMode)
    setQuestion({ item, prompt, options, answer })
    setFeedback('')
    setUserInput('')
    setRecentQueue((q) => updateRecentQueue(q, item.id))
  }

  const handleOption = (option: string) => {
    if (!question) return
    const correct = option === question.answer
    setFeedback(correct ? '答對了！' : `答錯了，正確答案是 ${question.answer}`)
    onRecordResult(question.item.id, correct)
    if (correct && speechSupported) {
      speakJapanese(pickScript(question.item, scriptMode), { rate: speechRate })
    }
    if (correct) {
      setTimeout(() => pickQuestion(), 600)
    }
  }

  const handleInput = () => {
    if (!question) return
    const normalized = normalizeRomaji(userInput)
    const target = normalizeRomaji(question.answer)
    const correct = normalized === target
    setFeedback(correct ? '答對了！' : `正確答案：${question.answer}`)
    onRecordResult(question.item.id, correct)
    if (correct && speechSupported)
      speakJapanese(pickScript(question.item, scriptMode), { rate: speechRate })
  }

  const optionsForQuizType: { value: QuizType; label: string }[] = [
    { value: 'multiple-choice', label: '四選一' },
    { value: 'input', label: '輸入題' },
  ]

  if (pool.length === 0) {
    return (
      <p className="rounded-lg bg-danger p-4 text-sm text-danger">請至少選擇一個類別開始測驗。</p>
    )
  }

  return (
    <div className="rounded-2xl border border-secondary bg-secondary p-6 shadow-lg dark:shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">目前題庫：{pool.length} 題</p>
          <h3 className="text-xl font-semibold text-secondary">測驗</h3>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {optionsForQuizType.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChangeQuizType(opt.value)}
              className={`rounded-full px-3 py-1 ${
                quizType === opt.value
                  ? 'bg-primary text-primary'
                  : 'bg-muted text-secondary hover:bg-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {question && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-xl border border-secondary bg-quiz-gradient p-6 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">題目</p>
            <div className="mt-2 text-4xl font-bold text-secondary">{question.prompt}</div>
          </div>

          {quizType === 'multiple-choice' ? (
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOption(opt)}
                  className="rounded-xl border border-secondary bg-secondary px-4 py-3 text-lg font-semibold text-secondary shadow-sm hover:border-primary hover:bg-primary"
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="輸入對應的羅馬拼音"
                className="w-full rounded-xl border border-secondary px-4 py-3 text-lg bg-secondary text-secondary"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleInput}
                  className="rounded-lg bg-primary px-4 py-2 text-primary shadow hover:bg-primary"
                >
                  確認答案
                </button>
                <button
                  onClick={() => setUserInput('')}
                  className="rounded-lg border border-secondary px-4 py-2 text-secondary hover:bg-muted"
                >
                  清除
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              disabled={!speechSupported}
              onClick={() =>
                question &&
                speakJapanese(pickScript(question.item, scriptMode), { rate: speechRate })
              }
              className={`rounded-lg px-4 py-2 font-semibold ${
                speechSupported ? 'bg-success hover:bg-success' : 'bg-muted text-muted'
              }`}
            >
              {speechSupported ? '再聽一次' : '瀏覽器不支援語音'}
            </button>
            <button
              onClick={pickQuestion}
              className="rounded-lg border border-secondary px-4 py-2 text-secondary hover:bg-muted"
            >
              下一題
            </button>
            {feedback && <span className="text-sm font-semibold text-primary">{feedback}</span>}
          </div>
        </div>
      )}
    </div>
  )
}
