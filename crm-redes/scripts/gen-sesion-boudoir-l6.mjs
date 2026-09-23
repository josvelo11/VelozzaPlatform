#!/usr/bin/env node
// gen-sesion-boudoir-l6.mjs — Lección 6: "Confianza real frente a cámara" (5 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './sesion-boudoir-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'sesion-boudoir');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía boudoir editorial elegante, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'primer plano de rostro y hombros, perfil de tres cuartos') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l6-0',
    prompt: SINGLE(
      'sentada al borde de la cama justo antes de empezar la sesión, mirando su propio reflejo en un espejo cercano con expresión pensativa y algo de tensión visible, respirando hondo antes de comenzar',
      'plano medio, momento previo a la sesión',
    ),
  },
  {
    id: 'l6-1',
    prompt: DIPTYCH(
      'con expresión de incertidumbre e inquietud, mirada dudosa, antes de hablar con su fotógrafa',
      'sosteniendo su teléfono después de una llamada con su fotógrafa, expresión notablemente más tranquila y confiada, ligera sonrisa de alivio',
      'primer plano de rostro',
    ),
  },
  {
    id: 'l6-2',
    prompt: SINGLE(
      'mirando la pantalla trasera de una cámara que sostiene una mano fuera de cuadro, expresión de sorpresa agradable al verse a sí misma por primera vez, una sonrisa genuina emergiendo',
      'plano medio, mirando la pantalla de la cámara',
    ),
  },
  {
    id: 'l6-3',
    prompt: SINGLE(
      'posando con soltura y comodidad total en su primer vestuario de la sesión, la bata de seda cerrada, pose simple y relajada, sonrisa natural, en los primeros minutos amigables de la sesión',
      'plano medio, pose inicial relajada',
    ),
  },
  {
    id: 'l6-4',
    prompt: DIPTYCH(
      'con postura ligeramente rígida y tensa, sonrisa un poco forzada, en los primeros minutos incómodos de la sesión',
      'con postura suelta, natural y segura, expresión relajada y genuina, minutos después una vez que se soltó por completo',
      'plano medio, cuerpo entero',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 6 (confianza real frente a cámara) — sesion-boudoir\n`);
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
