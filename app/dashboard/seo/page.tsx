import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

const metrics = [
  { label: 'Organic Traffic', value: '+178%' },
  { label: 'Keyword Rankings', value: '42 top 10' },
  { label: 'Backlinks', value: '1,284' },
  { label: 'Pages Indexed', value: '96' },
  { label: 'Impressions', value: '84.2K' },
  { label: 'Clicks', value: '6.4K' },
  { label: 'CTR', value: '7.6%' },
  { label: 'Revenue', value: '$18.4K' },
];

const topPages = [
  { page: '/servicios/seo-services', clicks: '1,240' },
  { page: '/blog/personal-branding-2025', clicks: '890' },
  { page: '/casos-de-exito/brandlift-co', clicks: '640' },
];

export default function SEODashboardPage() {
  return (
    <main className="section-shell">
      <Breadcrumb items={[{ name: 'Inicio', href: '/' }, { name: 'Dashboard SEO' }]} />
      <div className="hero-shell" style={{ marginTop: '20px' }}>
        <div className="hero-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <div className="eyebrow">Analytics Orgánico</div>
            <h1 className="hero-title" style={{ maxWidth: '14ch' }}>SEO Dashboard</h1>
            <p className="hero-copy">
              Rendimiento orgánico, visibilidad, conversiones y oportunidades de crecimiento en una sola vista.
            </p>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: '28px', marginBottom: '32px' }}>
        {metrics.map((metric) => (
          <div key={metric.label} className="stat-card">
            <p style={{ color: '#a7a7a7', margin: 0 }}>{metric.label}</p>
            <h3 style={{ margin: '10px 0 0', fontSize: '28px' }}>{metric.value}</h3>
          </div>
        ))}
      </div>

      <section className="panel panel-pad" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0 }}>Top Pages</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {topPages.map((item) => (
            <div key={item.page} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <span>{item.page}</span>
              <strong>{item.clicks}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel panel-pad">
        <div className="chip-row">
          <Link href="/casos-de-exito" className="cta-secondary" style={{ color: '#f8f5ed' }}>Ver casos de éxito</Link>
          <Link href="/industrias" className="cta-secondary" style={{ color: '#f8f5ed' }}>Ver industrias</Link>
          <Link href="/faqs" className="cta-secondary" style={{ color: '#f8f5ed' }}>Ver FAQs</Link>
        </div>
      </section>
    </main>
  );
}
