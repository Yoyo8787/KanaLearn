import { useEffect, useMemo, useRef, useState } from 'react'
import { buildOptions, normalizeRomaji, pickWeightedItem, updateRecentQueue } from '../utils/quiz'
import { canUseSpeech, speakJapanese } from '../utils/speech'
import type { QuizType, UIScriptMode, StatsMap } from '../utils/storage'
import type { KanaItem } from '../data/kanaData'

interface Props {
  items: KanaItem[]
  stats: StatsMap
  quizType: QuizType
  scriptMode: UIScriptMode
  speechRate: number
  onUpdateStats: (id: string, result: 'correct' | 'wrong') => void
}

type MultipleChoiceQuestion = {
  prompt: string
  answer: KanaItem
  options: KanaItem[]
  promptType: 'romaji' | 'kana'
  optionType: 'romaji' | 'kana'
}

type InputQuestion = {
  prompt: KanaItem
}

export function Quiz({ items, stats, quizType, scriptMode, speechRate, onUpdateStats }: Props) {
  const [mcQuestion, setMcQuestion] = useState<MultipleChoiceQuestion | null>(null)
  const [inputQuestion, setInputQuestion] = useState<InputQuestion | null>(null)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [userInput, setUserInput] = useState('')
  const recentRef = useRef<string[]>([])

  const pool = useMemo(() => items, [items])

  useEffect(() => {
    if (quizType === 'multiple-choice') buildMultipleChoice()
    if (quizType === 'input') buildInputQuestion()
    setResult(null)
    setUserInput('')
  }, [quizType, pool])

  function nextQuestion() {
    if (quizType === 'multiple-choice') buildMultipleChoice()
    else buildInputQuestion()
    setResult(null)
    setUserInput('')
  }

  function buildMultipleChoice() {
    if (pool.length === 0) return
    const choice = pickWeightedItem(pool, stats, recentRef.current)
    recentRef.current = updateRecentQueue(recentRef.current, choice.id)
    const options = buildOptions(choice, pool)
    const promptType: MultipleChoiceQuestion['promptType'] = 'romaji'
    const optionType: MultipleChoiceQuestion['optionType'] = 'kana'
    setMcQuestion({
      prompt: promptType === 'romaji' ? choice.romaji : getGlyph(choice),
      answer: choice,
      options,
      promptType,
      optionType,
    })
  }

  function buildInputQuestion() {
    if (pool.length === 0) return
    const choice = pickWeightedItem(pool, stats, recentRef.current)
    recentRef.current = updateRecentQueue(recentRef.current, choice.id)
    setInputQuestion({ prompt: choice })
  }

  function getGlyph(item: KanaItem) {
    if (scriptMode === 'mixed') return Math.random() > 0.5 ? item.hiragana : item.katakana
    return scriptMode === 'katakana' ? item.katakana : item.hiragana
  }

  function handleChoice(option: KanaItem) {
    if (!mcQuestion) return
    const correct = option.id === mcQuestion.answer.id
    setResult(correct ? 'correct' : 'wrong')
    onUpdateStats(mcQuestion.answer.id, correct ? 'correct' : 'wrong')
    if (correct && canUseSpeech) speakJapanese(mcQuestion.answer.hiragana, { rate: speechRate })
  }

  function handleInputSubmit() {
    if (!inputQuestion) return
    const normalized = normalizeRomaji(userInput)
    const target = normalizeRomaji(inputQuestion.prompt.romaji)
    const correct = normalized === target
    setResult(correct ? 'correct' : 'wrong')
    onUpdateStats(inputQuestion.prompt.id, correct ? 'correct' : 'wrong')
    if (correct && canUseSpeech) speakJapanese(inputQuestion.prompt.hiragana, { rate: speechRate })
  }

  const renderOptions = () => {
    if (!mcQuestion) return null
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {mcQuestion.options.map((opt) => {
          const showKana = mcQuestion.optionType === 'kana'
          const text = showKana ? getGlyph(opt) : opt.romaji
          const isCorrect = result && opt.id === mcQuestion.answer.id
          return (
            <button
              key={opt.id}
              onClick={() => handleChoice(opt)}
              className={`rounded-xl border px-4 py-3 text-lg transition ${
                isCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {text}
            </button>
          )
        })}
      </div>
    )
  }

  const renderInput = () => {
    if (!inputQuestion) return null
    return (
      <div className="space-y-3">
        <div className="text-5xl font-bold text-slate-900">{getGlyph(inputQuestion.prompt)}</div>
        <input
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:outline-none"
          placeholder="輸入 romaji"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={handleInputSubmit}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow hover:bg-indigo-700"
        >
          送出
        </button>
      </div>
    )
  }

  const renderFeedback = () => {
    if (!result) return null
    const correctAnswer = quizType === 'multiple-choice' ? mcQuestion?.answer : inputQuestion?.prompt
    return (
      <div className={`rounded-xl border px-4 py-3 text-sm ${result === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-rose-400 bg-rose-50 text-rose-900'}`}>
        {result === 'correct' ? '答對了！' : '再試試看。'}
        {correctAnswer && (
          <span className="ml-2">正確答案：{correctAnswer.romaji} / {getGlyph(correctAnswer)}</span>
        )}
        <div className="mt-2 flex gap-2">
          <button
            className="rounded-md bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
            onClick={() => correctAnswer && canUseSpeech && speakJapanese(correctAnswer.hiragana, { rate: speechRate })}
            disabled={!canUseSpeech}
          >
            再聽一次
          </button>
          <button
            className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            onClick={nextQuestion}
          >
            下一題
          </button>
        </div>
      </div>
    )
  }

  if (pool.length === 0) {
    return <p className="text-sm text-slate-600">請至少選擇一個分類。</p>
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-500">題目</p>
          {quizType === 'multiple-choice' && mcQuestion && (
            <h3 className="text-3xl font-bold text-slate-900">
              {mcQuestion.promptType === 'romaji' ? mcQuestion.prompt : getGlyph(mcQuestion.answer)}
            </h3>
          )}
          {quizType === 'input' && inputQuestion && (
            <h3 className="text-3xl font-bold text-slate-900">{getGlyph(inputQuestion.prompt)}</h3>
          )}
        </div>
        <button
          onClick={nextQuestion}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          抽新題
        </button>
      </div>

      <div className="mt-4">
        {quizType === 'multiple-choice' ? renderOptions() : renderInput()}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        {!canUseSpeech && <span className="text-amber-600">瀏覽器不支援語音，無法播放。</span>}
        {canUseSpeech && (
          <button
            className="rounded-md bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
            onClick={() => {
              const target = quizType === 'multiple-choice' ? mcQuestion?.answer : inputQuestion?.prompt
              if (target) speakJapanese(target.hiragana, { rate: speechRate })
            }}
          >
            再聽一次
          </button>
        )}
      </div>

      <div className="mt-4">{renderFeedback()}</div>
    </div>
  )
}
