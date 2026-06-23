import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { getAllCaseStudies } from '@/lib/case-studies';
import { getAllIndustries } from '@/lib/industries';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://velozzaworks.com';
  const locales = ['es', 'en'];

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Rutas de servicios
  const servicesDir = path.join(process.cwd(), 'content/services');
  const services = fs.readdirSync(servicesDir).map((file) => file.replace('.json', ''));

  services.forEach((service) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/servicios/${service}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  });

  // Rutas de blog
  const posts = getAllBlogPosts();
  posts.forEach((post) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // Rutas de ubicaciones
  const locationsDir = path.join(process.cwd(), 'content/locations');
  const locations = fs.readdirSync(locationsDir).map((file) => file.replace('.json', ''));

  locations.forEach((location) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/ubicaciones/${location}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  // Rutas de casos de éxito
  const caseStudies = getAllCaseStudies();
  caseStudies.forEach((study) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/casos-de-exito/${study.slug}`,
        lastModified: new Date(study.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  // Rutas de industrias programáticas
  const industries = getAllIndustries();
  industries.forEach((industry) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/industrias/${industry.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.65,
      });
    });
  });

  return routes;
}
