#!/usr/bin/env node
// gen-sesion-quinceanera-l3.mjs — Lección 3 (Posar con vestido de gala: manos y tela)
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

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía de quinceañera editorial elegante, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma joven, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l3-0',
    prompt: SINGLE('de pie con los brazos colgando pegados a los costados sobre la voluminosa falda de tul, sin ninguna línea que marque la cintura, silueta perdida contra el volumen del vestido', 'plano de cuerpo entero'),
  },
  {
    id: 'l3-1',
    prompt: DIPTYCH(
      'con los brazos colgando pegados a los costados, sin espacio entre el brazo y el cuerpo, cintura perdida contra el volumen de la falda',
      'con las manos apoyadas suavemente sobre los muslos y los codos separados del cuerpo, un espacio visible entre el brazo y la cintura que marca claramente la silueta',
      'plano de cuerpo entero',
    ),
  },
  {
    id: 'l3-2',
    prompt: DIPTYCH(
      'en pleno giro sobre su propio eje, sosteniendo capas de la falda con ambas manos, la tela de tul abriéndose en abanico alrededor de ella, cabello en movimiento',
      'sentada sobre un banquito bajo oculto por su propia falda, la tela cayendo en un círculo completo a su alrededor como una flor abierta en el piso',
      'plano de cuerpo entero',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (vestido de gala, manos y tela) — sesion-quinceanera\n`);
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
