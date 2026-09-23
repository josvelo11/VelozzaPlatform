#!/usr/bin/env node
// gen-sesion-pareja-l5.mjs — Lección 5: "El movimiento gana" (3 imágenes, última lección del curso)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COUPLE, STYLE } from './sesion-pareja-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'sesion-pareja');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista de sesión de pareja, formato horizontal 4:3, ${shot}. ${COUPLE}, ${scene}. ${STYLE}`;

const jobs = [
  {
    id: 'l5-0',
    prompt: SINGLE('abrazados manteniendo una pose perfectamente quieta durante mucho tiempo, pequeñas marcas de tensión acumulándose en los hombros y las sonrisas empezando a verse forzadas', 'plano medio de cuerpo, ambos en el encuadre'),
  },
  {
    id: 'l5-1',
    prompt: SINGLE('en pleno giro espontáneo, ella con el vestido y el cabello en movimiento con un ligero desenfoque de movimiento, ambos riendo genuinamente en una microexpresión que solo aparece durante el movimiento real', 'plano de cuerpo entero, movimiento y ligero desenfoque'),
  },
  {
    id: 'l5-2',
    prompt: SINGLE('en un abrazo con todo el peso del cuerpo, ella siendo levantada levemente o girando junto a él, alegría genuina y total conexión física — imagen de cierre del curso completo de sesión de pareja', 'plano de cuerpo entero en movimiento, alegría genuina'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (movimiento) — sesion-pareja\n`);
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
