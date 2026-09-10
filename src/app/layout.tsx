import './globals.css'
import type { Metadata, Viewport } from 'next'
import { createClient } from '@supabase/supabase-js'
import DynamicSiteHead from '@/components/DynamicSiteHead'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0F17',
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://linktreethai.in.th'

async function getSiteSettings() {
  let title = 'LinkTreeThai - รวมทุกลิงก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว + PromptPay ขายสินค้าดิจิทัล'
  let description = 'สร้างหน้า Bio Link สวยทันสมัย สไตล์ Mobile App รวมทุกโซเชียล ขายสินค้าดิจิทัล ย่อลิงก์ พร้อมระบบ + PromptPay จัดการครบวงจรด้วย LinkTreeThai'
  let keywords = ['LinkTreeThai', 'Bio Link', 'เซลเพจยิงแอด', 'PromptPay QR', 'COD', 'รวมลิงก์', 'ระบบย่อลิงก์', 'TikTok Shop']
  let ogImageUrl = 'https://dkidksohprjhkcokdbja.supabase.co/storage/v1/object/public/media/brand/og-1787511308304.png'
  let faviconUrl = '/favicon.ico'

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

    // 1. Fetch system_settings table configured by Admin
    const { data: sysSettings } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['site_title', 'site_description', 'site_keywords', 'site_og_image_url', 'site_favicon_url', 'site_logo_url'])

    if (sysSettings && sysSettings.length > 0) {
      sysSettings.forEach((row: any) => {
        if (row.key === 'site_title' && row.value?.trim()) title = row.value.trim()
        if (row.key === 'site_description' && row.value?.trim()) description = row.value.trim()
        if (row.key === 'site_keywords' && row.value?.trim()) {
          keywords = row.value.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
        if (row.key === 'site_og_image_url' && row.value?.trim()) ogImageUrl = row.value.trim()
        if (row.key === 'site_favicon_url' && row.value?.trim()) faviconUrl = row.value.trim()
        if (!ogImageUrl && row.key === 'site_logo_url' && row.value?.trim()) ogImageUrl = row.value.trim()
      })
    }

    // 2. If Admin did not set site_og_image_url, check Admin Profile (cover_url or avatar_url)
    if (!ogImageUrl || ogImageUrl === '/og-image.png') {
      const { data: adminProf } = await supabase
        .from('profiles')
        .select('cover_url, avatar_url')
        .eq('role', 'admin')
        .limit(1)
        .single()

      if (adminProf) {
        if (adminProf.cover_url?.trim()) ogImageUrl = adminProf.cover_url.trim()
        else if (adminProf.avatar_url?.trim()) ogImageUrl = adminProf.avatar_url.trim()
      }
    }
  } catch (err) {
    console.warn('Error fetching system settings for root metadata:', err)
  }

  // Ensure absolute URL for Open Graph image
  if (!ogImageUrl) {
    ogImageUrl = 'https://dkidksohprjhkcokdbja.supabase.co/storage/v1/object/public/media/brand/og-1787511308304.png'
  } else if (!ogImageUrl.startsWith('http://') && !ogImageUrl.startsWith('https://')) {
    ogImageUrl = `${siteUrl}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`
  }

  return { title, description, keywords, ogImageUrl, faviconUrl }
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, keywords, ogImageUrl, faviconUrl } = await getSiteSettings()

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: '%s | LinkTreeThai'
    },
    description: description,
    keywords: keywords,
    authors: [{ name: 'LinkTreeThai' }],
    creator: 'LinkTreeThai',
    publisher: 'LinkTreeThai',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: faviconUrl, sizes: 'any' },
      ],
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: siteUrl,
      siteName: 'LinkTreeThai',
      locale: 'th_TH',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png'
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { title, description, ogImageUrl, faviconUrl } = await getSiteSettings()

  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </head>
      <body className="bg-[#0B0F17] text-slate-100 min-h-screen antialiased selection:bg-[#A78BFA] selection:text-white">
        <DynamicSiteHead />
        {children}
      </body>
    </html>
  )
}
