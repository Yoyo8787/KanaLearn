import type { KanaStat } from './storage'

export function computeMastery(stat?: KanaStat): number {
  if (!stat) return 0
  const total = stat.correct + stat.wrong + 1
  return stat.correct / total
}

export function masteryColor(score: number): string {
  if (score > 0.85) return 'bg-emerald-500/70'
  if (score > 0.65) return 'bg-emerald-400/60'
  if (score > 0.45) return 'bg-amber-300/70'
  if (score > 0.25) return 'bg-orange-300/70'
  return 'bg-rose-300/70'
}
