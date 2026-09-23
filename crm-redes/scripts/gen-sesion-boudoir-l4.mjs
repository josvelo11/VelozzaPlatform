#!/usr/bin/env node
// gen-sesion-boudoir-l4.mjs — Lección 4: "Piel y cuerpo: el cronograma real antes de tu sesión" (7 imágenes)
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
    id: 'l4-0',
    prompt: SINGLE(
      'sentada frente a un tocador la noche anterior a su sesión, rodeada de demasiados productos de skincare abiertos y desordenados a la vez, expresión levemente estresada y agobiada',
      'plano medio, escena de tocador',
    ),
  },
  {
    id: 'l4-1',
    prompt: SINGLE(
      'aplicándose loción corporal con calma en las piernas frente a una ventana con luz natural suave, rutina tranquila y constante, semanas antes de la sesión',
      'plano medio, aplicando loción, luz de ventana',
    ),
  },
  {
    id: 'l4-2',
    prompt: DIPTYCH(
      'exfoliándose suavemente el cuerpo en la ducha con luz de baño calmada, dos a tres días antes de la sesión, gesto relajado',
      'mirándose al espejo la mañana de la sesión con la piel del hombro ligeramente enrojecida y con manchas irregulares por haber exfoliado la noche anterior',
      'plano medio, escena de baño',
    ),
  },
  {
    id: 'l4-3',
    prompt: SINGLE(
      'sentada al borde de la cama la noche anterior a la sesión, aplicándose crema corporal espesa en las piernas antes de dormir, luz cálida de lámpara de noche, ambiente tranquilo',
      'plano medio, escena de dormitorio nocturna',
    ),
  },
  {
    id: 'l4-4',
    prompt: DIPTYCH(
      'con un aceite corporal ligero aplicado con moderación en el hombro y la clavícula, generando un brillo controlado y favorecedor bajo la luz de estudio',
      'con exceso de aceite corporal aplicado en el hombro y la clavícula, brillo descontrolado y zonas de luz quemadas sin detalle en la piel',
      'primer plano de hombro y clavícula',
    ),
  },
  {
    id: 'l4-5',
    prompt: SINGLE(
      'de pie frente a la repisa de su baño, sosteniendo su crema facial habitual de siempre, mirando de reojo un frasco nuevo sin abrir a un lado que decide no usar',
      'plano medio, escena de baño con repisa de productos',
    ),
  },
  {
    id: 'l4-6',
    prompt: SINGLE(
      'depilándose las piernas con calma en la ducha con luz suave de baño, dos a tres días antes de la sesión, sin prisa',
      'plano medio, escena de baño',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (piel y cuerpo: cronograma) — sesion-boudoir\n`);
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
