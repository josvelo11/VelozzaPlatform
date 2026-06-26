'use client';

import { Navigation } from '@/components/Navigation';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { PremiumIcon } from '@/components/PremiumIcon';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Cargando...</div>;
  }

  return (
    <div className={styles.dashboardLayout}>
      <Navigation />
      
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Panel Principal</h1>
            <p className={styles.subtitle}>Gestiona tu plataforma de servicios</p>
          </div>

          {/* Cards de resumen */}
          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="package" size={20} /></div>
              <h3>Servicios</h3>
              <p className={styles.cardValue}>12</p>
              <p className={styles.cardDescription}>Servicios activos</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="search" size={20} /></div>
              <h3>SEO</h3>
              <p className={styles.cardValue}>+178%</p>
              <p className={styles.cardDescription}>Crecimiento orgánico</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="users" size={20} /></div>
              <h3>Clientes</h3>
              <p className={styles.cardValue}>48</p>
              <p className={styles.cardDescription}>Clientes registrados</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="revenue" size={20} /></div>
              <h3>Ingresos</h3>
              <p className={styles.cardValue}>$5,240</p>
              <p className={styles.cardDescription}>Este mes</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="performance" size={20} /></div>
              <h3>Desempeño</h3>
              <p className={styles.cardValue}>94%</p>
              <p className={styles.cardDescription}>Tasa de satisfacción</p>
            </div>
          </div>

          {/* Sección de actividad reciente */}
          <div className={styles.section}>
            <h2>Actividad Reciente</h2>
            <div className={styles.activityTable}>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}><PremiumIcon name="check" size={16} /> Nuevo servicio creado</div>
                <div className={styles.tableCell}>Hace 2 horas</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}><PremiumIcon name="users" size={16} /> Cliente nuevo registrado</div>
                <div className={styles.tableCell}>Hace 5 horas</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}><PremiumIcon name="revenue" size={16} /> Pago recibido</div>
                <div className={styles.tableCell}>Hace 1 día</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}><PremiumIcon name="settings" size={16} /> Sistema actualizado</div>
                <div className={styles.tableCell}>Hace 2 días</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
