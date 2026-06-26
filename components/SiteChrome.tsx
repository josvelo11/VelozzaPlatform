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
          color: #f0d98a !important;
          text-shadow: 0 0 12px rgba(240, 217, 138, 0.22);
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
      <header style={{ position: 'sticky', top: 0, zIndex: 20, height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(12,12,10,0.94)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(201,168,76,0.16)' }}>
        <nav className="site-shell site-chrome-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#f4f2ec' }}>
            <span style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase' }}>Velozza</span>
            <span style={{ display: 'block', marginTop: '2px', fontFamily: 'Montserrat, sans-serif', fontSize: '7.5px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#f0d98a' }}>Creative Works</span>
          </a>
          <div className="site-chrome-actions" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
            <a href="/servicios" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Servicios</a>
            <a href="/blog" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Blog</a>
            <a href="/casos-de-exito" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Casos de éxito</a>
            <a href="/industrias" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Industrias</a>
            <a href="/faqs" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>FAQs</a>
            <a href="/contacto" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Contacto</a>
            <a href="/cliente" style={{ color: '#f0d98a', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Cliente</a>
            <a href="/login" style={{ background: 'linear-gradient(135deg, #f0d98a, #c9a84c)', color: '#1a1200', textDecoration: 'none', padding: '14px 24px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', border: 0 }}>Ingresar</a>
          </div>
        </nav>
      </header>

      {children}

      <footer className="site-chrome-footer" style={{ background: '#080806', color: '#f4f2ec', padding: '56px 20px', marginTop: '64px', borderTop: '1px solid #2a2a22' }}>
        <div className="site-shell">
          <div className="footer-grid site-chrome-footer-grid" style={{ marginBottom: '40px' }}>
            <div>
              <h4>Velozza Creative Works</h4>
              <p style={{ color: '#7a7870' }}>Ingeniería visual y posicionamiento premium para marcas y líderes que exigen dominar su mercado.</p>
            </div>
            <div>
              <h4>Servicios</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/servicios/personal-branding" style={{ color: '#f0d98a' }}>Personal Branding</a></li>
                <li><a href="/servicios/social-media-management" style={{ color: '#f0d98a' }}>Social Media</a></li>
                <li><a href="/servicios/seo-services" style={{ color: '#f0d98a' }}>SEO Services</a></li>
                <li><a href="/servicios/video-marketing" style={{ color: '#f0d98a' }}>Video Marketing</a></li>
                <li><a href="/servicios/fotografia-corporativa" style={{ color: '#f0d98a' }}>Fotografía Corporativa</a></li>
                <li><a href="/servicios/eventos-sociales-elite" style={{ color: '#f0d98a' }}>Eventos Élite</a></li>
              </ul>
            </div>
            <div>
              <h4>Recursos</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/blog" style={{ color: '#f0d98a' }}>Blog</a></li>
                <li><a href="/ubicaciones" style={{ color: '#f0d98a' }}>Ubicaciones</a></li>
                <li><a href="/contacto" style={{ color: '#f0d98a' }}>Contacto</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2a2a22', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#7a7870' }}>&copy; 2025 Velozza Creative Works. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}