'use client'

import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store } from 'lucide-react'

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

export default function Template1({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-[#1E1B4B] font-sans antialiased relative z-10">
      
      {/* FREE TIER: Classic Vertical Stack Card */}
      <div className="bg-white/95 border border-purple-100/90 rounded-[32px] overflow-hidden shadow-sm text-center backdrop-blur-md">
        <div className="h-32 w-full bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 relative">
          {profile.cover_url && (
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="p-6 pt-0 space-y-3">
          <div className="relative inline-block -mt-14">
            <div className="w-24 h-24 rounded-full p-1 bg-white shadow-md border border-purple-100">
              <img
                src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
                alt={profile.full_name || profile.username}
                className="w-full h-full rounded-full object-cover bg-slate-50"
              />
            </div>
            <span className="absolute bottom-1 right-1 bg-[#34D399] text-white p-1 rounded-full border-2 border-white shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1E1B4B] break-words">
              {profile.full_name || profile.username}
            </h1>
            <p className="text-xs font-bold text-purple-600 mt-0.5 font-mono">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto break-words">
              {profile.bio}
            </p>
          )}

          <SocialDock profile={profile} styleVariant="default" className="pt-2 pb-1" />

          {embedUrl && (
            <div className="pt-2">
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video w-full bg-black shadow-md">
                <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FREE TIER: Single-column linear buttons stack */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#1E1B4B] uppercase tracking-wider px-2 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-purple-600" /> Links & Profile
        </h3>
        {links && links.length > 0 ? (
          links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              style={link.bg_color ? { backgroundColor: link.bg_color, color: link.text_color || '#FFFFFF' } : {}}
              className={`w-full p-4 rounded-2xl font-bold text-left flex items-center justify-between transition-all group shadow-sm hover:shadow-md hover:scale-[1.01] ${
                !link.bg_color ? 'bg-white text-[#1E1B4B] border border-slate-200/90 hover:border-purple-300' : 'border border-black/10'
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                {link.logo_url ? (
                  <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/20 shadow-sm" />
                ) : (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!link.bg_color ? 'bg-purple-50 text-purple-600' : 'bg-white/20 text-white'}`}>
                    <SocialIcon type={link.icon} className="w-5 h-5" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm font-extrabold truncate leading-snug">
                    {link.title}
                  </p>
                  {link.subtitle && <p className={`text-[11px] font-medium truncate mt-0.5 ${!link.bg_color ? 'text-slate-500' : 'opacity-80'}`}>{link.subtitle}</p>}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0 transition" />
            </button>
          ))
        ) : (
          <div className="text-center text-xs text-slate-400 py-6 bg-white/80 rounded-2xl border border-slate-200">ยังไม่มีลิ้งก์ในขณะนี้</div>
        )}
      </div>

      {/* Products list */}
      {products && products.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-extrabold text-[#1E1B4B] uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#34D399]" /> สินค้าแนะนำ / Shop
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white/95 border border-slate-200/90 rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition">
                <div className="space-y-2">
                  <div className="w-full h-32 rounded-2xl bg-slate-50 overflow-hidden relative border border-slate-100">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-lg border border-amber-200">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E1B4B] line-clamp-1">{prod.title}</h4>
                    {prod.description && <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-emerald-600 font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                  <a
                    href={prod.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-extrabold bg-[#34D399] hover:bg-[#10B981] text-white rounded-xl transition shadow-sm"
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
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-[#1E1B4B] text-[11px] font-semibold transition shadow-sm">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-purple-600 font-bold">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
