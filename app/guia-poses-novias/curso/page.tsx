import type { Metadata } from 'next';
import Link from 'next/link';
import { AiNotice } from '@/components/poses/AiNotice';
import { Course } from '@/components/poses/Course';
import { LeadForm } from '@/components/poses/LeadForm';
import { BASE, getGuides, poseUrl, posesOf } from '@/lib/poses';

export const metadata: Metadata = {
  title: 'Curso gratis: practica 70 poses para tu boda',
  description: 'Curso corto y gratuito para practicar 70 poses de novia, módulo por módulo. Ilustraciones y textos creados con IA.',
  robots: { index: false, follow: true },
};
export default function Page() {
  const mods = getGuides().map((g) => ({ slug: g.slug, title: g.hook, lessons: posesOf(g).map((p) => ({ n: p.n, title: p.h1, href: poseUrl(p) })) }));
  return (
    <main className="pz"><div className="pz-wrap">
      <div className="eyebrow">Curso gratis · Formación Plus</div><h1>Practica tus 70 poses de novia</h1>
      <p className="pz-answer">Ocho módulos cortos, uno por situación. Marca cada pose cuando la hayas practicado frente al espejo. Todo el contenido es gratuito y creado con IA.</p>
      <AiNotice compact />
      <Course mods={mods} />
      <section className="pz-lead"><h2 className="section-title">Lleva tus poses en el celular</h2><p className="section-lead">Recibe la guía de bolsillo de 12 poses y el portafolio real de Velozza.</p><LeadForm source="curso" /></section>
      <p className="pz-mini"><Link href={BASE}>← Volver a la guía de poses</Link></p>
    </div></main>
  );
}
