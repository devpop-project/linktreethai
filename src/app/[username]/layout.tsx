import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://linktreethai.in.th'

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const username = params.username.toLowerCase()
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, bio, avatar_url, cover_url')
      .eq('username', username)
      .single()

    if (profile) {
      const displayName = profile.full_name || profile.username
      const title = `${displayName} (@${profile.username}) | LinkTreeThai`
      const desc = profile.bio || `รวมทุกลิงก์ ช่องทางติดต่อ และสินค้าของ ${displayName} (@${profile.username}) บน LinkTreeThai`
      const imageUrl = profile.avatar_url || profile.cover_url || `${siteUrl}/og-image.png`

      return {
        title,
        description: desc,
        openGraph: {
          title,
          description: desc,
          url: `${siteUrl}/${username}`,
          siteName: 'LinkTreeThai',
          locale: 'th_TH',
          type: 'profile',
          images: [
            {
              url: imageUrl,
              width: 600,
              height: 600,
              alt: displayName,
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
    console.warn('Error generating bio page metadata:', e)
  }

  return {
    title: `@${username} | LinkTreeThai`,
    description: `หน้าโปรไฟล์และรวมลิงก์ของ @${username} บน LinkTreeThai`,
    openGraph: {
      title: `@${username} | LinkTreeThai`,
      images: [`${siteUrl}/og-image.png`],
    }
  }
}

export default function UserBioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
