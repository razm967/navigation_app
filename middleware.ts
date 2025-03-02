import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }

    // Handle auth callback
    if (req.nextUrl.pathname.startsWith('/auth/callback')) {
      const { searchParams } = new URL(req.url)
      const code = searchParams.get('code')
      
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
        return NextResponse.redirect(new URL('/map', req.url))
      }
    }

    // Protected routes
    const protectedPaths = ['/favorites', '/settings']
    if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth', req.url))
      }
    }

    // Redirect signed-in users away from auth page
    if (req.nextUrl.pathname === '/auth' && session) {
      return NextResponse.redirect(new URL('/map', req.url))
    }

    return res

  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: ['/auth/:path*', '/favorites/:path*', '/settings/:path*']
} 