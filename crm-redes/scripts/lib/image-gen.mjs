// crm-redes/scripts/lib/image-gen.mjs — helper compartido para los scripts
// gen-<curso>-l{N}.mjs del proyecto Formación Plus (imágenes hiperrealistas).
//
// Centraliza: llamada a la API de Gemini con reintentos, guard de "ya existe",
// y compresión automática con `sips` inmediatamente después de escribir cada
// imagen (mismo estándar que la galería de bodas: -Z 2200 -s formatOptions 82,
// ver AGENTS.md § "Galería de fotos reales"). Antes de este helper, los ~50
// scripts gen-*.mjs escribían el JPEG crudo de la API sin comprimir
// (~2.5-3.8MB por imagen, ~788MB en 285 archivos) — causaba carga lenta real
// en producción. Usar SIEMPRE este helper para cualquier script nuevo en vez
// de copiar el boilerplate viejo de generateOne()/fetch() a mano.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const MODEL = 'gemini-3.1-flash-image';
const MIN_SIZE_BYTES = 300000; // guard de "ya existe" — post-compresión los archivos pesan ~400KB-1.2MB

function compressInPlace(filePath) {
  execFileSync('sips', ['-Z', '2200', '-s', 'formatOptions', '82', filePath, '--out', filePath], { stdio: 'ignore' });
}

async function generateOne({ apiKey, prompt, outPath, aspectRatio = '4:3' }, attempt = 1) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'], imageConfig: { imageSize: '2K', aspectRatio } },
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  const data = await res.json();
  if (!res.ok) {
    if (attempt < 3 && (res.status === 429 || res.status >= 500)) {
      const wait = attempt * 8000;
      console.warn(`  reintentando en ${wait / 1000}s (status ${res.status})...`);
      await new Promise((r) => setTimeout(r, wait));
      return generateOne({ apiKey, prompt, outPath, aspectRatio }, attempt + 1);
    }
    throw new Error(`API error ${res.status}: ${data.error?.message || JSON.stringify(data).slice(0, 300)}`);
  }
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error('Respuesta sin imagen: ' + JSON.stringify(data).slice(0, 300));
  const rawBytes = Buffer.from(part.inlineData.data, 'base64');
  fs.writeFileSync(outPath, rawBytes);
  const rawSize = rawBytes.length;
  compressInPlace(outPath);
  const finalSize = fs.statSync(outPath).size;
  return { outPath, rawSize, finalSize };
}

// jobs: [{ id, prompt, aspectRatio? }]. outDir: carpeta destino. leccionLabel: para el log.
export async function runImageGenJobs(jobs, { outDir, leccionLabel, envLocalPath }) {
  const envLocal = fs.readFileSync(envLocalPath, 'utf8');
  const apiKey = envLocal.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
  if (!apiKey) { console.error('Falta GEMINI_API_KEY en .env.local'); process.exit(1); }

  console.log(`Generando ${jobs.length} imágenes${leccionLabel ? ` de ${leccionLabel}` : ''}\n`);
  let ok = 0;
  for (const job of jobs) {
    const outPath = path.join(outDir, `${job.id}.jpg`);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > MIN_SIZE_BYTES) {
      console.log(`[skip] ${job.id} ya existe`);
      continue;
    }
    try {
      const r = await generateOne({ apiKey, prompt: job.prompt, outPath, aspectRatio: job.aspectRatio });
      ok++;
      console.log(`[${ok}/${jobs.length}] ${job.id} OK (${(r.rawSize / 1024).toFixed(0)}KB → ${(r.finalSize / 1024).toFixed(0)}KB comprimido)`);
    } catch (e) {
      console.error(`[FALLÓ] ${job.id}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log(`\nListo: ${ok} generadas.`);
  return ok;
}
