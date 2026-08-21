'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Layers, MessageSquare, Send, ArrowUpRight, Package, CheckCircle2, MessageCircle, Phone, MapPin } from 'lucide-react'

function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null
  } catch (e) {
    return null
  }
}

interface TemplateProps {
  profile: any
  links: any[]
  products: any[]
  handleLinkClick: (id: string, url: string) => void
  isDashboardPreview?: boolean
}

export default function Template8({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'shop' | 'lead'>('links')
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', line_id: '', address: '', email: '', note: '' })
  const [leadSending, setLeadSending] = useState(false)
  const [leadSentMsg, setLeadSentMsg] = useState('')

  const supabase = createClient()
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetUserId = profile?.id || profile?.user_id
    if (!leadForm.name || !targetUserId) {
      alert('กรุณากรอกชื่อผู้ติดต่อ')
      return
    }

    setLeadSending(true)
    try {
      const payload = {
        user_id: targetUserId,
        name: leadForm.name.trim(),
        phone: leadForm.phone ? leadForm.phone.trim() : null,
        line_id: leadForm.line_id ? leadForm.line_id.trim() : null,
        email: leadForm.email ? leadForm.email.trim() : null,
        address: leadForm.address ? leadForm.address.trim() : null,
        note: leadForm.note ? leadForm.note.trim() : null,
        order_code: 'MSG-' + Date.now().toString().slice(-6),
        status: 'pending',
        line_channel_access_token: profile.line_channel_access_token || null,
        line_user_id: profile.line_user_id || null,
        line_webhook_url: profile.line_webhook_url || null,
        line_notify_token: profile.line_notify_token || null
      }

      let success = false

      // 1. Try API Route
      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (res.ok && data.success) {
          success = true
        }
      } catch (err) {}

      // 2. Direct Supabase Fallback
      if (!success) {
        const { error: directErr } = await supabase
          .from('leads')
          .insert([payload])
        if (!directErr) {
          success = true
        }
      }

      if (success) {
        setLeadSentMsg('✅ ส่งข้อความติดต่อเรียบร้อยแล้ว! ทางเราจะติดต่อกลับโดยเร็วที่สุดครับ')
        setLeadForm({ name: '', phone: '', line_id: '', address: '', email: '', note: '' })
        setTimeout(() => setLeadSentMsg(''), 6000)
      } else {
        alert('❌ ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง')
      }
    } catch (e: any) {
      alert('❌ ข้อผิดพลาด: ' + (e?.message || ''))
    } finally {
      setLeadSending(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-white font-sans antialiased relative z-10" style={{
        backgroundColor: profile.bg_color || undefined,
        ...(profile.inner_bg_image_url ? { 
          backgroundImage: `url(${profile.inner_bg_image_url})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        } : {})
      }}>
      
      {/* MASTER TIER: Spatial Glass 3D Header */}
      <div className="bg-white/[0.08] border border-white/20 rounded-[38px] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-center backdrop-blur-2xl relative p-6 space-y-4">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-[10px] font-black tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>SPATIAL 3D STORE</span>
        </div>

        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full p-1 bg-white/10 shadow-2xl border-2 border-white/40 backdrop-blur-xl mx-auto">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt={profile.full_name || profile.username}
              className="w-full h-full rounded-full object-cover bg-slate-900"
            />
          </div>
          <span className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 p-1 rounded-full border-2 border-white/60 shadow-md font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-white break-words" style={{ color: profile.text_color || undefined }}>
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs font-bold text-cyan-300 font-mono mt-0.5" style={{ color: profile.text_color || undefined }}>@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xs mx-auto break-words" style={{ color: profile.text_color || undefined }}>
            {profile.bio}
          </p>
        )}

        <SocialDock profile={profile} styleVariant="glass" className="pt-1" />

        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-2xl overflow-hidden border border-white/20 aspect-video w-full bg-black/80 shadow-2xl backdrop-blur-md">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* MASTER TIER: Spatial Glass App Tabs */}
      <div className="flex bg-white/[0.08] border border-white/20 p-1 rounded-2xl shadow-xl backdrop-blur-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('links')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'links' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md font-black' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> ลิ้งก์ ({links?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'shop' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md font-black' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Store className="w-3.5 h-3.5" /> ร้านค้า ({products?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('lead')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'lead' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md font-black' : 'text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> ติดต่อ
        </button>
      </div>

      {/* TAB 1: 3D Spatial Glass Links */}
      {activeTab === 'links' && (
        <div className="space-y-3">
          {links && links.length > 0 ? (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{ backgroundColor: link.bg_color || profile?.custom_button_color || undefined, color: link.text_color || (link.bg_color ? '#FFFFFF' : profile?.custom_button_text_color) || undefined }}
                className={`w-full p-4 rounded-3xl font-bold text-left flex items-center justify-between shadow-lg hover:scale-[1.01] transition-all group backdrop-blur-xl ${
                  !link.bg_color ? 'bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 hover:border-white/40' : 'border border-white/25'
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-2xl shrink-0 border border-white/30 shadow-md" />
                  ) : (
                    <div className="w-10 h-10 bg-cyan-500/20 text-cyan-300 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-400/30">
                      <SocialIcon type={link.icon} className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-extrabold truncate leading-snug" style={{ color: profile?.text_secondary_color || undefined }}>
                      {link.title}
                    </p>
                    {link.subtitle && <p className="text-[11px] opacity-75 truncate mt-0.5">{link.subtitle}</p>}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0 transition" />
              </button>
            ))
          ) : (
            <div className="text-center text-xs text-slate-400 py-6 bg-white/[0.05] rounded-3xl border border-white/15">ยังไม่มีลิ้งก์ในขณะนี้</div>
          )}
        </div>
      )}

      {/* TAB 2: Spatial Shop */}
      {activeTab === 'shop' && (
        <div className="space-y-4 pt-1">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white/[0.08] border border-white/20 rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-lg hover:border-white/40 transition backdrop-blur-xl">
                  <div className="space-y-2">
                    <div className="w-full h-32 rounded-2xl bg-black/40 overflow-hidden relative border border-white/20">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cyan-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                      {prod.badge && (
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 text-[9px] font-bold bg-cyan-500 text-slate-950 rounded-lg font-black shadow">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{prod.title}</h4>
                      {prod.description && <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{prod.description}</p>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                    <a
                      href={prod.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 text-xs font-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 rounded-xl transition shadow"
                    >
                      สั่งซื้อ
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 py-6 bg-white/[0.05] rounded-3xl border border-white/15">ยังไม่มีสินค้าในร้าน</div>
          )}
        </div>
      )}

      {/* TAB 3: Spatial Lead Contact Form */}
      {activeTab === 'lead' && (
        <div className="bg-white/[0.08] border border-white/20 rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 backdrop-blur-2xl text-white">
          <div className="text-center pb-2 border-b border-white/15">
            <h3 className="font-black text-base sm:text-lg text-white flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-300" />
              <span>ติดต่อสอบถาม / ฝากข้อความ</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              กรอกชื่อ เบอร์โทร และข้อความ เพื่อให้เจ้าของโปรไฟล์ติดต่อกลับหรือรับคำปรึกษา
            </p>
          </div>

          {leadSentMsg ? (
            <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl font-bold text-xs text-emerald-300 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-black text-white">{leadSentMsg}</p>
              <p className="text-[11px] text-emerald-200/80">ระบบได้ส่งข้อมูลเข้าสู่กล่องข้อความลีดเรียบร้อยแล้ว</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block mb-1.5 text-slate-200">
                  ชื่อ-นามสกุล / ผู้ติดต่อ *
                </label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="เช่น คุณสมชาย ใจดี"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-cyan-400 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none transition shadow-inner font-medium text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-slate-200">
                  เบอร์โทรศัพท์สำหรับติดต่อ *
                </label>
                <input
                  type="tel"
                  required
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="081-xxx-xxxx"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-cyan-400 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none font-mono transition shadow-inner text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>LINE ID (ถ้ามี)</span>
                  </label>
                  <input
                    type="text"
                    value={leadForm.line_id}
                    onChange={(e) => setLeadForm({ ...leadForm, line_id: e.target.value })}
                    placeholder="เช่น @yourshop หรือ line_id"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-cyan-400 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none font-mono transition shadow-inner text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-200">
                    อีเมลสำหรับติดต่อกลับ (ถ้ามี)
                  </label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-cyan-400 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none font-mono transition shadow-inner text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-200">
                  ข้อความ / เรื่องที่ต้องการติดต่อ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={leadForm.note}
                  onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })}
                  placeholder="พิมพ์ข้อความ เรื่องที่ต้องการสอบถาม หรือปรึกษาเพิ่มเติม..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-cyan-400 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none transition shadow-inner font-medium text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={leadSending}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{leadSending ? 'กำลังส่งข้อความ...' : '✈️ ส่งข้อความติดต่อกลับ'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      <SocialDock profile={profile} styleVariant="glass" className="pt-4 pb-2" />

      {!profile.hide_branding && (
        <div className="text-center pt-2 pb-4">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 hover:text-white text-[11px] font-semibold transition shadow-sm backdrop-blur-md">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-cyan-300 font-bold">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
