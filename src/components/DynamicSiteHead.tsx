'use client'

import { useEffect } from 'react'

export default function DynamicSiteHead() {
  useEffect(() => {
    const updateHeadMetadata = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (!data?.settings) return

        const {
          site_title,
          site_description,
          site_keywords,
          site_favicon_url,
          site_og_image_url
        } = data.settings

        // 1. Update Document Title
        if (site_title && (document.title.includes('LinkTreeThai') || !document.title)) {
          document.title = site_title
        }

        // 2. Update Favicon Icons (Browser Tab Icon)
        if (site_favicon_url && site_favicon_url.trim()) {
          const updateLinkTag = (rel: string, href: string) => {
            let link = document.querySelector(`link[rel~='${rel}']`) as HTMLLinkElement
            if (!link) {
              link = document.createElement('link')
              link.rel = rel
              document.head.appendChild(link)
            }
            link.href = href
          }

          updateLinkTag('icon', site_favicon_url)
          updateLinkTag('shortcut icon', site_favicon_url)
          updateLinkTag('apple-touch-icon', site_favicon_url)
        }

        // 3. Update Meta Description
        if (site_description && site_description.trim()) {
          let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement
          if (!descMeta) {
            descMeta = document.createElement('meta')
            descMeta.name = 'description'
            document.head.appendChild(descMeta)
          }
          descMeta.content = site_description
        }

        // 4. Update Meta Keywords
        if (site_keywords && site_keywords.trim()) {
          let kwMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement
          if (!kwMeta) {
            kwMeta = document.createElement('meta')
            kwMeta.name = 'keywords'
            document.head.appendChild(kwMeta)
          }
          kwMeta.content = site_keywords
        }

        // 5. Update Open Graph Meta Tags
        if (site_og_image_url && site_og_image_url.trim()) {
          let ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement
          if (!ogImg) {
            ogImg = document.createElement('meta')
            ogImg.setAttribute('property', 'og:image')
            document.head.appendChild(ogImg)
          }
          ogImg.content = site_og_image_url
        }
      } catch (err) {
        console.warn('Error loading dynamic site head:', err)
      }
    }

    updateHeadMetadata()
  }, [])

  return null
}
