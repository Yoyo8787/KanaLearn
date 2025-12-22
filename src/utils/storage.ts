import type { KanaCategory } from '../data/kanaData'

export type UIScriptMode = 'hiragana' | 'katakana' | 'mixed'
export type QuizType = 'multiple-choice' | 'input'

export interface KanaStatsEntry {
  correct: number
  wrong: number
  lastSeenAt: number
}

export interface StatsMap {
  [id: string]: KanaStatsEntry
}

export interface UIPreferences {
  lastMode: 'learning' | 'quiz' | 'listening'
  scriptMode: UIScriptMode
  selectedCategories: KanaCategory[]
  quizType: QuizType
  speechRate: number
}

const UI_PREFS_KEY = 'kana-ui-prefs'
const STATS_KEY = 'kana-stats'

const defaultPrefs: UIPreferences = {
  lastMode: 'learning',
  scriptMode: 'hiragana',
  selectedCategories: ['basic'],
  quizType: 'multiple-choice',
  speechRate: 1,
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch (err) {
    console.warn('Failed to parse storage value', err)
    return fallback
  }
}

export function loadUIPreferences(): UIPreferences {
  if (typeof window === 'undefined') return defaultPrefs
  return safeParse(localStorage.getItem(UI_PREFS_KEY), defaultPrefs)
}

export function saveUIPreferences(prefs: UIPreferences) {
  if (typeof window === 'undefined') return
  localStorage.setItem(UI_PREFS_KEY, JSON.stringify(prefs))
}

export function loadStats(): StatsMap {
  if (typeof window === 'undefined') return {}
  return safeParse(localStorage.getItem(STATS_KEY), {})
}

export function saveStats(stats: StatsMap) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function resetProgress() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STATS_KEY)
}
