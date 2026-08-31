'use client'

import React, { useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'

export interface ImageUploaderBoxProps {
  label?: string
  value: string
  onChange: (url: string) => void
  aspect?: string
  uploadImageFile: (file: File) => Promise<string>
  uploadingImage: boolean
  setUploadingImage: (val: boolean) => void
}

export default function ImageUploaderBox({
  label,
  value,
  onChange,
  aspect = 'aspect-video',
  uploadImageFile,
  uploadingImage,
  setUploadingImage
}: ImageUploaderBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadImageFile(file)
      onChange(url)
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>{label}</span>
          {uploadingImage && <span className="text-purple-600 text-[9px] animate-pulse">กำลังอัปโหลด...</span>}
        </label>
      )}

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/40 shadow-sm">
          <img src={value} alt="Preview" className={`w-full ${aspect} object-cover`} />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-xl bg-white text-slate-900 text-[10px] font-bold shadow-md hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>เปลี่ยนรูป</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-xl bg-rose-600 text-white text-[10px] font-bold shadow-md hover:bg-rose-700 cursor-pointer"
              title="ลบรูป"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full ${aspect} rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition p-4 text-center group`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
            <Upload className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            คลิกเพื่อเลือกไฟล์รูปภาพ
          </span>
          <span className="text-[9px] text-slate-400">รองรับไฟล์ JPG, PNG, WebP</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
