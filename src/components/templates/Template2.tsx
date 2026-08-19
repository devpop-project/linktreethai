'use client'

import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import SocialDock from '@/components/SocialDock'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store, Zap } from 'lucide-react'

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

export default function Template2({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)

  return (
    <div className="w-full max-w-md mx-auto space-y-5 px-4 py-6 text-slate-100 font-sans antialiased relative z-10">
      
      {/* FREE TIER: Dark Minimalist Card */}
      <div className="bg-[#111827]/95 border border-slate-800 rounded-[32px] overflow-hidden shadow-xl text-center backdrop-blur-xl">
        <div className="h-32 w-full bg-slate-900 relative">
          {profile.cover_url && (
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="p-6 pt-0 space-y-3">
          <div className="relative inline-block -mt-14">
            <div className="w-24 h-24 rounded-full p-1 bg-slate-950 shadow-xl border border-slate-700">
              <img
                src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
                alt={profile.full_name || profile.username}
                className="w-full h-full rounded-full object-cover bg-slate-900"
              />
            </div>
            <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-950">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white break-words">
              {profile.full_name || profile.username}
            </h1>
            <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto break-words">
              {profile.bio}
            </p>
          )}

          <SocialDock profile={profile} styleVariant="neon" className="pt-2 pb-1" />

          {embedUrl && (
            <div className="pt-2">
              <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video w-full bg-black shadow-lg">
                <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dark Stack Buttons */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-emerald-400" /> Links & Profile
        </h3>
        {links && links.length > 0 ? (
          links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              style={link.bg_color ? { backgroundColor: link.bg_color, color: link.text_color || '#FFFFFF' } : {}}
              className={`w-full p-4 rounded-2xl font-bold text-left flex items-center justify-between transition-all group shadow-sm hover:shadow-md ${
                !link.bg_color ? 'bg-[#1F2937] text-white border border-slate-800 hover:border-slate-700' : 'border border-white/10'
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                {link.logo_url ? (
                  <img src={link.logo_url} alt={link.title} className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/10" />
                ) : (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!link.bg_color ? 'bg-slate-800 text-emerald-400' : 'bg-black/20 text-white'}`}>
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
              <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 shrink-0 transition" />
            </button>
          ))
        ) : (
          <div className="text-center text-xs text-slate-500 py-6 bg-slate-900 rounded-2xl border border-slate-800">ยังไม่มีลิ้งก์ในขณะนี้</div>
        )}
      </div>

      {/* Dark Products */}
      {products && products.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-400" /> สินค้าแนะนำ / Shop
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((prod) => (
              <div key={prod.id} className="bg-[#1F2937] border border-slate-800 rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-md">
                <div className="space-y-2">
                  <div className="w-full h-32 rounded-2xl bg-black overflow-hidden relative border border-slate-800">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/40">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{prod.title}</h4>
                    {prod.description && <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{prod.description}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">฿{parseFloat(prod.price).toLocaleString()}</span>
                  <a
                    href={prod.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition shadow"
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
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] font-semibold transition shadow-sm">
            <span>สร้าง Bio Link ฟรีที่</span>
            <strong className="text-emerald-400 font-bold">LinkTreeThai</strong>
          </a>
        </div>
      )}
    </div>
  )
}
