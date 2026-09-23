#!/usr/bin/env node
// gen-sesion-quinceanera-l2.mjs — Lección 2 (Tu postura base: el ángulo que estiliza y el truco de la barbilla)
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
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma joven, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l2-0',
    prompt: SINGLE('de pie completamente de frente a la cámara, pies juntos, peso repartido por igual en ambas piernas, postura simétrica, plana y rígida como una foto escolar', 'plano medio de cuerpo entero'),
  },
  {
    id: 'l2-1',
    prompt: DIPTYCH(
      'de pie completamente de frente, hombros y cadera alineados en línea recta, sin ninguna curva, postura plana',
      'girada 45 grados respecto a la cámara, peso desplazado hacia la pierna trasera, cara vuelta de nuevo al frente, una elegante curva formándose entre hombro, cintura y cadera',
      'plano de cuerpo entero',
    ),
  },
  {
    id: 'l2-2',
    prompt: DIPTYCH(
      'de perfil con la barbilla nivelada pero sin proyectarse hacia adelante, una sombra suave visible bajo la mandíbula',
      'de perfil con la barbilla proyectada hacia adelante y ligeramente hacia abajo, cuello estirado, línea de la mandíbula nítida y definida, técnica correcta',
      'primer plano de rostro y cuello, perfil',
    ),
  },
  {
    id: 'l2-3',
    prompt: SINGLE('combinando la postura completa: cuerpo girado 45 grados con el hombro derecho ligeramente adelantado, peso en la pierna trasera, barbilla proyectada hacia adelante y abajo, mirada directa y segura al lente, resultado final elegante', 'plano de cuerpo entero, postura completa'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (postura base y barbilla) — sesion-quinceanera\n`);
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
