'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readList, writeList } from './SaveButton';

interface Item { n: number; slug: string; guide: string; star: boolean; h1: string; img: string; tell: string }
export function MyList({ items, base }: { items: Item[]; base: string }) {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => { const s = () => setIds(readList()); s(); window.addEventListener('pz-list', s); return () => window.removeEventListener('pz-list', s); }, []);
  const mine = ids.map((n) => items.find((i) => i.n === n)).filter(Boolean) as Item[];
  const url = (i: Item) => `https://velozzacws.com${base}/${i.guide}${i.star ? '/' + i.slug : '#' + i.slug}`;
  const text = `Hola, estas son las poses que me gustan para mi boda:\n${mine.map((i, k) => `${k + 1}. ${i.h1} — ${url(i)}`).join('\n')}\n(Son ilustraciones con IA, solo como referencia.)`;
  return (
    <>
      <div className="eyebrow">Solo en Velozza</div><h1>Mi lista de poses</h1>
      <p className="section-lead">Estas son las poses que guardaste. Envíalas a tu fotógrafo o imprímelas para llevarlas el día de tu boda. Son ilustraciones creadas con IA, solo como referencia.</p>
      {mine.length === 0 ? <p>Aún no has guardado poses. <Link href={base}>Explora la guía</Link> y toca «Guardar en mi lista».</p> : (
        <>
          <div className="pz-actions pz-noprint">
            <a className="cta-primary" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">Enviar por WhatsApp</a>
            <button className="cta-secondary" onClick={() => navigator.clipboard?.writeText(text)}>Copiar lista</button>
            <button className="cta-secondary" onClick={() => window.print()}>Imprimir o guardar PDF</button>
            <button className="pz-save" onClick={() => writeList([])}>Vaciar lista</button>
          </div>
          <div className="pz-cards five">{mine.map((i, k) => (
            <article key={i.n} className="pz-card small"><Image src={`/poses/${i.img}`} alt={`Ilustración creada con IA: ${i.h1}`} width={480} height={720} sizes="200px" className="pz-img" /><h3>{k + 1}. {i.h1}</h3><p className="pz-tip gold"><strong>Dile a tu fotógrafo:</strong> {i.tell}</p>
              <button className="pz-save pz-noprint" onClick={() => writeList(ids.filter((x) => x !== i.n))}>Quitar</button></article>))}</div>
        </>)}
    </>
  );
}
