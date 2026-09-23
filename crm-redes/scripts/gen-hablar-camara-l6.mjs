#!/usr/bin/env node
// gen-hablar-camara-l6.mjs — Lección 6: "La arquitectura del mensaje" (8 imágenes, última lección del curso)
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

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l6-0',
    prompt: SINGLE('en el instante de máxima intensidad y foco durante los primeros segundos de un video, mirada directa y energía concentrada, consciente de que este momento decide si la audiencia se queda', 'plano medio de cuerpo frente al set de grabación'),
  },
  {
    id: 'l6-1',
    prompt: SINGLE('con gesto asertivo y directo, apuntando ligeramente hacia adelante mientras dice su punto principal de entrada, sin rodeos, confianza clara desde el primer momento', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l6-2',
    prompt: DIPTYCH(
      'a mitad de un gesto de construcción lenta, manos abriéndose gradualmente como guardando la conclusión para más adelante, construyendo suspenso',
      'con gesto directo y seguro entregando su conclusión de inmediato, sin rodeos, mensaje claro desde el inicio',
    ),
  },
  {
    id: 'l6-3',
    prompt: SINGLE('con expresión de foco absoluto y claridad, comunicando una sola idea central con total convicción, sin dispersión ni distracción en su mensaje', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l6-4',
    prompt: SINGLE('con un gesto de mano curvándose suavemente de regreso hacia el centro, como redirigiendo con elegancia una desviación de tema de vuelta a su mensaje principal, expresión de control calmado', 'plano medio de cuerpo, gesto de mano en movimiento'),
  },
  {
    id: 'l6-5',
    prompt: SINGLE('explicando algo con paciencia y claridad deliberada, expresión atenta y simplificada, como consciente de que lo obvio para él puede no serlo para su audiencia', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l6-6',
    prompt: SINGLE('sosteniendo una hoja de guion con la idea principal resaltada y circulada con marcador, revisando que el mensaje central sobrevivió intacto tras la edición', 'plano medio de cuerpo con el guion en mano'),
  },
  {
    id: 'l6-7',
    prompt: SINGLE('de pie frente al set de grabación completo, con total confianza y dominio, entregando su mensaje con claridad absoluta — imagen de cierre del curso completo de hablar frente a cámara', 'plano medio de cuerpo con el set de grabación visible al fondo'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 6 (arquitectura del mensaje) — hablar-camara\n`);
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
