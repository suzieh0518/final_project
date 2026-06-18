'use client'

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const COLORS = [
  '#38bdf8', '#818cf8', '#34d399', '#fb923c', '#f472b6',
  '#a78bfa', '#4ade80', '#fbbf24', '#60a5fa', '#f87171',
]

function shortKRW(v: number) {
  if (v >= 1_0000_0000) return `${(v / 1_0000_0000).toFixed(1)}억`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
  return v.toLocaleString('ko-KR')
}

type SalesEntry = { 알파벳: string; 총매출: number }
type RateEntry  = { 알파벳: string; 총이익금액: number; 건수: number }

function SalesTooltip({ active, payload }: { active?: boolean; payload?: { payload: SalesEntry; name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="font-semibold text-slate-100 mb-1">{d.알파벳} 코드</p>
      <p className="text-sky-400">매출: ₩{d.총매출.toLocaleString()}</p>
    </div>
  )
}

function ProfitTooltip({ active, payload }: { active?: boolean; payload?: { payload: RateEntry; name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="font-semibold text-slate-100 mb-1">{d.알파벳} 코드</p>
      <p className="text-emerald-400">이익금액: ₩{d.총이익금액.toLocaleString()}</p>
      <p className="text-slate-400">거래건수: {d.건수}건</p>
    </div>
  )
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number
}) {
  if (!cx || !cy || midAngle == null || !innerRadius || !outerRadius || !percent || percent < 0.04) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function InsurancePieCharts({
  salesData,
  rateData,
}: {
  salesData: SalesEntry[]
  rateData: RateEntry[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-4 rounded-full bg-sky-500" />
            <h3 className="text-sm font-semibold text-slate-100">코드별 매출액 Top 10</h3>
          </div>
          <p className="text-xs text-slate-500 ml-3.5">보험코드 앞자리 알파벳별 실매출금액 합계</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={salesData}
              dataKey="총매출"
              nameKey="알파벳"
              cx="50%"
              cy="50%"
              outerRadius={110}
              labelLine={false}
              label={renderCustomLabel}
            >
              {salesData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<SalesTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  {value} ({shortKRW(salesData.find(d => d.알파벳 === value)?.총매출 ?? 0)})
                </span>
              )}
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-4 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-100">코드별 이익액 Top</h3>
          </div>
          <p className="text-xs text-slate-500 ml-3.5">보험코드 앞자리 알파벳별 실이익금액 합계</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={rateData}
              dataKey="총이익금액"
              nameKey="알파벳"
              cx="50%"
              cy="50%"
              outerRadius={110}
              labelLine={false}
              label={renderCustomLabel}
            >
              {rateData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ProfitTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  {value} ({shortKRW(rateData.find(d => d.알파벳 === value)?.총이익금액 ?? 0)})
                </span>
              )}
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
