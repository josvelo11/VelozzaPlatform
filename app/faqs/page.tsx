import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import Link from 'next/link';

const faqs = [
  {
    question: '¿Qué incluye el sistema SEO de Velozza?',
    answer: 'Incluye arquitectura técnica, contenido, schema markup, enlazado interno, local SEO, blog, casos de éxito y páginas por industria.',
  },
  {
    question: '¿Puedo usar la estructura para ES y EN?',
    answer: 'Sí. La plataforma está preparada para expandirse con rutas y metadatos localizados por idioma.',
  },
  {
    question: '¿Cómo convierto FAQs en leads?',
    answer: 'Cada bloque de FAQ está pensado para resolver objeciones y dirigir a CTA de consultoría, contacto o agendamiento.',
  },
  {
    question: '¿Los casos de éxito son indexables?',
    answer: 'Sí. Los casos de éxito se publican como páginas únicas con schema y enlaces internos hacia servicios y artículos relacionados.',
  },
];

export default function FAQPage() {
  return (
    <main>
      <Breadcrumb items={[{ name: 'Inicio', href: '/' }, { name: 'FAQs' }]} />

      <section className="section-shell">
        <h1 className="section-title">Sistema de FAQs</h1>
        <p className="section-lead muted">
          Respuestas diseñadas para SEO, conversión y reducción de fricción comercial.
        </p>

        <FAQ items={faqs} title="Preguntas frecuentes sobre la plataforma" />

        <div className="panel panel-pad" style={{ marginTop: '24px' }}>
          <h2 style={{ marginTop: 0 }}>Accesos relacionados</h2>
          <div className="chip-row">
            <Link href="/casos-de-exito" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Casos de éxito</Link>
            <Link href="/servicios" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Servicios</Link>
            <Link href="/blog" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Blog</Link>
            <Link href="/industrias" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Industrias</Link>
          </div>
        </div>
      </section>
    </main>
  );
}