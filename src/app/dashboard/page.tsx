'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUserTier } from '@/lib/tier'
import SocialIcon from '@/components/SocialIcon'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { 
  Link2, ShoppingBag, Palette, ExternalLink, Plus, Trash2, 
  Save, LogOut, Check, Eye, Upload, Image as ImageIcon, Sparkles, Globe, Youtube, RefreshCw, Share2, LayoutTemplate, Crown, Coins, Lock, AlertCircle, Users, Download, ShieldCheck, Zap, QrCode, X, MessageCircle
} from 'lucide-react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'links' | 'shop' | 'appearance' | 'leads' | 'billing'>('links')
  const [user, setUser] = useState<any>(null)
  
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
    hide_branding: false,
    og_title: '',
    og_description: '',
    og_image_url: '',
    custom_button_color: '#1e293b',
    custom_button_text_color: '#ffffff',
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
  })
  
  const [links, setLinks] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])

  // QR Code Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrTargetUrl, setQrTargetUrl] = useState('')

  // Form States
  const [newLink, setNewLink] = useState({ 
    title: '', 
    subtitle: '', 
    url: '', 
    icon: 'facebook', 
    logo_url: '',
    bg_color: '#1e293b',
    text_color: '#ffffff'
  })
  
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: '', category: 'ทั่วไป', image_url: '', buy_url: '', badge: '' })
  
  const [uploading, setUploading] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState('')
  const [billingMsg, setBillingMsg] = useState('')

  const router = useRouter()
  const supabase = createClient()

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
        custom_button_color: profData.custom_button_color || '#1e293b',
        custom_button_text_color: profData.custom_button_text_color || '#ffffff'
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

    setLoading(false)
  }

  // Calculate Active Tier Info
  const tierInfo = getUserTier(profile)

  // Trigger Instant Revalidation
  const triggerRevalidate = async () => {
    try {
      if (profile?.username) {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: profile.username })
        })
      }
    } catch (e) {}
  }

  // Open QR Code Modal (Master Only)
  const openQrModal = (urlToEncode?: string) => {
    if (!tierInfo.canQRCode) {
      alert('🔒 ระบบสร้าง QR Code สำหรับสแกนเข้าโปรไฟล์และสินค้าเฉพาะสมาชิก MASTER VIP เท่านั้น!')
      setActiveTab('billing')
      return
    }
    const targetUrl = urlToEncode || `${window.location.origin}/${profile.username}`
    setQrTargetUrl(targetUrl)
    setQrModalOpen(true)
  }

  // Buy Pro Subscription (100 Points = 30 Days)
  const handleBuyPro = async () => {
    if ((profile.points || 0) < 100) {
      setBillingMsg('❌ แต้มไม่เพียงพอ! กรุณาติดต่อ Admin เพื่อเติมแต้ม')
      setTimeout(() => setBillingMsg(''), 4000)
      return
    }

    try {
      const { data, error } = await supabase.rpc('buy_pro_subscription', {
        target_user_id: user.id,
        points_cost: 100,
        duration_days: 30
      })

      if (!error && data && data.success) {
        setProfile((prev: any) => ({
          ...prev,
          points: data.remaining_points,
          pro_expires_at: data.pro_expires_at
        }))
        setBillingMsg('🎉 อัปเกรดเป็น Pro Plan สำเร็จ! (เลือกได้ Template 1-4 / ซ่อน Branding / 10 ลิ้งก์ / 10 สินค้า)')
        await triggerRevalidate()
      } else {
        const newPts = profile.points - 100
        const currentExp = profile.pro_expires_at ? new Date(profile.pro_expires_at).getTime() : Date.now()
        const newExp = new Date(Math.max(Date.now(), currentExp) + 30 * 24 * 60 * 60 * 1000).toISOString()
        
        await supabase.from('profiles').update({ points: newPts, pro_expires_at: newExp }).eq('id', user.id)
        setProfile((prev: any) => ({ ...prev, points: newPts, pro_expires_at: newExp }))
        setBillingMsg('🎉 อัปเกรดเป็น Pro Plan สำเร็จ!')
        await triggerRevalidate()
      }
      setTimeout(() => setBillingMsg(''), 4000)
    } catch (e) {}
  }

  // Buy Master Subscription (250 Points = 30 Days)
  const handleBuyMaster = async () => {
    if ((profile.points || 0) < 250) {
      setBillingMsg('❌ แต้มไม่เพียงพอ! กรุณาติดต่อ Admin เพื่อเติมแต้ม')
      setTimeout(() => setBillingMsg(''), 4000)
      return
    }

    try {
      const { data, error } = await supabase.rpc('buy_master_subscription', {
        target_user_id: user.id,
        points_cost: 250,
        duration_days: 30
      })

      if (!error && data && data.success) {
        setProfile((prev: any) => ({
          ...prev,
          points: data.remaining_points,
          master_expires_at: data.master_expires_at
        }))
        setBillingMsg('👑 อัปเกรดเป็น MASTER VIP สำเร็จ! (สลับได้ทั้ง 9 เทมเพลต / สแกน QR Code / ไม่จำกัดโควตา)')
        await triggerRevalidate()
      } else {
        const newPts = profile.points - 250
        const currentExp = profile.master_expires_at ? new Date(profile.master_expires_at).getTime() : Date.now()
        const newExp = new Date(Math.max(Date.now(), currentExp) + 30 * 24 * 60 * 60 * 1000).toISOString()
        
        await supabase.from('profiles').update({ points: newPts, master_expires_at: newExp }).eq('id', user.id)
        setProfile((prev: any) => ({ ...prev, points: newPts, master_expires_at: newExp }))
        setBillingMsg('👑 อัปเกรดเป็น MASTER VIP สำเร็จ!')
        await triggerRevalidate()
      }
      setTimeout(() => setBillingMsg(''), 4000)
    } catch (e) {}
  }

  // Upload Helper
  const uploadImageFile = async (file: File, uploadType: string): Promise<string> => {
    setUploading(uploadType)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data, error } = await supabase.storage.from('media').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)
        setUploading(null)
        return publicUrl
      }
    } catch (e) {}

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploading(null)
        resolve(reader.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'avatar_url' | 'cover_url' | 'bg_image_url' | 'link_logo' | 'product_image' | 'og_image_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadedUrl = await uploadImageFile(file, targetField)

    if (targetField === 'avatar_url' || targetField === 'cover_url' || targetField === 'bg_image_url' || targetField === 'og_image_url') {
      setProfile((prev: any) => ({ ...prev, [targetField]: uploadedUrl }))
    } else if (targetField === 'link_logo') {
      setNewLink((prev) => ({ ...prev, logo_url: uploadedUrl }))
    } else if (targetField === 'product_image') {
      setNewProduct((prev) => ({ ...prev, image_url: uploadedUrl }))
    }
  }

  const handleSaveProfile = async () => {
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
        og_title: profile.og_title,
        og_description: profile.og_description,
        og_image_url: profile.og_image_url,
        custom_button_color: profile.custom_button_color,
        custom_button_text_color: profile.custom_button_text_color,
        theme_name: profile.theme_name,
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
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (!error) {
      await triggerRevalidate()

      if (!tierInfo.allowedTemplates.includes(profile.template_id)) {
        setSavedMsg('✨ แสดงตัวอย่างเทมเพลตในแดชบอร์ดแล้ว! (หากต้องการเปิดใช้หน้าจริง กรุณาติดต่อ Admin เพื่ออัปเกรดเป็น Pro/Master)')
      } else {
        setSavedMsg('บันทึกข้อมูลและอัปเดตหน้าจริงเรียบร้อยแล้ว!')
      }
      setTimeout(() => setSavedMsg(''), 4000)
    }
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLink.title || !newLink.url) return

    if (links.length >= tierInfo.maxLinks) {
      alert(`❌ สมาชิกแพ็กเกจ ${tierInfo.tier.toUpperCase()} เพิ่มลิ้งก์ได้สูงสุด ${tierInfo.maxLinks} ลิ้งก์! กรุณาอัปเกรดเพื่อเพิ่มได้มากขึ้น`)
      setActiveTab('billing')
      return
    }

    const { data } = await supabase
      .from('links')
      .insert({
        user_id: user.id,
        title: newLink.title,
        subtitle: newLink.subtitle,
        url: newLink.url,
        icon: newLink.icon,
        logo_url: newLink.logo_url,
        bg_color: newLink.bg_color || '#1e293b',
        text_color: newLink.text_color || '#ffffff',
        position: links.length
      })
      .select()

    if (data && data[0]) {
      setLinks([...links, data[0]])
      setNewLink({ 
        title: '', 
        subtitle: '', 
        url: '', 
        icon: 'facebook', 
        logo_url: '',
        bg_color: '#1e293b',
        text_color: '#ffffff'
      })
      await triggerRevalidate()
    }
  }

  const handleDeleteLink = async (id: string) => {
    await supabase.from('links').delete().eq('id', id)
    setLinks(links.filter((l) => l.id !== id))
    await triggerRevalidate()
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.title || !newProduct.buy_url) return

    if (products.length >= tierInfo.maxProducts) {
      alert(`❌ สมาชิกแพ็กเกจ ${tierInfo.tier.toUpperCase()} ลงสินค้าได้สูงสุด ${tierInfo.maxProducts} ชิ้น! กรุณาอัปเกรดแพ็กเกจเพื่อลงสินค้าเพิ่มเติม`)
      setActiveTab('billing')
      return
    }

    const { data } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price || '0'),
        category: newProduct.category || 'ทั่วไป',
        image_url: newProduct.image_url,
        buy_url: newProduct.buy_url,
        badge: newProduct.badge,
        position: products.length
      })
      .select()

    if (data && data[0]) {
      setProducts([...products, data[0]])
      setNewProduct({ title: '', description: '', price: '', category: 'ทั่วไป', image_url: '', buy_url: '', badge: '' })
      await triggerRevalidate()
    }
  }

  const handleDeleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter((p) => p.id !== id))
    await triggerRevalidate()
  }

  const exportLeadsCSV = () => {
    if (leads.length === 0) return
    const headers = "Name,Email,Phone,Note,Date\n"
    const rows = leads.map(l => `"${l.name || ''}","${l.email || ''}","${l.phone || ''}","${l.note || ''}","${l.created_at || ''}"`).join("\n")
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `leads_${profile.username}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">
        กำลังโหลดข้อมูลแดชบอร์ด...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 font-bold">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">MyBioLink Platform</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Quick Switch Button if Admin */}
            {profile.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="px-3.5 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Panel
              </button>
            )}

            {/* Active Tier Badge */}
            {tierInfo.tier === 'master' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-black text-xs rounded-xl shadow-lg shadow-purple-500/10">
                <Crown className="w-3.5 h-3.5 text-purple-400" /> MASTER VIP
              </span>
            ) : tierInfo.tier === 'pro' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs rounded-xl shadow">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> PRO Member
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 font-bold text-xs rounded-xl">
                Free Plan
              </span>
            )}

            {/* QR Code Button (Master Feature) */}
            <button
              onClick={() => openQrModal()}
              className="px-3 py-2 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-purple-400" /> สร้าง QR Code
            </button>

            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition"
            >
              <Eye className="w-4 h-4" /> ดูหน้าโปรไฟล์ ({profile.username})
            </a>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
              title="ออกจากระบบ"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* QR CODE MODAL FOR MASTER TIER */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <button 
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-xs rounded-full inline-flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> MASTER VIP QR CODE GENERATOR
              </span>
            </div>
            <h3 className="font-bold text-base text-white">สแกน QR Code เข้าสู่โปรไฟล์</h3>
            <p className="text-xs text-slate-400 truncate">{qrTargetUrl}</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-purple-500/30">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrTargetUrl)}`} 
                alt="QR Code" 
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrTargetUrl)}`}
                target="_blank"
                download="qrcode.png"
                className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> ดาวน์โหลด QR Code HD
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Management Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('links')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition shrink-0 ${
                activeTab === 'links' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link2 className="w-4 h-4" /> ลิ้งก์ ({links.length}/{tierInfo.maxLinks === 9999 ? '∞' : tierInfo.maxLinks})
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition shrink-0 ${
                activeTab === 'shop' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> ร้านค้า ({products.length}/{tierInfo.maxProducts === 9999 ? '∞' : tierInfo.maxProducts})
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition shrink-0 ${
                activeTab === 'appearance' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" /> เทมเพลต & ตกแต่ง
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition shrink-0 ${
                activeTab === 'leads' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" /> รายชื่อลูกค้า ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-extrabold rounded-xl transition shrink-0 ${
                activeTab === 'billing' ? 'bg-amber-400 text-slate-950' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Crown className="w-4 h-4" /> แพ็กเกจ / แต้ม
            </button>
          </div>

          {/* TAB 1: LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              {links.length >= tierInfo.maxLinks && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-sm text-amber-300">ถึงขีดจำกัดลิ้งก์สำหรับแพ็กเกจ {tierInfo.tier.toUpperCase()} ({links.length}/{tierInfo.maxLinks})</p>
                    <p className="opacity-90">อัปเกรดเป็น Pro (10 ลิ้งก์) หรือ Master (ไม่จำกัดลิ้งก์)</p>
                  </div>
                  <button onClick={() => setActiveTab('billing')} className="ml-auto px-3 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 hover:bg-amber-300">
                    อัปเกรด
                  </button>
                </div>
              )}

              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> เพิ่มลิ้งก์ใหม่
                </h3>
                <form onSubmit={handleAddLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อลิ้งก์หลัก (Title)</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น Facebook Fanpage, สูตรทำขนม"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ข้อความอธิบายย่อ (Subtitle)</label>
                    <input
                      type="text"
                      placeholder="เช่น ติดตามเมนูใหม่ๆ ได้ทุกวัน"
                      value={newLink.subtitle}
                      onChange={(e) => setNewLink({ ...newLink, subtitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">URL ปลายทาง</label>
                    <input
                      type="url"
                      required
                      placeholder="https://facebook.com/yourpage"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">เลือกประเภทไอคอนแบรนด์</label>
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400">
                          <SocialIcon type={newLink.icon} className="w-5 h-5" />
                        </div>
                        <select
                          value={newLink.icon}
                          onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="youtube">YouTube</option>
                          <option value="line">LINE</option>
                          <option value="shopee">Shopee</option>
                          <option value="lazada">Lazada</option>
                          <option value="x">X / Twitter</option>
                          <option value="pinterest">Pinterest</option>
                          <option value="email">Email</option>
                          <option value="website">เว็บไซต์ (Website)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">หรืออัปโหลดภาพโลโก้/ไอคอนเอง</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 bg-slate-800 border border-slate-700 hover:border-emerald-500 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 transition">
                          <Upload className="w-4 h-4 text-emerald-400" />
                          {uploading === 'link_logo' ? 'อัปโหลด...' : 'เลือกรูปภาพโลโก้'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'link_logo')} />
                        </label>
                        {newLink.logo_url && (
                          <img src={newLink.logo_url} alt="Logo Preview" className="w-9 h-9 object-cover rounded-xl border border-emerald-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* INDIVIDUAL LINK BOX COLOR SETTINGS (PRO & MASTER FEATURE) */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden">
                    {!tierInfo.canPerLinkColor && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-10 flex items-center justify-center p-2 text-center">
                        <span className="text-xs text-amber-300 font-bold bg-amber-400/20 border border-amber-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-400" /> กำหนดสี Box รายลิ้งก์ปลดล็อกสำหรับสมาชิกระดับ Pro และ Master
                        </span>
                      </div>
                    )}
                    <label className="block text-xs font-bold text-emerald-400">กำหนดสีของ Box ลิ้งก์นี้เฉพาะอัน (Per-Link Custom Colors)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">สีพื้นหลัง Box</span>
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                          <input
                            type="color"
                            value={newLink.bg_color}
                            onChange={(e) => setNewLink({ ...newLink, bg_color: e.target.value })}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={newLink.bg_color}
                            onChange={(e) => setNewLink({ ...newLink, bg_color: e.target.value })}
                            className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">สีตัวอักษร</span>
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                          <input
                            type="color"
                            value={newLink.text_color}
                            onChange={(e) => setNewLink({ ...newLink, text_color: e.target.value })}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={newLink.text_color}
                            onChange={(e) => setNewLink({ ...newLink, text_color: e.target.value })}
                            className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={links.length >= tierInfo.maxLinks}
                    className={`w-full py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm font-bold shadow-lg ${
                      links.length >= tierInfo.maxLinks
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> เพิ่มลิ้งก์ใหม่
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400">รายการลิ้งก์ทั้งหมด ({links.length}/{tierInfo.maxLinks === 9999 ? '∞' : tierInfo.maxLinks})</h4>
                {links.map((link) => (
                  <div 
                    key={link.id} 
                    style={{ backgroundColor: tierInfo.canPerLinkColor ? (link.bg_color || '#1e293b') : '#1e293b', color: tierInfo.canPerLinkColor ? (link.text_color || '#ffffff') : '#ffffff' }}
                    className="border border-white/10 p-4 rounded-2xl flex items-center justify-between shadow-md"
                  >
                    <div className="flex items-center gap-3 overflow-hidden pr-4">
                      {link.logo_url ? (
                        <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/20" />
                      ) : (
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                          <SocialIcon type={link.icon} className="w-5 h-5" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm truncate">{link.title}</p>
                        {link.subtitle && <p className="text-xs opacity-75 truncate">{link.subtitle}</p>}
                        <p className="text-xs opacity-60 truncate">{link.url}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {tierInfo.canQRCode && (
                        <button
                          onClick={() => openQrModal(link.url)}
                          className="p-2 text-purple-300 hover:bg-black/20 rounded-xl transition"
                          title="สร้าง QR Code สแกนตรงไปลิ้งก์นี้"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-black/20 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SHOP */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              {products.length >= tierInfo.maxProducts && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-sm text-amber-300">ถึงขีดจำกัดสินค้าสำหรับแพ็กเกจ {tierInfo.tier.toUpperCase()} ({products.length}/{tierInfo.maxProducts})</p>
                    <p className="opacity-90">อัปเกรดเป็น Pro (10 ชิ้น) หรือ Master (ไม่จำกัดสินค้า)</p>
                  </div>
                  <button onClick={() => setActiveTab('billing')} className="ml-auto px-3 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 hover:bg-amber-300">
                    อัปเกรด
                  </button>
                </div>
              )}

              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> เพิ่มสินค้าในหน้าร้าน
                </h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อสินค้า</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น Pistachio Spread Duo Set"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ราคา (บาท / THB)</label>
                      <input
                        type="number"
                        placeholder="350"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">คำอธิบายสินค้าอย่างย่อ</label>
                    <input
                      type="text"
                      placeholder="เช่น พิตาชิโอสเปรดธรรมชาติ 100%"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">รูปภาพสินค้า</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 bg-slate-800 border border-slate-700 hover:border-emerald-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        {uploading === 'product_image' ? 'กำลังอัปโหลด...' : 'เลือกรูปภาพสินค้า'}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'product_image')} />
                      </label>
                      {newProduct.image_url && (
                        <img src={newProduct.image_url} alt="Product Preview" className="w-12 h-12 object-cover rounded-xl border border-emerald-500 shrink-0" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ป้ายกำกับ (Badge)</label>
                      <input
                        type="text"
                        placeholder="BEST SELLER, NEW"
                        value={newProduct.badge}
                        onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ลิ้งก์สั่งซื้อปลายทาง</label>
                      <input
                        type="url"
                        required
                        placeholder="https://line.me/ti/p/~yourline"
                        value={newProduct.buy_url}
                        onChange={(e) => setNewProduct({ ...newProduct, buy_url: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={products.length >= tierInfo.maxProducts}
                    className={`w-full py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm font-bold ${
                      products.length >= tierInfo.maxProducts
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> เพิ่มสินค้าเข้าหน้าร้าน
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="flex gap-3">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-16 h-16 object-cover rounded-xl shrink-0 border border-slate-800" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        {prod.badge && (
                          <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md inline-block mb-1">
                            {prod.badge}
                          </span>
                        )}
                        <h5 className="font-bold text-sm text-slate-100 truncate">{prod.title}</h5>
                        <p className="text-xs text-slate-400 truncate">{prod.description || 'ไม่มีคำอธิบาย'}</p>
                        <p className="text-sm font-extrabold text-emerald-400 mt-1">฿{prod.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2 truncate">
                        <a href={prod.buy_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 truncate">
                          <ExternalLink className="w-3 h-3" /> ลิ้งก์สั่งซื้อ
                        </a>
                        {tierInfo.canQRCode && (
                          <button
                            onClick={() => openQrModal(prod.buy_url)}
                            className="p-1 text-purple-300 hover:bg-slate-800 rounded transition"
                            title="สร้าง QR Code สินค้านี้"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 9 MULTI-TEMPLATES & APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
              
              {savedMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" /> {savedMsg}
                </div>
              )}

              {/* 9 TEMPLATES SELECTION SECTION */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <label className="block text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4" /> เลือกเทมเพลตหน้าร้าน (9 Templates Live Selection)
                </label>
                
                {/* Free Templates (1-2) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Free Templates (Template 1 - 2)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'template_1', name: 'Template 1: Profile Showcase', desc: 'เน้นโปรไฟล์ โฮสต์วิดีโอ & สินค้า', isLocked: false },
                      { id: 'template_2', name: 'Template 2: Bento Grid', desc: 'การ์ด Bento เรียบหรู สะอาดตา', isLocked: false },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, template_id: tmpl.id })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition relative overflow-hidden ${
                          profile.template_id === tmpl.id
                            ? 'border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-400/20'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-white mb-1">{tmpl.name}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{tmpl.desc}</p>
                        </div>
                        {profile.template_id === tmpl.id && (
                          <span className="self-end mt-2 bg-emerald-400 text-slate-950 p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pro Templates (3-4) */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Pro Templates (Template 3 - 4)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'template_3', name: 'Template 3: Cyberpunk Studio', desc: 'สไตล์นีออนโกลว์ คอนทราสต์สูง', isLocked: !tierInfo.allowedTemplates.includes('template_3') },
                      { id: 'template_4', name: 'Template 4: EatPistakio Tabbed', desc: 'แท็บแยกหมวดหมู่ ลิ้งก์ & ร้านค้า', isLocked: !tierInfo.allowedTemplates.includes('template_4') },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, template_id: tmpl.id })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition relative overflow-hidden ${
                          profile.template_id === tmpl.id
                            ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        {tmpl.isLocked && (
                          <div className="absolute top-2 right-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-black flex items-center gap-1">
                            PREVIEW
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-white mb-1 pr-12">{tmpl.name}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{tmpl.desc}</p>
                        </div>
                        {profile.template_id === tmpl.id && (
                          <span className="self-end mt-2 bg-amber-400 text-slate-950 p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Master VIP Templates (5-9) */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> Master VIP Templates (Template 5 - 9)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'template_5', name: 'Template 5: Storefront Master', desc: 'เน้นแคตตาล็อกสินค้าหน้าร้าน', isLocked: !tierInfo.allowedTemplates.includes('template_5') },
                      { id: 'template_6', name: 'Template 6: Hybrid Motion', desc: 'การ์ด bento เคลื่อนไหวผสมผสาน', isLocked: !tierInfo.allowedTemplates.includes('template_6') },
                      { id: 'template_7', name: 'Template 7: Master Glass & Gradient', desc: 'สไตล์แท็บการ์ดแก้วไล่ระดับสีพรีเมียม', isLocked: !tierInfo.allowedTemplates.includes('template_7') },
                      { id: 'template_8', name: 'Template 8: Master Neo-Brutalist', desc: 'สไตล์แท็บขอบหนาสีสดใส สะดุดตา', isLocked: !tierInfo.allowedTemplates.includes('template_8') },
                      { id: 'template_9', name: 'Template 9: Master Luxury Gold', desc: 'สไตล์แท็บสีดำหรูตัดขอบทองคำ', isLocked: !tierInfo.allowedTemplates.includes('template_9') },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, template_id: tmpl.id })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition relative overflow-hidden ${
                          profile.template_id === tmpl.id
                            ? 'border-purple-400 bg-purple-500/10 ring-2 ring-purple-400/20'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        {tmpl.isLocked && (
                          <div className="absolute top-2 right-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded text-[9px] font-black flex items-center gap-1">
                            PREVIEW
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-white mb-1 pr-10">{tmpl.name}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{tmpl.desc}</p>
                        </div>
                        {profile.template_id === tmpl.id && (
                          <span className="self-end mt-2 bg-purple-400 text-slate-950 p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* HIDE BRANDING (FOR PRO & MASTER TIERS) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> ซ่อนโลโก้ผู้ให้บริการท้ายหน้า (Hide Branding)
                  </label>
                  {tierInfo.canHideBranding ? (
                    <input
                      type="checkbox"
                      checked={profile.hide_branding || false}
                      onChange={(e) => setProfile({ ...profile, hide_branding: e.target.checked })}
                      className="w-5 h-5 accent-amber-400 cursor-pointer"
                    />
                  ) : (
                    <span className="text-[10px] font-black bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded">
                      PRO / MASTER ONLY
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">ซ่อนข้อความ "สร้าง Bio Link ฟรีที่ MyBioLink" ที่ท้ายหน้าโปรไฟล์ (ใช้งานได้ในแพ็กเกจ Pro และ Master)</p>
              </div>

              {/* YOUTUBE EMBED (PRO & MASTER FEATURE) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                {!tierInfo.canEmbedYouTube && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-10 flex items-center justify-center p-2 text-center">
                    <span className="text-xs text-amber-300 font-bold bg-amber-400/20 border border-amber-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" /> ฝังวิดีโอ YouTube ปลดล็อกสำหรับสมาชิกระดับ Pro และ Master
                    </span>
                  </div>
                )}
                <label className="block text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-500" /> ฝังวิดีโอ YouTube (แสดงใต้อวาตาร์)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
                  value={profile.youtube_url || ''}
                  onChange={(e) => setProfile({ ...profile, youtube_url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* SOCIAL MEDIA FOOTER LINKS */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" /> ลิ้งก์ไอคอนโซเชียลมีเดีย (Social Footer)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                      <SocialIcon type="facebook" className="w-3.5 h-3.5 text-blue-500" /> Facebook URL
                    </span>
                    <input
                      type="url"
                      placeholder="https://facebook.com/yourpage"
                      value={profile.social_facebook || ''}
                      onChange={(e) => setProfile({ ...profile, social_facebook: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                      <SocialIcon type="instagram" className="w-3.5 h-3.5 text-pink-500" /> Instagram URL
                    </span>
                    <input
                      type="url"
                      placeholder="https://instagram.com/yourhandle"
                      value={profile.social_instagram || ''}
                      onChange={(e) => setProfile({ ...profile, social_instagram: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                      <SocialIcon type="tiktok" className="w-3.5 h-3.5 text-slate-200" /> TikTok URL
                    </span>
                    <input
                      type="url"
                      placeholder="https://tiktok.com/@yourhandle"
                      value={profile.social_tiktok || ''}
                      onChange={(e) => setProfile({ ...profile, social_tiktok: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                      <SocialIcon type="youtube" className="w-3.5 h-3.5 text-red-500" /> YouTube Channel
                    </span>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@yourchannel"
                      value={profile.social_youtube || ''}
                      onChange={(e) => setProfile({ ...profile, social_youtube: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                      <SocialIcon type="line" className="w-3.5 h-3.5 text-emerald-400" /> LINE Official URL
                    </span>
                    <input
                      type="url"
                      placeholder="https://line.me/ti/p/~yourline"
                      value={profile.social_line || ''}
                      onChange={(e) => setProfile({ ...profile, social_line: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                      <SocialIcon type="email" className="w-3.5 h-3.5 text-amber-400" /> Email Address
                    </span>
                    <input
                      type="email"
                      placeholder="contact@example.com"
                      value={profile.social_email || ''}
                      onChange={(e) => setProfile({ ...profile, social_email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Background Image Upload */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-emerald-400">ภาพพื้นหลังของโปรไฟล์ (Background Image)</label>
                <div className="space-y-3">
                  {profile.bg_image_url && (
                    <img src={profile.bg_image_url} alt="Background Preview" className="w-full h-24 object-cover rounded-xl border border-slate-800" />
                  )}
                  <div className="flex items-center gap-2">
                    <label className="flex-1 bg-slate-800 border border-slate-700 hover:border-emerald-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      {uploading === 'bg_image_url' ? 'กำลังอัปโหลด...' : 'อัปโหลดภาพพื้นหลังใหม่'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'bg_image_url')} />
                    </label>
                    {profile.bg_image_url && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, bg_image_url: '' })}
                        className="px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-semibold transition"
                      >
                        ลบภาพพื้นหลัง
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar & Cover Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">ภาพโปรไฟล์ (Avatar)</label>
                  <div className="flex items-center gap-3">
                    <img src={profile.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=preview'} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-emerald-500 shrink-0" />
                    <label className="bg-slate-800 border border-slate-700 hover:border-emerald-500 cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition">
                      {uploading === 'avatar_url' ? 'อัปโหลด...' : 'เปลี่ยนอวาตาร์'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'avatar_url')} />
                    </label>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">ภาพปกแบนเนอร์ (Cover Photo)</label>
                  <label className="w-full bg-slate-800 border border-slate-700 hover:border-emerald-500 cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 transition">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    {uploading === 'cover_url' ? 'อัปโหลด...' : 'เปลี่ยนภาพปก'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'cover_url')} />
                  </label>
                </div>
              </div>

              {/* Bio & Display Name */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อแสดงผล (Display Name)</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ข้อความแนะนำตัว (Bio)</label>
                  <textarea
                    rows={2}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm mt-4 shadow-lg"
                >
                  <Save className="w-4 h-4" /> บันทึกการเปลี่ยนแปลงโปรไฟล์ & เทมเพลต
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: LEADS & CUSTOMER DATABASE */}
          {activeTab === 'leads' && (
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> ฐานข้อมูลรายชื่อลูกค้า (Customer Leads)
                </h3>
                {leads.length > 0 && (
                  <button
                    onClick={exportLeadsCSV}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                )}
              </div>

              {leads.length === 0 ? (
                <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                  ยังไม่มีรายชื่อลูกค้าติดต่อเข้ามา รายชื่อจากการกรอกฟอร์มในหน้า Bio Link จะปรากฏตรงนี้
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((l) => (
                    <div key={l.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="font-bold text-sm text-slate-100">{l.name}</p>
                        <p className="text-slate-400">{l.email} • {l.phone}</p>
                        {l.note && <p className="text-slate-500 mt-1 italic">"{l.note}"</p>}
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono self-end sm:self-center">
                        {new Date(l.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BILLING & 3-TIER MEMBERSHIP */}
          {activeTab === 'billing' && (
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" /> ระบบสมาชิก 3 ระดับ และเติมแต้ม
                </h3>
                <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-extrabold rounded-xl flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" /> แต้มสะสม: {profile.points || 0} แต้ม
                </span>
              </div>

              {billingMsg && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl text-sm font-bold shadow-lg">
                  {billingMsg}
                </div>
              )}

              {/* Status Banner */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <p className="text-xs text-slate-400 font-semibold">สถานะสมาชิกปัจจุบันของคุณ:</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-amber-400 flex items-center gap-2">
                    {tierInfo.tier === 'master' ? (
                      <><Crown className="w-5 h-5 text-purple-400" /> MASTER VIP Member (ไม่จำกัด)</>
                    ) : tierInfo.tier === 'pro' ? (
                      <><Zap className="w-5 h-5 text-amber-400" /> PRO Member (10/10)</>
                    ) : (
                      'สมาชิกฟรี (Free Plan)'
                    )}
                  </span>
                  <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-xl">
                    ลิ้งก์: {links.length}/{tierInfo.maxLinks === 9999 ? '∞' : tierInfo.maxLinks} | สินค้า: {products.length}/{tierInfo.maxProducts === 9999 ? '∞' : tierInfo.maxProducts}
                  </span>
                </div>
              </div>

              {/* 3 Tiers Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Free Card */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs text-slate-400">1. ฟรี (Free Tier)</h4>
                  <ul className="text-[11px] text-slate-400 space-y-2 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> ลิ้งก์ 3 / สินค้า 2</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> เลือกเปิดใช้ได้ Template 1 - 2</li>
                  </ul>
                </div>

                {/* Pro Card */}
                <div className="p-4 bg-slate-950 border border-amber-400/40 rounded-2xl space-y-3 relative overflow-hidden shadow">
                  <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">POPULAR</span>
                  <h4 className="font-bold text-xs text-amber-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> 2. เสียเงิน (Pro Plan)</h4>
                  <ul className="text-[11px] text-slate-300 space-y-2 font-medium">
                    <li className="flex items-center gap-1.5 text-amber-300"><Check className="w-3.5 h-3.5 text-amber-400" /> ลิ้งก์ 10 / สินค้า 10</li>
                    <li className="flex items-center gap-1.5 text-amber-300"><Check className="w-3.5 h-3.5 text-amber-400" /> เลือกเปิดใช้ได้ Template 1 - 4</li>
                    <li className="flex items-center gap-1.5 text-amber-300"><Check className="w-3.5 h-3.5 text-amber-400" /> สี Box รายลิ้งก์ + ฝังวิดีโอ</li>
                    <li className="flex items-center gap-1.5 text-amber-300"><Check className="w-3.5 h-3.5 text-amber-400" /> สั่งซ่อน Branding ท้ายหน้าได้</li>
                  </ul>
                </div>

                {/* Master Card */}
                <div className="p-4 bg-slate-950 border-2 border-purple-500/50 rounded-2xl space-y-3 relative overflow-hidden shadow-lg shadow-purple-500/10">
                  <span className="absolute top-2 right-2 bg-purple-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">UNLIMITED</span>
                  <h4 className="font-bold text-xs text-purple-300 flex items-center gap-1"><Crown className="w-3.5 h-3.5" /> 3. Master VIP</h4>
                  <ul className="text-[11px] text-slate-200 space-y-2 font-medium">
                    <li className="flex items-center gap-1.5 text-purple-300"><Check className="w-3.5 h-3.5 text-purple-400" /> ลิ้งก์และสินค้าไม่จำกัด</li>
                    <li className="flex items-center gap-1.5 text-purple-300"><Check className="w-3.5 h-3.5 text-purple-400" /> ปลดล็อกครบทั้ง 9 เทมเพลต</li>
                    <li className="flex items-center gap-1.5 text-purple-300"><Check className="w-3.5 h-3.5 text-purple-400" /> ระบบสร้าง QR Code ส่วนตัว</li>
                    <li className="flex items-center gap-1.5 text-purple-300"><Check className="w-3.5 h-3.5 text-purple-400" /> ซ่อน Branding + Export CSV</li>
                  </ul>
                </div>
              </div>

              {/* Actions: Top Up & Buy Options */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-emerald-400">ระบบเติมแต้มและสั่งซื้อแพ็กเกจ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleBuyPro}
                    className="py-3 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Zap className="w-4 h-4" /> ซื้อ Pro (100 แต้ม)
                  </button>

                  <button
                    onClick={handleBuyMaster}
                    className="py-3 px-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
                  >
                    <Crown className="w-4 h-4" /> ซื้อ Master (250 แต้ม)
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 text-center">หากแต้มไม่เพียงพอ กรุณาติดต่อ Admin เพื่อแจ้งเติมแต้มชำระเงิน</p>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Live Mobile Preview Simulation with Template Renderer */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-[36px] overflow-hidden shadow-2xl">
            <div className="p-1">
              <TemplateRenderer
                profile={profile}
                links={links}
                products={products}
                handleLinkClick={() => {}}
                isDashboardPreview={true}
              />
            </div>
            <div className="bg-slate-950 py-2 text-center text-[10px] text-slate-600 font-mono flex items-center justify-center gap-1">
              <RefreshCw className="w-3 h-3 text-emerald-400" /> Dashboard Live Preview ({profile.template_id || 'template_1'})
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
