import { KANA_ITEMS } from '../data/kanaData'
import type { KanaCategory, KanaItem, ScriptMode } from '../data/kanaData'
import type { StatsByKanaId } from './storage'

const RECENT_LIMIT = 5

export interface QuizPoolOptions {
  categories: KanaCategory[]
  scriptMode: ScriptMode
}

export function getQuizPool(options: QuizPoolOptions): KanaItem[] {
  const { categories } = options
  return KANA_ITEMS.filter((item) => categories.includes(item.category))
}

export function pickWithWeights(pool: KanaItem[], stats: StatsByKanaId, recentQueue: string[]): KanaItem {
  const filtered = pool.filter((item) => !recentQueue.includes(item.id))
  const candidates = filtered.length > 0 ? filtered : pool

  const weights = candidates.map((item) => {
    const stat = stats[item.id]
    if (!stat) return 1.2
    return 1 + stat.wrong * 2 - stat.correct * 0.2
  })

  const total = weights.reduce((sum, w) => sum + Math.max(w, 0.2), 0)
  let r = Math.random() * total
  for (let i = 0; i < candidates.length; i++) {
    r -= Math.max(weights[i], 0.2)
    if (r <= 0) return candidates[i]
  }

  return candidates[0]
}

export function updateRecentQueue(queue: string[], id: string): string[] {
  const next = [id, ...queue.filter((q) => q !== id)]
  return next.slice(0, RECENT_LIMIT)
}

export function normalizeRomaji(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, '')
}

export function pickScript(item: KanaItem, mode: ScriptMode): string {
  if (mode === 'hiragana') return item.hiragana
  if (mode === 'katakana') return item.katakana
  return Math.random() > 0.5 ? item.hiragana : item.katakana
}
