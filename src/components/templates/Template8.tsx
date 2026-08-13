import React, { useState } from 'react'
import SocialIcon from '@/components/SocialIcon'
import { getUserTier } from '@/lib/tier'
import { ExternalLink, ShoppingBag, Globe, Sparkles, CheckCircle, Link2, Zap } from 'lucide-react'

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

export default function Template8({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'shop'>('links')
  const tierInfo = getUserTier(profile)
  const canPerLinkColor = isDashboardPreview || tierInfo.canPerLinkColor
  const canEmbedYouTube = isDashboardPreview || tierInfo.canEmbedYouTube
  const embedUrl = canEmbedYouTube ? getYouTubeEmbedUrl(profile.youtube_url) : null

  return (
    <div className="w-full max-w-md mx-auto relative z-10 pb-16 font-mono text-slate-900">
      
      {/* Cover Banner */}
      <div className="w-full h-36 bg-amber-400 overflow-hidden relative border-b-4 border-slate-950">
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="Cover Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-amber-400 flex items-center justify-center font-black text-2xl uppercase tracking-widest text-slate-950">
            NEO BRUTALIST
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="text-center px-4 space-y-3 -mt-14">
        <div className="relative inline-block">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.id}`}
            alt={profile.full_name || profile.username}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl mx-auto object-cover border-4 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
          />
          <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-lg border-2 border-slate-950 font-black">
            <Zap className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="bg-white border-2 border-slate-950 p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-xl font-black text-slate-950 uppercase">{profile.full_name || profile.username}</h1>
          <p className="text-xs font-bold text-amber-600">@{profile.username}</p>
          {profile.bio && <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">{profile.bio}</p>}
        </div>

        {/* YouTube Embed */}
        {embedUrl && (
          <div className="pt-2">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-950 aspect-video w-full bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* MASTER TABBED NAVIGATION - NEO BRUTALIST STYLE */}
      <div className="px-4 pt-6">
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 uppercase ${
              activeTab === 'links' ? 'bg-amber-400 text-slate-950 border-2 border-slate-950 shadow' : 'text-slate-200'
            }`}
          >
            <Link2 className="w-4 h-4" /> LINKS ({links.length})
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 uppercase ${
              activeTab === 'shop' ? 'bg-amber-400 text-slate-950 border-2 border-slate-950 shadow' : 'text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> STORE ({products.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Links */}
      {activeTab === 'links' && (
        <div className="space-y-3 px-4 pt-6">
          {links && links.length > 0 ? (
            links.map((link) => {
              const linkBg = canPerLinkColor ? (link.bg_color || '#ffffff') : '#ffffff'
              const linkText = canPerLinkColor ? (link.text_color || '#0f172a') : '#0f172a'

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  style={{ backgroundColor: linkBg, color: linkText }}
                  className="w-full p-4 rounded-2xl font-black text-left flex items-center justify-between border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    {link.logo_url ? (
                      <img src={link.logo_url} alt={link.title} className="w-9 h-9 object-cover rounded-xl shrink-0 border-2 border-slate-950" />
                    ) : (
                      <div className="w-9 h-9 bg-amber-400 border-2 border-slate-950 rounded-xl flex items-center justify-center shrink-0 text-slate-950">
                        <SocialIcon type={link.icon} className="w-5 h-5" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-black uppercase truncate">{link.title}</p>
                      {link.subtitle && <p className="text-[10px] font-bold opacity-80 truncate">{link.subtitle}</p>}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </button>
              )
            })
          ) : (
            <div className="text-center text-xs font-bold py-6 bg-white rounded-2xl border-2 border-slate-950">NO LINKS YET</div>
          )}
        </div>
      )}

      {/* Tab 2: Shop */}
      {activeTab === 'shop' && (
        <div className="px-4 pt-6 space-y-3">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="p-3 rounded-2xl border-2 border-slate-950 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-2">
                  <div className="space-y-2">
                    <div className="relative aspect-square w-full bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-950">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-40"><ShoppingBag className="w-8 h-8" /></div>
                      )}
                      {prod.badge && <span className="absolute top-1 left-1 text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded border border-slate-950">{prod.badge}</span>}
                    </div>
                    <h4 className="font-black text-xs uppercase truncate text-slate-950">{prod.title}</h4>
                  </div>
                  <div className="pt-2 border-t-2 border-slate-950 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-950">฿{prod.price}</span>
                    <a href={prod.buy_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-black bg-amber-400 text-slate-950 rounded border-2 border-slate-950">BUY</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs font-bold py-6 bg-white rounded-2xl border-2 border-slate-950">NO PRODUCTS YET</div>
          )}
        </div>
      )}

      {/* Social Footer */}
      <div className="pt-8 px-4 flex flex-wrap items-center justify-center gap-2">
        {profile.social_facebook && <a href={profile.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border-2 border-slate-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-blue-600"><SocialIcon type="facebook" className="w-4 h-4" /></a>}
        {profile.social_instagram && <a href={profile.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border-2 border-slate-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-pink-600"><SocialIcon type="instagram" className="w-4 h-4" /></a>}
        {profile.social_tiktok && <a href={profile.social_tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border-2 border-slate-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-950"><SocialIcon type="tiktok" className="w-4 h-4" /></a>}
        {profile.social_youtube && <a href={profile.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border-2 border-slate-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-red-600"><SocialIcon type="youtube" className="w-4 h-4" /></a>}
        {profile.social_email && <a href={`mailto:${profile.social_email}`} className="p-2.5 bg-white border-2 border-slate-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-amber-600"><SocialIcon type="email" className="w-4 h-4" /></a>}
      </div>
    </div>
  )
}
