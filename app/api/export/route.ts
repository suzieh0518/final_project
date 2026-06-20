import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search') ?? ''
  const 매입처 = searchParams.get('매입처') ?? ''
  const 매출처 = searchParams.get('매출처') ?? ''
  const 연도Str = searchParams.get('연도')
  const 연도 = 연도Str ? parseInt(연도Str) : null
  const prefix = searchParams.get('보험코드prefix') ?? ''

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
  if (연도) {
    conditions.push(`연도 = $${idx}`)
    values.push(연도)
    idx++
  }
  if (prefix) {
    conditions.push(`보험코드 ILIKE $${idx}`)
    values.push(`${prefix}%`)
    idx++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  try {
    const result = await pool.query(
      `SELECT 연도, 매입처, 제조사, 매출처, 제품명, 보험코드,
              기준가, 실매입단가, 실매출금액, 실이익금액, 실이익율
       FROM sales_records ${where}
       ORDER BY 연도 DESC, id`,
      values
    )

    const rows = result.rows.map((r) => ({
      연도: r.연도,
      매입처: r.매입처,
      제조사: r.제조사,
      매출처: r.매출처,
      제품명: r.제품명,
      보험코드: r.보험코드,
      기준가: parseFloat(r.기준가),
      실매입단가: parseFloat(r.실매입단가),
      실매출금액: parseFloat(r.실매출금액),
      실이익금액: parseFloat(r.실이익금액),
      실이익율: parseFloat(r.실이익율),
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '매출데이터')
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    const 연도Label = 연도 ? `${연도}년_` : ''
    const filename = encodeURIComponent(`${연도Label}매출데이터_${rows.length}건.xlsx`)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ error: '내보내기 실패' }, { status: 500 })
  }
}
