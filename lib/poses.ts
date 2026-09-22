import fs from 'fs';
import path from 'path';

export interface PoseFaq { q: string; a: string }
export interface Pose {
  n: number;
  slug: string;
  guide: string;
  guideNum: number;
  bodyTags: string[];
  star: boolean;
  img: string;
  tipo: string;
  lessonTitle: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  altText: string;
  quickAnswer: string;
  whenToUse: string;
  faq: PoseFaq[];
  steps: string[];
  why: string;
  error: string;
  adapt: string;
  tellPhotographer: string;
}
export interface Listing {
  slug: string;
  kind: 'guide' | 'body';
  seoTitle: string;
  metaDescription: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intro: string;
  quickAnswer: string;
  hook: string;
  cardText: string;
  faq: PoseFaq[];
  poseNs: number[];
  cover: number;
}
export interface PosesData { hub: Listing; listings: Listing[]; poses: Pose[] }

export const SITE = 'https://velozzacws.com';
export const BASE = '/guia-poses-novias';

let cache: PosesData | null = null;
export function getData(): PosesData {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/poses.json'), 'utf-8'));
  return cache!;
}
export const getPoses = () => getData().poses;
export const getListings = () => getData().listings;
export const getGuides = () => getListings().filter((l) => l.kind === 'guide');
export const getBodyPages = () => getListings().filter((l) => l.kind === 'body');
export const getListing = (slug: string) => getListings().find((l) => l.slug === slug);
export const getStars = () => getPoses().filter((p) => p.star);
export const getPose = (n: number) => getPoses().find((p) => p.n === n)!;
export const posesOf = (l: Listing) => l.poseNs.map(getPose);
export const poseUrl = (p: Pose) => (p.star ? `${BASE}/${p.guide}/${p.slug}` : `${BASE}/${p.guide}#${p.slug}`);
export const imgSrc = (p: Pose) => `/poses/${p.img}`;

// Fotos reales del portafolio de Velozza (public/bodas) para el bloque «Así se ve en una boda real»
export const REAL_PHOTOS = [
  { src: '/bodas/boda-novia-ramo-velo.jpg', alt: 'Novia con ramo y velo en una boda real fotografiada por Velozza' },
  { src: '/bodas/boda-novia-sonrisa-jardin.jpg', alt: 'Novia sonriendo en un jardín, boda real fotografiada por Velozza' },
  { src: '/bodas/boda-novia-vista-ciudad.jpg', alt: 'Novia frente a la ciudad, boda real fotografiada por Velozza' },
  { src: '/bodas/boda-retrato-novia-emotiva-bn.jpg', alt: 'Retrato emotivo en blanco y negro de una novia, boda real de Velozza' },
  { src: '/bodas/boda-retrato-novia-jardin-lago.jpg', alt: 'Retrato de novia junto a un lago, boda real de Velozza' },
  { src: '/bodas/novia-instantes-luz-dorada.jpg', alt: 'Novia con luz dorada, sesión real de Velozza' },
  { src: '/bodas/novia-caminando-jardin.jpg', alt: 'Novia caminando por un jardín, boda real de Velozza' },
  { src: '/bodas/boda-novia-brazos-terraza.jpg', alt: 'Novia con los brazos abiertos en una terraza, boda real de Velozza' },
];
export const realPhoto = (i: number) => REAL_PHOTOS[i % REAL_PHOTOS.length];

export const WHATSAPP = 'https://api.whatsapp.com/send?phone=573193677929&text=';
export const AI_NOTICE_SHORT = 'Imagen creada con IA · Referencia de pose';
export const AI_NOTICE_FULL =
  'Las ilustraciones y los textos de esta guía fueron creados con inteligencia artificial para explicar poses de novia, que son universales. Las novias que aparecen no existen y no son fotografías de bodas reales de Velozza Creative Works; el contenido fue seleccionado y organizado por nuestro equipo. Los resultados de tu sesión dependen del lugar, la luz, el vestuario y tus características, y pueden diferir de estas ilustraciones. Para ver nuestro trabajo real, visita el portafolio de bodas.';
