import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://linktreethai.in.th'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug.toLowerCase()
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: page } = await supabase
      .from('landing_pages')
      .select('id, title, slug, headline, subheadline, hero_image_url, og_image_url, offer_price, seo_title, seo_description')
      .eq('slug', slug)
      .single()

    if (page) {
      const title = page.seo_title || page.headline || page.title || 'ข้อเสนอพิเศษ Flash Sale'
      const desc = page.seo_description || page.subheadline || `โปรโมชั่นพิเศษราคา ฿${page.offer_price ? parseFloat(String(page.offer_price)).toLocaleString() : '990'} บาท สั่งซื้อออนไลน์พร้อมส่งฟรีด่วนทั่วไทย`
      const imageUrl = page.og_image_url || page.hero_image_url || `${siteUrl}/og-image.png`

      return {
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
  } catch (e) {
    console.warn('Error generating salepage metadata:', e)
  }

  return {
    title: `เซลเพจโปรโมชั่น | LinkTreeThai`,
    description: `ข้อเสนอโปรโมชั่นพิเศษ สั่งซื้อออนไลน์ได้ทันที`,
    openGraph: {
      title: `เซลเพจโปรโมชั่น | LinkTreeThai`,
      images: [`${siteUrl}/og-image.png`],
    }
  }
}

export default function SalesLandingPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
