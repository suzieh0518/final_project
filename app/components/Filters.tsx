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
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="매입처 검색..."
        value={매입처Input}
        onChange={(e) => set매입처Input(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && apply({ 매입처: 매입처Input })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={searchParams.get('연도') ?? ''}
        onChange={(e) => apply({ 연도: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">전체 연도</option>
        {연도List.map((y) => (
          <option key={y} value={String(y)}>{y}년</option>
        ))}
      </select>
      <select
        value={searchParams.get('매출처') ?? ''}
        onChange={(e) => apply({ 매출처: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">전체 매출처</option>
        {매출처List.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
      <button
        onClick={() => apply({})}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
      >
        검색
      </button>
      <button
        onClick={reset}
        disabled={isPending}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
      >
        초기화
      </button>
      {isPending && <span className="text-xs text-gray-400">로딩 중...</span>}
    </div>
  )
}
