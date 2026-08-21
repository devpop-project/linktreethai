'use client'

import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Flame, Sun, LayoutGrid, ArrowUpRight } from 'lucide-react'

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

export default function Template6({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)
  const firstLink = links && links.length > 0 ? links[0] : null
  const otherLinks = links && links.length > 1 ? links.slice(1) : []

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-white font-sans antialiased relative z-10" style={{
        backgroundColor: profile.bg_color || undefined,
        ...(profile.inner_bg_image_url ? { 
          backgroundImage: `url(${profile.inner_bg_image_url})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        } : {})
      }}>
      
      {/* PRO TIER: Sunset Bento Header Card */}
      <div className="bg-gradient-to-b from-[#3D1427] to-[#1F0A14] border border-orange-400/40 rounded-[36px] p-6 text-center space-y-4 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-full text-[10px] font-black tracking-wider">
          <Sun className="w-3.5 h-3.5 text-orange-400" />
          <span>SUNSET CREATOR BENTO</span>
        </div>

        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 shadow-[0_0_25px_rgba(249,115,22,0.4)] mx-auto">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt={profile.full_name || profile.username}
              className="w-full h-full rounded-full object-cover bg-slate-950"
            />
          </div>
          <span className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full border-2 border-[#1F0A14] shadow font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-white break-words" style={{ color: profile.text_color || undefined }}>
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs font-bold text-orange-400 mt-0.5 font-mono" style={{ color: profile.text_color || undefined }}>@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs sm:text-sm text-orange-100/80 leading-relaxed max-w-xs mx-auto" style={{ color: profile.text_color || undefined }}>
            {profile.bio}
          </p>
        )}

        <SocialDock profile={profile} styleVariant="neon" className="pt-1" />

        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-2xl overflow-hidden border border-orange-500/40 aspect-video w-full bg-black shadow-xl">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Bento Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
          <LayoutGrid className="w-4 h-4 text-orange-500" /> BENTO GRID MODULES
        </h3>

        {/* Hero Link */}
        {firstLink && (
          <button
            onClick={() => handleLinkClick(firstLink.id, firstLink.url)}
            style={firstLink.bg_color ? { backgroundColor: firstLink.bg_color, color: firstLink.text_color || '#FFFFFF' } : {}}
            className={`w-full p-5 rounded-[28px] font-bold text-left flex flex-col justify-between gap-3 shadow-xl hover:scale-[1.02] transition-all group ${
              !firstLink.bg_color ? 'bg-gradient-to-r from-orange-600 to-pink-600 border border-orange-400/40' : 'border border-white/20'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow">
                  {firstLink.logo_url ? (
                    <img src={firstLink.logo_url} alt={firstLink.title} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <SocialIcon type={firstLink.icon} className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    ★ FEATURED
                  </span>
                  <h4 className="text-base sm:text-lg font-black mt-1 leading-snug">{firstLink.title}</h4>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </div>
            {firstLink.subtitle && (
              <p className="text-xs opacity-85 leading-relaxed" style={{ color: profile?.text_secondary_color || undefined }}>{firstLink.subtitle}</p>
            )}
          </button>
        )}

        {/* 2-Column Side-by-Side Widgets */}
        {otherLinks.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {otherLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{ backgroundColor: link.bg_color || profile?.custom_button_color || undefined, color: link.text_color || (link.bg_color ? '#FFFFFF' : profile?.custom_button_text_color) || undefined }}
                className={`p-4 rounded-3xl font-bold text-left flex flex-col justify-between h-32 shadow-lg hover:scale-[1.03] transition-all group ${
                  !link.bg_color ? 'bg-[#2A0F1D] border border-orange-500/30 hover:border-orange-400 backdrop-blur-xl' : 'border border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shadow overflow-hidden">
                    {link.logo_url ? (
                      <img src={link.logo_url} alt={link.title} className="w-full h-full object-cover" />
                    ) : (
                      <SocialIcon type={link.icon} className="w-5 h-5" />
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold truncate leading-tight">{link.title}</h4>
                  {link.subtitle && <p className="text-[10px] opacity-75 truncate mt-0.5">{link.subtitle}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sunset Products */}
      {products && products.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-orange-400" /> BENTO SHOP SHOWCASE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((prod) => (
              <div key={prod.id} className="bg-[#2A0F1D] border border-orange-500/30 rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-md hover:border-orange-400 transition">
                <div className="space-y-2">
                  <div className="w-full h-32 rounded-2xl bg-black overflow-hidden relative border border-orange-500/30">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 text-[9px] font-bold bg-orange-500 text-white rounded-lg shadow">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{prod.title}</h4>
                    {prod.description && <p className="text-[11px] text-orange-200/70 line-clamp-2 mt-0.5">{prod.description}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-orange-500/20 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-orange-400 font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                  <a
                    href={prod.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white rounded-xl transition shadow"
                  >
                    สั่งซื้อ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SocialDock profile={profile} styleVariant="neon" className="pt-4 pb-2" />

      {!profile.hide_branding && (
        <div className="text-center pt-2 pb-4">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-orange-500/30 text-orange-300 text-[11px] font-semibold">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-orange-400 font-bold">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
