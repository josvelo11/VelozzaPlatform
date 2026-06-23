import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { getAllBlogPosts, getAllBlogCategories } from '@/lib/blog';
import Link from 'next/link';

type BlogPageProps = {
  searchParams?: {
    category?: string;
  };
};

export default function BlogPage({ searchParams }: BlogPageProps) {
  const posts = getAllBlogPosts();
  const categories = getAllBlogCategories();
  const selectedCategory = searchParams?.category ?? null;

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
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Blog</h1>
        <p style={{ fontSize: '18px', color: '#a7a7a7', marginBottom: '40px' }}>
          Artículos y recursos sobre marketing digital, SEO y branding
        </p>

        {/* Categorías */}
        <div style={{ marginBottom: '40px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/blog" style={{ textDecoration: 'none' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: !selectedCategory ? '#f4cf63' : 'rgba(255,255,255,0.04)',
                color: !selectedCategory ? 'white' : '#333',
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
              style={{ textDecoration: 'none' }}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === category ? '#f4cf63' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === category ? 'white' : '#333',
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
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
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
                  <p style={{ color: '#a7a7a7', marginBottom: '10px' }}>{post.description}</p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#808080' }}>
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString('es-CO')}</span>
                    <span>{post.readTime} min de lectura</span>
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
