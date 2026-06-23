'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { resolveRoleFromEmail } from '@/lib/auth/access-control';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
);

export default function ClienteAccessPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Force manual authentication on this entry page.
    // This avoids direct auto-access from stale local session values.
    localStorage.removeItem('sb-auth-token');
    localStorage.removeItem('sb-user-email');
    localStorage.removeItem('sb-user-role');
    document.cookie = 'sb-auth-token=; Path=/; Max-Age=0; SameSite=Lax';
    void supabase.auth.signOut();
  }, [router]);

  const handleClientAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const resolvedRole = resolveRoleFromEmail(
        data.user?.email || email,
        typeof data.user?.user_metadata?.role === 'string' ? data.user.user_metadata.role : null
      );

      if (!resolvedRole) {
        await supabase.auth.signOut();
        setError('Este usuario no tiene permisos de acceso en la plataforma.');
        return;
      }

      if (data.session) {
        localStorage.setItem('sb-auth-token', data.session.access_token);
        localStorage.setItem('sb-user-email', data.user?.email || '');
        localStorage.setItem('sb-user-role', resolvedRole);
        document.cookie = `sb-auth-token=${data.session.access_token}; Path=/; Max-Age=604800; SameSite=Lax`;

        if (resolvedRole === 'super_admin' || resolvedRole === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/client/publication-planner');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0b0b' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(11,11,11,1) 0%, rgba(18,18,18,0.92) 100%)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '520px' }}>
          <h1 style={{ fontSize: '48px', color: '#f4cf63', marginBottom: '20px', fontWeight: 'bold' }}>
            Acceso Cliente
          </h1>
          <p style={{ fontSize: '18px', color: '#a7a7a7', marginBottom: '28px' }}>
            Ingresa con tu cuenta Supabase autorizada para ver tu calendario, actividad y programación.
          </p>
          <p style={{ fontSize: '16px', color: '#f8f5ed', lineHeight: '1.6' }}>
            Este acceso es exclusivo para clientes autorizados. Desde aquí entrarás únicamente a tu módulo de información.
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          background: 'rgba(18,18,18,0.92)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '28px', color: '#f8f5ed', marginBottom: '10px', fontWeight: 'bold' }}>
            Ingreso de Cliente
          </h2>
          <p style={{ color: '#a7a7a7', marginBottom: '30px' }}>
            Acceso privado para clientes de Velozza
          </p>

          {error && (
            <div
              style={{
                background: 'rgba(255,76,76,0.1)',
                border: '1px solid rgba(255,76,76,0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#ff4c4c',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleClientAccess}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#f8f5ed', marginBottom: '8px', fontWeight: 500 }}>
                Email del cliente
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="cliente@empresa.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#f8f5ed',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#f8f5ed', marginBottom: '8px', fontWeight: 500 }}>
                Clave
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="clave_cliente"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#f8f5ed',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#f4cf63',
                color: '#0b0b0b',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Ingresar al módulo cliente
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center' }}>
            <Link href="/login" style={{ color: '#f4cf63', textDecoration: 'none', fontSize: '14px' }}>
              Ir al ingreso general
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
