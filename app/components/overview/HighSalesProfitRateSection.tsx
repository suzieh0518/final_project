type Item = {
  제품명: string
  보험코드: string
  건수: number
  총매출: number
  총이익금액: number
  이익율: number
}

const RANK_COLORS = ['text-yellow-400', 'text-slate-300', 'text-orange-400']

function formatAmount(v: number) {
  if (v >= 1_0000_0000) return `${(v / 1_0000_0000).toFixed(1)}억`
  if (v >= 1_0000) return `${(v / 1_0000).toFixed(0)}만`
  return `₩${v.toLocaleString()}`
}

export default function HighSalesProfitRateSection({ data }: { data: Item[] }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-4 rounded-full bg-amber-500" />
          <h3 className="text-sm font-semibold text-slate-100">연매출 5천만원 이상 제품 중 이익율 Top 10</h3>
        </div>
        <p className="text-xs text-slate-500 ml-3.5">실매출금액 합계 5천만원 이상 · 가중 이익율 기준</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1">
        {data.map((p, i) => {
          const rankCls = RANK_COLORS[i] ?? 'text-slate-500'
          const displayName = p.제품명.replace(/\s+[A-Z]\d{7,}.*$/, '').trim() || p.제품명
          return (
            <div key={p.보험코드 + i} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-800/60 transition-colors">
              <span className={`text-sm w-5 text-center shrink-0 font-bold ${rankCls}`}>{i + 1}</span>
              <span className="inline-block px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-mono rounded border border-amber-500/20 whitespace-nowrap shrink-0">
                {p.보험코드}
              </span>
              <span className="text-sm text-slate-300 truncate min-w-0" title={p.제품명}>{displayName}</span>
              <div className="ml-auto shrink-0 text-right">
                <p className="text-sm font-semibold text-amber-400">{p.이익율}%</p>
                <p className="text-xs text-slate-500">{p.건수}건 · {formatAmount(p.총매출)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
