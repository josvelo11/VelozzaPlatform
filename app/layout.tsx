import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://velozzaworks.com'),
  title: {
    default: 'Velozza Creative Works | Marketing Digital',
    template: '%s | Velozza Creative Works',
  },
  description: 'Agencia de marketing digital especializada en SEO, personal branding y crecimiento empresarial para Latinoamérica.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Velozza Creative Works',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />

        {/* Hreflang links for multilingual SEO */}
        <link rel="alternate" hrefLang="es" href="https://velozzaworks.com/" />
        <link rel="alternate" hrefLang="en" href="https://velozzaworks.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://velozzaworks.com/" />
      </head>
      <body>
        <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(18px)', background: 'rgba(11, 11, 11, 0.82)', color: 'white', borderBottom: '1px solid rgba(212,175,55,0.16)', boxShadow: '0 12px 32px rgba(0,0,0,0.28)' }}>
          <nav className="site-shell" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0' }}>
            <a href="/" style={{ color: '#f8f5ed', textDecoration: 'none', fontWeight: 800, letterSpacing: '-0.04em', fontSize: '1.1rem' }}>Velozza Creative Works</a>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                fontSize: '0.95rem'
              }}>Ingresar</a>
            </div>
          </nav>
        </header>

        {children}

        <footer style={{ background: 'linear-gradient(180deg, rgba(11,11,11,0.96), rgba(6,6,6,0.99))', color: 'white', padding: '56px 20px', marginTop: '64px', borderTop: '1px solid rgba(212,175,55,0.10)' }}>
          <div className="site-shell">
            <div className="footer-grid" style={{ marginBottom: '40px' }}>
              <div>
                <h4>Velozza Creative Works</h4>
                <p style={{ color: 'rgba(248,245,237,0.68)' }}>Transformando empresas a través del marketing digital estratégico.</p>
              </div>
              <div>
                <h4>Servicios</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li><a href="/servicios/personal-branding" style={{ color: '#f4cf63' }}>Personal Branding</a></li>
                  <li><a href="/servicios/social-media-management" style={{ color: '#f4cf63' }}>Social Media</a></li>
                  <li><a href="/servicios/seo-services" style={{ color: '#f4cf63' }}>SEO Services</a></li>
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
      </body>
    </html>
  );
}
