'use client'

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

type TrendEntry = {
  연도: number
  총매출: number
  총이익금액: number
  평균이익율: number
  건수: number
}

function shortKRW(v: number) {
  if (v >= 1_0000_0000) return `${(v / 1_0000_0000).toFixed(0)}억`
  if (v >= 1_0000) return `${(v / 1_0000).toFixed(0)}만`
  return v.toLocaleString()
}

type TooltipEntry = { name: string; value: number; color: string }

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl space-y-1">
      <p className="font-semibold text-slate-100 mb-2">{label}년</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{' '}
          {p.name === '평균이익율' ? `${p.value}%` : `₩${p.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  )
}

export default function YearlyTrendChart({ data }: { data: TrendEntry[] }) {
  if (data.length < 2) return null

  const maxSales = Math.max(...data.map(d => d.총매출))
  const yAxisMax = Math.ceil(maxSales / 1_0000_0000) * 1_0000_0000

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-sky-400 to-blue-600" />
          <h3 className="text-sm font-semibold text-slate-100">연도별 매출 및 이익 성장 추이</h3>
        </div>
        <div className="flex gap-6 mt-3 ml-3.5">
          {data.map((d) => (
            <div key={d.연도} className="text-xs text-slate-500">
              <span className="text-slate-300 font-semibold">{d.연도}년</span>
              {' · '}
              {d.건수.toLocaleString()}건
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ left: 10, right: 30, top: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="연도"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            yAxisId="money"
            tickFormatter={shortKRW}
            domain={[0, yAxisMax]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <YAxis
            yAxisId="rate"
            orientation="right"
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 12 }}
          />
          <Bar yAxisId="money" dataKey="총매출" name="총매출" fill="#38bdf8" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
          <Bar yAxisId="money" dataKey="총이익금액" name="총이익금액" fill="#34d399" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="평균이익율"
            name="평균이익율"
            stroke="#f472b6"
            strokeWidth={2.5}
            dot={{ fill: '#f472b6', r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
