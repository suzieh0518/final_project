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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">데이터 추가</h3>
      <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">연도</label>
          <input
            name="연도"
            type="number"
            defaultValue={new Date().getFullYear()}
            min={2000}
            max={2100}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Excel 파일 (.xlsx)</label>
          <input
            name="file"
            type="file"
            accept=".xlsx"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:border-0 file:bg-gray-100 file:rounded file:px-2 file:py-1 file:text-xs file:text-gray-600"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {isPending ? '업로드 중...' : '업로드'}
        </button>

        {state && (
          'error' in state ? (
            <p className="text-sm text-red-500">{state.error}</p>
          ) : (
            <p className="text-sm text-green-600 font-medium">
              {state.count.toLocaleString('ko-KR')}건 추가됨
            </p>
          )
        )}
      </form>
    </div>
  )
}
