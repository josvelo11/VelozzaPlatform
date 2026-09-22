import Link from 'next/link';
import { AI_NOTICE_FULL } from '@/lib/poses';

export function AiNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="pz-notice" role="note" aria-label="Aviso de contenido creado con inteligencia artificial">
      <strong>Transparencia · contenido creado con IA.</strong>{' '}
      {compact ? (
        <>Ilustraciones y textos generados con inteligencia artificial; las novias no existen. </>
      ) : (
        <>{AI_NOTICE_FULL} </>
      )}
      <Link href="/servicios/bodas">Ver portafolio real de bodas →</Link>
    </aside>
  );
}
