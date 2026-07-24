"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? 'Error en el inicio de sesión');
      } else {
        const tokenValue =
          (typeof data?.token === 'string' && data.token) ||
          (typeof data?.access_token === 'string' && data.access_token) ||
          (typeof data?.session?.access_token === 'string' && data.session.access_token) ||
          'authenticated';
        const resolvedEmail =
          (typeof data?.user?.email === 'string' && data.user.email) ||
          (typeof data?.email === 'string' && data.email) ||
          email;
        const resolvedRole =
          (typeof data?.user?.role === 'string' && data.user.role) ||
          (typeof data?.role === 'string' && data.role) ||
          '';

        localStorage.setItem('sb-auth-token', tokenValue);
        localStorage.setItem('sb-user-email', resolvedEmail);
        if (resolvedRole) {
          localStorage.setItem('sb-user-role', resolvedRole);
        }

        document.cookie = `sb-auth-token=${encodeURIComponent(tokenValue)}; Max-Age=${60 * 60 * 24 * 7}; Path=/; SameSite=Lax`;

        setMessage(`Bienvenido ${data.user?.email ?? 'usuario'}`);
        // Redirigir a dashboard después de 1 segundo
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setMessage('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Validando...' : 'Iniciar sesión'}
      </button>
      {message ? <p className="message">{message}</p> : null}
    </form>
  );
}
