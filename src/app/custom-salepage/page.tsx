'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import { getPromptPayQRImageUrl, PROMPTPAY_PHONE } from '@/lib/promptpay'
import SalepageSectionRenderer, { PageSection } from '@/components/salepage/SalepageSectionRenderer'
import ImageUploaderBox from '@/components/salepage/ImageUploaderBox'
import LayoutOptionCard from '@/components/salepage/LayoutOptionCard'
import {
  LayoutTemplate,
  Key,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Zap,
  ShieldCheck,
  Palette,
  ShoppingBag,
  Smartphone,
  Coins,
  MessageCircle,
  HelpCircle,
  Star,
  Upload,
  X,
  Flame,
  Clock,
  Truck,
  Copy,
  ExternalLink,
  Lock,
  Settings,
  Code,
  Share2,
  Check,
  Layers,
  Wand2,
  Plus,
  Trash2,
  Monitor,
  Tablet,
  Sliders,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SlidersHorizontal,
  Globe,
  Radio,
  Send,
  FileText,
  AlertCircle,
  Tag,
  CheckSquare,
  Square,
  CreditCard,
  BellRing,
  Sun,
  Moon,
  MoveUp,
  MoveDown,
  CopyPlus,
  EyeOff,
  Image as ImageIcon,
  Grid,
  List,
  Compass,
  FileCode,
  CheckCircle,
  Sliders as SlidersIcon,
  RotateCw,
  FolderOpen,
  Maximize2,
  Phone,
  Film,
  Award,
  BadgeCheck,
  HeartHandshake,
  MessageSquareCheck,
  Boxes,
  Gift,
  FlameKindling,
  Percent,
  Calendar,
  AlertTriangle,
  Heart,
  Crown,
  Activity,
  Megaphone,
  CheckCheck
} from 'lucide-react'


// Strongly Typed Enums for SWC Compiler Stability
export type SalepageCardStyle = 'glass' | 'dark' | 'clean' | 'neon' | 'gold' | 'pastel'
export type SalepageBgMode = 'cover' | 'fixed' | 'contain' | 'repeat'
export type SalepageBgTarget = 'outer' | 'inner'
export type SalepageMobileTab = 'editor' | 'preview'
export type SalepageDevice = 'mobile' | 'tablet' | 'desktop'
export type SalepagePaymentMethod = 'promptpay' | 'cod'

// Preset Color Palettes
const PRESET_PALETTES = [
  { name: '💜 Royal Violet', primary: '#8B5CF6', bg: '#0B0F17', text: '#FFFFFF', card: 'glass' },
  { name: '💎 Neon Cyan', primary: '#06B6D4', bg: '#050B14', text: '#FFFFFF', card: 'neon' },
  { name: '🌿 Emerald Pro', primary: '#10B981', bg: '#061A14', text: '#FFFFFF', card: 'dark' },
  { name: '👑 Luxury Gold', primary: '#F59E0B', bg: '#140E05', text: '#FEF3C7', card: 'gold' },
  { name: '🔥 Sunset Red', primary: '#EF4444', bg: '#180B0F', text: '#FFFFFF', card: 'glass' },
  { name: '🌸 Clean Pastel', primary: '#A78BFA', bg: '#F8FAFC', text: '#1E1B4B', card: 'clean' },
  { name: '🌹 Rose Light', primary: '#F43F5E', bg: '#FFF1F2', text: '#1E1B4B', card: 'clean' },
  { name: '⚡ Cyber Blue', primary: '#3B82F6', bg: '#0F172A', text: '#F8FAFC', card: 'dark' }
]

export default function WixCustomSalepageBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const editSlug = searchParams.get('slug')

  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [originUrl, setOriginUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
    // AI Vision & API Key States
  const [isAiAnalyzeModalOpen, setIsAiAnalyzeModalOpen] = useState(false)
  const [userAiApiKey, setUserAiApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isTestingKey, setIsTestingKey] = useState(false)
  const [keyValidationResult, setKeyValidationResult] = useState<{ valid: boolean; provider?: string; error?: string } | null>(null)
  const [aiProductImage, setAiProductImage] = useState('')
  const [aiProductBase64, setAiProductBase64] = useState('')
  const aiProductBase64Ref = useRef<string>('')
  const [aiProductHint, setAiProductHint] = useState('')
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiAnalyzeStep, setAiAnalyzeStep] = useState('')
  const [aiSuccessMsg, setAiSuccessMsg] = useState('')

  const [uploadingImage, setUploadingImage] = useState(false)

  // Builder States
  const [pageTitle, setPageTitle] = useState('')
  const [pageSlug, setPageSlug] = useState('')
  const [globalThemeColor, setGlobalThemeColor] = useState('#8B5CF6')
  const [globalBgColor, setGlobalBgColor] = useState('#0B0F17')
  const [globalTextColor, setGlobalTextColor] = useState('#FFFFFF')
  const [globalBgImage, setGlobalBgImage] = useState('')
  const [globalCardStyle, setGlobalCardStyle] = useState<SalepageCardStyle>('glass')
  const [globalBgOpacity, setGlobalBgOpacity] = useState<number>(85)
  const [globalBgBlur, setGlobalBgBlur] = useState<number>(0)
  const [globalBgMode, setGlobalBgMode] = useState<SalepageBgMode>('cover')
  const [innerBgImage, setInnerBgImage] = useState<string>('')
  const [innerBgOpacity, setInnerBgOpacity] = useState<number>(85)
  const [innerBgBlur, setInnerBgBlur] = useState<number>(0)
  const [innerBgMode, setInnerBgMode] = useState<SalepageBgMode>('cover')
  const [bgTargetTab, setBgTargetTab] = useState<SalepageBgTarget>('outer')
  const [globalBgOverlayColor, setGlobalBgOverlayColor] = useState<string>('#000000')
  

  // Marketing & APIs
  const [fbPixelId, setFbPixelId] = useState('')
  const [tiktokPixelId, setTiktokPixelId] = useState('')
  const [googlePixelId, setGooglePixelId] = useState('')
  const [lineTagId, setLineTagId] = useState('')
  const [lineChannelToken, setLineChannelToken] = useState('')
  const [lineUserId, setLineUserId] = useState('')
  const [lineNotifyToken, setLineNotifyToken] = useState('')

  // Section List
  const [sections, setSections] = useState<PageSection[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false)
  const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] = useState(false)
  const [successSavedData, setSuccessSavedData] = useState<{ points: number; slots: number; slug: string } | null>(null)
  const [saveSuccessModalData, setSaveSuccessModalData] = useState<{ slug: string; remainingPoints: number; totalSlots: number } | null>(null)
  const [saveSuccessData, setSaveSuccessData] = useState<{ slug: string; deducted: number; remaining: number; totalSlots: number } | null>(null)
  const [confirmingPoints, setConfirmingPoints] = useState<number>(0)
  const [confirmingSlots, setConfirmingSlots] = useState<number>(0)
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false)
  const [isAiAuditModalOpen, setIsAiAuditModalOpen] = useState(false)
  const [aiAuditLoading, setAiAuditLoading] = useState(false)
  const [aiAuditResult, setAiAuditResult] = useState<any>(null)
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('')
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false)
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false)

  // Live Interactive Preview State
  const [activeMobileTab, setActiveMobileTab] = useState<SalepageMobileTab>('editor')
  const [previewDevice, setPreviewDevice] = useState<SalepageDevice>('mobile')
  const [previewQty, setPreviewQty] = useState<number>(1)
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(1)
  const [previewPaymentMethod, setPreviewPaymentMethod] = useState<SalepagePaymentMethod>('promptpay')
  const [previewFaqOpen, setPreviewFaqOpen] = useState<number | null>(0)
  const [previewActiveGalleryImg, setPreviewActiveGalleryImg] = useState<string>('')
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Fullscreen Live Preview Simulator Modal State
  const [isLivePreviewModalOpen, setIsLivePreviewModalOpen] = useState(false)
  const [previewModalDevice, setPreviewModalDevice] = useState<SalepageDevice>('mobile')

  // Working Order Form State for Simulator & Canvas
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    line_id: '',
    address: '',
    note: '',
    payment_method: 'promptpay',
    slip_url: ''
  })
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Handle Slip Upload in Simulator / Canvas
  const handleSlipUpload = async (file: File) => {
    setUploadingSlip(true)
    try {
      const url = await uploadImageFile(file)
      setOrderForm(prev => ({ ...prev, slip_url: url }))
    } finally {
      setUploadingSlip(false)
    }
  }

  // Handle Order Submit in Simulator / Canvas
  const handleSimulatorOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderForm.name || !orderForm.phone) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์สำหรับจัดส่ง')
      return
    }

    setOrdering(true)
    try {
      const isPP = orderForm.payment_method === 'promptpay'
      const orderRef = (isPP ? 'PP-' : 'COD-') + Date.now().toString().slice(-6)

      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user?.id,
            name: orderForm.name.trim(),
            phone: orderForm.phone.trim(),
            line_id: orderForm.line_id ? orderForm.line_id.trim() : null,
            address: orderForm.address ? orderForm.address.trim() : null,
            amount: previewTotal || 490,
            payment_method: orderForm.payment_method,
            slip_url: orderForm.slip_url || null,
            order_code: orderRef,
            note: `[ทดลองสั่งซื้อจาก Salepage Builder: ${pageTitle}] ยอด: ฿${previewTotal.toLocaleString()} บาท`,
            line_channel_access_token: lineChannelToken || null,
            line_user_id: lineUserId || null,
            line_notify_token: lineNotifyToken || null
          })
        })
      } catch (apiErr) {}

      setOrderSuccess(true)
    } finally {
      setOrdering(false)
    }
  }

  // Unified Initial Data Creator (Ensures 100% data consistency across all 130 UI variants)
  const createUnifiedSection = (type: PageSection['type'], idSuffix = Date.now()): PageSection => {
    const id = 'sec-' + type + '-' + idSuffix

    switch (type) {
      case 'navbar':
        return {
          id,
          type: 'navbar',
          title: 'แถบ Navigation ด้านบน',
          visible: true,
          layoutStyle: 'floating_glass',
          cardStyle: 'glass',
          data: {
            brand_name: pageTitle || 'Aura Skin Thailand',
            logo_url: '',
            cta_text: 'สั่งซื้อด่วน',
            cta_url: '#checkout',
            phone_number: '0812345678',
            line_url: 'https://line.me',
            ticker_text: '🚚 จัดส่งฟรีด่วนทั่วไทย | รับประกันของแท้ 100% มี อย. ถูกต้อง'
          }
        }
      case 'hero':
        return {
          id,
          type: 'hero',
          title: 'Hero Banner & พาดหัวหลัก',
          visible: true,
          layoutStyle: 'scroll_float_animated',
          data: {
            headline: 'ฟื้นฟูผิวเร่งด่วนใน 7 วัน กระจ่างใส ไร้สิว รูขุมขนกระชับ',
            subheadline: 'นวัตกรรมสารสกัดเข้มข้นมาตรฐานระดับสากล ผ่านการทดสอบโดยแพทย์ผู้เชี่ยวชาญ',
            image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
            video_url: '',
            trust_badge_1: 'ส่งฟรีด่วนทั่วไทย',
            trust_badge_2: 'ของแท้ 100% มี อย.',
            trust_badge_3: 'เก็บเงินปลายทางได้',
            cta_text: 'สั่งซื้อโปรโมชั่นนี้ทันที',
            cta_url: '#checkout'
          }
        }
      case 'countdown':
        return {
          id,
          type: 'countdown',
          title: 'แถบนับถอยหลัง Flash Sale',
          visible: true,
          layoutStyle: 'urgent_flame_ticker',
          data: {
            headline: 'Flash Sale โปรโมชั่นพิเศษจำกัดเวลา!',
            minutes: 15,
            color: '',
            voucher_code: 'AURA50',
            stock_left: 7
          }
        }
      case 'pricing':
        return {
          id,
          type: 'pricing',
          title: 'ข้อเสนอและกล่องราคาพิเศษ',
          visible: true,
          layoutStyle: '3_tier_comparison_cards',
          data: {
            offer_price: '490',
            original_price: '990',
            badge_text: 'Special Offer ลด 50%',
            features: [
              'เซรั่มเข้มข้นขนาด 30ml 1 ขวด',
              'แถมฟรี มาส์กหน้าไฮยาลูรอน 2 แผ่น',
              'จัดส่งฟรีด่วนพิเศษทั่วประเทศ'
            ],
            tiers: [
              { name: 'ชุดทดลอง 1 ขวด', price: 490, original: 990, note: 'ส่งฟรีด่วน', isPopular: false },
              { name: 'ชุดขายดี 2 ขวด (แถมมาส์ก 2 แผ่น)', price: 890, original: 1980, note: '🔥 ยอดนิยม ขายดีอันดับ 1', isPopular: true },
              { name: 'ชุดสุดคุ้ม 3 ขวด (แถม 1 ขวดฟรี)', price: 1190, original: 2970, note: '👑 ประหยัดสูงสุด ฿1,780', isPopular: false }
            ]
          }
        }
      case 'gallery':
        return {
          id,
          type: 'gallery',
          title: 'แกลเลอรีรูปภาพสินค้า',
          visible: true,
          layoutStyle: 'featured_hero_thumbnails',
          data: {
            headline: 'ภาพถ่ายสินค้าและรีวิวผลลัพธ์',
            before_image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
            after_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            before_text: 'ก่อนใช้: รอยสิว ผิวหมองคล้ำ',
            after_text: 'หลังใช้ 7 วัน: กระจ่างใส เรียบเนียน',
            images: [
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
            ]
          }
        }
      case 'pain_points':
        return {
          id,
          type: 'pain_points',
          title: 'ขยี้ปัญหาลูกค้า (Pain Points)',
          visible: true,
          layoutStyle: 'card_list_cross',
          data: {
            headline: 'คุณกำลังเจอปัญหาผิวเหล่านี้อยู่ใช่หรือไม่?',
            points: [
              'ผิวหน้าหมองคล้ำ ไม่สดใส แต่งหน้าไม่ติดทน',
              'รอยสิว ฝ้า กระ และจุดด่างดำสะสมมานาน',
              'ผิวแห้งกร้าน รูขุมขนกว้าง ขาดความชุ่มชื้น'
            ]
          }
        }
      case 'benefits':
        return {
          id,
          type: 'benefits',
          title: 'จุดเด่น & ผลลัพธ์ที่จะได้รับ',
          visible: true,
          layoutStyle: 'emerald_glowing_cards',
          data: {
            headline: 'ผลลัพธ์ที่คุณจะได้รับหลังใช้ต่อเนื่อง:',
            benefits: [
              'ผิวกระจ่างใส ฉ่ำวาว อิ่มน้ำแบบสาวเกาหลี',
              'รอยดำ รอยแดงจากสิว จางลงอย่างเห็นได้ชัด',
              'ผิวแข็งแรง รูขุมขนกระชับขึ้นอย่างเป็นธรรมชาติ'
            ],
            steps: [
              { day: 'วันที่ 1-3', desc: 'ผิวชุ่มชื้น นุ่มเด้ง ไม่แห้งตึง' },
              { day: 'วันที่ 7', desc: 'รอยสิวเริ่มจาง ผิวดูกระจ่างใสขึ้น' },
              { day: 'วันที่ 14+', desc: 'ผิวออร่า รูขุมขนกระชับ เรียบเนียนถาวร' }
            ]
          }
        }
      case 'reviews':
        return {
          id,
          type: 'reviews',
          title: 'รีวิวจากลูกค้าจริง (Social Proof)',
          visible: true,
          layoutStyle: 'rating_cards_5star',
          data: {
            rating: 4.9,
            review_count: '1,420+ รีวิว',
            reviews: [
              { name: 'คุณแพรว (นนทบุรี)', comment: 'ใช้ไปขวดแรก ผิวหน้าเนียนนุ่มขึ้นมาก เพื่อนทักว่าหน้าใสขึ้น แนะนำเลยค่ะ!', stars: 5, date: 'เมื่อวานนี้' },
              { name: 'คุณกานต์ (เชียงใหม่)', comment: 'ประทับใจความส่งไว และมีเก็บเงินปลายทาง สั่งรอบ 2 แล้วครับ', stars: 5, date: '3 วันที่แล้ว' }
            ],
            chat_reviews: [
              { sender: 'ลูกค้า', text: 'สวัสดีค่ะ ได้รับของแล้วนะคะ แพ็กมาดีมากค่ะ' },
              { sender: 'ร้านค้า', text: 'ขอบคุณมากค่า ลองใช้แล้วเป็นอย่างไรบ้างคะ ❤️' },
              { sender: 'ลูกค้า', text: 'ใช้ดีมากเลยค่ะ รอยสิวจางลงไวมาก ขอสั่งเพิ่มอีก 2 ขวดค่ะ!' }
            ],
            review_images: []
          }
        }
      case 'faq':
        return {
          id,
          type: 'faq',
          title: 'คำถามที่พบบ่อย (FAQ)',
          visible: true,
          layoutStyle: 'accordion_clean',
          data: {
            faqs: [
              { q: 'ใช้เวลานานแค่ไหนถึงจะเห็นผล?', a: 'รู้สึกได้ถึงความชุ่มชื้นตั้งแต่วันแรกที่ใช้ และจะเริ่มเห็นความกระจ่างใสชัดเจนใน 7-14 วัน' },
              { q: 'ผิวแพ้ง่ายสามารถใช้ได้ไหม?', a: 'สูตรอ่อนโยน ปราศจากสารระคายเคือง 100% ผ่านการทดสอบจากแพทย์ผิวหนัง ปลอดภัยแน่นอน' },
              { q: 'มีบริการเก็บเงินปลายทาง (COD) ไหม?', a: 'มีบริการเก็บเงินปลายทางฟรี ไม่มีบวกค่าธรรมเนียมเพิ่ม จัดส่งถึงหน้าบ้านใน 1-2 วันทำการ' }
            ]
          }
        }
      case 'checkout':
        return {
          id,
          type: 'checkout',
          title: 'ฟอร์มชำระเงิน Dynamic PromptPay & COD',
          visible: true,
          layoutStyle: 'dynamic_promptpay_and_cod',
          data: {
            form_theme: 'neon_emerald',
            promptpay_number: profile?.promptpay_phone || '0909964514',
            promptpay_name: profile?.promptpay_name || profile?.full_name || 'Enter The Amanita Thailand',
            promptpay_bank: profile?.promptpay_bank || 'กสิกรไทย (KBANK)',
            enable_slip_upload: true,
            enable_cod: true,
            enable_promptpay: true
          }
        }
      case 'guarantee':
        return {
          id,
          type: 'guarantee',
          title: 'การรับประกันสินค้า (Guarantee)',
          visible: true,
          layoutStyle: 'ribbon_badge',
          data: { text: 'รับประกันความพึงพอใจ ของแท้ 100% ไม่พอใจยินดีคืนเงินใน 14 วัน' }
        }
      case 'sticky_cta':
        return {
          id,
          type: 'sticky_cta',
          title: 'ปุ่ม Action ลอยติดขอบล่าง (Sticky Bottom)',
          visible: true,
          layoutStyle: 'floating_cta_trio',
          data: {
            btn1_text: 'สั่งซื้อโปรโมชั่นด่วน',
            btn1_url: '#checkout',
            btn2_text: 'แชทสอบถาม LINE',
            btn2_url: 'https://line.me',
            btn3_text: 'โทรด่วน',
            btn3_url: 'tel:0812345678'
          }
        }
      case 'story':
      default:
        return {
          id,
          type: 'story',
          title: 'เนื้อเรื่อง / บทความแบรนด์',
          visible: true,
          layoutStyle: 'article_box',
          data: { body: 'เรื่องราวของแบรนด์เรา มุ่งมั่นคัดสรรสารสกัดธรรมชาติเกรดพรีเมียม เพื่อผลลัพธ์ที่ดีที่สุดสำหรับผิวของคุณ...' }
        }
    }
  }

  // Load Starter Template
  const loadStarterTemplate = () => {
    const starterSections: PageSection[] = [
      createUnifiedSection('navbar', 1),
      createUnifiedSection('countdown', 2),
      createUnifiedSection('hero', 3),
      createUnifiedSection('pricing', 4),
      createUnifiedSection('gallery', 5),
      createUnifiedSection('pain_points', 6),
      createUnifiedSection('benefits', 7),
      createUnifiedSection('reviews', 8),
      createUnifiedSection('faq', 9),
      createUnifiedSection('checkout', 10),
      createUnifiedSection('sticky_cta', 11)
    ]
    setSections(starterSections)
    if (starterSections.length > 0) {
      setSelectedSectionId(starterSections[0].id)
    }
  }

  // Load User & Existing Salepage
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin)
    }
    const initPage = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login?next=/custom-salepage')
        return
      }

      setUser(session.user)
      if (typeof window !== 'undefined') {
        const savedAiKey = localStorage.getItem('user_ai_api_key') || localStorage.getItem('gemini_api_key')
        if (savedAiKey) {
          setUserAiApiKey(savedAiKey)
        }
      }
      

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (prof) {
        setProfile(prof)
        setFbPixelId(prof.fb_pixel_id || '')
        setTiktokPixelId(prof.tiktok_pixel_id || '')
        setGooglePixelId(prof.google_pixel_id || '')
        setLineTagId(prof.line_tag_id || '')
        setLineChannelToken(prof.line_channel_access_token || '')
        setLineUserId(prof.line_user_id || '')
        setLineNotifyToken(prof.line_notify_token || '')
      }

      if (editId) {
        let query = supabase.from('landing_pages').select('*').eq('user_id', session.user.id)
        if (editId) {
          query = query.eq('id', editId)
        } else if (editSlug) {
          query = query.eq('slug', editSlug)
        }

        const { data: lpData } = (editId || editSlug) ? await query.single() : { data: null }

        if (lpData) {
          setPageTitle(lpData.title || '')
          setPageSlug(lpData.slug || '')
          setGlobalThemeColor(lpData.theme_color || '#8B5CF6')
          setGlobalBgColor(lpData.bg_color || '#0B0F17')
          setGlobalTextColor(lpData.text_color || '#FFFFFF')
          setGlobalBgImage(lpData.bg_image_url || '')
          if (lpData.bg_image_opacity !== undefined && lpData.bg_image_opacity !== null) setGlobalBgOpacity(lpData.bg_image_opacity)
          if (lpData.bg_image_blur !== undefined && lpData.bg_image_blur !== null) setGlobalBgBlur(lpData.bg_image_blur)
          if (lpData.bg_image_mode) setGlobalBgMode(lpData.bg_image_mode)

          setInnerBgImage(lpData.inner_bg_image_url || '')
          if (lpData.inner_bg_opacity !== undefined && lpData.inner_bg_opacity !== null) setInnerBgOpacity(lpData.inner_bg_opacity)
          if (lpData.inner_bg_blur !== undefined && lpData.inner_bg_blur !== null) setInnerBgBlur(lpData.inner_bg_blur)
          if (lpData.inner_bg_mode) setInnerBgMode(lpData.inner_bg_mode)

          setGlobalCardStyle(lpData.card_style || 'glass')
          setPublishedSlug(lpData.slug || '')

          if (lpData.fb_pixel_id) setFbPixelId(lpData.fb_pixel_id)
          if (lpData.tiktok_pixel_id) setTiktokPixelId(lpData.tiktok_pixel_id)
          if (lpData.google_pixel_id) setGooglePixelId(lpData.google_pixel_id)
          if (lpData.line_tag_id) setLineTagId(lpData.line_tag_id)

          let loadedSecs: any[] = []
          if (Array.isArray(lpData.features) && lpData.features.length > 0 && lpData.features[0]?.type) {
            loadedSecs = lpData.features
          } else if (typeof lpData.features === 'string') {
            try {
              const p = JSON.parse(lpData.features)
              if (Array.isArray(p) && p.length > 0 && p[0]?.type) loadedSecs = p
            } catch (e) {}
          }
          
          if (loadedSecs.length === 0 && Array.isArray(lpData.sections) && lpData.sections.length > 0 && lpData.sections[0]?.type) {
            loadedSecs = lpData.sections
          } else if (loadedSecs.length === 0 && typeof lpData.sections === 'string') {
            try {
              const p = JSON.parse(lpData.sections)
              if (Array.isArray(p) && p.length > 0 && p[0]?.type) loadedSecs = p
            } catch (e) {}
          }

          if (loadedSecs.length > 0) {
            setSections(loadedSecs)
            setSelectedSectionId(loadedSecs[0].id)
          } else {
            setSections([])
            setSelectedSectionId(null)
          }
        }
      } else {
        // Check for AI Auto Generated Salepage Import (Session / LocalStorage / URL)
        const aiImported = typeof window !== 'undefined'
          ? (sessionStorage.getItem('ai_imported_salepage') || localStorage.getItem('ai_imported_salepage'))
          : null
        const isAiActive = searchParams.get('ai_import') === 'true' || (typeof window !== 'undefined' && (sessionStorage.getItem('ai_import_active') === 'true' || localStorage.getItem('ai_import_active') === 'true'))

        if (aiImported && (isAiActive || aiImported.length > 50)) {
          try {
            const parsed = JSON.parse(aiImported)
            if (parsed.pageTitle) setPageTitle(parsed.pageTitle)
            if (parsed.pageSlug) setPageSlug(parsed.pageSlug)
            if (parsed.themeColor) setGlobalThemeColor(parsed.themeColor)
            if (parsed.bgColor) setGlobalBgColor(parsed.bgColor)
            if (parsed.textColor) setGlobalTextColor(parsed.textColor)
            if (parsed.cardStyle) setGlobalCardStyle(parsed.cardStyle)
            if (parsed.bgImage) setGlobalBgImage(parsed.bgImage)
            if (parsed.innerBgImage || parsed.bgImage) setInnerBgImage(parsed.innerBgImage || parsed.bgImage)
            if (parsed.bg_image_opacity !== undefined) setGlobalBgOpacity(parsed.bg_image_opacity)
            if (parsed.inner_bg_opacity !== undefined) setInnerBgOpacity(parsed.inner_bg_opacity)
            
            if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
              setSections(parsed.sections)
              setSelectedSectionId(parsed.sections[0].id)
            } else {
              setSections([])
              setSelectedSectionId(null)
            }
          } catch (e) {
            console.warn('Error parsing AI imported salepage:', e)
            setSections([])
            setSelectedSectionId(null)
          }
        } else {
          // Clean initial start: Empty canvas without preloaded dummy sections
          setSections([])
          setSelectedSectionId(null)
          setPageTitle('')
          setPageSlug('')
        }
      }

      const savedTheme = localStorage.getItem('linktree_theme')
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true)
        document.documentElement.classList.add('dark')
      } else {
        setIsDarkMode(false)
        document.documentElement.classList.remove('dark')
      }

      setLoading(false)
    }

    initPage()
  }, [editId, router])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('linktree_theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('linktree_theme', 'dark')
      setIsDarkMode(true)
    }
  }

  // Upload image file to Base64 + Supabase Storage
    // Client-side Image Optimizer (Compresses to max 1024x1024 for instant AI Vision analysis)
  const compressImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const maxDim = 1024
          let w = img.width
          let h = img.height
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w)
              w = maxDim
            } else {
              w = Math.round((w * maxDim) / h)
              h = maxDim
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h)
            const compressed = canvas.toDataURL('image/jpeg', 0.85)
            resolve(compressed)
            return
          }
          resolve(e.target?.result as string)
        }
        img.onerror = () => resolve(e.target?.result as string)
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  // Dedicated AI Vision Image Uploader (Direct Base64 Extraction)
  const uploadAiProductImage = async (file: File): Promise<string> => {
    try {
      const optimizedBase64 = await compressImageToBase64(file)
      aiProductBase64Ref.current = optimizedBase64
      setAiProductBase64(optimizedBase64)
      setAiProductImage(optimizedBase64)

      try {
        const supabase = createClient()
        const fileExt = file.name.split('.').pop() || 'jpg'
        const fileName = `ai-product-${user?.id || 'guest'}-${Date.now()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { data, error } = await supabase.storage.from('media').upload(filePath, file, { upsert: true })
        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
          setAiProductImage(publicUrl)
          return publicUrl
        }
        return optimizedBase64
      } catch (err) {
        return optimizedBase64
      }
    } catch (e) {
      return ''
    }
  }

  const uploadImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Data = reader.result as string
        const supabase = createClient()

        try {
          const fileExt = file.name.split('.').pop() || 'jpg'
          const fileName = `salepage-${user?.id || 'guest'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`
          const filePath = `uploads/${fileName}`

          const { data, error } = await supabase.storage.from('media').upload(filePath, file, { upsert: true })
          if (!error && data) {
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
            resolve(publicUrl)
            return
          }

          const { data: d2, error: e2 } = await supabase.storage.from('linktree-assets').upload(filePath, file, { upsert: true })
          if (!e2 && d2) {
            const { data: { publicUrl: p2 } } = supabase.storage.from('linktree-assets').getPublicUrl(filePath)
            resolve(p2)
            return
          }

          resolve(base64Data)
        } catch (err) {
          resolve(base64Data)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Apply Preset Color Palette
  const applyPresetPalette = (palette: typeof PRESET_PALETTES[0]) => {
    setGlobalThemeColor(palette.primary)
    setGlobalBgColor(palette.bg)
    setGlobalTextColor(palette.text)
    setGlobalCardStyle(palette.card as any)
  }

  // Section Reordering & Actions
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    const temp = newSections[index - 1]
    newSections[index - 1] = newSections[index]
    newSections[index] = temp
    setSections(newSections)
  }

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    const temp = newSections[index + 1]
    newSections[index + 1] = newSections[index]
    newSections[index] = temp
    setSections(newSections)
  }

  const handleToggleVisible = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }

  const handleDuplicate = (section: PageSection) => {
    const newSection: PageSection = {
      ...section,
      id: 'sec-' + section.type + '-' + Date.now(),
      title: section.title + ' (คัดลอก)'
    }
    setSections(prev => [...prev, newSection])
    setSelectedSectionId(newSection.id)
  }

  const handleDeleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id))
    if (selectedSectionId === id) {
      setSelectedSectionId(null)
    }
  }

  const handleUpdateSectionData = (id: string, key: string, value: any) => {
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, data: { ...s.data, [key]: value } } : s))
    )
  }

  const handleUpdateSectionField = (id: string, field: string, value: any) => {
    setSections(prev => (prev.map(s => s.id === id ? { ...s, [field]: value } : s)))
  }

  // Add Block from Catalog
    // AI Salepage Auditor Function (Connected to /api/ai-audit-salepage)
  const handleRunAiAudit = async () => {
    setAiAuditLoading(true)
    setIsAiAuditModalOpen(true)
    try {
      const heroSec = sections.find(s => s.type === 'hero')
      const res = await fetch('/api/ai-audit-salepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle,
          sections,
          productName: heroSec?.data?.headline || pageTitle,
          apiKey: geminiApiKeyInput
        })
      })
      const data = await res.json()
      if (data.success && data.audit) {
        setAiAuditResult(data.audit)
      }
    } catch (err) {
      console.warn('AI Audit notice:', err)
    } finally {
      setAiAuditLoading(false)
    }
  }

  const handleApplyAiHeadline = (newHeadline: string, newSubheadline?: string) => {
    const heroSec = sections.find(s => s.type === 'hero')
    if (heroSec) {
      handleUpdateSectionData(heroSec.id, 'headline', newHeadline)
      if (newSubheadline) {
        handleUpdateSectionData(heroSec.id, 'subheadline', newSubheadline)
      }
      alert('นำพาดหัวที่ AI แนะนำไปปรับใช้ใน Hero Section เรียบร้อยแล้ว!')
    }
  }

  const handleAddBlock = (type: PageSection['type']) => {
    const newSec = createUnifiedSection(type)
    setSections(prev => [...prev, newSec])
    setSelectedSectionId(newSec.id)
    setIsAddBlockModalOpen(false)
  }

  // Save to Supabase
    // Test & Validate AI API Key in Real Time
  const handleValidateApiKey = async (customKey?: string) => {
    const keyToTest = (customKey !== undefined ? customKey : userAiApiKey).trim()
    if (!keyToTest) {
      setKeyValidationResult({ valid: false, error: 'กรุณากรอก API Key ก่อนทำการทดสอบ' })
      return
    }

    setIsTestingKey(true)
    setKeyValidationResult(null)

    try {
      const res = await fetch('/api/ai-test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToTest })
      })

      const data = await res.json()
      if (data.valid) {
        setKeyValidationResult({
          valid: true,
          provider: data.provider || 'AI Vision Ready'
        })
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_ai_api_key', keyToTest)
        }
      } else {
        setKeyValidationResult({
          valid: false,
          error: data.error || 'API Key ไม่ถูกต้อง'
        })
      }
    } catch (err: any) {
      setKeyValidationResult({
        valid: false,
        error: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message}`
      })
    } finally {
      setIsTestingKey(false)
    }
  }

  // Run Real AI Vision Product Analysis and Populate all 13 Salepage Sections
  const handleRunAiVisionAnalysis = async () => {
    if (!aiProductImage && !aiProductBase64 && !aiProductHint) {
      alert('กรุณาอัปโหลดรูปภาพสินค้า หรือพิมพ์ระบุชื่อสินค้า/สรรพคุณก่อนเริ่มวิเคราะห์')
      return
    }

    setAiAnalyzing(true)
    setAiSuccessMsg('')
    setAiAnalyzeStep('📸 1/3: กำลังสแกนองค์ประกอบ อ่านข้อความ และวิเคราะห์รูปภาพด้วย AI Vision...')

    try {
      const activeKey = (userAiApiKey || (typeof window !== 'undefined' ? (localStorage.getItem('user_ai_api_key') || localStorage.getItem('gemini_api_key') || '') : '')).trim()

      const b64Payload = aiProductBase64Ref.current || aiProductBase64 || (aiProductImage.startsWith('data:') ? aiProductImage : '')

      // Step 1: Call Multimodal AI Vision API
      const resAnalysis = await fetch('/api/ai-analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: aiProductImage,
          imageBase64: b64Payload,
          userApiKey: activeKey,
          productHint: aiProductHint.trim()
        })
      })

      const dataAnalysis = await resAnalysis.json()
      if (!resAnalysis.ok || !dataAnalysis.success) {
        throw new Error(dataAnalysis.error || 'การวิเคราะห์รูปภาพล้มเหลว')
      }

      const analyzed = dataAnalysis.analysis
      setAiAnalyzeStep('✍️ 2/3: AI กำลังสร้างข้อความพาดหัว รีวิวลูกค้า เรื่องราวแบรนด์ และแพ็กเกจราคา...')

      const finalName = analyzed?.productName || aiProductHint || 'ผลิตภัณฑ์พรีเมียม'
      const finalCat = analyzed?.category || 'food'
      const finalFeatures = analyzed?.keyFeatures || 'สดใหม่ทุกวัน วัตถุดิบคุณภาพเกรดพรีเมียม 100%'
      const finalPrice = analyzed?.price !== undefined ? parseFloat(analyzed.price) : 25
      const finalOriginal = analyzed?.originalPrice !== undefined ? parseFloat(analyzed.originalPrice) : Math.round(finalPrice * 1.8)
      const finalAudience = analyzed?.targetAudience || 'ลูกค้าที่ชื่นชอบคุณภาพและความคุ้มค่า'
      const finalTone = analyzed?.tone || 'delicious'
      const finalTheme = analyzed?.themeColor || (finalCat === 'bakery' || finalCat === 'food' ? '#F59E0B' : (finalCat === 'herbal' ? '#10B981' : '#8B5CF6'))
      const finalBg = analyzed?.bgColor || (finalCat === 'bakery' || finalCat === 'food' ? '#140E05' : '#0B0F17')
      const finalCard = analyzed?.cardStyle || 'glass'
      const finalBgImage = analyzed?.bgImage || ''
      const finalImage = aiProductImage || aiProductBase64 || analyzed?.productImage || ''

      // Auto generate matching slug
      const cleanNameSlug = finalName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'product'
      const autoSlug = cleanNameSlug.slice(0, 20) + '-' + Math.floor(100 + Math.random() * 900)

      setAiAnalyzeStep('🚀 3/3: กำลังประกอบ 13 บล็อกเซลเพจและปรับธีมสีให้ตรงกับสินค้า...')

      // Step 2: Generate 13 modular sections with the actual tailored AI content
      const resGen = await fetch('/api/ai-generate-salepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: finalName,
          category: finalCat,
          keyFeatures: finalFeatures,
          price: finalPrice,
          originalPrice: finalOriginal,
          targetAudience: finalAudience,
          tone: finalTone,
          productImage: finalImage,
          customThemeColor: finalTheme,
          customBgColor: finalBg,
          customTextColor: '#FFFFFF',
          customCardStyle: finalCard,
          customBgImage: finalBgImage,
          customHeadline: analyzed?.headline,
          customSubheadline: analyzed?.subheadline,
          customPainPoints: analyzed?.painPoints,
          customBenefits: analyzed?.benefits,
          customFaqs: analyzed?.faqs,
          customReviews: analyzed?.reviews,
          customChatReviews: analyzed?.chatReviews,
          customStory: analyzed?.brandStory,
          customGuarantee: analyzed?.guaranteeText,
          customTiers: analyzed?.tiers,
          customTrustBadges: analyzed?.trustBadges,
          analysis: analyzed,
          userApiKey: activeKey
        })
      })

      const dataGen = await resGen.json()
      if (dataGen.success && dataGen.sections) {
        // 1. Update all 13 sections in builder
        setSections(dataGen.sections)
        if (dataGen.sections.length > 0) {
          setSelectedSectionId(dataGen.sections[0].id)
        }

        // 2. Update page title & slug
        const appliedTitle = dataGen.pageTitle || finalName
        setPageTitle(appliedTitle)
        setPageSlug(autoSlug)

        // 3. Update theme, background color, and card style
        const appliedTheme = dataGen.themeColor || finalTheme
        const appliedBg = dataGen.bgColor || finalBg
        const appliedCard = (dataGen.cardStyle || finalCard) as SalepageCardStyle
        const appliedBgImg = dataGen.bgImage || finalBgImage || ''

        setGlobalThemeColor(appliedTheme)
        setGlobalBgColor(appliedBg)
        setGlobalTextColor(dataGen.textColor || '#FFFFFF')
        setGlobalCardStyle(appliedCard)
        setGlobalBgImage(appliedBgImg)

        // Save API key if valid
        if (activeKey && typeof window !== 'undefined') {
          localStorage.setItem('user_ai_api_key', activeKey)
          localStorage.setItem('gemini_api_key', activeKey)
        }

        setAiSuccessMsg(`🎉 AI วิเคราะห์สำเร็จ: "${appliedTitle}" พร้อมเปลี่ยนเนื้อหา 13 บล็อก และปรับธีมสี ${appliedTheme} เรียบร้อยแล้ว!`)
        setTimeout(() => {
          setIsAiAnalyzeModalOpen(false)
          setAiSuccessMsg('')
        }, 1000)
      }
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาดในการวิเคราะห์ AI: ${err.message}`)
    } finally {
      setAiAnalyzing(false)
      setAiAnalyzeStep('')
    }
  }

  // 1. Open Points Confirmation Modal
  const handleSaveSalepage = async () => {
    if (!pageTitle || !pageSlug) {
      alert('กรุณากรอกชื่อเซลเพจ และกำหนดลิงก์ URL (Slug)')
      return
    }

    if (!user?.id) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการบันทึกเซลเพจ')
      return
    }

    const supabase = createClient()
    try {
      const { data: freshProf } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const currentPoints = freshProf?.points !== undefined ? freshProf.points : (profile?.points ?? 0)
      const currentSlots = freshProf?.extra_landing_page_slots !== undefined ? freshProf.extra_landing_page_slots : (profile?.extra_landing_page_slots ?? 0)

      setConfirmingPoints(currentPoints)
      setConfirmingSlots(currentSlots)
      setIsConfirmSaveModalOpen(true)
    } catch (e) {
      setConfirmingPoints(profile?.points ?? 0)
      setConfirmingSlots(profile?.extra_landing_page_slots ?? 0)
      setIsConfirmSaveModalOpen(true)
    }
  }

  // 2. Execute Points Deduction (990 Points) & Publish Salepage
  const executeSaveSalepage = async () => {
    setSaving(true)
    const supabase = createClient()
    const cleanSlug = pageSlug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '')

    try {
      // Fetch latest profile points and slots
      const { data: freshProf, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profErr && !freshProf) {
        throw new Error('ไม่สามารถตรวจสอบข้อมูลแต้มผู้ใช้ได้: ' + profErr.message)
      }

      const currentPoints = freshProf?.points !== undefined ? freshProf.points : (profile?.points ?? 0)
      const currentSlots = freshProf?.extra_landing_page_slots !== undefined ? freshProf.extra_landing_page_slots : (profile?.extra_landing_page_slots ?? 0)

      // Require 990 points
      if (currentPoints < 990) {
        alert(`❌ แต้มของคุณไม่เพียงพอสำหรับการบันทึกเซลเพจ\n\n• ต้องการ: 990 แต้ม\n• แต้มของคุณปัจจุบัน: ${currentPoints.toLocaleString()} แต้ม\n\nกรุณาเติมแต้มในแดชบอร์ดก่อนดำเนินการบันทึก`)
        setSaving(false)
        return
      }

      // Deduct 990 points and increment extra_landing_page_slots (+1)
      const newPoints = Math.max(0, currentPoints - 990)
      const newSlots = currentSlots + 1

      const { error: updateProfErr } = await supabase
        .from('profiles')
        .update({
          points: newPoints,
          extra_landing_page_slots: newSlots,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateProfErr) {
        throw new Error('ไม่สามารถหักแต้มและเพิ่มโควตาได้: ' + updateProfErr.message)
      }

      // Update local profile state
      setProfile((prev: any) => ({
        ...prev,
        points: newPoints,
        extra_landing_page_slots: newSlots
      }))

      // Assemble payload matching landing_pages schema
      const heroSec = sections.find(s => s.type === 'hero')?.data || {}
      const pricingSec = sections.find(s => s.type === 'pricing')?.data || {}
      const countdownSec = sections.find(s => s.type === 'countdown')?.data || {}
      const checkoutSec = sections.find(s => s.type === 'checkout')?.data || {}
      const painSec = sections.find(s => s.type === 'pain_points')?.data || {}
      const benefitSec = sections.find(s => s.type === 'benefits')?.data || {}
      const faqSec = sections.find(s => s.type === 'faq')?.data || {}
      const guaranteeSec = sections.find(s => s.type === 'guarantee')?.data || {}
      const stickySec = sections.find(s => s.type === 'sticky_cta')?.data || {}
      const gallerySec = sections.find(s => s.type === 'gallery')?.data || {}
      const reviewSec = sections.find(s => s.type === 'reviews')?.data || {}

      const payload: any = {
        user_id: user.id,
        slug: cleanSlug,
        title: pageTitle.trim(),
        headline: heroSec.headline || pageTitle.trim(),
        subheadline: heroSec.subheadline || null,
        hero_media_url: heroSec.image_url || heroSec.hero_image_url || null,
        hero_media_type: 'image',
        hero_image_url: heroSec.image_url || heroSec.hero_image_url || null,
        video_url: heroSec.video_url || null,
        offer_price: pricingSec.offer_price ? parseFloat(pricingSec.offer_price) : null,
        original_price: pricingSec.original_price ? parseFloat(pricingSec.original_price) : null,
        countdown_minutes: countdownSec.minutes ? parseInt(countdownSec.minutes) : 15,
        features: sections,
        theme_color: globalThemeColor,
        bg_color: globalBgColor,
        bg_image_url: globalBgImage || null,
        card_style: globalCardStyle || 'glass',
        text_color: globalTextColor,
        subtext_color: '#E2E8F0',
        trust_badge_1: heroSec.trust_badge_1 || 'ส่งฟรีด่วน',
        trust_badge_2: heroSec.trust_badge_2 || 'ของแท้ 100%',
        trust_badge_3: heroSec.trust_badge_3 || 'ชำระเงินปลอดภัย',
        pain_headline: painSec.headline || null,
        pain_points: painSec.points || [],
        benefits_headline: benefitSec.headline || null,
        benefits: benefitSec.benefits || [],
        gallery_images: gallerySec.images || [],
        review_images: reviewSec.review_images || [],
        enable_review_album: Boolean(reviewSec.review_images && reviewSec.review_images.length > 0),
        testimonials: reviewSec.reviews ? reviewSec.reviews.map((r: any) => r.comment || r) : [],
        guarantee_text: guaranteeSec.text || null,
        faqs: faqSec.faqs || [],
        enable_cod_form: Boolean(checkoutSec.enable_cod !== false),
        sticky_btn1_text: stickySec.btn1_text || 'สั่งซื้อโปรโมชั่นด่วน',
        sticky_btn1_url: stickySec.btn1_url || '#checkout',
        sticky_btn2_text: stickySec.btn2_text || 'แชท LINE',
        sticky_btn2_url: stickySec.btn2_url || 'https://line.me',
        sticky_btn3_text: stickySec.btn3_text || null,
        sticky_btn3_url: stickySec.btn3_url || null,
        cta_text: 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
        cta_url: '#checkout',
        fb_pixel_id: fbPixelId?.trim() || null,
        tiktok_pixel_id: tiktokPixelId?.trim() || null,
        google_pixel_id: googlePixelId?.trim() || null,
        line_tag_id: lineTagId?.trim() || null,
        is_active: true,
        updated_at: new Date().toISOString()
      }

      let res
      if (editId) {
        res = await supabase.from('landing_pages').update(payload).eq('id', editId).eq('user_id', user.id)
      } else {
        res = await supabase.from('landing_pages').insert([payload])
      }

      if (res.error) throw res.error

      setPublishedSlug(cleanSlug)
      setSaveSuccess(true)
      setIsConfirmSaveModalOpen(false)

      // Open in-app Success Modal UI
      setSaveSuccessData({
        slug: cleanSlug,
        deducted: 990,
        remaining: newPoints,
        totalSlots: newSlots
      })

    } catch (err: any) {
      console.error('Save error:', err)
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + (err.message || 'Slug ซ้ำ หรือข้อมูลไม่ถูกต้อง'))
    } finally {
      setSaving(false)
    }
  }

  // Selected section for editing
  const selectedSection = sections.find(s => s.id === selectedSectionId)

  // Pricing & PromptPay computation for live preview
  const pricingSection = sections.find(s => s.type === 'pricing')
  const pricingData = pricingSection?.data || {}
  const checkoutData = sections.find(s => s.type === 'checkout')?.data || {}

  let activeUnitPrice = pricingData.offer_price ? parseFloat(pricingData.offer_price) : 490
  if (pricingSection?.layoutStyle === '3_tier_comparison_cards' && pricingData.tiers && pricingData.tiers[selectedTierIndex]) {
    activeUnitPrice = pricingData.tiers[selectedTierIndex].price || activeUnitPrice
  }

  const previewTotal = activeUnitPrice * Math.max(1, previewQty)
  const effectivePPTarget = (checkoutData.promptpay_number || profile?.promptpay_phone || PROMPTPAY_PHONE).replace(/[^0-9]/g, '') || PROMPTPAY_PHONE
  const promptPayQRUrl = getPromptPayQRImageUrl(effectivePPTarget, previewTotal)

  const publicLiveUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/c/${publishedSlug || pageSlug}`
    : `https://linktreethai.in.th/c/${publishedSlug || pageSlug}`


  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-[#F8FAFC] transition-colors duration-300 flex flex-col overflow-x-hidden">
      
      {/* TOP BUILDER APP BAR (CLEAN, PROPORTIONAL, RESPONSIVE) */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#131B2A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Left: Back Arrow + Page Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/dashboard?tab=services"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition shadow-xs shrink-0"
              title="กลับสู่แดชบอร์ด"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                style={{ backgroundColor: globalThemeColor }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl text-white flex items-center justify-center shadow-md transition-colors shrink-0 hidden xs:flex"
              >
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="ชื่อเซลเพจของคุณ..."
                  className="w-full text-xs sm:text-sm font-black text-slate-900 dark:text-white bg-transparent focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 px-1 rounded-lg transition truncate"
                />
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <span className="shrink-0">/c/</span>
                  <input
                    type="text"
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    placeholder="my-slug"
                    style={{ color: globalThemeColor }}
                    className="bg-transparent font-bold focus:outline-none truncate max-w-[120px] sm:max-w-[200px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions + Save */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
                        {/* AI Auto Salepage Studio Bridge */}
            

            {/* AI Vision Analysis & Generator Button */}
            <button
              type="button"
              onClick={() => setIsAiAnalyzeModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
              title="วิเคราะห์รูปภาพสินค้า & สร้างเนื้อหาเซลเพจด้วย AI"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
              <span className="hidden sm:inline">วิเคราะห์ด้วย AI</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Add Block Button */}
            <button
              onClick={() => setIsAddBlockModalOpen(true)}
              style={{ backgroundColor: globalThemeColor }}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-2xl text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">เพิ่มส่วนประกอบ</span>
              <span className="md:hidden">เพิ่ม</span>
            </button>

            {/* Theme & Background Drawer */}
            <button
              onClick={() => setIsGlobalSettingsOpen(!isGlobalSettingsOpen)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isGlobalSettingsOpen
                  ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="ธีม & สีพื้นหลัง"
            >
              <Palette className="w-4 h-4 text-purple-500" />
              <span className="hidden lg:inline">ธีม & สี</span>
            </button>

            {/* API Settings Drawer */}
            <button
              onClick={() => setIsApiSettingsOpen(!isApiSettingsOpen)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isApiSettingsOpen
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="LINE & Pixels"
            >
              <BellRing className="w-4 h-4 text-emerald-500" />
              <span className="hidden lg:inline">LINE & Pixel</span>
            </button>

            {/* AI Salepage Auditor & Optimizer Button */}
            <button
              type="button"
              onClick={handleRunAiAudit}
              className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
              title="ใช้ AI วิเคราะห์และตรวจสอบหน้าเซลเพจ"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span className="hidden md:inline">🤖 AI วิเคราะห์เพจ</span>
              <span className="md:hidden">AI</span>
            </button>

            {/* Fullscreen Live Preview Simulator Button */}
            <button
              onClick={() => setIsLivePreviewModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-purple-950/80 dark:hover:bg-purple-900 border border-purple-500/40 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
              title="ดูหน้าเว็บจริงทดลองก่อน"
            >
              <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">ดูเว็บจริง</span>
            </button>

            {/* Theme Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition shadow-xs cursor-pointer"
              title="สลับธีม สว่าง/มืด"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Save & Publish Button */}
            <button
              onClick={handleSaveSalepage}
              disabled={saving}
              style={{ backgroundColor: globalThemeColor }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-white text-xs font-black flex items-center gap-1 shadow-lg active:scale-95 transition disabled:opacity-50 cursor-pointer shrink-0"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">{saving ? 'กำลังบันทึก...' : 'บันทึก & เผยแพร่'}</span>
              <span className="sm:hidden">{saving ? 'บันทึก...' : 'บันทึก'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* QUICK PRESET PALETTES BAR */}
      <div className="bg-white dark:bg-[#131B2A] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2 overflow-x-auto no-scrollbar shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">โทนสีด่วน:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {PRESET_PALETTES.map((pal) => (
              <button
                key={pal.name}
                type="button"
                onClick={() => applyPresetPalette(pal)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer ${
                  globalThemeColor === pal.primary
                    ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pal.primary }} />
                <span>{pal.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE TAB SWITCHER (< lg ONLY) */}
      <div className="lg:hidden bg-slate-200/70 dark:bg-slate-900/90 p-1.5 border-b border-slate-300 dark:border-slate-800 sticky top-16 z-40">
        <div className="grid grid-cols-2 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveMobileTab('editor')}
            className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeMobileTab === 'editor'
                ? 'bg-white dark:bg-[#131B2A] text-purple-600 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>🛠️ จัดการบล็อก ({sections.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeMobileTab === 'preview'
                ? 'bg-white dark:bg-[#131B2A] text-purple-600 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>📱 ตัวอย่างมือถือสด</span>
          </button>
        </div>
      </div>

      {/* GLOBAL THEME & DUAL BACKGROUND STUDIO DRAWER */}
      {isGlobalSettingsOpen && (
        <div className="bg-white dark:bg-[#131B2A] border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    ปรับแต่งธีม & ภาพพื้นหลัง 2 ระดับ (Global Styling & Dual Backgrounds)
                  </h4>
                  <p className="text-xs text-slate-500">
                    กำหนดสีปุ่ม สไตล์การ์ด และใส่ภาพพื้นหลังแยกอิสระระหว่าง จอใหญ่ข้างหลัง และ จอเล็กกล่องมือถือ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGlobalSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition"
              >
                เสร็จสิ้น
              </button>
            </div>

            {/* Basic Colors Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">สีหลักปุ่ม & ไฮไลท์ (Primary Accent)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={globalThemeColor}
                    onChange={(e) => setGlobalThemeColor(e.target.value)}
                    className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={globalThemeColor}
                    onChange={(e) => setGlobalThemeColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">สไตล์การ์ดเนื้อหา (Card Style)</label>
                <select
                  value={globalCardStyle}
                  onChange={(e) => setGlobalCardStyle(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="glass">กระจกฝ้า (Frosted Glassmorphism)</option>
                  <option value="dark">โมเดิร์นดาร์ก (Solid Dark Slate)</option>
                  <option value="clean">คลีนการ์ด (Clean White / Light)</option>
                  <option value="neon">นีออนโกลว์ (Cyberpunk Neon)</option>
                  <option value="gold">ลักชูรีโกลด์ (Luxury Gold)</option>
                  <option value="pastel">พาสเทลการ์ด (Pastel Card)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">สีตัวหนังสือหลัก (Text Color)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={globalTextColor}
                    onChange={(e) => setGlobalTextColor(e.target.value)}
                    className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={globalTextColor}
                    onChange={(e) => setGlobalTextColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* DUAL BACKGROUND STUDIO: 2 SEPARATE COLUMNS (OUTER BIG SCREEN vs INNER SMALL PHONE) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
              
              {/* 🖥️ COLUMN 1: OUTER FULL-SCREEN BACKGROUND (จอใหญ่ข้างหลัง) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border-2 border-purple-500/40 space-y-3.5 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white">
                        1. ภาพพื้นหลังจอใหญ่ข้างหลัง (Outer Backdrop)
                      </h5>
                      <span className="text-[9px] text-slate-400">แสดงเต็มหน้าจอเบราว์เซอร์ด้านนอก / ด้านหลังมือถือ</span>
                    </div>
                  </div>
                  {globalBgImage && (
                    <button
                      type="button"
                      onClick={() => setGlobalBgImage('')}
                      className="text-[10px] text-rose-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>ลบรูป</span>
                    </button>
                  )}
                </div>

                {/* Big Image Uploader */}
                <ImageUploaderBox
                  label="อัปโหลดภาพพื้นหลังจอใหญ่ (รองรับภาพขนาดใหญ่ HD / 4K)"
                  value={globalBgImage}
                  onChange={(url) => setGlobalBgImage(url)}
                  uploadImageFile={uploadAiProductImage}
                  uploadingImage={uploadingImage}
                  setUploadingImage={setUploadingImage}
                  aspect="aspect-[16/9]"
                />

                {/* 6 Curated Outer Presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 block">
                    หรือเลือกภาพวิวทิวทัศน์สำเร็จรูป (1-Click HD Wallpapers):
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { name: '🌌 กาแล็กซี', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80' },
                      { name: '🏛️ หินอ่อนหรู', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80' },
                      { name: '🌿 พฤกษาเขียว', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1600&q=80' },
                      { name: '🌇 ไซเบอร์นีออน', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80' },
                      { name: '🌸 พาสเทลคลีน', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80' },
                      { name: '🌅 อาทิตย์อัสดง', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' }
                    ].map((wp) => (
                      <div
                        key={wp.name}
                        onClick={() => setGlobalBgImage(wp.url)}
                        className={`p-1 rounded-xl border text-center cursor-pointer transition transform hover:scale-105 ${globalBgImage === wp.url ? 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-50 dark:bg-purple-950/40' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131B2A]'}`}
                      >
                        <img src={wp.url} alt={wp.name} className="w-full h-8 object-cover rounded-lg mb-0.5" />
                        <span className="text-[9px] font-bold block truncate">{wp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outer Color, Opacity & Blur Controls */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">สีพื้นหลังจอใหญ่</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={globalBgColor}
                        onChange={(e) => setGlobalBgColor(e.target.value)}
                        className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={globalBgColor}
                        onChange={(e) => setGlobalBgColor(e.target.value)}
                        className="flex-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">โหมดแสดงผล</label>
                    <select
                      value={globalBgMode}
                      onChange={(e) => setGlobalBgMode(e.target.value as any)}
                      className="w-full px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                    >
                      <option value="cover">เต็มจอ (Cover)</option>
                      <option value="fixed">ล็อกนิ่ง (Fixed Parallax)</option>
                      <option value="contain">พอดีขนาดภาพ (Contain)</option>
                      <option value="repeat">ลวดลายซ้ำ (Repeat)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      ความสว่างภาพจอใหญ่ ({globalBgOpacity}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={globalBgOpacity}
                      onChange={(e) => setGlobalBgOpacity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      ความเบลอภาพจอใหญ่ ({globalBgBlur}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={globalBgBlur}
                      onChange={(e) => setGlobalBgBlur(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* 📱 COLUMN 2: INNER MOBILE CONTAINER BACKGROUND (จอเล็กด้านใน) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border-2 border-emerald-500/40 space-y-3.5 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white">
                        2. ภาพพื้นหลังจอเล็กด้านใน (Inner Mobile Container)
                      </h5>
                      <span className="text-[9px] text-slate-400">แสดงเฉพาะภายในกรอบมือถือ / คอนเทนต์เซลเพจ</span>
                    </div>
                  </div>
                  {innerBgImage && (
                    <button
                      type="button"
                      onClick={() => setInnerBgImage('')}
                      className="text-[10px] text-rose-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>ลบรูป</span>
                    </button>
                  )}
                </div>

                {/* Inner Image Uploader */}
                <ImageUploaderBox
                  label="อัปโหลดภาพพื้นหลังสำหรับกล่องมือถือด้านใน (Texture / Pattern / กราฟิก)"
                  value={innerBgImage}
                  onChange={(url) => setInnerBgImage(url)}
                  uploadImageFile={uploadAiProductImage}
                  uploadingImage={uploadingImage}
                  setUploadingImage={setUploadingImage}
                  aspect="aspect-[16/9]"
                />

                {/* 6 Curated Inner Presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 block">
                    หรือเลือกลวดลายจอเล็กสำเร็จรูป (1-Click Inner Textures):
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { name: '🏛️ หินอ่อนดำ', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
                      { name: '🌌 ละอองดาว', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80' },
                      { name: '🌿 การ์เดนคลีน', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80' },
                      { name: '💎 กลิตเตอร์', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
                      { name: '🌸 ซากุระไลท์', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' },
                      { name: '🌅 ทองคำออร่า', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
                    ].map((wp) => (
                      <div
                        key={wp.name}
                        onClick={() => setInnerBgImage(wp.url)}
                        className={`p-1 rounded-xl border text-center cursor-pointer transition transform hover:scale-105 ${innerBgImage === wp.url ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131B2A]'}`}
                      >
                        <img src={wp.url} alt={wp.name} className="w-full h-8 object-cover rounded-lg mb-0.5" />
                        <span className="text-[9px] font-bold block truncate">{wp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inner Mode & Sliders */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">โหมดแสดงผลจอเล็ก</label>
                    <select
                      value={innerBgMode}
                      onChange={(e) => setInnerBgMode(e.target.value as any)}
                      className="w-full px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                    >
                      <option value="cover">เต็มกรอบ (Cover)</option>
                      <option value="contain">พอดีขนาดภาพ (Contain)</option>
                      <option value="repeat">ลวดลายซ้ำ (Repeat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      ความสว่างภาพจอเล็ก ({innerBgOpacity}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={innerBgOpacity}
                      onChange={(e) => setInnerBgOpacity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    ความเบลอภาพจอเล็ก ({innerBgBlur}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={innerBgBlur}
                    onChange={(e) => setInnerBgBlur(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
      {/* 1. CONFIRMATION MODAL: 990 POINTS DEDUCTION & PUBLISH */}
      {isConfirmSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2A] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    ยืนยันการบันทึกเซลเพจ
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light">
                    ระบบจะหักแต้มและเพิ่มโควตาเซลเพจให้อัตโนมัติ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmSaveModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Page Preview Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-bold">ชื่อเซลเพจ:</span>
                <span className="font-black text-slate-900 dark:text-white truncate max-w-[200px]">{pageTitle || 'เซลเพจใหม่'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-bold">ลิงก์ URL ปลายทาง:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">/c/{pageSlug || 'my-slug'}</span>
              </div>
            </div>

            {/* Points & Quota Breakdown Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">🪙 แต้มปัจจุบันของคุณ:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{confirmingPoints.toLocaleString()} แต้ม</span>
              </div>
              
              <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>⚡ ค่าบริการบันทึกเซลเพจ:</span>
                <span className="font-mono font-black text-sm">-990 แต้ม</span>
              </div>

              <div className="border-t border-amber-500/20 pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">💰 แต้มคงเหลือหลังบันทึก:</span>
                <span className={`font-mono font-black text-sm ${confirmingPoints >= 990 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                  {Math.max(0, confirmingPoints - 990).toLocaleString()} แต้ม
                </span>
              </div>

              <div className="border-t border-amber-500/20 pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">📦 โควตาเซลเพจที่จะได้รับ:</span>
                <span className="font-mono font-black text-purple-600 dark:text-purple-400">
                  +1 ช่อง (โควตารวม {confirmingSlots + 1} ช่อง)
                </span>
              </div>
            </div>

            {/* Warning if insufficient points */}
            {confirmingPoints < 990 ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>แต้มของคุณไม่เพียงพอ (ต้องการ 990 แต้ม, ขาดอีก {(990 - confirmingPoints).toLocaleString()} แต้ม)</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="/dashboard?tab=points"
                    target="_blank"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs text-center shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    เติมแต้มในแดชบอร์ด ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsConfirmSaveModalOpen(false)}
                    className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            ) : (
              /* Action Buttons: Confirm (ตกลง) & Cancel (ยกเลิก) */
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmSaveModalOpen(false)}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={executeSaveSalepage}
                  disabled={saving}
                  style={{ backgroundColor: globalThemeColor }}
                  className="flex-1 py-3 rounded-2xl text-white font-black text-xs shadow-xl shadow-purple-500/25 hover:opacity-90 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ตกลง (หัก 990 แต้ม)</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 2. SUCCESS MODAL: PUBLISHED & POINTS DEDUCTED */}
      {saveSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2A] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 text-center">
            
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                🎉 บันทึกและเผยแพร่เซลเพจสำเร็จ!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1">
                ระบบได้บันทึกโครงสร้าง 13 บล็อก และเผยแพร่หน้าเซลเพจเรียบร้อยแล้ว
              </p>
            </div>

            {/* Transaction Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">⚡ แต้มที่ถูกหัก:</span>
                <span className="font-mono font-black text-amber-600 dark:text-amber-400">-{saveSuccessData.deducted.toLocaleString()} แต้ม</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">💰 แต้มคงเหลือ:</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{saveSuccessData.remaining.toLocaleString()} แต้ม</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">📦 โควตาเซลเพจที่ได้รับ:</span>
                <span className="font-mono font-black text-purple-600 dark:text-purple-400">+1 ช่อง (โควตารวม {saveSuccessData.totalSlots} ช่อง)</span>
              </div>
              <div className="border-t border-slate-200/60 dark:border-slate-800 pt-2 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">🔗 ลิงก์หน้าจริง:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">/c/{saveSuccessData.slug}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSaveSuccessData(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition cursor-pointer"
              >
                ปิด
              </button>
              <a
                href={`/c/${saveSuccessData.slug}`}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: globalThemeColor }}
                className="flex-1 py-3 rounded-2xl text-white font-black text-xs shadow-xl shadow-purple-500/25 hover:opacity-90 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>เปิดดูหน้าจริง ↗</span>
              </a>
            </div>

          </div>
        </div>
      )}


      {/* WIX-STYLE BLOCK CATALOG MODAL */}
      {isAddBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#131B2A] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  เลือกเพิ่มส่วนประกอบในเซลเพจ (Component Catalog)
                </h3>
              </div>
              <button
                onClick={() => setIsAddBlockModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-light">
              แตะที่ส่วนประกอบเพื่อแทรกเข้าไปในหน้าเซลเพจของคุณ คุณสามารถสลับตำแหน่งหรือลบออกได้ตลอดเวลา
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                { type: 'navbar', label: 'Navigation Bar', desc: 'แถบเมนูและแบรนด์ด้านบน (10 สไตล์ UI)', icon: Compass, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
                { type: 'countdown', label: 'Flash Sale Timer', desc: 'แถบนับถอยหลังโปรโมชั่น (10 สไตล์ UI)', icon: Flame, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
                { type: 'hero', label: 'Hero & Headline', desc: 'พาดหัว Hook & รูปสินค้า (10 สไตล์ UI)', icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
                { type: 'pricing', label: 'Offer & Pricing', desc: 'กล่องราคาและของแถม (10 สไตล์ UI)', icon: Tag, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
                { type: 'gallery', label: 'Photo Gallery', desc: 'แกลเลอรีรูปภาพสินค้า (10 สไตล์ UI)', icon: ImageIcon, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' },
                { type: 'pain_points', label: 'Pain Points (ปัญหา)', desc: 'ขยี้ปัญหาที่ลูกค้าเจอ ❌ (10 สไตล์ UI)', icon: X, color: 'text-red-500 bg-red-50 dark:bg-red-950/40' },
                { type: 'benefits', label: 'Benefits (ทางออก)', desc: 'จุดเด่นและผลลัพธ์ ✅ (10 สไตล์ UI)', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
                { type: 'reviews', label: 'Customer Reviews', desc: 'รีวิว 5 ดาว & อัลบั้มลูกค้า (10 สไตล์ UI)', icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/40' },
                { type: 'faq', label: 'FAQ คำถามที่พบบ่อย', desc: 'เคลียร์ข้อสงสัยปิดการขาย (10 สไตล์ UI)', icon: HelpCircle, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
                { type: 'checkout', label: 'PromptPay & COD Form', desc: 'ฟอร์มชำระเงิน QR ยอดตรง (10 สไตล์ UI)', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
                { type: 'guarantee', label: 'Guarantee Badge', desc: 'ตรารับประกันความพึงพอใจ (10 สไตล์ UI)', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
                { type: 'sticky_cta', label: 'Sticky Bottom CTA', desc: 'ปุ่มลอยติดขอบล่าง (10 สไตล์ UI)', icon: ShoppingBag, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
                { type: 'story', label: 'Brand Story / Article', desc: 'กล่องบทความและเรื่องเล่า (10 สไตล์ UI)', icon: FileText, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.type}
                    onClick={() => handleAddBlock(item.type as any)}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 bg-slate-50 dark:bg-slate-900/60 cursor-pointer transition active:scale-95 space-y-2 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition">
                        {item.label}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-400 font-light">{item.desc}</p>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      )}

      {/* AI SALEPAGE AUDIT & CRO OPTIMIZER MODAL */}
      {isAiAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#131B2A] rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>AI วิเคราะห์และตรวจสอบคุณภาพเซลเพจ</span>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full">
                      Real AI Engine
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-light">
                    ตรวจสอบประสิทธิภาพการปิดการขาย (Conversion Rate), พาดหัว Hook, และความน่าเชื่อถือ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiAuditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {aiAuditLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-10 h-10 animate-spin text-purple-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">AI กำลังวิเคราะห์โครงสร้างเซลเพจของคุณ...</h4>
                  <p className="text-xs text-slate-400">กำลังตรวจสอบพาดหัว ข้อเสนอ ราคา และจุดกระตุ้นยอดขาย</p>
                </div>
              </div>
            ) : aiAuditResult ? (
              <div className="space-y-4 text-xs">
                
                {/* Overall Score Dashboard Card */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border-2 border-purple-500/50 flex flex-col items-center justify-center shrink-0">
                      <span className="text-2xl font-black font-mono text-purple-400">{aiAuditResult.overallScore}</span>
                      <span className="text-[8px] text-slate-400 font-mono">/ 100</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-purple-300 uppercase tracking-widest block">OVERALL CONVERSION SCORE</span>
                      <h4 className="text-sm font-black text-white">
                        {aiAuditResult.overallScore >= 85 ? '🌟 พร้อมยิงแอดสร้างยอดขายระดับสูง' : '⚡ ดีมาก - ปรับอีกนิดเพื่อผลลัพธ์สูงสุด'}
                      </h4>
                      <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">{aiAuditResult.summaryAdvice}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAiAudit}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>วิเคราะห์ใหม่</span>
                  </button>
                </div>

                {/* 3 Metric Score Bars */}
                <div className="grid grid-cols-3 gap-2 text-center font-bold text-[10px]">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">🎯 Hook & พาดหัว</span>
                    <span className="text-sm font-black font-mono text-purple-600 dark:text-purple-400">{aiAuditResult.headlineScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">💰 ข้อเสนอ & ราคา</span>
                    <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">{aiAuditResult.offerScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">🛡️ ความน่าเชื่อถือ</span>
                    <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">{aiAuditResult.trustScore}%</span>
                  </div>
                </div>

                {/* Strengths & Improvement Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  
                  {/* Strengths */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>จุดแข็งของเซลเพจ (Key Strengths)</span>
                    </span>
                    <div className="space-y-1.5 text-[10px] text-slate-700 dark:text-slate-300">
                      {aiAuditResult.strengths?.map((st: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span className="leading-relaxed">{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>ข้อแนะนำในการเพิ่มยอดขาย (CRO Tips)</span>
                    </span>
                    <div className="space-y-1.5 text-[10px] text-slate-700 dark:text-slate-300">
                      {aiAuditResult.improvements?.map((imp: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span className="leading-relaxed">{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* AI-Generated High-Converting Headlines */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4" />
                      <span>พาดหัวทรงพลังที่ AI แนะนำ (คลิกเพื่อนำไปใช้ทันที):</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Urgent Style */}
                    {aiAuditResult.suggestedHeadlines?.urgent && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold text-rose-500 block">สไตล์เร่งด่วน (Urgent & Scarcity):</span>
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">{aiAuditResult.suggestedHeadlines.urgent}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyAiHeadline(aiAuditResult.suggestedHeadlines.urgent, aiAuditResult.suggestedSubheadline)}
                          className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold cursor-pointer shrink-0 transition"
                        >
                          นำไปใช้
                        </button>
                      </div>
                    )}

                    {/* Luxury Style */}
                    {aiAuditResult.suggestedHeadlines?.luxury && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold text-amber-500 block">สไตล์พรีเมียม (Luxury & Premium):</span>
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">{aiAuditResult.suggestedHeadlines.luxury}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyAiHeadline(aiAuditResult.suggestedHeadlines.luxury, aiAuditResult.suggestedSubheadline)}
                          className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold cursor-pointer shrink-0 transition"
                        >
                          นำไปใช้
                        </button>
                      </div>
                    )}

                    {/* Social Proof Style */}
                    {aiAuditResult.suggestedHeadlines?.socialProof && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold text-emerald-500 block">สไตล์รีวิวยอดฮิต (Social Proof):</span>
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">{aiAuditResult.suggestedHeadlines.socialProof}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyAiHeadline(aiAuditResult.suggestedHeadlines.socialProof, aiAuditResult.suggestedSubheadline)}
                          className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold cursor-pointer shrink-0 transition"
                        >
                          นำไปใช้
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

      {/* SUCCESS PUBLISHED MODAL */}
      {saveSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2A] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                เผยแพร่ Custom Salepage สำเร็จ!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                เซลเพจสไตล์ Wix ของคุณพร้อมออนไลน์และรับออเดอร์แล้ว
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">ลิงก์เซลเพจสาธารณะของคุณ:</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 truncate">
                  {publicLiveUrl}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publicLiveUrl)
                    setCopiedUrl(true)
                    setTimeout(() => setCopiedUrl(false), 2000)
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shrink-0 hover:bg-purple-700 cursor-pointer"
                >
                  {copiedUrl ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={publicLiveUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-2xl bg-[#1E1B4B] dark:bg-slate-800 hover:bg-purple-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดดูหน้าจริง</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSaveSuccess(false)
                  router.push('/dashboard?tab=services')
                }}
                className="py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer"
              >
                กลับสู่แดชบอร์ด
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
