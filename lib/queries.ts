import pool from './db'
import type { SalesRecord } from '@/types'

export const PAGE_SIZE = 20

type Filters = {
  search?: string
  매입처?: string
  매출처?: string
  page?: number
}

function buildWhere(filters: Filters) {
  const { search, 매입처, 매출처 } = filters
  const conditions: string[] = []
  const values: unknown[] = []
  let idx = 1

  if (search) {
    conditions.push(`(제품명 ILIKE $${idx} OR 보험코드 ILIKE $${idx})`)
    values.push(`%${search}%`)
    idx++
  }
  if (매입처) {
    conditions.push(`매입처 ILIKE $${idx}`)
    values.push(`%${매입처}%`)
    idx++
  }
  if (매출처) {
    conditions.push(`매출처 = $${idx}`)
    values.push(매출처)
    idx++
  }

  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values, nextIdx: idx }
}

export async function getSalesRecords(filters: Filters = {}) {
  const { page = 1 } = filters
  const offset = (page - 1) * PAGE_SIZE
  const { where, values, nextIdx } = buildWhere(filters)

  const [dataResult, countResult] = await Promise.all([
    pool.query<SalesRecord>(
      `SELECT * FROM sales_records ${where} ORDER BY id LIMIT ${PAGE_SIZE} OFFSET $${nextIdx}`,
      [...values, offset]
    ),
    pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM sales_records ${where}`,
      values
    ),
  ])

  const total = parseInt(countResult.rows[0].count)
  return {
    records: dataResult.rows,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage: page,
  }
}

export async function getSummaryStats(filters: Filters = {}) {
  const { where, values } = buildWhere(filters)
  const result = await pool.query<{
    total_count: string
    total_profit: string
    avg_profit_rate: string
  }>(
    `SELECT
      COUNT(*) as total_count,
      COALESCE(SUM(실이익금액), 0) as total_profit,
      COALESCE(AVG(실이익율), 0) as avg_profit_rate
    FROM sales_records ${where}`,
    values
  )
  return result.rows[0]
}

export async function getDistinct매출처() {
  const result = await pool.query(
    `SELECT DISTINCT 매출처 FROM sales_records WHERE 매출처 != '' ORDER BY 매출처`
  )
  return result.rows.map((r: { 매출처: string }) => r.매출처)
}

export async function getOverviewData() {
  const [customerRows, manufacturerRows, volumeRows, rateRows, statsRows] = await Promise.all([
    pool.query<{ 매출처: string; 이익합계: string }>(
      `SELECT 매출처, SUM(실이익금액) as 이익합계
       FROM sales_records WHERE 매출처 != ''
       GROUP BY 매출처 ORDER BY 이익합계 DESC LIMIT 8`
    ),
    pool.query<{ 제조사: string; 이익합계: string }>(
      `SELECT 제조사, SUM(실이익금액) as 이익합계
       FROM sales_records WHERE 제조사 != ''
       GROUP BY 제조사 ORDER BY 이익합계 DESC LIMIT 10`
    ),
    pool.query<{ 제품명: string; 보험코드: string; 건수: string; 총기준가: string; 평균이익율: string }>(
      `SELECT 제품명, 보험코드, COUNT(*) as 건수,
              SUM(기준가) as 총기준가,
              ROUND(AVG(실이익율)::numeric, 2) as 평균이익율
       FROM sales_records WHERE 보험코드 IS NOT NULL AND 보험코드 != ''
       GROUP BY 제품명, 보험코드
       ORDER BY 총기준가 DESC LIMIT 10`
    ),
    pool.query<{ 제품명: string; 보험코드: string; 건수: string; 평균이익율: string; 총기준가: string }>(
      `SELECT 제품명, 보험코드, COUNT(*) as 건수,
              ROUND(AVG(실이익율)::numeric, 2) as 평균이익율,
              SUM(기준가) as 총기준가
       FROM sales_records WHERE 보험코드 IS NOT NULL AND 보험코드 != ''
       GROUP BY 제품명, 보험코드
       HAVING COUNT(*) >= 10
       ORDER BY 평균이익율 DESC LIMIT 10`
    ),
    pool.query<{ total_count: string; total_profit: string; avg_profit_rate: string }>(
      `SELECT COUNT(*) as total_count,
              COALESCE(SUM(실이익금액), 0) as total_profit,
              COALESCE(AVG(실이익율), 0) as avg_profit_rate
       FROM sales_records`
    ),
  ])

  return {
    customerProfit: customerRows.rows.map((r) => ({ 매출처: r.매출처, 이익합계: parseFloat(r.이익합계) })),
    manufacturerProfit: manufacturerRows.rows.map((r) => ({ 제조사: r.제조사, 이익합계: parseFloat(r.이익합계) })),
    topByVolume: volumeRows.rows.map((r) => ({
      제품명: r.제품명,
      보험코드: r.보험코드,
      건수: parseInt(r.건수),
      총기준가: parseFloat(r.총기준가),
      평균이익율: parseFloat(r.평균이익율),
    })),
    topByProfitRate: rateRows.rows.map((r) => ({
      제품명: r.제품명,
      보험코드: r.보험코드,
      건수: parseInt(r.건수),
      평균이익율: parseFloat(r.평균이익율),
      총기준가: parseFloat(r.총기준가),
    })),
    globalStats: statsRows.rows[0],
  }
}
