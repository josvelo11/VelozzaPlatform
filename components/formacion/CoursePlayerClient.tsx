'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PremiumIcon, type PremiumIconName } from '@/components/PremiumIcon';
import { SlideDeck } from './SlideDeck';
import { useCourseProgress } from './useCourseProgress';
import type { FormacionCurso } from '@/lib/formacion';

function firstIncompleteIndex(curso: FormacionCurso, completed: Set<string>) {
  const i = curso.lecciones.findIndex((l) => !completed.has(l.id));
  return i === -1 ? 0 : i;
}

export function CoursePlayerClient({ curso, icon }: { curso: FormacionCurso; icon: PremiumIconName }) {
  const { completed, toggle, ready } = useCourseProgress(curso.id);
  const completedSet = new Set(completed);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [listOpen, setListOpen] = useState(false);
  // Cuando el curso ya está 100% completo, por defecto se muestra la pantalla
  // de felicitaciones. `reviewing` es lo que deja repasar cualquier lección
  // desde la lista sin quedar atrapado en esa pantalla — antes, una vez
  // terminado el curso, el panel derecho quedaba bloqueado en "Completaste
  // el curso" para siempre, sin importar en qué lección hicieras clic.
  const [reviewing, setReviewing] = useState(false);

  if (!ready) return null;

  const idx = activeIdx ?? firstIncompleteIndex(curso, completedSet);
  const leccion = curso.lecciones[idx];
  const total = curso.lecciones.length;
  const doneCount = curso.lecciones.filter((l) => completedSet.has(l.id)).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const doneNow = completedSet.has(leccion.id);
  const isLast = idx === total - 1;
  const courseFinished = doneCount === total;
  const showFinishedScreen = courseFinished && !reviewing;

  const markAndContinue = () => {
    if (!doneNow) toggle(leccion.id, true);
    if (idx < total - 1) setActiveIdx(idx + 1);
  };

  return (
    <div className="player-layout">
      <div className="panel player-sidebar">
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="course-icon-badge" style={{ width: 36, height: 36, borderRadius: 10 }}>
              <PremiumIcon name={icon} size={17} />
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#fdfaf1' }}>{curso.title}</div>
          </div>
          <div className="course-progress-track">
            <div className="course-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="muted" style={{ fontSize: '0.78rem', marginTop: 8 }}>
            {doneCount}/{total} completadas
          </div>
          <button type="button" className="sidebar-list-toggle" onClick={() => setListOpen((v) => !v)}>
            <PremiumIcon name="down" size={13} style={{ transform: listOpen ? 'rotate(180deg)' : 'none' }} />
            {listOpen ? 'Ocultar lista de lecciones' : 'Ver todas las lecciones'}
          </button>
        </div>
        <div className={`lesson-list${listOpen ? ' is-open' : ''}`}>
          {curso.lecciones.map((l, i) => {
            const d = completedSet.has(l.id);
            const active = i === idx;
            return (
              <div
                key={l.id}
                className={`lesson-row${active ? ' active' : ''}`}
                onClick={() => {
                  setActiveIdx(i);
                  setListOpen(false);
                  setReviewing(true);
                }}
              >
                <span
                  className={`lesson-check${d ? ' done' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(l.id, !d);
                  }}
                >
                  {d && <PremiumIcon name="check" size={12} />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#fdfaf1' : 'rgba(255,255,255,.8)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {i + 1}. {l.titulo}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.62)' }}>{l.minutos} min</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showFinishedScreen ? (
        <div className="panel panel-pad slide-pane" style={{ textAlign: 'center', padding: '64px 36px' }}>
          <div className="course-finished-badge">
            <PremiumIcon name="check" size={26} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: '#fdfaf1', margin: 0 }}>
            ¡Felicidades, completaste el curso!
          </h3>
          <p className="muted" style={{ maxWidth: 440, margin: '12px auto 0' }}>
            {curso.title} — {total} de {total} lecciones. Puedes repasar cualquier lección desde la lista cuando quieras.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="player-nav-btn"
              onClick={() => {
                setActiveIdx(0);
                setReviewing(true);
              }}
            >
              Repasar desde el inicio
            </button>
            <Link href="/formacion-plus" className="cta-primary" style={{ display: 'inline-flex' }}>
              Volver a Formación Plus
            </Link>
          </div>
        </div>
      ) : (
        <div className="panel panel-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div className="muted" style={{ fontSize: '0.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Lección {idx + 1} de {total}
            </div>
            {courseFinished && (
              <button
                type="button"
                onClick={() => setReviewing(false)}
                style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--accent-strong)', fontSize: '0.78rem', fontWeight: 600 }}
              >
                Ver resumen del curso
              </button>
            )}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)', color: '#fdfaf1', margin: '8px 0 4px' }}>
            {leccion.titulo}
          </h2>
          <div className="muted" style={{ fontSize: '0.85rem', marginBottom: 24 }}>{leccion.minutos} minutos</div>

          <SlideDeck cuerpo={leccion.cuerpo} accionables={leccion.accionables} courseId={curso.id} leccionId={leccion.id} />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 32,
              paddingTop: 24,
              borderTop: '1px solid var(--line)',
            }}
          >
            <button className="player-nav-btn" onClick={() => setActiveIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
              <PremiumIcon name="chevron-left" size={15} /> Lección anterior
            </button>
            <button className="cta-primary" onClick={markAndContinue}>
              {doneNow ? (isLast ? 'Finalizar curso' : 'Siguiente lección') : isLast ? 'Marcar como completada' : 'Marcar como completada y continuar'}
              <PremiumIcon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
