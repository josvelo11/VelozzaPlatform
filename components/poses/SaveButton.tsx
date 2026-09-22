'use client';
import { useEffect, useState } from 'react';

const KEY = 'velozza:poses-lista';
export function readList(): number[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function writeList(l: number[]) {
  try { localStorage.setItem(KEY, JSON.stringify(l)); window.dispatchEvent(new Event('pz-list')); } catch {}
}

export function SaveButton({ n, label = true }: { n: number; label?: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(readList().includes(n));
    sync();
    window.addEventListener('pz-list', sync);
    return () => window.removeEventListener('pz-list', sync);
  }, [n]);
  return (
    <button type="button" className={`pz-save${on ? ' on' : ''}`} aria-pressed={on} onClick={() => { const l = readList(); writeList(on ? l.filter((x) => x !== n) : [...l, n]); }}>
      <span aria-hidden>{on ? '♥' : '♡'}</span>{label && (on ? ' En tu lista' : ' Guardar en mi lista')}
    </button>
  );
}

export function ListCounter() {
  const [c, setC] = useState(0);
  useEffect(() => { const s = () => setC(readList().length); s(); window.addEventListener('pz-list', s); return () => window.removeEventListener('pz-list', s); }, []);
  return <span className="pz-count">{c}</span>;
}
