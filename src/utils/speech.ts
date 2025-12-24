export interface SpeakOptions {
  rate?: number
  pitch?: number
  onEnd?: () => void
  onError?: () => void
}

export const isSpeechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function speakJapanese(text: string, options: SpeakOptions = {}) {
  if (!isSpeechSupported()) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = options.rate ?? 1
  utterance.pitch = options.pitch ?? 1
  if (options.onEnd) utterance.onend = options.onEnd
  if (options.onError) utterance.onerror = options.onError
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
