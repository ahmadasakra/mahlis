import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Erlaube beide Domains: ritamahlis.com und www.ritamahlis.com
  // Redirect deaktiviert, bis beide Domains funktionieren
  // Später kann wieder aktiviert werden, um www zu non-www zu redirecten
  
  // Optional: Redirect www zu non-www (nur wenn beide Domains funktionieren)
  // if (hostname.startsWith('www.ritamahlis.com')) {
  //   const url = request.nextUrl.clone();
  //   url.hostname = 'ritamahlis.com';
  //   return NextResponse.redirect(url, 301);
  // }
  
  // Validiere erlaubte Domains (für Sicherheit)
  const allowedHosts = [
    'ritamahlis.com',
    'www.ritamahlis.com',
    'https://mahlis-63c306311545.herokuapp.com/',
    'mahlis-63c306311545.herokuapp.com', // Heroku App URL
    'localhost:3000', // Development
  ];
  
  // In Production: Prüfe ob Host erlaubt ist
  if (process.env.NODE_ENV === 'production' && hostname && !allowedHosts.some(allowed => hostname.includes(allowed))) {
    // Erlaube auch Heroku Dyno URLs
    if (!hostname.includes('.herokuapp.com') && !hostname.includes('localhost')) {
      return new NextResponse('Invalid host', { status: 403 });
    }
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



