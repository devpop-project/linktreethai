import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

function isValidUUID(str: any): boolean {
  return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim())
}

function sha256(val: any): string {
  if (!val) return ''
  try {
    return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex')
  } catch (e) {
    return ''
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }

    const { 
      user_id, 
      landing_page_id, 
      fb_pixel_id, 
      tiktok_pixel_id, 
      meta_capi_token, 
      event_name, 
      event_data, 
      url, 
      user_data,
      utm
    } = body

    if (!event_name) {
      return NextResponse.json({ success: true, message: 'Skipped: No event_name provided' })
    }

    // Validate UUIDs to prevent Postgres syntax errors
    const validUserId = isValidUUID(user_id) ? String(user_id).trim() : null
    const validLandingPageId = isValidUUID(landing_page_id) ? String(landing_page_id).trim() : null

    // Safe IP and User Agent extraction
    let clientIp = '127.0.0.1'
    let userAgent = ''
    try {
      const headersList = request.headers
      clientIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 headersList.get('x-real-ip') || 
                 '127.0.0.1'
      userAgent = headersList.get('user-agent') || ''
    } catch (e) {}

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Look up owner profile for CAPI credentials if not passed
    let cleanFbPixel = (fb_pixel_id || '').trim()
    let cleanCapiToken = (meta_capi_token || '').trim()
    let cleanTtPixel = (tiktok_pixel_id || '').trim()

    if ((!cleanFbPixel || !cleanCapiToken) && validUserId) {
      try {
        const { data: prof } = await supabase
          .from('profiles')
          .select('fb_pixel_id, meta_capi_token, tiktok_pixel_id')
          .eq('id', validUserId)
          .single()

        if (prof) {
          if (!cleanFbPixel && prof.fb_pixel_id) cleanFbPixel = prof.fb_pixel_id.trim()
          if (!cleanCapiToken && prof.meta_capi_token) cleanCapiToken = prof.meta_capi_token.trim()
          if (!cleanTtPixel && prof.tiktok_pixel_id) cleanTtPixel = prof.tiktok_pixel_id.trim()
        }
      } catch (e) {}
    }

    // =========================================================================
    // 1. DISPATCH TO META (FACEBOOK) CONVERSIONS API (CAPI)
    // =========================================================================
    if (cleanFbPixel && cleanCapiToken) {
      try {
        const fbUserData: any = {
          client_ip_address: clientIp,
          client_user_agent: userAgent
        }

        if (user_data?.email) {
          const hashedEmail = sha256(user_data.email)
          if (hashedEmail) fbUserData.em = [hashedEmail]
        }
        if (user_data?.phone) {
          const cleanPhone = String(user_data.phone).replace(/[^0-9]/g, '')
          const hashedPhone = sha256(cleanPhone)
          if (hashedPhone) fbUserData.ph = [hashedPhone]
        }
        if (user_data?.fbp) fbUserData.fbp = String(user_data.fbp).trim()
        if (user_data?.fbc) fbUserData.fbc = String(user_data.fbc).trim()

        const capiPayload = {
          data: [
            {
              event_name: event_name === 'ClickShopee' || event_name === 'ClickLazada' || event_name === 'ClickTikTokShop' ? 'InitiateCheckout' : event_name,
              event_time: Math.floor(Date.now() / 1000),
              event_source_url: url || 'https://linktreethai.in.th',
              action_source: 'website',
              user_data: fbUserData,
              custom_data: {
                ...(event_data || {}),
                ...(utm || {})
              }
            }
          ],
          access_token: cleanCapiToken
        }

        fetch(`https://graph.facebook.com/v19.0/${cleanFbPixel}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capiPayload)
        }).then(res => res.json()).then(data => {
          if (data?.events_received) {
            console.log('✅ Meta CAPI event dispatched:', event_name)
          }
        }).catch(err => {
          console.warn('Meta CAPI dispatch warning:', err)
        })
      } catch (e) {
        console.warn('CAPI error:', e)
      }
    }

    // =========================================================================
    // 2. SAVE EVENT TO SUPABASE DATABASE
    // =========================================================================
    if (validUserId) {
      try {
        await supabase.from('pixel_events').insert([{
          user_id: validUserId,
          landing_page_id: validLandingPageId,
          pixel_type: cleanFbPixel ? 'facebook' : (cleanTtPixel ? 'tiktok' : 'all'),
          pixel_id: cleanFbPixel || cleanTtPixel || null,
          event_name,
          event_data: {
            ...(event_data || {}),
            utm: utm || {},
            ip: clientIp,
            user_agent: userAgent
          },
          url: url || null,
          created_at: new Date().toISOString()
        }])
      } catch (insertErr) {
        console.warn('Pixel event insert warning:', insertErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Unhandled pixel-track error:', e)
    // Return status 200 with success: true so client analytics never fails or shows 500 error in browser console
    return NextResponse.json({ success: true, warning: e?.message || 'Handled error' }, { status: 200 })
  }
}
