'use client';

import { Navigation } from '@/components/Navigation';
import styles from '../dashboard.module.css';
import { PremiumIcon } from '@/components/PremiumIcon';

export default function Reports() {
  return (
    <div className={styles.dashboardLayout}>
      <Navigation />
      
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Reportes</h1>
            <p className={styles.subtitle}>Analiza tu desempeño y estadísticas</p>
          </div>

          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="analytics" size={20} /></div>
              <h3>Crecimiento</h3>
              <p className={styles.cardValue}>+23%</p>
              <p className={styles.cardDescription}>Comparado con mes anterior</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="users" size={20} /></div>
              <h3>Nuevos Usuarios</h3>
              <p className={styles.cardValue}>156</p>
              <p className={styles.cardDescription}>Este mes</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="clock" size={20} /></div>
              <h3>Tiempo Promedio</h3>
              <p className={styles.cardValue}>4.2h</p>
              <p className={styles.cardDescription}>Por sesión</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}><PremiumIcon name="star" size={20} /></div>
              <h3>Satisfacción</h3>
              <p className={styles.cardValue}>4.8/5</p>
              <p className={styles.cardDescription}>Calificación promedio</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Gráfico de Actividad (últimos 7 días)</h2>
            <div style={{ height: '300px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              Gráfico de actividad (implementar con librería de gráficos)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
