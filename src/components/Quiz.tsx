import { useEffect, useMemo, useState } from 'react'
import type { KanaItem } from '../data/kanaData'
import { masteryScore } from '../utils/mastery'
import { enqueueRecent, pickWeightedKana } from '../utils/quiz'
import { speakJapanese, supportsSpeech } from '../utils/speech'
import type { QuizType } from '../utils/storage'

interface Props {
  pool: KanaItem[]
  scriptMode: 'hiragana' | 'katakana' | 'mixed'
  quizType: QuizType
  onQuizTypeChange: (type: QuizType) => void
  stats: Record<string, { correct: number; wrong: number; lastSeenAt: number }>
  onUpdateStats: (id: string, correct: boolean) => void
  speechRate: number
}

interface QuizState {
  prompt?: KanaItem
  options: KanaItem[]
  recent: string[]
  feedback?: { correct: boolean; message: string }
}

const formatGlyph = (item: KanaItem, script: 'hiragana' | 'katakana' | 'mixed') => {
  if (script === 'mixed') return `${item.hiragana} / ${item.katakana}`
  return script === 'hiragana' ? item.hiragana : item.katakana
}

export const Quiz = ({
  pool,
  scriptMode,
  quizType,
  onQuizTypeChange,
  stats,
  onUpdateStats,
  speechRate,
}: Props) => {
  const [state, setState] = useState<QuizState>({ options: [], recent: [] })
  const [inputValue, setInputValue] = useState('')
  const speechReady = supportsSpeech()

  const availablePool = useMemo(() => pool, [pool])

  const rollQuestion = (recent: string[] = state.recent) => {
    if (!availablePool.length) return
    const prompt = pickWeightedKana({ items: availablePool, stats, recentIds: recent }) || availablePool[0]
    const otherOptions = [...availablePool].filter((item) => item.id !== prompt.id)
    otherOptions.sort((a, b) => masteryScore(stats, a.id) - masteryScore(stats, b.id))
    const choices = [prompt, ...otherOptions.slice(0, 3)]
    choices.sort(() => Math.random() - 0.5)
    setState({ prompt, options: choices, recent, feedback: undefined })
    setInputValue('')
    if (speechReady) speakJapanese(prompt.romaji, { rate: speechRate })
  }

  useEffect(() => {
    rollQuestion([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availablePool, quizType, scriptMode])

  const handleAnswer = (answer: KanaItem | string) => {
    if (!state.prompt) return
    const currentPrompt = state.prompt
    const normalized = typeof answer === 'string' ? answer.trim().toLowerCase() : ''
    const isCorrect = typeof answer === 'string' ? normalized === currentPrompt.romaji : answer.id === currentPrompt.id
    onUpdateStats(currentPrompt.id, isCorrect)
    const recent = enqueueRecent(state.recent, currentPrompt.id)
    setState((prev) => ({
      ...prev,
      feedback: {
        correct: isCorrect,
        message: isCorrect ? '答對了！' : `正確答案：${currentPrompt.romaji}`,
      },
      recent,
    }))
    if (isCorrect && speechReady) {
      speakJapanese(currentPrompt.romaji, { rate: speechRate })
      setTimeout(() => rollQuestion(recent), 400)
    }
  }

  const handleNext = () => rollQuestion(state.recent)

  const renderPrompt = () => {
    if (!state.prompt) return null
    if (quizType === 'input') {
      return (
        <div className="text-5xl font-bold text-slate-800">{formatGlyph(state.prompt, scriptMode)}</div>
      )
    }
    return (
      <div className="text-4xl font-bold text-slate-900">{
        scriptMode === 'hiragana' ? state.prompt.hiragana : scriptMode === 'katakana' ? state.prompt.katakana : state.prompt.romaji
      }</div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg font-semibold text-slate-800">測驗</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">題型</span>
          <select
            value={quizType}
            onChange={(e) => onQuizTypeChange(e.target.value as QuizType)}
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700"
          >
            <option value="multiple">選擇題</option>
            <option value="input">輸入題</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="rounded-lg bg-slate-50 p-6 text-center">{renderPrompt()}</div>

        {quizType === 'multiple' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {state.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200"
              >
                {scriptMode === 'hiragana'
                  ? opt.hiragana
                  : scriptMode === 'katakana'
                    ? opt.katakana
                    : `${opt.hiragana} / ${opt.katakana}`}
                <div className="text-xs text-slate-500">{opt.romaji}</div>
              </button>
            ))}
          </div>
        )}

        {quizType === 'input' && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="輸入羅馬音"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-lg shadow-inner"
            />
            <button
              onClick={() => handleAnswer(inputValue)}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-sky-700"
            >
              送出
            </button>
          </div>
        )}

        {state.prompt && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <button
              onClick={() => speechReady && speakJapanese(state.prompt!.romaji, { rate: speechRate })}
              disabled={!speechReady}
              className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:border-sky-200 disabled:text-slate-400"
            >
              再聽一次
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:border-sky-200"
            >
              下一題
            </button>
            {!speechReady && <span className="text-amber-600">瀏覽器不支援語音播放</span>}
          </div>
        )}

        {state.feedback && (
          <div
            className={`mt-2 rounded-lg px-4 py-3 text-sm font-semibold ${
              state.feedback.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {state.feedback.message}
          </div>
        )}
      </div>
    </div>
  )
}
