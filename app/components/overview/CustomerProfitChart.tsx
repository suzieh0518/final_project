'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

type Props = {
  data: { 매출처: string; 이익합계: number }[]
}

function shortKRW(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
  return v.toLocaleString('ko-KR')
}

const BAR_COLORS = [
  '#38bdf8', '#818cf8', '#34d399', '#fb923c', '#f472b6',
  '#60a5fa', '#a78bfa', '#4ade80', '#facc15', '#f87171',
]

export default function CustomerProfitChart({ data }: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-100">매출처별 실이익금액</h3>
        <p className="text-xs text-slate-500 mt-0.5">상위 매출처 이익 현황</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
          <XAxis
            type="number"
            tickFormatter={shortKRW}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="매출처"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            width={96}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [`₩${Number(v).toLocaleString('ko-KR')}`, '실이익금액']}
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              fontSize: 12,
              color: '#f1f5f9',
            }}
            labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
            itemStyle={{ color: '#f1f5f9' }}
            cursor={{ fill: 'rgba(148,163,184,0.05)' }}
          />
          <Bar dataKey="이익합계" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
