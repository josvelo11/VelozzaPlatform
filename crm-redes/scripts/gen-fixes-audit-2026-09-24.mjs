#!/usr/bin/env node
// gen-fixes-audit-2026-09-24.mjs — regenera 4 imágenes puntuales encontradas
// por la auditoría de 3 agentes en paralelo (2026-09-24):
//   - vestimenta-profesion l1-4, l2-2: cortadas a la altura de la cadera en
//     un curso donde el tema depende de ver cómo cae la ropa completa.
//   - sesion-preboda l3-0: el prompt original inyectaba el vestuario fijo de
//     M (terracota/crudo) justo antes de pedir "ambos vistiendo el mismo
//     blanco" — contradicción que hizo que saliera casi idéntica a l1-0 en
//     vez de ilustrar el error de vestuario que la lección enseña.
//   - poses-camara l1-5: no correspondía a lo documentado en secciones[5]
//     (secuencia de hombros subiendo/cayendo frente a espejo).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runImageGenJobs } from './lib/image-gen.mjs';
import { M as VP_M, STYLE as VP_STYLE } from './vestimenta-profesion-style.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_FORMACION = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections');
const ENV_LOCAL = path.join(__dirname, '..', '.env.local');

const SHOT_WIDE = 'plano entero de cuerpo completo, de pies a cabeza SIN CORTAR ninguna parte del cuerpo (ni pies, ni manos, ni la cabeza), composición editorial con espacio negativo arriba y abajo para que quepa la figura completa dentro del encuadre';

// --- vestimenta-profesion: l1-4 y l2-2, ahora en plano entero ---
const vpJobs = [
  {
    id: 'l1-4',
    prompt: `Genera una imagen. Fotografía editorial hiperrealista, formato vertical 4:5, ${SHOT_WIDE}. ${VP_M}, ajustándose un blazer que a pesar de verse costoso no le queda del todo bien en los hombros, expresión de leve insatisfacción notando el mal ajuste. ${VP_STYLE}`,
    aspectRatio: '4:5',
  },
  {
    id: 'l2-2',
    prompt: `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato vertical 4:5 total, ambos paneles ${SHOT_WIDE}, MISMA distancia de cámara y altura de encuadre, mismo rostro y peinado en ambos. IZQUIERDA: ${VP_M}, vistiendo bata blanca de laboratorio sobre blusa clara, en un set con apariencia de contenido educativo clínico. DERECHA: la misma mujer, mismo encuadre, vistiendo un blazer formal sin bata, blusa clara, en un set con apariencia más personal y cercana. ${VP_STYLE}`,
    aspectRatio: '4:5',
  },
];

// --- sesion-preboda: l3-0, sin inyectar el vestuario fijo de M (que contradecía la escena) ---
const PAREJA_IDENTIDAD = 'una pareja: ella de unos 27 años, cabello negro ondulado largo suelto, piel trigueña; él de unos 30 años, cabello corto oscuro, barba corta bien cuidada, piel trigueña';
const SP_STYLE = `Fotografía documental de compromiso (engagement session) hiperrealista de altísimo nivel, estilo editorial cálido y genuino, comparable a un fotógrafo de bodas boutique de alta gama. Exteriores naturales — campo abierto, jardín, sendero arbolado o costa — durante la hora dorada, luz cálida rasante de atardecer, destellos suaves de sol (lens flare) entre el follaje. Cámara full-frame de alta gama, lente 35mm o 50mm f/1.8-2, profundidad de campo suave, fondo con bokeh natural. Piel con textura real, sin suavizado plástico. Interacción física genuina entre la pareja — risa real, movimiento, miradas mutuas — nunca posados rígidos mirando ambos a cámara. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cálido tipo Kodak Portra, tonos dorados y verdes naturales. Sin texto, sin logotipos, sin marcas de agua.`;
const spJobs = [
  {
    id: 'l3-0',
    prompt: `Genera una imagen. Fotografía documental de compromiso editorial, formato horizontal 4:3, plano de cuerpo entero, fondo de campo abierto. ${PAREJA_IDENTIDAD}, ambos vistiendo exactamente el mismo tono de blanco roto de pies a cabeza (ella un vestido midi blanco, él camisa y pantalón blancos), sus siluetas fundiéndose visualmente en una sola masa contra un fondo de pasto claro, difícil distinguir dónde termina una silueta y empieza la otra. ${SP_STYLE}`,
    aspectRatio: '4:3',
  },
];

// --- poses-camara: l1-5, secuencia de hombros subiendo/cayendo frente a espejo ---
const PC_M = 'un hombre latino de unos 42 años, cabello corto oscuro con canas visibles en las sienes, barba corta y arreglada, piel trigueña, vistiendo SIEMPRE una camiseta negra de cuello redondo manga corta y pantalón oscuro — vestuario fijo, no debe cambiar de prenda ni de color';
const PC_STYLE = `Fotografía de retrato editorial de altísimo nivel, comparable a una campaña de revista GQ o a un book corporativo ejecutivo premium. Esquema de iluminación de estudio de TRES PUNTOS explícito: luz principal (key light) en softbox octagonal grande a 45° sobre el eje de la cámara, produciendo un modelado tridimensional claro en el rostro con transición gradual y suave de luz a sombra; luz de relleno (fill light) tenue del lado opuesto; luz de contorno (rim/hair light) detrás del sujeto que dibuja un borde dorado sutil separándolo del fondo. Fondo de estudio color carbón (#1a1a1a) con leve viñeta, desenfocado a f/2.8. Cámara full-frame de alta gama, lente 85mm f/1.4. Piel con textura real y visible: poros, brillo natural, vello facial individual, sin suavizado plástico. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cinematográfico cálido en luces / frío en sombras, contraste rico tipo Kodak Portra. Sin texto, sin logotipos, sin marcas de agua.`;
const pcJobs = [
  {
    id: 'l1-5',
    prompt: `Genera una imagen. Secuencia editorial de tres fotogramas en una sola imagen horizontal 4:3, cada fotograma mostrando al mismo hombre de pie frente a un espejo de cuerpo entero, plano medio hombros-cabeza. ${PC_M}. Fotograma 1 (izquierda): hombros subiendo tensos hacia las orejas. Fotograma 2 (centro): hombros a mitad de camino bajando. Fotograma 3 (derecha): hombros caídos en su punto de descanso natural, postura relajada — una flecha delgada dorada señalando ese punto de descanso en el fotograma 3. ${PC_STYLE}`,
    aspectRatio: '4:3',
  },
];

async function main() {
  await runImageGenJobs(vpJobs, { outDir: path.join(PUBLIC_FORMACION, 'vestimenta-profesion'), leccionLabel: 'fix vestimenta-profesion l1-4/l2-2', envLocalPath: ENV_LOCAL });
  await runImageGenJobs(spJobs, { outDir: path.join(PUBLIC_FORMACION, 'sesion-preboda'), leccionLabel: 'fix sesion-preboda l3-0', envLocalPath: ENV_LOCAL });
  await runImageGenJobs(pcJobs, { outDir: path.join(PUBLIC_FORMACION, 'poses-camara'), leccionLabel: 'fix poses-camara l1-5', envLocalPath: ENV_LOCAL });
}

main();
