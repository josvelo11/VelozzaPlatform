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

  // Portal legado (app/(protected)/admin|client|team) — retirado por seguridad.
  // Su gate original solo comprobaba que existiera una cookie llamada
  // sb-auth-token, sin verificar firma ni contenido: cualquiera podía crearla
  // desde la consola del navegador (`document.cookie = 'sb-auth-token=x'`) y
  // pasar. Peor: las páginas hacían fetch de datos en el servidor ANTES de
  // cualquier chequeo de auth (el chequeo real vivía en un componente
  // cliente), así que en cuanto se conecte Supabase esos datos viajarían al
  // navegador de cualquier visitante sin sesión. No hay ningún enlace vivo en
  // el sitio hacia estas rutas — el panel real es /clientes (Pauta Studio,
  // con su propia autenticación contra el CRM). Se bloquea aquí, antes de que
  // corra cualquier página o fetch de datos, en vez de parchear el gate roto.
  const legacyPortalRoutes = ['/admin', '/client', '/team'];
  const isLegacyPortalRoute = legacyPortalRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isLegacyPortalRoute) {
    return NextResponse.redirect(new URL('/clientes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif).*)',
  ],
};
