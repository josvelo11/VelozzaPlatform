'use client';

import { useCourseProgress } from './useCourseProgress';

export function CourseCardProgress({ courseId, total }: { courseId: string; total: number }) {
  const { completed, ready } = useCourseProgress(courseId);
  const done = completed.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.68)' }}>
          {ready && done > 0 ? (done === total ? 'Completado' : 'En progreso') : `${total} lecciones`}
        </span>
        {ready && done > 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-strong)', fontWeight: 600 }}>
            {done}/{total}
          </span>
        )}
      </div>
      {ready && done > 0 && (
        <div className="course-progress-track">
          <div className="course-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
