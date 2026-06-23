'use client';

import Link from 'next/link';
import { breadcrumbSchema } from '@/lib/seo/schema';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const schemaItems = items
    .filter((item): item is BreadcrumbItem & { href: string } => !!item.href)
    .map((item) => ({
      name: item.name,
      url: item.href,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(schemaItems)),
        }}
      />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0 }}>
          {items.map((item, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.href ? (
                <Link href={item.href} style={{ color: '#f4cf63', textDecoration: 'none' }}>
                  {item.name}
                </Link>
              ) : (
                <span>{item.name}</span>
              )}
              {index < items.length - 1 && <span>/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
