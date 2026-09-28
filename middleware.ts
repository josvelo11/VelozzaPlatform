import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyFormacionSession } from '@/lib/formacion-auth';

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

  // Formación Plus: contenido exclusivo para clientes, protegido por cookie
  // firmada (HMAC), no por una cookie sin firmar como el portal legado de
  // arriba — ver lib/formacion-auth.ts.
  const isFormacionRoute = pathname === '/formacion-plus' || pathname.startsWith('/formacion-plus/');
  const formacionLoginRoutes = ['/formacion-plus/login', '/api/formacion-plus/login'];
  const isFormacionLoginRoute = formacionLoginRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isFormacionRoute && !isFormacionLoginRoute) {
    const token = request.cookies.get('formacion_session')?.value;
    const username = await verifyFormacionSession(token);

    if (!username) {
      const loginUrl = new URL('/formacion-plus/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif).*)',
  ],
};
