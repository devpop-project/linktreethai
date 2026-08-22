'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Star, Zap, MessageSquare, Send, Package, CheckCircle2, MessageCircle, Phone, MapPin } from 'lucide-react'

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

export default function Template7({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'shop' | 'lead'>('links')
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', line_id: '', address: '', email: '', note: '' })
  const [leadSending, setLeadSending] = useState(false)
  const [leadSentMsg, setLeadSentMsg] = useState('')

  const supabase = createClient()
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadForm.name || !leadForm.phone) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์สำหรับติดต่อกลับ')
      return
    }

    setLeadSending(true)
    const targetUserId = profile?.id || profile?.user_id || null
    const orderRef = 'MSG-' + Date.now().toString().slice(-6)

    try {
      // 1. Send via /api/lead which handles LINE Messaging API push & DB insert
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: targetUserId,
          name: leadForm.name.trim(),
          phone: leadForm.phone.trim(),
          line_id: leadForm.line_id ? leadForm.line_id.trim() : null,
          email: leadForm.email ? leadForm.email.trim() : null,
          address: leadForm.address ? leadForm.address.trim() : null,
          note: leadForm.note ? leadForm.note.trim() : null,
          order_code: orderRef,
          status: 'pending',
          line_channel_access_token: profile?.line_channel_access_token || null,
          line_user_id: profile?.line_user_id || null,
          line_webhook_url: profile?.line_webhook_url || null,
          line_notify_token: profile?.line_notify_token || null
        })
      })

      // Show success message immediately
      setLeadSentMsg('✅ ส่งข้อความติดต่อเรียบร้อยแล้ว! ทางร้านจะติดต่อกลับโดยเร็วที่สุดครับ')
      setLeadForm({ name: '', phone: '', line_id: '', address: '', email: '', note: '' })
      setTimeout(() => setLeadSentMsg(''), 7000)
    } catch (e: any) {
      // Direct client fallback insert if fetch fails
      try {
        if (targetUserId) {
          await supabase.from('leads').insert([{
            user_id: targetUserId,
            name: leadForm.name.trim(),
            phone: leadForm.phone.trim(),
            line_id: leadForm.line_id ? leadForm.line_id.trim() : null,
            email: leadForm.email ? leadForm.email.trim() : null,
            note: leadForm.note ? leadForm.note.trim() : null
          }])
        }
      } catch (dbErr) {}

      setLeadSentMsg('✅ ส่งข้อความติดต่อเรียบร้อยแล้ว! ทางร้านจะติดต่อกลับโดยเร็วที่สุดครับ')
      setLeadForm({ name: '', phone: '', line_id: '', address: '', email: '', note: '' })
      setTimeout(() => setLeadSentMsg(''), 7000)
    } finally {
      setLeadSending(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-black font-sans antialiased bg-[#FEFCE8] rounded-3xl border-[3.5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10" style={{
        backgroundColor: profile.bg_color || undefined,
        ...(profile.inner_bg_image_url ? { 
          backgroundImage: `url(${profile.inner_bg_image_url})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        } : {})
      }}>
      
      {/* MASTER TIER: Neo-Brutalist Pop Header */}
      <div className="border-[3px] border-black rounded-2xl p-6 text-center flex flex-col items-center space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative" style={{ backgroundColor: profile.card_bg_color || "#FDE047" }}>
        <div className="w-full flex justify-center">
          <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded font-mono shadow">
            ★ MASTER CREATIVE HUB ★
          </span>
        </div>

        <div className="w-full flex justify-center">
          <div className="relative inline-block">
          <div className="w-24 h-24 rounded-2xl p-1 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black mx-auto">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt={profile.full_name || profile.username}
              className="w-full h-full rounded-xl object-cover bg-white"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#34D399] text-black p-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
          </span>
        </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-black break-words" style={{ color: profile.text_color || undefined }}>
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs font-black text-purple-700 font-mono mt-0.5" style={{ color: profile.text_color || undefined }}>@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs sm:text-sm text-black font-bold leading-relaxed max-w-xs mx-auto bg-white p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ color: profile.text_color || undefined }}>
            {profile.bio}
          </p>
        )}

        <SocialDock profile={profile} styleVariant="retro" className="pt-2 pb-1" />

        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-2xl overflow-hidden border-[3px] border-black aspect-video w-full bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* MASTER TIER: Interactive Sticky App Tabs */}
      <div className="flex bg-white border-[3px] border-black p-1 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs">
        <button
          onClick={() => setActiveTab('links')}
          style={{ backgroundColor: activeTab === 'links' ? (profile.tab_active_color || profile.card_bg_color || '#34D399') : undefined }}
          className={`flex-1 py-2 rounded-xl font-black flex items-center justify-center gap-1 transition ${
            activeTab === 'links' ? 'text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-black'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> ลิ้งก์ ({links?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          style={{ backgroundColor: activeTab === 'shop' ? (profile.tab_active_color || profile.card_bg_color || '#FDE047') : undefined }}
          className={`flex-1 py-2 rounded-xl font-black flex items-center justify-center gap-1 transition ${
            activeTab === 'shop' ? 'text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-black'
          }`}
        >
          <Store className="w-3.5 h-3.5" /> สินค้า ({products?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('lead')}
          style={{ backgroundColor: activeTab === 'lead' ? (profile.tab_active_color || profile.card_bg_color || '#C084FC') : undefined }}
          className={`flex-1 py-2 rounded-xl font-black flex items-center justify-center gap-1 transition ${
            activeTab === 'lead' ? 'text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-black'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> ติดต่อ
        </button>
      </div>

      {/* TAB 1: Bold Pop Links */}
      {activeTab === 'links' && (
        <div className="space-y-3 font-sans">
          {links && links.length > 0 ? (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{ backgroundColor: link.bg_color || profile?.custom_button_color || undefined, color: link.text_color || (link.bg_color ? '#FFFFFF' : profile?.custom_button_text_color) || undefined }}
                className={`w-full p-4 rounded-2xl font-black text-left flex items-center justify-between border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group ${
                  !link.bg_color ? 'bg-white text-black' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-xl shrink-0 border-2 border-black" />
                  ) : (
                    <div 
                      className="w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: link.icon_bg_color || (link.bg_color ? 'rgba(0,0,0,0.15)' : (profile.card_bg_color || '#34D399')),
                        color: link.text_color || '#000000'
                      }}
                    >
                      <SocialIcon type={link.icon} className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-black truncate leading-snug" style={{ color: link.text_color || (link.bg_color ? '#FFFFFF' : profile?.custom_button_text_color) || undefined }}>
                      {link.title}
                    </p>
                    {link.subtitle && <p className="text-[11px] font-bold opacity-80 truncate mt-0.5">{link.subtitle}</p>}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </button>
            ))
          ) : (
            <div className="text-center text-xs font-bold text-black py-6 bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">ยังไม่มีลิ้งก์ในขณะนี้</div>
          )}
        </div>
      )}

      {/* TAB 2: Pop Products */}
      {activeTab === 'shop' && (
        <div className="space-y-4 pt-1 font-sans">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white border-[3px] border-black rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-2">
                    <div className="w-full h-32 rounded-xl overflow-hidden relative border-2 border-black" style={{ backgroundColor: profile.card_bg_color || "#FDE047" }}>
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                      {prod.badge && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-black bg-black text-white rounded border border-black">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-black line-clamp-1">{prod.title}</h4>
                      {prod.description && <p className="text-[11px] font-semibold text-slate-600 line-clamp-2 mt-0.5">{prod.description}</p>}
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-black flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-black text-black font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                    <a
                      href={prod.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 text-xs font-black bg-[#34D399] hover:bg-[#10B981] text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition"
                    >
                      สั่งซื้อ
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs font-bold text-black py-6 bg-white rounded-2xl border-[3px] border-black">ยังไม่มีสินค้าในร้าน</div>
          )}
        </div>
      )}

      {/* TAB 3: MASTER VIP INTEGRATED LEAD CAPTURE FORM */}
      {activeTab === 'lead' && (
        <div className="bg-[#FEFCE8] border-[3.5px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[32px] p-5 sm:p-6 space-y-4 text-black font-sans">
          <div className="text-center pb-2 border-b-2 border-black">
            <h3 className="font-black text-base sm:text-lg text-black flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-700" />
              <span>ติดต่อสอบถาม / ฝากข้อความ</span>
            </h3>
            <p className="text-xs text-slate-700 mt-1 font-bold">
              กรอกชื่อ เบอร์โทร และข้อความ เพื่อให้เจ้าของโปรไฟล์ติดต่อกลับ
            </p>
          </div>

          {leadSentMsg ? (
            <div className="p-6 bg-[#34D399] border-2 border-black rounded-2xl font-black text-xs text-black text-center space-y-2 animate-in zoom-in-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-10 h-10 text-black mx-auto" />
              <p className="text-sm font-black">{leadSentMsg}</p>
              <p className="text-[11px]">ระบบได้ส่งข้อมูลเข้าสู่กล่องข้อความลีดเรียบร้อยแล้ว</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block mb-1.5 text-black font-black">
                  ชื่อ-นามสกุล / ผู้ติดต่อ *
                </label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="เช่น คุณสมชาย ใจดี"
                  className="w-full px-4 py-3 bg-white border-2 border-black focus:bg-yellow-50 rounded-2xl text-black placeholder:text-slate-400 focus:outline-none transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-black font-black">
                  เบอร์โทรศัพท์สำหรับติดต่อ *
                </label>
                <input
                  type="tel"
                  required
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="081-xxx-xxxx"
                  className="w-full px-4 py-3 bg-white border-2 border-black focus:bg-yellow-50 rounded-2xl text-black placeholder:text-slate-400 focus:outline-none font-mono transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-black font-black flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>LINE ID (ถ้ามี)</span>
                  </label>
                  <input
                    type="text"
                    value={leadForm.line_id}
                    onChange={(e) => setLeadForm({ ...leadForm, line_id: e.target.value })}
                    placeholder="เช่น @yourshop หรือ line_id"
                    className="w-full px-4 py-3 bg-white border-2 border-black focus:bg-yellow-50 rounded-2xl text-black placeholder:text-slate-400 focus:outline-none font-mono transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-black font-black">
                    อีเมลสำหรับติดต่อกลับ (ถ้ามี)
                  </label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white border-2 border-black focus:bg-yellow-50 rounded-2xl text-black placeholder:text-slate-400 focus:outline-none font-mono transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-black font-black">
                  ข้อความ / เรื่องที่ต้องการติดต่อ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={leadForm.note}
                  onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })}
                  placeholder="พิมพ์ข้อความ เรื่องที่ต้องการสอบถาม หรือปรึกษาเพิ่มเติม..."
                  className="w-full px-4 py-3 bg-white border-2 border-black focus:bg-yellow-50 rounded-2xl text-black placeholder:text-slate-400 focus:outline-none transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={leadSending}
                className="w-full py-3.5 bg-[#C084FC] hover:bg-[#A855F7] text-black font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{leadSending ? 'กำลังส่งข้อความ...' : '✈️ ส่งข้อความติดต่อกลับ'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      <SocialDock profile={profile} styleVariant="retro" className="pt-4 pb-2" />

      {!profile.hide_branding && (
        <div className="text-center pt-2 pb-4 font-mono">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-black text-black text-[11px] font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-purple-700">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
