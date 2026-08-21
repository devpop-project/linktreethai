'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { 
  Link2, ShoppingBag, Palette, ShieldCheck, Sparkles, ArrowRight, Sun, Moon, Rocket, Flame, Activity, 
  Smartphone, Zap, Scissors, QrCode, CheckCircle2, Globe, Heart, 
  Coins, Check, Star, ChevronRight, Share2, Layers, BarChart3, Users
} from 'lucide-react'

export default function HomePage() {
  const [claimUsername, setClaimUsername] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
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
      <header className="border-b border-slate-200/80 backdrop-blur-xl sticky top-0 z-50 bg-white/90 dark:bg-[#0F172A]/90 shadow-sm border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-2xl text-white font-black shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-[#1E1B4B] dark:text-white tracking-tight">
              LinkTreeThai
            </span>
          </Link>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition">ฟีเจอร์เด่น</a>
            <a href="#templates" className="hover:text-purple-600 dark:hover:text-purple-400 transition">เทมเพลต 3 ระดับ</a>
            <a href="#landing-page" className="hover:text-purple-600 dark:hover:text-purple-400 transition">เซลเพจ & Pixel</a>
            <a href="#pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition">แพ็กเกจ & VIP</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:border-purple-300 transition active:scale-95 shadow-sm"
              title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <Link 
              href="/login" 
              className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 dark:text-slate-300 hover:text-[#1E1B4B] dark:hover:text-white transition"
            >
              เข้าสู่ระบบ
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 text-xs font-extrabold bg-[#34D399] hover:bg-[#10B981] text-white rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
            >
              <span>สร้างฟรี</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center relative">
          
          {/* Ambient Glows */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

          {/* Hero Tagline Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            <span>One link for everything you create, share and sell online.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-[#1E1B4B] leading-[1.12] max-w-4xl mx-auto">
            รวมทุกลิ้งก์ โซเชียล และ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                  linktreethai.com/
                </span>
                <input
                  type="text"
                  placeholder="yourname"
                  value={claimUsername}
                  onChange={(e) => setClaimUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#1E1B4B] focus:outline-none font-mono placeholder-slate-400 px-1 font-bold"
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
                          <p className="text-[10px] text-slate-500">amanitathai.vercel.app</p>
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
            <h2 className="text-2xl sm:text-4xl font-black text-[#1E1B4B]">
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
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white">เพิ่มลิ้งก์ได้ไม่จำกัด (Unlimited Links)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                ทุกระดับสามารถใส่ลิ้งก์ได้ไม่จำกัดจำนวน พร้อมใส่รูป Thumbnail โลโก้, ปรับสีปุ่มอิสระ, รองรับ 10 โซเชียล และตั้งเวลาเปิด/ปิดล่วงหน้า
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B]">หน้าร้านค้าดิจิทัล 0% GP</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                โชว์สินค้า ไฟล์ดาวน์โหลด คอร์สเรียน หรือบริการ พร้อมปุ่มสั่งซื้อตรง ไม่หักค่าธรรมเนียมยอดขายแม้แต่บาทเดียว
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B]">ระบบย่อลิงก์ (URL Shortener)</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                เปลี่ยน URL ยาวๆ ให้เป็นชื่อสั้นที่คุณต้องการ เช่น <code className="text-purple-600 font-mono font-bold">/s/promo</code> พร้อมระบบนับจำนวนคลิก Real-time
              </p>
            </div>

            <div id="templates" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white">9 ธีมเทมเพลต 3 ระดับความพรีเมียม</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                ดีไซน์เฉพาะตัว: Free (Linear Stack), Pro (Bento Grid ตารางกล่องคู่), และ Master (Full Interactive Mobile App & Mini Store)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B]">ฟอร์มเก็บข้อมูลลูกค้า (Leads CRM)</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                ให้ผู้ติดตามฝากชื่อ เบอร์โทร อีเมล และข้อความติดต่อกลับ พร้อมปุ่ม Export ออกมาเป็นไฟล์ Excel/CSV ได้ทันที
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-white">เซลเพจยิงแอด & Tracking Pixels</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                สร้างหน้าเซลเพจขายของ Flash Sale แยกเฉพาะสินค้า พร้อมระบบฝัง Facebook, TikTok, Google, LINE Pixels อัตโนมัติ วัดผล Conversion แม่นยำ 100%
              </p>
            </div>
          </div>
        </section>

        {/* Pricing / VIP Section */}
        <section id="pricing" className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1E1B4B]">แพ็กเกจที่เหมาะกับคุณ</h2>
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
                  <li className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold"><Check className="w-4 h-4 text-amber-600" /> เพิ่มลิงก์ได้ไม่จำกัด (Unlimited)</li>
                  <li className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-100"><Check className="w-4 h-4 text-amber-600" /> วางขายสินค้าได้ไม่จำกัด (50+ รายการ)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> ครบทั้ง 9 เทมเพลตระดับสูงสุด (รวม Template 7, 8, 9)</li>
                  <li className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold"><Check className="w-4 h-4 text-rose-500" /> ฟรี! หน้าเซลเพจยิงแอด COD 1 URL (อายุ 30 วัน)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> ปลดล็อกระบบย่อลิงก์สั้นไม่จำกัด</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> ระบบฝัง Tracking Pixels (FB / TikTok / Google / LINE)</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold"><Check className="w-4 h-4 text-emerald-600" /> แจ้งเตือนเข้า LINE Messaging API / Webhook Real-time</li>
                </ul>
              </div>
              <Link href="/register" className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center transition shadow-lg shadow-amber-500/25 mt-4">
                เลือก MASTER VIP
              </Link>
            </div>

          </div>
        </section>

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
      <footer className="border-t border-slate-200/80 py-8 bg-white text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#1E1B4B]">
            <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center text-white text-[10px]">
              LT
            </div>
            <span>LinkTreeThai</span>
          </div>
          <p>© 2026 LinkTreeThai. All rights reserved. สร้าง Bio Link & เซลเพจขายของยิงแอดครบวงจร</p>
        </div>
      </footer>

    </div>
  )
}
