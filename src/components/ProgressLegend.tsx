export function ProgressLegend() {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="rounded px-2 py-1 bg-rose-100 text-rose-900">低</span>
      <span className="rounded px-2 py-1 bg-orange-100 text-orange-900">學習中</span>
      <span className="rounded px-2 py-1 bg-emerald-200 text-emerald-900">穩定</span>
      <span className="rounded px-2 py-1 bg-emerald-100 text-emerald-900">熟練</span>
      <span className="text-xs text-slate-400">(根據答題正確率)</span>
    </div>
  )
}
