import React, { useState } from 'react'
import SocialIcon from '@/components/SocialIcon'
import { getUserTier } from '@/lib/tier'
import { ExternalLink, ShoppingBag, Globe, Sparkles, CheckCircle, Link2 } from 'lucide-react'

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

export default function Template4({ profile, links, products, handleLinkClick, isDashboardPreview }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'shop'>('links')
  const tierInfo = getUserTier(profile)
  const canPerLinkColor = isDashboardPreview || tierInfo.canPerLinkColor
  const canEmbedYouTube = isDashboardPreview || tierInfo.canEmbedYouTube
  const embedUrl = canEmbedYouTube ? getYouTubeEmbedUrl(profile.youtube_url) : null

  return (
    <div className="w-full max-w-md mx-auto relative z-10 pb-16">
      {/* Cover Photo Banner */}
      <div className="w-full h-36 sm:h-44 bg-slate-900/80 overflow-hidden relative border-b border-white/10">
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="Cover Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 flex items-center justify-center opacity-40">
            <Sparkles className="w-10 h-10 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Profile Avatar & Info */}
      <div className="text-center px-4 space-y-3 -mt-16 sm:-mt-20">
        <div className="relative inline-block">
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
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">{profile.full_name || profile.username}</h1>
          <p className="text-xs font-semibold opacity-75 mt-0.5">@{profile.username}</p>
        </div>

        {profile.bio && <p className="text-sm opacity-90 max-w-xs mx-auto leading-relaxed">{profile.bio}</p>}

        {/* YouTube Video Player Embed */}
        {embedUrl && (
          <div className="pt-2 px-1">
            <div className="rounded-2xl overflow-hidden border border-white/15 aspect-video w-full bg-black shadow-2xl">
              <iframe src={embedUrl} title="YouTube" className="w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Tab Bar (Links vs Shop) */}
      <div className="px-4 pt-6">
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2.5 text-sm font-extrabold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'links' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Link2 className="w-4 h-4" /> ลิ้งก์ ({links.length})
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2.5 text-sm font-extrabold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'shop' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> ร้านค้า ({products.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Links */}
      {activeTab === 'links' && (
        <div className="space-y-3 px-4 pt-6">
          {links && links.length > 0 ? (
            links.map((link) => {
              const linkBg = canPerLinkColor ? (link.bg_color || '#1e293b') : '#1e293b'
              const linkText = canPerLinkColor ? (link.text_color || '#ffffff') : '#ffffff'

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  style={{ backgroundColor: linkBg, color: linkText }}
                  className="w-full p-4 rounded-2xl font-bold text-left flex items-center justify-between border border-white/10 shadow-lg"
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
                      <p className="text-sm font-bold truncate leading-snug">{link.title}</p>
                      {link.subtitle && <p className="text-xs font-normal opacity-75 truncate mt-0.5">{link.subtitle}</p>}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
                </button>
              )
            })
          ) : (
            <div className="text-center text-xs opacity-60 py-8 bg-white/5 rounded-2xl border border-white/10">ยังไม่มีลิ้งก์</div>
          )}
        </div>
      )}

      {/* Tab 2: Shop */}
      {activeTab === 'shop' && (
        <div className="px-4 pt-6 space-y-4">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3.5">
              {products.map((prod) => (
                <div key={prod.id} className="p-3 rounded-2xl border border-white/10 flex flex-col justify-between shadow-lg bg-slate-900/90 text-slate-100">
                  <div className="space-y-2">
                    <div className="relative aspect-square w-full bg-black/20 rounded-xl overflow-hidden border border-white/10">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-40"><ShoppingBag className="w-8 h-8" /></div>
                      )}
                      {prod.badge && (
                        <span className="absolute top-2 left-2 text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow">{prod.badge}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm line-clamp-1">{prod.title}</h3>
                      {prod.description && <p className="text-[11px] opacity-75 line-clamp-2 mt-0.5 font-normal">{prod.description}</p>}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1 mt-2">
                    <span className="text-sm sm:text-base font-black text-emerald-400">฿{prod.price}</span>
                    <a href={prod.buy_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-[11px] font-extrabold bg-emerald-500 text-slate-950 rounded-xl shadow shrink-0">สั่งซื้อ</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs opacity-60 py-8 bg-white/5 rounded-2xl border border-white/10">ยังไม่มีสินค้าในร้านค้า</div>
          )}
        </div>
      )}

      {/* Social Footer */}
      <div className="pt-8 px-4 flex flex-wrap items-center justify-center gap-2.5 opacity-90">
        {profile.social_facebook && <a href={profile.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 text-blue-400 rounded-full border border-white/10 shadow-md"><SocialIcon type="facebook" className="w-4 h-4" /></a>}
        {profile.social_instagram && <a href={profile.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 text-pink-400 rounded-full border border-white/10 shadow-md"><SocialIcon type="instagram" className="w-4 h-4" /></a>}
        {profile.social_tiktok && <a href={profile.social_tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 text-slate-100 rounded-full border border-white/10 shadow-md"><SocialIcon type="tiktok" className="w-4 h-4" /></a>}
        {profile.social_youtube && <a href={profile.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 text-red-500 rounded-full border border-white/10 shadow-md"><SocialIcon type="youtube" className="w-4 h-4" /></a>}
        {profile.social_email && <a href={`mailto:${profile.social_email}`} className="p-2.5 bg-white/10 text-amber-300 rounded-full border border-white/10 shadow-md"><SocialIcon type="email" className="w-4 h-4" /></a>}
      </div>
    </div>
  )
}
