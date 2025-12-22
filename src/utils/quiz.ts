import type { KanaItem } from '../data/kanaData'
import type { StatsByKanaId } from './storage'

interface DrawOptions {
  items: KanaItem[]
  stats: StatsByKanaId
  recentIds: string[]
}

export const pickWeightedKana = ({ items, stats, recentIds }: DrawOptions): KanaItem | null => {
  const pool = items.filter((item) => !recentIds.includes(item.id))
  const weighted = pool.map((item) => {
    const entry = stats[item.id]
    const weight = entry ? (entry.wrong + 1) / (entry.correct + 1) : 1.1
    return { item, weight }
  })

  const total = weighted.reduce((sum, w) => sum + w.weight, 0)
  if (total === 0) return null
  let roll = Math.random() * total
  for (const entry of weighted) {
    roll -= entry.weight
    if (roll <= 0) return entry.item
  }
  return weighted[weighted.length - 1]?.item ?? null
}

export const enqueueRecent = (queue: string[], id: string, max = 6): string[] => {
  const updated = [...queue, id]
  if (updated.length > max) {
    updated.shift()
  }
  return updated
}
