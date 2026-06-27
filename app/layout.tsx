import type { Metadata } from 'next';
import '../styles/globals.css';
import SiteChrome from '@/components/SiteChrome';

export const metadata: Metadata = {
  metadataBase: new URL('https://velozzaworks.com'),
  title: {
    default: 'Velozza Creative Works | Marketing Digital',
    template: '%s | Velozza Creative Works',
  },
  description: 'Agencia de marketing digital especializada en SEO, personal branding y crecimiento empresarial para Latinoamérica.',
  icons: {
    icon: '/brand/velozza_icono_solo_1200x900.png',
    apple: '/brand/velozza_icono_solo_1200x900.png',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
