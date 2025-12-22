// 功能: 顯示熟練度圖例，說明不同顏色代表的熟練度等級
// 包含需要加強、基礎、進步中、熟練、非常熟練等級別

export function ProgressLegend() {
  const colors = [
    { label: '需要加強', className: 'bg-[var(--color-danger)]' },
    { label: '基礎', className: 'bg-[var(--color-muted)]' },
    { label: '熟練', className: 'bg-[var(--color-success)]' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
      <span className="font-semibold text-secondary">熟練度：</span>
      {colors.map((c) => (
        <span
          key={c.label}
          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 shadow"
        >
          <span className={`h-3 w-6 rounded ${c.className}`}></span>
          {c.label}
        </span>
      ))}
    </div>
  )
}
