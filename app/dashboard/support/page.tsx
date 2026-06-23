'use client';

import { Navigation } from '@/components/Navigation';
import { useState } from 'react';
import styles from '../dashboard.module.css';

export default function Support() {
  const [tickets, setTickets] = useState([
    { id: '#TK-001', subject: 'Problema con integración', status: 'En progreso', date: '22 Jun 2026' },
    { id: '#TK-002', subject: 'Consulta sobre precios', status: 'Resuelto', date: '20 Jun 2026' },
    { id: '#TK-003', subject: 'Error en dashboard', status: 'Abierto', date: '21 Jun 2026' },
  ]);

  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });

  const handleSubmit = () => {
    if (newTicket.subject && newTicket.message) {
      alert('Ticket creado exitosamente');
      setNewTicket({ subject: '', message: '' });
    }
  };

  return (
    <div className={styles.dashboardLayout}>
      <Navigation />
      
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Soporte</h1>
            <p className={styles.subtitle}>Contacta con nuestro equipo de soporte</p>
          </div>

          <div className={styles.section}>
            <h2>Crear Nuevo Ticket</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Asunto
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Describe brevemente tu problema"
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
                Mensaje
              </label>
              <textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Explica tu problema en detalle"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minHeight: '150px',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f4cf63',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Enviar Ticket
            </button>
          </div>

          <div className={styles.section} style={{ marginTop: '30px' }}>
            <h2>Mis Tickets</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Asunto</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Fecha</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{ticket.id}</td>
                    <td style={{ padding: '12px' }}>{ticket.subject}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: ticket.status === 'Resuelto' ? 'rgba(212,175,55,0.15)' : ticket.status === 'En progreso' ? 'rgba(255,200,87,0.15)' : 'rgba(229,57,53,0.15)',
                        color: ticket.status === 'Resuelto' ? '#7ec699' : ticket.status === 'En progreso' ? '#ffc857' : '#ff6b6b',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{ticket.date}</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>
                        Ver
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
