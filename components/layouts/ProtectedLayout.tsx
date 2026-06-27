'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { isUniversalUser, resolveRoleFromEmail } from '@/lib/auth/access-control';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  portalType: 'admin' | 'client' | 'team';
}

export default function ProtectedLayout({
  children,
  requiredRoles,
  portalType,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navItems = {
    admin: [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/admin/clients', label: 'Clients' },
      { href: '/admin/content', label: 'Parrilla' },
      { href: '/admin/social-crm', label: 'Social CRM' },
      { href: '/admin/calendar', label: 'Calendario' },
      { href: '/admin/analytics', label: 'Metricas' },
      { href: '/admin/reports', label: 'Reportes' },
      { href: '/admin/settings', label: 'Ajustes' },
    ],
    client: [
      { href: '/client/dashboard', label: 'Resumen' },
      { href: '/client/publication-planner', label: 'Parrilla' },
      { href: '/client/social-crm', label: 'CRM Social' },
      { href: '/client/calendar', label: 'Calendario' },
      { href: '/client/reports', label: 'Reportes' },
      { href: '/client/settings', label: 'Ajustes' },
    ],
    team: [
      { href: '/team/dashboard', label: 'Resumen' },
      { href: '/team/tasks', label: 'Tareas' },
      { href: '/team/clients', label: 'Clientes' },
      { href: '/admin/social-crm', label: 'Social CRM' },
      { href: '/team/content', label: 'Content' },
      { href: '/team/calendar', label: 'Calendario' },
      { href: '/team/assets', label: 'Assets' },
      { href: '/team/reports', label: 'Reports' },
    ],
  };

  useEffect(() => {
    // Check if user has session token
    const sessionToken = localStorage.getItem('sb-auth-token');
    const userEmail = localStorage.getItem('sb-user-email') || '';
    const userRoleHint = localStorage.getItem('sb-user-role');
    
    if (!sessionToken) {
      setIsLoading(false);
      router.push('/login');
      return;
    }

    const resolvedRole = resolveRoleFromEmail(userEmail, userRoleHint);
    if (!resolvedRole) {
      setIsLoading(false);
      router.push('/unauthorized');
      return;
    }

    setUserRole(resolvedRole);

    const universal = isUniversalUser(userEmail) || resolvedRole === 'super_admin';

    const portalAllowsRole =
      universal ||
      (portalType === 'admin' && resolvedRole === 'admin') ||
      (portalType === 'team' && (resolvedRole === 'admin' || resolvedRole === 'content_strategist')) ||
      (portalType === 'client' && resolvedRole === 'client');

    if (!portalAllowsRole) {
      setIsLoading(false);
      router.push('/unauthorized');
      return;
    }

    const hasAccess = universal || !requiredRoles || requiredRoles.includes(resolvedRole);
    if (!hasAccess) {
      setIsLoading(false);
      router.push('/unauthorized');
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, requiredRoles, portalType]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0b0b0b' }}>
        <div style={{ textAlign: 'center', color: '#f8f5ed' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0b0b0b' }}>
        <div style={{ textAlign: 'center', color: '#f8f5ed' }}>
          <p>Unauthorized access</p>
          <Link href="/">Go back home</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('sb-auth-token');
    localStorage.removeItem('sb-user-email');
    localStorage.removeItem('sb-user-role');
    document.cookie = 'sb-auth-token=; Max-Age=0; Path=/; SameSite=Lax';
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0b0b' }}>
      {/* Sidebar Navigation */}
      <nav
        style={{
          width: '250px',
          background: 'rgba(16,16,16,0.98)',
          borderRight: '1px solid rgba(212,175,55,0.10)',
          padding: '20px',
          color: '#f8f5ed',
        }}
      >
        <h3 style={{ color: '#f4cf63', marginBottom: '30px' }}>
          Velozza {portalType.toUpperCase()}
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
          {navItems[portalType].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                style={{
                  color: pathname === item.href ? '#0b0b0b' : '#f8f5ed',
                  background: pathname === item.href ? '#f4cf63' : 'transparent',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '4px',
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(212,175,55,0.10)' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                background: '#f4cf63',
                color: '#0b0b0b',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '40px',
          color: '#f8f5ed',
          overflow: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
