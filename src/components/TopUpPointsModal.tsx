'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  X, Coins, Sparkles, Check, QrCode, ArrowRight, 
  CreditCard, ShieldCheck, MessageCircle, ExternalLink, Flame, 
  Upload, Clock, CheckCircle2, AlertCircle, RefreshCw, Eye, Image as ImageIcon, Send
} from 'lucide-react'
import { generatePromptPayPayload, PROMPTPAY_PHONE, PROMPTPAY_BANK, PROMPTPAY_ACCOUNT_NAME } from '@/lib/promptpay'

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
  const [activeTab, setActiveTab] = useState<'pay' | 'history'>('pay')
  const [selectedPkg, setSelectedPkg] = useState<number>(250)
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [slipUrl, setSlipUrl] = useState<string>('')
  const [userNote, setUserNote] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Transaction History
  const [myTransactions, setMyTransactions] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [zoomSlipUrl, setZoomSlipUrl] = useState<string | null>(null)

  const supabase = createClient()

  const packages = [
    { points: 100, price: 100, desc: 'ปลดล็อกย่อลิงก์ / Pixels / PRO VIP 30 วัน', tag: '' },
    { points: 250, price: 250, desc: 'ปลดล็อก MASTER VIP 30 วัน (ฟรีเซลเพจ 1 URL)', tag: 'POPULAR' },
    { points: 350, price: 350, desc: 'ปลดล็อกสร้างหน้าเซลเพจยิงแอดเพิ่ม 1 URL', tag: 'HOT' },
    { points: 500, price: 450, desc: 'แพ็กเกจสุดคุ้ม ประหยัด 50 บาท (ลด 10%)', tag: 'คุ้มค่า' },
    { points: 1000, price: 850, desc: 'แพ็กเกจโปรคุ้มสุด ประหยัด 150 บาท (ลด 15%)', tag: 'BEST VALUE' }
  ]

  const currentPkg = packages.find(p => p.points === selectedPkg) || packages[1]

  // Generate Real EMVCo PromptPay QR Code Payload for 0909964514 with exact THB amount!
  const promptpayPayload = generatePromptPayPayload(PROMPTPAY_PHONE, currentPkg.price)
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(promptpayPayload)}`

  useEffect(() => {
    if (isOpen && profile?.id) {
      loadMyTransactions()
    }
  }, [isOpen, profile?.id])

  const loadMyTransactions = async () => {
    if (!profile?.id) return
    setLoadingHistory(true)
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setMyTransactions(data)
      }
    } catch (e) {}
    setLoadingHistory(false)
  }

  const handleUploadSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile?.id) return

    setUploadingSlip(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `slip-${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `slips/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        alert('❌ อัปโหลดสลิปไม่สำเร็จ: ' + uploadError.message)
      } else {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
        setSlipUrl(publicUrl)
      }
    } catch (err: any) {
      alert('❌ ข้อผิดพลาด: ' + err.message)
    } finally {
      setUploadingSlip(false)
    }
  }

  const handleSubmitSlip = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slipUrl || !profile?.id) {
      alert('กรุณาแนบรูปภาพสลิปการโอนเงินก่อนส่งแจ้งชำระเงินครับ')
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([{
          user_id: profile.id,
          amount: currentPkg.price,
          points: currentPkg.points,
          package_name: `${currentPkg.points} แต้ม (฿${currentPkg.price})`,
          slip_url: slipUrl,
          status: 'pending',
          note: userNote.trim() || null
        }])
        .select()

      if (!error && data) {
        setSubmitSuccess(true)
        setSlipUrl('')
        setUserNote('')
        await loadMyTransactions()
        if (onSuccess) onSuccess()
      } else {
        alert('❌ ไม่สามารถบันทึกรายการได้: ' + (error?.message || ''))
      }
    } catch (err: any) {
      alert('❌ เกิดข้อผิดพลาด: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-[#1E1B4B] dark:text-white cursor-default"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">เติมแต้มสะสม & แนบสลิปพร้อมเพย์</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                แต้มคงเหลือ: <strong className="text-amber-600 dark:text-amber-400 font-mono">{profile?.points || 0} แต้ม</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Pay & Upload Slip vs History */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pay')
              setSubmitSuccess(false)
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pay'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-500" />
            <span>💳 เติมแต้ม & สแกนจ่าย</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history')
              loadMyTransactions()
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-500" />
            <span>📜 ประวัติการแจ้งชำระ ({myTransactions.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PAY & UPLOAD SLIP FORM */}
        {/* ========================================================================= */}
        {activeTab === 'pay' && (
          <div className="space-y-5">
            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-lg text-emerald-950 dark:text-emerald-200">
                    แจ้งชำระเงินเรียบร้อยแล้ว! 🎉
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    ระบบได้ส่งสลิปให้แอดมินตรวจสอบแล้ว สถานะ: <span className="font-bold text-amber-600 dark:text-amber-400">🟡 รออนุมัติ</span> (โดยปกติแต้มจะเข้าภายใน 1-5 นาทีครับ)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    ดูสถานะในประวัติการเติมแต้ม
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold rounded-xl text-xs transition"
                  >
                    เติมแต้มเพิ่มอีกรายการ
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. Package Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    1. เลือกแพ็กเกจแต้มที่ต้องการ:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.points}
                        onClick={() => setSelectedPkg(pkg.points)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                          selectedPkg === pkg.points
                            ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 shadow-sm ring-2 ring-amber-500/20'
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
                          <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400">
                            ฿{pkg.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Real Thai EMVCo PromptPay QR Code Display */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#1E1B4B] dark:text-white">
                    <QrCode className="w-4 h-4 text-emerald-500" />
                    <span>2. สแกน QR Code พร้อมเพย์จริง (ทุกแอปธนาคาร)</span>
                  </div>

                  {/* Real PromptPay QR Image */}
                  <div className="w-52 h-52 bg-white p-2.5 rounded-2xl border-2 border-slate-200 shadow-inner mx-auto flex items-center justify-center">
                    <img
                      src={qrCodeImageUrl}
                      alt="PromptPay QR Code 0909964514"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-[#1E1B4B] dark:text-white">
                      ยอดชำระ: <span className="text-amber-600 dark:text-amber-400 font-mono text-lg font-black">฿{currentPkg.price}.00 บาท</span>
                    </p>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-0.5 font-medium">
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                        📱 เบอร์พร้อมเพย์: <span className="font-mono text-xs">{PROMPTPAY_PHONE}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        🏦 ธนาคาร: <strong>{PROMPTPAY_BANK}</strong>
                      </p>
                      <p className="text-slate-500">
                        👤 ชื่อบัญชี: <strong>{PROMPTPAY_ACCOUNT_NAME}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Slip Upload & Submission Form */}
                <form onSubmit={handleSubmitSlip} className="space-y-3 pt-1">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    3. แนบสลิปการโอนเงินเพื่อส่งให้แอดมินตรวจสอบ:
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-emerald-500/20 active:scale-95">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingSlip ? 'กำลังอัปโหลดสลิป...' : '📸 เลือกรูปสลิปจากมือถือ/คอม'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadSlip}
                      />
                    </label>
                  </div>

                  {slipUrl && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 animate-in fade-in">
                      <img src={slipUrl} alt="Slip Preview" className="w-14 h-14 object-cover rounded-xl border shadow-sm" />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                          ✓ แนบรูปสลิปเรียบร้อยแล้ว
                        </span>
                        <span className="text-[10px] text-slate-500">พร้อมส่งแจ้งชำระเงิน</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSlipUrl('')}
                        className="text-xs text-rose-500 font-bold hover:underline"
                      >
                        เปลี่ยนรูป
                      </button>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      placeholder="หมายเหตุเพิ่มเติม (ถ้ามี เช่น โอนเวลา 14:30 น.)"
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || uploadingSlip || !slipUrl}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'กำลังส่งข้อมูล...' : `🚀 ยืนยันการแจ้งชำระเงิน (฿${currentPkg.price} บาท)`}</span>
                  </button>
                </form>

                {/* LINE OA Alternative Contact */}
                <div className="pt-1 text-center">
                  <a
                    href="https://line.me/ti/p/@amth"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>หรือส่งสลิปผ่านทาง LINE OA (@amth) กับแอดมินโดยตรง</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY PAYMENT TRANSACTIONS HISTORY */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-[#1E1B4B] dark:text-slate-300 uppercase tracking-wider">
                ประวัติการแจ้งชำระเงินของฉัน ({myTransactions.length})
              </h4>
              <button
                type="button"
                onClick={loadMyTransactions}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                title="รีเฟรชประวัติ"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {myTransactions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-bold">ยังไม่มีประวัติการแจ้งชำระเงิน</p>
                <p className="text-[11px] text-slate-400">เมื่อคุณโอนเงินและแนบสลิป ประวัติและสถานะจะปรากฏที่นี่</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {myTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {tx.slip_url ? (
                        <img
                          src={tx.slip_url}
                          alt="Slip"
                          onClick={() => setZoomSlipUrl(tx.slip_url)}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:opacity-80 transition shrink-0"
                          title="คลิกเพื่อดูสลิปขนาดใหญ่"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#1E1B4B] dark:text-white font-mono">
                            ฿{parseFloat(tx.amount).toLocaleString()}
                          </span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-xs">
                            (+{tx.points} แต้ม)
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {new Date(tx.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                        {tx.admin_note && (
                          <p className="text-[10px] text-rose-500 font-bold">หมายเหตุ: {tx.admin_note}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {tx.status === 'approved' ? (
                        <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> อนุมัติแล้ว
                        </span>
                      ) : tx.status === 'rejected' ? (
                        <span className="px-2.5 py-1 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-full font-bold text-[10px] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> ไม่อนุมัติ
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" /> รอตรวจสอบ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>

      {/* Fullscreen Zoom Slip Lightbox */}
      {zoomSlipUrl && (
        <div 
          onClick={() => setZoomSlipUrl(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
        >
          <div className="relative max-w-lg max-h-[85vh] p-2" onClick={(e) => e.stopPropagation()}>
            <img src={zoomSlipUrl} alt="Slip Zoom" className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain" />
            <button
              onClick={() => setZoomSlipUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SendIcon(props: any) {
  return (
    <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  )
}
