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
}

export default function SiteLogo({
  className = '',
  imageClassName = 'h-9 w-auto max-w-[190px] object-contain',
  showText = true,
  textClassName = 'text-xl font-black tracking-tight text-[#1E1B4B] dark:text-white',
  href = '/',
  customLogoUrl
}: SiteLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>(customLogoUrl || '')
  const [siteName, setSiteName] = useState<string>('LinkTreeThai')

  useEffect(() => {
    if (customLogoUrl) {
      setLogoUrl(customLogoUrl)
      return
    }
    // Fetch global site settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.settings?.site_logo_url) setLogoUrl(data.settings.site_logo_url)
        if (data?.settings?.site_title) setSiteName(data.settings.site_title.split(' - ')[0])
      })
      .catch(() => {})
  }, [customLogoUrl])

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={siteName}
          className={`${imageClassName} group-hover:scale-102 transition duration-200`}
        />
      ) : (
        <>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 p-0.5 shadow-md shadow-purple-500/25 group-hover:scale-105 transition shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Link2 className="w-5 h-5" />
            </div>
          </div>
          {showText && (
            <div className="flex flex-col text-left">
              <span className={textClassName}>
                {siteName}
              </span>
              <span className="text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent -mt-1">
                Bio & Sales Automation
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )

  if (!href) return content
  return <Link href={href}>{content}</Link>
}
