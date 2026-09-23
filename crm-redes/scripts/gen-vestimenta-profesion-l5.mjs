#!/usr/bin/env node
// gen-vestimenta-profesion-l5.mjs — Lección 5: "Accesorios y detalles" (6 imágenes, última lección del curso)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './vestimenta-profesion-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'vestimenta-profesion');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;

const jobs = [
  {
    id: 'l5-0',
    prompt: SINGLE('con las manos cruzadas suavemente frente al cuerpo mostrando un reloj delicado en la muñeca, la atención natural del espectador convergiendo entre las manos, la muñeca y el rostro', 'primer plano de manos, muñeca y rostro parcial'),
  },
  {
    id: 'l5-1',
    prompt: SINGLE('vistiendo un reloj analógico clásico y sosteniendo unos lentes de armazón sobrio en una mano, objetos que comunican un código de autoridad aprendido, no de valor monetario', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l5-2',
    prompt: SINGLE('con demasiados accesorios superpuestos — reloj grande, pulsera, collar llamativo y aretes grandes todos a la vez — look visualmente disperso que resta atención en vez de sumar', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l5-3',
    prompt: SINGLE('con un reloj metálico en la muñeca reflejando un destello de luz de estudio bajo un aro de luz, distrayendo levemente de su rostro desenfocado de fondo', 'primer plano de muñeca y reloj con destello de luz, rostro desenfocado al fondo'),
  },
  {
    id: 'l5-4',
    prompt: SINGLE('sosteniendo una pequeña bandeja con exactamente tres accesorios cuidadosamente elegidos — un reloj, unos aretes discretos y una pluma elegante — su kit fijo de accesorios de marca', 'plano medio de cuerpo con la bandeja de accesorios en mano'),
  },
  {
    id: 'l5-5',
    prompt: SINGLE('frente a un espejo tapando con la mano uno de sus accesorios para comparar cómo se ve su imagen con y sin esa pieza, expresión de verificación cuidadosa — imagen de cierre del curso completo de vestimenta profesional', 'plano medio de cuerpo frente al espejo'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (accesorios) — vestimenta-profesion\n`);
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
