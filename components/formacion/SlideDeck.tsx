'use client';

import { useEffect, useState } from 'react';
import { PremiumIcon } from '@/components/PremiumIcon';
import { MarkdownLite, parseSlides } from './markdownLite';

interface SlideDeckProps {
  cuerpo: string;
  accionables: string[];
  courseId?: string;
  leccionId?: string;
}

function SlideImage({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  if (broken) return null;
  return (
    <div className="slide-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" onError={() => setBroken(true)} />
    </div>
  );
}

export function SlideDeck({ cuerpo, accionables, courseId, leccionId }: SlideDeckProps) {
  const contentSlides = parseSlides(cuerpo).map((s) => ({ ...s, accion: false as const }));
  const slides = accionables?.length
    ? [...contentSlides, { titulo: '', body: '', accion: true as const }]
    : contentSlides;
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [cuerpo]);

  const slide = slides[idx];
  const imageSrc = !slide.accion && courseId && leccionId ? `/formacion/sections/${courseId}/${leccionId}-${idx}.jpg` : null;

  return (
    <div>
      <div key={idx} className="slide-pane" style={{ minHeight: 200 }}>
        {slides.length > 1 && (
          <div className="slide-eyebrow" style={{ marginBottom: 16 }}>
            {slide.accion ? 'Resumen' : `Parte ${idx + 1} de ${contentSlides.length}`}
          </div>
        )}
        {imageSrc && <SlideImage src={imageSrc} />}
        {slide.accion ? (
          <div className="action-slide">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
                color: 'var(--accent-strong)',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.3rem',
              }}
            >
              <PremiumIcon name="check" size={20} />
              Para poner en práctica
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {accionables.map((a, i) => (
                <li key={i}>
                  <span style={{ flexShrink: 0, marginTop: 4 }}>
                    <PremiumIcon name="check" size={15} className="muted" />
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {slide.titulo && (
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                  lineHeight: 1.2,
                  color: '#fdfaf1',
                  margin: '0 0 18px',
                  maxWidth: '30ch',
                }}
              >
                {slide.titulo}
              </h3>
            )}
            <div style={{ maxWidth: 640 }}>
              <MarkdownLite md={slide.body} />
            </div>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <button className="player-nav-btn" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
            <PremiumIcon name="chevron-left" size={15} /> Anterior
          </button>
          <div style={{ display: 'flex', gap: 7 }}>
            {slides.map((_, i) => (
              <span key={i} className={`slide-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
            ))}
          </div>
          <button
            className="player-nav-btn"
            onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))}
            disabled={idx === slides.length - 1}
          >
            Siguiente <PremiumIcon name="chevron-right" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
