import { getCrmUrl } from '@/lib/crm';
import type { PremiumIconName } from '@/components/PremiumIcon';

export interface FormacionLeccion {
  id: string;
  titulo: string;
  minutos: number;
  cuerpo: string;
  accionables: string[];
}

export interface FormacionCurso {
  id: string;
  categoria: string;
  title: string;
  subtitle: string;
  icon: string;
  resumen: string;
  lecciones: FormacionLeccion[];
}

// El catálogo real vive en Pauta Studio (crm-redes/courses-catalog.js) —
// fuente única de verdad, para que el contenido nunca diverja entre ahí y
// esta página pública. Se cachea 1h (ISR) para no depender de que el CRM
// esté arriba en cada visita; si el fetch falla, la página muestra un
// catálogo vacío en vez de tumbarse.
export async function getAllCourses(): Promise<FormacionCurso[]> {
  try {
    const res = await fetch(getCrmUrl('/api/clientes/cursos/publico'), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as FormacionCurso[];
  } catch {
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<FormacionCurso | null> {
  const courses = await getAllCourses();
  return courses.find((c) => c.id === slug) ?? null;
}

// El campo `icon` del catálogo (definido en courses-catalog.js) ya usa estos
// mismos nombres de PremiumIcon — esto solo valida y da un fallback seguro
// si algún día se agrega un curso con un ícono que no exista en el set.
const KNOWN_COURSE_ICONS = new Set<PremiumIconName>(['video', 'shirt', 'chat', 'user', 'camera']);
export function courseIconName(icon: string): PremiumIconName {
  return KNOWN_COURSE_ICONS.has(icon as PremiumIconName) ? (icon as PremiumIconName) : 'sparkles';
}

