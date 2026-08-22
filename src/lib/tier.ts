export type TierType = 'free' | 'pro' | 'master'

export interface TierLimits {
  tier: TierType
  name: string
  price: number
  pointsCost: number
  maxLinks: number
  maxProducts: number
  maxLandingPages: number
  allowedTemplates: string[]
  canHideBranding: boolean
  canQRCode: boolean
  canSchedule: boolean
  canCollectLeads: boolean
  canCustomOG: boolean
  canViewAnalytics: boolean
  canPerLinkColor: boolean
  canEmbedYouTube: boolean
  canAutoPixel: boolean
  canTikTokTTS: boolean
}

export function getUserTier(profile: any): TierLimits {
  // Check if Pixels unlocked via 100 points
  const isPixelUnlocked = Boolean(
    profile?.pixel_expires_at && new Date(profile.pixel_expires_at).getTime() > Date.now()
  )
  const isTikTokTTSUnlocked = Boolean(
    profile?.tiktok_tts_expires_at && new Date(profile.tiktok_tts_expires_at).getTime() > Date.now()
  )

  // If user is Admin, they get full Master VIP capabilities
  if (profile?.role === 'admin') {
    return {
      tier: 'master',
      name: 'Admin Master',
      price: 0,
      pointsCost: 0,
      maxLinks: 9999,
      maxProducts: 9999,
      maxLandingPages: 9999,
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
      canAutoPixel: true,
      canTikTokTTS: true,
    }
  }

  const isMaster = Boolean(
    profile?.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now()
  )

  if (isMaster) {
    const extraSlots = profile?.extra_landing_page_slots || 0
    return {
      tier: 'master',
      name: 'MASTER VIP',
      price: 599,
      pointsCost: 599,
      maxLinks: 9999,
      maxProducts: 9999,
      maxLandingPages: 1 + extraSlots,
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
      canAutoPixel: true,
      canTikTokTTS: true,
    }
  }

  const isPro = Boolean(
    profile?.pro_expires_at && new Date(profile.pro_expires_at).getTime() > Date.now()
  )

  if (isPro) {
    const extraSlots = profile?.extra_landing_page_slots || 0
    return {
      tier: 'pro',
      name: 'PRO VIP',
      price: 299,
      pointsCost: 299,
      maxLinks: 9999,
      maxProducts: 10,
      maxLandingPages: 0 + extraSlots,
      allowedTemplates: [
        'template_1', 'template_2', 'template_3', 
        'template_4', 'template_5', 'template_6'
      ],
      canHideBranding: true,
      canQRCode: true,
      canSchedule: true,
      canCollectLeads: true,
      canCustomOG: true,
      canViewAnalytics: true,
      canPerLinkColor: true,
      canEmbedYouTube: true,
      canAutoPixel: isPixelUnlocked,
      canTikTokTTS: isTikTokTTSUnlocked,
    }
  }

  // Free Tier (สมาชิกทั่วไป) - ทุกระดับเพิ่มลิงก์ได้ไม่จำกัด!
  const extraSlots = profile?.extra_landing_page_slots || 0
  return {
    tier: 'free',
    name: 'Free Plan',
    price: 0,
    pointsCost: 0,
    maxLinks: 9999,
    maxProducts: 2,
    maxLandingPages: 0 + extraSlots,
    allowedTemplates: [
      'template_1', 'template_2', 'template_3'
    ],
    canHideBranding: false,
    canQRCode: true,
    canSchedule: false,
    canCollectLeads: true,
    canCustomOG: false,
    canViewAnalytics: true,
    canPerLinkColor: true,
    canEmbedYouTube: true,
    canAutoPixel: isPixelUnlocked,
    canTikTokTTS: isTikTokTTSUnlocked,
  }
}
