'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getUserTier } from '@/lib/tier'
import TopUpPointsModal from '@/components/TopUpPointsModal'
import {
  ArrowLeft,
  Upload,
  FileCode,
  Globe,
  Coins,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Eye,
  AlertCircle,
  Sparkles,
  Rocket,
  QrCode,
  ShieldCheck,
  Crown,
  RefreshCw,
  X,
  Code2,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Sliders,
  Sun,
  Moon,
  Info,
  Search,
  Filter,
  Download,
  BarChart3,
  ToggleLeft,
  ToggleRight,
  UserCheck
} from 'lucide-react'

interface UploadedIndexPage {
  id: string
  user_id: string
  slug: string
  title: string
  html_content: string
  fb_pixel_id?: string | null
  tiktok_pixel_id?: string | null
  google_pixel_id?: string | null
  line_tag_id?: string | null
  meta_capi_token?: string | null
  views: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined owner profile
  owner_username?: string | null
  owner_full_name?: string | null
  owner_role?: string | null
}

export default function UploadIndexPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // State Management
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'admin_all'>('create')

  // Top Up Modal
  const [topUpModalOpen, setTopUpModalOpen] = useState<boolean>(false)

  // My Uploaded Pages List
  const [myPages, setMyPages] = useState<UploadedIndexPage[]>([])
  const [loadingPages, setLoadingPages] = useState<boolean>(false)

  // ADMIN MASTER CRUD STATE (For All Users)
  const [adminAllPages, setAdminAllPages] = useState<UploadedIndexPage[]>([])
  const [loadingAdminPages, setLoadingAdminPages] = useState<boolean>(false)
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('')
  const [adminStatusFilter, setAdminStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [adminSortBy, setAdminSortBy] = useState<'newest' | 'oldest' | 'views'>('newest')
  const [adminEditModalPage, setAdminEditModalPage] = useState<UploadedIndexPage | null>(null)
  const [adminBypassPoints, setAdminBypassPoints] = useState<boolean>(false)

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [fileSize, setFileSize] = useState<string>('')
  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(false)

  // Pixels
  const [fbPixelId, setFbPixelId] = useState<string>('')
  const [tiktokPixelId, setTiktokPixelId] = useState<string>('')
  const [googlePixelId, setGooglePixelId] = useState<string>('')
  const [lineTagId, setLineTagId] = useState<string>('')
  const [metaCapiToken, setMetaCapiToken] = useState<string>('')

  // Modals & UI Feedback
  const [toastMsg, setToastMsg] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [confirmPointsModal, setConfirmPointsModal] = useState<boolean>(false)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<UploadedIndexPage | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false)
  const [previewModalHtml, setPreviewModalHtml] = useState<string>('')
  const [successModalData, setSuccessModalData] = useState<{ slug: string; title: string } | null>(null)
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

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

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Load User Data & Uploaded Pages
  useEffect(() => {
    fetchInitialData()
  }, [])

  // Check query parameter ?tab=admin
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'admin') {
      setActiveTab('admin_all')
    }
  }, [searchParams])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?next=/uploadindex')
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
        setProfile(profData)
        if (profData.fb_pixel_id && !fbPixelId) setFbPixelId(profData.fb_pixel_id)
        if (profData.tiktok_pixel_id && !tiktokPixelId) setTiktokPixelId(profData.tiktok_pixel_id)
        if (profData.google_pixel_id && !googlePixelId) setGooglePixelId(profData.google_pixel_id)
        if (profData.line_tag_id && !lineTagId) setLineTagId(profData.line_tag_id)
        if (profData.meta_capi_token && !metaCapiToken) setMetaCapiToken(profData.meta_capi_token)

        // If Admin, fetch all system pages as well
        if (profData.role === 'admin') {
          fetchAdminAllPages()
        }
      }

      // Fetch dynamic settings from SQL
      try {
        const setRes = await fetch('/api/settings')
        const setData = await setRes.json()
        if (setData?.settings) setSiteSettings(setData.settings)
      } catch (e) {}

      // Fetch personal pages
      await fetchMyPages(session.user.id)
    } catch (err: any) {
      console.error('Initialization error:', err)
      showToast('❌ ไม่สามารถโหลดข้อมูลได้: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 1. Fetch personal pages for current user
  const fetchMyPages = async (userId: string) => {
    try {
      setLoadingPages(true)
      let { data, error } = await supabase
        .from('uploaded_index_pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data)) {
        setMyPages(data)
        return
      }

      // Fallback to landing_pages
      const { data: lpData } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', userId)
        .eq('card_style', 'uploaded_html_index')
        .order('created_at', { ascending: false })

      if (lpData) {
        const mapped = lpData.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          slug: item.slug,
          title: item.title,
          html_content: item.body_content,
          fb_pixel_id: item.fb_pixel_id,
          tiktok_pixel_id: item.tiktok_pixel_id,
          google_pixel_id: item.google_pixel_id,
          line_tag_id: item.line_tag_id,
          meta_capi_token: item.meta_capi_token,
          views: item.views || 0,
          is_active: item.is_active ?? true,
          created_at: item.created_at,
          updated_at: item.updated_at
        }))
        setMyPages(mapped)
      }
    } catch (e) {
      console.error('Failed to fetch user pages:', e)
    } finally {
      setLoadingPages(false)
    }
  }

  // 2. Fetch ALL system pages for Admin Master CRUD
  const fetchAdminAllPages = async () => {
    try {
      setLoadingAdminPages(true)

      // Fetch profiles to map owner info
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, role')

      const profileMap: Record<string, any> = {}
      if (allProfiles) {
        allProfiles.forEach((p) => {
          profileMap[p.id] = p
        })
      }

      // Try uploaded_index_pages first
      let { data, error } = await supabase
        .from('uploaded_index_pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data)) {
        const enriched = data.map((item: any) => ({
          ...item,
          owner_username: profileMap[item.user_id]?.username || 'user',
          owner_full_name: profileMap[item.user_id]?.full_name || '',
          owner_role: profileMap[item.user_id]?.role || 'user'
        }))
        setAdminAllPages(enriched)
        return
      }

      // Fallback to landing_pages
      const { data: lpData } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('card_style', 'uploaded_html_index')
        .order('created_at', { ascending: false })

      if (lpData) {
        const enriched = lpData.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          slug: item.slug,
          title: item.title,
          html_content: item.body_content,
          fb_pixel_id: item.fb_pixel_id,
          tiktok_pixel_id: item.tiktok_pixel_id,
          google_pixel_id: item.google_pixel_id,
          line_tag_id: item.line_tag_id,
          meta_capi_token: item.meta_capi_token,
          views: item.views || 0,
          is_active: item.is_active ?? true,
          created_at: item.created_at,
          updated_at: item.updated_at,
          owner_username: profileMap[item.user_id]?.username || 'user',
          owner_full_name: profileMap[item.user_id]?.full_name || '',
          owner_role: profileMap[item.user_id]?.role || 'user'
        }))
        setAdminAllPages(enriched)
      }
    } catch (e) {
      console.error('Failed to fetch admin all pages:', e)
    } finally {
      setLoadingAdminPages(false)
    }
  }

  // Tier check
  const userTier = profile ? getUserTier(profile) : null
  const isMaster = Boolean(profile?.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now())
  const isPro = Boolean(profile?.pro_expires_at && new Date(profile.pro_expires_at).getTime() > Date.now())
  const isAdmin = profile?.role === 'admin'
  const hasVipAccess = isAdmin || isMaster || isPro
  const uploadPointsCost = parseInt(siteSettings?.points_cost_upload_index || '599', 10)

  // Slug cleaner
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const cleaned = raw
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-_]/g, '')
    setSlug(cleaned)
  }

  // Handle File Selection
  const handleFileChange = (file: File) => {
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
      showToast('❌ กรุณาเลือกไฟล์นามสกุล .html หรือ .htm เท่านั้น')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('❌ ขนาดไฟล์เกินขีดจำกัด (สูงสุด 15MB)')
      return
    }

    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + ' KB')

    if (!title) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
      setTitle(baseName)
    }

    if (!slug) {
      const suggestedSlug = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9\-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      if (suggestedSlug && suggestedSlug !== 'index') {
        setSlug(suggestedSlug)
      }
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setHtmlContent(content || '')
      showToast('✅ อ่านไฟล์ ' + file.name + ' สำเร็จแล้ว!')
    }
    reader.onerror = () => {
      showToast('❌ ไม่สามารถอ่านเนื้อหาไฟล์ได้')
    }
    reader.readAsText(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  // Form Submit Action
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      showToast('❌ กรุณาระบุชื่อหน้าเว็บ')
      return
    }

    if (!slug.trim()) {
      showToast('❌ กรุณาระบุชื่อ URL (slug)')
      return
    }

    if (!htmlContent.trim()) {
      showToast('❌ กรุณาอัปโหลดไฟล์ index.html หรือใส่เนื้อหาโค้ด HTML')
      return
    }

    // If Edit Mode -> Free 0 points
    if (editingId) {
      executeSave()
      return
    }

    // If Admin Bypass Mode -> Free 0 points
    if (isAdmin && adminBypassPoints) {
      executeSave()
      return
    }

    // If New Mode -> Strict 599 Points Check!
    const userPts = profile?.points || 0
    if (userPts < uploadPointsCost) {
      showToast(`❌ แต้มสะสมของคุณไม่เพียงพอ (ต้องการ ${uploadPointsCost} แต้ม แต่คุณมี ${userPts} แต้ม) กรุณาเติมแต้มก่อนครับ`)
      setTopUpModalOpen(true)
      return
    }

    setConfirmPointsModal(true)
  }

  const executeSave = async () => {
    if (!user) return

    setSubmitting(true)
    setConfirmPointsModal(false)

    try {
      const cleanSlug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      if (!cleanSlug || cleanSlug.length < 2) {
        throw new Error('ชื่อ URL (slug) ต้องมีความยาวอย่างน้อย 2 ตัวอักษร (ใช้ a-z, 0-9, ขีดกลาง)')
      }

      // 1. Check duplicate slug (differentiate new vs edit mode)
      if (!editingId) {
        const { data: dup1 } = await supabase
          .from('uploaded_index_pages')
          .select('id')
          .eq('slug', cleanSlug)
          .maybeSingle()

        const { data: dup2 } = await supabase
          .from('landing_pages')
          .select('id')
          .eq('slug', cleanSlug)
          .maybeSingle()

        if (dup1 || dup2) {
          throw new Error(`ชื่อ URL /u/${cleanSlug} นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น`)
        }
      } else {
        // Edit mode: only check if ANOTHER page in uploaded_index_pages has this slug
        const { data: dup1 } = await supabase
          .from('uploaded_index_pages')
          .select('id')
          .eq('slug', cleanSlug)
          .neq('id', editingId)
          .maybeSingle()

        if (dup1) {
          throw new Error(`ชื่อ URL /u/${cleanSlug} นี้ถูกใช้งานโดยหน้าอื่นแล้ว กรุณาเลือกชื่ออื่น`)
        }
      }

      // 2. Strict Point Check for New Page
      const isBypassed = isAdmin && adminBypassPoints
      if (!editingId && !isBypassed) {
        const { data: freshProf } = await supabase.from('profiles').select('points').eq('id', user.id).single()
        const currentPoints = freshProf?.points !== undefined ? freshProf.points : (profile?.points || 0)
        if (currentPoints < uploadPointsCost) {
          setTopUpModalOpen(true)
          throw new Error(`แต้มสะสมไม่เพียงพอ (ต้องการ ${uploadPointsCost} แต้ม แต่คุณมี ${currentPoints} แต้ม) กรุณาเติมแต้มก่อนครับ`)
        }
      }

      // 3. EDIT MODE
      if (editingId) {
        const updatePayload: any = {
          slug: cleanSlug,
          title: title.trim(),
          html_content: htmlContent,
          fb_pixel_id: fbPixelId.trim() || null,
          tiktok_pixel_id: tiktokPixelId.trim() || null,
          google_pixel_id: googlePixelId.trim() || null,
          line_tag_id: lineTagId.trim() || null,
          meta_capi_token: metaCapiToken.trim() || null,
          is_active: true,
          updated_at: new Date().toISOString()
        }

        const lpUpdate = {
          slug: cleanSlug,
          title: title.trim(),
          headline: title.trim(),
          body_content: htmlContent,
          cta_url: `/u/${cleanSlug}`,
          fb_pixel_id: fbPixelId.trim() || null,
          tiktok_pixel_id: tiktokPixelId.trim() || null,
          google_pixel_id: googlePixelId.trim() || null,
          line_tag_id: lineTagId.trim() || null,
          meta_capi_token: metaCapiToken.trim() || null,
          is_active: true,
          updated_at: new Date().toISOString()
        }

        // 1. Direct DB update to BOTH tables by ID AND by slug
        await Promise.allSettled([
          supabase.from('uploaded_index_pages').update(updatePayload).eq('id', editingId),
          supabase.from('uploaded_index_pages').update(updatePayload).eq('slug', cleanSlug),
          supabase.from('landing_pages').update(lpUpdate).eq('id', editingId),
          supabase.from('landing_pages').update(lpUpdate).eq('slug', cleanSlug)
        ])

        // 2. Call API route with Admin Service Role to guarantee 100% DB upsert
        try {
          const apiRes = await fetch('/api/upload-index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: editingId,
              user_id: user.id,
              ...updatePayload
            })
          })
          const apiData = await apiRes.json()
          if (!apiRes.ok || apiData.error) {
            console.warn('API sync warning:', apiData?.error)
          }
        } catch (apiErr) {
          console.warn('API sync warning:', apiErr)
        }

        // Immediately update state in memory
        setMyPages(prev => prev.map(p => (p.id === editingId || p.slug === cleanSlug) ? { ...p, ...updatePayload } : p))
        setAdminAllPages(prev => prev.map(p => (p.id === editingId || p.slug === cleanSlug) ? { ...p, ...updatePayload } : p))

        showToast('💾 บันทึกการแก้ไขหน้าเว็บเรียบร้อยแล้ว (ฟรี ไม่เสียแต้ม)')
        resetForm()
        setActiveTab('list')
        fetchMyPages(user.id)
        if (isAdmin) fetchAdminAllPages()
      } else {
        // 4. CREATE NEW MODE
        const insertPayload: any = {
          user_id: user.id,
          slug: cleanSlug,
          title: title.trim(),
          html_content: htmlContent,
          fb_pixel_id: fbPixelId.trim() || null,
          tiktok_pixel_id: tiktokPixelId.trim() || null,
          google_pixel_id: googlePixelId.trim() || null,
          line_tag_id: lineTagId.trim() || null,
          meta_capi_token: metaCapiToken.trim() || null,
          views: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: insErr } = await supabase
          .from('uploaded_index_pages')
          .insert([insertPayload])

        if (insErr) {
          const lpInsert = {
            user_id: user.id,
            slug: cleanSlug,
            title: title.trim(),
            headline: title.trim(),
            body_content: htmlContent,
            card_style: 'uploaded_html_index',
            cta_text: 'เยี่ยมชมหน้าเว็บ',
            cta_url: `/u/${cleanSlug}`,
            fb_pixel_id: fbPixelId.trim() || null,
            tiktok_pixel_id: tiktokPixelId.trim() || null,
            google_pixel_id: googlePixelId.trim() || null,
            line_tag_id: lineTagId.trim() || null,
            views: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { error: lpInsErr } = await supabase
            .from('landing_pages')
            .insert([lpInsert])

          if (lpInsErr) {
            throw new Error('ไม่สามารถบันทึกหน้าเว็บได้: ' + lpInsErr.message)
          }
        }

        // Deduct 599 points if not bypassed
        if (!isBypassed) {
          const { data: latestProf } = await supabase.from('profiles').select('points').eq('id', user.id).single()
          const livePts = latestProf?.points !== undefined ? latestProf.points : (profile?.points || 0)
          const newPoints = Math.max(0, livePts - uploadPointsCost)
          const { error: pErr } = await supabase
            .from('profiles')
            .update({ points: newPoints, updated_at: new Date().toISOString() })
            .eq('id', user.id)

          if (pErr) {
            throw new Error('หักแต้มไม่สำเร็จ: ' + pErr.message)
          }

          setProfile((prev: any) => ({ ...prev, points: newPoints }))

          try {
            await supabase.from('payment_transactions').insert([{
              user_id: user.id,
              amount: uploadPointsCost,
              payment_type: 'upload_index_599pts',
              status: 'completed',
              note: `สร้างหน้าเว็บ /u/${cleanSlug} (หัก ${uploadPointsCost} แต้มสำเร็จ)`,
              created_at: new Date().toISOString()
            }])
          } catch (tx) {}
        }

        showToast(isBypassed ? '🎉 เผยแพร่หน้าเว็บสำเร็จ (Admin Free)' : '🎉 เผยแพร่หน้าเว็บสำเร็จ หัก ${uploadPointsCost} แต้มเรียบร้อยแล้ว!')
      }

      await fetchMyPages(user.id)
      if (isAdmin) fetchAdminAllPages()

      setSuccessModalData({
        slug: cleanSlug,
        title: title.trim()
      })

      if (!editingId) {
        resetForm()
      }
    } catch (err: any) {
      console.error('Save error:', err)
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setHtmlContent('')
    setFileName('')
    setFileSize('')
    setShowCodeEditor(false)
    setFbPixelId('')
    setTiktokPixelId('')
    setGooglePixelId('')
    setLineTagId('')
    setMetaCapiToken('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleStartEdit = (p: UploadedIndexPage) => {
    setEditingId(p.id)
    setTitle(p.title || '')
    setSlug(p.slug || '')
    setHtmlContent(p.html_content || '')
    setFileName(`index-${p.slug}.html`)
    setFileSize((((p.html_content || '').length) / 1024).toFixed(1) + ' KB')
    setFbPixelId(p.fb_pixel_id || '')
    setTiktokPixelId(p.tiktok_pixel_id || '')
    setGooglePixelId(p.google_pixel_id || '')
    setLineTagId(p.line_tag_id || '')
    setMetaCapiToken(p.meta_capi_token || '')

    setActiveTab('create')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('✏️ เข้าสู่โหมดแก้ไข: ' + p.title + ' (ไม่มีค่าใช้จ่าย 0 แต้ม)')
  }

  const executeDelete = async () => {
    if (!deleteConfirmModal || !user) return

    try {
      await supabase
        .from('uploaded_index_pages')
        .delete()
        .eq('id', deleteConfirmModal.id)

      await supabase
        .from('landing_pages')
        .delete()
        .eq('id', deleteConfirmModal.id)

      showToast('🗑️ ลบหน้าเว็บเรียบร้อยแล้ว')
      setMyPages(myPages.filter((p) => p.id !== deleteConfirmModal.id))
      setAdminAllPages(adminAllPages.filter((p) => p.id !== deleteConfirmModal.id))
      setDeleteConfirmModal(null)

      if (editingId === deleteConfirmModal.id) {
        resetForm()
      }
    } catch (e: any) {
      showToast('❌ ข้อผิดพลาดในการลบ: ' + e.message)
    }
  }

  // ADMIN CRUD OPERATIONS: Toggle Status, Update, Delete
  const handleAdminToggleStatus = async (page: UploadedIndexPage) => {
    const nextStatus = !page.is_active
    try {
      // 1. Try uploaded_index_pages
      await supabase
        .from('uploaded_index_pages')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', page.id)

      // 2. Try landing_pages fallback
      await supabase
        .from('landing_pages')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', page.id)

      setAdminAllPages(adminAllPages.map((p) => (p.id === page.id ? { ...p, is_active: nextStatus } : p)))
      setMyPages(myPages.map((p) => (p.id === page.id ? { ...p, is_active: nextStatus } : p)))

      showToast(`⚡ ${nextStatus ? 'เปิดใช้งาน' : 'ปิดใช้งาน'} หน้า /u/${page.slug} เรียบร้อยแล้ว`)
    } catch (err: any) {
      showToast('❌ ไม่สามารถเปลี่ยนสถานะได้: ' + err.message)
    }
  }

  const handleAdminSaveEditModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminEditModalPage) return

    try {
      const cleanSlug = adminEditModalPage.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-_]/g, '-')
        .replace(/-+/g, '-')

      const payload = {
        title: adminEditModalPage.title.trim(),
        slug: cleanSlug,
        html_content: adminEditModalPage.html_content,
        fb_pixel_id: adminEditModalPage.fb_pixel_id?.trim() || null,
        tiktok_pixel_id: adminEditModalPage.tiktok_pixel_id?.trim() || null,
        google_pixel_id: adminEditModalPage.google_pixel_id?.trim() || null,
        line_tag_id: adminEditModalPage.line_tag_id?.trim() || null,
        meta_capi_token: adminEditModalPage.meta_capi_token?.trim() || null,
        views: parseInt(String(adminEditModalPage.views || 0), 10),
        is_active: Boolean(adminEditModalPage.is_active),
        updated_at: new Date().toISOString()
      }

      const lpPayload = {
        title: payload.title,
        headline: payload.title,
        slug: payload.slug,
        body_content: payload.html_content,
        cta_url: `/u/${payload.slug}`,
        fb_pixel_id: payload.fb_pixel_id,
        tiktok_pixel_id: payload.tiktok_pixel_id,
        google_pixel_id: payload.google_pixel_id,
        line_tag_id: payload.line_tag_id,
        meta_capi_token: payload.meta_capi_token,
        views: payload.views,
        is_active: payload.is_active,
        updated_at: payload.updated_at
      }

      // Update both tables by ID AND by slug
      await Promise.allSettled([
        supabase.from('uploaded_index_pages').update(payload).eq('id', adminEditModalPage.id),
        supabase.from('uploaded_index_pages').update(payload).eq('slug', cleanSlug),
        supabase.from('landing_pages').update(lpPayload).eq('id', adminEditModalPage.id),
        supabase.from('landing_pages').update(lpPayload).eq('slug', cleanSlug)
      ])

      // Also call API route to persist with Admin Service Role
      try {
        await fetch('/api/upload-index', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: adminEditModalPage.id,
            user_id: adminEditModalPage.user_id || user.id,
            ...payload
          })
        })
      } catch (apiErr) {
        console.warn('Admin API sync warning:', apiErr)
      }

      setAdminAllPages(adminAllPages.map((p) => (p.id === adminEditModalPage.id || p.slug === cleanSlug ? { ...p, ...payload } : p)))
      setMyPages(myPages.map((p) => (p.id === adminEditModalPage.id || p.slug === cleanSlug ? { ...p, ...payload } : p)))

      setAdminEditModalPage(null)
      showToast('✅ บันทึกการแก้ไขในฐานะ Admin เรียบร้อยแล้ว')
      fetchMyPages(user.id)
      fetchAdminAllPages()
    } catch (err: any) {
      showToast('❌ ข้อผิดพลาด: ' + err.message)
    }
  }

  // Export Admin Pages to CSV
  const handleExportCsv = () => {
    if (adminAllPages.length === 0) {
      showToast('⚠️ ไม่มีข้อมูลสำหรับส่งออก')
      return
    }

    const headers = ['ID', 'Owner Username', 'Title', 'Slug', 'URL', 'Views', 'Status', 'FB Pixel', 'TikTok Pixel', 'Google Tag', 'LINE Tag', 'Created At']
    const rows = adminAllPages.map((p) => [
      p.id,
      p.owner_username || 'user',
      `"${(p.title || '').replace(/"/g, '""')}"`,
      p.slug,
      `https://linktreethai.in.th/u/${p.slug}`,
      p.views || 0,
      p.is_active ? 'Active' : 'Disabled',
      p.fb_pixel_id || '-',
      p.tiktok_pixel_id || '-',
      p.google_pixel_id || '-',
      p.line_tag_id || '-',
      p.created_at
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `uploaded_index_pages_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('📥 ส่งออกรายงาน CSV เรียบร้อยแล้ว')
  }

  const handleCopyLink = (urlSlug: string) => {
    const fullUrl = `${window.location.origin}/u/${urlSlug}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedSlug(urlSlug)
    showToast('📋 คัดลอกลิงก์สำเร็จ: ' + fullUrl)
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  const handleOpenQrModal = (urlSlug: string) => {
    const fullUrl = `${window.location.origin}/u/${urlSlug}`
    setQrModalUrl(fullUrl)
  }

  const handleOpenLivePreview = (html: string) => {
    setPreviewModalHtml(html)
    setPreviewModalOpen(true)
  }

  // Filtered & Sorted Admin Pages
  const filteredAdminPages = adminAllPages
    .filter((p) => {
      const q = adminSearchQuery.toLowerCase()
      const matchSearch =
        (p.title || '').toLowerCase().includes(q) ||
        (p.slug || '').toLowerCase().includes(q) ||
        (p.owner_username || '').toLowerCase().includes(q) ||
        (p.owner_full_name || '').toLowerCase().includes(q)

      const matchStatus =
        adminStatusFilter === 'all'
          ? true
          : adminStatusFilter === 'active'
          ? p.is_active !== false
          : p.is_active === false

      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (adminSortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (adminSortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (adminSortBy === 'views') return (b.views || 0) - (a.views || 0)
      return 0
    })

  // Admin Metrics
  const totalViews = adminAllPages.reduce((sum, p) => sum + (p.views || 0), 0)
  const activeCount = adminAllPages.filter((p) => p.is_active !== false).length
  const disabledCount = adminAllPages.filter((p) => p.is_active === false).length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
          <p className="text-sm font-bold text-slate-300">กำลังโหลดระบบอัปโหลด Index.html...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-[#F8FAFC] transition-colors pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#131B2A]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 flex items-center gap-1.5 text-xs font-bold"
              title="กลับสู่แดชบอร์ดหลัก"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">แดชบอร์ด</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                    Upload Index.html
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm">
                    <Crown className="w-3 h-3" /> Master Pro Only
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  โฮสต์หน้าเว็บ HTML ส่วนตัวที่ <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">/u/[ชื่อindex]</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex px-3 py-1.5 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold items-center gap-1.5 hover:bg-purple-200 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            <button
              onClick={() => setTopUpModalOpen(true)}
              className="px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 active:scale-95 transition cursor-pointer shadow-sm"
              title="แต้มสะสมคงเหลือ คลิกเพื่อเติมแต้ม"
            >
              <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span className="font-bold font-mono text-sm">{profile?.points || 0}</span>
              <span className="text-[10px] bg-amber-200/80 dark:bg-amber-800/60 px-1 py-0.2 rounded font-extrabold">แต้ม</span>
              <Plus className="w-3.5 h-3.5 ml-0.5 text-amber-600 dark:text-amber-400" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:border-purple-300 transition active:scale-95 shadow-sm"
              title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {!hasVipAccess ? (
          <div className="bg-white dark:bg-[#131B2A] border border-amber-500/30 rounded-3xl p-6 sm:p-10 text-center shadow-xl max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/30">
              <Crown className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-3">
              <Lock className="w-3.5 h-3.5" /> บริการพิเศษเฉพาะสมาชิก MASTER PRO
            </div>

            <h2 className="text-xl sm:text-2xl font-black mb-3">
              ปลดล็อกระบบโฮสต์ index.html ส่วนตัว
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-lg mx-auto">
              ระบบนี้เปิดให้ใช้งานเฉพาะสมาชิกระดับ <span className="font-bold text-purple-600 dark:text-purple-400">PRO VIP</span> และ <span className="font-bold text-amber-500">MASTER VIP</span> เท่านั้น สามารถนำไฟล์ index.html ที่คุณออกแบบเองมาอัปโหลด เชื่อมต่อ Multi-Tracking Pixels และรับ URL เส้นทางตรง <span className="font-mono font-bold text-emerald-500">/u/[ชื่อของคุณ]</span> ได้ทันที
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard?tab=billing"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" /> อัปเกรดเป็น MASTER PRO ในแดชบอร์ด
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs sm:text-sm transition"
              >
                กลับหน้าแดชบอร์ด
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Top Navigation Tabs (Includes Admin Master Tab if user is Admin) */}
            <div className="flex items-center justify-between gap-3 mb-6 bg-white dark:bg-[#131B2A] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {/* Tab 1: Create */}
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'create'
                      ? 'bg-[#1E1B4B] dark:bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {editingId ? (
                    <>
                      <Edit className="w-4 h-4 text-amber-400" />
                      <span>โหมดแก้ไขหน้าเว็บ</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>อัปโหลด / สร้างหน้าใหม่</span>
                    </>
                  )}
                </button>

                {/* Tab 2: My Pages */}
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'list'
                      ? 'bg-[#1E1B4B] dark:bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>หน้าที่เคยสร้างไว้ ({myPages.length})</span>
                </button>

                {/* Tab 3: ADMIN MASTER CRUD (Only for Admin!) */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('admin_all')
                      fetchAdminAllPages()
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
                      activeTab === 'admin_all'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                    }`}
                  >
                    <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>👑 จัดการทุกหน้าในระบบ ({adminAllPages.length})</span>
                  </button>
                )}
              </div>

              {/* Status Info Chip */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pr-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>สถานะ: {isAdmin ? 'Admin Master' : isMaster ? 'MASTER VIP' : 'PRO VIP'}</span>
              </div>
            </div>

            {/* TAB 1: CREATE / EDIT FORM */}
            {activeTab === 'create' && (
              <form onSubmit={handlePreSubmit} className="space-y-6">
                {/* Admin Mode Toggle for Creation */}
                {isAdmin && !editingId && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
                      <ShieldCheck className="w-4 h-4 text-purple-500" />
                      <span>โหมดผู้ดูแลระบบ (Admin Testing Controls):</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminBypassPoints}
                        onChange={(e) => setAdminBypassPoints(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Admin Free (สร้างฟรี 0 แต้มสำหรับทดสอบระบบ)
                      </span>
                    </label>
                  </div>
                )}

                {/* Editing Notification Banner */}
                {editingId ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <p>คุณกำลังอยู่ในโหมดแก้ไขหน้าเว็บ: <span className="font-mono text-white bg-emerald-600/30 px-1.5 py-0.5 rounded">/u/{slug}</span></p>
                        <p className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 mt-0.5">การแก้ไขข้อมูลและโค้ดไม่มีค่าใช้จ่าย (0 แต้ม) บันทึกได้ฟรีตลอดชีพ</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs transition"
                    >
                      ยกเลิก / สร้างใหม่
                    </button>
                  </div>
                ) : (
                  /* Strict Points Cost Banner */
                  <div className={`p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border transition ${
                    !adminBypassPoints && (profile?.points || 0) < uploadPointsCost
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                      : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 border-amber-500/30 text-slate-800 dark:text-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        !adminBypassPoints && (profile?.points || 0) < uploadPointsCost ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold">
                          ค่าธรรมเนียมสร้างหน้าเว็บใหม่: <span className="font-extrabold font-mono text-amber-600 dark:text-amber-400">{uploadPointsCost} แต้ม</span> / หน้า
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {!adminBypassPoints && (profile?.points || 0) < uploadPointsCost
                            ? `⚠️ แต้มของคุณมี ${profile?.points || 0} แต้ม (ยังขาดอีก ${uploadPointsCost - (profile?.points || 0)} แต้ม จึงยังไม่สามารถอัปโหลดได้)`
                            : `ใช้ ${uploadPointsCost} แต้มเฉพาะตอนสร้างครั้งแรก • หลังจากนั้นสามารถเข้ามาแก้ไขโค้ด HTML และพิกเซลได้ฟรีตลอดชีพ`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">แต้มของคุณ</span>
                        <span className={`text-base font-black font-mono leading-none ${
                          !adminBypassPoints && (profile?.points || 0) < uploadPointsCost ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {profile?.points || 0} แต้ม
                        </span>
                      </div>
                      {(profile?.points || 0) < uploadPointsCost && (
                        <button
                          type="button"
                          onClick={() => setTopUpModalOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow hover:from-amber-400 transition"
                        >
                          + เติมแต้ม
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Card 1: Title & Slug */}
                <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
                  <h2 className="text-sm sm:text-base font-black mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">1</span>
                    ตั้งชื่อหน้าเว็บและกำหนดเส้นทาง URL
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        ชื่อหน้าเว็บ / ชื่อโปรเจกต์ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="เช่น หน้าโปรโมชั่นพิเศษ หรือ หน้าแนะนำแบรนด์"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        ชื่อเส้นทาง URL (Slug) <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 focus-within:border-purple-500 transition">
                        <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold shrink-0">
                          /u/
                        </span>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={handleSlugChange}
                          placeholder="my-special-page"
                          className="w-full px-2 py-2 bg-transparent text-xs sm:text-sm font-mono font-bold focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        URL เข้าชมจริง: <span className="text-slate-600 dark:text-slate-300 font-mono">https://linktreethai.in.th/u/{slug || 'ชื่อindex'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Upload File */}
                <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-black flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">2</span>
                      อัปโหลดไฟล์ index.html
                    </h2>

                    {htmlContent && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenLivePreview(htmlContent)}
                          className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" /> พรีวิวหน้าเว็บจริง
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCodeEditor(!showCodeEditor)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                        >
                          <Code2 className="w-3.5 h-3.5" /> {showCodeEditor ? 'ซ่อนโค้ด' : 'ดู/แก้ไขโค้ด HTML'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition ${
                      htmlContent
                        ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'border-slate-300 dark:border-slate-700 hover:border-purple-400 bg-slate-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".html,.htm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileChange(e.target.files[0])
                        }
                      }}
                      className="hidden"
                    />

                    {htmlContent ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                          {fileName || 'index.html'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          ขนาด {fileSize} • คลิกหรือลากไฟล์ใหม่มาวางเพื่อเปลี่ยนไฟล์
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <Upload className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                            ลากและวางไฟล์ <span className="text-purple-600 dark:text-purple-400">index.html</span> หรือคลิกเพื่อเลือกไฟล์
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            รองรับไฟล์ .html, .htm (ความจุสูงสุด 15MB) โค้ด CSS/JS ในไฟล์จะทำงานได้อย่างสมบูรณ์
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {showCodeEditor && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">โค้ด HTML (สามารถแก้ไขปรับแต่งได้โดยตรง):</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ความยาว {htmlContent.length.toLocaleString()} ตัวอักษร
                        </span>
                      </div>
                      <textarea
                        rows={12}
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:border-purple-500"
                        placeholder="<!DOCTYPE html>..."
                      />
                    </div>
                  )}
                </div>

                {/* Card 3: Multi-Tracking Pixels */}
                <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
                  <h2 className="text-sm sm:text-base font-black mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                    ติดตั้ง Tracking Pixels ยิงแอด (ทางเลือก)
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <label className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">f</span>
                        Meta (Facebook) Pixel ID
                      </label>
                      <input
                        type="text"
                        value={fbPixelId}
                        onChange={(e) => setFbPixelId(e.target.value)}
                        placeholder="เช่น 123456789012345"
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">TT</span>
                        TikTok Pixel ID
                      </label>
                      <input
                        type="text"
                        value={tiktokPixelId}
                        onChange={(e) => setTiktokPixelId(e.target.value)}
                        placeholder="เช่น CXXXXXXXXXXXX"
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-slate-500"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <label className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">G</span>
                        Google Analytics / Tag ID
                      </label>
                      <input
                        type="text"
                        value={googlePixelId}
                        onChange={(e) => setGooglePixelId(e.target.value)}
                        placeholder="เช่น G-XXXXXXXXXX หรือ AW-XXXXXXXXXX"
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <label className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">L</span>
                        LINE Tag ID
                      </label>
                      <input
                        type="text"
                        value={lineTagId}
                        onChange={(e) => setLineTagId(e.target.value)}
                        placeholder="เช่น xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Meta Conversions API (CAPI) Access Token (100% Server Event) */}
                    <div className="sm:col-span-2 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-indigo-950/20 to-purple-950/30 border border-blue-500/40 space-y-2.5 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <label className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400">
                          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                          <span>Meta Conversions API (CAPI) Access Token (ยิง Event ฝั่ง Server 100%)</span>
                        </label>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 font-mono w-fit">
                          Server-Side 100% • iOS 14+ Immune
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={metaCapiToken}
                        onChange={(e) => setMetaCapiToken(e.target.value)}
                        placeholder="วาง Meta CAPI Access Token (EAAB...) จาก Meta Events Manager เพื่อให้ระบบส่ง Event PageView ฝั่งเซิร์ฟเวอร์ตรงไปยัง Facebook ทันที"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium focus:outline-none focus:border-blue-500 leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        ⚡ เมื่อใส่ Access Token คู่กับ Facebook Pixel ID ระบบจะยิง Event ผ่านเซิร์ฟเวอร์แบบ 100% ป้องกัน AdBlocker, Safari ITP และข้อจำกัดบน iOS 14+ พร้อมจับคู่ Deduplication อัตโนมัติ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {editingId ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        ✓ โหมดแก้ไข: ไม่มีค่าใช้จ่าย (0 แต้ม)
                      </span>
                    ) : adminBypassPoints ? (
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        👑 Admin Free Mode (0 แต้ม)
                      </span>
                    ) : (
                      <span>
                        ค่าบริการ: <strong className="text-amber-500 font-mono">{uploadPointsCost} แต้ม</strong> (คุณมี {profile?.points || 0} แต้ม)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                      >
                        ยกเลิก
                      </button>
                    )}

                    {!editingId && !adminBypassPoints && (profile?.points || 0) < uploadPointsCost && (
                      <button
                        type="button"
                        onClick={() => setTopUpModalOpen(true)}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition shadow-md active:scale-95"
                      >
                        <Coins className="w-4 h-4 animate-pulse" />
                        <span>เติมแต้มทันที (ขาด {uploadPointsCost - (profile?.points || 0)} แต้ม)</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || (!editingId && !adminBypassPoints && (profile?.points || 0) < uploadPointsCost)}
                      className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition shadow-lg active:scale-95 ${
                        editingId
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 cursor-pointer'
                          : (!editingId && !adminBypassPoints && (profile?.points || 0) < uploadPointsCost)
                            ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-amber-500/25 cursor-pointer'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>กำลังบันทึกหน้าเว็บ...</span>
                        </>
                      ) : editingId ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>บันทึกการแก้ไข (ฟรี ไม่เสียแต้ม)</span>
                        </>
                      ) : (!editingId && !adminBypassPoints && (profile?.points || 0) < uploadPointsCost) ? (
                        <>
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span>แต้มไม่พอ (ต้องการ {uploadPointsCost} แต้ม)</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4" />
                          <span>เผยแพร่หน้าเว็บ (ใช้ {uploadPointsCost} แต้ม)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: MY PERSONAL PAGES */}
            {activeTab === 'list' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm sm:text-base font-black flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-500" />
                    รายการหน้าเว็บที่คุณอัปโหลดไว้ ({myPages.length})
                  </h2>

                  <button
                    type="button"
                    onClick={() => {
                      resetForm()
                      setActiveTab('create')
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> สร้างหน้าใหม่
                  </button>
                </div>

                {loadingPages ? (
                  <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#131B2A] rounded-3xl border border-slate-200 dark:border-slate-800">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-500" />
                    <p className="text-xs font-bold">กำลังโหลดรายการหน้าเว็บของคุณ...</p>
                  </div>
                ) : myPages.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-[#131B2A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-4">
                      <FileCode className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-black mb-1">ยังไม่มีหน้าที่อัปโหลด</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                      คุณยังไม่ได้อัปโหลดไฟล์ index.html เริ่มสร้างหน้าเว็บแรกของคุณได้เลยตอนนี้
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('create')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-xs transition shadow-md active:scale-95"
                    >
                      🚀 อัปโหลดหน้าเว็บแรกของคุณ
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {myPages.map((page) => {
                      const pixelCount = [page.fb_pixel_id, page.tiktok_pixel_id, page.google_pixel_id, page.line_tag_id].filter(Boolean).length

                      return (
                        <div
                          key={page.id}
                          className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                                {page.title}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-500/20">
                                เปิดใช้งานอยู่
                              </span>
                              {pixelCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                  {pixelCount} Pixels
                                </span>
                              )}
                              {page.meta_capi_token && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-500/30">
                                  ⚡ CAPI 100%
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">URL:</span>
                              <a
                                href={`/u/${page.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs sm:text-sm font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                              >
                                <span>/u/{page.slug}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                              <span>👁️ {page.views || 0} เข้าชม</span>
                              <span>•</span>
                              <span>สร้างเมื่อ {new Date(page.created_at).toLocaleDateString('th-TH')}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0">
                            <a
                              href={`/u/${page.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="เปิดหน้าเว็บจริงในแท็บใหม่"
                            >
                              <ExternalLink className="w-4 h-4 text-purple-500" />
                              <span className="hidden sm:inline">เปิดดู</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleCopyLink(page.slug)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="คัดลอกลิงก์"
                            >
                              {copiedSlug === page.slug ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-500" />
                              )}
                              <span className="hidden sm:inline">
                                {copiedSlug === page.slug ? 'คัดลอกแล้ว' : 'คัดลอก'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenQrModal(page.slug)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="ดูและดาวน์โหลด QR Code"
                            >
                              <QrCode className="w-4 h-4 text-amber-500" />
                              <span className="hidden sm:inline">QR Code</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(page)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="แก้ไขหน้าเว็บนี้ (ฟรี 0 แต้ม)"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="hidden sm:inline">แก้ไข (ฟรี)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmModal(page)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="ลบหน้าเว็บนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">ลบ</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADMIN MASTER CRUD (FULL CONTROL OVER ALL USERS' PAGES) */}
            {isAdmin && activeTab === 'admin_all' && (
              <div className="space-y-6">
                {/* Admin Overview Header & Metrics */}
                <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 border border-amber-500/40 p-5 sm:p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
                        <Crown className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black text-slate-900 dark:text-white">
                            Admin Master Control: จัดการหน้า Index.html ทั้งหมด
                          </h2>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                            Super Admin
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          ดูสถิติ, ค้นหา, กรองสถานะ, แก้ไขโค้ด/พิกเซล, สลับเปิด-ปิด และลบหน้าเว็บของผู้ใช้ทุกคนในระบบแบบ CRUD ครบวงจร
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleExportCsv}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>ส่งออก CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={fetchAdminAllPages}
                        disabled={loadingAdminPages}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingAdminPages ? 'animate-spin' : ''}`} />
                        <span>รีเฟรชข้อมูล</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 font-bold block">หน้าเว็บทั้งหมด</span>
                      <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">
                        {adminAllPages.length} <span className="text-xs font-normal">หน้า</span>
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 font-bold block">ยอดเข้าชมสะสม</span>
                      <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                        {totalViews.toLocaleString()} <span className="text-xs font-normal">วิว</span>
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 font-bold block">เปิดใช้งานอยู่</span>
                      <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {activeCount} <span className="text-xs font-normal">หน้า</span>
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 font-bold block">ปิดใช้งานชั่วคราว</span>
                      <span className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
                        {disabledCount} <span className="text-xs font-normal">หน้า</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search, Filter & Sort Controls */}
                <div className="bg-white dark:bg-[#131B2A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                  {/* Search Input */}
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminSearchQuery}
                      onChange={(e) => setAdminSearchQuery(e.target.value)}
                      placeholder="ค้นหาชื่อหน้า, /u/slug, หรือ username..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Filters & Sorter */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Filter className="w-3.5 h-3.5" />
                      <select
                        value={adminStatusFilter}
                        onChange={(e: any) => setAdminStatusFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="all">สถานะทั้งหมด</option>
                        <option value="active">เปิดใช้งาน (Active)</option>
                        <option value="inactive">ปิดใช้งาน (Disabled)</option>
                      </select>
                    </div>

                    {/* Sorter */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Sliders className="w-3.5 h-3.5" />
                      <select
                        value={adminSortBy}
                        onChange={(e: any) => setAdminSortBy(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="newest">ล่าสุด (Newest)</option>
                        <option value="oldest">เก่าสุด (Oldest)</option>
                        <option value="views">ยอดวิวสูงสุด (Views)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Admin All Pages List */}
                {loadingAdminPages ? (
                  <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#131B2A] rounded-3xl border border-slate-200 dark:border-slate-800">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
                    <p className="text-xs font-bold">กำลังโหลดข้อมูลหน้าเว็บของทุกคนในระบบ...</p>
                  </div>
                ) : filteredAdminPages.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-[#131B2A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-bold text-slate-400">ไม่พบหน้าเว็บที่ตรงกับเงื่อนไขการค้นหา</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAdminPages.map((page) => {
                      const pixelCount = [page.fb_pixel_id, page.tiktok_pixel_id, page.google_pixel_id, page.line_tag_id].filter(Boolean).length

                      return (
                        <div
                          key={page.id}
                          className={`bg-white dark:bg-[#131B2A] border rounded-3xl p-5 shadow-sm transition hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                            page.is_active === false
                              ? 'border-rose-300/60 dark:border-rose-900/40 opacity-75'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {/* Info Column */}
                          <div className="space-y-2 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Owner Badge */}
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-500/20 flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> @{page.owner_username || 'user'}
                              </span>

                              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                                {page.title}
                              </h3>

                              {/* Active Status Badge with clickable toggle */}
                              <button
                                type="button"
                                onClick={() => handleAdminToggleStatus(page)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                                  page.is_active !== false
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-200'
                                }`}
                                title="คลิกเพื่อสลับเปิด/ปิดสถานะหน้าเว็บทันที"
                              >
                                {page.is_active !== false ? (
                                  <>
                                    <ToggleRight className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>เปิดใช้งาน (Active)</span>
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft className="w-3.5 h-3.5 text-rose-500" />
                                    <span>ปิดใช้งาน (Disabled)</span>
                                  </>
                                )}
                              </button>

                              {pixelCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                  {pixelCount} Pixels
                                </span>
                              )}
                            </div>

                            {/* URL */}
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">URL:</span>
                              <a
                                href={`/u/${page.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                              >
                                <span>/u/{page.slug}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                              <span>👁️ {page.views || 0} เข้าชม</span>
                              <span>•</span>
                              <span>สร้างเมื่อ {new Date(page.created_at).toLocaleDateString('th-TH')}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-slate-500">ID: {page.id.slice(0, 8)}...</span>
                            </div>
                          </div>

                          {/* Admin Action Bar */}
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0">
                            {/* Open */}
                            <a
                              href={`/u/${page.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="เปิดหน้าเว็บจริงในแท็บใหม่"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-purple-500" />
                              <span className="hidden sm:inline">เปิดดู</span>
                            </a>

                            {/* Live Preview */}
                            <button
                              type="button"
                              onClick={() => handleOpenLivePreview(page.html_content)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="พรีวิวโค้ด HTML ใน Modal"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                              <span className="hidden sm:inline">พรีวิว</span>
                            </button>

                            {/* Copy Link */}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(page.slug)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="คัดลอกลิงก์"
                            >
                              {copiedSlug === page.slug ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                              )}
                              <span className="hidden sm:inline">คัดลอก</span>
                            </button>

                            {/* QR Code */}
                            <button
                              type="button"
                              onClick={() => handleOpenQrModal(page.slug)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="ดูและดาวน์โหลด QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5 text-amber-500" />
                              <span className="hidden sm:inline">QR</span>
                            </button>

                            {/* Admin Full Edit */}
                            <button
                              type="button"
                              onClick={() => setAdminEditModalPage({ ...page })}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-1.5 transition active:scale-95"
                              title="เปิดหน้าต่างแก้ไขข้อมูลฉบับเต็มของ Admin"
                            >
                              <Edit className="w-3.5 h-3.5 text-amber-500" />
                              <span>แก้ไข</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmModal(page)}
                              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                              title="ลบหน้าเว็บนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">ลบ</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADMIN EDIT MODAL (COMPREHENSIVE FULL CRUD MODAL) */}
      {adminEditModalPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    แก้ไขหน้าเว็บในฐานะ Admin (Owner: @{adminEditModalPage.owner_username || 'user'})
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {adminEditModalPage.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminEditModalPage(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleAdminSaveEditModal} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ชื่อหน้าเว็บ / โปรเจกต์
                  </label>
                  <input
                    type="text"
                    required
                    value={adminEditModalPage.title}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ชื่อ URL Slug (/u/...)
                  </label>
                  <input
                    type="text"
                    required
                    value={adminEditModalPage.slug}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    สถานะการเปิดใช้งาน
                  </label>
                  <select
                    value={adminEditModalPage.is_active !== false ? 'true' : 'false'}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, is_active: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none"
                  >
                    <option value="true">🟢 เปิดใช้งาน (Active)</option>
                    <option value="false">🔴 ปิดใช้งานชั่วคราว (Disabled)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ยอดเข้าชม (Views)
                  </label>
                  <input
                    type="number"
                    value={adminEditModalPage.views || 0}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, views: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Code Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    เนื้อหาโค้ด HTML (index.html)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ความยาว {(adminEditModalPage.html_content || '').length.toLocaleString()} ตัวอักษร
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={adminEditModalPage.html_content || ''}
                  onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, html_content: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Pixels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-blue-500 mb-1">Meta (Facebook) Pixel ID</label>
                  <input
                    type="text"
                    value={adminEditModalPage.fb_pixel_id || ''}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, fb_pixel_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">TikTok Pixel ID</label>
                  <input
                    type="text"
                    value={adminEditModalPage.tiktok_pixel_id || ''}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, tiktok_pixel_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-500 mb-1">Google Tag / Analytics ID</label>
                  <input
                    type="text"
                    value={adminEditModalPage.google_pixel_id || ''}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, google_pixel_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-500 mb-1">LINE Tag ID</label>
                  <input
                    type="text"
                    value={adminEditModalPage.line_tag_id || ''}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, line_tag_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-blue-400 mb-1">Meta CAPI Access Token (Server-Side Events 100%)</label>
                  <textarea
                    rows={2}
                    value={adminEditModalPage.meta_capi_token || ''}
                    onChange={(e) => setAdminEditModalPage({ ...adminEditModalPage, meta_capi_token: e.target.value })}
                    placeholder="วาง Meta CAPI Token สำหรับยิง Event ฝั่ง Server"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdminEditModalPage(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition"
                >
                  บันทึกการแก้ไข (Admin Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM REDEEM POINTS MODAL (599 POINTS) */}
      {confirmPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                ยืนยันการใช้ {uploadPointsCost} แต้ม
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                สร้างหน้าเว็บ index.html ที่เส้นทาง <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">/u/{slug}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ค่าบริการสร้างหน้าใหม่:</span>
                <span className="font-mono font-black text-amber-600 dark:text-amber-400">🪙 {uploadPointsCost} แต้ม</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">แต้มสะสมของคุณ:</span>
                <span className="font-mono">{profile?.points || 0} แต้ม</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-bold">
                <span className="text-slate-500">แต้มคงเหลือหลังทำรายการ:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">
                  {Math.max(0, (profile?.points || 0) - uploadPointsCost)} แต้ม
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              💡 หมายเหตุ: หลังจากสร้างหน้าเว็บสำเร็จแล้ว คุณจะสามารถกลับมาแก้ไขข้อมูล โค้ด HTML และพิกเซลได้ตลอดชีพโดยไม่มีค่าใช้จ่ายเพิ่ม
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPointsModal(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={executeSave}
                disabled={submitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-xl text-xs font-black shadow-md hover:from-amber-400 transition"
              >
                {submitting ? 'กำลังดำเนินการ...' : `ยืนยันหัก ${uploadPointsCost} แต้ม`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                ต้องการลบหน้าเว็บนี้?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                คุณแน่ใจหรือไม่ว่าต้องการลบ <span className="font-bold text-slate-800 dark:text-slate-200">{deleteConfirmModal.title}</span> (<span className="font-mono text-purple-400">/u/{deleteConfirmModal.slug}</span>)
                {deleteConfirmModal.owner_username && (
                  <span className="block mt-1 text-[11px] text-purple-400">เจ้าของ: @{deleteConfirmModal.owner_username}</span>
                )}
              </p>
            </div>

            <p className="text-[11px] text-rose-500/90 leading-relaxed bg-rose-500/10 p-2.5 rounded-xl">
              ⚠️ การลบจะไม่สามารถกู้คืนได้ และผู้เยี่ยมชมจะไม่สามารถเข้าถึงหน้านี้ได้อีก
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 shadow-md transition"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <span className="text-xs sm:text-sm font-black">
                  ตัวอย่างการแสดงผลหน้าเว็บ (Live Preview)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-white overflow-hidden relative">
              <iframe
                title="Preview"
                srcDoc={previewModalHtml || htmlContent}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS PUBLISHED MODAL */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                เผยแพร่หน้าเว็บสำเร็จ!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                หน้าเว็บของคุณพร้อมใช้งานและเข้าถึงได้ทันทีที่
              </p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800/60 font-mono text-xs font-bold text-purple-700 dark:text-purple-300 break-all">
              {window.location.origin}/u/{successModalData.slug}
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={`/u/${successModalData.slug}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <ExternalLink className="w-4 h-4" /> เปิดดูหน้าจริงทันที
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(successModalData.slug)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-4 h-4" /> คัดลอกลิงก์
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessModalData(null)
                  setActiveTab('list')
                }}
                className="w-full py-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-semibold"
              >
                ดูรายการหน้าทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {qrModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-purple-500" /> สแกน QR Code หน้าเว็บ
              </h3>
              <button
                type="button"
                onClick={() => setQrModalUrl(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(qrModalUrl)}`}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-[11px] font-mono text-purple-600 dark:text-purple-400 break-all">
              {qrModalUrl}
            </p>

            <button
              type="button"
              onClick={() => {
                const link = document.createElement('a')
                link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=15&data=${encodeURIComponent(qrModalUrl)}`
                link.download = `qrcode-index.png`
                link.target = '_blank'
                link.click()
              }}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              ดาวน์โหลดรูป QR Code
            </button>
          </div>
        </div>
      )}

      {/* TOP UP POINTS MODAL */}
      <TopUpPointsModal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        profile={profile}
        onSuccess={() => {
          fetchInitialData()
        }}
      />
    </div>
  )
}
