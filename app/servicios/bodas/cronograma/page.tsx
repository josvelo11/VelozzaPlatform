import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { CronogramaBodaTool } from '@/components/bodas/CronogramaBodaTool';
import { generateMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';

export const revalidate = 60;

export const metadata = generateMetadata({
  title: 'Cronograma de Boda Editable con Contador y Mapa de Mesas',
  description:
    'Herramienta gratuita de Velozza Creative Works para novios: cronograma del día editable, hora dorada calculada para su fecha y ciudad, mapa de mesas dinámico, menú y guía de fotos grupales.',
  keywords: [
    'cronograma de boda',
    'planeador de boda gratis',
    'mapa de mesas boda',
    'hora dorada boda colombia',
    'itinerario boda editable',
  ],
  url: '/servicios/bodas/cronograma',
  image: 'https://velozzacws.com/bodas/boda-pareja-piscina-infinita.jpg',
});

export default function CronogramaBodaPage() {
  const schema = serviceSchema(
    'Cronograma de Boda Editable',
    'Planilla premium interactiva para el día de la boda: cronograma con margen real, hora dorada calculada por ciudad, mapa de mesas, menú y guía de fotos grupales — cortesía de Velozza Creative Works.',
    'https://velozzacws.com/bodas/boda-pareja-piscina-infinita.jpg',
    'https://velozzacws.com/servicios/bodas/cronograma'
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Servicios', href: '/servicios' },
            { name: 'Bodas y Eventos Sociales', href: '/servicios/bodas' },
            { name: 'Cronograma de Boda' },
          ]}
        />
        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto 8px' }} className="reveal">
            <div className="eyebrow">Herramienta gratuita para nuestros novios</div>
            <h1 className="hero-title" style={{ maxWidth: '18ch', fontSize: 'clamp(2rem, 4.2vw, 3.1rem)' }}>
              Su <span className="text-shimmer">cronograma de boda</span>, hecho por fotógrafos
            </h1>
            <p className="hero-copy" style={{ maxWidth: '58ch' }}>
              Editen cada campo con la información real de su día: horarios, mesas, menú y equipo. Todo se guarda en este navegador y queda listo para imprimir o compartir.
            </p>
          </div>

          <div className="panel reveal" style={{ marginTop: '24px', marginBottom: '48px', overflow: 'hidden', padding: 0 }}>
            <CronogramaBodaTool />
          </div>
        </section>
      </main>
    </>
  );
}
