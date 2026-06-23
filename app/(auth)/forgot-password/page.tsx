'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage('Check your email for password reset instructions');
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
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
            Reset Your Password
          </p>
          <p style={{ fontSize: '16px', color: '#f8f5ed', lineHeight: '1.6' }}>
            Don't worry, we'll help you get back into your account.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
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
            Forgot Password
          </h2>
          <p style={{ color: '#a7a7a7', marginBottom: '30px' }}>
            Enter your email address and we'll send you a link to reset your password
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

          {message && (
            <div
              style={{
                background: 'rgba(76,255,100,0.1)',
                border: '1px solid rgba(76,255,100,0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#4cff64',
                fontSize: '14px',
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '30px' }}>
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

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
              href="/login"
              style={{
                color: '#f4cf63',
                textDecoration: 'none',
              }}
            >
              Back to login
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
        </div>
      </div>
    </div>
  );
}
