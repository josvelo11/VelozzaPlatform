import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { PremiumIcon } from '@/components/PremiumIcon';
import { getAllIndustries } from '@/lib/industries';

const extraIndustries = [
  {
    slug: 'consultorios-clinicas',
    pillar: 'SEO Services',
    title: 'Consultorios y Clínicas de Salud',
    description: 'Posicionamiento digital para especialistas médicos, odontólogos y clínicas estéticas. Construimos la autoridad online del profesional para que pacientes de alto poder adquisitivo los encuentren primero en Google, confíen en su expertise y agenden su cita antes de comparar con otras opciones.',
  },
  {
    slug: 'abogados-firmas',
    pillar: 'Personal Branding',
    title: 'Abogados y Firmas de Derecho',
    description: 'Estrategia de posicionamiento legal para abogados que quieren ser la referencia indiscutible en su especialidad. Personal branding de autoridad, SEO local y contenido educativo que convierte la búsqueda de un prospecto en una consulta agendada de alto valor.',
  },
  {
    slug: 'coaches-consultores',
    pillar: 'Personal Branding',
    title: 'Coaches, Consultores y Speakers',
    description: 'Ecosistema de marca personal para expertos que monetizan su conocimiento. Diseñamos la identidad visual, la narrativa de autoridad y el sistema de contenidos que posiciona al coach o consultor como la opción premium e ineludible de su nicho, justificando tarifas de alto ticket.',
  },
  {
    slug: 'restaurantes-hosteleria',
    pillar: 'Video Marketing',
    title: 'Restaurantes y Hostelería Premium',
    description: 'Fotografía gastronómica de estándar editorial, cinematografía de ambiente, social media y SEO local para restaurantes y hoteles boutique que necesitan atraer una clientela de alto poder adquisitivo y convertirla en reservas recurrentes y reseñas de autoridad.',
  },
  {
    slug: 'constructoras-arquitectura',
    pillar: 'Video Marketing',
    title: 'Constructoras y Estudios de Arquitectura',
    description: 'Producción audiovisual y fotografía de obra arquitectónica con estándar editorial internacional. Documentamos proyectos para posicionar constructoras y estudios de diseño como referentes de excelencia ante compradores de alto ticket, fondos de inversión y medios especializados.',
  },
  {
    slug: 'ejecutivos-clevel',
    pillar: 'Personal Branding',
    title: 'Ejecutivos C-Level y Líderes Corporativos',
    description: 'Programa integral de executive branding para CEOs, directores y socios que necesitan posicionarse como líderes de opinión en su industria. LinkedIn strategy, contenido de autoridad, fotografía ejecutiva y visibilidad en medios. Del anonimato corporativo a la referencia visible en 90 días.',
  },
];

export default function IndustriesPage() {
  const industries = getAllIndustries();

  return (
    <main>
      <Breadcrumb items={[{ name: 'Inicio', href: '/' }, { name: 'Industrias' }]} />

      <section className="section-shell">
        <div className="reveal" style={{ maxWidth: '820px', marginBottom: '48px' }}>
          <div className="eyebrow">Especialización por sector</div>
          <h1 className="hero-title" style={{ maxWidth: '18ch' }}>Verticales de Mercado</h1>
          <p className="hero-copy">
            Arquitectura de marca y posicionamiento SEO diseñada para cada industria. No usamos el mismo sistema para todos: cada vertical tiene su propio mapa de autoridad, palabras clave de alto intento de compra y estrategia de conversión.
          </p>
        </div>

        <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {industries.map((industry, i) => (
            <article key={industry.slug} className="feature-card tilt reveal premium-card industry-card" style={{ transitionDelay: `${(i % 6) * 0.06}s` }}>
              <span className="industry-pillar">{industry.pillar}</span>
              <h2 className="industry-title">{industry.title}</h2>
              <p className="industry-description">{industry.description}</p>
              <Link href={`/industrias/${industry.slug}`} className="industry-link">
                Ver arquitectura
                <PremiumIcon name="arrow-right" size={16} />
              </Link>
            </article>
          ))}
          {extraIndustries.map((industry, i) => (
            <article key={industry.slug} className="feature-card tilt reveal premium-card industry-card" style={{ transitionDelay: `${(i % 6) * 0.06}s` }}>
              <span className="industry-pillar">{industry.pillar}</span>
              <h2 className="industry-title">{industry.title}</h2>
              <p className="industry-description">{industry.description}</p>
              <Link href="/contacto" className="industry-link">
                Consultar sobre este sector
                <PremiumIcon name="arrow-right" size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .industry-card {
          display: flex;
          flex-direction: column;
        }

        .industry-pillar {
          display: inline-flex;
          align-self: flex-start;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.22);
          color: #f4cf63;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .industry-title {
          margin: 0 0 12px;
          font-size: 1.4rem;
          font-family: Cormorant Garamond, serif;
          color: #f8f5ed;
        }

        .industry-description {
          flex: 1;
          color: #efe9d6;
          margin-bottom: 20px;
          line-height: 1.75;
        }

        .industry-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          color: #f4cf63;
          font-weight: 700;
          text-decoration: none;
          transition: gap 200ms ease;
        }

        .industry-link:hover {
          gap: 14px;
        }
      `}</style>
    </main>
  );
}
