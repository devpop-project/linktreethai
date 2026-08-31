'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'

export interface LayoutOptionCardProps {
  title: string
  desc: string
  icon: React.ElementType
  isSelected: boolean
  onClick: () => void
  themeColor: string
}

export default function LayoutOptionCard({
  title,
  desc,
  icon: Icon,
  isSelected,
  onClick,
  themeColor
}: LayoutOptionCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        borderColor: isSelected ? themeColor : undefined,
        backgroundColor: isSelected ? `${themeColor}15` : undefined
      }}
      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all active:scale-98 space-y-1 ${
        isSelected
          ? 'ring-2 ring-purple-500/20 shadow-xs'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: isSelected ? themeColor : undefined,
              color: isSelected ? '#FFFFFF' : undefined
            }}
            className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{title}</h5>
        </div>
        {isSelected && (
          <CheckCircle className="w-4 h-4 shrink-0" style={{ color: themeColor }} />
        )}
      </div>
      <p className="text-[10px] text-slate-400 font-light pl-8 line-clamp-1">{desc}</p>
    </div>
  )
}
