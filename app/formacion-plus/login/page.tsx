'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FormacionLoginPage() {
  return (
    <Suspense fallback={null}>
      <FormacionLoginForm />
    </Suspense>
  );
}

function FormacionLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/formacion-plus/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Usuario o contraseña incorrectos.');
        setLoading(false);
        return;
      }

      const next = searchParams.get('next') || '/formacion-plus';
      router.push(next);
      router.refresh();
    } catch {
      setError('No se pudo conectar. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0b',
        padding: '24px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#161616',
          border: '1px solid #2c2c2c',
          borderRadius: '14px',
          padding: '32px 28px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#f3d374',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '6px',
          }}
        >
          Formación Plus
        </h1>
        <p style={{ color: '#8f8a80', fontSize: '13px', lineHeight: 1.5, marginBottom: '24px' }}>
          Contenido exclusivo para clientes. Ingresa tu usuario y contraseña para continuar.
        </p>

        <label
          htmlFor="fp-username"
          style={{ display: 'block', color: '#cfcac0', fontSize: '13px', marginBottom: '6px' }}
        >
          Usuario
        </label>
        <input
          id="fp-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid #2c2c2c',
            background: '#0b0b0b',
            color: '#fbf8f2',
            fontSize: '14px',
          }}
        />

        <label
          htmlFor="fp-password"
          style={{ display: 'block', color: '#cfcac0', fontSize: '13px', marginBottom: '6px' }}
        >
          Contraseña
        </label>
        <input
          id="fp-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid #2c2c2c',
            background: '#0b0b0b',
            color: '#fbf8f2',
            fontSize: '14px',
          }}
        />

        {error && (
          <p style={{ color: '#ff6b71', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #f3d374, #d4af37)',
            color: '#1a1305',
            fontWeight: 700,
            fontSize: '14px',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
