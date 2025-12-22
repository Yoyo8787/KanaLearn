import type { KanaItem } from '../data/kanaData'
import { canUseSpeech, speakJapanese } from '../utils/speech'

interface Props {
  item?: KanaItem
  scriptMode: 'hiragana' | 'katakana' | 'mixed'
  speechRate: number
  onClose: () => void
}

export function ExampleModal({ item, scriptMode, speechRate, onClose }: Props) {
  if (!item) return null
  const glyph = scriptMode === 'katakana' ? item.katakana : item.hiragana
  const wordText = item.example.word
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-indigo-500">例詞</p>
            <h3 className="text-3xl font-bold text-slate-900">{glyph}</h3>
            <p className="text-slate-500">{item.romaji}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
          >
            Esc
          </button>
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <div className="text-lg font-semibold text-slate-900">{wordText}</div>
          <div className="text-slate-600">{item.example.reading}</div>
          <div className="text-slate-500">{item.example.meaning}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canUseSpeech}
            onClick={() => speakJapanese(wordText, { rate: speechRate })}
          >
            播放例詞
          </button>
          <button
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
            onClick={onClose}
          >
            關閉
          </button>
        </div>
        {!canUseSpeech && (
          <p className="mt-3 text-sm text-amber-600">瀏覽器未支援語音合成，請更換環境。</p>
        )}
      </div>
    </div>
  )
}
