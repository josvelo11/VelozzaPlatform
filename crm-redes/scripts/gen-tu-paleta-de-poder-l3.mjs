#!/usr/bin/env node
// gen-tu-paleta-de-poder-l3.mjs — Lección 3 (Contraste: por qué la misma prenda se ve distinta en ti que en tu amiga)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { SINGLE, SET_STUDIO, SET_MIRROR } from './tu-paleta-de-poder-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'tu-paleta-de-poder');
const ENV_LOCAL = path.join(__dirname, '..', '.env.local');

const jobs = [
  {
    id: 'l3-0',
    ...SINGLE(
      `Diptico editorial: dos mujeres latinas distintas de pie una junto a la otra, ambas vistiendo el mismo vestido rojo intenso idéntico, ${SET_STUDIO}, una de piel clara y cabello negro luciendo radiante, la otra de piel y cabello en tonos cercanos luciendo el mismo vestido con un efecto visual más plano — plano entero de cuerpo completo de ambas, misma distancia de cámara`,
      'plano entero de cuerpo completo de ambas figuras, de pies a cabeza, composición editorial con espacio para las dos',
    ),
  },
  { id: 'l3-1', ...SINGLE(`${SET_STUDIO}, retrato de cuerpo entero con iluminación que dibuja con suavidad la distancia tonal entre su piel y su cabello, mano cerca del rostro, expresión reflexiva`) },
  {
    id: 'l3-2',
    ...SINGLE(
      `Diptico editorial dividido en dos mitades: IZQUIERDA una mujer latina de piel clara y cabello negro azabache (alto contraste) vistiendo un conjunto blanco y negro en bloques definidos, expresión segura. DERECHA una mujer latina distinta de piel y cabello en tonos castaños cercanos entre sí (bajo contraste) vistiendo un look monocromático tonal en varios tonos de la misma familia cálida, expresión serena. Ambos paneles plano entero de cuerpo completo, ${SET_STUDIO}`,
      'plano entero de cuerpo completo en ambos paneles',
    ),
  },
  { id: 'l3-3', ...SINGLE(`${SET_MIRROR}, de pie comparando visualmente el tono de su propio cabello contra su piel con la mano cerca del rostro, luz natural de ventana, expresión concentrada`) },
];

runImageGenJobs(jobs, { outDir: OUT_DIR, leccionLabel: 'Lección 3 — tu-paleta-de-poder', envLocalPath: ENV_LOCAL });
