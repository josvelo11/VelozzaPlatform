import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { getAllIndustries } from '@/lib/industries';

export default function IndustriesPage() {
  const industries = getAllIndustries();

  return (
    <main>
      <Breadcrumb items={[{ name: 'Inicio', href: '/' }, { name: 'Industrias' }]} />

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Industrias Programáticas</h1>
        <p style={{ fontSize: '18px', color: '#a7a7a7', marginBottom: '40px' }}>
          Estructura SEO escalable para cada vertical de mercado.
        </p>

        <div style={{ display: 'grid', gap: '24px' }}>
          {industries.map((industry) => (
            <article key={industry.slug} style={{ background: 'rgba(18,18,18,0.92)', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.28)', border: '1px solid rgba(212,175,55,0.10)' }}>
              <p style={{ color: '#f4cf63', fontWeight: 700, marginBottom: '8px' }}>{industry.pillar}</p>
              <h2 style={{ marginTop: 0 }}>{industry.title}</h2>
              <p style={{ color: '#efe9d6' }}>{industry.description}</p>
              <Link href={`/industrias/${industry.slug}`} style={{ color: '#f4cf63', fontWeight: 700 }}>
                Ver arquitectura →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
