import { KanaTable } from '../components/KanaTable'
import { ProgressLegend } from '../components/ProgressLegend'
import type { KanaCategory, KanaItem, ScriptMode } from '../data/kanaData'
import { KANA_ITEMS } from '../data/kanaData'
import { pickScript } from '../utils/quiz'
import { isSpeechSupported, speakJapanese } from '../utils/speech'
import type { StatsByKanaId } from '../utils/storage'

interface Props {
  scriptMode: ScriptMode
  selectedCategories: KanaCategory[]
  stats: StatsByKanaId
  speechSupported: boolean
  speechRate: number
  onOpenExample: (item: KanaItem) => void
}

export function LearningPage({
  scriptMode,
  selectedCategories,
  stats,
  speechSupported,
  speechRate,
  onOpenExample,
}: Props) {
  const speakAllExamples = () => {
    if (!isSpeechSupported()) return
    const list = KANA_ITEMS.filter((item) => selectedCategories.includes(item.category))
    if (list.length === 0) return

    let index = 0
    const speakNext = () => {
      const current = list[index]
      if (!current) return
      speakJapanese(pickScript(current, scriptMode), {
        rate: speechRate,
        onEnd: () => {
          index += 1
          speakNext()
        },
        onError: () => {
          index += 1
          speakNext()
        },
      })
    }

    speakNext()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-secondary">學習模式</h2>
        <ProgressLegend />
        <button
          className="rounded bg-primary px-3 py-2 text-primary hover:bg-primary"
          onClick={speakAllExamples}
          disabled={!speechSupported}
        >
          {speechSupported ? '依序朗讀所選假名' : '瀏覽器不支援朗讀'}
        </button>
      </div>
      <KanaTable
        scriptMode={scriptMode}
        selectedCategories={selectedCategories}
        stats={stats}
        speechSupported={speechSupported}
        speechRate={speechRate}
        onOpenExample={onOpenExample}
      />
    </div>
  )
}
