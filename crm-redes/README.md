# CRM de Gestión de Redes — Pauta Studio

Sistema con **dos módulos hiperconectados** que comparten una misma base de datos:

- **Portal del cliente** (`/`) — registro, conexión de redes, parrilla, calendario, aprobaciones, mensajes y plan.
- **Panel de la agencia** (`/agencia`) — tu equipo gestiona a todos los clientes: crea contenido, chatea y ve el plan en vivo.

Lo que uno escribe, el otro lo ve. Si la agencia crea una pieza, aparece en la parrilla del cliente como *pendiente*; cuando el cliente la aprueba, el plan se actualiza solo y la agencia lo ve.

---

## Requisitos
- **Node.js 18 o superior** (recomendado 20+). Descárgalo en https://nodejs.org

## Cómo arrancar (3 pasos)

1. Abre la carpeta `crm-redes` en VS Code.
2. Abre la terminal integrada (menú **Terminal → New Terminal**) y ejecuta:

   ```bash
   npm install
   ```

3. Inicia el servidor:

   ```bash
   npm start
   ```

Verás en la terminal las direcciones. Abre en tu navegador:

- Portal del cliente → **http://localhost:4000/**
- Panel de la agencia → **http://localhost:4000/agencia**

> Tip: usa `npm run dev` para que el servidor se reinicie solo al editar archivos.

## Cuentas de prueba
| Módulo   | Correo                          | Contraseña   |
|----------|---------------------------------|--------------|
| Cliente  | `camila@laparrillaverde.co`     | `cliente123` |
| Agencia  | `equipo@pautastudio.co`         | `agencia123` |

También puedes **registrar un cliente nuevo** desde el portal (botón "Regístrate").

## Pruébalo (el flujo completo)
1. Entra al **panel de la agencia**, elige el cliente y crea una **Nueva publicación**.
2. Entra al **portal del cliente** (en otra pestaña): la pieza ya está en su **Parrilla** y en **Aprobaciones**.
3. Apruébala. Mira cómo sube el contador en **Mi plan**.
4. Vuelve a la agencia: el estado cambió a *Aprobada* y el plan refleja el uso. Escríbele por **Mensajes** y responde desde el cliente.

(Las pantallas se refrescan solas cada ~6 segundos.)

---

## Estructura del proyecto
```
crm-redes/
├── server.js        → API REST + autenticación + sirve los portales
├── db.js            → "base de datos" (archivo JSON) y helpers
├── package.json
├── .env.example     → cópialo como .env y cambia el secreto
├── data/            → se crea solo; aquí vive db.json (los datos)
└── public/
    ├── index.html   → Portal del cliente (React)
    ├── agency.html  → Panel de la agencia (React)
    └── styles.css   → estilos compartidos
```

## Integrarlo a tu sitio
- El backend ya expone una **API REST** en `/api/*`. Tu web puede consumirla con el token JWT que devuelve `/api/auth/login`.
- Para incrustar el portal, súbelo a tu hosting de Node (Render, Railway, un VPS) y apunta tu dominio al puerto del servidor.
- Cuando quieras dejar de usar el archivo JSON y pasar a **PostgreSQL/MySQL**, solo reescribe las funciones de `db.js`. Las rutas y los portales no cambian.

## Seguridad (antes de producción)
- Copia `.env.example` como `.env` y pon un `JWT_SECRET` largo y propio.
- Sirve todo por **HTTPS**.
- El archivo `data/db.json` guarda las contraseñas **cifradas** (bcrypt), pero no lo subas a un repositorio público.

## El siguiente paso (Opción B)
Esto es la **Opción A**: datos reales compartidos, publicación manual del equipo. Cuando quieras que al aprobar se **publique solo** en cada red, se conecta este mismo backend a las APIs oficiales (Meta, TikTok, YouTube, LinkedIn, X), cada una con su registro de app de desarrollador.

---

## Novedad: módulo CRM completo (estilo Mailchimp + Clientify)
El portal del cliente ahora incluye, además de lo anterior:

- **Reportes / Analítica** — gráficas de crecimiento de seguidores, alcance por
  red, estado del contenido y KPIs (engagement, apertura de email, audiencia).
- **Contactos / Audiencia** — CRM con búsqueda, etiquetas, estados (lead,
  oportunidad, cliente, inactivo), origen y notas. Crear, editar y eliminar.
- **Embudo de ventas (kanban)** — oportunidades por etapa (Nuevo → Contactado →
  Propuesta → Negociación → Ganado), con valor en COP y total por columna.
- **Tareas / Agenda** — pendientes con prioridad, vencimiento y vínculo a un
  contacto; marca como hecha y avisa de vencidas.
- **Campañas** — campañas de email/redes estilo Mailchimp con tasa de apertura
  y clics.

Todo comparte la misma base de datos y API, así que el panel de la agencia puede
crecer para gestionar también estos datos cuando quieras.

### Y ahora también (segunda ampliación)
- **Automatizaciones / Workflows** (estilo Mailchimp Journeys y Clientify) —
  flujos del tipo "Cuando pasa X → haz Y": bienvenida a nuevos contactos,
  reactivación de inactivos, seguimiento de propuestas, agradecimiento por
  compra y auto-respuesta de DMs. Cada flujo se activa/pausa con un switch y
  muestra cuántos contactos lleva inscritos y completados.
- **Bandeja de entrada omnicanal** (estilo Clientify Inbox) — todas las
  conversaciones de tus clientes (Instagram, Facebook, WhatsApp, email) en un
  solo lugar, con lista + hilo, contador de no leídos, respuesta rápida y
  abrir/cerrar conversación.

Con esto el portal del cliente cubre las mismas grandes ventanas de gestión que
Mailchimp y Clientify: Reportes, Contactos, Embudo, Tareas, Campañas,
Automatizaciones y Bandeja de entrada — además de lo propio de la agencia
(redes, parrilla, aprobaciones, plan y chat con el equipo).

### Panel de la agencia: ahora con CRM completo
El panel de la agencia (`/agencia`) ya no solo gestiona la parrilla y el chat:
al seleccionar un cliente, el equipo ve y administra **todo su CRM** con las
mismas ventanas del portal, pero scoped a ese cliente:
Reportes, Contactos, Embudo, Tareas, Campañas, Automatizaciones y Bandeja de
entrada — además de Parrilla, Chat y Plan. Usa los mismos endpoints enviando
`clientId`, así que cliente y agencia ven los mismos datos en vivo.
