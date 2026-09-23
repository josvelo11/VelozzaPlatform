#!/usr/bin/env node
// gen-asesoria-imagen-l1.mjs — portada + Lección 1 (Diagnóstico) del curso
// asesoria-imagen. Protagonista NUEVO y distinto a retrato-personal y
// poses-camara (regla fija: cada curso, persona diferente).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');
const COVER_PATH = path.join(__dirname, '..', '..', 'public', 'formacion', 'asesoria-imagen.jpg');

// Protagonista de asesoria-imagen: mujer, distinta a la de retrato-personal
// y al hombre de poses-camara. Vestuario fijo para todo el curso.
export const M = 'una mujer latina de unos 31 años, cabello ondulado castaño oscuro a la altura de los hombros, piel trigueña clara, vistiendo un blazer estructurado color crema/beige sobre camiseta blanca de cuello redondo, aretes pequeños dorados discretos — vestuario fijo, no debe cambiar de prenda ni de color en ninguna imagen de este curso';

export const STYLE = `Fotografía de retrato editorial de altísimo nivel, comparable a una campaña de revista de negocios o a un book de marca personal premium. Esquema de iluminación de estudio de TRES PUNTOS explícito: luz principal (key light) en softbox octagonal grande a 45° sobre el eje de la cámara, produciendo un modelado tridimensional claro en el rostro con transición gradual y suave de luz a sombra; luz de relleno (fill light) tenue del lado opuesto; luz de contorno (rim/hair light) detrás del sujeto que dibuja un borde dorado sutil separándolo del fondo. Fondo de estudio color carbón (#1a1a1a) con leve viñeta, desenfocado a f/2.8, salvo que la escena pida un entorno específico. Cámara full-frame de alta gama, lente 85mm f/1.4. Piel con textura real y visible: poros, brillo natural en zonas T, sin suavizado plástico. Expresión facial genuina y matizada, NO mirada fija de maniquí, catchlights nítidos en los ojos. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cinematográfico cálido en luces / frío en sombras, contraste rico tipo Kodak Portra. Sin texto, sin logotipos, sin marcas de agua.`;

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;

const jobs = [
  {
    id: 'cover',
    outPath: COVER_PATH,
    prompt: SINGLE('de pie con seguridad y calidez, postura erguida, sonrisa genuina y cálida, mirando a cámara — imagen de portada del curso de asesoría de imagen personal', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-0',
    prompt: SINGLE('sentada frente a un laptop abierto en un escritorio de madera clara, revisando fotos propias en la pantalla con expresión analítica y crítica, evaluándose objetivamente', 'plano medio de cuerpo, cámara ligeramente lateral mostrando pantalla y rostro'),
  },
  {
    id: 'l1-1',
    prompt: SINGLE('de pie frente a un espejo de cuerpo entero en un vestidor con luz cálida, mirando su propio reflejo con expresión reflexiva y pensativa, evaluándose a sí misma con honestidad', 'plano de cuerpo entero incluyendo el espejo y su reflejo'),
  },
  {
    id: 'l1-2',
    prompt: SINGLE('de pie con postura erguida y segura, vestuario coordinado, expresión cálida y profesional, fondo limpio — la imagen de perfil ideal que el curso enseña a construir, cada elemento (postura, expresión, vestuario) leyéndose como una señal intencional', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-3',
    prompt: SINGLE('con una mano cerca de la barbilla en gesto pensativo, mirando directamente a cámara con expresión de estar considerando una pregunta importante sobre sí misma', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l1-4',
    prompt: SINGLE('mostrando la pantalla de su teléfono a una colega junto a ella (otra mujer, distinta, de unos 40 años, cabello corto, vestuario profesional neutro), ambas mirando la pantalla mientras la colega da una opinión genuina con expresión de análisis real, no un cumplido vacío', 'plano medio de dos personas, de la cintura hacia arriba'),
  },
  {
    id: 'l1-5',
    prompt: SINGLE('de pie en una sala de estar doméstica casual y desordenada de fondo, vistiendo su blazer formal — contraste visual notorio entre su vestuario profesional y el entorno casual detrás de ella, mostrando una contradicción de imagen', 'plano medio de cuerpo con el entorno doméstico visible al fondo'),
  },
  {
    id: 'l1-6',
    prompt: SINGLE('de pie con expresión de claridad y determinación serena, mirada enfocada, como quien ya identificó exactamente el único ajuste real que necesita hacer', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l1-7',
    prompt: SINGLE('sentada en un escritorio con una agenda física abierta frente a ella, marcando una fecha en el calendario con un lápiz, expresión concentrada y organizada', 'plano medio de cuerpo sentada en el escritorio'),
  },
];

async function generateOne(job, attempt = 1) {
  const body = {
    contents: [{ parts: [{ text: job.prompt }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'], imageConfig: { imageSize: '2K', aspectRatio: '4:3' } },
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  const data = await res.json();
  if (!res.ok) {
    if (attempt < 3 && (res.status === 429 || res.status >= 500)) {
      const wait = attempt * 8000;
      console.warn(`  reintentando en ${wait / 1000}s (status ${res.status})...`);
      await new Promise((r) => setTimeout(r, wait));
      return generateOne(job, attempt + 1);
    }
    throw new Error(`API error ${res.status}: ${data.error?.message || JSON.stringify(data).slice(0, 300)}`);
  }
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error('Respuesta sin imagen: ' + JSON.stringify(data).slice(0, 300));
  const bytes = Buffer.from(part.inlineData.data, 'base64');
  const outPath = job.outPath || path.join(OUT_DIR, `${job.id}.jpg`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, bytes);
  return { outPath, bytes: bytes.length };
}

async function main() {
  console.log(`Generando ${jobs.length} imágenes (portada + Lección 1) — asesoria-imagen\n`);
  let ok = 0;
  for (const job of jobs) {
    try {
      const r = await generateOne(job);
      ok++;
      console.log(`[${ok}/${jobs.length}] ${job.id} OK (${(r.bytes / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`[FALLÓ] ${job.id}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log(`\nListo: ${ok} generadas.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
