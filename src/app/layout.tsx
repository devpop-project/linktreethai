import './globals.css'
import type { Metadata, Viewport } from 'next'
import DynamicSiteHead from '@/components/DynamicSiteHead'

export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F9F9FF',
}

export const metadata: Metadata = {
  title: 'LinkTreeThai - รวมทุกลิ้งก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว',
  description: 'สร้างหน้า Bio Link สวยทันสมัย สไตล์ Mobile App รวมทุกโซเชียล ขายสินค้าดิจิทัล ย่อลิงก์ พร้อมระบบจัดการครบวงจรด้วย LinkTreeThai',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'LinkTreeThai - รวมทุกลิ้งก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว',
    description: 'แอปสร้างหน้า Bio Link สวยทันสมัย สไตล์พาสเทล รวมทุกโซเชียล ขายสินค้าดิจิทัล และย่อลิงก์ฟรี',
    url: 'https://linktreethai.com',
    siteName: 'LinkTreeThai',
    locale: 'th_TH',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="bg-[#F9F9FF] text-[#1E1B4B] min-h-screen antialiased selection:bg-[#A78BFA] selection:text-white">
        <DynamicSiteHead />
        {children}
      </body>
    </html>
  )
}
