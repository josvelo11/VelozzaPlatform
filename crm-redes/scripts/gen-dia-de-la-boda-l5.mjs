#!/usr/bin/env node
// gen-dia-de-la-boda-l5.mjs — Lección 5: "Fotogénicos bajo presión: retoque y calma" (6 imágenes)
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
const DIPTYCH = (left, right, shot = 'primer plano de rostro') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma novia, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l5-0',
    prompt: SINGLE(
      'primer plano del rostro de la novia con un brillo notable en la frente y la nariz bajo la luz directa del flash, mostrando el problema técnico del brillo excesivo en piel',
      'primer plano de rostro',
    ),
  },
  {
    id: 'l5-1',
    prompt: DIPTYCH(
      'con maquillaje de acabado mate, la piel absorbiendo la luz del flash de forma pareja y controlada',
      'con maquillaje de acabado brillante, la piel reflejando la luz del flash de forma dura y notoria en frente y nariz',
      'primer plano de rostro',
    ),
  },
  {
    id: 'l5-2',
    prompt: DIPTYCH(
      'con los hombros elevados y tensos, la mandíbula apretada, expresión visiblemente nerviosa',
      'con los hombros relajados y bajos, expresión suave y natural, completamente distendida',
      'plano medio, torso y hombros',
    ),
  },
  {
    id: 'l5-3',
    prompt: SINGLE(
      'exhalando conscientemente con los hombros visiblemente bajando, un momento breve de soltar la tensión justo antes de que el fotógrafo dispare una foto formal',
      'plano medio, exhalando y relajando hombros',
    ),
  },
  {
    id: 'l5-4',
    prompt: SINGLE(
      'de pie mientras una dama de honor sostiene junto a ella una pequeña bolsa de retoque con papel matificante, labial y brocha, lista para arreglarla justo antes de la siguiente foto',
      'plano medio, dama de honor con kit de retoque junto a la novia',
    ),
  },
  {
    id: 'l5-5',
    prompt: SINGLE(
      'relajados y sonriendo genuinamente al final del día, apoyados el uno en el otro con calma, resultado de haber aplicado las técnicas de relajación durante toda la sesión de fotos',
      'plano medio, pareja relajada y sonriente',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (fotogénicos bajo presión) — dia-de-la-boda\n`);
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
