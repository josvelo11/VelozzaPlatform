import Link from 'next/link';

export default function HomeEs(){
  return (
    <main>
      <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Bienvenido a Velozza Creative Works (ES)</h1>
        <p>Servicios: <Link href="/servicios">Ver servicios</Link></p>
        <p>Blog: <Link href="/blog">Ir al blog</Link></p>
        <p>Ubicaciones: <Link href="/ubicaciones">Ver ubicaciones</Link></p>
      </section>
    </main>
  );
}
