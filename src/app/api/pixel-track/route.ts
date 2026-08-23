import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

function sha256(str: string): string {
  return crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
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
      return NextResponse.json({ error: 'Missing event_name' }, { status: 400 })
    }

    const headersList = request.headers
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     headersList.get('x-real-ip') || 
                     '127.0.0.1'
    const userAgent = headersList.get('user-agent') || ''

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Look up owner profile for CAPI credentials if not passed
    let cleanFbPixel = (fb_pixel_id || '').trim()
    let cleanCapiToken = (meta_capi_token || '').trim()
    let cleanTtPixel = (tiktok_pixel_id || '').trim()

    if ((!cleanFbPixel || !cleanCapiToken) && user_id) {
      try {
        const { data: prof } = await supabase
          .from('profiles')
          .select('fb_pixel_id, meta_capi_token, tiktok_pixel_id')
          .eq('id', user_id)
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

        if (user_data?.email) fbUserData.em = [sha256(user_data.email)]
        if (user_data?.phone) fbUserData.ph = [sha256(user_data.phone.replace(/[^0-9]/g, ''))]
        if (user_data?.fbp) fbUserData.fbp = user_data.fbp
        if (user_data?.fbc) fbUserData.fbc = user_data.fbc

        const capiPayload = {
          data: [
            {
              event_name: event_name === 'ClickShopee' || event_name === 'ClickLazada' ? 'InitiateCheckout' : event_name,
              event_time: Math.floor(Date.now() / 1000),
              event_source_url: url || 'https://linktreethai.com',
              action_source: 'website',
              user_data: fbUserData,
              custom_data: {
                ...event_data,
                ...utm
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
            console.log('✅ Meta CAPI event dispatched successfully:', event_name)
          }
        }).catch(err => {
          console.warn('Meta CAPI dispatch error:', err)
        })
      } catch (e) {
        console.warn('CAPI error:', e)
      }
    }

    // =========================================================================
    // 2. SAVE EVENT TO SUPABASE DATABASE
    // =========================================================================
    if (user_id) {
      await supabase.from('pixel_events').insert([{
        user_id,
        landing_page_id: landing_page_id || null,
        pixel_type: cleanFbPixel ? 'facebook' : (cleanTtPixel ? 'tiktok' : 'all'),
        pixel_id: cleanFbPixel || cleanTtPixel || null,
        event_name,
        event_data: {
          ...event_data,
          utm: utm || {},
          ip: clientIp,
          user_agent: userAgent
        },
        url: url || null,
        created_at: new Date().toISOString()
      }]).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
