#!/usr/bin/env node
// gen-vestimenta-profesion-l3.mjs — Lección 3: "Colores y patrones en cámara" (9 imágenes)
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
const BASE = 'una mujer de unos 46 años, cabello liso oscuro recogido en un moño bajo pulcro, rasgos que sugieren ascendencia asiática-latina, piel clara';

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, de la cintura hacia arriba') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre, mismo rostro y peinado en ambos. IZQUIERDA: ${BASE}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l3-0',
    prompt: DIPTYCH(
      'vistiendo una blusa de rayas finas y delgadas, patrón nítido y estable',
      'vistiendo la misma blusa de rayas finas pero con un sutil efecto ondulante de distorsión (muaré) sobre el patrón, tal como lo captaría una cámara digital',
    ),
  },
  {
    id: 'l3-1',
    prompt: SINGLE(`${BASE}, sosteniendo su antebrazo bajo luz natural de ventana, examinando el tono de su piel y las venas visibles con atención`, 'primer plano de antebrazo y rostro parcial bajo luz de ventana'),
  },
  {
    id: 'l3-2',
    prompt: DIPTYCH(
      'vistiendo un traje muy oscuro con una blusa muy clara casi blanca, alto contraste tonal marcado',
      'vistiendo tonos cercanos a su propio tono de piel y cabello, bajo contraste, look suave y unificado',
    ),
  },
  {
    id: 'l3-3',
    prompt: SINGLE(`${BASE}, vistiendo una blusa blanca bajo una luz cálida dorada que tiñe ligeramente la tela de un tono amarillento, demostrando cómo la fuente de luz altera el balance de blancos percibido`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l3-4',
    prompt: SINGLE(`${BASE}, vistiendo una blusa de patrón de cuadros pequeños y densos, look visualmente ocupado y distractor frente a cámara`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l3-5',
    prompt: SINGLE(`${BASE}, vistiendo un suéter sólido color verde bosque de saturación media, look limpio y favorecedor frente a cámara`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l3-6',
    prompt: DIPTYCH(
      'vistiendo una prenda negra bajo luz tenue y pareja, la tela pierde toda textura y se ve como una silueta plana sin detalle',
      'vistiendo la misma prenda negra pero con una luz de contorno adicional definiendo claramente los bordes y pliegues de la tela contra el fondo',
    ),
  },
  {
    id: 'l3-7',
    prompt: SINGLE(`${BASE}, sosteniendo su teléfono grabando un clip de prueba corto antes de una sesión importante, mirando la pantalla para verificar cómo se ve su vestuario en cámara`, 'plano medio de cuerpo con el teléfono en mano'),
  },
  {
    id: 'l3-8',
    prompt: SINGLE(`${BASE}, sentada frente a una laptop ajustando deslizadores de nitidez y exposición en un editor de video, corrigiendo un clip grabado con un color problemático`, 'plano medio de cuerpo frente a la laptop'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (colores y patrones) — vestimenta-profesion\n`);
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
