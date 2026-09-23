#!/usr/bin/env node
// gen-vestimenta-profesion-l2.mjs — Lección 2: "Reglas por sector" (9 imágenes)
// Nota: esta lección SÍ varía el vestuario a propósito entre secciones,
// porque el contenido enseña justamente cómo cambia el código de vestir
// por sector — es la única lección del curso donde el vestuario no es fijo.
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

const BASE = 'una mujer de unos 46 años, cabello liso oscuro recogido en un moño bajo pulcro, rasgos que sugieren ascendencia asiática-latina, piel clara';
const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${scene}. ${STYLE}`;
const DIPTYCH = (left, right, shot = 'plano medio de cuerpo, de la cintura hacia arriba') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre, mismo rostro y peinado en ambos. IZQUIERDA: ${BASE}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l2-0',
    prompt: SINGLE(`${BASE}, vistiendo una bata blanca de laboratorio sobre blusa clara, expresión de autoridad clínica calmada y confiable`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-1',
    prompt: SINGLE(`${BASE}, vistiendo ropa muy casual e informal (camiseta simple) en un contexto que claramente esperaba un vestuario más formal, expresión ligeramente insegura de sí misma`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-2',
    prompt: DIPTYCH(
      'vistiendo bata blanca de laboratorio sobre blusa clara, en un set con apariencia de contenido educativo clínico',
      'vistiendo un blazer formal sin bata, blusa clara, en un set con apariencia más personal y cercana',
    ),
  },
  {
    id: 'l2-3',
    prompt: SINGLE(`${BASE}, vistiendo un traje formal completo azul marino sobre camisa blanca, look de consistencia corporativa para sector legal, financiero o de seguros`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-4',
    prompt: SINGLE(`${BASE}, vistiendo su traje sastre burdeos característico sobre blusa blanca, expresión cálida y cercana — el "uniforme" reconocible de una marca personal de coaching o desarrollo personal`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-5',
    prompt: SINGLE(`${BASE}, vistiendo una prenda con textura y color expresivo pero cuidadosamente elegida — un suéter de punto grueso color mostaza sobre pantalón oscuro — vestuario creativo pero con intención, típico de fotografía o eventos`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-6',
    prompt: SINGLE(`${BASE}, vistiendo un cárdigan estructurado color crema sobre blusa blanca, un punto intermedio entre formalidad seria y cercanía accesible`, 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l2-7',
    prompt: DIPTYCH(
      'vistiendo su blazer burdeos completo sobre blusa blanca, look formal para una plataforma profesional',
      'con el mismo blazer quitado, solo la blusa blanca con mangas ligeramente enrolladas, look más relajado para una plataforma casual',
    ),
  },
  {
    id: 'l2-8',
    prompt: SINGLE(`${BASE}, vistiendo blusa blanca sin blazer, mangas ligeramente enrolladas, en una sala de juntas rodeada de un ambiente corporativo, expresión de total seguridad — rompiendo deliberadamente el código formal esperado y ganándose el respeto igual`, 'plano medio de cuerpo en ambiente de sala de juntas'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 2 (reglas por sector) — vestimenta-profesion\n`);
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
