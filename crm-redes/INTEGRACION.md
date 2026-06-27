# Integracion CRM

## Stack detectado
- Sitio anfitrion: Next.js 15 con App Router y React.
- CRM adjunto: Node.js + Express en ESM, servido por `crm-redes/server.js` con frontend React via CDN en `crm-redes/public/`.

## Estrategia usada
- Se uso la estrategia de aislamiento por iframe.
- El CRM corre como servicio independiente en su propio puerto (`4000`).
- El sitio anfitrion expone la ruta `/clientes` como una pagina que solo incrusta el CRM en un iframe.
- El CRM se aislo ademas por API con el prefijo `/api/clientes/*`.

## Comandos para levantarlo
1. Instalar dependencias del CRM:
   ```bash
   cd crm-redes
   npm install
   ```
2. Crear variables locales del CRM:
   ```bash
   cp .env.example .env
   ```
   Luego cambiar `JWT_SECRET` por uno largo y propio.
3. Levantar el CRM:
   ```bash
   npm start
   ```
4. Levantar el sitio anfitrion:
   ```bash
   cd ..
   npm run dev
   ```

## Variables de entorno
- `crm-redes/.env` debe tener un `JWT_SECRET` propio.
- El sitio anfitrion usa `NEXT_PUBLIC_CRM_URL` para apuntar al servicio del CRM.
- En local, el fallback es `http://localhost:4000`.

## Archivos tocados
### Sitio anfitrion
- `app/clientes/page.tsx`
- `app/agencia/page.tsx`
- `components/layouts/ProtectedLayout.tsx`

### CRM adjunto
- `crm-redes/server.js`
- `crm-redes/public/index.html`
- `crm-redes/public/agency.html`
- `crm-redes/package-lock.json`
- `crm-redes/package.json`
- `crm-redes/.env` (solo local, no versionado)

## Verificaciones hechas
- `npm run build` en el sitio anfitrion: OK.
- `npm start` en `crm-redes`: OK, arrancando en `http://localhost:4000`.
- Login de prueba del CRM:
  - Cliente: `camila@laparrillaverde.co` / `cliente123`
  - Agencia: `equipo@pautastudio.co` / `agencia123`
- La ruta `/clientes` del sitio anfitrion carga el iframe del CRM.

## Rollback
1. Borrar la ruta `app/clientes/page.tsx` y restaurar los enlaces si hiciera falta.
2. Revertir los cambios en `app/agencia/page.tsx` y `components/layouts/ProtectedLayout.tsx`.
3. Revertir los cambios en `crm-redes/server.js`, `crm-redes/public/index.html` y `crm-redes/public/agency.html`.
4. Eliminar la carpeta `crm-redes/` si se quiere volver al estado anterior.

## Notas
- `crm-redes/data/` y `crm-redes/.env` no deben subirse al repositorio.
- El panel de la agencia queda dentro del CRM y no depende del sitio anfitrion para funcionar.
