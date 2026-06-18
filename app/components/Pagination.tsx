'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number
  currentPage: number
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    startTransition(() => router.push(`?${params.toString()}`))
  }

  const pages = buildPageNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-500 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            disabled={isPending}
            className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              p === currentPage
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </div>
  )
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}
