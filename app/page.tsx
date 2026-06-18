import { Suspense } from 'react'
import {
  getSalesRecords,
  getSummaryStats,
  getDistinct매출처,
  getDistinct연도,
  getOverviewData,
} from '@/lib/queries'
import TabNav from './components/TabNav'
import StatsCards from './components/StatsCards'
import Filters from './components/Filters'
import DataTable from './components/DataTable'
import DataUpload from './components/DataUpload'
import Pagination from './components/Pagination'
import CustomerProfitChart from './components/overview/CustomerProfitChart'
import ManufacturerProfitChart from './components/overview/ManufacturerProfitChart'
import InsuranceCodeChart from './components/overview/InsuranceCodeChart'
import TopProductsSection from './components/overview/TopProductsSection'
import YearSelector from './components/YearSelector'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const tab = params.tab ?? 'overview'

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">매출 대시보드</h1>
            <p className="text-xs text-slate-500">Medical Device Sales Analytics</p>
          </div>
        </div>
        <TabNav currentTab={tab} 연도={params.연도} />
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-5">
        {tab === 'overview' ? (
          <OverviewContent 연도={params.연도 ? parseInt(params.연도) : undefined} />
        ) : (
          <DataContent params={params} />
        )}
      </main>
    </div>
  )
}

async function OverviewContent({ 연도 }: { 연도?: number }) {
  const [data, 연도List] = await Promise.all([
    getOverviewData(연도),
    getDistinct연도(),
  ])
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            {연도 ? `${연도}년 매출 현황` : '전체 매출 현황'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">기준가 합계 및 실이익 기준</p>
        </div>
        <YearSelector 연도List={연도List} current연도={연도} />
      </div>
      <StatsCards stats={data.globalStats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CustomerProfitChart data={data.customerProfit} />
        <ManufacturerProfitChart data={data.manufacturerProfit} />
      </div>
      <InsuranceCodeChart data={data.insuranceCodeTop10} />
      <TopProductsSection
        byVolume={data.topByVolume}
        byProfitRate={data.topByProfitRate}
      />
    </>
  )
}

async function DataContent({
  params,
}: {
  params: { [key: string]: string | undefined }
}) {
  const filters = {
    search: params.search,
    매입처: params.매입처,
    매출처: params.매출처,
    연도: params.연도 ? parseInt(params.연도) : undefined,
    page: params.page ? parseInt(params.page) : 1,
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
