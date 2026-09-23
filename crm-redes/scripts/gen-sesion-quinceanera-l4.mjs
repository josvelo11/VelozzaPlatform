#!/usr/bin/env node
// gen-sesion-quinceanera-l4.mjs — Lección 4 (Color, maquillaje y pelo que sí se ven en cámara)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './sesion-quinceanera-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'sesion-quinceanera');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía de quinceañera editorial elegante, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: una joven de 15 años, cabello castaño liso largo, piel trigueña, ${left}. DERECHA: la misma joven, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l4-0',
    prompt: DIPTYCH(
      'vistiendo su vestido de gala verde esmeralda bajo la luz cálida y suave de un espejo de baño, look que se ve favorecedor y natural',
      'la misma joven bajo un flash de estudio directo e intenso, el mismo maquillaje ahora se ve mucho más tenue y casi imperceptible en la foto',
      'primer plano de rostro y hombros',
    ),
  },
  {
    id: 'l4-1',
    prompt: DIPTYCH(
      'vistiendo un vestido de gala de tono joya esmeralda con bordado en relieve, bajo un flash directo de estudio, el color absorbe la luz y conserva su intensidad y textura con detalle',
      'vistiendo un vestido de gala de tono pastel rosa palo con encaje en relieve, bajo el mismo flash directo, el color refleja gran parte de la luz dando un efecto suave y luminoso',
      'plano medio de cuerpo',
    ),
  },
  {
    id: 'l4-2',
    prompt: SINGLE('sentada en una silla de maquillaje mientras le colocan la tiara con la cabeza ligeramente inclinada hacia adelante, una luz lateral suave resaltando la tiara sin generar sombra dura en la frente, ambiente de preparación previo a la sesión', 'plano medio, escena de camerino'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (color, maquillaje y pelo en cámara) — sesion-quinceanera\n`);
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
