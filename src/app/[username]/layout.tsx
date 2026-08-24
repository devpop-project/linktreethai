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

async function getBioProfile(username: string) {
  try {
    const supabase = getSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, bio, avatar_url, cover_url')
      .eq('username', username.toLowerCase())
      .single()

    if (profile) return profile
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

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const username = params.username.toLowerCase()
  const profile = await getBioProfile(username)
  const defaultAdminImage = await getAdminFallbackOgImage()
  
  if (profile) {
    const displayName = profile.full_name || profile.username
    const title = `${displayName} (@${profile.username}) | LinkTreeThai`
    const desc = profile.bio || `รวมทุกลิงก์ ช่องทางติดต่อ และสินค้าของ ${displayName} (@${profile.username}) บน LinkTreeThai`
    let imageUrl = profile.cover_url || profile.avatar_url || defaultAdminImage

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
        url: `${siteUrl}/${username}`,
        siteName: 'LinkTreeThai',
        locale: 'th_TH',
        type: 'profile',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
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

  return {
    metadataBase: new URL(siteUrl),
    title: `@${username} | LinkTreeThai`,
    description: `หน้าโปรไฟล์และรวมลิงก์ของ @${username} บน LinkTreeThai`,
    openGraph: {
      title: `@${username} | LinkTreeThai`,
      images: [{ url: defaultAdminImage, width: 1200, height: 630, alt: `@${username}` }],
    }
  }
}

export default function UserBioLayout({
  children,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  return <>{children}</>
}
