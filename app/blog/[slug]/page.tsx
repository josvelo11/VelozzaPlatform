import { getBlogPostBySlug } from '@/lib/blog';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { articleSchema } from '@/lib/seo/schema';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const posts = ['personal-branding-2025', 'seo-tendencias-2025'];
  return posts.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const schema = articleSchema(
    post.title,
    post.description,
    post.author,
    post.date,
    post.image,
    `https://velozzaworks.com/blog/${post.slug}`
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title },
          ]}
        />

        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ marginBottom: '40px' }}>
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
            <h1 style={{ fontSize: '36px', marginTop: '10px' }}>{post.title}</h1>
            <div style={{ display: 'flex', gap: '20px', color: '#a7a7a7', marginTop: '15px' }}>
              <span>{post.author}</span>
              <span>{new Date(post.date).toLocaleDateString('es-CO')}</span>
              <span>{post.readTime} min de lectura</span>
            </div>
          </div>

          <img
            src={post.image}
            alt={post.title}
            style={{
              width: '100%',
              borderRadius: '12px',
              marginBottom: '40px',
            }}
          />

          <div
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#333',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
            <p style={{ fontWeight: '600' }}>Etiquetas:</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {post.tags.map((tag: string) => (
                <a
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  style={{
                    backgroundColor: '#0f0f0f',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#f8f5ed',
                    border: '1px solid rgba(244, 207, 99, 0.16)',
                  }}
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
