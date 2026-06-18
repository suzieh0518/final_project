'use server'

import * as XLSX from 'xlsx'
import pool from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type UploadResult = { count: number } | { error: string }

export async function uploadSalesData(
  _prev: UploadResult | null,
  formData: FormData
): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  const 연도Str = formData.get('연도') as string | null

  if (!file || !file.size) return { error: '파일을 선택해주세요.' }
  if (!file.name.endsWith('.xlsx')) return { error: '.xlsx 파일만 업로드 가능합니다.' }

  const 연도 = parseInt(연도Str ?? '')
  if (isNaN(연도) || 연도 < 2000 || 연도 > 2100) return { error: '유효한 연도를 입력해주세요.' }

  try {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const ws = wb.Sheets['Sheet1']
    if (!ws) return { error: 'Sheet1을 찾을 수 없습니다.' }

    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][]
    const dataRows = rows.slice(1).filter((r) => r[1] != null && r[1] !== '')
    if (dataRows.length === 0) return { error: '유효한 데이터가 없습니다.' }

    const col = {
      매입처:   dataRows.map((r) => String(r[1] ?? '')),
      제조사:   dataRows.map((r) => String(r[2] ?? '')),
      매출처:   dataRows.map((r) => String(r[3] ?? '')),
      제품명:   dataRows.map((r) => String(r[5] ?? '')),
      보험코드: dataRows.map((r) => String(r[7] ?? '')),
      기준가:   dataRows.map((r) => Number(r[8]  ?? 0)),
      실매입단가: dataRows.map((r) => Number(r[14] ?? 0)),
      실이익금액: dataRows.map((r) => Number(r[16] ?? 0)),
      실이익율:   dataRows.map((r) => Number(r[17] ?? 0)),
      연도:     dataRows.map(() => 연도),
    }

    const BATCH = 5000
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      for (let i = 0; i < dataRows.length; i += BATCH) {
        const s = (arr: unknown[]) => arr.slice(i, i + BATCH)
        await client.query(
          `INSERT INTO sales_records
             (매입처, 제조사, 매출처, 제품명, 보험코드, 기준가, 실매입단가, 실이익금액, 실이익율, 연도)
           SELECT unnest($1::text[]), unnest($2::text[]), unnest($3::text[]), unnest($4::text[]),
                  unnest($5::text[]), unnest($6::numeric[]), unnest($7::numeric[]),
                  unnest($8::numeric[]), unnest($9::numeric[]), unnest($10::int[])`,
          [
            s(col.매입처), s(col.제조사), s(col.매출처), s(col.제품명),
            s(col.보험코드), s(col.기준가), s(col.실매입단가),
            s(col.실이익금액), s(col.실이익율), s(col.연도),
          ]
        )
      }
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }

    revalidatePath('/')
    return { count: dataRows.length }
  } catch (err) {
    console.error('Upload error:', err)
    return { error: '파일 처리 중 오류가 발생했습니다.' }
  }
}
