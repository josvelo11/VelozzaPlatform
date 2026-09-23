#!/usr/bin/env node
// gen-expresion-oral-l3.mjs — Lección 3: "Storytelling básico" (7 imágenes)
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
    id: 'l3-0',
    prompt: SINGLE('con gesto de construir suspenso deliberadamente, manos abriéndose lentamente como creando un vacío de curiosidad entre lo que la audiencia sabe y lo que quiere saber', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l3-1',
    prompt: SINGLE('con la mano trazando tres etapas en el aire mientras cuenta una historia simple, gesto estructurado de situación, revelación y resolución', 'plano medio de cuerpo, gesto de tres etapas'),
  },
  {
    id: 'l3-2',
    prompt: DIPTYCH(
      'con expresión vaga y gesto impreciso, contando algo genérico sin detalle concreto',
      'con expresión nítida y un gesto preciso de dos dedos marcando un número específico, contando algo específico y verificable',
    ),
  },
  {
    id: 'l3-3',
    prompt: SINGLE('sosteniendo una pequeña tarjeta con exactamente tres líneas escritas a mano, practicando en voz alta una versión reducida de su historia', 'plano medio de cuerpo con la tarjeta en mano'),
  },
  {
    id: 'l3-4',
    prompt: SINGLE('con gesto de abrir las manos como revelando algo, como una puerta abriéndose hacia una idea, en vez de simplemente enumerar una lista plana', 'plano medio de cuerpo, gesto de manos abriéndose'),
  },
  {
    id: 'l3-5',
    prompt: SINGLE('respondiendo una pregunta directa con una respuesta corta y precisa, sin rodeos ni construcción narrativa, gesto seco y directo', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l3-6',
    prompt: SINGLE('con gesto de mano ramificándose en varias direcciones desde un mismo punto central, como mostrando cómo una misma situación puede llevar a distintas revelaciones', 'plano medio de cuerpo, gesto de mano ramificándose'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (storytelling) — expresion-oral\n`);
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
