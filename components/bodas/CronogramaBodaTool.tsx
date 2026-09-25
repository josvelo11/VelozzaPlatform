'use client';

import { useEffect, useRef } from 'react';
import { CB_STYLES } from './cronograma/styles';
import { CB_MARKUP } from './cronograma/markup';
import { initCronograma } from './cronograma/behavior';

export function CronogramaBodaTool() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanup = initCronograma(root);
    return cleanup;
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CB_STYLES }} />
      <div
        ref={rootRef}
        className="cb-root"
        dangerouslySetInnerHTML={{ __html: CB_MARKUP }}
      />
    </>
  );
}
