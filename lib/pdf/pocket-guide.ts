// Genera, en el navegador de la persona, un PDF con el mismo diseño de marca
// que la guía de bolsillo fija (negro/dorado, Cormorant Garamond + Montserrat,
// logo Velozza), pero armado dinámicamente con las poses que ella eligió en
// "Mi lista". Nada de esto toca el servidor: se descarga una vez y se genera
// en el cliente con jsPDF.

export interface PdfPoseItem {
  n: number;
  h1: string;
  img: string; // filename en /public/poses
  tip: string;
  tell: string;
  altText: string;
}

const GOLD: [number, number, number] = [212, 175, 55];
const GOLD_LIGHT: [number, number, number] = [244, 207, 99];
const BG: [number, number, number] = [11, 11, 11];
const SURFACE: [number, number, number] = [20, 20, 20];
const NOTICE_BG: [number, number, number] = [26, 22, 8];
const INK: [number, number, number] = [248, 245, 237];
const INK2: [number, number, number] = [201, 197, 186];
const MUTED: [number, number, number] = [122, 118, 105];

const W = 400;
const H_SHORT = 620;
const H_POSE = 950;
const IMG_H = 600;

async function fetchBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function loadAsJpegDataUrl(src: string): Promise<{ url: string; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('sin contexto de canvas'));
      ctx.drawImage(img, 0, 0);
      resolve({ url: canvas.toDataURL('image/jpeg', 0.85), w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => reject(new Error('no se pudo cargar ' + src));
    img.src = src;
  });
}

export async function generatePocketGuidePdf(poses: PdfPoseItem[], onProgress?: (pct: number) => void): Promise<void> {
  const { jsPDF } = await import('jspdf');

  onProgress?.(5);
  const [cormorantBold, cormorantSemi, montReg, montSemi, montBold, logoB64] = await Promise.all([
    fetchBase64('/fonts/CormorantGaramond-Bold.ttf'),
    fetchBase64('/fonts/CormorantGaramond-SemiBold.ttf'),
    fetchBase64('/fonts/Montserrat-Regular.ttf'),
    fetchBase64('/fonts/Montserrat-SemiBold.ttf'),
    fetchBase64('/fonts/Montserrat-Bold.ttf'),
    fetchBase64('/brand/velozza_logo_sin_fondo_1080.png'),
  ]);
  onProgress?.(20);

  const doc = new jsPDF({ unit: 'pt', format: [W, H_SHORT], compress: true });
  doc.addFileToVFS('CormorantGaramond-Bold.ttf', cormorantBold);
  doc.addFont('CormorantGaramond-Bold.ttf', 'Cormorant', 'bold');
  doc.addFileToVFS('CormorantGaramond-SemiBold.ttf', cormorantSemi);
  doc.addFont('CormorantGaramond-SemiBold.ttf', 'CormorantSB', 'normal');
  doc.addFileToVFS('Montserrat-Regular.ttf', montReg);
  doc.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal');
  doc.addFileToVFS('Montserrat-SemiBold.ttf', montSemi);
  doc.addFont('Montserrat-SemiBold.ttf', 'MontserratSB', 'normal');
  doc.addFileToVFS('Montserrat-Bold.ttf', montBold);
  doc.addFont('Montserrat-Bold.ttf', 'Montserrat', 'bold');

  const bg = (c: [number, number, number] = BG, h = H_SHORT) => {
    doc.setFillColor(...c);
    doc.rect(0, 0, W, h, 'F');
  };
  const logo = (x: number, y: number, w: number) => {
    const h = w * (1080 / 1080);
    doc.addImage(`data:image/png;base64,${logoB64}`, 'PNG', x, y, w, h);
    return h;
  };
  const wrap = (text: string, size: number, maxW: number) => doc.setFontSize(size) && doc.splitTextToSize(text, maxW);

  // ---- Portada ----
  bg();
  logo(30, 34, 30);
  doc.setFont('Montserrat', 'bold'); doc.setFontSize(9); doc.setTextColor(...GOLD);
  doc.text('VELOZZA', 68, 50);
  doc.setFont('Montserrat', 'normal'); doc.setTextColor(...INK2);
  doc.text(' CREATIVE WORKS', 68 + doc.getTextWidth('VELOZZA'), 50);

  doc.setFont('Cormorant', 'bold'); doc.setFontSize(34); doc.setTextColor(...INK);
  doc.text('Tu guía de bolsillo', 30, 130);
  doc.setTextColor(...GOLD);
  doc.text(`personalizada`, 30, 168);
  doc.setFont('Montserrat', 'normal'); doc.setFontSize(11); doc.setTextColor(...INK2);
  doc.text(wrap(`${poses.length} poses que elegiste para tu boda. Llévala el día o envíasela a tu fotógrafo.`, 11, 340), 30, 200);

  doc.setDrawColor(...GOLD); doc.setLineWidth(0.8);
  doc.roundedRect(30, 250, 220, 20, 10, 10);
  doc.setFont('Montserrat', 'bold'); doc.setFontSize(8); doc.setTextColor(...GOLD);
  doc.text('RECREACIONES CON IA · REFERENCIA DE POSE', 40, 263);

  doc.setFont('Montserrat', 'normal'); doc.setFontSize(8); doc.setTextColor(...MUTED);
  doc.text('velozzacws.com/guia-poses-novias', 30, H_SHORT - 40);
  doc.text('© Velozza Creative Works', 30, H_SHORT - 28);
  onProgress?.(28);

  // ---- Transparencia ----
  doc.addPage([W, H_SHORT]);
  bg();
  doc.setFont('Montserrat', 'bold'); doc.setFontSize(9); doc.setTextColor(...GOLD);
  doc.text('ANTES DE EMPEZAR', 30, 60);
  doc.setFont('Cormorant', 'bold'); doc.setFontSize(20); doc.setTextColor(...INK);
  doc.text('Transparencia sobre estas imágenes', 30, 90, { maxWidth: 340 });

  doc.setFillColor(...NOTICE_BG); doc.setDrawColor(...GOLD); doc.setLineWidth(0.6);
  doc.roundedRect(30, 130, 340, 160, 8, 8, 'FD');
  doc.setFont('Montserrat', 'normal'); doc.setFontSize(10); doc.setTextColor(...INK2);
  const noticeLines = wrap(
    'Las ilustraciones de esta guía fueron creadas con inteligencia artificial para explicar poses de novia, que son universales. Las novias que aparecen no existen y no son fotografías de bodas reales de Velozza Creative Works; el contenido fue seleccionado y organizado por nuestro equipo.',
    10, 310
  );
  doc.text(noticeLines, 45, 155);

  doc.setFontSize(10.5); doc.setTextColor(...INK2);
  doc.text(
    wrap('Los resultados de tu sesión dependen del lugar, la luz, el vestuario y tus propias características, y pueden diferir de estas ilustraciones. Para ver nuestro trabajo real, visita velozzacws.com/servicios/bodas.', 10.5, 340),
    30, 320
  );
  onProgress?.(32);

  // ---- Poses ----
  const total = poses.length;
  for (let i = 0; i < poses.length; i++) {
    const p = poses[i];
    doc.addPage([W, H_POSE]);
    bg(BG, H_POSE);

    let img;
    try { img = await loadAsJpegDataUrl(`/poses/${p.img}`); } catch { img = null; }
    if (img) {
      doc.addImage(img.url, 'JPEG', 0, 0, W, IMG_H);
    } else {
      doc.setFillColor(...SURFACE); doc.rect(0, 0, W, IMG_H, 'F');
    }

    // número
    doc.setFillColor(...BG); doc.setDrawColor(...GOLD); doc.setLineWidth(0.8);
    doc.circle(W - 24, 24, 11, 'FD');
    doc.setFont('CormorantSB', 'normal'); doc.setFontSize(12); doc.setTextColor(...GOLD);
    doc.text(String(i + 1), W - 24, 28, { align: 'center' });

    // badge
    doc.setFillColor(0, 0, 0); doc.setGState(doc.GState({ opacity: 0.82 }));
    doc.roundedRect(12, IMG_H - 30, 92, 18, 5, 5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setDrawColor(...GOLD); doc.setLineWidth(0.5);
    doc.roundedRect(12, IMG_H - 30, 92, 18, 5, 5, 'D');
    doc.setFont('Montserrat', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...GOLD);
    doc.text('Creada con IA', 20, IMG_H - 18);

    // cuerpo de texto
    let y = IMG_H + 34;
    doc.setFont('CormorantSB', 'normal'); doc.setFontSize(18); doc.setTextColor(...INK);
    const titleLines = wrap(p.h1, 18, 356);
    doc.text(titleLines, 22, y);
    y += titleLines.length * 22 + 14;

    doc.setFont('Montserrat', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...INK2);
    const tipLines = wrap(p.tip, 9.5, 356);
    doc.text(tipLines, 22, y);
    y += tipLines.length * 13 + 16;

    doc.setFont('Montserrat', 'normal'); doc.setFontSize(9); doc.setTextColor(...INK2);
    const sayLines = wrap(p.tell, 9, 320);
    const boxH = 34 + sayLines.length * 12.5;
    doc.setFillColor(...SURFACE);
    doc.roundedRect(22, y, 356, boxH, 6, 6, 'F');
    doc.setFont('Montserrat', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...GOLD);
    doc.text('DÍSELO A TU FOTÓGRAFO', 34, y + 16);
    doc.setFont('Montserrat', 'normal'); doc.setFontSize(9); doc.setTextColor(...INK2);
    doc.text(sayLines, 34, y + 30);

    onProgress?.(32 + Math.round(((i + 1) / total) * 58));
  }

  // ---- Cierre ----
  doc.addPage([W, H_SHORT]);
  bg();
  const lh = logo(W / 2 - 15, 40, 30);
  doc.setFont('Montserrat', 'bold'); doc.setFontSize(9); doc.setTextColor(...GOLD);
  doc.text('VELOZZA CREATIVE WORKS', W / 2, 40 + lh + 16, { align: 'center' });

  doc.setFont('Cormorant', 'bold'); doc.setFontSize(26); doc.setTextColor(...INK);
  doc.text('¿Ya tienes fecha?', W / 2, 40 + lh + 56, { align: 'center' });

  doc.setFont('Montserrat', 'normal'); doc.setFontSize(10.5); doc.setTextColor(...INK2);
  doc.text(wrap('Cuéntanos cuándo es tu boda y te ayudamos a planear tus fotos, con estas poses o las que tú quieras.', 10.5, 300), W / 2, 40 + lh + 82, { align: 'center' });

  const waText = encodeURIComponent(
    `Hola, vi la guía de poses y armé mi selección de ${poses.length}, mi boda es el ___`
  );
  doc.setFillColor(...GOLD_LIGHT);
  doc.roundedRect(W / 2 - 110, 40 + lh + 120, 220, 30, 6, 6, 'F');
  doc.setFont('Montserrat', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 18, 0);
  doc.textWithLink('COTIZA TU FECHA POR WHATSAPP', W / 2, 40 + lh + 139, {
    align: 'center',
    url: `https://api.whatsapp.com/send?phone=573193677929&text=${waText}`,
  });

  doc.setFont('Montserrat', 'normal'); doc.setFontSize(9); doc.setTextColor(...GOLD);
  doc.textWithLink('Ver portafolio real de bodas →', W / 2, 40 + lh + 172, {
    align: 'center',
    url: 'https://velozzacws.com/servicios/bodas',
  });

  doc.setFont('Montserrat', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
  doc.text('Guía de poses creada con IA · velozzacws.com/guia-poses-novias', W / 2, H_SHORT - 40, { align: 'center' });
  doc.text('+57 305 309 0273 · ceo@velozzacws.com', W / 2, H_SHORT - 28, { align: 'center' });

  onProgress?.(100);
  doc.save('mi-guia-de-poses-velozza.pdf');
}
