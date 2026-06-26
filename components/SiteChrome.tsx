"use client";

import { usePathname } from 'next/navigation';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/') {
    return <>{children}</>;
  }

  if (pathname === '/servicios') {
    return (
      <>
        <style>{`
          .services-chrome-top a:hover,
          .services-chrome-top button:hover,
          .services-chrome-footer a:hover {
            color: #f4cf63 !important;
          }

          .services-chrome-shell {
            background: #0b0b0b;
            color: #f8f5ed;
          }

          .services-chrome-nav-link {
            font-family: Montserrat, sans-serif;
            font-size: 10.5px;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            text-decoration: none;
            color: rgba(248,245,237,0.72);
            border-bottom: 1px solid transparent;
            padding-bottom: 2px;
          }

          .services-chrome-nav-link.active {
            color: #f4cf63;
            border-bottom-color: #f4cf63;
          }

          .services-chrome-cta {
            background: linear-gradient(135deg, #f4cf63, #c9a84c);
            color: #0b0b0b;
            text-decoration: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-family: Montserrat, sans-serif;
            font-weight: 800;
            font-size: 10.5px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }

          .services-chrome-footer h4 {
            margin: 0 0 16px;
            font-family: Montserrat, sans-serif;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }

          .services-chrome-footer ul {
            margin: 0;
            padding: 0;
            list-style: none;
            display: grid;
            gap: 10px;
          }

          .services-chrome-footer a {
            color: rgba(248,245,237,0.72);
            text-decoration: none;
            font-size: 13px;
          }

          @media (max-width: 960px) {
            .services-chrome-top {
              flex-direction: column;
              align-items: flex-start;
              gap: 14px;
            }

            .services-chrome-nav {
              width: 100%;
              flex-wrap: wrap;
              justify-content: flex-start;
              gap: 12px 16px;
            }

            .services-chrome-footer-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        <div className="services-chrome-shell">
          <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(18px)', background: 'rgba(11, 11, 11, 0.84)', borderBottom: '1px solid rgba(212,175,55,0.16)' }}>
            <div className="site-shell services-chrome-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', gap: '20px' }}>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#f8f5ed' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Velozza</span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '8px', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#f4cf63' }}>Creative Works™</span>
              </a>

              <nav className="services-chrome-nav" style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/servicios" className="services-chrome-nav-link active">Servicios</a>
                <a href="/casos-de-exito" className="services-chrome-nav-link">Resultados</a>
                <a href="/#nosotros" className="services-chrome-nav-link">Nosotros</a>
                <a href="/blog" className="services-chrome-nav-link">Recursos</a>
                <a href="/pricing" className="services-chrome-nav-link">Planes</a>
              </nav>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <a href="/login" className="services-chrome-nav-link">Acceder</a>
                <a href="/contacto" className="services-chrome-cta">Agenda tu Consulta</a>
              </div>
            </div>
          </header>

          {children}

          <footer className="services-chrome-footer" style={{ background: 'linear-gradient(180deg, rgba(11,11,11,0.98), rgba(6,6,6,0.99))', borderTop: '1px solid rgba(212,175,55,0.10)', padding: '56px 20px 28px', marginTop: '64px' }}>
            <div className="site-shell">
              <div className="footer-grid services-chrome-footer-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', display: 'grid', gap: '22px' }}>
                <div>
                  <h4>Velozza Creative Works</h4>
                  <p style={{ color: 'rgba(248,245,237,0.68)', marginTop: 0 }}>Ingeniería visual y posicionamiento premium para marcas y líderes que exigen dominar su mercado.</p>
                </div>
                <div>
                  <h4>Servicios</h4>
                  <ul>
                    <li><a href="/servicios/personal-branding">Marca Personal &amp; Ejecutivo</a></li>
                    <li><a href="/servicios/social-media-management">Gestión de Redes Sociales</a></li>
                    <li><a href="/servicios/video-marketing">Producción de Contenido</a></li>
                    <li><a href="/servicios/seo-services">Estrategia &amp; Marketing Digital</a></li>
                    <li><a href="/servicios/publicidad-digital">Publicidad Digital</a></li>
                    <li><a href="/servicios/automatizacion-ia">Automatización &amp; IA</a></li>
                  </ul>
                </div>
                <div>
                  <h4>Recursos</h4>
                  <ul>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/ubicaciones">Ubicaciones</a></li>
                    <li><a href="/contacto">Contacto</a></li>
                  </ul>
                </div>
                <div>
                  <h4>Empresa</h4>
                  <ul>
                    <li><a href="/casos-de-exito">Resultados</a></li>
                    <li><a href="/faqs">FAQs</a></li>
                    <li><a href="/login">Acceder</a></li>
                  </ul>
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(212,175,55,0.10)', marginTop: '28px', paddingTop: '18px', textAlign: 'center', color: 'rgba(248,245,237,0.68)', fontSize: '12px' }}>
                © 2025 Velozza Creative Works. Todos los derechos reservados.
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .site-chrome-actions a:hover,
        .site-chrome-footer a:hover {
          color: #f4cf63 !important;
          text-shadow: 0 0 12px rgba(244, 207, 99, 0.25);
        }

        @media (max-width: 760px) {
          .site-chrome-nav {
            flex-wrap: wrap;
            gap: 10px;
            padding: 14px 0;
          }

          .site-chrome-actions {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 2px;
            justify-content: flex-start;
            flex-wrap: nowrap;
            gap: 12px;
          }

          .site-chrome-actions a,
          .site-chrome-actions button {
            white-space: nowrap;
            flex: 0 0 auto;
          }

          .site-chrome-footer {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          .site-chrome-footer-grid {
            gap: 28px !important;
          }
        }
      `}</style>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(18px)', background: 'rgba(11, 11, 11, 0.82)', color: 'white', borderBottom: '1px solid rgba(212,175,55,0.16)', boxShadow: '0 12px 32px rgba(0,0,0,0.28)' }}>
        <nav className="site-shell site-chrome-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0' }}>
          <a href="/" style={{ color: '#f8f5ed', textDecoration: 'none', fontWeight: 800, letterSpacing: '-0.04em', fontSize: '1.1rem' }}>Velozza Creative Works</a>
          <div className="site-chrome-actions" style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
            <a href="/servicios" style={{ color: 'rgba(248,245,237,0.82)', textDecoration: 'none' }}>Servicios</a>
            <a href="/blog" style={{ color: 'rgba(248,245,237,0.82)', textDecoration: 'none' }}>Blog</a>
            <a href="/casos-de-exito" style={{ color: 'rgba(248,245,237,0.82)', textDecoration: 'none' }}>Casos de éxito</a>
            <a href="/industrias" style={{ color: 'rgba(248,245,237,0.82)', textDecoration: 'none' }}>Industrias</a>
            <a href="/faqs" style={{ color: 'rgba(248,245,237,0.82)', textDecoration: 'none' }}>FAQs</a>
            <a href="/contacto" style={{ color: 'rgba(248,245,237,0.82)', textDecoration: 'none' }}>Contacto</a>
            <a href="/cliente" style={{ color: '#f4cf63', textDecoration: 'none', fontWeight: 700 }}>Cliente</a>
            <a href="/login" style={{
              background: '#f4cf63',
              color: '#0b0b0b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
            }}>Ingresar</a>
          </div>
        </nav>
      </header>

      {children}

      <footer className="site-chrome-footer" style={{ background: 'linear-gradient(180deg, rgba(11,11,11,0.96), rgba(6,6,6,0.99))', color: 'white', padding: '56px 20px', marginTop: '64px', borderTop: '1px solid rgba(212,175,55,0.10)' }}>
        <div className="site-shell">
          <div className="footer-grid site-chrome-footer-grid" style={{ marginBottom: '40px' }}>
            <div>
              <h4>Velozza Creative Works</h4>
              <p style={{ color: 'rgba(248,245,237,0.68)' }}>Ingeniería visual y posicionamiento premium para marcas y líderes que exigen dominar su mercado.</p>
            </div>
            <div>
              <h4>Servicios</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/servicios/personal-branding" style={{ color: '#f4cf63' }}>Personal Branding</a></li>
                <li><a href="/servicios/social-media-management" style={{ color: '#f4cf63' }}>Social Media</a></li>
                <li><a href="/servicios/seo-services" style={{ color: '#f4cf63' }}>SEO Services</a></li>
                <li><a href="/servicios/video-marketing" style={{ color: '#f4cf63' }}>Video Marketing</a></li>
                <li><a href="/servicios/fotografia-corporativa" style={{ color: '#f4cf63' }}>Fotografía Corporativa</a></li>
                <li><a href="/servicios/eventos-sociales-elite" style={{ color: '#f4cf63' }}>Eventos Élite</a></li>
              </ul>
            </div>
            <div>
              <h4>Recursos</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/blog" style={{ color: '#f4cf63' }}>Blog</a></li>
                <li><a href="/ubicaciones" style={{ color: '#f4cf63' }}>Ubicaciones</a></li>
                <li><a href="/contacto" style={{ color: '#f4cf63' }}>Contacto</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(212,175,55,0.10)', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(248,245,237,0.68)' }}>&copy; 2025 Velozza Creative Works. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}