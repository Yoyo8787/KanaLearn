import { CategoryFilter } from '../components/CategoryFilter'
import type { UIPreferences } from '../utils/storage'

interface Props {
  prefs: UIPreferences
  speechSupported: boolean
  onUpdatePrefs: (partial: Partial<UIPreferences>) => void
  onResetStats: () => void
}

export function SettingsPage({ prefs, speechSupported, onUpdatePrefs, onResetStats }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-secondary bg-secondary p-6 shadow-lg backdrop-blur dark:shadow-xl">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-secondary">設定</h2>
          <div className="grid gap-4">
            <div className="grid gap-4 rounded-2xl border border-secondary bg-muted p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-secondary">介面主題</h3>
                <p className="text-sm text-muted">切換應用程式的外觀主題。</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <button
                  onClick={() => onUpdatePrefs({ darkMode: !prefs.darkMode })}
                  className="flex items-center gap-2 rounded-full border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-primary hover:border-primary"
                  aria-pressed={prefs.darkMode}
                >
                  <span className="text-lg">{prefs.darkMode ? '🌙' : '☀️'}</span>
                  {prefs.darkMode ? '深色模式' : '淺色模式'}
                </button>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-secondary bg-muted p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-secondary">語音播放速度</h3>
                <p className="text-sm text-muted">調整語音合成的播放速度。</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <input
                  type="range"
                  min={0.7}
                  max={1.3}
                  step={0.1}
                  value={prefs.speechRate}
                  onChange={(e) => onUpdatePrefs({ speechRate: Number(e.target.value) })}
                  className="accent-primary w-full md:w-48"
                />
                <span className="font-semibold text-primary">{prefs.speechRate.toFixed(1)}x</span>
              </div>
              {!speechSupported && (
                <span className="text-xs text-danger md:col-span-2">
                  瀏覽器不支援 SpeechSynthesis，播放將停用
                </span>
              )}
            </div>

            <div className="grid gap-4 rounded-2xl border border-secondary bg-muted p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-secondary">重設進度</h3>
                <p className="text-sm text-muted">清除所有練習統計與答題記錄。</p>
              </div>
              <div className="flex items-center md:justify-end">
                <button
                  onClick={onResetStats}
                  className="rounded-full border border-danger bg-danger px-4 py-2 text-sm font-semibold text-danger hover:bg-danger"
                >
                  重設進度
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-secondary bg-muted p-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-secondary">練習分類</h3>
                <p className="text-sm text-muted">選擇要練習的分類，可複選。</p>
              </div>
              <CategoryFilter
                selected={prefs.selectedCategories}
                onChange={(v) => onUpdatePrefs({ selectedCategories: v })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
