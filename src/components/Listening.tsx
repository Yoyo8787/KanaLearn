import { useEffect, useMemo, useState } from 'react'
import type { KanaItem } from '../data/kanaData'
import { enqueueRecent, pickWeightedKana } from '../utils/quiz'
import { speakJapanese, supportsSpeech } from '../utils/speech'

interface Props {
  pool: KanaItem[]
  scriptMode: 'hiragana' | 'katakana' | 'mixed'
  stats: Record<string, { correct: number; wrong: number; lastSeenAt: number }>
  onUpdateStats: (id: string, correct: boolean) => void
  speechRate: number
}

interface ListeningState {
  prompt?: KanaItem
  options: KanaItem[]
  feedback?: { correct: boolean; message: string; answer: KanaItem }
  recent: string[]
  revealed: boolean
}

const formatOption = (item: KanaItem, script: 'hiragana' | 'katakana' | 'mixed') => {
  if (script === 'mixed') return `${item.hiragana} / ${item.katakana}`
  return script === 'hiragana' ? item.hiragana : item.katakana
}

export const Listening = ({ pool, scriptMode, stats, onUpdateStats, speechRate }: Props) => {
  const [state, setState] = useState<ListeningState>({ options: [], recent: [], revealed: false })
  const speechReady = supportsSpeech()

  const availablePool = useMemo(() => pool, [pool])

  const roll = (recent: string[] = state.recent) => {
    if (!availablePool.length) return
    const prompt = pickWeightedKana({ items: availablePool, stats, recentIds: recent }) || availablePool[0]
    const options = [prompt, ...availablePool.filter((item) => item.id !== prompt.id).slice(0, 3)]
    options.sort(() => Math.random() - 0.5)
    setState({ prompt, options, feedback: undefined, recent, revealed: false })
    if (speechReady) speakJapanese(prompt.romaji, { rate: speechRate })
  }

  useEffect(() => {
    roll([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availablePool])

  const answer = (choice: KanaItem) => {
    if (!state.prompt) return
    const correct = choice.id === state.prompt.id
    onUpdateStats(state.prompt.id, correct)
    const recent = enqueueRecent(state.recent, state.prompt.id)
    setState({
      ...state,
      feedback: {
        correct,
        message: correct ? '正確！' : '答錯了',
        answer: state.prompt,
      },
      recent,
      revealed: !correct,
    })
    if (correct && speechReady) speakJapanese(state.prompt.romaji, { rate: speechRate })
  }

  const replay = () => {
    if (speechReady && state.prompt) speakJapanese(state.prompt.romaji, { rate: speechRate })
  }

  const showHint = () => setState((prev) => ({ ...prev, revealed: true }))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg font-semibold text-slate-800">聽力練習</div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <button
            onClick={replay}
            disabled={!speechReady}
            className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-sky-200 disabled:text-slate-400"
          >
            重播
          </button>
          <button onClick={showHint} className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-sky-200">
            顯示提示
          </button>
          {!speechReady && <span className="text-amber-600">瀏覽器不支援語音播放</span>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {state.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => answer(opt)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200"
          >
            {formatOption(opt, scriptMode)}
          </button>
        ))}
      </div>

      {state.revealed && state.prompt && (
        <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          提示：{formatOption(state.prompt, scriptMode)} （{state.prompt.romaji}）
        </div>
      )}

      {state.feedback && state.feedback.answer && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm font-semibold ${
            state.feedback.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}
        >
          {state.feedback.message}，正解：{formatOption(state.feedback.answer, scriptMode)} / {state.feedback.answer.romaji}
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => roll(state.recent)}
              className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-sky-200"
            >
              下一題
            </button>
            <button
              onClick={() => speechReady && speakJapanese(state.feedback!.answer.romaji, { rate: speechRate })}
              disabled={!speechReady}
              className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-sky-200 disabled:text-slate-400"
            >
              再聽一次
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
