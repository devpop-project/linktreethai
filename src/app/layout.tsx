import './globals.css'
import type { Metadata, Viewport } from 'next'
import DynamicSiteHead from '@/components/DynamicSiteHead'

export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0F17',
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://linktreethai.in.th'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LinkTreeThai - รวมทุกลิ้งก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว',
    template: '%s | LinkTreeThai'
  },
  description: 'สร้างหน้า Bio Link สวยทันสมัย สไตล์ Mobile App รวมทุกโซเชียล ขายสินค้าดิจิทัล ย่อลิงก์ พร้อมระบบจัดการครบวงจรด้วย LinkTreeThai',
  keywords: ['LinkTreeThai', 'Bio Link', 'เซลเพจยิงแอด', 'PromptPay QR', 'COD', 'รวมลิงก์', 'ระบบย่อลิงก์', 'TikTok Shop'],
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'LinkTreeThai - รวมทุกลิ้งก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว',
    description: 'สร้างหน้า Bio Link สวยทันสมัย สไตล์ Mobile App รวมทุกโซเชียล ขายสินค้าดิจิทัล ย่อลิงก์ พร้อมระบบ PromptPay QR & LINE แจ้งเตือน',
    url: siteUrl,
    siteName: 'LinkTreeThai',
    locale: 'th_TH',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinkTreeThai - รวมทุกลิ้งก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkTreeThai - รวมทุกลิ้งก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว',
    description: 'สร้างหน้า Bio Link สวยทันสมัย สไตล์ Mobile App รวมทุกโซเชียล ขายสินค้าดิจิทัล ย่อลิงก์ พร้อมระบบจัดการครบวงจรด้วย LinkTreeThai',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        {/* Explicit Open Graph Meta Tags for Facebook Crawler fallback */}
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="LinkTreeThai" />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className="bg-[#0B0F17] text-slate-100 min-h-screen antialiased selection:bg-[#A78BFA] selection:text-white">
        <DynamicSiteHead />
        {children}
      </body>
    </html>
  )
}
