#!/usr/bin/env node
// gen-hablar-camara-l4.mjs — Lección 4: "Qué hacer con las manos y el cuerpo" (8 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './hablar-camara-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'hablar-camara');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano de cuerpo entero con zapatos visibles') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste exactamente la misma ropa. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l4-0',
    prompt: DIPTYCH(
      'de pie congelado con los brazos completamente pegados al cuerpo, postura rígida, luciendo incómodo frente a cámara',
      'de pie con un ligero cambio de peso natural entre ambos pies, postura abierta y relajada, luciendo cómodo y presente',
    ),
  },
  {
    id: 'l4-1',
    prompt: SINGLE('a media frase gesticulando naturalmente con ambas manos abiertas mientras habla con energía, como si le estuviera explicando algo interesante a un amigo sentado frente a él', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l4-2',
    prompt: DIPTYCH(
      'con los brazos cruzados sobre el pecho, postura cerrada y defensiva que distrae de su mensaje',
      'con los brazos abiertos y relajados a los costados, postura abierta y receptiva',
      'plano medio de cuerpo',
    ),
  },
  {
    id: 'l4-3',
    prompt: DIPTYCH(
      'de pie completamente inmóvil y rígido como una estatua, tensión visible en todo el cuerpo',
      'de pie con una leve inclinación natural del cuerpo y el peso desplazado hacia un lado, soltura genuina',
      'plano de cuerpo entero con zapatos visibles',
    ),
  },
  {
    id: 'l4-4',
    prompt: SINGLE('en el instante exacto de un gesto de mano que surge naturalmente sincronizado con la palabra que está diciendo, gesto genuino y espontáneo, no ensayado', 'plano medio de cuerpo, gesto de mano en pleno movimiento'),
  },
  {
    id: 'l4-5',
    prompt: DIPTYCH(
      'de pie con el peso distribuido de forma natural entre ambos pies, a media transición de un leve paso, postura orgánica',
      'de pie en posición rígida de firmes militar, talones juntos, tensión excesiva',
      'plano de cuerpo entero con zapatos visibles',
    ),
  },
  {
    id: 'l4-6',
    prompt: DIPTYCH(
      'sentado en el borde de una silla, inclinado levemente hacia adelante hacia la cámara, energía alta y comprometida',
      'sentado hundido hacia atrás en el respaldo de la silla, postura de baja energía',
      'plano medio de cuerpo sentado',
    ),
  },
  {
    id: 'l4-7',
    prompt: DIPTYCH(
      'con gestos controlados y ensayados, postura ligeramente rígida y consciente de sí misma',
      'gesticulando de forma relajada y natural, como hablándole a un amigo cercano, sin autoconciencia',
      'plano medio de cuerpo',
    ),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (manos y cuerpo) — hablar-camara\n`);
  let ok = 0;
  for (const job of jobs) {
    const outPath = path.join(OUT_DIR, `${job.id}.jpg`);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 500000) { console.log(`[skip] ${job.id} ya existe`); continue; }
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
