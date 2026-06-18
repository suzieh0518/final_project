'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

type Props = {
  data: { 매출처: string; 이익합계: number }[]
}

function shortKRW(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
  return v.toLocaleString('ko-KR')
}

export default function CustomerProfitChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">매출처별 실이익금액</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={shortKRW} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="매출처" tick={{ fontSize: 11 }} width={96} />
          <Tooltip
            formatter={(v) => [`₩${Number(v).toLocaleString('ko-KR')}`, '실이익금액']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="이익합계" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
