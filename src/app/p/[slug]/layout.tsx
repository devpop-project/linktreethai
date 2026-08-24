import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://linktreethai.in.th'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
}

async function getSalepage(slug: string) {
  try {
    const supabase = getSupabaseClient()
    const { data: page } = await supabase
      .from('landing_pages')
      .select('id, title, slug, headline, subheadline, hero_image_url, og_image_url, offer_price, seo_title, seo_description')
      .eq('slug', slug.toLowerCase())
      .single()

    if (page) return page
  } catch (e) {}
  return null
}

async function getAdminFallbackOgImage(): Promise<string> {
  try {
    const supabase = getSupabaseClient()
    const { data: sysSettings } = await supabase
      .from('system_settings')
      .select('key, value')
      .eq('key', 'site_og_image_url')
      .single()

    if (sysSettings?.value && sysSettings.value.trim()) {
      return sysSettings.value.trim()
    }

    const { data: adminProf } = await supabase
      .from('profiles')
      .select('cover_url, avatar_url')
      .eq('role', 'admin')
      .limit(1)
      .single()

    if (adminProf?.cover_url?.trim()) return adminProf.cover_url.trim()
    if (adminProf?.avatar_url?.trim()) return adminProf.avatar_url.trim()
  } catch (e) {}
  return `${siteUrl}/og-image.png`
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug.toLowerCase()
  const page = await getSalepage(slug)
  const defaultAdminImage = await getAdminFallbackOgImage()
  
  if (page) {
    const title = page.seo_title || page.headline || page.title || 'ข้อเสนอพิเศษ Flash Sale'
    const desc = page.seo_description || page.subheadline || `โปรโมชั่นพิเศษราคา ฿${page.offer_price ? parseFloat(String(page.offer_price)).toLocaleString() : '990'} บาท สั่งซื้อออนไลน์พร้อมส่งฟรีด่วนทั่วไทย`
    let imageUrl = page.og_image_url || page.hero_image_url || defaultAdminImage

    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    }

    return {
      metadataBase: new URL(siteUrl),
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `${siteUrl}/p/${slug}`,
        siteName: 'LinkTreeThai',
        locale: 'th_TH',
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: desc,
        images: [imageUrl],
      },
    }
  }

  return {
    metadataBase: new URL(siteUrl),
    title: `เซลเพจโปรโมชั่น | LinkTreeThai`,
    description: `ข้อเสนอโปรโมชั่นพิเศษ สั่งซื้อออนไลน์ได้ทันที`,
    openGraph: {
      title: `เซลเพจโปรโมชั่น | LinkTreeThai`,
      images: [{ url: defaultAdminImage, width: 1200, height: 630, alt: 'เซลเพจโปรโมชั่น' }],
    }
  }
}

export default function SalesLandingPageLayout({
  children,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return <>{children}</>
}
