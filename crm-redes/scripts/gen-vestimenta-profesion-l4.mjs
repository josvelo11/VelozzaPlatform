#!/usr/bin/env node
// gen-vestimenta-profesion-l4.mjs — Lección 4: "Vestuario para grabar en lote" (9 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './vestimenta-profesion-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'vestimenta-profesion');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, de la cintura hacia arriba') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l4-0',
    prompt: SINGLE('a mitad de una larga sesión de grabación en lote, expresión de leve duda notando que lleva la misma prenda desde hace varias horas de grabación', 'plano medio de cuerpo en el set de grabación'),
  },
  {
    id: 'l4-1',
    prompt: SINGLE('de pie junto a un perchero con 2-3 combinaciones completas de ropa colgadas, todas dentro de la misma paleta de colores cálidos, eligiendo conscientemente entre ellas', 'plano medio de cuerpo junto al perchero'),
  },
  {
    id: 'l4-2',
    prompt: SINGLE('ajustando una tela de fondo ligeramente distinta a la de antes en su set de grabación, preparando una variación sutil entre tomas del mismo día', 'plano medio de cuerpo ajustando el fondo'),
  },
  {
    id: 'l4-3',
    prompt: SINGLE('mirando la pantalla de su teléfono revisando su propio feed, con expresión pensativa al notar que varios videos recientes con la misma ropa proyectan una sensación de baja actividad', 'plano medio de cuerpo con el teléfono en mano'),
  },
  {
    id: 'l4-4',
    prompt: SINGLE('sentada la noche anterior a una sesión de grabación, escribiendo una lista numerada de combinaciones de ropa en una libreta, planeando con intención', 'plano medio de cuerpo escribiendo en la libreta'),
  },
  {
    id: 'l4-5',
    prompt: SINGLE('de pie frente a un clóset abierto con demasiadas opciones de ropa, en el proceso de reducir conscientemente a solo tres combinaciones dentro de su paleta habitual, expresión de decisión clara', 'plano medio de cuerpo frente al clóset'),
  },
  {
    id: 'l4-6',
    prompt: DIPTYCH(
      'hablando a cámara con energía notablemente plana y algo de rigidez, vistiendo una prenda formal que se ve ajena y poco natural en ella',
      'hablando a cámara con energía natural y cómoda, vistiendo su traje sastre burdeos característico que se siente genuinamente suyo',
    ),
  },
  {
    id: 'l4-7',
    prompt: SINGLE('de pie con su blazer burdeos colgado sobre un hombro, mostrando la versatilidad de una sola prenda base que puede usarse de varias formas dentro del mismo perfil de estilo', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l4-8',
    prompt: SINGLE('vistiendo una prenda neutra y atemporal sin ningún detalle estacional obvio, adecuada para contenido que se publicará meses después de grabado', 'plano medio de cuerpo, de la cintura hacia arriba'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 4 (vestuario en lote) — vestimenta-profesion\n`);
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
