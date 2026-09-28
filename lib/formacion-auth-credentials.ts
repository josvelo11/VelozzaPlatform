// Verificación de usuario/contraseña para /formacion-plus.
// Solo se importa desde la API route de login (runtime Node) — nunca desde
// middleware.ts (runtime Edge), porque node:crypto no existe ahí.
//
// Las contraseñas NO se guardan en texto plano: cada usuario tiene un salt +
// hash generados con scrypt. Por ahora son usuarios fijos; si el catálogo de
// clientes con acceso crece, esto debería moverse a una tabla real (Supabase,
// igual que el resto de la plataforma) en vez de esta lista embebida.
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
  // Contrato n.º 015 — David Alejandro Martínez Blanco y Gina Paola Perilla Contreras, boda 12-dic-2026. Cuenta única de pareja.
  ginaydavid: {
    salt: 'a2cd8b4ce1eec7029adb69dee90ef20d',
    hash: '52382cd7ec998e57cdb2250a78863bdb52aca7fdba98936686528215829656c2a6f8db47296b17d85864dd417b2a68b31f1db3c4a0f824341105b98fd1028549',
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
