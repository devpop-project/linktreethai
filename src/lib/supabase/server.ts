import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const DEFAULT_URL = 'https://dkidksohprjhkcokdbja.supabase.co'
const DEFAULT_KEY = 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'

export function createClient() {
  const cookieStore = cookies()

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const url = envUrl && envUrl.startsWith('http') ? envUrl : DEFAULT_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY

  return createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {}
        },
      },
    }
  )
}
