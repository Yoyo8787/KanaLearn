import type { KanaCategory, ScriptMode } from '../data/kanaData'

export type Mode = 'learning' | 'quiz' | 'listening'
export type QuizType = 'multiple-choice' | 'input'

export interface UIPreferences {
  lastMode: Mode
  scriptMode: ScriptMode
  selectedCategories: KanaCategory[]
  quizType: QuizType
  speechRate: number
}

export interface KanaStat {
  correct: number
  wrong: number
  lastSeenAt: number
}

export type StatsByKanaId = Record<string, KanaStat>

const UI_KEY = 'kana-ui-prefs'
const STATS_KEY = 'kana-stats'

export const defaultUIPreferences: UIPreferences = {
  lastMode: 'learning',
  scriptMode: 'hiragana',
  selectedCategories: ['basic'],
  quizType: 'multiple-choice',
  speechRate: 1,
}

export function loadUIPreferences(): UIPreferences {
  try {
    const raw = localStorage.getItem(UI_KEY)
    if (!raw) return defaultUIPreferences
    const parsed = JSON.parse(raw) as Partial<UIPreferences>
    return {
      ...defaultUIPreferences,
      ...parsed,
      selectedCategories: parsed.selectedCategories ?? ['basic'],
    }
  } catch (err) {
    console.warn('Failed to load UI prefs', err)
    return defaultUIPreferences
  }
}

export function saveUIPreferences(prefs: UIPreferences) {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify(prefs))
  } catch (err) {
    console.warn('Failed to save UI prefs', err)
  }
}

export function loadStats(): StatsByKanaId {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as StatsByKanaId
  } catch (err) {
    console.warn('Failed to load stats', err)
    return {}
  }
}

export function saveStats(stats: StatsByKanaId) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (err) {
    console.warn('Failed to save stats', err)
  }
}

export function resetStats() {
  try {
    localStorage.removeItem(STATS_KEY)
  } catch (err) {
    console.warn('Failed to reset stats', err)
  }
}
