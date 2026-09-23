#!/usr/bin/env node
// gen-dia-de-la-boda-l3.mjs — Lección 3: "Retrato formal de pareja: vestido, manos y altura" (6 imágenes)
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
    id: 'l3-0',
    prompt: DIPTYCH(
      'de pie completamente quietos y rígidos, sonrisa forzada, bajo luz plana sin sombras, el vestido colgando sin ningún pliegue ni movimiento, aspecto plano y artificial',
      'en una pose natural con leve movimiento, ella inclinándose hacia él con una risa genuina, luz dorada favorecedora, el vestido con pliegues y textura visible',
      'plano medio, cuerpo entero, retrato de pareja',
    ),
  },
  {
    id: 'l3-1',
    prompt: DIPTYCH(
      'la cola del vestido de novia amontonada de forma desprolija detrás de ella tras un cambio de pose',
      'una dama de honor arrodillada detrás acomodando la cola del vestido en un arco elegante y extendido',
      'plano medio, cuerpo entero, detalle de la cola del vestido',
    ),
  },
  {
    id: 'l3-2',
    prompt: SINGLE(
      'primer plano de las manos de la pareja posicionadas con intención — la mano de ella sosteniendo el ramo de flores cerca de la cintura, la mano de él apoyada con delicadeza en la solapa del saco',
      'primer plano de manos y torso',
    ),
  },
  {
    id: 'l3-3',
    prompt: SINGLE(
      'posando juntos sobre un escalón de piedra en el jardín, el desnivel del escalón compensando de forma sutil y natural la diferencia de altura entre ambos, mirándose con calidez',
      'plano medio, cuerpo entero, sobre un escalón de piedra',
    ),
  },
  {
    id: 'l3-4',
    prompt: SINGLE(
      'girando juntos en movimiento, la falda del vestido y el velo ondeando con el giro, energía y vida genuina en la pose, ambos riendo',
      'plano medio, cuerpo entero, en movimiento/giro',
    ),
  },
  {
    id: 'l3-5',
    prompt: SINGLE(
      'inclinados juntos sobre la pantalla trasera de una cámara sostenida por el fotógrafo (solo se ve su mano en el borde del encuadre), sonriendo satisfechos al ver las fotos recién tomadas',
      'plano medio, revisando fotos en cámara',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (retrato formal de pareja) — dia-de-la-boda\n`);
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
