import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

export const metadata: Metadata = {
  title: 'Política de Tratamiento de Datos Personales',
  description:
    'Cómo Velozza Creative Works recolecta, usa y protege los datos personales de quienes visitan el sitio, escriben por WhatsApp o llenan un formulario, conforme a la Ley 1581 de 2012 de Colombia.',
  robots: { index: true, follow: true },
};

export default function PoliticaTratamientoDatos() {
  return (
    <main>
      <section className="section-shell" style={{ maxWidth: 880 }}>
        <Breadcrumb items={[{ name: 'Inicio', href: '/' }, { name: 'Política de Tratamiento de Datos' }]} />
        <h1 className="hero-title" style={{ maxWidth: '18ch', fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: 24 }}>
          Política de Tratamiento de Datos Personales
        </h1>
        <p className="hero-copy" style={{ maxWidth: 640 }}>
          Última actualización: 24 de septiembre de 2026. Aplica a velozzacws.com y a todos sus subdominios y formularios.
        </p>

        <div className="panel panel-pad reveal" style={{ marginTop: 32, marginBottom: 32 }}>
          <h2 style={{ marginTop: 0 }}>1. Quién es responsable del tratamiento</h2>
          <p>
            <strong>Velozza Creative Works</strong> es responsable del tratamiento de los datos personales que se
            recolectan a través de este sitio web, sus formularios, su línea de WhatsApp y sus canales de contacto
            directo.
          </p>
          <ul>
            <li>Correo de contacto: <a href="mailto:ceo@velozzacws.com">ceo@velozzacws.com</a></li>
            <li>Teléfono / WhatsApp: <a href="tel:+573053090273">+57 305 309 0273</a></li>
          </ul>
        </div>

        <div className="panel panel-pad reveal" style={{ marginBottom: 32 }}>
          <h2 style={{ marginTop: 0 }}>2. Marco legal</h2>
          <p>
            Esta política se rige por la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia, que
            regulan la protección de datos personales y el derecho de Habeas Data.
          </p>
        </div>

        <div className="panel panel-pad reveal" style={{ marginBottom: 32 }}>
          <h2 style={{ marginTop: 0 }}>3. Qué datos recolectamos</h2>
          <p>Dependiendo de cómo interactúes con el sitio, podemos recolectar:</p>
          <ul>
            <li><strong>Datos de contacto:</strong> nombre, correo electrónico, número de teléfono y, si aplica, el nombre de tu empresa — cuando llenas un formulario de contacto, cotización, o el formulario de la guía de poses para novias.</li>
            <li><strong>Datos de conversación:</strong> lo que nos escribes por WhatsApp cuando inicias una conversación desde el sitio.</li>
            <li><strong>Datos de navegación:</strong> páginas visitadas, tiempo en el sitio y origen de la visita, recolectados de forma agregada a través de herramientas de analítica web.</li>
          </ul>
          <p>No recolectamos datos financieros ni información sensible (salud, orientación, creencias) a través de este sitio.</p>
        </div>

        <div className="panel panel-pad reveal" style={{ marginBottom: 32 }}>
          <h2 style={{ marginTop: 0 }}>4. Para qué usamos tus datos</h2>
          <ul>
            <li>Responder tu solicitud de contacto o cotización.</li>
            <li>Enviarte el contenido que pediste explícitamente — por ejemplo, la guía de poses para novias en PDF.</li>
            <li>Coordinar y dar seguimiento a un proyecto o servicio contratado.</li>
            <li>Mejorar el contenido y la experiencia del sitio, con base en analítica agregada.</li>
          </ul>
          <p>
            <strong>Nunca vendemos ni compartimos tus datos personales con terceros</strong> para fines distintos a
            los aquí descritos, salvo que la ley lo exija.
          </p>
        </div>

        <div className="panel panel-pad reveal" style={{ marginBottom: 32 }}>
          <h2 style={{ marginTop: 0 }}>5. Tus derechos</h2>
          <p>Como titular de tus datos personales, tienes derecho a:</p>
          <ul>
            <li>Conocer, actualizar y rectificar tus datos.</li>
            <li>Solicitar prueba de la autorización que nos diste, si aplica.</li>
            <li>Ser informado sobre el uso que le hemos dado a tus datos.</li>
            <li>Revocar la autorización y/o solicitar la supresión de tus datos, cuando no exista un deber legal o contractual que nos obligue a conservarlos.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, escríbenos a{' '}
            <a href="mailto:ceo@velozzacws.com">ceo@velozzacws.com</a> indicando tu solicitud. Responderemos dentro
            de los términos que establece la ley.
          </p>
        </div>

        <div className="panel panel-pad reveal" style={{ marginBottom: 32 }}>
          <h2 style={{ marginTop: 0 }}>6. Cookies</h2>
          <p>Este sitio usa dos tipos de cookies:</p>
          <ul>
            <li><strong>Cookies técnicas necesarias:</strong> permiten que el sitio funcione correctamente (por ejemplo, recordar tu sesión si tienes una cuenta en el portal de clientes).</li>
            <li><strong>Cookies analíticas:</strong> nos ayudan a entender qué páginas visitas y cómo navegas el sitio, de forma agregada y sin identificarte individualmente, para mejorar el contenido.</li>
          </ul>
          <p>
            Puedes desactivar las cookies desde la configuración de privacidad de tu navegador en cualquier momento.
            Desactivarlas no te impide navegar el sitio, aunque algunas funciones (como recordar tu sesión) podrían
            dejar de funcionar.
          </p>
        </div>

        <div className="panel panel-pad reveal">
          <h2 style={{ marginTop: 0 }}>7. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política cuando cambien nuestras prácticas o la normativa vigente. La fecha de
            última actualización siempre aparece al inicio de este documento.
          </p>
        </div>
      </section>
    </main>
  );
}
