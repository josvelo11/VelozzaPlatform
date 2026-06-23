export interface SchemaConfig {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function organizationSchema(): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Velozza Creative Works',
    alternateName: 'Velozza',
    url: 'https://velozzaworks.com',
    logo: 'https://velozzaworks.com/logo.png',
    description: 'Agencia de marketing digital, personal branding y crecimiento empresarial en Latinoamérica',
    sameAs: [
      'https://www.facebook.com/velozzaworks',
      'https://www.instagram.com/velozzaworks',
      'https://www.linkedin.com/company/velozzaworks',
      'https://www.youtube.com/@velozzaworks',
      'https://twitter.com/velozzaworks',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+57-300-000-0000',
      email: 'hola@velozzaworks.com',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Principal 123',
      addressLocality: 'Bogotá',
      addressRegion: 'DC',
      postalCode: '110111',
      addressCountry: 'CO',
    },
  };
}

export function serviceSchema(
  name: string,
  description: string,
  image: string,
  url: string
): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    image,
    url,
    provider: {
      '@type': 'Organization',
      name: 'Velozza Creative Works',
    },
    areaServed: ['CO', 'MX', 'AR', 'CL', 'PE', 'ES', 'US'],
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(
  faqs: Array<{ question: string; answer: string }>
): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema(
  title: string,
  description: string,
  author: string,
  publishedDate: string,
  image: string,
  url: string
): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedDate,
    url,
  };
}

export function localBusinessSchema(
  city: string,
  address: string,
  phone: string
): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Velozza Creative Works - ${city}`,
    image: 'https://velozzaworks.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      addressCountry: 'CO',
    },
    telephone: phone,
    url: 'https://velozzaworks.com',
  };
}
