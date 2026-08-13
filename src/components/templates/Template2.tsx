import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import { getUserTier } from '@/lib/tier'
import { ExternalLink, ShoppingBag, Globe, Sparkles, CheckCircle, ArrowUpRight, Store } from 'lucide-react'

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

export default function Template2({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const tierInfo = getUserTier(profile)
  const canPerLinkColor = isDashboardPreview || tierInfo.canPerLinkColor
  const canEmbedYouTube = isDashboardPreview || tierInfo.canEmbedYouTube
  const embedUrl = canEmbedYouTube ? getYouTubeEmbedUrl(profile.youtube_url) : null

  return (
    <div className="w-full max-w-lg mx-auto relative z-10 px-3 sm:px-4 py-6 sm:py-8 space-y-4">
      {/* Bento Card 1: Profile Header with Full Width Cover */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="w-full h-32 sm:h-40 bg-slate-950 relative border-b border-slate-800">
          {profile.cover_url ? (
            <img src={profile.cover_url} alt="Cover Banner" className="w-full h-full object-cover object-center block" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 flex items-center justify-center opacity-40">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 pt-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left -mt-10 sm:-mt-12 relative z-10">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.id}`}
            alt={profile.full_name || profile.username}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl shrink-0"
          />
          <div className="space-y-1 overflow-hidden w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold rounded-full mb-1">
              <CheckCircle className="w-3 h-3" /> Bento Profile
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white break-words">{profile.full_name || profile.username}</h1>
            <p className="text-xs text-slate-400 font-medium truncate">@{profile.username}</p>
            {profile.bio && <p className="text-xs text-slate-300 pt-1 leading-relaxed break-words">{profile.bio}</p>}
          </div>
        </div>
      </div>

      {/* Bento Card 2: YouTube Video Header */}
      {embedUrl && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 shadow-xl overflow-hidden">
          <div className="rounded-2xl overflow-hidden aspect-video w-full bg-black">
            <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
          </div>
        </div>
      )}

      {/* Bento Card 3: Links Section */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Links & Channels</h3>
        {links && links.length > 0 ? (
          links.map((link) => {
            const linkBg = canPerLinkColor ? (link.bg_color || '#1e293b') : '#1e293b'
            const linkText = canPerLinkColor ? (link.text_color || '#ffffff') : '#ffffff'

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{ backgroundColor: linkBg, color: linkText }}
                className="w-full p-3.5 sm:p-4 rounded-2xl font-bold text-left flex items-center justify-between transition-all hover:scale-[1.01] border border-white/10 shadow-lg"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                  ) : (
                    <SocialIcon type={link.icon} className="w-5 h-5 opacity-90 shrink-0" />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-extrabold truncate">{link.title}</p>
                    {link.subtitle && <p className="text-[11px] font-normal opacity-75 truncate">{link.subtitle}</p>}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-60 shrink-0" />
              </button>
            )
          })
        ) : (
          <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
            ยังไม่มีลิ้งก์ในขณะนี้
          </div>
        )}
      </div>

      {/* Bento Card 4: Featured Products Showcase */}
      {products && products.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-400" /> Featured Store Products
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {products.map((prod) => (
              <div key={prod.id} className="bg-slate-900/90 border border-slate-800 p-3 sm:p-3.5 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl">
                <div className="space-y-2">
                  <div className="relative aspect-square w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40"><ShoppingBag className="w-8 h-8" /></div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-2 left-2 text-[9px] font-black bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-md shadow">{prod.badge}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs line-clamp-1">{prod.title}</h4>
                    {prod.description && <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{prod.description}</p>}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-emerald-400">฿{prod.price}</span>
                  <a href={prod.buy_url} target="_blank" rel="noopener noreferrer" className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition">
                    สั่งซื้อ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Footer */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
        {profile.social_facebook && <a href={profile.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-xl border border-slate-800"><SocialIcon type="facebook" className="w-4 h-4" /></a>}
        {profile.social_instagram && <a href={profile.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-pink-400 rounded-xl border border-slate-800"><SocialIcon type="instagram" className="w-4 h-4" /></a>}
        {profile.social_tiktok && <a href={profile.social_tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-xl border border-slate-800"><SocialIcon type="tiktok" className="w-4 h-4" /></a>}
        {profile.social_youtube && <a href={profile.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-red-500 rounded-xl border border-slate-800"><SocialIcon type="youtube" className="w-4 h-4" /></a>}
        {profile.social_email && <a href={`mailto:${profile.social_email}`} className="p-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl border border-slate-800"><SocialIcon type="email" className="w-4 h-4" /></a>}
      </div>
    </div>
  )
}
