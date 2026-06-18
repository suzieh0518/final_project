type ProductByVolume = {
  제품명: string
  보험코드: string
  건수: number
  총기준가: number
  평균이익율: number
}

type ProductByProfitRate = {
  제품명: string
  보험코드: string
  건수: number
  평균이익율: number
  총기준가: number
}

type ProductByTotalProfit = {
  제품명: string
  보험코드: string
  건수: number
  총이익금액: number
  평균이익율: number
}

function formatProfit(value: number) {
  if (value >= 1_0000_0000) return `${(value / 1_0000_0000).toFixed(1)}억`
  if (value >= 1_0000) return `${(value / 1_0000).toFixed(0)}만`
  return `₩${value.toLocaleString()}`
}

const RANK_COLORS = [
  'text-yellow-400',
  'text-slate-300',
  'text-orange-400',
]

function Rank({ n }: { n: number }) {
  const cls = RANK_COLORS[n - 1] ?? 'text-slate-500'
  return (
    <span className={`text-sm w-5 text-center shrink-0 font-bold ${cls}`}>
      {n}
    </span>
  )
}

function InsuranceCode({ code }: { code: string }) {
  return (
    <span className="inline-block px-1.5 py-0.5 bg-sky-500/10 text-sky-400 text-xs font-mono rounded border border-sky-500/20 whitespace-nowrap shrink-0">
      {code}
    </span>
  )
}

function ProductName({ name }: { name: string }) {
  const display = name.replace(/\s+[A-Z]\d{7,}.*$/, '').trim() || name
  return (
    <span className="text-sm text-slate-300 truncate min-w-0" title={name}>
      {display}
    </span>
  )
}

export default function TopProductsSection({
  byVolume,
  byProfitRate,
  byTotalProfit,
}: {
  byVolume: ProductByVolume[]
  byProfitRate: ProductByProfitRate[]
  byTotalProfit: ProductByTotalProfit[]
}) {
  return (
    <div className="space-y-5">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-4 rounded-full bg-violet-500" />
            <h3 className="text-sm font-semibold text-slate-100">이익금액 Top 10 제품</h3>
          </div>
          <p className="text-xs text-slate-500 ml-3.5">실이익금액 합계 기준</p>
        </div>
        <div className="space-y-2.5">
          {byTotalProfit.map((p, i) => (
            <div key={p.보험코드 + i} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-800/60 transition-colors">
              <Rank n={i + 1} />
              <InsuranceCode code={p.보험코드} />
              <ProductName name={p.제품명} />
              <div className="ml-auto shrink-0 text-right">
                <p className="text-sm font-semibold text-violet-400">
                  {formatProfit(p.총이익금액)}
                </p>
                <p className="text-xs text-slate-500">{p.건수}건 · {p.평균이익율}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-4 rounded-full bg-sky-500" />
            <h3 className="text-sm font-semibold text-slate-100">매출규모 Top 10 제품</h3>
          </div>
          <p className="text-xs text-slate-500 ml-3.5">총 기준가 합계 기준</p>
        </div>
        <div className="space-y-2.5">
          {byVolume.map((p, i) => (
            <div key={p.보험코드 + i} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-800/60 transition-colors">
              <Rank n={i + 1} />
              <InsuranceCode code={p.보험코드} />
              <ProductName name={p.제품명} />
              <div className="ml-auto shrink-0 text-right">
                <p className="text-sm font-semibold text-sky-400">
                  {(p.총기준가 / 1_0000_0000).toFixed(2)}억
                </p>
                <p className="text-xs text-slate-500">{p.건수}건 · {p.평균이익율}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-4 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-100">이익율 Top 10 제품</h3>
          </div>
          <p className="text-xs text-slate-500 ml-3.5">평균 이익율 기준 (최소 10건 이상)</p>
        </div>
        <div className="space-y-2.5">
          {byProfitRate.map((p, i) => (
            <div key={p.보험코드 + i} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-800/60 transition-colors">
              <Rank n={i + 1} />
              <InsuranceCode code={p.보험코드} />
              <ProductName name={p.제품명} />
              <div className="ml-auto shrink-0 text-right">
                <p className="text-sm font-semibold text-emerald-400">
                  {p.평균이익율}%
                </p>
                <p className="text-xs text-slate-500">{p.건수}건</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}
