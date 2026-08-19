'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ShieldCheck, Users, Rocket, Sun, Moon, Coins, Crown, Zap, Search, Plus, 
  Edit3, ArrowLeft, Check, AlertCircle, Lock, RefreshCw, Eye, X, 
  Trash2, ExternalLink, Link2, ShoppingBag, Settings, Scissors, 
  Copy, BarChart3, Database, Filter, Download, CheckCircle2, 
  UserPlus, PackagePlus, Globe, Sparkles
} from 'lucide-react'

type AdminTab = 'users' | 'links' | 'products' | 'shortlinks' | 'leads' | 'system'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [isDarkMode, setIsDarkMode] = useState(false)

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
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [adminProfile, setAdminProfile] = useState<any>(null)
  
  // Data States
  const [usersList, setUsersList] = useState<any[]>([])
  const [allLinks, setAllLinks] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [allShortLinks, setAllShortLinks] = useState<any[]>([])
  const [allLeads, setAllLeads] = useState<any[]>([])
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterTier, setFilterTier] = useState<string>('all')
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all')
  const [statusMsg, setStatusMsg] = useState('')
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  // Modals for USERS
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
    role: 'user',
    points: 100,
    tier: 'free'
  })
  const [editingUser, setEditingUser] = useState<any>(null)
  const [pointsModalUser, setPointsModalUser] = useState<any>(null)
  const [customPointsInput, setCustomPointsInput] = useState<string>('100')
  const [grantModalUser, setGrantModalUser] = useState<any>(null)
  const [grantTierSelect, setGrantTierSelect] = useState<'free' | 'pro' | 'master' | 'shortener'>('free')
  const [grantDaysInput, setGrantDaysInput] = useState<string>('30')
  const [deleteUserModal, setDeleteUserModal] = useState<any>(null)

  // Modals for LINKS
  const [createLinkModalOpen, setCreateLinkModalOpen] = useState(false)
  const [newLinkForm, setNewLinkForm] = useState({
    user_id: '',
    title: '',
    subtitle: '',
    url: '',
    icon: 'facebook',
    bg_color: '#1e293b',
    text_color: '#ffffff',
    is_active: true
  })
  const [editingLink, setEditingLink] = useState<any>(null)
  const [deleteLinkModal, setDeleteLinkModal] = useState<any>(null)

  // Modals for PRODUCTS
  const [createProductModalOpen, setCreateProductModalOpen] = useState(false)
  const [newProductForm, setNewProductForm] = useState({
    user_id: '',
    title: '',
    description: '',
    price: '0',
    currency: 'THB',
    category: 'ทั่วไป',
    image_url: '',
    buy_url: '',
    badge: '',
    is_active: true
  })
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deleteProductModal, setDeleteProductModal] = useState<any>(null)

  // Modals & Form for SHORT LINKS
  const [createShortLinkModalOpen, setCreateShortLinkModalOpen] = useState(false)
  const [newShortLinkForm, setNewShortLinkForm] = useState({
    original_url: '',
    slug: '',
    title: '',
    is_active: true
  })
  const [editingShortLink, setEditingShortLink] = useState<any>(null)
  const [deleteShortLinkModal, setDeleteShortLinkModal] = useState<any>(null)

  // Lead Delete Modal
  const [deleteLeadModal, setDeleteLeadModal] = useState<any>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

    setCurrentUser(session.user)

    // Check Admin Role
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!prof || prof.role !== 'admin') {
      setAdminProfile(prof)
      setLoading(false)
      return
    }

    setAdminProfile(prof)
    await loadAllData()
    setLoading(false)
  }

  const loadAllData = async () => {
    const { data: pData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (pData) setUsersList(pData)

    const { data: lData } = await supabase
      .from('links')
      .select('*, profiles(username, full_name)')
      .order('created_at', { ascending: false })
    if (lData) setAllLinks(lData)

    const { data: prData } = await supabase
      .from('products')
      .select('*, profiles(username, full_name)')
      .order('created_at', { ascending: false })
    if (prData) setAllProducts(prData)

    const { data: slData } = await supabase
      .from('short_links')
      .select('*')
      .order('created_at', { ascending: false })
    if (slData) setAllShortLinks(slData)

    const { data: ldData } = await supabase
      .from('leads')
      .select('*, profiles(username, full_name)')
      .order('created_at', { ascending: false })
    if (ldData) setAllLeads(ldData)
  }

  const showNotification = (msg: string) => {
    setStatusMsg(msg)
    setTimeout(() => setStatusMsg(''), 5000)
  }

  // 1. USER ACTIONS
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUserForm.email,
        password: newUserForm.password,
        options: {
          data: {
            username: newUserForm.username.toLowerCase().trim(),
            full_name: newUserForm.full_name || newUserForm.username,
            role: newUserForm.role
          }
        }
      })

      if (error) {
        alert(`❌ ไม่สามารถสร้างผู้ใช้ได้: ${error.message}`)
        return
      }

      if (data?.user) {
        const updates: any = {
          points: Number(newUserForm.points) || 0,
          role: newUserForm.role
        }

        if (newUserForm.tier === 'pro') {
          updates.pro_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        } else if (newUserForm.tier === 'master') {
          updates.master_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }

        await supabase.from('profiles').update(updates).eq('id', data.user.id)
      }

      showNotification(`✅ สร้างผู้ใช้งาน @${newUserForm.username} สำเร็จแล้ว!`)
      setCreateUserModalOpen(false)
      setNewUserForm({
        email: '',
        password: '',
        username: '',
        full_name: '',
        role: 'user',
        points: 100,
        tier: 'free'
      })
      await loadAllData()
    } catch (err: any) {
      alert(`❌ เกิดข้อผิดพลาด: ${err.message}`)
    }
  }

  const handleSaveUserProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      let pro_exp = editingUser.pro_expires_at
      let master_exp = editingUser.master_expires_at
      let shortener_exp = editingUser.shortener_expires_at

      if (editingUser.tier_selection === 'free') {
        pro_exp = null
        master_exp = null
        shortener_exp = null
      } else if (editingUser.tier_selection === 'pro') {
        pro_exp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        master_exp = null
      } else if (editingUser.tier_selection === 'master') {
        master_exp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        pro_exp = null
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: editingUser.username.toLowerCase().trim(),
          full_name: editingUser.full_name,
          bio: editingUser.bio,
          role: editingUser.role,
          points: parseInt(editingUser.points || '0', 10),
          template_id: editingUser.template_id || 'template_1',
          hide_branding: Boolean(editingUser.hide_branding),
          pro_expires_at: pro_exp,
          master_expires_at: master_exp,
          shortener_expires_at: shortener_exp,
          avatar_url: editingUser.avatar_url,
          cover_url: editingUser.cover_url,
          bg_image_url: editingUser.bg_image_url,
          youtube_url: editingUser.youtube_url,
          social_facebook: editingUser.social_facebook,
          social_instagram: editingUser.social_instagram,
          social_tiktok: editingUser.social_tiktok,
          social_youtube: editingUser.social_youtube,
          social_line: editingUser.social_line,
          social_shopee: editingUser.social_shopee,
          social_lazada: editingUser.social_lazada,
          social_x: editingUser.social_x,
          social_pinterest: editingUser.social_pinterest,
          social_email: editingUser.social_email,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)

      if (error) {
        alert(`❌ ไม่สามารถอัปเดตข้อมูลได้: ${error.message}`)
        return
      }

      showNotification(`✅ อัปเดตข้อมูลของ @${editingUser.username} เรียบร้อยแล้ว!`)
      setEditingUser(null)
      await loadAllData()
    } catch (err: any) {
      alert(`❌ เกิดข้อผิดพลาด: ${err.message}`)
    }
  }

  const handleApplyCustomPoints = async () => {
    if (!pointsModalUser) return
    const amount = parseInt(customPointsInput, 10)
    if (isNaN(amount)) return

    try {
      const { error } = await supabase.rpc('admin_add_points', {
        target_user_id: pointsModalUser.id,
        amount
      })

      if (error) {
        const newPts = Math.max(0, (pointsModalUser.points || 0) + amount)
        await supabase.from('profiles').update({ points: newPts }).eq('id', pointsModalUser.id)
      }

      showNotification(`✅ ปรับแต้มของ @${pointsModalUser.username} จำนวน ${amount >= 0 ? '+' : ''}${amount} แต้มแล้ว!`)
      setPointsModalUser(null)
      await loadAllData()
    } catch (e) {}
  }

  const handleApplyGrantSubscription = async () => {
    if (!grantModalUser) return
    const days = parseInt(grantDaysInput, 10) || 30

    try {
      const { error } = await supabase.rpc('admin_grant_subscription', {
        target_user_id: grantModalUser.id,
        tier_type: grantTierSelect,
        duration_days: days
      })

      if (error) {
        const newExp = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
        let updateField: any = { pro_expires_at: newExp }
        if (grantTierSelect === 'master') updateField = { master_expires_at: newExp }
        if (grantTierSelect === 'shortener') updateField = { shortener_expires_at: newExp }
        await supabase.from('profiles').update(updateField).eq('id', grantModalUser.id)
      }

      showNotification(`✅ มอบสิทธิ์ ${grantTierSelect.toUpperCase()} ให้ @${grantModalUser.username} (${days} วัน) แล้ว!`)
      setGrantModalUser(null)
      await loadAllData()
    } catch (e) {}
  }

  const handleDeleteUserConfirm = async () => {
    if (!deleteUserModal) return
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', deleteUserModal.id)
      if (error) {
        alert(`❌ ไม่สามารถลบผู้ใช้ได้: ${error.message}`)
        return
      }

      showNotification(`🗑️ ลบผู้ใช้ @${deleteUserModal.username} และข้อมูลทั้งหมดสำเร็จ`)
      setDeleteUserModal(null)
      await loadAllData()
    } catch (err: any) {
      alert(`❌ ข้อผิดพลาด: ${err.message}`)
    }
  }

  // 2. LINKS ACTIONS
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLinkForm.user_id || !newLinkForm.title || !newLinkForm.url) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    const { error } = await supabase.from('links').insert([{
      user_id: newLinkForm.user_id,
      title: newLinkForm.title,
      subtitle: newLinkForm.subtitle,
      url: newLinkForm.url,
      icon: newLinkForm.icon,
      bg_color: newLinkForm.bg_color,
      text_color: newLinkForm.text_color,
      is_active: newLinkForm.is_active
    }])

    if (!error) {
      showNotification('✅ เพิ่มลิงก์ใหม่ให้ผู้ใช้เรียบร้อยแล้ว!')
      setCreateLinkModalOpen(false)
      setNewLinkForm({
        user_id: '',
        title: '',
        subtitle: '',
        url: '',
        icon: 'facebook',
        bg_color: '#1e293b',
        text_color: '#ffffff',
        is_active: true
      })
      await loadAllData()
    } else {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`)
    }
  }

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLink) return

    const { error } = await supabase.from('links').update({
      title: editingLink.title,
      subtitle: editingLink.subtitle,
      url: editingLink.url,
      icon: editingLink.icon,
      bg_color: editingLink.bg_color,
      text_color: editingLink.text_color,
      clicks: parseInt(editingLink.clicks || 0, 10),
      is_active: Boolean(editingLink.is_active)
    }).eq('id', editingLink.id)

    if (!error) {
      showNotification('✅ อัปเดตข้อมูลลิ้งก์เรียบร้อยแล้ว!')
      setEditingLink(null)
      await loadAllData()
    } else {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`)
    }
  }

  const handleDeleteLink = async () => {
    if (!deleteLinkModal) return
    const { error } = await supabase.from('links').delete().eq('id', deleteLinkModal.id)
    if (!error) {
      showNotification('🗑️ ลบลิ้งก์สำเร็จ')
      setDeleteLinkModal(null)
      await loadAllData()
    }
  }

  // 3. PRODUCTS ACTIONS
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductForm.user_id || !newProductForm.title || !newProductForm.buy_url) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    const { error } = await supabase.from('products').insert([{
      user_id: newProductForm.user_id,
      title: newProductForm.title,
      description: newProductForm.description,
      price: parseFloat(newProductForm.price) || 0,
      currency: newProductForm.currency || 'THB',
      category: newProductForm.category || 'ทั่วไป',
      image_url: newProductForm.image_url,
      buy_url: newProductForm.buy_url,
      badge: newProductForm.badge,
      is_active: newProductForm.is_active
    }])

    if (!error) {
      showNotification('✅ เพิ่มสินค้าใหม่ให้ผู้ใช้เรียบร้อยแล้ว!')
      setCreateProductModalOpen(false)
      setNewProductForm({
        user_id: '',
        title: '',
        description: '',
        price: '0',
        currency: 'THB',
        category: 'ทั่วไป',
        image_url: '',
        buy_url: '',
        badge: '',
        is_active: true
      })
      await loadAllData()
    } else {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`)
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const { error } = await supabase.from('products').update({
      title: editingProduct.title,
      description: editingProduct.description,
      price: parseFloat(editingProduct.price) || 0,
      currency: editingProduct.currency || 'THB',
      category: editingProduct.category,
      image_url: editingProduct.image_url,
      buy_url: editingProduct.buy_url,
      badge: editingProduct.badge,
      is_active: Boolean(editingProduct.is_active)
    }).eq('id', editingProduct.id)

    if (!error) {
      showNotification('✅ อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว!')
      setEditingProduct(null)
      await loadAllData()
    } else {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`)
    }
  }

  const handleDeleteProduct = async () => {
    if (!deleteProductModal) return
    const { error } = await supabase.from('products').delete().eq('id', deleteProductModal.id)
    if (!error) {
      showNotification('🗑️ ลบสินค้าสำเร็จ')
      setDeleteProductModal(null)
      await loadAllData()
    }
  }

  // 4. SHORT LINKS ACTIONS
  const generateRandomSlug = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
    let res = ''
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return res
  }

  const handleCreateShortLink = async (e: React.FormEvent) => {
    e.preventDefault()
    let slug = newShortLinkForm.slug.trim().toLowerCase()
    if (!slug) {
      slug = generateRandomSlug()
    }

    slug = slug.replace(/[^a-z0-9-_]/g, '')
    if (!slug) {
      alert('รูปแบบ Slug ไม่ถูกต้อง (ใช้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข ขีดกลาง - หรือ _)')
      return
    }

    let rawUrl = newShortLinkForm.original_url.trim()
    if (!rawUrl) {
      alert('กรุณาระบุ URL ปลายทางที่ต้องการย่อ')
      return
    }

    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl
    }

    const { error } = await supabase.from('short_links').insert([{
      slug,
      original_url: rawUrl,
      title: newShortLinkForm.title.trim() || slug,
      is_active: newShortLinkForm.is_active,
      created_by: adminProfile?.id
    }])

    if (!error) {
      showNotification(`✅ สร้างลิงก์ย่อ /s/${slug} สำเร็จแล้ว!`)
      setCreateShortLinkModalOpen(false)
      setNewShortLinkForm({
        original_url: '',
        slug: '',
        title: '',
        is_active: true
      })
      await loadAllData()
    } else {
      if (error.message.includes('unique') || error.code === '23505') {
        alert(`❌ รหัส Slug "${slug}" นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น`)
      } else {
        alert(`❌ ไม่สามารถสร้างลิงก์ย่อได้: ${error.message}`)
      }
    }
  }

  const handleUpdateShortLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShortLink) return

    let slug = editingShortLink.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
    let rawUrl = editingShortLink.original_url.trim()
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl
    }

    const { error } = await supabase.from('short_links').update({
      slug,
      original_url: rawUrl,
      title: editingShortLink.title,
      clicks: parseInt(editingShortLink.clicks || 0, 10),
      is_active: Boolean(editingShortLink.is_active),
      updated_at: new Date().toISOString()
    }).eq('id', editingShortLink.id)

    if (!error) {
      showNotification('✅ อัปเดตข้อมูลลิงก์ย่อเรียบร้อยแล้ว!')
      setEditingShortLink(null)
      await loadAllData()
    } else {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`)
    }
  }

  const handleDeleteShortLink = async () => {
    if (!deleteShortLinkModal) return
    const { error } = await supabase.from('short_links').delete().eq('id', deleteShortLinkModal.id)
    if (!error) {
      showNotification('🗑️ ลบลิงก์ย่อสำเร็จ')
      setDeleteShortLinkModal(null)
      await loadAllData()
    }
  }

  const handleCopyShortLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const fullUrl = `${origin}/s/${slug}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedSlug(slug)
    showNotification(`📋 คัดลอกลิงก์ย่อ: ${fullUrl}`)
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  // 5. LEADS ACTIONS
  const handleDeleteLead = async () => {
    if (!deleteLeadModal) return
    const { error } = await supabase.from('leads').delete().eq('id', deleteLeadModal.id)
    if (!error) {
      showNotification('🗑️ ลบข้อมูล Lead เรียบร้อยแล้ว')
      setDeleteLeadModal(null)
      await loadAllData()
    }
  }

  const handleExportLeadsCSV = () => {
    if (allLeads.length === 0) {
      alert('ไม่มีข้อมูล Leads ให้ส่งออก')
      return
    }

    const headers = ['ID', 'Owner Username', 'Name', 'Phone', 'Email', 'Note', 'Created At']
    const rows = allLeads.map(l => [
      l.id,
      l.profiles?.username || '',
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.note || '').replace(/"/g, '""')}"`,
      l.created_at
    ])

    const csvContent = '\\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
          <span>กำลังโหลดระบบจัดการหลังบ้านผู้ดูแลระบบ (Admin Master Panel)...</span>
        </div>
      </div>
    )
  }

  if (adminProfile && adminProfile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="p-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-3xl flex flex-col items-center gap-3 max-w-md">
          <AlertCircle className="w-10 h-10 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-white">คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Access Required)</h2>
            <p className="text-xs text-slate-400 mt-2">
              บัญชี @{adminProfile.username} ไม่ได้รับสิทธิ์ผู้ดูแลระบบ (Role: {adminProfile.role || 'user'})
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
        </button>
      </div>
    )
  }

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    const isPro = u.pro_expires_at && new Date(u.pro_expires_at).getTime() > Date.now()
    const isMaster = u.master_expires_at && new Date(u.master_expires_at).getTime() > Date.now()
    
    let matchesTier = true
    if (filterTier === 'pro') matchesTier = isPro && !isMaster
    if (filterTier === 'master') matchesTier = isMaster
    if (filterTier === 'free') matchesTier = !isPro && !isMaster

    return matchesSearch && matchesRole && matchesTier
  })

  const filteredLinks = allLinks.filter(l => {
    const matchesSearch = (l.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (l.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (l.profiles?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUser = selectedUserFilter === 'all' || l.user_id === selectedUserFilter
    return matchesSearch && matchesUser
  })

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.profiles?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUser = selectedUserFilter === 'all' || p.user_id === selectedUserFilter
    return matchesSearch && matchesUser
  })

  const filteredShortLinks = allShortLinks.filter(sl => {
    return (sl.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (sl.original_url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (sl.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredLeads = allLeads.filter(ld => {
    const matchesSearch = (ld.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ld.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ld.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ld.profiles?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUser = selectedUserFilter === 'all' || ld.user_id === selectedUserFilter
    return matchesSearch && matchesUser
  })

  const totalClicksAcrossShortLinks = allShortLinks.reduce((acc, sl) => acc + (sl.clicks || 0), 0)

  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-slate-100 font-sans pb-16 transition-colors duration-300">
      
      {/* Top Admin Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2.5 rounded-2xl text-white font-bold shadow-md shadow-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-[#1E1B4B] dark:text-white">ระบบจัดการหลังบ้านผู้ดูแลระบบ (Admin Suite)</span>
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-[10px] font-black">MASTER ADMIN</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">กำลังใช้งานโดย @{adminProfile?.username}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:border-purple-300 transition shadow-sm"
              title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => {
                setLoading(true)
                loadAllData().then(() => setLoading(false))
              }}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl transition shadow-sm"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-3.5 py-2 bg-[#1E1B4B] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> แดชบอร์ดผู้ใช้
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> สมาชิกทั้งหมด
            </p>
            <p className="text-xl font-black text-white">{usersList.length} <span className="text-xs font-normal text-slate-400">คน</span></p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-purple-400" /> สมาชิก VIP
            </p>
            <p className="text-xl font-black text-purple-400">
              {usersList.filter(u => (u.master_expires_at && new Date(u.master_expires_at).getTime() > Date.now()) || (u.pro_expires_at && new Date(u.pro_expires_at).getTime() > Date.now())).length} <span className="text-xs font-normal text-slate-400">คน</span>
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-blue-400" /> ลิ้งก์ทั้งหมด
            </p>
            <p className="text-xl font-black text-blue-400">{allLinks.length} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> สินค้าทั้งหมด
            </p>
            <p className="text-xl font-black text-amber-400">{allProducts.length} <span className="text-xs font-normal text-slate-400">ชิ้น</span></p>
          </div>

          <div className="bg-slate-900 border border-purple-500/40 bg-purple-950/20 p-4 rounded-2xl space-y-1">
            <p className="text-[11px] text-purple-300 font-semibold flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 text-purple-400" /> ลิงก์ย่อทั้งหมด
            </p>
            <p className="text-xl font-black text-purple-300">{allShortLinks.length} <span className="text-xs font-normal text-slate-400">ลิงก์</span></p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> ยอดคลิกลิงก์ย่อ
            </p>
            <p className="text-xl font-black text-emerald-400">{totalClicksAcrossShortLinks} <span className="text-xs font-normal text-slate-400">ครั้ง</span></p>
          </div>
        </div>

        {/* Global Notification Banner */}
        {statusMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg('')} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> จัดการสมาชิก ({usersList.length})
          </button>

          <button
            onClick={() => { setActiveTab('shortlinks'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'shortlinks' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scissors className="w-4 h-4" /> ระบบย่อลิงก์ ({allShortLinks.length})
          </button>

          <button
            onClick={() => { setActiveTab('links'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'links' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Link2 className="w-4 h-4" /> ลิ้งก์ทั้งหมด ({allLinks.length})
          </button>

          <button
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'products' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> สินค้าทั้งหมด ({allProducts.length})
          </button>

          <button
            onClick={() => { setActiveTab('leads'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'leads' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" /> ลูกค้า Leads ({allLeads.length})
          </button>

          <button
            onClick={() => { setActiveTab('system'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'system' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" /> ข้อมูลระบบ & SQL
          </button>
        </div>

        {/* TAB 1: USERS */}
        {activeTab === 'users' && (
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> สมาชิกและโปรไฟล์ผู้ใช้งานทั้งหมด (Users CRUD)
                </h3>
                <p className="text-xs text-slate-400">ค้นหา เพิ่ม แก้ไข เติมแต้ม มอบสิทธิ์ VIP และลบผู้ใช้ได้โดยตรง</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setCreateUserModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <UserPlus className="w-4 h-4" /> เพิ่มผู้ใช้ใหม่
                </button>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">บทบาท: ทั้งหมด</option>
                  <option value="user">User ทั่วไป</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">แพ็กเกจ: ทั้งหมด</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro Member</option>
                  <option value="master">Master VIP</option>
                </select>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 grow md:grow-0">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ค้นหา username / ชื่อ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-48 bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                    <th className="p-3">ผู้ใช้งาน (Username / Display Name)</th>
                    <th className="p-3">บทบาท</th>
                    <th className="p-3">แต้มสะสม</th>
                    <th className="p-3">สถานะแพ็กเกจ</th>
                    <th className="p-3">วันที่สมัคร</th>
                    <th className="p-3 text-right">เครื่องมือ Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                        ไม่พบข้อมูลผู้ใช้งานที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isUserMaster = u.master_expires_at && new Date(u.master_expires_at).getTime() > Date.now()
                      const isUserPro = u.pro_expires_at && new Date(u.pro_expires_at).getTime() > Date.now()

                      return (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                                alt="Avatar"
                                className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-white text-sm">{u.full_name || u.username}</p>
                                <p className="text-slate-400 text-[11px]">@{u.username}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            {u.role === 'admin' ? (
                              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 font-extrabold rounded-md text-[10px]">
                                ADMIN
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 rounded-md text-[10px]">
                                USER
                              </span>
                            )}
                          </td>

                          <td className="p-3 font-extrabold text-amber-300 text-sm">
                            {u.points || 0} แต้ม
                          </td>

                          <td className="p-3">
                            {isUserMaster ? (
                              <span className="px-2.5 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold rounded-xl text-[10px] inline-flex items-center gap-1">
                                <Crown className="w-3 h-3 text-purple-400" /> MASTER VIP
                              </span>
                            ) : isUserPro ? (
                              <span className="px-2.5 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold rounded-xl text-[10px] inline-flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-400" /> PRO Member
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-slate-800 text-slate-400 rounded-xl text-[10px]">
                                Free Plan
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-slate-400 text-[11px]">
                            {new Date(u.created_at).toLocaleDateString('th-TH')}
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <a
                                href={`/${u.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl transition"
                                title="ดูหน้าโปรไฟล์สาธารณะ"
                              >
                                <Eye className="w-4 h-4" />
                              </a>

                              <button
                                onClick={() => {
                                  setPointsModalUser(u)
                                  setCustomPointsInput('100')
                                }}
                                className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-[11px] transition flex items-center gap-1"
                                title="เติม/ปรับแต้ม"
                              >
                                <Coins className="w-3.5 h-3.5" /> แต้ม
                              </button>

                              <button
                                onClick={() => {
                                  setGrantModalUser(u)
                                  setGrantDaysInput('30')
                                }}
                                className="px-2.5 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-[11px] transition flex items-center gap-1"
                                title="มอบสิทธิ์ VIP"
                              >
                                <Crown className="w-3.5 h-3.5" /> VIP
                              </button>

                              <button
                                onClick={() => setEditingUser({ ...u })}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
                                title="แก้ไขข้อมูลโปรไฟล์"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeleteUserModal(u)}
                                className="p-2 bg-slate-800 hover:bg-red-950 text-red-400 rounded-xl transition"
                                title="ลบผู้ใช้งาน"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SHORT LINKS */}
        {activeTab === 'shortlinks' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-500 text-slate-950 rounded-xl font-bold">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">ระบบย่อลิงค์ URL Shortener (แปลงเป็นชื่อที่ต้องการ)</h3>
                    <p className="text-xs text-purple-300">ใส่ลิงก์ปลายทางยาวๆ แล้วตั้งชื่อย่อตามใจชอบเพื่อแชร์ต่อได้ทันที</p>
                  </div>
                </div>

                <button
                  onClick={() => setCreateShortLinkModalOpen(true)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" /> สร้างลิงก์ย่อใหม่
                </button>
              </div>

              <form onSubmit={handleCreateShortLink} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
                <div className="md:col-span-5">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">URL ปลายทางที่ต้องการย่อ (Original URL)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://facebook.com/groups/123456789/..."
                    value={newShortLinkForm.original_url}
                    onChange={(e) => setNewShortLinkForm({ ...newShortLinkForm, original_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-300">รหัสย่อที่ต้องการ (Slug)</label>
                    <button
                      type="button"
                      onClick={() => setNewShortLinkForm({ ...newShortLinkForm, slug: generateRandomSlug() })}
                      className="text-[10px] text-purple-400 hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" /> สุ่มอัตโนมัติ
                    </button>
                  </div>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
                    <span className="text-[11px] text-slate-500 font-mono">/s/</span>
                    <input
                      type="text"
                      placeholder="เช่น promo, fb, vip"
                      value={newShortLinkForm.slug}
                      onChange={(e) => setNewShortLinkForm({ ...newShortLinkForm, slug: e.target.value })}
                      className="w-full bg-transparent text-xs text-amber-300 font-mono font-bold focus:outline-none px-1"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">ชื่อกำกับ / หมายเหตุ</label>
                  <input
                    type="text"
                    placeholder="เช่น โปรโมชั่น 8.8"
                    value={newShortLinkForm.title}
                    onChange={(e) => setNewShortLinkForm({ ...newShortLinkForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Scissors className="w-4 h-4" /> ย่อลิงก์ทันที
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-purple-400" /> รายการลิงก์ย่อทั้งหมด ({allShortLinks.length})
                  </h3>
                  <p className="text-xs text-slate-400">คลิกปุ่มคัดลอกเพื่อนำลิงก์ไปใช้งาน พร้อมดูสถิติจำนวนครั้งที่คลิกแบบเรียลไทม์</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ค้นหา Slug / URL / ชื่อ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                      <th className="p-3">ลิงก์ย่อ (Short URL)</th>
                      <th className="p-3">URL ปลายทาง (Destination URL)</th>
                      <th className="p-3">ชื่อกำกับ / บันทึก</th>
                      <th className="p-3 text-center">ยอดคลิก</th>
                      <th className="p-3">สถานะ</th>
                      <th className="p-3">วันที่สร้าง</th>
                      <th className="p-3 text-right">เครื่องมือจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredShortLinks.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                          ยังไม่มีรายการลิงก์ย่อ หรือไม่พบผลการค้นหา
                        </td>
                      </tr>
                    ) : (
                      filteredShortLinks.map((sl) => {
                        const origin = typeof window !== 'undefined' ? window.location.origin : ''
                        const shortUrl = `${origin}/s/${sl.slug}`
                        const isCopied = copiedSlug === sl.slug

                        return (
                          <tr key={sl.id} className="hover:bg-slate-800/40 transition">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-lg text-xs">
                                  /s/{sl.slug}
                                </span>
                                <button
                                  onClick={() => handleCopyShortLink(sl.slug)}
                                  className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                                    isCopied ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                  }`}
                                  title="คัดลอกลิงก์ย่อ"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>

                            <td className="p-3 max-w-xs truncate">
                              <a
                                href={sl.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-300 hover:text-emerald-400 transition truncate block flex items-center gap-1"
                                title={sl.original_url}
                              >
                                <span className="truncate">{sl.original_url}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                              </a>
                            </td>

                            <td className="p-3 font-semibold text-white">
                              {sl.title || '-'}
                            </td>

                            <td className="p-3 text-center">
                              <span className="font-black text-sm text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                {sl.clicks || 0}
                              </span>
                            </td>

                            <td className="p-3">
                              {sl.is_active ? (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                                  เปิดใช้งาน
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[10px] font-bold">
                                  ปิดใช้งาน
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-slate-400 text-[11px]">
                              {new Date(sl.created_at).toLocaleDateString('th-TH')}
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`/s/${sl.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition"
                                  title="ทดสอบเปิดลิงก์ย่อ"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() => setEditingShortLink({ ...sl })}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                                  title="แก้ไขลิงก์ย่อ"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setDeleteShortLinkModal(sl)}
                                  className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition"
                                  title="ลบลิงก์ย่อ"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LINKS */}
        {activeTab === 'links' && (
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-400" /> จัดการลิ้งก์ทั้งหมดในระบบ (Links CRUD)
                </h3>
                <p className="text-xs text-slate-400">ตรวจสอบ แก้ไข และลบลิ้งก์ของสมาชิกทุกคน</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setCreateLinkModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" /> เพิ่มลิ้งก์ใหม่
                </button>

                <select
                  value={selectedUserFilter}
                  onChange={(e) => setSelectedUserFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">เจ้าของ: ทุกคน</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>@{u.username}</option>
                  ))}
                </select>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ / URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-48 bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                    <th className="p-3">เจ้าของลิ้งก์</th>
                    <th className="p-3">ชื่อปุ่ม / หัวข้อย่อย</th>
                    <th className="p-3">URL ปลายทาง</th>
                    <th className="p-3">ไอคอน & สี</th>
                    <th className="p-3 text-center">ยอดคลิก</th>
                    <th className="p-3">สถานะ</th>
                    <th className="p-3 text-right">เครื่องมือ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLinks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        ไม่พบรายการลิ้งก์
                      </td>
                    </tr>
                  ) : (
                    filteredLinks.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3">
                          <span className="font-bold text-emerald-400">@{l.profiles?.username || 'user'}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-white">{l.title}</p>
                          {l.subtitle && <p className="text-slate-400 text-[10px]">{l.subtitle}</p>}
                        </td>
                        <td className="p-3 max-w-xs truncate">
                          <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 truncate flex items-center gap-1">
                            <span className="truncate">{l.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] uppercase font-mono">{l.icon || 'link'}</span>
                            <div className="w-4 h-4 rounded border border-slate-700" style={{ backgroundColor: l.bg_color || '#1e293b' }}></div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-400">
                          {l.clicks || 0}
                        </td>
                        <td className="p-3">
                          {l.is_active ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">เปิดใช้งาน</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded text-[10px]">ปิด</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingLink({ ...l })}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                              title="แก้ไขลิ้งก์"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteLinkModal(l)}
                              className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition"
                              title="ลบลิ้งก์"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" /> จัดการสินค้าทั้งหมดในระบบ (Products CRUD)
                </h3>
                <p className="text-xs text-slate-400">ตรวจสอบ แก้ไข และลบรายการสินค้าในหน้าร้านของสมาชิก</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setCreateProductModalOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <PackagePlus className="w-4 h-4" /> เพิ่มสินค้าใหม่
                </button>

                <select
                  value={selectedUserFilter}
                  onChange={(e) => setSelectedUserFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">เจ้าของ: ทุกคน</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>@{u.username}</option>
                  ))}
                </select>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อสินค้า / หมวดหมู่..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-48 bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                    <th className="p-3">รูปภาพ & ชื่อสินค้า</th>
                    <th className="p-3">เจ้าของ</th>
                    <th className="p-3">หมวดหมู่</th>
                    <th className="p-3">ราคา</th>
                    <th className="p-3">ป้าย Badge</th>
                    <th className="p-3">สถานะ</th>
                    <th className="p-3 text-right">เครื่องมือ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        ไม่พบรายการสินค้า
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.title} className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white text-sm">{p.title}</p>
                              {p.description && <p className="text-slate-400 text-[10px] truncate max-w-xs">{p.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-purple-400">@{p.profiles?.username || 'user'}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px]">{p.category || 'ทั่วไป'}</span>
                        </td>
                        <td className="p-3 font-extrabold text-amber-300 text-sm">
                          ฿{p.price}
                        </td>
                        <td className="p-3">
                          {p.badge ? (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                              {p.badge}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-3">
                          {p.is_active ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">วางขาย</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded text-[10px]">ซ่อน</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct({ ...p })}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                              title="แก้ไขสินค้า"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteProductModal(p)}
                              className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition"
                              title="ลบสินค้า"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> ข้อมูลผู้ติดต่อ & ลูกค้าเป้าหมาย (Leads CRM)
                </h3>
                <p className="text-xs text-slate-400">รายชื่อผู้ติดต่อที่กรอกข้อมูลเข้ามาผ่านหน้า Bio Link ของสมาชิก</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportLeadsCSV}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Download className="w-4 h-4" /> ส่งออก CSV
                </button>

                <select
                  value={selectedUserFilter}
                  onChange={(e) => setSelectedUserFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">หน้าโปรไฟล์: ทั้งหมด</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>@{u.username}</option>
                  ))}
                </select>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ / เบอร์ / อีเมล..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-48 bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                    <th className="p-3">ชื่อผู้ติดต่อ</th>
                    <th className="p-3">เบอร์โทรศัพท์</th>
                    <th className="p-3">อีเมล</th>
                    <th className="p-3">ข้อความ / Note</th>
                    <th className="p-3">เจ้าของหน้า Bio</th>
                    <th className="p-3">วันที่ส่งข้อมูล</th>
                    <th className="p-3 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        ยังไม่มีข้อมูล Leads
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((ld) => (
                      <tr key={ld.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-white">{ld.name}</td>
                        <td className="p-3 font-mono text-emerald-400">{ld.phone || '-'}</td>
                        <td className="p-3 text-slate-300">{ld.email || '-'}</td>
                        <td className="p-3 max-w-xs text-slate-400 truncate">{ld.note || '-'}</td>
                        <td className="p-3">
                          <span className="font-bold text-purple-400">@{ld.profiles?.username || 'user'}</span>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {new Date(ld.created_at).toLocaleString('th-TH')}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setDeleteLeadModal(ld)}
                            className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition"
                            title="ลบข้อมูล Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SYSTEM */}
        {activeTab === 'system' && (
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" /> ข้อมูลการเชื่อมต่อฐานข้อมูล & คำแนะนำระบบ
              </h3>
              <p className="text-xs text-slate-400">รายละเอียด Supabase และคำสั่ง SQL สำคัญสำหรับการบริหารจัดการ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-purple-300">Supabase Project URL</p>
                <code className="text-xs font-mono text-white block bg-slate-900 p-2.5 rounded-xl break-all">
                  https://dkidksohprjhkcokdbja.supabase.co
                </code>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-purple-300">Supabase Publishable Key</p>
                <code className="text-xs font-mono text-white block bg-slate-900 p-2.5 rounded-xl break-all">
                  sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU
                </code>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> วิธีตั้งค่า User ให้เป็น Admin ผ่าน SQL Editor
              </h4>
              <p className="text-xs text-slate-400">
                หากต้องการมอบสิทธิ์ Admin ให้กับบัญชีผู้ใช้ใดๆ ให้ไปที่ Supabase SQL Editor แล้วรันคำสั่ง:
              </p>
              <pre className="bg-slate-900 p-3 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
{`-- แทนที่ YOUR_USERNAME ด้วยชื่อ username ของผู้ใช้ที่ต้องการ
UPDATE public.profiles 
SET role = 'admin' 
WHERE username = 'YOUR_USERNAME';`}
              </pre>
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}

      {/* CREATE USER MODAL */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setCreateUserModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" /> เพิ่มสมาชิกใหม่ในระบบ
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">อีเมล (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">รหัสผ่าน (Password)</label>
                <input
                  type="password"
                  required
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อไอดี (Username)</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น popza"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อแสดงผล (Name)</label>
                  <input
                    type="text"
                    placeholder="เช่น ป๊อปซ่า"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">บทบาท (Role)</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">แพ็กเกจ (Tier)</label>
                  <select
                    value={newUserForm.tier}
                    onChange={(e) => setNewUserForm({ ...newUserForm, tier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro (30วัน)</option>
                    <option value="master">Master (30วัน)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">แต้มตั้งต้น</label>
                  <input
                    type="number"
                    value={newUserForm.points}
                    onChange={(e) => setNewUserForm({ ...newUserForm, points: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition mt-3 shadow"
              >
                บันทึกและสร้างสมาชิก
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-400" /> แก้ไขข้อมูลผู้ใช้ (@{editingUser.username})
            </h3>

            <form onSubmit={handleSaveUserProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Username (ชื่อไอดี)</label>
                  <input
                    type="text"
                    required
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อแสดงผล (Display Name)</label>
                  <input
                    type="text"
                    value={editingUser.full_name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ข้อความ Bio</label>
                <textarea
                  rows={2}
                  value={editingUser.bio || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">บทบาท (Role)</label>
                  <select
                    value={editingUser.role || 'user'}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="user">User (ทั่วไป)</option>
                    <option value="admin">Admin (ผู้ดูแล)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">แต้มคงเหลือ</label>
                  <input
                    type="number"
                    value={editingUser.points || 0}
                    onChange={(e) => setEditingUser({ ...editingUser, points: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Template</label>
                  <select
                    value={editingUser.template_id || 'template_1'}
                    onChange={(e) => setEditingUser({ ...editingUser, template_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <option key={n} value={`template_${n}`}>Template {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูป Avatar</label>
                <input
                  type="url"
                  value={editingUser.avatar_url || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, avatar_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

                            <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block font-bold text-slate-300">ไอคอนโซเชียล (Social Links)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Facebook URL" value={editingUser.social_facebook || ''} onChange={(e) => setEditingUser({ ...editingUser, social_facebook: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                  <input type="text" placeholder="Instagram URL" value={editingUser.social_instagram || ''} onChange={(e) => setEditingUser({ ...editingUser, social_instagram: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                  <input type="text" placeholder="TikTok URL" value={editingUser.social_tiktok || ''} onChange={(e) => setEditingUser({ ...editingUser, social_tiktok: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                  <input type="text" placeholder="YouTube Channel" value={editingUser.social_youtube || ''} onChange={(e) => setEditingUser({ ...editingUser, social_youtube: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                  <input type="text" placeholder="LINE Official / ID" value={editingUser.social_line || ''} onChange={(e) => setEditingUser({ ...editingUser, social_line: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                  <input type="text" placeholder="Shopee Shop" value={editingUser.social_shopee || ''} onChange={(e) => setEditingUser({ ...editingUser, social_shopee: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                  <input type="text" placeholder="Lazada Shop" value={editingUser.social_lazada || ''} onChange={(e) => setEditingUser({ ...editingUser, social_lazada: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                  <input type="text" placeholder="X (Twitter)" value={editingUser.social_x || ''} onChange={(e) => setEditingUser({ ...editingUser, social_x: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hide_branding_edit"
                  checked={Boolean(editingUser.hide_branding)}
                  onChange={(e) => setEditingUser({ ...editingUser, hide_branding: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800"
                />
                <label htmlFor="hide_branding_edit" className="text-xs text-slate-300 font-bold">ซ่อนโลโก้และเครดิตท้ายเว็บ (Hide Branding)</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition mt-2 shadow"
              >
                บันทึกการแก้ไขโปรไฟล์ผู้ใช้
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM POINTS MODAL */}
      {pointsModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <button onClick={() => setPointsModalUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <div className="p-3 bg-amber-400/20 text-amber-300 rounded-2xl inline-block border border-amber-400/40">
              <Coins className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="font-extrabold text-lg text-white">เติม/ปรับแต้มผู้ใช้</h3>
              <p className="text-xs text-slate-400 mt-1">ผู้ใช้: <span className="text-emerald-400 font-bold">@{pointsModalUser.username}</span> (ปัจจุบัน: {pointsModalUser.points || 0} แต้ม)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-left">จำนวนแต้ม (ใส่ลบ - เพื่อหักแต้ม)</label>
              <input
                type="number"
                value={customPointsInput}
                onChange={(e) => setCustomPointsInput(e.target.value)}
                placeholder="เช่น 100, 500, -50"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base font-extrabold text-amber-300 text-center focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button onClick={() => setCustomPointsInput('100')} className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">+100</button>
              <button onClick={() => setCustomPointsInput('500')} className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">+500</button>
              <button onClick={() => setCustomPointsInput('1000')} className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">+1000</button>
            </div>

            <button
              onClick={handleApplyCustomPoints}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-xl transition shadow"
            >
              บันทึกการปรับแต้ม
            </button>
          </div>
        </div>
      )}

      {/* GRANT SUBSCRIPTION TIER MODAL */}
      {grantModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setGrantModalUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl inline-block border border-purple-500/40 mb-2">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">มอบสิทธิ์สมาชิก VIP</h3>
              <p className="text-xs text-slate-400 mt-1">ผู้ใช้: <span className="text-emerald-400 font-bold">@{grantModalUser.username}</span></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">เลือกสิทธิ์ที่ต้องการมอบ / ปรับเปลี่ยน</label>
                <select
                  value={grantTierSelect}
                  onChange={(e: any) => setGrantTierSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="free">Free Plan (ลิงก์ไม่จำกัด / 2 สินค้า / 3 เทมเพลต / ยกเลิก VIP)</option>
                  <option value="pro">Pro Member (ลิงก์ไม่จำกัด / 10 สินค้า / 6 เทมเพลต / ซ่อนแบรนด์)</option>
                  <option value="master">Master VIP (ไม่จำกัด / ครบ 9 เทมเพลต / ย่อลิงก์ฟรี)</option>
                  <option value="shortener">URL Shortener Pass (ปลดล็อกระบบย่อลิงก์ 30 วัน)</option>
                </select>
              </div>

              {grantTierSelect !== 'free' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">จำนวนวันใช้งาน (วัน)</label>
                    <input
                      type="number"
                      value={grantDaysInput}
                      onChange={(e) => setGrantDaysInput(e.target.value)}
                      placeholder="30"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button onClick={() => setGrantDaysInput('30')} className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">30 วัน</button>
                    <button onClick={() => setGrantDaysInput('90')} className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">90 วัน</button>
                    <button onClick={() => setGrantDaysInput('365')} className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">1 ปี</button>
                  </div>
                </>
              ) : (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 text-left">
                  💡 ระบบจะทำการล้างวันหมดอายุของ <strong>Pro, Master, และ URL Shortener</strong> ทั้งหมดของผู้ใช้นี้ และปรับสถานะกลับเป็น <strong>Free Plan</strong> ปกติ
                </div>
              )}
            </div>

            <button
              onClick={handleApplyGrantSubscription}
              className={`w-full py-3 font-extrabold text-sm rounded-xl transition shadow ${grantTierSelect === 'free' ? 'bg-rose-500 hover:bg-rose-400 text-white' : 'bg-purple-500 hover:bg-purple-400 text-slate-950'}`}
            >
              {grantTierSelect === 'free' ? 'ยืนยันปรับเป็น Free Plan' : 'มอบสิทธิ์สมาชิกทันที'}
            </button>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRM MODAL */}
      {deleteUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl inline-block border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-lg text-white">ยืนยันการลบผู้ใช้?</h3>
            <p className="text-xs text-slate-400">
              คุณกำลังจะลบผู้ใช้ <span className="text-red-400 font-bold">@{deleteUserModal.username}</span> ลิ้งก์ สินค้า และข้อมูลทั้งหมดของผู้ใช้นี้จะถูกลบอย่างถาวร
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteUserModal(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                className="py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition"
              >
                ลบผู้ใช้ทันที
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SHORT LINK MODAL */}
      {createShortLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setCreateShortLinkModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-purple-400" /> สร้างลิงก์ย่อใหม่ (URL Shortener)
            </h3>

            <form onSubmit={handleCreateShortLink} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">URL ปลายทางที่ต้องการย่อ (Destination URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newShortLinkForm.original_url}
                  onChange={(e) => setNewShortLinkForm({ ...newShortLinkForm, original_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-300">รหัสย่อที่ต้องการ (Slug)</label>
                  <button
                    type="button"
                    onClick={() => setNewShortLinkForm({ ...newShortLinkForm, slug: generateRandomSlug() })}
                    className="text-[10px] text-purple-400 hover:underline"
                  >
                    🎲 สุ่มอัตโนมัติ
                  </button>
                </div>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <span className="text-slate-500 font-mono">/s/</span>
                  <input
                    type="text"
                    placeholder="เช่น promo-sale"
                    value={newShortLinkForm.slug}
                    onChange={(e) => setNewShortLinkForm({ ...newShortLinkForm, slug: e.target.value })}
                    className="w-full bg-transparent text-amber-300 font-mono font-bold focus:outline-none px-1"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ชื่อกำกับ / หมายเหตุ</label>
                <input
                  type="text"
                  placeholder="เช่น ลิงก์ LINE VIP"
                  value={newShortLinkForm.title}
                  onChange={(e) => setNewShortLinkForm({ ...newShortLinkForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="short_active_create"
                  checked={newShortLinkForm.is_active}
                  onChange={(e) => setNewShortLinkForm({ ...newShortLinkForm, is_active: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800"
                />
                <label htmlFor="short_active_create" className="font-bold text-slate-300">เปิดใช้งานลิงก์ทันที (Active)</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black rounded-xl transition mt-2 shadow"
              >
                สร้างลิงก์ย่อ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SHORT LINK MODAL */}
      {editingShortLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setEditingShortLink(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-400" /> แก้ไขลิงก์ย่อ (/s/{editingShortLink.slug})
            </h3>

            <form onSubmit={handleUpdateShortLink} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">URL ปลายทาง</label>
                <input
                  type="url"
                  required
                  value={editingShortLink.original_url}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, original_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">รหัสย่อ (Slug)</label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <span className="text-slate-500 font-mono">/s/</span>
                  <input
                    type="text"
                    required
                    value={editingShortLink.slug}
                    onChange={(e) => setEditingShortLink({ ...editingShortLink, slug: e.target.value })}
                    className="w-full bg-transparent text-amber-300 font-mono font-bold focus:outline-none px-1"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ชื่อกำกับ / บันทึก</label>
                <input
                  type="text"
                  value={editingShortLink.title || ''}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">จำนวนคลิกสะสม</label>
                <input
                  type="number"
                  value={editingShortLink.clicks || 0}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, clicks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="short_active_edit"
                  checked={Boolean(editingShortLink.is_active)}
                  onChange={(e) => setEditingShortLink({ ...editingShortLink, is_active: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800"
                />
                <label htmlFor="short_active_edit" className="font-bold text-slate-300">เปิดใช้งาน (Active)</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black rounded-xl transition mt-2 shadow"
              >
                บันทึกการแก้ไขลิงก์ย่อ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SHORT LINK CONFIRM MODAL */}
      {deleteShortLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl inline-block border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-lg text-white">ยืนยันลบลิงก์ย่อ?</h3>
            <p className="text-xs text-slate-400">
              คุณต้องการลบลิงก์ย่อ <span className="text-amber-300 font-mono font-bold">/s/{deleteShortLinkModal.slug}</span> ใช่หรือไม่? เมื่อลบแล้วผู้ที่คลิกลิงก์นี้จะไม่สามารถเข้าถึงได้อีก
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteShortLinkModal(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteShortLink}
                className="py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition"
              >
                ลบลิงก์ย่อทันที
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LINK MODAL */}
      {createLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setCreateLinkModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" /> เพิ่มลิ้งก์ใหม่
            </h3>

            <form onSubmit={handleCreateLink} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">เลือกเจ้าของลิ้งก์ (User)</label>
                <select
                  required
                  value={newLinkForm.user_id}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, user_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">-- เลือกผู้ใช้ --</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>@{u.username} ({u.full_name || u.username})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ข้อความบนปุ่ม (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ติดตาม Facebook ของเรา"
                  value={newLinkForm.title}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายย่อย (Subtitle - ไม่บังคับ)</label>
                <input
                  type="text"
                  placeholder="เช่น อัปเดตข่าวสารทุกวัน"
                  value={newLinkForm.subtitle}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL ปลายทาง</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newLinkForm.url}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ไอคอน</label>
                  <select
                    value={newLinkForm.icon}
                    onChange={(e) => setNewLinkForm({ ...newLinkForm, icon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="line">LINE</option>
                    <option value="shopee">Shopee</option>
                    <option value="lazada">Lazada</option>
                    <option value="globe">เว็บไซต์ / ทั่วไป</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">สีพื้นหลังปุ่ม</label>
                  <input
                    type="color"
                    value={newLinkForm.bg_color}
                    onChange={(e) => setNewLinkForm({ ...newLinkForm, bg_color: e.target.value })}
                    className="w-full h-8 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition mt-2 shadow"
              >
                บันทึกการเพิ่มลิ้งก์
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LINK MODAL */}
      {editingLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setEditingLink(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-400" /> แก้ไขลิ้งก์ ({editingLink.title})
            </h3>

            <form onSubmit={handleUpdateLink} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">ชื่อปุ่ม (Title)</label>
                <input
                  type="text"
                  required
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายย่อย (Subtitle)</label>
                <input
                  type="text"
                  value={editingLink.subtitle || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL ปลายทาง</label>
                <input
                  type="url"
                  required
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ไอคอน</label>
                  <select
                    value={editingLink.icon || 'globe'}
                    onChange={(e) => setEditingLink({ ...editingLink, icon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="line">LINE</option>
                    <option value="shopee">Shopee</option>
                    <option value="lazada">Lazada</option>
                    <option value="globe">เว็บไซต์ / ทั่วไป</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ยอดคลิก</label>
                  <input
                    type="number"
                    value={editingLink.clicks || 0}
                    onChange={(e) => setEditingLink({ ...editingLink, clicks: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="link_active_edit"
                  checked={Boolean(editingLink.is_active)}
                  onChange={(e) => setEditingLink({ ...editingLink, is_active: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800"
                />
                <label htmlFor="link_active_edit" className="font-bold text-slate-300">เปิดใช้งาน (Active)</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition mt-2 shadow"
              >
                บันทึกการแก้ไขลิ้งก์
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE LINK CONFIRM MODAL */}
      {deleteLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl inline-block border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-lg text-white">ยืนยันลบลิ้งก์?</h3>
            <p className="text-xs text-slate-400">
              คุณต้องการลบลิ้งก์ <span className="text-white font-bold">"{deleteLinkModal.title}"</span> ใช่หรือไม่?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteLinkModal(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteLink}
                className="py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition"
              >
                ลบลิ้งก์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {createProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setCreateProductModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-amber-400" /> เพิ่มสินค้าใหม่
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">เลือกเจ้าของสินค้า (User)</label>
                <select
                  required
                  value={newProductForm.user_id}
                  onChange={(e) => setNewProductForm({ ...newProductForm, user_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">-- เลือกผู้ใช้ --</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>@{u.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ชื่อสินค้า (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ชา Amanita Muscaria สกัดพรีเมียม"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายสินค้า</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดสินค้าโดยย่อ..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ราคา (บาท)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">หมวดหมู่</label>
                  <input
                    type="text"
                    placeholder="เช่น สินค้าเพื่อสุขภาพ"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูปภาพสินค้า</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProductForm.image_url}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL สำหรับกดสั่งซื้อ (Buy URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://shopee.co.th/... หรือลิงก์ LINE"
                  value={newProductForm.buy_url}
                  onChange={(e) => setNewProductForm({ ...newProductForm, buy_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ป้ายกำกับพิเศษ (Badge - เช่น ขายดี, ลด 50%)</label>
                <input
                  type="text"
                  placeholder="เช่น BEST SELLER"
                  value={newProductForm.badge}
                  onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition mt-2 shadow"
              >
                บันทึกการเพิ่มสินค้า
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" /> แก้ไขสินค้า ({editingProduct.title})
            </h3>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">ชื่อสินค้า (Title)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายสินค้า</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ราคา (บาท)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">หมวดหมู่</label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูปภาพ</label>
                <input
                  type="url"
                  value={editingProduct.image_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL สำหรับกดสั่งซื้อ (Buy URL)</label>
                <input
                  type="url"
                  required
                  value={editingProduct.buy_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, buy_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ป้ายกำกับ (Badge)</label>
                <input
                  type="text"
                  value={editingProduct.badge || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="product_active_edit"
                  checked={Boolean(editingProduct.is_active)}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800"
                />
                <label htmlFor="product_active_edit" className="font-bold text-slate-300">เปิดวางขาย (Active)</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition mt-2 shadow"
              >
                บันทึกการแก้ไขสินค้า
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRM MODAL */}
      {deleteProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl inline-block border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-lg text-white">ยืนยันลบสินค้า?</h3>
            <p className="text-xs text-slate-400">
              คุณต้องการลบสินค้า <span className="text-white font-bold">"{deleteProductModal.title}"</span> ใช่หรือไม่?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteProductModal(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteProduct}
                className="py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition"
              >
                ลบสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE LEAD CONFIRM MODAL */}
      {deleteLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl inline-block border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-lg text-white">ยืนยันลบข้อมูลผู้ติดต่อ?</h3>
            <p className="text-xs text-slate-400">
              คุณต้องการลบข้อมูลของ <span className="text-white font-bold">{deleteLeadModal.name}</span> ใช่หรือไม่?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteLeadModal(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteLead}
                className="py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition"
              >
                ลบข้อมูล Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT LANDING PAGE MODAL */}
      {editingLp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1E1B4B] dark:text-white text-base">
                    แก้ไขเซลเพจ & Pixel (Admin Mode)
                  </h3>
                  <p className="text-xs text-slate-400">เจ้าของ: @{editingLp.profiles?.username || 'unknown'}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingLp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminSaveLp} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ชื่อเซลเพจ</label>
                  <input
                    type="text"
                    required
                    value={editingLp.title || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Slug URL (/p/xxx)</label>
                  <input
                    type="text"
                    required
                    value={editingLp.slug || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Headline (หัวข้อหลัก)</label>
                <input
                  type="text"
                  required
                  value={editingLp.headline || ''}
                  onChange={(e) => setEditingLp({ ...editingLp, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">รูปภาพสินค้า (Hero Image URL)</label>
                  <input
                    type="text"
                    value={editingLp.hero_image_url || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, hero_image_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">วิดีโอ YouTube (Video URL)</label>
                  <input
                    type="text"
                    value={editingLp.video_url || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, video_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">ราคาโปรโมชั่น (บาท)</label>
                  <input
                    type="number"
                    value={editingLp.offer_price || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, offer_price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ราคาเดิมก่อนลด (บาท)</label>
                  <input
                    type="number"
                    value={editingLp.original_price || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, original_price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">เวลานับถอยหลัง (นาที)</label>
                  <input
                    type="number"
                    value={editingLp.countdown_minutes || 15}
                    onChange={(e) => setEditingLp({ ...editingLp, countdown_minutes: parseInt(e.target.value, 10) || 15 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ข้อความบนปุ่มสั่งซื้อ</label>
                  <input
                    type="text"
                    value={editingLp.cta_text || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, cta_text: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ลิงก์สั่งซื้อ (CTA URL)</label>
                  <input
                    type="text"
                    required
                    value={editingLp.cta_url || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, cta_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Badges & COD Form */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block font-bold">ป้ายความมั่นใจ 3 จุด</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="ส่งฟรีด่วน"
                    value={editingLp.trust_badge_1 || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, trust_badge_1: e.target.value })}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="ของแท้ 100%"
                    value={editingLp.trust_badge_2 || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, trust_badge_2: e.target.value })}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="ชำระเงินปลอดภัย"
                    value={editingLp.trust_badge_3 || ''}
                    onChange={(e) => setEditingLp({ ...editingLp, trust_badge_3: e.target.value })}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-bold">แสดงฟอร์มเก็บเงินปลายทาง (COD)</span>
                  <input
                    type="checkbox"
                    checked={editingLp.enable_cod_form !== false}
                    onChange={(e) => setEditingLp({ ...editingLp, enable_cod_form: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>
              </div>

              {/* Custom Pixels per Page (Admin Override) */}
              <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 space-y-2">
                <h5 className="font-extrabold text-purple-900 dark:text-purple-300">กำหนด Tracking Pixels เฉพาะหน้านี้ (Admin)</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Facebook Pixel ID</label>
                    <input
                      type="text"
                      value={editingLp.fb_pixel_id || ''}
                      onChange={(e) => setEditingLp({ ...editingLp, fb_pixel_id: e.target.value })}
                      placeholder="เช่น 1234567890..."
                      className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">TikTok Pixel ID</label>
                    <input
                      type="text"
                      value={editingLp.tiktok_pixel_id || ''}
                      onChange={(e) => setEditingLp({ ...editingLp, tiktok_pixel_id: e.target.value })}
                      placeholder="เช่น C9A1B2..."
                      className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingLp}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow transition"
                >
                  {savingLp ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข (Admin Save)'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLp(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
