#!/usr/bin/env node
// gen-sesion-boudoir-l3.mjs — Lección 3: "Vestuario: qué tela, qué color y por qué" (5 imágenes)
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
    id: 'l3-0',
    prompt: DIPTYCH(
      'sosteniendo una prenda de tela lisa y mate frente a un perchero de camerino con luz cálida ambiental, la tela se ve rica y atractiva colgada',
      'con esa misma prenda puesta bajo la luz de estudio, la tela se ve plana y sin volumen, expresión ligeramente decepcionada mirándose en un espejo',
      'plano medio, escena de camerino',
    ),
  },
  {
    id: 'l3-1',
    prompt: DIPTYCH(
      'vistiendo una prenda de encaje con textura visible, pequeñas sombras marcando el relieve del tejido bajo luz lateral suave',
      'vistiendo una prenda de tela completamente lisa y mate, sin relieve, la luz no genera ninguna sombra que le dé volumen',
      'plano medio, torso y hombros',
    ),
  },
  {
    id: 'l3-2',
    prompt: DIPTYCH(
      'sosteniendo una tela en tono champagne/blush cálido cerca del rostro, la iluminación resalta favorablemente su piel trigueña',
      'sosteniendo una tela en un tono neón muy saturado cerca del rostro, el color compite visualmente y opaca la atención sobre su rostro',
      'primer plano, tela sostenida junto al rostro',
    ),
  },
  {
    id: 'l3-3',
    prompt: DIPTYCH(
      'envuelta completamente en su bata de seda cerrada, postura protegida y recogida, mirada tímida hacia abajo',
      'la misma bata ahora ligeramente abierta dejando ver el hombro y la clavícula, postura más abierta y segura, mirada directa a cámara',
      'plano medio, cuerpo entero',
    ),
  },
  {
    id: 'l3-4',
    prompt: SINGLE(
      'de pie frente a un clóset abierto de camerino con tres prendas cuidadosamente seleccionadas visibles en ganchos — un tono neutro conocido, una pieza negra de contraste dramático y una bata con capa — evaluándolas pensativa antes de la sesión',
      'plano medio, escena de clóset con las prendas seleccionadas visibles',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (vestuario: tela y color) — sesion-boudoir\n`);
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
