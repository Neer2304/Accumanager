// components/googleexpenses/GoogleExpensesHeader.tsx
'use client'

import React from 'react'
import { Plus } from 'lucide-react'

interface GoogleExpensesHeaderProps {
  onAddClick: () => void
  isMobile?: boolean
}

export default function GoogleExpensesHeader({ onAddClick, isMobile }: GoogleExpensesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Simple Expenses
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Track and manage your daily spending
        </p>
      </div>
      <button 
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
      >
        <Plus size={20} /> 
        {isMobile ? 'Add' : 'Add Expense'}
      </button>
    </div>
  )
}