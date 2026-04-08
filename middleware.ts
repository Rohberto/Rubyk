import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin/blog') || pathname.startsWith('/admin/guide')) {
    const auth = req.cookies.get('rubyk_admin')?.value
    if (auth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/blog/:path*', '/admin/guide/:path*'],
}