import { useEffect } from 'react'
import type { KanaItem } from '../data/kanaData'
import { speakJapanese, supportsSpeech } from '../utils/speech'

interface Props {
  open: boolean
  item?: KanaItem
  script: 'hiragana' | 'katakana'
  onClose: () => void
  speechRate: number
}

export const ExampleModal = ({ open, item, script, onClose, speechRate }: Props) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    if (open) {
      window.addEventListener('keydown', handler)
    }
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open || !item) return null

  const glyph = script === 'hiragana' ? item.hiragana : item.katakana

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold text-slate-800">{glyph}</div>
          <button
            onClick={() => supportsSpeech() && speakJapanese(item.romaji, { rate: speechRate })}
            disabled={!supportsSpeech()}
            className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
          >
            播放音檔
          </button>
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <div className="text-2xl font-semibold text-slate-700">{item.example.word}</div>
          <div className="mt-1 text-sm text-slate-500">{item.example.reading}</div>
          <div className="mt-1 text-sm text-slate-600">{item.example.meaning}</div>
        </div>
        {!supportsSpeech() && (
          <div className="mt-3 text-xs text-amber-600">瀏覽器未支援語音合成。</div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  )
}
