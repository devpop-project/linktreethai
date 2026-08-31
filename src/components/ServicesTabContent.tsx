'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  LayoutTemplate,
  Sparkles,
  Clock,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
  Wand2,
  Star,
  Check,
  X,
  FileText,
  Send,
  Globe,
  Coins,
  Rocket,
  Flame,
  Crown,
  Camera,
  ShoppingBag,
  Link2,
  RefreshCw
} from 'lucide-react'

// Icon resolver helper
export const ICON_MAP: Record<string, any> = {
  LayoutTemplate,
  Sparkles,
  Wand2,
  MessageCircle,
  ShieldCheck,
  Zap,
  Globe,
  Coins,
  Rocket,
  Flame,
  Crown,
  Camera,
  ShoppingBag,
  Link2,
  FileText,
  Star
}

export function getServiceIconComponent(iconName?: string) {
  if (!iconName) return LayoutTemplate
  return ICON_MAP[iconName] || LayoutTemplate
}

export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  description: string
  category: 'salepage' | 'ai' | 'marketing' | 'system'
  iconName?: string
  icon?: any
  iconBg: string
  iconColor: string
  badge: string
  badgeColor: string
  status: 'active' | 'updating'
  features: string[]
  priceText?: string
  actionLabel: string
  actionUrl?: string
  position?: number
  is_active?: boolean
}

export const DEFAULT_FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: 'custom-salepage',
    title: 'Custom Salepage',
    subtitle: 'สร้าง Salepage แบบกำหนดเอง',
    description: 'บริการออกแบบและจัดสร้างหน้าเซลเพจปิดการขายแบบ Custom เฉพาะแบรนด์ของคุณ ดีไซน์ระดับพรีเมียม สไตล์ Mobile-App โหลดเร็วเสี้ยววินาที พร้อมระบบชำระเงิน Dynamic PromptPay, เก็บเงินปลายทาง (COD) และเชื่อมต่อพิกเซลโฆษณาครบวงจร',
    category: 'salepage',
    iconName: 'LayoutTemplate',
    icon: LayoutTemplate,
    iconBg: 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
    iconColor: 'text-white',
    badge: '🔥 ยอดนิยม',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    status: 'active',
    priceText: 'เริ่มต้น 990.- / เซลเพจ',
    actionLabel: 'สั่งทำเซลเพจ / ปรึกษาออกแบบ',
    actionUrl: '/custom-salepage',
    features: [
      'ออกแบบ UI/UX สวยหรู สไตล์ Mobile App เฉพาะเอกลักษณ์แบรนด์คุณ',
      'ระบบคำนวณเงิน + Dynamic PromptPay EMVCo QR ยอดตรง พร้อมแนบสลิป',
      'ฟอร์มสั่งซื้อเก็บเงินปลายทาง (COD) คำนวณค่าจัดส่งอัตโนมัติ',
      'ติดตั้ง Multi-Pixel (Meta CAPI, TikTok, Google, LINE Tag) ครบ 100%',
      'เชื่อมต่อระบบแจ้งเตือนออเดอร์ใหม่และสลิปเข้า LINE OA แบบ Real-time',
      'รองรับ Custom Domain และระบบบันทึกฐานข้อมูลลูกค้า (CRM)',
    ],
  },
  {
    id: 'ai-copy-studio',
    title: 'AI Copywriting Studio',
    subtitle: 'สร้างคอนเทนต์ & สคริปต์วิดีโอ',
    description: 'สตูดิโอปัญญาประดิษฐ์ช่วยเขียนพาดหัว Hook เปิดคลิป สคริปต์สั้นสำหรับ TikTok / Reels / Shorts และแคปชั่นปิดการขาย Facebook สไตล์ Direct Response แม่นยำตรงกลุ่มเป้าหมาย',
    category: 'ai',
    iconName: 'Sparkles',
    icon: Sparkles,
    iconBg: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500',
    iconColor: 'text-slate-950',
    badge: '✨ AI Studio',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    status: 'active',
    priceText: 'ใช้งานฟรีสำหรับสมาชิก',
    actionLabel: 'เปิดใช้งาน AI Studio',
    actionUrl: '/ai-salepage',
    features: [
      'สร้างสคริปต์ TikTok Hook 3 วินาทีแรกหยุดนิ้วคนดู',
      'เขียนแคปชั่น AIDA & PAS สำหรับยิงแอด Facebook',
      'คิดไอเดียโปรโมชั่นและข้อความ Broadcast LINE OA',
      'ปรับแต่งโทนเสียงของแบรนด์ (หรูหรา, อบอุ่น, กระตุ้นการตัดสินใจ)'
    ]
  },
  {
    id: 'line-crm-hub',
    title: 'LINE CRM & Broadcast',
    subtitle: 'เชื่อมโยงระบบ LINE OA อัตโนมัติ',
    description: 'ระบบเชื่อมโยงฐานข้อมูลลูกค้าจาก LinkTreeThai เข้ากับ LINE Official Account อัตโนมัติ สำหรับบรอดแคสต์โปรโมชั่นเฉพาะกลุ่มและสะสมแต้มสมาชิก',
    category: 'system',
    iconName: 'MessageCircle',
    icon: MessageCircle,
    iconBg: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600',
    iconColor: 'text-white',
    badge: '⚡ กำลังอัปเดต',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    status: 'updating',
    actionLabel: 'รับการแจ้งเตือนเมื่อเปิดบริการ',
    actionUrl: 'line',
    features: [
      'Sync รายชื่อลูกค้าและเบอร์โทรเข้า LINE OA Tag อัตโนมัติ',
      'ระบบสะสมแต้มและบัตรสมาชิกดิจิทัลผ่าน LINE',
      'ส่งข้อความแจ้งเตือนสถานะการจัดส่งพัสดุอัตโนมัติ',
    ],
  },
  {
    id: 'custom-domain-pro',
    title: 'White-Label & Domain Pro',
    subtitle: 'เชื่อมต่อชื่อโดเมนส่วนตัว 100%',
    description: 'บริการผูกโดเมนส่วนตัวแบบ Custom Domain (.com, .co.th, .shop) พร้อมใบรับรองความปลอดภัย SSL ฟรีตลอดชีพ และลบลายน้ำทุกจุด 100%',
    category: 'marketing',
    iconName: 'ShieldCheck',
    icon: ShieldCheck,
    iconBg: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500',
    iconColor: 'text-white',
    badge: '💎 พรีเมียม',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    status: 'updating',
    actionLabel: 'รับการแจ้งเตือนเมื่อเปิดบริการ',
    actionUrl: 'line',
    features: [
      'เชื่อมต่อชื่อเว็บไซต์ของคุณได้ 100%',
      'ลบลายน้ำระบบเพื่อภาพลักษณ์แบรนด์ระดับพรีเมียม',
      'ติดตั้ง CDN ระดับ Global เพิ่มความเร็วในการโหลดสูงสุด',
    ],
  },
]

export default function ServicesTabContent() {
  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [servicesCategory, setServicesCategory] = useState<'all' | 'salepage' | 'ai' | 'system' | 'marketing'>('all')
  const [servicesList, setServicesList] = useState<ServiceItem[]>(DEFAULT_FALLBACK_SERVICES)
  const [loadingServices, setLoadingServices] = useState(false)
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null)
  
  // Custom Salepage Order Form State
  const [serviceOrderFormOpen, setServiceOrderFormOpen] = useState(false)
  const [serviceOrderName, setServiceOrderName] = useState('')
  const [serviceOrderContact, setServiceOrderContact] = useState('')
  const [serviceOrderDetails, setServiceOrderDetails] = useState('')
  const [serviceOrderSubmitted, setServiceOrderSubmitted] = useState(false)

  // Notification Subscriptions Map
  const [serviceNotifyMap, setServiceNotifyMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // 1. Fetch site settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSiteSettings(data.settings)
      })
      .catch(() => {})

    // 2. Fetch dynamic services directly from Supabase DB & API
    setLoadingServices(true)
    const loadServices = async () => {
      try {
        const supabase = createClient()
        const { data: dbServices, error: dbErr } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('position', { ascending: true })

        if (!dbErr && dbServices && Array.isArray(dbServices) && dbServices.length > 0) {
          const mapped = dbServices.map((s: any) => {
            let feats: string[] = []
            if (Array.isArray(s.features)) {
              feats = s.features
            } else if (typeof s.features === 'string') {
              try {
                const parsed = JSON.parse(s.features)
                if (Array.isArray(parsed)) feats = parsed
              } catch (e) {
                feats = s.features.split(/[,\n]/).map((x: string) => x.trim()).filter((x: string) => x.length > 0)
              }
            }
            return {
              id: s.id,
              title: s.title || '',
              subtitle: s.subtitle || '',
              description: s.description || '',
              category: s.category || 'salepage',
              iconName: s.icon_name || s.iconName || 'LayoutTemplate',
              icon: getServiceIconComponent(s.icon_name || s.iconName),
              iconBg: s.icon_bg || s.iconBg || 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
              iconColor: s.icon_color || s.iconColor || 'text-white',
              badge: s.badge || '🔥 ยอดนิยม',
              badgeColor: s.badge_color || s.badgeColor || 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
              status: s.status || 'active',
              priceText: s.price_text || s.priceText || '',
              actionLabel: s.action_label || s.actionLabel || 'สั่งทำเซลเพจ',
              actionUrl: s.action_url || s.actionUrl || '/custom-salepage',
              position: s.position !== undefined ? s.position : 1,
              is_active: s.is_active !== false,
              features: feats
            }
          })
          setServicesList(mapped)
          return
        }

        // Fallback to /api/services
        const res = await fetch('/api/services')
        const data = await res.json()
        if (data?.services && Array.isArray(data.services)) {
          const activeOnly = data.services.filter((s: any) => s.is_active !== false)
          const mapped = activeOnly.map((s: any) => ({
            ...s,
            icon: getServiceIconComponent(s.iconName || s.icon_name)
          }))
          setServicesList(mapped)
        }
      } catch (e) {
        console.warn('Failed to load services from DB/API, using defaults:', e)
      } finally {
        setLoadingServices(false)
      }
    }

    loadServices()
  }, [])

  const filtered = servicesCategory === 'all'
    ? servicesList
    : servicesList.filter((s) => s.category === servicesCategory)

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Services Banner Header */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#1E1B4B] via-purple-900 to-indigo-900 text-white shadow-xl border border-purple-500/20">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold border border-white/20 text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>ศูนย์รวมบริการเสริมสไตล์แอปพลิเคชัน (Services Hub)</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
            เลือกบริการเสริมเพื่อยกระดับ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-teal-200 bg-clip-text text-transparent">
              ยอดขายและภาพลักษณ์แบรนด์ของคุณ
            </span>
          </h2>
          <p className="text-xs text-purple-100/80 leading-relaxed font-light max-w-xl">
            แตะที่กล่องสี่เหลี่ยมของแต่ละบริการเพื่อดูรายละเอียด สั่งทำ Custom Salepage แบบกำหนดเอง หรือลงชื่อรับการแจ้งเตือนบริการใหม่
          </p>
        </div>
      </div>

      {/* Category Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { key: 'all', label: 'ทั้งหมด (All)' },
          { key: 'salepage', label: 'Salepage & ดีไซน์' },
          { key: 'ai', label: 'AI & คอนเทนต์' },
          { key: 'system', label: 'ระบบ & CRM' },
          { key: 'marketing', label: 'การตลาด & โดเมน' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setServicesCategory(cat.key as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              servicesCategory === cat.key
                ? 'bg-[#1E1B4B] text-white dark:bg-purple-600 dark:text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* App-Style Square Cards Grid (2 cols on mobile, 3 cols on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {filtered.map((service) => {
          const Icon = service.icon || getServiceIconComponent(service.iconName)
          const isUpdating = service.status === 'updating'

          return (
            <div
              key={service.id}
              onClick={() => {
                setSelectedServiceModal(service)
                setServiceOrderFormOpen(false)
                setServiceOrderSubmitted(false)
              }}
              className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-3xl cursor-pointer transition-all duration-200 select-none ${
                isUpdating
                  ? 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-amber-400/60 active:scale-95'
                  : 'bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-md shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/15 hover:border-purple-500 active:scale-95 ring-1 ring-purple-500/10'
              }`}
            >
              {/* Top Row: Square App Icon + Status Badge */}
              <div className="flex items-start justify-between gap-1.5 mb-3">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${service.iconBg || 'bg-purple-600'} ${service.iconColor || 'text-white'} flex items-center justify-center shadow-md transition-transform group-hover:scale-105 duration-200`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <span className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${service.badgeColor || 'bg-purple-100 text-purple-700 border-purple-200'} whitespace-nowrap shadow-2xs`}>
                  {service.badge}
                </span>
              </div>

              {/* Service Details */}
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                  {service.subtitle}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold">
                {
                  isUpdating ? (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>กำลังพัฒนา</span>
                  </span>
                ) : (
                  <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>พร้อมใช้งาน</span>
                  </span>
                )}
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* LINE Consultation Support Card */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">ต้องการบริการเสริมหรือฟีเจอร์เฉพาะทาง?</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">ติดต่อทีมงาน LinkTreeThai เพื่อปรึกษาความต้องการและประเมินราคาฟรี</p>
          </div>
        </div>
        <Link
          href={siteSettings?.contact_line_url || siteSettings?.line_contact_url || 'https://line.me'}
          target="_blank"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-xs whitespace-nowrap active:scale-95 flex items-center gap-1.5 self-stretch sm:self-auto justify-center cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>แชท LINE OA</span>
        </Link>
      </div>

      {/* Service Detail & Order Modal */}
      {selectedServiceModal && (() => {
        const ModalIcon = selectedServiceModal.icon || getServiceIconComponent(selectedServiceModal.iconName)
        const isCustomSalepageAction = selectedServiceModal.actionUrl === '/custom-salepage' || selectedServiceModal.id === 'custom-salepage'
        const isAiAction = selectedServiceModal.actionUrl === '/ai-salepage' || selectedServiceModal.id === 'ai-copy-studio'

        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-[#131B2A] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${selectedServiceModal.iconBg || 'bg-purple-600'} ${selectedServiceModal.iconColor || 'text-white'} flex items-center justify-center shadow-md shrink-0`}>
                    <ModalIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{selectedServiceModal.title}</h3>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${selectedServiceModal.badgeColor || 'bg-purple-100 text-purple-700 border-purple-200'}`}>
                        {selectedServiceModal.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedServiceModal.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedServiceModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedServiceModal.description}
              </p>

              {/* Price Badge */}
              {selectedServiceModal.priceText && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
                  <span className="text-xs text-purple-700 dark:text-purple-300 font-bold">ประมาณการราคา / เงื่อนไข:</span>
                  <span className="text-xs font-black text-purple-900 dark:text-purple-200">{selectedServiceModal.priceText}</span>
                </div>
              )}

              {/* Feature List */}
              {selectedServiceModal.features && selectedServiceModal.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
                    สิ่งที่คุณจะได้รับในบริการนี้:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedServiceModal.features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 space-y-2.5 border-t border-slate-100 dark:border-slate-800">
                {selectedServiceModal.status === 'active' ? (
                  <div>
                    {isCustomSalepageAction ? (
                      <div className="space-y-2">
                        <Link
                          href="/custom-salepage"
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          เปิดตัวสร้าง Custom Salepage Wizard
                        </Link>
                        
                        <Link
                          href={siteSettings?.contact_line_url || siteSettings?.line_contact_url || 'https://line.me'}
                          target="_blank"
                          className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          ปรึกษาทีมงานผ่าน LINE OA
                        </Link>
                      </div>
                    ) : isAiAction ? (
                      <div className="space-y-2">
                        <Link
                          href="/ai-salepage"
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                        >
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          เปิด AI Copywriting Studio
                        </Link>
                      </div>
                    ) : selectedServiceModal.actionUrl && selectedServiceModal.actionUrl.startsWith('http') ? (
                      <a
                        href={selectedServiceModal.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        {selectedServiceModal.actionLabel || 'เข้าใช้งานบริการ'}
                      </a>
                    ) : (
                      <Link
                        href={siteSettings?.contact_line_url || siteSettings?.line_contact_url || 'https://line.me'}
                        target="_blank"
                        className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {selectedServiceModal.actionLabel || 'ปรึกษาทีมงานผ่าน LINE OA'}
                      </Link>
                    )}
                  </div>
                ) : (
                  <div>
                    {serviceNotifyMap[selectedServiceModal.id] ? (
                      <div className="w-full py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        บันทึกความสนใจแล้ว! เราจะแจ้งเตือนคุณทันทีที่เปิดบริการ
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setServiceNotifyMap((prev) => ({
                            ...prev,
                            [selectedServiceModal.id]: true,
                          }))
                        }}
                        className="w-full py-3 rounded-2xl bg-[#1E1B4B] dark:bg-slate-100 hover:bg-purple-900 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Clock className="w-3 h-3" />
                        {selectedServiceModal.actionLabel || 'รับการแจ้งเตือนเมื่อเปิดบริการ'}
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setSelectedServiceModal(null)}
                  className="w-full py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold transition text-center cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>

            </div>
          </div>
        )
      })()}

    </div>
  )
}
