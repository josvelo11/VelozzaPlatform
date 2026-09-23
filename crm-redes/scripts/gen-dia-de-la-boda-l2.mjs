#!/usr/bin/env node
// gen-dia-de-la-boda-l2.mjs — Lección 2: "First look y hora dorada" (6 imágenes)
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

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía documental de bodas editorial, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma pareja, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l2-0',
    prompt: DIPTYCH(
      'compartiendo un momento privado e íntimo antes de la ceremonia, él dándole la espalda a la cámara esperando a que ella lo toque en el hombro, sin nadie más alrededor',
      'reencontrándose formalmente frente al arco floral de la ceremonia, invitados visibles de fondo sentados, momento más público y solemne',
      'plano medio, escena de reencuentro',
    ),
  },
  {
    id: 'l2-1',
    prompt: DIPTYCH(
      'el first look privado con lágrimas genuinas de emoción, expresión de asombro real al verse por primera vez ese día',
      'ese mismo tipo de emoción genuina repetida en el altar, lágrimas y sonrisa igual de reales frente a los invitados',
      'primer plano, rostro emocionado',
    ),
  },
  {
    id: 'l2-2',
    prompt: SINGLE(
      'caminando con paso ligero y elegante hacia el jardín, urgencia serena por captar la luz dorada que se desvanece rápidamente en el horizonte',
      'plano medio, cuerpo entero, caminando hacia la luz dorada',
    ),
  },
  {
    id: 'l2-3',
    prompt: DIPTYCH(
      'en un retrato formal bajo luz de mediodía plana y neutra en el jardín de la ceremonia, colores más fríos y menos favorecedores',
      'en el mismo tipo de retrato formal pero bajo la luz cálida y dorada del atardecer, piel y vestuario mucho más favorecidos',
      'plano medio, retrato de pareja en el jardín',
    ),
  },
  {
    id: 'l2-4',
    prompt: SINGLE(
      'consultando juntos la hora de la puesta de sol en un teléfono y anotándola en el cronograma impreso de la boda, planificando el bloque de fotos',
      'plano medio, consultando el horario de atardecer',
    ),
  },
  {
    id: 'l2-5',
    prompt: SINGLE(
      'revisando juntos el cronograma final de la boda con el bloque de la hora dorada resaltado en marcador, sonriendo confiados y tranquilos',
      'plano medio, revisando cronograma con bloque resaltado',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (first look y hora dorada) — dia-de-la-boda\n`);
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
