#!/usr/bin/env node
// gen-asesoria-imagen-l2.mjs — Lección 2: "Uniforme de marca personal" (8 imágenes)
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
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles la mujer viste exactamente la misma ropa (blazer crema descrito abajo). IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l2-0',
    prompt: DIPTYCH(
      'de pie frente a un clóset pequeño, ordenado, con solo 2-3 combinaciones completas de ropa colgadas con espacio entre cada una, expresión calmada y clara',
      'de pie frente a un clóset completamente lleno y desordenado de ropa amontonada, expresión ligeramente abrumada',
    ),
  },
  {
    id: 'l2-1',
    prompt: SINGLE('sentada frente a un laptop revisando una cuadrícula de miniaturas de contenido con una paleta de colores consistente y reconocible en todas, expresión satisfecha de ver el patrón coherente', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-2',
    prompt: SINGLE('de pie frente a un clóset abarrotado de ropa de todos los colores, con expresión de cansancio mental, una mano tocándose la frente — el costo oculto de tener demasiadas opciones', 'plano medio de cuerpo frente al clóset lleno'),
  },
  {
    id: 'l2-3',
    prompt: SINGLE('sentada frente a un pequeño set de grabación con ring light visible, vistiendo su outfit de marca característico, en el momento de empezar a grabar contenido, expresión profesional y segura', 'plano medio de cuerpo con el setup de grabación visible'),
  },
  {
    id: 'l2-4',
    prompt: SINGLE('de pie junto a un perchero organizado por color con prendas en tonos crema, blanco y azul marino agrupadas, sosteniendo una prenda mientras organiza conscientemente su paleta base', 'plano medio de cuerpo junto al perchero organizado'),
  },
  {
    id: 'l2-5',
    prompt: SINGLE('sosteniendo dos blazers de tonos distintos (uno crema, uno azul marino) uno en cada mano, comparándolos pensativamente frente a un perchero con más piezas en tonos similares detrás', 'plano medio de cuerpo con los blazers y el perchero visible'),
  },
  {
    id: 'l2-6',
    prompt: SINGLE('ajustándose un collar dorado delicado sobre su outfit base habitual frente a un espejo, agregando un accesorio distinto sin romper el conjunto general', 'plano medio de cuerpo frente al espejo'),
  },
  {
    id: 'l2-7',
    prompt: SINGLE('en un vestidor probándose conscientemente un blazer nuevo y ligeramente distinto frente al espejo, evaluando con intención si vale la pena actualizar su uniforme habitual, expresión reflexiva y decidida', 'plano medio de cuerpo frente al espejo del vestidor'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (uniforme de marca) — asesoria-imagen\n`);
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
