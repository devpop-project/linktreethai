import React from 'react'
import SocialIcon from './SocialIcon'

interface SocialDockProps {
  profile: any
  className?: string
  styleVariant?: 'default' | 'neon' | 'glass' | 'minimal' | 'gold' | 'retro'
}

export default function SocialDock({ profile, className = '', styleVariant = 'default' }: SocialDockProps) {
  if (!profile) return null

  const socialItems = [
    { key: 'social_facebook', type: 'facebook', name: 'Facebook', url: profile.social_facebook, color: 'text-blue-600 hover:bg-blue-50' },
    { key: 'social_instagram', type: 'instagram', name: 'Instagram', url: profile.social_instagram, color: 'text-pink-600 hover:bg-pink-50' },
    { key: 'social_tiktok', type: 'tiktok', name: 'TikTok', url: profile.social_tiktok, color: 'text-slate-900 hover:bg-slate-100' },
    { key: 'social_youtube', type: 'youtube', name: 'YouTube', url: profile.social_youtube, color: 'text-red-600 hover:bg-red-50' },
    { key: 'social_line', type: 'line', name: 'LINE', url: profile.social_line, color: 'text-emerald-600 hover:bg-emerald-50' },
    { key: 'social_shopee', type: 'shopee', name: 'Shopee', url: profile.social_shopee, color: 'text-orange-600 hover:bg-orange-50' },
    { key: 'social_lazada', type: 'lazada', name: 'Lazada', url: profile.social_lazada, color: 'text-indigo-600 hover:bg-indigo-50' },
    { key: 'social_x', type: 'x', name: 'X (Twitter)', url: profile.social_x, color: 'text-slate-900 hover:bg-slate-100' },
    { key: 'social_pinterest', type: 'pinterest', name: 'Pinterest', url: profile.social_pinterest, color: 'text-rose-600 hover:bg-rose-50' },
    { key: 'social_email', type: 'email', name: 'Email', url: profile.social_email ? `mailto:${profile.social_email}` : null, color: 'text-amber-600 hover:bg-amber-50' },
  ].filter(item => item.url && item.url.trim() !== '')

  if (socialItems.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 ${className}`}>
      {socialItems.map((item) => {
        let btnStyle = "w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        
        if (styleVariant === 'neon') {
          btnStyle = "w-10 h-10 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center justify-center transition-all hover:scale-110 hover:border-pink-500 active:scale-95"
        } else if (styleVariant === 'glass') {
          btnStyle = "w-10 h-10 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20 active:scale-95"
        } else if (styleVariant === 'retro') {
          btnStyle = "w-10 h-10 rounded-xl bg-white border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95"
        } else if (styleVariant === 'gold') {
          btnStyle = "w-10 h-10 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-500/30 shadow-md flex items-center justify-center transition-all hover:scale-110 hover:border-amber-400 active:scale-95"
        }

        return (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.name}
            className={`${btnStyle} ${item.color}`}
          >
            <SocialIcon type={item.type} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>
        )
      })}
    </div>
  )
}
