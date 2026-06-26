import type { Metadata } from 'next';
import Link from 'next/link';
import { organizationSchema } from '@/lib/seo/schema';
import { PremiumIcon } from '@/components/PremiumIcon';

export const metadata: Metadata = {
  title: 'Velozza Creative Works™',
  description:
    'Construimos marcas, generamos demanda e impulsamos líderes con una landing premium enfocada en autoridad, resultados y conversión.',
};

const schema = organizationSchema();

const services = [
  { icon: 'target', title: 'Marca Personal & Ejecutivo', copy: 'Posicionamos tu autoridad y te convertimos en la referencia de tu industria.', slug: 'personal-branding' },
  { icon: 'social', title: 'Gestión de Redes Sociales', copy: 'Contenido estratégico que atrae, conecta y convierte tu audiencia.', slug: 'social-media-management' },
  { icon: 'video', title: 'Producción de Contenido', copy: 'Videos, fotos y contenido de alto impacto que comunica tu valor.', slug: 'video-marketing' },
  { icon: 'analytics', title: 'Estrategia & Marketing Digital', copy: 'Estrategias basadas en datos para generar demanda y crecimiento sostenible.', slug: 'seo-services' },
  { icon: 'bolt', title: 'Publicidad Digital', copy: 'Diseñamos campañas de intención alta con segmentación, mensajes y optimización para convertir inversión en clientes reales.', slug: 'publicidad-digital' },
  { icon: 'ai', title: 'Automatización & IA', copy: 'Creamos sistemas inteligentes que ahorran tiempo, califican leads y sostienen tu crecimiento con procesos escalables.', slug: 'automatizacion-ia' },
];

const results = [
  ['+487%', 'Crecimiento Orgánico'],
  ['+2.3M', 'Alcance Generado'],
  ['+3,800', 'Leads Generados'],
  ['+320%', 'ROI en Campañas'],
];

type PlanPrice = string | { cop: string; usd: string };

type Plan = [string, string, PlanPrice, string[]];

const plans: Plan[] = [
  ['DIY Starter', 'Para quienes comienzan su presencia digital.', { cop: 'COP $1.200.000', usd: 'USD $400' }, ['Estrategia Inicial', 'Gestión de Redes Básica', 'Reportes Mensuales']],
  ['Growth', 'Para marcas que quieren crecer de forma constante.', { cop: 'COP $1.700.000', usd: 'USD $600' }, ['Estrategia Avanzada', 'Contenido Mensual', 'Publicidad Básica', 'Reportes Avanzados']],
  ['Professional', 'Para marcas que quieren escalar y destacar.', { cop: 'COP $2.000.000', usd: 'USD $800' }, ['Estrategia Premium', 'Contenido Ilimitado', 'Publicidad Avanzada', 'Automatización', 'Reportes Completos']],
  ['Authority Brand', 'Para líderes que quieren dominio total de su industria.', 'USD $2,997', ['Estrategia Personalizada', 'Contenido Premium', 'Publicidad Ilimitada', 'LinkedIn Growth', 'Posicionamiento Ejecutivo']],
  ['Elite', 'Soluciones a la medida para visión y resultados.', 'A medida', ['Estrategia 1 a 1', 'Equipo Dedicado', 'Soluciones Integrales', 'Crecimiento Exponencial']],
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="home">
        <style>{`
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { margin: 0; background: #0c0c0a; color: #f4f2ec; font-family: var(--font-sans); }
          .home { background: #0c0c0a; }
          .wrap { width: min(1240px, calc(100% - 40px)); margin: 0 auto; }
          .nav {
            position: sticky; top: 0; z-index: 20; height: 74px; display: flex; align-items: center; justify-content: space-between;
            background: rgba(12,12,10,0.94); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(201,168,76,0.16);
          }
          .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: #f4f2ec; }
          .brand-name { display: block; font-family: Montserrat, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
          .brand-sub { display: block; margin-top: 2px; font-family: Montserrat, sans-serif; font-size: 7.5px; letter-spacing: .22em; text-transform: uppercase; color: #f0d98a; }
          .button { border: 0; cursor: pointer; font-family: Montserrat, sans-serif; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; display: inline-flex; align-items: center; gap: 8px; justify-content: center; text-decoration: none; }
          .button, .service, .result, .plan, .cta-item, .photo, .brand-list span, .links a, .social, .footer a { transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, border-color 180ms ease, color 180ms ease, filter 180ms ease; }
          .gold { background: linear-gradient(135deg, #f0d98a, #c9a84c); color: #1a1200; padding: 14px 24px; }
          .ghost { background: transparent; color: #f4f2ec; border: 1px solid rgba(244,242,236,.22); padding: 14px 24px; }
          .links { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; justify-content: flex-end; }
          .links a { color: rgba(244,242,236,.66); text-decoration: none; font-family: Montserrat, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
          .links a:hover, .footer a:hover, .link:hover { color: #f0d98a; }
          .hero { position: relative; overflow: hidden; }
          .hero::before {
            content: ''; position: absolute; inset: 0;
            background:
              radial-gradient(ellipse 60% 70% at 70% 35%, rgba(201,168,76,.14), transparent 62%),
              radial-gradient(ellipse 35% 50% at 18% 72%, rgba(201,168,76,.05), transparent 60%);
            pointer-events: none;
          }
          .hero-grid { position: relative; z-index: 1; padding: 72px 0 48px; display: grid; grid-template-columns: 1.05fr .95fr; gap: 54px; align-items: center; }
          .eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 24px; font-family: Montserrat, sans-serif; font-size: 9.5px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: #f0d98a; }
          .eyebrow::before { content: ''; width: 28px; height: 1px; background: #c9a84c; }
          h1, h2, .metric-value, .result-metric, .plan-title, .price, .cta-title { font-family: 'Cormorant Garamond', serif; }
          h1 { margin: 0; font-size: clamp(54px, 6vw, 88px); line-height: .95; font-weight: 600; }
          .accent { color: #f0d98a; }
          .hero-copy { max-width: 470px; margin: 26px 0 34px; color: #c8c6be; line-height: 1.8; font-size: 15px; }
          .actions { display: flex; gap: 14px; flex-wrap: wrap; }
          .photo-stack { position: relative; min-height: 520px; display: flex; justify-content: center; align-items: center; }
          .photo { position: relative; overflow: hidden; border: 1px solid rgba(201,168,76,.18); box-shadow: 0 10px 40px rgba(0,0,0,.45); }
          .hero-photo { width: 340px; height: 500px; }
          .about-photo { width: 100%; aspect-ratio: 4 / 5; }
          .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .photo::after { content: ''; position: absolute; inset: auto 0 0 0; height: 140px; background: linear-gradient(to top, rgba(12,12,10,.96), transparent); }
          .watermark { position: absolute; right: 18px; bottom: 18px; z-index: 1; font-family: Montserrat, sans-serif; font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: rgba(201,168,76,.26); text-align: right; }
          .metric { position: absolute; background: rgba(20,19,14,.9); border: 1px solid rgba(201,168,76,.22); backdrop-filter: blur(12px); padding: 14px 18px; min-width: 170px; }
          .metric.one { top: -18px; right: -34px; }
          .metric.two { left: -42px; bottom: 116px; }
          .metric.three { right: -24px; bottom: -10px; }
          .label { font-family: Montserrat, sans-serif; font-size: 8.5px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #7a7870; }
          .metric-value { font-size: 34px; font-weight: 700; line-height: 1; margin-top: 4px; background: linear-gradient(135deg, #f0d98a, #c9a84c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .sub { margin-top: 4px; font-size: 10px; color: #7a7870; }
          .bars { display: flex; gap: 2px; align-items: flex-end; height: 28px; margin-top: 8px; }
          .bars span { flex: 1; background: linear-gradient(135deg, #f0d98a, #c9a84c); border-radius: 1px; opacity: .8; }
          .dots { display: flex; gap: 5px; margin-top: 8px; }
          .dot { width: 16px; height: 16px; border-radius: 50%; background: linear-gradient(135deg, #f0d98a, #c9a84c); }
          .dot.off { background: rgba(255,255,255,.08); border: 1px solid #2a2a22; }
          .score { font-size: 30px; font-weight: 700; line-height: 1; background: linear-gradient(135deg, #f0d98a, #c9a84c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .score small { font-size: 16px; opacity: .55; }
          .arrow { text-align: center; padding: 12px 0 18px; color: rgba(201,168,76,.42); font-size: 22px; }
          .brands { border-top: 1px solid #2a2a22; border-bottom: 1px solid #2a2a22; padding: 28px 0; }
          .brand-copy { text-align: center; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: #7a7870; margin-bottom: 18px; }
          .brand-list { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; font-family: Montserrat, sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(244,242,236,.24); }
          .section { padding: 90px 0; }
          .section-head { margin-bottom: 34px; }
          .title { margin: 0; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; }
          .subtitle { margin: 10px 0 0; color: #7a7870; font-size: 14px; max-width: 720px; }
          .services-grid, .results-grid, .plans-grid { display: grid; gap: 1px; background: #2a2a22; }
          .services-grid { grid-template-columns: repeat(3, 1fr); }
          .service, .result, .plan { background: #181813; cursor: pointer; }
          .service { padding: 32px 28px; min-height: 220px; }
          .service-link { display: block; color: inherit; text-decoration: none; }
          .service:hover, .result:hover, .plan:hover, .cta-item:hover, .photo:hover {
            transform: translateY(-4px);
            border-color: rgba(201,168,76,.42);
            background: linear-gradient(135deg, rgba(201,168,76,.10), rgba(255,255,255,.02));
            box-shadow: 0 20px 48px rgba(0,0,0,.34), inset 0 0 0 1px rgba(244,207,99,.10);
          }
          .service:hover .icon, .result:hover .play, .plan:hover .badge, .cta-item:hover .cta-icon {
            background: linear-gradient(135deg, rgba(240,217,138,.26), rgba(201,168,76,.16));
            border-color: rgba(240,217,138,.38);
          }
          .icon { width: 42px; height: 42px; display: grid; place-items: center; margin-bottom: 18px; background: rgba(201,168,76,.08); border: 1px solid rgba(201,168,76,.16); }
          .service h3, .plan-title { margin: 0 0 10px; font-size: 21px; }
          .service p, .plan p, .about-copy { color: #7a7870; line-height: 1.65; }
          .service p { font-size: 13px; margin: 0 0 18px; }
          .link { color: #f0d98a; text-decoration: none; font-family: Montserrat, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
          .stats { background: #141410; border-top: 1px solid #2a2a22; border-bottom: 1px solid #2a2a22; }
          .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); padding: 46px 0; }
          .stat { text-align: center; padding: 10px 12px; border-right: 1px solid #2a2a22; }
          .stat:last-child { border-right: 0; }
          .stat .value { font-size: 48px; line-height: 1; font-weight: 700; background: linear-gradient(135deg, #f0d98a, #c9a84c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .stat .name { margin-top: 6px; color: #7a7870; font-size: 11.5px; }
          .results-grid { grid-template-columns: repeat(4, 1fr); }
          .thumb { aspect-ratio: 3 / 4; display: grid; place-items: center; }
          .play { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, #f0d98a, #c9a84c); color: #1a1200; font-size: 18px; }
          .result { border: 1px solid #2a2a22; overflow: hidden; }
          .result .meta { padding: 16px; }
          .result-metric { font-size: 26px; font-weight: 700; background: linear-gradient(135deg, #f0d98a, #c9a84c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .result-label { color: #7a7870; font-size: 11px; }
          .about { background: #141410; border-top: 1px solid #2a2a22; }
          .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 76px; align-items: center; }
          .about-photo .watermark { bottom: auto; top: 24px; right: 24px; color: rgba(240,217,138,.26); }
          .about-title { margin: 0 0 18px; font-size: clamp(38px, 4.6vw, 58px); line-height: 1.05; }
          .about-list { margin: 0 0 30px; padding: 0; list-style: none; }
          .about-list li { padding: 10px 0; border-bottom: 1px solid #2a2a22; color: #f4f2ec; }
          .plans-grid { grid-template-columns: repeat(5, 1fr); }
          .plan { position: relative; padding: 30px 22px; }
          .plan.featured { box-shadow: inset 0 0 0 1px #c9a84c; }
          .badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #f0d98a, #c9a84c); color: #1a1200; font-family: Montserrat, sans-serif; font-size: 8.5px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; padding: 4px 16px; }
          .price { margin: 2px 0; font-size: 30px; font-weight: 700; }
          .price-stack {
            display: grid;
            gap: 12px;
            padding: 12px 14px;
            margin: 8px 0 2px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(240, 217, 138, 0.10);
            border-radius: 18px;
          }
          .price-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            flex-wrap: wrap;
          }
          .price-chip {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 46px;
            padding: 5px 8px;
            border-radius: 999px;
            font-family: Montserrat, sans-serif;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .16em;
            text-transform: uppercase;
            color: #1a1200;
            background: linear-gradient(135deg, #f0d98a, #c9a84c);
          }
          .price-value {
            font-size: 26px;
            font-weight: 700;
            line-height: 1;
            color: #f8f5ed;
            text-align: right;
          }
          .price-value-usd { color: #f0d98a; }
          .price-divider {
            height: 1px;
            width: 100%;
            background: linear-gradient(90deg, transparent, rgba(240,217,138,.35), transparent);
          }
          .period { font-size: 10px; color: #7a7870; margin-bottom: 20px; }
          .features { list-style: none; margin: 0 0 24px; padding: 0; }
          .features li { padding: 7px 0; color: #c8c6be; border-bottom: 1px solid rgba(255,255,255,.04); }
          .btn-plan { width: 100%; padding: 12px; border: 1px solid #2a2a22; background: transparent; color: rgba(244,242,236,.74); font-family: Montserrat, sans-serif; font-size: 9.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
          .cta { background: linear-gradient(135deg, #f0d98a, #c9a84c); color: #1a1200; padding: 72px 0; }
          .cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
          .cta-title { margin: 0 0 10px; font-size: clamp(30px, 3.5vw, 46px); line-height: 1.1; font-weight: 700; }
          .cta-copy { margin: 0; color: rgba(26,18,0,.68); }
          .cta-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 20px; }
          .cta-item { display: flex; gap: 14px; align-items: flex-start; }
          .cta-icon { width: 40px; height: 40px; flex: 0 0 auto; display: grid; place-items: center; border: 1px solid rgba(26,18,0,.16); background: rgba(26,18,0,.08); }
          .cta-name { font-family: Montserrat, sans-serif; font-weight: 800; font-size: 13px; margin-bottom: 2px; }
          .cta-detail { font-size: 12px; color: rgba(26,18,0,.55); }
          .footer { background: #080806; border-top: 1px solid #2a2a22; }
          .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 46px; padding: 60px 0 38px; }
          .footer-brand p { color: #7a7870; font-size: 13px; line-height: 1.6; margin: 16px 0; }
          .powered { font-family: Montserrat, sans-serif; font-size: 9px; letter-spacing: .14em; font-weight: 800; text-transform: uppercase; color: #f0d98a; }
          .socials { display: flex; gap: 10px; margin-top: 18px; }
          .social { width: 34px; height: 34px; border: 1px solid #2a2a22; display: grid; place-items: center; color: #7a7870; text-decoration: none; }
          .footer h4 { font-family: Montserrat, sans-serif; font-size: 9.5px; letter-spacing: .2em; font-weight: 800; text-transform: uppercase; margin: 0 0 18px; }
          .footer ul { list-style: none; padding: 0; margin: 0; }
          .footer li { margin: 0 0 11px; }
          .footer a { color: #7a7870; text-decoration: none; font-size: 13px; }
          .bottom { display: flex; justify-content: space-between; gap: 18px; align-items: center; border-top: 1px solid #2a2a22; padding: 22px 0; }
          .legal { display: flex; gap: 24px; flex-wrap: wrap; }
          .bottom p, .legal a { color: #7a7870; font-size: 11px; }
          .wa { position: fixed; right: 28px; bottom: 28px; width: 52px; height: 52px; border-radius: 50%; border: 0; background: #25d366; color: #fff; font-size: 24px; box-shadow: 0 4px 24px rgba(37,211,102,.5); }
          @media (max-width: 1100px) {
            .links { gap: 14px; }
            .hero-grid, .about-grid, .cta-grid { grid-template-columns: 1fr; gap: 42px; }
            .services-grid, .results-grid, .plans-grid { grid-template-columns: repeat(2, 1fr); }
            .stats-grid { grid-template-columns: repeat(3, 1fr); }
            .footer-grid { grid-template-columns: 1fr 1fr; }
          }
          @media (max-width: 640px) {
            .nav, .hero-grid, .section, .cta, .footer { padding-left: 0; padding-right: 0; }
            .wrap { width: min(100% - 24px, 1240px); }
            .nav { height: auto; min-height: 74px; gap: 12px; padding-top: 10px; padding-bottom: 10px; align-items: flex-start; }
            .brand { transform: scale(.92); transform-origin: left top; }
            .links { width: 100%; justify-content: flex-start; gap: 10px 14px; overflow-x: auto; padding-bottom: 2px; }
            .links li { flex: 0 0 auto; }
            .button.gold { display: none; }
            .hero-grid { padding-top: 34px; padding-bottom: 28px; }
            .hero-copy { font-size: 14px; margin-bottom: 28px; }
            .actions { width: 100%; }
            .actions .button { flex: 1 1 100%; }
            .photo-stack { min-height: auto; display: grid; gap: 12px; justify-items: center; }
            .metric { position: static; width: 100%; max-width: 340px; }
            .metric.one, .metric.two, .metric.three { top: auto; right: auto; left: auto; bottom: auto; }
            .services-grid, .results-grid, .plans-grid, .stats-grid { grid-template-columns: 1fr; }
            .stats-grid { padding: 34px 0; }
            .stat { border-right: 0; border-bottom: 1px solid #2a2a22; }
            .footer-grid { grid-template-columns: 1fr; }
            .bottom { flex-direction: column; align-items: flex-start; }
            .hero-photo { width: 100%; max-width: 340px; height: 460px; }
          }
        `}</style>

        <header className="nav wrap">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="vg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0d98a" />
                    <stop offset="45%" stopColor="#c9a84c" />
                    <stop offset="100%" stopColor="#7a5a18" />
                  </linearGradient>
                </defs>
                <path d="M4 6 L16 26 L28 6" stroke="url(#vg)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span>
              <span className="brand-name">Velozza</span>
              <span className="brand-sub">Creative Works™</span>
            </span>
          </Link>
          <ul className="links">
            <li><a href="/servicios">Servicios</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/casos-de-exito">Casos de éxito</a></li>
            <li><a href="/industrias">Industrias</a></li>
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/cliente">Cliente</a></li>
            <li><a href="/login">Ingresar</a></li>
          </ul>
          <Link href="/contacto" className="button gold">Agenda tu Consulta →</Link>
        </header>

        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow">Impulsado por Lozara Intelligence™</div>
              <h1>
                Construimos<br />
                Marcas.<br />
                Generamos<br />
                Demanda.<br />
                <span className="accent">Impulsamos<br />Líderes.</span>
              </h1>
              <p className="hero-copy">Estrategias de marca personal y marketing digital diseñadas para posicionar tu autoridad, atraer clientes ideales y generar crecimiento medible y sostenible.</p>
              <div className="actions">
                <Link href="/contacto" className="button gold">Agenda tu Consulta Gratuita →</Link>
                <Link href="/casos-de-exito" className="button ghost"><PremiumIcon name="arrow-right" size={14} /> Ver Casos de Éxito</Link>
              </div>
            </div>

            <div className="photo-stack">
              <div className="photo hero-photo">
                <img src="/founder-arms.jpg" alt="David Velozza" />
                <div className="watermark">VELOZZA<br />CREATIVE</div>
              </div>

              <div className="metric one">
                <div className="label">Crecimiento de Audiencia</div>
                <div className="metric-value">+214%</div>
                <div className="sub">En los últimos 90 días</div>
                <div className="bars">{[30, 45, 35, 60, 50, 75, 65, 90, 100].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
              </div>

              <div className="metric two">
                <div className="label">Leads Generados</div>
                <div className="metric-value">1,382</div>
                <div className="sub">Este mes</div>
                <div className="dots"><span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" /><span className="dot off" /></div>
              </div>

              <div className="metric three">
                <div className="label">Autoridad de Marca</div>
                <div className="score">95<small>/100</small></div>
                <div className="sub">Puntaje de Posicionamiento</div>
                <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '95%', height: '100%', background: 'linear-gradient(135deg, #f0d98a, #c9a84c)' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="arrow"><PremiumIcon name="down" size={24} /></div>

        <section className="brands">
          <div className="wrap">
            <div className="brand-copy">Clientes y aliados que han confiado en nuestro trabajo.</div>
            <div className="brand-list">
              <span>Ávila Internacional</span>
              <span>Lucy Moreno</span>
              <span>Dr. Juan Marulanda</span>
              <span>Adriana Ortega</span>
              <span>Dicolseg LTDA</span>
              <span>Star Light Garden and Farm</span>
              <span>Andes Energy</span>
              <span>Congreso de la República</span>
              <span>Banquetes Lili Mac Fontibón</span>
              <span>Premium Services Express</span>
            </div>
          </div>
        </section>

        <section className="section" id="servicios">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Nuestros Servicios</div>
              <h2 className="title">Soluciones que generan <span className="accent">resultados reales</span></h2>
              <p className="subtitle">Estrategias integrales, ejecución impecable y tecnología inteligente.</p>
            </div>
            <div className="services-grid">
              {services.map(({ icon, title, copy, slug }) => (
                <Link href={slug === 'contacto' ? '/contacto' : `/servicios/${slug}`} className="service-link" key={title}>
                  <article className="service">
                    <div className="icon"><PremiumIcon name={icon as any} size={22} /></div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    <span className="link">Saber más →</span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="wrap stats-grid">
            {[
              ['+250', 'Marcas Posicionadas'],
              ['+10M', 'Personas Alcanzadas'],
              ['+35M', 'Leads Generados'],
              ['+300%', 'Crecimiento Promedio'],
              ['+7', 'Países Atendidos'],
            ].map(([value, label]) => (
              <div className="stat" key={label}>
                <div className="value">{value}</div>
                <div className="name">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="resultados">
          <div className="wrap">
            <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <div className="eyebrow">Resultados</div>
                <h2 className="title">Resultados que hablan<br />por <span className="accent">nosotros</span></h2>
                <p className="subtitle">Historias reales de marcas que crecieron con Velozza.</p>
              </div>
              <Link href="/casos-de-exito" className="button gold">Ver Casos de Éxito →</Link>
            </div>
            <div className="results-grid">
              {results.map(([value, label], index) => (
                <article className="result" key={label}>
                  <div className="thumb" style={{ background: index === 1 ? 'linear-gradient(160deg,#1a1e14 0%,#0e0c08 100%)' : index === 2 ? 'linear-gradient(160deg,#1a1214 0%,#0e0c08 100%)' : index === 3 ? 'linear-gradient(160deg,#141a1a 0%,#0e0c08 100%)' : 'linear-gradient(160deg,#1e1c14 0%,#0e0c08 100%)' }}>
                    <div className="play"><PremiumIcon name="play" size={18} /></div>
                  </div>
                  <div className="meta">
                    <div className="result-metric">{value}</div>
                    <div className="result-label">{label}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about" id="nosotros">
          <div className="wrap section about-grid">
            <div className="photo about-photo">
              <img src="/founder-fulllength.jpg" alt="David Velozza" />
              <div className="watermark">David Velozza</div>
            </div>
            <div>
              <div className="eyebrow">Fundador &amp; CEO · Velozza Creative Works</div>
              <h2 className="about-title">Liderazgo.<br />Visión.<br />Ejecución.</h2>
              <p className="about-copy">Con más de 15 años de experiencia, David Velozza y su equipo han ayudado a miles de líderes a transformar su presencia y multiplicar su impacto.</p>
              <ul className="about-list">
                <li>Estratega de Marcas Personales</li>
                <li>Productor de Contenido #1 en LATAM</li>
                <li>Conferencista Internacional</li>
                <li>Autor y Entrenador</li>
                <li>Empresario &amp; Visionario</li>
              </ul>
              <Link href="/contacto" className="button ghost">Más sobre David →</Link>
            </div>
          </div>
        </section>

        <section className="section" id="planes">
          <div className="wrap">
            <div className="section-head" style={{ textAlign: 'center' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>Planes</div>
              <h2 className="title">Elige el plan que impulsa tu crecimiento</h2>
              <p className="subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Soluciones flexibles diseñadas para cada etapa de tu marca.</p>
            </div>
            <div className="plans-grid">
              {plans.map(([name, copy, price, features], index) => (
                <article className={`plan ${index === 2 ? 'featured' : ''}`} key={`${name}-${index}`}>
                  {index === 2 ? <div className="badge">Más Popular</div> : null}
                  <h3 className="plan-title">{name}</h3>
                  <p>{copy}</p>
                  <div style={{ fontSize: 9.5, color: '#7a7870' }}>Desde</div>
                  <div className="price">
                    {typeof price === 'string' ? (
                      <span>{price}</span>
                    ) : (
                      <div className="price-stack" aria-label={`${price.usd} y ${price.cop}`}>
                        <div className="price-row price-row-usd">
                          <span className="price-chip">USD</span>
                          <span className="price-value price-value-usd">{price.usd}</span>
                        </div>
                        <div className="price-divider" />
                        <div className="price-row price-row-cop">
                          <span className="price-chip">COP</span>
                          <span className="price-value">{price.cop}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="period">/mes</div>
                  <ul className="features">{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                  <Link href="/contacto" className="btn-plan">{name === 'Elite' ? 'Hablar con un Asesor' : 'Ver Plan'}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="wrap cta-grid">
            <div>
              <h2 className="cta-title">Hablemos de tu visión y construyamos tu próximo nivel.</h2>
              <p className="cta-copy">Una estrategia personalizada puede cambiar el rumbo de tu marca.</p>
              <Link href="/contacto" className="button ghost" style={{ marginTop: 28, borderColor: 'rgba(26,18,0,.2)', color: '#1a1200' }}>Agendar Ahora →</Link>
            </div>
            <ul className="cta-list">
              {[
                ['target', 'Consulta Estratégica 1 a 1', 'Hablamos de tus objetivos.'],
                ['analytics', 'Análisis de tu Marca', 'Evaluación personalizada.'],
                ['sparkles', 'Plan de Acción Personalizado', 'Estrategia diseñada para ti.'],
              ].map(([icon, title, copy]) => (
                <li className="cta-item" key={title}>
                  <div className="cta-icon"><PremiumIcon name={icon as any} size={18} /></div>
                  <div>
                    <div className="cta-name">{title}</div>
                    <div className="cta-detail">{copy}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="footer">
          <div className="wrap footer-grid">
            <div className="footer-brand">
              <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
                <span className="brand-mark">
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="vg3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f0d98a" />
                        <stop offset="50%" stopColor="#c9a84c" />
                        <stop offset="100%" stopColor="#7a5a18" />
                      </linearGradient>
                    </defs>
                    <path d="M4 6 L16 26 L28 6" stroke="url(#vg3)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                <span>
                  <span className="brand-name">Velozza</span>
                  <span className="brand-sub">Creative Works™</span>
                </span>
              </Link>
              <p>Construimos marcas que lideran y generan resultados.</p>
              <div className="powered">Powered by LoZaRa Intelligence™</div>
              <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                <a href="tel:+573193677929" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>+57 319 367 7929</a>
                <a href="mailto:ceo@velozzacws.com" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>ceo@velozzacws.com</a>
                <a href="https://instagram.com/velozzacws" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>@velozzacws</a>
              </div>
            </div>
            <div>
              <h4>Servicios</h4>
              <ul><li><Link href="/servicios/personal-branding">Marca Personal &amp; Ejecutivo</Link></li><li><Link href="/servicios/social-media-management">Gestión de Redes Sociales</Link></li><li><Link href="/servicios/video-marketing">Producción de Contenido</Link></li><li><Link href="/servicios/seo-services">Estrategia &amp; Marketing Digital</Link></li><li><Link href="/servicios/publicidad-digital">Publicidad Digital</Link></li></ul>
            </div>
            <div>
              <h4>Recursos</h4>
              <ul><li><Link href="/blog">Recursos</Link></li><li><Link href="/#resultados">Resultados</Link></li><li><Link href="/#planes">Planes</Link></li><li><Link href="/servicios/automatizacion-ia">Autoridad de Marca</Link></li></ul>
            </div>
            <div>
              <h4>Empresa</h4>
              <ul><li><Link href="/#nosotros">Nosotros</Link></li><li><Link href="/contacto">Contacto</Link></li><li><Link href="/login">Acceder</Link></li></ul>
            </div>
          </div>
          <div className="wrap bottom">
            <p>© 2026 Velozza Creative Works™. Todos los derechos reservados.</p>
            <div className="legal"><Link href="/contacto">Política de Privacidad</Link><Link href="/contacto">Términos de Servicio</Link><Link href="/contacto">Aviso Legal</Link></div>
          </div>
        </footer>

        <button className="wa" aria-label="WhatsApp"><PremiumIcon name="chat" size={22} /></button>
      </main>
    </>
  );
}
