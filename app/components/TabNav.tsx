'use client'

import { useRouter } from 'next/navigation'

const TABS = [
  { key: 'overview', label: '개요' },
  { key: 'data', label: '데이터' },
] as const

export default function TabNav({ currentTab, 연도 }: { currentTab: string; 연도?: string }) {
  const router = useRouter()

  function switchTab(key: string) {
    const params = new URLSearchParams()
    params.set('tab', key)
    if (연도) params.set('연도', 연도)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => switchTab(key)}
          className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentTab === key
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
