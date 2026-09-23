// asesoria-imagen-style.mjs — v2, rediseño de dirección de arte (2026-09-23).
// v1 (blazer crema + camiseta blanca, plano cerrado, fondo carbón fijo en TODA
// imagen) leía como foto corporativa de stock, no como consultora de imagen de
// marca personal sofisticada. Feedback real de David: "muy planas", "muchas
// imperfecciones en el rostro", "planos muy cerrados", "no se ve que sabe de
// asesoría de imagen... debe ser impactante, una mujer sofisticada que sabe de
// moda tanto formal como para redes sociales".
//
// v2: misma identidad/rostro (protagonista ya validada en 4 cursos), pero con
// un CAPSULE WARDROBE de 3 looks fijos (su propio "uniforme de marca" — coherente
// con la Lección 2 del curso, que es literalmente sobre esto), variedad real de
// planos/sets, luz editorial de revista en vez de estudio corporativo plano, y
// piel retocada nivel editorial (no textura cruda que se lee como imperfección).

export const M = 'una mujer latina de unos 31 años, cabello ondulado castaño oscuro con reflejos caramelo a la altura de los hombros, piel trigueña clara, rasgos definidos, complexión esbelta y postura erguida y segura';

// Paleta/uniforme de marca fijo: marfil, camel, negro, dorado — nunca fuera de
// esta paleta. Tres looks dentro del mismo sistema, rotan según la escena.
export const LOOK_FORMAL = 'vistiendo un conjunto sastre de dos piezas color marfil — blazer entallado de hombros estructurados sin solapas y pantalón palazzo a juego — sobre un body de seda color crudo, cinturón fino dorado marcando la cintura, aretes statement dorados geométricos';
export const LOOK_SOCIAL = 'vistiendo un turtleneck ajustado de punto fino color camel bajo un abrigo largo de lana color crudo drapeado sobre los hombros sin abrochar, jeans de tiro alto color crudo, un anillo dorado grueso, cabello con ondas sueltas más despeinadas y modernas';
export const LOOK_EDITORIAL = 'vistiendo un vestido camisero negro estructurado de manga larga con cinturón ancho marcando la cintura, un solo aro dorado grande en una oreja, labial en tono nude-rosado con más presencia que en el resto de looks';

// Sets/luz — reemplazan el fondo de estudio carbón fijo de v1 por variedad real.
export const SET_STUDIO = 'en un set de estudio fotográfico editorial con fondo liso color hueso/marfil cálido (nunca negro plano), suelo de concreto pulido reflejando tenuemente la luz, un ventilador de viento sutil moviendo el cabello y la tela';
export const SET_WINDOW = 'frente a un ventanal de piso a techo en un loft o penthouse minimalista, luz natural de atardecer entrando en un ángulo bajo y cálido, silueta de ciudad desenfocada de fondo, muebles de diseño (silla de autor, mesa de mármol) apenas visibles';
export const SET_URBAN = 'caminando por una calle urbana de arquitectura elegante (fachadas de piedra clara, ventanales de galerías de arte), luz de media tarde, tráfico y peatones desenfocados de fondo, sensación de editorial de moda callejera';
export const SET_VANITY = 'de pie frente a un espejo de cuerpo entero de marco dorado en una habitación tipo camerino, con una repisa de mármol y luces cálidas a un lado con productos de grooming ordenados — el espejo debe reflejar y encuadrar su figura completa, nunca solo el rostro';
export const SET_DESK = 'en un escritorio de mármol travertino con una laptop abierta, un moodboard con swatches de tela y paleta de color visible de fondo, luz de ventana lateral suave';

// Corrección de piel — v1 pedía "poros, brillo natural en zonas T" sin matizar
// y el resultado se leía como imperfecciones (manchas, textura irregular) en
// vez de piel premium. v2 pide explícitamente nivel de retoque editorial.
const SKIN = 'Piel retocada a nivel de portada de revista de moda — luminosa, de tono uniforme, sin manchas ni imperfecciones visibles, brillo saludable tipo "glass skin" en pómulos y puente nasal, pero conservando una textura natural sutil en las zonas de sombra (NO efecto plástico/cerúleo, NO piel completamente lisa sin ningún detalle).';

export const STYLE_BASE = `Fotografía editorial de revista de moda y negocios de altísimo nivel — piensa Harper's Bazaar o Forbes "40 under 40", NO foto corporativa de stock ni headshot de LinkedIn. Cámara full-frame de alta gama, lente 50mm o 85mm f/1.8-2.2 según el encuadre. Iluminación de tres puntos suave pero con más contraste y carácter que un estudio corporativo plano: key light direccional que esculpe el rostro y el cuerpo con una sombra clara, rim light dorado marcando el contorno. ${SKIN} Postura y mirada seguras, con presencia — nunca neutra ni tímida; esta es una mujer que sabe exactamente cómo se ve y por qué funciona. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cálido editorial, contraste rico tipo Kodak Portra con negros profundos. Sin texto, sin logotipos, sin marcas de agua.`;

// Encuadres — v2.1 (corrección 23 sept, feedback directo de David): plano
// abierto de cuerpo completo es OBLIGATORIO en TODA imagen de este curso, sin
// excepción — ni "plano medio" ni primer plano, ni siquiera en la lección de
// grooming. Motivo: si no se ve el cuerpo completo no se ve la ropa, y el
// curso es de asesoría de imagen — la ropa/estética ES el mensaje. v2 (previa)
// permitía SHOT_MEDIUM como default y SHOT_CLOSE en grooming; fue un error,
// costó regenerar el curso dos veces. SHOT_WIDE es ahora el ÚNICO encuadre
// usado en los 5 scripts de este curso — no reintroducir MEDIUM/CLOSE aquí.
export const SHOT_WIDE = 'plano entero de cuerpo completo, de pies a cabeza SIN CORTAR ninguna parte del cuerpo (ni pies, ni manos, ni la cabeza), composición editorial con espacio negativo arriba y abajo para que quepa la figura completa dentro del encuadre';

export const SINGLE = (scene, shot = SHOT_WIDE, aspectRatio = '4:5') =>
  ({ prompt: `Genera una imagen. Fotografía editorial vertical ${aspectRatio}, ${shot}. ${M}, ${scene}. ${STYLE_BASE}`, aspectRatio });

export const DIPTYCH = (left, right, shot = SHOT_WIDE, aspectRatio = '4:5') =>
  ({
    prompt: `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato vertical ${aspectRatio} total, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE_BASE}`,
    aspectRatio,
  });
