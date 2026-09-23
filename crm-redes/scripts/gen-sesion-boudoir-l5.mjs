#!/usr/bin/env node
// gen-sesion-boudoir-l5.mjs — Lección 5: "Luz y ángulo de cámara" (5 imágenes)
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
    id: 'l5-0',
    prompt: DIPTYCH(
      'iluminada por una luz frontal plana que llega directo de frente, toda la superficie de la piel igual de brillante, sin ninguna zona de sombra, aspecto plano y sin volumen',
      'iluminada por una luz suave lateral a 45 grados, un lado del cuerpo brillante y el otro desvaneciéndose en un degradado suave de sombra, aspecto tridimensional y con volumen',
      'retrato de tres cuartos, torso y hombros',
    ),
  },
  {
    id: 'l5-1',
    prompt: SINGLE(
      'de pie junto a una ventana grande en ángulo de 45 grados respecto a la luz, un degradado marcado de luz a sombra recorriendo su cuerpo, mostrando claramente el volumen que genera la luz direccional',
      'plano medio, en ángulo de 45 grados respecto a la ventana',
    ),
  },
  {
    id: 'l5-2',
    prompt: DIPTYCH(
      'fotografiada desde un ángulo de cámara ligeramente por encima del nivel de los ojos, apuntando hacia abajo, silueta alargada y favorecedora',
      'fotografiada desde un ángulo de cámara por debajo del nivel de los ojos, apuntando hacia arriba, proporciones exageradas y menos favorecedoras cerca del mentón',
      'plano medio, cuerpo entero',
    ),
  },
  {
    id: 'l5-3',
    prompt: SINGLE(
      'girando sutilmente su postura unos centímetros hacia la ventana siguiendo una indicación fuera de cuadro, expresión de confianza y calma mientras ajusta su posición hacia la luz',
      'plano medio, girando hacia la ventana',
    ),
  },
  {
    id: 'l5-4',
    prompt: SINGLE(
      'de pie en un set de estudio fotográfico profesional, con una ventana grande como fuente de luz principal y un rebotador plateado visible a un lado rellenando las sombras, ambiente sereno y profesional',
      'plano medio, escena de estudio con equipo de iluminación visible',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (luz y ángulo de cámara) — sesion-boudoir\n`);
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
