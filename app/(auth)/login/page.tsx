'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { resolveRoleFromEmail } from '@/lib/auth/access-control';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        console.error('Supabase Auth Error:', signInError);
        return;
      }

      if (data.session) {
        const userRoleHint = data.user?.user_metadata?.role;
        const resolvedRole = resolveRoleFromEmail(data.user?.email || email, typeof userRoleHint === 'string' ? userRoleHint : null);
        if (!resolvedRole) {
          await supabase.auth.signOut();
          setError('Este usuario no tiene permisos de acceso en la plataforma.');
          return;
        }

        // Store token in localStorage
        localStorage.setItem('sb-auth-token', data.session.access_token);
        localStorage.setItem('sb-user-email', data.user?.email || '');
        localStorage.setItem('sb-user-role', resolvedRole);
        document.cookie = `sb-auth-token=${data.session.access_token}; Path=/; Max-Age=604800; SameSite=Lax`;

        if (resolvedRole === 'super_admin' || resolvedRole === 'admin') {
          router.push('/admin/dashboard');
        } else if (resolvedRole === 'content_strategist') {
          router.push('/team/dashboard');
        } else {
          router.push('/client/publication-planner');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
      console.error('Login Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0b0b' }}>
      {/* Left side - Branding */}
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
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '48px', color: '#f4cf63', marginBottom: '20px', fontWeight: 'bold' }}>
            VELOZZA
          </h1>
          <p style={{ fontSize: '18px', color: '#a7a7a7', marginBottom: '40px' }}>
            Creative Intelligence Platform
          </p>
          <p style={{ fontSize: '16px', color: '#f8f5ed', lineHeight: '1.6' }}>
            Empower your creative team with enterprise-grade management, seamless workflows, and actionable insights.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
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
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', color: '#f8f5ed', marginBottom: '10px', fontWeight: 'bold' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#a7a7a7', marginBottom: '30px' }}>
            Sign in to your account to continue
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

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#f8f5ed',
                  marginBottom: '8px',
                  fontWeight: '500',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
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

            <div style={{ marginBottom: '30px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#f8f5ed',
                  marginBottom: '8px',
                  fontWeight: '500',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
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
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#f4cf63',
                color: '#0b0b0b',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ margin: '22px 0', borderTop: '1px solid rgba(212,175,55,0.16)' }} />

          <Link
            href="/cliente"
            style={{
              display: 'block',
              textAlign: 'center',
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#f4cf63',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Acceso Cliente
          </Link>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              fontSize: '14px',
            }}
          >
            <Link
              href="/forgot-password"
              style={{
                color: '#f4cf63',
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </Link>
            <Link
              href="/register"
              style={{
                color: '#f4cf63',
                textDecoration: 'none',
              }}
            >
              Create account
            </Link>
          </div>

          <p
            style={{
              textAlign: 'center',
              color: '#a7a7a7',
              fontSize: '12px',
              marginTop: '30px',
            }}
          >
            Demo: Configure Supabase para probar login
          </p>
        </div>
      </div>
    </div>
  );
}
