import { Suspense } from 'react'
import { getSalesRecords, getSummaryStats, getDistinct매출처 } from '@/lib/queries'
import StatsCards from './components/StatsCards'
import Filters from './components/Filters'
import DataTable from './components/DataTable'
import Pagination from './components/Pagination'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const filters = {
    search: params.search,
    매입처: params.매입처,
    매출처: params.매출처,
    page: params.page ? parseInt(params.page) : 1,
  }

  const [{ records, total, totalPages, currentPage }, stats, 매출처List] = await Promise.all([
    getSalesRecords(filters),
    getSummaryStats(filters),
    getDistinct매출처(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">매출 대시보드 2025</h1>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-5">
        <StatsCards stats={stats} />

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <Suspense>
              <Filters 매출처List={매출처List} />
            </Suspense>
          </div>

          <DataTable records={records} />

          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              총 <span className="font-medium text-gray-900">{total.toLocaleString('ko-KR')}</span>건
            </p>
            <Suspense>
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
