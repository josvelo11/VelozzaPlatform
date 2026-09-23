#!/usr/bin/env node
// gen-dia-de-la-boda-l4.mjs — Lección 4: "Fotos familiares sin caos: shot list y método del embudo" (6 imágenes)
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
    id: 'l4-0',
    prompt: SINGLE(
      'de pie en el punto de fotos mientras un grupo de invitados se dispersa en distintas direcciones a su alrededor, expresión de ligera confusión mientras esperan a que alguien reúna a la familia de nuevo',
      'plano general, escena de grupo disperso alrededor de la pareja',
    ),
  },
  {
    id: 'l4-1',
    prompt: SINGLE(
      'esperando pacientemente junto a varios pequeños grupos familiares organizados en fila, cada uno esperando su turno para la foto, ambiente ordenado y tranquilo',
      'plano general, fila de grupos familiares esperando su turno',
    ),
  },
  {
    id: 'l4-2',
    prompt: SINGLE(
      'de pie solos al centro mientras progresivamente se suman más familiares a su alrededor formando un grupo cada vez más grande, capturando el momento en que la familia numerosa completa ya está reunida para la foto grupal final',
      'plano general, familia numerosa reunida para la foto grupal',
    ),
  },
  {
    id: 'l4-3',
    prompt: SINGLE(
      'entregando una hoja con una lista de nombres de familiares a su fotógrafo (solo se ve su mano y cámara en el borde) durante una reunión de planificación semanas antes de la boda, sentados en una mesa de café',
      'plano medio, entregando lista de nombres al fotógrafo',
    ),
  },
  {
    id: 'l4-4',
    prompt: SINGLE(
      'de pie junto a un familiar que gesticula pidiendo al grupo que se quede en su lugar para la foto, mientras otros invitados se alejan de fondo hacia una zona de cóctel',
      'plano general, anuncio para mantener al grupo familiar reunido',
    ),
  },
  {
    id: 'l4-5',
    prompt: SINGLE(
      'revisando junto al fotógrafo (solo se ve su mano sosteniendo una hoja) la lista final de fotos familiares completamente tachada, sensación de alivio y organización lograda',
      'plano medio, revisando lista de fotos familiares completada',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (fotos familiares sin caos) — dia-de-la-boda\n`);
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
