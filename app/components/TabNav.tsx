'use client'

import { useRouter } from 'next/navigation'

const TABS = [
  { key: 'overview', label: '개요' },
  { key: 'data', label: '데이터' },
] as const

export default function TabNav({ currentTab }: { currentTab: string }) {
  const router = useRouter()

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => router.push(`/?tab=${key}`)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentTab === key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
