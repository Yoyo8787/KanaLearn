import type { KanaItem } from '../data/kanaData'
import { speakJapanese } from '../utils/speech'

interface Props {
  item?: KanaItem
  open: boolean
  onClose: () => void
  speechRate: number
  speechSupported: boolean
}

export function ExampleModal({ item, open, onClose, speechRate, speechSupported }: Props) {
  if (!open || !item) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm uppercase tracking-widest text-indigo-500">例詞</p>
            <h3 className="text-4xl font-bold text-slate-800">{item.hiragana}・{item.katakana}</h3>
            <p className="text-sm text-slate-500">{item.romaji}</p>
          </div>
          <button
            className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xl font-semibold text-slate-800">{item.example.word}</p>
          <p className="text-sm text-slate-600">讀音：{item.example.reading}</p>
          <p className="text-sm text-slate-500">意思：{item.example.meaning}</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            onClick={onClose}
          >
            關閉
          </button>
          <button
            disabled={!speechSupported}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              speechSupported ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400'
            }`}
            onClick={() => speakJapanese(item.example.word, { rate: speechRate })}
          >
            {speechSupported ? '播放例詞' : '瀏覽器不支援語音'}
          </button>
        </div>
      </div>
    </div>
  )
}
