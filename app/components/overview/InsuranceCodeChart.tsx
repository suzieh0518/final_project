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
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-lg">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ₩{p.value.toLocaleString('ko-KR')}
        </p>
      ))}
      {item && (
        <>
          <p className="text-gray-500 mt-1">평균 이익율: {item.평균이익율}%</p>
          <p className="text-gray-500">거래건수: {item.건수}건</p>
        </>
      )}
    </div>
  )
}

export default function InsuranceCodeChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">보험코드별 매출 및 이익금액 Top 10</h3>
        <p className="text-xs text-gray-400 mt-0.5">매출 = 기준가 합계 기준</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={shortKRW} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="보험코드" tick={{ fontSize: 11 }} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="총매출" name="매출(기준가)" fill="#93c5fd" radius={[0, 4, 4, 0]} />
          <Bar dataKey="총이익금액" name="이익금액" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
