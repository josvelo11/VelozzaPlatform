#!/usr/bin/env node
// gen-asesoria-imagen-l5.mjs — v2, Lección 5: Sistema visual repetible (6 img)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { LOOK_FORMAL, LOOK_EDITORIAL, LOOK_SOCIAL, SET_WINDOW, SET_URBAN, SET_DESK, SHOT_WIDE, SHOT_MEDIUM, SINGLE, DIPTYCH } from './asesoria-imagen-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');

const jobs = [
  {
    id: 'l5-0',
    ...DIPTYCH(
      `${LOOK_FORMAL}, bajo luz cálida dorada de atardecer, ${SET_WINDOW}`,
      `${LOOK_FORMAL}, bajo luz fría azulada de estudio con un fondo completamente distinto — mismo outfit, sensación visual disonante`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l5-1',
    ...SINGLE(
      `${LOOK_SOCIAL}, revisando el monitor de su cámara y ajustando manualmente la configuración de luz antes de grabar, en control absoluto de cada variable técnica de su set, ${SET_DESK}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l5-2',
    ...SINGLE(
      `${LOOK_SOCIAL}, junto a su monitor de referencia de color calibrado a la temperatura cálida de su marca, comparándola con su propio vestuario, ${SET_DESK}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l5-3',
    ...DIPTYCH(
      `${LOOK_EDITORIAL}, en un set con un fondo y luz distintos a su sistema habitual — versión de "este mes cambié todo otra vez"`,
      `${LOOK_EDITORIAL}, en su set habitual, consistente y reconocible — versión correcta`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l5-4',
    ...SINGLE(
      `${LOOK_SOCIAL}, escribiendo en una hoja de referencia física con los parámetros exactos de su sistema (altura de luz, temperatura, distancia de cámara) anotados con letra clara, ${SET_DESK}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l5-5',
    ...SINGLE(
      `${LOOK_EDITORIAL}, caminando con paso seguro y una leve sonrisa de satisfacción, la culminación visual de un sistema de marca personal resuelto y sostenido en el tiempo, ${SET_URBAN}`,
      SHOT_WIDE,
    ),
  },
];

await runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 5 (sistema visual repetible) — asesoria-imagen', envLocalPath: path.join(__dirname, '..', '.env.local') });
