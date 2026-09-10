import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const DEFAULT_URL = 'https://dkidksohprjhkcokdbja.supabase.co'
  const DEFAULT_KEY = 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const url = envUrl && envUrl.startsWith('http') ? envUrl : DEFAULT_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // 1. If already authenticated and trying to access /login or /register, redirect to /dashboard
  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. If user accesses /dashboard/profile, redirect to /dashboard?tab=appearance
  if (pathname === '/dashboard/profile') {
    return NextResponse.redirect(new URL('/dashboard?tab=appearance', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/profile',
  ],
}
