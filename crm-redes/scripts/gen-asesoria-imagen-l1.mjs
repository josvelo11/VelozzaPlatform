#!/usr/bin/env node
// gen-asesoria-imagen-l1.mjs — v2, Lección 1: Diagnóstico (8 img + portada)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { M, LOOK_FORMAL, LOOK_SOCIAL, LOOK_EDITORIAL, SET_STUDIO, SET_WINDOW, SET_VANITY, SET_DESK, STYLE_BASE, SHOT_WIDE, SHOT_MEDIUM, SINGLE, DIPTYCH } from './asesoria-imagen-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'asesoria-imagen');

const jobs = [
  {
    id: 'cover',
    outDir: path.join(__dirname, '..', '..', 'public', 'formacion'),
    ...SINGLE(
      `${LOOK_FORMAL}, de pie con una mano en el bolsillo del pantalón, mirando directo a cámara con una media sonrisa segura y presencia editorial, ${SET_WINDOW}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l1-0',
    ...SINGLE(
      `${LOOK_SOCIAL}, sentada revisando un contact sheet impreso con 9 fotos de sí misma extendido sobre la mesa, lupa en mano, expresión crítica y analítica mientras las examina una por una`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l1-1',
    ...SINGLE(
      `${LOOK_SOCIAL}, sentada junto al ventanal desplazando fotos de sí misma en la pantalla de su teléfono, expresión pensativa y ligeramente autocrítica, ${SET_WINDOW}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l1-2',
    ...SINGLE(
      `${LOOK_FORMAL}, de pie en una pose editorial deliberada y estudiada — cada elemento de su imagen (postura, vestuario, mirada) proyectado con intención, ${SET_STUDIO}`,
      SHOT_WIDE,
    ),
  },
  {
    id: 'l1-3',
    ...SINGLE(
      `${LOOK_SOCIAL}, mirando su propio reflejo en el espejo circular con la mano en la barbilla, expresión reflexiva y evaluadora, ${SET_VANITY}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l1-4',
    ...SINGLE(
      `${LOOK_SOCIAL}, mostrando su teléfono a otra persona (solo el hombro y el brazo de la otra persona visibles, fuera de foco) que le da una opinión real y específica, ambas concentradas en la pantalla, en una cafetería luminosa de diseño minimalista`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l1-5',
    ...DIPTYCH(
      `${LOOK_FORMAL}, de pie frente a un fondo doméstico genérico y desordenado (estantería con objetos random, cables visibles) que contradice por completo lo pulido de su vestuario formal`,
      `${LOOK_FORMAL}, de pie frente a un fondo de set editorial coherente y intencional que refuerza su vestuario formal`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l1-6',
    ...SINGLE(
      `${LOOK_EDITORIAL}, ajustando con un gesto deliberado y preciso un solo detalle de su look — el cierre de un arete — frente al espejo, un único ajuste consciente en vez de cambiar todo, ${SET_VANITY}`,
      SHOT_MEDIUM,
    ),
  },
  {
    id: 'l1-7',
    ...SINGLE(
      `${LOOK_SOCIAL}, revisando un planner físico con fotos de distintos meses organizadas en una cuadrícula sobre el escritorio de mármol, comparando la coherencia visual a través del tiempo, ${SET_DESK}`,
      SHOT_MEDIUM,
    ),
  },
];

await runImageGenJobs(
  jobs.filter((j) => j.id !== 'cover'),
  { outDir: OUT_DIR, leccionLabel: 'Lección 1 (diagnóstico) — asesoria-imagen', envLocalPath: path.join(__dirname, '..', '.env.local') },
);
const coverJob = jobs.find((j) => j.id === 'cover');
await runImageGenJobs([{ ...coverJob, id: 'asesoria-imagen' }], {
  outDir: coverJob.outDir,
  leccionLabel: 'Portada — asesoria-imagen',
  envLocalPath: path.join(__dirname, '..', '.env.local'),
});
