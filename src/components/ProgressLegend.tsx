export const ProgressLegend = () => {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-500">
      <div className="flex items-center gap-1">
        <div className="h-4 w-10 rounded bg-slate-50" />
        <span>新手</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-10 rounded bg-sky-200" />
        <span>熟悉</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-10 rounded bg-sky-500" />
        <span className="text-slate-600">精通</span>
      </div>
    </div>
  )
}
