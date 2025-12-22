export function ProgressLegend() {
  const colors = [
    { label: '需要加強', className: 'bg-rose-300/70' },
    { label: '基礎', className: 'bg-orange-300/70' },
    { label: '進步中', className: 'bg-amber-300/70' },
    { label: '熟練', className: 'bg-emerald-400/60' },
    { label: '非常熟練', className: 'bg-emerald-500/70' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
      <span className="font-semibold text-slate-700">熟練度：</span>
      {colors.map((c) => (
        <span key={c.label} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow">
          <span className={`h-3 w-6 rounded ${c.className}`}></span>
          {c.label}
        </span>
      ))}
    </div>
  )
}
