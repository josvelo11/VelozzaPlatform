import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { PremiumIcon } from '@/components/PremiumIcon';
import { CourseCardProgress } from '@/components/formacion/CourseCardProgress';
import { getAllCourses, courseIconName } from '@/lib/formacion';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Formación Plus — Academia Velozza',
  description:
    'Mini cursos prácticos para verte y sonar seguro frente a cámara: presencia en cámara, imagen profesional, expresión oral, asesoría de imagen y poses. Gratis, por tiempo limitado.',
};

export default async function FormacionPlusPage() {
  const courses = await getAllCourses();
  const totalLecciones = courses.reduce((s, c) => s + c.lecciones.length, 0);

  return (
    <main>
      <Breadcrumb items={[{ name: 'Inicio', href: '/' }, { name: 'Formación Plus' }]} />

      <section className="section-shell">
        <div className="hero-shell" style={{ background: 'linear-gradient(180deg, rgba(12,12,10,0.98), rgba(8,8,8,0.98))' }}>
          <div className="hero-grid" style={{ gridTemplateColumns: '1fr', justifyItems: 'center', textAlign: 'center' }}>
            <div style={{ maxWidth: 840 }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>
                <PremiumIcon name="sparkles" size={14} /> Academia Velozza · acceso abierto por tiempo limitado
              </div>
              <h1 className="hero-title" style={{ maxWidth: '18ch', marginLeft: 'auto', marginRight: 'auto' }}>
                Formación <span className="text-shimmer">Plus</span>
              </h1>
              <p className="hero-copy" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {courses.length} mini cursos, {totalLecciones} lecciones — todo lo que necesitas para verte y sonar como una
                autoridad frente a cámara: presencia, imagen, expresión oral y las técnicas que usan las marcas personales
                más fuertes de LatAm. Diseñado por el mismo equipo que construye el contenido de nuestros clientes.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                {courses[0] && (
                  <Link href={`/formacion-plus/${courses[0].id}`} className="cta-primary magnetic">
                    Empezar ahora <PremiumIcon name="arrow-right" size={16} />
                  </Link>
                )}
                <a
                  className="cta-secondary"
                  href="https://api.whatsapp.com/send?phone=573053090273&text=Hola%20Velozza%2C%20quiero%20saber%20m%C3%A1s%20de%20Formaci%C3%B3n%20Plus."
                  target="_blank"
                  rel="noreferrer"
                >
                  Hablar con Velozza
                </a>
              </div>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="panel panel-pad reveal" style={{ marginTop: 64, textAlign: 'center' }}>
            <p className="muted">El catálogo no está disponible en este momento — vuelve a intentarlo en unos minutos.</p>
          </div>
        ) : (
          <div style={{ marginTop: 64 }}>
            <div className="reveal" style={{ marginBottom: 32 }}>
              <div className="eyebrow">Los cursos</div>
              <h2 className="section-title" style={{ color: '#f4cf63' }}>
                Elige por dónde empezar
              </h2>
              <p className="muted" style={{ maxWidth: '68ch' }}>
                Cada curso son lecciones cortas de 5-7 minutos, con ejercicios concretos — pensados para aplicarse antes de
                tu próxima grabación, no para acumular en una lista de pendientes.
              </p>
            </div>

            <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {courses.map((course, i) => (
                <Link
                  key={course.id}
                  href={`/formacion-plus/${course.id}`}
                  className="premium-card tilt reveal course-catalog-card"
                  style={{ transitionDelay: `${i * 0.08}s`, textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="course-catalog-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/formacion/${course.id}.svg`} alt="" />
                  </div>
                  <div className="course-catalog-body">
                    <div className="eyebrow" style={{ alignSelf: 'flex-start', fontSize: '0.68rem' }}>{course.categoria}</div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fdfaf1', margin: '0 0 6px' }}>
                        {course.title}
                      </h3>
                      <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>{course.subtitle}</p>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <CourseCardProgress courseId={course.id} total={course.lecciones.length} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: '0.82rem', color: 'var(--accent-strong)' }}>
                        Ver curso <PremiumIcon name="arrow-right" size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
