'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const TABS = [
  { label: '개요', path: '/' },
  { label: '데이터', path: '/data' },
] as const

export default function TabNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  function switchTab(path: string) {
    const params = new URLSearchParams()
    const 연도 = searchParams.get('연도')
    if (연도) params.set('연도', 연도)
    const query = params.toString()
    router.push(query ? `${path}?${query}` : path)
  }

  return (
    <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
      {TABS.map(({ label, path }) => (
        <button
          key={path}
          onClick={() => switchTab(path)}
          className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            pathname === path
              ? 'bg-slate-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
