'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Link2 } from 'lucide-react'

interface SiteLogoProps {
  className?: string
  imageClassName?: string
  showText?: boolean
  textClassName?: string
  href?: string
  customLogoUrl?: string
  customSiteName?: string
}

export default function SiteLogo({
  className = '',
  imageClassName = 'h-8 sm:h-11 md:h-14 w-auto max-w-[140px] sm:max-w-[220px] object-contain',
  showText = true,
  textClassName = 'text-sm sm:text-lg md:text-xl font-black tracking-tight text-[#1E1B4B] dark:text-white',
  href = '/',
  customLogoUrl,
  customSiteName
}: SiteLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>(customLogoUrl || '')
  const [siteName, setSiteName] = useState<string>(customSiteName || 'LinkTreeThai')

  useEffect(() => {
    if (customLogoUrl !== undefined) {
      setLogoUrl(customLogoUrl || '')
    }
    if (customSiteName !== undefined) {
      setSiteName(customSiteName || 'LinkTreeThai')
    }

    // Fetch global site settings if not explicitly passed
    if (!customLogoUrl || !customSiteName) {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data?.settings?.site_logo_url && !customLogoUrl) {
            setLogoUrl(data.settings.site_logo_url)
          }
          if (data?.settings?.site_title && !customSiteName) {
            const rawTitle = data.settings.site_title.split(' - ')[0].trim()
            if (rawTitle) setSiteName(rawTitle)
          }
        })
        .catch(() => {})
    }
  }, [customLogoUrl, customSiteName])

  const content = (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={siteName}
          className={`${imageClassName} group-hover:scale-105 transition-transform duration-200 shrink-0 drop-shadow-md`}
        />
      ) : (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-[#34D399] p-0.5 shadow-lg shadow-purple-500/25 group-hover:scale-105 transition shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Link2 className="w-6 h-6" />
          </div>
        </div>
      )}

      {showText && (
        <div className={`flex flex-col text-left ${logoUrl ? 'hidden md:flex' : 'flex'}`}>
          <span className={`${textClassName} whitespace-nowrap leading-tight`}>
            {siteName}
          </span>
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-wider sm:tracking-widest uppercase bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent leading-tight whitespace-nowrap">
            Bio & Sales 🇹🇭
          </span>
        </div>
      )}
    </div>
  )

  if (!href) return content
  return <Link href={href}>{content}</Link>
}
