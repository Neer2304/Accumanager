// components/googleexpenses/GoogleExpensesStats.tsx
'use client'

import React from 'react'
import { TrendingUp, PieChart as PieChartIcon, Calendar } from 'lucide-react'
import { Summary } from './types'

interface GoogleExpensesStatsProps {
  summary: Summary
}

export default function GoogleExpensesStats({ summary }: GoogleExpensesStatsProps) {
  const stats = [
    {
      icon: <TrendingUp size={24} />,
      label: 'Total Spent',
      value: `$${summary.totalAmount.toLocaleString()}`,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: <PieChartIcon size={24} />,
      label: 'Transactions',
      value: summary.totalExpenses.toString(),
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: <Calendar size={24} />,
      label: 'Current Month',
      value: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()),
      color: 'bg-amber-100 text-amber-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 ${stat.color} rounded-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h2 className="text-2xl font-black text-slate-900">{stat.value}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}