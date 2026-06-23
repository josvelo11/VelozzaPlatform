import fs from 'fs';
import path from 'path';
import { breadcrumbSchema, articleSchema } from '@/lib/seo/schema';

export interface CaseStudy {
  slug: string;
  industry: string;
  title: string;
  challenge: string;
  strategy: string[];
  results: string[];
  testimonial: string;
  date: string;
  services: string[];
  relatedArticles: string[];
}

const caseStudiesDirectory = path.join(process.cwd(), 'content/case-studies');

export function getAllCaseStudies(): CaseStudy[] {
  const files = fs.readdirSync(caseStudiesDirectory).filter((file) => file.endsWith('.json'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(caseStudiesDirectory, file), 'utf8');
    return JSON.parse(raw) as CaseStudy;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  try {
    const raw = fs.readFileSync(path.join(caseStudiesDirectory, `${slug}.json`), 'utf8');
    return JSON.parse(raw) as CaseStudy;
  } catch {
    return null;
  }
}

export function getCaseStudySchema(study: CaseStudy) {
  return articleSchema(
    study.title,
    study.challenge,
    'Velozza Creative Works',
    study.date,
    '/case-study.jpg',
    `https://velozzaworks.com/casos-de-exito/${study.slug}`
  );
}

export function getCaseStudyBreadcrumbs(title: string) {
  return breadcrumbSchema([
    { name: 'Inicio', url: 'https://velozzaworks.com/' },
    { name: 'Casos de Éxito', url: 'https://velozzaworks.com/casos-de-exito' },
    { name: title, url: `https://velozzaworks.com/casos-de-exito` },
  ]);
}
