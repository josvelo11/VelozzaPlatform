#!/usr/bin/env node
// gen-sesion-preboda-l3.mjs — Lección 3: "Vestuario y color para exteriores" (4 imágenes)
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
    id: 'l3-0',
    prompt: SINGLE(
      'ambos vistiendo exactamente el mismo tono de blanco roto de pies a cabeza, sus siluetas fundiéndose visualmente en una sola masa contra un fondo de pasto claro',
      'plano de cuerpo entero, fondo de campo abierto',
    ),
  },
  {
    id: 'l3-1',
    prompt: SINGLE(
      'ella con un vestido terracota y él con una camisa de lino color crudo, dos tonos cálidos distintos pero de la misma familia, claramente separados como dos siluetas legibles contra un fondo verde de bosque',
      'plano de cuerpo entero, fondo de bosque verde',
    ),
  },
  {
    id: 'l3-2',
    prompt: DIPTYCH(
      'de pie contra un fondo de bosque verde denso, vestuario en tonos verdes que se mezcla y camufla con el follaje detrás',
      'de pie en el mismo fondo de bosque verde denso, vestuario terracota y crudo que resalta claramente contra el follaje',
      'plano medio, fondo de bosque',
    ),
  },
  {
    id: 'l3-3',
    prompt: SINGLE(
      'ella agregándose un pañuelo de seda como accesorio de cambio sobre el mismo vestido terracota, él con una chaqueta ligera encima de la camisa de lino, variando el look sin cambiarse de ropa completa',
      'plano medio, agregando accesorios de cambio',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (vestuario y color) — sesion-preboda\n`);
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
