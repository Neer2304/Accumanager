// components/googleexpenses/GoogleExpensesPagination.tsx
'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Pagination } from './types'

interface GoogleExpensesPaginationProps extends Pagination {}

export default function GoogleExpensesPagination({ 
  page, 
  totalPages, 
  onPageChange 
}: GoogleExpensesPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
      <button 
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-bold text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button 
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}