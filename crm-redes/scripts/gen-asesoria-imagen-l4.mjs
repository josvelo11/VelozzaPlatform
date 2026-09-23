#!/usr/bin/env node
// gen-asesoria-imagen-l4.mjs — Lección 4: "Coherencia imagen física / feed" (7 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './asesoria-imagen-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l4-0',
    prompt: SINGLE('sentada mirando la pantalla de una tablet que muestra una cuadrícula de contenido con paleta de colores cuidada, señalando con el dedo una foto que rompe visiblemente el patrón, expresión de haber detectado el problema', 'plano medio de cuerpo con la tablet visible'),
  },
  {
    id: 'l4-1',
    prompt: SINGLE('mirando fijamente una pantalla con expresión de análisis intuitivo, como percibiendo que algo no encaja visualmente sin poder explicarlo todavía con palabras', 'primer plano de rostro y hombros con la pantalla desenfocada al fondo'),
  },
  {
    id: 'l4-2',
    prompt: SINGLE('de pie en un set de grabación con una tela de fondo en tonos dorados y cálidos que armoniza perfectamente con su vestuario crema, todo el encuadre se siente parte del mismo universo de color', 'plano medio de cuerpo con el fondo de tela cálida visible'),
  },
  {
    id: 'l4-3',
    prompt: SINGLE('sosteniendo una tablet alejada del cuerpo, mirando una cuadrícula completa de su perfil de contenido desde la distancia, evaluando la coherencia visual general del conjunto', 'plano medio de cuerpo con la tablet extendida'),
  },
  {
    id: 'l4-4',
    prompt: DIPTYCH(
      'vistiendo un blazer de un color muy específico y saturado que imita literalmente el color exacto de un logo de marca, se ve forzado y como disfraz',
      'vistiendo su blazer crema habitual que simplemente armoniza en temperatura y saturación cálida con la marca, sin imitar ningún color literal — se ve natural y correcto',
    ),
  },
  {
    id: 'l4-5',
    prompt: SINGLE('mirando una pantalla con una cuadrícula de contenido completamente coherente, ninguna pieza rompe el patrón, expresión satisfecha y tranquila de ver el resultado logrado', 'plano medio de cuerpo con la pantalla visible'),
  },
  {
    id: 'l4-6',
    prompt: SINGLE('colocando una tela suave de color cálido sobre una pared genérica de fondo en una habitación doméstica, transformando un fondo improvisado en algo más cercano a su paleta de marca, en medio del gesto de ajustarla', 'plano medio de cuerpo ajustando la tela de fondo'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (coherencia feed) — asesoria-imagen\n`);
  let ok = 0;
  for (const job of jobs) {
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
