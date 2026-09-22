import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { getAllBlogPosts } from '@/lib/blog';
import { getAllCaseStudies } from '@/lib/case-studies';
import { getAllIndustries } from '@/lib/industries';
import { BASE, getListings, getStars, poseUrl } from '@/lib/poses';

// Solo se listan rutas que existen de verdad (sin prefijos /es o /en, que no tienen páginas).
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://velozzacws.com';
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [{ url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 }];
  const add = (p: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'monthly', lastModified: Date = now) =>
    routes.push({ url: `${baseUrl}${p}`, lastModified, changeFrequency, priority });

  ['/servicios', '/servicios/bodas', '/formacion-plus', '/casos-de-exito', '/blog', '/contacto', '/faqs', '/industrias', '/ubicaciones'].forEach((p) => add(p, 0.8));

  const list = (dir: string) => fs.readdirSync(path.join(process.cwd(), dir)).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  list('content/services').filter((s) => s !== 'bodas').forEach((s) => add(`/servicios/${s}`, 0.8));
  getAllBlogPosts().forEach((post) => add(`/blog/${post.slug}`, 0.7, 'weekly', new Date(post.date)));
  list('content/locations').forEach((l) => add(`/ubicaciones/${l}`, 0.6));
  getAllCaseStudies().forEach((c) => add(`/casos-de-exito/${c.slug}`, 0.7, 'monthly', new Date(c.date)));
  getAllIndustries().forEach((i) => add(`/industrias/${i.slug}`, 0.65));

  // Guía de poses para novias (hub, guías, páginas por cuerpo y poses estrella)
  add(BASE, 0.9, 'weekly');
  getListings().forEach((l) => add(`${BASE}/${l.slug}`, 0.85));
  getStars().forEach((p) => add(poseUrl(p), 0.75));
  return routes;
}
