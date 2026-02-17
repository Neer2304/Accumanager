// components/googleexpenses/GoogleExpensesEmpty.tsx
'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface GoogleExpensesEmptyProps {
  onAddClick: () => void
}

export default function GoogleExpensesEmpty({ onAddClick }: GoogleExpensesEmptyProps) {
  return (
    <div className="p-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4 text-slate-400">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">No expenses found</h3>
      <p className="text-slate-500 max-w-xs mx-auto">
        Try changing your category filter or add a new expense to get started.
      </p>
      <button 
        onClick={onAddClick}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        Add Your First Expense
      </button>
    </div>
  )
}