export type SalesRecord = {
  id: number
  매입처: string
  제조사: string
  매출처: string
  제품명: string
  보험코드: string
  기준가: number
  실매입단가: number
  실이익금액: number
  실이익율: number
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      sales_records: {
        Row: SalesRecord
        Insert: Omit<SalesRecord, 'id' | 'created_at'>
        Update: Partial<Omit<SalesRecord, 'id' | 'created_at'>>
      }
    }
  }
}
