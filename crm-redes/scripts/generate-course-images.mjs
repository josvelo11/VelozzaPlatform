#!/usr/bin/env node
// ============================================================================
//  generate-course-images.mjs — genera una imagen ilustrada por cada sección
//  (##) de cada lección del catálogo de Mini Cursos, usando Gemini 3.1 Flash
//  Image. Cada llamada tiene costo real (~$0.067 USD c/u) — por eso este
//  script SIEMPRE se corre primero con --dry-run para confirmar el total
//  antes de gastar un centavo, y se salta imágenes que ya existen (para que
//  correrlo de nuevo tras una falla no vuelva a pagar por lo ya generado).
//
//  Requiere GEMINI_API_KEY en el entorno.
//
//  Uso:
//    node scripts/generate-course-images.mjs --dry-run
//    node scripts/generate-course-images.mjs --course=hablar-camara --limit=2
//    node scripts/generate-course-images.mjs
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Falta GEMINI_API_KEY en el entorno.');
  process.exit(1);
}

const MODEL = 'gemini-3.1-flash-image';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections');
const COST_PER_IMAGE_USD = 0.067;
const COP_PER_USD = 4200;

const STYLE_LOCK = `Minimalist abstract editorial illustration, pure vector/flat line-art style, gold linework on a solid near-black background. Use ONLY these colors: gold (#d4af37), light gold (#f4cf63), cream/off-white (#f8f5ed), and black/near-black (#0b0b0b) — no other hues whatsoever, no blue, no red, no green, no purple. Geometric, confident, minimal negative space, premium editorial magazine quality — comparable to Stripe's or Linear's illustration style, like a consistent icon/diagram system rather than a storybook. No text, no watermark, no logos, no clip-art. STRICT rule on people: if a person appears, render them ONLY as a faceless silhouette or outline shape (solid fill or line-art contour) — absolutely NO drawn facial features (no eyes, eyebrows, nose, mouth, individual hair strands) and NO cartoon/flat-illustration character style. Prefer abstract symbols, geometric icons, and faceless silhouettes over literal character scenes wherever the concept allows it. 16:9 aspect ratio.`;

function buildPrompt(visual) {
  return `${STYLE_LOCK}\n\nSpecific scene to depict for this illustration: ${visual}`;
}

function extFromMime(mime) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

async function generateOne(visual, outPathNoExt, attempt = 1) {
  const body = {
    contents: [{ parts: [{ text: buildPrompt(visual) }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  const data = await res.json();
  if (!res.ok) {
    if (attempt < 3 && (res.status === 429 || res.status >= 500)) {
      const wait = attempt * 6000;
      console.warn(`  reintentando en ${wait / 1000}s (status ${res.status})...`);
      await new Promise((r) => setTimeout(r, wait));
      return generateOne(visual, outPathNoExt, attempt + 1);
    }
    throw new Error(`API error ${res.status}: ${data.error?.message || JSON.stringify(data).slice(0, 300)}`);
  }
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error('Respuesta sin imagen: ' + JSON.stringify(data).slice(0, 300));
  const ext = extFromMime(part.inlineData.mimeType);
  const outPath = `${outPathNoExt}.${ext}`;
  const bytes = Buffer.from(part.inlineData.data, 'base64');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, bytes);
  return { outPath, bytes: bytes.length, tokens: data.usageMetadata?.totalTokenCount || 0 };
}

function alreadyExists(outPathNoExt) {
  for (const ext of ['jpg', 'png', 'webp']) {
    if (fs.existsSync(`${outPathNoExt}.${ext}`)) return true;
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const courseFilter = args.find((a) => a.startsWith('--course='))?.split('=')[1];
  const limit = Number(args.find((a) => a.startsWith('--limit='))?.split('=')[1] || Infinity);

  const { COURSES_CATALOG } = await import('../courses-catalog.js');

  let jobs = [];
  for (const course of COURSES_CATALOG) {
    if (courseFilter && course.id !== courseFilter) continue;
    for (const leccion of course.lecciones) {
      const secciones = leccion.secciones || [];
      secciones.forEach((s, i) => {
        if (!s.visual) return;
        jobs.push({
          courseId: course.id,
          leccionId: leccion.id,
          index: i,
          visual: s.visual,
          titulo: s.titulo,
          outPathNoExt: path.join(OUT_DIR, course.id, `${leccion.id}-${i}`),
        });
      });
    }
  }
  jobs = jobs.slice(0, limit);
  const pending = jobs.filter((j) => !alreadyExists(j.outPathNoExt));

  console.log(`Total de secciones con 'visual': ${jobs.length}`);
  console.log(`Ya generadas (se saltan): ${jobs.length - pending.length}`);
  console.log(`Por generar ahora: ${pending.length}`);
  const estCostUSD = pending.length * COST_PER_IMAGE_USD;
  console.log(`Costo estimado de esta corrida: ~$${estCostUSD.toFixed(2)} USD (~${Math.round(estCostUSD * COP_PER_USD).toLocaleString('es-CO')} COP)`);

  if (dryRun) {
    console.log('\n(--dry-run: no se generó nada)');
    return;
  }

  let ok = 0;
  const failed = [];
  for (const job of pending) {
    try {
      const r = await generateOne(job.visual, job.outPathNoExt);
      ok++;
      console.log(`[${ok}/${pending.length}] ${job.courseId}/${job.leccionId}-${job.index} OK (${r.bytes} bytes → ${r.outPath})`);
    } catch (e) {
      console.error(`[FALLÓ] ${job.courseId}/${job.leccionId}-${job.index}: ${e.message}`);
      failed.push(job);
    }
    await new Promise((r) => setTimeout(r, 2500));
  }

  console.log(`\nListo: ${ok}/${pending.length} generadas. ${failed.length} fallidas.`);
  if (failed.length) {
    console.log('Fallidas (correr el script de nuevo las reintentará, ya que no quedaron guardadas):');
    failed.forEach((f) => console.log(`  - ${f.courseId}/${f.leccionId}-${f.index}: ${f.visual.slice(0, 80)}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
