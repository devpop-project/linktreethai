'use client'

import React, { useState } from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Layers, MessageSquare, Send, ArrowUpRight } from 'lucide-react'

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
        setLeadSentMsg('✅ ส่งข้อความเรียบร้อยแล้ว!')
        setLeadForm({ name: '', phone: '', email: '', note: '' })
        setTimeout(() => setLeadSentMsg(''), 4000)
      }
    } catch (e) {}
    setLeadSending(false)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-white font-sans antialiased relative z-10">
      
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
          <h1 className="text-2xl font-black tracking-tight text-white break-words">
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs font-bold text-cyan-300 font-mono mt-0.5">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xs mx-auto break-words">
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
                style={link.bg_color ? { backgroundColor: link.bg_color, color: link.text_color || '#FFFFFF' } : {}}
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
                    <p className="text-xs sm:text-sm font-extrabold truncate leading-snug">
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
        <div className="bg-white/[0.08] border border-white/20 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="border-b border-white/15 pb-2">
            <h4 className="font-extrabold text-sm text-white">ฝากข้อความ / ติดต่อกลับ</h4>
            <p className="text-xs text-slate-300 mt-0.5">กรอกข้อมูลเพื่อให้เจ้าของโปรไฟล์ติดต่อกลับ</p>
          </div>

          {leadSentMsg ? (
            <div className="p-3 bg-cyan-500/20 border border-cyan-400 rounded-xl font-bold text-xs text-cyan-300 text-center">
              {leadSentMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-bold text-slate-200">ชื่อของคุณ *</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-200">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="081-xxx-xxxx"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-200">ข้อความเพิ่มเติม</label>
                <textarea
                  rows={2}
                  value={leadForm.note}
                  onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })}
                  placeholder="รายละเอียดเรื่องที่ต้องการติดต่อ..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={leadSending}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{leadSending ? 'กำลังส่ง...' : 'ส่งข้อมูลติดต่อ'}</span>
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
