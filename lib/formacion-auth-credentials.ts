// Verificación de usuario/contraseña para /formacion-plus.
// Solo se importa desde la API route de login (runtime Node) — nunca desde
// middleware.ts (runtime Edge), porque node:crypto no existe ahí.
//
// Las contraseñas NO se guardan en texto plano: cada usuario tiene un salt +
// hash generados con scrypt. Convención de contraseña para clientes de boda:
// su propia cédula (sin puntos) — así lo pidió David, fácil de recordar y de
// entregar en el PDF de bienvenida. Si el catálogo de clientes con acceso
// crece, esto debería moverse a una tabla real (Supabase, igual que el resto
// de la plataforma) en vez de esta lista embebida.
import crypto from 'node:crypto';

const FORMACION_USERS: Record<string, { salt: string; hash: string }> = {
  velozzaadmin: {
    salt: '15eb049045bf5e27a09c550a7a4f7467',
    hash: '39db878c7dd39e3d6363a5bec5c2c9154507fc2202d80452251aaef4e973ed12a3a157e27df7458379379ae8ae70fd5f9cc9cb8e507abad58862f63050cc556d',
  },
  dalia: {
    salt: '6db753673bd0ac89f7a6a47be65bf528',
    hash: '3282866a9e161dc255ad1890525879f2536dcad639ee1b4e849691feb34ed0989088008d98edaefca36355a3041d4f288143aff482596380f464bc00ed9c9259',
  },
  // Contrato n.º 015 — David Alejandro Martínez Blanco y Gina Paola Perilla Contreras, boda 12-dic-2026.
  martinez: {
    salt: '451a80c3edf9afc94246401fc6c1cb3d',
    hash: '2787bb2be05ced71e345478deff658ffafb55c31ecbd8ccc9a013332dbc51734d5861468efc7c029e0878f9a503b46506c580bfc80ea7870456066ca003fe4e2',
  },
  perilla: {
    salt: '14efd6bed626afb9b56296c7cb768e0f',
    hash: '6422521eb9d3ca7633dc43e9703a7b354102795e35fc2424e4bc44927e74ff3526bda19a87f31f3b7f3cd414f9536440dbb186c685e8e2cb993ff3a903bdc509',
  },
};

export function verifyFormacionCredentials(username: string, password: string): boolean {
  const key = username.trim().toLowerCase();
  const user = FORMACION_USERS[key];
  if (!user) return false;

  const derived = crypto.scryptSync(password, user.salt, 64);
  const expected = Buffer.from(user.hash, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}
