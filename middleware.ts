import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check all cookies for Supabase auth tokens (created by @supabase/ssr or supabase-js)
  const cookies = request.cookies.getAll()
  const hasAuthCookie = cookies.some(
    (c) =>
      c.name.startsWith('sb-') &&
      c.name.includes('-auth-token') &&
      c.value &&
      c.value.length > 20
  ) || request.cookies.has('supabase-auth-token')

  // 1. If user is already authenticated and visits /login or /register
  // Immediately redirect to /dashboard and prevent caching
  if (pathname === '/login' || pathname === '/register') {
    if (hasAuthCookie) {
      const dashboardUrl = new URL('/dashboard', request.url)
      const redirectRes = NextResponse.redirect(dashboardUrl, 307)
      redirectRes.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
      redirectRes.headers.set('Pragma', 'no-cache')
      redirectRes.headers.set('Expires', '0')
      return redirectRes
    }

    // Never cache login or register pages so browser back button forces re-validation
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    res.headers.set('Pragma', 'no-cache')
    res.headers.set('Expires', '0')
    return res
  }

  // 2. Protect /dashboard and /admin from unauthenticated direct visits
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!hasAuthCookie) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl, 307)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/admin/:path*'
  ]
}
