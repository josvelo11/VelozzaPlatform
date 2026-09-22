import { PoseFaq } from '@/lib/poses';
import { JsonLd } from './JsonLd';

export function FaqBlock({ items, title = 'Preguntas frecuentes' }: { items: PoseFaq[]; title?: string }) {
  if (!items?.length) return null;
  return (
    <section className="pz-faq" aria-labelledby="pz-faq-title">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <h2 id="pz-faq-title" className="section-title">{title}</h2>
      {items.map((f, i) => (
        <details key={i} open={i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}
