#!/usr/bin/env node
// gen-asesoria-imagen-l2.mjs — v2, Lección 2: Uniforme de marca personal (8 img)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { LOOK_FORMAL, LOOK_SOCIAL, LOOK_EDITORIAL, SET_STUDIO, SET_VANITY, SET_DESK, SHOT_WIDE, SINGLE, DIPTYCH } from './asesoria-imagen-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');

const jobs = [
  {
    id: 'l2-0',
    ...DIPTYCH(
      'de pie frente a un clóset caótico y sobrecargado de ropa desordenada, expresión ligeramente abrumada',
      'de pie frente a un clóset pequeño y perfectamente ordenado con solo 3 combinaciones completas colgadas (un conjunto sastre marfil, un abrigo camel, un vestido negro), expresión calmada y satisfecha',
      SHOT_WIDE,
    ),
  },
  {
    id: 'l2-1',
    ...SINGLE(
      `${LOOK_EDITORIAL}, de pie frente a una pared con una cuadrícula de miniaturas de su propio contenido, todas compartiendo la misma paleta cálida marfil/camel/dorado — reconocibles a simple vista como suyas, ${SET_DESK}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l2-2',
    ...SINGLE(
      `${LOOK_SOCIAL}, de pie frente a un clóset abarrotado revisando su reloj con expresión de agotamiento mental, la indecisión de tener demasiadas opciones visible en su rostro`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l2-3',
    ...SINGLE(
      `${LOOK_FORMAL}, sentada frente a una cámara y un aro de luz encendido, en plena grabación de contenido, su vestuario de marca instantáneamente reconocible, ${SET_DESK}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l2-4',
    ...SINGLE(
      `${LOOK_EDITORIAL}, de pie junto a un perchero con exactamente sus tres looks de marca (marfil, camel, negro) exhibidos ordenadamente, señalando cada uno con un gesto de enseñanza, ${SET_STUDIO}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l2-5',
    ...SINGLE(
      `${LOOK_SOCIAL}, sosteniendo en ganchos dos piezas coordinadas de su paleta de marca, examinándolas con atención antes de elegir, ${SET_VANITY}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l2-6',
    ...DIPTYCH(
      `${LOOK_FORMAL} con los aretes statement dorados geométricos`,
      `${LOOK_FORMAL} pero con un pañuelo de seda color crudo anudado al cuello en vez de los aretes — la misma base, una sola variable cambiada`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l2-7',
    ...SINGLE(
      `${LOOK_EDITORIAL}, probándose frente al espejo una pieza nueva y elevada que aún no forma parte de su uniforme, decidiendo con intención si incorporarla, ${SET_VANITY}`,
      SHOT_WIDE,
    ),
  },
];

await runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 2 (uniforme de marca) — asesoria-imagen', envLocalPath: path.join(__dirname, '..', '.env.local') });
