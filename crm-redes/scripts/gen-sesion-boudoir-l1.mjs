#!/usr/bin/env node
// gen-sesion-boudoir-l1.mjs — portada + Lección 1 (Postura base: 45° y curva en S)
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
const COVER_PATH = path.join(__dirname, '..', '..', 'public', 'formacion', 'sesion-boudoir.jpg');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía boudoir editorial elegante, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;

const jobs = [
  {
    id: 'cover',
    outPath: COVER_PATH,
    prompt: SINGLE('de pie con postura elegante en ángulo de tres cuartos, mirada segura y confiada hacia cámara, luz suave lateral — imagen de portada del curso de preparación para sesión boudoir', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-0',
    prompt: SINGLE('de pie completamente frontal hacia la cámara, hombros y caderas alineados en un solo plano, postura plana y poco favorecedora', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-1',
    prompt: SINGLE('girada en un ángulo de 45 grados respecto a la cámara, peso desplazado hacia la pierna trasera, cadera hacia un lado y hombro opuesto contrarrestando, formando una elegante curva en S a lo largo del cuerpo', 'plano de cuerpo entero'),
  },
  {
    id: 'l1-2',
    prompt: SINGLE('con el codo despegado del torso, apoyado sobre una superficie elevada como el borde de una ventana, dejando un espacio visible entre el brazo y la cintura que la estiliza', 'plano medio de cuerpo mostrando el brazo y la cintura'),
  },
  {
    id: 'l1-3',
    prompt: SINGLE('combinando los tres elementos de la postura perfecta: ángulo de 45 grados, peso en la pierna trasera y codo despegado del cuerpo, resultado final elegante y seguro', 'plano de cuerpo entero, postura completa'),
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
  console.log(`Generando ${jobs.length} imágenes (portada + Lección 1) — sesion-boudoir\n`);
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
