#!/usr/bin/env node
// gen-sesion-pareja-l2.mjs — Lección 2: "Vestuario de pareja" (3 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { W, M, COUPLE, STYLE } from './sesion-pareja-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'sesion-pareja');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista de sesión de pareja, formato horizontal 4:3, ${shot}. ${COUPLE}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, ambos en el encuadre') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre, misma pareja en ambos (mismos rostros). IZQUIERDA: ${W} y ${M}, ${left}. DERECHA: la misma pareja, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l2-0',
    prompt: DIPTYCH(
      'vistiendo exactamente la misma camisa blanca y el mismo pantalón azul idénticos, como un uniforme, look forzado y poco natural',
      'vistiendo colores muy saturados y opuestos que compiten entre sí — uno en rojo intenso, otro en verde brillante — visualmente ruidoso',
    ),
  },
  {
    id: 'l2-1',
    prompt: DIPTYCH(
      'en colores saturados y opuestos que compiten visualmente entre sí, la mirada del espectador rebotando entre los colores en vez de sus rostros',
      'en tonos coordinados con un color dominante y uno neutro de apoyo, la mirada del espectador fluye naturalmente hacia sus rostros',
    ),
  },
  {
    id: 'l2-2',
    prompt: SINGLE('vistiendo su vestuario real coordinado — vestido verde salvia y camisa de lino color piedra — misma familia de tonos neutros cálidos pero con texturas distintas, look armonioso y natural, no idéntico', 'plano medio de cuerpo, ambos en el encuadre'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (vestuario) — sesion-pareja\n`);
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
