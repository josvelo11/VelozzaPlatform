import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  locale?: string;
  alternates?: Record<string, string>;
  schema?: any;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://velozzaworks.com';
  const url = config.url ? `${baseUrl}${config.url}` : baseUrl;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: config.author ? [{ name: config.author }] : undefined,
    openGraph: {
      title: config.title,
      description: config.description,
      url: url,
      type: 'website',
      siteName: 'Velozza Creative Works',
      images: config.image ? [{ url: config.image }] : undefined,
      locale: config.locale || 'es_CO',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: config.image ? [config.image] : undefined,
    },
    alternates: config.alternates ? {
      languages: config.alternates,
    } : undefined,
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
  };
}

export function generateCanonicalUrl(path: string, locale?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://velozzaworks.com';
  const localePath = locale && locale !== 'es' ? `/${locale}` : '';
  return `${baseUrl}${localePath}${path}`;
}

export function generateHrefLangLinks(path: string, locales: string[] = ['es', 'en']) {
  return locales.map((locale) => ({
    rel: 'alternate',
    hrefLang: locale,
    href: generateCanonicalUrl(path, locale),
  }));
}
