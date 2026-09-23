#!/usr/bin/env node
// gen-hablar-camara-l3.mjs — Lección 3: "Habla más lento de lo que se siente natural" (9 imágenes)
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
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste exactamente la misma ropa. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l3-0',
    prompt: SINGLE('a mitad de una pausa mientras habla a cámara, boca ligeramente cerrada, expresión de ligera tensión interna aunque el silencio se ve completamente natural desde afuera — el segundo que se siente eterno por dentro pero luce normal', 'plano medio de cuerpo frente al set de grabación'),
  },
  {
    id: 'l3-1',
    prompt: SINGLE('en un momento de pausa deliberada y compuesta justo después de decir algo importante, expresión serena de estar pensando antes de continuar, presencia controlada', 'primer plano de rostro y hombros'),
  },
  {
    id: 'l3-2',
    prompt: SINGLE('sosteniendo una hoja impresa de guion con marcas de pausa anotadas a mano, revisándolo antes de grabar, expresión concentrada de preparación', 'plano medio de cuerpo con el guion en mano'),
  },
  {
    id: 'l3-3',
    prompt: DIPTYCH(
      'en silencio compuesto y seguro tras una frase, sin necesidad de llenar el espacio con sonido',
      'a medio "eh" con expresión visiblemente incómoda, boca entreabierta en gesto de muletilla, tratando de llenar el silencio con un sonido de relleno',
      'primer plano de rostro y hombros',
    ),
  },
  {
    id: 'l3-4',
    prompt: DIPTYCH(
      'hablando con expresión y tono completamente plano, rostro casi sin variación, monótono',
      'hablando con expresión animada y viva, cejas y gestos con variación genuina, transmitiendo energía y confianza',
      'primer plano de rostro y hombros',
    ),
  },
  {
    id: 'l3-5',
    prompt: SINGLE('en la toma número diez de una sesión de grabación, completamente relajado y cómodo frente a cámara, sin el nerviosismo inicial, presencia natural lograda por la repetición', 'plano medio de cuerpo frente al set de grabación'),
  },
  {
    id: 'l3-6',
    prompt: DIPTYCH(
      'con una pausa que se siente forzada, colocada torpemente a mitad de una frase, mano congelada a medio gesto, ligera incomodidad',
      'con una pausa bien ubicada entre dos ideas completas, cuerpo relajado, respiración natural en el silencio',
      'plano medio de cuerpo',
    ),
  },
  {
    id: 'l3-7',
    prompt: SINGLE('sentado frente a una laptop revisando una línea de tiempo de edición de video, expresión de leve preocupación al notar que una pausa intencional suya fue recortada por una herramienta automática', 'plano medio de cuerpo frente a la laptop con la línea de tiempo visible'),
  },
  {
    id: 'l3-8',
    prompt: SINGLE('de pie frente al set de grabación con expresión de calma total y dominio, como cerrando una sesión de práctica exitosa tras varias tomas de calibración, presencia confiada y relajada', 'plano medio de cuerpo con el set de grabación al fondo'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (habla más lento) — hablar-camara\n`);
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
