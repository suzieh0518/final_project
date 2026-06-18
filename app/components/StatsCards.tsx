function fmt(n: number) {
  return n.toLocaleString('ko-KR')
}

type Stats = {
  total_count: string
  total_profit: string
  avg_profit_rate: string
  total_sales?: string
}

function shortKRW(v: number) {
  if (v >= 1_000_000_000_000) return `${(v / 1_000_000_000_000).toFixed(1)}조`
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}억`
  if (v >= 10_000) return `${(v / 10_000).toFixed(0)}만`
  return v.toLocaleString('ko-KR')
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const totalProfit = parseFloat(stats.total_profit)
  const avgRate = parseFloat(stats.avg_profit_rate)
  const totalSales = stats.total_sales ? parseFloat(stats.total_sales) : null

  const cards = [
    {
      label: '총 거래건수',
      value: `${fmt(parseInt(stats.total_count))}건`,
      accent: 'from-sky-500 to-blue-600',
      glow: 'shadow-sky-500/20',
      textColor: 'text-sky-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    ...(totalSales !== null ? [{
      label: '총 매출금액',
      value: `₩${shortKRW(totalSales)}`,
      accent: 'from-orange-500 to-amber-600',
      glow: 'shadow-orange-500/20',
      textColor: 'text-orange-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    }] : []),
    {
      label: '총 실이익금액',
      value: `₩${shortKRW(totalProfit)}`,
      accent: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/20',
      textColor: 'text-violet-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: '평균 이익율',
      value: `${avgRate.toFixed(2)}%`,
      accent: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/20',
      textColor: 'text-emerald-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ]

  const cols = cards.length === 4
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-3'

  return (
    <div className={`grid ${cols} gap-4`}>
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl ${card.glow} relative overflow-hidden`}
        >
          <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${card.accent}`} />
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{card.label}</p>
            <span className={`${card.textColor} opacity-70`}>{card.icon}</span>
          </div>
          <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
