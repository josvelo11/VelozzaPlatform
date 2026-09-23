#!/usr/bin/env node
// gen-hablar-camara-l5.mjs — Lección 5: "Grabar 10 tomas sin sonar repetitivo" (8 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './hablar-camara-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'hablar-camara');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l5-0',
    prompt: SINGLE('a mitad de una larga sesión de grabación en lote, ligera fatiga visible en la expresión, rodeado de equipo de grabación, como en la toma número ocho de diez del mismo día', 'plano medio de cuerpo en el set de grabación'),
  },
  {
    id: 'l5-1',
    prompt: SINGLE('en el instante de abrir con una postura corporal distinta y dinámica, inclinado hacia la cámara con energía de "afirmación contraria", una de varias formas de gancho distintas que varía entre tomas', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l5-2',
    prompt: DIPTYCH(
      'grabando desde un ángulo de cámara ligeramente elevado, con una chaqueta ligera encima del suéter',
      'grabando desde un ángulo de cámara a nivel de los ojos, sin la chaqueta, solo el suéter — mismo escenario pero con variables físicas cambiadas entre tomas',
    ),
  },
  {
    id: 'l5-3',
    prompt: SINGLE('mirando la pantalla de su teléfono revisando su propio feed de contenido, notando con expresión pensativa que varios de sus videos recientes se agrupan visualmente muy parecidos entre sí', 'plano medio de cuerpo con el teléfono en mano'),
  },
  {
    id: 'l5-4',
    prompt: SINGLE('con un gesto de apertura distinto pero la misma energía baja y plana en la expresión, mostrando que variar solo el gesto sin variar la energía real no resuelve la repetitividad', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l5-5',
    prompt: DIPTYCH(
      'con energía alta, expresión intensa y gesto amplio, como abriendo la sesión con la idea de mayor impacto',
      'con energía calmada y tono conversacional relajado, como cerrando la sesión con una idea más íntima y reflexiva',
    ),
  },
  {
    id: 'l5-6',
    prompt: DIPTYCH(
      'en el mismo set, mismo vestuario y fondo, grabando desde un ángulo de cámara cerrado y una distancia de encuadre más cercana',
      'en el mismo set, mismo vestuario y fondo, grabando desde una distancia de encuadre más amplia y un ángulo distinto, con la luz de la tarde entrando distinto',
    ),
  },
  {
    id: 'l5-7',
    prompt: SINGLE('revisando una pequeña tarjeta de checklist sujeta al trípode de su cámara antes de comenzar una sesión de grabación en lote, expresión organizada y preparada', 'plano medio de cuerpo junto al trípode con la tarjeta visible'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (10 tomas) — hablar-camara\n`);
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
