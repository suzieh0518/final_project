'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function Filters({
  매출처List,
  연도List,
}: {
  매출처List: string[]
  연도List: number[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [매입처Input, set매입처Input] = useState(searchParams.get('매입처') ?? '')

  const inputCls = 'bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent'

  function apply(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    const next = { search, 매입처: 매입처Input, ...overrides }

    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    params.delete('page')

    startTransition(() => router.push(`?${params.toString()}`))
  }

  function reset() {
    setSearch('')
    set매입처Input('')
    startTransition(() => router.push('/'))
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="제품명, 보험코드 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && apply({ search })}
        className={`${inputCls} w-56`}
      />
      <input
        type="text"
        placeholder="매입처 검색..."
        value={매입처Input}
        onChange={(e) => set매입처Input(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && apply({ 매입처: 매입처Input })}
        className={`${inputCls} w-44`}
      />
      <select
        value={searchParams.get('연도') ?? ''}
        onChange={(e) => apply({ 연도: e.target.value })}
        className={inputCls}
      >
        <option value="">전체 연도</option>
        {연도List.map((y) => (
          <option key={y} value={String(y)}>{y}년</option>
        ))}
      </select>
      <select
        value={searchParams.get('매출처') ?? ''}
        onChange={(e) => apply({ 매출처: e.target.value })}
        className={inputCls}
      >
        <option value="">전체 매출처</option>
        {매출처List.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
      <button
        onClick={() => apply({})}
        disabled={isPending}
        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
      >
        검색
      </button>
      <button
        onClick={reset}
        disabled={isPending}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
      >
        초기화
      </button>
      {isPending && <span className="text-xs text-slate-500">로딩 중...</span>}
    </div>
  )
}
