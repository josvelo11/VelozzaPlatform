import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { getAllCaseStudies } from '@/lib/case-studies';

export default function CaseStudiesPage() {
  const studies = getAllCaseStudies();

  return (
    <main>
      <Breadcrumb
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Casos de Éxito' },
        ]}
      />

      <section className="section-shell">
        <div className="reveal" style={{ maxWidth: '780px', marginBottom: '48px' }}>
          <div className="eyebrow">Resultados verificables</div>
          <h1 className="hero-title" style={{ maxWidth: '16ch' }}>Casos de Éxito</h1>
          <p className="hero-copy">
            Resultados reales, documentados caso por caso, con datos verificables — sin cifras genéricas. Vamos publicando cada caso a medida que lo cerramos con nuestros clientes.
          </p>
        </div>

        <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {studies.map((study, i) => (
            <Link
              key={study.slug}
              href={`/casos-de-exito/${study.slug}`}
              className="feature-card tilt reveal"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', transitionDelay: `${i * 0.08}s` }}
            >
              <p style={{ color: '#f4cf63', fontWeight: 700, marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>{study.industry}</p>
              <h2 style={{ marginTop: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem' }}>{study.title}</h2>
              <p style={{ color: '#c8c6be', lineHeight: 1.7 }}>{study.challenge}</p>
              <span style={{ color: '#f4cf63', fontWeight: 700, display: 'inline-block', marginTop: '12px' }}>
                Ver caso completo →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
