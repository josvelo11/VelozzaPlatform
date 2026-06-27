# Prompt definitivo para Claude Code — integrar el CRM sin romper el sitio

Este prompt está hecho a la medida de **este** módulo y pensado para frenar los
errores que un agente suele cometer al integrar. Copia TODO el bloque y pégalo
en Claude Code, con la carpeta `crm-redes/` ya colocada dentro de tu proyecto.

> Regla de oro que te ahorrará dolores: la opción **más a prueba de fallos** es
> correr `crm-redes` como su propio servicio y embeberlo en una página
> `/clientes` mediante un **iframe**. Así es IMPOSIBLE que su CSS o su JS afecten
> al resto del sitio. El prompt ya le indica esto al agente como ruta por defecto.

---

```
ROL
Eres un ingeniero de integración meticuloso y conservador. Tu única misión es
montar un módulo ya construido (un CRM/portal de clientes) dentro de mi sitio web
existente SIN alterar, degradar ni romper ninguna otra parte del sitio. Ante la
duda, NO actúas: preguntas. Prefieres la solución más aislada aunque sea menos
"elegante". La estabilidad del sitio actual vale más que cualquier optimización.

QUÉ ES EL MÓDULO (datos exactos — no los adivines)
- Está en la carpeta `crm-redes/` dentro de este repositorio.
- Es una app Node.js con Express en formato ES Modules (no CommonJS).
- Se instala con `npm install` dentro de `crm-redes/` y se arranca con `npm start`.
- Escucha en el puerto definido por la variable de entorno PORT (por defecto 4000).
- Sirve DOS interfaces (SPA de React vía CDN, sin build): 
    • Portal del cliente en la ruta `/`
    • Panel de la agencia en la ruta `/agencia`
- Expone una API REST bajo `/api/*`.
- Persiste datos en un archivo JSON en `crm-redes/data/db.json` (se crea solo en
  el primer arranque; está en .gitignore, NO lo subas).
- Guarda el token de sesión en localStorage con las claves `crm_token`
  (cliente) y `crm_agency_token` (agencia).
- Sus llamadas usan rutas relativas (`fetch('/api/...')`), por lo que funciona
  correctamente cuando se sirve desde su propio origen (su propio puerto/dominio).
- Lee `crm-redes/README.md` para el detalle funcional.

REGLA DE ORO (innegociable)
Mi sitio actual debe seguir funcionando EXACTAMENTE igual que antes. El módulo
vive en su propio espacio bajo la ruta `/clientes`. No comparte CSS global, ni
rutas, ni dependencias, ni puerto, ni estado con el resto del sitio.

PROHIBIDO (si necesitas hacer algo de esto, DETENTE y pregúntame)
1. Modificar, mover, renombrar o borrar CUALQUIER archivo existente del sitio,
   salvo añadir el "punto de montaje" mínimo del módulo (una ruta o una entrada
   de proxy). Cualquier cambio fuera de `crm-redes/` debe ser mínimo, aislado y
   listado explícitamente.
2. Tocar el `package.json`, el lockfile, el build, el bundler, el linter, el
   tsconfig o la configuración global del sitio.
3. Cambiar, actualizar o "alinear" versiones de dependencias del sitio.
4. Tocar el CSS global del sitio, sus variables, su reset o sus fuentes.
5. Mover el módulo a otro stack, reescribir su backend, o cambiar su forma de
   guardar datos. Intégralo TAL CUAL.
6. Exponer el panel de la agencia (`/agencia` del módulo) en una URL pública
   adivinable sin protección.
7. Subir a git `crm-redes/data/` ni `crm-redes/.env`.
8. Hacer commits directos a la rama principal.

FASE 0 — DESCUBRIMIENTO (haz esto y PÁRATE a reportar antes de escribir código)
- Inspecciona el repositorio. Identifica con precisión:
    • Stack del sitio (HTML estático / WordPress-PHP / Laravel / Node-Express /
      Next.js / Vue / etc.) y cómo se sirve y se despliega.
    • Si hay un reverse-proxy o hosting (Nginx, Apache, Vercel, Netlify, etc.).
    • Qué rutas existen ya, para no colisionar con `/clientes` ni con `/api`.
- Escríbeme un informe corto: stack detectado, estrategia que recomiendas (de las
  de abajo), qué archivos del sitio necesitarías tocar (deben ser mínimos) y qué
  riesgos ves. ESPERA mi confirmación antes de continuar.

ESTRATEGIAS (elige UNA según el stack; la A es la predeterminada y más segura)

A) IFRAME + servicio aparte  ← ÚSALA por defecto, sirve para CUALQUIER stack
   1. Configura `crm-redes` para correr como servicio independiente en su propio
      puerto (ej. 4000) con su propio `.env` (copia `.env.example` y genera un
      JWT_SECRET nuevo y largo). Déjalo gestionado con PM2 o systemd, o documenta
      el comando para levantarlo.
   2. Crea en mi sitio UNA sola página/ruta nueva `/clientes` cuyo contenido sea
      un iframe a pantalla completa que apunte al servicio del módulo.
   3. Si hay reverse-proxy y quieres mismo dominio: enruta SOLO `/clientes` (y, si
      decides exponer su API por el mismo dominio, SOLO un prefijo propio como
      `/crm-api`) hacia el servicio del módulo. No toques ninguna otra ruta.
   4. Como el iframe carga el módulo desde su propio origen, sus `fetch('/api/..')`
      siguen funcionando sin cambios. CERO colisión de CSS/JS con el sitio.
   Resultado: el módulo queda totalmente encapsulado.

B) Sub-app montada (SOLO si mi sitio YA es Node/Express y yo lo apruebo)
   - Adapta `crm-redes/server.js` para exportar su `app`/router en vez de llamar
     a `listen()`, y móntalo con prefijo: `site.use('/clientes', crmRouter)` y su
     API como `site.use('/api/clientes', crmApiRouter)`.
   - Reescribe en el frontend del módulo la base de las llamadas a `/api/clientes`
     y la ruta de los estáticos a `/clientes`.
   - Asegúrate de que los middlewares del módulo (express.json, cors, etc.) vivan
     SOLO dentro de su router y no afecten al resto del servidor.

C) Ruta aislada en SPA (Next/React/Vue, solo si NO quieres iframe y yo lo apruebo)
   - Crea una ruta `/clientes` que cargue el módulo encapsulando su CSS bajo un
     contenedor único (envuélvelo en `<div class="crm-scope">` y prefija cada
     selector de su CSS con `.crm-scope`, moviendo las variables de `:root` ahí).
   - Mantén su estado separado del de la app anfitriona. Si dudas, usa la A.

REGLAS DE AISLAMIENTO QUE DEBES CUMPLIR SIEMPRE
- Puerto del módulo distinto al del sitio y configurable por env.
- Nada de hardcodear `http://localhost:4000` en el sitio: usa una ruta relativa
  o una variable de entorno para la URL del módulo.
- No mezcles las claves de localStorage: las del módulo ya usan prefijo `crm_`.
- No autofill ni envío de formularios del sitio desde el módulo, ni al revés.

FASE DE EJECUCIÓN (en pasos pequeños, con verificación entre cada uno)
1. Crea una rama nueva (ej. `feat/modulo-clientes`). Trabaja solo ahí.
2. `npm install` DENTRO de `crm-redes/` (no en la raíz del sitio).
3. Levanta el módulo en su puerto y compruébalo solo: abre su `/` y su `/agencia`,
   haz login con las cuentas demo del README y verifica que carga.
4. Aplica la estrategia elegida y crea ÚNICAMENTE el punto de montaje `/clientes`.
5. Verifica que el sitio anterior sigue idéntico (ver criterios de aceptación).
6. Escribe `crm-redes/INTEGRACION.md` documentando lo hecho y el rollback.

VERIFICACIÓN OBLIGATORIA (no declares "terminado" sin esto)
- Corre el build / lint / tests del sitio si existen y confirma que pasan SIN
  cambios respecto al estado inicial. Si algo falla, REVIERTE y repórtame.
- Navega varias rutas del sitio anterior y confirma que se ven y funcionan igual.
- Abre `/clientes`: el portal del cliente debe cargar y funcionar (login con
  camila@laparrillaverde.co / cliente123: ver parrilla, aprobar, contactos,
  embudo, tareas, bandeja, reportes).
- Verifica que el panel de la agencia funciona y queda protegido del público.
- Confirma que NO hay estilos del módulo filtrándose al sitio ni viceversa.

CRITERIOS DE ACEPTACIÓN (entrégalos como checklist marcado)
[ ] El sitio anterior carga y funciona EXACTAMENTE igual que antes.
[ ] El build/tests del sitio pasan sin cambios.
[ ] `/clientes` muestra el portal y todas sus ventanas funcionan.
[ ] El panel de la agencia funciona y no es público sin protección.
[ ] No hay fuga de CSS/JS entre el sitio y el módulo.
[ ] Solo se tocaron archivos dentro de `crm-redes/` + el punto de montaje (lista
    exacta de archivos modificados incluida).
[ ] Todo es reversible: quitar el módulo y su punto de montaje deja el sitio
    idéntico al estado inicial.

ENTREGABLES
- La rama con los cambios (commits pequeños y descriptivos).
- `crm-redes/INTEGRACION.md` con: stack detectado, estrategia usada, lista exacta
  de archivos del sitio modificados, comando(s) para levantar el módulo y pasos
  de rollback.
- Un resumen final de máximo 6 líneas.

ERRORES COMUNES QUE DEBES EVITAR (chequéalos antes de entregar)
- "Arreglé" o actualicé dependencias del sitio → PROHIBIDO, revierte.
- Reusé el puerto del sitio para el módulo → usa uno distinto.
- El CSS del módulo pisó botones/tipografías del sitio → usa iframe o scope.
- La API del módulo chocó con la del sitio → prefijo propio o iframe.
- Hardcodeé localhost → usa ruta relativa o variable de entorno.
- Toqué muchos archivos del sitio → solo el punto de montaje; si no, pregunta.
- Declaré terminado sin correr el build/tests del sitio → siempre verifícalo.

ANTES DE EMPEZAR
Inspecciona el repo, dime el stack y la estrategia recomendada, lista los pocos
archivos que tocarías, y hazme las preguntas que necesites. No asumas nada.
```

---

## Para tener éxito a la primera, dale al agente este contexto extra
Si quieres reducir aún más el margen de error, pega también ESTO al inicio del
chat con Claude Code (sustituye lo que aplique):

- "Mi sitio está hecho con **____** (ej. WordPress, Next.js, HTML estático…)."
- "Se despliega en **____** (ej. Vercel, un VPS con Nginx, hosting compartido…)."
- "Quiero el portal accesible en la ruta **/clientes**."
- "Estos son los errores que cometiste antes: **____**" ← pégale los mensajes de
  error o lo que rompió; con eso evitará repetirlos.

Cuando me digas tu stack exacto, te reescribo este prompt apuntando a UNA sola
estrategia (sin las tres opciones) y con los comandos concretos de despliegue.
