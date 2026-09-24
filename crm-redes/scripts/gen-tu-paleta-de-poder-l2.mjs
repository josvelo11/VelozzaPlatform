#!/usr/bin/env node
// gen-tu-paleta-de-poder-l2.mjs — Lección 2 (Tu estación de color: encuentra tu paleta real)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { SINGLE, DIPTYCH, LOOK_INVIERNO, LOOK_VERANO, LOOK_OTONO, SET_STUDIO, SET_CLOSET, SET_MIRROR } from './tu-paleta-de-poder-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'tu-paleta-de-poder');
const ENV_LOCAL = path.join(__dirname, '..', '.env.local');

const PRIMAVERA_LOOK = 'vistiendo un conjunto de blusa color coral y pantalón crema, un collar dorado delicado, labial durazno luminoso — paleta cálida, clara y vívida';

const jobs = [
  { id: 'l2-0', ...SINGLE(`de pie ${SET_CLOSET}, rodeada de prendas de colores dispares sin relación entre sí, expresión de leve saturación visual mientras revisa el perchero`) },
  { id: 'l2-1', ...SINGLE(`${SET_STUDIO}, retrato editorial de cuerpo entero con iluminación limpia que resalta con suavidad el contraste natural entre su piel, cabello y ojos, expresión serena y directa a cámara`) },
  {
    id: 'l2-2',
    ...DIPTYCH(
      `${LOOK_INVIERNO}, de pie ${SET_STUDIO}, expresión de seguridad marcada, alto contraste visual en el conjunto`,
      `${LOOK_VERANO}, de pie ${SET_STUDIO}, expresión suave y serena, paleta fría empolvada de bajo contraste`,
    ),
  },
  {
    id: 'l2-3',
    ...DIPTYCH(
      `${LOOK_OTONO}, de pie ${SET_STUDIO}, expresión cálida y terrosa, paleta profunda y rica`,
      `${PRIMAVERA_LOOK}, de pie ${SET_STUDIO}, expresión luminosa y fresca, paleta clara y vívida`,
    ),
  },
  { id: 'l2-4', ...SINGLE(`${SET_MIRROR}, sosteniendo varias prendas de su propio clóset contra su cuerpo una tras otra, comparándolas frente al espejo con expresión concentrada`) },
];

runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 2 — tu-paleta-de-poder', envLocalPath: ENV_LOCAL });
