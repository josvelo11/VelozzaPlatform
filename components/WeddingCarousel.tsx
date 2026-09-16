'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PremiumIcon } from '@/components/PremiumIcon';

interface CarouselImage {
  src: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
}

interface WeddingCarouselProps {
  images: CarouselImage[];
  title?: string;
  subtitle?: string;
}

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

export function WeddingCarousel({ images, title, subtitle }: WeddingCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, total]);

  if (total === 0) return null;

  const current = images[index];

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) prev();
    else if (delta < -SWIPE_THRESHOLD) next();
    touchStartX.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  return (
    <div
      className="wedding-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={title || 'Lo mejor de nuestro portafolio de bodas'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      {(title || subtitle) && (
        <div className="wedding-carousel-heading">
          {title && (
            <>
              <div className="eyebrow">Lo mejor de Velozza</div>
              <h2 className="section-title">{title}</h2>
            </>
          )}
          {subtitle && (
            <p className="section-lead" style={{ marginBottom: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div
        className="wedding-carousel-stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="wedding-carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <figure
              key={img.src}
              className="wedding-carousel-slide"
              aria-hidden={i !== index}
            >
              <div
                className="wedding-carousel-slide-bg"
                style={{ backgroundImage: `url(${img.src})` }}
                aria-hidden="true"
              />
              <img
                className="wedding-carousel-slide-fg"
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
              <figcaption>{img.caption}</figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          className="wedding-carousel-arrow wedding-carousel-arrow-prev"
          onClick={prev}
          aria-label="Foto anterior"
        >
          <PremiumIcon name="chevron-left" size={22} />
        </button>
        <button
          type="button"
          className="wedding-carousel-arrow wedding-carousel-arrow-next"
          onClick={next}
          aria-label="Siguiente foto"
        >
          <PremiumIcon name="chevron-right" size={22} />
        </button>
      </div>

      <div className="wedding-carousel-dots" role="tablist" aria-label="Seleccionar foto">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Ir a la foto ${i + 1} de ${total}`}
            className={`wedding-carousel-dot${i === index ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <span aria-live="polite" className="sr-only">
        {current.caption} — foto {index + 1} de {total}
      </span>

      <style>{`
        .wedding-carousel {
          margin: 0 0 40px;
        }

        .wedding-carousel-heading {
          margin-bottom: 20px;
          max-width: 760px;
        }

        .wedding-carousel-stage {
          position: relative;
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid rgba(244, 207, 99, 0.18);
          background: #080808;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
        }

        .wedding-carousel-track {
          display: flex;
          transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wedding-carousel-slide {
          position: relative;
          flex: 0 0 100%;
          margin: 0;
          height: min(70vh, 620px);
          background: #0c0c0c;
          overflow: hidden;
        }

        .wedding-carousel-slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: blur(36px) brightness(0.4) saturate(1.1);
          transform: scale(1.15);
        }

        .wedding-carousel-slide-fg {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          -webkit-user-drag: none;
          user-select: none;
        }

        .wedding-carousel-slide figcaption {
          position: absolute;
          z-index: 2;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 28px 28px 20px;
          font-size: 1.05rem;
          color: #efe9d6;
          background: linear-gradient(180deg, rgba(8, 8, 8, 0) 0%, rgba(8, 8, 8, 0.85) 70%, rgba(8, 8, 8, 0.95) 100%);
        }

        .wedding-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(244, 207, 99, 0.28);
          background: rgba(8, 8, 8, 0.55);
          color: #f4cf63;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: background 200ms ease, border-color 200ms ease;
        }

        .wedding-carousel-arrow:hover {
          background: rgba(8, 8, 8, 0.8);
          border-color: rgba(244, 207, 99, 0.5);
        }

        .wedding-carousel-arrow-prev {
          left: 16px;
        }

        .wedding-carousel-arrow-next {
          right: 16px;
        }

        .wedding-carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .wedding-carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          border: none;
          padding: 0;
          background: rgba(244, 207, 99, 0.24);
          cursor: pointer;
          transition: background 200ms ease, transform 200ms ease;
        }

        .wedding-carousel-dot.is-active {
          background: #f4cf63;
          transform: scale(1.3);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 640px) {
          .wedding-carousel-slide {
            height: min(58vh, 460px);
          }

          .wedding-carousel-slide figcaption {
            font-size: 0.92rem;
            padding: 20px 18px 16px;
          }

          .wedding-carousel-arrow {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>
    </div>
  );
}
