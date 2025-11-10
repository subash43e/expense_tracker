import { NextResponse } from 'next/server';

/**
 * Middleware for security headers
 * 
 * Note: Authentication is now handled by route group layouts:
 * - (auth)/layout.js - Protects /expenses, /analytics, /settings
 * - (public)/layout.js - Redirects authenticated users from /login, /register
 * 
 * This middleware only adds security headers to all responses
 */
export function middleware(request) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

/**
 * Configure which routes the middleware runs on
 * Excludes:
 * - API routes (handled by API route handlers)
 * - Static files (_next/static)
 * - Image optimization files (_next/image)
 * - Metadata files (favicon.ico, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
