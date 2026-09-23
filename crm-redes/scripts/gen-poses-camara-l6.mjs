#!/usr/bin/env node
// gen-poses-camara-l6.mjs — Lección 6: Cómo la luz decide tu ángulo de pose (7 imágenes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const API_KEY = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'poses-camara');

const M = 'un hombre latino de unos 42 años, cabello corto oscuro con canas visibles en las sienes, barba corta y arreglada, piel trigueña, vistiendo SIEMPRE una camiseta negra de cuello redondo manga corta y pantalón oscuro — vestuario fijo, no debe cambiar de prenda ni de color';

const STYLE_BASE = `Fotografía de retrato editorial de altísimo nivel, comparable a una campaña de revista GQ. Cámara full-frame de alta gama, lente 85mm f/1.4. Piel con textura real y visible: poros, brillo natural, vello facial individual, sin suavizado plástico. Expresión facial genuina y matizada, catchlights nítidos en los ojos. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cinematográfico, contraste rico tipo Kodak Portra. Sin texto, sin logotipos, sin marcas de agua.`;

// Esta lección es sobre luz — el fondo carbón + 3 puntos estándar no aplica
// igual en todas las secciones porque el tema ES la luz. Se ajusta caso a
// caso mientras se mantiene fondo oscuro/neutro y el mismo protagonista.
const DIPTYCH = (left, right, extraStyle = '') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles primer plano de rostro y hombros, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste la misma camiseta negra. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${extraStyle} ${STYLE_BASE}`;

const SINGLE = (scene, shot, extraStyle = '') => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${extraStyle} ${STYLE_BASE}`;

const jobs = [
  {
    id: 'l6-0',
    prompt: DIPTYCH(
      'con el cuerpo girado en ángulo de tres cuartos y el rostro girado también hacia una ventana lateral, luz natural suave definiendo el volumen del rostro con sombras suaves',
      'el mismo ángulo de tres cuartos del cuerpo pero el rostro girado en contra de la ventana, luz plana y sin definición sobre el rostro',
      'Fondo de estudio color carbón con una ventana lateral fuera de cuadro como fuente de luz natural suave.',
    ),
  },
  {
    id: 'l6-1',
    prompt: SINGLE(
      'de rostro en ángulo de tres cuartos, iluminado desde un lado con un pequeño triángulo de luz claramente visible en la mejilla del lado sombreado bajo el ojo — el clásico "triángulo de Rembrandt"',
      'primer plano cerrado de rostro',
      'Esquema de iluminación de estudio: luz principal (key light) en softbox a 45° desde un lado, formando el triángulo de luz de Rembrandt en la mejilla opuesta. Fondo carbón oscuro.',
    ),
  },
  {
    id: 'l6-2',
    prompt: DIPTYCH(
      'con el mismo ángulo de cuerpo de tres cuartos, rostro girado hacia la fuente de luz, sombras suaves y planas sobre el rostro',
      'el mismo ángulo de cuerpo, rostro girado en contra de la fuente de luz, con contorno marcado y sombra definida en pómulo y mandíbula',
      'Luz de estudio lateral definida como fuente única, softbox a un lado del encuadre.',
    ),
  },
  {
    id: 'l6-3',
    prompt: SINGLE(
      'de pie junto a una ventana grande con luz natural entrando de lado, girando ligeramente la cabeza mientras la sombra de su nariz se proyecta sobre la mejilla, buscando el ángulo donde se forma un pequeño triángulo de luz',
      'plano medio de cuerpo junto a la ventana',
      'Interior con ventana grande de luz natural lateral suave como única fuente visible, resto del espacio en penumbra cálida.',
    ),
  },
  {
    id: 'l6-4',
    prompt: DIPTYCH(
      'con el rostro iluminado de frente directo con luz plana tipo ring light, sin sombras visibles, expresión y volumen del rostro aplanados',
      'el mismo rostro con luz angular de estudio desde un lado, mostrando volumen real y definición en pómulos y mandíbula, mucho más favorecedor',
      'Comparar iluminación plana frontal (izquierda) vs. iluminación angular de estudio de 45° (derecha).',
    ),
  },
  {
    id: 'l6-5',
    prompt: DIPTYCH(
      'bajo luz dura tipo sol directo de mediodía, con sombras de bordes duros y marcados bajo la barbilla y la nariz',
      'bajo luz difusa suave tipo día nublado, con transición gradual y suave de luz a sombra, sin bordes duros',
      'Fondo neutro exterior desenfocado en ambos paneles, contraste claro entre luz dura y luz difusa.',
    ),
  },
  {
    id: 'l6-6',
    prompt: DIPTYCH(
      'girado hacia la fuente de luz principal, rostro bien definido con buena separación de luces y sombras, sin sombras duras bajo los ojos',
      'girado en contra de la fuente de luz principal, rostro con sombras duras y poco favorecedoras bajo los ojos y la nariz',
      'Setup de verificación rápida antes de una sesión: misma luz de estudio lateral fija en ambos paneles, solo cambia hacia dónde gira el sujeto.',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 6 (luz) — poses-camara\n`);
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
