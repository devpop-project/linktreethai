/**
 * UTM & Ad Click Parameter Capture, Storage & Forwarding Utility
 * Supports: utm_source, utm_medium, utm_campaign, utm_term, utm_content, fbclid, ttclid, gclid
 */

export interface UTMParams {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  fbclid?: string | null
  ttclid?: string | null
  gclid?: string | null
}

const STORAGE_KEY = '__linktreethai_utm_params'

export function captureUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {}

  try {
    const searchParams = new URLSearchParams(window.location.search)
    const utmKeys: (keyof UTMParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'ttclid',
      'gclid'
    ]

    let foundNew = false
    const current: UTMParams = {}

    utmKeys.forEach(key => {
      const val = searchParams.get(key)
      if (val) {
        current[key] = val.trim()
        foundNew = true
      }
    })

    if (foundNew) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current))
      return current
    }

    // Fallback to existing stored UTM params in this session
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}

  return {}
}

export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {}
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {}
  return captureUTMParams()
}

/**
 * Appends current UTM tracking parameters to any outbound URL (e.g. Shopee, LINE OA, Website)
 */
export function appendUTMToUrl(url: string, extraParams?: Record<string, string>): string {
  if (!url || typeof window === 'undefined') return url
  try {
    const utm = getStoredUTMParams()
    const urlObj = new URL(url, window.location.origin)

    Object.entries(utm).forEach(([key, val]) => {
      if (val && !urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, val)
      }
    })

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, val]) => {
        if (val) urlObj.searchParams.set(key, val)
      })
    }

    return urlObj.toString()
  } catch (e) {
    return url
  }
}
