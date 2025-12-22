export const supportsSpeech = (): boolean => typeof window !== 'undefined' && 'speechSynthesis' in window

interface SpeakOptions {
  rate?: number
  pitch?: number
}

export const speakJapanese = (text: string, options: SpeakOptions = {}) => {
  if (!supportsSpeech() || !text) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = options.rate ?? 1
  utterance.pitch = options.pitch ?? 1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
