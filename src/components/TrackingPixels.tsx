'use client'

import { useEffect } from 'react'

interface TrackingPixelsProps {
  userId?: string | null
  landingPageId?: string | null
  fbPixelId?: string | null
  tiktokPixelId?: string | null
  googlePixelId?: string | null
  lineTagId?: string | null
}

export function trackPixelEvent(
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Lead' | 'Contact' | 'Purchase', 
  data?: any,
  meta?: { userId?: string | null; landingPageId?: string | null; pixelId?: string | null }
) {
  if (typeof window === 'undefined') return

  // 1. Meta (Facebook) Pixel Event
  if ((window as any).fbq) {
    try {
      (window as any).fbq('track', eventName, data)
    } catch (e) {}
  }

  // 2. TikTok Pixel Event
  if ((window as any).ttq) {
    try {
      let ttEvent = eventName
      if (eventName === 'InitiateCheckout') ttEvent = 'InitiateCheckout'
      if (eventName === 'Lead' || eventName === 'Contact') ttEvent = 'SubmitForm'
      if (eventName === 'Purchase') ttEvent = 'PlaceAnOrder'
      ;(window as any).ttq.track(ttEvent, data)
    } catch (e) {}
  }

  // 3. Google Tag (gtag) Event
  if ((window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, data)
    } catch (e) {}
  }

  // 4. LINE Tag Event
  if ((window as any)._lt) {
    try {
      (window as any)._lt('send', 'cv', { type: eventName }, [data])
    } catch (e) {}
  }

  // 5. Background Analytics Database Logger
  if (meta?.userId) {
    try {
      fetch('/api/pixel-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: meta.userId,
          landing_page_id: meta.landingPageId || null,
          pixel_type: 'all',
          pixel_id: meta.pixelId || null,
          event_name: eventName,
          event_data: data || {},
          url: window.location.href
        })
      }).catch(() => {})
    } catch (e) {}
  }
}

export default function TrackingPixels({
  userId,
  landingPageId,
  fbPixelId,
  tiktokPixelId,
  googlePixelId,
  lineTagId,
}: TrackingPixelsProps) {
  useEffect(() => {
    // 1. Injected Meta (Facebook) Pixel
    const cleanFb = (fbPixelId || '').trim()
    if (cleanFb && cleanFb.length >= 8) {
      if (!(window as any).fbq) {
        /* eslint-disable */
        !(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
          }
          if (!f._fbq) f._fbq = n
          n.push = n
          n.loaded = !0
          n.version = '2.0'
          n.queue = []
          t = b.createElement(e)
          t.async = !0
          t.src = v
          s = b.getElementsByTagName(e)[0]
          s.parentNode.insertBefore(t, s)
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
      }
      try {
        ;(window as any).fbq('init', cleanFb)
        ;(window as any).fbq('track', 'PageView')
      } catch (e) {}
    }

    // 2. Injected TikTok Pixel
    const cleanTt = (tiktokPixelId || '').trim()
    if (cleanTt && cleanTt.length >= 6) {
      if (!(window as any).ttq) {
        /* eslint-disable */
        !(function (w: any, d: any, t: any) {
          w.TiktokAnalyticsObject = t
          var ttq = (w[t] = w[t] || [])
          ttq.methods = [
            'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready',
            'alias', 'group', 'enableCookie', 'disableCookie'
          ]
          ttq.setAndDefer = function (t: any, e: any) {
            t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
            }
          }
          for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
          ttq.instance = function (t: any) {
            for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n])
            return e
          }
          ttq.load = function (e: any, n: any) {
            var i = 'https://analytics.tiktok.com/i18n/pixel/events.js'
            ;(ttq._i = ttq._i || {})
            ;(ttq._i[e] = [])
            ;(ttq._i[e]._u = i)
            ;(ttq._t = ttq._t || {})
            ;(ttq._t[e] = +new Date())
            ;(ttq._o = ttq._o || {})
            ;(ttq._o[e] = n || {})
            var o = document.createElement('script')
            o.type = 'text/javascript'
            o.async = !0
            o.src = i + '?sdkid=' + e + '&lib=' + t
            var a = document.getElementsByTagName('script')[0]
            a.parentNode.insertBefore(o, a)
          }
          ttq.load(cleanTt)
          ttq.page()
        })(window, document, 'ttq')
      }
    }

    // 3. Injected Google Analytics / Tag
    const cleanG = (googlePixelId || '').trim()
    if (cleanG && (cleanG.startsWith('G-') || cleanG.startsWith('AW-') || cleanG.startsWith('GT-'))) {
      const gScript = document.createElement('script')
      gScript.async = true
      gScript.src = `https://www.googletagmanager.com/gtag/js?id=${cleanG}`
      document.head.appendChild(gScript)

      ;(window as any).dataLayer = (window as any).dataLayer || []
      function gtag(...args: any[]) {
        ;(window as any).dataLayer.push(args)
      }
      ;(window as any).gtag = gtag
      gtag('js', new Date())
      gtag('config', cleanG)
    }

    // 4. Injected LINE Tag
    const cleanLine = (lineTagId || '').trim()
    if (cleanLine) {
      /* eslint-disable */
      !(function (g: any, d: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (g._lt) return
        n = g._lt = function () {
          n.apply ? n.apply(n, arguments) : n.queue.push(arguments)
        }
        n.queue = []
        t = d.createElement(e)
        t.async = !0
        t.src = v
        s = d.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js')
      try {
        ;(window as any)._lt('init', {
          customerType: 'LAP',
          tagId: cleanLine,
        })
        ;(window as any)._lt('send', 'pv', [cleanLine])
      } catch (e) {}
    }

    // 5. Fire initial PageView event to database logger
    if (userId) {
      trackPixelEvent('PageView', {}, { userId, landingPageId, pixelId: fbPixelId || tiktokPixelId || null })
    }
  }, [userId, landingPageId, fbPixelId, tiktokPixelId, googlePixelId, lineTagId])

  return null
}
