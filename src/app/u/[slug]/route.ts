import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: {
      fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' })
    }
  })
}

function injectTrackingPixels(html: string, page: any, eventId?: string): string {
  let scripts = ''

  // 1. Meta (Facebook) Pixel
  const cleanFb = (page.fb_pixel_id || '').trim()
  if (cleanFb && cleanFb.length >= 6) {
    const trackCall = eventId 
      ? `fbq('track', 'PageView', {}, { eventID: '${eventId}' });` 
      : `fbq('track', 'PageView');`

    scripts += `
<!-- Meta Pixel Code (LinkTreeThai) -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${cleanFb}');
${trackCall}
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${cleanFb}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
`
  }

  // 2. TikTok Pixel
  const cleanTt = (page.tiktok_pixel_id || '').trim()
  if (cleanTt && cleanTt.length >= 6) {
    scripts += `
<!-- TikTok Pixel Code (LinkTreeThai) -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${cleanTt}');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->
`
  }

  // 3. Google Tag (gtag.js)
  const cleanG = (page.google_pixel_id || '').trim()
  if (cleanG && (cleanG.startsWith('G-') || cleanG.startsWith('AW-') || cleanG.startsWith('GT-') || cleanG.startsWith('UA-'))) {
    scripts += `
<!-- Google Tag (LinkTreeThai) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${cleanG}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${cleanG}');
</script>
<!-- End Google Tag -->
`
  }

  // 4. LINE Tag
  const cleanLine = (page.line_tag_id || '').trim()
  if (cleanLine) {
    scripts += `
<!-- LINE Tag Code (LinkTreeThai) -->
<script>
(function(g,d,o){
  g._lt = g._lt || function(){(g._lt.q = g._lt.q || []).push(arguments)};
  var s = d.createElement('script');
  s.async = 1;
  s.src = 'https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js';
  var e = d.getElementsByTagName('script')[0];
  e.parentNode.insertBefore(s, e);
})(window, document);
_lt('init', { customerType: 'LAP', tagId: '${cleanLine}' });
_lt('send', 'pv', ['${cleanLine}']);
</script>
<!-- End LINE Tag Code -->
`
  }

  if (!scripts) return html

  // Inject before </head> if present
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${scripts}\n</head>`)
  }
  // Otherwise before </body>
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${scripts}\n</body>`)
  }
  // Otherwise prepend
  return `${scripts}\n${html}`
}

function get404Html(slug: string): string {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - ไม่พบหน้าเว็บที่คุณค้นหา | LinkTreeThai</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: #0B0F17;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #131B2A;
      border: 1px solid rgba(167, 139, 250, 0.25);
      border-radius: 28px;
      padding: 48px 36px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(167, 139, 250, 0.15);
      border: 1px solid rgba(167, 139, 250, 0.3);
      border-radius: 9999px;
      color: #C4B5FD;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 72px;
      margin: 0;
      line-height: 1;
      font-weight: 900;
      background: linear-gradient(135deg, #A78BFA, #F472B6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    h2 {
      font-size: 22px;
      margin: 16px 0 10px;
      font-weight: 800;
      color: #F8FAFC;
    }
    p {
      font-size: 14px;
      color: #94A3B8;
      line-height: 1.6;
      margin: 0 0 32px;
    }
    .slug-chip {
      display: inline-block;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 10px;
      border-radius: 8px;
      color: #E2E8F0;
      font-family: monospace;
      font-weight: bold;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #A78BFA, #818CF8);
      color: #0B0F17;
      font-weight: 800;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 16px;
      font-size: 14px;
      transition: all 0.2s;
      box-shadow: 0 10px 20px -5px rgba(167, 139, 250, 0.4);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 25px -5px rgba(167, 139, 250, 0.6);
    }
    .btn-secondary {
      display: inline-block;
      background: transparent;
      color: #94A3B8;
      font-weight: 600;
      text-decoration: none;
      padding: 10px;
      font-size: 13px;
    }
    .btn-secondary:hover {
      color: #FFFFFF;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🌐 LinkTreeThai Index Router</div>
    <h1>404</h1>
    <h2>ไม่พบหน้าเว็บที่คุณต้องการ</h2>
    <p>เส้นทาง <span class="slug-chip">/u/${slug}</span> อาจยังไม่ได้รับการอัปโหลด ถูกปิดใช้งาน หรือถูกลบออกจากระบบแล้ว</p>
    <div class="actions">
      <a href="/" class="btn-primary">กลับสู่หน้าหลัก LinkTreeThai</a>
      <a href="/uploadindex" class="btn-secondary">อัปโหลดหน้าเว็บของคุณที่นี่ (/uploadindex)</a>
    </div>
  </div>
</body>
</html>`
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = (params.slug || '').trim().toLowerCase()

    if (!slug) {
      return new Response(get404Html('unknown'), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    }

    const supabase = getSupabaseAdmin()

    // Primary table for /u/[slug] is uploaded_index_pages
    let page: any = null
    const { data: pData } = await supabase
      .from('uploaded_index_pages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (pData && pData.html_content) {
      page = pData
    } else {
      // Fallback to landing_pages only if uploaded_index_pages does not exist
      const { data: lpData } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (lpData && (lpData.body_content || lpData.html_content)) {
        page = {
          ...lpData,
          html_content: lpData.body_content || lpData.html_content
        }
      }
    }

    // If page not found or inactive
    if (!page || page.is_active === false) {
      return new Response(get404Html(slug), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    }

    // Increment views asynchronously
    try {
      if (page.id) {
        supabase
          .from('uploaded_index_pages')
          .update({ views: (page.views || 0) + 1 })
          .eq('id', page.id)
          .then(() => {})
          .catch(() => {
            supabase
              .from('landing_pages')
              .update({ views: (page.views || 0) + 1 })
              .eq('id', page.id)
              .then(() => {})
          })
      }
    } catch (vErr) {}

    // =========================================================================
    // Server-Side Meta Conversions API (CAPI) Dispatch (100% Server Event)
    // =========================================================================
    const cleanFb = (page.fb_pixel_id || '').trim()
    const cleanCapi = (page.meta_capi_token || '').trim()
    let eventId = ''

    if (cleanFb && cleanCapi) {
      try {
        eventId = `u_${(page.id || 'idx').replace(/-/g, '').slice(0, 8)}_${Date.now()}`
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                         req.headers.get('x-real-ip') || 
                         '127.0.0.1'
        const userAgent = req.headers.get('user-agent') || ''
        const eventSourceUrl = req.nextUrl?.href || `https://linktreethai.in.th/u/${slug}`

        const capiPayload = {
          data: [
            {
              event_name: 'PageView',
              event_time: Math.floor(Date.now() / 1000),
              event_id: eventId,
              event_source_url: eventSourceUrl,
              action_source: 'website',
              user_data: {
                client_ip_address: clientIp,
                client_user_agent: userAgent
              }
            }
          ],
          access_token: cleanCapi
        }

        // Fire & Forget to Meta Graph API v19.0
        fetch(`https://graph.facebook.com/v19.0/${cleanFb}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capiPayload)
        }).then(r => r.json()).then(res => {
          if (res?.events_received) {
            console.log(`✅ [Meta CAPI] 100% Server PageView sent for /u/${slug}`)
          }
        }).catch(() => {})

        // Asynchronously record event in pixel_events table
        if (page.user_id) {
          supabase.from('pixel_events').insert([{
            user_id: page.user_id,
            landing_page_id: null,
            pixel_type: 'facebook_capi',
            pixel_id: cleanFb,
            event_name: 'PageView',
            event_data: {
              server_side: true,
              event_id: eventId,
              slug,
              ip: clientIp,
              user_agent: userAgent
            },
            url: eventSourceUrl,
            created_at: new Date().toISOString()
          }]).then(() => {})
        }
      } catch (capiErr) {
        console.warn('Server CAPI error:', capiErr)
      }
    }

    const rawHtml = page.html_content || ''
    const finalHtml = injectTrackingPixels(rawHtml, page, eventId)

    return new Response(finalHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    })
  } catch (err: any) {
    console.error('Error serving /u/[slug]:', err)
    return new Response(get404Html(params.slug || ''), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
}
