#!/usr/bin/env node
// gen-asesoria-imagen-l3.mjs — v2.1, Lección 3: Grooming en cámara (7 img)
// Corrección 23 sept: v2 usaba primer plano de rostro como default en esta
// lección (razonamiento: el tema es detalle facial). Feedback directo de
// David: NUNCA primer plano en este curso, ni aquí — plano abierto de cuerpo
// completo siempre, sin excepción, para que se vea toda la ropa/estética.
// Reinterpretadas todas las escenas para transmitir el concepto de grooming
// (luz, textura, dispositivo) sin recurrir a un encuadre cerrado.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { LOOK_SOCIAL, SET_VANITY, SET_DESK, SINGLE, DIPTYCH } from './asesoria-imagen-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');

const jobs = [
  {
    id: 'l3-0',
    ...DIPTYCH(
      `${LOOK_SOCIAL}, de pie relajada bajo luz suave natural de ventana, aspecto favorecedor y natural`,
      `${LOOK_SOCIAL}, de pie bajo la luz directa de una cámara de grabación que amplifica cada detalle de textura y brillo en la piel del rostro — imagen de referencia técnica, deliberadamente menos favorecedora, para ilustrar el efecto de amplificación de la cámara`,
    ),
  },
  {
    id: 'l3-1',
    ...DIPTYCH(
      `${LOOK_SOCIAL}, de pie bajo una luz difusa y suave tipo softbox grande que envuelve toda la figura sin puntos duros`,
      `${LOOK_SOCIAL}, de pie bajo una luz artificial dura y directa de un solo punto que genera un brillo especular intenso y poco favorecedor en la frente, visible incluso a la distancia`,
    ),
  },
  {
    id: 'l3-2',
    ...SINGLE(
      `${LOOK_SOCIAL}, de pie haciendo una revisión final de cuerpo completo frente a un espejo de cuerpo entero antes de grabar — chequeando piel, cabello y sonrisa con el aro de luz ya encendido detrás, ${SET_VANITY}`,
    ),
  },
  {
    id: 'l3-3',
    ...SINGLE(
      `${LOOK_SOCIAL}, de pie sosteniendo su teléfono en cámara frontal revisando su propio reflejo de cuerpo completo antes de grabar, ajustando un mechón de cabello con un dedo, ${SET_VANITY}`,
    ),
  },
  {
    id: 'l3-4',
    ...SINGLE(
      `${LOOK_SOCIAL}, de pie a mitad de una grabación de contenido con cámara y aro de luz visibles a su lado, tocándose el cabello de forma autoconsciente en un momento que la obligará a repetir la toma, ${SET_DESK}`,
    ),
  },
  {
    id: 'l3-5',
    ...DIPTYCH(
      `${LOOK_SOCIAL}, de pie con retoque digital visiblemente exagerado en todo el cuerpo — piel completamente lisa y cerúlea, rasgos suavizados de forma artificial y poco natural`,
      `${LOOK_SOCIAL}, de pie con un cuidado natural y favorecedor — piel luminosa pero con textura real conservada, resultado cuidado sin verse artificial`,
    ),
  },
  {
    id: 'l3-6',
    ...DIPTYCH(
      `${LOOK_SOCIAL}, de pie, capturada como con la cámara frontal de un teléfono — detalle suavizado, colores más planos, ligera distorsión de gran angular`,
      `${LOOK_SOCIAL}, de pie, capturada como con una cámara réflex profesional — detalle nítido, textura de tela y piel real, rango tonal mucho más amplio`,
    ),
  },
];

await runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 3 (grooming) — asesoria-imagen', envLocalPath: path.join(__dirname, '..', '.env.local') });
