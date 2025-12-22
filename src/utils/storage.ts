import type { KanaCategory } from '../data/kanaData'

type QuizType = 'multiple' | 'input'

type ScriptMode = 'hiragana' | 'katakana' | 'mixed'

type Mode = 'learning' | 'quiz' | 'listening'

export interface StatsByKanaId {
  [id: string]: {
    correct: number
    wrong: number
    lastSeenAt: number
  }
}

export interface UiPrefs {
  lastMode: Mode
  scriptMode: ScriptMode
  selectedCategories: KanaCategory[]
  quizType: QuizType
  speechRate: number
}

const UI_PREFS_KEY = 'kana-ui-prefs'
const STATS_KEY = 'kana-stats'

export const loadStats = (): StatsByKanaId => {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to load stats', error)
    return {}
  }
}

export const saveStats = (stats: StatsByKanaId) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Failed to save stats', error)
  }
}

export const resetStats = () => {
  localStorage.removeItem(STATS_KEY)
}

export const loadPrefs = (): UiPrefs => {
  try {
    const raw = localStorage.getItem(UI_PREFS_KEY)
    if (!raw) {
      return {
        lastMode: 'learning',
        scriptMode: 'hiragana',
        selectedCategories: ['basic'],
        quizType: 'multiple',
        speechRate: 1,
      }
    }
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to load UI prefs', error)
    return {
      lastMode: 'learning',
      scriptMode: 'hiragana',
      selectedCategories: ['basic'],
      quizType: 'multiple',
      speechRate: 1,
    }
  }
}

export const savePrefs = (prefs: UiPrefs) => {
  try {
    localStorage.setItem(UI_PREFS_KEY, JSON.stringify(prefs))
  } catch (error) {
    console.error('Failed to save UI prefs', error)
  }
}

export type { QuizType, ScriptMode, Mode }
