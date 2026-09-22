#!/usr/bin/env node
// ============================================================================
//  test-gemini-image.mjs — genera UNA sola imagen de prueba con Gemini 3.1
//  Flash Image, usando el mismo estilo hiperrealista (Rembrandt, fondo
//  carbón, mismo protagonista) que ya validamos en ChatGPT para el curso
//  poses-camara. Se guarda en un archivo aparte (_test-l3-0) para comparar
//  calidad antes de decidir si reemplaza la generación real.
//
//  Requiere GEMINI_API_KEY en el entorno (nunca se imprime).
//  Uso: GEMINI_API_KEY=... node scripts/test-gemini-image.mjs
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Falta GEMINI_API_KEY en el entorno.');
  process.exit(1);
}

const MODEL = 'gemini-3.1-flash-image';
const OUT_PATH = path.join(__dirname, '..', '..', 'public', 'formacion', 'sections', 'poses-camara', '_test-l3-0e.jpg');

// v5 — corrección de rumbo: David confirmó que la v3 (camiseta negra) tenía
// el nivel de expresividad/cinematografía correcto y quería que siguiera
// iterando DESDE ahí, no que revirtiera a la camisa azul de las Lecciones
// 1-2 (esas quedan publicadas tal cual, sin tocar). De aquí en adelante
// (Lección 3+) el vestuario fijo del protagonista es la camiseta negra —
// vestuario FIJO y no negociable para que no vuelva a haber drift entre
// imágenes de esta misma lección en adelante.
const M = 'un hombre latino de unos 42 años, cabello corto oscuro con canas visibles en las sienes, barba corta y arreglada, piel trigueña, vistiendo SIEMPRE una camiseta negra de cuello redondo manga corta y pantalón oscuro — este vestuario es fijo desde la Lección 3 en adelante, no debe cambiar de prenda ni de color bajo ninguna circunstancia';

// STYLE v5 — mantiene el esquema de luz de 3 puntos (v2, aprobado) y la
// expresión facial genuina (v3/v4, aprobada), suma cuerpo entero real con
// zapatos visibles (v4) sobre el vestuario ya aprobado de la v3 (camiseta).
const STYLE = `Fotografía de retrato editorial de altísimo nivel, comparable a una campaña de revista GQ o a un book corporativo ejecutivo premium. Esquema de iluminación de estudio de TRES PUNTOS explícito: luz principal (key light) en softbox octagonal grande a 45° sobre el eje de la cámara, produciendo un modelado tridimensional claro en el rostro con transición gradual y suave de luz a sombra (no plana, no frontal); luz de relleno (fill light) tenue del lado opuesto que abre ligeramente las sombras sin eliminarlas; luz de contorno (rim/hair light) detrás del sujeto que dibuja un borde dorado sutil separándolo del fondo. Fondo de estudio color carbón (#1a1a1a) con leve viñeta y textura sutil, desenfocado a f/2.8. Cámara full-frame de alta gama, lente 85mm f/1.4, ligera profundidad de campo. Piel con textura real y visible: poros, brillo natural en zonas T, vello facial individual, sin suavizado plástico ni piel de porcelana.

EXPRESIÓN FACIAL — punto crítico: rostro con expresión genuina y matizada, NO una mirada fija y vacía de maniquí. Micro-expresión natural: tensión sutil y real en cejas y músculos faciales, asimetría facial leve como en cualquier rostro humano real, mirada viva con foco e intención (no perdida ni hacia la nada), catchlights nítidos y bien definidos en ambos ojos. La emoción de incomodidad/tensión del sujeto debe leerse genuinamente en el rostro, no solo en la postura del cuerpo.

Grano de sensor fotográfico sutil, NO ilustración, NO render 3D, NO CGI, NO look de IA. Color grading cinematográfico cálido en altas luces y ligeramente frío en sombras, contraste rico tipo Kodak Portra. Sin texto, sin logotipos, sin marcas de agua.`;

// l3-0: "El problema universal" — díptico manos rígidas a los costados vs
// manos escondidas detrás de la espalda. Plano de CUERPO ENTERO real
// (zapatos incluidos), vestuario anclado, encuadre idéntico en ambos
// paneles.
const PROMPT = `Genera una imagen. Díptico editorial dividido en dos mitades verticales EXACTAMENTE iguales en tamaño, formato horizontal 4:3. Ambos paneles deben ser plano de CUERPO ENTERO — desde la cabeza hasta los ZAPATOS completamente visibles, sin cortar los pies — con la MISMA distancia de cámara y la MISMA altura de encuadre, como si fueran dos fotos consecutivas del mismo photoshoot sin variar el zoom. En AMBOS paneles el hombre viste EXACTAMENTE la misma ropa: la camiseta negra descrita abajo — nunca camisa de botones, nunca otro color. IZQUIERDA: ${M}, de pie con los brazos rígidos y las manos pegadas a los costados, postura tensa e incómoda, expresión facial que refleja genuinamente esa incomodidad. DERECHA: el mismo hombre, misma camiseta negra, mismo encuadre exacto de cuerpo entero con zapatos visibles, con las manos escondidas completamente detrás de la espalda, hombros encogidos, expresión facial igual de incómoda pero natural y con matiz, no rígida. ${STYLE}`;

async function main() {
  console.log('=== Prueba Gemini 3.1 Flash Image v5 — vestuario v3 (camiseta) + cuerpo entero real (1 imagen) ===');
  console.log(`Modelo: ${MODEL}`);
  console.log(`Costo estimado: ~$0.101 USD (~420 COP) — 2K\n`);

  const body = {
    contents: [{ parts: [{ text: PROMPT }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      imageConfig: { imageSize: '2K', aspectRatio: '4:3' },
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  const data = await res.json();

  if (!res.ok) {
    console.error(`❌ Error API ${res.status}:`, data.error?.message || JSON.stringify(data).slice(0, 500));
    process.exit(1);
  }

  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    console.error('❌ Respuesta sin imagen:', JSON.stringify(data).slice(0, 500));
    process.exit(1);
  }

  const bytes = Buffer.from(part.inlineData.data, 'base64');
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, bytes);

  console.log(`✅ Generada: ${OUT_PATH}`);
  console.log(`   Tamaño: ${(bytes.length / 1024).toFixed(0)} KB`);
  console.log(`   Tokens usados: ${data.usageMetadata?.totalTokenCount || 'N/A'}`);
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
