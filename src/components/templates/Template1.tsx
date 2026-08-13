import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import { ExternalLink, Globe, Sparkles, CheckCircle, ShoppingBag, Store } from 'lucide-react'

function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`
    }
  } catch (e) {}
  return null
}

interface TemplateProps {
  profile: any
  links: any[]
  products: any[]
  handleLinkClick: (id: string, url: string) => void
}

export default function Template1({ profile, links, products, handleLinkClick }: TemplateProps) {
  const embedUrl = getYouTubeEmbedUrl(profile.youtube_url)

  return (
    <div className="w-full max-w-md mx-auto relative z-10 px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      
      {/* Profile Showcase Hero Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-4 relative overflow-hidden">
        
        {/* Full Width Cover Banner */}
        <div className="w-full h-36 sm:h-44 bg-slate-950 overflow-hidden relative border-b border-white/10">
          {profile.cover_url ? (
            <img src={profile.cover_url} alt="Cover Banner" className="w-full h-full object-cover object-center block" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 flex items-center justify-center opacity-40">
              <Sparkles className="w-10 h-10 text-emerald-400" />
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 pt-0 space-y-3">
          <div className="relative inline-block -mt-16 sm:-mt-20">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.id}`}
              alt={profile.full_name || profile.username}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto object-cover border-4 border-slate-950 shadow-2xl"
            />
            <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-950">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white break-words px-2">{profile.full_name || profile.username}</h1>
            <p className="text-xs font-semibold text-emerald-400 mt-0.5 truncate">@{profile.username}</p>
          </div>

          {profile.bio && <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-xs mx-auto text-slate-300 break-words">{profile.bio}</p>}

          {/* Featured YouTube Video Embed */}
          {embedUrl && (
            <div className="pt-2">
              <div className="rounded-2xl overflow-hidden border border-white/15 aspect-video w-full bg-black shadow-xl">
                <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-emerald-400" /> Links & Profile
        </h3>
        {links && links.length > 0 ? (
          links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              style={{ backgroundColor: link.bg_color || '#1e293b', color: link.text_color || '#ffffff' }}
              className="w-full p-3.5 sm:p-4 rounded-2xl font-bold text-left flex items-center justify-between border border-white/10 shadow-lg hover:opacity-95 transition-all"
            >
              <div className="flex items-center gap-3.5 overflow-hidden pr-2">
                {link.logo_url ? (
                  <img src={link.logo_url} alt={link.title} className="w-9 h-9 object-cover rounded-xl shrink-0 border border-white/15" />
                ) : (
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                    <SocialIcon type={link.icon} className="w-5 h-5" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm font-black truncate leading-snug">{link.title}</p>
                  {link.subtitle && <p className="text-[11px] sm:text-xs font-normal opacity-75 truncate mt-0.5">{link.subtitle}</p>}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
            </button>
          ))
        ) : (
          <div className="text-center text-xs opacity-60 py-6 bg-slate-900/60 rounded-2xl border border-slate-800">ยังไม่มีลิ้งก์ในขณะนี้</div>
        )}
      </div>

      {/* STORE / PRODUCTS SHOWCASE SECTION */}
      {products && products.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-400" /> สินค้าแนะนำ / Shop
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-3 sm:p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl text-slate-100"
              >
                <div className="space-y-2">
                  <div className="relative aspect-square w-full bg-black/40 rounded-xl overflow-hidden border border-slate-800">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40"><ShoppingBag className="w-8 h-8" /></div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-2 left-2 text-[9px] sm:text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-1">{prod.title}</h4>
                    {prod.description && <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2 mt-0.5">{prod.description}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-emerald-400">฿{prod.price}</span>
                  <a
                    href={prod.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-black bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition shadow"
                  >
                    สั่งซื้อ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Footer */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5 opacity-90">
        {profile.social_facebook && <a href={profile.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-2xl border border-slate-800"><SocialIcon type="facebook" className="w-4 h-4" /></a>}
        {profile.social_instagram && <a href={profile.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-pink-400 rounded-2xl border border-slate-800"><SocialIcon type="instagram" className="w-4 h-4" /></a>}
        {profile.social_tiktok && <a href={profile.social_tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-2xl border border-slate-800"><SocialIcon type="tiktok" className="w-4 h-4" /></a>}
        {profile.social_youtube && <a href={profile.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-red-500 rounded-2xl border border-slate-800"><SocialIcon type="youtube" className="w-4 h-4" /></a>}
        {profile.social_email && <a href={`mailto:${profile.social_email}`} className="p-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-2xl border border-slate-800"><SocialIcon type="email" className="w-4 h-4" /></a>}
      </div>
    </div>
  )
}
