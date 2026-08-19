'use client'

import React, { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageLightboxModalProps {
  isOpen: boolean
  images: string[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function ImageLightboxModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1)
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length, onClose, onNavigate])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex] || images[0]

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-150 select-none cursor-pointer"
      title="แตะที่ว่างเพื่อปิด"
    >
      {/* Top Header Bar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 left-4 right-4 flex items-center justify-between z-50 cursor-default"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-700 shadow-md">
            รูปที่ {currentIndex + 1} จาก {images.length}
          </span>
          <span className="hidden sm:inline-block text-[11px] text-slate-400">
            (แตะพื้นที่ว่างเพื่อปิด หรือกดปุ่ม ✕)
          </span>
        </div>

        {/* Big Prominent Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-2xl transition active:scale-95 border border-white/20"
          title="ปิดรูปภาพ (Exit Preview)"
        >
          <X className="w-4 h-4" />
          <span>ปิดรูปภาพ</span>
        </button>
      </div>

      {/* Main Image Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center p-2 cursor-default"
      >
        <img
          src={currentImage}
          alt={`Album Preview ${currentIndex + 1}`}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
        />
      </div>

      {/* Left Navigation Arrow */}
      {images.length > 1 && currentIndex > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex - 1)
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition active:scale-95 z-50 shadow-2xl cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {images.length > 1 && currentIndex < images.length - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex + 1)
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition active:scale-95 z-50 shadow-2xl cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-sm overflow-x-auto no-scrollbar py-1 px-3 bg-slate-950/90 rounded-2xl border border-slate-800 z-50 cursor-default"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(idx)
              }}
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                currentIndex === idx ? 'border-rose-500 scale-105 shadow' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
