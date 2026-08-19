'use client'

import React, { useState } from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Star, Zap, MessageSquare, Send } from 'lucide-react'

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
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-black font-sans antialiased bg-[#FEFCE8] rounded-3xl border-[3.5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10">
      
      {/* MASTER TIER: Neo-Brutalist Pop Header */}
      <div className="bg-[#FDE047] border-[3px] border-black rounded-2xl p-6 text-center space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
        <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded font-mono shadow">
          ★ MASTER CREATIVE HUB ★
        </span>

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

        <div>
          <h1 className="text-2xl font-black tracking-tight text-black break-words">
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs font-black text-purple-700 font-mono mt-0.5">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs sm:text-sm text-black font-bold leading-relaxed max-w-xs mx-auto bg-white p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
          className={`flex-1 py-2 rounded-xl font-black flex items-center justify-center gap-1 transition ${
            activeTab === 'links' ? 'bg-[#34D399] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-black'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> ลิ้งก์ ({links?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-2 rounded-xl font-black flex items-center justify-center gap-1 transition ${
            activeTab === 'shop' ? 'bg-[#FDE047] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-black'
          }`}
        >
          <Store className="w-3.5 h-3.5" /> สินค้า ({products?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('lead')}
          className={`flex-1 py-2 rounded-xl font-black flex items-center justify-center gap-1 transition ${
            activeTab === 'lead' ? 'bg-[#C084FC] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-black'
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
                style={link.bg_color ? { backgroundColor: link.bg_color, color: link.text_color || '#FFFFFF' } : {}}
                className={`w-full p-4 rounded-2xl font-black text-left flex items-center justify-between border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group ${
                  !link.bg_color ? 'bg-white text-black' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-xl shrink-0 border-2 border-black" />
                  ) : (
                    <div className="w-10 h-10 bg-[#34D399] text-black border-2 border-black rounded-xl flex items-center justify-center shrink-0">
                      <SocialIcon type={link.icon} className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-black truncate leading-snug">
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
                    <div className="w-full h-32 rounded-xl bg-[#FDE047] overflow-hidden relative border-2 border-black">
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
        <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 font-sans">
          <div className="border-b-2 border-black pb-2">
            <h4 className="font-black text-sm text-black">ฝากข้อความ / ติดต่อกลับ</h4>
            <p className="text-xs text-slate-600 mt-0.5">กรอกข้อมูลเพื่อให้เจ้าของโปรไฟล์ติดต่อกลับ</p>
          </div>

          {leadSentMsg ? (
            <div className="p-3 bg-[#34D399] border-2 border-black rounded-xl font-bold text-xs text-black text-center">
              {leadSentMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1">ชื่อของคุณ *</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="081-xxx-xxxx"
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">ข้อความเพิ่มเติม</label>
                <textarea
                  rows={2}
                  value={leadForm.note}
                  onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })}
                  placeholder="รายละเอียดเรื่องที่ต้องการติดต่อ..."
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={leadSending}
                className="w-full py-2.5 bg-[#34D399] hover:bg-[#10B981] text-black font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{leadSending ? 'กำลังส่ง...' : 'ส่งข้อมูลติดต่อ'}</span>
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
