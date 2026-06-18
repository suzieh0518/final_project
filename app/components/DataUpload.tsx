'use client'

import { useActionState, useRef, useEffect } from 'react'
import { uploadSalesData } from '@/app/actions/upload'

export default function DataUpload() {
  const [state, formAction, isPending] = useActionState(uploadSalesData, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && 'count' in state) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-100">데이터 추가</h3>
      </div>
      <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">연도</label>
          <input
            name="연도"
            type="number"
            defaultValue={new Date().getFullYear()}
            min={2000}
            max={2100}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Excel 파일 (.xlsx)</label>
          <input
            name="file"
            type="file"
            accept=".xlsx"
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent file:mr-2 file:border-0 file:bg-slate-700 file:rounded file:px-2 file:py-1 file:text-xs file:text-slate-300"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {isPending ? '업로드 중...' : '업로드'}
        </button>

        {state && (
          'error' in state ? (
            <p className="text-sm text-red-400">{state.error}</p>
          ) : (
            <p className="text-sm text-emerald-400 font-medium">
              {state.count.toLocaleString('ko-KR')}건 추가됨
            </p>
          )
        )}
      </form>
    </div>
  )
}
