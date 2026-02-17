// components/googleexpenses/GoogleExpensesModal.tsx
'use client'

import React from 'react'
import { X } from 'lucide-react'
import { FormData } from './types'
import { CATEGORIES } from './constants'

interface GoogleExpensesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: FormData
  onFormChange: (field: keyof FormData, value: string) => void
  editingId: string | null
}

export default function GoogleExpensesModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onFormChange,
  editingId 
}: GoogleExpensesModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            {editingId ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Title
              </label>
              <input 
                required
                value={formData.title}
                onChange={(e) => onFormChange('title', e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none"
                placeholder="e.g. Weekly Groceries"
              />
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Amount ($)
              </label>
              <input 
                required
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => onFormChange('amount', e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Category
              </label>
              <select 
                value={formData.category}
                onChange={(e) => onFormChange('category', e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none appearance-none cursor-pointer"
              >
                {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Date
              </label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => onFormChange('date', e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none"
              />
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Description (Optional)
              </label>
              <textarea 
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none resize-none"
                placeholder="Add any additional details..."
                rows={3}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black tracking-wide shadow-lg transition-all active:scale-[0.98] mt-4"
          >
            {editingId ? 'Save Changes' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  )
}