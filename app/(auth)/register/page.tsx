'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
);

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Store auth token
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          localStorage.setItem('sb-auth-token', session.data.session.access_token);
        }

        // Redirect to client portal
        router.push('/client/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .auth-shell { flex-direction: column !important; }
          .auth-hero, .auth-form { width: 100% !important; flex: none !important; padding: 28px 20px !important; }
          .auth-hero { min-height: 0 !important; }
          .auth-hero h1 { font-size: 38px !important; margin-bottom: 14px !important; }
          .auth-hero p { font-size: 15px !important; }
          .auth-form { align-items: stretch !important; }
          .auth-card { max-width: none !important; }
        }

        @media (max-width: 640px) {
          .auth-shell { min-height: auto !important; }
          .auth-hero, .auth-form { padding: 22px 16px !important; }
          .auth-hero h1 { font-size: 32px !important; }
          .auth-card h2 { font-size: 24px !important; }
          .auth-card input, .auth-card button { font-size: 16px !important; }
          .auth-links { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>
      <div className="auth-shell" style={{ display: 'flex', minHeight: '100vh', background: '#0b0b0b' }}>
      {/* Left side - Branding */}
      <div
        className="auth-hero"
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
            Join the Creative Intelligence Platform
          </p>
          <p style={{ fontSize: '16px', color: '#f8f5ed', lineHeight: '1.6' }}>
            Transform your creative workflow with enterprise-grade management and AI-powered insights.
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div
        className="auth-form"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          background: 'rgba(18,18,18,0.92)',
          overflowY: 'auto',
        }}
      >
        <div className="auth-card" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', color: '#f8f5ed', marginBottom: '10px', fontWeight: 'bold' }}>
            Create Account
          </h2>
          <p style={{ color: '#a7a7a7', marginBottom: '30px' }}>
            Sign up to get started with Velozza
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

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#f8f5ed', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#f8f5ed',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#f8f5ed', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your Company"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#f8f5ed',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#f8f5ed', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#f8f5ed',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#f8f5ed', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#f8f5ed',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#f8f5ed', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '6px',
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
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p
            className="auth-links"
            style={{
              textAlign: 'center',
              color: '#a7a7a7',
              fontSize: '14px',
              marginTop: '20px',
            }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                color: '#f4cf63',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
