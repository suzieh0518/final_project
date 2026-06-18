import { getOverviewData, getDistinct연도, getYearlyTrend } from '@/lib/queries'
import StatsCards from './components/StatsCards'
import CustomerProfitChart from './components/overview/CustomerProfitChart'
import ManufacturerProfitChart from './components/overview/ManufacturerProfitChart'
import InsuranceCodeChart from './components/overview/InsuranceCodeChart'
import TopProductsSection from './components/overview/TopProductsSection'
import InsurancePieCharts from './components/overview/InsurancePieCharts'
import YearlyTrendChart from './components/overview/YearlyTrendChart'
import YearSelector from './components/YearSelector'

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const 연도 = params.연도 ? parseInt(params.연도) : undefined

  const [data, 연도List, yearlyTrend] = await Promise.all([
    getOverviewData(연도),
    getDistinct연도(),
    getYearlyTrend(),
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
      <YearlyTrendChart data={yearlyTrend} />
      <StatsCards stats={data.globalStats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CustomerProfitChart data={data.customerProfit} />
        <ManufacturerProfitChart data={data.manufacturerProfit} />
      </div>
      <InsuranceCodeChart data={data.insuranceCodeTop10} />
      <InsurancePieCharts salesData={data.pieSalesByCode} rateData={data.pieRateByCode} />
      <TopProductsSection
        byVolume={data.topByVolume}
        byProfitRate={data.topByProfitRate}
        byTotalProfit={data.topByTotalProfit}
      />
    </>
  )
}
