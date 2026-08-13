export type TierType = 'free' | 'pro' | 'master'

export interface TierLimits {
  tier: TierType
  maxLinks: number
  maxProducts: number
  allowedTemplates: string[]
  canHideBranding: boolean
  canQRCode: boolean
  canSchedule: boolean
  canCollectLeads: boolean
  canCustomOG: boolean
  canViewAnalytics: boolean
  canPerLinkColor: boolean
  canEmbedYouTube: boolean
}

export function getUserTier(profile: any): TierLimits {
  const isMaster = Boolean(
    profile?.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now()
  )

  if (isMaster) {
    return {
      tier: 'master',
      maxLinks: 9999,
      maxProducts: 9999,
      allowedTemplates: [
        'template_1', 'template_2', 'template_3', 'template_4', 
        'template_5', 'template_6', 'template_7', 'template_8', 'template_9'
      ],
      canHideBranding: true,
      canQRCode: true,
      canSchedule: true,
      canCollectLeads: true,
      canCustomOG: true,
      canViewAnalytics: true,
      canPerLinkColor: true,
      canEmbedYouTube: true,
    }
  }

  const isPro = Boolean(
    profile?.pro_expires_at && new Date(profile.pro_expires_at).getTime() > Date.now()
  )

  if (isPro) {
    return {
      tier: 'pro',
      maxLinks: 10,
      maxProducts: 10,
      allowedTemplates: ['template_1', 'template_2', 'template_3', 'template_4'],
      canHideBranding: true,
      canQRCode: false,
      canSchedule: false,
      canCollectLeads: true,
      canCustomOG: false,
      canViewAnalytics: true,
      canPerLinkColor: true,
      canEmbedYouTube: true,
    }
  }

  // Free Tier
  return {
    tier: 'free',
    maxLinks: 3,
    maxProducts: 2,
    allowedTemplates: ['template_1', 'template_2'],
    canHideBranding: false,
    canQRCode: false,
    canSchedule: false,
    canCollectLeads: false,
    canCustomOG: false,
    canViewAnalytics: false,
    canPerLinkColor: false,
    canEmbedYouTube: false,
  }
}
