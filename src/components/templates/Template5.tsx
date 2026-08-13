import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import { getUserTier } from '@/lib/tier'
import { ExternalLink, ShoppingBag, Globe, Sparkles, Store, CheckCircle } from 'lucide-react'

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
  isDashboardPreview?: boolean
}

export default function Template5({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const tierInfo = getUserTier(profile)
  const canPerLinkColor = isDashboardPreview || tierInfo.canPerLinkColor
  const canEmbedYouTube = isDashboardPreview || tierInfo.canEmbedYouTube
  const embedUrl = canEmbedYouTube ? getYouTubeEmbedUrl(profile.youtube_url) : null

  return (
    <div className="w-full max-w-md mx-auto relative z-10 px-4 py-8 space-y-6">
      
      {/* Storefront Header */}
      <div className="p-5 bg-gradient-to-br from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-500/40 rounded-3xl shadow-2xl space-y-4 relative overflow-hidden">
        
        {profile.cover_url && (
          <div className="w-full h-24 -mt-5 -mx-5 mb-2 overflow-hidden border-b border-purple-500/30">
            <img src={profile.cover_url} alt="Cover Banner" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.id}`}
            alt={profile.full_name || profile.username}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shrink-0 shadow-lg"
          />
          <div className="overflow-hidden">
            <span className="inline-block px-2.5 py-0.5 bg-purple-500 text-slate-950 text-[10px] font-black rounded-md uppercase mb-1">
              VIP Master Storefront
            </span>
            <h1 className="text-lg font-black text-white truncate">{profile.full_name || profile.username}</h1>
            <p className="text-xs text-purple-300 truncate">@{profile.username}</p>
          </div>
        </div>

        {profile.bio && <p className="text-xs text-slate-300 leading-relaxed">{profile.bio}</p>}

        {/* YouTube Embed Player */}
        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-2xl overflow-hidden border border-purple-500/30 aspect-video w-full bg-black shadow-xl">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Featured Digital Storefront Grid Upfront */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase text-purple-300 flex items-center gap-1.5 tracking-wider">
            <Store className="w-4 h-4 text-purple-400" /> สินค้าแนะนำ / Master Catalog
          </h2>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            {products.length} Items
          </span>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl transition-all hover:scale-[1.02]"
              >
                <div className="space-y-2">
                  <div className="relative aspect-square w-full bg-black/40 rounded-xl overflow-hidden border border-slate-800">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40"><ShoppingBag className="w-8 h-8" /></div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-2 left-2 text-[10px] font-black bg-purple-400 text-slate-950 px-2 py-0.5 rounded-md shadow">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-100 line-clamp-1">{prod.title}</h3>
                    {prod.description && <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{prod.description}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                  <span className="text-sm font-black text-purple-300">฿{prod.price}</span>
                  <a
                    href={prod.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-[10px] font-black bg-purple-500 text-slate-950 rounded-xl hover:bg-purple-400 transition shadow"
                  >
                    สั่งซื้อ
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
            ยังไม่มีสินค้าในหน้าร้านค้า
          </div>
        )}
      </div>

      {/* Secondary Links List */}
      {links && links.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">ช่องทางติดตามอื่นๆ</h3>
          {links.map((link) => {
            const linkBg = canPerLinkColor ? (link.bg_color || '#1e293b') : '#1e293b'
            const linkText = canPerLinkColor ? (link.text_color || '#ffffff') : '#ffffff'

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{ backgroundColor: linkBg, color: linkText }}
                className="w-full p-3.5 rounded-xl font-bold text-left flex items-center justify-between transition-all border border-white/10 shadow-md"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-7 h-7 object-cover rounded-lg shrink-0" />
                  ) : (
                    <SocialIcon type={link.icon} className="w-4 h-4 opacity-80" />
                  )}
                  <span className="text-xs font-bold truncate">{link.title}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            )
          })}
        </div>
      )}

      {/* Social Footer */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5 opacity-90">
        {profile.social_facebook && <a href={profile.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 text-blue-400 rounded-2xl border border-slate-800"><SocialIcon type="facebook" className="w-4 h-4" /></a>}
        {profile.social_instagram && <a href={profile.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 text-pink-400 rounded-2xl border border-slate-800"><SocialIcon type="instagram" className="w-4 h-4" /></a>}
        {profile.social_tiktok && <a href={profile.social_tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800"><SocialIcon type="tiktok" className="w-4 h-4" /></a>}
        {profile.social_youtube && <a href={profile.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 text-red-500 rounded-2xl border border-slate-800"><SocialIcon type="youtube" className="w-4 h-4" /></a>}
        {profile.social_email && <a href={`mailto:${profile.social_email}`} className="p-2.5 bg-slate-900 text-amber-300 rounded-2xl border border-slate-800"><SocialIcon type="email" className="w-4 h-4" /></a>}
      </div>

    </div>
  )
}
