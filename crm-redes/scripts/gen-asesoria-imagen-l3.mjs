#!/usr/bin/env node
// gen-asesoria-imagen-l3.mjs — v2, Lección 3: Grooming en cámara (7 img)
// Única lección donde el primer plano de rostro SÍ es el default correcto —
// el tema es literalmente detalle facial en cámara — pero se varía con planos
// medios en los momentos de "rutina"/"checklist" para no repetir 7 close-ups.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { LOOK_SOCIAL, SET_VANITY, SET_DESK, SHOT_MEDIUM, SHOT_CLOSE, SINGLE, DIPTYCH } from './asesoria-imagen-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');
const CLOSE_SHOT = 'primer plano de rostro y hombros';

const jobs = [
  {
    id: 'l3-0',
    ...DIPTYCH(
      'rostro visto a simple vista, relajado, bajo luz suave natural',
      'el mismo rostro bajo luz de cámara amplificando cada detalle de textura y brillo en la piel — foto de referencia técnica, no favorecedora a propósito, para ilustrar el efecto de amplificación de la cámara',
      CLOSE_SHOT,
    ),
  },
  {
    id: 'l3-1',
    ...DIPTYCH(
      'bajo una luz difusa y suave que envuelve el rostro sin puntos duros',
      'bajo una luz artificial dura y directa que genera un punto de brillo especular intenso y poco favorecedor en la frente',
      CLOSE_SHOT,
    ),
  },
  {
    id: 'l3-2',
    ...SINGLE(
      `${LOOK_SOCIAL}, haciendo una revisión final frente al espejo antes de grabar — chequeando piel, cabello y sonrisa con el aro de luz ya encendido detrás, ${SET_VANITY}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l3-3',
    ...SINGLE(
      `${LOOK_SOCIAL}, sosteniendo su teléfono en cámara frontal revisando su propio reflejo antes de grabar, ajustando un mechón de cabello con un dedo, ${SET_VANITY}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l3-4',
    ...SINGLE(
      `${LOOK_SOCIAL}, a mitad de una grabación de contenido con cámara y aro de luz visibles, tocándose el cabello de forma autoconsciente en un momento que la obligará a repetir la toma, ${SET_DESK}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l3-5',
    ...DIPTYCH(
      'con retoque digital visiblemente exagerado — piel completamente lisa y cerúlea, rasgos suavizados de forma artificial y poco natural',
      'con un cuidado natural y favorecedor — piel luminosa pero con textura real conservada, resultado cuidado sin verse artificial',
      CLOSE_SHOT,
    ),
  },
  {
    id: 'l3-6',
    ...DIPTYCH(
      'el mismo rostro capturado con la cámara frontal de un teléfono — detalle suavizado, colores más planos',
      'el mismo rostro capturado con una cámara réflex profesional — detalle nítido, textura de piel real y rango tonal mucho más amplio',
      CLOSE_SHOT,
    ),
  },
];

await runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 3 (grooming) — asesoria-imagen', envLocalPath: path.join(__dirname, '..', '.env.local') });
