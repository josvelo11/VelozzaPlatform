#!/usr/bin/env node
// gen-vestimenta-profesion-l1.mjs — portada + Lección 1 (Los tres mecanismos)
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
const COVER_PATH = path.join(__dirname, '..', '..', 'public', 'formacion', 'vestimenta-profesion.jpg');

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;

const jobs = [
  {
    id: 'cover',
    outPath: COVER_PATH,
    prompt: SINGLE('de pie con total seguridad y porte ejecutivo, expresión cálida y autoritaria, luciendo su traje sastre impecable — imagen de portada del curso de cómo vestirte según tu profesión', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-0',
    prompt: SINGLE('de pie con postura segura frente a cámara, su vestuario, expresión y ajuste de ropa comunicando coherencia total — la representación del sistema completo funcionando en conjunto', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-1',
    prompt: SINGLE('de pie con su traje sastre burdeos impecable, expresión de autoridad calmada y cercanía genuina al mismo tiempo, el tipo de presencia que una audiencia lee como confiable en segundos', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l1-2',
    prompt: SINGLE('con la mano sobre la solapa de su blazer, expresión de haber adoptado internamente la seguridad que su vestuario proyecta — la ropa correcta cambiando su propia postura y concentración, no solo la percepción externa', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l1-3',
    prompt: `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles plano medio de cuerpo, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, con el traje perfectamente entallado, una sola línea limpia recorriendo la silueta. DERECHA: la misma mujer, mismo encuadre, vistiendo el mismo tipo de traje burdeos pero visiblemente arrugado y mal ajustado, pliegues de tela notorios en hombros y torso, líneas de la silueta rotas. ${STYLE}`,
  },
  {
    id: 'l1-4',
    prompt: SINGLE('ajustándose un blazer que a pesar de verse costoso no le queda del todo bien en los hombros, expresión de leve insatisfacción notando el mal ajuste', 'plano medio de cuerpo ajustándose el blazer'),
  },
  {
    id: 'l1-5',
    prompt: SINGLE('de pie frente a un espejo de cuerpo completo, revisando conscientemente su imagen general — cómo se ve, cómo se siente, y cómo le queda la ropa — los tres elementos alineados', 'plano de cuerpo entero frente al espejo'),
  },
  {
    id: 'l1-6',
    prompt: SINGLE('frente al espejo señalando con el dedo un pliegue de tela sobrante en el hombro de su blazer, expresión de inspección minuciosa y atención al detalle', 'plano medio de cuerpo frente al espejo, señalando el hombro'),
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
  console.log(`Generando ${jobs.length} imágenes (portada + Lección 1) — vestimenta-profesion\n`);
  let ok = 0;
  for (const job of jobs) {
    const outPath = job.outPath || path.join(OUT_DIR, `${job.id}.jpg`);
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
