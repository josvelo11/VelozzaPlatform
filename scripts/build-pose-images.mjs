// Convierte los PNG originales de las poses a WebP optimizado con metadatos XMP
// IPTC DigitalSourceType = trainedAlgorithmicMedia (Google lo lee como "creado con IA").
// Uso: node scripts/build-pose-images.mjs [carpeta-con-PNG]
import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';

const SRC = process.argv[2] || path.join(os.homedir(), 'Desktop/Curso-Novias/imagenes');
const OUT = path.join(process.cwd(), 'public/poses');
const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/poses.json'), 'utf-8'));
fs.mkdirSync(OUT, { recursive: true });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const files = fs.readdirSync(SRC);
let n = 0;
for (const p of data.poses) {
  const f = files.find((x) => x.startsWith(String(p.n).padStart(3, '0') + '_') && x.endsWith('.png'));
  if (!f) throw new Error('Falta PNG de la pose ' + p.n);
  const xmp = `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-12/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"><Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType><dc:description><rdf:Alt><rdf:li xml:lang="es-CO">${esc(p.altText)}</rdf:li></rdf:Alt></dc:description><dc:creator><rdf:Seq><rdf:li>Velozza Creative Works</rdf:li></rdf:Seq></dc:creator><photoshop:Credit>Ilustración creada con inteligencia artificial</photoshop:Credit><xmpRights:UsageTerms><rdf:Alt><rdf:li xml:lang="es-CO">Imagen creada con IA; no es una fotografía real.</rdf:li></rdf:Alt></xmpRights:UsageTerms></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
  await sharp(path.join(SRC, f)).resize(800, 1200, { fit: 'cover' }).withXmp(xmp).webp({ quality: 80, effort: 5 }).toFile(path.join(OUT, p.img));
  n++;
}
console.log(`${n} imágenes WebP en public/poses`);
