"use client";

import { usePathname } from 'next/navigation';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/') {
    return <>{children}</>;
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