import Link from 'next/link'
import { Link2, ShoppingBag, Palette, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 font-bold">
              <Link2 className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              MyBioLink
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-emerald-400 transition">
              เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="px-5 py-2.5 text-sm font-semibold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition flex items-center gap-1.5">
              สมัครใช้งานฟรี <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" /> ระบบ Bio Link + ร้านค้าดิจิทัล ฟรี 100%
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          รวมทุกโซเชียล และ <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">หน้าร้านค้าของคุณ</span> ในลิ้งก์เดียว
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          สร้างหน้า Linktree ของตัวเอง ตกแต่งธีมสุดชิค จัดการลิ้งก์โซเชียล พร้อมโชว์สินค้าและปุ่มสั่งซื้อ จบในที่เดียวด้วย Next.js และ Supabase
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link href="/register" className="px-8 py-4 text-base font-bold bg-emerald-500 text-slate-950 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
            เริ่มต้นสร้าง Bio Link ของคุณฟรี <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/demo" className="px-8 py-4 text-base font-semibold bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl hover:bg-slate-700 transition">
            ดูตัวอย่างหน้าจริง
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl backdrop-blur">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">รวมลิ้งก์โซเชียล</h3>
            <p className="text-slate-400 text-sm">แปะลิ้งก์ Facebook, Instagram, TikTok, YouTube, LINE ได้ไม่จำกัด พร้อมเก็บสถิติจำนวนคนคลิก</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl backdrop-blur">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">ปรับตกแต่งสไตล์ฟรี</h3>
            <p className="text-slate-400 text-sm">เปลี่ยนธีม สีพื้นหลัง รูปโปรไฟล์ และรูปแบบปุ่มได้ตามสไตล์คุณ เช่น Dark, Cyberpunk, Sunset, Glassmorphism</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl backdrop-blur">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">ระบบร้านค้าในตัว</h3>
            <p className="text-slate-400 text-sm">โชว์การ์ดสินค้า ภาพถ่าย ราคา ป้ายลดราคา และแปะลิ้งก์สั่งซื้อตรงไปยังแชทหรือหน้าร้านของคุณได้ทันที</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 MyBioLink. Powered by Next.js & Supabase Free Tier.</p>
      </footer>
    </div>
  )
}
