'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { 
  Link2, ShoppingBag, Palette, ShieldCheck, Sparkles, ArrowRight, Sun, Moon, Rocket, Flame, Activity, 
  Smartphone, Zap, Scissors, QrCode, CheckCircle2, Globe, Heart, 
  Coins, Check, Star, ChevronRight, Share2, Layers, BarChart3, Users, Eye, X, Search
} from 'lucide-react'

export default function HomePage() {
  const [claimUsername, setClaimUsername] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [realProfiles, setRealProfiles] = useState<any[]>([])
  const [realSalepages, setRealSalepages] = useState<any[]>([])
  const [loadingShowcase, setLoadingShowcase] = useState(true)
  const [showcasePage, setShowcasePage] = useState(1)
  const [isAllShowcaseOpen, setIsAllShowcaseOpen] = useState(false)
  const [allShowcaseFilter, setAllShowcaseFilter] = useState<'all' | 'bio' | 'salepage'>('all')
  const [allShowcaseSearch, setAllShowcaseSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const savedTheme = localStorage.getItem('linktree_theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }

    // Load dynamic site settings (Logo, Title, Footer)
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.settings) setSiteSettings(data.settings)
      })
      .catch(() => {})

    // Load REAL users and REAL landing pages from Supabase
    const supabase = createClient()
    const loadRealUsers = async () => {
      setLoadingShowcase(true)
      try {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, username, full_name, bio, avatar_url, cover_url, role, points, template_id, created_at')
          .order('created_at', { ascending: false })
          .limit(12)

        if (profs && profs.length > 0) {
          setRealProfiles(profs)
        }

        const { data: lps } = await supabase
          .from('landing_pages')
          .select('id, title, slug, headline, offer_price, hero_image_url, bg_color, theme_color, created_at, profiles(username, full_name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(6)

        if (lps && lps.length > 0) {
          setRealSalepages(lps)
        }
      } catch (e) {}
      setLoadingShowcase(false)
    }
    loadRealUsers()
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

  const handleClaimLink = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = claimUsername.toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (clean) {
      router.push(`/register?username=${clean}`)
    } else {
      router.push('/register')
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-slate-100 flex flex-col justify-between selection:bg-[#A78BFA] selection:text-white overflow-x-hidden font-sans">
      
      {/* Top Navigation Bar (Clean White Bar on Pastel Base) */}
      <header className="border-b border-slate-200/80 backdrop-blur-xl sticky top-0 z-50 bg-white/95 dark:bg-[#0F172A]/95 shadow-sm border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <div className="truncate">
            <SiteLogo customLogoUrl={siteSettings?.site_logo_url} />
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition">ฟีเจอร์เด่น</a>
            <a href="#templates" className="hover:text-purple-600 dark:hover:text-purple-400 transition">เทมเพลต 3 ระดับ</a>
            <a href="#landing-page" className="hover:text-purple-600 dark:hover:text-purple-400 transition">เซลเพจ & Pixel</a>
            <a href="#pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition">แพ็กเกจ & VIP</a>
            <Link href="/examples" className="text-purple-700 dark:text-purple-300 hover:text-purple-600 font-extrabold flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 transition shadow-xs">
              <span>ตัวอย่างผู้ใช้งานจริง</span>
              <span className="text-amber-500">🌟</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:border-purple-300 transition active:scale-95 shadow-sm shrink-0"
              title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <Link 
              href="/login" 
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-purple-600 transition whitespace-nowrap"
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-6 sm:pt-12 pb-16 sm:pb-20 text-center relative overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

          {/* PROMINENT HERO BRAND LOGO (ใหญ่ขึ้น คมชัด หรูหรา) */}
          <div className="flex flex-col items-center justify-center mb-6 animate-in zoom-in-95 duration-500">
            {siteSettings?.site_logo_url ? (
              <div className="group cursor-pointer py-3">
                <img 
                  src={siteSettings.site_logo_url} 
                  alt="LinkTreeThai Logo" 
                  className="h-36 sm:h-48 md:h-56 lg:h-64 w-auto max-w-[480px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_20px_50px_rgba(167,139,250,0.4)] mx-auto" 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 group cursor-pointer py-2">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[36px] bg-gradient-to-tr from-purple-600 via-indigo-600 to-[#34D399] flex items-center justify-center text-white shadow-2xl shadow-purple-500/40 group-hover:scale-105 transition-transform duration-300">
                  <Link2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                <div className="text-center mt-1">
                  <span className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                    LinkTree<span className="text-purple-600 dark:text-purple-400">Thai</span>
                  </span>
                  <div className="text-xs sm:text-sm font-black tracking-widest uppercase bg-gradient-to-r from-purple-600 to-teal-400 dark:from-purple-400 dark:to-teal-300 bg-clip-text text-transparent mt-0.5">
                    Bio & Sales Automation 🇹🇭
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hero Tagline Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            <span>One link for everything you create, share and sell online.</span>
          </div>

          {/* Main Headline (High Contrast in both Light & Dark Mode) */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.2] max-w-4xl mx-auto px-2">
            รวมทุกลิ้งก์ โซเชียล และ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 dark:from-purple-400 dark:via-indigo-300 dark:to-emerald-400 bg-clip-text text-transparent">
              ร้านค้าดิจิทัลของคุณ
            </span> ไว้ในที่เดียว
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            สร้างหน้า Bio Link สวยหรู สไตล์พาสเทลและแอปมือถือ รวมทุกช่องทาง Facebook, TikTok, LINE, Shopee, Lazada พร้อมวางขายสินค้า ย่อลิงก์สั้น และเก็บรายชื่อลูกค้า จบครบทุกฟังก์ชันฟรี 100%
          </p>

          {/* Interactive Claim Username Form (Signature Bio.link feature with Mint Button) */}
          <div className="max-w-lg mx-auto mt-8">
            <form onSubmit={handleClaimLink} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition">
              <div className="flex items-center flex-1 w-full pl-3 sm:pl-4 py-1">
                <span className="text-slate-400 text-xs sm:text-sm font-mono font-medium select-none">
                  linktreethai.in.th/
                </span>
                <input
                  type="text"
                  placeholder="yourname"
                  value={claimUsername}
                  onChange={(e) => setClaimUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none font-mono placeholder-slate-400 px-1 font-bold"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
              >
                <span>จองลิงก์ของคุณฟรี</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mt-3 font-semibold">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> ฟรีตลอดชีพ
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> ไม่ต้องใช้บัตรเครดิต
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> ติดตั้งเสร็จใน 1 นาที
              </span>
            </div>
          </div>

          {/* Interactive Live Smartphone Mockup Showcase */}
          <div className="mt-14 max-w-sm mx-auto relative">
            <div className="w-full bg-[#1E1B4B] border-[7px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden p-2.5 relative">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full ml-auto mr-2.5"></div>
              </div>

              {/* Inner Screen Mockup */}
              <div className="w-full bg-white rounded-[38px] p-4 pt-10 text-center space-y-3.5 border border-slate-200 min-h-[500px] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 p-0.5 mx-auto shadow-md">
                      <img 
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=amanita" 
                        alt="Creator Avatar" 
                        className="w-full h-full rounded-full object-cover bg-slate-100"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 bg-[#34D399] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">
                      PRO
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-[#1E1B4B] text-base flex items-center justify-center gap-1">
                      Amanita Thailand <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">สมุนไพรธรรมชาติ & ความรู้เพื่อสุขภาพ</p>
                  </div>

                  {/* 10-Social Dock Display */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] text-blue-600 font-bold">FB</div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] text-pink-600 font-bold">IG</div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] text-slate-900 font-bold">TT</div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] text-emerald-600 font-bold">LN</div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] text-orange-600 font-bold">SP</div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] text-red-600 font-bold">YT</div>
                  </div>

                  {/* Sample Links with Thumbnails */}
                  <div className="space-y-2 pt-2 text-left">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                          🌐
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1E1B4B]">เว็บไซต์ทางการ</p>
                          <p className="text-[10px] text-slate-500">linktreethai.in.th/amanitathailand</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                          💬
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1E1B4B]">ไลน์ทางการ [บ้านเขียว]</p>
                          <p className="text-[10px] text-emerald-600 font-bold">ปรึกษา & สั่งซื้อไว</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    </div>

                    <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                          🛍️
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-900">ร้านค้าทางการ Shopee</p>
                          <p className="text-[10px] text-slate-500">มีโค้ดส่วนลด 50%</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#34D399] text-white font-bold px-2 py-0.5 rounded-lg">สั่งเลย</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <span>สร้างฟรีด้วย</span>
                  <strong className="text-purple-600 font-bold">LinkTreeThai</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid (Clean White Cards with Soft Shadows) */}
        <section id="features" className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1E1B4B] dark:text-white">
              ครบทุกเครื่องมือสำหรับ <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Creator ยุคใหม่</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              ออกแบบมาเพื่อการใช้งานที่ง่าย โหลดเร็ว สไตล์ Mobile App และเพิ่มยอดขายให้ธุรกิจคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white dark:text-white">เพิ่มลิ้งก์ได้ไม่จำกัด (Unlimited Links)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                ทุกระดับสามารถใส่ลิ้งก์ได้ไม่จำกัดจำนวน พร้อมใส่รูป Thumbnail โลโก้, ปรับสีปุ่มอิสระ, รองรับ 10 โซเชียล และตั้งเวลาเปิด/ปิดล่วงหน้า
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white">หน้าร้านค้าดิจิทัล 0% GP</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                โชว์สินค้า ไฟล์ดาวน์โหลด คอร์สเรียน หรือบริการ พร้อมปุ่มสั่งซื้อตรง ไม่หักค่าธรรมเนียมยอดขายแม้แต่บาทเดียว
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white">ระบบย่อลิงก์ (URL Shortener)</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                เปลี่ยน URL ยาวๆ ให้เป็นชื่อสั้นที่คุณต้องการ เช่น <code className="text-purple-600 font-mono font-bold">/s/promo</code> พร้อมระบบนับจำนวนคลิก Real-time
              </p>
            </div>

            <div id="templates" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white dark:text-white">9 ธีมเทมเพลต 3 ระดับความพรีเมียม</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                ดีไซน์เฉพาะตัว: Free (Linear Stack), Pro (Bento Grid ตารางกล่องคู่), และ Master (Full Interactive Mobile App & Mini Store)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white">ฟอร์มเก็บข้อมูลลูกค้า (Leads CRM)</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                ให้ผู้ติดตามฝากชื่อ เบอร์โทร อีเมล และข้อความติดต่อกลับ พร้อมปุ่ม Export ออกมาเป็นไฟล์ Excel/CSV ได้ทันที
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white dark:text-white">เซลเพจ PromptPay QR & ยิงแอด CAPI</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                สร้างหน้าเซลเพจขายของ Flash Sale พร้อม Dynamic PromptPay QR ตามยอดเงินของร้านค้าคุณ + เก็บเงินปลายทาง (COD) และยิง Meta CAPI / Pixels อัตโนมัติ 100%
              </p>
            </div>
          </div>
        </section>

        {/* Pricing / VIP Section */}
        <section id="pricing" className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1E1B4B] dark:text-white">แพ็กเกจที่เหมาะกับคุณ</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">เริ่มต้นฟรี และอัปเกรดเพื่อปลดล็อกฟังก์ชันขั้นสูงด้วยแต้มสะสม</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white">Free Plan</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">สำหรับผู้เริ่มต้นสร้างโปรไฟล์</p>
                </div>
                <div className="text-3xl font-black text-[#1E1B4B] dark:text-white">฿0 <span className="text-xs font-normal text-slate-500">ตลอดชีพ</span></div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 font-medium">
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4" /> เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> วางขายได้ 2 สินค้า (0% GP)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 3 เทมเพลตมาตรฐาน (Classic Stack)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> QR Code ดาวน์โหลด & สถิตินับคลิก Real-time</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> รองรับระบบฝังวิดีโอ YouTube</li>
                </ul>
              </div>
              <Link href="/register" className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-extrabold rounded-2xl text-xs flex items-center justify-center transition mt-4">
                สมัครใช้งานฟรี
              </Link>
            </div>

            {/* Pro VIP Plan */}
            <div className="bg-purple-50/70 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 p-6 rounded-3xl space-y-4 relative shadow-md flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-[10px] font-black bg-purple-600 text-white px-3 py-1 rounded-full shadow">
                POPULAR
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-purple-900 dark:text-purple-200">PRO VIP</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">สำหรับ Creator & แม่ค้าออนไลน์</p>
                </div>
                <div className="text-3xl font-black text-purple-950 dark:text-white">฿299 <span className="text-xs font-normal text-slate-500">/ 30 วัน (299 แต้ม)</span></div>
                <ul className="text-xs text-slate-700 dark:text-slate-200 space-y-2.5 pt-3 border-t border-purple-200/60 dark:border-purple-900/60 font-medium">
                  <li className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold"><Check className="w-4 h-4 text-purple-600" /> เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> วางขายได้ 10 สินค้าในร้านค้า</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> 6 เทมเพลตสไตล์ Bento Grid ยอดนิยม</li>
                  <li className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-100"><Check className="w-4 h-4 text-purple-600" /> ซ่อนลายน้ำแบรนด์ LinkTreeThai ได้ 100%</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> QR Code ดาวน์โหลด & สถิติคนเข้าชม</li>
                </ul>
              </div>
              <Link href="/register" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center transition shadow-lg shadow-purple-600/25 mt-4">
                เริ่มต้น PRO VIP
              </Link>
            </div>

            {/* Master VIP Plan */}
            <div className="bg-amber-50/70 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 p-6 rounded-3xl space-y-4 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-3 py-1 rounded-full shadow">
                BEST VALUE • ครบทุกฟังก์ชัน
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 dark:text-amber-200">MASTER VIP</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">สำหรับแบรนด์และธุรกิจยิงแอดเต็มตัว</p>
                </div>
                <div className="text-3xl font-black text-amber-950 dark:text-white">฿599 <span className="text-xs font-normal text-slate-500">/ 30 วัน (599 แต้ม)</span></div>
                <ul className="text-xs text-slate-700 dark:text-slate-200 space-y-2.5 pt-3 border-t border-amber-200/60 dark:border-amber-900/60 font-medium">
                  <li className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold"><Check className="w-4 h-4 text-amber-600" /> เพิ่มลิงก์ไม่จำกัด & วางขายสินค้าได้ 0% GP</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 text-emerald-600" /> ฟรี! เซลเพจยิงแอด 1 URL พร้อม PromptPay QR ส่วนตัว</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 text-emerald-600" /> เช็กเอาต์ 2 ระบบ (โอนพร้อมเพย์ตามยอด + ปลายทาง COD)</li>
                  <li className="flex items-center gap-2 text-[#06C755] font-bold"><Check className="w-4 h-4 text-[#06C755]" /> แจ้งเตือนออเดอร์ & สลิปเข้า LINE Messaging API ทันที</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> Full-Funnel Tracking (Pixel, Meta CAPI, UTM Forwarding)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> ครบทั้ง 9 เทมเพลตระดับสูงสุด (รวม Template 7, 8, 9)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> ปลดล็อกระบบย่อลิงก์สั้น Shortlinks ไม่จำกัด</li>
                </ul>
              </div>
              <Link href="/register" className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center transition shadow-lg shadow-amber-500/25 mt-4">
                เลือก MASTER VIP
              </Link>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SHOWCASE SECTION: ตัวอย่างผู้ที่มาสมัครใช้งานจริง (Live User Showcase) */}
        {/* ========================================================================= */}
        <section id="examples" className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/80 dark:border-slate-800 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>ตัวอย่างหน้าของผู้ที่มาสมัครใช้งานจริง</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1E1B4B] dark:text-white dark:text-white tracking-tight">
                สัมผัสผลงานจริงจาก <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-[#34D399] bg-clip-text text-transparent">
                  ร้านค้าและครีเอเตอร์ชั้นนำ
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                ดูตัวอย่างหน้า Bio Link และเซลเพจของสมาชิกที่เปิดใช้งานจริง พร้อมระบบชำระเงินและแจ้งเตือนเข้า LINE
              </p>
            </div>

            <Link
              href="/examples"
              className="px-6 py-3 bg-[#1E1B4B] dark:bg-white hover:bg-purple-700 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition shadow-md self-start md:self-auto cursor-pointer shrink-0"
            >
              <span>ดูตัวอย่างผลงานทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* DYNAMIC REAL USERS & SALEPAGES SHOWCASE (AUTO-SCROLLING HORIZONTAL MARQUEE & EXPLORE ALL) */}
          {(() => {
            // Build showcase list from real database profiles & salepages
            const defaultShowcase = [
              {
                id: 'seed-amanita',
                type: 'bio',
                name: 'Enter The Amanita Thailand',
                username: 'amanitathailand',
                bio: 'แบรนด์สมุนไพรออร์แกนิกและสารสกัดธรรมชาติอันดับ 1 ในไทย รวมทุกลิงก์และช่องทางสั่งซื้ออย่างเป็นทางการ',
                avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=amanita',
                category: '🌿 สมุนไพร & สุขภาพ',
                views: '18.5k',
                rating: '5.0',
                badge1: 'แบรนด์ทางการ Verified',
                badge2: 'PromptPay QR + LINE',
                url: '/amanitathailand'
              },
              {
                id: 'seed-official',
                type: 'bio',
                name: 'LinkTreeThai Official',
                username: 'official',
                bio: 'ศูนย์รวมระบบ Bio Link & เซลเพจปิดการขายสัญชาติไทย ฝัง Tracking Pixels, CAPI และแจ้งเตือนเข้า LINE Real-Time',
                avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=official',
                category: '⭐ แพลตฟอร์มหลัก',
                views: '42.9k',
                rating: '5.0',
                badge1: 'ระบบแท้ 100%',
                badge2: 'MASTER VIP Hub',
                url: '/official'
              },
              {
                id: 'seed-salepage',
                type: 'salepage',
                name: 'โปรโมชั่น Flash Sale พิเศษ',
                username: 'amanita-drops',
                bio: 'หน้าเซลเพจยิงแอดความเร็วสูง พร้อมระบบสแกนจ่าย Dynamic PromptPay QR ตามยอด + เก็บเงินปลายทาง (COD)',
                avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=salepage',
                category: '🚀 เซลเพจปิดการขาย',
                views: '29.7k',
                rating: '5.0',
                badge1: 'Dynamic PromptPay',
                badge2: 'แจ้งเตือนสลิป LINE',
                url: '/p/amanita-drops'
              }
            ]

            // Dynamic items from real database
            const dynamicProfiles = (realProfiles || []).map((p: any) => ({
              id: p.id,
              type: 'bio',
              name: p.full_name || `@${p.username}`,
              username: p.username,
              bio: p.bio || 'สมาชิกผู้ใช้งานจริงบน LinkTreeThai Platform',
              avatarUrl: p.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`,
              category: p.role === 'admin' ? '👑 แอดมิน & ครีเอเตอร์' : (p.points > 100 ? '⭐ MASTER VIP' : '👤 ครีเอเตอร์'),
              views: `${(Math.floor(Math.random() * 80) + 12) / 10}k`,
              rating: '5.0',
              badge1: p.template_id ? p.template_id.replace('template_', 'Template ') : 'Bio Link',
              badge2: 'Real User',
              url: `/${p.username}`
            }))

            const dynamicSalepages = (realSalepages || []).map((lp: any) => ({
              id: lp.id,
              type: 'salepage',
              name: lp.title || lp.headline,
              username: `p/${lp.slug}`,
              bio: lp.headline || 'เซลเพจปิดการขายยิงแอด Facebook & TikTok',
              avatarUrl: lp.hero_image_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${lp.slug}`,
              category: '🚀 เซลเพจยิงแอด',
              views: `${(Math.floor(Math.random() * 150) + 50) / 10}k`,
              rating: '5.0',
              badge1: lp.offer_price ? `฿${parseFloat(String(lp.offer_price)).toLocaleString()}` : 'Flash Sale',
              badge2: 'แจ้งเตือน LINE',
              url: `/p/${lp.slug}`
            }))

            // Merge dynamic real items
            const allShowcaseItems = [...dynamicProfiles, ...dynamicSalepages]
            const rawList = allShowcaseItems.length > 0 ? allShowcaseItems : defaultShowcase
            
            // Limit to at most 10 items for the auto-scrolling preview
            const previewItems = rawList.slice(0, 10)
            // Duplicate for smooth seamless infinite loop marquee
            const marqueeList = [...previewItems, ...previewItems]

            // Filtered list for the "Explore All" Modal
            const modalFilteredItems = rawList.filter(item => {
              const matchType = allShowcaseFilter === 'all' || item.type === allShowcaseFilter
              const q = allShowcaseSearch.toLowerCase().trim()
              const matchQ = !q || (
                item.name.toLowerCase().includes(q) ||
                item.username.toLowerCase().includes(q) ||
                (item.bio && item.bio.toLowerCase().includes(q))
              )
              return matchType && matchQ
            })

            return (
              <div className="space-y-6">
                
                {/* 1. AUTO-SCROLLING HORIZONTAL MARQUEE TRACK (เลื่อนอัตโนมัติไปข้างๆ ไม่เกิน 10 รายการ) */}
                <div className="relative overflow-hidden w-full py-4 group">
                  {/* Left & Right Smooth Gradient Fade Overlays */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#F9F9FF] dark:from-[#0B0F17] to-transparent z-10"></div>
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#F9F9FF] dark:from-[#0B0F17] to-transparent z-10"></div>

                  <div className="animate-marquee flex gap-6">
                    {marqueeList.map((item, idx) => (
                      <div 
                        key={`${item.id}-${idx}`} 
                        className="w-[280px] sm:w-[320px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-800 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group/card relative select-none"
                      >
                        {item.type === 'salepage' && (
                          <div className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-md">
                            HOT SALEPAGE
                          </div>
                        )}

                        <div>
                          {/* Gradient Header Banner */}
                          <div className={`h-24 p-3.5 flex items-start justify-between ${
                            item.type === 'salepage' 
                              ? 'bg-gradient-to-r from-rose-600 via-red-700 to-slate-950' 
                              : 'bg-gradient-to-r from-purple-600 via-indigo-700 to-slate-950'
                          }`}>
                            <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-bold backdrop-blur-md">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full text-yellow-300 text-[10px] font-bold">
                              <Star className="w-3 h-3 fill-yellow-300" /> {item.rating}
                            </div>
                          </div>

                          {/* Content Area */}
                          <div className="p-5 pt-0 space-y-3">
                            <div className="flex items-end justify-between -mt-9 mb-1">
                              <img 
                                src={item.avatarUrl} 
                                alt={item.name} 
                                className="w-16 h-16 rounded-2xl border-2 border-white dark:border-slate-800 shadow-lg bg-slate-100 object-cover" 
                              />
                              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                {item.views} views
                              </span>
                            </div>

                            <div>
                              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1">
                                <span className="truncate">{item.name}</span>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              </h3>
                              <p className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold truncate">
                                linktreethai.in.th/{item.username}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed font-medium">
                                {item.bio}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-[10px] font-bold border border-emerald-200 dark:border-emerald-900/50">
                                {item.badge1}
                              </span>
                              <span className="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold border border-purple-200 dark:border-purple-900/50">
                                {item.badge2}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Live Button */}
                        <div className="p-5 pt-0">
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className={`w-full py-3 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer ${
                              item.type === 'salepage'
                                ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/25'
                                : 'bg-[#1E1B4B] dark:bg-slate-800 hover:bg-purple-700 dark:hover:bg-purple-600 shadow-purple-950/30'
                            }`}
                          >
                            {item.type === 'salepage' ? <Rocket className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{item.type === 'salepage' ? 'เข้าชมเซลเพจ Live ➔' : 'เข้าชมหน้าจริง (Live) ➔'}</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. EXPLORE ALL SHOWCASE BUTTON & NOTICE */}
                <div className="text-center pt-3 space-y-2">
                  <Link
                    href="/examples"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#1E1B4B] dark:text-white font-black rounded-2xl text-xs sm:text-sm border-2 border-purple-200 dark:border-purple-900/60 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all active:scale-95 cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
                    <span>สำรวจและดูตัวอย่างหน้าจริงทั้งหมด ➔</span>
                  </Link>
                  <p className="text-[11px] text-slate-400 font-medium">
                    💡 เลื่อนเมาส์ชี้เพื่อหยุดแถบเลื่อนอัตโนมัติชั่วคราว หรือกดปุ่มด้านบนเพื่อเลือกดูผลงานทั้งหมด
                  </p>
                </div>

                {/* 3. FULLSCREEN EXPLORE ALL MODAL */}
                {isAllShowcaseOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[36px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                      
                      {/* Modal Header */}
                      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black shadow-sm">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-base sm:text-lg text-[#1E1B4B] dark:text-white flex items-center gap-2">
                              <span>ตัวอย่างหน้าจริงและผลงานผู้ใช้งานทั้งหมด</span>
                              <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold">
                                {modalFilteredItems.length} รายการ
                              </span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">เลือกชมหน้า Bio Link และหน้าเซลเพจยิงแอดของสมาชิกระบบจริง</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsAllShowcaseOpen(false)}
                          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Filter & Search Bar in Modal */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                          <button
                            type="button"
                            onClick={() => setAllShowcaseFilter('all')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                              allShowcaseFilter === 'all'
                                ? 'bg-purple-600 text-white shadow'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            ทั้งหมด ({rawList.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAllShowcaseFilter('bio')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                              allShowcaseFilter === 'bio'
                                ? 'bg-purple-600 text-white shadow'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            🔗 Bio Link ({dynamicProfiles.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAllShowcaseFilter('salepage')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                              allShowcaseFilter === 'salepage'
                                ? 'bg-rose-600 text-white shadow'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            🚀 เซลเพจยิงแอด ({dynamicSalepages.length})
                          </button>
                        </div>

                        <div className="relative w-full sm:w-64">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือ username..."
                            value={allShowcaseSearch}
                            onChange={(e) => setAllShowcaseSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      {/* Modal Grid of All Items */}
                      <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {modalFilteredItems.length === 0 ? (
                          <div className="p-12 text-center text-xs text-slate-400">
                            ไม่พบรายการที่ตรงกับการค้นหา
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {modalFilteredItems.map((item) => (
                              <div
                                key={item.id}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:shadow-lg transition"
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.avatarUrl}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-black shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate flex items-center gap-1">
                                        <span>{item.name}</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      </h4>
                                      <p className="text-[11px] font-mono text-purple-600 dark:text-purple-400 truncate">
                                        linktreethai.in.th/{item.username}
                                      </p>
                                    </div>
                                  </div>

                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.bio}
                                  </p>

                                  <div className="flex gap-1.5">
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                      {item.badge1}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                      {item.badge2}
                                    </span>
                                  </div>
                                </div>

                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`w-full py-2.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition ${
                                    item.type === 'salepage'
                                      ? 'bg-rose-600 hover:bg-rose-500'
                                      : 'bg-purple-600 hover:bg-purple-500'
                                  }`}
                                >
                                  {item.type === 'salepage' ? <Rocket className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  <span>{item.type === 'salepage' ? 'เข้าชมเซลเพจ ➔' : 'เข้าชมหน้าจริง ➔'}</span>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                          onClick={() => setIsAllShowcaseOpen(false)}
                          className="px-5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          ปิดหน้าต่าง
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )
          })()}        </section>

        {/* Bottom CTA Banner */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 sm:p-12 rounded-[36px] shadow-xl text-white space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              พร้อมสร้าง Bio Link สวยๆ ของคุณหรือยัง? 🚀
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm max-w-lg mx-auto">
              เข้าร่วมกับผู้ใช้งานหลายพันคนทั่วประเทศไทย สร้างลิงก์โปรไฟล์และเปิดร้านค้าออนไลน์ได้ทันที
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl text-sm transition shadow-lg active:scale-95"
            >
              เริ่มต้นสร้าง Bio Link ฟรี <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-8 bg-white dark:bg-[#0B0F17] text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#1E1B4B] dark:text-white">
            {siteSettings?.site_logo_url ? (
              <img src={siteSettings.site_logo_url} alt="Logo" className="h-6 max-w-[120px] object-contain" />
            ) : (
              <>
                <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center text-white text-[10px] font-black">
                  LT
                </div>
                <span>{siteSettings?.site_title ? siteSettings.site_title.split(' - ')[0] : 'LinkTreeThai'}</span>
              </>
            )}
          </div>
          <p>{siteSettings?.site_footer_text || '© 2026 LinkTreeThai. All rights reserved. สร้าง Bio Link & เซลเพจขายของยิงแอดครบวงจร'}</p>
        </div>
      </footer>

    </div>
  )
}
