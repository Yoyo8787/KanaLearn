import type { KanaItem } from '../data/kanaData'
import { speakJapanese } from '../utils/speech'

interface Props {
  item?: KanaItem
  open: boolean
  onClose: () => void
  speechRate: number
  speechSupported: boolean
}

// 功能: 顯示例詞的模態視窗，包含假名、讀音、意思等資訊
export function ExampleModal({ item, open, onClose, speechRate, speechSupported }: Props) {
  if (!open || !item) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-secondary bg-secondary p-6 shadow-xl text-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary mb-2">例詞</p>
            <h3 className="text-4xl font-bold text-secondary">
              {item.hiragana}・{item.katakana}
            </h3>
            <p className="text-sm text-muted ml-2">{item.romaji}</p>
          </div>
          <button
            className="rounded-full bg-muted px-3 py-2 text-sm bg-secondary hover:bg-secondary"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-secondary bg-muted p-4 ">
          <p className="text-2xl font-semibold text-secondary mb-1">{item.example.word}</p>
          <p className="text-sm text-secondary">讀音：{item.example.reading}</p>
          <p className="text-sm text-muted">意思：{item.example.meaning}</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            disabled={!speechSupported}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              speechSupported
                ? 'bg-primary text-primary hover:bg-primary'
                : 'bg-muted text-secondary'
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
