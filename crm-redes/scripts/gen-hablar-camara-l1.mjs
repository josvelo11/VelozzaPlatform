#!/usr/bin/env node
// gen-hablar-camara-l1.mjs — portada + Lección 1 (El primer segundo decide todo)
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
const COVER_PATH = path.join(__dirname, '..', '..', 'public', 'formacion', 'hablar-camara.jpg');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, de la cintura hacia arriba') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste exactamente la misma ropa. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'cover',
    outPath: COVER_PATH,
    prompt: SINGLE('en un set de grabación pequeño con cámara en trípode, hablando a cámara con energía y confianza genuina, gesto expresivo con una mano, sonrisa cálida y segura — imagen de portada del curso de hablar frente a cámara', 'plano medio de cuerpo con el set de grabación visible'),
  },
  {
    id: 'l1-0',
    prompt: SINGLE('frente a una cámara en trípode con la luz roja de "grabando" encendida, en el instante exacto de abrir la boca para decir la primera palabra, expresión de máxima energía y presencia', 'plano medio de cuerpo frente al set de grabación'),
  },
  {
    id: 'l1-1',
    prompt: DIPTYCH(
      'hablando a cámara con expresión plana y desganada, hombros caídos, energía baja, como diciendo un saludo genérico sin gancho',
      'hablando a cámara con expresión intensa y enfocada, cuerpo inclinado ligeramente hacia el lente, energía alta, como abriendo con una frase específica que atrapa de inmediato',
    ),
  },
  {
    id: 'l1-2',
    prompt: DIPTYCH(
      'con expresión de duda, encogiendo levemente los hombros, gesto vago y genérico hacia la cámara',
      'con expresión de total certeza, apuntando directamente hacia el lente con el dedo índice, afirmación clara y específica',
    ),
  },
  {
    id: 'l1-3',
    prompt: SINGLE('contando con los dedos de una mano mientras habla animadamente a cámara, explicando varios puntos distintos con entusiasmo genuino, como enumerando una lista de opciones', 'plano medio de cuerpo, gesto de contar con los dedos'),
  },
  {
    id: 'l1-4',
    prompt: DIPTYCH(
      'con expresión tensa y esforzada, ceño ligeramente fruncido, como luchando por encontrar las palabras correctas frente a cámara',
      'con expresión relajada y fluida, hablando con total naturalidad y facilidad, sin esfuerzo aparente',
      'primer plano de rostro y hombros',
    ),
  },
  {
    id: 'l1-5',
    prompt: SINGLE('mirando la pantalla de reproducción de su cámara después de grabar una toma, revisando el resultado con expresión evaluativa, verificando si el gancho realmente funciona', 'plano medio de cuerpo revisando la pantalla de la cámara'),
  },
  {
    id: 'l1-6',
    prompt: SINGLE('de pie entre dos dispositivos de grabación — un celular en formato vertical y una cámara en formato horizontal, ambos en trípode — adaptando su postura ligeramente para cada encuadre distinto', 'plano medio de cuerpo entre ambos dispositivos'),
  },
  {
    id: 'l1-7',
    prompt: SINGLE('sentado revisando el guion en la pantalla de su teléfono, marcando con un bolígrafo rojo las primeras líneas para reescribirlas de forma más específica, expresión concentrada de edición', 'plano medio de cuerpo con el teléfono y el guion visible'),
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
  const outPath = job.outPath || path.join(OUT_DIR, `${job.id}.jpg`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, bytes);
  return { outPath, bytes: bytes.length };
}

async function main() {
  console.log(`Generando ${jobs.length} imágenes (portada + Lección 1) — hablar-camara\n`);
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
