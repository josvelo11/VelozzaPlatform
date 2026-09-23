#!/usr/bin/env node
// gen-sesion-quinceanera-l1.mjs — portada + Lección 1 (Perder el miedo a la cámara)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './sesion-quinceanera-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'sesion-quinceanera');
const COVER_PATH = path.join(__dirname, '..', '..', 'public', 'formacion', 'sesion-quinceanera.jpg');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía de quinceañera editorial elegante, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma joven, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'cover',
    outPath: COVER_PATH,
    prompt: SINGLE('de pie en un jardín de finca de eventos al atardecer, sonrisa genuina y radiante, postura relajada y segura — imagen de portada del curso de preparación para sesión de quinceañera', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-0',
    prompt: SINGLE('de pie sin saber qué hacer con las manos, hombros ligeramente subidos por la tensión, mirada algo congelada hacia la cámara, un momento antes de recibir cualquier indicación del fotógrafo', 'plano medio de cuerpo'),
  },
  {
    id: 'l1-1',
    prompt: DIPTYCH(
      'sosteniendo una pose de pie completamente estática y forzada, sonrisa visiblemente sostenida y artificial',
      'caminando y girando con soltura, la falda de tul en pleno movimiento formando ondas, sonrisa genuina y espontánea surgiendo del movimiento',
      'plano de cuerpo entero',
    ),
  },
  {
    id: 'l1-2',
    prompt: SINGLE('con ambas manos tocando suavemente su tiara, codos relajados hacia afuera, mirada dirigida hacia un lado justo antes de subirla hacia el lente, expresión tranquila y con una tarea concreta para las manos', 'plano medio de cuerpo, cintura hacia arriba'),
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
  console.log(`Generando ${jobs.length} imágenes (portada + Lección 1) — sesion-quinceanera\n`);
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
