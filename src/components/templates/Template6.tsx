import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import { getUserTier } from '@/lib/tier'
import { ExternalLink, ShoppingBag, Globe, Sparkles, CheckCircle, Zap, Layers } from 'lucide-react'

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

export default function Template6({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const tierInfo = getUserTier(profile)
  const canPerLinkColor = isDashboardPreview || tierInfo.canPerLinkColor
  const canEmbedYouTube = isDashboardPreview || tierInfo.canEmbedYouTube
  const embedUrl = canEmbedYouTube ? getYouTubeEmbedUrl(profile.youtube_url) : null

  return (
    <div className="w-full max-w-md mx-auto relative z-10 px-4 py-8 space-y-5 font-mono text-cyan-100">
      
      {/* Animated Hybrid Header */}
      <div className="p-6 bg-slate-900/90 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-500/10 text-center space-y-3 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-cyan-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-pink-500/20 rounded-full blur-2xl"></div>

        {profile.cover_url && (
          <div className="w-full h-24 -mt-6 -mx-6 mb-2 overflow-hidden border-b border-cyan-500/30">
            <img src={profile.cover_url} alt="Cover Banner" className="w-full h-full object-cover" />
          </div>
        )}

        <img
          src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.id}`}
          alt={profile.full_name || profile.username}
          className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-cyan-400 shadow-xl"
        />
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">{profile.full_name || profile.username}</h1>
          <p className="text-xs text-cyan-400 font-mono mt-0.5">@{profile.username}</p>
        </div>
        {profile.bio && <p className="text-xs text-slate-300 leading-relaxed">{profile.bio}</p>}
      </div>

      {/* YouTube Video Section */}
      {embedUrl && (
        <div className="rounded-2xl overflow-hidden border border-cyan-500/30 aspect-video w-full bg-black shadow-xl">
          <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
        </div>
      )}

      {/* Combined Links & Products Bento Motion Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-1 flex items-center gap-1.5 font-mono">
          <Layers className="w-4 h-4" /> Motion Channels & Shop
        </h3>

        {/* Links */}
        <div className="space-y-2">
          {links && links.map((link) => {
            const linkBg = canPerLinkColor ? (link.bg_color || '#0f172a') : '#0f172a'
            const linkText = canPerLinkColor ? (link.text_color || '#38bdf8') : '#38bdf8'

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{ backgroundColor: linkBg, color: linkText }}
                className="w-full p-3.5 rounded-2xl font-bold text-left flex items-center justify-between border border-cyan-500/30 hover:border-cyan-400 shadow-lg transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                  ) : (
                    <SocialIcon type={link.icon} className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <span className="text-xs font-extrabold truncate">{link.title}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            )
          })}
        </div>

        {/* Products */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {products.map((prod) => (
              <div key={prod.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-2 shadow-xl">
                <div className="relative aspect-square w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-40"><ShoppingBag className="w-6 h-6" /></div>
                  )}
                  {prod.badge && <span className="absolute top-1 left-1 text-[9px] font-black bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded">{prod.badge}</span>}
                </div>
                <h4 className="font-bold text-xs text-slate-100 truncate">{prod.title}</h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-cyan-400">฿{prod.price}</span>
                  <a href={prod.buy_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-extrabold bg-cyan-400 text-slate-950 rounded-lg">สั่งซื้อ</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cyberpunk Social Footer */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
        {profile.social_facebook && <a href={profile.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-950 hover:border-pink-500 text-cyan-400 rounded-lg border border-cyan-500/40"><SocialIcon type="facebook" className="w-4 h-4" /></a>}
        {profile.social_instagram && <a href={profile.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-950 hover:border-pink-500 text-pink-400 rounded-lg border border-cyan-500/40"><SocialIcon type="instagram" className="w-4 h-4" /></a>}
        {profile.social_tiktok && <a href={profile.social_tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-950 hover:border-pink-500 text-slate-200 rounded-lg border border-cyan-500/40"><SocialIcon type="tiktok" className="w-4 h-4" /></a>}
        {profile.social_youtube && <a href={profile.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-950 hover:border-pink-500 text-red-500 rounded-lg border border-cyan-500/40"><SocialIcon type="youtube" className="w-4 h-4" /></a>}
        {profile.social_email && <a href={`mailto:${profile.social_email}`} className="p-2 bg-slate-950 hover:border-pink-500 text-amber-300 rounded-lg border border-cyan-500/40"><SocialIcon type="email" className="w-4 h-4" /></a>}
      </div>

    </div>
  )
}
