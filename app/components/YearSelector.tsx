'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function YearSelector({
  연도List,
  current연도,
}: {
  연도List: number[]
  current연도?: number
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function onChange(value: string) {
    const params = new URLSearchParams()
    params.set('tab', 'overview')
    if (value) params.set('연도', value)
    startTransition(() => router.push(`/?${params.toString()}`))
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">연도</label>
      <select
        value={current연도 ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
        className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 cursor-pointer"
      >
        <option value="">전체</option>
        {연도List.map((y) => (
          <option key={y} value={String(y)}>{y}년</option>
        ))}
      </select>
      {isPending && <span className="text-xs text-slate-500">로딩 중...</span>}
    </div>
  )
}
