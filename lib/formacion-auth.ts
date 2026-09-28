// Sesión firmada para /formacion-plus (HMAC-SHA256 vía Web Crypto).
// Usa Web Crypto (`crypto.subtle`) en vez de `node:crypto` a propósito: así el
// mismo código sirve tanto en middleware (runtime Edge, sin node:crypto) como
// en la API route de login (runtime Node). Nunca confiar en una cookie sin
// firmar — ver la nota en middleware.ts sobre el portal legado que sí lo hacía.
//
// FORMACION_AUTH_SECRET es obligatorio (sin fallback hardcodeado): un secreto
// embebido en el código queda en el historial de git para siempre y permite
// forjar sesiones sin conocer ninguna contraseña. Debe existir en .env.local
// (gitignored) y en las variables de entorno de Railway/Vercel en producción.

const MAX_SESSION_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 días

async function getHmacKey(): Promise<CryptoKey> {
  const secret = process.env.FORMACION_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      'FORMACION_AUTH_SECRET no está configurada. Defínela en .env.local (dev) o en las variables de entorno del hosting (producción) antes de usar /formacion-plus.'
    );
  }
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function signFormacionSession(username: string): Promise<string> {
  const payload = `${username}.${Date.now()}`;
  const key = await getHmacKey();
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return `${payload}.${toHex(sig)}`;
}

export async function verifyFormacionSession(
  token: string | undefined | null
): Promise<string | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [username, tsStr, sigHex] = parts;
  const ts = Number(tsStr);
  if (!username || !Number.isFinite(ts)) return null;
  if (Date.now() - ts > MAX_SESSION_AGE_MS) return null;

  const payload = `${username}.${tsStr}`;
  let key: CryptoKey;
  try {
    key = await getHmacKey();
  } catch {
    // Sin FORMACION_AUTH_SECRET configurada, ninguna sesión es válida — el
    // gate queda cerrado (redirige a login) en vez de tumbar el middleware.
    return null;
  }
  const enc = new TextEncoder();
  const expectedSig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const expectedHex = toHex(expectedSig);

  if (expectedHex.length !== sigHex.length) return null;

  // Comparación en tiempo constante para evitar timing attacks.
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    diff |= expectedHex.charCodeAt(i) ^ sigHex.charCodeAt(i);
  }
  if (diff !== 0) return null;

  return username;
}
