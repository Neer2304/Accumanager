// components/googleexpenses/GoogleExpensesFilters.tsx
'use client'

import React from 'react'
import { CATEGORIES } from './constants'

interface GoogleExpensesFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function GoogleExpensesFilters({ 
  selectedCategory, 
  onCategoryChange 
}: GoogleExpensesFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            selectedCategory === cat.value 
            ? 'bg-slate-900 text-white' 
            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}