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

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Casos de Éxito</h1>
        <p style={{ fontSize: '18px', color: '#a7a7a7', marginBottom: '40px' }}>
          Resultados reales de crecimiento orgánico, branding y leads para clientes en Latinoamérica y EEUU hispano.
        </p>

        <div style={{ display: 'grid', gap: '30px' }}>
          {studies.map((study) => (
            <article key={study.slug} style={{ background: 'rgba(18,18,18,0.92)', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.28)', border: '1px solid rgba(212,175,55,0.10)' }}>
              <p style={{ color: '#f4cf63', fontWeight: 700, marginBottom: '8px' }}>{study.industry}</p>
              <h2 style={{ marginTop: 0 }}>{study.title}</h2>
              <p style={{ color: '#efe9d6' }}>{study.challenge}</p>
              <Link href={`/casos-de-exito/${study.slug}`} style={{ color: '#f4cf63', fontWeight: 700 }}>
                Ver caso completo →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
