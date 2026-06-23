export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es' as const;

export const localeNames = {
  es: 'Español',
  en: 'English',
};

export const localeLabels = {
  es: 'es-CO',
  en: 'en-US',
};

export const pathnames = {
  '/': '/',
  '/servicios': {
    es: '/servicios',
    en: '/services',
  },
  '/blog': {
    es: '/blog',
    en: '/blog',
  },
  '/ubicaciones': {
    es: '/ubicaciones',
    en: '/locations',
  },
  '/academy': {
    es: '/academy',
    en: '/academy',
  },
  '/contacto': {
    es: '/contacto',
    en: '/contact',
  },
} as const;
