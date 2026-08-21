import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon } from '@/components/PremiumIcon';
import { getAllBlogPosts, getAllBlogCategories } from '@/lib/blog';
import Link from 'next/link';

export const revalidate = 60;

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

      <section className="section-shell">
        <div className="reveal" style={{ maxWidth: '780px' }}>
          <div className="eyebrow">Blog Velozza</div>
          <h1 className="hero-title" style={{ maxWidth: '16ch', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            La <span className="text-shimmer">Bóveda</span> de Inteligencia
          </h1>
          <p className="hero-copy" style={{ marginBottom: '40px' }}>
            Tácticas de retención, neuromarketing y análisis de algoritmos. Las estrategias exactas de arquitectura de marca que aplicamos con nuestros clientes de élite, publicadas para quienes saben aprovecharlas.
          </p>
        </div>

        {/* Categorías */}
        <div className="blog-categories reveal">
          <Link href="/blog" className={`blog-category-chip${!selectedCategory ? ' active' : ''}`}>
            Todos
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${encodeURIComponent(category)}`}
              className={`blog-category-chip${selectedCategory === category ? ' active' : ''}`}
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'grid', gap: '24px', marginBottom: '60px' }}>
          {filteredPosts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="premium-card tilt reveal blog-post-card"
              style={{ transitionDelay: `${(i % 6) * 0.06}s` }}
            >
              <article className="blog-post-article">
                <img src={post.image} alt={post.title} className="blog-post-image" />
                <div>
                  <span className="blog-post-category">{post.category}</span>
                  <h2 className="blog-post-title">{post.title}</h2>
                  <p className="blog-post-description">{post.description}</p>
                  <div className="blog-post-meta">
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString('es-CO')}</span>
                    <span>{post.readTime} min de lectura</span>
                    <span className="blog-post-read-more">
                      Leer Análisis Completo
                      <PremiumIcon name="arrow-right" size={14} />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .blog-categories {
          margin-bottom: 40px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .blog-category-chip {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 999px;
          text-decoration: none;
          background-color: rgba(255, 255, 255, 0.04);
          color: #efe9d6;
          border: 1px solid var(--line);
          font-size: 0.9rem;
          font-weight: 600;
          transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, transform 200ms ease;
        }

        .blog-category-chip:hover {
          border-color: rgba(244, 207, 99, 0.4);
          transform: translateY(-2px);
        }

        .blog-category-chip.active {
          background-color: #f4cf63;
          color: #0b0b0b;
          border-color: transparent;
        }

        .blog-post-card {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .blog-post-article {
          background-color: rgba(18, 18, 18, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          padding: 24px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
        }

        .blog-post-image {
          width: 100%;
          height: 150px;
          border-radius: 12px;
          object-fit: cover;
        }

        .blog-post-category {
          display: inline-block;
          background-color: rgba(212, 175, 55, 0.10);
          color: #f4cf63;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .blog-post-title {
          font-size: 24px;
          margin-top: 12px;
          margin-bottom: 10px;
          font-family: Cormorant Garamond, serif;
          color: #f8f5ed;
        }

        .blog-post-description {
          color: #c9c9c9;
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .blog-post-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 14px;
          color: #c9c9c9;
        }

        .blog-post-read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-strong);
          font-weight: 700;
          transition: gap 200ms ease;
        }

        .blog-post-card:hover .blog-post-read-more {
          gap: 10px;
        }

        @media (max-width: 640px) {
          .blog-post-article {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .blog-post-image {
            height: 180px;
          }

          .blog-post-title {
            font-size: 20px;
          }
        }
      `}</style>

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
