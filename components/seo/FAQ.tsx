'use client';

import { useState } from 'react';
import { faqSchema } from '@/lib/seo/schema';
import { PremiumIcon } from '@/components/PremiumIcon';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = 'Preguntas Frecuentes' }: FAQProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(items)),
        }}
      />
      <section className="section-shell">
        <div className="panel panel-pad">
          <h2 className="section-title" style={{ textAlign: 'center' }}>{title}</h2>
          <p className="section-lead muted" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            Respuestas pensadas para autoridad, claridad y conversión orgánica.
          </p>

        <div className="faq-list">
          {items.map((item, index) => (
            <div
              key={index}
              className="faq-item"
              style={{
                marginBottom: '15px',
                border: '1px solid var(--line)',
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.72)',
                boxShadow: '0 14px 40px rgba(15, 23, 42, 0.06)',
              }}
            >
              <button
                onClick={() => toggleExpand(index)}
                style={{
                  width: '100%',
                  padding: '18px 18px',
                  backgroundColor: expanded[index] ? 'rgba(14,165,233,0.12)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--text)',
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <PremiumIcon name={expanded[index] ? 'down' : 'chevron-right'} size={16} />
                  <span>{item.question}</span>
                </span>
              </button>
              {expanded[index] && (
                <div
                  style={{
                    padding: '0 18px 18px',
                    color: 'var(--text-soft)',
                    lineHeight: '1.6',
                  }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </section>
    </>
  );
}
