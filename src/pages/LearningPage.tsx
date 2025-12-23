import { KanaTable } from '../components/KanaTable'
import { ProgressLegend } from '../components/ProgressLegend'
import type { KanaCategory, KanaItem, ScriptMode } from '../data/kanaData'
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
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-secondary">學習模式</h2>
        <ProgressLegend />
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
