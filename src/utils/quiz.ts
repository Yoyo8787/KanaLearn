import type { KanaItem } from '../data/kanaData'
import type { StatsMap } from './storage'

const RECENT_LIMIT = 5

export function normalizeRomaji(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '')
}

export function pickWeightedItem(items: KanaItem[], stats: StatsMap, recent: string[]): KanaItem {
  const filtered = items.filter((item) => !recent.includes(item.id))
  const pool = filtered.length > 0 ? filtered : items
  const weighted = pool.map((item) => {
    const stat = stats[item.id]
    const wrong = stat?.wrong ?? 0
    const correct = stat?.correct ?? 0
    const weight = wrong + 1 - Math.min(correct * 0.1, 0.5)
    return { item, weight: Math.max(weight, 0.5) }
  })
  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0)
  let roll = Math.random() * totalWeight
  for (const entry of weighted) {
    roll -= entry.weight
    if (roll <= 0) return entry.item
  }
  return weighted[weighted.length - 1].item
}

export function buildOptions(correct: KanaItem, pool: KanaItem[]): KanaItem[] {
  const others = pool.filter((item) => item.id !== correct.id)
  const shuffled = others.sort(() => Math.random() - 0.5)
  const picks = shuffled.slice(0, 3)
  const options = [...picks, correct]
  return options.sort(() => Math.random() - 0.5)
}

export function updateRecentQueue(queue: string[], id: string): string[] {
  const next = [id, ...queue]
  if (next.length > RECENT_LIMIT) next.pop()
  return next
}
