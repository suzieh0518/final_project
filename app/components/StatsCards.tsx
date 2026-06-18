function fmt(n: number) {
  return n.toLocaleString('ko-KR')
}

type Stats = {
  total_count: string
  total_profit: string
  avg_profit_rate: string
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const totalProfit = parseFloat(stats.total_profit)
  const avgRate = parseFloat(stats.avg_profit_rate)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">총 거래건수</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{fmt(parseInt(stats.total_count))}건</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">총 실이익금액</p>
        <p className="mt-2 text-2xl font-bold text-blue-600">₩{fmt(totalProfit)}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">평균 이익율</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{avgRate.toFixed(2)}%</p>
      </div>
    </div>
  )
}
