'use client';

import { Navigation } from '@/components/Navigation';
import { useState } from 'react';
import styles from '../dashboard.module.css';

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'Mi Empresa',
    email: 'admin@empresa.com',
    phone: '+57 300 123 4567',
    notifications: true,
    darkMode: false,
    twoFA: false,
  });

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    alert('Configuración guardada correctamente');
  };

  return (
    <div className={styles.dashboardLayout}>
      <Navigation />
      
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Configuración</h1>
            <p className={styles.subtitle}>Personaliza tu cuenta y preferencias</p>
          </div>

          <div className={styles.section}>
            <h2>Información de la Cuenta</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Teléfono
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2>Preferencias</h2>
            
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: '600' }}>Notificaciones por Email</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: '600' }}>Modo Oscuro</label>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleChange('darkMode', e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: '600' }}>Autenticación de Dos Factores (2FA)</label>
              <input
                type="checkbox"
                checked={settings.twoFA}
                onChange={(e) => handleChange('twoFA', e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div className={styles.section} style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f4cf63',
                color: '#0b0b0b',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Guardar Cambios
            </button>
            <button
              style={{
                padding: '12px 24px',
                backgroundColor: '#0f0f0f',
                color: '#f8f5ed',
                border: '1px solid rgba(244, 207, 99, 0.16)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
