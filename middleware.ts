import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Redirect www zu non-www (oder umgekehrt - ändere nach Bedarf)
  // Aktuell: www.ritamahlis.com → ritamahlis.com
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '');
    return NextResponse.redirect(url, 301); // Permanent redirect
  }
  
  return NextResponse.next();
}

export const config = {
  // Matcher für alle Routes außer API, static files, etc.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

