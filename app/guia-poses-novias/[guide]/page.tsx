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
import { BASE, SITE, WHATSAPP, getListing, getListings, getPose, imgSrc, poseUrl, posesOf, realPhoto } from '@/lib/poses';

export const dynamicParams = false;
export function generateStaticParams() { return getListings().map((l) => ({ guide: l.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ guide: string }> }): Promise<Metadata> {
  const l = getListing((await params).guide); if (!l) return {};
  const url = `${SITE}${BASE}/${l.slug}`;
  return { title: l.seoTitle, description: l.metaDescription, keywords: [l.primaryKeyword, ...l.secondaryKeywords], alternates: { canonical: url },
    openGraph: { title: l.seoTitle, description: l.metaDescription, url, type: 'article', locale: 'es_CO', images: [{ url: `${SITE}${imgSrc(getPose(l.cover))}` }] },
    twitter: { card: 'summary_large_image', title: l.seoTitle, description: l.metaDescription } };
}

export default async function Guide({ params }: { params: Promise<{ guide: string }> }) {
  const l = getListing((await params).guide); if (!l) notFound();
  const poses = posesOf(l); const url = `${SITE}${BASE}/${l.slug}`;
  const others = getListings().filter((x) => x.slug !== l.slug && x.kind === l.kind).slice(0, 4);
  return (
    <main className="pz">
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'Article', headline: l.h1, description: l.metaDescription, url, inLanguage: 'es-CO', isAccessibleForFree: true, image: `${SITE}${imgSrc(getPose(l.cover))}`, datePublished: '2026-09-21', dateModified: '2026-09-21',
          author: { '@type': 'Organization', name: 'Velozza Creative Works', url: SITE }, publisher: { '@type': 'Organization', name: 'Velozza Creative Works', url: SITE },
          about: l.primaryKeyword, keywords: [l.primaryKeyword, ...l.secondaryKeywords].join(', '), creditText: 'Ilustraciones y textos creados con inteligencia artificial' },
        { '@context': 'https://schema.org', '@type': 'ItemList', name: l.h1, itemListElement: poses.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.h1, url: p.star ? `${SITE}${poseUrl(p)}` : `${url}#${p.slug}` })) },
      ]} />
      <div className="pz-wrap">
        <Breadcrumb items={[{ name: 'Inicio', href: SITE }, { name: 'Guía de poses', href: `${SITE}${BASE}` }, { name: l.hook }]} />
        <header className="pz-head"><div className="eyebrow">{l.kind === 'body' ? 'Poses según tu cuerpo' : 'Guía de poses'}</div><h1>{l.h1}</h1>
          <p className="pz-answer">{l.quickAnswer}</p><p className="section-lead">{l.intro}</p></header>
        <AiNotice />
        <nav className="pz-toc" aria-label="En esta guía"><strong>En esta guía · {poses.length} poses</strong><ol>{poses.map((p) => <li key={p.n}><a href={`#${p.slug}`}>{p.h1}</a></li>)}</ol></nav>
        {poses.map((p, i) => (
          <article key={p.n} id={p.slug} className="pz-pose">
            <PoseImage pose={p} priority={i < 2} />
            <div className="pz-pose-body">
              <h2>{i + 1}. {p.h1}</h2>
              <p className="pz-answer">{p.quickAnswer}</p>
              <h3>Cómo hacerla</h3><ol>{p.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>
              <p className="pz-tip"><strong>Error común:</strong> {p.error}</p>
              <p className="pz-tip"><strong>Adáptala a tu cuerpo:</strong> {p.adapt}</p>
              <p className="pz-tip gold"><strong>Dile a tu fotógrafo:</strong> {p.tellPhotographer}</p>
              <div className="pz-actions"><SaveButton n={p.n} />{p.star && <Link href={poseUrl(p)} className="cta-secondary">Ver ficha completa</Link>}</div>
            </div>
          </article>))}
        <section className="pz-real" aria-labelledby="real"><div><div className="eyebrow">Así se ve en una boda real</div><h2 id="real" className="section-title">Del ejemplo a tu boda</h2>
          <p className="section-lead">Estas poses son ilustraciones con IA. Mira cómo dirigimos a las novias en bodas reales.</p>
          <Link href="/servicios/bodas" className="cta-primary">Ver portafolio real</Link>{' '}<a className="cta-secondary" href={`${WHATSAPP}${encodeURIComponent(`Hola Velozza, vi la guía "${l.hook}" y quiero cotizar mi boda. Mi fecha es ___`)}`} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a></div>
          <div className="pz-real-grid">{[0, 1, 2, 3].map((k) => { const r = realPhoto(l.cover + k); return <Image key={k} src={r.src} alt={r.alt} width={400} height={520} sizes="(max-width: 720px) 45vw, 200px" className="pz-img" />; })}</div></section>
        <FaqBlock items={l.faq} />
        <section><h2 className="section-title">Sigue con otras guías</h2><div className="pz-chips">{others.map((o) => <Link key={o.slug} href={`${BASE}/${o.slug}`}>{o.hook}</Link>)}<Link href={BASE}>Todas las guías</Link></div></section>
      </div>
    </main>
  );
}
