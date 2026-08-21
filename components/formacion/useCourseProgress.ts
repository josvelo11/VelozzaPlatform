'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'velozza_formacion_progreso';

// Progreso anónimo por navegador — Formación Plus es pública por ahora. El
// día que se active login, esta es la ÚNICA pieza que hay que cambiar: que
// en vez de leer/escribir localStorage, lea/escriba contra los endpoints ya
// reales y probados en Pauta Studio (GET/POST /api/clientes/cursos/progreso,
// protegidos con auth) — la UI que consume este hook no tiene que cambiar.
function readAll(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, string[]>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* localStorage no disponible (modo privado, etc.) — el progreso simplemente no persiste */
  }
}

export function useCourseProgress(courseId: string) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompleted(readAll()[courseId] || []);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const toggle = (leccionId: string, done: boolean) => {
    setCompleted((prev) => {
      const set = new Set(prev);
      if (done) set.add(leccionId);
      else set.delete(leccionId);
      const next = [...set];
      const all = readAll();
      all[courseId] = next;
      writeAll(all);
      return next;
    });
  };

  return { completed, toggle, ready };
}

export function useAllProgress(): Record<string, string[]> {
  const [all, setAll] = useState<Record<string, string[]>>({});
  useEffect(() => {
    setAll(readAll());
  }, []);
  return all;
}
