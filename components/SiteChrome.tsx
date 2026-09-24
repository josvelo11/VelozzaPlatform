"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BrandLogo from '@/components/BrandLogo';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

        .site-chrome-bodas-mobile {
          display: none;
        }

        .site-chrome-bodas-desktop {
          display: inline;
        }

        .site-chrome-toggle-btn {
          display: none;
        }

        .site-chrome-actions {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
        }

        @media (max-width: 980px) {
          .site-chrome-header {
            height: auto !important;
            align-items: stretch !important;
            padding: 8px 0;
          }

          .site-chrome-nav {
            align-items: center !important;
            flex-wrap: wrap;
            gap: 10px;
          }

          .site-chrome-toggle-btn {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            width: 40px;
            height: 40px;
            margin-left: auto;
            cursor: pointer;
            background: transparent;
            border: 0;
            padding: 0;
          }

          .site-chrome-toggle-btn span {
            display: block;
            width: 22px;
            height: 2px;
            background: #f4f2ec;
          }

          .site-chrome-actions {
            display: none;
            width: 100%;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 2px !important;
            max-height: calc(100vh - 74px);
            overflow-y: auto;
            padding: 8px 2px 14px;
            border-top: 1px solid rgba(201,168,76,0.16);
            margin-top: 10px;
          }

          .site-chrome-actions.is-open {
            display: flex;
          }

          .site-chrome-actions a,
          .site-chrome-actions button {
            white-space: normal;
            width: 100%;
            padding: 12px 4px !important;
          }

          .site-chrome-actions a:last-child {
            padding: 14px !important;
            text-align: center;
          }
        }

        @media (max-width: 760px) {
          .site-chrome-bodas-mobile {
            display: inline;
          }

          .site-chrome-bodas-desktop {
            display: none;
          }

          .site-chrome-footer {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          .site-chrome-footer-grid {
            gap: 28px !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <header className="site-chrome-header" style={{ position: 'sticky', top: 0, zIndex: 20, height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(12,12,10,0.94)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(201,168,76,0.16)' }}>
        <nav className="site-shell site-chrome-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <a href="/" aria-label="Velozza Creative Works" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#f4f2ec' }}>
            <BrandLogo variant="transparent" style={{ width: 168 }} priority />
          </a>
          <button
            type="button"
            className="site-chrome-toggle-btn"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span style={{ transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
          <div className={`site-chrome-actions${menuOpen ? ' is-open' : ''}`}>
            <a href="/paquetes-bodas" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}><span className="site-chrome-bodas-desktop">Bodas y Eventos Sociales</span><span className="site-chrome-bodas-mobile">Bodas</span></a>
            <a href="/guia-poses-novias" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Guía de Poses</a>
            <a href="/servicios" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Servicios</a>
            <a href="/blog" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Blog</a>
            <a href="/casos-de-exito" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Casos de éxito</a>
            <a href="/formacion-plus" style={{ color: '#f0d98a', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Formación Plus</a>
            <a href="/industrias" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Industrias</a>
            <a href="/faqs" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>FAQs</a>
            <a href="/contacto" style={{ color: 'rgba(244,242,236,.66)', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Contacto</a>
            <a href="/cliente" style={{ color: '#f0d98a', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase' }}>Cliente</a>
            <a href="/clientes" style={{ background: 'linear-gradient(135deg, #f0d98a, #c9a84c)', color: '#1a1200', textDecoration: 'none', padding: '14px 24px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', border: 0 }}>Ingresar</a>
          </div>
        </nav>
      </header>

      {children}

      <footer className="site-chrome-footer" style={{ background: '#080806', color: '#f4f2ec', padding: '56px 20px', marginTop: '64px', borderTop: '1px solid #2a2a22' }}>
        <div className="site-shell">
          <div className="footer-grid site-chrome-footer-grid" style={{ marginBottom: '40px' }}>
            <div>
              <BrandLogo variant="transparent" style={{ width: 184, maxWidth: '100%' }} priority />
              <p style={{ color: '#a3a099' }}>Ingeniería visual y posicionamiento premium para marcas y líderes que exigen dominar su mercado.</p>
              <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                <a href="tel:+573053090273" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>+57 305 309 0273</a>
                <a href="mailto:ceo@velozzacws.com" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>ceo@velozzacws.com</a>
                <a href="https://instagram.com/velozzacws" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>@velozzacws</a>
              </div>
            </div>
            <div>
              <h4>Servicios</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/paquetes-bodas" style={{ color: '#f0d98a' }}>Bodas y Eventos Sociales</a></li>
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
                <li><a href="/guia-poses-novias" style={{ color: '#f0d98a' }}>Guía de Poses para Novias</a></li>
                <li><a href="/blog" style={{ color: '#f0d98a' }}>Blog</a></li>
                <li><a href="/formacion-plus" style={{ color: '#f0d98a' }}>Formación Plus</a></li>
                <li><a href="/ubicaciones" style={{ color: '#f0d98a' }}>Ubicaciones</a></li>
                <li><a href="/contacto" style={{ color: '#f0d98a' }}>Contacto</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2a2a22', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#a3a099' }}>&copy; 2026 Velozza Creative Works. Todos los derechos reservados.</p>
            <p style={{ marginTop: '10px' }}>
              <a href="/politica-de-tratamiento-de-datos" style={{ color: '#a3a099', fontSize: '13px' }}>Política de Tratamiento de Datos</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}