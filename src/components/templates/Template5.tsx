'use client'

import React, { useState } from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Crown, Award } from 'lucide-react'

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

export default function Template5({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'shop'>('links')
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)
  const hasProducts = products && products.length > 0

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-[#FFF8E7] font-serif antialiased relative z-10">
      
      {/* Top Cover Banner */}
      {profile.cover_url && (
        <div className="h-32 w-full rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl mb-2">
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Royale Profile Header (Matching Image 12 exactly) */}
      <div className="text-center space-y-3 pt-2">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-yellow-500 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.5)] mx-auto">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt={profile.full_name || profile.username}
              className="w-full h-full rounded-full object-cover bg-black border-2 border-black"
            />
          </div>
          <span className="absolute bottom-0 right-0 bg-amber-400 text-black p-1.5 rounded-full border-2 border-black font-bold shadow-md">
            <Crown className="w-3.5 h-3.5" />
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-amber-200 font-serif drop-shadow-md">
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs font-semibold text-amber-400 font-sans mt-0.5">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs text-amber-100/90 leading-relaxed max-w-xs mx-auto font-sans">
            {profile.bio}
          </p>
        )}

        <SocialDock profile={profile} styleVariant="gold" className="pt-1 pb-1" />

        {/* Featured YouTube Video Embed */}
        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-3xl overflow-hidden border-2 border-amber-500/40 aspect-video w-full bg-black shadow-2xl">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Gold Segmented Tabs (Matching Image 12 exactly) */}
      {hasProducts && (
        <div className="flex bg-black/80 border border-amber-500/40 p-1 rounded-2xl shadow-xl backdrop-blur-md font-sans">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              activeTab === 'links' ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-md' : 'text-amber-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>ลิ้งก์ ({links?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              activeTab === 'shop' ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-md' : 'text-amber-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>ร้านค้า ({products?.length || 0})</span>
          </button>
        </div>
      )}

      {/* Gold Vibrant Links List (Matching Image 12 solid colors) */}
      {(!hasProducts || activeTab === 'links') && (
        <div className="space-y-3 font-sans">
          {links && links.length > 0 ? (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{
                  backgroundColor: link.bg_color || '#1A1A24',
                  color: link.text_color || '#FFFFFF'
                }}
                className="w-full p-4 rounded-2xl font-bold text-left flex items-center justify-between border border-white/10 shadow-lg hover:opacity-95 hover:scale-[1.01] transition-all group"
              >
                <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/20 shadow" />
                  ) : (
                    <div className="w-10 h-10 bg-black/20 text-white rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                      <SocialIcon type={link.icon} className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-black truncate leading-snug">
                      {link.title}
                    </p>
                    {link.subtitle && <p className="text-[11px] opacity-80 truncate mt-0.5">{link.subtitle}</p>}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0 transition" />
              </button>
            ))
          ) : (
            <div className="text-center text-xs text-amber-300/60 py-6 bg-black/60 rounded-2xl border border-amber-500/20">ยังไม่มีลิ้งก์ในขณะนี้</div>
          )}
        </div>
      )}

      {/* Luxury Boutique Shop */}
      {hasProducts && activeTab === 'shop' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
          {products.map((prod) => (
            <div key={prod.id} className="bg-[#181822] border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-amber-400 transition shadow">
              <div className="space-y-2">
                <div className="w-full h-32 rounded-xl bg-black overflow-hidden relative border border-amber-500/30">
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-500">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                  {prod.badge && (
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 text-[9px] font-bold bg-amber-400 text-black rounded font-black shadow">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white line-clamp-1 font-serif">{prod.title}</h4>
                  {prod.description && <p className="text-[11px] text-amber-200/70 line-clamp-2 mt-0.5">{prod.description}</p>}
                </div>
              </div>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between gap-1">
                <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                <a
                  href={prod.buy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black rounded-lg transition shadow font-serif"
                >
                  สั่งซื้อ
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <SocialDock profile={profile} styleVariant="gold" className="pt-4 pb-2" />

      {!profile.hide_branding && (
        <div className="text-center pt-2 pb-4 font-sans">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-amber-500/40 text-amber-300 text-[11px] font-semibold shadow">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-amber-400 font-bold">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
