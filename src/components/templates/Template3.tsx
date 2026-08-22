'use client'

import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Heart } from 'lucide-react'

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

export default function Template3({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-[#2E1065] font-sans antialiased relative z-10" style={{
        backgroundColor: profile.bg_color || undefined,
        ...(profile.inner_bg_image_url ? { 
          backgroundImage: `url(${profile.inner_bg_image_url})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        } : {})
      }}>
      
      {/* FREE TIER: Floating Open Avatar (No rectangular banner) */}
      <div className="text-center space-y-4 pt-2">
        <div className="relative inline-block">
          <div className="w-26 h-26 rounded-full p-1.5 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 shadow-lg mx-auto">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt={profile.full_name || profile.username}
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
          <span className="absolute bottom-1 right-1 bg-pink-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
            <Heart className="w-3 h-3 fill-current" />
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#2E1065] break-words" style={{ color: profile.text_color || undefined }}>
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs font-bold text-pink-600 mt-0.5" style={{ color: profile.text_color || undefined }}>@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto break-words bg-white/80 backdrop-blur-md p-3.5 rounded-3xl border border-pink-100 shadow-sm" style={{ color: profile.text_color || undefined }}>
            {profile.bio}
          </p>
        )}

        <SocialDock profile={profile} styleVariant="default" className="pt-1" />

        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-3xl overflow-hidden border-2 border-pink-200 aspect-video w-full bg-black shadow-lg">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Floating Pill Buttons */}
      <div className="space-y-3 pt-2">
        {links && links.length > 0 ? (
          links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              style={{ backgroundColor: link.bg_color || profile?.custom_button_color || undefined, color: link.text_color || (link.bg_color ? '#FFFFFF' : profile?.custom_button_text_color) || undefined }}
              className={`w-full p-4 rounded-full font-extrabold text-left flex items-center justify-between shadow-sm hover:shadow-md hover:scale-102 transition-all ${
                !link.bg_color ? 'bg-white text-[#2E1065] border border-pink-200/80 hover:border-pink-300' : 'border border-black/10'
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                {link.logo_url ? (
                  <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-full shrink-0 border border-pink-100" />
                ) : (
                  <div style={{ backgroundColor: link.icon_bg_color || undefined }} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!link.icon_bg_color ? (!link.bg_color ? 'bg-pink-100 text-pink-600' : 'bg-white/20 text-white') : ''}`}>
                    <SocialIcon type={link.icon} className="w-5 h-5" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm font-black truncate leading-snug" style={{ color: link.text_color || (link.bg_color ? "#FFFFFF" : profile?.custom_button_text_color) || undefined }}>
                    {link.title}
                  </p>
                  {link.subtitle && <p className="text-[10px] opacity-75 truncate mt-0.5">{link.subtitle}</p>}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0 transition mr-1" />
            </button>
          ))
        ) : (
          <div className="text-center text-xs text-slate-400 py-6 bg-white/60 rounded-3xl border border-pink-100">ยังไม่มีลิ้งก์ในขณะนี้</div>
        )}
      </div>

      {/* Products Pebble Grid */}
      {products && products.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-extrabold text-pink-700 uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-pink-500" /> สินค้าแนะนำ / Shop
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white/95 border border-pink-200 rounded-[28px] p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition">
                <div className="space-y-2">
                  <div className="w-full h-32 rounded-2xl bg-pink-50 overflow-hidden relative border border-pink-100">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pink-300">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 text-[9px] font-bold bg-pink-500 text-white rounded-full shadow">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2E1065] line-clamp-1">{prod.title}</h4>
                    {prod.description && <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-pink-50 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-pink-600 font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                  <a
                    href={prod.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-full transition shadow"
                  >
                    สั่งซื้อ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SocialDock profile={profile} styleVariant="default" className="pt-4 pb-2" />

      {!profile.hide_branding && (
        <div className="text-center pt-2 pb-4">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200 text-slate-600 hover:text-pink-600 text-[11px] font-bold transition shadow-sm">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-pink-600">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
