'use client'

import React from 'react'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { FileText, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Scale, HelpCircle } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <Scale className="w-4 h-4" />
            <span>ข้อตกลงและเงื่อนไขการใช้งานระบบ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ข้อกำหนดการใช้บริการ (Terms of Service)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ปรับปรุงล่าสุดเมื่อ: 9 กันยายน 2026 • มีผลผูกพันทางกฎหมายระหว่างผู้ใช้งานกับ LinkTreeThai
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          
          {/* Section 1 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">1</span>
              การยอมรับข้อกำหนดการให้บริการ
            </h2>
            <p>
              ยินดีต้อนรับสู่ LinkTreeThai การสร้างบัญชี เข้าสู่ระบบ หรือใช้บริการส่วนใดส่วนหนึ่งของแพลตฟอร์มนี้ ถือว่าคุณได้อ่าน เข้าใจ และตกลงที่จะผูกพันตนเองตามข้อกำหนดและเงื่อนไขการใช้บริการฉบับนี้ รวมถึงนโยบายความเป็นส่วนตัว (Privacy Policy) ของเราอย่างสมบูรณ์
            </p>
            <p>
              หากคุณไม่ยอมรับข้อกำหนดใดๆ ในสัญญานี้ ขอความกรุณายุติการเข้าถึงและยกเลิกการใช้งานแพลตฟอร์มทันที
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">2</span>
              ลักษณะการให้บริการของ LinkTreeThai
            </h2>
            <p>LinkTreeThai เป็นแพลตฟอร์มผู้ให้บริการเครื่องมือดิจิทัลสำหรับการทำการตลาดออนไลน์ ซึ่งประกอบด้วย:</p>
            <ul className="space-y-2 pl-4 list-disc text-slate-400">
              <li>ระบบสร้างและจัดการหน้ารวมลิงก์ (Bio Link) ในรูปแบบแอปพลิเคชันมือถือ</li>
              <li>ระบบร้านค้าดิจิทัลแสดงรายการสินค้า พร้อมระบบสร้าง Dynamic PromptPay QR ยอดตรง (0% GP)</li>
              <li>ระบบสร้างหน้าเซลเพจยิงแอด (Landing Page) และการเก็บเงินปลายทาง (COD)</li>
              <li>ระบบโฮสต์ไฟล์ HTML ส่วนตัว (/u/[slug]) รองรับการฝัง Tracking Pixels (Meta CAPI, TikTok, Google, LINE Tag)</li>
              <li>ระบบย่อลิงก์สั้น (URL Shortener) และระบบจัดเก็บข้อมูลลีดลูกค้า (CRM)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">3</span>
              การสมัครสมาชิกและบัญชีผู้ใช้งาน
            </h2>
            <p>
              ผู้ใช้งานต้องมีอายุอย่างน้อย 18 ปีบริบูรณ์ หรือได้รับความยินยอมจากผู้ปกครองตามกฎหมาย การให้ข้อมูลการลงทะเบียนต้องเป็นความจริงและเป็นปัจจุบัน
            </p>
            <p>
              คุณมีหน้าที่รับผิดชอบในการรักษาความปลอดภัยของรหัสผ่านและข้อมูลประจำตัวของบัญชีตนเอง หากเกิดความเสียหายหรือการกระทำใดๆ ผ่านบัญชีของคุณ คุณต้องเป็นผู้รับผิดชอบต่อการกระทำนั้นทั้งทางแพ่งและทางอาญา
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">4</span>
              ระบบแต้มสะสม การชำระเงิน และแพ็กเกจสมาชิก
            </h2>
            <div className="space-y-2 text-slate-400">
              <p>
                <strong className="text-white">การเติมแต้มสะสม:</strong> ผู้ใช้งานสามารถเติมแต้มผ่านระบบ PromptPay QR โดยการแนบสลิปหลักฐานการโอนเงินเพื่อให้ผู้ดูแลระบบตรวจสอบและอนุมัติแต้มเข้าบัญชี
              </p>
              <p>
                <strong className="text-white">การแลกสิทธิ์แพ็กเกจ (PRO VIP / MASTER VIP):</strong> แต้มสะสมสามารถนำมาใช้แลกสิทธิ์แพ็กเกจ VIP, สร้างหน้าเว็บ index.html, ต่ออายุเซลเพจ หรือปลดล็อกฟังก์ชันเสริมต่างๆ ตามอัตราที่ระบุไว้ในระบบ
              </p>
              <p>
                <strong className="text-white">นโยบายการคืนเงิน (Refund Policy):</strong> แต้มที่ได้รับการอนุมัติเข้าบัญชีแล้ว หรือแต้มที่ถูกใช้งานเพื่อแลกแพ็กเกจหรือบริการไปแล้ว จะไม่สามารถขอแลกเปลี่ยนเป็นเงินสดหรือขอคืนเงินได้ทุกกรณี ยกเว้นเกิดจากข้อผิดพลาดทางเทคนิคของระบบที่ตรวจสอบแล้ว
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-black shrink-0">5</span>
              กฎเกณฑ์และข้อห้ามในการใช้งาน (Acceptable Use Policy)
            </h2>
            <p className="text-rose-300 font-bold">
              ผู้ใช้งานตกลงว่าจะไม่ใช้บริการ LinkTreeThai ในการสร้าง เผยแพร่ หรือเชื่อมโยงไปยังสิ่งต่อไปนี้:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-slate-400">
              <li>เนื้อหาหรือสินค้าที่ผิดกฎหมายแห่งราชอาณาจักรไทย เช่น ยาเสพติด อาวุธ สารต้องห้าม</li>
              <li>เว็บไซต์การพนันออนไลน์ สล็อต คาสิโน หรือการพนันทุกรูปแบบ</li>
              <li>เนื้อหาลามกอนาจาร สิ่งลามกเด็ก หรือการค้าประเวณี</li>
              <li>พฤติกรรมหลอกลวง แชร์ลูกโซ่ (Ponzi Schemes) ฟิชชิ่ง (Phishing) หรือแอบอ้างบุคคลอื่น</li>
              <li>การส่งสแปม (Spam) การกระจายมัลแวร์ หรือโค้ดที่เป็นอันตรายต่อระบบคอมพิวเตอร์</li>
              <li>เนื้อหาที่ละเมิดลิขสิทธิ์ เครื่องหมายการค้า หรือสิทธิในทรัพย์สินทางปัญญาของผู้อื่น</li>
            </ul>
            <p className="text-[11px] text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
              ⚠️ หากพบการฝ่าฝืน ทางเราขอสงวนสิทธิ์ในการระงับหน้าเว็บ ระงับบัญชีผู้ใช้งาน และลบข้อมูลทั้งหมดออกจากระบบทันทีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า และจะไม่คืนแต้มหรือค่าบริการใดๆ ทั้งสิ้น
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">6</span>
              การปฏิเสธความรับผิดชอบ (Disclaimer)
            </h2>
            <p>
              LinkTreeThai เป็นเพียงผู้ให้บริการเครื่องมือและโครงสร้างพื้นฐานทางเทคโนโลยี เราไม่มีส่วนเกี่ยวข้องกับการซื้อขาย การส่งมอบสินค้า คุณภาพสินค้า หรือธุรกรรมทางการเงินระหว่างผู้ใช้งานและลูกค้าปลายทางของท่าน
            </p>
            <p>
              บริการนี้จัดให้มีขึ้นตามสภาพที่เป็นอยู่ (&quot;AS IS&quot;) และตามที่มีอยู่ เราไม่รับประกันว่าการให้บริการจะปราศจากการหยุดชะงัก การล่าช้า หรือข้อผิดพลาดใดๆ ที่เกิดจากเหตุสุดวิสัยหรือผู้ให้บริการภายนอก
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">7</span>
              กฎหมายที่ใช้บังคับและการระงับข้อพิพาท
            </h2>
            <p>
              ข้อกำหนดฉบับนี้อยู่ภายใต้การบังคับใช้และการตีความตามกฎหมายของราชอาณาจักรไทย ข้อพิพาทใดๆ ที่เกิดขึ้นจากหรือเกี่ยวข้องกับข้อกำหนดนี้ให้อยู่ภายใต้เขตอำนาจศาลของประเทศไทย
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 bg-[#131B2A] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0">8</span>
              การติดต่อฝ่ายสนับสนุน
            </h2>
            <p>หากมีข้อสงสัยเกี่ยวกับข้อกำหนดการใช้บริการ หรือต้องการแจ้งการละเมิดเนื้อหา สามารถติดต่อเราได้ที่:</p>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <p className="font-bold text-white">ฝ่ายสนับสนุนลูกค้าและกฎหมาย • LinkTreeThai</p>
              <p className="text-slate-400">อีเมล: legal@linktreethai.in.th</p>
              <p className="text-slate-400">LINE Official Account: @amth</p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © 2026 LinkTreeThai. All rights reserved. • ข้อกำหนดและเงื่อนไขการใช้บริการ
      </footer>
    </div>
  )
}
