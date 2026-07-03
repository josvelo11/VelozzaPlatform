import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon } from '@/components/PremiumIcon';
import { generateMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';

const socialPackages = [
  {
    name: 'Colección I · Editorial Signature',
    price: '$330.000 COP',
    description: 'Ideal para quinceañeras, cumpleaños especiales y retratos previos al evento con dirección visual.',
    items: [
      'Experiencia de modelaje pre-evento',
      '30 fotografías high-res',
      'Revelado de autor con color grading',
      'Entrega en formato digital',
    ],
  },
  {
    name: 'Colección II · Social Prestige',
    price: '$450.000 COP',
    description: 'Pensado para 15 años, cumpleaños y celebraciones sociales que necesitan una narrativa documental completa.',
    items: [
      'Documentación del evento',
      'Selección curada de 100 a 120 fotos',
      'Narrativa documental',
      'Entrega en formato digital',
    ],
  },
];

const weddingPackages = [
  {
    name: 'Colección I · Esencia Ceremonial',
    subtitle: 'Cobertura esencial',
    price: '$500.000 COP',
    items: [
      'Ceremonia y recepción',
      '120 a 150 fotos narrativas',
      'Revelado de autor',
      'Entrega 100% digital',
    ],
  },
  {
    name: 'Colección II · Crónica de Autor',
    subtitle: 'Historia completa',
    price: '$650.000 COP',
    items: [
      'Preparativos y ceremonia',
      'Recepción y fiesta',
      '150 a 170 fotos narrativas',
      'Énfasis en detalles',
      'Entrega 100% digital',
    ],
    featured: true,
  },
  {
    name: 'Colección III · Firma Velozza',
    subtitle: 'Experiencia editorial total',
    price: '$850.000 COP',
    items: [
      'Sesión pre-boda antes del evento',
      'Cobertura de preparativos y ceremonia',
      'Entrega de 170 a 220 fotos digitales',
      'Revelado premium y entrega digital',
    ],
  },
];

const portfolioImages = [
  {
    src: '/bodas/boda-preparativos-bn.jpg',
    alt: 'Preparativos del novio en blanco y negro',
  },
  {
    src: '/bodas/boda-preparativos-espejo.jpg',
    alt: 'Preparativos de novia frente al espejo',
  },
  {
    src: '/bodas/boda-complicidad.jpg',
    alt: 'Momento de complicidad de los novios durante la boda',
  },
  {
    src: '/bodas/boda-iglesia-color.jpg',
    alt: 'Retrato de pareja en iglesia durante la ceremonia',
  },
  {
    src: '/bodas/boda-espejo-novia.jpg',
    alt: 'Novia preparándose frente al espejo antes de la ceremonia',
  },
  {
    src: '/bodas/boda-ceremonia.jpg',
    alt: 'Ceremonia de boda fotografiada por Velozza Creative Works',
  },
  {
    src: '/bodas/boda-oracion-altar.jpg',
    alt: 'Novios en oración durante la ceremonia religiosa',
  },
  {
    src: '/bodas/boda-retrato-novia.jpg',
    alt: 'Retrato de novia en una boda de Bogotá',
  },
  {
    src: '/bodas/boda-beso-salida.jpg',
    alt: 'Beso de salida de los novios al final de la ceremonia',
  },
  {
    src: '/bodas/boda-retrato-pareja.jpg',
    alt: 'Retrato de pareja en boda capturado por Velozza Creative Works',
  },
];

const faqs = [
  {
    question: '¿Las tarifas aplican para cualquier zona de Bogotá?',
    answer:
      'Las tarifas publicadas aplican para eventos dentro de Bogotá, en la parte central. Si la cobertura es fuera de esa zona, se suma un recargo fijo de transporte de $50.000 COP.',
  },
  {
    question: '¿Puedo personalizar un paquete si mi boda tiene otra estructura?',
    answer:
      'Sí. Si tu boda requiere más horas, una segunda sesión o una cobertura distinta, armamos una propuesta a medida manteniendo la línea visual y narrativa de Velozza.',
  },
  {
    question: '¿También cubres otros eventos sociales?',
    answer:
      'Sí. Además de bodas, Velozza cubre quinceañeras, cumpleaños, aniversarios, pedidas de mano y sesiones editoriales previas al evento.',
  },
];

export const metadata = generateMetadata({
  title: 'Paquetes de Fotografía para Bodas 2026',
  description:
    'Página exclusiva de paquetes de fotografía social y bodas de Velozza Creative Works. Incluye tarifas 2026, portafolio de bodas y condiciones de cobertura en Bogotá.',
  keywords: [
    'fotografía de bodas bogotá',
    'paquetes de bodas 2026',
    'fotografía eventos sociales bogotá',
    'fotógrafo de bodas velozza',
  ],
  url: '/servicios/bodas',
  image: 'https://velozzaworks.com/bodas/boda-ceremonia.jpg',
});

export default function BodasPage() {
  const schema = serviceSchema(
    'Paquetes de Fotografía para Bodas 2026',
    'Cobertura fotográfica premium para bodas y eventos sociales en Bogotá, con paquetes 2026, dirección visual y narrativa cinematográfica.',
    'https://velozzaworks.com/bodas/boda-ceremonia.jpg',
    'https://velozzaworks.com/servicios/bodas'
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Servicios', href: '/servicios' },
            { name: 'Bodas y Eventos Sociales' },
          ]}
        />

        <section className="section-shell bodas-intro-shell">
          <div className="hero-shell bodas-hero">
            <div className="hero-grid bodas-hero-grid">
              <div>
                <div className="eyebrow">Agenda 2026 abierta</div>
                <h1 className="hero-title bodas-hero-title" style={{ maxWidth: '11ch' }}>
                  Paquetes de bodas 2026 con narrativa, elegancia y una firma visual inolvidable
                </h1>
                <p className="hero-copy bodas-hero-copy">
                  Esta página está pensada para mostrar con claridad los paquetes de fotografía de bodas que hoy vendemos en Bogotá. Cada colección cuida los momentos más importantes de tu día con una mezcla de sensibilidad documental, retrato editorial y una entrega visual que se siente premium desde el primer vistazo.
                </p>
                <div className="hero-actions bodas-hero-actions">
                  <a
                    className="cta-primary"
                    href="https://api.whatsapp.com/send?phone=573193677929&text=Hola%20Velozza%2C%20quiero%20informacion%20sobre%20los%20paquetes%20de%20bodas%202026."
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cotizar por WhatsApp
                  </a>
                  <a
                    className="cta-secondary"
                    href="https://velozzacreative.myportfolio.com/bodas"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver catálogo completo de fotos
                  </a>
                </div>
              </div>

              <div className="hero-side panel panel-pad">
                <figure className="hero-photo-frame">
                  <img src="/bodas/boda-ceremonia.jpg" alt="Fotografía principal de boda de Velozza Creative Works" />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="catalog-announcement panel panel-pad">
            <div>
              <div className="eyebrow">Catálogo visual</div>
              <h2 className="section-title">Para ver el catálogo completo de fotos, da click en este anuncio</h2>
              <p className="section-lead" style={{ marginBottom: 0 }}>
                Aquí ves una muestra seleccionada de bodas reales. Si quieres recorrer el portafolio completo con más escenas, más parejas y más momentos del día, entra al anuncio y abre el catálogo visual completo de Velozza.
              </p>
            </div>
            <a
              className="cta-primary catalog-button"
              href="https://velozzacreative.myportfolio.com/bodas"
              target="_blank"
              rel="noreferrer"
            >
              Ver portafolio completo
            </a>
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="panel panel-pad">
            <div style={{ maxWidth: '760px', marginBottom: '24px' }}>
              <div className="eyebrow">Eventos sociales</div>
              <h2 className="section-title">Coberturas para eventos sociales con la misma línea premium</h2>
              <p className="section-lead" style={{ marginBottom: 0 }}>
                Además de bodas, también contamos con propuestas para celebraciones sociales que necesitan verse con criterio, elegancia y una presentación comercial seria. Este bloque complementa la oferta principal y ayuda a mostrar un portafolio de servicio más completo y profesional.
              </p>
            </div>

            <div className="package-grid two-up">
              {socialPackages.map((pkg) => (
                <article key={pkg.name} className="package-card social-package">
                  <div className="package-head">
                    <div>
                      <p className="package-kicker">Colección social</p>
                      <h3>{pkg.name}</h3>
                    </div>
                    <div className="package-price">{pkg.price}</div>
                  </div>
                  <p className="muted" style={{ marginTop: 0 }}>{pkg.description}</p>
                  <ul className="package-list">
                    {pkg.items.map((item) => (
                      <li key={item}>
                        <PremiumIcon name="check" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="section-copy">
            <div className="eyebrow">Bodas 2026</div>
            <h2 className="section-title">Paquetes de fotografía de bodas</h2>
            <p className="section-lead">
              Los siguientes planes salen directo del tarifario 2026 y ya están listos para conversión. Presentan una progresión clara: cobertura esencial, historia completa y experiencia editorial total.
            </p>
          </div>

          <div className="package-grid three-up">
              {weddingPackages.map((pkg) => (
                <article key={pkg.name} className={`package-card wedding-package${pkg.featured ? ' featured' : ''}`}>
                <div className="package-badge">{pkg.subtitle}</div>
                <h3>{pkg.name}</h3>
                <div className="package-price package-price-large">{pkg.price}</div>
                <ul className="package-list">
                  {pkg.items.map((item) => (
                    <li key={item}>
                      <PremiumIcon name="check" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className="cta-secondary package-action"
                  href={`https://api.whatsapp.com/send?phone=573193677929&text=${encodeURIComponent(`Hola Velozza, quiero reservar el ${pkg.name} para mi boda.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consultar este plan
                </a>
              </article>
            ))}
          </div>

        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="panel panel-pad portfolio-shell">
            <div className="portfolio-heading">
              <div>
                <div className="eyebrow">Fotos reales</div>
                <h2 className="section-title">Muestra de bodas</h2>
                <p className="section-lead" style={{ marginBottom: 0 }}>
                  Esta muestra acompaña los paquetes con imágenes reales de tu trabajo para que la decisión de compra tenga claridad visual, estilo y confianza. Dejamos más fotografías aquí para despertar interés y llevar a la gente a ver el catálogo completo.
                </p>
              </div>
              <a
                className="cta-secondary"
                href="https://velozzacreative.myportfolio.com/bodas"
                target="_blank"
                rel="noreferrer"
              >
                Abrir catálogo completo
              </a>
            </div>

            <div className="portfolio-grid">
              {portfolioImages.map((image) => (
                <figure key={image.src} className="portfolio-card">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="panel panel-pad final-cta">
            <div>
              <div className="eyebrow">Reserva</div>
              <h2 className="section-title">Si tu fecha ya está definida, el siguiente paso es cotizarla hoy</h2>
              <p className="section-lead" style={{ marginBottom: 0 }}>
                Si quieres esta misma página funcionando como pieza de venta, ya está preparada para dirigir al cliente a WhatsApp o correo con una oferta clara y un portafolio coherente.
              </p>
            </div>
            <div className="hero-actions bodas-final-actions" style={{ marginTop: 0 }}>
              <Link href="/contacto" className="cta-secondary">
                Ir a contacto
              </Link>
              <a
                className="cta-primary"
                href="https://api.whatsapp.com/send?phone=573193677929&text=Hola%20Velozza%2C%20quiero%20apartar%20mi%20fecha%20para%20boda%20o%20evento%20social."
                target="_blank"
                rel="noreferrer"
              >
                Apartar mi fecha
              </a>
            </div>
          </div>
        </section>

        <FAQ items={faqs} title="Preguntas frecuentes sobre bodas y eventos sociales" />
      </main>

      <style>{`
        .bodas-intro-shell {
          padding-top: 40px;
        }

        .bodas-hero-grid {
          align-items: stretch;
        }

        .bodas-hero-title {
          max-width: 10ch;
        }

        .bodas-hero-copy {
          max-width: 58ch;
        }

        .hero-side {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.08), rgba(18, 18, 18, 0.86));
        }

        .hero-photo-frame {
          margin: 0;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(244, 207, 99, 0.18);
          min-height: 360px;
          background: #080808;
        }

        .hero-photo-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .package-kicker,
        .package-kicker,
        .package-badge {
          display: inline-flex;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(244, 207, 99, 0.9);
          font-size: 0.78rem;
        }

        .package-grid {
          display: grid;
          gap: 20px;
        }

        .two-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .three-up {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .catalog-announcement,
        .portfolio-heading,
        .final-cta {
          display: flex;
          gap: 24px;
          justify-content: space-between;
          align-items: end;
        }

        .catalog-announcement {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.14), rgba(18, 18, 18, 0.94));
          border-color: rgba(244, 207, 99, 0.28);
        }

        .catalog-button {
          white-space: nowrap;
        }

        .package-card {
          padding: 24px;
          border-radius: 24px;
          border: 1px solid rgba(244, 207, 99, 0.14);
          background: linear-gradient(180deg, rgba(15, 15, 15, 0.96), rgba(24, 24, 24, 0.92));
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
        }

        .package-card h3 {
          margin: 8px 0 8px;
          font-size: 2rem;
          line-height: 1;
        }

        .package-head {
          display: flex;
          gap: 16px;
          justify-content: space-between;
          align-items: flex-start;
        }

        .package-price {
          color: #f4cf63;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .package-price-large {
          margin-bottom: 18px;
        }

        .package-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }

        .package-list li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 10px;
          align-items: start;
          color: #efe9d6;
        }

        .wedding-package.featured {
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.12), rgba(17, 17, 17, 0.96));
          border-color: rgba(244, 207, 99, 0.32);
          transform: translateY(-6px);
        }

        .package-action {
          width: 100%;
          margin-top: 20px;
        }

        .portfolio-shell {
          overflow: hidden;
        }

        .portfolio-grid {
          margin-top: 28px;
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .portfolio-card {
          margin: 0;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #121212;
          min-height: 280px;
        }

        .portfolio-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 1100px) {
          .bodas-hero-title {
            max-width: 12ch;
          }
        }

        @media (max-width: 980px) {
          .bodas-intro-shell {
            padding-top: 28px;
          }

          .three-up,
          .two-up,
          .portfolio-grid {
            grid-template-columns: 1fr 1fr;
          }

          .bodas-hero-grid {
            gap: 18px;
          }

          .bodas-hero-title {
            max-width: 14ch;
            margin-bottom: 12px;
          }

          .bodas-hero-copy {
            font-size: 0.98rem;
          }

          .hero-photo-frame {
            min-height: 300px;
          }

          .package-card {
            padding: 20px;
          }

          .package-card h3 {
            font-size: 1.7rem;
          }

          .wedding-package.featured {
            transform: none;
          }

          .bodas-hero-actions,
          .bodas-final-actions,
          .catalog-announcement,
          .portfolio-heading,
          .final-cta {
            align-items: flex-start;
            flex-direction: column;
          }

          .bodas-hero-actions a,
          .bodas-final-actions a,
          .catalog-button,
          .portfolio-heading a {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .bodas-intro-shell {
            padding-top: 18px;
          }

          .three-up,
          .two-up,
          .portfolio-grid {
            grid-template-columns: 1fr;
          }

          .bodas-hero-title {
            max-width: none;
            font-size: clamp(2.15rem, 11vw, 3.4rem);
            line-height: 0.94;
          }

          .bodas-hero-copy {
            font-size: 0.94rem;
          }

          .eyebrow {
            font-size: 0.74rem;
          }

          .package-head {
            flex-direction: column;
          }

          .package-price {
            white-space: normal;
          }

          .package-card {
            padding: 18px;
          }

          .package-card h3 {
            font-size: 1.45rem;
          }

          .portfolio-card {
            min-height: 220px;
          }

          .hero-photo-frame {
            min-height: 220px;
          }

          .catalog-announcement,
          .portfolio-shell,
          .final-cta {
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}