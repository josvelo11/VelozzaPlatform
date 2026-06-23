import fs from 'fs';
import path from 'path';

export interface IndustryTemplate {
  slug: string;
  name: string;
  title: string;
  description: string;
  pillar: string;
  intent: string[];
  keywords: string[];
  cities: string[];
  services: string[];
}

const industriesDirectory = path.join(process.cwd(), 'content/industries');

export function getAllIndustries(): IndustryTemplate[] {
  return fs.readdirSync(industriesDirectory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(industriesDirectory, file), 'utf8')) as IndustryTemplate);
}

export function getIndustryBySlug(slug: string): IndustryTemplate | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(industriesDirectory, `${slug}.json`), 'utf8')) as IndustryTemplate;
  } catch {
    return null;
  }
}
