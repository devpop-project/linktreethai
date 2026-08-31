'use client'

import React, { useRef } from 'react'
import ScrollFloat from '@/components/reactbits/ScrollFloat'
import { getPromptPayQRImageUrl, generatePromptPayPayload } from '@/lib/promptpay'
import {
  Compass,
  LayoutTemplate,
  SlidersHorizontal,
  Zap,
  Square,
  Percent,
  Flame,
  Crown,
  AlertTriangle,
  Eye,
  Sparkles,
  Boxes,
  Film,
  FileText,
  BadgeCheck,
  CheckCheck,
  Gift,
  Clock,
  Calendar,
  Activity,
  FlameKindling,
  Lock,
  Tag,
  CreditCard,
  Coins,
  Layers,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  RotateCw,
  Maximize2,
  X,
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Award,
  HeartHandshake,
  Star,
  List,
  HelpCircle,
  CheckCircle,
  Truck,
  Smartphone,
  Phone,
  Send,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  Upload,
  RefreshCw,
  ExternalLink,
  ZoomIn
} from 'lucide-react'

export interface PageSection {
  id: string
  type:
    | 'navbar'
    | 'hero'
    | 'countdown'
    | 'pricing'
    | 'gallery'
    | 'pain_points'
    | 'benefits'
    | 'reviews'
    | 'faq'
    | 'checkout'
    | 'guarantee'
    | 'sticky_cta'
    | 'story'
  title: string
  visible: boolean
  layoutStyle: string
  customBgColor?: string
  customTextColor?: string
  customThemeColor?: string
  cardStyle?: 'glass' | 'dark' | 'clean' | 'neon' | 'gold' | 'pastel'
  data: any
}

interface SalepageSectionRendererProps {
  section: PageSection
  globalThemeColor: string
  globalBgColor: string
  globalTextColor: string
  globalCardStyle: string
  isInteractive?: boolean
  selectedTierIndex?: number
  setSelectedTierIndex?: (idx: number) => void
  previewQty?: number
  setPreviewQty?: (qty: number) => void
  previewPaymentMethod?: 'promptpay' | 'cod'
  setPreviewPaymentMethod?: (pm: 'promptpay' | 'cod') => void
  previewFaqOpen?: number | null
  setPreviewFaqOpen?: (idx: number | null) => void
  previewActiveGalleryImg?: string
  setPreviewActiveGalleryImg?: (url: string) => void
  promptPayQRUrl?: string
  previewTotal?: number
  // Working Checkout & Slip Upload Props
  orderForm?: {
    name: string
    phone: string
    line_id?: string
    address: string
    note?: string
    payment_method: string
    slip_url?: string
  }
  setOrderForm?: (updater: any) => void
  onOrderSubmit?: (e: React.FormEvent) => void
  uploadingSlip?: boolean
  onSlipUpload?: (file: File) => Promise<void>
  ordering?: boolean
  orderSuccess?: boolean
  setOrderSuccess?: (val: boolean) => void
}

export const getCardStyleClasses = (style?: string, globalCardStyle = 'glass') => {
  const s = style || globalCardStyle || 'glass'
  switch (s) {
    case 'clean':
      return 'bg-white text-slate-900 border border-slate-200/90 shadow-md transition-all duration-300'
    case 'dark':
      return 'bg-slate-900/95 text-white border border-slate-800 shadow-xl transition-all duration-300'
    case 'neon':
      return 'bg-slate-950/95 text-white border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300'
    case 'gold':
      return 'bg-gradient-to-br from-amber-950/60 to-slate-950/95 text-amber-100 border border-amber-500/50 shadow-xl transition-all duration-300'
    case 'pastel':
      return 'bg-purple-50/90 text-purple-950 border border-purple-200 shadow-sm transition-all duration-300'
    case 'glass':
    default:
      return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all duration-300'
  }
}

export default function SalepageSectionRenderer({
  section,
  globalThemeColor,
  globalBgColor,
  globalTextColor,
  globalCardStyle,
  isInteractive = true,
  selectedTierIndex = 1,
  setSelectedTierIndex,
  previewQty = 1,
  setPreviewQty,
  previewPaymentMethod = 'promptpay',
  setPreviewPaymentMethod,
  previewFaqOpen = 0,
  setPreviewFaqOpen,
  previewActiveGalleryImg = '',
  setPreviewActiveGalleryImg,
  promptPayQRUrl = '',
  previewTotal = 0,
  orderForm = { name: '', phone: '', line_id: '', address: '', note: '', payment_method: 'promptpay', slip_url: '' },
  setOrderForm,
  onOrderSubmit,
  uploadingSlip = false,
  onSlipUpload,
  ordering = false,
  orderSuccess = false,
  setOrderSuccess
}: SalepageSectionRendererProps) {
  const slipInputRef = useRef<HTMLInputElement>(null)

  const secBg = section.customBgColor || undefined
  const secText = section.customTextColor || undefined
  const cardCls = getCardStyleClasses(section.cardStyle, globalCardStyle)
  const theme = section.customThemeColor || globalThemeColor

  // Data helpers for 100% unified data mapping
  const d = section.data || {}
  const brandName = d.brand_name || 'My Brand'
  const logoUrl = d.logo_url || ''
  const ctaText = d.cta_text || 'สั่งซื้อด่วน'
  const ctaUrl = d.cta_url || '#checkout'
  const phoneNumber = d.phone_number || '0812345678'
  const lineUrl = d.line_url || 'https://line.me'
  const tickerText = d.ticker_text || '🚚 จัดส่งฟรีด่วนทั่วไทย | รับประกันของแท้ 100%'
  const headline = d.headline || 'ข้อความพาดหัวโปรโมชั่นพิเศษ'
  const subheadline = d.subheadline || 'รายละเอียดสินค้าและคุณสมบัติเด่นที่น่าสนใจ'
  const heroImage = d.hero_image_url || d.image_url || d.hero_media_url || d.productImage || ''
  const videoUrl = d.video_url || ''
  const badge1 = d.trust_badge_1 || 'ส่งฟรีด่วน'
  const badge2 = d.trust_badge_2 || 'ของแท้ 100%'
  const badge3 = d.trust_badge_3 || 'เก็บเงินปลายทาง'
  const minutes = d.minutes || 15
  const voucherCode = d.voucher_code || 'AURA50'
  const stockLeft = d.stock_left || 7
  const offerPrice = parseFloat(d.offer_price || '490')
  const originalPrice = parseFloat(d.original_price || '990')
  const badgeText = d.badge_text || 'Special Offer ลด 50%'
  const features = (d.features && d.features.length > 0) ? d.features : [
    'เซรั่มเข้มข้นขนาด 30ml 1 ขวด',
    'แถมฟรี มาส์กหน้าไฮยาลูรอน 2 แผ่น',
    'จัดส่งฟรีด่วนพิเศษทั่วประเทศ'
  ]
  const tiers = (d.tiers && d.tiers.length > 0) ? d.tiers : [
    { name: 'ชุดทดลอง 1 ขวด', price: offerPrice, original: originalPrice, note: 'ส่งฟรีด่วน', isPopular: false },
    { name: 'ชุดขายดี 2 ขวด (แถมมาส์ก 2 แผ่น)', price: offerPrice * 2 - 90, original: originalPrice * 2, note: '🔥 ยอดนิยม ขายดีอันดับ 1', isPopular: true },
    { name: 'ชุดสุดคุ้ม 3 ขวด (แถม 1 ขวดฟรี)', price: offerPrice * 3 - 280, original: originalPrice * 3, note: '👑 ประหยัดสูงสุด ฿1,780', isPopular: false }
  ]
  const galleryImages = (d.images && d.images.length > 0) ? d.images : [
    'https://images.unsplash.com/photo-1608248597359-2ff9e3b97b09?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80'
  ]
  const beforeImg = d.before_image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
  const afterImg = d.after_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
  const beforeText = d.before_text || 'ก่อนใช้ ❌'
  const afterText = d.after_text || 'หลังใช้ 7 วัน ✅'
  const painPoints = (d.points && d.points.length > 0) ? d.points : [
    'ผิวหน้าหมองคล้ำ ไม่สดใส แต่งหน้าไม่ติดทน',
    'รอยสิว ฝ้า กระ และจุดด่างดำสะสมมานาน',
    'ผิวแห้งกร้าน รูขุมขนกว้าง ขาดความชุ่มชื้น'
  ]
  const benefits = (d.benefits && d.benefits.length > 0) ? d.benefits : [
    'ผิวกระจ่างใส ฉ่ำวาว อิ่มน้ำแบบสาวเกาหลี',
    'รอยดำ รอยแดงจากสิว จางลงอย่างเห็นได้ชัด',
    'ผิวแข็งแรง รูขุมขนกระชับขึ้นอย่างเป็นธรรมชาติ'
  ]
  const steps = (d.steps && d.steps.length > 0) ? d.steps : [
    { day: 'วันที่ 1-3', desc: 'ผิวชุ่มชื้น นุ่มเด้ง ไม่แห้งตึง' },
    { day: 'วันที่ 7', desc: 'รอยสิวเริ่มจาง ผิวดูกระจ่างใสขึ้น' },
    { day: 'วันที่ 14+', desc: 'ผิวออร่า รูขุมขนกระชับ เรียบเนียนถาวร' }
  ]
  const reviews = (d.reviews && d.reviews.length > 0)
    ? d.reviews
    : (d.testimonials && d.testimonials.length > 0)
      ? d.testimonials
      : [
          { name: 'คุณกิตติศักดิ์ (กรุงเทพฯ)', comment: 'สั่งมาทาน/ใช้งานแล้วประทับใจมากครับ คุณภาพดีเยี่ยม ตรงปก สั่งซ้ำแน่นอนครับ', stars: 5, date: 'เมื่อวานนี้' },
          { name: 'คุณศิริพร (เชียงใหม่)', comment: 'ได้รับสินค้าเรียบร้อย แพ็กมาอย่างดี ผลลัพธ์ประทับใจมาก คุ้มค่าคุ้มราคามากค่ะ', stars: 5, date: '3 วันที่แล้ว' }
        ]

  const chatReviews = (d.chat_reviews && d.chat_reviews.length > 0)
    ? d.chat_reviews
    : (d.chatReviews && d.chatReviews.length > 0)
      ? d.chatReviews
      : [
          { sender: 'ลูกค้า', text: 'สวัสดีค่ะ ได้รับของแล้วนะคะ แพ็กมาดีมากค่ะ' },
          { sender: 'ร้านค้า', text: 'ขอบคุณมากค่า ลองทาน/ใช้แล้วเป็นอย่างไรบ้างคะ ❤️' },
          { sender: 'ลูกค้า', text: 'ประทับใจมากเลยค่ะ ผลลัพธ์ดีมาก ขอสั่งชุดโปรโมชั่นเพิ่มนะคะ!' }
        ]
  const faqs = (d.faqs && d.faqs.length > 0) ? d.faqs : [
    { q: 'ใช้เวลานานแค่ไหนถึงจะเห็นผล?', a: 'รู้สึกได้ถึงความชุ่มชื้นตั้งแต่วันแรกที่ใช้ และจะเริ่มเห็นความกระจ่างใสชัดเจนใน 7-14 วัน' },
    { q: 'ผิวแพ้ง่ายสามารถใช้ได้ไหม?', a: 'สูตรอ่อนโยน ปราศจากสารระคายเคือง 100% ผ่านการทดสอบจากแพทย์ผิวหนัง ปลอดภัยแน่นอน' },
    { q: 'มีบริการเก็บเงินปลายทาง (COD) ไหม?', a: 'มีบริการเก็บเงินปลายทางฟรี ไม่มีบวกค่าธรรมเนียมเพิ่ม จัดส่งถึงหน้าบ้านใน 1-2 วันทำการ' }
  ]
  const guaranteeText = d.text || 'รับประกันความพึงพอใจ ของแท้ 100% ไม่พอใจยินดีคืนเงินใน 14 วัน'
  const btn1Text = d.btn1_text || 'สั่งซื้อโปรโมชั่นด่วน'
  const btn1Url = d.btn1_url || '#checkout'
  const btn2Text = d.btn2_text || 'แชท LINE'
  const btn2Url = d.btn2_url || 'https://line.me'
  const btn3Text = d.btn3_text || 'โทรด่วน'
  const btn3Url = d.btn3_url || 'tel:0812345678'
  const storyBody = d.body || 'เรื่องราวของแบรนด์เรา มุ่งมั่นคัดสรรสารสกัดธรรมชาติเกรดพรีเมียม เพื่อผลลัพธ์ที่ดีที่สุดสำหรับผิวของคุณ...'
  const founderName = d.founder_name || 'ผู้บริหารและทีมวิจัย'

  // Working Slip Upload Handler
  const handleSlipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onSlipUpload) {
      onSlipUpload(file)
    } else if (file && setOrderForm) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setOrderForm((prev: any) => ({ ...prev, slip_url: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Active payment method
  const currentPayMethod = orderForm.payment_method || previewPaymentMethod || 'promptpay'

  // Shared Customer Inputs Component
  const RenderCustomerInputs = ({ compact = false }: { compact?: boolean }) => (
    <div className={`space-y-2 text-left w-full max-w-sm mx-auto ${compact ? 'text-[10px]' : 'text-xs'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล ผู้รับ *</label>
          <input
            type="text"
            required
            value={orderForm.name}
            onChange={(e) => setOrderForm && setOrderForm((prev: any) => ({ ...prev, name: e.target.value }))}
            placeholder="คุณสมศรี มีสุข"
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
          <input
            type="tel"
            required
            value={orderForm.phone}
            onChange={(e) => setOrderForm && setOrderForm((prev: any) => ({ ...prev, phone: e.target.value }))}
            placeholder="0812345678"
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-300 block mb-1">ที่อยู่จัดส่งสินค้าโดยละเอียด *</label>
        <textarea
          rows={2}
          required
          value={orderForm.address}
          onChange={(e) => setOrderForm && setOrderForm((prev: any) => ({ ...prev, address: e.target.value }))}
          placeholder="บ้านเลขที่, ถนน/ซอย, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์..."
          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">LINE ID (แจ้งแทร็กกิ้ง)</label>
          <input
            type="text"
            value={orderForm.line_id || ''}
            onChange={(e) => setOrderForm && setOrderForm((prev: any) => ({ ...prev, line_id: e.target.value }))}
            placeholder="@line_id"
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">หมายเหตุเพิ่มเติม</label>
          <input
            type="text"
            value={orderForm.note || ''}
            onChange={(e) => setOrderForm && setOrderForm((prev: any) => ({ ...prev, note: e.target.value }))}
            placeholder="เช่น ฝากไว้หน้าบ้าน"
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  )
  // Shared Slip Upload Box (100% Guaranteed Centered across all variants)
  const RenderSlipUploadBox = () => (
    <div className="w-full flex items-center justify-center text-center my-2.5">
      <div className="w-full max-w-sm mx-auto text-center space-y-1.5 flex flex-col items-center justify-center">
        <input
          ref={slipInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSlipFileChange}
        />
        {orderForm.slip_url ? (
          <div className="relative group rounded-2xl overflow-hidden border-2 border-emerald-500/60 bg-black/80 p-2 max-w-[240px] w-full mx-auto shadow-lg shadow-emerald-500/20 flex flex-col items-center">
            <img src={orderForm.slip_url} alt="Slip" className="w-full max-h-40 object-contain rounded-xl mx-auto block" />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={() => slipInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-slate-900 text-[10px] font-bold rounded-xl cursor-pointer hover:bg-slate-100"
              >
                เปลี่ยนรูปสลิป
              </button>
              <button
                type="button"
                onClick={() => setOrderForm && setOrderForm((prev: any) => ({ ...prev, slip_url: '' }))}
                className="p-1.5 bg-rose-600 text-white rounded-xl cursor-pointer hover:bg-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[9px] text-emerald-400 font-bold block mt-1.5 text-center">✓ แนบสลิปโอนเงินเรียบร้อย</span>
          </div>
        ) : (
          <div
            onClick={() => slipInputRef.current?.click()}
            className="w-full p-3.5 rounded-2xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/35 text-emerald-300 flex flex-col items-center justify-center gap-1 cursor-pointer transition shadow-sm mx-auto"
          >
            {uploadingSlip ? (
              <div className="flex items-center justify-center gap-2 text-xs py-1">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>กำลังอัปโหลดสลิปขึ้นคลาวด์...</span>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-emerald-400 animate-bounce" />
                <span className="text-xs font-black text-center">คลิกเพื่อแนบสลิปโอนเงิน 🧾</span>
                <span className="text-[9px] opacity-75 text-center">รองรับไฟล์สลิป JPG, PNG จากแอปธนาคาร</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Shared PromptPay QR Box (100% Guaranteed Centered in all 10 Checkout variants)
  const RenderPromptPayQRBox = ({ size = 'w-36 h-36' }: { size?: string }) => (
    <div className="w-full flex items-center justify-center text-center my-3">
      <div className="p-4 bg-white text-slate-900 rounded-3xl shadow-xl border border-slate-200 text-center space-y-2 max-w-[280px] w-full mx-auto flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-emerald-700 block tracking-wide text-center w-full">
          สแกน PromptPay QR Code ยอดตรง
        </span>
        {promptPayQRUrl ? (
          <div className="flex items-center justify-center w-full my-1">
            <img
              src={promptPayQRUrl}
              alt="PromptPay QR Code"
              className={`${size} object-contain rounded-xl mx-auto block shadow-sm`}
            />
          </div>
        ) : (
          <div className={`${size} bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-mono rounded-xl mx-auto`}>
            ระบุเบอร์พร้อมเพย์
          </div>
        )}
        <div className="font-mono font-black text-sm text-slate-950 text-center w-full">
          ยอดชำระ: ฿{previewTotal.toLocaleString()} บาท
        </div>
        <div className="text-[9px] text-slate-600 font-medium text-center w-full leading-tight">
          {d.promptpay_name || 'Enter The Amanita Thailand'} ({d.promptpay_number || '0909964514'})
        </div>
      </div>
    </div>
  )
  return (
    <div
      style={{
        backgroundColor: secBg,
        color: secText
      }}
      className="space-y-3.5 rounded-2xl transition-all duration-300 transform"
    >
      {/* 1. NAVBAR (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'navbar' && (
        <>
          {section.layoutStyle === 'brand_header_banner' ? (
            <div className={`p-3 rounded-2xl border text-center space-y-1.5 ${cardCls}`}>
              <div className="flex items-center justify-between">
                <a href={lineUrl} target="_blank" className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:scale-110 active:scale-95 transition">
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-6 w-auto object-contain mx-auto transition-transform hover:scale-105" />
                ) : (
                  <span className="font-black text-xs tracking-wider" style={{ color: theme }}>{brandName}</span>
                )}
                <a href={`tel:${phoneNumber}`} className="p-1.5 rounded-full bg-purple-500/20 text-purple-400 hover:scale-110 active:scale-95 transition">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : section.layoutStyle === 'minimal_sticky_ticker' ? (
            <div className="py-1 px-3 rounded-xl bg-black/90 border border-white/15 text-[9px] flex items-center justify-between shadow-md">
              <span className="truncate text-slate-300 animate-pulse">{tickerText}</span>
              <a href={ctaUrl} className="font-bold shrink-0 ml-2 hover:underline" style={{ color: theme }}>{ctaText}</a>
            </div>
          ) : section.layoutStyle === 'cyber_neon_hud' ? (
            <div style={{ borderColor: `${theme}80` }} className="p-2.5 rounded-xl bg-black/95 border font-mono text-[10px] flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme }} />
                <span className="font-bold">{brandName}</span>
              </div>
              <a href={ctaUrl} className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-cyan-300 font-bold hover:bg-cyan-500/20 transition">{ctaText}</a>
            </div>
          ) : section.layoutStyle === 'clean_white_border' ? (
            <div className="p-2.5 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-md flex items-center justify-between">
              <span className="font-black text-xs">{brandName}</span>
              <a href={ctaUrl} style={{ backgroundColor: theme }} className="text-white text-[9px] font-bold px-3 py-1 rounded-lg hover:opacity-90 active:scale-95 transition shadow-xs">{ctaText}</a>
            </div>
          ) : section.layoutStyle === 'split_brand_cta' ? (
            <div className="p-2 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-black border border-white/15 flex items-center justify-between shadow-lg">
              <span className="font-bold text-[11px] px-2 text-white">{brandName}</span>
              <a href={ctaUrl} style={{ backgroundColor: theme }} className="text-white text-[9px] font-black px-3 py-1 rounded-xl shadow-md hover:scale-105 active:scale-95 transition">{ctaText}</a>
            </div>
          ) : section.layoutStyle === 'gradient_accent_strip' ? (
            <div className={`p-2.5 rounded-2xl border-t-2 border-b border-x border-white/10 flex items-center justify-between ${cardCls}`} style={{ borderTopColor: theme }}>
              <span className="font-bold text-[11px]">{brandName}</span>
              <a href={ctaUrl} className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 transition">{ctaText}</a>
            </div>
          ) : section.layoutStyle === 'centered_logo_dock' ? (
            <div className="p-2 rounded-2xl bg-black/70 border border-white/15 text-center space-y-1 shadow-md">
              <div className="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-white font-black text-[10px] shadow-sm animate-pulse" style={{ backgroundColor: theme }}>
                {brandName.slice(0, 1)}
              </div>
              <span className="font-bold text-[10px] block">{brandName}</span>
            </div>
          ) : section.layoutStyle === 'emergency_top_bar' ? (
            <div className="p-2 rounded-xl bg-rose-600 text-white font-bold text-[10px] flex items-center justify-between shadow-md animate-pulse">
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-300" /> {brandName}: โปรไฟลุกวันนี้!</span>
              <a href={ctaUrl} className="bg-black/30 px-2 py-0.5 rounded-lg text-[9px] hover:bg-black/50 transition">{ctaText}</a>
            </div>
          ) : section.layoutStyle === 'transparent_overlay' ? (
            <div className="p-2 flex items-center justify-between border-b border-white/10 text-[11px]">
              <span className="font-bold">{brandName}</span>
              <a href={ctaUrl} style={{ color: theme }} className="font-bold hover:underline">{ctaText}</a>
            </div>
          ) : (
            /* 1. floating_glass default */
            <div className={`p-2.5 rounded-2xl backdrop-blur-md flex items-center justify-between border ${cardCls}`}>
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain rounded" />
                ) : (
                  <div style={{ backgroundColor: theme }} className="w-6 h-6 rounded-lg text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {brandName.slice(0, 2)}
                  </div>
                )}
                <span className="font-bold text-[11px] truncate max-w-[120px]">{brandName}</span>
              </div>
              <a href={ctaUrl} style={{ backgroundColor: `${theme}25`, color: theme, borderColor: `${theme}50` }} className="text-[9px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs hover:scale-105 active:scale-95 transition">
                {ctaText}
              </a>
            </div>
          )}
        </>
      )}

      {/* 2. COUNTDOWN (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'countdown' && (
        <>
          {section.layoutStyle === 'floating_voucher_pill' ? (
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border-2 border-dashed border-amber-400/50 flex items-center justify-between text-[10px] shadow-sm">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
                <div>
                  <span className="font-bold text-amber-300 block">โค้ดส่วนลด: {voucherCode}</span>
                  <span className="text-[8px] text-slate-300">{headline}</span>
                </div>
              </div>
              <a href={ctaUrl} className="font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] hover:scale-105 active:scale-95 transition">ใช้โค้ดนี้</a>
            </div>
          ) : section.layoutStyle === 'neon_cyber_counter' ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-[9px] font-mono space-y-1 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between text-cyan-400">
                <span>⚠️ {headline}</span>
                <span className="font-bold text-rose-400 animate-pulse">เหลือ {stockLeft} ชิ้น</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[25%] animate-pulse" />
              </div>
            </div>
          ) : section.layoutStyle === 'minimal_dark_clock' ? (
            <div className="p-2 rounded-xl bg-black/80 border border-white/15 flex items-center justify-center gap-2 text-[10px] shadow-sm">
              <Clock className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              <span>{headline}</span>
              <span className="font-mono font-bold text-purple-300 bg-white/10 px-1.5 py-0.5 rounded">{minutes}:00 นาที</span>
            </div>
          ) : section.layoutStyle === 'split_deal_timer' ? (
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-black border border-purple-500/30 flex items-center justify-between text-[10px] shadow-md">
              <span className="font-bold text-purple-200">{headline}</span>
              <div className="flex items-center gap-1 font-mono font-black text-xs text-amber-300">
                <span className="bg-black/80 px-1.5 py-0.5 rounded border border-white/10">{minutes}</span>:
                <span className="bg-black/80 px-1.5 py-0.5 rounded border border-white/10">00</span>
              </div>
            </div>
          ) : section.layoutStyle === 'glowing_ribbon_bar' ? (
            <div style={{ backgroundColor: theme }} className="p-2 rounded-xl text-white text-center font-black text-[10px] animate-pulse shadow-lg">
              🔥 {headline} เหลือเวลาอีก {minutes} นาทีเท่านั้น!
            </div>
          ) : section.layoutStyle === 'clean_white_counter' ? (
            <div className="p-2.5 rounded-2xl bg-white text-slate-900 border border-slate-200 flex items-center justify-between text-[10px] shadow-sm">
              <span className="font-bold">{headline}</span>
              <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">{minutes}:00 นาที</span>
            </div>
          ) : section.layoutStyle === 'pill_floating_dock' ? (
            <div className="mx-auto w-fit px-4 py-1.5 rounded-full bg-slate-900/90 border border-white/20 text-[9px] flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>{headline} ใน {minutes}:00 นาที</span>
            </div>
          ) : section.layoutStyle === 'fire_sale_marquee' ? (
            <div className="py-1 px-2 rounded-lg bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white font-black text-[9px] text-center overflow-hidden shadow-md">
              🔥 {headline} 🔥 เหลือ {stockLeft} ชิ้นสุดท้าย 🔥
            </div>
          ) : section.layoutStyle === 'vip_exclusive_timer' ? (
            <div className="p-2.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-[10px] flex items-center justify-between shadow-md">
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-amber-400" /> {headline}</span>
              <span className="font-mono font-bold text-amber-300">{minutes}:00</span>
            </div>
          ) : (
            /* 1. urgent_flame_ticker default */
            <div style={{ backgroundColor: d.color || theme }} className="py-1.5 px-3 rounded-xl text-white font-black text-[10px] flex items-center justify-between shadow-md">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
                {headline}
              </span>
              <span className="font-mono bg-black/40 px-1.5 py-0.5 rounded">{minutes}:00 นาที</span>
            </div>
          )}
        </>
      )}

      {/* 3. HERO (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'hero' && (
        <>
          {section.layoutStyle === 'scroll_float_animated' ? (
            <div className="space-y-2.5 text-center pt-1">
              <ScrollFloat containerClassName="text-center font-black text-sm leading-snug break-words" textClassName="font-black">
                {headline}
              </ScrollFloat>
              <p className="text-[10px] opacity-80 font-light leading-relaxed">{subheadline}</p>
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-black aspect-video mt-2 shadow-lg group">
                <img src={heroImage} alt="Hero" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[8px] font-bold text-center">
                <span style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30` }} className="rounded-xl p-1.5 border backdrop-blur-md">{badge1}</span>
                <span style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30` }} className="rounded-xl p-1.5 border backdrop-blur-md">{badge2}</span>
                <span style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30` }} className="rounded-xl p-1.5 border backdrop-blur-md">{badge3}</span>
              </div>
              {d.cta_text && (
                <a href={ctaUrl} style={{ backgroundColor: theme }} className="inline-block px-5 py-2 rounded-xl text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition mt-1">
                  {d.cta_text}
                </a>
              )}
            </div>
          ) : section.layoutStyle === 'split_50_50_card' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2.5 ${cardCls}`}>
              <div className="grid grid-cols-2 gap-2 items-center">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">HOT PRODUCT</span>
                  <h3 className="font-black text-xs leading-snug">{headline}</h3>
                </div>
                <div className="rounded-xl overflow-hidden aspect-square border border-white/15 bg-black shadow-md">
                  <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-[9px] opacity-75 font-light">{subheadline}</p>
              {d.cta_text && (
                <a href={ctaUrl} style={{ backgroundColor: theme }} className="block text-center py-2 rounded-xl text-white font-black text-xs shadow-md hover:scale-[1.02] active:scale-95 transition">
                  {d.cta_text}
                </a>
              )}
            </div>
          ) : section.layoutStyle === 'video_cinema_player' ? (
            <div className="space-y-2">
              <div className="rounded-2xl overflow-hidden aspect-video bg-black border border-white/20 relative shadow-xl">
                {videoUrl ? (
                  <iframe src={videoUrl} className="w-full h-full" allowFullScreen />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-500">
                    <Film className="w-8 h-8 text-purple-400 animate-pulse" />
                    <span className="text-[9px]">วิดีโอโปรโมทสินค้า 16:9 Cinema</span>
                  </div>
                )}
              </div>
              <div className="text-center space-y-1">
                <div className="text-amber-400 text-[10px] font-bold">★★★★★ 4.9/5 (รีวิวผู้ใช้งานจริง)</div>
                <h3 className="font-black text-xs">{headline}</h3>
                <p className="text-[10px] opacity-75">{subheadline}</p>
              </div>
            </div>
          ) : section.layoutStyle === 'editorial_magazine_cover' ? (
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-black border border-white/15 shadow-2xl flex flex-col justify-end p-4 text-white">
              <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1.5 text-center">
                <span className="text-[9px] font-mono tracking-widest uppercase text-amber-300">PREMIUM EDITION</span>
                <h2 className="text-sm font-black leading-tight drop-shadow-md">{headline}</h2>
                <p className="text-[9px] opacity-80 line-clamp-2">{subheadline}</p>
                {d.cta_text && (
                  <a href={ctaUrl} style={{ backgroundColor: theme }} className="inline-block px-4 py-1.5 rounded-xl text-white font-black text-[11px] shadow-lg mt-1 hover:scale-105 active:scale-95 transition">
                    {d.cta_text}
                  </a>
                )}
              </div>
            </div>
          ) : section.layoutStyle === 'badge_highlight_focus' ? (
            <div className={`p-3 rounded-2xl border text-center space-y-2 ${cardCls}`}>
              <div className="w-9 h-9 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md animate-pulse" style={{ backgroundColor: theme }}>
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xs font-black">{headline}</h2>
              <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-md">
                <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : section.layoutStyle === 'side_by_side_benefits' ? (
            <div className={`p-3 rounded-2xl border space-y-2 ${cardCls}`}>
              <h2 className="text-xs font-black">{headline}</h2>
              <div className="grid grid-cols-2 gap-2 items-center">
                <div className="rounded-xl overflow-hidden aspect-square bg-black">
                  <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-[9px]">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold"><Check className="w-3 h-3" /> {badge1}</div>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold"><Check className="w-3 h-3" /> {badge2}</div>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold"><Check className="w-3 h-3" /> {badge3}</div>
                </div>
              </div>
            </div>
          ) : section.layoutStyle === 'voucher_hero_banner' ? (
            <div className="p-3 rounded-2xl bg-gradient-to-b from-purple-950 to-black border border-purple-500/40 text-center space-y-2">
              <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">FLASH VOUCHER -50%</span>
              <h2 className="text-xs font-black">{headline}</h2>
              <div className="rounded-xl overflow-hidden aspect-video bg-black">
                <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : section.layoutStyle === 'minimal_clean_hero' ? (
            <div className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 text-center space-y-2 shadow-sm">
              <h2 className="text-xs font-black">{headline}</h2>
              <p className="text-[10px] text-slate-600">{subheadline}</p>
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-100">
                <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : section.layoutStyle === 'dark_luxury_obsidian' ? (
            <div className="p-4 rounded-3xl bg-slate-950 border border-amber-500/30 text-center space-y-2 shadow-2xl">
              <span className="text-[9px] font-mono tracking-widest text-amber-300">OBSIDIAN LUXURY</span>
              <h2 className="text-xs font-black text-amber-100">{headline}</h2>
              <div className="rounded-2xl overflow-hidden aspect-video bg-black border border-amber-500/20">
                <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            /* 1. centered_media_spotlight default */
            <div className="space-y-2 text-center pt-1">
              <h2 className="font-black text-sm leading-snug break-words">{headline}</h2>
              <p className="text-[10px] opacity-80 font-light leading-relaxed">{subheadline}</p>
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-black aspect-video mt-2 shadow-md">
                <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[8px] font-bold text-center">
                <span style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30` }} className="rounded-lg p-1 border">{badge1}</span>
                <span style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30` }} className="rounded-lg p-1 border">{badge2}</span>
                <span style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30` }} className="rounded-lg p-1 border">{badge3}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* 4. PRICING (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'pricing' && (
        <>
          {section.layoutStyle === '3_tier_comparison_cards' ? (
            <div className="space-y-2">
              <span className="text-[10px] font-bold block opacity-80 text-center">{badgeText}</span>
              <div className="space-y-1.5">
                {tiers.map((tier: any, tIdx: number) => {
                  const isSelectedTier = selectedTierIndex === tIdx
                  return (
                    <div
                      key={tIdx}
                      onClick={() => isInteractive && setSelectedTierIndex && setSelectedTierIndex(tIdx)}
                      style={{
                        borderColor: isSelectedTier ? theme : undefined,
                        backgroundColor: isSelectedTier ? `${theme}20` : undefined
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${cardCls} ${isSelectedTier ? 'ring-2 ring-purple-500/30 shadow-lg' : ''}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{
                            borderColor: isSelectedTier ? theme : '#64748B',
                            backgroundColor: isSelectedTier ? theme : 'transparent'
                          }}
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-white text-[9px] font-bold transition-colors"
                        >
                          {isSelectedTier && '✓'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs">{tier.name}</span>
                            {tier.isPopular && (
                              <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                                ขายดี
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] opacity-70">{tier.note}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-black text-xs" style={{ color: theme }}>
                          ฿{tier.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : section.layoutStyle === 'split_ticket_discount' ? (
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-black/80 to-black/90 p-3 flex items-center justify-between gap-3 shadow-md hover:scale-[1.01] transition">
              <div className="text-center border-r border-dashed border-amber-500/30 pr-3">
                <span className="text-xl font-black font-mono text-amber-400">-50%</span>
                <span className="text-[8px] block text-amber-200">คูปองลดพิเศษ</span>
              </div>
              <div className="flex-1 space-y-0.5">
                <span className="font-bold text-[11px] text-white">{badgeText}</span>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-lg font-black text-emerald-400">฿{offerPrice.toLocaleString()}</span>
                  <span className="text-[10px] opacity-50 line-through">฿{originalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : section.layoutStyle === 'minimal_price_tag' ? (
            <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
              <span className="font-bold opacity-80">{badgeText}</span>
              <div className="flex items-baseline gap-2 font-mono font-bold">
                <span className="text-lg font-black" style={{ color: theme }}>฿{offerPrice.toLocaleString()}</span>
                <span className="text-[10px] opacity-40 line-through">฿{originalPrice.toLocaleString()}</span>
              </div>
            </div>
          ) : section.layoutStyle === 'flash_deal_box' ? (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-1 shadow-md">
              <span className="text-[9px] font-bold text-rose-300">⚡ ประหยัดทันที ฿{(originalPrice - offerPrice).toLocaleString()}</span>
              <div className="text-2xl font-black font-mono text-rose-400">฿{offerPrice.toLocaleString()}</div>
            </div>
          ) : section.layoutStyle === 'free_gift_bundle' ? (
            <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">{badgeText}</span>
                <span className="text-sm font-black font-mono text-purple-300">฿{offerPrice.toLocaleString()}</span>
              </div>
              <div className="text-[9px] text-amber-300 flex items-center gap-1"><Gift className="w-3 h-3 animate-bounce" /> แถมฟรี มาส์กหน้า 2 แผ่น + ส่งฟรีด่วน</div>
            </div>
          ) : section.layoutStyle === 'cyber_pricing_terminal' ? (
            <div className="p-3 rounded-xl bg-black border border-cyan-500/40 font-mono text-[10px] space-y-1 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <div className="text-cyan-400 text-[8px]">> PRICING_TERMINAL_V1</div>
              <div className="flex items-baseline justify-between">
                <span>OFFER_PRICE</span>
                <span className="text-lg font-bold text-cyan-300">฿{offerPrice.toLocaleString()}</span>
              </div>
            </div>
          ) : section.layoutStyle === 'dual_tier_combo' ? (
            <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5 hover:border-purple-500 transition">
                <span className="font-bold block">1 ชิ้น</span>
                <span className="font-mono text-xs font-bold" style={{ color: theme }}>฿{offerPrice.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 space-y-0.5 shadow-md">
                <span className="font-bold block text-purple-200">2 ชิ้น (แถมฟรี)</span>
                <span className="font-mono text-xs font-bold text-emerald-400">฿{(offerPrice * 1.8).toFixed(0)}</span>
              </div>
            </div>
          ) : section.layoutStyle === 'gold_luxury_vip' ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/70 to-black border border-amber-500/40 text-center space-y-1 shadow-xl">
              <span className="text-[8px] font-mono tracking-widest text-amber-400">👑 {badgeText}</span>
              <div className="text-2xl font-black font-mono text-amber-200">฿{offerPrice.toLocaleString()}</div>
            </div>
          ) : section.layoutStyle === 'compact_one_tap_price' ? (
            <div className="py-2 px-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-[11px]">
              <span className="font-bold">{badgeText}</span>
              <span className="font-mono font-black" style={{ color: theme }}>฿{offerPrice.toLocaleString()}</span>
            </div>
          ) : (
            /* 1. luxury_gradient_card default */
            <div style={{ borderColor: `${theme}50` }} className={`p-3.5 rounded-2xl border text-center space-y-1.5 shadow-md ${cardCls}`}>
              <span style={{ color: theme, backgroundColor: `${theme}20`, borderColor: `${theme}40` }} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block">
                {badgeText}
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl font-black font-mono" style={{ color: theme }}>฿{offerPrice.toLocaleString()}</span>
                <span className="text-xs opacity-50 line-through font-mono">฿{originalPrice.toLocaleString()}</span>
              </div>
              <div className="text-left space-y-1 pt-1 border-t border-white/10 text-[10px]">
                {features.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: theme }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 5. PHOTO GALLERY (10 COMPLETE HIGH-DEFINITION ANIMATED STYLES) */}
      {section.type === 'gallery' && (
        <>
          {section.layoutStyle === 'featured_hero_thumbnails' ? (
            /* 1. FEATURED HERO + CLICKABLE THUMBNAILS */
            <div className="space-y-2">
              <span className="text-[10px] font-bold block opacity-80">{d.headline || 'แกลเลอรีรูปภาพสินค้า'}</span>
              <div className="rounded-2xl overflow-hidden aspect-video bg-black border border-white/20 shadow-lg relative group">
                <img
                  src={previewActiveGalleryImg || galleryImages[0]}
                  alt="Featured"
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] text-white font-mono">
                  HD Media
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {galleryImages.map((img: string, i: number) => {
                  const isActive = (previewActiveGalleryImg || galleryImages[0]) === img
                  return (
                    <div
                      key={i}
                      onClick={() => isInteractive && setPreviewActiveGalleryImg && setPreviewActiveGalleryImg(img)}
                      style={{ borderColor: isActive ? theme : undefined }}
                      className={`rounded-xl overflow-hidden aspect-square border-2 bg-black cursor-pointer hover:opacity-90 transition-all transform hover:scale-105 ${isActive ? 'ring-2 ring-purple-500/40 scale-105' : 'border-slate-800 opacity-70'}`}
                    >
                      <img src={img} alt={`Thumb ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : section.layoutStyle === 'before_after_split' ? (
            /* 2. BEFORE & AFTER SPLIT COMPARISON */
            <div className={`p-3.5 rounded-2xl border space-y-2.5 shadow-lg ${cardCls}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black" style={{ color: theme }}>ผลลัพธ์ก่อน-หลังใช้จริง (Before & After)</span>
                <span className="text-[8px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">100% Real Results</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-rose-500/50 bg-black shadow-md group">
                  <img src={beforeImg} alt="Before" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/80 backdrop-blur-md text-rose-400 px-2 py-0.5 rounded-lg text-[9px] font-black border border-rose-500/40 shadow-xs">
                    {beforeText}
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-emerald-500/50 bg-black shadow-md group">
                  <img src={afterImg} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded-lg text-[9px] font-black border border-emerald-500/40 shadow-xs">
                    {afterText}
                  </span>
                </div>
              </div>
            </div>
          ) : section.layoutStyle === 'masonry_pinterest' ? (
            /* 3. MASONRY PINTEREST STAGGERED */
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold block opacity-80">{d.headline || 'ภาพบรรยากาศสินค้า (Masonry)'}</span>
              <div className="columns-2 gap-2 space-y-2">
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} className={`rounded-2xl overflow-hidden border border-white/15 bg-black shadow-md hover:scale-[1.02] transition duration-300 ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                    <img src={img} alt="Masonry" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'grid_2cols_large' ? (
            /* 4. 2-COLUMN LARGE DETAIL GRID */
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold block opacity-80">{d.headline || 'ภาพถ่ายรายละเอียดสินค้า'}</span>
              <div className="grid grid-cols-2 gap-2">
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} className="rounded-2xl overflow-hidden aspect-square border border-white/15 bg-black shadow-lg group hover:scale-[1.02] transition duration-300">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'horizontal_carousel_strip' ? (
            /* 5. HORIZONTAL SWIPE STRIP */
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold opacity-80">{d.headline || 'เลื่อนดูอัลบั้มภาพ ➔'}</span>
                <span className="text-[8px] text-purple-400 font-bold">Swipe Feed</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-black shadow-md hover:scale-105 transition duration-300">
                    <img src={img} alt="Strip" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'lightbox_zoom_grid' ? (
            /* 6. LIGHTBOX ZOOMABLE CARDS */
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold block opacity-80">{d.headline || 'แตะเพื่อซูมดูภาพขนาดใหญ่'}</span>
              <div className="grid grid-cols-3 gap-1.5">
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-white/15 bg-black cursor-pointer shadow-sm">
                    <img src={img} alt="Zoom" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'polaroid_stacked_photos' ? (
            /* 7. POLAROID STACKED PHOTOS */
            <div className="space-y-2">
              <span className="text-[10px] font-bold block opacity-80">{d.headline || 'ภาพถ่ายโพลารอยด์รีวิว'}</span>
              <div className="grid grid-cols-2 gap-2.5 p-2.5 bg-white/5 rounded-3xl border border-white/10">
                {galleryImages.slice(0, 2).map((img: string, i: number) => (
                  <div key={i} className={`p-2 pb-4 bg-white text-slate-900 rounded-xl shadow-xl transform ${i === 0 ? '-rotate-2' : 'rotate-2'} hover:rotate-0 transition duration-300`}>
                    <div className="aspect-square bg-slate-100 overflow-hidden mb-1.5 rounded-sm">
                      <img src={img} alt="Polaroid" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] font-bold font-mono text-center block text-slate-700">★ 100% Genuine</span>
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'compact_quad_grid' ? (
            /* 8. COMPACT QUAD COLLAGE */
            <div className="p-2 bg-black/60 rounded-3xl border border-white/15 shadow-xl space-y-1">
              <div className="grid grid-cols-2 gap-1.5">
                {galleryImages.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-square bg-black shadow-sm group">
                    <img src={img} alt="Quad" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'editorial_story_media' ? (
            /* 9. EDITORIAL STORY MEDIA SPREAD */
            <div className="space-y-2">
              <div className="rounded-2xl overflow-hidden aspect-video bg-black border border-white/20 shadow-lg group">
                <img src={galleryImages[0]} alt="Story Main" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {galleryImages.slice(1, 3).map((img: string, i: number) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-square bg-black border border-white/10 shadow-sm group">
                    <img src={img} alt="Story Sub" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 10. MODERN 3-COLUMN SQUARE GRID (DEFAULT) */
            <div className="space-y-2">
              <span className="text-[10px] font-bold block opacity-80">{d.headline || 'แกลเลอรีรูปภาพสินค้า'}</span>
              <div className="grid grid-cols-3 gap-1.5">
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} className="rounded-2xl overflow-hidden aspect-square border border-white/15 bg-black shadow-md group hover:scale-105 transition duration-300">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 6. PAIN POINTS (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'pain_points' && (
        <>
          {section.layoutStyle === 'alert_warning_box' ? (
            <div className="p-3.5 rounded-2xl bg-amber-950/50 border-2 border-amber-500/60 space-y-2 shadow-lg shadow-amber-500/10">
              <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{d.headline || 'คุณกำลังเจอปัญหาเหล่านี้ใช่ไหม?'}</span>
              </span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-amber-100 bg-black/40 p-2 rounded-xl border border-amber-500/20">
                  <span className="text-amber-400 font-black">⚠️</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'strikethrough_checklist' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 shadow-md ${cardCls}`}>
              <span className="text-[11px] font-black opacity-90 block">{d.headline || 'บอกลาปัญหาเดิมๆ'}</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[10px] opacity-80 line-through text-rose-300 bg-rose-950/20 p-2 rounded-xl border border-rose-500/20">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'split_problem_solution' ? (
            <div className="grid grid-cols-1 gap-2">
              <span className="text-[11px] font-black text-rose-300">{d.headline || 'ปัญหาที่สะสมมานาน'}</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-[10px] flex items-center gap-2.5 shadow-sm hover:scale-[1.01] transition">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'quote_frustration_bubble' ? (
            <div className="space-y-2">
              <span className="text-[11px] font-black opacity-90 block">{d.headline || 'เสียงสะท้อนจากลูกค้า'}</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="p-2.5 rounded-2xl bg-black/50 border border-white/15 text-[10px] italic opacity-90 shadow-md">
                  "{p}"
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'dark_cyber_hazard' ? (
            <div className="p-3.5 rounded-2xl bg-black border border-red-500/60 font-mono text-[10px] space-y-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="text-red-400 text-[9px] font-black block">> HAZARD_DETECTED: {d.headline}</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="text-red-200 bg-red-950/30 p-2 rounded-lg border border-red-500/20">[!] {p}</div>
              ))}
            </div>
          ) : section.layoutStyle === 'minimal_red_bullet' ? (
            <div className="space-y-1.5 p-2.5">
              <span className="text-xs font-black">{d.headline}</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'survey_poll_style' ? (
            <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-2 shadow-lg">
              <span className="text-[10px] font-bold text-purple-300">📊 90% ของผู้มีปัญหาผิวเจอสิ่งนี้:</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="text-[10px] bg-black/40 p-2 rounded-xl border border-white/10">{p}</div>
              ))}
            </div>
          ) : section.layoutStyle === 'stop_sign_banner' ? (
            <div className="p-3.5 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-xl animate-pulse">
              <span className="text-xs font-black block">🛑 หยุด! {d.headline}</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="text-[10px] flex items-center gap-2"><span>•</span><span>{p}</span></div>
              ))}
            </div>
          ) : section.layoutStyle === 'badge_warning_shield' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 shadow-md ${cardCls}`}>
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs"><ShieldCheck className="w-4 h-4" /><span>{d.headline}</span></div>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="text-[10px] text-slate-300">❌ {p}</div>
              ))}
            </div>
          ) : (
            /* 1. card_list_cross default */
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-2 shadow-md">
              <span className="text-[11px] font-bold text-rose-300 block">{d.headline || 'คุณกำลังเจอปัญหาเหล่านี้ใช่ไหม?'}</span>
              {painPoints.map((p: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-slate-200 bg-black/30 p-2 rounded-xl">
                  <span className="text-rose-400 font-bold">❌</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 7. BENEFITS (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'benefits' && (
        <>
          {section.layoutStyle === 'timeline_steps' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2.5 shadow-lg ${cardCls}`}>
              <span className="text-xs font-black block" style={{ color: theme }}>{d.headline || 'ไทม์ไลน์พัฒนาการ'}</span>
              <div className="space-y-2">
                {steps.map((st: any, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-[10px] bg-black/40 p-2.5 rounded-2xl border border-white/10 hover:scale-[1.01] transition">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-500/30 text-purple-300 shrink-0 text-[9px] border border-purple-500/30">{st.day}</span>
                    <span className="opacity-90">{st.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === '3_box_feature_grid' ? (
            <div className="space-y-2">
              <span className="text-xs font-black block" style={{ color: theme }}>{d.headline || 'จุดเด่นที่คุณจะได้รับ'}</span>
              <div className="grid grid-cols-1 gap-2">
                {benefits.map((b: string, i: number) => (
                  <div key={i} className={`p-3 rounded-2xl border flex items-center gap-2.5 text-[10px] shadow-sm hover:scale-[1.01] transition ${cardCls}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-md" style={{ backgroundColor: theme }}>{i+1}</div>
                    <span className="font-bold">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'scientific_results_chips' ? (
            <div className="p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/50 space-y-2.5 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs"><Award className="w-4 h-4 text-cyan-400" /><span>{d.headline || 'ผลการทดสอบทางวิทยาศาสตร์'}</span></div>
              {benefits.map((b: string, i: number) => (
                <div key={i} className="text-[10px] text-cyan-100 flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-cyan-500/20"><BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" /><span>{b}</span></div>
              ))}
            </div>
          ) : section.layoutStyle === 'split_hero_checklist' ? (
            <div className="grid grid-cols-2 gap-2">
              {benefits.map((b: string, i: number) => (
                <div key={i} className={`p-2.5 rounded-2xl border text-[9px] font-bold shadow-sm ${cardCls}`}><CheckCircle2 className="w-4 h-4 mb-1" style={{ color: theme }} />{b}</div>
              ))}
            </div>
          ) : section.layoutStyle === 'gold_crown_benefits' ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/70 to-black border border-amber-500/50 space-y-2 shadow-xl">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs"><Crown className="w-4 h-4" /><span>{d.headline || 'สิทธิประโยชน์ระดับ VIP'}</span></div>
              {benefits.map((b: string, i: number) => (
                <div key={i} className="text-[10px] text-amber-100 flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-amber-500/20"><span>👑</span><span>{b}</span></div>
              ))}
            </div>
          ) : section.layoutStyle === 'minimal_check_modern' ? (
            <div className="p-3.5 bg-white text-slate-900 rounded-2xl border border-slate-200 space-y-2 shadow-md">
              <span className="text-xs font-black block">{d.headline || 'ผลลัพธ์ที่จะได้รับ'}</span>
              {benefits.map((b: string, i: number) => (
                <div key={i} className="text-[10px] flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 font-black" /><span>{b}</span></div>
              ))}
            </div>
          ) : section.layoutStyle === 'accordion_benefit_cards' ? (
            <div className="space-y-2">
              {benefits.map((b: string, i: number) => (
                <div key={i} className={`p-2.5 rounded-xl border text-[10px] shadow-sm ${cardCls}`}><span className="font-bold block text-purple-300">ผลลัพธ์ที่ {i+1}</span>{b}</div>
              ))}
            </div>
          ) : section.layoutStyle === 'guarantee_backed_points' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 shadow-md ${cardCls}`}>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs"><HeartHandshake className="w-4 h-4" /><span>ผ่านการรับรองโดยแพทย์</span></div>
              {benefits.map((b: string, i: number) => (
                <div key={i} className="text-[10px] flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>{b}</span></div>
              ))}
            </div>
          ) : section.layoutStyle === 'badge_ribbon_grid' ? (
            <div className="space-y-2">
              {benefits.map((b: string, i: number) => (
                <div key={i} className="p-2.5 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-[10px] flex items-center gap-2 shadow-sm"><Award className="w-4 h-4 text-amber-300 shrink-0" /><span>{b}</span></div>
              ))}
            </div>
          ) : (
            /* 1. emerald_glowing_cards default */
            <div style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30` }} className="p-3.5 rounded-2xl border space-y-2 shadow-md">
              <span className="text-xs font-bold block" style={{ color: theme }}>{d.headline || 'สิ่งที่คุณจะได้รับ:'}</span>
              {benefits.map((b: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[10px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme }} />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 8. REVIEWS (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'reviews' && (
        <>
          {section.layoutStyle === 'chat_bubble_screenshots' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2.5 shadow-xl ${cardCls}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-xs font-bold opacity-90">บทสนทนาสั่งซื้อจริงจากลูกค้า</span>
                <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">● LINE Chat</span>
              </div>
              <div className="space-y-2">
                {chatReviews.map((chat: any, cIdx: number) => (
                  <div key={cIdx} className={`flex ${chat.sender === 'ลูกค้า' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-2.5 rounded-2xl max-w-[82%] text-[10px] shadow-md ${chat.sender === 'ลูกค้า' ? 'bg-slate-800 text-white rounded-tl-xs' : 'bg-emerald-600 text-white rounded-tr-xs'}`}>
                      <span className="text-[8px] opacity-70 block font-bold mb-0.5">{chat.sender}</span>
                      <p className="leading-relaxed">{chat.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'photo_review_wall' ? (
            <div className="space-y-2">
              <span className="text-xs font-bold block opacity-90">รูปภาพรีวิวจากผู้ใช้จริง</span>
              <div className="grid grid-cols-2 gap-2">
                {reviews.map((r: any, i: number) => (
                  <div key={i} className={`p-2.5 rounded-2xl border text-[9px] space-y-1.5 shadow-md ${cardCls}`}>
                    <div className="text-amber-400 font-bold">★★★★★</div>
                    <p className="line-clamp-2 leading-relaxed">"{r.comment}"</p>
                    <span className="text-slate-400 font-bold block text-[8px]">- {r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : section.layoutStyle === 'video_testimonial_chips' ? (
            <div className="space-y-2">
              {reviews.map((r: any, i: number) => (
                <div key={i} className={`p-3 rounded-2xl border flex items-center justify-between text-[10px] shadow-sm hover:scale-[1.01] transition ${cardCls}`}>
                  <div><span className="font-bold block">{r.name}</span><p className="opacity-75 italic">"{r.comment}"</p></div>
                  <Film className="w-5 h-5 text-purple-400 shrink-0 animate-pulse" />
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'single_spotlight_quote' ? (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950 to-black border border-purple-500/50 text-center space-y-1.5 shadow-xl">
              <div className="text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs italic text-white font-medium leading-relaxed">"{reviews[0]?.comment}"</p>
              <span className="text-[10px] text-purple-300 font-bold block">{reviews[0]?.name} (ผู้ซื้อจริง)</span>
            </div>
          ) : section.layoutStyle === 'stats_review_summary' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 shadow-md ${cardCls}`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-400 font-mono">{d.rating || 4.9}/5</span>
                <span className="text-[10px] opacity-80">{d.review_count || '1,420+ รีวิว'}</span>
              </div>
              <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden"><div className="bg-amber-400 h-full w-[95%]" /></div>
            </div>
          ) : section.layoutStyle === 'compact_review_ticker' ? (
            <div className="py-2 px-3 rounded-xl bg-black/90 border border-white/15 text-[10px] truncate shadow-md">
              🌟 {reviews[0]?.name}: "{reviews[0]?.comment}"
            </div>
          ) : section.layoutStyle === 'verified_buyer_grid' ? (
            <div className="grid grid-cols-2 gap-2">
              {reviews.map((r: any, i: number) => (
                <div key={i} className="p-2.5 rounded-2xl bg-black/50 border border-white/10 text-[9px] space-y-1 shadow-sm">
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> {r.name}</span>
                  <p className="opacity-80">"{r.comment}"</p>
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'before_after_review_cards' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 shadow-md ${cardCls}`}>
              <span className="text-xs font-bold text-emerald-400 block">ผลตอบรับก่อน-หลังใช้</span>
              <p className="text-[10px] italic opacity-90">"{reviews[0]?.comment}"</p>
              <span className="text-[9px] opacity-60 block">- {reviews[0]?.name}</span>
            </div>
          ) : section.layoutStyle === 'trustpilot_style_cards' ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 space-y-1.5 shadow-lg">
              <span className="text-[10px] font-bold text-emerald-300 block">✓ VERIFIED TRUSTPILOT REVIEW</span>
              <p className="text-[10px] text-white">"{reviews[0]?.comment}"</p>
            </div>
          ) : (
            /* 1. rating_cards_5star default */
            <div className={`p-3.5 rounded-2xl space-y-2.5 shadow-md ${cardCls}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">★★★★★ {d.rating || 5.0}/5</span>
                <span className="text-[9px] opacity-60">เสียงตอบรับจริง</span>
              </div>
              {reviews.map((r: any, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-black/40 text-[10px] space-y-0.5 shadow-xs">
                  <span className="font-bold block">{r.name}</span>
                  <p className="opacity-80 font-light italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 9. FAQ (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'faq' && (
        <>
          {section.layoutStyle === '2_column_faq_grid' ? (
            <div className="grid grid-cols-1 gap-2">
              <span className="text-xs font-bold block opacity-90">คำถามที่พบบ่อย (FAQ Grid)</span>
              {faqs.map((f: any, i: number) => (
                <div key={i} className={`p-3 rounded-2xl border text-[10px] space-y-1.5 shadow-sm ${cardCls}`}><span className="font-bold block text-purple-300">Q: {f.q}</span><p className="opacity-80">A: {f.a}</p></div>
              ))}
            </div>
          ) : section.layoutStyle === 'chat_qa_bubbles' ? (
            <div className="space-y-2">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="space-y-1 text-[10px]">
                  <div className="bg-slate-800 p-2.5 rounded-2xl text-white w-fit max-w-[85%] font-bold shadow-sm">ถาม: {f.q}</div>
                  <div className="bg-purple-900/70 p-2.5 rounded-2xl text-purple-100 ml-auto w-fit max-w-[85%] shadow-sm">ตอบ: {f.a}</div>
                </div>
              ))}
            </div>
          ) : section.layoutStyle === 'numbered_faq_list' ? (
            <div className="space-y-2">
              {faqs.map((f: any, i: number) => (
                <div key={i} className={`p-3 rounded-2xl border text-[10px] shadow-sm ${cardCls}`}><span className="font-bold block text-amber-300">ข้อที่ {i+1}. {f.q}</span><p className="opacity-80 mt-1">{f.a}</p></div>
              ))}
            </div>
          ) : section.layoutStyle === 'bordered_minimal_faq' ? (
            <div className="divide-y divide-white/10 text-[10px] py-1">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="py-2.5"><span className="font-bold block">{f.q}</span><p className="opacity-75 mt-1">{f.a}</p></div>
              ))}
            </div>
          ) : section.layoutStyle === 'glowing_neon_faq' ? (
            <div className="space-y-2">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="p-3 rounded-2xl bg-black border border-cyan-500/50 text-[10px] shadow-[0_0_10px_rgba(6,182,212,0.15)]"><span className="font-bold text-cyan-300 block">{f.q}</span><p className="opacity-80 text-cyan-100 mt-1">{f.a}</p></div>
              ))}
            </div>
          ) : section.layoutStyle === 'searchable_faq_box' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2.5 shadow-md ${cardCls}`}>
              <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-[10px] opacity-70">🔍 ค้นหาคำถาม...</div>
              {faqs.map((f: any, i: number) => (
                <div key={i} className="text-[10px]"><span className="font-bold block">{f.q}</span><p className="opacity-75">{f.a}</p></div>
              ))}
            </div>
          ) : section.layoutStyle === 'pill_toggle_faq' ? (
            <div className="space-y-1.5">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="p-2.5 rounded-full bg-white/10 border border-white/15 text-[10px] px-4 shadow-sm"><span className="font-bold block">{f.q}</span><p className="opacity-75 text-[9px] mt-0.5">{f.a}</p></div>
              ))}
            </div>
          ) : section.layoutStyle === 'badge_icon_faq' ? (
            <div className="space-y-2">
              {faqs.map((f: any, i: number) => (
                <div key={i} className={`p-3 rounded-2xl border flex items-start gap-2.5 text-[10px] shadow-sm ${cardCls}`}><HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /><div><span className="font-bold block">{f.q}</span><p className="opacity-75 mt-0.5">{f.a}</p></div></div>
              ))}
            </div>
          ) : section.layoutStyle === 'compact_summary_faq' ? (
            <div className="p-3 rounded-2xl bg-black/70 border border-white/10 text-[10px] space-y-1.5 shadow-md">
              {faqs.map((f: any, i: number) => (
                <div key={i}><span className="font-bold">• {f.q}</span><p className="opacity-70 text-[9px] ml-2.5">{f.a}</p></div>
              ))}
            </div>
          ) : (
            /* 1. accordion_clean default */
            <div className="space-y-2">
              <span className="text-xs font-bold block opacity-90">คำถามที่พบบ่อย (FAQ)</span>
              {faqs.map((f: any, i: number) => (
                <div key={i} className={`rounded-2xl overflow-hidden text-[10px] shadow-sm ${cardCls}`}>
                  <button type="button" onClick={() => isInteractive && setPreviewFaqOpen && setPreviewFaqOpen(previewFaqOpen === i ? null : i)} className="w-full p-3 text-left font-bold flex items-center justify-between cursor-pointer">
                    <span>{f.q}</span>
                    {previewFaqOpen === i ? <ChevronUp className="w-4 h-4" style={{ color: theme }} /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                  </button>
                  {previewFaqOpen === i && <div className="p-3 pt-0 opacity-80 font-light border-t border-white/5 leading-relaxed">{f.a}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 10. CHECKOUT & PROMPTPAY (PROMPTPAY QR PRESENT IN ALL 10 UI STYLES - 100% REAL WORKING) */}
            {/* 10. CHECKOUT (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'checkout' && (
        <>
          {section.layoutStyle === 'standalone_promptpay_qr_card' ? (
            <form onSubmit={onOrderSubmit || ((e) => e.preventDefault())} id="checkout" className={`p-4 sm:p-5 rounded-3xl border space-y-3 shadow-xl max-w-md mx-auto ${cardCls}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-bold text-xs">📱 ชำระเงินผ่าน PromptPay QR ยอดตรง</span>
                <span className="font-mono font-black text-sm" style={{ color: theme }}>฿{previewTotal.toLocaleString()}</span>
              </div>
              <RenderPromptPayQRBox size="w-36 h-36" />
              <RenderSlipUploadBox />
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-bold text-slate-300 block mb-2 text-center">ข้อมูลสำหรับจัดส่งสินค้า:</span>
                <RenderCustomerInputs />
              </div>
              <div className="w-full max-w-sm mx-auto pt-2">
                <button type="submit" disabled={ordering} style={{ backgroundColor: theme }} className="w-full py-3 rounded-2xl text-white font-black text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5">
                  {ordering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{ordering ? 'กำลังส่งข้อมูล...' : `แจ้งโอนเงิน & ยืนยันออเดอร์ (฿${previewTotal.toLocaleString()})`}</span>
                </button>
              </div>
            </form>
          ) : section.layoutStyle === 'cod_express_fast_form' || section.layoutStyle === 'cod_express_fast_checkout' ? (
            /* 2. COD EXPRESS FAST CHECKOUT (WITH PROMPTPAY QR OPTION) */
            <form onSubmit={onOrderSubmit || ((e) => e.preventDefault())} id="checkout" className={`p-4 sm:p-5 rounded-3xl border space-y-3 shadow-xl bg-gradient-to-b from-emerald-950/50 to-black/95 max-w-md mx-auto ${cardCls}`}>
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
                  <Truck className="w-5 h-5 animate-bounce" />
                  <span>สั่งซื้อด่วน & ชำระเงิน</span>
                </div>
                <span className="font-mono font-black text-sm text-white">฿{previewTotal.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                <button type="button" onClick={() => { if (setOrderForm) setOrderForm((prev: any) => ({ ...prev, payment_method: 'promptpay' })); if (setPreviewPaymentMethod) setPreviewPaymentMethod('promptpay') }} className={`p-2.5 rounded-xl text-center border font-bold text-xs cursor-pointer transition ${currentPayMethod === 'promptpay' ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 ring-2 ring-emerald-500/20' : 'border-white/10 bg-black/40 text-slate-400'}`}>📱 พร้อมเพย์ QR</button>
                <button type="button" onClick={() => { if (setOrderForm) setOrderForm((prev: any) => ({ ...prev, payment_method: 'cod' })); if (setPreviewPaymentMethod) setPreviewPaymentMethod('cod') }} className={`p-2.5 rounded-xl text-center border font-bold text-xs cursor-pointer transition ${currentPayMethod === 'cod' ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 ring-2 ring-emerald-500/20' : 'border-white/10 bg-black/40 text-slate-400'}`}>🚚 เก็บเงินปลายทาง (COD)</button>
              </div>
              {currentPayMethod === 'promptpay' ? (
                <>
                  <RenderPromptPayQRBox size="w-36 h-36" />
                  <RenderSlipUploadBox />
                </>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1 max-w-sm mx-auto">
                  <span className="text-xs font-bold text-emerald-400 block">🚚 มีบริการเก็บเงินปลายทาง (COD)</span>
                  <p className="text-[10px] text-slate-300">ชำระเงินกับพนักงานจัดส่งเมื่อสินค้าถึงหน้าบ้านคุณ</p>
                </div>
              )}
              <RenderCustomerInputs />
              <div className="w-full max-w-sm mx-auto pt-2">
                <button type="submit" disabled={ordering} className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5">
                  {ordering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  <span>{ordering ? 'กำลังส่งข้อมูล...' : `ยืนยันสั่งซื้อสินค้า (฿${previewTotal.toLocaleString()})`}</span>
                </button>
              </div>
            </form>
          ) : section.layoutStyle === 'vip_luxury_gold_checkout' || section.layoutStyle === 'vip_luxury_checkout' ? (
            /* 3. VIP LUXURY GOLD CHECKOUT */
            <form onSubmit={onOrderSubmit || ((e) => e.preventDefault())} id="checkout" className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-950 to-black border-2 border-amber-500/60 space-y-3 shadow-2xl text-center max-w-md mx-auto">
              <div className="space-y-0.5 border-b border-amber-500/30 pb-2.5">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 flex items-center justify-center gap-1"><Crown className="w-3.5 h-3.5" /> VIP LUXURY CHECKOUT</span>
                <div className="text-xl font-black font-mono text-amber-200">฿{previewTotal.toLocaleString()} บาท</div>
              </div>
              <RenderPromptPayQRBox size="w-36 h-36" />
              <RenderSlipUploadBox />
              <RenderCustomerInputs />
              <div className="w-full max-w-sm mx-auto pt-2">
                <button type="submit" disabled={ordering} className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-xl active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5">
                  {ordering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                  <span>{ordering ? 'กำลังส่งข้อมูล...' : `สั่งซื้อด่วนรับสิทธิ์ VIP (฿${previewTotal.toLocaleString()})`}</span>
                </button>
              </div>
            </form>
          ) : (
            /* DYNAMIC PROMPTPAY & COD DUAL CHECKOUT (DEFAULT & DYNAMIC) */
            <form onSubmit={onOrderSubmit || ((e) => e.preventDefault())} id="checkout" className={`p-4 sm:p-5 rounded-3xl space-y-3.5 shadow-xl max-w-md mx-auto ${cardCls}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-bold text-xs">แบบฟอร์มชำระเงิน & สั่งซื้อสินค้า</span>
                <span className="font-mono font-black text-sm" style={{ color: theme }}>ยอดรวม: ฿{previewTotal.toLocaleString()}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10 text-xs max-w-sm mx-auto">
                <span className="font-bold text-slate-300">จำนวนที่ต้องการสั่งซื้อ:</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => isInteractive && setPreviewQty && setPreviewQty(Math.max(1, previewQty - 1))} className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white cursor-pointer active:scale-90 transition hover:bg-slate-700">-</button>
                  <span className="font-mono font-black text-sm px-2" style={{ color: theme }}>{previewQty}</span>
                  <button type="button" onClick={() => isInteractive && setPreviewQty && setPreviewQty(previewQty + 1)} style={{ backgroundColor: theme }} className="w-7 h-7 rounded-xl text-white flex items-center justify-center font-bold cursor-pointer active:scale-90 transition shadow-md hover:opacity-90">+</button>
                </div>
              </div>

              {/* Payment Method Switcher */}
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                <button type="button" onClick={() => { if (setOrderForm) setOrderForm((prev: any) => ({ ...prev, payment_method: 'promptpay' })); if (setPreviewPaymentMethod) setPreviewPaymentMethod('promptpay') }} className={`p-2.5 rounded-2xl text-center border font-bold text-xs cursor-pointer transition ${currentPayMethod === 'promptpay' ? 'border-purple-500 bg-purple-500/25 text-purple-300 ring-2 ring-purple-500/20' : 'border-white/10 bg-black/40 opacity-70 hover:opacity-100'}`}>📱 โอนพร้อมเพย์ QR</button>
                <button type="button" onClick={() => { if (setOrderForm) setOrderForm((prev: any) => ({ ...prev, payment_method: 'cod' })); if (setPreviewPaymentMethod) setPreviewPaymentMethod('cod') }} className={`p-2.5 rounded-2xl text-center border font-bold text-xs cursor-pointer transition ${currentPayMethod === 'cod' ? 'border-purple-500 bg-purple-500/25 text-purple-300 ring-2 ring-purple-500/20' : 'border-white/10 bg-black/40 opacity-70 hover:opacity-100'}`}>🚚 เก็บเงินปลายทาง (COD)</button>
              </div>

              {/* Dynamic QR / COD Box */}
              {currentPayMethod === 'promptpay' ? (
                <>
                  <RenderPromptPayQRBox size="w-36 h-36" />
                  <RenderSlipUploadBox />
                </>
              ) : (
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center space-y-1 max-w-sm mx-auto my-2">
                  <span className="text-xs font-bold text-purple-300 block">🚚 บริการเก็บเงินปลายทาง (COD)</span>
                  <p className="text-[10px] text-slate-300">เตรียมชำระเงินสดหรือโอนกับพนักงานจัดส่งเมื่อสินค้าถึงหน้าบ้านคุณ (฿{previewTotal.toLocaleString()} บาท)</p>
                </div>
              )}

              <RenderCustomerInputs />

              <div className="w-full max-w-sm mx-auto pt-2">
                <button type="submit" disabled={ordering} style={{ backgroundColor: theme }} className="w-full py-3 rounded-2xl text-white font-black text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 hover:opacity-95">
                  {ordering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{ordering ? 'กำลังส่งข้อมูล...' : `ยืนยันสั่งซื้อสินค้า (฿${previewTotal.toLocaleString()})`}</span>
                </button>
              </div>
            </form>
          )}
        </>
      )}
      {/* 11. GUARANTEE (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'guarantee' && (
        <>
          {section.layoutStyle === 'money_back_100' ? (
            <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/50 text-center space-y-1.5 shadow-lg">
              <div className="text-amber-400 font-bold text-[10px] flex items-center justify-center gap-1"><Coins className="w-4 h-4" /> 100% MONEY BACK GUARANTEE</div>
              <p className="text-[9px] text-amber-100">{guaranteeText}</p>
            </div>
          ) : section.layoutStyle === 'seal_stamp' ? (
            <div className="p-3 rounded-full border-2 border-dashed border-purple-400/70 bg-purple-950/40 text-center text-[10px] font-bold text-purple-200 shadow-md">
              ★ {guaranteeText} ★
            </div>
          ) : section.layoutStyle === 'fda_certified_pill' ? (
            <div className="p-2.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-[10px] flex items-center gap-2 shadow-md">
              <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{guaranteeText}</span>
            </div>
          ) : section.layoutStyle === 'cyber_verified_hud' ? (
            <div className="p-2.5 rounded-xl bg-black border border-cyan-500/50 text-[9px] font-mono text-cyan-300 flex items-center justify-between shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <span>[SECURE_SSL_256BIT]</span>
              <span>{guaranteeText}</span>
            </div>
          ) : section.layoutStyle === 'clean_white_shield' ? (
            <div className="p-3.5 bg-white text-slate-900 rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-md">
              <ShieldCheck className="w-6 h-6 mx-auto text-emerald-600" />
              <p className="text-[10px] font-bold">{guaranteeText}</p>
            </div>
          ) : section.layoutStyle === 'split_guarantee_terms' ? (
            <div className="grid grid-cols-3 gap-1.5 text-center text-[8px] font-bold">
              <div className="p-2 rounded-xl bg-black/50 border border-white/10">ของแท้ 100%</div>
              <div className="p-2 rounded-xl bg-black/50 border border-white/10">คืนเงินใน 14 วัน</div>
              <div className="p-2 rounded-xl bg-black/50 border border-white/10">ส่งด่วนปลอดภัย</div>
            </div>
          ) : section.layoutStyle === 'trust_lock_banner' ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/15 text-[10px] flex items-center justify-center gap-2 text-slate-300 shadow-md">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{guaranteeText}</span>
            </div>
          ) : section.layoutStyle === 'doctor_signature_card' ? (
            <div className={`p-3.5 rounded-2xl border text-center space-y-1.5 shadow-md ${cardCls}`}>
              <HeartHandshake className="w-6 h-6 mx-auto text-purple-400" />
              <p className="text-[10px] font-bold">{guaranteeText}</p>
              <span className="text-[8px] opacity-60 font-mono italic">Certified Specialist</span>
            </div>
          ) : section.layoutStyle === 'compact_gold_guarantee' ? (
            <div className="py-2 px-3 rounded-xl bg-amber-500 text-slate-950 font-black text-[9px] text-center flex items-center justify-center gap-1.5 shadow-md">
              <Crown className="w-3.5 h-3.5" /> {guaranteeText}
            </div>
          ) : (
            /* 1. ribbon_badge default */
            <div style={{ backgroundColor: `${theme}15`, borderColor: `${theme}30`, color: theme }} className="p-3 rounded-xl border text-[10px] text-center font-bold flex items-center justify-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{guaranteeText}</span>
            </div>
          )}
        </>
      )}

      {/* 12. STICKY BOTTOM CTA (3 ACTION BUTTONS IN ALL 10 UI STYLES) */}
      {section.type === 'sticky_cta' && (
        <>
          {/* ALL 10 STYLES CONTAIN 3 BUTTONS: 1. ORDER CTA, 2. LINE CHAT, 3. HOTLINE CALL */}
          {section.layoutStyle === 'floating_cta_duo' ? (
            /* Style 2: Floating Pill Dock with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 rounded-2xl bg-black/90 backdrop-blur-md border border-white/15 flex items-center justify-between gap-1 shadow-2xl text-[9px]">
              <div className="font-mono font-black text-xs px-1" style={{ color: theme }}>฿{previewTotal.toLocaleString()}</div>
              <div className="flex items-center gap-1 flex-1 justify-end">
                <a href={btn1Url} style={{ backgroundColor: theme }} className="flex-1 py-1.5 px-2 rounded-xl text-white font-black text-center truncate shadow-sm hover:scale-105 transition">{btn1Text}</a>
                <a href={btn2Url} className="p-1.5 rounded-xl bg-emerald-500 text-white font-bold hover:scale-105 transition" title="LINE Chat"><MessageCircle className="w-3.5 h-3.5" /></a>
                <a href={btn3Url} className="p-1.5 rounded-xl bg-purple-500 text-white font-bold hover:scale-105 transition" title="Call Hotline"><Phone className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          ) : section.layoutStyle === 'full_width_buy_bar' ? (
            /* Style 3: Full Width Bar with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 rounded-2xl bg-black/95 backdrop-blur-md border border-white/15 space-y-1.5 shadow-2xl">
              <a href={btn1Url} style={{ backgroundColor: theme }} className="block w-full py-2 rounded-xl text-white font-black text-xs text-center shadow-md hover:scale-[1.01] transition">
                {btn1Text} (฿{previewTotal.toLocaleString()})
              </a>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <a href={btn2Url} className="py-1 rounded-lg bg-emerald-600 text-white font-bold text-center flex items-center justify-center gap-1"><MessageCircle className="w-3 h-3" /> {btn2Text}</a>
                <a href={btn3Url} className="py-1 rounded-lg bg-purple-600 text-white font-bold text-center flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> {btn3Text}</a>
              </div>
            </div>
          ) : section.layoutStyle === 'pill_floating_glow' ? (
            /* Style 4: Glowing Floating Pill with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 text-center">
              <div className="mx-auto w-fit p-1.5 px-3 rounded-full bg-slate-950/95 border border-white/20 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-1.5 text-[9px]">
                <span className="font-mono font-black text-xs pr-1" style={{ color: theme }}>฿{previewTotal.toLocaleString()}</span>
                <a href={btn1Url} style={{ backgroundColor: theme }} className="px-3 py-1.5 rounded-full text-white font-black hover:scale-105 transition">{btn1Text}</a>
                <a href={btn2Url} className="p-1.5 rounded-full bg-emerald-500 text-white"><MessageCircle className="w-3 h-3" /></a>
                <a href={btn3Url} className="p-1.5 rounded-full bg-purple-500 text-white"><Phone className="w-3 h-3" /></a>
              </div>
            </div>
          ) : section.layoutStyle === 'timer_sticky_bar' ? (
            /* Style 5: Timer Sticky Bar with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 rounded-2xl bg-slate-950 border border-white/15 flex items-center justify-between text-[9px] shadow-2xl gap-1">
              <div className="flex items-center gap-1 text-amber-300 font-mono font-bold shrink-0"><Clock className="w-3 h-3 animate-spin" /> {minutes}:00</div>
              <div className="flex items-center gap-1 flex-1 justify-end">
                <a href={btn1Url} style={{ backgroundColor: theme }} className="px-2.5 py-1.5 rounded-lg text-white font-bold truncate">{btn1Text}</a>
                <a href={btn2Url} className="p-1.5 rounded-lg bg-emerald-600 text-white"><MessageCircle className="w-3 h-3" /></a>
                <a href={btn3Url} className="p-1.5 rounded-lg bg-purple-600 text-white"><Phone className="w-3 h-3" /></a>
              </div>
            </div>
          ) : section.layoutStyle === 'discount_sticky_pill' ? (
            /* Style 6: Discount Sticky Pill with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 rounded-2xl bg-gradient-to-r from-amber-950 to-black border border-amber-500/40 flex items-center justify-between text-[9px] shadow-2xl gap-1">
              <span className="font-bold text-amber-200 shrink-0">โค้ด: {voucherCode}</span>
              <div className="flex items-center gap-1">
                <a href={btn1Url} style={{ backgroundColor: theme }} className="px-2.5 py-1.5 rounded-lg text-white font-bold">{btn1Text}</a>
                <a href={btn2Url} className="p-1.5 rounded-lg bg-emerald-500 text-white"><MessageCircle className="w-3 h-3" /></a>
                <a href={btn3Url} className="p-1.5 rounded-lg bg-purple-500 text-white"><Phone className="w-3 h-3" /></a>
              </div>
            </div>
          ) : section.layoutStyle === 'minimal_clean_dock' ? (
            /* Style 7: Minimal Clean Dock with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 rounded-2xl bg-white text-slate-900 border border-slate-200 flex items-center justify-between text-[10px] shadow-2xl gap-1">
              <span className="font-bold">฿{previewTotal.toLocaleString()}</span>
              <div className="flex items-center gap-1">
                <a href={btn1Url} style={{ backgroundColor: theme }} className="px-2.5 py-1 rounded-lg text-white font-bold text-[9px]">{btn1Text}</a>
                <a href={btn2Url} className="p-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300"><MessageCircle className="w-3.5 h-3.5" /></a>
                <a href={btn3Url} className="p-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-300"><Phone className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          ) : section.layoutStyle === 'compact_icon_trio' ? (
            /* Style 8: Compact Icon Trio with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 rounded-2xl bg-black/95 border border-white/15 flex items-center justify-around shadow-2xl">
              <a href={btn2Url} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-[9px]"><MessageCircle className="w-3.5 h-3.5" /><span>{btn2Text}</span></a>
              <a href={btn1Url} style={{ backgroundColor: theme }} className="flex items-center gap-1 px-4 py-2 rounded-xl text-white font-black text-xs shadow-lg hover:scale-105 transition"><ShoppingBag className="w-4 h-4" /><span>{btn1Text}</span></a>
              <a href={btn3Url} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-400 font-bold text-[9px]"><Phone className="w-3.5 h-3.5" /><span>{btn3Text}</span></a>
            </div>
          ) : section.layoutStyle === 'split_price_button' ? (
            /* Style 9: Split Price Button with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2 rounded-2xl bg-black border border-white/15 flex items-center justify-between text-[10px] shadow-2xl gap-1">
              <div className="space-y-0.5"><span className="text-[8px] opacity-60 block">ยอดรวม</span><span className="font-mono font-black text-xs" style={{ color: theme }}>฿{previewTotal.toLocaleString()}</span></div>
              <div className="flex items-center gap-1">
                <a href={btn1Url} style={{ backgroundColor: theme }} className="px-3 py-1.5 rounded-xl text-white font-black text-[10px]">{btn1Text}</a>
                <a href={btn2Url} className="p-1.5 rounded-xl bg-emerald-600 text-white"><MessageCircle className="w-3 h-3" /></a>
                <a href={btn3Url} className="p-1.5 rounded-xl bg-purple-600 text-white"><Phone className="w-3 h-3" /></a>
              </div>
            </div>
          ) : section.layoutStyle === 'luxury_gold_bottom' ? (
            /* Style 10: Luxury Gold Bottom with 3 Buttons */
            <div className="sticky bottom-0 inset-x-0 p-2.5 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-2 border-amber-500/50 space-y-1.5 shadow-2xl text-center">
              <a href={btn1Url} className="block w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg hover:scale-[1.01] transition">
                👑 {btn1Text} (฿{previewTotal.toLocaleString()})
              </a>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <a href={btn2Url} className="py-1 rounded-lg bg-black/60 text-amber-200 border border-amber-500/30 flex items-center justify-center gap-1"><MessageCircle className="w-3 h-3" /> {btn2Text}</a>
                <a href={btn3Url} className="py-1 rounded-lg bg-black/60 text-amber-200 border border-amber-500/30 flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> {btn3Text}</a>
              </div>
            </div>
          ) : (
            /* 1. floating_cta_trio default */
            <div className="sticky bottom-0 inset-x-0 p-2.5 rounded-2xl bg-black/95 backdrop-blur-md border border-white/15 flex items-center justify-between gap-1.5 shadow-2xl text-[9px]">
              <div className="font-mono font-black text-xs" style={{ color: theme }}>฿{previewTotal.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 flex-1 justify-end">
                <a href={btn1Url} style={{ backgroundColor: theme }} className="px-3 py-2 rounded-xl text-white font-black truncate max-w-[120px] shadow-sm hover:scale-105 transition">{btn1Text}</a>
                <a href={btn2Url} className="px-2.5 py-2 rounded-xl bg-emerald-600 text-white font-bold truncate max-w-[90px] flex items-center gap-1 hover:scale-105 transition"><MessageCircle className="w-3 h-3" /> {btn2Text}</a>
                <a href={btn3Url} className="p-2 rounded-xl bg-purple-600 text-white font-bold hover:scale-105 transition" title="โทรด่วน"><Phone className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          )}
        </>
      )}

      {/* 13. STORY (10 ANIMATED DISTINCT STYLES) */}
      {section.type === 'story' && (
        <>
          {section.layoutStyle === 'quote_founder_card' ? (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/60 to-black border border-purple-500/40 text-center space-y-2 shadow-xl">
              <span className="text-[8px] font-mono tracking-wider text-purple-300">MESSAGE FROM FOUNDER</span>
              <p className="text-[10px] italic text-white leading-relaxed">"{storyBody}"</p>
              <span className="text-[9px] font-bold block text-purple-400">- {founderName}</span>
            </div>
          ) : section.layoutStyle === 'timeline_milestones' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 shadow-md ${cardCls}`}>
              <span className="text-xs font-bold text-purple-300 block">เส้นทางความเป็นมาของแบรนด์</span>
              <p className="text-[10px] leading-relaxed opacity-90">{storyBody}</p>
            </div>
          ) : section.layoutStyle === 'ingredient_spotlight' ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 space-y-2 shadow-lg">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> สารสกัดเกรดพรีเมียม</span>
              <p className="text-[10px] text-emerald-100 leading-relaxed">{storyBody}</p>
            </div>
          ) : section.layoutStyle === 'split_image_text' ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 shadow-md ${cardCls}`}>
              <span className="text-xs font-bold block">{section.title || 'เรื่องราวแบรนด์'}</span>
              <p className="text-[10px] leading-relaxed opacity-80">{storyBody}</p>
            </div>
          ) : section.layoutStyle === 'card_highlights' ? (
            <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-2 shadow-lg">
              <span className="text-xs font-bold text-purple-200">พันธกิจและความตั้งใจ</span>
              <p className="text-[10px] leading-relaxed">{storyBody}</p>
            </div>
          ) : section.layoutStyle === 'laboratory_origin' ? (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="text-[10px] font-mono text-cyan-300">> LAB_FORMULATION_STORY</span>
              <p className="text-[10px] text-cyan-100 leading-relaxed">{storyBody}</p>
            </div>
          ) : section.layoutStyle === 'newspaper_column' ? (
            <div className="p-3.5 bg-slate-50 text-slate-900 rounded-2xl border border-slate-300 space-y-1.5 shadow-md">
              <span className="text-xs font-serif font-black block border-b border-slate-300 pb-1">THE BRAND JOURNAL</span>
              <p className="text-[9px] font-serif leading-relaxed text-slate-700">{storyBody}</p>
            </div>
          ) : section.layoutStyle === 'minimal_clean_story' ? (
            <div className="p-3 space-y-1.5">
              <p className="text-[10px] leading-relaxed opacity-85 font-light">{storyBody}</p>
            </div>
          ) : section.layoutStyle === 'video_founder_story' ? (
            <div className="p-3.5 rounded-2xl bg-black border border-white/20 space-y-2.5 shadow-lg">
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center text-slate-500">
                {d.video_url ? (
                  <iframe src={d.video_url} className="w-full h-full" allowFullScreen />
                ) : (
                  <Film className="w-7 h-7 text-purple-400" />
                )}
              </div>
              <p className="text-[10px] opacity-80">{storyBody}</p>
            </div>
          ) : (
            /* 1. article_box default */
            <div className={`p-3.5 rounded-2xl text-[10px] leading-relaxed shadow-md ${cardCls}`}>
              {storyBody}
            </div>
          )}
        </>
      )}
    </div>
  )
}
