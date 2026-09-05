import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';

export const revalidate = 60;
import { PremiumIcon } from '@/components/PremiumIcon';
import { generateMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';

const socialPackages = [
  {
    name: 'Colección I · Editorial Signature',
    price: '$450.000 COP',
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
    price: '$600.000 COP',
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
    price: '$850.000 COP',
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
    price: '$1.000.000 COP',
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
    price: '$1.200.000 COP',
    items: [
      'Sesión pre-boda antes del evento',
      'Cobertura de preparativos y ceremonia',
      'Entrega de 170 a 220 fotos digitales',
      'Revelado premium y entrega digital',
    ],
  },
];

const portfolioGroups = [
  {
    title: 'Novia · Sesión Editorial',
    subtitle: 'Preparativos, retratos y complicidad en un mismo día de rodaje.',
    images: [
      { src: '/bodas/novia-perfil-elegante-bn.jpg', caption: 'Elegancia en silencio', alt: 'Retrato de perfil de la novia en blanco y negro con tocado de cristales', width: 1466, height: 2200 },
      { src: '/bodas/pareja-editorial-piscina-bn.jpg', caption: 'Frente a frente', alt: 'Pareja de novios espalda con espalda en blanco y negro junto a una piscina', width: 1466, height: 2200 },
      { src: '/bodas/novia-perfil-viento.jpg', caption: 'Brisa y luz', alt: 'Novia de perfil con el cabello al viento y vista a las montañas', width: 1760, height: 2200 },
      { src: '/bodas/boda-novia-vista-ciudad.jpg', caption: 'Frente al horizonte', alt: 'Novia de espaldas contemplando la vista de la ciudad y las montañas', width: 1760, height: 2200 },
      { src: '/bodas/boda-novia-brazos-terraza.jpg', caption: 'Luz de terraza', alt: 'Novia con los brazos en alto sobre una terraza con vista a las montañas', width: 1760, height: 2200 },
      { src: '/bodas/novia-perfil-mano-mejilla-bn.jpg', caption: 'Un instante para sí misma', alt: 'Novia de perfil en blanco y negro con la mano cerca del rostro', width: 1760, height: 2200 },
      { src: '/bodas/boda-retrato-novia-emotiva-bn.jpg', caption: 'Calidez en blanco y negro', alt: 'Retrato emotivo de la novia en blanco y negro con luz cálida', width: 1759, height: 2200 },
      { src: '/bodas/novia-mirada-lateral-verde.jpg', caption: 'Silencio antes del sí', alt: 'Novia apoyada en una pared oscura con mirada lateral', width: 1760, height: 2200 },
      { src: '/bodas/novia-sentada-tacones.jpg', caption: 'Un respiro antes del gran día', alt: 'Novia sentada en un sofá de cuero ajustando sus zapatos', width: 1466, height: 2200 },
      { src: '/bodas/novia-reflejo-espejo.jpg', caption: 'Reflejos de la espera', alt: 'Novia reflejada en un espejo circular durante los preparativos', width: 1760, height: 2200 },
      { src: '/bodas/novia-mano-menton-bn.jpg', caption: 'Pensando en el momento', alt: 'Retrato de la novia en blanco y negro con la mano en el mentón', width: 1466, height: 2200 },
      { src: '/bodas/novia-terraza-ciudad.jpg', caption: 'Mirando el horizonte', alt: 'Novia sentada en una terraza con vista a los edificios de la ciudad', width: 1466, height: 2200 },
      { src: '/bodas/pareja-formal-mirada-bn.jpg', caption: 'Ojos que se encuentran', alt: 'Pareja de novios mirándose fijamente en blanco y negro, ella con esmoquin blanco y negro', width: 1571, height: 2200 },
      { src: '/bodas/novia-velo-ramo-bn.jpg', caption: 'El ramo y el velo', alt: 'Novia sentada con velo y ramo de flores en blanco y negro', width: 1571, height: 2200 },
      { src: '/bodas/boda-novia-ramo-velo.jpg', caption: 'Antes de salir', alt: 'Novia sentada con velo y ramo de flores en un interior cálido', width: 1571, height: 2200 },
    ],
  },
  {
    title: 'Pareja · Jardín Rústico',
    subtitle: 'Una historia de amor contada entre árboles, risas y luz natural.',
    images: [
      { src: '/bodas/boda-velo-abrazo-pareja.jpg', caption: 'Bajo el velo', alt: 'Novios abrazados bajo el velo en un jardín, mejilla con mejilla', width: 1466, height: 2200 },
      { src: '/bodas/boda-pareja-carga-alegria.jpg', caption: 'Volar de la felicidad', alt: 'Novio cargando a la novia entre risas en el jardín', width: 1466, height: 2200 },
      { src: '/bodas/pareja-caballito-alegria.jpg', caption: 'Un vuelo compartido', alt: 'Novia con el brazo extendido al cielo mientras su pareja la carga sonriendo', width: 1466, height: 2200 },
      { src: '/bodas/pareja-abrazo-cofia.jpg', caption: 'Un abrazo sin prisa', alt: 'Novios abrazados con los ojos cerrados en un jardín, ella con flor en la oreja', width: 1466, height: 2200 },
      { src: '/bodas/boda-pareja-flores-jardin.jpg', caption: 'Entre flores', alt: 'Novios mirándose entre flores en primer plano', width: 1571, height: 2200 },
      { src: '/bodas/novia-perfil-jardin-fondo.jpg', caption: 'Caminando hacia él', alt: 'Novia de perfil en primer plano con su pareja desenfocada al fondo del jardín', width: 1466, height: 2200 },
      { src: '/bodas/boda-novia-sonrisa-jardin.jpg', caption: 'Risas en el sendero', alt: 'Novia riendo con los ojos cerrados en un sendero de jardín', width: 1466, height: 2200 },
    ],
  },
  {
    title: 'Pareja · Bajo el Velo',
    subtitle: 'El instante justo antes del sí, capturado con luz de jardín.',
    images: [
      { src: '/bodas/pareja-velo-mirada-azul.jpg', caption: 'Ajustando el velo', alt: 'Novio ajustando el velo de la novia mientras se miran en un jardín', width: 1760, height: 2200 },
      { src: '/bodas/pareja-velo-frente-frente.jpg', caption: 'Bajo el mismo velo', alt: 'Pareja de novios abrazados bajo el velo, frente con frente', width: 1466, height: 2200 },
    ],
  },
  {
    title: 'Novia · Jardín y Lago',
    subtitle: 'Retratos íntimos entre naturaleza, agua en calma y luz dorada.',
    images: [
      { src: '/bodas/novia-jardin-dorado.jpg', caption: 'Luz de atardecer', alt: 'Novia junto a un lago iluminada por la luz dorada del atardecer', width: 1571, height: 2200 },
      { src: '/bodas/boda-retrato-novia-jardin-lago.jpg', caption: 'Junto al agua', alt: 'Retrato cercano de la novia junto a un lago al atardecer', width: 1571, height: 2200 },
      { src: '/bodas/novia-perfil-ciudad-verde.jpg', caption: 'Entre el jardín y la ciudad', alt: 'Novia de perfil con un edificio y árboles de fondo', width: 1466, height: 2200 },
      { src: '/bodas/novia-brazos-cruzados-luz.jpg', caption: 'Un momento de calma', alt: 'Novia con los brazos cruzados y ojos cerrados bajo la luz del sol', width: 1466, height: 2200 },
      { src: '/bodas/novia-caminando-jardin.jpg', caption: 'Paseo entre los árboles', alt: 'Novia caminando de perfil por un sendero de piedra junto a un lago', width: 1571, height: 2200 },
    ],
  },
  {
    title: 'Momento Real',
    subtitle: 'Porque también documentamos la celebración tal como sucede.',
    images: [
      { src: '/bodas/boda-beso-recepcion.jpg', caption: 'El beso de la fiesta', alt: 'Novios besándose durante la recepción rodeados de invitados', width: 2200, height: 1466 },
      { src: '/bodas/boda-baile-formal-bn.jpg', caption: 'El primer baile', alt: 'Novios bailando en un salón elegante, foto en blanco y negro', width: 1571, height: 2200 },
    ],
  },
  {
    title: 'XV Años · Vestido Azul',
    subtitle: 'Una noche de cuento en un salón lleno de luces cálidas.',
    images: [
      { src: '/bodas/quince-azul-lampara.jpg', caption: 'La princesa del salón', alt: 'Quinceañera con vestido azul claro bajo una lámpara de fibra natural', width: 1760, height: 2200 },
      { src: '/bodas/quince-azul-arco.jpg', caption: 'Bajo el arco dorado', alt: 'Quinceañera posando dentro de un arco decorativo dorado', width: 1760, height: 2200 },
      { src: '/bodas/quince-azul-recostada.jpg', caption: 'Un instante de ensueño', alt: 'Quinceañera recostada contra una pared con los ojos cerrados', width: 1760, height: 2200 },
      { src: '/bodas/boda-quince-vestido-azul.jpg', caption: 'Quince años de magia', alt: 'Quinceañera ajustándose la tiara con vestido azul claro', width: 1760, height: 2200 },
      { src: '/bodas/quince-azul-manos-cintura.jpg', caption: 'Lista para brillar', alt: 'Quinceañera con vestido azul claro y las manos en la cintura', width: 1760, height: 2200 },
    ],
  },
  {
    title: 'XV Años · Vestido Negro y Dorado',
    subtitle: 'Elegancia dramática entre jardines y luz del atardecer.',
    images: [
      { src: '/bodas/boda-quince-vestido-negro.jpg', caption: 'Como una reina', alt: 'Quinceañera con vestido negro y dorado en un jardín de bambú', width: 2200, height: 1467 },
      { src: '/bodas/quince-negro-jardin-sentada.jpg', caption: 'Un respiro de tul', alt: 'Quinceañera sentada con vestido negro y dorado en un jardín', width: 2200, height: 1466 },
      { src: '/bodas/quince-negro-mirada-cielo.jpg', caption: 'Mirando las estrellas', alt: 'Quinceañera con vestido negro y dorado mirando hacia arriba', width: 2200, height: 1466 },
      { src: '/bodas/quince-negro-mirada-atras.jpg', caption: 'Una mirada hacia atrás', alt: 'Quinceañera con vestido negro y dorado mirando por encima del hombro', width: 1467, height: 2200 },
      { src: '/bodas/quince-negro-espalda-jardin.jpg', caption: 'De espaldas al jardín', alt: 'Quinceañera de espaldas con vestido negro y dorado en un jardín', width: 1466, height: 2200 },
    ],
  },
  {
    title: 'XV Años · Vestido Rojo',
    subtitle: 'Una celebración vibrante bajo las luces de la noche.',
    images: [
      { src: '/bodas/quince-rojo-luces.jpg', caption: 'Bajo las luces de la fiesta', alt: 'Quinceañera con vestido rojo bajo una lámpara y luces colgantes', width: 1571, height: 2200 },
      { src: '/bodas/quince-rojo-espalda.jpg', caption: 'Elegancia en rojo', alt: 'Quinceañera con vestido rojo de espalda descubierta bajo las luces', width: 1571, height: 2200 },
    ],
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
  image: 'https://velozzacws.com/bodas/boda-pareja-piscina-infinita.jpg',
});

export default function BodasPage() {
  const schema = serviceSchema(
    'Paquetes de Fotografía para Bodas 2026',
    'Cobertura fotográfica premium para bodas y eventos sociales en Bogotá, con paquetes 2026, dirección visual y narrativa cinematográfica.',
    'https://velozzacws.com/bodas/boda-pareja-piscina-infinita.jpg',
    'https://velozzacws.com/servicios/bodas'
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
                  Paquetes de bodas 2026 con narrativa, elegancia y una <span className="text-shimmer">firma visual inolvidable</span>
                </h1>
                <p className="hero-copy bodas-hero-copy">
                  Esta página está pensada para mostrar con claridad los paquetes de fotografía de bodas que hoy vendemos en Bogotá. Cada colección cuida los momentos más importantes de tu día con una mezcla de sensibilidad documental, retrato editorial y una entrega visual que se siente premium desde el primer vistazo.
                </p>
                <div className="hero-actions bodas-hero-actions">
                  <a
                    className="cta-primary magnetic"
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
                  <img src="/bodas/boda-pareja-piscina-infinita.jpg" alt="Pareja de novios abrazados en una piscina infinita frente a las montañas" width={1466} height={2200} />
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
              {socialPackages.map((pkg, i) => (
                <article key={pkg.name} className="package-card social-package tilt reveal premium-card" style={{ transitionDelay: `${i * 0.1}s` }}>
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
              {weddingPackages.map((pkg, i) => (
                <article key={pkg.name} className={`package-card wedding-package tilt reveal premium-card${pkg.featured ? ' featured' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
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
                <h2 className="section-title">Muestra de bodas y eventos sociales</h2>
                <p className="section-lead" style={{ marginBottom: 0 }}>
                  Esta muestra acompaña los paquetes con imágenes reales de nuestro trabajo, organizadas por sesión, para que la decisión de compra tenga claridad visual, estilo y confianza. Dejamos más fotografías aquí para despertar interés y llevar a la gente a ver el catálogo completo.
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

            {portfolioGroups.map((group) => (
              <div key={group.title} className="portfolio-group">
                <div className="portfolio-group-heading">
                  <h3>{group.title}</h3>
                  <p className="muted">{group.subtitle}</p>
                </div>
                <div className="portfolio-grid">
                  {group.images.map((image, i) => (
                    <figure key={image.src} className="portfolio-card tilt reveal shine-hover" style={{ transitionDelay: `${(i % 6) * 0.06}s` }}>
                      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
                      <figcaption>{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
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

        .portfolio-group {
          margin-top: 40px;
        }

        .portfolio-group:first-of-type {
          margin-top: 28px;
        }

        .portfolio-group-heading {
          margin-bottom: 16px;
        }

        .portfolio-group-heading h3 {
          margin: 0 0 4px;
          font-size: 1.3rem;
          color: #f4cf63;
          letter-spacing: -0.01em;
        }

        .portfolio-group-heading p {
          margin: 0;
        }

        .portfolio-grid {
          columns: 3;
          column-gap: 16px;
        }

        .portfolio-card {
          margin: 0 0 16px;
          break-inside: avoid;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #121212;
          transition: border-color 220ms ease, box-shadow 220ms ease;
        }

        .portfolio-card:hover {
          border-color: rgba(244, 207, 99, 0.34);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .portfolio-card img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .portfolio-card:hover img {
          transform: scale(1.06);
        }

        .portfolio-card figcaption {
          padding: 10px 14px;
          font-size: 0.85rem;
          color: #efe9d6;
          background: linear-gradient(180deg, rgba(15, 15, 15, 0.98), rgba(10, 10, 10, 1));
          border-top: 1px solid rgba(244, 207, 99, 0.14);
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
          .two-up {
            grid-template-columns: 1fr 1fr;
          }

          .portfolio-grid {
            columns: 2;
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
          .two-up {
            grid-template-columns: 1fr;
          }

          .portfolio-grid {
            columns: 1;
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