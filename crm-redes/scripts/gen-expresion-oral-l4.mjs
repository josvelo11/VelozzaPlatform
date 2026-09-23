#!/usr/bin/env node
// gen-expresion-oral-l4.mjs — Lección 4: "Tono y énfasis" (7 imágenes)
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
    id: 'l4-0',
    prompt: DIPTYCH(
      'inclinado hacia adelante con expresión tensa y agresiva, como levantando la voz, ceño fruncido',
      'de pie erguido con expresión calmada y estable, autoridad tranquila sin necesidad de elevar el tono',
    ),
  },
  {
    id: 'l4-1',
    prompt: DIPTYCH(
      'con expresión tensa hablando fuerte, como forzando el volumen, ligera inseguridad detrás de la intensidad',
      'con expresión relajada y volumen medio estable, control genuino sin esfuerzo',
    ),
  },
  {
    id: 'l4-2',
    prompt: SINGLE('a mitad de frase con un leve énfasis en una sola palabra clave, ceja ligeramente elevada y gesto sutil de mano marcando ese instante preciso', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l4-3',
    prompt: SINGLE('desacelerando deliberadamente justo antes de decir una palabra importante, expresión pausada y controlada, creando espacio antes del punto clave', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l4-4',
    prompt: SINGLE('con un tono de voz estable y neutral, expresión serena sin altibajos forzados, comunicando con control natural', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l4-5',
    prompt: DIPTYCH(
      'con expresión de seguridad medida y genuina, tono confiado pero abierto',
      'con una sonrisa ligeramente petulante y postura de superioridad, cruzando la línea hacia la arrogancia',
    ),
  },
  {
    id: 'l4-6',
    prompt: SINGLE('revisando una página impresa de guion con palabras clave circuladas a mano y marcas de pausa anotadas entre frases, preparando la entonación de su presentación', 'plano medio de cuerpo con el guion en mano'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (tono y énfasis) — expresion-oral\n`);
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
