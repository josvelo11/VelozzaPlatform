#!/usr/bin/env node
// gen-sesion-boudoir-l2.mjs — Lección 2: "Mentón y mirada" (5 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './sesion-boudoir-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'sesion-boudoir');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía boudoir editorial elegante, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'primer plano de rostro y hombros, perfil de tres cuartos') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l2-0',
    prompt: SINGLE('de perfil con el mentón nivelado y paralelo al suelo, una sombra suave y difusa visible bajo la mandíbula por la posición neutral', 'primer plano de rostro de perfil'),
  },
  {
    id: 'l2-1',
    prompt: DIPTYCH(
      'de perfil con el mentón nivelado, sombra suave bajo la mandíbula, línea de la mandíbula poco definida',
      'de perfil con el mentón llevado ligeramente hacia adelante y abajo, línea nítida y definida separando la mandíbula del cuello',
    ),
  },
  {
    id: 'l2-2',
    prompt: DIPTYCH(
      'con la mirada directa y segura hacia el lente de la cámara, expresión de confianza',
      'con la mirada dirigida hacia abajo y a un lado, expresión suave e introspectiva',
      'primer plano de rostro',
    ),
  },
  {
    id: 'l2-3',
    prompt: DIPTYCH(
      'con una sonrisa amplia sostenida por mucho tiempo, pequeñas líneas de tensión visibles alrededor de los ojos',
      'con los labios apenas entreabiertos en una semi-sonrisa relajada, ojos suaves sin tensión, expresión sin esfuerzo',
      'primer plano de rostro',
    ),
  },
  {
    id: 'l2-4',
    prompt: SINGLE('practicando la posición del mentón frente a un espejo en su habitación, ajustando conscientemente el ángulo antes del día de la sesión real', 'plano medio de cuerpo frente al espejo'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (mentón y mirada) — sesion-boudoir\n`);
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
