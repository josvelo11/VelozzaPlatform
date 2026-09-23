#!/usr/bin/env node
// gen-expresion-oral-l6.mjs — Lección 6: "Estructura retórica: ethos, pathos y logos" (7 imágenes, última lección del curso)
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
    id: 'l6-0',
    prompt: SINGLE('de pie con presencia equilibrada y completa, comunicando con credibilidad, lógica y calidez emocional al mismo tiempo — el orador que domina los tres pilares clásicos de la persuasión', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l6-1',
    prompt: SINGLE('con expresión de credibilidad genuina y calidez, mirada firme y honesta que transmite competencia y buena voluntad antes de decir una sola palabra', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l6-2',
    prompt: SINGLE('con gesto de mano apilando pasos lógicos en el aire, uno sobre otro, construyendo un argumento estructurado paso a paso', 'plano medio de cuerpo, gesto de apilar'),
  },
  {
    id: 'l6-3',
    prompt: SINGLE('con una mano suavemente sobre el pecho, expresión genuinamente conmovida y cercana, conectando emocionalmente de forma auténtica, no manipuladora', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l6-4',
    prompt: SINGLE('con la cabeza ligeramente inclinada, expresión analítica y atenta, escuchando retroalimentación de una audiencia para diagnosticar qué elemento de su discurso le falta', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l6-5',
    prompt: SINGLE('en plena entrega de una presentación corta y completa, energía dinámica y segura, combinando estructura, credibilidad y emoción en un solo momento', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l6-6',
    prompt: DIPTYCH(
      'con carisma puramente emocional, sonrisa amplia y gesto expansivo, cautivando en el momento pero sin estructura lógica visible',
      'con la misma calidez pero ahora también con un gesto de mano estructurado marcando un argumento claro, combinando emoción y lógica de forma completa y memorable',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 6 (ethos/pathos/logos) — expresion-oral\n`);
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
