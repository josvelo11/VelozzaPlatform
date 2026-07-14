import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <section style={{ width: '100%', maxWidth: '420px' }}>
        <h1 style={{ margin: '0 0 12px' }}>Iniciar sesion</h1>
        <p style={{ margin: '0 0 20px', opacity: 0.8 }}>
          Accede al panel de clientes y administracion.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
