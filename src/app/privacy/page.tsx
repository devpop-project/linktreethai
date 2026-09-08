'use client'

import React from 'react'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2, Globe, Eye, Server, UserCheck, Mail } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SiteLogo textClassName="text-xl font-black tracking-tight text-white" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับสู่หน้าแรก</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-10 flex-1">
        
        {/* Title Section */}
        <div className="space-y-3 text-center sm:text-left border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ปรับปรุงล่าสุดเมื่อ: 9 กันยายน 2026 • มีผลบังคับใช้กับผู้ใช้งานบริการ LinkTreeThai ทุกท่าน
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          
          {/* Section 1 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">1</span>
              บทนำและขอบเขตของนโยบาย
            </h2>
            <p>
              LinkTreeThai (&quot;แพลตฟอร์ม&quot;, &quot;เรา&quot;, หรือ &quot;ของเรา&quot;) ให้ความสำคัญสูงสุดต่อการคุ้มครองข้อมูลส่วนบุคคลของคุณ นโยบายความเป็นส่วนตัวฉบับนี้จัดทำขึ้นเพื่อชี้แจงรายละเอียดเกี่ยวกับการเก็บรวบรวม การใช้ การเปิดเผย และการคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้งาน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            </p>
            <p>
              การเข้าถึงหรือการใช้บริการแพลตฟอร์ม LinkTreeThai ไม่ว่าจะเป็นการสร้าง Bio Link, เซลเพจยิงแอด, ระบบร้านค้าดิจิทัล, การโฮสต์ไฟล์ index.html หรือการใช้บริการเสริมใดๆ ถือว่าคุณได้รับทราบและตกลงยอมรับข้อกำหนดในนโยบายฉบับนี้
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">2</span>
              ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม
            </h2>
            <p>เราอาจเก็บรวบรวมข้อมูลส่วนบุคคลของคุณในกรณีต่างๆ ดังนี้:</p>
            <ul className="space-y-2 pl-4 list-disc text-slate-400">
              <li>
                <strong className="text-white">ข้อมูลบัญชีผู้ใช้งาน:</strong> ชื่อผู้ใช้ (Username), ชื่อ-นามสกุล, ที่อยู่อีเมล, รหัสผ่านที่ผ่านการเข้ารหัส (Hashed Password), รูปโปรไฟล์, รูปภาพหน้าปก
              </li>
              <li>
                <strong className="text-white">ข้อมูลเนื้อหาและการตั้งค่า:</strong> ลิงก์โซเชียลมีเดีย, รายการสินค้าและราคา, ภาพสินค้า, โค้ด HTML สำหรับหน้าโฮสต์ส่วนตัว, รหัสพิกเซลโฆษณา (Meta Pixel, TikTok Pixel, Google Analytics, LINE Tag)
              </li>
              <li>
                <strong className="text-white">ข้อมูลทางการเงินและการเติมแต้ม:</strong> รูปภาพสลิปหลักฐานการโอนเงิน (Slip URL), ยอดเงินที่แจ้งโอน, วันและเวลาที่ทำรายการ (เราไม่มีการเก็บข้อมูลหมายเลขบัตรเครดิตของท่านโดยตรง)
              </li>
              <li>
                <strong className="text-white">ข้อมูลคำสั่งซื้อและลูกค้าของผู้ใช้งาน (CRM):</strong> ชื่อผู้สั่งซื้อ, เบอร์โทรศัพท์, ที่อยู่จัดส่งพัสดุ (COD), สลิปการชำระเงินของลูกค้าที่ส่งผ่านเซลเพจของท่าน
              </li>
              <li>
                <strong className="text-white">ข้อมูลทางเทคนิคและสถิติ:</strong> ที่อยู่ IP (IP Address), ประเภทและเวอร์ชันของเว็บเบราว์เซอร์, ระบบปฏิบัติการ, สถิติจำนวนการคลิกลิงก์, สถิติจำนวนยอดเข้าชมหน้าเว็บ
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">3</span>
              วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูล
            </h2>
            <p>เราใช้ข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <h4 className="font-bold text-white text-xs">🚀 เพื่อการให้บริการหลัก</h4>
                <p className="text-[11px] text-slate-400">สร้างและแสดงผลหน้า Bio Link, ร้านค้า, เซลเพจ Flash Sale และโฮสต์ไฟล์ index.html</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <h4 className="font-bold text-white text-xs">💳 การตรวจสอบยอดเงิน</h4>
                <p className="text-[11px] text-slate-400">ตรวจสอบความถูกต้องของสลิป PromptPay เพื่อเติมแต้มสะสมและปรับระดับสิทธิ์สมาชิก</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <h4 className="font-bold text-white text-xs">📲 การแจ้งเตือนอัตโนมัติ</h4>
                <p className="text-[11px] text-slate-400">ส่งข้อความแจ้งเตือนคำสั่งซื้อใหม่และสลิปเข้าบัญชี LINE OA ของผู้ใช้งานแบบ Real-time</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <h4 className="font-bold text-white text-xs">🛡️ ความปลอดภัยของระบบ</h4>
                <p className="text-[11px] text-slate-400">ป้องกันการฉ้อโกง สแปม การโจมตีทางไซเบอร์ และการละเมิดข้อกำหนดการใช้งาน</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">4</span>
              การใช้งานคุกกี้ (Cookies) และเทคโนโลยีติดตาม
            </h2>
            <p>
              เว็บไซต์ LinkTreeThai ใช้คุกกี้เพื่อจดจำเซสชันการเข้าสู่ระบบ บันทึกการตั้งค่าธีม และรวบรวมสถิติการใช้งาน ท่านสามารถจัดการความยินยอมเกี่ยวกับคุกกี้ได้ตลอดเวลาผ่านแถบการตั้งค่าคุกกี้ที่ด้านล่างของเว็บไซต์
            </p>
            <p>
              สำหรับผู้ใช้งานที่เปิดใช้งานฟังก์ชัน Tracking Pixels (เช่น Meta Conversions API, TikTok Pixel) ข้อมูลอีเวนต์การเข้าชม (PageView / Purchase) จะถูกประมวลผลเพื่อการวัดผลประสิทธิภาพของแคมเปญโฆษณาตามที่ท่านได้ตั้งค่าไว้
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">5</span>
              การเปิดเผยข้อมูลต่อบุคคลภายนอก
            </h2>
            <p>เราจะไม่ขาย แลกเปลี่ยน หรือให้เช่าข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก เว้นแต่ในกรณีดังต่อไปนี้:</p>
            <ul className="space-y-2 pl-4 list-disc text-slate-400">
              <li>ผู้ให้บริการโครงสร้างพื้นฐานคลาวด์และฐานข้อมูลที่มีมาตรฐานความปลอดภัยระดับสากล (เช่น Supabase, Vercel)</li>
              <li>ผู้ให้บริการระบบชำระเงินและระบบยืนยันตัวตน (เช่น Google OAuth) เพื่อวัตถุประสงค์ในการเข้าสู่ระบบ</li>
              <li>เมื่อได้รับความยินยอมจากท่านอย่างชัดแจ้ง หรือเป็นการปฏิบัติตามคำสั่งศาล หรือตามที่กฎหมายกำหนด</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">6</span>
              สิทธิของเจ้าของข้อมูลส่วนบุคคลตามกฎหมาย PDPA
            </h2>
            <p>ในฐานะเจ้าของข้อมูลส่วนบุคคล ท่านมีสิทธิตามกฎหมายดังต่อไปนี้:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>สิทธิในการขอเข้าถึงและรับสำเนาข้อมูล</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>สิทธิในการขอแก้ไขข้อมูลให้ถูกต้องเป็นปัจจุบัน</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>สิทธิในการขอลบหรือทำลายข้อมูลส่วนบุคคล</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>สิทธิในการขอระงับการใช้ข้อมูลส่วนบุคคล</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>สิทธิในการเพิกถอนความยินยอม</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>สิทธิในการร้องเรียนต่อหน่วยงานที่มีอำนาจ</span>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">7</span>
              การรักษาความปลอดภัยของข้อมูล
            </h2>
            <p>
              เราใช้มาตรการรักษาความปลอดภัยทางเทคนิคและการบริหารจัดการที่เข้มงวด รวมถึงการส่งข้อมูลผ่านโปรโตคอลความปลอดภัย SSL/TLS, ระบบ Row Level Security (RLS) แยกสิทธิ์การเข้าถึงข้อมูลรายบุคคลในฐานข้อมูล และการจำกัดสิทธิ์เข้าถึงเฉพาะผู้ดูแลระบบที่มีหน้าที่เกี่ยวข้องเท่านั้น
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">8</span>
              ช่องทางการติดต่อ
            </h2>
            <p>หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ หรือต้องการใช้สิทธิตามกฎหมาย PDPA สามารถติดต่อทีมงานได้ที่:</p>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <p className="font-bold text-white">เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) • LinkTreeThai</p>
              <p className="text-slate-400">อีเมล: support@linktreethai.in.th</p>
              <p className="text-slate-400">LINE Official Account: @amth</p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © 2026 LinkTreeThai. All rights reserved. • พัฒนาด้วยความเคารพในสิทธิความเป็นส่วนตัว
      </footer>
    </div>
  )
}
