import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      const user = data.user
      try {
        // Check if user profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          // Initialize profile for OAuth (Google) user
          let baseUsername = (user.email ? user.email.split('@')[0] : 'user')
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '')
          if (baseUsername.length < 3) baseUsername = 'user_' + baseUsername

          // Check if username is already taken
          let finalUsername = baseUsername
          const { data: dupUser } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', finalUsername)
            .single()

          if (dupUser) {
            finalUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`
          }

          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
          const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

          await supabase.from('profiles').insert([{
            id: user.id,
            username: finalUsername,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: 'user',
            points: 100,
            template_id: 'template_1',
            bg_color: '#0B0F17'
          }])
        }
      } catch (profileErr) {
        console.warn('OAuth profile sync note:', profileErr)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/dashboard`)
}
