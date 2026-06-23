# Velozza Platform

Aplicación Next.js 15 con autenticación usando Supabase y protección básica de rate limiting.

## Estructura

- `app/` — Rutas y layout de la aplicación.
- `components/` — Componentes React reutilizables.
- `lib/` — Lógica de Supabase, autenticación y rate limiting.
- `styles/` — Estilos globales.

## Configuración

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env.local` con estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

## Funcionalidad

- `app/page.tsx` muestra un formulario de inicio de sesión.
- `app/api/auth/route.ts` maneja la autenticación con Supabase y aplica rate limiting.
- `lib/supabase-client.ts` crea el cliente de Supabase compartido.
- `lib/auth-provider.tsx` gestiona el estado de sesión del usuario en el cliente.
- `lib/rate-limit.ts` limita peticiones por IP.

## Notas

- Este proyecto usa Next.js 15 en modo app router.
- Si necesitas ampliar la autenticación, agrega rutas adicionales bajo `app/api`.
