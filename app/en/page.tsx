import Link from 'next/link';

export default function HomeEn(){
  return (
    <main>
      <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Welcome to Velozza Creative Works (EN)</h1>
        <p>Services: <Link href="/servicios">View services</Link></p>
        <p>Blog: <Link href="/blog">Go to blog</Link></p>
        <p>Locations: <Link href="/ubicaciones">View locations</Link></p>
      </section>
    </main>
  );
}
