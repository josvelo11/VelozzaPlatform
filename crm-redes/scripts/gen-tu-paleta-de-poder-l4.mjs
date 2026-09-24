#!/usr/bin/env node
// gen-tu-paleta-de-poder-l4.mjs — Lección 4 (Tu contextura: la línea que te favorece)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { SINGLE, SILHOUETTE_DIPTYCH, SET_MIRROR } from './tu-paleta-de-poder-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'tu-paleta-de-poder');
const ENV_LOCAL = path.join(__dirname, '..', '.env.local');

const jobs = [
  { id: 'l4-0', ...SINGLE(`${SET_MIRROR}, vistiendo una prenda holgada y sin forma, expresión de incertidumbre frente al espejo, plano entero de cuerpo completo`) },
  {
    id: 'l4-1',
    ...SINGLE(
      'Diagrama editorial minimalista sobre fondo crema liso: una silueta femenina sin rostro de cuerpo completo, con tres líneas ilustradas superpuestas en color dorado — una línea vertical continua, una línea curva marcando la cintura, y una línea horizontal de balance en los hombros. Estilo ilustrativo limpio, sin texto.',
      'diagrama de cuerpo completo',
    ),
  },
  { id: 'l4-2', ...SILHOUETTE_DIPTYCH('una silueta femenina sin rostro con hombros y cadera de ancho similar y cintura marcada (reloj de arena), con una línea dorada curva resaltando un cinturón en la cintura natural', 'una silueta femenina sin rostro con hombros, cintura y cadera de ancho similar (rectángulo), con una línea dorada curva ilustrando un peplum que crea la ilusión de cintura') },
  { id: 'l4-3', ...SILHOUETTE_DIPTYCH('una silueta femenina sin rostro con cadera más ancha que los hombros (triángulo/pera), con volumen y color dorado resaltado en la zona de hombros y escote', 'una silueta femenina sin rostro con hombros más anchos que la cadera (triángulo invertido), con volumen y color dorado resaltado en la zona de la falda y cadera') },
  { id: 'l4-4', ...SINGLE(`de pie ${SET_MIRROR}, vistiendo un blazer largo color camel abierto sin cerrar sobre un body negro y pantalón negro, creando una sola línea vertical continua de arriba a abajo, expresión segura y erguida, plano entero de cuerpo completo frente al espejo`) },
];

runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 4 — tu-paleta-de-poder', envLocalPath: ENV_LOCAL });
