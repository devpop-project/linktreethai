'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import { 
  ShoppingBag, Check, Sparkles, ArrowRight, Sun, Moon, Rocket, Flame, 
  CheckCircle2, Globe, Heart, Star, ExternalLink, Eye, ArrowLeft,
  Users, Search, Layers, QrCode, MessageCircle, ShieldCheck, Tag
} from 'lucide-react'

export default function ExamplesShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [realUsers, setRealUsers] = useState<any[]>([])
  const [realSalepages, setRealSalepages] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    const savedTheme = localStorage.getItem('linktree_theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }

    // Load REAL users and REAL landing pages from Supabase
    const supabase = createClient()
    const loadRealData = async () => {
      setLoading(true)
      try {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, username, full_name, bio, avatar_url, cover_url, role, points, template_id, created_at')
          .order('created_at', { ascending: false })

        if (profs) setRealUsers(profs)

        const { data: lps } = await supabase
          .from('landing_pages')
          .select('id, title, slug, headline, offer_price, hero_image_url, bg_color, theme_color, created_at, profiles(username, full_name, avatar_url)')
          .order('created_at', { ascending: false })

        if (lps) setRealSalepages(lps)
      } catch (e) {}
      setLoading(false)
    }
    loadRealData()
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

  // Combine real users & salepages
  const combinedItems = [
    ...realUsers.map(u => ({
      id: u.id,
      type: 'bio',
      title: u.full_name || `@${u.username}`,
      username: u.username,
      description: u.bio || 'สมาชิกผู้ใช้งานจริงบน LinkTreeThai Platform',
      templateName: u.template_id ? u.template_id.replace('template_', 'Template ') : 'Template 1',
      avatarUrl: u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username || 'user'}`,
      coverUrl: u.cover_url || null,
      liveUrl: `/${u.username}`,
      role: u.role,
      points: u.points || 0,
      isSalepage: false,
      createdAt: u.created_at
    })),
    ...realSalepages.map(lp => ({
      id: lp.id,
      type: 'salepage',
      title: lp.title || lp.headline,
      username: lp.slug,
      description: lp.headline || 'เซลเพจโปรโมชั่นยิงแอด พร้อมระบบชำระเงินและแจ้งเตือนเข้า LINE',
      templateName: 'Sales Landing Page (6-Section)',
      avatarUrl: lp.hero_image_url || lp.profiles?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${lp.slug}`,
      coverUrl: null,
      liveUrl: `/p/${lp.slug}`,
      role: 'salepage',
      points: 0,
      isSalepage: true,
      price: lp.offer_price,
      ownerUsername: lp.profiles?.username,
      createdAt: lp.created_at
    }))
  ]

  const filteredItems = combinedItems.filter((item) => {
    const matchCategory = 
      selectedCategory === 'all' ||
      (selectedCategory === 'salepage' && item.isSalepage) ||
      (selectedCategory === 'vip' && (item.role === 'admin' || item.points >= 100)) ||
      (selectedCategory === 'bio' && !item.isSalepage)

    const q = searchQuery.toLowerCase().trim()
    const matchQuery = !q || (
      item.title?.toLowerCase().includes(q) ||
      item.username?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    )
    return matchCategory && matchQuery
  })

  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-slate-100 flex flex-col justify-between selection:bg-[#A78BFA] selection:text-white font-sans transition-colors duration-300">
      
      {/* Top Header Navigation */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-xl sticky top-0 z-50 bg-white/95 dark:bg-[#0F172A]/95 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <Link 
              href="/" 
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1 text-xs font-bold shrink-0"
              title="กลับหน้าแรก"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">หน้าแรก</span>
            </Link>
            <div className="truncate">
              <SiteLogo />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:border-purple-300 transition active:scale-95 shadow-sm shrink-0"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <Link 
              href="/login" 
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 transition whitespace-nowrap"
            >
              เข้าสู่ระบบ
            </Link>
            <Link 
              href="/register" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-black bg-[#34D399] hover:bg-[#10B981] text-slate-950 rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-1 active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>สร้างฟรี</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12 space-y-8 w-full overflow-hidden">
        
        {/* Header Hero Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-black shadow-sm max-w-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">REAL MEMBERS & SALEPAGES • ตัวอย่างผู้ใช้งานจริง</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#1E1B4B] dark:text-white tracking-tight leading-tight">
            ตัวอย่างหน้า Bio Link & เซลเพจ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-[#34D399] bg-clip-text text-transparent">
              ของผู้ที่มาสมัครใช้งานจริงในระบบ
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            แสดงเฉพาะโปรไฟล์และเซลเพจของสมาชิกจริงที่มีอยู่ในฐานข้อมูล คุณสามารถกดเข้าชมหน้าจริง (Live) ได้ทันที
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-black w-full px-1">
            <button
              onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-300'
              }`}
            >
              🌐 ทั้งหมด ({combinedItems.length})
            </button>
            <button
              onClick={() => { setSelectedCategory('bio'); setCurrentPage(1); }}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === 'bio'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-300'
              }`}
            >
              👤 Bio Link ({realUsers.length})
            </button>
            <button
              onClick={() => { setSelectedCategory('salepage'); setCurrentPage(1); }}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === 'salepage'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-red-300'
              }`}
            >
              🚀 เซลเพจ ({realSalepages.length})
            </button>
            <button
              onClick={() => { setSelectedCategory('vip'); setCurrentPage(1); }}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === 'vip'
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              👑 สมาชิกระดับ VIP
            </button>
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ใช้, ชื่อร้าน, หรือ Slug..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-[#1E1B4B] dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* Showcase Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] animate-pulse space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] space-y-3">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-[#1E1B4B] dark:text-white">ไม่พบข้อมูลสมาชิกในหมวดหมู่นี้</h3>
            <p className="text-xs text-slate-500">คุณสามารถลงทะเบียนเป็นสมาชิกคนแรกได้ทันที!</p>
          </div>
        ) : (() => {
          const ITEMS_PER_PAGE = 6
          const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
          const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

          return (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Top Banner */}
                  <div className="h-28 relative p-4 flex items-start justify-between bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-950"
                    style={item.coverUrl ? { backgroundImage: `url(${item.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  >
                    <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-mono text-[10px] font-black border border-white/20">
                      {item.isSalepage ? '🚀 เซลเพจ Flash Sale' : (item.role === 'admin' ? '👑 ADMIN' : '👤 สมาชิกจริง')}
                    </span>
                    
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-emerald-400 text-[10px] font-black border border-white/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    {/* Avatar & Username */}
                    <div className="flex items-end justify-between -mt-10 mb-2">
                      <div className="w-20 h-20 rounded-2xl p-1 bg-white dark:bg-slate-900 shadow-lg border-2 border-purple-200 dark:border-slate-700 shrink-0">
                        <img
                          src={item.avatarUrl}
                          alt={item.title}
                          className="w-full h-full rounded-xl object-cover bg-slate-100"
                        />
                      </div>
                      
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-xl font-bold border border-purple-200 dark:border-purple-800">
                        {item.templateName}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1">
                      <h3 className="font-black text-base sm:text-lg text-[#1E1B4B] dark:text-white flex items-center gap-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                        <span className="truncate">{item.title}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      </h3>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold">
                        {item.isSalepage ? `linktreethai.com/p/${item.username}` : `linktreethai.com/${item.username}`}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/40">
                        ✓ บัญชีจริงในระบบ
                      </span>
                      {item.price ? (
                        <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg text-[10px] font-bold border border-amber-100 dark:border-amber-900/40">
                          ฿{item.price} บาท
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Action Button Footer */}
                <div className="p-6 pt-0 space-y-2">
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-[#1E1B4B] dark:bg-white hover:bg-purple-700 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-98 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>เข้าชมหน้าจริง Live ({item.isSalepage ? `/p/${item.username}` : `@${item.username}`})</span>
                  </a>
                </div>
              </div>
            ))}
              </div>

              {/* Interactive Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    แสดงหน้า {currentPage} จากทั้งหมด {totalPages} หน้า (รวม {filteredItems.length} รายการในระบบ)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer shadow-sm"
                    >
                      ← ย้อนกลับ
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-2xl font-bold text-xs flex items-center justify-center transition cursor-pointer shadow-sm ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer shadow-sm"
                    >
                      ถัดไป →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-purple-600 via-indigo-600 to-[#34D399] p-8 sm:p-12 rounded-[36px] shadow-2xl text-white text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-2xl shadow-inner">
            🚀
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              พร้อมเป็นหนึ่งในหน้าตัวอย่างที่ประสบความสำเร็จหรือยัง?
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              สร้างหน้า Bio Link & ร้านค้าออนไลน์ของคุณได้ฟรีภายใน 1 นาที พร้อมระบบพร้อมเพย์ QR และแจ้งเตือนออเดอร์เข้า LINE ครบจบในที่เดียว
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 font-black rounded-2xl text-sm sm:text-base hover:bg-slate-100 transition shadow-xl active:scale-95 cursor-pointer"
          >
            <span>เริ่มต้นสร้าง Bio Link ฟรีทันที</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-8 bg-white dark:bg-[#0B0F17] text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <SiteLogo />
          <p>© 2026 LinkTreeThai. All rights reserved. ศูนย์รวม Bio Link และร้านค้าดิจิทัลสัญชาติไทย</p>
        </div>
      </footer>

    </div>
  )
}
