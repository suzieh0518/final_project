'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

type Props = {
  data: { 제조사: string; 이익합계: number }[]
}

function shortKRW(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
  return v.toLocaleString('ko-KR')
}

const BAR_COLORS = [
  '#34d399', '#10b981', '#059669', '#6ee7b7', '#4ade80',
  '#86efac', '#22d3ee', '#38bdf8', '#67e8f9', '#a7f3d0',
]

export default function ManufacturerProfitChart({ data }: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-100">제조사별 실이익금액 Top 10</h3>
        <p className="text-xs text-slate-500 mt-0.5">상위 제조사 이익 현황</p>
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
            dataKey="제조사"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            width={130}
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
