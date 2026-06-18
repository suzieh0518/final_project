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

const RANK_STYLE = [
  'text-yellow-500 font-bold',
  'text-gray-400 font-bold',
  'text-orange-400 font-bold',
]

function Rank({ n }: { n: number }) {
  return (
    <span className={`text-sm w-5 text-center shrink-0 ${RANK_STYLE[n - 1] ?? 'text-gray-400 font-medium'}`}>
      {n}
    </span>
  )
}

function InsuranceCode({ code }: { code: string }) {
  return (
    <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-mono rounded border border-blue-100 whitespace-nowrap shrink-0">
      {code}
    </span>
  )
}

function ProductName({ name }: { name: string }) {
  // "ProductName CatalogCode / Size" → show the readable part
  const display = name.replace(/\s+[A-Z]\d{7,}.*$/, '').trim() || name
  return (
    <span className="text-sm text-gray-700 truncate min-w-0" title={name}>
      {display}
    </span>
  )
}

export default function TopProductsSection({
  byVolume,
  byProfitRate,
}: {
  byVolume: ProductByVolume[]
  byProfitRate: ProductByProfitRate[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 매출규모 Top 10 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700">매출규모 Top 10 제품</h3>
          <p className="text-xs text-gray-400 mt-0.5">총 기준가 합계 기준</p>
        </div>
        <div className="space-y-2.5">
          {byVolume.map((p, i) => (
            <div key={p.보험코드 + i} className="flex items-center gap-2">
              <Rank n={i + 1} />
              <InsuranceCode code={p.보험코드} />
              <ProductName name={p.제품명} />
              <div className="ml-auto shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ₩{(p.총기준가 / 1_000_000).toFixed(0)}M
                </p>
                <p className="text-xs text-gray-400">{p.건수}건 · {p.평균이익율}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 이익율 Top 10 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700">이익율 Top 10 제품</h3>
          <p className="text-xs text-gray-400 mt-0.5">평균 이익율 기준 (최소 10건 이상)</p>
        </div>
        <div className="space-y-2.5">
          {byProfitRate.map((p, i) => (
            <div key={p.보험코드 + i} className="flex items-center gap-2">
              <Rank n={i + 1} />
              <InsuranceCode code={p.보험코드} />
              <ProductName name={p.제품명} />
              <div className="ml-auto shrink-0 text-right">
                <p className="text-sm font-semibold text-green-600">
                  {p.평균이익율}%
                </p>
                <p className="text-xs text-gray-400">{p.건수}건</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
