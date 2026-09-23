#!/usr/bin/env node
// gen-sesion-quinceanera-l5.mjs — Lección 5 (Fotos con tu corte de honor y tu familia, sin caos)
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

const jobs = [
  {
    id: 'l5-0',
    prompt: SINGLE('rodeada de su corte de honor formado por varias jóvenes damas con vestidos de gala en tonos pastel y chambelanes con trajes formales, todos parados en posiciones dispersas y desordenadas mientras el fotógrafo espera listo, ambiente de confusión leve antes de organizarse', 'plano general, escena grupal en salón de eventos'),
  },
  {
    id: 'l5-1',
    prompt: SINGLE('al centro de una formación grupal ordenada y simétrica, flanqueada por su corte de honor de damas y chambelanes distribuidos en igual número a cada lado ordenados de mayor a menor altura, todos con posturas elegantes y coordinadas', 'plano general, formación grupal simétrica'),
  },
  {
    id: 'l5-2',
    prompt: SINGLE('en una sesión familiar formal junto a sus padrinos y familiares cercanos, todos con atuendos elegantes que complementan sin igualar el tono esmeralda de su vestido, luz cálida de media tarde antes de que lleguen los invitados al evento', 'plano medio-general, escena familiar formal'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (corte de honor y familia) — sesion-quinceanera\n`);
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
