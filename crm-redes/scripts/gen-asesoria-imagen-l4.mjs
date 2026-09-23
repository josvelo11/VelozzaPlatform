#!/usr/bin/env node
// gen-asesoria-imagen-l4.mjs — v2, Lección 4: Coherencia imagen/feed (7 img)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { LOOK_FORMAL, LOOK_EDITORIAL, LOOK_SOCIAL, SET_STUDIO, SET_URBAN, SET_DESK, SHOT_WIDE, SINGLE, DIPTYCH } from './asesoria-imagen-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');

const jobs = [
  {
    id: 'l4-0',
    ...SINGLE(
      `${LOOK_SOCIAL}, revisando en su tablet la cuadrícula de su perfil de Instagram, una foto en medio del feed rompiendo visiblemente la paleta cuidada del resto, expresión de "esto no encaja", ${SET_DESK}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l4-1',
    ...DIPTYCH(
      'mirando una pantalla con expresión calmada y de aprobación — lo que ve se siente coherente y ordenado',
      'mirando una pantalla con expresión de duda sutil, ligeramente desconcertada — algo se siente desalineado aunque no sepa nombrar exactamente qué',
      SHOT_WIDE,
    ),
  },
  {
    id: 'l4-2',
    ...SINGLE(
      `${LOOK_FORMAL}, de pie en un set cuyos tonos cálidos y dorados armonizan deliberadamente con su vestuario marfil, cada elemento del entorno reforzando su paleta de marca, ${SET_STUDIO}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l4-3',
    ...SINGLE(
      `${LOOK_SOCIAL}, con su laptop mostrando su cuadrícula de Instagram completa, evaluándola de forma objetiva y crítica desde cierta distancia, ${SET_DESK}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l4-4',
    ...DIPTYCH(
      'vistiendo un vestido en el mismo tono exacto y saturado de un logotipo de marca — combinación forzada y demasiado literal',
      `${LOOK_FORMAL} — su paleta marfil/dorado armoniza en temperatura y saturación sin copiar ningún color literalmente, resultado correcto y natural`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l4-5',
    ...SINGLE(
      `${LOOK_EDITORIAL}, caminando con paso seguro, la imagen completa de un sistema visual resuelto y sin fisuras, ${SET_URBAN}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l4-6',
    ...SINGLE(
      `${LOOK_SOCIAL}, drapeando una tela color crudo sobre un fondo doméstico genérico y colocando una planta al lado para elevarlo, transformando el espacio con un par de elementos simples`,
      SHOT_WIDE,
    ),
  },
];

await runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 4 (coherencia imagen/feed) — asesoria-imagen', envLocalPath: path.join(__dirname, '..', '.env.local') });
