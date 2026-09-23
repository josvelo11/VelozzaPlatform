#!/usr/bin/env node
// gen-asesoria-imagen-l3.mjs — Lección 3: "Grooming y detalles en cámara" (7 imágenes)
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
const DIPTYCH = (left, right, shot = 'primer plano de rostro y hombros') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles la mujer viste exactamente la misma ropa. IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l3-0',
    prompt: DIPTYCH(
      'primer plano de rostro visto a simple vista, piel con apariencia normal y natural',
      'el mismo rostro pero bajo luz de cámara intensa que amplifica cada detalle: brillo visible en la zona T, textura de poros más marcada, tal como lo captaría una cámara de alta resolución',
    ),
  },
  {
    id: 'l3-1',
    prompt: DIPTYCH(
      'bajo luz artificial difusa y suave, la piel se ve pareja sin puntos brillantes concentrados',
      'bajo luz artificial dura y directa tipo ring light mal ajustado, con un punto de brillo especular concentrado y notorio en la frente',
    ),
  },
  {
    id: 'l3-2',
    prompt: SINGLE('revisándose el rostro en un pequeño espejo compacto antes de grabar, expresión concentrada haciendo una última revisión de piel, cabello y sonrisa', 'plano medio de cuerpo con el espejo compacto en mano'),
  },
  {
    id: 'l3-3',
    prompt: SINGLE('frente a la pantalla de una cámara réflex en un trípode, ajustándose el cabello con una mano mientras revisa su propio encuadre en la pantalla, en medio de una rutina rápida de preparación antes de grabar', 'plano medio de cuerpo frente al set de grabación'),
  },
  {
    id: 'l3-4',
    prompt: SINGLE('a medio gesto tocándose el cabello frente a una cámara con luz de grabación encendida, en un momento candid de distracción a mitad de una toma, expresión ligeramente autoconsciente', 'plano medio de cuerpo frente al set de grabación con luz roja de "grabando" encendida'),
  },
  {
    id: 'l3-5',
    prompt: DIPTYCH(
      'con un retoque de piel exagerado y artificial, apariencia demasiado suave y plástica, poco natural',
      'con una apariencia natural y bien cuidada, piel con textura real visible pero saludable y luminosa — el balance correcto',
    ),
  },
  {
    id: 'l3-6',
    prompt: SINGLE('sentada frente a un escritorio con tres dispositivos visibles — un celular en trípode pequeño, una cámara réflex y una laptop con webcam — todos apuntando hacia ella, evaluando cómo se ve en cada uno', 'plano medio de cuerpo con los tres dispositivos visibles en el escritorio'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (grooming) — asesoria-imagen\n`);
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
