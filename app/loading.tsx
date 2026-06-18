function CardSkeleton() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-20 bg-slate-700 rounded" />
        <div className="w-5 h-5 bg-slate-700 rounded" />
      </div>
      <div className="h-8 w-32 bg-slate-700 rounded" />
    </div>
  )
}

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 animate-pulse">
      <div className="h-4 w-40 bg-slate-700 rounded mb-1" />
      <div className="h-3 w-24 bg-slate-800 rounded mb-4" />
      <div className="bg-slate-800 rounded-lg" style={{ height }} />
    </div>
  )
}

export default function OverviewLoading() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-slate-700 rounded mb-1" />
          <div className="h-3 w-28 bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-36 bg-slate-800 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <ChartSkeleton height={340} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartSkeleton height={360} />
        <ChartSkeleton height={360} />
      </div>
    </>
  )
}
