import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_URL = 'https://dkidksohprjhkcokdbja.supabase.co'
const DEFAULT_KEY = 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'

export function createClient() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const url = envUrl && envUrl.startsWith('http') ? envUrl : DEFAULT_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY

  return createBrowserClient(url, key)
}
