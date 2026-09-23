#!/usr/bin/env node
// gen-asesoria-imagen-l5.mjs — Lección 5: "Sistema visual repetible" (6 imágenes, última lección del curso)
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
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles la mujer viste exactamente la misma ropa (blazer crema). IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l5-0',
    prompt: DIPTYCH(
      'en un set de grabación con luz cálida dorada y fondo A (tela beige), el conjunto se siente coherente',
      'con exactamente el mismo blazer crema pero en un set con luz fría azulada y fondo B (pared gris), el mismo outfit ahora se siente disonante y fuera de lugar por el cambio de luz y fondo',
    ),
  },
  {
    id: 'l5-1',
    prompt: SINGLE('de pie en medio de un set de grabación completamente controlado — fondo, luz, encuadre de cámara y ambiente de color todos trabajando juntos de forma deliberada — como el ejemplo perfecto de un sistema visual completo, no solo el vestuario', 'plano medio de cuerpo en el set completo'),
  },
  {
    id: 'l5-2',
    prompt: SINGLE('ajustando el dial de temperatura de color en un panel de luz LED de estudio, luz cálida dorada visible iluminando su rostro mientras fija deliberadamente el tono exacto de su marca', 'plano medio de cuerpo junto al panel de luz'),
  },
  {
    id: 'l5-3',
    prompt: DIPTYCH(
      'en su set de grabación habitual y consistente, con el mismo fondo y la misma luz de siempre',
      'en un set de grabación notablemente distinto — fondo y luz cambiados por "mejorarlo" — que rompe el reconocimiento visual construido con el setup anterior',
    ),
  },
  {
    id: 'l5-4',
    prompt: SINGLE('sosteniendo una hoja de referencia impresa con parámetros técnicos anotados a mano (altura de luz, temperatura Kelvin, distancia de cámara) junto a su set de grabación, documentando su sistema para que sea repetible', 'plano medio de cuerpo con la hoja de referencia en mano'),
  },
  {
    id: 'l5-5',
    prompt: SINGLE('mirando un monitor grande que muestra varias miniaturas de video espaciadas en el tiempo, comparando si todas se ven consistentes como el mismo canal, expresión satisfecha de verificación exitosa — imagen de cierre del curso', 'plano medio de cuerpo frente al monitor'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (sistema visual) — asesoria-imagen\n`);
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
