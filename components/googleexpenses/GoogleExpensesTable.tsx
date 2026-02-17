// components/googleexpenses/GoogleExpensesTable.tsx
'use client'

import React from 'react'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { Expense } from './types'
import { CATEGORIES, getCategoryColor } from './constants'

interface GoogleExpensesTableProps {
  expenses: Expense[]
  loading: boolean
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export default function GoogleExpensesTable({ 
  expenses, 
  loading, 
  onEdit, 
  onDelete 
}: GoogleExpensesTableProps) {
  
  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-medium">Loading your data...</p>
      </div>
    )
  }

  if (expenses.length === 0) {
    return null
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Date</th>
            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Expense</th>
            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Category</th>
            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Amount</th>
            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {expenses.map((expense) => (
            <tr key={expense._id} className="group hover:bg-slate-50 transition-colors">
              <td className="p-4 whitespace-nowrap text-sm text-slate-500">
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td className="p-4">
                <div className="font-bold text-slate-900">{expense.title}</div>
                {expense.description && (
                  <div className="text-xs text-slate-400 line-clamp-1">{expense.description}</div>
                )}
              </td>
              <td className="p-4 capitalize">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </td>
              <td className="p-4 font-black text-slate-900">
                ${expense.amount.toLocaleString()}
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(expense)} 
                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-600 transition-all"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(expense._id)} 
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}