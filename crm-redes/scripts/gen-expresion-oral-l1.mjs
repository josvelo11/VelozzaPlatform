#!/usr/bin/env node
// gen-expresion-oral-l1.mjs — portada + Lección 1 (Claridad antes que elocuencia)
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
const COVER_PATH = path.join(__dirname, '..', '..', 'public', 'formacion', 'expresion-oral.jpg');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, de la cintura hacia arriba') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste exactamente la misma ropa. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'cover',
    outPath: COVER_PATH,
    prompt: SINGLE('de pie hablando con claridad y confianza genuina, gesto expresivo de una mano, expresión cálida y segura — imagen de portada del curso de expresión oral', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-0',
    prompt: DIPTYCH(
      'hablando con expresión densa y enredada, gesto de esfuerzo excesivo tratando de explicar algo complicado, ceño ligeramente fruncido',
      'hablando con expresión simple y clara, gesto relajado y directo, comunicando con total naturalidad',
    ),
  },
  {
    id: 'l1-1',
    prompt: SINGLE('con gesto de simplificar activamente una idea, manos despejando algo imaginario frente a él como quitando ruido innecesario para dejar solo lo esencial', 'plano medio de cuerpo, gesto de manos despejando'),
  },
  {
    id: 'l1-2',
    prompt: SINGLE('a mitad de una explicación en vivo, expresión momentánea de ligera sobrecarga mental, como perdiendo el hilo por un instante frente a demasiada información', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l1-3',
    prompt: SINGLE('contando con los dedos de una mano mientras explica una estructura de tres pasos clara, gesto organizado y didáctico', 'plano medio de cuerpo, gesto de contar con los dedos'),
  },
  {
    id: 'l1-4',
    prompt: SINGLE('con expresión de darse cuenta que simplificó demasiado una explicación técnica, ligera mueca de autoconciencia frente a una audiencia más experta', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l1-5',
    prompt: DIPTYCH(
      'hablando con una explicación densa y larga, expresión de esfuerzo, gesticulando de forma dispersa',
      'entregando la misma idea en una sola frase corta y clara, expresión de total confianza y simplicidad',
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
  const outPath = job.outPath || path.join(OUT_DIR, `${job.id}.jpg`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, bytes);
  return { outPath, bytes: bytes.length };
}

async function main() {
  console.log(`Generando ${jobs.length} imágenes (portada + Lección 1) — expresion-oral\n`);
  let ok = 0;
  for (const job of jobs) {
    const outPath = job.outPath || path.join(OUT_DIR, `${job.id}.jpg`);
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
