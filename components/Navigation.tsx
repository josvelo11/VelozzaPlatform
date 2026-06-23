'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Navigation.module.css';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    router.push('/');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'SEO', href: '/dashboard/seo', icon: '📈' },
    { label: 'Servicios', href: '/dashboard/services', icon: '⚙️' },
    { label: 'Reportes', href: '/dashboard/reports', icon: '📈' },
    { label: 'Configuración', href: '/dashboard/settings', icon: '⚙️' },
    { label: 'Soporte', href: '/dashboard/support', icon: '💬' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const getPageTitle = () => {
    const item = menuItems.find(item => item.href === pathname);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Velozza</h2>
          <button
            className={styles.toggleBtn}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className={styles.menu}>
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`${styles.menuItem} ${pathname === item.href ? styles.active : ''}`}
              title={item.label}
              style={{
                backgroundColor: pathname === item.href ? '#f4cf63' : 'transparent',
                color: pathname === item.href ? '#1a1a2e' : '#fff',
              }}
            >
              <span className={styles.icon}>{item.icon}</span>
              {isOpen && <span className={styles.label}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            {isOpen ? '🚪 Cerrar sesión' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header className={styles.topbar}>
        <div className={styles.topbarContent}>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Usuario</span>
            <div className={styles.avatar}>👤</div>
          </div>
        </div>
      </header>
    </div>
  );
}
