import type { SalesRecord } from '@/types'

function fmt(n: number) {
  return Number(n).toLocaleString('ko-KR')
}

function ProfitBadge({ rate }: { rate: number }) {
  let cls = 'px-2 py-0.5 rounded-full text-xs font-semibold '
  if (rate < 0) cls += 'bg-red-500/15 text-red-400'
  else if (rate < 5) cls += 'bg-slate-700 text-slate-300'
  else if (rate < 10) cls += 'bg-sky-500/15 text-sky-400'
  else cls += 'bg-emerald-500/15 text-emerald-400'
  return <span className={cls}>{rate.toFixed(2)}%</span>
}

const COLUMNS = ['매입처', '제조사', '매출처', '제품명', '보험코드', '기준가', '실매입단가', '실이익금액', '실이익율'] as const

export default function DataTable({ records }: { records: SalesRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 text-sm">
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/60 border-b border-slate-700">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{r.매입처}</td>
              <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{r.제조사}</td>
              <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{r.매출처}</td>
              <td className="px-4 py-3 text-slate-300 max-w-xs truncate" title={r.제품명}>{r.제품명}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {r.보험코드 && (
                  <span className="px-1.5 py-0.5 bg-sky-500/10 text-sky-400 text-xs font-mono rounded border border-sky-500/20">
                    {r.보험코드}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-300 text-right whitespace-nowrap">{fmt(r.기준가)}</td>
              <td className="px-4 py-3 text-slate-300 text-right whitespace-nowrap">{fmt(r.실매입단가)}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap font-semibold">
                <span className={Number(r.실이익금액) >= 0 ? 'text-sky-400' : 'text-red-400'}>
                  {fmt(r.실이익금액)}
                </span>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <ProfitBadge rate={Number(r.실이익율)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
