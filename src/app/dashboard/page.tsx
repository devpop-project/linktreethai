'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUserTier } from '@/lib/tier'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import SalesLandingPagePreview from '@/components/SalesLandingPagePreview'
import PixelAnalyticsModal from '@/components/PixelAnalyticsModal'
import TopUpPointsModal from '@/components/TopUpPointsModal'
import { Link2, ShoppingBag, Palette, ExternalLink, Activity, Rocket, Plus, Trash2, Save, LogOut, Check, Eye, Upload, Image as ImageIcon, Sparkles, Globe, Youtube, RefreshCw, Share2, LayoutTemplate, Crown, Coins, Lock, AlertCircle, Users, Download, ShieldCheck, Zap, QrCode, X, MessageCircle, Scissors, Copy, Smartphone, Menu, ChevronRight, CheckCircle2, ArrowUpRight, Clock, KeyRound, Edit2, Camera, Sun, Moon, Filter, Search, BarChart3, ChevronDown, Phone, Mail, MapPin, DollarSign, Calendar, FileText, CheckSquare, Layers, EyeOff, ArrowUpDown, UserCheck, UserX, ListOrdered, Sliders, Flame, Send, ArrowRight, CheckCircle } from 'lucide-react'

interface LandingPageFormData {
  slug: string
  title: string
  headline: string
  subheadline: string
  hero_image_url: string
  video_url: string
  hero_media_url: string
  hero_media_type: string
  offer_price: string
  original_price: string
  countdown_minutes: number
  cta_text: string
  cta_url: string
  sticky_btn1_text: string
  sticky_btn1_url: string
  sticky_btn2_text: string
  sticky_btn2_url: string
  sticky_btn3_text: string
  sticky_btn3_url: string
  cta_secondary_text: string
  cta_secondary_url: string
  cta_shop_text: string
  cta_shop_url: string
  features_text: string
  body_content: string
  theme_color: string
  bg_color: string
  bg_image_url: string
  card_style: string
  gallery_images_text: string
  review_images_text: string
  pain_headline: string
  pain_points_text: string
  benefits_headline: string
  benefits_text: string
  testimonials_text: string
  faqs_text: string
  guarantee_text: string
  trust_badge_1: string
  trust_badge_2: string
  trust_badge_3: string
  enable_cod_form: boolean
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_image_url: string
  fb_pixel_id: string
  tiktok_pixel_id: string
  google_pixel_id: string
  line_tag_id: string
}

const DEFAULT_LANDING_PAGE_FORM: LandingPageFormData = {
  slug: '',
  title: '',
  headline: '',
  subheadline: '',
  hero_image_url: '',
  video_url: '',
  hero_media_url: '',
  hero_media_type: 'image',
  offer_price: '990',
  original_price: '1990',
  countdown_minutes: 15,
  cta_text: 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
  cta_url: '',
  sticky_btn1_text: 'ติดต่อสั่งซื้อด่วน',
  sticky_btn1_url: '',
  sticky_btn2_text: 'ช่องทางติดต่ออื่นๆ',
  sticky_btn2_url: '',
  sticky_btn3_text: 'สั่งซื้อออนไลน์',
  sticky_btn3_url: '',
  cta_secondary_text: 'ช่องทางติดต่ออื่นๆ',
  cta_secondary_url: '',
  cta_shop_text: 'สั่งซื้อออนไลน์',
  cta_shop_url: '',
  features_text: '✓ ส่งฟรีทั่วไทย (จัดส่งด่วน 1-2 วัน)\n✓ มีบริการเก็บเงินปลายทาง (COD)\n✓ รับประกันของแท้ 100% ตรงจากผู้ผลิต\n✓ มีทีมงานผู้เชี่ยวชาญให้คำแนะนำตลอด 24 ชม.',
  body_content: '',
  theme_color: '#EF4444',
  bg_color: '#0B0F17',
  bg_image_url: '',
    inner_bg_image_url: '',
  card_style: 'glass',
  gallery_images_text: '',
  review_images_text: '',
  pain_headline: 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?',
  pain_points_text: '❌ เบื่อไหม? ลูกค้าทักมาขอลิงก์ช้อปปิ้งทีละแอปจนตอบไม่ทัน\n❌ ยิงแอดไปเท่าไหร่ แต่เก็บ Data ลูกค้าไม่ได้เลยใช่ไหม?\n❌ ปิดการขายช้าเพราะลูกค้าสับสนช่องทางชำระเงิน',
  benefits_headline: 'ทางออกและผลลัพธ์ที่คุณจะได้รับ',
  benefits_text: '✓ รวมทุกลิงก์และระบบรับเงินจบในหน้าเดียว ลูกค้าไม่สับสน\n✓ ฝัง Pixel ง่ายๆ ช่วยให้คุณยิงแอดตามติดลูกค้า เพิ่มยอดขาย 300%\n✓ ดึงยอดคนดูเข้าไลฟ์สดได้ทันทีจากทุกช่องทาง แบบ Real-time',
  testimonials_text: 'ตั้งแต่เปลี่ยนมาใช้หน้านี้ ยอดขายจาก TikTok Ads เพิ่มขึ้น 3 เท่า ลูกค้าสั่งซื้อง่ายมาก\nระบบจัดการลิงก์และเซลเพจที่ดีที่สุด ช่วยประหยัดเวลาตอบแชตได้เยอะมาก',
  faqs_text: 'มีบริการเก็บเงินปลายทาง (COD) ไหม? | มีครับ สามารถกรอกที่อยู่แล้วรอชำระเงินเมื่อสินค้าถึงได้เลย\nจัดส่งสินค้ากี่วันถึง? | จัดส่งด่วน Flash/EMS สินค้าถึงภายใน 1-2 วันทำการครับ\nสินค้าเป็นของแท้ 100% ไหม? | ของแท้ 100% รับประกันความพึงพอใจ ยินดีคืนเงิน',
  guarantee_text: '🛡️ รับประกันความพึงพอใจ ของแท้ 100% ยินดีคืนเงินภายใน 7 วัน',
  trust_badge_1: 'ส่งฟรีด่วน',
  trust_badge_2: 'ของแท้ 100%',
  trust_badge_3: 'ชำระเงินปลอดภัย',
  enable_cod_form: true,
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  og_image_url: '',
  fb_pixel_id: '',
  tiktok_pixel_id: '',
  google_pixel_id: '',
  line_tag_id: ''
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'links' | 'shop' | 'appearance' | 'landing_pages' | 'shortener' | 'leads' | 'billing'>('links')
  const [user, setUser] = useState<any>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const [profile, setProfile] = useState<any>({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '',
    cover_url: '',
    bg_image_url: '',
    inner_bg_image_url: '',
    youtube_url: '',
    bg_color: '#0B0F17',
    text_color: '#FFFFFF',
    inner_bg_image_url: '',
    inner_bg_image_url: '',
    template_id: 'template_1',
    role: 'user',
    points: 0,
    pro_expires_at: null,
    master_expires_at: null,
    shortener_expires_at: null,
    hide_branding: false,
    og_title: '',
    og_description: '',
    og_image_url: '',
    bg_color: '#0B0F17',
    text_color: '#FFFFFF',
    custom_button_color: '#1E1B4B',
    custom_button_text_color: '#FFFFFF',
    theme_name: 'default',
    social_facebook: '',
    social_instagram: '',
    social_tiktok: '',
    social_youtube: '',
    social_line: '',
    social_shopee: '',
    social_lazada: '',
    social_x: '',
    social_pinterest: '',
    social_email: '',
    fb_pixel_id: '',
    tiktok_pixel_id: '',
    google_pixel_id: '',
    line_tag_id: '',
    line_channel_access_token: '',
    line_user_id: '',
    line_notify_token: '',
    line_webhook_url: '',
    extra_landing_page_slots: 0,
  })
  
  const [landingPages, setLandingPages] = useState<any[]>([])
  const [editingLandingPageId, setEditingLandingPageId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'bio' | 'landing'>('bio')
  const [unlockingLandingSlot, setUnlockingLandingSlot] = useState(false)
  const [newLandingPage, setNewLandingPage] = useState<LandingPageFormData>(DEFAULT_LANDING_PAGE_FORM)
  const [uploadingLpImg, setUploadingLpImg] = useState(false)
  const [pixelAnalyticsOpen, setPixelAnalyticsOpen] = useState(false)
  
  const [links, setLinks] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [shortLinks, setShortLinks] = useState<any[]>([])

  // Modal States
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  // --- ACCOUNT & PROFILE EDITING & PASSWORD STATES ---
    // --- Confirmation Modal for Spending Points ---
  const [testingLineNotify, setTestingLineNotify] = useState(false)
  const [lpExpiryDetailModal, setLpExpiryDetailModal] = useState<any>(null)
  const [confirmRedeemModal, setConfirmRedeemModal] = useState<{
    isOpen: boolean
    title: string
    desc: string
    cost: number
    onConfirm: () => void
  } | null>(null)

  // --- Download & Share QR Code Helpers ---
  const handleDownloadQrCode = async (targetUrl: string, filename: string = 'qrcode.png') => {
    try {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=15&data=${encodeURIComponent(targetUrl)}`
      const res = await fetch(qrApiUrl)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
      showToast('💾 ดาวน์โหลดรูปภาพ QR Code สำเร็จแล้ว')
    } catch (e) {
      // Fallback open image in new tab
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(targetUrl)}`, '_blank')
    }
  }

  const handleShareUrl = async (title: string, url: string) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title || 'LinkTreeThai',
          url: url
        })
        return
      } catch (err) {}
    }
    // Fallback to clipboard
    handleCopyLink(url, 'share_url')
    showToast('🔗 คัดลอกลิงก์พร้อมแชร์เรียบร้อยแล้ว')
  }

  const [accountActiveTab, setAccountActiveTab] = useState<'info' | 'password' | 'points'>('info')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordChangeMsg, setPasswordChangeMsg] = useState('')

  const [pointsDetailModalOpen, setPointsDetailModalOpen] = useState(false)
  const [topUpModalOpen, setTopUpModalOpen] = useState(false)
  const [unlockingPixels, setUnlockingPixels] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrTargetUrl, setQrTargetUrl] = useState('')
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [unlockingShortener, setUnlockingShortener] = useState(false)
  const [adminContactModal, setAdminContactModal] = useState(false)
  const [redeemingTier, setRedeemingTier] = useState<string | null>(null)

  // Form States
    // --- FULL CRUD MODALS & EDIT STATES FOR ALL 10 TABLES ---
  const [editingLink, setEditingLink] = useState<any>(null)
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false)
  const [uploadingEditLinkLogo, setUploadingEditLinkLogo] = useState(false)

  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [uploadingEditProductImg, setUploadingEditProductImg] = useState(false)

  const [editingShortLink, setEditingShortLink] = useState<any>(null)
  const [isEditShortLinkOpen, setIsEditShortLinkOpen] = useState(false)
  const [shortLinkAnalyticsModalOpen, setShortLinkAnalyticsModalOpen] = useState(false)
  const [selectedShortLinkForAnalytics, setSelectedShortLinkForAnalytics] = useState<any>(null)
  const [shortLinkAnalyticsLogs, setShortLinkAnalyticsLogs] = useState<any[]>([])
  const [loadingShortLinkAnalytics, setLoadingShortLinkAnalytics] = useState(false)

  const [analyticsEventsModalOpen, setAnalyticsEventsModalOpen] = useState(false)
  const [analyticsEventsList, setAnalyticsEventsList] = useState<any[]>([])
  const [loadingAnalyticsEvents, setLoadingAnalyticsEvents] = useState(false)

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
  const [newLeadForm, setNewLeadForm] = useState({
    name: '', phone: '', email: '', line_id: '', amount: '', address: '', order_code: '', note: '', status: 'pending'
  })
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  const [isLeadDetailsModalOpen, setIsLeadDetailsModalOpen] = useState(false)
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<any>(null)
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all')
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>('')

  const [myPaymentTransactions, setMyPaymentTransactions] = useState<any[]>([])
  const [loadingPaymentTransactions, setLoadingPaymentTransactions] = useState(false)
  const [zoomSlipUrl, setZoomSlipUrl] = useState<string | null>(null)

  const [newLink, setNewLink] = useState({ 
    title: '', 
    subtitle: '', 
    url: '', 
    icon: 'website', 
    logo_url: '',
    bg_color: '#1E1B4B',
    text_color: '#FFFFFF',
    starts_at: '',
    ends_at: ''
  })
  
  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    category: 'ทั่วไป', 
    image_url: '', 
    buy_url: '', 
    badge: '' 
  })

  const [newShortLink, setNewShortLink] = useState({
    slug: '',
    original_url: '',
    title: '',
    is_active: true
  })
  
  const [uploading, setUploading] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState('')

  const router = useRouter()
  const supabase = createClient()

  // Initialize Dark / Light Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('linktree_theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

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

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    setUser(session.user)

    // Fetch Profile
    const { data: profData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profData) {
      setProfile({
        ...profData,
        role: profData.role || 'user',
        points: profData.points || 0,
        template_id: profData.template_id || 'template_1',
        custom_button_color: profData.custom_button_color || '#1E1B4B',
        custom_button_text_color: profData.custom_button_text_color || '#FFFFFF'
      })
    }

    // Fetch Links
    const { data: linkData } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', session.user.id)
      .order('position', { ascending: true })

    if (linkData) setLinks(linkData)

    // Fetch Products
    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', session.user.id)
      .order('position', { ascending: true })

    if (prodData) setProducts(prodData)

    // Fetch Leads
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (leadData) setLeads(leadData)

    // Fetch Landing Pages
    const { data: lpData } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (lpData) setLandingPages(lpData)

    // Fetch Short Links
    const { data: sLinksData } = await supabase
      .from('short_links')
      .select('*')
      .eq('created_by', session.user.id)
      .order('created_at', { ascending: false })

    if (sLinksData) setShortLinks(sLinksData)

    setLoading(false)
  }

  const showToast = (msg: string) => {
    setSavedMsg(msg)
    setTimeout(() => setSavedMsg(''), 3500)
  }

  // --- Save Profile ---
    // =========================================================================
  // FULL CRUD HANDLERS FOR ALL 10 TABLES (LINKS, PRODUCTS, SHORT LINKS, LEADS, ETC.)
  // =========================================================================

  // --- 1. LINKS CRUD: Update & Toggle ---
  const handleEditLink = (link: any) => {
    setEditingLink({ ...link })
    setIsEditLinkOpen(true)
  }

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLink || !user) return
    try {
      const { error } = await supabase
        .from('links')
        .update({
          title: editingLink.title,
          subtitle: editingLink.subtitle || null,
          url: editingLink.url,
          icon: editingLink.icon || 'website',
          logo_url: editingLink.logo_url || null,
          bg_color: editingLink.bg_color || '#1E1B4B',
          text_color: editingLink.text_color || '#FFFFFF',
          starts_at: editingLink.starts_at || null,
          ends_at: editingLink.ends_at || null,
          is_active: editingLink.is_active
        })
        .eq('id', editingLink.id)
        .eq('user_id', user.id)

      if (!error) {
        setLinks(links.map(l => l.id === editingLink.id ? { ...l, ...editingLink } : l))
        setIsEditLinkOpen(false)
        setEditingLink(null)
        showToast('✓ อัปเดตข้อมูลลิ้งก์เรียบร้อยแล้ว')
      } else {
        showToast('❌ ไม่สามารถอัปเดตได้: ' + error.message)
      }
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    }
  }

  const handleToggleLinkActive = async (linkId: string, currentStatus: boolean) => {
    if (!user) return
    const nextStatus = !currentStatus
    try {
      const { error } = await supabase
        .from('links')
        .update({ is_active: nextStatus })
        .eq('id', linkId)
        .eq('user_id', user.id)

      if (!error) {
        setLinks(links.map(l => l.id === linkId ? { ...l, is_active: nextStatus } : l))
        showToast(nextStatus ? '✓ เปิดใช้งานลิ้งก์แล้ว' : '✓ ปิดใช้งานลิ้งก์ชั่วคราวแล้ว')
      }
    } catch (e) {}
  }

  // --- 2. PRODUCTS CRUD: Update & Toggle ---
  const handleEditProduct = (prod: any) => {
    setEditingProduct({ ...prod })
    setIsEditProductOpen(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !user) return
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: editingProduct.title,
          description: editingProduct.description || null,
          price: parseFloat(String(editingProduct.price)) || 0,
          currency: editingProduct.currency || 'THB',
          category: editingProduct.category || 'ทั่วไป',
          image_url: editingProduct.image_url || null,
          buy_url: editingProduct.buy_url,
          badge: editingProduct.badge || null,
          starts_at: editingProduct.starts_at || null,
          ends_at: editingProduct.ends_at || null,
          is_active: editingProduct.is_active
        })
        .eq('id', editingProduct.id)
        .eq('user_id', user.id)

      if (!error) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } : p))
        setIsEditProductOpen(false)
        setEditingProduct(null)
        showToast('✓ อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว')
      } else {
        showToast('❌ ไม่สามารถอัปเดตได้: ' + error.message)
      }
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    }
  }

  const handleToggleProductActive = async (productId: string, currentStatus: boolean) => {
    if (!user) return
    const nextStatus = !currentStatus
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: nextStatus })
        .eq('id', productId)
        .eq('user_id', user.id)

      if (!error) {
        setProducts(products.map(p => p.id === productId ? { ...p, is_active: nextStatus } : p))
        showToast(nextStatus ? '✓ เปิดใช้งานสินค้าแล้ว' : '✓ ปิดใช้งานสินค้าชั่วคราวแล้ว')
      }
    } catch (e) {}
  }

  // --- 3. SHORT LINKS CRUD: Update, Toggle & Analytics Logs ---
  const handleEditShortLink = (sl: any) => {
    setEditingShortLink({ ...sl })
    setIsEditShortLinkOpen(true)
  }

  const handleUpdateShortLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShortLink || !user) return
    const cleanSlug = editingShortLink.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '')
    try {
      const { error } = await supabase
        .from('short_links')
        .update({
          slug: cleanSlug,
          title: editingShortLink.title || null,
          original_url: editingShortLink.original_url,
          is_active: editingShortLink.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingShortLink.id)
        .eq('created_by', user.id)

      if (!error) {
        setShortLinks(shortLinks.map(s => s.id === editingShortLink.id ? { ...s, ...editingShortLink, slug: cleanSlug } : s))
        setIsEditShortLinkOpen(false)
        setEditingShortLink(null)
        showToast('✓ อัปเดตลิงก์ย่อเรียบร้อยแล้ว')
      } else {
        showToast('❌ เกิดข้อผิดพลาด: ' + error.message)
      }
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    }
  }

  const handleToggleShortLinkActive = async (shortLinkId: string, currentStatus: boolean) => {
    if (!user) return
    const nextStatus = !currentStatus
    try {
      const { error } = await supabase
        .from('short_links')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', shortLinkId)
        .eq('created_by', user.id)

      if (!error) {
        setShortLinks(shortLinks.map(s => s.id === shortLinkId ? { ...s, is_active: nextStatus } : s))
        showToast(nextStatus ? '✓ เปิดใช้งานลิงก์ย่อแล้ว' : '✓ ปิดใช้งานลิงก์ย่อแล้ว')
      }
    } catch (e) {}
  }

  const handleOpenShortLinkAnalytics = async (shortLink: any) => {
    setSelectedShortLinkForAnalytics(shortLink)
    setShortLinkAnalyticsModalOpen(true)
    setLoadingShortLinkAnalytics(true)
    try {
      const { data, error } = await supabase
        .from('short_link_analytics')
        .select('*')
        .eq('short_link_id', shortLink.id)
        .order('created_at', { ascending: false })
        .limit(150)

      if (!error && data) {
        setShortLinkAnalyticsLogs(data)
      }
    } catch (e) {}
    setLoadingShortLinkAnalytics(false)
  }

  const handleClearShortLinkAnalytics = async (shortLinkId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างสถิติคลิกทั้งหมดของลิงก์นี้?')) return
    try {
      await supabase.from('short_link_analytics').delete().eq('short_link_id', shortLinkId)
      await supabase.from('short_links').update({ clicks: 0 }).eq('id', shortLinkId)
      setShortLinks(shortLinks.map(s => s.id === shortLinkId ? { ...s, clicks: 0 } : s))
      setShortLinkAnalyticsLogs([])
      showToast('✓ ล้างสถิติคลิกเรียบร้อยแล้ว')
    } catch (e) {}
  }

  // --- 4. ANALYTICS EVENTS CRUD: View & Clear Logs ---
  const handleOpenAnalyticsEvents = async () => {
    if (!user) return
    setAnalyticsEventsModalOpen(true)
    setLoadingAnalyticsEvents(true)
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data) {
        setAnalyticsEventsList(data)
      }
    } catch (e) {}
    setLoadingAnalyticsEvents(false)
  }

  const handleClearAnalyticsEvents = async () => {
    if (!user) return
    if (!confirm('คุณต้องการลบประวัติกิจกรรม Event Logs ทั้งหมดใช่หรือไม่?')) return
    try {
      await supabase.from('analytics_events').delete().eq('user_id', user.id)
      setAnalyticsEventsList([])
      showToast('✓ ล้างประวัติ Event Logs เรียบร้อยแล้ว')
    } catch (e) {}
  }

  // --- 5. LEADS CRM CRUD: Create, Read, Update, Delete & Details ---
    const handleRefreshLeads = async () => {
    if (!user?.id) return
    setLoadingLeads(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLeads(data)
        showToast('✓ รีเฟรชข้อมูลลูกค้าเรียบร้อยแล้ว (' + data.length + ' รายการ)')
      }
    } catch (e) {}
    setLoadingLeads(false)
  }

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadForm.name || !user) return
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          user_id: user.id,
          name: newLeadForm.name.trim(),
          phone: newLeadForm.phone.trim() || null,
          email: newLeadForm.email.trim() || null,
          line_id: newLeadForm.line_id.trim() || null,
          amount: newLeadForm.amount ? parseFloat(newLeadForm.amount) : null,
          address: newLeadForm.address.trim() || null,
          order_code: newLeadForm.order_code.trim() || `MAN-${Date.now().toString().slice(-6)}`,
          note: newLeadForm.note.trim() || null,
          status: newLeadForm.status || 'pending'
        }])
        .select()

      if (!error && data) {
        setLeads([data[0], ...leads])
        setIsAddLeadModalOpen(false)
        setNewLeadForm({ name: '', phone: '', email: '', line_id: '', amount: '', address: '', order_code: '', note: '', status: 'pending' })
        showToast('✓ เพิ่มข้อมูลลูกค้าใหม่เรียบร้อยแล้ว')
      } else {
        showToast('❌ ไม่สามารถเพิ่มลีดได้: ' + (error?.message || ''))
      }
    } catch (e: any) {
      showToast('❌ ข้อผิดพลาด: ' + e.message)
    }
  }

  const handleEditLead = (lead: any) => {
    setEditingLead({ ...lead })
    setIsEditLeadModalOpen(true)
  }

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLead || !user) return
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          name: editingLead.name,
          phone: editingLead.phone || null,
          email: editingLead.email || null,
          line_id: editingLead.line_id || null,
          amount: editingLead.amount ? parseFloat(String(editingLead.amount)) : null,
          address: editingLead.address || null,
          order_code: editingLead.order_code || null,
          note: editingLead.note || null,
          status: editingLead.status || 'pending'
        })
        .eq('id', editingLead.id)
        .eq('user_id', user.id)

      if (!error) {
        setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...editingLead } : l))
        setIsEditLeadModalOpen(false)
        setEditingLead(null)
        showToast('✓ อัปเดตข้อมูลลูกค้าเรียบร้อยแล้ว')
      } else {
        showToast('❌ ไม่สามารถอัปเดตได้: ' + error.message)
      }
    } catch (e: any) {
      showToast('❌ ข้อผิดพลาด: ' + e.message)
    }
  }

  const handleUpdateLeadStatus = async (leadId: string, nextStatus: string) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: nextStatus })
        .eq('id', leadId)
        .eq('user_id', user.id)

      if (!error) {
        setLeads(leads.map(l => l.id === leadId ? { ...l, status: nextStatus } : l))
        showToast('✓ อัปเดตสถานะเป็น ' + nextStatus)
      }
    } catch (e) {}
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!user) return
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลลูกค้ารายนี้?')) return
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)
        .eq('user_id', user.id)

      if (!error) {
        setLeads(leads.filter(l => l.id !== leadId))
        showToast('✓ ลบข้อมูลลูกค้าเรียบร้อยแล้ว')
      }
    } catch (e) {}
  }

  // --- 6. PAYMENT TRANSACTIONS CRUD: User History & Cancel ---
  const loadMyPaymentTransactions = async () => {
    if (!user?.id) return
    setLoadingPaymentTransactions(true)
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setMyPaymentTransactions(data)
      }
    } catch (e) {}
    setLoadingPaymentTransactions(false)
  }

  const handleCancelPendingSlip = async (txId: string) => {
    if (!user) return
    if (!confirm('คุณต้องการยกเลิกรายการสลิปที่รอตรวจสอบนี้ใช่หรือไม่?')) return
    try {
      const { error } = await supabase
        .from('payment_transactions')
        .delete()
        .eq('id', txId)
        .eq('user_id', user.id)
        .eq('status', 'pending')

      if (!error) {
        setMyPaymentTransactions(myPaymentTransactions.filter(t => t.id !== txId))
        showToast('✓ ยกเลิกรายการสลิปเรียบร้อยแล้ว')
      }
    } catch (e) {}
  }

    // --- Change Password & Save Account Info ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      showToast('❌ รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
      return
    }
    if (newPassword !== confirmPassword) {
      showToast('❌ รหัสผ่านทั้งสองช่องไม่ตรงกัน')
      return
    }
    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) {
        showToast('❌ เปลี่ยนรหัสผ่านไม่สำเร็จ: ' + error.message)
      } else {
        showToast('✅ เปลี่ยนรหัสผ่านใหม่เรียบร้อยแล้ว')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordChangeMsg('✓ เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว')
        setTimeout(() => setPasswordChangeMsg(''), 5000)
      }
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    } finally {
      setChangingPassword(false)
    }
  }

    // --- Real-time LINE Notification Test & Landing Page Renewal Handlers ---
  const handleTestLineNotify = async () => {
    if (!profile.line_channel_access_token && !profile.line_user_id && !profile.line_notify_token && !profile.line_webhook_url) {
      showToast('❌ กรุณากรอก LINE Channel Access Token & User ID หรือ Webhook URL ก่อนกดทดสอบ')
      return
    }
    setTestingLineNotify(true)
    try {
      const res = await fetch('/api/test-line-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_access_token: profile.line_channel_access_token,
          user_id: profile.line_user_id,
          token: profile.line_notify_token,
          webhook_url: profile.line_webhook_url
        })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('🔔 ' + data.message)
      } else {
        showToast('❌ ' + (data.error || 'ส่งข้อความไม่สำเร็จ กรุณาตรวจสอบ Token'))
      }
    } catch (e: any) {
      showToast('❌ เกิดข้อผิดพลาด: ' + e.message)
    } finally {
      setTestingLineNotify(false)
    }
  }

  const handleRenewLandingPage = async (lpId: string, currentExp: string | null, title: string) => {
    if (!user) return
    if ((profile.points || 0) < 350) {
      showToast('❌ แต้มไม่เพียงพอ ต้องการ 350 แต้มเพื่อต่ออายุเซลเพจ 30 วัน')
      setTopUpModalOpen(true)
      return
    }
    try {
      const baseTime = (currentExp && new Date(currentExp).getTime() > Date.now()) ? new Date(currentExp).getTime() : Date.now()
      const newExp = new Date(baseTime + 30 * 24 * 60 * 60 * 1000).toISOString()
      const newPts = (profile.points || 0) - 350

      const { error } = await supabase
        .from('landing_pages')
        .update({ expires_at: newExp, updated_at: new Date().toISOString() })
        .eq('id', lpId)
        .eq('user_id', user.id)

      if (!error) {
        await supabase.from('profiles').update({ points: newPts }).eq('id', user.id)
        setProfile({ ...profile, points: newPts })
        setLandingPages(landingPages.map(p => p.id === lpId ? { ...p, expires_at: newExp } : p))
        showToast(`✅ ต่ออายุหน้าเซลเพจ "${title}" อีก 30 วัน เรียบร้อยแล้ว`)
      } else {
        showToast('❌ ไม่สามารถต่ออายุได้: ' + error.message)
      }
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    }
  }

  const handleSaveAccountInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (!error) {
        showToast('✅ บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว')
      } else {
        showToast('❌ ไม่สามารถบันทึกข้อมูลได้: ' + error.message)
      }
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        cover_url: profile.cover_url,
        bg_color: profile.bg_color || '#0B0F17',
        text_color: profile.text_color || '#FFFFFF',
        inner_bg_image_url: profile.inner_bg_image_url || null,
        inner_bg_color: profile.inner_bg_color || profile.bg_color || '#0B0F17',
        outer_bg_color: profile.outer_bg_color || '#0B0F17',
        text_secondary_color: profile.text_secondary_color || '#94A3B8',
        card_bg_color: profile.card_bg_color || '#FFFFFF',
        bg_image_url: profile.bg_image_url || null,
        youtube_url: profile.youtube_url,
        template_id: profile.template_id,
        hide_branding: profile.hide_branding,
        custom_button_color: profile.custom_button_color,
        custom_button_text_color: profile.custom_button_text_color,
        social_facebook: profile.social_facebook,
        social_instagram: profile.social_instagram,
        social_tiktok: profile.social_tiktok,
        social_youtube: profile.social_youtube,
        social_line: profile.social_line,
        social_shopee: profile.social_shopee,
        social_lazada: profile.social_lazada,
        social_x: profile.social_x,
        social_pinterest: profile.social_pinterest,
        social_email: profile.social_email,
        fb_pixel_id: profile.fb_pixel_id,
        tiktok_pixel_id: profile.tiktok_pixel_id,
        google_pixel_id: profile.google_pixel_id,
        line_tag_id: profile.line_tag_id,
        line_channel_access_token: profile.line_channel_access_token?.trim() || null,
        line_user_id: profile.line_user_id?.trim() || null,
        line_notify_token: profile.line_notify_token || null,
        line_webhook_url: profile.line_webhook_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (!error) {
      showToast('✅ บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว')
    } else {
      showToast('❌ เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  // --- Links Management ---
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLink.title || !newLink.url || !user) return

    let finalUrl = newLink.url.trim()
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl
    }

    const { data, error } = await supabase
      .from('links')
      .insert([{
        user_id: user.id,
        title: newLink.title,
        subtitle: newLink.subtitle,
        url: finalUrl,
        icon: newLink.icon || 'website',
        logo_url: newLink.logo_url || null,
        bg_color: newLink.bg_color || '#1E1B4B',
        text_color: newLink.text_color || '#FFFFFF',
        position: links.length
      }])
      .select()

    if (!error && data) {
      setLinks([...links, data[0]])
      setNewLink({ title: '', subtitle: '', url: '', icon: 'website', logo_url: '', bg_color: '#1E1B4B', text_color: '#FFFFFF' })
      showToast('✅ เพิ่มลิ้งก์ใหม่สำเร็จ')
    } else if (error) {
      showToast('❌ เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const handleDeleteLink = async (id: string) => {
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (!error) {
      setLinks(links.filter(l => l.id !== id))
      showToast('🗑️ ลบลิ้งก์เรียบร้อยแล้ว')
    }
  }



  // --- Shop Products Management ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.title || !newProduct.buy_url || !user) return

    let finalBuyUrl = newProduct.buy_url.trim()
    if (!finalBuyUrl.startsWith('http://') && !finalBuyUrl.startsWith('https://')) {
      finalBuyUrl = 'https://' + finalBuyUrl
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        user_id: user.id,
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price) || 0,
        category: newProduct.category,
        image_url: newProduct.image_url,
        buy_url: finalBuyUrl,
        badge: newProduct.badge,
        position: products.length
      }])
      .select()

    if (!error && data) {
      setProducts([...products, data[0]])
      setNewProduct({ title: '', description: '', price: '', category: 'ทั่วไป', image_url: '', buy_url: '', badge: '' })
      showToast('✅ เพิ่มสินค้าเรียบร้อยแล้ว')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
      showToast('🗑️ ลบสินค้าเรียบร้อยแล้ว')
    }
  }

  // --- Short Links Unlock with 100 Points for 30 Days ---
  const handleUnlockShortener = async () => {
    if (!user) return
    if ((profile.points || 0) < 100) {
      showToast(`❌ แต้มสะสมของคุณไม่เพียงพอ (ต้องการ 100 แต้ม แต่คุณมี ${profile.points || 0} แต้ม)`)
      return
    }

    setUnlockingShortener(true)
    try {
      const { data, error } = await supabase.rpc('unlock_shortener_with_points', {
        target_user_id: user.id,
        points_cost: 100,
        duration_days: 30
      })

      if (error) {
        const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        const { error: updErr } = await supabase.from('profiles').update({
          points: (profile.points || 0) - 100,
          shortener_expires_at: newExpiry
        }).eq('id', user.id)

        if (!updErr) {
          setProfile({ ...profile, points: (profile.points || 0) - 100, shortener_expires_at: newExpiry })
          showToast('🎉 ปลดล็อกระบบย่อลิงก์สำเร็จ 30 วัน!')
        } else {
          showToast('❌ เกิดข้อผิดพลาดในการปลดล็อก: ' + updErr.message)
        }
      } else if (data && data.success) {
        setProfile({
          ...profile,
          points: data.remaining_points,
          shortener_expires_at: data.new_expires_at
        })
        showToast('🎉 ' + data.message)
      } else if (data && !data.success) {
        showToast('❌ ' + data.message)
      }
    } catch (err: any) {
      showToast('❌ เกิดข้อผิดพลาด: ' + err.message)
    } finally {
      setUnlockingShortener(false)
    }
  }

  const handleUnlockPixels = async () => {
    if (!user) return
    if ((profile.points || 0) < 100) {
      showToast(`❌ แต้มสะสมไม่เพียงพอ (ต้องการ 100 แต้ม แต่คุณมี ${profile.points || 0} แต้ม)`)
      setTopUpModalOpen(true)
      return
    }

    setUnlockingPixels(true)
    try {
      const { data, error } = await supabase.rpc('unlock_pixels_with_points', {
        target_user_id: user.id,
        points_cost: 100
      })

      if (error) {
        // Fallback direct update
        const currExp = profile.pixel_expires_at && new Date(profile.pixel_expires_at).getTime() > Date.now()
          ? new Date(profile.pixel_expires_at)
          : new Date()
        const newExp = new Date(currExp.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        const newPts = (profile.points || 0) - 100

        await supabase.from('profiles').update({
          points: newPts,
          pixel_expires_at: newExp
        }).eq('id', user.id)

        setProfile({ ...profile, points: newPts, pixel_expires_at: newExp })
        showToast('🎉 ปลดล็อกระบบ Tracking Pixels สำเร็จ 30 วัน!')
      } else if (data && data.success) {
        setProfile({
          ...profile,
          points: data.remaining_points,
          pixel_expires_at: data.expires_at
        })
        showToast('🎉 ' + data.message)
      } else if (data && !data.success) {
        showToast('❌ ' + data.message)
      }
    } catch (e: any) {
      showToast('❌ เกิดข้อผิดพลาด: ' + e.message)
    } finally {
      setUnlockingPixels(false)
    }
  }

  const handleCloseAccountModal = () => {
    setAccountModalOpen(false)
    setPointsDetailModalOpen(false)
  }

  // --- Landing Page Quota & Handlers ---
  const handleStartEditLandingPage = (lp: any) => {
    setEditingLandingPageId(lp.id)
    setNewLandingPage({
      ...DEFAULT_LANDING_PAGE_FORM,
      slug: lp.slug || '',
      title: lp.title || '',
      headline: lp.headline || '',
      subheadline: lp.subheadline || '',
      hero_image_url: lp.hero_image_url || '',
      video_url: lp.video_url || '',
      hero_media_url: lp.hero_media_url || '',
      hero_media_type: lp.hero_media_type || 'image',
      offer_price: String(lp.offer_price ?? ''),
      original_price: String(lp.original_price ?? ''),
      countdown_minutes: lp.countdown_minutes ?? 15,
      cta_text: lp.cta_text || 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
      cta_url: lp.cta_url || '',
      sticky_btn1_text: lp.sticky_btn1_text || lp.cta_text || 'ติดต่อสั่งซื้อด่วน',
      sticky_btn1_url: lp.sticky_btn1_url || lp.cta_url || '',
      sticky_btn2_text: lp.sticky_btn2_text || lp.cta_secondary_text || 'ช่องทางติดต่ออื่นๆ',
      sticky_btn2_url: lp.sticky_btn2_url || lp.cta_secondary_url || '',
      sticky_btn3_text: lp.sticky_btn3_text || lp.cta_shop_text || 'สั่งซื้อออนไลน์',
      sticky_btn3_url: lp.sticky_btn3_url || lp.cta_shop_url || '',
      cta_secondary_text: lp.cta_secondary_text || lp.sticky_btn2_text || 'ช่องทางติดต่ออื่นๆ',
      cta_secondary_url: lp.cta_secondary_url || lp.sticky_btn2_url || '',
      cta_shop_text: lp.cta_shop_text || lp.sticky_btn3_text || 'สั่งซื้อออนไลน์',
      cta_shop_url: lp.cta_shop_url || lp.sticky_btn3_url || '',
      features_text: Array.isArray(lp.features) ? lp.features.join('\n') : (lp.features || DEFAULT_LANDING_PAGE_FORM.features_text),
      body_content: lp.body_content || '',
      theme_color: lp.theme_color || '#EF4444',
      bg_color: lp.bg_color || '#0B0F17',
      bg_image_url: lp.bg_image_url || '',
      card_style: lp.card_style || 'glass',
      gallery_images_text: Array.isArray(lp.gallery_images) ? lp.gallery_images.join('\n') : (lp.gallery_images || ''),
      review_images_text: Array.isArray(lp.review_images) ? lp.review_images.join('\n') : (lp.review_images || ''),
      pain_headline: lp.pain_headline || DEFAULT_LANDING_PAGE_FORM.pain_headline,
      pain_points_text: Array.isArray(lp.pain_points) ? lp.pain_points.join('\n') : (lp.pain_points || DEFAULT_LANDING_PAGE_FORM.pain_points_text),
      benefits_headline: lp.benefits_headline || DEFAULT_LANDING_PAGE_FORM.benefits_headline,
      benefits_text: Array.isArray(lp.benefits) ? lp.benefits.join('\n') : (lp.benefits || DEFAULT_LANDING_PAGE_FORM.benefits_text),
      testimonials_text: Array.isArray(lp.testimonials) ? lp.testimonials.join('\n') : (lp.testimonials || DEFAULT_LANDING_PAGE_FORM.testimonials_text),
      faqs_text: Array.isArray(lp.faqs) ? lp.faqs.join('\n') : (lp.faqs || DEFAULT_LANDING_PAGE_FORM.faqs_text),
      guarantee_text: lp.guarantee_text || DEFAULT_LANDING_PAGE_FORM.guarantee_text,
      trust_badge_1: lp.trust_badge_1 || 'ส่งฟรีด่วน',
      trust_badge_2: lp.trust_badge_2 || 'ของแท้ 100%',
      trust_badge_3: lp.trust_badge_3 || 'ชำระเงินปลอดภัย',
      enable_cod_form: lp.enable_cod_form !== false,
      seo_title: lp.seo_title || '',
      seo_description: lp.seo_description || '',
      seo_keywords: lp.seo_keywords || '',
      og_image_url: lp.og_image_url || '',
      fb_pixel_id: lp.fb_pixel_id || '',
      tiktok_pixel_id: lp.tiktok_pixel_id || '',
      google_pixel_id: lp.google_pixel_id || '',
      line_tag_id: lp.line_tag_id || ''
    })
    setPreviewMode('landing')
    showToast('✏️ กำลังแก้ไขเซลเพจ: ' + lp.title)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }

  const handleCancelEditLandingPage = () => {
    setEditingLandingPageId(null)
    setNewLandingPage(DEFAULT_LANDING_PAGE_FORM)
  }

  const handleUploadLpImage = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'hero' | 'og' | 'bg' | 'gallery' | 'review') => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingLpImg(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `lp-${user.id}-${Date.now()}.${fileExt}`
      const filePath = `landing-pages/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        showToast('❌ อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadError.message)
      } else {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
        if (targetField === 'hero') {
          setNewLandingPage({ ...newLandingPage, hero_image_url: publicUrl, hero_media_url: publicUrl, hero_media_type: 'image' })
        } else if (targetField === 'bg') {
          setNewLandingPage({ ...newLandingPage, bg_image_url: publicUrl })
        } else if (targetField === 'gallery') {
          const current = newLandingPage.gallery_images_text.trim()
          setNewLandingPage({ ...newLandingPage, gallery_images_text: current ? `${current}\n${publicUrl}` : publicUrl })
        } else if (targetField === 'review') {
          const current = newLandingPage.review_images_text.trim()
          setNewLandingPage({ ...newLandingPage, review_images_text: current ? `${current}\n${publicUrl}` : publicUrl })
        } else {
          setNewLandingPage({ ...newLandingPage, og_image_url: publicUrl })
        }
        showToast('📸 อัปโหลดรูปภาพสำเร็จ!')
      }
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    } finally {
      setUploadingLpImg(false)
    }
  }

  const isPixelActive = profile?.role === 'admin' ||
    (profile?.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now()) ||
    (profile?.pixel_expires_at && new Date(profile.pixel_expires_at).getTime() > Date.now())

  const isMasterUser = profile?.role === 'admin' || (profile?.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now())
  const baseLandingSlots = isMasterUser ? 1 : 0
  const totalLandingSlots = profile?.role === 'admin' ? 9999 : (baseLandingSlots + (profile?.extra_landing_page_slots || 0))
  const isLandingQuotaFull = profile?.role !== 'admin' && landingPages.length >= totalLandingSlots
  const isLandingActive = isMasterUser || totalLandingSlots > 0 || isPixelActive

  const handleUnlockLandingPageSlot = async () => {
    if (!user) return
    if ((profile.points || 0) < 350) {
      showToast(`❌ แต้มสะสมไม่เพียงพอ (ต้องการ 350 แต้ม แต่คุณมี ${profile.points || 0} แต้ม) กรุณาเติมแต้มก่อนครับ`)
      setTopUpModalOpen(true)
      return
    }

    setUnlockingLandingSlot(true)
    try {
      const { data, error } = await supabase.rpc('unlock_landing_page_with_points', {
        target_user_id: user.id,
        points_cost: 350
      })

      if (error) {
        const newSlots = (profile.extra_landing_page_slots || 0) + 1
        const newPts = (profile.points || 0) - 350
        await supabase.from('profiles').update({
          points: newPts,
          extra_landing_page_slots: newSlots
        }).eq('id', user.id)

        setProfile({ ...profile, points: newPts, extra_landing_page_slots: newSlots })
        showToast('🎉 ปลดล็อกโควตาเซลเพจเพิ่ม 1 URL สำเร็จ!')
      } else if (data && data.success) {
        setProfile({
          ...profile,
          points: data.remaining_points,
          extra_landing_page_slots: data.new_slots
        })
        showToast('🎉 ' + data.message)
      } else if (data && !data.success) {
        showToast('❌ ' + data.message)
      }
    } catch (e: any) {
      showToast('❌ เกิดข้อผิดพลาด: ' + e.message)
    } finally {
      setUnlockingLandingSlot(false)
    }
  }

    const handleAddLandingPage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLandingPage.title || !newLandingPage.headline || !newLandingPage.cta_url || !user) return

    if (!editingLandingPageId && isLandingQuotaFull) {
      showToast('❌ โควตาเซลเพจของคุณเต็มแล้ว กรุณาใช้ 350 แต้มเพื่อปลดล็อกเพิ่ม')
      return
    }

    let slug = newLandingPage.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
    if (!slug) {
      slug = 'deal-' + Math.random().toString(36).substring(2, 7)
    }

    let rawCtaUrl = newLandingPage.cta_url.trim()
    if (!rawCtaUrl.startsWith('http://') && !rawCtaUrl.startsWith('https://')) {
      rawCtaUrl = 'https://' + rawCtaUrl
    }

    const payload = {
      slug,
      title: newLandingPage.title.trim(),
      headline: newLandingPage.headline.trim(),
      subheadline: newLandingPage.subheadline.trim() || null,
      hero_image_url: newLandingPage.hero_image_url.trim() || newLandingPage.hero_media_url.trim() || null,
      video_url: newLandingPage.video_url.trim() || null,
      hero_media_url: newLandingPage.hero_image_url.trim() || newLandingPage.hero_media_url.trim() || newLandingPage.video_url.trim() || null,
      hero_media_type: newLandingPage.video_url ? 'youtube' : 'image',
      offer_price: parseFloat(newLandingPage.offer_price) || 0,
      original_price: parseFloat(newLandingPage.original_price) || null,
      cta_text: newLandingPage.cta_text.trim() || 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
      cta_url: rawCtaUrl,
      sticky_btn1_text: newLandingPage.sticky_btn1_text?.trim() || newLandingPage.cta_text?.trim() || 'ติดต่อสั่งซื้อด่วน',
      sticky_btn1_url: newLandingPage.sticky_btn1_url?.trim() || rawCtaUrl,
      sticky_btn2_text: newLandingPage.sticky_btn2_text?.trim() || newLandingPage.cta_secondary_text?.trim() || 'ช่องทางติดต่ออื่นๆ',
      sticky_btn2_url: newLandingPage.sticky_btn2_url?.trim() || newLandingPage.cta_secondary_url?.trim() || null,
      sticky_btn3_text: newLandingPage.sticky_btn3_text?.trim() || newLandingPage.cta_shop_text?.trim() || 'สั่งซื้อออนไลน์',
      sticky_btn3_url: newLandingPage.sticky_btn3_url?.trim() || newLandingPage.cta_shop_url?.trim() || null,
      cta_secondary_text: newLandingPage.sticky_btn2_text?.trim() || newLandingPage.cta_secondary_text?.trim() || 'ช่องทางติดต่ออื่นๆ',
      cta_secondary_url: newLandingPage.sticky_btn2_url?.trim() || newLandingPage.cta_secondary_url?.trim() || null,
      cta_shop_text: newLandingPage.sticky_btn3_text?.trim() || newLandingPage.cta_shop_text?.trim() || 'สั่งซื้อออนไลน์',
      cta_shop_url: newLandingPage.sticky_btn3_url?.trim() || newLandingPage.cta_shop_url?.trim() || null,
      countdown_minutes: parseInt(String(newLandingPage.countdown_minutes), 10) || 15,
      features: newLandingPage.features_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      gallery_images: newLandingPage.gallery_images_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      review_images: newLandingPage.review_images_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      pain_headline: newLandingPage.pain_headline.trim() || 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?',
      pain_points: newLandingPage.pain_points_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      benefits_headline: newLandingPage.benefits_headline.trim() || 'ทางออกและผลลัพธ์ที่คุณจะได้รับ',
      benefits: newLandingPage.benefits_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      testimonials: newLandingPage.testimonials_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      faqs: newLandingPage.faqs_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      guarantee_text: newLandingPage.guarantee_text.trim() || null,
      trust_badge_1: newLandingPage.trust_badge_1.trim() || 'ส่งฟรีด่วน',
      trust_badge_2: newLandingPage.trust_badge_2.trim() || 'ของแท้ 100%',
      trust_badge_3: newLandingPage.trust_badge_3.trim() || 'ชำระเงินปลอดภัย',
      enable_cod_form: newLandingPage.enable_cod_form,
      seo_title: newLandingPage.seo_title.trim() || null,
      seo_description: newLandingPage.seo_description.trim() || null,
      seo_keywords: newLandingPage.seo_keywords.trim() || null,
      og_image_url: newLandingPage.og_image_url.trim() || null,
      body_content: newLandingPage.body_content.trim() || null,
      theme_color: newLandingPage.theme_color || '#EF4444',
      bg_color: newLandingPage.bg_color || '#0B0F17',
      bg_image_url: newLandingPage.bg_image_url.trim() || null,
      card_style: newLandingPage.card_style || 'glass',
      fb_pixel_id: newLandingPage.fb_pixel_id.trim() || null,
      tiktok_pixel_id: newLandingPage.tiktok_pixel_id.trim() || null,
      google_pixel_id: newLandingPage.google_pixel_id.trim() || null,
      line_tag_id: newLandingPage.line_tag_id.trim() || null
    }

    if (editingLandingPageId) {
      // Update existing Landing Page
      const { data, error } = await supabase
        .from('landing_pages')
        .update(payload)
        .eq('id', editingLandingPageId)
        .select()

      if (!error && data) {
        setLandingPages(landingPages.map(p => p.id === editingLandingPageId ? data[0] : p))
        handleCancelEditLandingPage()
        showToast('💾 บันทึกการแก้ไขเซลเพจสำเร็จ: /p/' + slug)
      } else if (error) {
        showToast('❌ แก้ไขไม่สำเร็จ: ' + error.message)
      }
    } else {
      // Create new Landing Page
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([{ ...payload, user_id: user.id }])
        .select()

      if (!error && data) {
        setLandingPages([data[0], ...landingPages])
        handleCancelEditLandingPage()
        showToast('🚀 สร้างเซลเพจสำเร็จ: /p/' + slug)
      } else if (error) {
        showToast('❌ ข้อผิดพลาด: ชื่อ URL ซ้ำ หรือไม่ถูกต้อง (' + error.message + ')')
      }
    }
  }

  const handleDeleteLandingPage = async (id: string) => {
    const { error } = await supabase.from('landing_pages').delete().eq('id', id)
    if (!error) {
      setLandingPages(landingPages.filter(p => p.id !== id))
      showToast('🗑️ ลบเซลเพจเรียบร้อยแล้ว')
    }
  }

  // --- Short Links Management ---
  const MAX_SHORT_LINKS = 20
  const isShortLinkLimitReached = profile.role !== 'admin' && shortLinks.length >= MAX_SHORT_LINKS

  const handleAddShortLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newShortLink.original_url || !user) return

    if (profile.role !== 'admin' && shortLinks.length >= MAX_SHORT_LINKS) {
      showToast(`❌ คุณสร้างลิงก์ย่อครบโควตาสูงสุด ${MAX_SHORT_LINKS} ลิ้งก์แล้ว (ยกเว้น Admin) กรุณาลบลิงก์ที่ไม่ใช้งานออกเพื่อสร้างใหม่`)
      return
    }

    let slug = newShortLink.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
    if (!slug) {
      slug = Math.random().toString(36).substring(2, 8)
    }

    let rawUrl = newShortLink.original_url.trim()
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl
    }

    const { data, error } = await supabase
      .from('short_links')
      .insert([{
        slug,
        original_url: rawUrl,
        title: newShortLink.title.trim() || slug,
        is_active: newShortLink.is_active,
        created_by: user.id
      }])
      .select()

    if (!error && data) {
      setShortLinks([data[0], ...shortLinks])
      setNewShortLink({ slug: '', original_url: '', title: '', is_active: true })
      showToast('✂️ สร้างลิงก์ย่อสำเร็จ: /s/' + slug)
    } else if (error) {
      showToast('❌ ข้อผิดพลาด: ชื่อย่อนี้มีผู้ใช้งานแล้ว หรือไม่ถูกต้อง')
    }
  }

  const handleDeleteShortLink = async (id: string) => {
    const { error } = await supabase.from('short_links').delete().eq('id', id)
    if (!error) {
      setShortLinks(shortLinks.filter(s => s.id !== id))
      showToast('🗑️ ลบลิงก์ย่อสำเร็จ')
    }
  }

  // --- Redeem VIP Tiers with Points ---
  const handleRedeemTierWithPoints = async (tierType: 'pro' | 'master') => {
    if (!user) return
    const cost = tierType === 'master' ? 599 : 299
    if ((profile.points || 0) < cost) {
      showToast(`❌ แต้มสะสมไม่เพียงพอ (ต้องการ ${cost} แต้ม แต่คุณมี ${profile.points || 0} แต้ม)`)
      return
    }

    setRedeemingTier(tierType)
    try {
      const newExp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const newPoints = (profile.points || 0) - cost
      const updateData: any = { points: newPoints }
      
      if (tierType === 'master') {
        updateData.master_expires_at = newExp
      } else {
        updateData.pro_expires_at = newExp
      }

      const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id)
      if (!error) {
        setProfile({
          ...profile,
          points: newPoints,
          ...(tierType === 'master' ? { master_expires_at: newExp } : { pro_expires_at: newExp })
        })
        showToast(`🎉 แลกแพ็กเกจ ${tierType === 'master' ? 'MASTER VIP' : 'PRO VIP'} สำเร็จ 30 วัน!`)
      } else {
        showToast(`❌ เกิดข้อผิดพลาด: ${error.message}`)
      }
    } catch (e: any) {
      showToast(`❌ เกิดข้อผิดพลาด: ${e.message}`)
    } finally {
      setRedeemingTier(null)
    }
  }

  // --- REORDERING / SWAPPING POSITIONS (LINKS & PRODUCTS) ---
  const handleMoveLink = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === links.length - 1)) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const newLinks = [...links]
    const temp = newLinks[index]
    newLinks[index] = newLinks[targetIndex]
    newLinks[targetIndex] = temp

    // Update positions in state
    setLinks(newLinks)

    // Persist to Supabase
    try {
      await Promise.all([
        supabase.from('links').update({ position: targetIndex }).eq('id', temp.id),
        supabase.from('links').update({ position: index }).eq('id', newLinks[index].id)
      ])
      showToast('↕️ สลับตำแหน่งลิงก์เรียบร้อย')
    } catch (e) {}
  }

  const handleMoveProduct = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === products.length - 1)) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const newProducts = [...products]
    const temp = newProducts[index]
    newProducts[index] = newProducts[targetIndex]
    newProducts[targetIndex] = temp

    // Update positions in state
    setProducts(newProducts)

    // Persist to Supabase
    try {
      await Promise.all([
        supabase.from('products').update({ position: targetIndex }).eq('id', temp.id),
        supabase.from('products').update({ position: index }).eq('id', newProducts[index].id)
      ])
      showToast('↕️ สลับตำแหน่งสินค้าเรียบร้อย')
    } catch (e) {}
  }

  // --- Image Upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(targetField)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${targetField}_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      showToast('❌ อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadError.message)
      setUploading(null)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName)

    if (targetField === 'newProduct') {
      setNewProduct(prev => ({ ...prev, image_url: publicUrl }))
    } else if (targetField === 'newLink') {
      setNewLink(prev => ({ ...prev, logo_url: publicUrl }))
    } else if (targetField === 'editingLink') {
      setEditingLink((prev: any) => ({ ...prev, logo_url: publicUrl }))
    } else if (targetField === 'editingProduct') {
      setEditingProduct((prev: any) => ({ ...prev, image_url: publicUrl }))
    } else {
      if (targetField === 'inner_bg_image_url' || targetField === 'inner_bg_image_url') {
        setProfile((prev: any) => ({ ...prev, inner_bg_image_url: publicUrl, inner_bg_image_url: publicUrl }))
      } else {
        setProfile((prev: any) => ({ ...prev, [targetField]: publicUrl }))
      }
    }

    setUploading(null)
    showToast('📸 อัปโหลดรูปภาพสำเร็จ')
  }

  // --- Copy Link Helper ---
  const handleCopyLink = (textToCopy: string, id: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(textToCopy)
      setCopiedLink(id)
      setTimeout(() => setCopiedLink(null), 2000)
    }
  }

  // --- Export Leads CSV ---
  const handleExportLeadsCSV = () => {
    if (leads.length === 0) return
    const headers = ['วันที่', 'ชื่อ', 'อีเมล', 'เบอร์โทร', 'ข้อความ/หมายเหตุ']
    const rows = leads.map((l: any) => [
      new Date(l.created_at).toLocaleString('th-TH'),
      '"' + (l.name || '').split('"').join('""') + '"',
      '"' + (l.email || '').split('"').join('""') + '"',
      '"' + (l.phone || '').split('"').join('""') + '"',
      '"' + (l.note || '').split('"').join('""') + '"'
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'leads_' + (profile.username || 'data') + '_' + Date.now() + '.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const tier = getUserTier(profile)
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://linktreethai.com'
  const publicProfileUrl = `${originUrl}/${profile.username}`

  // Shortener Unlock Status Logic
  const isShortenerActive = profile.role === 'admin' || 
    (profile.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now()) ||
    (profile.shortener_expires_at && new Date(profile.shortener_expires_at).getTime() > Date.now())

  let shortenerDaysRemaining = 0
  if (profile.shortener_expires_at) {
    const diff = new Date(profile.shortener_expires_at).getTime() - Date.now()
    shortenerDaysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] flex items-center justify-center text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-3xl flex items-center justify-center shadow-sm">
            <Link2 className="w-8 h-8 animate-spin" />
          </div>
          <span className="text-xs font-bold text-[#1E1B4B] dark:text-white">กำลังโหลด LinkTreeThai...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-slate-100 flex flex-col justify-between selection:bg-[#A78BFA] selection:text-white pb-28 lg:pb-0 font-sans transition-colors duration-300">
      
      {/* Toast Notification */}
      {savedMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1E1B4B] dark:bg-slate-900 text-white text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 border border-purple-300/30">
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Top Mobile App Bar (Mobile: Shows ONLY logo icon to prevent cut-off; Desktop: full details) */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-xl sticky top-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          
          {/* Logo & Brand: On Mobile only logo icon is shown without text so it never cuts off! */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-2xl text-white font-black shadow-md shadow-purple-500/20">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            {/* Brand Title (Hidden on Mobile screens to avoid clipping <TreeThai) */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-[#1E1B4B] dark:text-white tracking-tight">
                  LinkTreeThai
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  tier.tier === 'master' 
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/40'
                    : tier.tier === 'pro'
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}>
                  {tier.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">@{profile.username}</p>
            </div>
          </div>

          {/* Quick Action Buttons (Compact on Mobile, Full on Desktop) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Clickable Coins / Points Chip */}
            <button
              onClick={() => setAccountModalOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 active:scale-95 transition cursor-pointer shadow-sm"
              title="คลิกเพื่อดูสถานะ ตำแหน่ง วันหมดอายุ และสิทธิ์การใช้งาน"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>{profile.points || 0}</span>
              <span className="text-[9px] bg-amber-200/60 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 px-1 py-0.2 rounded font-bold">แต้ม</span>
            </button>

            {/* Top-up Button */}
            <button
              type="button"
              onClick={() => setTopUpModalOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center gap-1 active:scale-95 transition shadow-sm"
              title="เติมแต้มสะสม"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">เติมแต้ม</span>
            </button>

            {/* Dark / Light Mode Toggle Button ☀️🌙 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:border-purple-300 transition active:scale-95 shadow-sm"
              title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* View Live Profile Button */}
            <a 
              href={publicProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-purple-600 text-xs font-bold flex items-center gap-1 hover:border-purple-300 transition shadow-sm"
              title="เปิดหน้าโปรไฟล์จริง"
            >
              <Globe className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">ดูหน้าจริง</span>
            </a>

            {/* QR Code & Share Button */}
            <button
              onClick={() => {
                setQrTargetUrl(publicProfileUrl)
                setQrModalOpen(true)
              }}
              className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-purple-600 transition active:scale-95 shadow-sm"
              title="แชร์และสแกน QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Admin Portal Button */}
            {profile.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="px-2.5 py-1.5 rounded-2xl bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-500 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1 hover:bg-purple-200 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/login')
              }}
              className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 transition shadow-sm"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mobile App Tabs & Content Editors */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Desktop Segmented Navigation Tabs */}
            <div className="hidden sm:flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-3xl shadow-sm overflow-x-auto gap-1">
              {[
                { id: 'links', label: 'ลิ้งก์', icon: Link2, count: links.length },
                { id: 'shop', label: 'ร้านค้า', icon: ShoppingBag, count: products.length },
                { id: 'landing_pages', label: 'เซลเพจยิงแอด', icon: Rocket, count: landingPages.length, locked: !isLandingActive },
                { id: 'appearance', label: 'ข้อมูลโปรไฟล์', icon: Palette },
                { id: 'shortener', label: 'ย่อลิงก์', icon: Scissors, count: shortLinks.length, locked: !isShortenerActive },
                { id: 'leads', label: 'ลีด CRM', icon: Users, count: leads.length },
                { id: 'billing', label: 'แพ็กเกจ', icon: Crown }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                  setActiveTab(tab.id as any)
                  if (tab.id === 'landing_pages') {
                    setPreviewMode('landing')
                  } else if (tab.id === 'links' || tab.id === 'shop' || tab.id === 'appearance') {
                    setPreviewMode('bio')
                  }
                }}
                    className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-[#1E1B4B] dark:bg-purple-600 text-white shadow-md' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#1E1B4B] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.locked && (
                      <Lock className="w-3 h-3 text-amber-500" />
                    )}
                    {typeof tab.count === 'number' && (
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-purple-400 text-[#1E1B4B]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* TAB 1: LINKS MANAGEMENT */}
            {activeTab === 'links' && (
              <div className="space-y-6">
                
                {/* Add Link Card Form */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                        <Plus className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">เพิ่มลิงก์ใหม่</h3>
                    </div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-full">
                      {links.length}/{tier.maxLinks >= 999 ? 'ไม่จำกัด' : tier.maxLinks}
                    </span>
                  </div>

                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ชื่อปุ่ม / หัวข้อ *</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น เว็บไซต์ทางการ หรือ ไลน์ทางการ"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">คำอธิบายย่อย (Subtitle)</label>
                      <input
                        type="text"
                        placeholder="เช่น ตอบไวใน 5 นาที / โปรโมชั่นพิเศษ"
                        value={newLink.subtitle}
                        onChange={(e) => setNewLink({ ...newLink, subtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">URL ปลายทาง *</label>
                      <input
                        type="text"
                        required
                        placeholder="https://..."
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ไอคอนแบรนด์</label>
                      <select
                        value={newLink.icon}
                        onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition"
                      >
                        <option value="website">🌐 Website ทั่วไป</option>
                        <option value="line">🟢 LINE Official</option>
                        <option value="shopee">🟠 Shopee Shop</option>
                        <option value="lazada">🔵 Lazada Shop</option>
                        <option value="facebook">🔵 Facebook</option>
                        <option value="tiktok">⚫ TikTok</option>
                        <option value="instagram">🟣 Instagram</option>
                        <option value="youtube">🔴 YouTube</option>
                        <option value="x">⚪ X (Twitter)</option>
                        <option value="email">🟡 Email</option>
                      </select>
                    </div>

                    {/* Image Thumbnail / Logo Upload for Link */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">รูปภาพไอคอน/โลโก้บนปุ่ม (Logo / Thumbnail)</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                          {newLink.logo_url ? (
                            <img src={newLink.logo_url} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <label className="flex-1 py-3 px-4 bg-white dark:bg-slate-950 border border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 text-purple-600 dark:text-purple-400 rounded-2xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2">
                          <Upload className="w-4 h-4" />
                          <span>{uploading === 'newLink' ? 'กำลังอัปโหลด...' : '📸 เลือกรูปภาพจากมือถือ'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'newLink')}
                            className="hidden"
                          />
                        </label>

                        {newLink.logo_url && (
                          <button
                            type="button"
                            onClick={() => setNewLink({ ...newLink, logo_url: '' })}
                            className="text-xs text-rose-500 hover:underline shrink-0"
                          >
                            ลบรูป
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Custom Button Color & Text Color per Link */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                        🎨 ปรับแต่งสีปุ่มนี้แยกอิสระ (Custom Button Styling)
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 mb-1 block">สีพื้นหลังปุ่ม (Background Color)</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={newLink.bg_color || '#1E1B4B'}
                              onChange={(e) => setNewLink({ ...newLink, bg_color: e.target.value })}
                              className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                            />
                            <input
                              type="text"
                              value={newLink.bg_color || '#1E1B4B'}
                              onChange={(e) => setNewLink({ ...newLink, bg_color: e.target.value })}
                              className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-500 mb-1 block">สีตัวอักษรบนปุ่ม (Text Color)</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={newLink.text_color || '#FFFFFF'}
                              onChange={(e) => setNewLink({ ...newLink, text_color: e.target.value })}
                              className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                            />
                            <input
                              type="text"
                              value={newLink.text_color || '#FFFFFF'}
                              onChange={(e) => setNewLink({ ...newLink, text_color: e.target.value })}
                              className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Link */}
                    <div className="p-3.5 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 rounded-2xl space-y-2">
                      <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>ตั้งเวลาเปิด-ปิดปุ่มนี้ล่วงหน้า (Schedule - ไม่ระบุก็ได้)</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block mb-0.5">เริ่มแสดงตั้งแต่</span>
                          <input
                            type="datetime-local"
                            value={newLink.starts_at}
                            onChange={(e) => setNewLink({ ...newLink, starts_at: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block mb-0.5">สิ้นสุดการแสดง</span>
                          <input
                            type="datetime-local"
                            value={newLink.ends_at}
                            onChange={(e) => setNewLink({ ...newLink, ends_at: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mint Green Primary CTA Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Plus className="w-5 h-5" /> เพิ่มปุ่มลิงก์นี้
                    </button>
                  </form>
                </div>

                {/* Links List Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 uppercase tracking-wider px-1">
                    ลิ้งก์ทั้งหมดของคุณ ({links.length})
                  </h4>

                  {links.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500 text-xs shadow-sm">
                      ยังไม่มีลิ้งก์ที่สร้างไว้ เริ่มต้นเพิ่มลิ้งก์แรกของคุณด้านบนได้เลย! 🚀
                    </div>
                  ) : (
                    links.map((link) => (
                      <div
                        key={link.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                            {link.logo_url ? (
                              <img 
                                src={link.logo_url} 
                                alt={link.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40">
                                <SocialIcon type={link.icon || 'website'} className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[#1E1B4B] dark:text-white text-xs truncate">{link.title}</h4>
                              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1 shrink-0">
                                👆 {link.clicks || 0} คลิก
                              </span>
                            </div>
                            {link.subtitle && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{link.subtitle}</p>
                            )}
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate font-mono mt-0.5">{link.url}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Move Up / Move Down Reorder Buttons */}
                          <div className="flex flex-col gap-1 mr-1">
                            <button
                              type="button"
                              onClick={() => handleMoveLink(links.indexOf(link), 'up')}
                              disabled={links.indexOf(link) === 0}
                              className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900 text-xs font-black flex items-center justify-center disabled:opacity-30"
                              title="เลื่อนขึ้น"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLink(links.indexOf(link), 'down')}
                              disabled={links.indexOf(link) === links.length - 1}
                              className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900 text-xs font-black flex items-center justify-center disabled:opacity-30"
                              title="เลื่อนลง"
                            >
                              ▼
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setQrTargetUrl(link.url)
                              setQrModalOpen(true)
                            }}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition cursor-pointer"
                            title="QR Code & แชร์ลิ้งก์"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditLink(link)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                            title="แก้ไขข้อมูลลิ้งก์"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleLinkActive(link.id, link.is_active)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                              link.is_active 
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {link.is_active ? 'เปิดอยู่' : 'ปิด'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                            title="ลบลิ้งก์"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SHOP / PRODUCTS MANAGEMENT */}
            {activeTab === 'shop' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">เพิ่มสินค้าดิจิทัลในร้าน</h3>
                    </div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-full">
                      {products.length}/{tier.maxProducts >= 999 ? 'ไม่จำกัด' : tier.maxProducts}
                    </span>
                  </div>

                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ชื่อสินค้า / บริการ *</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น คอร์สเรียนออนไลน์ Pro หรือ E-book"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ราคา (บาท) *</label>
                      <input
                        type="number"
                        required
                        placeholder="990"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ลิงก์สั่งซื้อ / ชำระเงิน *</label>
                      <input
                        type="text"
                        required
                        placeholder="https://shop.line.me/..."
                        value={newProduct.buy_url}
                        onChange={(e) => setNewProduct({ ...newProduct, buy_url: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ป้ายกำกับ (Badge)</label>
                      <input
                        type="text"
                        placeholder="เช่น ขายดี, ลด 50%, แนะนำ"
                        value={newProduct.badge}
                        onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30"
                      />
                    </div>

                    {/* Large Drag & Drop Style Upload Zone */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">รูปภาพสินค้า</label>
                      <div className="space-y-2">
                        <label className="w-full py-6 px-4 bg-purple-50/50 dark:bg-slate-950 border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 rounded-3xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group">
                          {newProduct.image_url ? (
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md border border-purple-200 dark:border-purple-800">
                              <img src={newProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                              <Upload className="w-6 h-6" />
                            </div>
                          )}
                          <span className="font-bold text-xs text-[#1E1B4B] dark:text-white">
                            {uploading === 'newProduct' ? 'กำลังอัปโหลด...' : newProduct.image_url ? 'แตะเพื่อเปลี่ยนรูปภาพ' : 'แตะเพื่อเลือกรูปภาพจากมือถือ'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'newProduct')}
                            className="hidden"
                          />
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="หรือวาง Image URL เช่น https://..."
                            value={newProduct.image_url}
                            onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                          />
                          {newProduct.image_url && (
                            <button
                              type="button"
                              onClick={() => setNewProduct({ ...newProduct, image_url: '' })}
                              className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-100 transition shrink-0"
                            >
                              ลบรูป
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mint Green Primary CTA Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Plus className="w-5 h-5" /> เพิ่มสินค้าเข้าร้าน
                    </button>
                  </form>
                </div>

                {/* Products List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 uppercase tracking-wider px-1">
                    สินค้าทั้งหมด ({products.length})
                  </h4>

                  {products.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500 text-xs shadow-sm">
                      ยังไม่มีสินค้าในร้าน เพิ่มสินค้าเพื่อสร้างรายได้บนหน้า Bio Link ได้ทันที! 🛍️
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {products.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0">
                              {prod.image_url ? (
                                <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <ShoppingBag className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-[#1E1B4B] dark:text-white text-xs truncate">{prod.title}</h4>
                              <p className="text-emerald-600 dark:text-emerald-400 font-black text-xs font-mono mt-0.5">
                                ฿{parseFloat(prod.price).toLocaleString()}
                              </p>
                              {prod.badge && (
                                <span className="inline-block text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-1.5 py-0.5 rounded mt-1">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveProduct(products.indexOf(prod), 'up')}
                                disabled={products.indexOf(prod) === 0}
                                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900 text-xs font-black flex items-center justify-center disabled:opacity-30"
                                title="เลื่อนขึ้น"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveProduct(products.indexOf(prod), 'down')}
                                disabled={products.indexOf(prod) === products.length - 1}
                                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900 text-xs font-black flex items-center justify-center disabled:opacity-30"
                                title="เลื่อนลง"
                              >
                                ▼
                              </button>
                              <a
                                href={prod.buy_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1 ml-1"
                              >
                                <span>ทดสอบ</span> <ArrowUpRight className="w-3 h-3" />
                              </a>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setQrTargetUrl(prod.buy_url)
                                setQrModalOpen(true)
                              }}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition cursor-pointer"
                              title="QR Code & แชร์สินค้า"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditProduct(prod)}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                              title="แก้ไขข้อมูลสินค้า"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                              title="ลบสินค้า"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: APPEARANCE & THEMES */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Menu className="w-5 h-5 text-[#1E1B4B] dark:text-white" />
                      <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">ข้อมูลส่วนตัว</h3>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-bold rounded-2xl text-xs transition shadow flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> บันทึก
                    </button>
                  </div>

                  {/* Overlapping Visual Banner & Avatar Preview */}
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-slate-100 dark:bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-800">
                      {profile.cover_url ? (
                        <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                          รูปปกแบนเนอร์ (แตะเพื่อเปลี่ยน)
                        </div>
                      )}
                      <label className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition shadow flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>{uploading === 'cover_url' ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูปปก'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover_url')} className="hidden" />
                      </label>
                    </div>

                    {/* Overlapping Avatar */}
                    <div className="relative -mt-12 ml-6 inline-block">
                      <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 p-1 shadow-lg border border-slate-200 dark:border-slate-800">
                        <img
                          src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                        />
                      </div>
                      <label className="absolute bottom-0 right-0 w-7 h-7 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center shadow cursor-pointer transition">
                        <Edit2 className="w-3.5 h-3.5" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar_url')} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Profile Inputs */}
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ชื่อที่แสดง (Display Name)</label>
                      <input
                        type="text"
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">คำบรรยายตัวเอง (Bio)</label>
                      <textarea
                        rows={3}
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="แนะนำตัวเองสั้นๆ..."
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">YouTube Video URL</label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={profile.youtube_url || ''}
                        onChange={(e) => setProfile({ ...profile, youtube_url: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 font-mono"
                      />
                    </div>

                  {/* FULL PRO APPEARANCE: BACKGROUND COLOR, WALLPAPER IMAGE, TYPOGRAPHY & BUTTON COLORS */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-3xl space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs font-extrabold text-[#1E1B4B] dark:text-white flex items-center gap-2">
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span>ปรับแต่งสีพื้นหลังกรอบเล็ก/ใหญ่ & สีตัวหนังสือทุกจุด (Colors & Backgrounds)</span>
                      </h4>
                      <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full">
                        พรีวิวสดทันที
                      </span>
                    </div>

                    {/* 1. Page Background Color Presets & Custom Hex */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                        1. สีพื้นหลังของกรอบเล็ก (Inner Card Background Color)
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { color: '#0B0F17', label: 'ดำ Obsidian' },
                          { color: '#FFFFFF', label: 'ขาวสว่าง Clean' },
                          { color: '#F9F9FF', label: 'พาสเทล Lavender' },
                          { color: '#0F172A', label: 'มิดไนท์ Navy' },
                          { color: '#18080E', label: 'แดงเบอร์กันดี' }
                        ].map((preset) => (
                          <button
                            key={preset.color}
                            type="button"
                            onClick={() => setProfile({ ...profile, bg_color: preset.color })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                              profile.bg_color === preset.color
                                ? 'border-purple-600 ring-2 ring-purple-500/30 bg-white dark:bg-slate-900 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-inner" style={{ backgroundColor: preset.color }}></span>
                            <span>{preset.label}</span>
                          </button>
                        ))}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <input
                            type="color"
                            value={profile.bg_color || '#0B0F17'}
                            onChange={(e) => setProfile({ ...profile, bg_color: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="#0B0F17"
                            value={profile.bg_color || '#0B0F17'}
                            onChange={(e) => setProfile({ ...profile, bg_color: e.target.value })}
                            className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Profile Card & Header Background Color */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                          2. สีการ์ดโปรไฟล์ / กล่องหัวข้อด้านบน (Profile Card & Header Color)
                        </label>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">เปลี่ยนสีกรอบเหลือง / การ์ดหัวข้อ</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { color: '#FDE047', label: 'เหลือง Retro Pop' },
                          { color: '#FFFFFF', label: 'ขาวสว่าง Clean' },
                          { color: '#1E1B4B', label: 'ดำน้ำเงินเข้ม' },
                          { color: '#34D399', label: 'เขียวมินต์' },
                          { color: '#F472B6', label: 'ชมพูพาสเทล' },
                          { color: '#C084FC', label: 'ม่วงนีออน' },
                          { color: '#FB923C', label: 'ส้ม Sunset' }
                        ].map((preset) => (
                          <button
                            key={preset.color}
                            type="button"
                            onClick={() => setProfile({ ...profile, card_bg_color: preset.color })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                              profile.card_bg_color === preset.color
                                ? 'border-purple-600 ring-2 ring-purple-500/30 bg-white dark:bg-slate-900 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-inner" style={{ backgroundColor: preset.color }}></span>
                            <span>{preset.label}</span>
                          </button>
                        ))}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <input
                            type="color"
                            value={profile.card_bg_color || '#FDE047'}
                            onChange={(e) => setProfile({ ...profile, card_bg_color: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="#FDE047"
                            value={profile.card_bg_color || '#FDE047'}
                            onChange={(e) => setProfile({ ...profile, card_bg_color: e.target.value })}
                            className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Text Color (Name, Bio, Subtitles) */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                        3. สีตัวหนังสือ (Text & Title Color)
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { color: '#FFFFFF', label: 'ขาวสว่าง (สำหรับพื้นหลังมืด)' },
                          { color: '#1E1B4B', label: 'ดำน้ำเงิน (สำหรับพื้นหลังสว่าง)' },
                          { color: '#A78BFA', label: 'ม่วงพาสเทล' },
                          { color: '#F59E0B', label: 'ทองคำหรูหรา' }
                        ].map((preset) => (
                          <button
                            key={preset.color}
                            type="button"
                            onClick={() => setProfile({ ...profile, text_color: preset.color })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                              profile.text_color === preset.color
                                ? 'border-purple-600 ring-2 ring-purple-500/30 bg-white dark:bg-slate-900 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-inner" style={{ backgroundColor: preset.color }}></span>
                            <span>{preset.label}</span>
                          </button>
                        ))}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <input
                            type="color"
                            value={profile.text_color || '#FFFFFF'}
                            onChange={(e) => setProfile({ ...profile, text_color: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="#FFFFFF"
                            value={profile.text_color || '#FFFFFF'}
                            onChange={(e) => setProfile({ ...profile, text_color: e.target.value })}
                            className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Button Background & Button Text Color */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                        4. สีปุ่มลิงก์รวม & สีตัวอักษรบนปุ่ม (Buttons Style)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-500 block">สีพื้นหลังปุ่ม (Button Color)</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={profile.custom_button_color || '#1E1B4B'}
                              onChange={(e) => setProfile({ ...profile, custom_button_color: e.target.value })}
                              className="w-8 h-8 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              value={profile.custom_button_color || '#1E1B4B'}
                              onChange={(e) => setProfile({ ...profile, custom_button_color: e.target.value })}
                              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-500 block">สีตัวอักษรบนปุ่ม (Button Text Color)</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={profile.custom_button_text_color || '#FFFFFF'}
                              onChange={(e) => setProfile({ ...profile, custom_button_text_color: e.target.value })}
                              className="w-8 h-8 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              value={profile.custom_button_text_color || '#FFFFFF'}
                              onChange={(e) => setProfile({ ...profile, custom_button_text_color: e.target.value })}
                              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Background Wallpaper Image: In the Small Frame (Inner Card) */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                          5. ภาพวอลเปเปอร์เฉพาะในกรอบเล็ก (Inner Card Wallpaper Image)
                        </label>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">แสดงภายในกรอบสมาร์ตโฟน / กรอบเล็ก</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {profile.inner_bg_image_url ? (
                            <img src={profile.inner_bg_image_url} alt="Inner BG" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <label className="flex-1 py-3 px-4 bg-white dark:bg-slate-900 border border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 text-purple-600 dark:text-purple-400 rounded-2xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 shadow-sm active:scale-98">
                          <Upload className="w-4 h-4" />
                          <span>{uploading === 'inner_bg_image_url' ? 'กำลังอัปโหลด...' : '📸 เลือกภาพพื้นหลังกรอบเล็กจากมือถือ'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'inner_bg_image_url')}
                            className="hidden"
                          />
                        </label>

                        {profile.inner_bg_image_url && (
                          <button
                            type="button"
                            onClick={() => setProfile({ ...profile, inner_bg_image_url: '' })}
                            className="text-xs text-rose-500 hover:underline shrink-0 font-bold"
                          >
                            ลบรูป
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 5. Background Wallpaper Image: Outer Full-Screen Wallpaper */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                          6. ภาพวอลเปเปอร์พื้นหลังใหญ่สุดด้านหลัง (Outer Full-Screen Wallpaper)
                        </label>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">แสดงเต็มจอคอมพิวเตอร์ / พื้นหลังหลัก</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {profile.bg_image_url ? (
                            <img src={profile.bg_image_url} alt="Outer BG" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <label className="flex-1 py-3 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 shadow-sm active:scale-98">
                          <Upload className="w-4 h-4" />
                          <span>{uploading === 'bg_image_url' ? 'กำลังอัปโหลด...' : '📸 เลือกภาพพื้นหลังใหญ่ด้านหลังจากมือถือ'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'bg_image_url')}
                            className="hidden"
                          />
                        </label>

                        {profile.bg_image_url && (
                          <button
                            type="button"
                            onClick={() => setProfile({ ...profile, bg_image_url: '' })}
                            className="text-xs text-rose-500 hover:underline shrink-0 font-bold"
                          >
                            ลบรูป
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                    {/* iOS Style Hide Branding Switch */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#1E1B4B] dark:text-white flex items-center gap-1.5">
                          <span>✨ ซ่อนลายน้ำ LinkTreeThai</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">สำหรับผู้ใช้งานแพ็กเกจ Pro และ Master</p>
                      </div>
                      <button
                        type="button"
                        disabled={tier.tier === 'free'}
                        onClick={() => setProfile({ ...profile, hide_branding: !profile.hide_branding })}
                        className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                          profile.hide_branding ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-700'
                        } ${tier.tier === 'free' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          profile.hide_branding ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>

                                {/* Templates Selector in Clean White Tiles (Free Users Can Preview All Paid Templates) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">เลือกธีมและรูปแบบเทมเพลต</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">แตะเพื่อดูตัวอย่างสดแบบ Real-time บนสมาร์ตโฟนด้านขวาได้ทุกธีม (สมาชิกฟรีสามารถดูตัวอย่างธีม VIP ได้)</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'template_1', name: 'Classic Clean', tier: 'free' },
                      { id: 'template_2', name: 'Cyber Neon', tier: 'free' },
                      { id: 'template_3', name: 'Minimal Pastel', tier: 'free' },
                      { id: 'template_4', name: 'Dark Aurora', tier: 'pro' },
                      { id: 'template_5', name: 'Luxury Gold', tier: 'pro' },
                      { id: 'template_6', name: 'Sunset Glow', tier: 'pro' },
                      { id: 'template_7', name: 'Retro Grid', tier: 'master' },
                      { id: 'template_8', name: 'Glassmorphism 3D', tier: 'master' },
                      { id: 'template_9', name: 'Creator Studio', tier: 'master' },
                    ].map((t) => {
                      const isSelected = profile.template_id === t.id
                      const isLocked = !tier.allowedTemplates.includes(t.id)
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setProfile({ ...profile, template_id: t.id })
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-24 ${
                            isSelected 
                              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-300 dark:ring-purple-700 text-purple-900 dark:text-purple-200 font-bold shadow-sm'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-purple-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{t.name}</span>
                            {isSelected ? (
                              <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                                {isLocked ? '👁️ ตัวอย่าง VIP' : '✓ ใช้งาน'}
                              </span>
                            ) : isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-amber-500" />
                            ) : null}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full w-fit ${
                              t.tier === 'master' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : t.tier === 'pro' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {t.tier}
                            </span>
                            {isLocked && !isSelected && (
                              <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold">แตะพรีวิว</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Social Links Dock Inputs */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">ไอคอนโซเชียลที่หัวโปรไฟล์ (Social Dock)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'social_facebook', label: 'Facebook URL' },
                      { key: 'social_instagram', label: 'Instagram URL' },
                      { key: 'social_tiktok', label: 'TikTok URL' },
                      { key: 'social_youtube', label: 'YouTube Channel' },
                      { key: 'social_line', label: 'LINE Official / ID' },
                      { key: 'social_shopee', label: 'Shopee Shop' },
                      { key: 'social_lazada', label: 'Lazada Shop' },
                      { key: 'social_x', label: 'X (Twitter)' },
                      { key: 'social_pinterest', label: 'Pinterest URL' },
                      { key: 'social_email', label: 'Email สำหรับติดต่อ' },
                    ].map((s) => (
                      <div key={s.key}>
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">{s.label}</label>
                        <input
                          type="text"
                          value={profile[s.key] || ''}
                          onChange={(e) => setProfile({ ...profile, [s.key]: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: URL SHORTENER */}
            {activeTab === 'shortener' && (
              <div className="space-y-6">
                {!isShortenerActive ? (
                  <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 p-8 rounded-3xl shadow-sm text-center space-y-5">
                    <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto shadow-sm">
                      <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white">ระบบย่อลิงก์เป็นฟีเจอร์พรีเมียม</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        เปลี่ยนลิงก์ยาวให้เป็น URL สั้นที่คุณตั้งชื่อเองได้ เช่น <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">linktreethai.com/s/promo</span> พร้อมระบบนับยอดคลิก Real-time
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm mx-auto flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">แต้มสะสมของคุณ:</span>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400 flex items-center gap-1 font-mono">
                        <Coins className="w-4 h-4 text-amber-500" /> {profile.points || 0} แต้ม
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                      <button
                        onClick={handleUnlockShortener}
                        disabled={unlockingShortener}
                        className="flex-1 py-3.5 px-4 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl text-xs transition shadow flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                      >
                        {unlockingShortener ? 'กำลังปลดล็อก...' : '🔓 ปลดล็อก 100 แต้ม (30 วัน)'}
                      </button>

                      <button
                        onClick={() => setAdminContactModal(true)}
                        className="py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-4 h-4" /> ติดต่อ Admin
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>สถานะระบบย่อลิงก์: Active (เปิดใช้งานแล้ว)</span>
                      </div>
                      <span className="text-[11px] text-purple-700 dark:text-purple-300 font-mono font-bold">
                        {profile.role === 'admin' ? '🛡️ Admin ไม่จำกัด' : `เหลืออีก ${shortenerDaysRemaining} วัน`}
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">สร้างลิงก์ย่อใหม่ (URL Shortener)</h3>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-full">
                          {profile.role === 'admin' ? '🛡️ ไม่จำกัด (Admin)' : `${shortLinks.length}/20 ลิ้งก์`}
                        </span>
                      </div>

                      <form onSubmit={handleAddShortLink} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">URL ปลายทางยาวๆ *</label>
                          <input
                            type="text"
                            required
                            placeholder="https://shopee.co.th/..."
                            value={newShortLink.original_url}
                            onChange={(e) => setNewShortLink({ ...newShortLink, original_url: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ชื่อย่อ (Slug) *</label>
                            <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1 focus-within:border-purple-400">
                              <span className="text-slate-400 text-xs font-mono select-none">/s/</span>
                              <input
                                type="text"
                                placeholder="promo-august"
                                value={newShortLink.slug}
                                onChange={(e) => setNewShortLink({ ...newShortLink, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                                className="w-full py-2 bg-transparent text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono font-bold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">ชื่อบันทึกช่วยจำ (Title)</label>
                            <input
                              type="text"
                              placeholder="เช่น โปรโมชั่น Shopee 8.8"
                              value={newShortLink.title}
                              onChange={(e) => setNewShortLink({ ...newShortLink, title: e.target.value })}
                              className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl text-sm transition shadow flex items-center justify-center gap-2"
                        >
                          <Scissors className="w-4 h-4" /> สร้างลิงก์ย่อทันที
                        </button>
                      </form>
                    </div>

                    {/* Short Links List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 uppercase tracking-wider px-1">
                        ลิงก์ย่อทั้งหมดของคุณ ({shortLinks.length})
                      </h4>

                      {shortLinks.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500 text-xs shadow-sm">
                          ยังไม่มีลิงก์ย่อ สร้างลิงก์สั้นสำหรับโปรโมทได้เลย! ⚡
                        </div>
                      ) : (
                        shortLinks.map((s) => {
                          const fullShortUrl = `${originUrl}/s/${s.slug}`
                          return (
                            <div
                              key={s.id}
                              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition"
                            >
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-[#1E1B4B] dark:text-white text-xs truncate">{s.title || s.slug}</h4>
                                  <span className="text-[10px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 font-bold">
                                    👆 {s.clicks || 0} คลิก
                                  </span>
                                </div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold">{fullShortUrl}</p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate font-mono">{s.original_url}</p>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleCopyLink(fullShortUrl, s.id)}
                                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                                >
                                  {copiedLink === s.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedLink === s.id ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteShortLink(s.id)}
                                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

                        {/* TAB: DEDICATED ADS SALES LANDING PAGES */}
            {activeTab === 'landing_pages' && (
              <div className="space-y-6">
                {!isLandingActive ? (
                  <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 p-8 rounded-3xl shadow-sm text-center space-y-5 max-w-xl mx-auto my-6">
                    <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
                      <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white">
                        ระบบเซลเพจยิงแอด & Tracking Pixels เป็นฟีเจอร์พรีเมียม
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        สร้างหน้าเซลเพจขายของ Flash Sale พร้อมระบบฝัง Facebook, TikTok, Google, LINE Pixels อัตโนมัติ เพื่อยิงแอด Conversion วัดผลยอดขายได้ 100%
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm mx-auto flex items-center justify-between shadow-inner">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">แต้มสะสมของคุณ:</span>
                      <span className="text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                        <Coins className="w-4 h-4 text-amber-500" /> {profile?.points || 0} แต้ม
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 max-w-sm mx-auto pt-2">
                      <button
                        type="button"
                        onClick={() => handleFastUpgrade('master')}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95 cursor-pointer"
                      >
                        <Crown className="w-4 h-4" />
                        <span>👑 แลก MASTER VIP 30 วัน (599 แต้ม)</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleUnlockLandingPageSlot}
                          className="flex-1 py-3 px-3 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
                        >
                          <Rocket className="w-4 h-4" />
                          <span>ปลดล็อก 350 แต้ม (1 URL)</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleUnlockPixels}
                          className="flex-1 py-3 px-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
                        >
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>ปลดล็อก Pixels 100 แต้ม</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTopUpModalOpen(true)}
                        className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span>+ เติมแต้มสะสมทันที (PromptPay)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                {/* 1. TRACKING PIXELS CONFIGURATION (Facebook, TikTok, Google, LINE) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">ฝังโค้ด Tracking Pixels สำหรับยิงแอด</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">ระบบจะนำ Pixel ID ไปฝังในหน้า Bio และหน้าเซลเพจของคุณอัตโนมัติ 100%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setPixelAnalyticsOpen(true)}
                        className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 active:scale-95 animate-pulse"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>📊 ตรวจสอบสถานะ Pixel & สถิติสด</span>
                      </button>

                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>บันทึก Pixel ID</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span>Facebook Pixel ID (Meta)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น 123456789012345 (ตัวเลข 15-16 หลัก)"
                        value={profile.fb_pixel_id || ''}
                        onChange={(e) => setProfile({ ...profile, fb_pixel_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white"></span>
                        <span>TikTok Pixel ID</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น C9A1B2C3D4E5F6G7..."
                        value={profile.tiktok_pixel_id || ''}
                        onChange={(e) => setProfile({ ...profile, tiktok_pixel_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span>Google Analytics / Tag ID (GA4 / Ads)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น G-XXXXXXXXXX หรือ AW-XXXXXXXXX"
                        value={profile.google_pixel_id || ''}
                        onChange={(e) => setProfile({ ...profile, google_pixel_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>LINE Tag ID</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        value={profile.line_tag_id || ''}
                        onChange={(e) => setProfile({ ...profile, line_tag_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Header & Quota Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shadow-sm">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">ระบบสร้างหน้าเซลเพจยิงแอด (Sales Landing Pages)</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">สร้างหน้าเว็บแยกสำหรับยิงแอด Facebook & TikTok พร้อมฝัง Pixel อัตโนมัติ</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full font-mono">
                        โควตา: {landingPages.length}/{profile.role === 'admin' ? 'ไม่จำกัด (Admin)' : `${totalLandingSlots} เซลเพจ`}
                      </span>
                      <button
                        type="button"
                        onClick={handleUnlockLandingPageSlot}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{unlockingLandingSlot ? 'กำลังปลดล็อก...' : '+ เพิ่ม URL (350 แต้ม)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quota Details Notice */}
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black">👑 สิทธิพิเศษ:</span> สมาชิก <strong>MASTER VIP</strong> สร้างเซลเพจฟรีได้ 1 URL ทันที และสามารถใช้ <strong>350 แต้ม</strong> เพื่อปลดล็อกเพิ่มได้ไม่จำกัด URL
                    </div>
                  </div>

                  {/* Complete 6-Section & SEO Landing Page Builder Form */}
                  {(!isLandingQuotaFull || profile.role === 'admin') ? (
                    <form onSubmit={handleAddLandingPage} className="space-y-6 pt-2">
                      
                      {/* --- SECTION 1: HERO & AD SCENT (Above the Fold) --- */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">1</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">Hero Section (ดึงดูดความสนใจใน 3 วินาทีแรก)</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ชื่อเรียกเซลเพจ (Internal Title) *</label>
                            <input
                              type="text"
                              required
                              placeholder="เช่น เซลเพจโปรโมชั่นเห็ดสกัด 8.8"
                              value={newLandingPage.title}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, title: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">URL Slug ที่ต้องการ *</label>
                            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1 focus-within:border-rose-400">
                              <span className="text-slate-400 text-xs font-mono select-none">linktreethai.com/p/</span>
                              <input
                                type="text"
                                required
                                placeholder="deal-special"
                                value={newLandingPage.slug}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                                className="w-full py-1.5 bg-transparent text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">Headline (หัวข้อหลัก - ตรงกับข้อความโฆษณา Ad Scent) *</label>
                          <input
                            type="text"
                            required
                            placeholder="เช่น รวมลิงก์และระบบรับเงินจบในหน้าเดียว สำหรับแม่ค้าออนไลน์"
                            value={newLandingPage.headline}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, headline: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">Sub-headline (หัวข้อย่อย - ขยายความชีวิตดีขึ้นอย่างไร)</label>
                          <input
                            type="text"
                            placeholder="เช่น จัดการทุกช่องทางการขายได้ในที่เดียว ประหยัดเวลา เพิ่มยอดขาย 300%"
                            value={newLandingPage.subheadline}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, subheadline: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                          />
                        </div>

                        {/* 1. SEPARATE FIELD: HERO PRODUCT IMAGE */}
                        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#1E1B4B] dark:text-slate-200 flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-emerald-500" />
                              <span>1. รูปภาพสินค้าหลัก / แบนเนอร์โปรโมชั่น (Hero Image)</span>
                            </label>
                            <span className="text-[10px] text-slate-400">รองรับไฟล์ภาพ JPG, PNG, WebP</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="URL รูปภาพสินค้า หรือ กดปุ่มอัปโหลดจากมือถือ"
                              value={newLandingPage.hero_image_url}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, hero_image_url: e.target.value })}
                              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                            />
                            
                            {/* Direct Mobile / Camera / Gallery Upload */}
                            <label className="px-4 py-2 bg-[#34D399] hover:bg-[#10B981] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md shadow-emerald-500/20 active:scale-95 flex-shrink-0">
                              <Upload className="w-4 h-4" />
                              <span>{uploadingLpImg ? 'กำลังอัปโหลด...' : '📸 เลือกรูปจากมือถือ'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUploadLpImage(e, 'hero')}
                              />
                            </label>
                          </div>

                          {newLandingPage.hero_image_url && (
                            <div className="flex items-center gap-2 pt-1">
                              <img src={newLandingPage.hero_image_url} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">✓ อัปโหลดรูปภาพสินค้าเรียบร้อยแล้ว</span>
                              <button
                                type="button"
                                onClick={() => setNewLandingPage({ ...newLandingPage, hero_image_url: '' })}
                                className="text-[11px] text-rose-500 hover:underline ml-auto"
                              >
                                ลบรูป
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 2. SEPARATE FIELD: YOUTUBE VIDEO EMBED */}
                        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#1E1B4B] dark:text-slate-200 flex items-center gap-1.5">
                              <Youtube className="w-4 h-4 text-red-500" />
                              <span>2. วิดีโอโปรโมชั่น YouTube / TikTok Shorts (Video URL)</span>
                            </label>
                            <span className="text-[10px] text-slate-400">รองรับทั้งคลิปยาว และ Shorts</span>
                          </div>

                          <input
                            type="text"
                            placeholder="เช่น https://www.youtube.com/watch?v=... หรือ https://youtu.be/... หรือ Shorts"
                            value={newLandingPage.video_url}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, video_url: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-red-400 font-mono"
                          />
                        </div>

                        {/* 3. CUSTOM TRUST BADGES & COD TOGGLE */}
                        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#1E1B4B] dark:text-slate-200 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              <span>ป้ายความมั่นใจ 3 จุด & ฟอร์มเก็บเงินปลายทาง (Trust Badges & COD)</span>
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">ป้ายที่ 1</label>
                              <input
                                type="text"
                                placeholder="ส่งฟรีด่วน"
                                value={newLandingPage.trust_badge_1}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, trust_badge_1: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">ป้ายที่ 2</label>
                              <input
                                type="text"
                                placeholder="ของแท้ 100%"
                                value={newLandingPage.trust_badge_2}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, trust_badge_2: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">ป้ายที่ 3 (แก้ไขได้อิสระ)</label>
                              <input
                                type="text"
                                placeholder="ชำระเงินปลอดภัย หรือ เก็บเงินปลายทาง"
                                value={newLandingPage.trust_badge_3}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, trust_badge_3: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* COD Form Toggle Switch */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-extrabold text-[#1E1B4B] dark:text-white">
                                แสดง "ฟอร์มสั่งซื้อเก็บเงินปลายทาง (COD Form)" ด้านล่าง
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {newLandingPage.enable_cod_form 
                                  ? '✓ เปิดใช้งาน: ลูกค้าสามารถกรอกชื่อ-เบอร์โทร-ที่อยู่สั่งซื้อ COD ได้ทันที' 
                                  : '✕ ปิดใช้งาน: ซ่อนฟอร์ม COD และให้ลูกค้าคลิกปุ่มสั่งซื้อผ่าน LINE OA / เว็บไซต์แทน'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setNewLandingPage({ ...newLandingPage, enable_cod_form: !newLandingPage.enable_cod_form })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                newLandingPage.enable_cod_form 
                                  ? 'bg-emerald-500 text-slate-950 font-black shadow' 
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span>{newLandingPage.enable_cod_form ? 'เปิดใช้งาน COD' : 'ปิดฟอร์ม COD'}</span>
                            </button>
                          </div>
                        </div>

                        {/* 3. ADDITIONAL PRODUCT GALLERY ALBUM */}
                        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#1E1B4B] dark:text-slate-200 flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-purple-500" />
                              <span>3. รูปภาพสินค้าเพิ่มเติม (Product Gallery Album - ใส่ได้หลายรูป)</span>
                            </label>
                            <label className="px-3 py-1 bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition">
                              <Upload className="w-3.5 h-3.5" />
                              <span>📸 เพิ่มรูปเข้าอัลบั้ม</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUploadLpImage(e, 'gallery')}
                              />
                            </label>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="URL รูปภาพสินค้าเพิ่มเติม (1 บรรทัด = 1 รูป หรือ กดปุ่มเพิ่มรูปจากมือถือด้านบน)"
                            value={newLandingPage.gallery_images_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, gallery_images_text: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* --- SECTION 2: PAIN POINT & AGITATION --- */}
                      <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 border-b border-rose-200 dark:border-rose-900/50 pb-2">
                          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">2</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">Pain Point & Agitation (ขยี้ปัญหาที่ลูกค้าเจอ)</h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">หัวข้อส่วนปัญหา</label>
                          <input
                            type="text"
                            placeholder="คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?"
                            value={newLandingPage.pain_headline}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, pain_headline: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">รายการปัญหา (1 บรรทัด = 1 ข้อความ)</label>
                          <textarea
                            rows={3}
                            placeholder="❌ เบื่อไหม? ลูกค้าทักมาขอลิงก์ช้อปปิ้งทีละแอปจนตอบไม่ทัน&#10;❌ ยิงแอดไปเท่าไหร่ แต่เก็บ Data ลูกค้าไม่ได้เลยใช่ไหม?&#10;❌ ลูกค้าสับสนช่องทางชำระเงินจนเปลี่ยนใจไม่ซื้อ"
                            value={newLandingPage.pain_points_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, pain_points_text: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* --- SECTION 3: SOLUTION & BENEFITS --- */}
                      <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 border-b border-emerald-200 dark:border-emerald-900/50 pb-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">3</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">Solution & Benefits (นำเสนอทางแก้และผลลัพธ์)</h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">หัวข้อส่วนผลประโยชน์</label>
                          <input
                            type="text"
                            placeholder="ทางออกและผลลัพธ์ที่คุณจะได้รับ"
                            value={newLandingPage.benefits_headline}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, benefits_headline: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">รายการประโยชน์ที่จะได้รับ (1 บรรทัด = 1 ประโยชน์)</label>
                          <textarea
                            rows={3}
                            placeholder="✓ ฝัง Pixel ง่ายๆ ช่วยให้คุณยิงแอดตามติดลูกค้า เพิ่มยอดขาย 300%&#10;✓ รวมทุกลิงก์และระบบรับเงินจบในหน้าเดียว ลูกค้าไม่สับสน&#10;✓ ดึงยอดคนดูเข้าไลฟ์สดได้ทันทีจากทุกช่องทาง แบบ Real-time"
                            value={newLandingPage.benefits_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, benefits_text: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* --- SECTION: CUSTOMER REVIEW PHOTO ALBUM (อัลบั้มรูปรีวิว) --- */}
                      <div className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-900/50 pb-2">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-amber-500" />
                            <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">
                              รูปภาพรีวิวและการใช้งานจริงจากลูกค้า (Review Photos Album)
                            </h4>
                          </div>
                          <label className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>📸 เพิ่มรูปรีวิวจากมือถือ</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleUploadLpImage(e, 'review')}
                            />
                          </label>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          ใส่ภาพแชตรีวิวจากลูกค้า หรือภาพสินค้าขณะใช้งานจริง เพื่อให้ลูกค้าแตะดูรูปขยายแบบอัลบั้มได้
                        </p>

                        <textarea
                          rows={2}
                          placeholder="URL รูปภาพรีวิว (1 บรรทัด = 1 รูป หรือ กดปุ่มอัปโหลดรูปรีวิวจากมือถือด้านบน)"
                          value={newLandingPage.review_images_text}
                          onChange={(e) => setNewLandingPage({ ...newLandingPage, review_images_text: e.target.value })}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono"
                        />
                      </div>

                      {/* --- SECTION 4: SOCIAL PROOF & REVIEWS --- */}
                      <div className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 border-b border-amber-200 dark:border-amber-900/50 pb-2">
                          <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black">4</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">Social Proof & Trust (รีวิวและความมั่นใจ)</h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">รีวิวจากลูกค้าจริง (1 บรรทัด = 1 รีวิว)</label>
                          <textarea
                            rows={3}
                            placeholder="ตั้งแต่เปลี่ยนมาใช้หน้านี้ ยอดขายจาก TikTok Ads เพิ่มขึ้น 3 เท่า ลูกค้าสั่งซื้อง่ายมาก&#10;ระบบจัดการลิงก์และเซลเพจที่ดีที่สุด ช่วยประหยัดเวลาตอบแชตได้เยอะมาก"
                            value={newLandingPage.testimonials_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, testimonials_text: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ข้อความรับประกัน (Guarantee Badge)</label>
                          <input
                            type="text"
                            placeholder="🛡️ รับประกันความพึงพอใจ ของแท้ 100% ยินดีคืนเงินภายใน 7 วัน"
                            value={newLandingPage.guarantee_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, guarantee_text: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* --- SECTION 5: PRICING & THE OFFER (ยื่นข้อเสนอที่ปฏิเสธไม่ได้) --- */}
                      <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 border-b border-rose-200 dark:border-rose-900/50 pb-2">
                          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">5</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">Pricing & The Offer (ข้อเสนอ, ราคา และปุ่มสั่งซื้อ)</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ราคาพิเศษ Flash Sale (บาท) *</label>
                            <input
                              type="number"
                              required
                              placeholder="990"
                              value={newLandingPage.offer_price}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, offer_price: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ราคาเต็มก่อนลด (บาท)</label>
                            <input
                              type="number"
                              placeholder="1990"
                              value={newLandingPage.original_price}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, original_price: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">เวลานับถอยหลัง (นาที)</label>
                            <input
                              type="number"
                              placeholder="15"
                              value={newLandingPage.countdown_minutes}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, countdown_minutes: parseInt(e.target.value, 10) || 15 })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ข้อความบนปุ่มสั่งซื้อ (CTA Button Text) *</label>
                            <input
                              type="text"
                              required
                              placeholder="สั่งซื้อโปรโมชั่นพิเศษนี้ทันที"
                              value={newLandingPage.cta_text}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, cta_text: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ลิงก์ปลายทางเมื่อกดปุ่ม (LINE OA / Shopee / ฯลฯ) *</label>
                            <input
                              type="text"
                              required
                              placeholder="https://line.me/ti/p/@amth หรือ ลิงก์ร้านค้า"
                              value={newLandingPage.cta_url}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, cta_url: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">รายการของแถม / จุดเด่นของข้อเสนอ (1 บรรทัด = 1 ข้อ)</label>
                          <textarea
                            rows={3}
                            placeholder="✓ ส่งฟรีทั่วไทย (จัดส่งด่วน 1-2 วัน)&#10;✓ มีบริการเก็บเงินปลายทาง (COD)&#10;✓ รับประกันของแท้ 100% ตรงจากผู้ผลิต"
                            value={newLandingPage.features_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, features_text: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-sans"
                          />
                        </div>

                        {/* --- SUBSECTION: 3 BOTTOM STICKY ACTION BUTTONS --- */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-2 border-rose-300/80 dark:border-rose-900/80 rounded-2xl space-y-3.5 shadow-sm mt-3">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                              <h5 className="font-extrabold text-xs sm:text-sm text-[#1E1B4B] dark:text-white">
                                🔥 ปรับแต่ง 3 ปุ่มลอยด่วนด้านล่าง (Bottom Sticky Action Buttons)
                              </h5>
                            </div>
                            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                              แถบลอยติดขอบล่างหน้าจอ
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            
                            {/* Button 1: Red Flame Primary Button */}
                            <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-2">
                              <div className="flex items-center gap-1.5 font-extrabold text-rose-700 dark:text-rose-300">
                                <Flame className="w-4 h-4" />
                                <span>ปุ่มที่ 1 (สีแดง/สีธีมหลัก)</span>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">ข้อความบนปุ่ม 1</label>
                                <input
                                  type="text"
                                  placeholder="ติดต่อสั่งซื้อด่วน"
                                  value={newLandingPage.sticky_btn1_text}
                                  onChange={(e) => setNewLandingPage({ ...newLandingPage, sticky_btn1_text: e.target.value, cta_text: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-xl font-bold text-[#1E1B4B] dark:text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">URL ปลายทางปุ่ม 1</label>
                                <input
                                  type="text"
                                  placeholder="https://... (หรือเว้นว่างเพื่อใช้ CTA หลัก)"
                                  value={newLandingPage.sticky_btn1_url}
                                  onChange={(e) => setNewLandingPage({ ...newLandingPage, sticky_btn1_url: e.target.value, cta_url: e.target.value || newLandingPage.cta_url })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-xl font-mono text-[11px] text-[#1E1B4B] dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Button 2: Purple Send Secondary Button */}
                            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                              <div className="flex items-center gap-1.5 font-extrabold text-purple-700 dark:text-purple-300">
                                <Send className="w-4 h-4" />
                                <span>ปุ่มที่ 2 (สีม่วง/น้ำเงิน)</span>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">ข้อความบนปุ่ม 2</label>
                                <input
                                  type="text"
                                  placeholder="ช่องทางติดต่ออื่นๆ"
                                  value={newLandingPage.sticky_btn2_text}
                                  onChange={(e) => setNewLandingPage({ ...newLandingPage, sticky_btn2_text: e.target.value, cta_secondary_text: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[#1E1B4B] dark:text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">URL ปลายทางปุ่ม 2 (LINE OA / Bio)</label>
                                <input
                                  type="text"
                                  placeholder="https://line.me/ti/p/@amth"
                                  value={newLandingPage.sticky_btn2_url}
                                  onChange={(e) => setNewLandingPage({ ...newLandingPage, sticky_btn2_url: e.target.value, cta_secondary_url: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px] text-[#1E1B4B] dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Button 3: Green Shopping Bag Shop Button */}
                            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl space-y-2">
                              <div className="flex items-center gap-1.5 font-extrabold text-emerald-700 dark:text-emerald-300">
                                <ShoppingBag className="w-4 h-4" />
                                <span>ปุ่มที่ 3 (สีเขียว สั่งซื้อออนไลน์)</span>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">ข้อความบนปุ่ม 3</label>
                                <input
                                  type="text"
                                  placeholder="สั่งซื้อออนไลน์"
                                  value={newLandingPage.sticky_btn3_text}
                                  onChange={(e) => setNewLandingPage({ ...newLandingPage, sticky_btn3_text: e.target.value, cta_shop_text: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold text-[#1E1B4B] dark:text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">URL ปลายทางปุ่ม 3 (Shopee / ร้านค้า)</label>
                                <input
                                  type="text"
                                  placeholder="https://shopee.co.th/..."
                                  value={newLandingPage.sticky_btn3_url}
                                  onChange={(e) => setNewLandingPage({ ...newLandingPage, sticky_btn3_url: e.target.value, cta_shop_url: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl font-mono text-[11px] text-[#1E1B4B] dark:text-white"
                                />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      
                      {/* --- SECTION 6: FAQS & SALES COPY --- */}
                      <div className="p-4 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 border-b border-purple-200 dark:border-purple-900/50 pb-2">
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">5</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">FAQ & Content (คำถามที่พบบ่อย & รายละเอียด)</h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">
                            คำถามที่พบบ่อย (รูปแบบ: คำถาม | คำตอบ)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="มีบริการเก็บเงินปลายทาง (COD) ไหม? | มีครับ สามารถกรอกที่อยู่แล้วรอชำระเงินเมื่อสินค้าถึงได้เลย&#10;จัดส่งสินค้ากี่วันถึง? | จัดส่งด่วน Flash/EMS สินค้าถึงภายใน 1-2 วันทำการครับ"
                            value={newLandingPage.faqs_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, faqs_text: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">เนื้อหาและรีวิวเพิ่มเติม (Sales Copy)</label>
                          <textarea
                            rows={3}
                            placeholder="อธิบายสรรพคุณ วิธีใช้งาน รายละเอียดโปรโมชั่น รีวิวจากผู้ใช้..."
                            value={newLandingPage.body_content}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, body_content: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* --- SECTION 7: PRO STYLING & BACKGROUND WALLPAPER --- */}
                      <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-indigo-200 dark:border-indigo-900/50 pb-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">7</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">ปรับแต่งสี & รูปภาพพื้นหลังระดับโปร (Pro Styling)</h4>
                        </div>

                        {/* 1. Theme Color Presets */}
                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">
                            ธีมสีปุ่มสั่งซื้อ & ป้าย Flash Sale (Theme Color)
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { color: '#EF4444', label: 'แดง Flash Sale' },
                              { color: '#10B981', label: 'เขียวมิ้นต์ COD' },
                              { color: '#8B5CF6', label: 'ม่วงคอสมิก' },
                              { color: '#F59E0B', label: 'ทองคำหรูหรา' },
                              { color: '#2563EB', label: 'น้ำเงินพรีเมียม' },
                              { color: '#000000', label: 'ดำคลาสสิก' }
                            ].map((preset) => (
                              <button
                                key={preset.color}
                                type="button"
                                onClick={() => setNewLandingPage({ ...newLandingPage, theme_color: preset.color })}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                                  newLandingPage.theme_color === preset.color
                                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-white dark:bg-slate-900 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: preset.color }}></span>
                                <span>{preset.label}</span>
                              </button>
                            ))}

                            <div className="flex items-center gap-1.5 ml-auto">
                              <span className="text-[11px] text-slate-400 font-bold">Custom Hex:</span>
                              <input
                                type="text"
                                placeholder="#EF4444"
                                value={newLandingPage.theme_color}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, theme_color: e.target.value })}
                                className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-[#1E1B4B] dark:text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Page Background Color Presets */}
                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">
                            สีพื้นหลังหน้าเซลเพจ (Page Background)
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { color: '#0B0F17', label: 'ดำ Obsidian' },
                              { color: '#FFFFFF', label: 'ขาวสว่าง Clean' },
                              { color: '#F9F9FF', label: 'พาสเทล Lavender' },
                              { color: '#0F172A', label: 'มิดไนท์ Navy' },
                              { color: '#18080E', label: 'แดงเบอร์กันดี' }
                            ].map((preset) => (
                              <button
                                key={preset.color}
                                type="button"
                                onClick={() => setNewLandingPage({ ...newLandingPage, bg_color: preset.color })}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                                  newLandingPage.bg_color === preset.color
                                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-white dark:bg-slate-900 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-inner" style={{ backgroundColor: preset.color }}></span>
                                <span>{preset.label}</span>
                              </button>
                            ))}

                            <div className="flex items-center gap-1.5 ml-auto">
                              <span className="text-[11px] text-slate-400 font-bold">Custom Hex:</span>
                              <input
                                type="text"
                                placeholder="#0B0F17"
                                value={newLandingPage.bg_color}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, bg_color: e.target.value })}
                                className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-[#1E1B4B] dark:text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3. Text & Headline Color */}
                        <div className="space-y-2 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40">
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200">
                            3. สีตัวหนังสือและหัวข้อในจอเล็ก (Text & Headline Color)
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { color: '#FFFFFF', label: 'ขาวสว่าง (สำหรับพื้นหลังมืด)' },
                              { color: '#0F172A', label: 'ดำเข้ม (สำหรับพื้นหลังสว่าง)' },
                              { color: '#FCD34D', label: 'ทองอร่าม' },
                              { color: '#F43F5E', label: 'กุหลาบชมพู' },
                              { color: '#34D399', label: 'เขียวมิ้นต์' }
                            ].map((preset) => (
                              <button
                                key={preset.color}
                                type="button"
                                onClick={() => setNewLandingPage({ ...newLandingPage, text_color: preset.color })}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                                  newLandingPage.text_color === preset.color
                                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-white dark:bg-slate-900 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-inner" style={{ backgroundColor: preset.color }}></span>
                                <span>{preset.label}</span>
                              </button>
                            ))}

                            <div className="flex items-center gap-1.5 ml-auto">
                              <input
                                type="color"
                                value={newLandingPage.text_color || '#FFFFFF'}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, text_color: e.target.value })}
                                className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                              />
                              <input
                                type="text"
                                placeholder="#FFFFFF"
                                value={newLandingPage.text_color || '#FFFFFF'}
                                onChange={(e) => setNewLandingPage({ ...newLandingPage, text_color: e.target.value })}
                                className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-[#1E1B4B] dark:text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 4. Page Background Wallpaper Image (URL & Mobile Upload) */}
                        <div className="space-y-2 pt-1 border-t border-indigo-200/60 dark:border-indigo-900/40">
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-indigo-500" />
                            <span>ภาพวอลเปเปอร์พื้นหลังหน้าเซลเพจ (Background Image Wallpaper)</span>
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="URL ภาพวอลเปเปอร์พื้นหลัง (ถ้ามี)"
                              value={newLandingPage.bg_image_url}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, bg_image_url: e.target.value })}
                              className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono"
                            />
                            
                            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow flex-shrink-0 active:scale-95">
                              <Upload className="w-4 h-4" />
                              <span>{uploadingLpImg ? 'กำลังอัปโหลด...' : '📸 อัปรูปพื้นหลัง'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUploadLpImage(e, 'bg')}
                              />
                            </label>
                          </div>

                          {newLandingPage.bg_image_url && (
                            <div className="flex items-center gap-2 pt-1">
                              <img src={newLandingPage.bg_image_url} alt="BG Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">✓ ใช้งานภาพพื้นหลังแล้ว</span>
                              <button
                                type="button"
                                onClick={() => setNewLandingPage({ ...newLandingPage, bg_image_url: '' })}
                                className="text-[11px] text-rose-500 hover:underline ml-auto"
                              >
                                ลบภาพพื้นหลัง
                              </button>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* --- SECTION 8: SEO & OPEN GRAPH SETTINGS --- */}
                      <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 border-b border-blue-200 dark:border-blue-900/50 pb-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">6</span>
                          <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">การตั้งค่า SEO & Social Share (Google / Facebook)</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">SEO Title (หัวข้อบน Google)</label>
                            <input
                              type="text"
                              placeholder="เช่น ข้อเสนอพิเศษ Amanita Muscaria แท้ 100% ส่งฟรี"
                              value={newLandingPage.seo_title}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, seo_title: e.target.value })}
                              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">SEO Keywords (คีย์เวิร์ดคั่นด้วยจุลภาค)</label>
                            <input
                              type="text"
                              placeholder="เช่น เห็ดสกัด, ยิงแอด, โปรโมชั่น, ส่งฟรี"
                              value={newLandingPage.seo_keywords}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, seo_keywords: e.target.value })}
                              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">SEO Description (คำบรรยายสรุปเวลาค้นหา)</label>
                          <textarea
                            rows={2}
                            placeholder="เช่น โปรโมชั่นพิเศษ Flash Sale เฉพาะวันนี้ สั่งซื้อเก็บเงินปลายทาง ส่งด่วน 1-2 วันถึงบ้าน"
                            value={newLandingPage.seo_description}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, seo_description: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ภาพหน้าปกเวลาแชร์ลงโซเชียล (OG Image)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="URL รูปภาพหน้าปกแชร์"
                              value={newLandingPage.og_image_url}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, og_image_url: e.target.value })}
                              className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono"
                            />
                            <label className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>อัปรูป</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUploadLpImage(e, 'og')}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ชื่อเรียกเซลเพจ (Internal Title) *</label>
                          <input
                            type="text"
                            required
                            placeholder="เช่น เซลเพจโปรโมชั่นเห็ดสกัด 8.8"
                            value={newLandingPage.title}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, title: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">URL Slug ที่ต้องการ *</label>
                          <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1 focus-within:border-rose-400">
                            <span className="text-slate-400 text-xs font-mono select-none">linktreethai.com/p/</span>
                            <input
                              type="text"
                              required
                              placeholder="deal-special"
                              value={newLandingPage.slug}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                              className="w-full py-1.5 bg-transparent text-xs text-[#1E1B4B] dark:text-white focus:outline-none font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">หัวข้อพาดหัวขายของ (Headline) *</label>
                        <input
                          type="text"
                          required
                          placeholder="เช่น ข้อเสนอพิเศษ Amanita Muscaria แท้ 100% สกัดเข้มข้น ลด 50% วันนี้เท่านั้น!"
                          value={newLandingPage.headline}
                          onChange={(e) => setNewLandingPage({ ...newLandingPage, headline: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">คำบรรยายย่อย (Sub-headline)</label>
                        <input
                          type="text"
                          placeholder="เช่น สัมผัสความสงบและสมาธิจากธรรมชาติ ส่งฟรีทั่วไทย มีบริการเก็บเงินปลายทาง"
                          value={newLandingPage.subheadline}
                          onChange={(e) => setNewLandingPage({ ...newLandingPage, subheadline: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">รูปภาพหรือวิดีโอ YouTube ไฮไลต์</label>
                          <input
                            type="text"
                            placeholder="https://www.youtube.com/watch?v=... หรือ Image URL"
                            value={newLandingPage.hero_media_url}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, hero_media_url: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ประเภทสื่อ</label>
                          <select
                            value={newLandingPage.hero_media_type}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, hero_media_type: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                          >
                            <option value="image">🖼️ รูปภาพ (Image)</option>
                            <option value="youtube">🎬 วิดีโอ YouTube</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ราคาโปรโมชั่น (บาท) *</label>
                          <input
                            type="number"
                            required
                            placeholder="990"
                            value={newLandingPage.offer_price}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, offer_price: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ราคาเดิมก่อนลด (บาท)</label>
                          <input
                            type="number"
                            placeholder="1990"
                            value={newLandingPage.original_price}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, original_price: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">เวลานับถอยหลัง (นาที)</label>
                          <input
                            type="number"
                            placeholder="15"
                            value={newLandingPage.countdown_minutes}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, countdown_minutes: parseInt(e.target.value, 10) || 15 })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ข้อความบนปุ่มสั่งซื้อ *</label>
                          <input
                            type="text"
                            required
                            placeholder="สั่งซื้อโปรโมชั่นพิเศษนี้ทันที"
                            value={newLandingPage.cta_text}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, cta_text: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">ลิงก์ปลายทางเมื่อกดปุ่ม (LINE / Shopee / ฯลฯ) *</label>
                          <input
                            type="text"
                            required
                            placeholder="https://line.me/ti/p/@amth หรือ ลิงก์ร้านค้า"
                            value={newLandingPage.cta_url}
                            onChange={(e) => setNewLandingPage({ ...newLandingPage, cta_url: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">จุดเด่นของข้อเสนอ (1 บรรทัด = 1 ข้อ)</label>
                        <textarea
                          rows={3}
                          value={newLandingPage.features_text}
                          onChange={(e) => setNewLandingPage({ ...newLandingPage, features_text: e.target.value })}
                          placeholder="✓ ส่งฟรีทั่วไทย\n✓ เก็บเงินปลายทาง"
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">เนื้อหาและรีวิวเพิ่มเติม (Sales Copy)</label>
                        <textarea
                          rows={4}
                          value={newLandingPage.body_content}
                          onChange={(e) => setNewLandingPage({ ...newLandingPage, body_content: e.target.value })}
                          placeholder="อธิบายสรรพคุณ วิธีใช้งาน รายละเอียดโปรโมชั่น รีวิวจากผู้ใช้..."
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      {/* Custom Pixel Settings for this specific Landing Page */}
                      <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <h4 className="font-extrabold text-xs text-[#1E1B4B] dark:text-white">
                            กำหนด Tracking Pixels เฉพาะสำหรับเซลเพจนี้ (แยกตามสินค้า / แคมเปญ)
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          หากกรอกช่องด้านล่าง เซลเพจนี้จะใช้ Pixel ID เฉพาะสินค้านี้แทน (หากเว้นว่างไว้ ระบบจะใช้ค่าเริ่มต้นจากโปรไฟล์หลักอัตโนมัติ)
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">
                              🔵 Facebook Pixel ID สำหรับเซลเพจนี้
                            </label>
                            <input
                              type="text"
                              placeholder={profile.fb_pixel_id ? `ใช้ค่าหลัก (${profile.fb_pixel_id})` : 'เช่น 123456789012345'}
                              value={newLandingPage.fb_pixel_id}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, fb_pixel_id: e.target.value })}
                              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">
                              ⚫ TikTok Pixel ID สำหรับเซลเพจนี้
                            </label>
                            <input
                              type="text"
                              placeholder={profile.tiktok_pixel_id ? `ใช้ค่าหลัก (${profile.tiktok_pixel_id})` : 'เช่น C9A1B2C3D4...'}
                              value={newLandingPage.tiktok_pixel_id}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, tiktok_pixel_id: e.target.value })}
                              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">
                              🟡 Google Tag / GA4 ID สำหรับเซลเพจนี้
                            </label>
                            <input
                              type="text"
                              placeholder={profile.google_pixel_id ? `ใช้ค่าหลัก (${profile.google_pixel_id})` : 'เช่น G-XXXXXXXXXX'}
                              value={newLandingPage.google_pixel_id}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, google_pixel_id: e.target.value })}
                              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#1E1B4B] dark:text-slate-200 mb-1">
                              🟢 LINE Tag ID สำหรับเซลเพจนี้
                            </label>
                            <input
                              type="text"
                              placeholder={profile.line_tag_id ? `ใช้ค่าหลัก (${profile.line_tag_id})` : 'เช่น xxxxxxxx-xxxx...'}
                              value={newLandingPage.line_tag_id}
                              onChange={(e) => setNewLandingPage({ ...newLandingPage, line_tag_id: e.target.value })}
                              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          className="flex-1 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-98"
                        >
                          <Rocket className="w-4 h-4" />
                          <span>{editingLandingPageId ? '💾 บันทึกการแก้ไขเซลเพจ & Pixel' : '🚀 สร้างหน้าเซลเพจยิงแอดทันที'}</span>
                        </button>

                        {editingLandingPageId && (
                          <button
                            type="button"
                            onClick={handleCancelEditLandingPage}
                            className="px-5 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-sm transition"
                          >
                            ยกเลิกการแก้ไข
                          </button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                      <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">โควตาเซลเพจของคุณครบแล้ว</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        คุณใช้งานโควตาครบ {totalLandingSlots} เซลเพจแล้ว หากต้องการสร้างเพิ่ม สามารถกดปุ่มปลดล็อกเพิ่ม 1 URL โดยใช้ 350 แต้ม
                      </p>
                      <button
                        onClick={handleUnlockLandingPageSlot}
                        disabled={unlockingLandingSlot || (profile.points || 0) < 350}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition shadow inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> ปลดล็อกเพิ่ม 1 เซลเพจ (350 แต้ม)
                      </button>
                    </div>
                  )}
                </div>

                {/* List of Created Landing Pages */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 uppercase tracking-wider px-1">
                    หน้าเซลเพจทั้งหมดของคุณ ({landingPages.length})
                  </h4>

                  {landingPages.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500 text-xs shadow-sm">
                      ยังไม่มีหน้าเซลเพจ กรอกข้อมูลด้านบนเพื่อสร้างหน้าขายของยิงแอดสำหรับ Facebook & TikTok ได้เลย! 🚀
                    </div>
                  ) : (
                    landingPages.map((lp) => {
                      const fullLandingUrl = `${originUrl}/p/${lp.slug}`
                      
                      // Accurate expiration calculation: Math.floor for precise remaining days and hours
                      const createdTime = lp.created_at ? new Date(lp.created_at).getTime() : Date.now()
                      const expiryTime = lp.expires_at ? new Date(lp.expires_at).getTime() : (createdTime + 30 * 24 * 60 * 60 * 1000)
                      const diffMs = expiryTime - Date.now()
                      const isExpired = diffMs <= 0
                      const diffTotalSec = Math.max(0, Math.floor(diffMs / 1000))
                      const daysLeft = Math.floor(diffTotalSec / (24 * 3600))
                      const hoursLeft = Math.floor((diffTotalSec % (24 * 3600)) / 3600)
                      const expiryDateStr = new Date(expiryTime).toLocaleDateString('th-TH')
                      const remainingStr = isExpired
                        ? 'หมดอายุแล้ว (หน้าเว็บจริงถูกล็อค)'
                        : daysLeft > 0
                          ? `เหลือเวลาอีก ${daysLeft} วัน${hoursLeft > 0 ? ` ${hoursLeft} ชม.` : ''}`
                          : `เหลือเวลาอีก ${hoursLeft} ชั่วโมง`

                      return (
                        <div
                          key={lp.id}
                          className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition ${
                            isExpired ? 'border-amber-400 dark:border-amber-600/70 bg-amber-50/10' : 'border-slate-200/90 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-extrabold text-[#1E1B4B] dark:text-white text-base truncate">{lp.title}</h4>
                                <span className="text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900 font-bold">
                                  👁️ {lp.views || 0} วิว
                                </span>
                                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 font-bold">
                                  👆 {lp.clicks || 0} คลิก
                                </span>
                                <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-900 font-mono font-bold">
                                  {lp.fb_pixel_id ? `🎯 FB Pixel: ${lp.fb_pixel_id}` : (profile.fb_pixel_id ? `🌐 ใช้ Pixel หลัก (${profile.fb_pixel_id})` : '⚪ ยังไม่ตั้ง Pixel')}
                                </span>
                              </div>

                              <p className="text-xs text-rose-600 dark:text-rose-400 font-mono font-bold">{fullLandingUrl}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{lp.headline}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setLpExpiryDetailModal(lp)}
                                className="px-3 py-2 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-black flex items-center gap-1 transition active:scale-95 shadow-sm cursor-pointer"
                                title="คลิกเพื่อดูวันหมดอายุและรายละเอียด"
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                <span>ดูวันหมดอายุ</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmRedeemModal({
                                    isOpen: true,
                                    title: `ต่ออายุเซลเพจ "${lp.title}" 30 วัน`,
                                    desc: `ใช้ 350 แต้ม เพื่อต่ออายุหน้าเซลเพจนี้ให้แสดงผลบนเว็บจริงอีก 30 วัน`,
                                    cost: 350,
                                    onConfirm: () => handleRenewLandingPage(lp.id, lp.expires_at, lp.title)
                                  })
                                }}
                                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 transition active:scale-95 shadow-sm cursor-pointer ${
                                  isExpired 
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 animate-pulse' 
                                    : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                }`}
                                title="ต่ออายุ 30 วัน (350 แต้ม)"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>ต่ออายุ 30 วัน</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setQrTargetUrl(fullLandingUrl)
                                  setQrModalOpen(true)
                                }}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition cursor-pointer"
                                title="QR Code & แชร์เซลเพจ"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStartEditLandingPage(lp)}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                                title="แก้ไขข้อมูลเซลเพจ"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteLandingPage(lp.id)}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                title="ลบเซลเพจ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Expiration Timeline & Public Status Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-500 font-bold">สถานะอายุการใช้งาน:</span>
                              {isExpired ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" /> หมดอายุแล้ว (หน้าเว็บจริงถูกล็อค)
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {remainingStr} (หมดอายุวันที่ {expiryDateStr})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={fullLandingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-1.5 bg-[#34D399] hover:bg-[#10B981] text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 transition shadow-sm"
                              >
                                <span>เปิดดูหน้าจริง</span> <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                  </>
                )}
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-6">
                
                {/* LEADS CRM TOP METRICS SUMMARY */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">👥 ลูกค้าทั้งหมด</span>
                    <span className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-mono">{leads.length}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">🟡 รอติดต่อ/รอดำเนินการ</span>
                    <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                      {leads.filter(l => !l.status || l.status === 'pending').length}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">🟢 ปิดการขายสำเร็จ</span>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {leads.filter(l => l.status === 'completed').length}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block">💰 ยอดเงินรวม</span>
                    <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
                      ฿{leads.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
                  
                  {/* Header & Main Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span>ระบบจัดการข้อมูลลูกค้า & ลีด CRM (Leads Management)</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        รวมข้อมูลลูกค้าจากหน้าเซลเพจ COD, แบบฟอร์มติดต่อ Bio Link และข้อมูลที่เพิ่มด้วยตนเอง
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleRefreshLeads}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                        title="รีเฟรชข้อมูลลีดล่าสุด"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin' : ''}`} />
                        <span>รีเฟรช</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAddLeadModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> เพิ่มลูกค้าด้วยตนเอง
                      </button>

                      {leads.length > 0 && (
                        <button
                          type="button"
                          onClick={handleExportLeadsCSV}
                          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          title="ดาวน์โหลดไฟล์ Excel/CSV"
                        >
                          <Download className="w-3.5 h-3.5" /> CSV
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PROMINENT LINE MESSAGING API (LINE OA) & WEBHOOK REAL-TIME NOTIFICATION BOX (MASTER VIP) */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-purple-500/10 border-2 border-emerald-500/30 dark:border-emerald-500/20 space-y-3.5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-500/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-[#06C755] text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base text-[#1E1B4B] dark:text-white">
                              ระบบแจ้งเตือนเข้า LINE Official Account (Messaging API)
                            </h4>
                            <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black shadow-xs">
                              👑 MASTER VIP ONLY
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            แจ้งเตือนทันทีเข้า LINE เมื่อมีออเดอร์ COD หรือลูกค้ากรอกแบบฟอร์มติดต่อ (รองรับ LINE Messaging API & Webhook)
                          </p>
                        </div>
                      </div>

                      {profile.role === 'admin' || tier.tier === 'master' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> สิทธิ์ใช้งานพร้อมใช้งาน
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmRedeemModal({
                              isOpen: true,
                              title: 'อัปเกรดเป็น MASTER VIP (599 แต้ม)',
                              desc: 'ปลดล็อกระบบแจ้งเตือนเข้า LINE Real-time, 9 เทมเพลต, เซลเพจยิงแอด, และ Tracking Pixels',
                              cost: 599,
                              onConfirm: () => handleRedeemTierWithPoints('master')
                            })
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
                        >
                          <Crown className="w-4 h-4" /> อัปเกรด MASTER VIP เพื่อใช้งาน
                        </button>
                      )}
                    </div>

                    {profile.role !== 'admin' && tier.tier !== 'master' ? (
                      <div className="p-3 bg-white/60 dark:bg-slate-950/60 border border-amber-300/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>ฟังก์ชันแจ้งเตือนเข้า LINE สงวนสิทธิ์เฉพาะระดับ MASTER VIP ช่วยให้คุณไม่พลาดทุกออเดอร์และปิดการขายได้เร็วที่สุด</span>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-1 text-xs font-bold">
                        <div className="p-3 bg-white/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-[11px] font-normal text-slate-600 dark:text-slate-300">
                          <p className="font-bold text-[#06C755] flex items-center gap-1">
                            ✨ วิธีเชื่อมต่อ LINE Messaging API (LINE Developers):
                          </p>
                          <p>1. เข้า <a href="https://developers.line.biz/" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 underline font-bold">LINE Developers Console</a> สร้าง Provider และ Messaging API Channel</p>
                          <p>2. แท็บ <strong>Messaging API</strong>: กด Issue <strong>Channel Access Token (Long-lived)</strong> แล้วคัดลอกมาวางในช่อง 1</p>
                          <p>3. แท็บ <strong>Basic settings</strong>: เลื่อนลงมาล่างสุด คัดลอก <strong>Your user ID</strong> (ขึ้นต้นด้วย U...) มาวางในช่อง 2</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-slate-700 dark:text-slate-200">
                              1. LINE Channel Access Token (Long-lived) *
                            </label>
                            <input
                              type="text"
                              placeholder="วาง Channel Access Token ที่นี่..."
                              value={profile.line_channel_access_token || ''}
                              onChange={(e) => setProfile({ ...profile, line_channel_access_token: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500 shadow-inner"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 text-slate-700 dark:text-slate-200">
                              2. Your LINE User ID (หรือ Group ID) *
                            </label>
                            <input
                              type="text"
                              placeholder="เช่น U1a2b3c4d5e6f... (ดูที่ Basic Settings)"
                              value={profile.line_user_id || ''}
                              onChange={(e) => setProfile({ ...profile, line_user_id: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500 shadow-inner"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 text-slate-700 dark:text-slate-200">
                            3. Webhook URL สำรอง (ถ้ามี เช่น Make / Zapier / N8N / Discord)
                          </label>
                          <input
                            type="text"
                            placeholder="https://your-webhook-endpoint.com/..."
                            value={profile.line_webhook_url || ''}
                            onChange={(e) => setProfile({ ...profile, line_webhook_url: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500 shadow-inner"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                            💡 ระบบจะส่งข้อความ Push Notification แจ้งเตือนเข้าแชต LINE ทันทีที่มีลูกค้าสั่งซื้อหรือติดต่อ
                          </p>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              disabled={testingLineNotify || (!profile.line_channel_access_token && !profile.line_webhook_url && !profile.line_notify_token)}
                              onClick={handleTestLineNotify}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{testingLineNotify ? 'กำลังส่งทดสอบ...' : '🔔 ทดสอบส่ง LINE'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleSaveProfile}
                              className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" /> บันทึกการตั้งค่า LINE
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="ค้นหาชื่อ, เบอร์โทร, LINE ID, หรือรหัสออเดอร์..."
                        value={leadSearchQuery}
                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-400" />
                      <select
                        value={leadStatusFilter}
                        onChange={(e) => setLeadStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-[#1E1B4B] dark:text-white focus:outline-none"
                      >
                        <option value="all">สถานะทั้งหมด ({leads.length})</option>
                        <option value="pending">🟡 รอติดต่อ / รอดำเนินการ</option>
                        <option value="contacted">🔵 ติดต่อแล้ว</option>
                        <option value="completed">🟢 สำเร็จ / ปิดการขาย</option>
                        <option value="cancelled">🔴 ยกเลิก / ไม่สำเร็จ</option>
                      </select>
                    </div>
                  </div>

                  {/* Leads List Rendering */}
                  {(() => {
                    const filteredLeads = leads.filter(l => {
                      const matchStatus = leadStatusFilter === 'all' || (l.status || 'pending') === leadStatusFilter
                      const q = leadSearchQuery.toLowerCase().trim()
                      const matchQuery = !q || (
                        (l.name && l.name.toLowerCase().includes(q)) ||
                        (l.phone && l.phone.toLowerCase().includes(q)) ||
                        (l.email && l.email.toLowerCase().includes(q)) ||
                        (l.line_id && l.line_id.toLowerCase().includes(q)) ||
                        (l.order_code && l.order_code.toLowerCase().includes(q)) ||
                        (l.note && l.note.toLowerCase().includes(q))
                      )
                      return matchStatus && matchQuery
                    })

                    if (filteredLeads.length === 0) {
                      return (
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs space-y-2">
                          <Users className="w-8 h-8 text-slate-400 mx-auto" />
                          <p className="font-bold">ไม่พบข้อมูลลูกค้าตามเงื่อนไขที่ค้นหา</p>
                          <p className="text-[11px] text-slate-400">คุณสามารถกดปุ่ม "+ เพิ่มลูกค้าด้วยตนเอง" ด้านบน เพื่อสร้างรายการใหม่ได้ทันที</p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-3">
                        {filteredLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black text-sm">
                                  {lead.name ? lead.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">{lead.name}</h4>
                                    {lead.order_code && (
                                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md font-bold">
                                        #{lead.order_code}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    📅 {new Date(lead.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                                  </p>
                                </div>
                              </div>

                              {/* Status Select & Quick Amount Badge */}
                              <div className="flex items-center gap-2 self-start sm:self-center">
                                {lead.amount && (
                                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                    ฿{parseFloat(String(lead.amount)).toLocaleString()}
                                  </span>
                                )}

                                <select
                                  value={lead.status || 'pending'}
                                  onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                                    lead.status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                      : lead.status === 'contacted'
                                      ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                      : lead.status === 'cancelled'
                                      ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                      : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                  }`}
                                >
                                  <option value="pending">🟡 รอติดต่อ</option>
                                  <option value="contacted">🔵 ติดต่อแล้ว</option>
                                  <option value="completed">🟢 สำเร็จ</option>
                                  <option value="cancelled">🔴 ยกเลิก</option>
                                </select>
                              </div>
                            </div>

                            {/* Contact Badges & Address */}
                            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                              {lead.phone && (
                                <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg hover:text-purple-600 font-mono">
                                  <Phone className="w-3 h-3 text-purple-500" /> {lead.phone}
                                </a>
                              )}
                              {lead.line_id && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg font-mono">
                                  <MessageCircle className="w-3 h-3 text-emerald-500" /> LINE: {lead.line_id}
                                </span>
                              )}
                              {lead.email && (
                                <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg hover:text-purple-600 font-mono">
                                  <Mail className="w-3 h-3 text-blue-500" /> {lead.email}
                                </a>
                              )}
                            </div>

                            {lead.address && (
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                <span>ที่อยู่จัดส่ง: {lead.address}</span>
                              </p>
                            )}

                            {lead.note && (
                              <p className="text-xs text-slate-700 dark:text-slate-300 bg-purple-50/50 dark:bg-purple-950/20 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                                💬 {lead.note}
                              </p>
                            )}

                            {/* Row Action Footer */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLeadDetails(lead)
                                  setIsLeadDetailsModalOpen(true)
                                }}
                                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-1 transition"
                              >
                                <Eye className="w-3.5 h-3.5" /> รายละเอียด
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditLead(lead)}
                                className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-100 flex items-center gap-1 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> แก้ไข
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                                title="ลบข้อมูลลูกค้า"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}

                </div>
              </div>
            )}

            {/* TAB 7: BILLING & PACKAGES */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
              {/* TOP UP POINTS PROMINENT BANNER */}
              <div className="p-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl text-slate-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="p-2 rounded-xl bg-black/15 font-black text-xs">🪙 ระบบเติมแต้มสะสม</span>
                    <span className="font-bold text-xs bg-white px-2 py-0.5 rounded-full">PromptPay QR</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">เติมแต้มสะสมเพื่อปลดล็อกฟังก์ชัน VIP ทันที</h3>
                  <p className="text-xs opacity-90">100 แต้ม = 100 บ. | 300 แต้ม = 299 บ. (PRO VIP) | 600 แต้ม = 599 บ. (MASTER VIP)</p>
                </div>

                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(true)}
                  className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-2xl transition active:scale-95 flex-shrink-0"
                >
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>💳 เติมแต้มสะสม (PromptPay)</span>
                </button>
              </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">แพ็กเกจการใช้งาน & เหรียญสะสม</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">อัปเกรดเพื่อปลดล็อกฟังก์ชันขั้นสูงและเทมเพลตระดับพรีเมียม</p>
                    </div>
                  </div>

                  {/* Current Plan Summary Card */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">แพ็กเกจปัจจุบันของคุณ</span>
                      <h4 className="text-lg font-black text-[#1E1B4B] dark:text-white mt-0.5 flex items-center gap-2">
                        {tier.name}
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                          Active
                        </span>
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">แต้มสะสม</span>
                        <p className="text-lg font-black text-amber-700 dark:text-amber-400 flex items-center gap-1 justify-end mt-0.5 font-mono">
                          <Coins className="w-4 h-4 text-amber-500" /> {profile.points || 0}
                        </p>
                      </div>
                      <button
                        onClick={() => setPointsDetailModalOpen(true)}
                        className="px-4 py-2 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold rounded-xl text-xs flex items-center gap-1 transition shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> ดูสถานะ & สิทธิ์
                      </button>
                    </div>
                  </div>

                  {/* Package Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-3">
                      <h4 className="font-bold text-sm text-[#1E1B4B] dark:text-white">Free Plan</h4>
                      <div className="text-2xl font-black text-[#1E1B4B] dark:text-white">ฟรีตลอดชีพ</div>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                        <li>✓ เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                        <li>✓ สูงสุด 2 สินค้า</li>
                        <li>✓ 3 เทมเพลตเริ่มต้น</li>
                        <li>✓ QR Code แชร์โปรไฟล์</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 p-5 rounded-3xl space-y-3 relative overflow-hidden flex flex-col justify-between shadow-sm">
                      <div className="space-y-3">
                        <div className="text-[9px] font-extrabold bg-purple-500 text-white px-2.5 py-0.5 rounded-full w-fit">
                          POPULAR
                        </div>
                        <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300">PRO VIP</h4>
                        <div className="text-2xl font-black text-[#1E1B4B] dark:text-white">฿299 <span className="text-xs font-normal text-slate-500">/ 30 วัน (299 แต้ม)</span></div>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                          <li>✓ เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                          <li>✓ สูงสุด 10 สินค้า</li>
                          <li>✓ 6 เทมเพลตยอดนิยม (Template 1-6)</li>
                          <li>✓ ซ่อนลายน้ำแบรนด์ LinkTreeThai ได้</li>
                          <li>✓ QR Code และสถิติคนเข้าชม</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          setConfirmRedeemModal({
                            isOpen: true,
                            title: 'ยืนยันการแลกสิทธิ์ PRO VIP (30 วัน)',
                            desc: 'ปลดล็อก 6 เทมเพลตยอดนิยม, เพิ่ม 10 สินค้า, และซ่อนลายน้ำแบรนด์',
                            cost: 299,
                            onConfirm: () => handleRedeemTierWithPoints('pro')
                          })
                        }}
                        disabled={redeemingTier === 'pro' || (profile.points || 0) < 299}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition disabled:opacity-40 shadow-md shadow-purple-500/20 active:scale-95 cursor-pointer"
                      >
                        {redeemingTier === 'pro' ? 'กำลังแลก...' : '💎 แลก PRO VIP (299 แต้ม)'}
                      </button>
                    </div>

                    <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-5 rounded-3xl space-y-3 flex flex-col justify-between shadow-sm">
                      <div className="space-y-3">
                        <div className="text-[9px] font-extrabold bg-amber-500 text-white px-2.5 py-0.5 rounded-full w-fit">
                          ULTIMATE
                        </div>
                        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">MASTER VIP</h4>
                        <div className="text-2xl font-black text-[#1E1B4B] dark:text-white">฿599 <span className="text-xs font-normal text-slate-500">/ 30 วัน (599 แต้ม)</span></div>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                          <li>✓ เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                          <li>✓ สินค้าไม่จำกัด (50+ รายการ)</li>
                          <li>✓ ครบทั้ง 9 เทมเพลตระดับสูงสุด (รวม Template 7, 8, 9)</li>
                          <li>✓ ฟรี! เซลเพจยิงแอด COD 1 URL ทันที</li>
                          <li>✓ ปลดล็อกระบบย่อลิงก์สั้นไม่จำกัด</li>
                          <li>✓ ระบบฝัง Tracking Pixels (FB/TikTok/Google/Line)</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          setConfirmRedeemModal({
                            isOpen: true,
                            title: 'ยืนยันการแลกสิทธิ์ MASTER VIP (30 วัน)',
                            desc: 'ปลดล็อกครบทุกฟังก์ชันสูงสุด: 9 เทมเพลต, เซลเพจยิงแอด COD, ย่อลิงก์, และ Tracking Pixels',
                            cost: 599,
                            onConfirm: () => handleRedeemTierWithPoints('master')
                          })
                        }}
                        disabled={redeemingTier === 'master' || (profile.points || 0) < 599}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition disabled:opacity-40 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                      >
                        {redeemingTier === 'master' ? 'กำลังแลก...' : '👑 แลก MASTER VIP (599 แต้ม)'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Smartphone Preview */}
          <div className="hidden lg:block lg:col-span-5 sticky top-20 space-y-3">
            
            {/* Mode Switcher Tabs (Bio Link vs เซลเพจยิงแอด) */}
            <div className="w-full max-w-[340px] mx-auto flex bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl shadow-sm text-xs font-bold">
              <button
                type="button"
                onClick={() => setPreviewMode('bio')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  previewMode === 'bio'
                    ? 'bg-white dark:bg-slate-900 text-[#1E1B4B] dark:text-white shadow font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>พรีวิว Bio Link</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('landing')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  previewMode === 'landing'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>พรีวิว เซลเพจยิงแอด</span>
              </button>
            </div>

            {/* Top Bar above phone */}
            <div className="w-full max-w-[340px] mx-auto flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1B4B] dark:text-white">
                <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{previewMode === 'landing' ? 'ตัวอย่างเซลเพจสด (Live Preview)' : 'ตัวอย่างหน้า Bio Link บนมือถือ'}</span>
              </div>
              <a
                href={previewMode === 'landing' ? `${originUrl}/p/${newLandingPage.slug || 'deal-special'}` : publicProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>เปิดแท็บใหม่</span> <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* iPhone Frame */}
            <div className="w-full max-w-[340px] mx-auto bg-[#1E1B4B] border-[7px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden p-2 relative">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full ml-auto mr-2.5"></div>
              </div>

              <div 
                className="w-full rounded-[38px] overflow-y-auto max-h-[580px] no-scrollbar relative transition-all duration-300"
                style={{
                  backgroundColor: previewMode === 'bio' 
                    ? (profile.bg_color || '#0b0f17') 
                    : (newLandingPage.bg_color || '#0B0F17'),
                  ...(previewMode === 'bio' && (profile.inner_bg_image_url || profile.bg_image_url) ? { 
                    backgroundImage: `url(${profile.inner_bg_image_url || profile.bg_image_url})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  } : {}),
                  ...(previewMode === 'landing' && newLandingPage.bg_image_url ? { 
                    backgroundImage: `url(${newLandingPage.bg_image_url})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  } : {})
                }}
              >
                {previewMode === 'landing' ? (
                  <div className="pt-6">
                    <SalesLandingPagePreview
                      pageData={newLandingPage}
                      profile={profile}
                    />
                  </div>
                ) : (
                  <div className="pt-8 pb-4">
                    <TemplateRenderer
                      profile={profile}
                      links={links}
                      products={products}
                      handleLinkClick={(id, url) => window.open(url, '_blank')}
                      isDashboardPreview={true}
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* FLOATING ELEVATED MOBILE BOTTOM NAVBAR (Exact match to Reference Image 11) */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="bg-white/95 dark:bg-[#1E293B]/95 border border-slate-200 dark:border-slate-700/80 rounded-[32px] shadow-2xl backdrop-blur-2xl px-1.5 py-2 flex items-center justify-around relative">
          {[
            { id: 'links', label: 'ลิ้งก์', icon: Link2 },
            { id: 'shop', label: 'ร้านค้า', icon: ShoppingBag },
            { id: 'landing_pages', label: 'เซลเพจ', icon: Rocket, locked: !isLandingActive },
            { id: 'appearance', label: 'โปรไฟล์', icon: Palette },
            { id: 'shortener', label: 'ย่อลิงก์', icon: Scissors, locked: !isShortenerActive },
            { id: 'leads', label: 'ลีด', icon: Users },
            { id: 'billing', label: 'แพ็กเกจ', icon: Crown }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  if (tab.id === 'landing_pages') {
                    setPreviewMode('landing')
                  } else if (tab.id === 'links' || tab.id === 'shop' || tab.id === 'appearance') {
                    setPreviewMode('bio')
                  }
                }}
                className="flex-1 flex flex-col items-center justify-center relative py-1 focus:outline-none transition-all"
              >
                {isActive ? (
                  /* Elevated Floating Active Circle (Exact Reference Style) */
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#1E1B4B] dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-500 text-white shadow-xl shadow-purple-900/30 flex items-center justify-center -translate-y-5 border-4 border-[#F9F9FF] dark:border-[#0B0F17] transition-all animate-in zoom-in-95 duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-[#1E1B4B] dark:text-white -mt-3.5">
                      {tab.label}
                    </span>
                  </div>
                ) : (
                  /* Inactive Regular Tab Item */
                  <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold mt-1">
                      {tab.label}
                    </span>
                    {tab.locked && (
                      <Lock className="w-2.5 h-2.5 text-amber-500 absolute top-0.5 right-2" />
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) for Live Preview */}
      <button
        onClick={() => setMobilePreviewOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 p-3.5 rounded-full bg-[#1E1B4B] dark:bg-purple-600 text-white shadow-xl flex items-center gap-1.5 text-xs font-extrabold active:scale-95 border-2 border-white dark:border-slate-800"
      >
        <Eye className="w-4 h-4 text-purple-400 dark:text-white" />
        <span>ดูหน้าจริง</span>
      </button>

      {/* Mobile Fullscreen Live Preview Modal */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between">
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-xs text-white">ตัวอย่างโปรไฟล์ @{profile.username}</span>
            </div>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Modal Switcher */}
          <div className="px-4 pt-2 flex bg-slate-950 border-b border-slate-800 p-1 text-xs font-bold">
            <button
              onClick={() => setPreviewMode('bio')}
              className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                previewMode === 'bio' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" /> Bio Link
            </button>
            <button
              onClick={() => setPreviewMode('landing')}
              className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                previewMode === 'landing' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" /> เซลเพจยิงแอด
            </button>
          </div>

          <div 
            className="flex-1 overflow-y-auto p-4"
            style={{
              backgroundColor: previewMode === 'bio' ? (profile.bg_color || '#0B0F17') : (newLandingPage.bg_color || '#0B0F17'),
              ...(previewMode === 'bio' && (profile.inner_bg_image_url || profile.bg_image_url) ? { 
                backgroundImage: `url(${profile.inner_bg_image_url || profile.bg_image_url})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              } : {}),
              ...(previewMode === 'landing' && newLandingPage.bg_image_url ? { 
                backgroundImage: `url(${newLandingPage.bg_image_url})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              } : {})
            }}
          >
            {previewMode === 'landing' || activeTab === 'landing_pages' ? (
              <SalesLandingPagePreview
                pageData={newLandingPage}
                profile={profile}
              />
            ) : (
              <TemplateRenderer
                profile={profile}
                links={links}
                products={products}
                handleLinkClick={(id, url) => window.open(url, '_blank')}
                isDashboardPreview={true}
              />
            )}
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <a
              href={publicProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" /> เปิดหน้าเว็บจริง
            </a>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* QR Code & Share Sheet Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#1E1B4B] dark:text-white text-sm">QR Code & แชร์โปรไฟล์</h3>
              </div>
              <button
                onClick={() => setQrModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#1E1B4B] flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col items-center justify-center mx-auto w-44 h-44 border border-slate-200 dark:border-slate-800">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrTargetUrl)}`}
                alt="QR Code"
                className="w-36 h-36 object-contain"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <input
                type="text"
                readOnly
                value={qrTargetUrl}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-300 flex-1 px-2 focus:outline-none font-mono truncate font-semibold"
              />
              <button
                onClick={() => handleCopyLink(qrTargetUrl, 'qr_url')}
                className="px-3 py-1.5 bg-[#34D399] hover:bg-[#10B981] text-white font-bold rounded-xl text-xs flex items-center gap-1 transition"
              >
                {copiedLink === 'qr_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'qr_url' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>

            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* ACCOUNT STATUS, POINTS & PERMISSIONS DETAIL MODAL */}
      {(accountModalOpen || pointsDetailModalOpen) && (
        <div 
          onClick={handleCloseAccountModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto no-scrollbar relative animate-in fade-in zoom-in-95 duration-150 cursor-default text-[#1E1B4B] dark:text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800 shadow-inner font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">จัดการบัญชี & ข้อมูลส่วนตัว</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">@{profile.username}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAccountModal}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#1E1B4B] dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAccountActiveTab('info')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  accountActiveTab === 'info'
                    ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>ข้อมูลส่วนตัว</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountActiveTab('password')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  accountActiveTab === 'password'
                    ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>เปลี่ยนรหัสผ่าน</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountActiveTab('points')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  accountActiveTab === 'points'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>แต้ม & สิทธิ์</span>
              </button>
            </div>

            {/* TAB 1: PERSONAL PROFILE INFO (EDITABLE EXCEPT URL) */}
            {accountActiveTab === 'info' && (
              <form onSubmit={handleSaveAccountInfo} className="space-y-4 text-xs font-bold">
                
                {/* Locked Username & URL */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-500" /> ลิงก์ URL โปรไฟล์ของคุณ (ล็อคถาวร)
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      ยกเว้น URL ไม่สามารถแก้ไขได้
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={`https://linktreethai.com/${profile.username}`}
                    className="w-full px-3 py-2 bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed select-all"
                  />
                </div>

                {/* Email (Read Only Display) */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">อีเมลเข้าสู่ระบบ (Email)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                {/* Full Name / Display Name (Editable) */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">ชื่อที่แสดง (Display Name / ชื่อ-นามสกุล) *</label>
                  <input
                    type="text"
                    required
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="เช่น Amanita Thailand หรือ ชื่อของคุณ"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-500 text-xs font-bold"
                  />
                </div>

                {/* Bio / Description (Editable) */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">คำบรรยายตัวเอง (Bio Description)</label>
                  <textarea
                    rows={3}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="แนะนำตัวหรือบอกเล่าเกี่ยวกับแบรนด์ของคุณสั้นๆ..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-500 text-xs leading-relaxed font-normal"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseAccountModal}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs hover:bg-slate-200 transition font-bold"
                  >
                    ปิด
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition shadow-md shadow-purple-500/20 active:scale-95 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> บันทึกข้อมูลส่วนตัว
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CHANGE PASSWORD WITH EYE TOGGLE BUTTON */}
            {accountActiveTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-bold">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl">
                  <p className="text-[11px] text-purple-900 dark:text-purple-200 font-medium">
                    🔒 กำหนดรหัสผ่านใหม่สำหรับเข้าสู่ระบบ บัญชี: <strong className="font-mono">{user?.email}</strong>
                  </p>
                </div>

                {passwordChangeMsg && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-center font-bold animate-in fade-in">
                    {passwordChangeMsg}
                  </div>
                )}

                {/* New Password Input with Eye Toggle */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร) *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="•••••••• (รหัสผ่านใหม่)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition cursor-pointer p-1"
                      title={showNewPassword ? "ซ่อนรหัสผ่าน" : "กดปุ่มตาเพื่อดูรหัสผ่าน"}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Input with Eye Toggle */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">ยืนยันรหัสผ่านใหม่อีกครั้ง *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="•••••••• (ยืนยันรหัสผ่านใหม่อีกครั้ง)"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition cursor-pointer p-1"
                      title={showConfirmPassword ? "ซ่อนรหัสผ่าน" : "กดปุ่มตาเพื่อดูรหัสผ่าน"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseAccountModal}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs hover:bg-slate-200 transition font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword || !newPassword || !confirmPassword}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold rounded-xl text-xs transition shadow-md shadow-purple-500/20 active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{changingPassword ? 'กำลังอัปเดต...' : '🔒 ยืนยันเปลี่ยนรหัสผ่าน'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: POINTS & SUBSCRIPTION STATUS */}
            {accountActiveTab === 'points' && (
              <div className="space-y-4 text-xs font-bold">
                
                {/* Profile & Role Summary Header */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ตำแหน่ง / บทบาท</span>
                    <div className="flex items-center gap-1.5">
                      {profile.role === 'admin' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-xs font-black flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Admin (ผู้ดูแลระบบ)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1 shadow-sm">
                          <Users className="w-3.5 h-3.5 text-slate-500" /> Member (สมาชิกทั่วไป)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ระดับแพ็กเกจ</span>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${
                        tier.tier === 'master'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                          : tier.tier === 'pro'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-sm'
                      }`}>
                        {tier.tier === 'master' ? '👑' : tier.tier === 'pro' ? '💎' : '🌱'} {tier.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points Balance Highlight Banner */}
                <div className="p-4 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-600/15 border-2 border-amber-500/40 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                      <Coins className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xs text-amber-900 dark:text-amber-200 font-bold">แต้มสะสมคงเหลือ</span>
                      <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono leading-none mt-0.5">
                        {profile.points || 0} <span className="text-xs font-normal text-amber-700 dark:text-amber-400">แต้ม</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseAccountModal()
                      setTopUpModalOpen(true)
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    + เติมแต้มสะสม
                  </button>
                </div>

                {/* ALL PACKAGES & LOCKED FEATURES LIST WITH DIRECT BUY BUTTONS */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-extrabold text-[#1E1B4B] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> แพ็กเกจ & ฟังก์ชันพิเศษ (สิทธิ์การใช้งาน)
                  </h4>

                  {/* 1. MASTER VIP */}
                  <div className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    tier.tier === 'master' || profile.role === 'admin'
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1E1B4B] dark:text-white flex items-center gap-1">
                          👑 MASTER VIP Plan
                        </span>
                        {profile.role === 'admin' ? (
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">Admin (ถาวร)</span>
                        ) : profile.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now() ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            🟢 เหลือ {Math.max(0, Math.ceil((new Date(profile.master_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} วัน (ถึง {new Date(profile.master_expires_at).toLocaleDateString('th-TH')})
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">🔒 ยังไม่เปิดใช้งาน</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        ครบทั้ง 9 เทมเพลต, เซลเพจยิงแอดฟรี 1 URL, ย่อลิงก์ไม่จำกัด, Tracking Pixels, ซ่อนแบรนด์, แจ้งเตือนเข้า LINE
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmRedeemModal({
                          isOpen: true,
                          title: 'ยืนยันการแลกสิทธิ์ MASTER VIP (30 วัน)',
                          desc: 'ปลดล็อกครบทุกฟังก์ชันสูงสุด: 9 เทมเพลต, เซลเพจยิงแอด COD, ย่อลิงก์, Tracking Pixels, และแจ้งเตือน LINE',
                          cost: 599,
                          onConfirm: () => handleRedeemTierWithPoints('master')
                        })
                      }}
                      disabled={redeemingTier === 'master' || (profile.points || 0) < 599}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      {redeemingTier === 'master' ? 'กำลังแลก...' : '👑 แลก 599 แต้ม (30 วัน)'}
                    </button>
                  </div>

                  {/* 2. PRO VIP */}
                  <div className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    tier.tier === 'pro'
                      ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-700'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1E1B4B] dark:text-white flex items-center gap-1">
                          💎 PRO VIP Plan
                        </span>
                        {profile.pro_expires_at && new Date(profile.pro_expires_at).getTime() > Date.now() ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            🟢 เหลือ {Math.max(0, Math.ceil((new Date(profile.pro_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} วัน (ถึง {new Date(profile.pro_expires_at).toLocaleDateString('th-TH')})
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">🔒 ยังไม่เปิดใช้งาน</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        6 เทมเพลตยอดนิยม, เพิ่ม 10 สินค้าในร้านค้า, และซ่อนลายน้ำแบรนด์ LinkTreeThai
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmRedeemModal({
                          isOpen: true,
                          title: 'ยืนยันการแลกสิทธิ์ PRO VIP (30 วัน)',
                          desc: 'ปลดล็อก 6 เทมเพลตยอดนิยม, เพิ่ม 10 สินค้า, และซ่อนลายน้ำแบรนด์',
                          cost: 299,
                          onConfirm: () => handleRedeemTierWithPoints('pro')
                        })
                      }}
                      disabled={redeemingTier === 'pro' || (profile.points || 0) < 299}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition shadow-md shadow-purple-500/20 active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      {redeemingTier === 'pro' ? 'กำลังแลก...' : '💎 แลก 299 แต้ม (30 วัน)'}
                    </button>
                  </div>

                  {/* 3. URL SHORTENER PASS */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1E1B4B] dark:text-white flex items-center gap-1">
                          ✂️ ระบบย่อลิงก์สั้น (Shortener Pass)
                        </span>
                        {isShortenerActive ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">🟢 ปลดล็อกแล้ว</span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">🔒 ล็อคอยู่</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        สร้างลิงก์ย่อสั้นไม่จำกัด กำหนด Slug เองได้ พร้อมสถิติจำนวนคนคลิกแบบ Real-time
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmRedeemModal({
                          isOpen: true,
                          title: 'ปลดล็อกระบบย่อลิงก์สั้น (30 วัน)',
                          desc: 'ใช้ 100 แต้ม เพื่อปลดล็อกระบบย่อลิงก์ 30 วัน',
                          cost: 100,
                          onConfirm: handleUnlockShortener
                        })
                      }}
                      disabled={(profile.points || 0) < 100}
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      ✂️ แลก 100 แต้ม (30 วัน)
                    </button>
                  </div>

                  {/* 4. TRACKING PIXELS */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1E1B4B] dark:text-white flex items-center gap-1">
                          ⚡ ระบบ Tracking Pixels Pass
                        </span>
                        {tier.canAutoPixel ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">🟢 ปลดล็อกแล้ว</span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">🔒 ล็อคอยู่</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        ฝัง Facebook, TikTok, Google, LINE Tracking Tag เพื่อวัดผล Conversion ยิงแอด
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmRedeemModal({
                          isOpen: true,
                          title: 'ปลดล็อกระบบ Tracking Pixels (30 วัน)',
                          desc: 'ใช้ 100 แต้ม เพื่อปลดล็อกระบบฝัง Pixel ยิงแอด 30 วัน',
                          cost: 100,
                          onConfirm: handleUnlockPixels
                        })
                      }}
                      disabled={(profile.points || 0) < 100}
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      ⚡ แลก 100 แต้ม (30 วัน)
                    </button>
                  </div>

                  {/* 5. EXTRA LANDING PAGE SLOTS */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1E1B4B] dark:text-white flex items-center gap-1">
                          🚀 โควตาหน้าเซลเพจยิงแอดเพิ่ม (+1 URL อายุ 30 วัน)
                        </span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold font-mono">
                          โควตาเพิ่ม: +{profile.extra_landing_page_slots || 0} ช่อง
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        ปลดล็อกเพิ่มจำนวนหน้าเซลเพจสำหรับยิงแอดแยกตามสินค้าได้หลายหน้าพร้อมกัน (ใช้แต้ม 350 แต้ม)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmRedeemModal({
                          isOpen: true,
                          title: 'ปลดล็อกช่องเซลเพจยิงแอดเพิ่ม (+1 URL อายุ 30 วัน)',
                          desc: 'ใช้ 350 แต้ม เพื่อเพิ่มโควตาสร้างหน้าเซลเพจเพิ่มอีก 1 URL',
                          cost: 350,
                          onConfirm: handleUnlockLandingPageSlot
                        })
                      }}
                      disabled={(profile.points || 0) < 350}
                      className="px-4 py-2 bg-[#34D399] hover:bg-[#10B981] text-slate-950 font-black rounded-xl text-xs transition active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      🚀 ปลดล็อก 350 แต้ม (+1 URL)
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseAccountModal}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs transition font-bold cursor-pointer"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Admin Contact Modal */}
      {adminContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="font-extrabold text-[#1E1B4B] dark:text-white text-base">ติดต่อฝ่ายดูแลระบบ</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">เพื่อขอเติมแต้ม หรือปลดล็อกฟังก์ชันพิเศษ</p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-700 dark:text-slate-300 text-left space-y-2">
              <p>🟢 <strong>LINE:</strong> @amth หรือ @linktreethai</p>
              <p>✉️ <strong>Email:</strong> support@linktreethai.com</p>
              <p>💬 <strong>Facebook:</strong> LinkTreeThai Support</p>
            </div>

            <div className="flex gap-2">
              <a
                href="https://line.me/ti/p/@amth"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-[#34D399] hover:bg-[#10B981] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition shadow"
              >
                ทัก LINE ทันที
              </a>
              <button
                onClick={() => setAdminContactModal(false)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Points Modal (PromptPay QR) */}
      <TopUpPointsModal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        profile={profile}
      />

      {/* Pixel Health Monitor & Live Analytics Modal */}
      <PixelAnalyticsModal
        isOpen={pixelAnalyticsOpen}
        onClose={() => setPixelAnalyticsOpen(false)}
        profile={profile}
        landingPages={landingPages}
      />

      
      
      {/* USER LANDING PAGE EXPIRATION DETAILS MODAL */}
      {lpExpiryDetailModal && (() => {
        const createdTime = lpExpiryDetailModal.created_at ? new Date(lpExpiryDetailModal.created_at).getTime() : Date.now()
        const expiryTime = lpExpiryDetailModal.expires_at ? new Date(lpExpiryDetailModal.expires_at).getTime() : (createdTime + 30 * 24 * 60 * 60 * 1000)
        const diffMs = expiryTime - Date.now()
        const isExpired = diffMs <= 0
        const daysLeft = isExpired ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const hoursLeft = isExpired ? 0 : Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const expiryDateStr = new Date(expiryTime).toLocaleDateString('th-TH')
        const createdDateStr = new Date(createdTime).toLocaleDateString('th-TH')
        const fullUrl = `${originUrl}/p/${lpExpiryDetailModal.slug}`

        const remainingStr = isExpired
          ? '🔴 หมดอายุแล้ว (หน้าเว็บถูกล็อค)'
          : daysLeft > 0
            ? `🟢 เหลืออีก ${daysLeft} วัน${hoursLeft > 0 ? ` ${hoursLeft} ชั่วโมง` : ''}`
            : `🟢 เหลืออีก ${hoursLeft} ชั่วโมง`

        return (
          <div 
            onClick={() => setLpExpiryDetailModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-pointer animate-in fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border-2 border-purple-500/50 rounded-[32px] p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto no-scrollbar relative text-[#1E1B4B] dark:text-white cursor-default"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">ข้อมูลวันหมดอายุเซลเพจ</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                      {lpExpiryDetailModal.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLpExpiryDetailModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Expiration Details Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5 text-xs font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-normal">ลิงก์ URL เซลเพจ:</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400">/p/{lpExpiryDetailModal.slug}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-normal">วันที่สร้างหน้า:</span>
                  <span className="font-mono">{createdDateStr}</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-2">
                  <span className="text-slate-500 dark:text-slate-400 font-normal">วันหมดอายุ (30 วัน):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 text-sm">
                    {expiryDateStr}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-normal">ระยะเวลาคงเหลือ:</span>
                  <span className="font-black">
                    {remainingStr}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl text-[11px] text-purple-900 dark:text-purple-200 leading-relaxed font-medium">
                💡 หน้าเซลเพจมีอายุการแสดงผล 30 วันนับจากวันที่สร้าง หากหมดอายุ หน้าเว็บจริงจะถูกล็อคชั่วคราว คุณสามารถใช้ <strong>350 แต้ม</strong> เพื่อต่ออายุการแสดงผลอีก 30 วันได้ทันที
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const targetLp = lpExpiryDetailModal
                    setLpExpiryDetailModal(null)
                    setConfirmRedeemModal({
                      isOpen: true,
                      title: `ต่ออายุเซลเพจ "${targetLp.title}" 30 วัน`,
                      desc: `ใช้ 350 แต้ม เพื่อต่ออายุหน้าเซลเพจนี้ให้แสดงผลบนเว็บจริงอีก 30 วัน`,
                      cost: 350,
                      onConfirm: () => handleRenewLandingPage(targetLp.id, targetLp.expires_at, targetLp.title)
                    })
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>ต่ออายุ 30 วันทันที (ใช้ 350 แต้ม)</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadQrCode(fullUrl, `qrcode_salepage_${lpExpiryDetailModal.slug}.png`)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลด QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLpExpiryDetailModal(null)
                      setTopUpModalOpen(true)
                    }}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>+ เติมแต้มสะสม</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* CONFIRMATION POPUP MODAL FOR SPENDING POINTS & PURCHASING VIP */}
      {confirmRedeemModal && confirmRedeemModal.isOpen && (
        <div 
          onClick={() => setConfirmRedeemModal(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-pointer animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border-2 border-purple-500/50 rounded-[32px] p-6 max-w-sm w-full shadow-2xl space-y-4 text-center text-[#1E1B4B] dark:text-white cursor-default"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-base">{confirmRedeemModal.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {confirmRedeemModal.desc}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-1.5 text-left font-bold">
              <div className="flex justify-between">
                <span className="text-slate-500 font-normal">แต้มที่ใช้แลก:</span>
                <span className="font-mono text-base font-black text-amber-600 dark:text-amber-400">🪙 {confirmRedeemModal.cost} แต้ม</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-normal">แต้มคงเหลือของคุณ:</span>
                <span className="font-mono">{profile.points || 0} แต้ม</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1">
                <span className="text-slate-500 font-normal">แต้มคงเหลือหลังแลก:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400 font-black">
                  {Math.max(0, (profile.points || 0) - confirmRedeemModal.cost)} แต้ม
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmRedeemModal(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  const cb = confirmRedeemModal.onConfirm
                  setConfirmRedeemModal(null)
                  if (cb) cb()
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-black rounded-xl text-xs transition shadow-md shadow-purple-500/20 active:scale-95 cursor-pointer"
              >
                ✓ ยืนยันการแลก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. EDIT LINK MODAL */}
      {/* ========================================================================= */}
      {isEditLinkOpen && editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base">แก้ไขข้อมูลลิ้งก์</h3>
              </div>
              <button onClick={() => { setIsEditLinkOpen(false); setEditingLink(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLink} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ชื่อหัวข้อปุ่ม (Title) *</label>
                <input
                  type="text"
                  required
                  value={editingLink.title || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">คำบรรยายย่อย (Subtitle - ถ้ามี)</label>
                <input
                  type="text"
                  value={editingLink.subtitle || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ปลายทาง URL ลิ้งก์ *</label>
                <input
                  type="url"
                  required
                  value={editingLink.url || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ไอคอนแบรนด์</label>
                <select
                  value={editingLink.icon || 'website'}
                  onChange={(e) => setEditingLink({ ...editingLink, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="website">🌐 Website ทั่วไป</option>
                  <option value="line">🟢 LINE Official</option>
                  <option value="shopee">🟠 Shopee Shop</option>
                  <option value="lazada">🔵 Lazada Shop</option>
                  <option value="facebook">🔵 Facebook</option>
                  <option value="tiktok">⚫ TikTok</option>
                  <option value="instagram">🟣 Instagram</option>
                  <option value="youtube">🔴 YouTube</option>
                  <option value="x">⚪ X (Twitter)</option>
                  <option value="email">🟡 Email</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">รูปภาพไอคอน/โลโก้บนปุ่ม (Logo / Thumbnail)</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {editingLink.logo_url ? (
                      <img src={editingLink.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <label className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-950 border border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>{uploading === 'editingLink' ? 'กำลังอัปโหลด...' : '📸 เลือกรูปภาพจากมือถือ'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'editingLink')}
                      className="hidden"
                    />
                  </label>

                  {editingLink.logo_url && (
                    <button
                      type="button"
                      onClick={() => setEditingLink({ ...editingLink, logo_url: '' })}
                      className="text-xs text-rose-500 hover:underline shrink-0"
                    >
                      ลบรูป
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">สีพื้นหลังปุ่ม</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingLink.bg_color || '#1E1B4B'}
                      onChange={(e) => setEditingLink({ ...editingLink, bg_color: e.target.value })}
                      className="w-8 h-8 rounded-lg border cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={editingLink.bg_color || '#1E1B4B'}
                      onChange={(e) => setEditingLink({ ...editingLink, bg_color: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">สีตัวอักษรปุ่ม</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingLink.text_color || '#FFFFFF'}
                      onChange={(e) => setEditingLink({ ...editingLink, text_color: e.target.value })}
                      className="w-8 h-8 rounded-lg border cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={editingLink.text_color || '#FFFFFF'}
                      onChange={(e) => setEditingLink({ ...editingLink, text_color: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>เปิดแสดงผลปุ่มนี้ในหน้า Bio Link</span>
                <input
                  type="checkbox"
                  checked={editingLink.is_active}
                  onChange={(e) => setEditingLink({ ...editingLink, is_active: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsEditLinkOpen(false); setEditingLink(null); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition shadow-md shadow-purple-500/20"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      {isEditProductOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base">แก้ไขข้อมูลสินค้า</h3>
              </div>
              <button onClick={() => { setIsEditProductOpen(false); setEditingProduct(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ชื่อสินค้า *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">รายละเอียดสินค้า (ถ้ามี)</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed"
                />
              </div>

              {/* Product Image Upload & Edit */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">รูปภาพสินค้า</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {editingProduct.image_url ? (
                      <img src={editingProduct.image_url} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="w-full py-2.5 px-4 bg-white dark:bg-slate-950 border border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>{uploading === 'editingProduct' ? 'กำลังอัปโหลด...' : '📸 เลือกเปลี่ยนรูปภาพจากมือถือ'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'editingProduct')}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="หรือใส่ Image URL เช่น https://..."
                        value={editingProduct.image_url || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px]"
                      />
                      {editingProduct.image_url && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image_url: '' })}
                          className="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-xl text-xs hover:bg-rose-100 transition shrink-0"
                        >
                          ลบรูป
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">ราคาขาย (฿) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">ป้ายกำกับ (Badge)</label>
                  <input
                    type="text"
                    placeholder="เช่น ขายดี, HOT, SALE"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ลิ้งก์สั่งซื้อ (Buy URL) *</label>
                <input
                  type="url"
                  required
                  value={editingProduct.buy_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, buy_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>เปิดแสดงสินค้าในหน้า Bio Link</span>
                <input
                  type="checkbox"
                  checked={editingProduct.is_active}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsEditProductOpen(false); setEditingProduct(null); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-md shadow-emerald-500/20"
                >
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EDIT SHORT LINK MODAL */}
      {/* ========================================================================= */}
      {isEditShortLinkOpen && editingShortLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base">แก้ไขลิงก์ย่อ</h3>
              </div>
              <button onClick={() => { setIsEditShortLinkOpen(false); setEditingShortLink(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateShortLink} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ชื่อกำกับลิงก์ (Title)</label>
                <input
                  type="text"
                  value={editingShortLink.title || ''}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ชื่อย่อ Slug (/s/your-slug) *</label>
                <input
                  type="text"
                  required
                  value={editingShortLink.slug || ''}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">URL ปลายทางจริง *</label>
                <input
                  type="url"
                  required
                  value={editingShortLink.original_url || ''}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, original_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>เปิดใช้งานการเปลี่ยนเส้นทาง</span>
                <input
                  type="checkbox"
                  checked={editingShortLink.is_active}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, is_active: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsEditShortLinkOpen(false); setEditingShortLink(null); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition shadow-md shadow-purple-500/20"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SHORT LINK CLICK ANALYTICS MODAL (short_link_analytics) */}
      {/* ========================================================================= */}
      {shortLinkAnalyticsModalOpen && selectedShortLinkForAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-base">สถิติคลิกย่อลิงก์: /s/{selectedShortLinkForAnalytics.slug}</h3>
                  <p className="text-[11px] text-slate-500">ยอดคลิกทั้งหมด: {selectedShortLinkForAnalytics.clicks || 0} ครั้ง</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleClearShortLinkAnalytics(selectedShortLinkForAnalytics.id)}
                  className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                >
                  ล้างสถิติ
                </button>
                <button onClick={() => setShortLinkAnalyticsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingShortLinkAnalytics ? (
              <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> กำลังโหลดข้อมูลสถิติ...
              </div>
            ) : shortLinkAnalyticsLogs.length === 0 ? (
              <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center text-xs text-slate-400 space-y-1">
                <BarChart3 className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold">ยังไม่มีสถิติคลิกบันทึกไว้สำหรับลิงก์นี้</p>
                <p className="text-[11px]">เมื่อมีผู้ใช้งานคลิกเปิดลิงก์ย่อ ระบบจะบันทึกแหล่งที่มา (Referrer) และเบราว์เซอร์ลงที่นี่</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">รายการคลิกล่าสุด ({shortLinkAnalyticsLogs.length})</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                  {shortLinkAnalyticsLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 font-mono">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1E1B4B] dark:text-white">🌐 {log.referrer || 'Direct / ไม่ระบุ'}</span>
                          {log.ip && <span className="text-[10px] text-slate-400">IP: {log.ip}</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate max-w-sm">{log.user_agent || 'Unknown Device'}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(log.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ADD MANUAL LEAD MODAL (leads) */}
      {/* ========================================================================= */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base">เพิ่มข้อมูลลูกค้า / ลีดด้วยตนเอง</h3>
              </div>
              <button onClick={() => setIsAddLeadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ชื่อลูกค้า (Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณสมชาย ใจดี"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">เบอร์โทรศัพท์ (Phone)</label>
                  <input
                    type="tel"
                    placeholder="0812345678"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">LINE ID</label>
                  <input
                    type="text"
                    placeholder="@lineid"
                    value={newLeadForm.line_id}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, line_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">อีเมล (Email)</label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">ยอดเงิน/มูลค่า (฿)</label>
                  <input
                    type="number"
                    placeholder="590"
                    value={newLeadForm.amount}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ที่อยู่จัดส่ง / ที่อยู่ติดต่อ</label>
                <textarea
                  rows={2}
                  placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                  value={newLeadForm.address}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">รหัสออเดอร์ (Order Code)</label>
                  <input
                    type="text"
                    placeholder="เช่น ORD-10293"
                    value={newLeadForm.order_code}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, order_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">สถานะเริ่มต้น</label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="pending">🟡 รอติดต่อ / รอดำเนินการ</option>
                    <option value="contacted">🔵 ติดต่อแล้ว</option>
                    <option value="completed">🟢 สำเร็จ / ปิดการขาย</option>
                    <option value="cancelled">🔴 ยกเลิก</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">บันทึก/หมายเหตุเพิ่มเติม (Note)</label>
                <textarea
                  rows={2}
                  placeholder="บันทึกความสนใจ รายการสินค้า หรือการนัดหมาย..."
                  value={newLeadForm.note}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition shadow-md shadow-purple-500/20"
                >
                  บันทึกลีดใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. EDIT LEAD MODAL (leads) */}
      {/* ========================================================================= */}
      {isEditLeadModalOpen && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base">แก้ไขข้อมูลลูกค้า: {editingLead.name}</h3>
              </div>
              <button onClick={() => { setIsEditLeadModalOpen(false); setEditingLead(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ชื่อลูกค้า *</label>
                <input
                  type="text"
                  required
                  value={editingLead.name || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={editingLead.phone || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">LINE ID</label>
                  <input
                    type="text"
                    value={editingLead.line_id || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, line_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">อีเมล</label>
                  <input
                    type="email"
                    value={editingLead.email || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">ยอดเงิน (฿)</label>
                  <input
                    type="number"
                    value={editingLead.amount || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">ที่อยู่จัดส่ง / ติดต่อ</label>
                <textarea
                  rows={2}
                  value={editingLead.address || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">รหัสออเดอร์</label>
                  <input
                    type="text"
                    value={editingLead.order_code || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, order_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">สถานะ</label>
                  <select
                    value={editingLead.status || 'pending'}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="pending">🟡 รอติดต่อ / รอดำเนินการ</option>
                    <option value="contacted">🔵 ติดต่อแล้ว</option>
                    <option value="completed">🟢 สำเร็จ / ปิดการขาย</option>
                    <option value="cancelled">🔴 ยกเลิก</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">บันทึก/หมายเหตุ</label>
                <textarea
                  rows={2}
                  value={editingLead.note || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsEditLeadModalOpen(false); setEditingLead(null); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition shadow-md shadow-purple-500/20"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. LEAD DETAILS MODAL (leads) */}
      {/* ========================================================================= */}
      {isLeadDetailsModalOpen && selectedLeadDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-base">รายละเอียดข้อมูลลูกค้า</h3>
                  <p className="text-[11px] text-slate-500">รหัสอ้างอิง #{selectedLeadDetails.order_code || selectedLeadDetails.id.slice(0,8)}</p>
                </div>
              </div>
              <button onClick={() => { setIsLeadDetailsModalOpen(false); setSelectedLeadDetails(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">{selectedLeadDetails.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedLeadDetails.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : selectedLeadDetails.status === 'contacted'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : selectedLeadDetails.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {selectedLeadDetails.status || 'pending'}
                  </span>
                </div>
                <p className="text-slate-500 font-mono text-[11px]">
                  📅 วันที่บันทึก: {new Date(selectedLeadDetails.created_at).toLocaleString('th-TH')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 block">📞 เบอร์โทรศัพท์</span>
                  <span className="font-mono font-bold">{selectedLeadDetails.phone || '-'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 block">💬 LINE ID</span>
                  <span className="font-mono font-bold">{selectedLeadDetails.line_id || '-'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 block">✉️ อีเมล</span>
                  <span className="font-mono font-bold truncate block">{selectedLeadDetails.email || '-'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 block">💰 ยอดเงิน/มูลค่า</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedLeadDetails.amount ? `฿${parseFloat(selectedLeadDetails.amount).toLocaleString()}` : '-'}
                  </span>
                </div>
              </div>

              {selectedLeadDetails.address && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block">📍 ที่อยู่จัดส่ง / ติดต่อ</span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedLeadDetails.address}</p>
                </div>
              )}

              {selectedLeadDetails.note && (
                <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 block">💬 บันทึก / รายการสั่งซื้อ</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedLeadDetails.note}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = selectedLeadDetails
                  setIsLeadDetailsModalOpen(false)
                  handleEditLead(target)
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs hover:bg-purple-700 transition"
              >
                ✏️ แก้ไขข้อมูลนี้
              </button>
              <button
                type="button"
                onClick={() => { setIsLeadDetailsModalOpen(false); setSelectedLeadDetails(null); }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. GENERAL EVENT LOGS MODAL (analytics_events) */}
      {/* ========================================================================= */}
      {analyticsEventsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-[#1E1B4B] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-base">บันทึกกิจกรรมและเหตุการณ์สถิติ (Analytics Events)</h3>
                  <p className="text-[11px] text-slate-500">บันทึกการคลิกลิ้งก์, เข้าชมโปรไฟล์, และ Interaction ทั่วไป</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAnalyticsEvents}
                  className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                >
                  ล้างบันทึก
                </button>
                <button onClick={() => setAnalyticsEventsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingAnalyticsEvents ? (
              <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> กำลังโหลดบันทึกกิจกรรม...
              </div>
            ) : analyticsEventsList.length === 0 ? (
              <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center text-xs text-slate-400 space-y-1">
                <Activity className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold">ยังไม่มีบันทึก Event Logs ในระบบ</p>
                <p className="text-[11px]">เมื่อผู้เยี่ยมชมคลิกลิ้งก์หรือทำกิจกรรมในหน้า Bio Link ข้อมูลจะถูกบันทึกลงตาราง analytics_events อัตโนมัติ</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                {analyticsEventsList.map((ev) => (
                  <div key={ev.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 font-mono">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                          {ev.event_type}
                        </span>
                        {ev.target_id && <span className="text-[11px] text-slate-600 dark:text-slate-300">Target: {ev.target_id}</span>}
                      </div>
                      {ev.referrer && <p className="text-[10px] text-slate-400">Referrer: {ev.referrer}</p>}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(ev.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Slip Lightbox */}
      {zoomSlipUrl && (
        <div 
          onClick={() => setZoomSlipUrl(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-lg max-h-[85vh] p-2" onClick={(e) => e.stopPropagation()}>
            <img src={zoomSlipUrl} alt="Slip Zoom" className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain" />
            <button
              onClick={() => setZoomSlipUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center border border-white/20 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}