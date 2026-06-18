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

function RowSkeleton() {
  return (
    <tr className="border-b border-slate-800">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-slate-800 rounded animate-pulse" style={{ width: `${50 + Math.random() * 50}%` }} />
        </td>
      ))}
    </tr>
  )
}

export default function DataLoading() {
  return (
    <>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 animate-pulse">
        <div className="h-4 w-24 bg-slate-700 rounded mb-4" />
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-slate-800 rounded-lg" />
          <div className="h-9 w-48 bg-slate-800 rounded-lg" />
          <div className="h-9 w-24 bg-slate-800 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <div className="flex gap-2 animate-pulse">
            <div className="h-9 w-56 bg-slate-800 rounded-lg" />
            <div className="h-9 w-44 bg-slate-800 rounded-lg" />
            <div className="h-9 w-28 bg-slate-800 rounded-lg" />
            <div className="h-9 w-28 bg-slate-800 rounded-lg" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/60 border-b border-slate-700">
              {['매입처','제조사','매출처','제품명','보험코드','기준가','실매입단가','실이익금액','실이익율'].map(col => (
                <th key={col} className="px-4 py-3 text-left">
                  <div className="h-3 w-12 bg-slate-700 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 15 }).map((_, i) => <RowSkeleton key={i} />)}
          </tbody>
        </table>
      </div>
    </>
  )
}
