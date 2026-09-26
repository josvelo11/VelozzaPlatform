'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PremiumIcon } from '@/components/PremiumIcon';

type Orientation = 'horizontal' | 'vertical';

interface PhotobookImage {
  src: string;
  alt: string;
  orientation: Orientation;
}

interface PhotobookCarouselProps {
  images: PhotobookImage[];
}

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 30;

export function PhotobookCarousel({ images }: PhotobookCarouselProps) {
  const hasVertical = images.some((img) => img.orientation === 'vertical');
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const filtered = useMemo(
    () => images.filter((img) => img.orientation === orientation),
    [images, orientation]
  );
  const total = filtered.length;

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    setIndex(0);
  }, [orientation]);

  useEffect(() => {
    if (paused || lightboxOpen || total <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, lightboxOpen, total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);

    const { overflow, touchAction } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.touchAction = touchAction;
    };
  }, [lightboxOpen, next, prev]);

  if (total === 0) return null;

  const current = filtered[index];

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

  return (
    <div className="photobook-carousel-wrap">
      {hasVertical && (
        <div className="photobook-orientation" role="tablist" aria-label="Formato del PhotoBook">
          <button
            type="button"
            role="tab"
            aria-selected={orientation === 'horizontal'}
            className={`photobook-orientation-btn${orientation === 'horizontal' ? ' is-active' : ''}`}
            onClick={() => setOrientation('horizontal')}
          >
            Horizontal
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orientation === 'vertical'}
            className={`photobook-orientation-btn${orientation === 'vertical' ? ' is-active' : ''}`}
            onClick={() => setOrientation('vertical')}
          >
            Vertical
          </button>
        </div>
      )}

      <div
        className={`photobook-carousel photobook-carousel-${orientation}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="photobook-carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {filtered.map((img, i) => (
            <button
              type="button"
              className="photobook-carousel-slide"
              key={img.src}
              aria-hidden={i !== index}
              onClick={() => setLightboxOpen(true)}
              aria-label={`Ampliar imagen: ${img.alt}`}
            >
              <img src={img.src} alt={img.alt} loading="eager" draggable={false} />
            </button>
          ))}
        </div>

        <div className="photobook-carousel-zoom-hint">
          <PremiumIcon name="search" size={14} />
        </div>

        {total > 1 && (
          <>
            <button type="button" className="photobook-carousel-arrow photobook-carousel-arrow-prev" onClick={prev} aria-label="Foto anterior">
              <PremiumIcon name="chevron-left" size={16} />
            </button>
            <button type="button" className="photobook-carousel-arrow photobook-carousel-arrow-next" onClick={next} aria-label="Siguiente foto">
              <PremiumIcon name="chevron-right" size={16} />
            </button>

            <div className="photobook-carousel-dots" role="tablist" aria-label="Seleccionar foto">
              {filtered.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir a la foto ${i + 1} de ${total}`}
                  className={`photobook-carousel-dot${i === index ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && typeof document !== 'undefined' && createPortal(
        <div className="photobook-lightbox" role="dialog" aria-modal="true" onClick={() => setLightboxOpen(false)}>
          <button type="button" className="photobook-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Cerrar">
            <PremiumIcon name="close" size={20} />
          </button>
          {total > 1 && (
            <button
              type="button"
              className="photobook-lightbox-arrow photobook-lightbox-arrow-prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Foto anterior"
            >
              <PremiumIcon name="chevron-left" size={22} />
            </button>
          )}
          <img
            src={current.src}
            alt={current.alt}
            className="photobook-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          {total > 1 && (
            <button
              type="button"
              className="photobook-lightbox-arrow photobook-lightbox-arrow-next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Siguiente foto"
            >
              <PremiumIcon name="chevron-right" size={22} />
            </button>
          )}
        </div>,
        document.body
      )}

      <style>{`
        .photobook-carousel-wrap {
          margin-bottom: 18px;
        }

        .photobook-orientation {
          display: inline-flex;
          gap: 4px;
          padding: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(244, 207, 99, 0.16);
          margin-bottom: 10px;
        }

        .photobook-orientation-btn {
          border: none;
          background: transparent;
          color: rgba(239, 233, 214, 0.65);
          font-size: 0.76rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 180ms ease, color 180ms ease;
        }

        .photobook-orientation-btn.is-active {
          background: #f4cf63;
          color: #141005;
        }

        .photobook-carousel {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(244, 207, 99, 0.16);
          background: #0c0c0c;
        }

        .photobook-carousel-horizontal {
          aspect-ratio: 4 / 3;
        }

        .photobook-carousel-vertical {
          aspect-ratio: 3 / 4;
        }

        .photobook-carousel-track {
          display: flex;
          height: 100%;
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .photobook-carousel-slide {
          flex: 0 0 100%;
          height: 100%;
          padding: 0;
          border: none;
          background: none;
          cursor: zoom-in;
        }

        .photobook-carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          -webkit-user-drag: none;
          user-select: none;
        }

        .photobook-carousel-zoom-hint {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: rgba(8, 8, 8, 0.55);
          color: #f4cf63;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          backdrop-filter: blur(4px);
        }

        .photobook-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 1px solid rgba(244, 207, 99, 0.28);
          background: rgba(8, 8, 8, 0.55);
          color: #f4cf63;
          cursor: pointer;
          backdrop-filter: blur(6px);
        }

        .photobook-carousel-arrow-prev {
          left: 10px;
        }

        .photobook-carousel-arrow-next {
          right: 10px;
        }

        .photobook-carousel-dots {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .photobook-carousel-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          border: none;
          padding: 0;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
        }

        .photobook-carousel-dot.is-active {
          background: #f4cf63;
          transform: scale(1.3);
        }

        .photobook-lightbox {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(6, 6, 6, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          cursor: zoom-out;
        }

        .photobook-lightbox-img {
          max-width: min(90vw, 900px);
          max-height: 86vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          cursor: default;
        }

        .photobook-lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(244, 207, 99, 0.3);
          background: rgba(20, 20, 20, 0.7);
          color: #f4cf63;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photobook-lightbox-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 999px;
          border: 1px solid rgba(244, 207, 99, 0.3);
          background: rgba(20, 20, 20, 0.7);
          color: #f4cf63;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photobook-lightbox-arrow-prev {
          left: 20px;
        }

        .photobook-lightbox-arrow-next {
          right: 20px;
        }

        @media (max-width: 640px) {
          .photobook-lightbox {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
