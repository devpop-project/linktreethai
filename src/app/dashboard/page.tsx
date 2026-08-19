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
import { 
  Link2, ShoppingBag, Palette, ExternalLink, Activity, Rocket, Plus, Trash2, 
  Save, LogOut, Check, Eye, Upload, Image as ImageIcon, Sparkles, Globe, Youtube, RefreshCw, Share2, LayoutTemplate, Crown, Coins, Lock, AlertCircle, Users, Download, ShieldCheck, Zap, QrCode, X, MessageCircle, Scissors, Copy, Smartphone, Menu, ChevronRight, CheckCircle2, ArrowUpRight, Clock, KeyRound, Edit2, Camera, Sun, Moon
} from 'lucide-react'

export interface LandingPageFormData {
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

export const DEFAULT_LANDING_PAGE_FORM: LandingPageFormData = {
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
  features_text: '✓ ส่งฟรีทั่วไทย (จัดส่งด่วน 1-2 วัน)\n✓ มีบริการเก็บเงินปลายทาง (COD)\n✓ รับประกันของแท้ 100% ตรงจากผู้ผลิต\n✓ มีทีมงานผู้เชี่ยวชาญให้คำแนะนำตลอด 24 ชม.',
  body_content: '',
  theme_color: '#EF4444',
  bg_color: '#0B0F17',
  bg_image_url: '',
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
    youtube_url: '',
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
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrTargetUrl, setQrTargetUrl] = useState('')
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [unlockingShortener, setUnlockingShortener] = useState(false)
  const [adminContactModal, setAdminContactModal] = useState(false)
  const [pointsDetailModalOpen, setPointsDetailModalOpen] = useState(false)
  const [redeemingTier, setRedeemingTier] = useState<string | null>(null)

  // Form States
  const [newLink, setNewLink] = useState({ 
    title: '', 
    subtitle: '', 
    url: '', 
    icon: 'website', 
    logo_url: '',
    bg_color: '#1E1B4B',
    text_color: '#FFFFFF'
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
  const handleSaveProfile = async () => {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        cover_url: profile.cover_url,
        bg_image_url: profile.bg_image_url,
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

  const handleToggleLinkActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('links').update({ is_active: !currentStatus }).eq('id', id)
    if (!error) {
      setLinks(links.map(l => l.id === id ? { ...l, is_active: !currentStatus } : l))
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

  const isMasterUser = profile.role === 'admin' || (profile.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now())
  const baseLandingSlots = isMasterUser ? 1 : 0
  const totalLandingSlots = profile.role === 'admin' ? 9999 : (baseLandingSlots + (profile.extra_landing_page_slots || 0))
  const isLandingQuotaFull = profile.role !== 'admin' && landingPages.length >= totalLandingSlots

  const handleUnlockLandingPageSlot = async () => {
    if (!user) return
    if ((profile.points || 0) < 350) {
      showToast(`❌ แต้มสะสมไม่เพียงพอ (ต้องการ 350 แต้ม แต่คุณมี ${profile.points || 0} แต้ม)`)
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

    if (isLandingQuotaFull) {
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

    const featuresArray = newLandingPage.features_text
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    const { data, error } = await supabase
      .from('landing_pages')
      .insert([{
        user_id: user.id,
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
        countdown_minutes: parseInt(String(newLandingPage.countdown_minutes), 10) || 15,
        features: featuresArray,
        gallery_images: newLandingPage.gallery_images_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
        review_images: newLandingPage.review_images_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
        pain_headline: newLandingPage.pain_headline.trim() || 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?',
        pain_points: newLandingPage.pain_points_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
        benefits_headline: newLandingPage.benefits_headline.trim() || 'ทางออกและผลลัพธ์ที่คุณจะได้รับ',
        benefits: newLandingPage.benefits_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
        testimonials: newLandingPage.testimonials_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
        faqs: newLandingPage.faqs_text.split('\n').map(s => s.trim()).filter(s => s.length > 0),
        guarantee_text: newLandingPage.guarantee_text.trim() || null,
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
      }])
      .select()

    if (!error && data) {
      setLandingPages([data[0], ...landingPages])
      setNewLandingPage({
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
        cta_text: 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
        cta_url: '',
        countdown_minutes: 15,
        features_text: '✓ ส่งฟรีทั่วไทย (จัดส่งด่วน 1-2 วัน)\n✓ มีบริการเก็บเงินปลายทาง (COD)\n✓ รับประกันของแท้ 100% ตรงจากผู้ผลิต\n✓ มีทีมงานผู้เชี่ยวชาญให้คำแนะนำตลอด 24 ชม.',
        body_content: '',
        theme_color: '#EF4444',
        fb_pixel_id: '',
        tiktok_pixel_id: '',
        google_pixel_id: '',
        line_tag_id: ''
      })
      showToast('🚀 สร้างเซลเพจสำเร็จ: /p/' + slug)
    } else if (error) {
      showToast('❌ ข้อผิดพลาด: ชื่อ URL ซ้ำ หรือไม่ถูกต้อง (' + error.message + ')')
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
    const cost = tierType === 'master' ? 250 : 100
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
    } else {
      setProfile((prev: any) => ({ ...prev, [targetField]: publicUrl }))
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
    const rows = leads.map(l => [
      new Date(l.created_at).toLocaleString('th-TH'),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.note || '').replace(/"/g, '""')}"`
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `leads_${profile.username}_${Date.now()}.csv`)
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
              onClick={() => setPointsDetailModalOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 active:scale-95 transition cursor-pointer shadow-sm"
              title="คลิกเพื่อดูสถานะ ตำแหน่ง วันหมดอายุ และสิทธิ์การใช้งาน"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>{profile.points || 0}</span>
              <span className="text-[9px] bg-amber-200/60 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 px-1 py-0.2 rounded font-bold">แต้ม</span>
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
                { id: 'landing_pages', label: 'เซลเพจยิงแอด', icon: Rocket, count: landingPages.length, badge: isMasterUser ? '1 ฟรี' : '350 แต้ม' },
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
                      <label className="block text-xs font-bold text-[#1E1B4B] dark:text-slate-200 mb-1.5">รูปภาพตัวอย่าง (Thumbnail Image)</label>
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
                          <span>{uploading === 'newLink' ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'newLink')}
                            className="hidden"
                          />
                        </label>
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

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
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
                      <label className="w-full py-8 px-4 bg-purple-50/50 dark:bg-slate-950 border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 rounded-3xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xs text-[#1E1B4B] dark:text-white">
                          {uploading === 'newProduct' ? 'กำลังอัปโหลด...' : newProduct.image_url ? 'เปลี่ยนรูปภาพสินค้า' : 'แตะเพื่อเลือกรูปภาพ'}
                        </span>
                        <span className="text-[11px] text-slate-500">หรือใส่ Image URL ด้านล่าง</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'newProduct')}
                          className="hidden"
                        />
                      </label>
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
                            <a
                              href={prod.buy_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>ทดสอบลิงก์</span> <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
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

                                {/* Templates Selector in Clean White Tiles */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">เลือกธีมและรูปแบบเทมเพลต</h3>
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
                            if (!isLocked) {
                              setProfile({ ...profile, template_id: t.id })
                            }
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-24 ${
                            isSelected 
                              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-300 dark:ring-purple-700 text-purple-900 dark:text-purple-200 font-bold'
                              : isLocked
                              ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-purple-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{t.name}</span>
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            ) : isSelected ? (
                              <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            ) : null}
                          </div>
                          <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full w-fit ${
                            t.tier === 'master' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : t.tier === 'pro' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {t.tier}
                          </span>
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
                        onClick={handleUnlockLandingPageSlot}
                        disabled={unlockingLandingSlot || (profile.points || 0) < 350}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition shadow flex items-center gap-1 disabled:opacity-40"
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

                        {/* 3. Page Background Wallpaper Image (URL & Mobile Upload) */}
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
                      return (
                        <div
                          key={lp.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
                        >
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-[#1E1B4B] dark:text-white text-sm truncate">{lp.title}</h4>
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

                          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleStartEditLandingPage(lp)}
                              className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-black flex items-center gap-1 transition active:scale-95 shadow-sm"
                            >
                              <span>✏️ แก้ไขเซลเพจ</span>
                            </button>

                            <a
                              href={fullLandingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>ดูหน้าเว็บ</span>
                            </a>

                            <button
                              onClick={() => handleCopyLink(fullLandingUrl, lp.id)}
                              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                            >
                              {copiedLink === lp.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedLink === lp.id ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteLandingPage(lp.id)}
                              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                              title="ลบเซลเพจ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

              </div>
            )}

            {/* TAB 5: LEADS CRM */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">รายชื่อผู้ติดต่อ / ลูกค้าเป้าหมาย (Leads)</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">ข้อมูลจากผู้ที่กรอกแบบฟอร์มติดต่อในหน้าโปรไฟล์ของคุณ</p>
                    </div>
                    {leads.length > 0 && (
                      <button
                        onClick={handleExportLeadsCSV}
                        className="px-4 py-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 transition shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> Export CSV
                      </button>
                    )}
                  </div>

                  {leads.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                      ยังไม่มีรายชื่อติดต่อเข้ามา เมื่อมีผู้กรอกแบบฟอร์มในหน้า Bio Link ข้อมูลจะปรากฏที่นี่ทันที 📋
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#1E1B4B] dark:text-white">{lead.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(lead.created_at).toLocaleDateString('th-TH')}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap gap-x-3 gap-y-1 mt-1 font-mono">
                              {lead.phone && <span>📞 {lead.phone}</span>}
                              {lead.email && <span>✉️ {lead.email}</span>}
                            </div>
                            {lead.note && (
                              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                                💬 {lead.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: BILLING & PACKAGES */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
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
                        <div className="text-2xl font-black text-[#1E1B4B] dark:text-white">100 แต้ม <span className="text-xs font-normal text-slate-500">/ 30 วัน</span></div>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                          <li>✓ เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                          <li>✓ สูงสุด 10 สินค้า</li>
                          <li>✓ 6 เทมเพลตยอดนิยม</li>
                          <li>✓ ซ่อนลายน้ำแบรนด์ได้</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleRedeemTierWithPoints('pro')}
                        disabled={redeemingTier === 'pro' || (profile.points || 0) < 100}
                        className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition disabled:opacity-40 shadow"
                      >
                        {redeemingTier === 'pro' ? 'กำลังแลก...' : '💎 แลก 100 แต้ม (30 วัน)'}
                      </button>
                    </div>

                    <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-5 rounded-3xl space-y-3 flex flex-col justify-between shadow-sm">
                      <div className="space-y-3">
                        <div className="text-[9px] font-extrabold bg-amber-500 text-white px-2.5 py-0.5 rounded-full w-fit">
                          ULTIMATE
                        </div>
                        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">MASTER VIP</h4>
                        <div className="text-2xl font-black text-[#1E1B4B] dark:text-white">250 แต้ม <span className="text-xs font-normal text-slate-500">/ 30 วัน</span></div>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                          <li>✓ เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                          <li>✓ สินค้าไม่จำกัด (50+)</li>
                          <li>✓ ครบทั้ง 9 เทมเพลต</li>
                          <li>✓ ฟรี! เซลเพจยิงแอด 1 URL (+ปลดล็อกเพิ่ม 350 แต้ม)</li>
                          <li>✓ ปลดล็อกระบบย่อลิงก์สั้นฟรี</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleRedeemTierWithPoints('master')}
                        disabled={redeemingTier === 'master' || (profile.points || 0) < 250}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition disabled:opacity-40 shadow"
                      >
                        {redeemingTier === 'master' ? 'กำลังแลก...' : '👑 แลก 250 แต้ม (30 วัน)'}
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

              <div className="w-full bg-[#0b0f17] rounded-[38px] overflow-y-auto max-h-[580px] no-scrollbar relative">
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
            { id: 'landing_pages', label: 'เซลเพจ', icon: Rocket },
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

          <div className="flex-1 overflow-y-auto p-4 bg-[#0B0F17]">
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
      {pointsDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto no-scrollbar relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-inner font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">ข้อมูลสถานะบัญชี & แต้มสะสม</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">@{profile.username}</p>
                </div>
              </div>
              <button
                onClick={() => setPointsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#1E1B4B] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile & Role Summary Card */}
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

            {/* Points Balance Highlight */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Coins className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs text-amber-900/80 dark:text-amber-200 font-bold">แต้มคงเหลือปัจจุบัน</span>
                  <p className="text-2xl font-black text-amber-800 dark:text-amber-300 font-mono leading-none mt-0.5">
                    {profile.points || 0} <span className="text-xs font-normal text-amber-700 dark:text-amber-400">แต้ม</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPointsDetailModalOpen(false)
                  setAdminContactModal(true)
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition shadow"
              >
                + เติมแต้ม
              </button>
            </div>

            {/* Expiration Dates & Remaining Days */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#1E1B4B] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> วันหมดอายุและระยะเวลาที่เหลือ
              </h4>

              <div className="space-y-2 text-xs">
                {/* VIP Plan Expiration */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">สถานะ VIP สมาชิก:</span>
                  <span className="font-bold text-[#1E1B4B] dark:text-white">
                    {profile.role === 'admin' ? (
                      <span className="text-purple-700 dark:text-purple-400 font-bold">🛡️ สิทธิ์ถาวร (Admin)</span>
                    ) : tier.tier === 'master' && profile.master_expires_at ? (
                      <span className="text-amber-800 dark:text-amber-300 font-mono">
                        ถึง {new Date(profile.master_expires_at).toLocaleDateString('th-TH')} ({Math.max(0, Math.ceil((new Date(profile.master_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} วัน)
                      </span>
                    ) : tier.tier === 'pro' && profile.pro_expires_at ? (
                      <span className="text-purple-800 dark:text-purple-300 font-mono">
                        ถึง {new Date(profile.pro_expires_at).toLocaleDateString('th-TH')} ({Math.max(0, Math.ceil((new Date(profile.pro_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} วัน)
                      </span>
                    ) : (
                      <span className="text-slate-500">Free Plan (ตลอดชีพ)</span>
                    )}
                  </span>
                </div>

                {/* URL Shortener Pass Expiration */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">สถานะระบบย่อลิงก์:</span>
                  <span className="font-bold">
                    {profile.role === 'admin' ? (
                      <span className="text-purple-700 dark:text-purple-400 font-bold">🛡️ ไม่จำกัด (Admin)</span>
                    ) : (profile.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now()) ? (
                      <span className="text-amber-800 dark:text-amber-300 font-bold">👑 รวมใน Master VIP</span>
                    ) : isShortenerActive && profile.shortener_expires_at ? (
                      <span className="text-purple-700 dark:text-purple-400 font-mono">
                        ถึง {new Date(profile.shortener_expires_at).toLocaleDateString('th-TH')} ({shortenerDaysRemaining} วัน)
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">🔒 ยังไม่ปลดล็อก</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Permissions & Quotas */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#1E1B4B] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> สิทธิ์และโควตาระบบที่ใช้งานได้
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">โควตาปุ่มลิ้งก์</span>
                  <p className="font-bold text-[#1E1B4B] dark:text-white font-mono">{links.length}/{tier.maxLinks >= 999 ? 'ไม่จำกัด' : tier.maxLinks} ลิ้งก์</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">โควตาสินค้าในร้าน</span>
                  <p className="font-bold text-[#1E1B4B] dark:text-white font-mono">{products.length}/{tier.maxProducts >= 999 ? 'ไม่จำกัด' : tier.maxProducts} รายการ</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">เซลเพจยิงแอด</span>
                  <p className="font-bold text-[#1E1B4B] dark:text-white font-mono">
                    {profile.role === 'admin' ? '🛡️ ไม่จำกัด (Admin)' : `${landingPages.length}/${totalLandingSlots} URL`}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Tracking Pixels</span>
                  <p className="font-bold text-[#1E1B4B] dark:text-white font-mono">
                    {profile.fb_pixel_id || profile.tiktok_pixel_id || profile.google_pixel_id ? '✅ ฝังเรียบร้อย' : '⚪ ยังไม่กรอก'}
                  </p>
                </div>
              </div>
            </div>

            {/* Fast Actions / Spend Points */}
            <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-[#1E1B4B] dark:text-white mb-2">แลกแต้มเพื่อปลดล็อกฟังก์ชัน:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleUnlockShortener}
                  disabled={unlockingShortener || (profile.points || 0) < 100}
                  className="p-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 rounded-2xl text-xs font-bold flex items-center justify-between transition disabled:opacity-40"
                >
                  <span>✂️ ปลดล็อกย่อลิงก์ 30 วัน</span>
                  <span className="font-mono text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-0.5 rounded font-bold">100 แต้ม</span>
                </button>

                <button
                  onClick={() => handleRedeemTierWithPoints('pro')}
                  disabled={redeemingTier === 'pro' || (profile.points || 0) < 100}
                  className="p-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 rounded-2xl text-xs font-bold flex items-center justify-between transition disabled:opacity-40"
                >
                  <span>💎 แลก PRO VIP 30 วัน</span>
                  <span className="font-mono text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-0.5 rounded font-bold">100 แต้ม</span>
                </button>
              </div>

              <button
                onClick={() => handleRedeemTierWithPoints('master')}
                disabled={redeemingTier === 'master' || (profile.points || 0) < 250}
                className="w-full p-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-2xl text-xs font-bold flex items-center justify-between transition disabled:opacity-40"
              >
                <span>👑 แลก MASTER VIP 30 วัน (ปลดล็อกทุกอย่าง)</span>
                <span className="font-mono text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded font-bold">250 แต้ม</span>
              </button>
            </div>

            <button
              onClick={() => setPointsDetailModalOpen(false)}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs transition"
            >
              ปิดหน้าต่าง
            </button>
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

      {/* Pixel Health Monitor & Live Analytics Modal */}
      <PixelAnalyticsModal
        isOpen={pixelAnalyticsOpen}
        onClose={() => setPixelAnalyticsOpen(false)}
        profile={profile}
        landingPages={landingPages}
      />
    </div>
  )
}
