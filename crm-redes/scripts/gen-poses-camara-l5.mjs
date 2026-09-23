#!/usr/bin/env node
// gen-poses-camara-l5.mjs — Lección 5: Serie de 5 poses seguras (9 imágenes)
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

const STYLE = `Fotografía de retrato editorial de altísimo nivel, comparable a una campaña de revista GQ o a un book corporativo ejecutivo premium. Esquema de iluminación de estudio de TRES PUNTOS explícito: luz principal (key light) en softbox octagonal grande a 45° sobre el eje de la cámara, produciendo un modelado tridimensional claro en el rostro con transición gradual y suave de luz a sombra (no plana, no frontal); luz de relleno (fill light) tenue del lado opuesto; luz de contorno (rim/hair light) detrás del sujeto que dibuja un borde dorado sutil separándolo del fondo. Fondo de estudio color carbón (#1a1a1a) con leve viñeta, desenfocado a f/2.8. Cámara full-frame de alta gama, lente 85mm f/1.4. Piel con textura real y visible: poros, brillo natural en zonas T, vello facial individual, sin suavizado plástico. Expresión facial genuina y matizada, NO mirada fija de maniquí, catchlights nítidos en los ojos. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cinematográfico cálido en luces / frío en sombras, contraste rico tipo Kodak Portra. Sin texto, sin logotipos, sin marcas de agua.`;

const SINGLE = (scene, shot) => `Genera una imagen. Fotografía editorial hiperrealista, formato horizontal 4:3, ${shot}. ${M}, ${scene}. ${STYLE}`;

const DIPTYCH = (left, right, shot = 'plano de cuerpo entero con zapatos visibles') => `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. En ambos paneles el hombre viste la misma camiseta negra. IZQUIERDA: ${M}, ${left}. DERECHA: el mismo hombre, mismo encuadre, ${right}. ${STYLE}`;

const jobs = [
  {
    id: 'l5-0',
    prompt: SINGLE('de pie con seguridad, en un set de estudio profesional, con expresión de autoridad tranquila — imagen que resume el repertorio de poses de esta lección, como portada de la serie', 'plano de cuerpo entero con zapatos visibles'),
  },
  {
    id: 'l5-1',
    prompt: SINGLE('retrato de cuerpo en ángulo de tres cuartos (30-45 grados), mirada directa a cámara, una mano en el bolsillo, postura erguida y segura — la pose de autoridad clásica para foto de perfil profesional', 'plano medio-americano, de la rodilla hacia arriba'),
  },
  {
    id: 'l5-2',
    prompt: SINGLE('caminando hacia un punto del encuadre con espacio vacío generoso delante de él en la dirección del movimiento, zancada natural a media distancia, capturado como en ráfaga con una sutil sensación de movimiento en la pierna trasera', 'plano de cuerpo entero, ligero desenfoque de movimiento en piernas'),
  },
  {
    id: 'l5-3',
    prompt: DIPTYCH(
      'sentado en el borde de un escritorio de madera oscura con un codo apoyado en la superficie, postura relajada y asimétrica, pierna cruzada casualmente',
      'sentado en la misma posición pero completamente derecho y rígido, sin apoyar el codo, postura simétrica y tensa',
      'plano medio de cuerpo sentado junto al escritorio',
    ),
  },
  {
    id: 'l5-4',
    prompt: SINGLE('primer plano de sus manos sosteniendo una laptop cerrada cerca del centro del encuadre, con el rostro desenfocado al fondo mirando hacia el objeto — plano de detalle de trabajo', 'primer plano de manos y objeto, rostro desenfocado al fondo'),
  },
  {
    id: 'l5-5',
    prompt: SINGLE('primer plano de rostro y hombros con los ojos alineados en el tercio superior del encuadre en vez de centrados verticalmente, dejando espacio de aire por debajo del rostro — composición de retrato cercano siguiendo la regla de los tercios', 'primer plano cerrado de rostro y hombros'),
  },
  {
    id: 'l5-6',
    prompt: SINGLE('de pie relajado en un set de estudio, con una actitud casual de "listo para varias opciones", expresión ligeramente sonriente y cómoda, como el momento de descanso entre distintas poses de una sesión', 'plano de cuerpo entero con zapatos visibles'),
  },
  {
    id: 'l5-7',
    prompt: SINGLE('de pie con una pose relajada y natural que claramente le sienta bien y se ve cómoda, contrastado con la sensación de que otras poses más forzadas quedaron descartadas — cuerpo suelto, sonrisa genuina, la pose "que funciona para su cuerpo"', 'plano de cuerpo entero con zapatos visibles'),
  },
  {
    id: 'l5-8',
    prompt: SINGLE('en movimiento fluido de transición entre dos poses distintas dentro de la misma sesión de fotos, como capturado a media transición, mostrando dinamismo y comodidad frente a cámara', 'plano de cuerpo entero, ligera sensación de movimiento'),
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
  console.log(`Generando ${jobs.length} imágenes de la Lección 5 (serie de poses) — poses-camara\n`);
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
