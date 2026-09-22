#!/usr/bin/env node
// gen-poses-camara-l4.mjs — Lección 4: Expresión facial natural (9 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'poses-camara');

const M = 'un hombre latino de unos 42 años, cabello corto oscuro con canas visibles en las sienes, barba corta y arreglada, piel trigueña, vistiendo SIEMPRE una camiseta negra de cuello redondo manga corta y pantalón oscuro — vestuario fijo, no debe cambiar de prenda ni de color';

const STYLE = `Fotografía de retrato editorial de altísimo nivel, comparable a una campaña de revista GQ o a un book corporativo ejecutivo premium. Esquema de iluminación de estudio de TRES PUNTOS explícito: luz principal (key light) en softbox octagonal grande a 45° sobre el eje de la cámara, produciendo un modelado tridimensional claro en el rostro con transición gradual y suave de luz a sombra (no plana, no frontal); luz de relleno (fill light) tenue del lado opuesto; luz de contorno (rim/hair light) detrás del sujeto que dibuja un borde dorado sutil separándolo del fondo. Fondo de estudio color carbón (#1a1a1a) con leve viñeta, desenfocado a f/2.8. Cámara full-frame de alta gama, lente 85mm f/1.4. Piel con textura real y visible: poros, brillo natural en zonas T, vello facial individual, sin suavizado plástico. Expresión facial genuina y matizada, NO mirada fija de maniquí, catchlights nítidos en los ojos. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cinematográfico cálido en luces / frío en sombras, contraste rico tipo Kodak Portra. Sin texto, sin logotipos, sin marcas de agua.`;

const DIPTYCH = (left, right) => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, primer plano de rostro y hombros en ambos paneles, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste la misma camiseta negra. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const SINGLE = (scene, shot = 'primer plano de rostro y hombros') => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;

const jobs = [
  {
    id: 'l4-0',
    prompt: SINGLE('con una sonrisa genuina y relajada, ojos ligeramente entrecerrados con arrugas naturales de expresión en las comisuras, la sonrisa se ve auténtica y fresca, no forzada ni sostenida por mucho tiempo', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l4-1',
    prompt: SINGLE('sonriendo de forma espontánea justo en el instante de una carcajada breve, cabeza ligeramente inclinada, expresión de alegría genuina y viva como capturada en el momento exacto de una anécdota real', 'primer plano de rostro, plano medio de cuerpo'),
  },
  {
    id: 'l4-2',
    prompt: DIPTYCH(
      'con una sonrisa genuina donde se nota la activación de los músculos alrededor de los ojos — arrugas de expresión visibles en las comisuras de los ojos (patas de gallo suaves), mejillas elevadas',
      'con una sonrisa forzada solo con la boca, dientes visibles pero los ojos permanecen fríos y sin arrugas de expresión, mirada que no acompaña la sonrisa',
    ),
  },
  {
    id: 'l4-3',
    prompt: SINGLE('con un squinch — los párpados inferiores ligeramente entrecerrados y tensos de forma sutil, mirada segura y penetrante hacia la cámara, en vez de los ojos completamente abiertos con blanco visible arriba y abajo del iris', 'primer plano cerrado solo en ojos y parte superior del rostro'),
  },
  {
    id: 'l4-4',
    prompt: SINGLE('con una sonrisa genuina y relajada generada por recordar una anécdota real, labios sueltos y naturales, sin la forma articulada y forzada de estar pronunciando una palabra como "whisky"', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l4-5',
    prompt: SINGLE('con la mirada viva, ojos con enfoque e intención real dirigidos directamente a la cámara con energía, como en el instante preciso de un disparo fotográfico — no una mirada perdida o vacía', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l4-6',
    prompt: SINGLE('con expresión neutral pero relajada, labios sueltos sin tensión, mirada suave y segura — un gesto de autoridad calmada, ni sonriente ni serio y tenso', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l4-7',
    prompt: SINGLE('a medio gesto moviendo la mandíbula ligeramente de lado a exhalando visiblemente, en un momento candid de descanso entre tomas de una sesión de fotos, relajando el rostro', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l4-8',
    prompt: SINGLE('con una sonrisa genuina y natural sostenida con comodidad, expresión relajada que se ve fácil de mantener por más tiempo sin forzar el gesto, como frente a una cámara de video', 'primer plano de rostro y hombros'),
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
  const outPath = path.join(OUT_DIR, `${job.id}.jpg`);
  fs.writeFileSync(outPath, bytes);
  return { outPath, bytes: bytes.length };
}

async function main() {
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (expresión facial) — poses-camara\n`);
  let ok = 0;
  for (const job of jobs) {
    const outPath = path.join(OUT_DIR, `${job.id}.jpg`);
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
