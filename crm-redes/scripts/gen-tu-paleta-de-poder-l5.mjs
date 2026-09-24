#!/usr/bin/env node
// gen-tu-paleta-de-poder-l5.mjs — Lección 5 (Combina color y forma: tu clóset cápsula con intención)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { SINGLE, SET_CLOSET, SET_MIRROR } from './tu-paleta-de-poder-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'tu-paleta-de-poder');
const ENV_LOCAL = path.join(__dirname, '..', '.env.local');

const jobs = [
  { id: 'l5-0', ...SINGLE(`de pie ${SET_CLOSET}, rodeada de prendas en colores y estilos que no se relacionan entre sí, expresión de leve agobio revisando el perchero, plano entero de cuerpo completo`) },
  { id: 'l5-1', ...SINGLE(`de pie ${SET_CLOSET} ahora organizado con prendas en una paleta coherente de neutros y 2-3 colores de acento, alcanzando una prenda con expresión satisfecha, plano entero de cuerpo completo`) },
  { id: 'l5-2', ...SINGLE('sentada junto a una cama con varias prendas extendidas sobre el cubrecama en una paleta coordinada, combinando piezas con las manos, ángulo amplio mostrando cuerpo completo y la composición de prendas', 'plano de cuerpo completo en ángulo amplio, cámara ligeramente elevada mostrando tanto a la mujer como las prendas extendidas') },
  { id: 'l5-3', ...SINGLE(`${SET_MIRROR}, sosteniendo una muestra de tela cerca de su rostro con ambas manos comparando el efecto en su piel frente al espejo, expresión concentrada, plano entero de cuerpo completo`) },
];

runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 5 — tu-paleta-de-poder', envLocalPath: ENV_LOCAL });
