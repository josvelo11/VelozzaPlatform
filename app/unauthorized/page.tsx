import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0b0b0b' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
        <h1 style={{ fontSize: '64px', color: '#f4cf63', marginBottom: '20px', fontWeight: 'bold' }}>
          401
        </h1>
        <h2 style={{ fontSize: '32px', color: '#f8f5ed', marginBottom: '20px' }}>
          Unauthorized Access
        </h2>
        <p style={{ fontSize: '16px', color: '#a7a7a7', marginBottom: '40px', lineHeight: '1.6' }}>
          You don't have permission to access this resource. Please contact your administrator if you believe this is a mistake.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#f4cf63',
            color: '#0b0b0b',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginRight: '16px',
          }}
        >
          Go Home
        </Link>
        <Link
          href="/login"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'rgba(212,175,55,0.2)',
            color: '#f4cf63',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          Try Another Account
        </Link>
      </div>
    </div>
  );
}
