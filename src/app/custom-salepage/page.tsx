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
      setIsConfirmSaveModalOpen(false)
      setSaveSuccess(true)

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

      {/* API SETTINGS DRAWER */}
      {isApiSettingsOpen && (
        <div className="bg-white dark:bg-[#131B2A] border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">ตั้งค่า LINE Messaging API & Tracking Pixels</h4>
                  <p className="text-[11px] text-slate-500">รับแจ้งเตือนคำสั่งซื้อพร้อมสลิปเข้า LINE OA ทันที และติดตั้ง Pixel วัดผลแอด</p>
                </div>
              </div>
              <button
                onClick={() => setIsApiSettingsOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
              >
                ปิด
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">LINE Channel Access Token</label>
                <input
                  type="password"
                  value={lineChannelToken}
                  onChange={(e) => setLineChannelToken(e.target.value)}
                  placeholder="Token จาก LINE Developers"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">LINE User ID / Channel ID</label>
                <input
                  type="text"
                  value={lineUserId}
                  onChange={(e) => setLineUserId(e.target.value)}
                  placeholder="U123456789..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Meta / Facebook Pixel ID</label>
                <input
                  type="text"
                  value={fbPixelId}
                  onChange={(e) => setFbPixelId(e.target.value)}
                  placeholder="123456789..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={tiktokPixelId}
                  onChange={(e) => setTiktokPixelId(e.target.value)}
                  placeholder="C123456..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WIX MODULAR WORKSPACE: LEFT (SECTION MANAGER) & RIGHT (CANVAS) */}
      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 items-start">
        
        {/* LEFT COLUMN: SECTION LIST & BLOCK CONTROLS */}
        <div className={`space-y-4 lg:col-span-7 ${activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
          
          {/* 0. DEDICATED SALEPAGE URL SLUG & TITLE EDITOR CARD (/c/[sub]) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  ตั้งค่าชื่อและลิงก์ URL ปลายทาง (/c/[sub])
                </h3>
              </div>
              <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-bold px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                ✨ Route: /c/
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  ชื่อหน้าเซลเพจ (Page Title) *
                </label>
                <input
                  type="text"
                  required
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="เช่น ปังปิ้งเตาถ่าน ปุ๊น ปุ๊น หรือ Amanita Thailand"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                    ลิงก์ URL ปลายทาง (/c/[sub]) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const auto = pageTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'product'
                      setPageSlug(auto + '-' + Math.floor(100 + Math.random() * 900))
                    }}
                    className="text-[9px] text-purple-600 dark:text-purple-400 hover:underline font-bold"
                  >
                    สร้างจากชื่อ
                  </button>
                </div>

                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 focus-within:border-purple-500">
                  <span className="text-slate-400 text-xs font-mono select-none">
                    /c/
                  </span>
                  <input
                    type="text"
                    required
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    placeholder="enter-the-amanita-th-775"
                    style={{ color: globalThemeColor }}
                    className="w-full bg-transparent text-xs font-mono font-black focus:outline-none pl-1"
                  />
                </div>
              </div>
            </div>

            <div suppressHydrationWarning className="flex items-center justify-between pt-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span suppressHydrationWarning className="truncate">
                🔗 ลิงก์จริง: <span suppressHydrationWarning className="font-bold text-emerald-600 dark:text-emerald-400">{mounted && originUrl ? `${originUrl}/c/${pageSlug || 'your-sub'}` : `/c/${pageSlug || 'your-sub'}`}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/c/${pageSlug}`
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(fullUrl)
                    alert('คัดลอกลิงก์ /c/' + pageSlug + ' เรียบร้อยแล้ว!')
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold shrink-0 transition"
              >
                คัดลอกลิงก์
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                โครงสร้างส่วนประกอบของหน้า ({sections.length} Blocks)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddBlockModalOpen(true)}
                style={{ backgroundColor: globalThemeColor }}
                className="px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มส่วนประกอบ</span>
              </button>
            </div>
          </div>

          {/* EMPTY CANVAS STATE */}
          {sections.length === 0 ? (
            <div className="bg-white dark:bg-[#131B2A] rounded-3xl p-8 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shadow-inner">
                <LayoutTemplate className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-black text-slate-900 dark:text-white">หน้าว่างเปล่า (Blank Canvas)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  ขณะนี้ยังไม่มีส่วนประกอบใดๆ ในหน้าเว็บ คุณสามารถเลือกเพิ่มเฉพาะส่วนที่ต้องการได้เหมือน Wix
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setIsAddBlockModalOpen(true)}
                  style={{ backgroundColor: globalThemeColor }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-white text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ เพิ่มส่วนประกอบแรกของคุณ</span>
                </button>
                <button
                  onClick={loadStarterTemplate}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-purple-600" />
                  <span>โหลดเทมเพลตเริ่มต้น (Starter)</span>
                </button>
              </div>
            </div>
          ) : (
            /* LIST OF SECTIONS / BLOCKS */
            <div className="space-y-3">
              {sections.map((section, index) => {
                const isSelected = selectedSectionId === section.id
                return (
                  <div
                    key={section.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'border-purple-500 bg-white dark:bg-[#131B2A] shadow-md ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#131B2A]/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Section Summary Row */}
                    <div className="p-3.5 flex items-center justify-between gap-2">
                      <div
                        onClick={() => setSelectedSectionId(isSelected ? null : section.id)}
                        className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {section.title}
                            </h4>
                            <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                              {section.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">
                            สไตล์: {section.layoutStyle || 'มาตรฐาน'} {!section.visible && '(ซ่อนอยู่)'}
                          </p>
                        </div>
                      </div>

                      {/* Section Action Icons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          title="ย้ายขึ้น"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sections.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          title="ย้ายลง"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleVisible(section.id)}
                          className={`p-1.5 rounded-lg cursor-pointer ${section.visible ? 'text-slate-400 hover:text-purple-600' : 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'}`}
                          title={section.visible ? 'ซ่อนส่วนนี้' : 'แสดงส่วนนี้'}
                        >
                          {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(section)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 cursor-pointer"
                          title="ทำซ้ำ (Duplicate)"
                        >
                          <CopyPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="ลบส่วนนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSectionId(isSelected ? null : section.id)}
                          className="p-1.5 rounded-lg text-purple-600 font-bold text-xs cursor-pointer"
                        >
                          {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED SECTION DETAIL CONTROLS */}
                    {isSelected && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs animate-in fade-in duration-150">
                        
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">ชื่อเรียกส่วนนี้</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleUpdateSectionField(section.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                          />
                        </div>

                        {/* 10 DISTINCT VISUAL LAYOUT OPTION CARDS */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            ✨ เลือกรูปแบบหน้าตา UI (มีให้เลือก 10 สไตล์ UI ระดับมืออาชีพ)
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            
                            {/* 1. NAVBAR (10 VARIANTS) */}
                            {section.type === 'navbar' && (
                              <>
                                <LayoutOptionCard title="1. Glassmorphism Pill Dock" desc="แถบลอยโปร่งใส โค้งมน สไตล์ iOS App Dock" icon={Compass} isSelected={section.layoutStyle === 'floating_glass'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'floating_glass')} />
                                <LayoutOptionCard title="2. Brand Header Banner" desc="แถบเต็มสไตล์ลักชูรี เน้นโลโก้ใหญ่ + ปุ่มโทรด่วน" icon={LayoutTemplate} isSelected={section.layoutStyle === 'brand_header_banner'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'brand_header_banner')} />
                                <LayoutOptionCard title="3. Minimal Sticky Ticker" desc="แถบมินิมอลติดขอบบน พร้อมตัววิ่งโปรโมชั่น" icon={SlidersHorizontal} isSelected={section.layoutStyle === 'minimal_sticky_ticker'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_sticky_ticker')} />
                                <LayoutOptionCard title="4. Cyber Neon HUD" desc="แถบไซเบอร์นีออน ขอบเรืองแสงพร้อมไฟสถานะ" icon={Zap} isSelected={section.layoutStyle === 'cyber_neon_hud'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'cyber_neon_hud')} />
                                <LayoutOptionCard title="5. Clean White Minimalist" desc="แถบขาวสะอาดตา เส้นขอบคมชัด สไตล์โมเดิร์น" icon={Square} isSelected={section.layoutStyle === 'clean_white_border'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'clean_white_border')} />
                                <LayoutOptionCard title="6. Split 2-Tone Action Bar" desc="แบ่ง 2 ฝั่ง โลโก้ซ้าย ปุ่มสั่งซื้อไล่เฉดสีขวา" icon={Percent} isSelected={section.layoutStyle === 'split_brand_cta'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_brand_cta')} />
                                <LayoutOptionCard title="7. Gradient Glow Strip" desc="แถบขอบบนเปล่งประกายสีนีออนพร้อมป้ายสินค้า" icon={Flame} isSelected={section.layoutStyle === 'gradient_accent_strip'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'gradient_accent_strip')} />
                                <LayoutOptionCard title="8. Centered Iconic Circle" desc="โลโก้วงกลมกึ่งกลางสไตล์แบรนด์เสื้อผ้าชั้นนำ" icon={Crown} isSelected={section.layoutStyle === 'centered_logo_dock'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'centered_logo_dock')} />
                                <LayoutOptionCard title="9. Emergency Alert Ribbon" desc="แถบริบบิ้นแจ้งเตือนโปรไฟลุกพร้อมปุ่มเร่งด่วน" icon={AlertTriangle} isSelected={section.layoutStyle === 'emergency_top_bar'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'emergency_top_bar')} />
                                <LayoutOptionCard title="10. Transparent Overlay Dock" desc="แถบโปร่งแสงไร้รอยต่อ กลืนเข้ากับภาพ Hero" icon={Eye} isSelected={section.layoutStyle === 'transparent_overlay'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'transparent_overlay')} />
                              </>
                            )}

                            {/* 2. HERO (10 VARIANTS) */}
                            {section.type === 'hero' && (
                              <>
                                <LayoutOptionCard title="1. ScrollFloat React Bits Hero" desc="พาดหัวลอยตัวแอนิเมชันตัวอักษร ScrollFloat สุดลื่นไหล" icon={Sparkles} isSelected={section.layoutStyle === 'scroll_float_animated'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'scroll_float_animated')} />
                                <LayoutOptionCard title="2. Spotlight Media Banner" desc="พาดหัวตรงกลาง การ์ดสินค้าใหญ่ + ชิปตราสัญลักษณ์" icon={LayoutTemplate} isSelected={section.layoutStyle === 'centered_media_spotlight'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'centered_media_spotlight')} />
                                <LayoutOptionCard title="3. Split 50/50 Modern Card" desc="ข้อความซ้าย + การ์ดสินค้า 3D ลอยตัวขวา" icon={Boxes} isSelected={section.layoutStyle === 'split_50_50_card'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_50_50_card')} />
                                <LayoutOptionCard title="4. Cinema Video Showcase" desc="เครื่องเล่นวิดีโอ 16:9 ขนาดใหญ่ พร้อมดาวรีวิว" icon={Film} isSelected={section.layoutStyle === 'video_cinema_player'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'video_cinema_player')} />
                                <LayoutOptionCard title="5. Editorial Magazine Cover" desc="สไตล์ปกนิตยสารลักชูรี ภาพเต็มจอพร้อมข้อความทับซ้อน" icon={FileText} isSelected={section.layoutStyle === 'editorial_magazine_cover'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'editorial_magazine_cover')} />
                                <LayoutOptionCard title="6. Certified Product Showcase" desc="เน้นตราสัญลักษณ์รับรอง อย. และความน่าเชื่อถือเด่นชัด" icon={BadgeCheck} isSelected={section.layoutStyle === 'badge_highlight_focus'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'badge_highlight_focus')} />
                                <LayoutOptionCard title="7. Side-by-Side 3-Point Hero" desc="ภาพสินค้าคู่กับ 3 จุดเด่นสรุปย่ออ่านจบใน 3 วินาที" icon={CheckCheck} isSelected={section.layoutStyle === 'side_by_side_benefits'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'side_by_side_benefits')} />
                                <LayoutOptionCard title="8. Flash Voucher Hero Box" desc="ภาพสินค้าพร้อมตราประทับโค้ดคูปองส่วนลดพิเศษ" icon={Gift} isSelected={section.layoutStyle === 'voucher_hero_banner'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'voucher_hero_banner')} />
                                <LayoutOptionCard title="9. Modern Minimal Clean Hero" desc="ตัวหนังสือสไตล์โมเดิร์นคลีน ไร้สิ่งรบกวนสายตา" icon={Square} isSelected={section.layoutStyle === 'minimal_clean_hero'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_clean_hero')} />
                                <LayoutOptionCard title="10. Dark Luxury Obsidian Hero" desc="ความหรูหราสีดำสเลต ขอบทองนีออนสุดพรีเมียม" icon={Crown} isSelected={section.layoutStyle === 'dark_luxury_obsidian'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'dark_luxury_obsidian')} />
                              </>
                            )}

                            {/* 3. COUNTDOWN (10 VARIANTS) */}
                            {section.type === 'countdown' && (
                              <>
                                <LayoutOptionCard title="1. Urgent Flame Bar" desc="แถบไฟกระพริบด่วน พร้อมเวลานับถอยหลัง" icon={Flame} isSelected={section.layoutStyle === 'urgent_flame_ticker'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'urgent_flame_ticker')} />
                                <LayoutOptionCard title="2. Floating Coupon Voucher" desc="กล่องคูปองโค้ดส่วนลดทรงตั๋วขอบปรุ พร้อมปุ่มกดรับสิทธิ์" icon={Gift} isSelected={section.layoutStyle === 'floating_voucher_pill'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'floating_voucher_pill')} />
                                <LayoutOptionCard title="3. Cyberpunk Stock HUD" desc="แถบนับถอยหลังดิจิทัล พร้อมแถบแจ้งจำนวนสินค้าที่เหลือ" icon={Zap} isSelected={section.layoutStyle === 'neon_cyber_counter'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'neon_cyber_counter')} />
                                <LayoutOptionCard title="4. Minimal Dark Stopwatch" desc="นาฬิกาจับเวลาดิจิทัลสีดำเรียบหรู" icon={Clock} isSelected={section.layoutStyle === 'minimal_dark_clock'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_dark_clock')} />
                                <LayoutOptionCard title="5. Split Deal of the Day" desc="ข้อความดีลพิเศษซ้าย กล่องตัวเลขใหญ่นับถอยหลังขวา" icon={Calendar} isSelected={section.layoutStyle === 'split_deal_timer'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_deal_timer')} />
                                <LayoutOptionCard title="6. Glowing Radiant Ribbon" desc="ริบบิ้นเรืองแสงแอนิเมชันชีพจรสะกดสายตา" icon={Activity} isSelected={section.layoutStyle === 'glowing_ribbon_bar'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'glowing_ribbon_bar')} />
                                <LayoutOptionCard title="7. Clean White Card Counter" desc="กล่องนับถอยหลังสไตล์คลีนการ์ดสีสว่าง" icon={Square} isSelected={section.layoutStyle === 'clean_white_counter'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'clean_white_counter')} />
                                <LayoutOptionCard title="8. Pill Floating Mini Dock" desc="กล่องทรงแคปซูลโค้งมนลอยตัวกะทัดรัด" icon={Compass} isSelected={section.layoutStyle === 'pill_floating_dock'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'pill_floating_dock')} />
                                <LayoutOptionCard title="9. Fire Sale Marquee Banner" desc="ตัววิ่งข้อความลดกระหน่ำพร้อมไอคอนไฟลุก" icon={FlameKindling} isSelected={section.layoutStyle === 'fire_sale_marquee'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'fire_sale_marquee')} />
                                <LayoutOptionCard title="10. VIP Limited Access Lock" desc="ป้ายเตือนสิทธิ์พิเศษจำกัดเวลาเฉพาะสมาชิกระดับ VIP" icon={Lock} isSelected={section.layoutStyle === 'vip_exclusive_timer'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'vip_exclusive_timer')} />
                              </>
                            )}

                            {/* 4. PRICING (10 VARIANTS) */}
                            {section.type === 'pricing' && (
                              <>
                                <LayoutOptionCard title="1. 3-Tier Comparison Cards" desc="ตาราง 3 แพ็กเกจ (ทดลอง / ขายดี / สุดคุ้ม) คลิกเลือกแล้วยอดเงินคำนวณสด" icon={Boxes} isSelected={section.layoutStyle === '3_tier_comparison_cards'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', '3_tier_comparison_cards')} />
                                <LayoutOptionCard title="2. VIP Highlight Glowing Card" desc="การ์ดราคากล่องเดี่ยวเรืองแสง ตัวเลขใหญ่ชัดเจน" icon={Tag} isSelected={section.layoutStyle === 'luxury_gradient_card'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'luxury_gradient_card')} />
                                <LayoutOptionCard title="3. Split Ticket Discount" desc="สไตล์ตั๋วคูปองลดราคา ฝั่งซ้ายป้ายลด % ฝั่งขวาของแถม" icon={Percent} isSelected={section.layoutStyle === 'split_ticket_discount'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_ticket_discount')} />
                                <LayoutOptionCard title="4. Minimalist Price Pill" desc="ป้ายราคามินิมอลเรียบหรู เน้นความสะอาดตา" icon={CreditCard} isSelected={section.layoutStyle === 'minimal_price_tag'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_price_tag')} />
                                <LayoutOptionCard title="5. Flash Deal Savings Calculator" desc="ราคาขีดฆ่าพร้อมป้ายประหยัดเงินชัดเจน (ประหยัด ฿500)" icon={Coins} isSelected={section.layoutStyle === 'flash_deal_box'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'flash_deal_box')} />
                                <LayoutOptionCard title="6. Buy X Get Y Free Bundle" desc="เน้นของแถมและชุดเซ็ตสุดคุ้มแถมฟรีมาส์กหน้า" icon={Gift} isSelected={section.layoutStyle === 'free_gift_bundle'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'free_gift_bundle')} />
                                <LayoutOptionCard title="7. Cyberpunk Pricing Terminal" desc="กล่องราคาเทคโนโลยีไซเบอร์พร้อมป้าย Verified Price" icon={Zap} isSelected={section.layoutStyle === 'cyber_pricing_terminal'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'cyber_pricing_terminal')} />
                                <LayoutOptionCard title="8. Dual-Option Duo Switcher" desc="ปุ่มสลับเลือก 1 ชุดเดี่ยว หรือ 2 ชุดแพ็กคู่" icon={Layers} isSelected={section.layoutStyle === 'dual_tier_combo'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'dual_tier_combo')} />
                                <LayoutOptionCard title="9. Gold Luxury VIP Member Price" desc="ราคาพิเศษเฉพาะสมาชิกทองคำ พร้อมริบบิ้นรับประกัน" icon={Crown} isSelected={section.layoutStyle === 'gold_luxury_vip'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'gold_luxury_vip')} />
                                <LayoutOptionCard title="10. Compact 1-Tap Price Bar" desc="แถบราคาแบบกระทัดรัดสำหรับมือถือ กดปุ๊บสั่งได้ทันที" icon={ShoppingBag} isSelected={section.layoutStyle === 'compact_one_tap_price'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'compact_one_tap_price')} />
                              </>
                            )}

                            {/* 5. GALLERY (10 VARIANTS) */}
                            {section.type === 'gallery' && (
                              <>
                                <LayoutOptionCard title="1. Featured Hero + Thumbnails" desc="รูปใหญ่หลัก 1 รูป พร้อมแถบรูปย่อยสลับดูภาพได้ทันที" icon={ImageIcon} isSelected={section.layoutStyle === 'featured_hero_thumbnails'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'featured_hero_thumbnails')} />
                                <LayoutOptionCard title="2. Modern 3-Column Grid" desc="ตารางรูปภาพ 3 คอลัมน์ มุมโค้งมนสวยงาม" icon={Grid} isSelected={section.layoutStyle === 'grid_3cols_modern'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'grid_3cols_modern')} />
                                <LayoutOptionCard title="3. Before & After Split" desc="เปรียบเทียบรูปภาพ ก่อนใช้ ❌ vs หลังใช้ 7 วัน ✅" icon={RotateCw} isSelected={section.layoutStyle === 'before_after_split'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'before_after_split')} />
                                <LayoutOptionCard title="4. Masonry Staggered Layout" desc="จัดเรียงรูปภาพสไตล์ Pinterest ไม่เท่ากันอย่างมีศิลปะ" icon={Layers} isSelected={section.layoutStyle === 'masonry_pinterest'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'masonry_pinterest')} />
                                <LayoutOptionCard title="5. 2-Column Large Detail Grid" desc="ตาราง 2 คอลัมน์ภาพขนาดใหญ่ เห็นรายละเอียดชัดเจน" icon={Boxes} isSelected={section.layoutStyle === 'grid_2cols_large'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'grid_2cols_large')} />
                                <LayoutOptionCard title="6. Horizontal Swipe Strip" desc="แถบเลื่อนภาพแนวนอน สไตล์ Instagram Feed" icon={SlidersHorizontal} isSelected={section.layoutStyle === 'horizontal_carousel_strip'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'horizontal_carousel_strip')} />
                                <LayoutOptionCard title="7. Lightbox Zoom Cards" desc="การ์ดภาพพร้อมไอคอนแว่นขยาย ซูมดูเนื้อสัมผัส" icon={Maximize2} isSelected={section.layoutStyle === 'lightbox_zoom_grid'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'lightbox_zoom_grid')} />
                                <LayoutOptionCard title="8. Polaroid Style Prints" desc="กรอบรูปโพลารอยด์ขอบขาวคลาสสิก พร้อมแคปชัน" icon={ImageIcon} isSelected={section.layoutStyle === 'polaroid_stacked_photos'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'polaroid_stacked_photos')} />
                                <LayoutOptionCard title="9. Compact Quad Collage" desc="คอลลาจ 4 ภาพลงตัว สไตล์แกลเลอรีรีวิวสินค้า" icon={Grid} isSelected={section.layoutStyle === 'compact_quad_grid'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'compact_quad_grid')} />
                                <LayoutOptionCard title="10. Editorial Story Photo Spread" desc="เลย์เอาต์นิตยสาร ภาพใหญ่จัดวางสลับข้อความเรื่องเล่า" icon={FileText} isSelected={section.layoutStyle === 'editorial_story_media'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'editorial_story_media')} />
                              </>
                            )}

                            {/* 6. PAIN POINTS (10 VARIANTS) */}
                            {section.type === 'pain_points' && (
                              <>
                                <LayoutOptionCard title="1. Individual Red Cross Cards" desc="การ์ดปัญหาพร้อมไอคอน ❌ ขอบสีแดงเตือนใจ" icon={X} isSelected={section.layoutStyle === 'card_list_cross'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'card_list_cross')} />
                                <LayoutOptionCard title="2. Emergency Warning Banner" desc="กล่องแจ้งเตือนภัยเร่งด่วน พร้อมไอคอน ⚠️" icon={AlertTriangle} isSelected={section.layoutStyle === 'alert_warning_box'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'alert_warning_box')} />
                                <LayoutOptionCard title="3. Strikethrough Frustration List" desc="รายการปัญหาพร้อมเส้นขีดฆ่าความผิดหวังเดิมๆ" icon={Sliders} isSelected={section.layoutStyle === 'strikethrough_checklist'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'strikethrough_checklist')} />
                                <LayoutOptionCard title="4. Problem vs Consequence Split" desc="การ์ดแสดงปัญหาและผลกระทบหากปล่อยทิ้งไว้" icon={AlertCircle} isSelected={section.layoutStyle === 'split_problem_solution'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_problem_solution')} />
                                <LayoutOptionCard title="5. Customer Pain Quote Bubbles" desc="กล่องคำพูดความในใจจากลูกค้าที่เคยเจอปัญหา" icon={MessageCircle} isSelected={section.layoutStyle === 'quote_frustration_bubble'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'quote_frustration_bubble')} />
                                <LayoutOptionCard title="6. Cyber Hazard Warning Box" desc="กล่องไซเบอร์แจ้งเตือนสัญญาณอันตรายสีนีออนแดง" icon={Zap} isSelected={section.layoutStyle === 'dark_cyber_hazard'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'dark_cyber_hazard')} />
                                <LayoutOptionCard title="7. Minimal Clean Red Dot List" desc="จุดวงกลมสีแดงสไตล์มินิมอล กระชับ ตรงประเด็น" icon={Square} isSelected={section.layoutStyle === 'minimal_red_bullet'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_red_bullet')} />
                                <LayoutOptionCard title="8. 90% Encountered Survey Box" desc="สถิติ 90% ของผู้มีปัญหาผิวเจอสิ่งนี้เหมือนกัน" icon={Activity} isSelected={section.layoutStyle === 'survey_poll_style'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'survey_poll_style')} />
                                <LayoutOptionCard title="9. Stop Sign 🛑 Callout Box" desc="ป้ายหยุด! อย่าปล่อยให้ปัญหาผิวทำลายความมั่นใจ" icon={ShieldCheck} isSelected={section.layoutStyle === 'stop_sign_banner'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'stop_sign_banner')} />
                                <LayoutOptionCard title="10. Shield Warning Checklist" desc="โล่เตือนภัยพร้อมรายการตรวจเช็กอาการเบื้องต้น" icon={AlertTriangle} isSelected={section.layoutStyle === 'badge_warning_shield'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'badge_warning_shield')} />
                              </>
                            )}

                            {/* 7. BENEFITS (10 VARIANTS) */}
                            {section.type === 'benefits' && (
                              <>
                                <LayoutOptionCard title="1. Emerald Glowing 3D Cards" desc="การ์ด 3 มิติสีมรกต พร้อมเครื่องหมายถูก ✅ เรืองแสง" icon={CheckCircle2} isSelected={section.layoutStyle === 'emerald_glowing_cards'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'emerald_glowing_cards')} />
                                <LayoutOptionCard title="2. Transformation Timeline" desc="ไทม์ไลน์พัฒนาการ วันที่ 1 ➔ วันที่ 7 ➔ วันที่ 14" icon={Calendar} isSelected={section.layoutStyle === 'timeline_steps'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'timeline_steps')} />
                                <LayoutOptionCard title="3. 3-Box Iconic Feature Grid" desc="ตาราง 3 กล่องคุณสมบัติเด่นพร้อมไอคอนขนาดใหญ่" icon={Boxes} isSelected={section.layoutStyle === '3_box_feature_grid'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', '3_box_feature_grid')} />
                                <LayoutOptionCard title="4. Lab Proven Results Chips" desc="การันตีผลวิจัยจากห้องแล็บ ผ่านการทดสอบระดับสากล" icon={Award} isSelected={section.layoutStyle === 'scientific_results_chips'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'scientific_results_chips')} />
                                <LayoutOptionCard title="5. Dual-Column Solution Checklist" desc="รายการจุดเด่นจัดวาง 2 คอลัมน์ อ่านง่าย สบายตา" icon={CheckCheck} isSelected={section.layoutStyle === 'split_hero_checklist'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_hero_checklist')} />
                                <LayoutOptionCard title="6. VIP Gold Crown Advantages" desc="การ์ดทองคำพรีเมียม พร้อมตราสัญลักษณ์มงกุฎแห่งคุณภาพ" icon={Crown} isSelected={section.layoutStyle === 'gold_crown_benefits'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'gold_crown_benefits')} />
                                <LayoutOptionCard title="7. Minimal High-Contrast List" desc="รายการจุดเด่นมินิมอล ขาวดำคมชัดระดับมืออาชีพ" icon={Square} isSelected={section.layoutStyle === 'minimal_check_modern'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_check_modern')} />
                                <LayoutOptionCard title="8. Expandable Benefit Cards" desc="การ์ดผลลัพธ์พร้อมคำอธิบายกลไกการทำงานลึกซึ้ง" icon={SlidersHorizontal} isSelected={section.layoutStyle === 'accordion_benefit_cards'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'accordion_benefit_cards')} />
                                <LayoutOptionCard title="9. Doctor Endorsed Highlights" desc="เน้นย้ำความปลอดภัยผ่านการรับรองจากผู้เชี่ยวชาญ" icon={HeartHandshake} isSelected={section.layoutStyle === 'guarantee_backed_points'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'guarantee_backed_points')} />
                                <LayoutOptionCard title="10. Ribbon Badged Key Results" desc="กล่องผลลัพธ์ประดับริบบิ้นเกียรติยศแห่งคุณภาพ" icon={BadgeCheck} isSelected={section.layoutStyle === 'badge_ribbon_grid'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'badge_ribbon_grid')} />
                              </>
                            )}

                            {/* 8. REVIEWS (10 VARIANTS) */}
                            {section.type === 'reviews' && (
                              <>
                                <LayoutOptionCard title="1. Verified 5-Star Cards" desc="การ์ดรีวิว 5 ดาว พร้อมรูปประจำตัวและป้ายผู้ซื้อจริง" icon={Star} isSelected={section.layoutStyle === 'rating_cards_5star'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'rating_cards_5star')} />
                                <LayoutOptionCard title="2. Social Chat Bubbles" desc="สไตล์แชทสนทนา LINE / Messenger สั่งซื้อจริง" icon={MessageCircle} isSelected={section.layoutStyle === 'chat_bubble_screenshots'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'chat_bubble_screenshots')} />
                                <LayoutOptionCard title="3. Customer Photo Wall" desc="กำแพงรูปภาพรีวิวจากลูกค้าจริง ถือสินค้าถ่ายรูป" icon={ImageIcon} isSelected={section.layoutStyle === 'photo_review_wall'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'photo_review_wall')} />
                                <LayoutOptionCard title="4. Video Reaction Testimonials" desc="ชิปรีวิวแบบวิดีโอสัมภาษณ์ความประทับใจลูกค้า" icon={Film} isSelected={section.layoutStyle === 'video_testimonial_chips'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'video_testimonial_chips')} />
                                <LayoutOptionCard title="5. Celebrity Spotlight Quote" desc="กล่องคำนิยมเดี่ยวจากคนดัง / อินฟลูเอนเซอร์ชื่อดัง" icon={Crown} isSelected={section.layoutStyle === 'single_spotlight_quote'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'single_spotlight_quote')} />
                                <LayoutOptionCard title="6. 4.9/5 Overall Rating Summary" desc="สรุปคะแนนความพึงพอใจ 4.9 จาก 1,420+ รีวิว" icon={Award} isSelected={section.layoutStyle === 'stats_review_summary'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'stats_review_summary')} />
                                <LayoutOptionCard title="7. Marquee Praise Ticker" desc="ตัววิ่งข้อความชมเชยจากลูกค้าทั่วประเทศตลอดเวลา" icon={SlidersHorizontal} isSelected={section.layoutStyle === 'compact_review_ticker'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'compact_review_ticker')} />
                                <LayoutOptionCard title="8. 2-Column Verified Reviews Grid" desc="ตาราง 2 คอลัมน์การ์ดรีวิวพร้อมวันที่ซื้อชัดเจน" icon={Boxes} isSelected={section.layoutStyle === 'verified_buyer_grid'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'verified_buyer_grid')} />
                                <LayoutOptionCard title="9. Before & After Review Cards" desc="รีวิวพร้อมภาพเปรียบเทียบผลลัพธ์ของลูกค้ารายบุคคล" icon={RotateCw} isSelected={section.layoutStyle === 'before_after_review_cards'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'before_after_review_cards')} />
                                <LayoutOptionCard title="10. Modern Trust Badge Cards" desc="การ์ดสไตล์ Trustpilot พร้อมตราสัญลักษณ์ความน่าเชื่อถือ" icon={ShieldCheck} isSelected={section.layoutStyle === 'trustpilot_style_cards'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'trustpilot_style_cards')} />
                              </>
                            )}

                            {/* 9. FAQ (10 VARIANTS) */}
                            {section.type === 'faq' && (
                              <>
                                <LayoutOptionCard title="1. Accordion Clean Cards" desc="กล่องคำถามพับเก็บได้ เปิด-ปิดสมูท" icon={HelpCircle} isSelected={section.layoutStyle === 'accordion_clean'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'accordion_clean')} />
                                <LayoutOptionCard title="2. 2-Column FAQ Grid" desc="ตาราง 2 คอลัมน์แยกกล่องคำถามและคำตอบชัดเจน" icon={Grid} isSelected={section.layoutStyle === '2_column_faq_grid'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', '2_column_faq_grid')} />
                                <LayoutOptionCard title="3. Q&A Chat Bubbles" desc="สไตล์แชทถาม-ตอบระหว่างลูกค้าและแอดมิน" icon={MessageCircle} isSelected={section.layoutStyle === 'chat_qa_bubbles'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'chat_qa_bubbles')} />
                                <LayoutOptionCard title="4. Numbered Step FAQ" desc="เรียงลำดับคำถาม 1, 2, 3 อ่านง่ายเป็นสัดส่วน" icon={List} isSelected={section.layoutStyle === 'numbered_faq_list'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'numbered_faq_list')} />
                                <LayoutOptionCard title="5. Bordered Minimal Line" desc="เส้นคั่นบางสไตล์มินิมอลโมเดิร์น" icon={Square} isSelected={section.layoutStyle === 'bordered_minimal_faq'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'bordered_minimal_faq')} />
                                <LayoutOptionCard title="6. Cyber Glowing Neon FAQ" desc="การ์ดขอบเรืองแสงนีออนสไตล์เทคโนโลยี" icon={Zap} isSelected={section.layoutStyle === 'glowing_neon_faq'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'glowing_neon_faq')} />
                                <LayoutOptionCard title="7. Help Center Search Box" desc="สไตล์ศูนย์ช่วยเหลือ มีช่องพิมพ์ค้นหาคำตอบ" icon={Compass} isSelected={section.layoutStyle === 'searchable_faq_box'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'searchable_faq_box')} />
                                <LayoutOptionCard title="8. Pill Toggle FAQ" desc="ปุ่มทรงแคปซูลโค้งมนสำหรับกดดูคำตอบ" icon={CheckCircle} isSelected={section.layoutStyle === 'pill_toggle_faq'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'pill_toggle_faq')} />
                                <LayoutOptionCard title="9. Icon Badged Question Box" desc="การ์ดคำถามพร้อมไอคอนหัวข้อดึงดูดสายตา" icon={Tag} isSelected={section.layoutStyle === 'badge_icon_faq'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'badge_icon_faq')} />
                                <LayoutOptionCard title="10. Compact 1-Screen Summary" desc="คำถามและคำตอบแบบกระชับจบในหน้าจอเดียว" icon={Smartphone} isSelected={section.layoutStyle === 'compact_summary_faq'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'compact_summary_faq')} />
                              </>
                            )}

                            {/* 10. CHECKOUT (10 VARIANTS) */}
                            {section.type === 'checkout' && (
                              <>
                                <LayoutOptionCard title="1. Dynamic Dual Checkout" desc="สลับได้ทั้งพร้อมเพย์ QR ยอดตรง และฟอร์มเก็บเงินปลายทาง" icon={CreditCard} isSelected={section.layoutStyle === 'dynamic_promptpay_and_cod'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'dynamic_promptpay_and_cod')} />
                                <LayoutOptionCard title="2. Standalone PromptPay Card" desc="กล่องสแกน QR พร้อมเพย์เด่นชัด พร้อมเลขบัญชีร้านค้า" icon={Zap} isSelected={section.layoutStyle === 'standalone_promptpay_qr_card'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'standalone_promptpay_qr_card')} />
                                <LayoutOptionCard title="3. COD Express Fast Form" desc="ฟอร์มกรอกที่อยู่เก็บเงินปลายทาง ส่งด่วนเสร็จใน 1 นาที" icon={Truck} isSelected={section.layoutStyle === 'cod_express_fast_checkout'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'cod_express_fast_checkout')} />
                                <LayoutOptionCard title="4. VIP Luxury Gold Checkout" desc="ฟอร์มชำระเงินขอบทองหรูหรา สำหรับลูกค้าระดับพรีเมียม" icon={Crown} isSelected={section.layoutStyle === 'vip_luxury_checkout'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'vip_luxury_checkout')} />
                                <LayoutOptionCard title="5. Cyberpunk Terminal Checkout" desc="ฟอร์มไซเบอร์เทอร์มินัล นีออนบลู ปิดการขายทรงพลัง" icon={Zap} isSelected={section.layoutStyle === 'cyber_terminal_checkout'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'cyber_terminal_checkout')} />
                                <LayoutOptionCard title="6. 1-Screen Compact Mobile Box" desc="ฟอร์มสั่งซื้อกะทัดรัดจบในหน้าเดียว ไม่ต้องเลื่อนเยอะ" icon={Smartphone} isSelected={section.layoutStyle === 'compact_mini_checkout'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'compact_mini_checkout')} />
                                <LayoutOptionCard title="7. Split Order Summary Form" desc="สรุปรายการสั่งซื้อซ้าย ฟอร์มกรอกข้อมูลและชำระเงินขวา" icon={Boxes} isSelected={section.layoutStyle === 'split_order_summary_form'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_order_summary_form')} />
                                <LayoutOptionCard title="8. 2-Step Smooth Wizard" desc="ขั้นตอนที่ 1 เลือกสินค้า ➔ ขั้นตอนที่ 2 ชำระเงิน" icon={SlidersHorizontal} isSelected={section.layoutStyle === 'step_by_step_wizard_form'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'step_by_step_wizard_form')} />
                                <LayoutOptionCard title="9. Bank Transfer & QR Combo" desc="รองรับทั้งสแกน QR และโอนผ่านเลขบัญชีธนาคารตรง" icon={Coins} isSelected={section.layoutStyle === 'card_bank_transfer_form'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'card_bank_transfer_form')} />
                                <LayoutOptionCard title="10. Elevated Floating Card Form" desc="กล่องฟอร์มลอยตัวพร้อมเงา 3D ดึงดูดให้ลูกค้ากดสั่งซื้อ" icon={LayoutTemplate} isSelected={section.layoutStyle === 'floating_checkout_card'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'floating_checkout_card')} />
                              </>
                            )}

                            {/* 11. GUARANTEE (10 VARIANTS) */}
                            {section.type === 'guarantee' && (
                              <>
                                <LayoutOptionCard title="1. Shield Ribbon Golden Badge" desc="โล่ทองคำประดับริบบิ้นการันตีของแท้ 100%" icon={ShieldCheck} isSelected={section.layoutStyle === 'ribbon_badge'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'ribbon_badge')} />
                                <LayoutOptionCard title="2. 100% Money Back 14 Days" desc="กล่องคืนเงิน 100% ภายใน 14 วัน ไม่พอใจยินดีคืนเงิน" icon={Coins} isSelected={section.layoutStyle === 'money_back_100'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'money_back_100')} />
                                <LayoutOptionCard title="3. Authentic Seal Stamp" desc="ตราประทับตรายางรับประกันความพึงพอใจ" icon={Award} isSelected={section.layoutStyle === 'seal_stamp'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'seal_stamp')} />
                                <LayoutOptionCard title="4. FDA Certified Pill" desc="ป้ายรับรองมาตรฐาน อย. และสากล" icon={BadgeCheck} isSelected={section.layoutStyle === 'fda_certified_pill'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'fda_certified_pill')} />
                                <LayoutOptionCard title="5. Cyber Security HUD" desc="กล่องไซเบอร์การันตีความปลอดภัย SSL 256-bit" icon={Lock} isSelected={section.layoutStyle === 'cyber_verified_hud'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'cyber_verified_hud')} />
                                <LayoutOptionCard title="6. Clean White Shield" desc="การ์ดขาวสะอาดตา โล่รับประกันความมั่นใจ" icon={Square} isSelected={section.layoutStyle === 'clean_white_shield'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'clean_white_shield')} />
                                <LayoutOptionCard title="7. 3-Point Guarantee Breakdown" desc="สรุปเงื่อนไขรับประกัน 3 ข้อ: แท้ คืนไว ปลอดภัย" icon={CheckCheck} isSelected={section.layoutStyle === 'split_guarantee_terms'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_guarantee_terms')} />
                                <LayoutOptionCard title="8. Trust Lock Banner" desc="แถบรับรองการชำระเงินปลอดภัยและส่งไว" icon={ShieldCheck} isSelected={section.layoutStyle === 'trust_lock_banner'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'trust_lock_banner')} />
                                <LayoutOptionCard title="9. Doctor Certified Signature" desc="การ์ดรับรองจากผู้เชี่ยวชาญพร้อมช่องลายเซ็น" icon={HeartHandshake} isSelected={section.layoutStyle === 'doctor_signature_card'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'doctor_signature_card')} />
                                <LayoutOptionCard title="10. Compact Golden Strip" desc="แถบริบบิ้นทองคำคาดกลางจอ สวยงาม กะทัดรัด" icon={Crown} isSelected={section.layoutStyle === 'compact_gold_guarantee'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'compact_gold_guarantee')} />
                              </>
                            )}

                            {/* 12. STICKY CTA (10 VARIANTS) */}
                            {section.type === 'sticky_cta' && (
                              <>
                                <LayoutOptionCard title="1. 3-Button Action Dock" desc="3 ปุ่มลอย: สั่งซื้อทันที + แชท LINE OA + โทรด่วน" icon={Phone} isSelected={section.layoutStyle === 'floating_cta_trio'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'floating_cta_trio')} />
                                <LayoutOptionCard title="2. 2-Button Modern Pill" desc="2 ปุ่มคู่: ราคา + ปุ่มสั่งซื้อกว้าง + ไอคอน LINE" icon={MessageCircle} isSelected={section.layoutStyle === 'floating_cta_duo'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'floating_cta_duo')} />
                                <LayoutOptionCard title="3. Full-Width Buy Bar" desc="แถบลอยเต็มความกว้างขอบล่าง ปิดการขายทรงพลัง" icon={ShoppingBag} isSelected={section.layoutStyle === 'full_width_buy_bar'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'full_width_buy_bar')} />
                                <LayoutOptionCard title="4. Neon Glowing Pill Dock" desc="กล่องแคปซูลขอบเรืองแสงพร้อมเงาสีนีออน" icon={Zap} isSelected={section.layoutStyle === 'pill_floating_glow'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'pill_floating_glow')} />
                                <LayoutOptionCard title="5. Embedded Timer Sticky Bar" desc="แถบติดขอบล่างพร้อมตัวนับถอยหลังในตัว" icon={Clock} isSelected={section.layoutStyle === 'timer_sticky_bar'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'timer_sticky_bar')} />
                                <LayoutOptionCard title="6. Discount Voucher Sticky Bar" desc="แถบติดขอบล่างพร้อมป้ายโค้ดส่วนลด 50%" icon={Gift} isSelected={section.layoutStyle === 'discount_sticky_pill'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'discount_sticky_pill')} />
                                <LayoutOptionCard title="7. Minimalist Monochrome Bar" desc="แถบปุ่มลอยสีขาวดำสะอาดตา ไม่บดบังเนื้อหา" icon={Square} isSelected={section.layoutStyle === 'minimal_clean_dock'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_clean_dock')} />
                                <LayoutOptionCard title="8. Compact 3-Icon Action Dock" desc="3 ไอคอนทรงกลม สั่งซื้อ แชท โทร ประหยัดพื้นที่" icon={Boxes} isSelected={section.layoutStyle === 'compact_icon_trio'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'compact_icon_trio')} />
                                <LayoutOptionCard title="9. Split Price / Order Button" desc="ฝั่งซ้ายยอดรวมสุทธิ ฝั่งขวาปุ่มกดยืนยันคำสั่งซื้อ" icon={Percent} isSelected={section.layoutStyle === 'split_price_button'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_price_button')} />
                                <LayoutOptionCard title="10. Luxury Gold Floating Dock" desc="แถบปุ่มสั่งซื้อทองคำลักชูรี สำหรับแบรนด์ระดับสูง" icon={Crown} isSelected={section.layoutStyle === 'luxury_gold_bottom'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'luxury_gold_bottom')} />
                              </>
                            )}

                            {/* 13. STORY (10 VARIANTS) */}
                            {section.type === 'story' && (
                              <>
                                <LayoutOptionCard title="1. Editorial Brand Story" desc="บทความและเรื่องเล่าแบรนด์สไตล์นิตยสารพรีเมียม" icon={FileText} isSelected={section.layoutStyle === 'article_box'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'article_box')} />
                                <LayoutOptionCard title="2. Founder Message & Vision" desc="สารจากผู้ก่อตั้งแบรนด์ พร้อมช่องลายเซ็นและรูปผู้บริหาร" icon={Crown} isSelected={section.layoutStyle === 'quote_founder_card'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'quote_founder_card')} />
                                <LayoutOptionCard title="3. Brand History Milestones" desc="ไทม์ไลน์ความเป็นมาของแบรนด์ตั้งแต่อดีตถึงปัจจุบัน" icon={Calendar} isSelected={section.layoutStyle === 'timeline_milestones'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'timeline_milestones')} />
                                <LayoutOptionCard title="4. Ingredient Spotlight" desc="เจาะลึกแหล่งที่มาของวัตถุดิบและสารสกัดหายาก" icon={Sparkles} isSelected={section.layoutStyle === 'ingredient_spotlight'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'ingredient_spotlight')} />
                                <LayoutOptionCard title="5. Split 50/50 Image & Story" desc="จัดวางรูปถ่ายโรงงานซ้าย เรื่องเล่าความใส่ใจขวา" icon={Boxes} isSelected={section.layoutStyle === 'split_image_text'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'split_image_text')} />
                                <LayoutOptionCard title="6. 3 Mission Highlight Cards" desc="การ์ด 3 กล่องแสดงพันธกิจและความตั้งใจของแบรนด์" icon={Layers} isSelected={section.layoutStyle === 'card_highlights'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'card_highlights')} />
                                <LayoutOptionCard title="7. Laboratory Research Origin" desc="เรื่องเล่าจากห้องทดลองและนักวิทยาศาสตร์ผู้คิดค้น" icon={Award} isSelected={section.layoutStyle === 'laboratory_origin'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'laboratory_origin')} />
                                <LayoutOptionCard title="8. Classic Columnist Story" desc="การจัดหน้าแบบคอลัมนิสต์หนังสือพิมพ์คลาสสิก" icon={List} isSelected={section.layoutStyle === 'newspaper_column'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'newspaper_column')} />
                                <LayoutOptionCard title="9. Minimalist Clean Story" desc="ตัวหนังสือสไตล์มินิมอล อ่านสบายตา เข้าถึงใจผู้ซื้อ" icon={Square} isSelected={section.layoutStyle === 'minimal_clean_story'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'minimal_clean_story')} />
                                <LayoutOptionCard title="10. Video Founder Story Box" desc="กล่องเรื่องราวควบคู่วิดีโอสัมภาษณ์ผู้คิดค้น" icon={Film} isSelected={section.layoutStyle === 'video_founder_story'} themeColor={globalThemeColor}
                                  onClick={() => handleUpdateSectionField(section.id, 'layoutStyle', 'video_founder_story')} />
                              </>
                            )}

                          </div>
                        </div>

                        {/* SECTION CUSTOM COLOR OVERRIDES */}
                        

                        {/* SPECIFIC CONTEXT-AWARE INPUTS DEPENDING ON SECTION TYPE */}
                        {section.type === 'navbar' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">🧭 ข้อมูลแถบ Navigation & ปุ่มกดต่างๆ</span>
                              <span className="text-[9px] text-slate-400 font-mono">สไตล์: {section.layoutStyle}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ชื่อแบรนด์ / ร้านค้า</label>
                                <input
                                  type="text"
                                  value={section.data.brand_name || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'brand_name', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ข้อความปุ่มกด (CTA Button)</label>
                                <input
                                  type="text"
                                  value={section.data.cta_text || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'cta_text', e.target.value)}
                                  placeholder="สั่งซื้อด่วน"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ลิงก์ปลายทางปุ่ม (CTA URL)</label>
                                <input
                                  type="text"
                                  value={section.data.cta_url || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'cta_url', e.target.value)}
                                  placeholder="#checkout หรือ https://..."
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ลิงก์แชท LINE (LINE URL)</label>
                                <input
                                  type="url"
                                  value={section.data.line_url || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'line_url', e.target.value)}
                                  placeholder="https://line.me/..."
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">เบอร์โทรติดต่อด่วน (Hotline)</label>
                                <input
                                  type="tel"
                                  value={section.data.phone_number || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'phone_number', e.target.value)}
                                  placeholder="0812345678"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">ข้อความวิ่งประชาสัมพันธ์ (Ticker Announcement)</label>
                              <input
                                type="text"
                                value={section.data.ticker_text || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'ticker_text', e.target.value)}
                                placeholder="🚚 จัดส่งฟรีด่วนทั่วไทย | รับประกันของแท้ 100%..."
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>

                            <ImageUploaderBox
                              uploadImageFile={uploadAiProductImage}
                              uploadingImage={uploadingImage}
                              setUploadingImage={setUploadingImage}
                              label="อัปโหลดโลโก้แบรนด์ (Navbar Logo)"
                              value={section.data.logo_url || ''}
                              onChange={(url) => handleUpdateSectionData(section.id, 'logo_url', url)}
                              aspect="aspect-[3/1]"
                            />
                          </div>
                        )}

                        {section.type === 'hero' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">⚡ ข้อมูล Hero & พาดหัวหลัก</span>
                              <span className="text-[9px] text-slate-400 font-mono">สไตล์: {section.layoutStyle}</span>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">ข้อความพาดหัวหลัก (Headline)</label>
                              <textarea
                                rows={2}
                                value={section.data.headline || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'headline', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">ข้อความขยายความ (Subheadline)</label>
                              <textarea
                                rows={2}
                                value={section.data.subheadline || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'subheadline', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>

                            <ImageUploaderBox
                              uploadImageFile={uploadAiProductImage}
                              uploadingImage={uploadingImage}
                              setUploadingImage={setUploadingImage}
                              label="อัปโหลดรูปภาพสินค้าหลัก (Hero Product Image)"
                              value={section.data.image_url || ''}
                              onChange={(url) => handleUpdateSectionData(section.id, 'image_url', url)}
                              aspect="aspect-video"
                            />

                            {/* Video Input Box (Highlighted for Video Showcase) */}
                            <div className={`p-3 rounded-xl border ${section.layoutStyle === 'video_cinema_player' ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-500/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'} space-y-1`}>
                              <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                <Film className="w-3.5 h-3.5" />
                                <span>ลิงก์วิดีโอ YouTube / TikTok URL (สำหรับเล่นวิดีโอในหน้าเว็บ)</span>
                              </label>
                              <input
                                type="url"
                                value={section.data.video_url || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'video_url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ข้อความปุ่มกด (Hero Button Text)</label>
                                <input
                                  type="text"
                                  value={section.data.cta_text || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'cta_text', e.target.value)}
                                  placeholder="สั่งซื้อโปรโมชั่นนี้ทันที"
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ลิงก์ปลายทางปุ่ม (Hero Button Link)</label>
                                <input
                                  type="text"
                                  value={section.data.cta_url || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'cta_url', e.target.value)}
                                  placeholder="#checkout"
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ชิปตราสัญลักษณ์ 1</label>
                                <input
                                  type="text"
                                  value={section.data.trust_badge_1 || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'trust_badge_1', e.target.value)}
                                  className="w-full px-2 py-1 text-[10px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ชิปตราสัญลักษณ์ 2</label>
                                <input
                                  type="text"
                                  value={section.data.trust_badge_2 || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'trust_badge_2', e.target.value)}
                                  className="w-full px-2 py-1 text-[10px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ชิปตราสัญลักษณ์ 3</label>
                                <input
                                  type="text"
                                  value={section.data.trust_badge_3 || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'trust_badge_3', e.target.value)}
                                  className="w-full px-2 py-1 text-[10px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === 'countdown' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">🔥 ข้อมูลแถบนับถอยหลัง Flash Sale & คูปอง</span>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">ข้อความหัวข้อนับถอยหลัง</label>
                              <input
                                type="text"
                                value={section.data.headline || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'headline', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ระยะเวลา (นาที)</label>
                                <input
                                  type="number"
                                  value={section.data.minutes || 15}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'minutes', parseInt(e.target.value) || 15)}
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">โค้ดคูปองส่วนลด</label>
                                <input
                                  type="text"
                                  value={section.data.voucher_code || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'voucher_code', e.target.value)}
                                  placeholder="AURA50"
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-purple-600"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">สินค้าเหลือในสต็อก</label>
                                <input
                                  type="number"
                                  value={section.data.stock_left || 7}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'stock_left', parseInt(e.target.value) || 7)}
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-rose-500"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === 'pricing' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">💰 ข้อมูลราคา ข้อเสนอ & 3 แพ็กเกจ</span>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ราคาโปรโมชั่นหลัก (บาท)</label>
                                <input
                                  type="number"
                                  value={section.data.offer_price || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'offer_price', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-purple-600 text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ราคาปกติ (ขีดฆ่า)</label>
                                <input
                                  type="number"
                                  value={section.data.original_price || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'original_price', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-400 text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">ป้ายข้อเสนอพิเศษ (Badge Text)</label>
                              <input
                                type="text"
                                value={section.data.badge_text || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'badge_text', e.target.value)}
                                placeholder="Special Offer ลด 50%"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>

                            {/* Features Bullet List Editor */}
                            <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              <label className="text-[10px] font-bold text-slate-500 block">รายการของแถม / จุดเด่นในการ์ดราคา (Features)</label>
                              {(section.data.features || []).map((feat: string, fIdx: number) => (
                                <div key={fIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={feat}
                                    onChange={(e) => {
                                      const newFeats = [...(section.data.features || [])]
                                      newFeats[fIdx] = e.target.value
                                      handleUpdateSectionData(section.id, 'features', newFeats)
                                    }}
                                    className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFeats = (section.data.features || []).filter((_: any, i: number) => i !== fIdx)
                                      handleUpdateSectionData(section.id, 'features', newFeats)
                                    }}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newFeats = [...(section.data.features || []), 'ของแถม / คุณสมบัติใหม่...']
                                  handleUpdateSectionData(section.id, 'features', newFeats)
                                }}
                                className="text-xs font-bold text-purple-600 flex items-center gap-1 cursor-pointer pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ เพิ่มรายการของแถม</span>
                              </button>
                            </div>

                            {/* Multi-Tier Package Editor */}
                            <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              <label className="text-[10px] font-bold text-purple-600 block">กำหนดราคา 3 แพ็กเกจ (Tier Packages)</label>
                              {(section.data.tiers || []).map((t: any, tIdx: number) => (
                                <div key={tIdx} className="grid grid-cols-12 gap-1 items-center bg-white dark:bg-[#131B2A] p-2 rounded-lg text-[10px]">
                                  <input
                                    type="text"
                                    value={t.name}
                                    onChange={(e) => {
                                      const newTiers = [...section.data.tiers]
                                      newTiers[tIdx].name = e.target.value
                                      handleUpdateSectionData(section.id, 'tiers', newTiers)
                                    }}
                                    className="col-span-6 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-bold"
                                    placeholder="ชื่อแพ็กเกจ"
                                  />
                                  <input
                                    type="number"
                                    value={t.price}
                                    onChange={(e) => {
                                      const newTiers = [...section.data.tiers]
                                      newTiers[tIdx].price = parseFloat(e.target.value) || 0
                                      handleUpdateSectionData(section.id, 'tiers', newTiers)
                                    }}
                                    className="col-span-3 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono font-bold text-purple-600"
                                    placeholder="ราคา"
                                  />
                                  <label className="col-span-3 flex items-center gap-1 cursor-pointer text-[9px]">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(t.isPopular)}
                                      onChange={(e) => {
                                        const newTiers = [...section.data.tiers]
                                        newTiers.forEach((tier, i) => tier.isPopular = (i === tIdx ? e.target.checked : false))
                                        handleUpdateSectionData(section.id, 'tiers', newTiers)
                                      }}
                                    />
                                    <span>ขายดี</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.type === 'gallery' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-wider block">📸 ข้อมูลแกลเลอรีรูปภาพ & ภาพเปรียบเทียบ</span>
                              <span className="text-[9px] text-slate-400 font-mono">สไตล์: {section.layoutStyle}</span>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">หัวข้อแกลเลอรี</label>
                              <input
                                type="text"
                                value={section.data.headline || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'headline', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                              />
                            </div>

                            {/* Before & After Dual Box */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                              <span className="text-[10px] font-bold text-purple-600 block">ภาพเปรียบเทียบผลลัพธ์ (Before & After)</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <ImageUploaderBox
                              uploadImageFile={uploadAiProductImage}
                              uploadingImage={uploadingImage}
                              setUploadingImage={setUploadingImage}
                                    label="รูปภาพก่อนใช้ (Before ❌)"
                                    value={section.data.before_image || ''}
                                    onChange={(url) => handleUpdateSectionData(section.id, 'before_image', url)}
                                    aspect="aspect-square"
                                  />
                                  <input
                                    type="text"
                                    value={section.data.before_text || 'ก่อนใช้ ❌'}
                                    onChange={(e) => handleUpdateSectionData(section.id, 'before_text', e.target.value)}
                                    placeholder="ข้อความกำกับก่อนใช้"
                                    className="w-full mt-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700"
                                  />
                                </div>
                                <div>
                                  <ImageUploaderBox
                              uploadImageFile={uploadAiProductImage}
                              uploadingImage={uploadingImage}
                              setUploadingImage={setUploadingImage}
                                    label="รูปภาพหลังใช้ (After ✅)"
                                    value={section.data.after_image || ''}
                                    onChange={(url) => handleUpdateSectionData(section.id, 'after_image', url)}
                                    aspect="aspect-square"
                                  />
                                  <input
                                    type="text"
                                    value={section.data.after_text || 'หลังใช้ 7 วัน ✅'}
                                    onChange={(e) => handleUpdateSectionData(section.id, 'after_text', e.target.value)}
                                    placeholder="ข้อความกำกับหลังใช้"
                                    className="w-full mt-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Multi-Image Album */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 block">
                                รูปภาพอัลบั้มแกลเลอรีทั้งหมด ({section.data.images?.length || 0} ภาพ)
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {(section.data.images || []).map((imgUrl: string, imgIdx: number) => (
                                  <div key={imgIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square bg-black">
                                    <img src={imgUrl} alt="Thumb" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const imgs = (section.data.images || []).filter((_: any, i: number) => i !== imgIdx)
                                        handleUpdateSectionData(section.id, 'images', imgs)
                                      }}
                                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}

                                <label className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 bg-slate-50 dark:bg-slate-900 aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer transition p-2 text-center group">
                                  <Upload className="w-4 h-4 text-purple-600 group-hover:scale-110 transition" />
                                  <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">+ เพิ่มรูป</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      setUploadingImage(true)
                                      try {
                                        const url = await uploadImageFile(file)
                                        const imgs = [...(section.data.images || []), url]
                                        handleUpdateSectionData(section.id, 'images', imgs)
                                      } finally {
                                        setUploadingImage(false)
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === 'pain_points' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">❌ ข้อมูลขยี้ปัญหาลูกค้า (Pain Points)</span>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">หัวข้อปัญหา</label>
                              <input
                                type="text"
                                value={section.data.headline || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'headline', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 block">รายการปัญหา (คลิกเพิ่ม/ลบได้)</label>
                              {(section.data.points || []).map((p: string, pIdx: number) => (
                                <div key={pIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={p}
                                    onChange={(e) => {
                                      const pts = [...section.data.points]
                                      pts[pIdx] = e.target.value
                                      handleUpdateSectionData(section.id, 'points', pts)
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const pts = section.data.points.filter((_: any, i: number) => i !== pIdx)
                                      handleUpdateSectionData(section.id, 'points', pts)
                                    }}
                                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const pts = [...(section.data.points || []), 'ปัญหาข้อใหม่...']
                                  handleUpdateSectionData(section.id, 'points', pts)
                                }}
                                className="text-xs font-bold text-rose-600 flex items-center gap-1 cursor-pointer pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ เพิ่มรายการปัญหา</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {section.type === 'benefits' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">✅ ข้อมูลผลลัพธ์ จุดเด่น & ไทม์ไลน์</span>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">หัวข้อผลลัพธ์</label>
                              <input
                                type="text"
                                value={section.data.headline || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'headline', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 block">รายการจุดเด่นที่คุณจะได้รับ (Benefits)</label>
                              {(section.data.benefits || []).map((b: string, bIdx: number) => (
                                <div key={bIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={b}
                                    onChange={(e) => {
                                      const bts = [...section.data.benefits]
                                      bts[bIdx] = e.target.value
                                      handleUpdateSectionData(section.id, 'benefits', bts)
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const bts = section.data.benefits.filter((_: any, i: number) => i !== bIdx)
                                      handleUpdateSectionData(section.id, 'benefits', bts)
                                    }}
                                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const bts = [...(section.data.benefits || []), 'ผลลัพธ์ข้อใหม่...']
                                  handleUpdateSectionData(section.id, 'benefits', bts)
                                }}
                                className="text-xs font-bold text-emerald-600 flex items-center gap-1 cursor-pointer pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ เพิ่มรายการผลลัพธ์</span>
                              </button>
                            </div>

                            {/* Timeline Steps Editor */}
                            <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              <label className="text-[10px] font-bold text-purple-600 block">ไทม์ไลน์พัฒนาการ (Timeline Steps)</label>
                              {(section.data.steps || []).map((st: any, sIdx: number) => (
                                <div key={sIdx} className="grid grid-cols-12 gap-1 items-center bg-white dark:bg-[#131B2A] p-2 rounded-lg text-[10px]">
                                  <input
                                    type="text"
                                    value={st.day}
                                    onChange={(e) => {
                                      const newSteps = [...(section.data.steps || [])]
                                      newSteps[sIdx].day = e.target.value
                                      handleUpdateSectionData(section.id, 'steps', newSteps)
                                    }}
                                    className="col-span-4 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-bold"
                                    placeholder="วันที่..."
                                  />
                                  <input
                                    type="text"
                                    value={st.desc}
                                    onChange={(e) => {
                                      const newSteps = [...(section.data.steps || [])]
                                      newSteps[sIdx].desc = e.target.value
                                      handleUpdateSectionData(section.id, 'steps', newSteps)
                                    }}
                                    className="col-span-7 px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
                                    placeholder="คำอธิบายผลลัพธ์"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSteps = (section.data.steps || []).filter((_: any, i: number) => i !== sIdx)
                                      handleUpdateSectionData(section.id, 'steps', newSteps)
                                    }}
                                    className="col-span-1 text-rose-500 font-bold flex justify-center"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newSteps = [...(section.data.steps || []), { day: 'วันที่ 21+', desc: 'ผลลัพธ์ชัดเจนยิ่งขึ้น' }]
                                  handleUpdateSectionData(section.id, 'steps', newSteps)
                                }}
                                className="text-xs font-bold text-purple-600 flex items-center gap-1 cursor-pointer pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ เพิ่มขั้นตอนไทม์ไลน์</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {section.type === 'reviews' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">🌟 ข้อมูลรีวิว & แชทสนทนาลูกค้า</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">คะแนนรีวิวเฉลี่ย (เต็ม 5)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={section.data.rating || 5.0}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'rating', parseFloat(e.target.value) || 5.0)}
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">จำนวนรีวิวทั้งหมด</label>
                                <input
                                  type="text"
                                  value={section.data.review_count || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'review_count', e.target.value)}
                                  placeholder="1,420+ รีวิว"
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                                />
                              </div>
                            </div>

                            {/* Customer Review Cards Editor */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 block">การ์ดรีวิวข้อความ (Testimonials)</label>
                              {(section.data.reviews || []).map((r: any, rIdx: number) => (
                                <div key={rIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <input
                                      type="text"
                                      value={r.name}
                                      onChange={(e) => {
                                        const rvs = [...section.data.reviews]
                                        rvs[rIdx].name = e.target.value
                                        handleUpdateSectionData(section.id, 'reviews', rvs)
                                      }}
                                      className="font-bold text-xs bg-transparent border-0"
                                      placeholder="ชื่อผู้รีวิว"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const rvs = section.data.reviews.filter((_: any, i: number) => i !== rIdx)
                                        handleUpdateSectionData(section.id, 'reviews', rvs)
                                      }}
                                      className="text-rose-500 text-[10px] font-bold cursor-pointer"
                                    >
                                      ลบ
                                    </button>
                                  </div>
                                  <textarea
                                    rows={2}
                                    value={r.comment}
                                    onChange={(e) => {
                                      const rvs = [...section.data.reviews]
                                      rvs[rIdx].comment = e.target.value
                                      handleUpdateSectionData(section.id, 'reviews', rvs)
                                    }}
                                    className="w-full p-1.5 rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 text-[10px]"
                                    placeholder="ข้อความรีวิว..."
                                  />
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const rvs = [...(section.data.reviews || []), { name: 'คุณลูกค้าใหม่ (กทม.)', comment: 'ใช้ดีมาก ประทับใจมากค่ะ', stars: 5, date: 'วันนี้' }]
                                  handleUpdateSectionData(section.id, 'reviews', rvs)
                                }}
                                className="text-xs font-bold text-amber-600 flex items-center gap-1 cursor-pointer pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ เพิ่มการ์ดรีวิว</span>
                              </button>
                            </div>

                            {/* Chat Dialogue Editor */}
                            <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              <label className="text-[10px] font-bold text-purple-600 block">บทสนทนาแชทสั่งซื้อจริง (Social Chat Dialogue)</label>
                              {(section.data.chat_reviews || []).map((chat: any, cIdx: number) => (
                                <div key={cIdx} className="grid grid-cols-12 gap-1 items-center bg-white dark:bg-[#131B2A] p-2 rounded-lg text-[10px]">
                                  <select
                                    value={chat.sender}
                                    onChange={(e) => {
                                      const newChats = [...(section.data.chat_reviews || [])]
                                      newChats[cIdx].sender = e.target.value
                                      handleUpdateSectionData(section.id, 'chat_reviews', newChats)
                                    }}
                                    className="col-span-3 px-1 py-1 rounded border border-slate-200 dark:border-slate-700 font-bold"
                                  >
                                    <option value="ลูกค้า">ลูกค้า</option>
                                    <option value="ร้านค้า">ร้านค้า</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={chat.text}
                                    onChange={(e) => {
                                      const newChats = [...(section.data.chat_reviews || [])]
                                      newChats[cIdx].text = e.target.value
                                      handleUpdateSectionData(section.id, 'chat_reviews', newChats)
                                    }}
                                    className="col-span-8 px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
                                    placeholder="ข้อความแชท..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newChats = (section.data.chat_reviews || []).filter((_: any, i: number) => i !== cIdx)
                                      handleUpdateSectionData(section.id, 'chat_reviews', newChats)
                                    }}
                                    className="col-span-1 text-rose-500 font-bold flex justify-center"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newChats = [...(section.data.chat_reviews || []), { sender: 'ลูกค้า', text: 'สั่งเพิ่มอีก 2 ชุดนะคะ' }]
                                  handleUpdateSectionData(section.id, 'chat_reviews', newChats)
                                }}
                                className="text-xs font-bold text-purple-600 flex items-center gap-1 cursor-pointer pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ เพิ่มข้อความแชท</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {section.type === 'faq' && (
                          <div className="space-y-2 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">❓ รายการคำถาม & คำตอบ (FAQ)</span>
                            {(section.data.faqs || []).map((faq: any, fIdx: number) => (
                              <div key={fIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-purple-600">คำถามที่ {fIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const faqs = section.data.faqs.filter((_: any, i: number) => i !== fIdx)
                                      handleUpdateSectionData(section.id, 'faqs', faqs)
                                    }}
                                    className="text-rose-500 text-[10px] font-bold cursor-pointer"
                                  >
                                    ลบ
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={faq.q}
                                  onChange={(e) => {
                                    const faqs = [...(section.data.faqs || [])]
                                    faqs[fIdx].q = e.target.value
                                    handleUpdateSectionData(section.id, 'faqs', faqs)
                                  }}
                                  placeholder="คำถาม..."
                                  className="w-full px-2 py-1 text-xs font-bold rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700"
                                />
                                <textarea
                                  rows={2}
                                  value={faq.a}
                                  onChange={(e) => {
                                    const faqs = [...(section.data.faqs || [])]
                                    faqs[fIdx].a = e.target.value
                                    handleUpdateSectionData(section.id, 'faqs', faqs)
                                  }}
                                  placeholder="คำตอบ..."
                                  className="w-full px-2 py-1 text-xs rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const faqs = [...(section.data.faqs || []), { q: 'คำถามใหม่...', a: 'คำตอบ...' }]
                                handleUpdateSectionData(section.id, 'faqs', faqs)
                              }}
                              className="text-xs font-bold text-purple-600 flex items-center gap-1 cursor-pointer pt-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ เพิ่มคำถาม FAQ</span>
                            </button>
                          </div>
                        )}

                        {section.type === 'checkout' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">💳 ฟอร์มชำระเงิน PromptPay QR & COD</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">เบอร์พร้อมเพย์รับเงิน (PromptPay Number)</label>
                                <input
                                  type="text"
                                  value={section.data.promptpay_number || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'promptpay_number', e.target.value)}
                                  placeholder="0812345678"
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ชื่อบัญชีรับเงิน (Account Name)</label>
                                <input
                                  type="text"
                                  value={section.data.promptpay_name || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'promptpay_name', e.target.value)}
                                  placeholder="ชื่อบัญชีร้านค้า"
                                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] pt-1">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(section.data.enable_promptpay !== false)}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'enable_promptpay', e.target.checked)}
                                />
                                <span>เปิดใช้พร้อมเพย์ QR ยอดตรง</span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(section.data.enable_cod !== false)}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'enable_cod', e.target.checked)}
                                />
                                <span>เปิดใช้เก็บเงินปลายทาง (COD)</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {section.type === 'guarantee' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">🛡️ ข้อความรับประกันความพึงพอใจ</span>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">ข้อความรับประกันสินค้า (Guarantee Statement)</label>
                              <input
                                type="text"
                                value={section.data.text || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'text', e.target.value)}
                                placeholder="รับประกันความพึงพอใจ ของแท้ 100% ไม่พอใจยินดีคืนเงินใน 14 วัน"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {section.type === 'sticky_cta' && (
                          <div className="space-y-4 p-4 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                              <div>
                                <span className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                                  <ShoppingBag className="w-4 h-4" />
                                  <span>ปรับแต่งปุ่ม Action ลอยติดขอบล่าง (Sticky Action Bar 1 - 3 ปุ่ม)</span>
                                </span>
                                <p className="text-[10px] text-slate-400 font-light mt-0.5">
                                  กำหนดชื่อปุ่ม, ลิงก์ปลายทาง, เลือกไอคอนโซเชียล, สีปุ่ม และสีตัวหนังสือได้อย่างอิสระทุกปุ่ม
                                </p>
                              </div>
                              <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer text-slate-600 dark:text-slate-300 shrink-0">
                                <input
                                  type="checkbox"
                                  checked={section.data.show_price !== false}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'show_price', e.target.checked)}
                                  className="w-3.5 h-3.5 accent-purple-600 rounded"
                                />
                                <span>แสดงยอดราคา</span>
                              </label>
                            </div>

                            {/* BUTTON 1 */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-purple-500/30 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                                  <span>ปุ่มที่ 1 (Button 1)</span>
                                </span>
                                <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer text-slate-600 dark:text-slate-300">
                                  <input
                                    type="checkbox"
                                    checked={section.data.btn1_enabled !== false}
                                    onChange={(e) => handleUpdateSectionData(section.id, 'btn1_enabled', e.target.checked)}
                                    className="w-3.5 h-3.5 accent-purple-600 rounded"
                                  />
                                  <span>เปิดใช้งาน</span>
                                </label>
                              </div>

                              {section.data.btn1_enabled !== false && (
                                <div className="space-y-2.5 pt-1">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ชื่อปุ่มที่ 1</label>
                                      <input
                                        type="text"
                                        value={section.data.btn1_text || ''}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn1_text', e.target.value)}
                                        placeholder="สั่งซื้อโปรโมชั่นด่วน"
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ลิงก์ปลายทาง (URL หรือ #checkout)</label>
                                      <input
                                        type="text"
                                        value={section.data.btn1_url || ''}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn1_url', e.target.value)}
                                        placeholder="#checkout"
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">เลือกไอคอนปุ่มที่ 1</label>
                                      <select
                                        value={section.data.btn1_icon || 'bag'}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn1_icon', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                                      >
                                        <option value="bag">🛍️ ตะกร้าสินค้า / สั่งซื้อ (Shopping Bag)</option>
                                        <option value="cart">🛒 รถเข็นช้อปปิ้ง (Shopping Cart)</option>
                                        <option value="line">💬 แชท LINE / ข้อความ (LINE/Message)</option>
                                        <option value="facebook">📘 Facebook (เฟซบุ๊ก)</option>
                                        <option value="instagram">📸 Instagram (ไอจี)</option>
                                        <option value="tiktok">🎵 TikTok (ติ๊กต็อก)</option>
                                        <option value="youtube">▶️ YouTube (ยูทูป)</option>
                                        <option value="send">✈️ ส่งข้อความ / Messenger (Send)</option>
                                        <option value="phone">📞 โทรศัพท์ / ติดต่อด่วน (Phone)</option>
                                        <option value="mail">✉️ อีเมล (Email)</option>
                                        <option value="globe">🌐 เว็บไซต์ / ลิงก์ (Website)</option>
                                        <option value="map">🗺️ แผนที่ / ที่ตั้งร้าน (Map Pin)</option>
                                        <option value="zap">⚡ โปรโมชั่นด่วน (Flash / Zap)</option>
                                        <option value="gift">🎁 ของขวัญ / ของแถม (Gift)</option>
                                        <option value="flame">🔥 ไฟลุก / สินค้าขายดี (Flame)</option>
                                        <option value="crown">👑 VIP / สิทธิพิเศษ (Crown)</option>
                                        <option value="star">⭐ รีวิว 5 ดาว (Star)</option>
                                        <option value="tag">🏷️ คูปองส่วนลด (Tag)</option>
                                        <option value="shield">🛡️ การันตีความปลอดภัย (Shield)</option>
                                        <option value="truck">🚚 ส่งด่วน / พัสดุ (Truck)</option>
                                        <option value="none">❌ ไม่มีไอคอน (Text Only)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีพื้นหลังปุ่มที่ 1</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.data.btn1_color || globalThemeColor}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn1_color', e.target.value)}
                                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={section.data.btn1_color || globalThemeColor}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn1_color', e.target.value)}
                                          className="flex-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีตัวหนังสือปุ่มที่ 1</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.data.btn1_text_color || '#FFFFFF'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn1_text_color', e.target.value)}
                                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={section.data.btn1_text_color || '#FFFFFF'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn1_text_color', e.target.value)}
                                          className="flex-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* BUTTON 2 */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-emerald-500/30 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                  <span>ปุ่มที่ 2 (Button 2)</span>
                                </span>
                                <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer text-slate-600 dark:text-slate-300">
                                  <input
                                    type="checkbox"
                                    checked={section.data.btn2_enabled !== false}
                                    onChange={(e) => handleUpdateSectionData(section.id, 'btn2_enabled', e.target.checked)}
                                    className="w-3.5 h-3.5 accent-emerald-600 rounded"
                                  />
                                  <span>เปิดใช้งาน</span>
                                </label>
                              </div>

                              {section.data.btn2_enabled !== false && (
                                <div className="space-y-2.5 pt-1">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ชื่อปุ่มที่ 2</label>
                                      <input
                                        type="text"
                                        value={section.data.btn2_text || ''}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn2_text', e.target.value)}
                                        placeholder="แชท LINE"
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ลิงก์ปลายทาง (URL)</label>
                                      <input
                                        type="text"
                                        value={section.data.btn2_url || ''}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn2_url', e.target.value)}
                                        placeholder="https://line.me/R/ti/p/@..."
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">เลือกไอคอนปุ่มที่ 2</label>
                                      <select
                                        value={section.data.btn2_icon || 'line'}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn2_icon', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                                      >
                                        <option value="line">💬 แชท LINE / ข้อความ (LINE/Message)</option>
                                        <option value="facebook">📘 Facebook (เฟซบุ๊ก)</option>
                                        <option value="instagram">📸 Instagram (ไอจี)</option>
                                        <option value="tiktok">🎵 TikTok (ติ๊กต็อก)</option>
                                        <option value="youtube">▶️ YouTube (ยูทูป)</option>
                                        <option value="send">✈️ ส่งข้อความ / Messenger (Send)</option>
                                        <option value="phone">📞 โทรศัพท์ / ติดต่อด่วน (Phone)</option>
                                        <option value="mail">✉️ อีเมล (Email)</option>
                                        <option value="globe">🌐 เว็บไซต์ / ลิงก์ (Website)</option>
                                        <option value="map">🗺️ แผนที่ / ที่ตั้งร้าน (Map Pin)</option>
                                        <option value="bag">🛍️ ตะกร้าสินค้า / สั่งซื้อ (Shopping Bag)</option>
                                        <option value="cart">🛒 รถเข็นช้อปปิ้ง (Shopping Cart)</option>
                                        <option value="zap">⚡ โปรโมชั่นด่วน (Flash / Zap)</option>
                                        <option value="gift">🎁 ของขวัญ / ของแถม (Gift)</option>
                                        <option value="flame">🔥 ไฟลุก / สินค้าขายดี (Flame)</option>
                                        <option value="none">❌ ไม่มีไอคอน (Text Only)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีพื้นหลังปุ่มที่ 2</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.data.btn2_color || '#10B981'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn2_color', e.target.value)}
                                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={section.data.btn2_color || '#10B981'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn2_color', e.target.value)}
                                          className="flex-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีตัวหนังสือปุ่มที่ 2</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.data.btn2_text_color || '#FFFFFF'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn2_text_color', e.target.value)}
                                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={section.data.btn2_text_color || '#FFFFFF'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn2_text_color', e.target.value)}
                                          className="flex-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* BUTTON 3 */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-indigo-500/30 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                  <span>ปุ่มที่ 3 (Button 3)</span>
                                </span>
                                <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer text-slate-600 dark:text-slate-300">
                                  <input
                                    type="checkbox"
                                    checked={section.data.btn3_enabled !== false}
                                    onChange={(e) => handleUpdateSectionData(section.id, 'btn3_enabled', e.target.checked)}
                                    className="w-3.5 h-3.5 accent-indigo-600 rounded"
                                  />
                                  <span>เปิดใช้งาน</span>
                                </label>
                              </div>

                              {section.data.btn3_enabled !== false && (
                                <div className="space-y-2.5 pt-1">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ชื่อปุ่มที่ 3</label>
                                      <input
                                        type="text"
                                        value={section.data.btn3_text || ''}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn3_text', e.target.value)}
                                        placeholder="โทรด่วน"
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">ลิงก์ปลายทาง (URL หรือ tel:08...)</label>
                                      <input
                                        type="text"
                                        value={section.data.btn3_url || ''}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn3_url', e.target.value)}
                                        placeholder="tel:0812345678"
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">เลือกไอคอนปุ่มที่ 3</label>
                                      <select
                                        value={section.data.btn3_icon || 'phone'}
                                        onChange={(e) => handleUpdateSectionData(section.id, 'btn3_icon', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                                      >
                                        <option value="phone">📞 โทรศัพท์ / ติดต่อด่วน (Phone)</option>
                                        <option value="line">💬 แชท LINE / ข้อความ (LINE/Message)</option>
                                        <option value="facebook">📘 Facebook (เฟซบุ๊ก)</option>
                                        <option value="instagram">📸 Instagram (ไอจี)</option>
                                        <option value="tiktok">🎵 TikTok (ติ๊กต็อก)</option>
                                        <option value="youtube">▶️ YouTube (ยูทูป)</option>
                                        <option value="send">✈️ ส่งข้อความ / Messenger (Send)</option>
                                        <option value="mail">✉️ อีเมล (Email)</option>
                                        <option value="globe">🌐 เว็บไซต์ / ลิงก์ (Website)</option>
                                        <option value="map">🗺️ แผนที่ / ที่ตั้งร้าน (Map Pin)</option>
                                        <option value="bag">🛍️ ตะกร้าสินค้า / สั่งซื้อ (Shopping Bag)</option>
                                        <option value="cart">🛒 รถเข็นช้อปปิ้ง (Shopping Cart)</option>
                                        <option value="zap">⚡ โปรโมชั่นด่วน (Flash / Zap)</option>
                                        <option value="gift">🎁 ของขวัญ / ของแถม (Gift)</option>
                                        <option value="flame">🔥 ไฟลุก / สินค้าขายดี (Flame)</option>
                                        <option value="none">❌ ไม่มีไอคอน (Text Only)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีพื้นหลังปุ่มที่ 3</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.data.btn3_color || '#8B5CF6'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn3_color', e.target.value)}
                                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={section.data.btn3_color || '#8B5CF6'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn3_color', e.target.value)}
                                          className="flex-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีตัวหนังสือปุ่มที่ 3</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.data.btn3_text_color || '#FFFFFF'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn3_text_color', e.target.value)}
                                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={section.data.btn3_text_color || '#FFFFFF'}
                                          onChange={(e) => handleUpdateSectionData(section.id, 'btn3_text_color', e.target.value)}
                                          className="flex-1 px-2 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        )}

                        {section.type === 'story' && (
                          <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">📖 เรื่องราวแบรนด์ & บทความ</span>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">หัวข้อเรื่องราว / บทความ</label>
                                <input
                                  type="text"
                                  value={section.data.title || section.title || ''}
                                  onChange={(e) => {
                                    handleUpdateSectionData(section.id, 'title', e.target.value)
                                    handleUpdateSectionField(section.id, 'title', e.target.value)
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">ชื่อผู้ก่อตั้ง / ทีมวิจัย (Founder Name)</label>
                                <input
                                  type="text"
                                  value={section.data.founder_name || ''}
                                  onChange={(e) => handleUpdateSectionData(section.id, 'founder_name', e.target.value)}
                                  placeholder="ผู้บริหารและทีมวิจัย"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">เนื้อหาบทความ / เรื่องราวแบรนด์</label>
                              <textarea
                                rows={4}
                                value={section.data.body || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'body', e.target.value)}
                                placeholder="เล่าเรื่องราวแบรนด์ของคุณที่นี่..."
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
                              />
                            </div>

                            <div className={`p-3 rounded-xl border ${section.layoutStyle === 'video_founder_story' ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'} space-y-1`}>
                              <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                <Film className="w-3.5 h-3.5" />
                                <span>ลิงก์วิดีโอสัมภาษณ์ผู้ก่อตั้ง (สำหรับ Video Founder Story)</span>
                              </label>
                              <input
                                type="url"
                                value={section.data.video_url || ''}
                                onChange={(e) => handleUpdateSectionData(section.id, 'video_url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono text-xs"
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                )
              })}
            </div>
          )}

        </div>
        {/* RIGHT COLUMN: REAL-TIME INTERACTIVE LIVE CANVAS (WIX VIEW) */}
        <div className={`space-y-3 lg:col-span-5 sticky top-20 ${activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-black text-slate-900 dark:text-white">หน้าตัวอย่างสด (Live Canvas Preview)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLivePreviewModalOpen(true)}
                className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>ขยายเต็มจอ</span>
              </button>
              <span
                style={{ color: globalThemeColor, backgroundColor: `${globalThemeColor}20` }}
                className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: globalThemeColor }} />
                Live Interactive
              </span>
            </div>
          </div>

          {/* Dynamic Mockup Phone (Full Background Coverage - Persistent Floating Bottom Action Bar) */}
          <div className="w-full max-w-[380px] h-[720px] mx-auto bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 relative overflow-hidden select-none flex flex-col justify-between">
            
            {/* Fixed Background Wallpaper Layer inside phone frame */}
            {(innerBgImage || globalBgImage) && (
              <div
                className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
                style={{
                  backgroundImage: `url(${innerBgImage || globalBgImage})`,
                  backgroundSize: (innerBgImage ? innerBgMode : globalBgMode) === 'contain' ? 'contain' : ((innerBgImage ? innerBgMode : globalBgMode) === 'repeat' ? 'auto' : 'cover'),
                  backgroundPosition: 'center',
                  backgroundRepeat: (innerBgImage ? innerBgMode : globalBgMode) === 'repeat' ? 'repeat' : 'no-repeat',
                  opacity: ((innerBgImage ? innerBgOpacity : globalBgOpacity) || 85) / 100,
                  filter: (innerBgImage ? innerBgBlur : globalBgBlur) ? `blur(${innerBgImage ? innerBgBlur : globalBgBlur}px)` : undefined
                }}
              />
            )}

            {/* Atmospheric Dark Overlay for Phone Mockup */}
            {(innerBgImage || globalBgImage) && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85 pointer-events-none z-0" />
            )}

            {/* Dynamic Island Notch */}
            <div className="relative z-20 w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center shadow-md shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90" />
            </div>

            {/* Scrollable Content Area */}
            <div
              className="flex-1 rounded-[32px] overflow-y-auto no-scrollbar text-left text-xs space-y-4 p-3 relative z-10 pb-6"
              style={{ color: globalTextColor || '#FFFFFF' }}
            >
              {sections.filter(s => s.visible).length === 0 ? (
                <div className="py-20 text-center space-y-2 opacity-50">
                  <LayoutTemplate className="w-10 h-10 mx-auto" />
                  <p className="text-xs font-bold">หน้าว่างเปล่า (Blank Canvas)</p>
                  <p className="text-[10px] font-light">เพิ่มส่วนประกอบเพื่อเริ่มแสดงผล</p>
                </div>
              ) : (
                sections
                  .filter(s => s.visible && s.type !== 'sticky_cta')
                  .map((section) => (
                    <SalepageSectionRenderer
                      key={section.id}
                      section={section}
                      globalThemeColor={globalThemeColor}
                      globalBgColor={globalBgColor}
                      globalTextColor={globalTextColor}
                      globalCardStyle={globalCardStyle}
                      isInteractive={true}
                      selectedTierIndex={selectedTierIndex}
                      setSelectedTierIndex={setSelectedTierIndex}
                      previewQty={previewQty}
                      setPreviewQty={setPreviewQty}
                      previewPaymentMethod={previewPaymentMethod}
                      setPreviewPaymentMethod={setPreviewPaymentMethod}
                      previewFaqOpen={previewFaqOpen}
                      setPreviewFaqOpen={setPreviewFaqOpen}
                      previewActiveGalleryImg={previewActiveGalleryImg}
                      setPreviewActiveGalleryImg={setPreviewActiveGalleryImg}
                      promptPayQRUrl={promptPayQRUrl}
                      previewTotal={previewTotal}
                      orderForm={orderForm}
                      setOrderForm={setOrderForm}
                      onOrderSubmit={handleSimulatorOrderSubmit}
                      uploadingSlip={uploadingSlip}
                      onSlipUpload={handleSlipUpload}
                      ordering={ordering}
                      orderSuccess={orderSuccess}
                      setOrderSuccess={setOrderSuccess}
                    />
                  ))
              )}
            </div>

            {/* Persistent Floating Bottom Action Bar Dock in Phone Mockup (Always Anchored at Bottom) */}
            {sections
              .filter(s => s.visible && s.type === 'sticky_cta')
              .map((section) => (
                <div key={section.id} className="relative z-30 pt-1 w-full shrink-0">
                  <SalepageSectionRenderer
                    section={section}
                    globalThemeColor={globalThemeColor}
                    globalBgColor={globalBgColor}
                    globalTextColor={globalTextColor}
                    globalCardStyle={globalCardStyle}
                    isInteractive={true}
                    selectedTierIndex={selectedTierIndex}
                    setSelectedTierIndex={setSelectedTierIndex}
                    previewQty={previewQty}
                    setPreviewQty={setPreviewQty}
                    previewPaymentMethod={previewPaymentMethod}
                    setPreviewPaymentMethod={setPreviewPaymentMethod}
                    previewFaqOpen={previewFaqOpen}
                    setPreviewFaqOpen={setPreviewFaqOpen}
                    previewActiveGalleryImg={previewActiveGalleryImg}
                    setPreviewActiveGalleryImg={setPreviewActiveGalleryImg}
                    promptPayQRUrl={promptPayQRUrl}
                    previewTotal={previewTotal}
                    orderForm={orderForm}
                    setOrderForm={setOrderForm}
                    onOrderSubmit={handleSimulatorOrderSubmit}
                    uploadingSlip={uploadingSlip}
                    onSlipUpload={handleSlipUpload}
                    ordering={ordering}
                    orderSuccess={orderSuccess}
                    setOrderSuccess={setOrderSuccess}
                  />
                </div>
              ))}
          </div>

        </div>

      </div>

      {/* FULLSCREEN LIVE PREVIEW SIMULATOR MODAL (100% ROCK-SOLID BACKGROUND & PROPORTIONAL DISPLAY) */}
      {isLivePreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in overflow-hidden">
          
          {/* Fixed Outer Screen Wallpaper Backdrop (Covers 100% full screen behind everything) */}
          {globalBgImage && (
            <div
              className="fixed inset-0 pointer-events-none z-0 transition-all duration-300"
              style={{
                backgroundImage: `url(${globalBgImage})`,
                backgroundSize: globalBgMode === 'contain' ? 'contain' : (globalBgMode === 'repeat' ? 'auto' : 'cover'),
                backgroundPosition: 'center',
                backgroundRepeat: globalBgMode === 'repeat' ? 'repeat' : 'no-repeat',
                opacity: (globalBgOpacity || 85) / 100,
                filter: globalBgBlur ? `blur(${globalBgBlur}px)` : undefined
              }}
            />
          )}

          {/* Outer Backdrop Dark Dimmer */}
          {globalBgImage && (
            <div className="fixed inset-0 bg-black/60 pointer-events-none z-0" />
          )}

          {/* Top Simulator Control Bar */}
          <div className="h-14 sm:h-16 px-3 sm:px-6 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-2 text-white shrink-0 z-30 shadow-md">
            
            {/* Left: Close Button + Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsLivePreviewModalOpen(false)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition shrink-0"
              >
                <X className="w-4 h-4" />
                <span className="hidden xs:inline">ปิดตัวอย่าง</span>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <h3 className="text-xs sm:text-sm font-black truncate">
                    ตัวอย่างหน้าเว็บจริง (Live Simulator)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-light hidden md:inline">
                  ทดสอบการกดปุ่ม สแกน QR แนบสลิป และสั่งซื้อได้เสมือนหน้าเว็บออนไลน์จริง
                </span>
              </div>
            </div>

            {/* Center: Device Switcher (Desktop / Tablet only) */}
            <div className="hidden md:flex items-center bg-black/50 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setPreviewModalDevice('mobile')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${previewModalDevice === 'mobile' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>มือถือ</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewModalDevice('tablet')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${previewModalDevice === 'tablet' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>แท็บเล็ต</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewModalDevice('desktop')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${previewModalDevice === 'desktop' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>จอคอม</span>
              </button>
            </div>

            {/* Right: Save & Publish Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSaveSalepage}
                disabled={saving}
                style={{ backgroundColor: globalThemeColor }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-white text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer shrink-0"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{saving ? 'กำลังบันทึก...' : 'บันทึก & เผยแพร่'}</span>
                <span className="xs:hidden">{saving ? '...' : 'บันทึก'}</span>
              </button>
            </div>
          </div>

          {/* Simulator Viewport Area */}
          <div className="flex-1 overflow-hidden flex items-center justify-center p-0 sm:p-4 relative z-10">
            
            {/* Viewport Frame with Fixed-Height Internal Scroll & Persistent Bottom Dock */}
            <div
              style={{
                maxWidth: typeof window !== 'undefined' && window.innerWidth < 640
                  ? '100%'
                  : (previewModalDevice === 'mobile' ? '414px' : (previewModalDevice === 'tablet' ? '768px' : '960px'))
              }}
              className="w-full h-full sm:h-[86vh] sm:rounded-[44px] relative mx-auto overflow-hidden sm:border-4 sm:border-slate-800 sm:shadow-2xl bg-[#0B0F17] transition-all duration-300 flex flex-col justify-between"
            >
              
              {/* Inner Phone Fixed Background Image Layer (Always 100% full coverage) */}
              {(innerBgImage || (typeof window !== 'undefined' && window.innerWidth < 640 ? globalBgImage : '')) && (
                <div
                  className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
                  style={{
                    backgroundImage: `url(${innerBgImage || globalBgImage})`,
                    backgroundSize: (innerBgImage ? innerBgMode : globalBgMode) === 'contain' ? 'contain' : ((innerBgImage ? innerBgMode : globalBgMode) === 'repeat' ? 'auto' : 'cover'),
                    backgroundPosition: 'center',
                    backgroundRepeat: (innerBgImage ? innerBgMode : globalBgMode) === 'repeat' ? 'repeat' : 'no-repeat',
                    opacity: ((innerBgImage ? innerBgOpacity : globalBgOpacity) || 85) / 100,
                    filter: (innerBgImage ? innerBgBlur : globalBgBlur) ? `blur(${innerBgImage ? innerBgBlur : globalBgBlur}px)` : undefined
                  }}
                />
              )}

              {/* Inner Atmospheric Overlay */}
              {(innerBgImage || (typeof window !== 'undefined' && window.innerWidth < 640 && globalBgImage)) && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85 pointer-events-none z-0" />
              )}

              {/* Dynamic Notch on desktop mobile frame */}
              <div className="hidden sm:block relative z-20 w-28 h-4 bg-black rounded-full mx-auto mt-2.5 mb-1 select-none shadow-md shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mx-auto" />
              </div>

              {/* Inner Scrollable Content Area (Takes flex-1 and scrolls smoothly while dock stays fixed!) */}
              <div
                className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 text-xs relative z-10 no-scrollbar pb-6"
                style={{ color: globalTextColor || '#FFFFFF' }}
              >
                {sections.filter(s => s.visible).length === 0 ? (
                  <div className="py-24 text-center space-y-2 opacity-50">
                    <LayoutTemplate className="w-12 h-12 mx-auto" />
                    <p className="text-sm font-bold">ไม่มีส่วนประกอบที่เปิดแสดงผล</p>
                  </div>
                ) : (
                  sections
                    .filter(s => s.visible && s.type !== 'sticky_cta')
                    .map((section) => (
                      <SalepageSectionRenderer
                        key={section.id}
                        section={section}
                        globalThemeColor={globalThemeColor}
                        globalBgColor={globalBgColor}
                        globalTextColor={globalTextColor}
                        globalCardStyle={globalCardStyle}
                        isInteractive={true}
                        selectedTierIndex={selectedTierIndex}
                        setSelectedTierIndex={setSelectedTierIndex}
                        previewQty={previewQty}
                        setPreviewQty={setPreviewQty}
                        previewPaymentMethod={previewPaymentMethod}
                        setPreviewPaymentMethod={setPreviewPaymentMethod}
                        previewFaqOpen={previewFaqOpen}
                        setPreviewFaqOpen={setPreviewFaqOpen}
                        previewActiveGalleryImg={previewActiveGalleryImg}
                        setPreviewActiveGalleryImg={setPreviewActiveGalleryImg}
                        promptPayQRUrl={promptPayQRUrl}
                        previewTotal={previewTotal}
                        orderForm={orderForm}
                        setOrderForm={setOrderForm}
                        onOrderSubmit={handleSimulatorOrderSubmit}
                        uploadingSlip={uploadingSlip}
                        onSlipUpload={handleSlipUpload}
                        ordering={ordering}
                        orderSuccess={orderSuccess}
                        setOrderSuccess={setOrderSuccess}
                      />
                    ))
                )}
              </div>

              {/* Persistent Floating Bottom Action Bar in Live Simulator (Always Anchored at Bottom!) */}
              {sections
                .filter(s => s.visible && s.type === 'sticky_cta')
                .map((section) => (
                  <div key={section.id} className="relative z-30 p-2 sm:p-2.5 w-full bg-[#0E131F]/95 backdrop-blur-2xl border-t border-white/15 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] shrink-0 pointer-events-auto">
                    <SalepageSectionRenderer
                      section={section}
                      globalThemeColor={globalThemeColor}
                      globalBgColor={globalBgColor}
                      globalTextColor={globalTextColor}
                      globalCardStyle={globalCardStyle}
                      isInteractive={true}
                      selectedTierIndex={selectedTierIndex}
                      setSelectedTierIndex={setSelectedTierIndex}
                      previewQty={previewQty}
                      setPreviewQty={setPreviewQty}
                      previewPaymentMethod={previewPaymentMethod}
                      setPreviewPaymentMethod={setPreviewPaymentMethod}
                      previewFaqOpen={previewFaqOpen}
                      setPreviewFaqOpen={setPreviewFaqOpen}
                      previewActiveGalleryImg={previewActiveGalleryImg}
                      setPreviewActiveGalleryImg={setPreviewActiveGalleryImg}
                      promptPayQRUrl={promptPayQRUrl}
                      previewTotal={previewTotal}
                      orderForm={orderForm}
                      setOrderForm={setOrderForm}
                      onOrderSubmit={handleSimulatorOrderSubmit}
                      uploadingSlip={uploadingSlip}
                      onSlipUpload={handleSlipUpload}
                      ordering={ordering}
                      orderSuccess={orderSuccess}
                      setOrderSuccess={setOrderSuccess}
                    />
                  </div>
                ))}

            </div>
          </div>

        </div>
      )}

      {/* SIMULATOR ORDER SUCCESS DIALOG */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2A] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                🎉 ทดสอบส่งคำสั่งซื้อสำเร็จ!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ระบบได้จำลองการบันทึกออเดอร์ และเตรียมส่งแจ้งเตือนเข้า LINE ร้านค้าเรียบร้อยแล้ว
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-400">ผู้สั่งซื้อ:</span><span className="font-bold">{orderForm.name || 'คุณลูกค้า'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">เบอร์โทรศัพท์:</span><span className="font-mono font-bold">{orderForm.phone || '-'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">การชำระเงิน:</span><span className="font-bold text-emerald-600">{orderForm.payment_method === 'promptpay' ? '📱 พร้อมเพย์ (แนบสลิป)' : '🚚 เก็บเงินปลายทาง (COD)'}</span></div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-bold"><span>ยอดรวมทั้งสิ้น:</span><span className="font-mono text-purple-600">฿{previewTotal.toLocaleString()} บาท</span></div>
            </div>

            <button
              type="button"
              onClick={() => {
                setOrderSuccess(false)
                setOrderForm({ name: '', phone: '', line_id: '', address: '', note: '', payment_method: 'promptpay', slip_url: '' })
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer"
            >
              ตกลง (ปิดหน้าต่าง)
            </button>
          </div>
        </div>
      )}

            {/* AI VISION ANALYSIS & API KEY MODAL (REAL WORKING MULTIMODAL AI) */}
      {isAiAnalyzeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#131B2A] rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>วิเคราะห์รูปภาพสินค้า & สร้างเซลเพจด้วย AI</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-light">
                    AI Vision จะวิเคราะห์รูปภาพสินค้า เขียนคำโฆษณา จัดเซ็ตโปรโมชั่น และสร้าง 13 บล็อกให้อัตโนมัติ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiAnalyzeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Message Banner */}
            {aiSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center space-y-1 animate-in zoom-in-95">
                <Check className="w-6 h-6 mx-auto text-emerald-400" />
                <p>{aiSuccessMsg}</p>
              </div>
            )}

            <div className="space-y-4">
              
              {/* CARD 1: API KEY CONFIGURATION & LIVE VALIDATION */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-purple-600" />
                    <span>1. ตั้งค่า AI API Key (Google Gemini หรือ OpenAI)</span>
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <span>รับ Free Key จาก Google</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={userAiApiKey}
                      onChange={(e) => {
                        const val = e.target.value
                        setUserAiApiKey(val)
                        setKeyValidationResult(null)
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('user_ai_api_key', val.trim())
                          localStorage.setItem('gemini_api_key', val.trim())
                        }
                      }}
                      placeholder="วาง API Key เช่น AIzaSy... หรือ sk-..."
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title={showApiKey ? 'ซ่อน' : 'แสดง'}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleValidateApiKey()}
                    disabled={isTestingKey || !userAiApiKey.trim()}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-purple-600 dark:hover:bg-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isTestingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    <span>{isTestingKey ? 'กำลังตรวจ...' : 'ตรวจสอบ Key'}</span>
                  </button>
                </div>

                {/* Validation Status Badge */}
                {keyValidationResult && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      keyValidationResult.valid
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {keyValidationResult.valid ? (
                      <>
                        <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span>✅ API Key ถูกต้อง: พร้อมใช้งาน {keyValidationResult.provider}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>❌ {keyValidationResult.error}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* CARD 2: PRODUCT IMAGE & HINTS */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>2. อัปโหลดรูปภาพสินค้า & ข้อมูลระบุเจาะจง</span>
                </span>

                <ImageUploaderBox
                  label="อัปโหลดรูปภาพสินค้าของคุณ (JPG, PNG, WebP)"
                  value={aiProductImage}
                  onChange={(url) => {
                    setAiProductImage(url)
                    if (url.startsWith('data:')) setAiProductBase64(url)
                  }}
                  uploadImageFile={uploadAiProductImage}
                  uploadingImage={uploadingImage}
                  setUploadingImage={setUploadingImage}
                  aspect="aspect-video"
                />

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    ชื่อสินค้า หรือ คำบรรยายคุณสมบัติเสริม (ไม่บังคับ แต่ช่วยให้ AI เขียนได้ตรงจุดยิ่งขึ้น)
                  </label>
                  <input
                    type="text"
                    value={aiProductHint}
                    onChange={(e) => setAiProductHint(e.target.value)}
                    placeholder="เช่น เซรั่มบำรุงผิวหน้าลดฝ้ากระ, คอลลาเจนชงดื่ม, น้ำหอมฟีโรโมน..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Step Status Indicator during Generation */}
              {aiAnalyzing && (
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-600 shrink-0" />
                  <span>{aiAnalyzeStep || 'AI กำลังประมวลผลข้อมูล...'}</span>
                </div>
              )}

              {/* Submit Action Button */}
              <button
                type="button"
                onClick={handleRunAiVisionAnalysis}
                disabled={aiAnalyzing || (!aiProductImage && !aiProductHint)}
                className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {aiAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>กำลังวิเคราะห์และสร้างเซลเพจ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>✨ เริ่มวิเคราะห์รูปภาพ & สร้างเนื้อหา 13 บล็อกด้วย AI</span>
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}


            {/* BEAUTIFUL CONFIRMATION MODAL: 990 POINTS DEDUCTION & PUBLISH */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2A] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-5 animate-in zoom-in-95">
            
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shadow-lg border border-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                🎉 บันทึกและเผยแพร่เซลเพจสำเร็จ!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                เซลเพจของคุณพร้อมออนไลน์และรับออเดอร์ได้ทันที
              </p>
            </div>

            {/* Points & Quota Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">⚡ หักแต้มค่าบริการ:</span>
                <span className="font-mono font-black text-rose-500">-990 แต้ม</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">🪙 แต้มคงเหลือปัจจุบัน:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {profile?.points !== undefined ? profile.points.toLocaleString() : 0} แต้ม
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">📦 โควตาเซลเพจที่ได้รับ:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  +1 ช่อง (โควตารวม {profile?.extra_landing_page_slots || 1} ช่อง)
                </span>
              </div>
            </div>

            {/* URL Display */}
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 block">ลิงก์เซลเพจสาธารณะ:</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-purple-950 dark:text-white truncate">
                  {publicLiveUrl}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publicLiveUrl)
                    setCopiedUrl(true)
                    setTimeout(() => setCopiedUrl(false), 2000)
                  }}
                  className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  {copiedUrl ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={publicLiveUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิดดูหน้าจริง ↗</span>
              </a>

              <button
                type="button"
                onClick={() => setSaveSuccess(false)}
                className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                ตกลง / ปิด
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
