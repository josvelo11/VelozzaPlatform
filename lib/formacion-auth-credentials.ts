// Verificación de usuario/contraseña para /formacion-plus.
// Solo se importa desde la API route de login (runtime Node) — nunca desde
// middleware.ts (runtime Edge), porque node:crypto no existe ahí.
//
// Las contraseñas NO se guardan en texto plano: cada usuario tiene un salt +
// hash generados con scrypt. Por ahora son 2 usuarios fijos (acceso de
// agencia + la clienta Dalia); si el catálogo de clientes con acceso crece,
// esto debería moverse a una tabla real (Supabase, igual que el resto de la
// plataforma) en vez de esta lista embebida.
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
