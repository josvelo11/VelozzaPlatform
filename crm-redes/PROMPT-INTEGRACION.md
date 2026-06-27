# Prompt para integrar el módulo de clientes (CRM) sin afectar el resto del sitio

Copia TODO lo que está dentro del bloque y pégalo en tu agente de VS Code
(Claude Code, Cursor, Copilot Chat…). Antes, descomprime `crm-redes.zip`
dentro de tu proyecto, por ejemplo en una carpeta llamada `crm-redes/`.

---

```
ROL
Actúa como ingeniero senior de integración. Tu trabajo es montar un módulo
existente (un CRM/portal de clientes) DENTRO de mi sitio web actual SIN alterar
ni romper ninguna otra parte del sitio. La prioridad nº 1 es el aislamiento.

CONTEXTO
- Mi sitio ya existe y está en este repositorio/carpeta. NO lo conoces todavía:
  primero debes inspeccionarlo y entender su stack.
- El módulo a integrar está en la carpeta `crm-redes/`. Es un backend Node.js
  (Express, ESM) con dos portales en `crm-redes/public/`:
    • index.html  → portal del cliente
    • agency.html → panel de la agencia
    • styles.css  → estilos del módulo
  El backend expone una API REST bajo `/api/*` y "base de datos" en un archivo
  JSON (`crm-redes/data/db.json`). Lee `crm-redes/README.md` para entenderlo.

REGLA DE ORO (innegociable)
El sitio actual debe seguir funcionando EXACTAMENTE igual. El módulo de clientes
vive en su propio espacio, bajo una ruta dedicada (por defecto `/clientes`), y
NO comparte CSS global, ni rutas, ni dependencias, ni estado con el resto.

RESTRICCIONES DURAS — qué NO puedes hacer
1. NO modifiques, muevas ni borres archivos existentes del sitio, salvo añadir
   de forma mínima y reversible el "punto de montaje" del módulo (una ruta, un
   enlace o un proxy). Cada cambio fuera de `crm-redes/` debe ser mínimo y
   quedar documentado.
2. NO cambies versiones de dependencias del sitio, ni toques su build, su
   configuración global, sus variables de entorno existentes ni su CSS global.
3. NO expongas el panel de la agencia (`/agencia`) en una ruta pública obvia sin
   protección; déjalo accesible solo para el equipo.
4. NO subas `crm-redes/data/` ni `.env` al control de versiones (añádelos a
   `.gitignore` si hace falta).
5. Trabaja en una RAMA nueva (ej. `feat/modulo-clientes`), nunca directo en main.

PASO 0 — Descubrimiento (hazlo y repórtame antes de codear)
- Detecta el stack del sitio: ¿HTML estático? ¿WordPress/PHP? ¿Node/Express?
  ¿Next.js/React/Vue? ¿Laravel? ¿Cómo se sirve y cómo se hace deploy?
- Detecta el servidor web/reverse-proxy si existe (Nginx, Apache, Vercel, etc.).
- Dime el stack detectado y QUÉ estrategia de aislamiento vas a usar (de las de
  abajo) y por qué. Espera mi visto bueno si el cambio fuera de `crm-redes/` es
  más que mínimo.

ESTRATEGIAS DE AISLAMIENTO (elige según el stack)
A) Sitio estático, WordPress, PHP, Laravel, o cualquier stack NO-Node:
   - Corre el módulo como un SERVICIO Node aparte (su propio puerto, ej. 4000),
     gestionado con PM2 o systemd, independiente del sitio.
   - Expón el portal del cliente embebiéndolo en una página `/clientes` mediante
     un <iframe> a pantalla completa que apunte al servicio del módulo. El iframe
     garantiza CERO colisión de CSS/JS con el sitio.
   - En el reverse-proxy, enruta `/clientes` y el `/api` del módulo hacia el
     servicio Node (usa un prefijo de API propio, ver más abajo). No toques las
     demás rutas.

B) El sitio YA es Node/Express:
   - Monta la app del módulo como sub-aplicación bajo un prefijo:
     `app.use('/clientes', crmStaticAndRouter)` y `app.use('/api/clientes', crmApiRouter)`.
   - Adapta `crm-redes/server.js` para exportar su router en vez de escuchar su
     propio puerto, y para servir sus estáticos bajo `/clientes`.
   - Asegúrate de que su `express.json()` y middlewares NO alteren los del sitio
     (móntalos solo dentro del router del módulo).

C) El sitio es Next.js / React / SPA:
   - Opción simple y segura: igual que (A), iframe en una ruta `/clientes` hacia
     el servicio Node del módulo.
   - Opción avanzada (si insisto en inline): monta los portales como ruta aislada
     y encapsula su CSS (ver AISLAMIENTO DE CSS). No mezcles su estado global con
     el de la app.

AISLAMIENTO DE API (obligatorio en todos los casos)
- El módulo usa `/api/*`. Para que NO choque con la API del sitio, dale un
  prefijo propio: `/api/clientes/*`.
- Cambia las llamadas del frontend del módulo (en `index.html` y `agency.html`,
  función `apiFetch`) para que usen ese prefijo (ej. base `/api/clientes`).
- Si usas reverse-proxy, enruta solo ese prefijo al servicio del módulo.

AISLAMIENTO DE CSS (obligatorio si NO usas iframe)
- `styles.css` define variables en `:root` y clases genéricas (`.card`, `.btn`,
  `.nav-item`, etc.) que podrían colisionar con el sitio. Para evitarlo:
    • Envuelve TODO el módulo en un contenedor con clase única, ej.
      `<div class="crm-scope">…</div>`.
    • Reescribe `styles.css` para que cada selector quede prefijado por
      `.crm-scope` (mueve las variables de `:root` a `.crm-scope`).
  Si en cambio usas iframe (recomendado), NO necesitas nada de esto.

AISLAMIENTO DE SESIÓN/ALMACENAMIENTO
- El módulo guarda el token en localStorage con claves `crm_token` y
  `crm_agency_token`. Mantén esos nombres con prefijo `crm_` para no pisar el
  almacenamiento del sitio. Si el sitio y el módulo comparten dominio, verifica
  que no haya choque de cookies/keys.

VARIABLES DE ENTORNO Y SECRETOS
- Copia `crm-redes/.env.example` a `crm-redes/.env` y genera un `JWT_SECRET`
  propio, largo y aleatorio. No reutilices secretos del sitio.
- El puerto del módulo debe ser configurable y distinto al del sitio.

PASOS DE EJECUCIÓN
1. Crea la rama, instala dependencias del módulo dentro de `crm-redes/`
   (`npm install` ahí, sin tocar el `package.json` raíz del sitio).
2. Aplica la estrategia de aislamiento elegida (A, B o C).
3. Aplica los prefijos de API, el scope de CSS (si aplica) y el punto de montaje
   en `/clientes`.
4. Añade el enlace de acceso al portal donde yo te indique (o créalo como ruta
   suelta sin enlazarlo aún si prefiero probar primero).
5. Documenta en un archivo `INTEGRACION.md` qué archivos del sitio tocaste (que
   deben ser mínimos), cómo levantar el servicio y cómo revertir todo.

CRITERIOS DE ACEPTACIÓN (verifícalos y muéstrame evidencia)
- [ ] Todas las páginas y rutas previas del sitio cargan y se ven IGUAL que antes
      (compara antes/después; corre el build/lint/tests del sitio si existen y
      confirma que pasan sin cambios).
- [ ] El portal del cliente abre en `/clientes` y funciona (login con
      camila@laparrillaverde.co / cliente123, ver parrilla, aprobar, plan, chat).
- [ ] El panel de la agencia funciona en su ruta y queda protegido del público.
- [ ] No hay estilos del módulo "filtrándose" al sitio ni del sitio al módulo.
- [ ] La API del módulo responde bajo `/api/clientes/*` y no interfiere con la
      API del sitio.
- [ ] Todo el cambio es reversible: borrar el módulo y su punto de montaje deja
      el sitio idéntico al estado inicial.

ENTREGABLES
- La rama con los cambios.
- `INTEGRACION.md` con: stack detectado, estrategia usada, lista exacta de
  archivos del sitio modificados, comandos para levantar el módulo, y pasos de
  rollback.
- Un resumen final de 5 líneas de lo que hiciste.

ANTES DE EMPEZAR
Inspecciona el repositorio, dime el stack y la estrategia que recomiendas, y
hazme cualquier pregunta que necesites. No asumas; si algo es ambiguo, pregunta.
```

---

## Notas rápidas para ti (no van en el prompt)

- **Lo más a prueba de balas es el iframe** (estrategias A y C-simple): el módulo
  corre como su propio servicio y se "incrusta" en una página `/clientes`. Así es
  imposible que su CSS o su JavaScript afecten al resto del sitio.
- Si tu sitio ya es Node/Express, la estrategia B lo deja todo en un mismo
  servidor, más limpio, pero exige tocar un poco más.
- Si me dices tu stack exacto, te reescribo el prompt apuntando directo a esa
  ruta (sin las tres opciones) y te paso los comandos concretos de despliegue.
