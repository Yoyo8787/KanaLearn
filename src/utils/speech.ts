export interface SpeechOptions {
  rate?: number
  pitch?: number
}

export const canUseSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window

export function speakJapanese(text: string, options: SpeechOptions = {}) {
  if (!canUseSpeech) return
  const { rate = 1, pitch = 1 } = options
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = rate
  utterance.pitch = pitch
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
