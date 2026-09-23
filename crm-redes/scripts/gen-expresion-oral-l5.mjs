#!/usr/bin/env node
// gen-expresion-oral-l5.mjs — Lección 5: "Respiración diafragmática y control vocal" (7 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './expresion-oral-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'expresion-oral');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, de la cintura hacia arriba') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste exactamente la misma ropa. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l5-0',
    prompt: SINGLE('hablando con presencia calmada y voz estable, postura anclada y respiración controlada como base invisible de su comunicación', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l5-1',
    prompt: DIPTYCH(
      'con los hombros ligeramente elevados en una respiración superficial de pecho, tensión visible',
      'con una mano suavemente sobre el abdomen, hombros relajados y caídos, respiración diafragmática profunda y calmada',
    ),
  },
  {
    id: 'l5-2',
    prompt: SINGLE('con los hombros ligeramente tensos y elevados por el estrés justo antes de hablar en público, respiración volviéndose superficial sin darse cuenta', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l5-3',
    prompt: DIPTYCH(
      'acostado con una mano sobre el estómago, sintiendo cómo sube suavemente con cada respiración',
      'de pie con una mano sobre el pecho, notando cómo el pecho sube en su lugar en vez del abdomen',
      'plano medio de cuerpo',
    ),
  },
  {
    id: 'l5-4',
    prompt: SINGLE('con los ojos cerrados en un momento de respiración consciente antes de hablar, una mano sobre el abdomen, expresión serena y centrada', 'primer plano de rostro y hombros, ojos cerrados'),
  },
  {
    id: 'l5-5',
    prompt: SINGLE('hablando con fluidez sostenida durante una frase larga, sin quedarse sin aire, control vocal total y presencia relajada', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l5-6',
    prompt: DIPTYCH(
      'levantando visiblemente los hombros y jadeando con fuerza justo antes de hablar, gesto notorio y distractor',
      'respirando en silencio y de forma casi imperceptible antes de hablar, calma total sin llamar la atención',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (respiración) — expresion-oral\n`);
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
