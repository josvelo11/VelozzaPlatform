import type { Metadata } from 'next';
import { BASE, getPoses } from '@/lib/poses';
import { MyList } from '@/components/poses/MyList';

export const metadata: Metadata = { title: 'Mi lista de poses para enviar a mi fotógrafo', description: 'Guarda tus poses favoritas y envíalas por WhatsApp a tu fotógrafo.', robots: { index: false, follow: true } };
export default function Page() {
  const items = getPoses().map((p) => ({ n: p.n, slug: p.slug, guide: p.guide, star: p.star, h1: p.h1, img: p.img, tell: p.tellPhotographer }));
  return <main className="pz"><div className="pz-wrap"><MyList items={items} base={BASE} /></div></main>;
}
