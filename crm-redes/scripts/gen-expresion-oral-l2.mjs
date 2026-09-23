#!/usr/bin/env node
// gen-expresion-oral-l2.mjs — Lección 2: "Identificar y quitar las muletillas" (7 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M, STYLE } from './expresion-oral-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'expresion-oral');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, de la cintura hacia arriba') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste exactamente la misma ropa. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l2-0',
    prompt: SINGLE('a mitad de una frase con la boca ligeramente abierta en el instante de decir un "eh" natural mientras formula la siguiente idea, gesto de transición genuino', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l2-1',
    prompt: SINGLE('completamente concentrado formando su siguiente palabra, atención total en el contenido, sin ser consciente del sonido de relleno que acaba de emitir', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l2-2',
    prompt: SINGLE('mirando la pantalla de su teléfono reproduciendo la grabación de su propia voz, expresión de sorpresa genuina al notar cuántas muletillas usó sin darse cuenta', 'plano medio de cuerpo con el teléfono en mano'),
  },
  {
    id: 'l2-3',
    prompt: DIPTYCH(
      'hablando con fluidez total, discurso suave y continuo, transmitiendo confianza genuina',
      'hablando de forma entrecortada y fragmentada, pausas irregulares y torpes, transmitiendo inseguridad',
    ),
  },
  {
    id: 'l2-4',
    prompt: SINGLE('en un silencio compuesto y deliberado justo donde antes hubiera puesto una muletilla, expresión serena y controlada durante la pausa', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l2-5',
    prompt: SINGLE('haciendo una pausa contada y deliberada mientras habla, expresión calmada y en control del ritmo, como contando silenciosamente antes de continuar', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-6',
    prompt: DIPTYCH(
      'en una pausa vacía y sin intención, mirada algo perdida, muletilla vacía',
      'en una pausa con intención clara, gesto sutil de énfasis con la mano, marcador discursivo con propósito',
      'primer plano de rostro y hombros',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (muletillas) — expresion-oral\n`);
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
