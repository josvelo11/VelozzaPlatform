import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import Link from 'next/link';

const services = [
  {
    title: 'Personal Branding',
    icon: '👤',
    description: 'Construye tu marca personal como experto en tu industria',
    href: '/servicios/personal-branding',
  },
  {
    title: 'Social Media Management',
    icon: '📱',
    description: 'Gestión profesional de redes sociales con resultados medibles',
    href: '/servicios/social-media-management',
  },
  {
    title: 'SEO Services',
    icon: '🔍',
    description: 'Posicionamiento en Google para tráfico orgánico escalable',
    href: '/servicios/seo-services',
  },
  {
    title: 'Video Marketing',
    icon: '🎥',
    description: 'Producción y estrategia de video para máximo impacto',
    href: '/servicios/video-marketing',
  },
];

const faqs = [
  {
    question: '¿Cuál es el proceso de trabajo de Velozza?',
    answer: 'Iniciamos con un análisis profundo de tu negocio, definimos objetivos SMART, creamos estrategia personalizada y ejecutamos con reportes mensuales.',
  },
  {
    question: '¿Cuánto tiempo tarda en ver resultados?',
    answer: 'Depende del servicio. Social media: 2-3 meses, SEO: 3-6 meses, Personal branding: 1-3 meses. Todos ofrecemos garantía de resultados.',
  },
  {
    question: '¿Cuál es el presupuesto mínimo?',
    answer: 'Tenemos opciones desde $500 USD mensuales. Ofrecemos consultoría inicial gratuita para definir la mejor opción para tu negocio.',
  },
];

export default function ServicesPage() {
  return (
    <main>
      <Breadcrumb
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Servicios' },
        ]}
      />

      <section className="section-shell">
        <div className="hero-shell">
          <div className="hero-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ maxWidth: '840px' }}>
              <div className="eyebrow">Arquitectura de servicios</div>
              <h1 className="hero-title" style={{ maxWidth: '14ch' }}>
                Nuestros Servicios
              </h1>
              <p className="hero-copy">
                Soluciones completas de marketing digital y branding para posicionar, convertir y escalar tu marca.
              </p>
              <div className="hero-actions">
                <Link href="/contacto" className="cta-primary">Agendar consultoría</Link>
                <Link href="/casos-de-exito" className="cta-secondary">Ver resultados</Link>
              </div>
              <div className="chip-row" style={{ marginTop: '24px' }}>
                <span className="chip">Branding</span>
                <span className="chip">SEO</span>
                <span className="chip">Contenido</span>
                <span className="chip">Video</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '36px' }} className="feature-grid">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article className="feature-card" style={{ minHeight: '220px' }}>
                <div className="feature-icon">{service.icon}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-soft)', lineHeight: '1.7', margin: 0 }}>{service.description}</p>
                <div style={{ marginTop: '18px', color: 'var(--accent-strong)', fontWeight: 700 }}>Ver detalle →</div>
              </article>
            </Link>
          ))}
        </div>

        <div className="section-shell" style={{ paddingTop: '56px' }}>
          <div className="panel panel-pad" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.98), rgba(15,23,42,0.94))', color: 'white' }}>
            <div style={{ display: 'grid', gap: '14px', textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
              <h2 className="section-title" style={{ color: 'white', marginBottom: 0 }}>Diseño pensado para conversión</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)' }}>
                Cada servicio está preparado para llevar tráfico, autoridad y leads hacia una acción clara.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqs} title="Preguntas Frecuentes sobre Nuestros Servicios" />
    </main>
  );
}
