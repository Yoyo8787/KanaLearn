import type { KanaStatsEntry } from './storage'

export function masteryScore(entry?: KanaStatsEntry): number {
  if (!entry) return 0
  const total = entry.correct + entry.wrong
  return entry.correct / (total + 1)
}

export function masteryColor(entry?: KanaStatsEntry): string {
  const score = masteryScore(entry)
  if (score > 0.8) return 'bg-emerald-100 text-emerald-900'
  if (score > 0.6) return 'bg-emerald-200 text-emerald-900'
  if (score > 0.4) return 'bg-amber-100 text-amber-900'
  if (score > 0.2) return 'bg-orange-100 text-orange-900'
  return 'bg-rose-100 text-rose-900'
}

export function accuracyBadge(entry?: KanaStatsEntry): string {
  if (!entry) return '0%'
  const total = entry.correct + entry.wrong
  if (total === 0) return '0%'
  return `${Math.round((entry.correct / total) * 100)}%`
}
