import { NextResponse } from 'next/server';

/**
 * Middleware for handling authentication and route protection
 * Runs before routes are rendered to check authentication state
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Define paths that should redirect authenticated users
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.includes(pathname);
  
  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname); // Save original destination
    return NextResponse.redirect(url);
  }
  
  // If user is authenticated and trying to access login/register
  if (token && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // Add custom headers for security
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
