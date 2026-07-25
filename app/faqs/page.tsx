import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import Link from 'next/link';

const faqs = [
  {
    question: '¿Qué incluye el sistema SEO de Velozza?',
    answer: 'Incluye arquitectura técnica, contenido, schema markup, enlazado interno, local SEO, blog, casos de éxito y páginas por industria.',
  },
  {
    question: '¿Puedo usar la estructura para ES y EN?',
    answer: 'Sí. La plataforma está preparada para expandirse con rutas y metadatos localizados por idioma.',
  },
  {
    question: '¿Cómo convierto FAQs en leads?',
    answer: 'Cada bloque de FAQ está pensado para resolver objeciones y dirigir a CTA de consultoría, contacto o agendamiento.',
  },
  {
    question: '¿Los casos de éxito son indexables?',
    answer: 'Sí. Los casos de éxito se publican como páginas únicas con schema y enlaces internos hacia servicios y artículos relacionados.',
  },
  {
    question: '¿Cuánto cuestan los servicios de Velozza Creative Works?',
    answer: 'Trabajamos con planes de membresía mensual desde COP $880.000 al mes. Cada plan se ajusta al momento de tu marca: puedes empezar con un alcance enfocado y escalar a medida que ves resultados. Antes de cotizar realizamos una consulta estratégica para entender tus objetivos y recomendarte el plan que realmente necesitas, sin venderte servicios que no aportan a tu etapa actual.',
  },
  {
    question: '¿En cuánto tiempo veo resultados con SEO?',
    answer: 'El SEO es una inversión de mediano plazo: los primeros movimientos en posicionamiento y tráfico orgánico suelen verse entre los 3 y 6 meses, dependiendo de la competencia de tu sector y del estado técnico de tu sitio. A cambio, construyes un activo digital que sigue generando visibilidad y leads sin depender de pauta permanente.',
  },
  {
    question: '¿Qué tan rápido funciona la pauta digital?',
    answer: 'La pauta digital es el canal más rápido: las campañas pueden empezar a generar tráfico y leads en cuestión de días una vez aprobadas las piezas y la segmentación. Durante las primeras semanas optimizamos audiencias, creativos y presupuesto con base en datos reales para bajar tu costo por resultado de forma progresiva.',
  },
  {
    question: '¿Cuándo se notan los resultados en redes sociales?',
    answer: 'En gestión de redes sociales, los primeros indicadores de crecimiento — alcance, interacción y consistencia visual — suelen notarse entre las 4 y 8 semanas. Es el tiempo que toma establecer la línea editorial, entender qué contenido conecta con tu audiencia y construir un ritmo de publicación que el algoritmo y tu comunidad reconozcan.',
  },
  {
    question: '¿En qué ciudades y países trabaja Velozza?',
    answer: 'Tenemos oficinas en Bogotá y Medellín, y hemos acompañado a más de 250 marcas en más de 7 países. También trabajamos con clientes en Estados Unidos, como negocios del mercado latino en Florida. Al operar de forma remota y presencial, podemos atenderte estés donde estés, con reuniones virtuales y procesos de trabajo 100% digitales.',
  },
  {
    question: '¿Cómo es el proceso de trabajo con Velozza?',
    answer: 'Nuestro proceso tiene cuatro etapas: primero una consulta estratégica para entender tu negocio y objetivos; luego un análisis de marca donde evaluamos tu posicionamiento actual y tu competencia; después construimos un plan de acción con prioridades claras; y finalmente pasamos a producción y ejecución continua, con seguimiento de resultados en cada ciclo.',
  },
  {
    question: '¿Qué es Lozara Intelligence™?',
    answer: 'Lozara Intelligence™ es nuestra metodología propia de estrategia de marca potenciada con inteligencia artificial. Combina análisis de posicionamiento, arquetipos de identidad y datos de mercado para definir cómo debe hablar, verse y venderse tu marca. Es la base de todo lo que producimos: cada pieza de contenido y cada campaña responde a esa estrategia, no a la improvisación.',
  },
  {
    question: '¿Hacen fotografía y video de eventos sociales y bodas?',
    answer: 'Sí. Ofrecemos cobertura profesional de fotografía y video para eventos sociales y bodas, con paquetes que se ajustan al tipo de celebración y a los entregables que necesitas. Nuestro equipo cuida tanto la calidad técnica como la narrativa del evento, para que el material final cuente la historia completa y sea memorable.',
  },
  {
    question: '¿Ofrecen grabación de contenido para marca personal?',
    answer: 'Sí. Realizamos sesiones de grabación de contenido para marca personal: planificamos contigo los temas y el formato, dirigimos la sesión y entregamos material listo para publicar en tus redes. Es ideal para profesionales, líderes y emprendedores que quieren construir autoridad con contenido de calidad sin encargarse de la producción.',
  },
  {
    question: '¿Hay contratos de permanencia?',
    answer: 'Trabajamos con planes de membresía mensual y las condiciones de cada acuerdo se definen con claridad en tu propuesta, según el alcance y el plan elegido. Nuestro objetivo es que continúes por los resultados, no por una cláusula: por eso cada mes revisamos avances contigo y ajustamos la estrategia cuando es necesario.',
  },
  {
    question: '¿Recibo reportes de resultados?',
    answer: 'Sí. Entregamos reportes mensuales con las métricas relevantes de tu plan: crecimiento en redes, rendimiento de campañas, posicionamiento SEO o leads generados, según los servicios activos. Cada reporte incluye lectura estratégica, no solo números: te explicamos qué funcionó, qué ajustaremos y cuáles son las prioridades del siguiente mes.',
  },
  {
    question: '¿Cómo empiezo a trabajar con Velozza?',
    answer: 'El primer paso es agendar una consulta estratégica. En esa sesión conocemos tu negocio, tus objetivos y tu situación actual de marca. Con esa información realizamos un análisis y te presentamos un plan con el alcance, los entregables y la inversión recomendada. Si decides avanzar, iniciamos producción de inmediato con un cronograma claro.',
  },
];

export default function FAQPage() {
  return (
    <main>
      <Breadcrumb items={[{ name: 'Inicio', href: '/' }, { name: 'FAQs' }]} />

      <section className="section-shell">
        <h1 className="section-title">Sistema de FAQs</h1>
        <p className="section-lead muted">
          Respuestas diseñadas para SEO, conversión y reducción de fricción comercial.
        </p>

        <FAQ items={faqs} title="Preguntas frecuentes sobre la plataforma" />

        <div className="panel panel-pad" style={{ marginTop: '24px' }}>
          <h2 style={{ marginTop: 0 }}>Accesos relacionados</h2>
          <div className="chip-row">
            <Link href="/casos-de-exito" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Casos de éxito</Link>
            <Link href="/servicios" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Servicios</Link>
            <Link href="/blog" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Blog</Link>
            <Link href="/industrias" className="chip-button cta-secondary" style={{ color: '#f8f5ed' }}>Industrias</Link>
          </div>
        </div>
      </section>
    </main>
  );
}