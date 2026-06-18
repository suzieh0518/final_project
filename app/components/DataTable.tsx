import type { SalesRecord } from '@/types'

function fmt(n: number) {
  return Number(n).toLocaleString('ko-KR')
}

const COLUMNS = ['매입처', '제조사', '매출처', '제품명', '보험코드', '기준가', '실매입단가', '실이익금액', '실이익율'] as const

export default function DataTable({ records }: { records: SalesRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{r.매입처}</td>
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{r.제조사}</td>
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{r.매출처}</td>
              <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={r.제품명}>{r.제품명}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.보험코드}</td>
              <td className="px-4 py-3 text-gray-700 text-right whitespace-nowrap">{fmt(r.기준가)}</td>
              <td className="px-4 py-3 text-gray-700 text-right whitespace-nowrap">{fmt(r.실매입단가)}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap font-medium">
                <span className={Number(r.실이익금액) >= 0 ? 'text-blue-600' : 'text-red-500'}>
                  {fmt(r.실이익금액)}
                </span>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap font-medium">
                <span className={Number(r.실이익율) >= 0 ? 'text-blue-600' : 'text-red-500'}>
                  {Number(r.실이익율).toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
