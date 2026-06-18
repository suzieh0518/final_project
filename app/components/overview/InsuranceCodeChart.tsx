'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'

type DataItem = {
  보험코드: string
  총매출: number
  총이익금액: number
  평균이익율: number
  건수: number
}

type Props = { data: DataItem[] }

function shortKRW(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
  return v.toLocaleString('ko-KR')
}

type TooltipEntry = { name: string; value: number; color: string; payload: DataItem }

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="font-semibold text-slate-100 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="mb-0.5">
          {p.name}: ₩{p.value.toLocaleString('ko-KR')}
        </p>
      ))}
      {item && (
        <>
          <div className="border-t border-slate-700 mt-2 pt-2">
            <p className="text-slate-400">평균 이익율: <span className="text-emerald-400 font-semibold">{item.평균이익율}%</span></p>
            <p className="text-slate-400">거래건수: <span className="text-slate-200">{item.건수}건</span></p>
          </div>
        </>
      )}
    </div>
  )
}

export default function InsuranceCodeChart({ data }: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-100">보험코드별 매출 및 이익금액 Top 10</h3>
        <p className="text-xs text-slate-500 mt-0.5">매출 = 실매출금액 합계 기준</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
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
            dataKey="보험코드"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            width={80}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
          />
          <Bar dataKey="총매출" name="매출(실매출금액)" fill="#38bdf8" radius={[0, 4, 4, 0]} />
          <Bar dataKey="총이익금액" name="이익금액" fill="#34d399" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
