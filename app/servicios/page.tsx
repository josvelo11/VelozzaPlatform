import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon } from '@/components/PremiumIcon';
import Link from 'next/link';

const services = [
  {
    title: 'Personal Branding & Legacy',
    icon: 'target',
    description: 'Transformamos expertos en íconos de su industria. Diseñamos tu identidad visual, narrativa de autoridad y arquitectura de persuasión para que tu nombre se convierta en sinónimo de excelencia. Sistema diseñado para profesionales, ejecutivos y emprendedores que necesitan que su presencia genere confianza y conversión antes de cualquier conversación de ventas.',
    href: '/servicios/personal-branding',
  },
  {
    title: 'Social Media Management',
    icon: 'social',
    description: 'Ecosistemas de conversión, no de vanidad. La mayoría de agencias gestionan redes para conseguir likes; nosotros las gestionamos para construir autoridad y generar pipeline de ventas. Embudos de contenido estratégico con gatillos psicológicos que educan a tu audiencia, generan confianza progresiva y transforman el tráfico frío en una comunidad que compra, refiere y regresa.',
    href: '/servicios/social-media-management',
  },
  {
    title: 'Posicionamiento SEO (Búsqueda)',
    icon: 'search',
    description: 'Construimos bienes raíces digitales. El SEO es la inversión con mayor retorno compuesto: cada artículo, cada página optimizada y cada enlace de autoridad que construimos hoy genera tráfico calificado durante años. Mientras tu competencia paga por visibilidad efímera, estructuramos tu ecosistema en Google para que seas la primera y única opción cuando tu cliente esté listo para comprar.',
    href: '/servicios/seo-services',
  },
  {
    title: 'Video Marketing & Cinematografía',
    icon: 'video',
    description: 'No grabamos videos, producimos activos digitales de alto rendimiento. Iluminación bi-color de alto contraste, monitoreo profesional en campo y color grading avanzado para entregar piezas con estándar cinematográfico que paralizan el scroll, comunican autoridad y fuerzan la retención hasta el call to action.',
    href: '/servicios/video-marketing',
  },
  {
    title: 'Fotografía Corporativa',
    icon: 'camera',
    description: 'Tu imagen dice más que cualquier texto en tu sitio web. Retratos de autoridad para C-Level, equipos ejecutivos y marcas personales que necesitan transmitir poder, confianza y exclusividad en cada punto de contacto visual. Dominamos la luz, la composición y la dirección de arte para crear imágenes que elevan subconscientemente la percepción de valor de quienes las ven.',
    href: '/servicios',
  },
  {
    title: 'Eventos Sociales Élite',
    icon: 'star',
    description: 'Los momentos de mayor prestigio merecen una documentación a su altura. Cobertura documental y cinematográfica para galas corporativas, lanzamientos de alto perfil y celebraciones privadas. Operamos con absoluta discreción para capturar los momentos que definen el legado de tu marca. Cada imagen y video es un activo de contenido que usarás durante meses.',
    href: '/servicios',
  },
];

const faqs = [
  {
    question: '¿Cuál es el proceso de trabajo de Velozza?',
    answer: 'Trabajamos en tres fases. Diagnóstico Estratégico: auditamos tu posicionamiento actual, analizamos tu competencia e identificamos las brechas de percepción que te están costando clientes premium. Arquitectura de Ecosistema: diseñamos tu sistema de marca a medida, integrando identidad visual, narrativa de autoridad, mapa de contenidos SEO y producción audiovisual en un plan coherente. Ejecución Continua: implementamos, medimos y optimizamos mes a mes, generando un efecto compuesto que crece con el tiempo. No iniciamos ningún proyecto sin una sesión estratégica previa.',
  },
  {
    question: '¿Cuánto tiempo tarda en ver resultados?',
    answer: 'Los plazos varían por servicio. El branding visual y las redes sociales muestran resultados perceptibles en las primeras 3 a 4 semanas. El SEO orgánico comienza a traccionar entre los meses 3 y 6, con crecimiento compuesto y acelerado a partir de ese punto. Los proyectos de video y fotografía generan impacto inmediato desde el primer día de publicación. Los clientes que integran todos los servicios en un ecosistema completo reportan un cambio visible en la percepción de su mercado antes de los 90 días.',
  },
  {
    question: '¿Cuál es el presupuesto mínimo?',
    answer: 'Trabajamos con inversiones desde $1,500 USD/mes para servicios individuales y desde $3,500 USD/mes para ecosistemas integrados de dos o más servicios. No manejamos paquetes predefinidos porque cada proyecto se construye sobre el diagnóstico estratégico de tu negocio, tu competencia y tus objetivos. El costo exacto se define en la sesión estratégica inicial, que es completamente gratuita.',
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
              <div className="eyebrow">ECOSISTEMAS DE DOMINIO ABSOLUTO</div>
              <h1 className="hero-title" style={{ maxWidth: '14ch' }}>
                Ecosistemas de Crecimiento
              </h1>
              <p className="hero-copy">
                No vendemos servicios. Construimos sistemas de posicionamiento, visibilidad y conversión que trabajan de forma integrada. Cada solución está diseñada para escalar tu percepción de valor, atraer clientes de alto perfil y convertir tu presencia digital en el activo más rentable de tu negocio.
              </p>
              <div className="hero-actions">
                <a
                  className="cta-primary"
                  href="https://api.whatsapp.com/send?phone=573193677929&text=Hola%20Velozza%2C%20quiero%20iniciar%20una%20consultor%C3%ADa%20gratuita."
                  target="_blank"
                  rel="noreferrer"
                >
                  Iniciar Consultoría Gratuita
                </a>
                <Link href="/casos-de-exito" className="cta-secondary">Ver Casos de Éxito</Link>
              </div>
              <div className="chip-row" style={{ marginTop: '24px' }}>
                <span className="chip">Branding</span>
                <span className="chip">SEO</span>
                <span className="chip">Social Media</span>
                <span className="chip">Video</span>
                <span className="chip">Fotografía</span>
                <span className="chip">Eventos</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .feature-card {
            transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, border-color 180ms ease;
          }

          .feature-card:hover {
            transform: translateY(-4px);
            border-color: rgba(244, 207, 99, 0.34) !important;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.16), rgba(18, 18, 18, 0.96)) !important;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.34), inset 0 0 0 1px rgba(244, 207, 99, 0.08);
          }

          .feature-card:hover .feature-icon {
            background: linear-gradient(135deg, rgba(240, 217, 138, 0.22), rgba(212, 175, 55, 0.10));
            border-color: rgba(244, 207, 99, 0.30);
          }
        `}</style>

        <div style={{ marginTop: '36px' }} className="feature-grid">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article className="feature-card" style={{ minHeight: '220px' }}>
                <div className="feature-icon"><PremiumIcon name={service.icon as any} size={22} /></div>
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
              <h2 className="section-title" style={{ color: 'white', marginBottom: 0 }}>Cada servicio es un sistema, no un entregable.</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)' }}>
                No ejecutamos tareas sueltas. Cada pieza que producimos está diseñada para integrarse en tu ecosistema de marca y potenciar el resto de los canales. Eso convierte el marketing en un activo compuesto que crece con el tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqs} title="Preguntas Frecuentes sobre Nuestros Servicios" />

          <section className="section-shell">
            <div className="panel panel-pad" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(244,207,99,0.05))', border: '1px solid rgba(212,175,55,0.22)', textAlign: 'center' }}>
              <div style={{ maxWidth: '680px', margin: '0 auto', display: 'grid', gap: '18px' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>¿Cuál de Estos Sistemas Necesita tu Marca?</h2>
                <p style={{ margin: 0, fontSize: '1.05rem' }}>Agenda una sesión estratégica gratuita de 30 minutos. Analizamos tu situación actual y diseñamos el mapa para posicionarte como la referencia indiscutible de tu sector.</p>
                <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  <Link href="/contacto" className="cta-primary">Agendar Consultoría Privada</Link>
                  <Link href="/industrias" className="cta-secondary">Ver Industrias que Atendemos</Link>
                </div>
              </div>
            </div>
          </section>
    </main>
  );
}
