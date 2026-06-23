'use client';

import { Navigation } from '@/components/Navigation';
import styles from '../dashboard.module.css';

export default function Services() {
  const services = [
    { id: 1, name: 'Servicio Premium', status: 'Activo', price: '$99.99/mes', users: 45 },
    { id: 2, name: 'Servicio Basic', status: 'Activo', price: '$29.99/mes', users: 128 },
    { id: 3, name: 'Servicio Enterprise', status: 'Activo', price: '$299.99/mes', users: 12 },
  ];

  return (
    <div className={styles.dashboardLayout}>
      <Navigation />
      
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Servicios</h1>
            <p className={styles.subtitle}>Administra tus servicios y planes</p>
          </div>

          <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Lista de Servicios</h2>
              <button style={{ padding: '8px 16px', backgroundColor: '#f4cf63', color: '#0b0b0b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                + Nuevo Servicio
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Precio</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Usuarios</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{service.name}</td>
                    <td style={{ padding: '12px' }}>{service.price}</td>
                    <td style={{ padding: '12px' }}>{service.users}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', fontSize: '12px' }}>
                        {service.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ marginRight: '8px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>
                        Editar
                      </button>
                      <button style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer', backgroundColor: 'rgba(229,57,53,0.15)', color: '#ff6b6b', border: 'none', borderRadius: '4px' }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
