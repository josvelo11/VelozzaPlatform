import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { getAllBlogPosts, getAllBlogCategories } from '@/lib/blog';
import Link from 'next/link';

type BlogPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = getAllBlogPosts();
  const categories = getAllBlogCategories();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCategory = resolvedSearchParams?.category ?? null;

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  return (
    <main>
      <Breadcrumb
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Blog' },
        ]}
      />

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '16px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>La Bóveda de Inteligencia</h1>
        <p style={{ fontSize: '1.08rem', color: '#a7a7a7', marginBottom: '40px', maxWidth: '68ch' }}>
          Tácticas de retención, neuromarketing y análisis de algoritmos. Las estrategias exactas de arquitectura de marca que aplicamos con nuestros clientes de élite, publicadas para quienes saben aprovecharlas.
        </p>

        {/* Categorías */}
        <div style={{ marginBottom: '40px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/blog" style={{ textDecoration: 'none' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: !selectedCategory ? '#f4cf63' : 'rgba(255,255,255,0.04)',
                color: !selectedCategory ? '#0b0b0b' : '#efe9d6',
                borderRadius: '4px',
              }}
            >
              Todos
            </span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${encodeURIComponent(category)}`}
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                backgroundColor: selectedCategory === category ? '#f4cf63' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === category ? '#0b0b0b' : '#efe9d6',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'grid', gap: '30px', marginBottom: '60px' }}>
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article
                style={{
                  backgroundColor: 'rgba(18,18,18,0.92)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '22px',
                  padding: '30px',
                  boxShadow: '0 14px 40px rgba(0,0,0,0.22)',
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: '30px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <span
                    style={{
                      backgroundColor: 'rgba(212,175,55,0.10)',
                      color: '#f4cf63',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {post.category}
                  </span>
                  <h2 style={{ fontSize: '24px', marginTop: '10px', marginBottom: '10px' }}>

                    {post.title}
                  </h2>
                  <p style={{ color: '#a7a7a7', marginBottom: '12px' }}>{post.description}</p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#808080' }}>
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString('es-CO')}</span>
                    <span>{post.readTime} min de lectura</span>
                    <span style={{ color: 'var(--accent-strong)', fontWeight: 700 }}>Leer Análisis Completo →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <FAQ
        items={[
          {
            question: '¿Con qué frecuencia publicas nuevo contenido?',
            answer: 'Publicamos nuevos artículos 2-3 veces por semana. Síguenos en redes para no perderte ninguno.',
          },
          {
            question: '¿Puedo usar tu contenido en mi blog?',
            answer: 'Claro, con atribución. Todos nuestros artículos están bajo licencia Creative Commons con atribución.',
          },
        ]}
      />
    </main>
  );
}
