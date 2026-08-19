'use client'

import React, { useState } from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Crown, Zap, Flame, Radio, MessageSquare, Send } from 'lucide-react'

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

export default function Template9({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'shop' | 'lead'>('links')
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', note: '' })
  const [leadSending, setLeadSending] = useState(false)
  const [leadSentMsg, setLeadSentMsg] = useState('')

  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadForm.name) return
    setLeadSending(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: profile.id,
          name: leadForm.name,
          phone: leadForm.phone,
          email: leadForm.email,
          note: leadForm.note
        })
      })
      if (res.ok) {
        setLeadSentMsg('✅ ส่งข้อมูลเรียบร้อยแล้ว!')
        setLeadForm({ name: '', phone: '', email: '', note: '' })
        setTimeout(() => setLeadSentMsg(''), 4000)
      }
    } catch (e) {}
    setLeadSending(false)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-white font-sans antialiased bg-[#090D16]/90 border border-indigo-500/40 rounded-[36px] shadow-[0_0_40px_rgba(99,102,241,0.25)] backdrop-blur-2xl relative z-10">
      
      {/* Cover Banner */}
      {profile.cover_url && (
        <div className="h-32 w-full rounded-2xl overflow-hidden border border-indigo-500/30 shadow-lg">
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Creator Studio Profile Header (Matching Image 13 & 14) */}
      <div className="text-center space-y-3 pt-2">
        
        {/* RGB Animated Gradient Ring */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_25px_rgba(99,102,241,0.5)] mx-auto">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt={profile.full_name || profile.username}
              className="w-full h-full rounded-full object-cover bg-slate-950 border-2 border-slate-950"
            />
          </div>
          <span className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-950 shadow font-bold">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5 break-words">
            {profile.full_name || profile.username}
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          </h1>
          <p className="text-xs font-bold text-indigo-400 font-mono mt-0.5">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto break-words">
            {profile.bio}
          </p>
        )}

        {/* Social Dock inside dark square buttons */}
        <SocialDock profile={profile} styleVariant="neon" className="pt-2 pb-1" />

        {/* Featured YouTube Cinema Screen */}
        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-3xl overflow-hidden border border-indigo-500/40 aspect-video w-full bg-black shadow-2xl">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* MASTER TIER: Multi-Tab Studio Switcher */}
      <div className="flex bg-slate-950/80 border border-indigo-500/40 p-1 rounded-2xl shadow-xl backdrop-blur-md text-xs font-bold">
        <button
          onClick={() => setActiveTab('links')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'links' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow font-black' : 'text-indigo-300 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> ลิ้งก์ ({links?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'shop' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow font-black' : 'text-indigo-300 hover:text-white'
          }`}
        >
          <Store className="w-3.5 h-3.5" /> ร้านค้า ({products?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('lead')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'lead' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow font-black' : 'text-indigo-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> ติดต่อ
        </button>
      </div>

      {/* TAB 1: Direct Channels & Links (Matching Image 13/14) */}
      {activeTab === 'links' && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-indigo-400" /> DIRECT CHANNELS &amp; LINKS
          </h3>
          {links && links.length > 0 ? (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={link.bg_color ? { backgroundColor: link.bg_color, color: link.text_color || '#FFFFFF' } : {}}
                className={`w-full p-4 rounded-2xl font-bold text-left flex items-center justify-between transition-all group shadow-md hover:scale-[1.01] ${
                  !link.bg_color ? 'bg-[#131C2E] border border-indigo-500/30 hover:border-indigo-400' : 'border border-white/15'
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/20 shadow-md" />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                      <SocialIcon type={link.icon} className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-extrabold truncate leading-snug group-hover:text-indigo-300 transition">
                      {link.title}
                    </p>
                    {link.subtitle && <p className="text-[11px] opacity-75 truncate mt-0.5">{link.subtitle}</p>}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0 transition" />
              </button>
            ))
          ) : (
            <div className="text-center text-xs text-slate-500 py-6 bg-slate-900 rounded-2xl border border-slate-800">ยังไม่มีลิ้งก์ในขณะนี้</div>
          )}
        </div>
      )}

      {/* TAB 2: Merchandise Shop */}
      {activeTab === 'shop' && (
        <div className="space-y-4 pt-1">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="bg-gradient-to-b from-[#172033] to-[#101524] border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg hover:border-indigo-400 transition">
                  <div className="space-y-2">
                    <div className="w-full h-32 rounded-xl bg-black overflow-hidden relative border border-indigo-500/20">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                      {prod.badge && (
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 text-[9px] font-black bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-lg shadow">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{prod.title}</h4>
                      {prod.description && <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{prod.description}</p>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-black text-indigo-300 font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                    <a
                      href={prod.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 text-xs font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white rounded-xl transition shadow-lg"
                    >
                      สั่งซื้อ
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-6 bg-slate-900 rounded-2xl border border-slate-800">ยังไม่มีสินค้าในขณะนี้</div>
          )}
        </div>
      )}

      {/* TAB 3: MASTER VIP LEAD CAPTURE FORM */}
      {activeTab === 'lead' && (
        <div className="bg-[#131C2E] border border-indigo-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="border-b border-indigo-500/20 pb-2">
            <h4 className="font-extrabold text-sm text-white">ฝากข้อความ / ติดต่อกลับ</h4>
            <p className="text-xs text-slate-400 mt-0.5">กรอกข้อมูลเพื่อให้เจ้าของโปรไฟล์ติดต่อกลับ</p>
          </div>

          {leadSentMsg ? (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl font-bold text-xs text-emerald-300 text-center">
              {leadSentMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-bold text-slate-300">ชื่อของคุณ *</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-indigo-500/30 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-300">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="081-xxx-xxxx"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-indigo-500/30 rounded-xl text-white focus:outline-none focus:border-indigo-400 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-300">ข้อความเพิ่มเติม</label>
                <textarea
                  rows={2}
                  value={leadForm.note}
                  onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })}
                  placeholder="รายละเอียดเรื่องที่ต้องการติดต่อ..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-indigo-500/30 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="submit"
                disabled={leadSending}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{leadSending ? 'กำลังส่ง...' : 'ส่งข้อมูลติดต่อ'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      <SocialDock profile={profile} styleVariant="neon" className="pt-4 pb-2" />

      {!profile.hide_branding && (
        <div className="text-center pt-2 pb-4">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-200 hover:text-white text-[11px] font-semibold transition shadow-sm">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-indigo-400 font-bold">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
