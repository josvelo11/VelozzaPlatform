import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { PremiumIcon } from '@/components/PremiumIcon';
import Link from 'next/link';

export const revalidate = 60;

type ServiceBlock = {
  number: string;
  title: string;
  icon: Parameters<typeof PremiumIcon>[0]['name'];
  description: string;
  bullets: string[];
  values: string[];
  href: string;
  image: string;
  imagePosition: string;
  reverse?: boolean;
};

const services: ServiceBlock[] = [
  {
    number: '01',
    title: 'Marca Personal & Ejecutivo',
    icon: 'target',
    description:
      'Posicionamos tu autoridad con identidad visual, narrativa de liderazgo y arquitectura de persuasión. El objetivo es que tu nombre inspire confianza y genere conversaciones de venta de mayor valor antes del primer contacto comercial.',
    bullets: ['Auditoría de marca personal', 'Narrativa y posicionamiento', 'Identidad visual ejecutiva'],
    values: ['Posicionamiento como experto en tu industria', 'Atracción de oportunidades de negocio', 'Mayor credibilidad y confianza', 'Diferenciación competitiva', 'Ingresos pasivos através de tu marca'],
    href: '/servicios/personal-branding',
    image: '/founder-arms.jpg',
    imagePosition: 'center 18%',
  },
  {
    number: '02',
    title: 'Gestión de Redes Sociales',
    icon: 'social',
    description:
      'Construimos ecosistemas de conversión, no vitrinas de vanidad. Diseñamos contenido estratégico para atraer, educar y convertir audiencia fría en una comunidad que confía, compra y regresa con consistencia.',
    bullets: ['Calendario de contenido', 'Community management', 'Crecimiento orgánico'],
    values: ['Crecimiento orgánico comprobado', 'Mayor engagement con tu audiencia', 'Generación de leads calificados', 'Gestión profesional diaria', 'Análisis y optimización constante'],
    href: '/servicios/social-media-management',
    image: '/founder-fulllength.jpg',
    imagePosition: 'center 28%',
    reverse: true,
  },
  {
    number: '03',
    title: 'Producción de Contenido',
    icon: 'video',
    description:
      'No grabamos videos: producimos activos digitales de alto rendimiento. Desde iluminación y dirección creativa hasta edición final, cada pieza está pensada para paralizar el scroll, elevar percepción y empujar a la acción.',
    bullets: ['Producción cinematográfica', 'Fotografía de marca', 'Podcast y reels'],
    values: ['Mayor engagement vs otros formatos', 'Mejor retención de información', 'Viralidad potencial', 'Posicionamiento en YouTube', 'Conversión mejorada'],
    href: '/servicios/video-marketing',
    image: '/founder-arms.jpg',
    imagePosition: 'center 45%',
  },
  {
    number: '04',
    title: 'Estrategia & Marketing Digital',
    icon: 'analytics',
    description:
      'Integramos estrategia, analítica y ejecución para sostener el crecimiento. Construimos campañas y sistemas que convierten tu presencia digital en una máquina de demanda medible y escalable.',
    bullets: ['Estrategia basada en datos', 'Embudos de conversión', 'Analítica y reportes'],
    values: ['Crecimiento sostenible y medible', 'Decisiones basadas en datos', 'ROI comprobado', 'Optimización continua', 'Escalabilidad sin aumentar costos'],
    href: '/servicios/seo-services',
    image: '/founder-fulllength.jpg',
    imagePosition: 'center top',
    reverse: true,
  },
  {
    number: '05',
    title: 'Publicidad Digital',
    icon: 'bolt',
    description:
      'Diseñamos campañas de intención alta con segmentación precisa, mensajes persuasivos y optimización continua para convertir inversión en clientes reales, no solo en clics o tráfico aislado.',
    bullets: ['Meta & Google Ads', 'Creativos de alto impacto', 'Optimización de ROAS'],
    values: ['Segmentación por intención y perfil de cliente', 'Mensajes alineados al embudo de decisión', 'Optimización de anuncios y presupuesto en tiempo real', 'Generación de leads y ventas medibles', 'Escalamiento con control de costos'],
    href: '/servicios/publicidad-digital',
    image: '/founder-arms.jpg',
    imagePosition: 'center 18%',
  },
  {
    number: '06',
    title: 'Automatización & IA',
    icon: 'ai',
    description:
      'Creamos sistemas inteligentes que ahorran tiempo, califican leads y sostienen tu crecimiento con procesos escalables. La automatización correcta reduce fricción y le permite a tu equipo enfocarse en oportunidades de mayor valor.',
    bullets: ['Automatización de marketing', 'CRM e IA', 'Sistemas que escalan'],
    values: ['Automatización de seguimiento comercial', 'Calificación inteligente de leads', 'Reducción del trabajo manual repetitivo', 'Respuesta más rápida a clientes potenciales', 'Escalabilidad sin aumentar la carga operativa'],
    href: '/servicios/automatizacion-ia',
    image: '/founder-fulllength.jpg',
    imagePosition: 'center 28%',
    reverse: true,
  },
  {
    number: '07',
    title: 'Fotografía Social & Bodas',
    icon: 'camera',
    description:
      'Creamos cobertura visual con sensibilidad editorial para bodas, quinceañeras y eventos sociales de alto valor. Cada entrega equilibra narrativa documental, dirección estética y una experiencia premium que convierte recuerdos en legado visual.',
    bullets: ['Paquetes de bodas 2026', 'Cobertura social premium', 'Portafolio cinematográfico'],
    values: ['Fotografía cinematográfica de alta calidad', 'Cobertura completa de evento', 'Edición profesional y rápida', 'Galería online privada', 'Álbum impreso de lujo'],
    href: '/servicios/bodas',
    image: '/founder-arms.jpg',
    imagePosition: 'center 30%',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Auditoría & Análisis',
    copy: 'Desglosamos tu identidad y competidores para encontrar oportunidades.',
  },
  {
    number: '02',
    title: 'Ingeniería de Marca',
    copy: 'Desarrollamos el lenguaje visual y narrativo que te posiciona.',
  },
  {
    number: '03',
    title: 'Ejecución & Escala',
    copy: 'Desplegamos campañas con optimización continua basada en datos.',
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
        <div
          className="hero-shell"
          style={{ background: 'linear-gradient(180deg, rgba(12,12,10,0.98), rgba(8,8,8,0.98))' }}
        >
          <div
            className="hero-grid"
            style={{ gridTemplateColumns: '1fr', justifyItems: 'center', textAlign: 'center' }}
          >
            <div style={{ maxWidth: '820px' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>
                Nuestros Servicios
              </div>
              <h1 className="hero-title" style={{ maxWidth: '15ch', marginLeft: 'auto', marginRight: 'auto' }}>
                Todo lo que tu marca necesita, en un solo lugar
              </h1>
              <p className="hero-copy" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                Estrategias integrales, ejecución impecable y tecnología inteligente. Diseñamos cada servicio para sumar autoridad, claridad y conversión sin alterar el lenguaje visual que ya define la marca.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <a
                  className="cta-primary"
                  href="https://api.whatsapp.com/send?phone=573213478076&text=Hola%20Velozza%2C%20quiero%20iniciar%20una%20consultor%C3%ADa%20gratuita."
                  target="_blank"
                  rel="noreferrer"
                >
                  Iniciar Consultoría Gratuita
                </a>
                <Link href="/casos-de-exito" className="cta-secondary">
                  Ver Casos de Éxito
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '36px', display: 'grid', gap: '18px' }}>
          {services.map((service) => (
            <section
              key={service.number}
              className={`panel service-panel ${service.reverse ? 'reverse' : ''}`}
              style={{ overflow: 'hidden' }}
            >
              <div className="service-media">
                <img src={service.image} alt={service.title} style={{ objectPosition: service.imagePosition }} />
                <div className="service-media-overlay" />
                <span className="service-number">{service.number}</span>
              </div>
              <div className="service-copy">
                <div className="service-icon-wrap">
                  <PremiumIcon name={service.icon} size={22} />
                </div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul className="service-bullets">
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>
                      <PremiumIcon name="check" size={18} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="service-values">
                  <p className="values-label">Valores que obtienes:</p>
                  <ul className="service-values-list">
                    {service.values.map((value) => (
                      <li key={value}>
                        <PremiumIcon name="check" size={16} />
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={service.href} className="service-link-cta">
                  Ver detalle
                  <PremiumIcon name="arrow-right" size={16} />
                </Link>
              </div>
            </section>
          ))}
        </div>

        <section className="section-shell" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
          <div className="process-shell panel panel-pad" style={{ background: '#0b0b0b' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div className="eyebrow" style={{ display: 'inline-flex' }}>
                Nuestro Método
              </div>
              <h2 className="section-title" style={{ marginBottom: 0, color: '#f4cf63' }}>
                El Proceso Velozza
              </h2>
            </div>
            <div className="process-grid">
              {processSteps.map((step) => (
                <div key={step.number} className="process-step">
                  <div className="process-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="section-shell" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
          <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div className="eyebrow" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                Tarifas
              </div>
              <h2 className="section-title" style={{ color: '#f4cf63', marginBottom: '16px' }}>
                Nuestros Paquetes de Precios
              </h2>
              <p style={{ color: '#a7a7a7', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                Soluciones diseñadas para cada etapa de tu negocio. Invierte en lo que realmente genera resultados.
              </p>
            </div>

            {/* Personal Branding Packages */}
            <div style={{ marginBottom: '64px' }}>
              <h3 style={{ color: '#f8f5ed', fontSize: '22px', marginBottom: '30px', textAlign: 'center' }}>
                Marca Personal & Ejecutivo
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                {[
                  {
                    name: 'Pack Grabación Básico',
                    price: 660000,
                    duration: '1 día de grabación',
                    items: [
                      '8 videos para redes sociales (máximo 2 minutos cada uno)',
                      'Asesoría profesional de guiones',
                      'Edición profesional y color grading',
                      '10 fotos con edición premium',
                      'Todo el equipo de grabación incluido',
                      'Subtítulos en español e inglés',
                      'Entrega en múltiples formatos (4K, HD, vertical)',
                    ],
                  },
                  {
                    name: 'Pack Grabación Premium',
                    price: 880000,
                    duration: '2 días de grabación',
                    featured: true,
                    items: [
                      '12 videos para redes sociales (máximo 2 minutos cada uno)',
                      'Asesoría profesional de guiones',
                      'Edición profesional y color grading',
                      '16 fotos con edición premium',
                      'Todo el equipo de grabación incluido',
                      'Subtítulos en español e inglés',
                      'Entrega en múltiples formatos (4K, HD, vertical)',
                      '2 sesiones de coaching de on-camera',
                    ],
                  },
                ].map((pkg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '30px',
                      backgroundColor: '#0f0f0f',
                      border: pkg.featured ? '2px solid #f4cf63' : '1px solid rgba(244, 207, 99, 0.16)',
                      borderRadius: '12px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {pkg.featured && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          right: '20px',
                          backgroundColor: '#f4cf63',
                          color: '#0b0b0b',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        Recomendado
                      </div>
                    )}
                    <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#f8f5ed' }}>{pkg.name}</h4>
                    <p style={{ fontSize: '12px', color: '#a7a7a7', marginBottom: '20px' }}>{pkg.duration}</p>
                    <div style={{ marginBottom: '25px' }}>
                      <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#f4cf63' }}>
                        ${pkg.price.toLocaleString('es-CO')}
                      </span>
                      <span style={{ color: '#a7a7a7', marginLeft: '8px' }}>COP</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px', flex: 1 }}>
                      {pkg.items.map((item, i) => (
                        <li key={i} style={{ display: 'flex', gap: '8px', color: '#c8c6be', fontSize: '13px' }}>
                          <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Packages */}
            <div>
              <h3 style={{ color: '#f8f5ed', fontSize: '22px', marginBottom: '30px', textAlign: 'center' }}>
                Gestión de Redes Sociales
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                <div
                  style={{
                    padding: '30px',
                    backgroundColor: '#0f0f0f',
                    border: '2px solid #f4cf63',
                    borderRadius: '12px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '20px',
                      backgroundColor: '#f4cf63',
                      color: '#0b0b0b',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    Plan Básico
                  </div>
                  <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#f8f5ed' }}>Plan Básico - Orgánico</h4>
                  <p style={{ fontSize: '12px', color: '#a7a7a7', marginBottom: '5px' }}>1 mes de gestión</p>
                  <p style={{ fontSize: '11px', color: '#a7a7a7', marginBottom: '20px', fontStyle: 'italic' }}>Pago mes anticipado</p>
                  <div style={{ marginBottom: '25px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#f4cf63' }}>$880.000</span>
                    <span style={{ color: '#a7a7a7', marginLeft: '8px' }}>COP/mes</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px', flex: 1 }}>
                    {[
                      '6 videos cortos editados profesionalmente',
                      '4 carruseles estratégicos',
                      '4 piezas gráficas diseñadas',
                      'Asesoría semanal para redes sociales',
                      'Gestión de comentarios y engagement',
                      'Análisis mensual de desempeño',
                      '100% contenido orgánico',
                      'Calendario de publicación personalizado',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', color: '#c8c6be', fontSize: '13px' }}>
                        <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: '12px' }}>
          <div className="service-cta panel panel-pad">
            <h2 className="section-title" style={{ marginBottom: '12px', color: '#f4cf63' }}>
              Hablemos de tu visión y construyamos tu próximo nivel.
            </h2>
            <p className="muted" style={{ margin: '0 auto', maxWidth: '720px' }}>
              Una estrategia personalizada puede cambiar el rumbo de tu marca. Si quieres mantener intacta tu identidad visual, esta página ya está configurada para sumar información sin alterar el sistema de color de Velozza.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <Link href="/contacto" className="cta-primary">
                Agendar Ahora
              </Link>
              <Link href="/industrias" className="cta-secondary">
                Ver Industrias que Atendemos
              </Link>
            </div>
          </div>
        </section>
      </section>

      <style>{`
        .service-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 320px;
        }

        .service-panel.reverse {
          direction: rtl;
        }

        .service-panel.reverse .service-copy,
        .service-panel.reverse .service-media {
          direction: ltr;
        }

        .service-media {
          position: relative;
          min-height: 320px;
          overflow: hidden;
          background: #050505;
          border-right: 1px solid rgba(244, 207, 99, 0.08);
        }

        .service-panel.reverse .service-media {
          border-right: 0;
          border-left: 1px solid rgba(244, 207, 99, 0.08);
        }

        .service-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.68;
        }

        .service-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11, 11, 11, 0.18), rgba(11, 11, 11, 0.92));
        }

        .service-number {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 1;
          font-family: Cormorant Garamond, serif;
          font-size: clamp(3rem, 5vw, 4.5rem);
          line-height: 1;
          color: rgba(244, 207, 99, 0.34);
        }

        .service-copy {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          background: rgba(12, 12, 10, 0.98);
        }

        .service-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: rgba(244, 207, 99, 0.10);
          border: 1px solid rgba(244, 207, 99, 0.16);
          color: #f4cf63;
        }

        .service-copy h2 {
          margin: 0;
          font-size: clamp(1.7rem, 2.6vw, 2.35rem);
          line-height: 1.05;
          font-family: Cormorant Garamond, serif;
          color: #f8f5ed;
        }

        .service-copy p {
          margin: 0;
          color: #c8c6be;
          line-height: 1.8;
        }

        .service-bullets {
          margin: 6px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .service-bullets li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #f8f5ed;
        }

        .service-bullets svg {
          color: #f4cf63;
          flex: 0 0 auto;
        }

        .service-link-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          margin-top: 6px;
          color: #f4cf63;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.82rem;
        }

        .service-values {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(244, 207, 99, 0.08);
        }

        .values-label {
          margin: 0 0 12px 0;
          font-size: 0.9rem;
          font-weight: 700;
          color: #f4cf63;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .service-values-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
        }

        .service-values-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #c8c6be;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .service-values-list svg {
          color: #f4cf63;
          flex: 0 0 auto;
          margin-top: 2px;
        }

        .process-shell {
          display: grid;
          gap: 20px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .process-step {
          position: relative;
          padding-top: 10px;
        }

        .process-number {
          position: absolute;
          top: -44px;
          left: -4px;
          font-family: Cormorant Garamond, serif;
          font-size: clamp(4rem, 7vw, 5.8rem);
          line-height: 1;
          color: rgba(244, 207, 99, 0.10);
          user-select: none;
        }

        .process-step h3 {
          position: relative;
          z-index: 1;
          margin: 0 0 8px;
          font-family: Cormorant Garamond, serif;
          color: #f8f5ed;
          font-size: 1.2rem;
        }

        .process-step p {
          margin: 0;
          color: #a7a7a7;
        }

        .service-cta {
          text-align: center;
          background: linear-gradient(135deg, rgba(14, 14, 14, 0.98), rgba(6, 6, 6, 0.98));
          border: 1px solid rgba(244, 207, 99, 0.18);
        }

        .hero-title,
        .section-title {
          font-family: Cormorant Garamond, serif;
        }

        .eyebrow,
        .service-link-cta {
          font-family: Montserrat, sans-serif;
        }

        @media (max-width: 900px) {
          .service-panel,
          .process-grid {
            grid-template-columns: 1fr;
          }

          .service-panel.reverse {
            direction: ltr;
          }

          .service-media,
          .service-panel.reverse .service-media {
            border-left: 0;
            border-right: 0;
            min-height: 260px;
          }
        }

        @media (max-width: 640px) {
          .hero-shell {
            border-radius: 22px;
          }

          .hero-grid {
            padding: 28px 18px 24px !important;
          }

          .hero-title {
            max-width: 100% !important;
            font-size: clamp(2.2rem, 13vw, 3.2rem);
          }

          .hero-copy {
            font-size: 0.98rem;
            line-height: 1.7;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .hero-actions a,
          .hero-actions button {
            width: 100%;
          }

          .service-panel {
            min-height: auto;
          }

          .service-media {
            min-height: 220px;
          }

          .service-copy {
            padding: 22px 18px 24px;
            gap: 14px;
          }

          .service-copy h2 {
            font-size: 1.55rem;
          }

          .service-bullets {
            gap: 8px;
          }

          .service-bullets li {
            align-items: flex-start;
          }

          .service-link-cta {
            width: 100%;
            justify-content: center;
            padding: 14px 16px;
            border-radius: 999px;
            background: rgba(244, 207, 99, 0.10);
            border: 1px solid rgba(244, 207, 99, 0.18);
          }

          .process-shell,
          .service-cta {
            padding: 22px 18px !important;
          }

          .process-grid {
            gap: 18px;
          }

          .process-step {
            padding-top: 6px;
          }

          .process-number {
            top: -34px;
            font-size: clamp(3.2rem, 16vw, 4.5rem);
          }

          .process-step h3 {
            font-size: 1.08rem;
          }

          .process-step p,
          .service-cta p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .service-cta .hero-actions {
            margin-top: 18px;
          }

          .service-cta .hero-actions a {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
