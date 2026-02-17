// components/googleexpenses/GoogleExpensesSkeleton.tsx
'use client'

import React from 'react'

export default function GoogleExpensesSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-slate-200 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="h-12 w-36 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl w-12 h-12 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-slate-200 rounded mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}