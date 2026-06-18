import { Suspense } from 'react'
import {
  getSalesRecords,
  getSummaryStats,
  getDistinct매출처,
  getDistinct연도,
} from '@/lib/queries'
import StatsCards from '@/app/components/StatsCards'
import Filters from '@/app/components/Filters'
import DataTable from '@/app/components/DataTable'
import DataUpload from '@/app/components/DataUpload'
import Pagination from '@/app/components/Pagination'

export default async function DataPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  const filters = {
    search: params.search,
    매입처: params.매입처,
    매출처: params.매출처,
    연도: params.연도 ? parseInt(params.연도) : undefined,
    page: params.page ? parseInt(params.page) : 1,
    보험코드prefix: params.보험코드prefix,
  }

  const [{ records, total, totalPages, currentPage }, stats, 매출처List, 연도List] =
    await Promise.all([
      getSalesRecords(filters),
      getSummaryStats(filters),
      getDistinct매출처(),
      getDistinct연도(),
    ])

  return (
    <>
      <DataUpload />
      <StatsCards stats={stats} />
      <div className="bg-slate-900 rounded-2xl border border-slate-800">
        <div className="px-5 py-4 border-b border-slate-800">
          <Suspense>
            <Filters 매출처List={매출처List} 연도List={연도List} />
          </Suspense>
        </div>
        <DataTable records={records} />
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            총{' '}
            <span className="font-semibold text-slate-200">
              {total.toLocaleString('ko-KR')}
            </span>
            건
          </p>
          <Suspense>
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
