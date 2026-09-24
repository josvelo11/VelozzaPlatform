import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { AiNotice } from '@/components/poses/AiNotice';
import { FaqBlock } from '@/components/poses/FaqBlock';
import { JsonLd } from '@/components/poses/JsonLd';
import { LeadForm } from '@/components/poses/LeadForm';
import { ListCounter, SaveButton } from '@/components/poses/SaveButton';
import { PoseImage } from '@/components/poses/PoseImage';
import { BASE, SITE, WHATSAPP, getBodyPages, getData, getGuides, getPose, getStars, imgSrc, poseUrl, REAL_PHOTOS } from '@/lib/poses';

const hub = () => getData().hub;
export function generateMetadata(): Metadata {
  const h = hub();
  return {
    title: h.seoTitle,
    description: h.metaDescription,
    keywords: [h.primaryKeyword, ...h.secondaryKeywords],
    alternates: { canonical: `${SITE}${BASE}` },
    openGraph: { title: h.seoTitle, description: h.metaDescription, url: `${SITE}${BASE}`, type: 'website', locale: 'es_CO', images: [{ url: `${SITE}${imgSrc(getPose(62))}` }] },
    twitter: { card: 'summary_large_image', title: h.seoTitle, description: h.metaDescription },
  };
}

export default function Hub() {
  const h = hub(); const guides = getGuides(); const bodies = getBodyPages(); const stars = getStars();
  const total = getData().poses.length;
  return (
    <main className="pz">
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: h.h1, description: h.metaDescription, url: `${SITE}${BASE}`, inLanguage: 'es-CO', isAccessibleForFree: true, publisher: { '@type': 'Organization', name: 'Velozza Creative Works', url: SITE }, about: h.primaryKeyword,
          mainEntity: { '@type': 'ItemList', itemListElement: guides.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.h1, url: `${SITE}${BASE}/${g.slug}` })) } },
      ]} />
      <div className="pz-wrap">
        <Breadcrumb items={[{ name: 'Inicio', href: SITE }, { name: 'Guía de poses para novias' }]} />
        <section className="pz-hero">
          <div>
            <div className="eyebrow">Guía de poses · Bogotá y Colombia</div>
            <h1>{h.h1}</h1>
            <p className="pz-answer">{h.quickAnswer}</p>
            <div className="pz-cta">
              <Link href={`${BASE}/mi-lista`} className="cta-primary">Armar mi lista de poses <ListCounter /></Link>
              <Link href="/servicios/bodas" className="cta-secondary">Ver portafolio real</Link>
            </div>
            <p className="pz-mini">{total} poses · ilustraciones y textos creados con IA · poses universales</p>
          </div>
          <div className="pz-hero-imgs">{[62, 100, 7].map((n) => <PoseImage key={n} pose={getPose(n)} priority sizes="(max-width: 720px) 30vw, 220px" />)}</div>
        </section>
        <AiNotice />

        <section aria-labelledby="cuerpo"><h2 id="cuerpo" className="section-title">Encuentra tu pose según tu cuerpo</h2>
          <div className="pz-chips">{bodies.map((b) => <Link key={b.slug} href={`${BASE}/${b.slug}`}>{b.hook}</Link>)}</div></section>

        <section aria-labelledby="guias"><h2 id="guias" className="section-title">{guides.length} guías, una por situación</h2>
          <p className="section-lead">Elige cómo quieres verte o qué vas a tener en la mano y aprende la pose paso a paso.</p>
          <div className="pz-cards">{guides.map((g) => (
            <Link key={g.slug} href={`${BASE}/${g.slug}`} className="pz-card">
              <Image src={imgSrc(getPose(g.cover))} alt={`Ilustración creada con IA: ${g.hook}`} width={480} height={720} sizes="(max-width: 720px) 45vw, 260px" className="pz-img" />
              <h3>{g.hook}</h3><p>{g.cardText}</p><small>{g.poseNs.length} poses ›</small>
            </Link>))}</div></section>

        <section aria-labelledby="estrella"><h2 id="estrella" className="section-title">Poses estrella <small>las más buscadas</small></h2>
          <div className="pz-cards five">{stars.map((p) => (
            <article key={p.n} className="pz-card small">
              <Link href={poseUrl(p)}><Image src={imgSrc(p)} alt={p.altText} width={480} height={720} sizes="(max-width: 720px) 45vw, 200px" className="pz-img" /><h3>{p.h1}</h3></Link>
              <SaveButton n={p.n} label={false} />
            </article>))}</div></section>

        <section className="pz-band" aria-labelledby="lista">
          <div><div className="eyebrow">Solo aquí</div><h2 id="lista" className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>Guarda tus poses favoritas y descarga tu PDF gratis</h2>
            <p className="section-lead">Toca el corazón en las poses que te gustan. Al armar tu lista, generamos automáticamente un PDF descargable con tu selección, listo para enviar por WhatsApp o imprimir, con la frase exacta para pedirlas el día de tu boda.</p>
            <Link href={`${BASE}/mi-lista`} className="cta-primary">Ver mi lista y descargar PDF</Link></div>
        </section>

        <section className="pz-real" aria-labelledby="real"><div><div className="eyebrow">Así se ve en una boda real</div><h2 id="real" className="section-title">Lo que practicas aquí, lo dirigimos en tu boda</h2>
          <p className="section-lead">Estas guías son ilustraciones con IA. El trabajo real de Velozza Creative Works está en nuestro portafolio de bodas en Bogotá y Colombia.</p>
          <Link href="/servicios/bodas" className="cta-primary">Ver portafolio real</Link>{' '}<a className="cta-secondary" href={`${WHATSAPP}${encodeURIComponent('Hola Velozza, vi la guía de poses y quiero cotizar mi boda. Mi fecha es ___')}`} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a></div>
          <div className="pz-real-grid">{REAL_PHOTOS.slice(0, 4).map((r) => <Image key={r.src} src={r.src} alt={r.alt} width={400} height={520} sizes="(max-width: 720px) 45vw, 200px" className="pz-img" />)}</div></section>

        <section className="pz-lead" aria-labelledby="pdf"><h2 id="pdf" className="section-title">Guía de bolsillo: 12 poses para el día de tu boda</h2>
          <p className="section-lead">Un PDF para tu celular con una pose por pantalla y la frase para decirle a tu fotógrafo.</p><LeadForm source="hub" /></section>
        <FaqBlock items={h.faq} />
      </div>
    </main>
  );
}
