'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function SupabaseDebugPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('🔄 Conectando con Supabase...');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      setStatus(`URL: ${supabaseUrl}\nKey: ${supabaseKey ? '✅ Configurada' : '❌ No configurada'}`);

      const supabase = createClient(supabaseUrl || '', supabaseKey || '');

      // Test 1: Verificar conexión básica
      const { data: health, error: healthError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);

      if (healthError) {
        setStatus((prev) =>
          prev +
          `\n\n❌ Error de conexión a BD:\n${healthError.message}\n\nDetalles: Asegúrate de ejecutar las migraciones en Supabase SQL Editor`
        );
        return;
      }

      setStatus((prev) => prev + '\n✅ Conexión a base de datos OK');

      // Test 2: Intentar crear usuario
      const testEmail = `test-${Date.now()}@velozza.com`;
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
      });

      if (signUpError) {
        setStatus(
          (prev) =>
            prev +
            `\n\n⚠️ Error en Autenticación:\n${signUpError.message}\n\nSolución: Verifica que Supabase esté configurado para permitir signups`
        );
        return;
      }

      setStatus(
        (prev) =>
          prev +
          `\n✅ Autenticación OK\n\n✨ ¡CONEXIÓN EXITOSA CON SUPABASE!\n\nUser creado: ${authData.user?.email}\nID: ${authData.user?.id}`
      );
    } catch (err: any) {
      setStatus((prev) => prev + `\n\n❌ Error inesperado:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0b0b',
        color: '#f8f5ed',
        padding: '40px',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#f4cf63', marginBottom: '30px' }}>🔧 Verificador de Conexión Supabase</h1>

        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            background: '#f4cf63',
            color: '#0b0b0b',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Probando...' : 'Verificar Conexión'}
        </button>

        <div
          style={{
            background: 'rgba(18,18,18,0.92)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '300px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {status || 'Haz click en "Verificar Conexión" para probar...'}
        </div>

        <div style={{ marginTop: '30px', fontSize: '12px', color: 'rgba(248,245,237,0.6)' }}>
          <h3>📋 Checklist:</h3>
          <ul>
            <li>✅ Credenciales configuradas en .env.local</li>
            <li>⏳ Conexión a Supabase verificada</li>
            <li>⏳ Base de datos creada</li>
            <li>⏳ Migraciones ejecutadas</li>
            <li>⏳ Usuarios test creados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
