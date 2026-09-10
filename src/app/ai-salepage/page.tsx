'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SalepageSectionRenderer, { PageSection } from '@/components/salepage/SalepageSectionRenderer'
import { createClient } from '@/lib/supabase/client'
import {
  Wand2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  ShoppingBag,
  Layers,
  FileText,
  MessageCircle,
  Film,
  Zap,
  Tag,
  Star,
  CheckCircle2,
  ExternalLink,
  Flame,
  Crown,
  Eye,
  Send,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Palette,
  CheckCircle,
  Trash2,
  Sliders,
  Key,
  Rocket
} from 'lucide-react'

export default function AISalepageGeneratorPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // API Key State
  const [apiKey, setApiKey] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [isTestingKey, setIsTestingKey] = useState(false)
  const [keyStatus, setKeyStatus] = useState<string | null>(null)

  // Form Inputs
    const [productName, setProductName] = useState('Amanita Muscaria ชาสมุนไพรผ่อนคลาย หลับลึก')
  const [headline, setHeadline] = useState('')
  const [subheadline, setSubheadline] = useState('')
  const [painPoints, setPainPoints] = useState<string[]>([])
  const [benefits, setBenefits] = useState<string[]>([])
  const [brandStory, setBrandStory] = useState('')
  const [reviews, setReviews] = useState<any[]>([])
  const [chatReviews, setChatReviews] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [guaranteeText, setGuaranteeText] = useState('')
  const [trustBadges, setTrustBadges] = useState<string[]>([])
  const [tiers, setTiers] = useState<any[]>([])
  const [customSlug, setCustomSlug] = useState('enter-the-amanita-th-775')
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [category, setCategory] = useState('food')
  const [keyFeatures, setKeyFeatures] = useState('ขนมปังปิ้งเตาถ่านโบราณ หอมเนยแท้ 100%, ไส้เยิ้มทะลัก อบสดใหม่ทุกวัน, กรอบนอกนุ่มฉ่ำ อร่อยฟินทุกคำ')
  const [price, setPrice] = useState('25')
  const [originalPrice, setOriginalPrice] = useState('49')
  const [targetAudience, setTargetAudience] = useState('คนรักขนมปังและของหวานรสชาติเข้มข้น ทุกเพศทุกวัย')
  const [tone, setTone] = useState<'urgent' | 'luxury' | 'natural' | 'expert' | 'social'>('urgent')
  const [productImage, setProductImage] = useState('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80')
  const [imageBase64, setImageBase64] = useState<string>('')

  // AI Analyzed Palette & Mood State
  const [themeColor, setThemeColor] = useState('#F59E0B')
  const [bgColor, setBgColor] = useState('#0B0F17')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [cardStyle, setCardStyle] = useState<'glass' | 'dark' | 'clean' | 'neon' | 'gold' | 'pastel'>('glass')
  const [bgImage, setBgImage] = useState('')
  const [aiAnalyzedBadge, setAiAnalyzedBadge] = useState(false)

  // Upload & Vision Analysis States
  const [uploadingImage, setUploadingImage] = useState(false)
  const [analyzingImage, setAnalyzingImage] = useState(false)
  const [analyzingStep, setAnalyzingStep] = useState('')

  // Generation State
  const [generating, setGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState('')
  const [aiResult, setAiResult] = useState<any>(null)
  const [activeResultTab, setActiveResultTab] = useState<'preview' | 'copy' | 'breakdown'>('preview')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Interactive Preview State
  const [selectedTierIndex, setSelectedTierIndex] = useState(1)
  const [previewQty, setPreviewQty] = useState(1)
  const [previewPaymentMethod, setPreviewPaymentMethod] = useState<'promptpay' | 'cod'>('promptpay')
  const [previewFaqOpen, setPreviewFaqOpen] = useState<number | null>(0)
  const [previewActiveGalleryImg, setPreviewActiveGalleryImg] = useState('')

  // Load API Key from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_api_key') || sessionStorage.getItem('gemini_api_key') || ''
      if (savedKey) {
        setApiKey(savedKey)
        setKeySaved(true)
      }
    }
  }, [])

  // Save API Key
  const handleSaveApiKey = (keyVal: string) => {
    const k = keyVal.trim()
    setApiKey(k)
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', k)
      sessionStorage.setItem('gemini_api_key', k)
    }
    setKeySaved(true)
    setKeyStatus('✓ บันทึก API Key สำเร็จ')
    setTimeout(() => setKeyStatus(null), 3000)
  }

  // Test Gemini / OpenAI Key with Dynamic Model Discovery & Multi-Model Fallbacks
  const handleTestKey = async () => {
    const trimmedKey = apiKey.trim()
    if (!trimmedKey) {
      alert('กรุณากรอก Google Gemini API Key หรือ OpenAI API Key ก่อน')
      return
    }
    setIsTestingKey(true)
    setKeyStatus('🔍 กำลังเชื่อมต่อและตรวจสอบสิทธิ์ API Key กับเซิร์ฟเวอร์...')

    try {
      // 1. If OpenAI Key (sk-...)
      if (trimmedKey.startsWith('sk-')) {
        const openAiRes = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${trimmedKey}` }
        })
        if (openAiRes.ok) {
          setKeySaved(true)
          handleSaveApiKey(trimmedKey)
          setKeyStatus('✓ API Key ใช้งานได้สมบูรณ์ (เชื่อมต่อ OpenAI GPT-4o สำเร็จ)')
          return
        } else {
          const err = await openAiRes.json().catch(() => ({}))
          setKeyStatus(`❌ OpenAI Key ไม่ถูกต้อง: ${err.error?.message || 'โปรดตรวจสอบสิทธิ์ Key'}`)
          return
        }
      }

      // 2. Google Gemini: Step 1 - Dynamic Model Discovery via ModelService.ListModels
      let discoveredModel = ''
      try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${trimmedKey}`)
        if (listRes.ok) {
          const listData = await listRes.json()
          if (listData.models && Array.isArray(listData.models)) {
            // Find best available model supporting generateContent
            const supported = listData.models.filter((m: any) => 
              m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
            )
            const preferred = ['models/gemini-2.0-flash', 'models/gemini-1.5-flash', 'models/gemini-1.5-flash-latest', 'models/gemini-1.5-pro', 'models/gemini-1.5-flash-8b', 'models/gemini-pro']
            for (const p of preferred) {
              if (supported.some((s: any) => s.name === p)) {
                discoveredModel = p.replace('models/', '')
                break
              }
            }
            if (!discoveredModel && supported.length > 0) {
              discoveredModel = supported[0].name.replace('models/', '')
            }
          }
        }
      } catch (listErr) {
        console.warn('ListModels notice:', listErr)
      }

      // 3. Step 2 - Test Generation against Discovered Model or Candidate Matrix
      const candidateModels = discoveredModel 
        ? [discoveredModel, 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-flash-8b', 'gemini-pro']
        : ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-flash-8b', 'gemini-pro']

      let testSuccess = false
      let workingModelName = ''
      let lastErrorMessage = ''

      for (const modelName of candidateModels) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${trimmedKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Ping' }] }]
            })
          })

          if (res.ok) {
            testSuccess = true
            workingModelName = modelName
            break
          } else {
            const err = await res.json().catch(() => ({}))
            lastErrorMessage = err.error?.message || lastErrorMessage
          }
        } catch (e: any) {
          lastErrorMessage = e.message || lastErrorMessage
        }
      }

      if (testSuccess) {
        setKeySaved(true)
        handleSaveApiKey(trimmedKey)
        if (typeof window !== 'undefined') {
          localStorage.setItem('gemini_active_model', workingModelName)
        }
        setKeyStatus(`✓ API Key ใช้งานได้สมบูรณ์ (เชื่อมต่อ Google Gemini: ${workingModelName})`)
      } else {
        if (lastErrorMessage.includes('API_KEY_INVALID') || lastErrorMessage.includes('API key not valid')) {
          setKeyStatus('❌ API Key ไม่ถูกต้อง: โปรดคัดลอก Key ใหม่จาก Google AI Studio (aistudio.google.com)')
        } else if (lastErrorMessage.includes('PERMISSION_DENIED') || lastErrorMessage.includes('Generative Language API')) {
          setKeyStatus('❌ ติดสิทธิ์การเข้าถึง: โปรดตรวจสอบว่าเปิดใช้งาน Generative Language API ใน Google Cloud Console แล้ว')
        } else {
          setKeyStatus(`❌ ไม่สามารถเชื่อมต่อโมเดล: ${lastErrorMessage || 'โปรดตรวจสอบสิทธิ์ API Key หรือสร้าง Key ใหม่'}`)
        }
      }
    } catch (e: any) {
      setKeyStatus(`❌ ไม่สามารถเชื่อมต่อ API ได้: ${e.message}`)
    } finally {
      setIsTestingKey(false)
    }
  }

  // Handle Direct Product Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)

    // 1. Read Base64 immediately for AI Vision
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Data = reader.result as string
      setImageBase64(base64Data)
      setProductImage(base64Data)

      // 2. Upload to Supabase Storage in background
      try {
        const fileExt = file.name.split('.').pop() || 'jpg'
        const fileName = `products/prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data, error } = await supabase.storage.from('media').upload(filePath, file, { upsert: true })
        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
          setProductImage(publicUrl)
          await triggerAiVisionAnalysis(base64Data, publicUrl, file.name)
        } else {
          await triggerAiVisionAnalysis(base64Data, base64Data, file.name)
        }
      } catch (err) {
        await triggerAiVisionAnalysis(base64Data, base64Data, file.name)
      } finally {
        setUploadingImage(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // Trigger AI Vision Product Analysis
  const triggerAiVisionAnalysis = async (b64: string, publicUrl: string, fileName = '') => {
    setAnalyzingImage(true)
    setAnalyzingStep('📸 กำลังสแกนองค์ประกอบและข้อความในรูปภาพด้วย AI Vision...')

    try {
      setTimeout(() => setAnalyzingStep('🏷️ ถอดรหัสชื่อสินค้า จุดเด่น ราคา และกลุ่มลูกค้า...'), 800)
      setTimeout(() => setAnalyzingStep('🎨 คำนวณพาเล็ตต์สีและมู้ดแอนด์โทนที่เข้ากับรูปภาพ...'), 1600)

      const activeKey = apiKey || (typeof window !== 'undefined' ? (localStorage.getItem('gemini_api_key') || '') : '')

      const res = await fetch('/api/ai-analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: b64 || imageBase64,
          imageUrl: publicUrl || productImage,
          userApiKey: activeKey,
          productHint: productName
        })
      })

      const data = await res.json()
      if (data.success && data.analysis) {
        const a = data.analysis
        if (a.productName) {
          setProductName(a.productName)
          const autoSlug = a.productName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'product-' + Math.floor(100 + Math.random() * 900)
          setCustomSlug(autoSlug + '-' + Math.floor(100 + Math.random() * 900))
        }
        if (a.category) setCategory(a.category)
        if (a.headline) setHeadline(a.headline)
        if (a.subheadline) setSubheadline(a.subheadline)
        if (a.keyFeatures) setKeyFeatures(a.keyFeatures)
        if (a.targetAudience) setTargetAudience(a.targetAudience)
        if (a.price) setPrice(a.price.toString())
        if (a.originalPrice) setOriginalPrice(a.originalPrice.toString())
        if (a.tone) setTone(a.tone)
        if (a.themeColor) setThemeColor(a.themeColor)
        if (a.bgColor) setBgColor(a.bgColor)
        if (a.textColor) setTextColor(a.textColor)
        if (a.cardStyle) setCardStyle(a.cardStyle)
        if (a.bgImage) setBgImage(a.bgImage)
        if (a.painPoints) setPainPoints(a.painPoints)
        if (a.benefits) setBenefits(a.benefits)
        if (a.brandStory) setBrandStory(a.brandStory)
        if (a.reviews) setReviews(a.reviews)
        if (a.chatReviews) setChatReviews(a.chatReviews)
        if (a.faqs) setFaqs(a.faqs)
        if (a.guaranteeText) setGuaranteeText(a.guaranteeText)
        if (a.trustBadges) setTrustBadges(a.trustBadges)
        if (a.tiers) setTiers(a.tiers)
        setAiAnalyzedBadge(true)

        // Automatically generate all 13 sections with the real tailored AI analysis
        try {
          const genRes = await fetch('/api/ai-generate-salepage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productName: a.productName || productName,
              category: a.category || category,
              keyFeatures: a.keyFeatures || keyFeatures,
              price: a.price ? a.price.toString() : price,
              originalPrice: a.originalPrice ? a.originalPrice.toString() : originalPrice,
              targetAudience: a.targetAudience || targetAudience,
              tone: a.tone || tone,
              productImage: publicUrl || productImage,
              customThemeColor: a.themeColor || themeColor,
              customBgColor: a.bgColor || bgColor,
              customTextColor: a.textColor || textColor,
              customCardStyle: a.cardStyle || cardStyle,
              customBgImage: a.bgImage || bgImage,
              customHeadline: a.headline,
              customSubheadline: a.subheadline,
              customPainPoints: a.painPoints,
              customBenefits: a.benefits,
              customFaqs: a.faqs,
              customReviews: a.reviews,
              customChatReviews: a.chatReviews,
              customStory: a.brandStory,
              customGuarantee: a.guaranteeText,
              customTiers: a.tiers,
              analysis: a,
              userApiKey: activeKey
            })
          })
          const genData = await genRes.json()
          if (genData.success) {
            setAiResult(genData)
            setActiveResultTab('preview')
          }
        } catch (genErr) {
          console.warn('Auto generation after vision notice:', genErr)
        }
      }
    } catch (err: any) {
      console.warn('AI analysis notice:', err)
    } finally {
      setAnalyzingImage(false)
      setAnalyzingStep('')
    }
  }

  // Handle Full 13-Block Salepage & Copy Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    setGenerationStep('🔍 กำลังวิเคราะห์จุดเด่นสินค้าและพฤติกรรมลูกค้า...')

    try {
      setTimeout(() => setGenerationStep('✍️ กำลังร่างพาดหัว Hook AIDA และคำบรรยายปิดการขาย...'), 600)
      setTimeout(() => setGenerationStep('📦 กำลังจัดเซ็ต 13 บล็อกเซลเพจระดับพรีเมียม...'), 1200)
      setTimeout(() => setGenerationStep('🎯 กำลังสร้างแคปชั่นยิงแอด Facebook, TikTok & LINE...'), 1800)

      const res = await fetch('/api/ai-generate-salepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          category,
          keyFeatures,
          price,
          originalPrice,
          targetAudience,
          tone,
          productImage,
          customThemeColor: themeColor,
          customBgColor: bgColor,
          customTextColor: textColor,
          customCardStyle: cardStyle,
          customBgImage: bgImage,
          customHeadline: headline,
          customSubheadline: subheadline,
          customPainPoints: painPoints,
          customBenefits: benefits,
          customFaqs: faqs,
          customReviews: reviews,
          customChatReviews: chatReviews,
          customStory: brandStory,
          customGuarantee: guaranteeText,
          customTiers: tiers,
          userApiKey: apiKey || (typeof window !== 'undefined' ? (localStorage.getItem('gemini_api_key') || '') : '')
        })
      })

      const data = await res.json()
      if (data.success) {
        setAiResult(data)
        setActiveResultTab('preview')
      } else {
        alert('เกิดข้อผิดพลาด: ' + (data.error || 'ไม่สามารถสร้างเนื้อหาได้'))
      }
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ AI: ' + err.message)
    } finally {
      setGenerating(false)
      setGenerationStep('')
    }
  }

  // Handle 1-Click Import to Custom Salepage Builder
    // Direct Publish to /c/[slug] Route in Supabase
  const handlePublishToCustomRoute = async () => {
    if (!aiResult) return
    setPublishing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      if (!userId) {
        alert('กรุณาเข้าสู่ระบบก่อนทำการบันทึกและเผยแพร่เซลเพจ')
        router.push('/login?next=/ai-salepage')
        return
      }

      const slugToUse = customSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'c-' + Math.floor(100 + Math.random() * 900)

      const payload = {
        user_id: userId,
        slug: slugToUse,
        title: productName || 'เซลเพจสินค้าพรีเมียม',
        headline: headline || aiResult.headline || productName,
        subheadline: subheadline || aiResult.subheadline || '',
        hero_image_url: productImage || null,
        offer_price: parseFloat(price) || 490,
        original_price: parseFloat(originalPrice) || 990,
        theme_color: themeColor,
        bg_color: bgColor,
        text_color: textColor,
        card_style: cardStyle,
        bg_image_url: bgImage || null,
        features: aiResult.sections || [],
        pain_points: painPoints.length > 0 ? painPoints : (aiResult.painPoints || []),
        benefits: benefits.length > 0 ? benefits : (aiResult.benefits || []),
        testimonials: reviews.length > 0 ? reviews : (aiResult.reviews || []),
        faqs: faqs.length > 0 ? faqs : (aiResult.faqs || []),
        body_content: brandStory || aiResult.brandStory || '',
        guarantee_text: guaranteeText || aiResult.guaranteeText || '',
        enable_cod_form: true,
        is_active: true,
        updated_at: new Date().toISOString()
      }

      // Check if slug exists
      const { data: existing } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('slug', slugToUse)
        .single()

      if (existing) {
        // Update
        const { error } = await supabase
          .from('landing_pages')
          .update(payload)
          .eq('id', existing.id)
        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('landing_pages')
          .insert([payload])
        if (error) throw error
      }

      const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/c/${slugToUse}`
      setPublishedUrl(fullUrl)
      setPublishModalOpen(true)
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการเผยแพร่: ' + (err.message || 'กรุณาลองใหม่อีกครั้ง'))
    } finally {
      setPublishing(false)
    }
  }

  const handleImportToCustomSalepage = () => {
    if (!aiResult) return
    if (typeof window !== 'undefined') {
      const importData = {
        ...aiResult,
        pageTitle: productName,
        pageSlug: 'sale-' + Math.floor(100 + Math.random() * 900),
        themeColor: themeColor,
        bgColor: bgColor,
        textColor: textColor,
        cardStyle: cardStyle,
        bgImage: bgImage,
        productImage: productImage
      }
      sessionStorage.setItem('ai_imported_salepage', JSON.stringify(importData))
      localStorage.setItem('ai_imported_salepage', JSON.stringify(importData))
      sessionStorage.setItem('ai_import_active', 'true')
      localStorage.setItem('ai_import_active', 'true')
      router.push('/custom-salepage?ai_import=true')
    }
  }

  // Handle Copy Text
  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-[#F8FAFC] transition-colors duration-300 flex flex-col">
      
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#131B2A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard?tab=services"
              className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition shadow-xs cursor-pointer"
              title="กลับสู่บริการอื่นๆ"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>AI Auto Salepage & Copy Studio</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    Pro AI Engine
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  อัปโหลดรูปภาพสินค้า ให้ AI สแกนวิเคราะห์ + ตกแต่งธีมสีอัตโนมัติ และนำเข้าสู่ Custom Salepage Builder ใน 1 คลิก
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {aiResult && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePublishToCustomRoute}
                  disabled={publishing}
                  className="px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-purple-500/25 active:scale-95 transition cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-yellow-300 animate-bounce" />
                  <span>{publishing ? 'กำลังบันทึก...' : '🚀 สร้างเซลเพจ /c/[slug]'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleImportToCustomSalepage}
                  className="px-3.5 sm:px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition cursor-pointer hidden md:flex"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>แก้ไขต่อใน Builder</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: AI INPUT FORM (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* GOOGLE GEMINI API KEY BOX */}
          <div className="bg-white dark:bg-[#131B2A] rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Google Gemini API Key (สำหรับวิเคราะห์ภาพจริง)
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-0.5"
              >
                รับคีย์ฟรีจาก Google ➔
              </a>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); handleSaveApiKey(e.target.value); }}
                placeholder="AIzaSy... (วางคีย์ที่นี่)"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTestingKey || !apiKey}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm active:scale-95 transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                {isTestingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>ทดสอบ Key</span>
              </button>
            </div>

            {keyStatus && (
              <div className={`p-2 rounded-xl text-[10px] font-bold ${keyStatus.includes('✓') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'}`}>
                {keyStatus}
              </div>
            )}
          </div>

          {/* MAIN PRODUCT DATA FORM */}
          <div className="bg-white dark:bg-[#131B2A] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    ข้อมูลสินค้า & วิเคราะห์ด้วย AI
                  </h3>
                  <p className="text-[10px] text-slate-400">อัปโหลดรูปภาพสินค้าเพื่อวิเคราะห์และจัดโทนสีอัตโนมัติ</p>
                </div>
              </div>

              {aiAnalyzedBadge && (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>AI วิเคราะห์แล้ว</span>
                </span>
              )}
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              
              {/* PRODUCT IMAGE UPLOADER */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>รูปภาพสินค้าจริง (Product Photo)</span>
                  </label>
                  {productImage && (
                    <button
                      type="button"
                      onClick={() => triggerAiVisionAnalysis(imageBase64, productImage)}
                      disabled={analyzingImage}
                      className="text-[9px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                      <span>{analyzingImage ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ภาพนี้ใหม่'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  
                  {/* Image Preview Box */}
                  <div className="sm:col-span-4 aspect-square rounded-2xl overflow-hidden bg-black/40 border border-slate-200 dark:border-slate-700 relative group shadow-sm flex items-center justify-center">
                    {productImage ? (
                      <>
                        <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1.5 bg-white text-slate-900 rounded-lg text-[9px] font-bold shadow-md cursor-pointer"
                            title="เปลี่ยนรูป"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400 opacity-50" />
                    )}
                  </div>

                  {/* Upload Action Button */}
                  <div className="sm:col-span-8 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage || analyzingImage}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {uploadingImage ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>กำลังอัปโหลดรูปภาพ...</span>
                        </>
                      ) : analyzingImage ? (
                        <>
                          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                          <span>AI กำลังสแกนวิเคราะห์สินค้า...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>เลือกไฟล์รูปภาพ (วิเคราะห์ภาพทันที)</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span>หรือ URL:</span>
                      <input
                        type="url"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        onBlur={() => { if (productImage) triggerAiVisionAnalysis('', productImage) }}
                        placeholder="https://..."
                        className="flex-1 px-2 py-1 rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono text-[9px] truncate"
                      />
                    </div>
                  </div>

                </div>

                {analyzingStep && (
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[10px] text-purple-700 dark:text-purple-300 flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>{analyzingStep}</span>
                  </div>
                )}
              </div>

              {/* PRODUCT NAME & BRAND */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  ชื่อสินค้า / ชื่อแบรนด์ *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="เช่น ปังปิ้งเตาถ่าน ปุ๊น ปุ๊น"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              {/* CATEGORY & TONE */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    หมวดหมู่สินค้า
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="food">อาหาร / เครื่องดื่ม</option>
                    <option value="bakery">เบเกอรี่ / ขนมปัง</option>
                    <option value="skincare">สกินแคร์ / ความงาม</option>
                    <option value="supplement">อาหารเสริม / สุขภาพ</option>
                    <option value="fashion">แฟชั่น / เครื่องแต่งกาย</option>
                    <option value="tech">อุปกรณ์ไอที / แกดเจ็ต</option>
                    <option value="digital">สินค้าดิจิทัล / คอร์สเรียน</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    โทนเสียงการเขียน (Tone)
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="urgent">🔥 ปิดการขายด่วน (Urgent / FOMO)</option>
                    <option value="luxury">✨ พรีเมียมหรูหรา (Luxury Brand)</option>
                    <option value="natural">🌿 ธรรมชาติออร์แกนิก (Organic / Soft)</option>
                    <option value="expert">💡 ผู้เชี่ยวชาญน่าเชื่อถือ (Expert / Medical)</option>
                    <option value="social">💖 เป็นกันเองรีวิวเด่น (Social Friendly)</option>
                  </select>
                </div>
              </div>

              {/* KEY FEATURES */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  จุดเด่น สรรพคุณ หรือสารสกัดสำคัญ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  placeholder="เช่น ขนมปังปิ้งเตาถ่านโบราณ หอมเนยแท้ 100% ไส้เยิ้มทะลัก..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 leading-relaxed font-medium"
                />
              </div>

              {/* PRICING */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    ราคาโปรโมชั่น (Offer Price)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-mono font-bold text-purple-600">฿</span>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    ราคาเดิมขีดฆ่า (Original Price)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-mono font-bold text-slate-400">฿</span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-400 line-through"
                    />
                  </div>
                </div>
              </div>

              {/* TARGET AUDIENCE */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  กลุ่มลูกค้าเป้าหมาย
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="เช่น คนรักขนมปังและของหวานรสชาติเข้มข้น..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* AI PALETTE & MOOD THEME ACCORDION */}
              <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    <span>ธีมสีที่ AI วิเคราะห์ให้เหมาะสมกับสินค้า (AI Mood & Palette)</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีปุ่ม & ไฮไลท์</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[9px] rounded bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สีพื้นหลัง</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[9px] rounded bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-0.5">สไตล์การ์ด</label>
                    <select
                      value={cardStyle}
                      onChange={(e) => setCardStyle(e.target.value as any)}
                      className="w-full px-1.5 py-1 text-[10px] rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 font-bold"
                    >
                      <option value="glass">กระจกฝ้า Glass</option>
                      <option value="dark">ดาร์กสเลต Dark</option>
                      <option value="clean">คลีนการ์ด Clean</option>
                      <option value="gold">ลักชูรีโกลด์ Gold</option>
                      <option value="neon">นีออนโกลว์ Neon</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* GENERATE BUTTON */}
              <button
                type="submit"
                disabled={generating || uploadingImage || analyzingImage}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-xl active:scale-95 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{generationStep || 'กำลังให้ AI ออกแบบเซลเพจ...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>✨ ให้ AI วิเคราะห์ & สร้างเซลเพจทันที</span>
                  </>
                )}
              </button>

            </form>

          </div>

        </div>

        {/* RIGHT COLUMN: AI RESULT PREVIEW & AD COPIES (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {!aiResult ? (
            /* Blank state */
            <div className="bg-white dark:bg-[#131B2A] rounded-3xl p-10 sm:p-14 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
                <Wand2 className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  ระบบ AI Auto Salepage พร้อมทำงาน
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  อัปโหลดรูปภาพสินค้าของคุณฝั่งซ้าย แล้วกดปุ่มเพื่อให้ AI สร้างเนื้อหาเซลเพจครบ 13 บล็อก พร้อมแคปชั่นสำหรับยิงแอดให้ทันที
                </p>
              </div>
            </div>
          ) : (
            /* AI Results Tabs */
            <div className="space-y-4">
              
              {/* Success Banner */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>AI วิเคราะห์และสร้างเซลเพจ 13 บล็อกสำเร็จแล้ว!</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 font-light">
                      คุณสามารถตรวจดูตัวอย่างด้านล่าง หรือกดนำเข้าสู่ Custom Salepage Builder เพื่อปรับแต่งต่อได้ทันที
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleImportToCustomSalepage}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>เปิดใน Custom Salepage Builder (1 คลิก)</span>
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white dark:bg-[#131B2A] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 flex-1">
                  <button
                    type="button"
                    onClick={() => setActiveResultTab('preview')}
                    className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeResultTab === 'preview'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>1. ตัวอย่างเซลเพจ (13 บล็อก)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveResultTab('copy')}
                    className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeResultTab === 'copy'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>2. แผนก๊อปปี้ยิงแอด (Copywriting)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveResultTab('breakdown')}
                    className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer hidden sm:flex ${
                      activeResultTab === 'breakdown'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>3. โครงสร้างข้อมูล (JSON)</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: INTERACTIVE LIVE CANVAS PREVIEW */}
              {activeResultTab === 'preview' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-500">
                      แสดงผลเซลเพจ 13 บล็อกเสมือนจริง (Interactive Live Canvas)
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                      ✦ โทนสีและมู้ดแอนด์โทนตรงตามที่ AI วิเคราะห์
                    </span>
                  </div>

                  {/* Phone Mockup Frame */}
                  <div className="w-full max-w-[400px] mx-auto bg-slate-950 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 relative overflow-hidden select-none">
                    <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2.5 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90" />
                    </div>

                    <div
                      style={{
                        backgroundColor: bgColor,
                        color: textColor
                      }}
                      className="rounded-[32px] overflow-y-auto max-h-[640px] no-scrollbar text-left text-xs space-y-4 p-3.5 relative z-10"
                    >
                      {aiResult.sections.map((section: any) => (
                        <SalepageSectionRenderer
                          key={section.id}
                          section={section}
                          globalThemeColor={themeColor}
                          globalBgColor={bgColor}
                          globalTextColor={textColor}
                          globalCardStyle={cardStyle}
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
                          previewTotal={parseInt(price) * previewQty}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COPYWRITING AD SCRIPTS */}
              {activeResultTab === 'copy' && (
                <div className="space-y-4">
                  {/* Facebook Ad Copy */}
                  <div className="bg-white dark:bg-[#131B2A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-black text-blue-600 flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        <span>แคปชั่นยิงแอด Facebook (Hook AIDA สูตรปิดการขาย)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`🔥 ${productName} ${keyFeatures}\n\n✅ สดใหม่ทุกวัน หอมเนยแท้ 100%\n✅ ราคาพิเศษเพียง ฿${price}.- (จากปกติ ฿${originalPrice}.-)\n\n🚚 จัดส่งด่วนทั่วประเทศ สั่งซื้อด่วนคลิกที่ลิงก์เลย!`, 'fb')}
                        className="text-[10px] text-purple-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'fb' ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
                      </button>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed">
                      <p className="font-bold text-purple-600 mb-1">🔥 {productName} {keyFeatures}</p>
                      <p className="text-slate-600 dark:text-slate-300">✅ ปิ้งเตาถ่านโบราณ หอมเนยแท้ 100% ไส้เยิ้มทะลัก</p>
                      <p className="text-slate-600 dark:text-slate-300">✅ ราคาพิเศษเริ่มต้นเพียง ฿{price}.- (จากปกติ ฿{originalPrice}.-)</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2">🚚 มีบริการจัดส่งด่วน & เก็บเงินปลายทาง (COD)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: JSON BREAKDOWN */}
              {activeResultTab === 'breakdown' && (
                <div className="bg-white dark:bg-[#131B2A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-black text-purple-600 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>โครงสร้าง 13 บล็อกเซลเพจ (13-Block Schema JSON)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(JSON.stringify(aiResult, null, 2), 'json')}
                      className="text-[10px] text-purple-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'json' ? 'คัดลอกแล้ว!' : 'คัดลอก JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-96 leading-relaxed">
                    {JSON.stringify(aiResult, null, 2)}
                  </pre>
                </div>
              )}

            </div>
          )}

        </div>

      </main>

    
      {/* PUBLISH SUCCESS MODAL FOR /c/[slug] */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">✨ เผยแพร่เซลเพจ /c/[slug] สำเร็จ!</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                ระบบได้สร้างหน้าเซลเพจ 13 บล็อกโมดูลาร์ พร้อมรีวิวและเนื้อหาที่สร้างด้วย AI เรียบร้อยแล้ว
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-emerald-400 truncate flex-1 text-left">
                {publishedUrl}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(publishedUrl || '', 'published_url')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
              >
                {copiedKey === 'published_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'published_url' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={publishedUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <span>เปิดดูหน้าจริง /c/</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs transition"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
</div>
  )
}
