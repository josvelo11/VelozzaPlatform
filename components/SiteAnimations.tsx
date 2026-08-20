"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function animateCount(el: Element) {
  const target = parseFloat(el.getAttribute('data-count') || '');
  if ((el as HTMLElement).dataset.counted || isNaN(target)) return;
  (el as HTMLElement).dataset.counted = '1';
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    el.textContent = prefix + target + suffix;
    return;
  }
  const dur = 1100;
  let start: number | null = null;
  function step(ts: number) {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function revealTarget(el: Element) {
  el.classList.add('is-visible');
  if (el.hasAttribute('data-count')) animateCount(el);
  el.querySelectorAll('[data-count]').forEach(animateCount);
}

/**
 * Mounted once in the root layout. Re-initializes on every route change
 * (Next.js App Router navigation doesn't re-run inline scripts), so
 * .reveal / .tilt / [data-count] work identically on every page.
 */
export default function SiteAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];

    // Tilt
    if (!reduceMotion) {
      document.querySelectorAll('.tilt').forEach((el) => {
        const onMove = (e: Event) => {
          const me = e as MouseEvent;
          const r = el.getBoundingClientRect();
          const x = (me.clientX - r.left) / r.width - 0.5;
          const y = (me.clientY - r.top) / r.height - 0.5;
          (el as HTMLElement).style.transform =
            `perspective(700px) rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg) translateY(-4px) scale(1.015)`;
        };
        const onLeave = () => {
          (el as HTMLElement).style.transform = '';
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    // Scroll reveal + counters
    const targets = document.querySelectorAll('.reveal');
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    document.querySelectorAll('.hero-anim-g [data-count], .hero [data-count]').forEach((el) => {
      setTimeout(() => animateCount(el), 650);
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(revealTarget);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealTarget(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
      );
      targets.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());

      safetyTimer = setTimeout(() => {
        document.querySelectorAll('.reveal:not(.is-visible)').forEach(revealTarget);
      }, 2500);
    }

    return () => {
      cleanups.forEach((fn) => fn());
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, [pathname]);

  return null;
}
