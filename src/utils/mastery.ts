import type { KanaStat } from './storage'

export function computeMastery(stat?: KanaStat): number {
  if (!stat) return 0
  const total = stat.correct + stat.wrong + 1
  return stat.correct / total
}

export function masteryColor(score: number): string {
  if (score > 0.85) return 'bg-success'
  if (score > 0.65) return 'bg-primary'
  if (score > 0.45) return 'bg-muted'
  if (score > 0.25) return 'bg-muted'
  return 'bg-danger'
}
