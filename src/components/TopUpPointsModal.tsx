'use client'

import React, { useState } from 'react'
import { 
  X, Coins, Sparkles, Check, QrCode, ArrowRight, 
  CreditCard, ShieldCheck, MessageCircle, ExternalLink, Flame
} from 'lucide-react'

interface TopUpPointsModalProps {
  isOpen: boolean
  onClose: () => void
  profile: any
  onSuccess?: () => void
}

export default function TopUpPointsModal({
  isOpen,
  onClose,
  profile,
  onSuccess,
}: TopUpPointsModalProps) {
  const [selectedPkg, setSelectedPkg] = useState<number>(250)

  if (!isOpen) return null

  const packages = [
    { points: 100, price: 100, desc: 'ปลดล็อกย่อลิงก์ / Pixels / PRO VIP 30 วัน', tag: '' },
    { points: 250, price: 250, desc: 'ปลดล็อก MASTER VIP 30 วัน (ฟรีเซลเพจ 1 URL)', tag: 'POPULAR' },
    { points: 350, price: 350, desc: 'ปลดล็อกสร้างหน้าเซลเพจยิงแอดเพิ่ม 1 URL', tag: 'HOT' },
    { points: 500, price: 450, desc: 'แพ็กเกจสุดคุ้ม ประหยัด 50 บาท (ลด 10%)', tag: 'คุ้มค่า' },
    { points: 1000, price: 850, desc: 'แพ็กเกจโปรคุ้มสุด ประหยัด 150 บาท (ลด 15%)', tag: 'BEST VALUE' }
  ]

  const currentPkg = packages.find(p => p.points === selectedPkg) || packages[1]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-[#1E1B4B] dark:text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">เติมแต้มสะสม (Top Up Points)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">แต้มคงเหลือปัจจุบัน: <strong className="text-amber-600 dark:text-amber-400 font-mono">{profile?.points || 0} แต้ม</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Package Selection */}
        <div className="space-y-2.5">
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
            1. เลือกแพ็กเกจแต้มที่ต้องการ:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {packages.map((pkg) => (
              <div
                key={pkg.points}
                onClick={() => setSelectedPkg(pkg.points)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                  selectedPkg === pkg.points
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm font-mono text-[#1E1B4B] dark:text-white">
                      🪙 {pkg.points} แต้ม
                    </span>
                    {pkg.tag && (
                      <span className="text-[9px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                        {pkg.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{pkg.desc}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
                    ฿{pkg.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment QR Code & Bank Info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#1E1B4B] dark:text-white">
            <QrCode className="w-4 h-4 text-emerald-500" />
            <span>2. สแกนชำระเงินผ่าน PromptPay QR Code</span>
          </div>

          <div className="w-44 h-44 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-inner mx-auto flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://linktreethai.com/pay/' + currentPkg.price)}`}
              alt="PromptPay QR"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold text-[#1E1B4B] dark:text-white">
              ยอดชำระ: <span className="text-amber-600 dark:text-amber-400 font-mono text-base font-black">฿{currentPkg.price} บาท</span> (ได้รับ {currentPkg.points} แต้ม)
            </p>
            <p className="text-[11px] text-slate-500">บัญชีพร้อมเพย์ / ธนาคารกสิกรไทย (KBANK)</p>
          </div>
        </div>

        {/* Notify Slip Button */}
        <div className="space-y-2">
          <a
            href="https://line.me/ti/p/@amth"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>ส่งสลิปยืนยันการเติมแต้มผ่าน LINE OA (@amth)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
          <p className="text-[10px] text-center text-slate-400">
            ✓ ระบบเติมแต้มให้โดยอัตโนมัติภายใน 1-3 นาทีหลังจากส่งสลิป
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs transition"
        >
          ปิดหน้าต่าง
        </button>

      </div>
    </div>
  )
}
