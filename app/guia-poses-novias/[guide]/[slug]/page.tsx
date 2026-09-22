import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { AiNotice } from '@/components/poses/AiNotice';
import { FaqBlock } from '@/components/poses/FaqBlock';
import { JsonLd } from '@/components/poses/JsonLd';
import { PoseImage } from '@/components/poses/PoseImage';
import { SaveButton } from '@/components/poses/SaveButton';
import { BASE, SITE, WHATSAPP, getListing, getStars, imgSrc, poseUrl, posesOf, realPhoto } from '@/lib/poses';

export const dynamicParams = false;
export function generateStaticParams() { return getStars().map((p) => ({ guide: p.guide, slug: p.slug })); }
const find = async (params: Promise<{ guide: string; slug: string }>) => { const { guide, slug } = await params; return getStars().find((p) => p.guide === guide && p.slug === slug); };
export async function generateMetadata({ params }: { params: Promise<{ guide: string; slug: string }> }): Promise<Metadata> {
  const p = await find(params); if (!p) return {}; const url = `${SITE}${poseUrl(p)}`;
  return { title: p.seoTitle, description: p.metaDescription, keywords: [p.primaryKeyword, ...p.secondaryKeywords], alternates: { canonical: url },
    openGraph: { title: p.seoTitle, description: p.metaDescription, url, type: 'article', locale: 'es_CO', images: [{ url: `${SITE}${imgSrc(p)}` }] }, twitter: { card: 'summary_large_image', title: p.seoTitle, description: p.metaDescription } };
}

export default async function PosePage({ params }: { params: Promise<{ guide: string; slug: string }> }) {
  const p = await find(params); if (!p) notFound();
  const g = getListing(p.guide)!; const url = `${SITE}${poseUrl(p)}`; const siblings = posesOf(g); const idx = siblings.findIndex((x) => x.n === p.n);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length]; const next = siblings[(idx + 1) % siblings.length]; const r = realPhoto(p.n);
  return (
    <main className="pz">
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'Article', headline: p.h1, description: p.metaDescription, url, inLanguage: 'es-CO', isAccessibleForFree: true, datePublished: '2026-09-21', dateModified: '2026-09-21',
          image: { '@type': 'ImageObject', contentUrl: `${SITE}${imgSrc(p)}`, name: p.altText, description: p.altText, creditText: 'Ilustración creada con inteligencia artificial', creator: { '@type': 'Organization', name: 'Velozza Creative Works' } },
          author: { '@type': 'Organization', name: 'Velozza Creative Works', url: SITE }, publisher: { '@type': 'Organization', name: 'Velozza Creative Works', url: SITE }, about: p.primaryKeyword, keywords: [p.primaryKeyword, ...p.secondaryKeywords].join(', ') },
      ]} />
      <div className="pz-wrap">
        <Breadcrumb items={[{ name: 'Inicio', href: SITE }, { name: 'Guía de poses', href: `${SITE}${BASE}` }, { name: g.hook, href: `${SITE}${BASE}/${g.slug}` }, { name: p.h1 }]} />
        <div className="pz-star">
          <div><PoseImage pose={p} priority badge="full" sizes="(max-width: 720px) 92vw, 460px" /><p className="pz-cap">Ilustración creada con IA: {p.tipo.toLowerCase()}.</p></div>
          <div>
            <div className="eyebrow">{g.hook}</div><h1>{p.h1}</h1>
            <p className="pz-answer">{p.quickAnswer}</p>
            <h2>Cuándo usarla</h2><p>{p.whenToUse}</p>
            <h2>Cómo hacerla paso a paso</h2><ol>{p.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>
            <p className="pz-tip"><strong>Por qué funciona:</strong> {p.why}</p>
            <p className="pz-tip"><strong>Error común:</strong> {p.error}</p>
            <p className="pz-tip"><strong>Adáptala a tu cuerpo:</strong> {p.adapt}</p>
            <p className="pz-tip gold"><strong>Dile a tu fotógrafo:</strong> {p.tellPhotographer}</p>
            <div className="pz-actions"><SaveButton n={p.n} /><a className="cta-secondary" href={`${WHATSAPP}${encodeURIComponent(`Hola Velozza, quiero esta pose en mi boda: ${p.h1} (${url}). Mi fecha es ___`)}`} target="_blank" rel="noreferrer">Pedir esta pose por WhatsApp</a></div>
          </div>
        </div>
        <AiNotice />
        <section className="pz-real" aria-labelledby="real"><div><div className="eyebrow">Así se ve en una boda real</div><h2 id="real" className="section-title">Foto real del portafolio de Velozza</h2>
          <p className="section-lead">Esta pose es una ilustración con IA. Tu sesión real depende del lugar, la luz y tu vestuario.</p><Link href="/servicios/bodas" className="cta-primary">Ver portafolio de bodas</Link></div>
          <Image src={r.src} alt={r.alt} width={400} height={520} sizes="(max-width: 720px) 80vw, 320px" className="pz-img" /></section>
        <FaqBlock items={p.faq} />
        <nav className="pz-prevnext" aria-label="Más poses de esta guía"><Link href={poseUrl(prev)}>‹ {prev.h1}</Link><Link href={`${BASE}/${g.slug}`}>Toda la guía</Link><Link href={poseUrl(next)}>{next.h1} ›</Link></nav>
      </div>
    </main>
  );
}
