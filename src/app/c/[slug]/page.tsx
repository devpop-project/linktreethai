'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TrackingPixels from '@/components/TrackingPixels'
import { getPromptPayQRImageUrl } from '@/lib/promptpay'
import SalepageSectionRenderer, { PageSection } from '@/components/salepage/SalepageSectionRenderer'
import {
  Check,
  RefreshCw,
  ShoppingBag,
  Clock,
  Flame,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  Phone,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Layers
} from 'lucide-react'

export default function CustomSalepagePublicRoute() {
  const params = useParams()
  const router = useRouter()
  const slug = ((params?.slug || params?.sub) as string) || ''

  const [pageData, setPageData] = useState<any>(null)
  const [ownerProfile, setOwnerProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(1)
  const [quantity, setQuantity] = useState<number>(1)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeGalleryImg, setActiveGalleryImg] = useState<string>('')

  // Quick Order & Slip Upload State
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
  const [localSlipPreview, setLocalSlipPreview] = useState<string | null>(null)
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (slug) {
      loadLandingPage()
    }
  }, [slug])

  const loadLandingPage = async () => {
    setLoading(true)

    // 1. Fetch Landing Page by slug
    const { data: page, error } = await supabase
      .from('landing_pages')
      .select('*, profiles(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (page) {
      setPageData(page)
      setOwnerProfile(page.profiles)

      // Count views
      try {
        await supabase.rpc('increment_landing_page_views', { page_id: page.id })
      } catch (e) {}

      // Update Document Title and Favicon
      if (typeof document !== 'undefined') {
        const pageTitle = page.seo_title || page.headline || page.title || 'โปรโมชั่นพิเศษ'
        document.title = pageTitle

        const spIcon = page.og_image_url || page.hero_image_url || page.profiles?.avatar_url
        if (spIcon) {
          let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement
          if (!iconLink) {
            iconLink = document.createElement('link')
            iconLink.rel = 'icon'
            document.head.appendChild(iconLink)
          }
          iconLink.href = spIcon
        }
      }
    }

    setLoading(false)
  }

  // Handle direct slip file upload to Supabase storage
  const handleDirectSlipFile = async (file: File) => {
    if (!file) return
    setUploadingSlip(true)
    const localUrl = URL.createObjectURL(file)
    setLocalSlipPreview(localUrl)
    try {
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `slips/slip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `slips/${fileName}`
      
      const { data, error } = await supabase.storage.from('media').upload(filePath, file, { upsert: true })
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
        setOrderForm(prev => ({ ...prev, slip_url: publicUrl }))
      } else {
        const { data: d2, error: e2 } = await supabase.storage.from('linktree-assets').upload(fileName, file, { upsert: true })
        if (!e2 && d2) {
          const { data: { publicUrl: p2 } } = supabase.storage.from('linktree-assets').getPublicUrl(fileName)
          setOrderForm(prev => ({ ...prev, slip_url: p2 }))
        } else {
          setOrderForm(prev => ({ ...prev, slip_url: localUrl }))
        }
      }
    } catch (err) {
      setOrderForm(prev => ({ ...prev, slip_url: localUrl }))
    } finally {
      setUploadingSlip(false)
    }
  }

  // Handle Order Submission
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      alert('กรุณากรอกชื่อ, เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน')
      return
    }

    if (orderForm.payment_method === 'promptpay' && !orderForm.slip_url) {
      if (!confirm('คุณยังไม่ได้แนบสลิปโอนเงิน ต้องการดำเนินการต่อหรือไม่?')) {
        return
      }
    }

    setOrdering(true)

    // Calculate total
    let activePrice = pageData?.offer_price || 490
    const pricingSec = (pageData?.features || []).find((s: any) => s.type === 'pricing')
    if (pricingSec?.layoutStyle === '3_tier_comparison_cards' && pricingSec.data?.tiers && pricingSec.data.tiers[selectedTierIndex]) {
      activePrice = pricingSec.data.tiers[selectedTierIndex].price || activePrice
    }
    const currentTotal = activePrice * Math.max(1, quantity)

    try {
      const payload = {
        salepage_id: pageData.id,
        user_id: pageData.user_id,
        customer_name: orderForm.name,
        customer_phone: orderForm.phone,
        customer_line: orderForm.line_id || null,
        shipping_address: orderForm.address,
        order_note: orderForm.note || null,
        payment_method: orderForm.payment_method,
        package_name: pricingSec?.data?.tiers?.[selectedTierIndex]?.name || `${pageData.headline || pageData.title} (${quantity} ชิ้น)`,
        amount: currentTotal,
        quantity: quantity,
        slip_url: orderForm.slip_url || null,
        source_url: typeof window !== 'undefined' ? window.location.href : null
      }

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrderSuccess(true)
      } else {
        // Fallback direct insert if API returns error
        await supabase.from('leads').insert([payload])
        setOrderSuccess(true)
      }
    } catch (err) {
      setOrderSuccess(true)
    } finally {
      setOrdering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-purple-500" />
          <p className="text-xs font-bold tracking-wider text-slate-400">กำลังโหลดหน้าเซลเพจ...</p>
        </div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl">
          <h2 className="text-xl font-black">ไม่พบหน้าเซลเพจนี้</h2>
          <p className="text-xs text-slate-400">เซลเพจอาจถูกปิดใช้งาน หรือลิงก์ URL ไม่ถูกต้อง</p>
          <Link href="/" className="inline-block px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-xs font-bold transition">
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    )
  }

  // Generate or Extract 13 Modular Sections
  const rawFeatures = pageData.features
  const isModularFeatures = Array.isArray(rawFeatures) && rawFeatures.length > 0 && typeof rawFeatures[0] === 'object' && rawFeatures[0] !== null && (rawFeatures[0].type || rawFeatures[0].id)

  const default13Sections: PageSection[] = isModularFeatures
    ? (rawFeatures as PageSection[])
    : [
        {
          id: 'sec-navbar',
          type: 'navbar',
          title: 'แถบนำทางส่วนหัว',
          visible: true,
          layoutStyle: 'sticky_glassmorphic_dock',
          customBgColor: '',
          data: {
            brand_name: pageData.title || 'Amanita Thailand',
            logo_url: pageData.profiles?.avatar_url || pageData.og_image_url || pageData.hero_image_url || '',
            cta_text: pageData.sticky_btn1_text || 'สั่งซื้อโปรโมชั่นด่วน',
            cta_url: '#order-section'
          }
        },
        {
          id: 'sec-hero',
          type: 'hero',
          title: 'ฮีโร่แบนเนอร์สินค้า',
          visible: true,
          layoutStyle: 'scroll_float_animated',
          customBgColor: '',
          data: {
            badge: pageData.trust_badge_1 || 'เกรดพรีเมียม ดอกคัดพิเศษ',
            headline: pageData.headline || pageData.title || 'Amanita Muscaria สมุนไพรผ่อนคลาย หลับลึก',
            subheadline: pageData.subheadline || 'สารสกัดจากธรรมชาติบริสุทธิ์เพื่อความสงบและผ่อนคลายอย่างล้ำลึก',
            hero_image_url: pageData.hero_image_url || pageData.hero_media_url || '',
            image_url: pageData.hero_image_url || pageData.hero_media_url || '',
            video_url: pageData.video_url || '',
            cta_text: pageData.cta_text || 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
            cta_url: '#order-section'
          }
        },
        {
          id: 'sec-countdown',
          type: 'countdown',
          title: 'เวลานับถอยหลังจำกัดเวลา',
          visible: true,
          layoutStyle: 'floating_voucher_pill',
          customBgColor: '',
          data: {
            countdown_minutes: pageData.countdown_minutes || 15,
            discount_percent: Math.round((((pageData.original_price || 990) - (pageData.offer_price || 490)) / (pageData.original_price || 990)) * 100) || 50
          }
        },
        {
          id: 'sec-pain',
          type: 'pain_points',
          title: 'ปัญหาที่คุณกำลังเผชิญ',
          visible: true,
          layoutStyle: 'alert_warning_box',
          customBgColor: '',
          data: {
            headline: pageData.pain_headline || 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?',
            items: (pageData.pain_points && pageData.pain_points.length > 0)
              ? pageData.pain_points
              : [
                  'นอนหลับยาก หลับไม่สนิท ตื่นกลางดึกบ่อย',
                  'มีความเครียดสะสม สมองล้า อ่อนเพลียระหว่างวัน',
                  'ต้องการผ่อนคลายและเข้าสู่ภาวะ Lucid Dream อย่างเป็นธรรมชาติ'
                ]
          }
        },
        {
          id: 'sec-benefits',
          type: 'benefits',
          title: 'ผลลัพธ์และทางออกที่ได้รับ',
          visible: true,
          layoutStyle: 'timeline_steps',
          customBgColor: '',
          data: {
            headline: pageData.benefits_headline || 'ทางออกและผลลัพธ์ที่คุณจะได้รับ',
            items: (pageData.benefits && pageData.benefits.length > 0)
              ? pageData.benefits
              : [
                  'ช่วยให้สมองผ่อนคลาย คลายความกังวล หลับสนิทตลอดคืน',
                  'สนับสนุนการทำงานของสมองและ Microdosing อย่างปลอดภัย',
                  'คัดสรรดอกเห็ดหมวกแดง Amanita Muscaria แท้ 100% จากแหล่งธรรมชาติ'
                ]
          }
        },
        {
          id: 'sec-story',
          type: 'story',
          title: 'เรื่องราวและปรัชญาแบรนด์',
          visible: true,
          layoutStyle: 'quote_founder_card',
          customBgColor: '',
          data: {
            founder_quote: pageData.body_content || 'ตลอดประวัติศาสตร์หลายพันปีในสแกนดิเนเวีย ยุโรปตะวันออก และชนเผ่าโบราณในไซบีเรีย เห็ดหมวกแดง Amanita Muscaria มีประวัติศาสตร์ความเชื่อ ภูมิปัญญาพื้นบ้าน และตำนานการใช้งานแห่งจิตวิญญาณที่ถูกบอกเล่าต่อกันมาอย่างหลากหลาย',
            founder_name: pageData.profiles?.full_name || 'Enter The Amanita Thailand'
          }
        },
        {
          id: 'sec-gallery',
          type: 'gallery',
          title: 'อัลบั้มรูปภาพสินค้า',
          visible: true,
          layoutStyle: 'featured_hero_thumbnails',
          customBgColor: '',
          data: {
            images: (pageData.gallery_images && pageData.gallery_images.length > 0)
              ? pageData.gallery_images
              : [pageData.hero_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800']
          }
        },
        {
          id: 'sec-reviews',
          type: 'reviews',
          title: 'รีวิวและความประทับใจ',
          visible: true,
          layoutStyle: 'chat_bubble_screenshots',
          customBgColor: '',
          data: {
            testimonials: (pageData.testimonials && pageData.testimonials.length > 0)
              ? pageData.testimonials
              : [
                  { name: 'คุณกิตติศักดิ์', comment: 'ทานก่อนนอน ช่วยให้ผ่อนคลาย หลับลึกมาก ตื่นมาสดชื่น ไม่เพลีย', rating: 5 },
                  { name: 'คุณศิริพร', comment: 'กลิ่นหอมสมุนไพรอ่อนๆ ช่วยให้สงบและหลับสบายขึ้นเยอะเลยค่ะ', rating: 5 }
                ],
            review_images: pageData.review_images || []
          }
        },
        {
          id: 'sec-guarantee',
          type: 'guarantee',
          title: 'การรับประกันความพึงพอใจ',
          visible: true,
          layoutStyle: 'money_back_100',
          customBgColor: '',
          data: {
            guarantee_text: pageData.guarantee_text || 'รับประกันความพึงพอใจ ของแท้ 100% คัดสรรเกรดพรีเมียม ส่งตรงถึงมือคุณอย่างปลอดภัย',
            badges: [
              pageData.trust_badge_1 || 'ส่งฟรีด่วน',
              pageData.trust_badge_2 || 'ของแท้ 100%',
              pageData.trust_badge_3 || 'ชำระเงินปลอดภัย'
            ]
          }
        },
        {
          id: 'sec-pricing',
          type: 'pricing',
          title: 'เลือกแพ็กเกจสุดคุ้ม',
          visible: true,
          layoutStyle: '3_tier_comparison_cards',
          customBgColor: '',
          data: {
            original_price: pageData.original_price || 990,
            offer_price: pageData.offer_price || 490,
            tiers: (pageData.packages && pageData.packages.length > 0)
              ? pageData.packages
              : [
                  { name: 'ชุดทดลอง 1 ซอง', price: pageData.offer_price || 490, original_price: pageData.original_price || 990, desc: 'เหมาะสำหรับทดลองทาน', popular: false },
                  { name: 'ชุดสุดคุ้ม 2 ซอง (แถม 1)', price: (pageData.offer_price || 490) * 2, original_price: (pageData.original_price || 990) * 3, desc: 'ยอดนิยม! ทานต่อเนื่อง 1 เดือน', popular: true },
                  { name: 'ชุดครอบครัว 4 ซอง (แถม 2)', price: (pageData.offer_price || 490) * 4, original_price: (pageData.original_price || 990) * 6, desc: 'สุดคุ้ม ส่งฟรี EMS ด่วน', popular: false }
                ]
          }
        },
        {
          id: 'sec-checkout',
          type: 'checkout',
          title: 'แบบฟอร์มสั่งซื้อสินค้าด่วน',
          visible: true,
          layoutStyle: 'dynamic_promptpay_and_cod',
          customBgColor: '',
          data: {
            promptpay_number: pageData.promptpay_phone || pageData.profiles?.promptpay_phone || '0909964514',
            promptpay_name: pageData.promptpay_name || pageData.profiles?.promptpay_name || 'Amanita Thailand',
            bank_name: pageData.promptpay_bank || 'กสิกรไทย (KBank)',
            enable_cod: pageData.enable_cod_form !== false
          }
        },
        {
          id: 'sec-faq',
          type: 'faq',
          title: 'คำถามที่พบบ่อย (FAQ)',
          visible: true,
          layoutStyle: '2_column_faq_grid',
          customBgColor: '',
          data: {
            faqs: (pageData.faqs && pageData.faqs.length > 0)
              ? pageData.faqs
              : [
                  { q: 'วิธีรับประทานชาสมุนไพรทำอย่างไร?', a: 'ชงกับน้ำร้อน 200ml แช่ไว้ประมาณ 5-10 นาที ดื่มก่อนนอนประมาณ 30-45 นาที' },
                  { q: 'จัดส่งสินค้านานเท่าไหร่?', a: 'จัดส่งด่วน Flash Express / Kerry Express ได้รับสินค้าภายใน 1-2 วันทำการ' }
                ]
          }
        },
        {
          id: 'sec-sticky',
          type: 'sticky_cta',
          title: 'แถบสั่งซื้อด่วนด้านล่าง',
          visible: true,
          layoutStyle: 'floating_cta_duo',
          customBgColor: '',
          data: {
            order_text: pageData.sticky_btn1_text || 'สั่งซื้อโปรโมชั่นด่วน',
            line_text: pageData.sticky_btn2_text || 'แชทไลน์ สอบถาม',
            line_url: pageData.sticky_btn2_url || 'https://line.me/ti/p/@amth',
            call_text: pageData.sticky_btn3_text || 'โทรปรึกษา',
            call_phone: pageData.sticky_btn3_url || 'tel:0909964514'
          }
        }
      ]

  const sections: PageSection[] = default13Sections

  const themeColor = pageData.theme_color || '#8B5CF6'
  const bgColor = pageData.bg_color || '#0B0F17'
  const textColor = pageData.text_color || '#FFFFFF'
  const cardStyle = pageData.card_style || 'glass'

  // Pricing calculation
  const pricingSec = sections.find(s => s.type === 'pricing')
  const pricingData = pricingSec?.data || {}
  let activeUnitPrice = pricingData.offer_price ? parseFloat(pricingData.offer_price) : (pageData.offer_price || 490)
  if (pricingSec?.layoutStyle === '3_tier_comparison_cards' && pricingData.tiers && pricingData.tiers[selectedTierIndex]) {
    activeUnitPrice = pricingData.tiers[selectedTierIndex].price || activeUnitPrice
  }
  const total = activeUnitPrice * Math.max(1, quantity)

  // PromptPay QR Code
  const checkoutSec = sections.find(s => s.type === 'checkout')
  const promptPayNumber = checkoutSec?.data?.promptpay_number || pageData.promptpay_number || pageData.profiles?.promptpay_phone || '0909964514'
  const promptPayUrl = getPromptPayQRImageUrl(promptPayNumber, total)

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor
      }}
      className="min-h-screen relative overflow-x-hidden transition-colors duration-300"
    >
      {/* 1. Outer Full-Screen Wallpaper Backdrop */}
      {pageData.bg_image_url && (
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-all duration-300"
          style={{
            backgroundImage: `url(${pageData.bg_image_url})`,
            backgroundSize: pageData.bg_image_mode === 'contain' ? 'contain' : (pageData.bg_image_mode === 'repeat' ? 'auto' : 'cover'),
            backgroundPosition: 'center',
            backgroundRepeat: pageData.bg_image_mode === 'repeat' ? 'repeat' : 'no-repeat',
            opacity: (pageData.bg_image_opacity ?? 85) / 100,
            filter: pageData.bg_image_blur ? `blur(${pageData.bg_image_blur}px)` : undefined
          }}
        />
      )}

      {/* 2. Outer Ambient Dark Overlay */}
      {pageData.bg_image_url && (
        <div className="fixed inset-0 bg-black/60 pointer-events-none z-0" />
      )}

      {/* 3. Tracking Pixels */}
      <TrackingPixels
        fbPixelId={pageData.fb_pixel_id}
        tiktokPixelId={pageData.tiktok_pixel_id}
        googlePixelId={pageData.google_pixel_id}
        lineTagId={pageData.line_tag_id}
      />

      {/* 4. Main Salepage Content Container */}
      <main
        style={{
          backgroundColor: '#0B0F17'
        }}
        className="max-w-lg mx-auto min-h-screen relative z-10 sm:my-6 sm:rounded-[36px] overflow-hidden shadow-2xl transition-all duration-300"
      >
        {/* Inner Container Background Layer */}
        {(pageData.inner_bg_image_url || (!pageData.bg_image_url && pageData.bg_image_url)) && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `url(${pageData.inner_bg_image_url || pageData.bg_image_url})`,
              backgroundSize: (pageData.inner_bg_mode || pageData.bg_image_mode) === 'contain' ? 'contain' : ((pageData.inner_bg_mode || pageData.bg_image_mode) === 'repeat' ? 'auto' : 'cover'),
              backgroundPosition: 'center',
              backgroundRepeat: (pageData.inner_bg_mode || pageData.bg_image_mode) === 'repeat' ? 'repeat' : 'no-repeat',
              opacity: ((pageData.inner_bg_opacity ?? pageData.bg_image_opacity) || 85) / 100,
              filter: (pageData.inner_bg_blur ?? pageData.bg_image_blur) ? `blur(${pageData.inner_bg_blur ?? pageData.bg_image_blur}px)` : undefined
            }}
          />
        )}

        {/* Inner Container Atmospheric Dimmer */}
        {(pageData.inner_bg_image_url || pageData.bg_image_url) && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85 pointer-events-none z-0" />
        )}

        {/* Sections Stream (All except sticky_cta) */}
        <div className="p-3.5 sm:p-5 space-y-4 relative z-10 pb-28">
          {sections
            .filter(s => s.visible !== false && s.type !== 'sticky_cta')
            .map((sec) => (
              <SalepageSectionRenderer
                key={sec.id}
                section={sec}
                globalThemeColor={themeColor}
                globalBgColor={bgColor}
                globalTextColor={textColor}
                globalCardStyle={cardStyle}
                isInteractive={true}
                selectedTierIndex={selectedTierIndex}
                setSelectedTierIndex={setSelectedTierIndex}
                previewQty={quantity}
                setPreviewQty={setQuantity}
                previewPaymentMethod={orderForm.payment_method as any}
                setPreviewPaymentMethod={(pm) => setOrderForm(prev => ({ ...prev, payment_method: pm }))}
                previewFaqOpen={openFaq}
                setPreviewFaqOpen={setOpenFaq}
                previewActiveGalleryImg={activeGalleryImg}
                setPreviewActiveGalleryImg={setActiveGalleryImg}
                promptPayQRUrl={promptPayUrl}
                previewTotal={total}
                orderForm={orderForm}
                setOrderForm={setOrderForm}
                onOrderSubmit={handleOrderSubmit}
                uploadingSlip={uploadingSlip}
                onSlipUpload={handleDirectSlipFile}
                ordering={ordering}
                orderSuccess={orderSuccess}
                setOrderSuccess={setOrderSuccess}
              />
            ))}
        </div>
      </main>

      {/* 5. Persistent Fixed Floating Bottom Action Bar Dock for /c/[slug] */}
      {sections
        .filter(s => s.visible !== false && s.type === 'sticky_cta')
        .map((sec) => (
          <div key={sec.id} className="fixed bottom-0 inset-x-0 z-50 max-w-lg mx-auto p-2 sm:p-3 pointer-events-none">
            <div className="pointer-events-auto shadow-2xl">
              <SalepageSectionRenderer
                section={sec}
                globalThemeColor={themeColor}
                globalBgColor={bgColor}
                globalTextColor={textColor}
                globalCardStyle={cardStyle}
                isInteractive={true}
                selectedTierIndex={selectedTierIndex}
                setSelectedTierIndex={setSelectedTierIndex}
                previewQty={quantity}
                setPreviewQty={setQuantity}
                previewPaymentMethod={orderForm.payment_method as any}
                setPreviewPaymentMethod={(pm) => setOrderForm(prev => ({ ...prev, payment_method: pm }))}
                previewFaqOpen={openFaq}
                setPreviewFaqOpen={setOpenFaq}
                previewActiveGalleryImg={activeGalleryImg}
                setPreviewActiveGalleryImg={setActiveGalleryImg}
                promptPayQRUrl={promptPayUrl}
                previewTotal={total}
                orderForm={orderForm}
                setOrderForm={setOrderForm}
                onOrderSubmit={handleOrderSubmit}
                uploadingSlip={uploadingSlip}
                onSlipUpload={handleDirectSlipFile}
                ordering={ordering}
                orderSuccess={orderSuccess}
                setOrderSuccess={setOrderSuccess}
              />
            </div>
          </div>
        ))}

      {/* 6. Order Success Dialog */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2A] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                🎉 สั่งซื้อสินค้าเรียบร้อยแล้ว!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ทางร้านได้รับข้อมูลคำสั่งซื้อและกำลังเตรียมจัดส่งสินค้าให้คุณโดยเร็วที่สุด
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-400">ชื่อผู้รับ:</span><span className="font-bold">{orderForm.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">เบอร์โทรศัพท์:</span><span className="font-mono font-bold">{orderForm.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">วิธีชำระเงิน:</span><span className="font-bold text-emerald-600">{orderForm.payment_method === 'promptpay' ? '📱 โอนพร้อมเพย์ (แนบสลิป)' : '🚚 เก็บเงินปลายทาง (COD)'}</span></div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-bold"><span>ยอดรวมทั้งสิ้น:</span><span className="font-mono text-purple-600">฿{total.toLocaleString()} บาท</span></div>
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
    </div>
  )
}
