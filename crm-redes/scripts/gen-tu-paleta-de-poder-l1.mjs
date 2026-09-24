#!/usr/bin/env node
// gen-tu-paleta-de-poder-l1.mjs — portada + Lección 1 (El error real detrás de "ese color no te queda")
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { SINGLE, DIPTYCH, LOOK_INVIERNO, LOOK_OTONO, SET_STUDIO, SET_CLOSET, SET_MIRROR } from './tu-paleta-de-poder-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'tu-paleta-de-poder');
const COVER_DIR = path.join(__dirname, '..', '..', 'public', 'formacion');
const ENV_LOCAL = path.join(__dirname, '..', '.env.local');

const coverJob = [
  { id: 'tu-paleta-de-poder', ...SINGLE(`de pie ${SET_STUDIO}, ${LOOK_INVIERNO}, sonrisa cálida y segura mirando a cámara — imagen de portada del curso de colorimetría personal y contextura corporal`) },
];

const jobs = [
  { id: 'l1-0', ...SINGLE(`de pie ${SET_CLOSET}, mirando una prenda colgada con expresión de leve desconcierto, sujetándola contra su cuerpo sin decidirse`) },
  {
    id: 'l1-1',
    ...DIPTYCH(
      `${LOOK_INVIERNO}, de pie ${SET_STUDIO}, piel luminosa y despierta, sonrisa radiante`,
      `vistiendo un top en un tono mostaza apagado que choca visiblemente con su subtono, piel con aspecto ligeramente cetrino y cansado bajo los ojos, misma pose y expresión neutra`,
    ),
  },
  { id: 'l1-2', ...SINGLE(`${SET_MIRROR}, sosteniendo su propia muñeca cerca del rostro examinando sus venas con atención, luz natural de ventana`) },
  { id: 'l1-3', ...SINGLE(`${SET_MIRROR}, sosteniendo dos telas junto a su rostro con ambas manos — una blanca pura y una color hueso — comparando el efecto en su piel frente al espejo`) },
  { id: 'l1-4', ...SINGLE(`de pie ${SET_CLOSET}, ${LOOK_OTONO}, tomando con seguridad una prenda de su familia de color, expresión satisfecha y resuelta`) },
];

async function main() {
  await runImageGenJobs(coverJob, { outDir: COVER_DIR, leccionLabel: 'portada — tu-paleta-de-poder', envLocalPath: ENV_LOCAL });
  await runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 1 — tu-paleta-de-poder', envLocalPath: ENV_LOCAL });
}

main();
