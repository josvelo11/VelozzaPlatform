import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

export const revalidate = 60;
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon } from '@/components/PremiumIcon';
import { getAllCaseStudies, getCaseStudyBySlug, getCaseStudySchema } from '@/lib/case-studies';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) notFound();

  const schema = getCaseStudySchema(study);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <section className="section-shell" style={{ maxWidth: '900px' }}>
          <Breadcrumb
            items={[
              { name: 'Inicio', href: '/' },
              { name: 'Casos de Éxito', href: '/casos-de-exito' },
              { name: study.title },
            ]}
          />

          <div className="reveal" style={{ marginTop: '24px' }}>
            <div className="eyebrow">{study.industry}</div>
            <h1 className="hero-title" style={{ maxWidth: '20ch', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>{study.title}</h1>
            <p className="hero-copy">{study.challenge}</p>
            {study.services?.length > 0 && (
              <div className="chip-row" style={{ marginTop: '24px' }}>
                {study.services.map((service) => (
                  <span key={service} className="chip">{service}</span>
                ))}
              </div>
            )}
          </div>

          <section className="panel panel-pad reveal case-detail-section" style={{ marginTop: '40px' }}>
            <div className="case-detail-heading">
              <div className="case-detail-icon"><PremiumIcon name="target" size={20} /></div>
              <h2 className="section-title" style={{ margin: 0, fontSize: '1.6rem', color: '#f4cf63' }}>Estrategia</h2>
            </div>
            <ul className="case-detail-list">
              {study.strategy.map((item) => (
                <li key={item}>
                  <PremiumIcon name="check" size={17} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel panel-pad reveal case-detail-section" style={{ marginTop: '24px', transitionDelay: '.1s' }}>
            <div className="case-detail-heading">
              <div className="case-detail-icon"><PremiumIcon name="analytics" size={20} /></div>
              <h2 className="section-title" style={{ margin: 0, fontSize: '1.6rem', color: '#f4cf63' }}>Resultados</h2>
            </div>
            <ul className="case-detail-list">
              {study.results.map((item) => (
                <li key={item}>
                  <PremiumIcon name="check" size={17} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel panel-pad reveal case-testimonial" style={{ marginTop: '24px', transitionDelay: '.2s' }}>
            <span className="case-testimonial-mark">&ldquo;</span>
            <h2 className="section-title" style={{ fontSize: '1.6rem', color: '#f4cf63' }}>Testimonio</h2>
            <p className="case-testimonial-copy">{study.testimonial}</p>
          </section>

          <div className="reveal" style={{ marginTop: '32px' }}>
            <FAQ
              items={[
                { question: '¿Qué se optimizó primero?', answer: 'Arquitectura, contenido, schema y autoridad de marca.' },
                { question: '¿El resultado fue orgánico?', answer: 'Sí, los resultados se construyeron con tráfico y autoridad orgánica.' },
              ]}
            />
          </div>

          <div className="panel panel-pad reveal case-cta" style={{ marginTop: '32px', marginBottom: '48px', textAlign: 'center' }}>
            <h2 className="section-title" style={{ marginBottom: '12px', color: '#f4cf63' }}>
              ¿Quieres resultados como este para tu marca?
            </h2>
            <p className="muted" style={{ margin: '0 auto 24px', maxWidth: '560px' }}>
              Agenda una consultoría estratégica gratuita y evaluamos qué es realista para tu industria.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/contacto" className="cta-primary magnetic">
                Agendar Consultoría
              </Link>
              <Link href="/casos-de-exito" className="cta-secondary">
                Ver todos los casos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .case-detail-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .case-detail-icon {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
          background: rgba(244, 207, 99, 0.10);
          border: 1px solid rgba(244, 207, 99, 0.18);
          color: #f4cf63;
          flex-shrink: 0;
        }

        .case-detail-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }

        .case-detail-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #c8c6be;
          line-height: 1.7;
        }

        .case-detail-list svg {
          color: #f4cf63;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .case-testimonial {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(15,15,15,0.98));
        }

        .case-testimonial-mark {
          position: absolute;
          top: -10px;
          right: 24px;
          font-family: Cormorant Garamond, serif;
          font-size: 8rem;
          line-height: 1;
          color: rgba(244, 207, 99, 0.10);
          pointer-events: none;
        }

        .case-testimonial-copy {
          position: relative;
          font-family: Cormorant Garamond, serif;
          font-size: 1.3rem;
          line-height: 1.6;
          font-style: italic;
          color: #f8f5ed;
          margin: 0;
        }

        .case-cta {
          background: linear-gradient(135deg, rgba(14, 14, 14, 0.98), rgba(6, 6, 6, 0.98));
          border: 1px solid rgba(244, 207, 99, 0.18);
        }

        @media (max-width: 640px) {
          .case-testimonial-copy {
            font-size: 1.1rem;
          }

          .case-cta .hero-actions a {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
