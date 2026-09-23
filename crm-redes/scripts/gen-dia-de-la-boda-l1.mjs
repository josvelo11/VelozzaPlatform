#!/usr/bin/env node
// gen-dia-de-la-boda-l1.mjs — Lección 1: "El cronograma con colchón" (5 imágenes + portada)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './dia-de-la-boda-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'dia-de-la-boda');
const COVER_OUT = path.join(__dirname, '..', '..', 'public', 'formacion', 'dia-de-la-boda.jpg');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía documental de bodas editorial, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma pareja, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'cover',
    outPath: COVER_OUT,
    prompt: SINGLE(
      'caminando tomados de la mano bajo un arco floral en el jardín de la ceremonia, luz dorada de atardecer, felicidad genuina, el vestido de novia y el velo moviéndose suavemente con el viento',
      'plano medio, cuerpo entero, caminando juntos',
    ),
  },
  {
    id: 'l1-0',
    prompt: SINGLE(
      'la novia sentada en la silla de maquillaje mirando el reloj de pared con expresión preocupada, mientras la maquilladora trabaja con rapidez, sensación de que el tiempo se acorta',
      'plano medio, escena de preparación',
    ),
  },
  {
    id: 'l1-1',
    prompt: SINGLE(
      'la pareja en pleno atardecer dorado en un jardín, el fotógrafo (solo se ve su mano y cámara en el borde del encuadre) capturando el momento justo cuando el sol está bajo en el horizonte, urgencia silenciosa por aprovechar la luz que se desvanece',
      'plano medio, pareja en exterior con luz dorada intensa',
    ),
  },
  {
    id: 'l1-2',
    prompt: DIPTYCH(
      'revisando el cronograma oficial impreso, elegante y simple, extendido sobre una mesa de la recepción',
      'el mismo cronograma pero ahora con anotaciones a mano y bloques de tiempo extra marcados, mostrado por el fotógrafo señalando los márgenes añadidos',
      'plano medio, mesa con documentos',
    ),
  },
  {
    id: 'l1-3',
    prompt: SINGLE(
      'sentada en una mesa de café en casa, revisando y armando su cronograma de boda juntos con un calendario abierto y notas escritas a mano, una semana antes del evento',
      'plano medio, escena de planificación en casa',
    ),
  },
  {
    id: 'l1-4',
    prompt: SINGLE(
      'cerrando juntos su cuaderno de planificación de la boda con una sonrisa de alivio, una lista de tareas visiblemente marcada y completada sobre la mesa, sensación de estar lista para el gran día',
      'plano medio, cerrando el cuaderno de planificación',
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
  const outPath = job.outPath || path.join(OUT_DIR, `${job.id}.jpg`);
  fs.writeFileSync(outPath, bytes);
  return { outPath, bytes: bytes.length };
}

async function main() {
  console.log(`Generando ${jobs.length} imágenes de la Lección 1 (cronograma con colchón) — dia-de-la-boda\n`);
  let ok = 0;
  for (const job of jobs) {
    const outPath = job.outPath || path.join(OUT_DIR, `${job.id}.jpg`);
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
