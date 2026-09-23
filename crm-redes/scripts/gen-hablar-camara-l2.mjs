#!/usr/bin/env node
// gen-hablar-camara-l2.mjs — Lección 2: "Mirar al lente, no a la pantalla" (8 imágenes)
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
    id: 'l2-0',
    prompt: DIPTYCH(
      'sosteniendo su celular en formato de grabación pero mirando hacia la pantalla del celular en vez del lente, vista de perfil, conexión visual rota',
      'sosteniendo su celular en formato de grabación mirando directamente al lente de la cámara, vista de perfil, conexión visual firme y directa',
    ),
  },
  {
    id: 'l2-1',
    prompt: SINGLE('sosteniendo su celular cerca del rostro, con un pequeño sticker circular colocado justo al lado del lente, señalando el sticker con un dedo de la otra mano como referencia visual para mirar ahí en vez de a la pantalla', 'primer plano de manos, celular y rostro parcial'),
  },
  {
    id: 'l2-2',
    prompt: SINGLE('primer plano extremo de sus ojos mirando directamente y con intensidad hacia la cámara, mirada penetrante y enfocada, catchlights nítidos y definidos', 'primer plano extremo cerrado solo en ojos y parte superior del rostro'),
  },
  {
    id: 'l2-3',
    prompt: SINGLE('hablando a cámara con total coherencia entre su mirada directa y firme, su postura abierta y su expresión — todo alineado en la misma dirección de comunicación segura y genuina', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-4',
    prompt: DIPTYCH(
      'con una mirada directa a cámara pero relajada, párpados naturales, parpadeando con normalidad, presencia cómoda',
      'con una mirada completamente fija y sin parpadear, ojos muy abiertos de forma antinatural, generando una sensación sutil de incomodidad',
      'primer plano de rostro y hombros',
    ),
  },
  {
    id: 'l2-5',
    prompt: DIPTYCH(
      'sosteniendo su celular muy cerca del rostro en un ángulo pronunciado hacia el lente, típico de grabación selfie',
      'de pie frente a una cámara en trípode a mayor distancia, ángulo hacia el lente mucho más sutil y natural',
      'plano medio de cuerpo mostrando la distancia al dispositivo',
    ),
  },
  {
    id: 'l2-6',
    prompt: DIPTYCH(
      'con los ojos moviéndose ligeramente de lado a lado como leyendo texto en una pantalla de teleprompter fuera de cuadro',
      'con los ojos completamente fijos y estables en el lente, línea ya memorizada, sin movimiento lateral de la mirada',
      'primer plano de rostro y hombros',
    ),
  },
  {
    id: 'l2-7',
    prompt: SINGLE('con su celular apoyado en un pequeño soporte grabando un clip corto, un punto marcado junto al lente como referencia, hablando con mirada firme y tono seguro hacia esa marca', 'plano medio de cuerpo con el celular en soporte visible'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (mirar al lente) — hablar-camara\n`);
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
