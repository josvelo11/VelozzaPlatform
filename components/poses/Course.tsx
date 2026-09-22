'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Mod { slug: string; title: string; lessons: { n: number; title: string; href: string }[] }
const KEY = 'velozza:curso-poses';
export function Course({ mods }: { mods: Mod[] }) {
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {} }, []);
  const toggle = (n: number) => setDone((d) => { const x = d.includes(n) ? d.filter((y) => y !== n) : [...d, n]; try { localStorage.setItem(KEY, JSON.stringify(x)); } catch {} return x; });
  const total = mods.reduce((a, m) => a + m.lessons.length, 0); const pct = Math.round((done.length / total) * 100);
  return (
    <>
      <div className="pz-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></div>
      <p className="pz-mini">{done.length} de {total} poses practicadas · {pct} % · tu avance se guarda en este dispositivo</p>
      {mods.map((m, i) => (
        <section key={m.slug} className="pz-course-mod"><h2>Módulo {i + 1} · {m.title}</h2>
          {m.lessons.map((l) => (
            <label key={l.n}><input type="checkbox" checked={done.includes(l.n)} onChange={() => toggle(l.n)} /><span><Link href={l.href}>{l.title}</Link></span></label>))}
        </section>))}
    </>
  );
}
