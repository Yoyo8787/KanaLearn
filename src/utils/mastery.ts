import type { StatsByKanaId } from './storage'

export const masteryScore = (stats: StatsByKanaId, id: string): number => {
  const entry = stats[id]
  if (!entry) return 0
  const total = entry.correct + entry.wrong + 1
  return entry.correct / total
}

export const masteryColor = (score: number): string => {
  const start = [248, 250, 252] // slate-50
  const end = [14, 165, 233] // sky-500
  const mix = start.map((value, idx) => Math.round(value + (end[idx] - value) * score))
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`
}

export const masteryBadge = (stats: StatsByKanaId, id: string): string => {
  const entry = stats[id]
  if (!entry) return '0/0'
  return `${entry.correct}/${entry.correct + entry.wrong}`
}
