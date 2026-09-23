#!/usr/bin/env node
// gen-sesion-preboda-l4.mjs — Lección 4: "Elegir y preparar la locación" (4 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './sesion-preboda-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'sesion-preboda');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía documental de compromiso editorial, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano de cuerpo entero') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma pareja, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l4-0',
    prompt: SINGLE(
      'de pie en un sendero que resultó estar lleno de turistas y con señalización de obra visible al fondo, expresión de sorpresa incómoda al notar el lugar tan distinto de lo que esperaban',
      'plano medio, locación concurrida e inesperada',
    ),
  },
  {
    id: 'l4-1',
    prompt: SINGLE(
      'caminando desde un sendero boscoso sombreado hacia un claro abierto e iluminado dentro del mismo bosque, mostrando dos zonas visualmente distintas de la misma locación',
      'plano de cuerpo entero, transición entre dos zonas de la locación',
    ),
  },
  {
    id: 'l4-2',
    prompt: DIPTYCH(
      'caminando alegres al aire libre bajo un cielo despejado de atardecer',
      'sentados juntos junto a una ventana grande dentro de una sala luminosa con luz natural entrando, sonriendo, como plan alternativo bajo techo por lluvia',
      'plano medio',
    ),
  },
  {
    id: 'l4-3',
    prompt: SINGLE(
      'de pie abrazados junto a un banco de madera envejecido y sencillo bajo un árbol grande en un parque tranquilo, sin ninguna placa ni inscripción visible en el banco, luz cálida suave, expresión genuina y tierna, más íntimo que espectacular',
      'plano medio, lugar significativo y sencillo',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (locación y plan B) — sesion-preboda\n`);
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
