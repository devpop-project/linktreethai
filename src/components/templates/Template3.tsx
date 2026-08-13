import React from 'react'
import SocialIcon from '@/components/SocialIcon'
import { getUserTier } from '@/lib/tier'
import { ExternalLink, ShoppingBag, Globe, Sparkles, Zap, Terminal, Store } from 'lucide-react'

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

export default function Template3({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const tierInfo = getUserTier(profile)
  const canPerLinkColor = isDashboardPreview || tierInfo.canPerLinkColor
  const canEmbedYouTube = isDashboardPreview || tierInfo.canEmbedYouTube
  const embedUrl = canEmbedYouTube ? getYouTubeEmbedUrl(profile.youtube_url) : null

  return (
    <div className="w-full max-w-md mx-auto relative z-10 font-mono text-cyan-100 space-y-5 pb-12">
      
      {/* Cover Banner */}
      <div className="w-full h-36 border-b-2 border-pink-500 overflow-hidden relative shadow-lg shadow-pink-500/20 bg-slate-950">
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="Cover Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-950 via-indigo-950 to-pink-950 flex items-center justify-center opacity-60">
            <Zap className="w-10 h-10 text-pink-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="text-center px-4 space-y-3 -mt-14">
        <div className="relative inline-block">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.id}`}
            alt={profile.full_name || profile.username}
            className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 bg-slate-950"
          />
          <span className="absolute -bottom-1 -right-1 bg-pink-500 text-slate-950 p-1 rounded-md border border-cyan-300">
            <Terminal className="w-3.5 h-3.5" />
          </span>
        </div>

        <div>
          <h1 className="text-xl font-black text-cyan-300 uppercase tracking-wider flex items-center justify-center gap-1">
            {profile.full_name || profile.username}
          </h1>
          <p className="text-xs text-pink-400 font-bold mt-0.5">@{profile.username}</p>
        </div>

        {profile.bio && <p className="text-xs text-cyan-200/90 max-w-xs mx-auto leading-relaxed">{profile.bio}</p>}

        {/* YouTube Embed Player */}
        {embedUrl && (
          <div className="pt-2 px-1">
            <div className="rounded-xl overflow-hidden border-2 border-pink-500 aspect-video w-full bg-black shadow-lg shadow-pink-500/20">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Links List */}
      <div className="space-y-3 px-4">
        <h3 className="text-xs font-black uppercase text-pink-400 flex items-center gap-1.5 tracking-wider">
          <Zap className="w-4 h-4 text-cyan-400" /> Links & Channels
        </h3>
        {links && links.length > 0 ? (
          links.map((link) => {
            const linkBg = canPerLinkColor ? (link.bg_color || '#090d16') : '#090d16'
            const linkText = canPerLinkColor ? (link.text_color || '#22d3ee') : '#22d3ee'

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{ backgroundColor: linkBg, color: linkText }}
                className="w-full p-3.5 rounded-xl font-bold text-left flex items-center justify-between transition-all duration-300 border border-cyan-500/40 hover:border-pink-500 shadow-md hover:shadow-pink-500/20"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {link.logo_url ? (
                    <img src={link.logo_url} alt={link.title} className="w-8 h-8 object-cover rounded-lg shrink-0 border border-cyan-400/30" />
                  ) : (
                    <SocialIcon type={link.icon} className="w-5 h-5 text-cyan-400 shrink-0" />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-extrabold truncate uppercase">{link.title}</p>
                    {link.subtitle && <p className="text-[10px] text-pink-300/80 truncate">{link.subtitle}</p>}
                  </div>
                </div>
                <Zap className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              </button>
            )
          })
        ) : (
          <div className="text-center text-xs text-cyan-500/60 py-6 border border-cyan-900 rounded-xl">NO LINKS STORED</div>
        )}
      </div>

      {/* Products Showcase */}
      {products && products.length > 0 && (
        <div className="space-y-3 px-4 pt-4 border-t border-cyan-500/20">
          <h3 className="text-xs font-black uppercase text-cyan-400 flex items-center gap-1.5 tracking-wider">
            <Store className="w-4 h-4 text-pink-400" /> Cyberpunk Shop Catalog
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {products.map((prod) => (
              <div key={prod.id} className="p-3 rounded-xl border border-pink-500/40 bg-slate-950 flex flex-col justify-between space-y-2 shadow-lg shadow-pink-500/10">
                <div className="space-y-2">
                  <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden border border-cyan-500/30">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40"><ShoppingBag className="w-6 h-6" /></div>
                    )}
                    {prod.badge && (
                      <span className="absolute top-1 left-1 text-[9px] font-black bg-pink-500 text-slate-950 px-1.5 py-0.5 rounded uppercase">{prod.badge}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-cyan-200 truncate">{prod.title}</h4>
                    {prod.description && <p className="text-[10px] text-slate-400 line-clamp-1">{prod.description}</p>}
                  </div>
                </div>
                <div className="pt-2 border-t border-cyan-900/60 flex items-center justify-between">
                  <span className="text-xs font-black text-pink-400">฿{prod.price}</span>
                  <a href={prod.buy_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-black bg-cyan-400 text-slate-950 rounded hover:bg-pink-400 transition">
                    BUY
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
