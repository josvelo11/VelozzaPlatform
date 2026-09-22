#!/usr/bin/env node
// ============================================================================
//  gen-poses-camara-l3.mjs — genera l3-1 a l3-8 (Lección 3: manos) con el
//  estilo v5 aprobado por David: mismo protagonista de la Lección 3+
//  (camiseta negra, pantalón oscuro, cuerpo entero con zapatos), esquema de
//  luz de 3 puntos, expresión facial genuina. l3-0 ya se generó y aprobó
//  aparte (promovida directo a producción).
//
//  Requiere GEMINI_API_KEY en crm-redes/.env.local (ya guardada).
// ============================================================================
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

const STYLE = `Fotografía de retrato editorial de altísimo nivel, comparable a una campaña de revista GQ o a un book corporativo ejecutivo premium. Esquema de iluminación de estudio de TRES PUNTOS explícito: luz principal (key light) en softbox octagonal grande a 45° sobre el eje de la cámara, produciendo un modelado tridimensional claro en el rostro con transición gradual y suave de luz a sombra (no plana, no frontal); luz de relleno (fill light) tenue del lado opuesto que abre ligeramente las sombras sin eliminarlas; luz de contorno (rim/hair light) detrás del sujeto que dibuja un borde dorado sutil separándolo del fondo. Fondo de estudio color carbón (#1a1a1a) con leve viñeta, desenfocado a f/2.8. Cámara full-frame de alta gama, lente 85mm f/1.4. Piel con textura real y visible: poros, brillo natural en zonas T, vello facial individual, sin suavizado plástico. Expresión facial genuina y matizada, NO mirada fija de maniquí: tensión sutil real en cejas y músculos faciales, catchlights nítidos en los ojos. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cinematográfico cálido en luces / frío en sombras, contraste rico tipo Kodak Portra. Sin texto, sin logotipos, sin marcas de agua.`;

const DIPTYCH = (left, right) => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3. Ambos paneles con la MISMA distancia de cámara y altura de encuadre, como dos fotos consecutivas del mismo photoshoot. En ambos paneles el hombre viste exactamente la misma ropa (camiseta negra descrita abajo). IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, misma camiseta negra, mismo encuadre exacto, ${right}. ${STYLE}`;

const SINGLE = (scene, shot = 'plano medio, de la cintura hacia arriba') => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;

const jobs = [
  {
    id: 'l3-1',
    prompt: SINGLE('con el rostro sonriendo con calma y serenidad, mientras sostiene las manos entrelazadas al frente con los nudillos visiblemente tensos y blancos por la presión — contraste entre un rostro calmado y unas manos que delatan nerviosismo', 'primer plano de rostro, hombros y manos entrelazadas al frente, cuerpo entero no necesario aquí'),
  },
  {
    id: 'l3-2',
    prompt: SINGLE('de pie, de cuerpo entero con zapatos visibles, con el pulgar de una mano metido casualmente en el bolsillo del pantalón y la otra mano relajada, postura segura y natural — la pose de manos más versátil y fácil de replicar', 'plano de cuerpo entero, cabeza a zapatos'),
  },
  {
    id: 'l3-3',
    prompt: DIPTYCH(
      'primer plano de una sola mano con los dedos completamente rectos, extendidos y tensos, en tensión visible',
      'primer plano de la misma mano, ahora con los dedos ligeramente curvados y relajados, como sosteniendo suavemente un huevo invisible',
    ) + ' Encuadre de ambos paneles: primer plano cerrado solo en la mano y antebrazo, fondo carbón desenfocado.',
  },
  {
    id: 'l3-4',
    prompt: SINGLE('sosteniendo una taza de café de cerámica oscura con ambas manos de forma relajada y natural frente al torso, el resto del cuerpo visiblemente más suelto y cómodo que en una pose sin objeto en las manos', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l3-5',
    prompt: SINGLE('de pie frente a un espejo de cuerpo entero en un vestidor con luz cálida, mirando su propio reflejo mientras practica una pose con las manos, expresión concentrada y consciente de su lenguaje corporal', 'plano de cuerpo entero incluyendo el espejo y su reflejo'),
  },
  {
    id: 'l3-6',
    prompt: SINGLE('a medio gesto llevando la mano hacia su propio cabello para acomodarlo, en un momento candid tipo backstage de sesión de fotos, gesto nervioso y repetitivo capturado en el instante', 'plano medio de cuerpo, de la cintura hacia arriba'),
  },
  {
    id: 'l3-7',
    prompt: DIPTYCH(
      'de pie con los brazos completamente rectos y pegados a ambos costados del cuerpo, postura rígida y poco favorecedora',
      'de pie con ambas manos metidas simultáneamente en los bolsillos del pantalón, hombros encogidos hacia adelante, postura cerrada',
    ) + ' Ambos paneles plano de cuerpo entero con zapatos visibles.',
  },
  {
    id: 'l3-8',
    prompt: DIPTYCH(
      'con una mano apoyada suavemente cerca de la mejilla y la mandíbula, la mirada del espectador es guiada naturalmente desde la mano hasta los ojos del sujeto',
      'con una mano suelta y alejada del cuerpo hacia un lado, fuera del encuadre central, que distrae la mirada del espectador lejos del rostro',
    ) + ' Ambos paneles plano medio de cuerpo, de la cintura hacia arriba, mostrando claramente la mano y el rostro.',
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 3 (manos) — poses-camara\n`);
  let ok = 0;
  for (const job of jobs) {
    const outPath = path.join(OUT_DIR, `${job.id}.jpg`);
    if (fs.existsSync(outPath)) { console.log(`[skip] ${job.id} ya existe`); continue; }
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
