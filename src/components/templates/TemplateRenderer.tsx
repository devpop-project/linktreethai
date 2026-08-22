import React from 'react'
import { getUserTier } from '@/lib/tier'
import Template1 from './Template1'
import Template2 from './Template2'
import Template3 from './Template3'
import Template4 from './Template4'
import Template5 from './Template5'
import Template6 from './Template6'
import Template7 from './Template7'
import Template8 from './Template8'
import Template9 from './Template9'

interface TemplateRendererProps {
  profile: any
  links: any[]
  products: any[]
  handleLinkClick: (id: string, url: string) => void
  isDashboardPreview?: boolean
}

export default function TemplateRenderer({ profile, links, products, handleLinkClick, isDashboardPreview = false }: TemplateRendererProps) {
  const tierInfo = getUserTier(profile)

  let templateId = profile?.template_id || 'template_1'

  // On public live pages, enforce tier restrictions if not in Dashboard preview
  if (!isDashboardPreview && !tierInfo.allowedTemplates.includes(templateId)) {
    templateId = 'template_1'
  }

  // Filter out inactive links and products, and enforce tier limits
  const visibleLinks = (links || []).filter(l => l.is_active !== false)
  const visibleProducts = (products || []).filter(p => p.is_active !== false)

  const activeLinks = !isDashboardPreview ? visibleLinks.slice(0, tierInfo.maxLinks) : visibleLinks
  const activeProducts = !isDashboardPreview ? visibleProducts.slice(0, tierInfo.maxProducts) : visibleProducts

  switch (templateId) {
    case 'template_9':
      return <Template9 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_8':
      return <Template8 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_7':
      return <Template7 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_6':
      return <Template6 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_5':
      return <Template5 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_4':
      return <Template4 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_3':
      return <Template3 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_2':
      return <Template2 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} isDashboardPreview={isDashboardPreview} />
    case 'template_1':
    default:
      return <Template1 profile={profile} links={activeLinks} products={activeProducts} handleLinkClick={handleLinkClick} />
  }
}
