import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
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

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '16px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>Verticales de Mercado</h1>
        <p style={{ fontSize: '1.08rem', color: '#a7a7a7', marginBottom: '48px', maxWidth: '72ch' }}>
          Arquitectura de marca y posicionamiento SEO diseñada para cada industria. No usamos el mismo sistema para todos: cada vertical tiene su propio mapa de autoridad, palabras clave de alto intento de compra y estrategia de conversión.
        </p>

        <div style={{ display: 'grid', gap: '24px' }}>
          {industries.map((industry) => (
            <article key={industry.slug} style={{ background: 'rgba(18,18,18,0.92)', borderRadius: '22px', padding: '28px', boxShadow: '0 14px 40px rgba(0,0,0,0.22)', border: '1px solid rgba(212,175,55,0.10)' }}>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.22)', color: '#f4cf63', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>{industry.pillar}</span>
              <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.4rem' }}>{industry.title}</h2>
              <p style={{ color: '#efe9d6', marginBottom: '20px', lineHeight: '1.75' }}>{industry.description}</p>
              <Link href={`/industrias/${industry.slug}`} style={{ color: '#f4cf63', fontWeight: 700, textDecoration: 'none' }}>
                Ver arquitectura →
              </Link>
            </article>
          ))}
          {extraIndustries.map((industry) => (
            <article key={industry.slug} style={{ background: 'rgba(18,18,18,0.92)', borderRadius: '22px', padding: '28px', boxShadow: '0 14px 40px rgba(0,0,0,0.22)', border: '1px solid rgba(212,175,55,0.10)' }}>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.22)', color: '#f4cf63', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>{industry.pillar}</span>
              <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.4rem' }}>{industry.title}</h2>
              <p style={{ color: '#efe9d6', marginBottom: '20px', lineHeight: '1.75' }}>{industry.description}</p>
              <span style={{ color: '#f4cf63', fontWeight: 700, cursor: 'pointer' }}>Ver arquitectura →</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
