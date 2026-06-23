import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/servicios',
    '/casos-de-exito',
    '/blog',
    '/login',
    '/register',
    '/forgot-password',
    '/unauthorized',
    '/industrias',
    '/ubicaciones',
    '/contacto',
    '/faqs',
    '/cliente',
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - need authentication
  const protectedRoutes = ['/admin', '/client', '/team'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute) {
    // Get session from cookies
    const sessionToken = request.cookies.get('sb-auth-token');
    
    if (!sessionToken) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif).*)',
  ],
};
