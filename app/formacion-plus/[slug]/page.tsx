import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { CoursePlayerClient } from '@/components/formacion/CoursePlayerClient';
import { getAllCourses, getCourseBySlug, courseIconName } from '@/lib/formacion';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.title} — Formación Plus`,
    description: course.resumen,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <main>
      <section className="section-shell" style={{ maxWidth: 1160 }}>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Formación Plus', href: '/formacion-plus' },
            { name: course.title },
          ]}
        />

        <div className="reveal course-hero-grid" style={{ marginTop: 24, marginBottom: 40 }}>
          <div>
            <div className="eyebrow">{course.categoria}</div>
            <h1 className="hero-title" style={{ maxWidth: '20ch', fontSize: 'clamp(2.1rem, 4.6vw, 3.1rem)' }}>
              {course.title}
            </h1>
            <p className="hero-copy">{course.resumen}</p>
          </div>
          <div className="course-hero-illustration tilt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/formacion/${course.id}.svg`} alt="" />
          </div>
        </div>

        <CoursePlayerClient key={course.id} curso={course} icon={courseIconName(course.icon)} />
      </section>
    </main>
  );
}
