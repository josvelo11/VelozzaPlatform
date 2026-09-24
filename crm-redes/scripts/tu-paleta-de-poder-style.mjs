// tu-paleta-de-poder-style.mjs — curso "Tu Paleta de Poder" (colorimetría
// personal + contextura corporal). Mismo estándar visual corregido que
// asesoria-imagen v2.1: SHOT_WIDE obligatorio en toda imagen (sin excepción),
// capsule wardrobe fijo, sets variados, piel retocada nivel editorial. Este
// curso en particular DEPENDE de ver el cuerpo completo — sin plano entero no
// se puede enseñar contextura/silueta, así que SHOT_WIDE es aún más crítico
// aquí que en el resto del catálogo.

export const M = 'una mujer latina de unos 34 años, cabello castaño oscuro liso a la altura de la clavícula con raya al lado, piel trigueña dorada, ojos color miel, complexión de reloj de arena y postura erguida y cálida';

// Capsule wardrobe — 3 looks dentro del mismo sistema, coherente con el curso
// (una asesora de imagen que aplica su propia teoría del color/contextura).
export const LOOK_INVIERNO = 'vistiendo un conjunto de pantalón sastre negro de tiro alto y un top de seda color blanco puro con cuello halter, un solo collar plateado de líneas geométricas, labial rojo intenso — paleta de alto contraste, colores puros y fríos';
export const LOOK_OTONO = 'vistiendo un vestido midi de punto acanalado en terracota profundo con cinturón ancho color camel marcando la cintura, aretes dorados de textura orgánica, labial terracota mate — paleta cálida, terrosa y saturada';
export const LOOK_VERANO = 'vistiendo un conjunto de blusa de lino color lavanda suave y pantalón palazzo gris perla, un brazalete plateado delicado, labial rosa empolvado — paleta fría, suave y de baja saturación';

export const SET_STUDIO = 'en un set de estudio fotográfico editorial con fondo liso color crema cálido, suelo de concreto pulido, luz de ventana grande difusa entrando desde un lateral';
export const SET_CLOSET = 'de pie frente a un clóset abierto tipo boutique con prendas organizadas por color en un degradado visible (blancos, luego cálidos, luego fríos, luego oscuros), luz cálida de tocador a un lado';
export const SET_MIRROR = 'de pie frente a un espejo de cuerpo entero de marco dorado en una habitación luminosa tipo vestidor, telas de colores drapeadas sobre una silla cerca — el espejo debe reflejar y encuadrar su figura completa';
export const SET_WINDOW = 'frente a un ventanal grande en un loft minimalista con luz natural de media mañana entrando de frente, plantas y textiles neutros desenfocados de fondo';

const SKIN = 'Piel retocada a nivel de portada de revista de moda — luminosa, tono uniforme, sin manchas ni imperfecciones visibles, brillo saludable tipo "glass skin", conservando una textura natural sutil en zonas de sombra (NO efecto plástico, NO piel completamente lisa sin ningún detalle).';

export const STYLE_BASE = `Fotografía editorial de revista de moda de altísimo nivel — piensa Vogue o InStyle, NO foto corporativa de stock. Cámara full-frame de alta gama, lente 50mm o 85mm f/1.8-2.2. Iluminación suave pero con carácter: key light direccional que esculpe el cuerpo y la ropa con una sombra clara, rim light suave marcando el contorno. ${SKIN} Postura segura y cálida, mirada directa y cercana — una asesora de imagen hablándole a su clienta, no una modelo distante. Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading editorial rico, negros profundos. Sin texto, sin logotipos, sin marcas de agua.`;

// SHOT_WIDE es el ÚNICO encuadre para toda imagen con la protagonista real —
// este curso enseña contextura corporal, así que cortar el cuerpo rompe la
// lección misma, no solo la estética. No introducir MEDIUM/CLOSE aquí.
export const SHOT_WIDE = 'plano entero de cuerpo completo, de pies a cabeza SIN CORTAR ninguna parte del cuerpo (ni pies, ni manos, ni la cabeza), composición editorial con espacio negativo arriba y abajo para que quepa la figura completa dentro del encuadre';

export const SINGLE = (scene, shot = SHOT_WIDE, aspectRatio = '4:5') =>
  ({ prompt: `Genera una imagen. Fotografía editorial vertical ${aspectRatio}, ${shot}. ${M}, ${scene}. ${STYLE_BASE}`, aspectRatio });

export const DIPTYCH = (left, right, shot = SHOT_WIDE, aspectRatio = '4:5') =>
  ({
    prompt: `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato vertical ${aspectRatio} total, ambos paneles ${shot}, MISMA distancia de cámara y altura de encuadre. IZQUIERDA: ${M}, ${left}. DERECHA: la misma mujer, mismo encuadre, ${right}. ${STYLE_BASE}`,
    aspectRatio,
  });

// Diagramas de silueta — para L4 (contextura corporal) se necesitan 5 formas
// de cuerpo distintas comparadas lado a lado. Usar siluetas sin rostro (mismo
// recurso que ya funcionó en retrato-personal l1) en vez de forzar a una sola
// modelo real a representar 5 tipos de cuerpo, que sería inconsistente y
// confuso pedagógicamente.
export const SILHOUETTE_DIPTYCH = (left, right, aspectRatio = '4:5') =>
  ({
    prompt: `Genera una imagen. Diagrama editorial de dos siluetas femeninas sin rostro, en formato vertical ${aspectRatio}, dividido en dos mitades EXACTAMENTE iguales, plano de cuerpo completo de pie, fondo liso color crema. IZQUIERDA: ${left}. DERECHA: ${right}. Estilo ilustrativo editorial minimalista, líneas limpias color carbón sobre fondo crema, sin rostro ni detalle de piel, con un leve degradado dorado marcando la silueta. Sin texto, sin marcas de agua.`,
    aspectRatio,
  });
