'use client';

import React from 'react';
import { SocialLink } from '../lib/supabase/types';
import { ExternalLink } from 'lucide-react';

interface SocialLinksDisplayProps {
  links?: SocialLink[];
}

export const SocialLinksDisplay: React.FC<SocialLinksDisplayProps> = ({ links }) => {
  if (!links || links.length === 0) return null;

  const getPlatformStyle = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-95 text-white';
      case 'tiktok':
        return 'bg-gray-900 hover:bg-black text-white';
      case 'line':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'shopee':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'lazada':
        return 'bg-blue-800 hover:bg-blue-900 text-white';
      case 'youtube':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-gray-800 hover:bg-gray-900 text-white';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘';
      case 'instagram': return '📸';
      case 'tiktok': return '🎵';
      case 'line': return '💬';
      case 'shopee': return '🛒';
      case 'lazada': return '📦';
      case 'youtube': return '▶️';
      case 'website': return '🌐';
      default: return '🔗';
    }
  };

  return (
    <div className="space-y-2 pt-2">
      <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
        ช่องทางการติดตาม & ร้านค้าออนไลน์
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm hover:scale-102 ${getPlatformStyle(link.platform)}`}
          >
            <span>{getPlatformIcon(link.platform)}</span>
            <span>{link.title || link.platform}</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        ))}
      </div>
    </div>
  );
};
