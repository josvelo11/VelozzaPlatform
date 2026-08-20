import type { Metadata } from 'next';
import Link from 'next/link';
import { organizationSchema } from '@/lib/seo/schema';
import { PremiumIcon } from '@/components/PremiumIcon';
import BrandLogo from '@/components/BrandLogo';

export const metadata: Metadata = {
  title: 'Velozza Creative Works™',
  description:
    'Construimos marcas, generamos demanda e impulsamos líderes con una landing premium enfocada en autoridad, resultados y conversión.',
};

const schema = organizationSchema();

const brandLogos = [
  { label: 'Lucy Moreno', href: 'https://www.instagram.com/lucymoreno.enarmonia?igsh=MWYwZm1mbHVqN3Q2cQ==' },
  { label: 'Dr. Juan Marulanda', href: 'https://www.instagram.com/drjuanmarulanda?igsh=bWFueXA0bmNobDFj' },
  { label: 'Dra. Adriana Ortega', href: 'https://www.instagram.com/dra.adriana.ortega?igsh=NHhjenFka255M2Nz' },
  { label: 'Ávila Internacional', href: 'https://www.instagram.com/avilainternacional?igsh=MXZ6eG9obnZ6ZGxxZw==' },
  { label: 'Eva Rosa Zamora', href: 'https://www.instagram.com/eva_rosa_zamora_lopez?igsh=MW1wbnhvZG85ZjVnbw==' },
  { label: 'Dicolseg LTDA' },
  { label: 'Star Light Garden and Farm' },
  { label: 'Congreso de la República' },
  { label: 'Banquetes Lili' },
  { label: 'Mac Fontibón' },
  { label: 'Premium Services Express' },
];

const services = [
  { icon: 'target', title: 'Marca Personal & Ejecutivo', copy: 'Posicionamos tu autoridad y te convertimos en la referencia de tu industria.', slug: 'personal-branding' },
  { icon: 'social', title: 'Gestión de Redes Sociales', copy: 'Contenido estratégico que atrae, conecta y convierte tu audiencia.', slug: 'social-media-management' },
  { icon: 'video', title: 'Producción de Contenido', copy: 'Videos, fotos y contenido de alto impacto que comunica tu valor.', slug: 'video-marketing' },
  { icon: 'analytics', title: 'Estrategia & Marketing Digital', copy: 'Estrategias basadas en datos para generar demanda y crecimiento sostenible.', slug: 'seo-services' },
  { icon: 'bolt', title: 'Publicidad Digital', copy: 'Diseñamos campañas de intención alta con segmentación, mensajes y optimización para convertir inversión en clientes reales.', slug: 'publicidad-digital' },
  { icon: 'ai', title: 'Automatización & IA', copy: 'Creamos sistemas inteligentes que ahorran tiempo, califican leads y sostienen tu crecimiento con procesos escalables.', slug: 'automatizacion-ia' },
];

const results = [
  ['target', '01', 'Consulta Estratégica'],
  ['analytics', '02', 'Análisis de Marca'],
  ['sparkles', '03', 'Plan de Acción'],
  ['video', '04', 'Producción y Ejecución'],
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
          .ghost { background: transparent; color: #f4f2ec; border: 1px solid rgba(244,242,236,.22); padding: 14px 24px; transition: border-color 220ms ease, background-color 220ms ease, transform 220ms ease; }
          .ghost:hover { border-color: rgba(240,217,138,.55); background: rgba(240,217,138,.06); transform: translateY(-2px); }
          .cta .ghost:hover { border-color: rgba(26,18,0,.5); background: rgba(26,18,0,.08); }
          .links { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; justify-content: flex-end; }
          .links a { color: rgba(244,242,236,.66); text-decoration: none; font-family: Montserrat, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
          .links a:hover, .footer a:hover, .link:hover { color: #f0d98a; }
          .hero { position: relative; overflow: hidden; }
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
          .brands {
            border-top: 1px solid transparent; border-bottom: 1px solid transparent;
            border-image: linear-gradient(90deg, transparent, rgba(201,168,76,.28), transparent) 1;
            padding: 28px 0;
          }
          .brand-copy { text-align: center; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: #7a7870; margin-bottom: 18px; }
          .brand-list { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; font-family: Montserrat, sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(244,242,236,.24); }
          .section { padding: 96px 0; }
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
          .stats {
            background: #141410; border-top: 1px solid transparent; border-bottom: 1px solid transparent;
            border-image: linear-gradient(90deg, transparent, rgba(201,168,76,.28), transparent) 1;
          }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); padding: 46px 0; }
          .stat { text-align: center; padding: 10px 12px 22px; border-right: 1px solid #2a2a22; }
          .stat:last-child { border-right: 0; }
          .stat .value { font-size: 48px; line-height: 1; font-weight: 700; background: linear-gradient(135deg, #f0d98a, #c9a84c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; position: relative; display: inline-block; }
          .stat .value::after { content: ''; position: absolute; left: 50%; bottom: -10px; width: 24px; height: 2px; background: linear-gradient(90deg, #f0d98a, #c9a84c); transform: translateX(-50%); opacity: .7; }
          .stat .name { margin-top: 6px; color: #7a7870; font-size: 11.5px; }
          .results-grid { grid-template-columns: repeat(4, 1fr); }
          .thumb { aspect-ratio: 3 / 4; display: grid; place-items: center; position: relative; }
          .step-eyebrow { position: absolute; top: 14px; left: 14px; font-family: Montserrat, sans-serif; font-size: 8.5px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: rgba(240,217,138,.55); }
          .play { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, #f0d98a, #c9a84c); color: #1a1200; font-size: 18px; transition: transform 220ms cubic-bezier(.16,1,.3,1); }
          .result:hover .play { transform: scale(1.1) rotate(-6deg); }
          .result { border: 1px solid #2a2a22; overflow: hidden; }
          .result .meta { padding: 16px; }
          .result-metric { font-size: 26px; font-weight: 700; background: linear-gradient(135deg, #f0d98a, #c9a84c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .result-label { color: #7a7870; font-size: 11px; }
          .about {
            background: #141410; border-top: 1px solid transparent;
            border-image: linear-gradient(90deg, transparent, rgba(201,168,76,.28), transparent) 1;
          }
          .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 76px; align-items: center; }
          .about-photo .watermark { bottom: auto; top: 24px; right: 24px; color: rgba(240,217,138,.26); }
          .about-photo { transition: transform 260ms cubic-bezier(.16,1,.3,1), box-shadow 260ms ease; }
          .about-photo:hover { transform: translateY(-3px); box-shadow: 0 34px 90px -24px rgba(0,0,0,.65), 0 12px 32px rgba(0,0,0,.42), 0 0 0 1px rgba(201,168,76,.1); }
          .about-title { margin: 0 0 18px; font-size: clamp(38px, 4.6vw, 58px); line-height: 1.05; }
          .about-list { margin: 0 0 30px; padding: 0; list-style: none; }
          .about-list li { padding: 10px 4px; border-bottom: 1px solid #2a2a22; color: #f4f2ec; display: flex; align-items: center; gap: 10px; transition: padding-left 220ms cubic-bezier(.16,1,.3,1), color 220ms ease; }
          .about-list li:hover { padding-left: 10px; color: #f0d98a; }
          .about-list li svg { color: #c9a84c; flex: 0 0 auto; }
          .plans-grid { grid-template-columns: repeat(5, 1fr); }
          .plans-grid-3 { grid-template-columns: repeat(3, 1fr); }
          .plans-grid-2 { grid-template-columns: repeat(2, 1fr); max-width: 720px; margin: 0 auto; }
          .plan { position: relative; padding: 30px 22px; }
          .plan.featured {
            background: linear-gradient(165deg, rgba(201,168,76,.14), rgba(24,24,19,1) 60%);
            box-shadow: inset 0 0 0 1px rgba(201,168,76,.65), 0 24px 60px -18px rgba(201,168,76,.16);
            z-index: 1;
          }
          .plan.featured::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, transparent, #f0d98a, #c9a84c, #f0d98a, transparent);
          }
          .plan.featured .plan-title, .plan.featured .price { color: #f8ecc7; }
          .badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #f0d98a, #c9a84c); color: #1a1200; font-family: Montserrat, sans-serif; font-size: 8.5px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; padding: 4px 16px; box-shadow: 0 6px 18px rgba(201,168,76,.35); transition: transform 220ms ease; }
          .plan:hover .badge { transform: translateX(-50%) scale(1.06); }
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
          .btn-plan { display: block; text-align: center; text-decoration: none; width: 100%; padding: 12px; border: 1px solid #2a2a22; background: transparent; color: rgba(244,242,236,.74); font-family: Montserrat, sans-serif; font-size: 9.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; transition: border-color 220ms ease, color 220ms ease, background-color 220ms ease; }
          .btn-plan:hover { border-color: rgba(240,217,138,.55); color: #f0d98a; background: rgba(240,217,138,.06); }
          .plan.featured .btn-plan { border-color: rgba(201,168,76,.4); }
          .cta { background: linear-gradient(135deg, #f0d98a, #c9a84c); color: #1a1200; padding: 72px 0; position: relative; overflow: hidden; }
          .cta-decor { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, rgba(255,255,255,.35), transparent 70%); opacity: .5; }
          .cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
          .cta-title { margin: 0 0 10px; font-size: clamp(30px, 3.5vw, 46px); line-height: 1.1; font-weight: 700; }
          .cta-copy { margin: 0; color: rgba(26,18,0,.68); }
          .cta-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 20px; }
          .cta-item { display: flex; gap: 14px; align-items: flex-start; }
          .cta-icon { width: 40px; height: 40px; flex: 0 0 auto; display: grid; place-items: center; border: 1px solid rgba(26,18,0,.16); background: rgba(26,18,0,.08); }
          .cta-name { font-family: Montserrat, sans-serif; font-weight: 800; font-size: 13px; margin-bottom: 2px; }
          .cta-detail { font-size: 12px; color: rgba(26,18,0,.55); }
          .footer {
            background: #080806; border-top: 1px solid transparent;
            border-image: linear-gradient(90deg, transparent, rgba(201,168,76,.28), transparent) 1;
          }
          .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 46px; padding: 60px 0 38px; }
          .footer-brand p { color: #7a7870; font-size: 13px; line-height: 1.6; margin: 16px 0; }
          .powered { font-family: Montserrat, sans-serif; font-size: 9px; letter-spacing: .14em; font-weight: 800; text-transform: uppercase; color: #f0d98a; }
          .socials { display: flex; gap: 10px; margin-top: 18px; }
          .social { width: 34px; height: 34px; border: 1px solid #2a2a22; display: grid; place-items: center; color: #7a7870; text-decoration: none; transition: transform 220ms ease, border-color 220ms ease, color 220ms ease, background-color 220ms ease; }
          .social:hover { border-color: rgba(240,217,138,.5); color: #f0d98a; background: rgba(240,217,138,.08); transform: translateY(-3px); }
          .footer h4 { font-family: Montserrat, sans-serif; font-size: 9.5px; letter-spacing: .2em; font-weight: 800; text-transform: uppercase; margin: 0 0 18px; }
          .footer ul { list-style: none; padding: 0; margin: 0; }
          .footer li { margin: 0 0 11px; }
          .footer a { color: #7a7870; text-decoration: none; font-size: 13px; }
          .bottom { display: flex; justify-content: space-between; gap: 18px; align-items: center; border-top: 1px solid #2a2a22; padding: 22px 0; }
          .legal { display: flex; gap: 24px; flex-wrap: wrap; }
          .bottom p, .legal a { color: #7a7870; font-size: 11px; }
          .wa { position: fixed; right: 28px; bottom: 28px; width: 52px; height: 52px; border-radius: 50%; border: 0; background: #25d366; color: #fff; font-size: 24px; box-shadow: 0 4px 24px rgba(37,211,102,.5); display: flex; align-items: center; justify-content: center; text-decoration: none; z-index: 30; transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease; }
          .wa::before {
            content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1.5px solid rgba(37,211,102,.55);
            animation: waPulse 2.4s cubic-bezier(.16,1,.3,1) infinite;
          }
          .wa:hover { transform: scale(1.08); box-shadow: 0 8px 32px rgba(37,211,102,.65); background: #22c55e; }
          @keyframes waPulse { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(1.5); opacity: 0; } }
          @media (max-width: 1100px) {
            .links { gap: 14px; }
            .hero-grid, .about-grid, .cta-grid { grid-template-columns: 1fr; gap: 42px; }
            .services-grid, .results-grid { grid-template-columns: repeat(2, 1fr); }
            .plans-grid { grid-template-columns: repeat(5, 1fr); }
            .plans-grid-3 { grid-template-columns: repeat(3, 1fr); }
            .plans-grid-2 { grid-template-columns: repeat(2, 1fr); }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
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
            .services-grid, .results-grid, .plans-grid, .plans-grid-3, .plans-grid-2, .stats-grid { grid-template-columns: 1fr; }
            .stats-grid { padding: 34px 0; }
            .stat { border-right: 0; border-bottom: 1px solid #2a2a22; }
            .footer-grid { grid-template-columns: 1fr; }
            .bottom { flex-direction: column; align-items: flex-start; }
            .hero-photo { width: 100%; max-width: 340px; height: 460px; }
          }

          /* ============ ANIMATIONS (page-specific — shared .reveal/.tilt/shine live in globals.css via SiteAnimations) ============ */
          @keyframes velozzaFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes velozzaFadeIn { from { opacity: 0; } to { opacity: 1; } }
          .hero-anim { animation: velozzaFadeUp .9s cubic-bezier(.16,1,.3,1) both; }
          .hero-anim.d1 { animation-delay: .05s; }
          .hero-anim.d2 { animation-delay: .2s; }
          .hero-anim.d3 { animation-delay: .34s; }
          .hero-photo-anim { animation: velozzaFadeIn 1.1s ease .25s both; }

          .button.gold { position: relative; overflow: hidden; }
          .button.gold::before {
            content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent);
            transform: skewX(-20deg); transition: left .7s ease; pointer-events: none;
          }
          .button.gold:hover::before { left: 130%; }

          @keyframes velozzaFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
          .metric-anim { animation: velozzaFadeUp .8s cubic-bezier(.16,1,.3,1) both, velozzaFloat 5s ease-in-out infinite; }
          .metric.one.metric-anim { animation-delay: .55s, 2.1s; }
          .metric.two.metric-anim { animation-delay: .7s, 2.5s; }
          .metric.three.metric-anim { animation-delay: .85s, 2.9s; }

          @keyframes velozzaShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          .accent.text-shimmer {
            background: linear-gradient(90deg, #c9a84c 0%, #fff2c9 22%, #f0d98a 45%, #c9a84c 68%, #f0d98a 100%);
            background-size: 250% 100%;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            animation: velozzaShimmer 6s linear infinite;
          }

          .hero-glow { position: absolute; pointer-events: none; z-index: 0; will-change: transform; }
          .hero-glow.g1 { top: -8%; right: -6%; width: 60%; height: 76%; background: radial-gradient(ellipse 60% 70% at 70% 35%, rgba(201,168,76,.16), transparent 62%); }
          .hero-glow.g2 { bottom: -10%; left: -8%; width: 44%; height: 60%; background: radial-gradient(ellipse 35% 50% at 18% 72%, rgba(201,168,76,.06), transparent 60%); }

          .photo-frame { position: relative; }
          .photo-frame::before {
            content: ''; position: absolute; inset: -14px; border: 1px solid rgba(201,168,76,.26);
            pointer-events: none; z-index: -1; transition: inset 260ms cubic-bezier(.16,1,.3,1), border-color 260ms ease;
          }
          .photo-frame:hover::before { inset: -10px; border-color: rgba(240,217,138,.5); }
          .photo-frame .corner { position: absolute; width: 18px; height: 18px; border: 1.5px solid #f0d98a; opacity: .85; pointer-events: none; z-index: 2; }
          .photo-frame .corner.tl { top: -14px; left: -14px; border-right: 0; border-bottom: 0; }
          .photo-frame .corner.br { bottom: -14px; right: -14px; border-left: 0; border-top: 0; }
          .photo img { transition: transform 700ms cubic-bezier(.16,1,.3,1); }
          .photo:hover img { transform: scale(1.045); }

          .brand-marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
          .brand-list-track { display: flex; gap: 40px; width: max-content; animation: velozzaMarquee 32s linear infinite; }
          .brand-marquee:hover .brand-list-track { animation-play-state: paused; }
          @keyframes velozzaMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .brand-link, .brand-static { font-family: Montserrat, sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
          .brand-link { color: #f0d98a; text-decoration: underline; text-decoration-color: #c9a84c; text-underline-offset: 4px; }
          .brand-static { color: rgba(244,242,236,.48); transition: color 220ms ease, transform 220ms ease; }
          .brand-static:hover, .brand-link:hover { color: #f0d98a; transform: translateY(-2px); }

          .icon { transition: transform 220ms ease; }
          .service:hover .icon { transform: rotate(-8deg) scale(1.12); }

          @media (prefers-reduced-motion: reduce) {
            .hero-anim, .hero-photo-anim, .metric-anim { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
            .button.gold::before { display: none; }
            .accent.text-shimmer { animation: none !important; }
            .photo:hover img { transform: none !important; }
            .brand-list-track { animation: none !important; }
            .wa::before { animation: none !important; display: none; }
          }
        `}</style>

        <header className="nav wrap">
          <Link href="/" className="brand">
            <BrandLogo variant="transparent" style={{ width: 168 }} priority />
          </Link>
          <ul className="links">
            <li><a href="/servicios">Servicios</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/casos-de-exito">Casos de éxito</a></li>
            <li><a href="/industrias">Industrias</a></li>
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/cliente">Cliente</a></li>
            <li><a href="/clientes">Ingresar</a></li>
          </ul>
          <Link href="/contacto" className="button gold">Agenda tu Consulta →</Link>
        </header>

        <section className="hero">
          <div className="hero-glow g1 parallax-layer" data-speed="0.06" />
          <div className="hero-glow g2 parallax-layer" data-speed="0.1" />
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow hero-anim d1">Estrategia, Producción y Tecnología Propia</div>
              <h1 className="hero-anim d1">
                Construimos<br />
                Marcas.<br />
                Generamos<br />
                Demanda.<br />
                <span className="accent text-shimmer">Impulsamos<br />Líderes.</span>
              </h1>
              <p className="hero-copy hero-anim d2">Estrategias de marca personal y marketing digital diseñadas para posicionar tu autoridad, atraer clientes ideales y generar crecimiento medible y sostenible.</p>
              <div className="actions hero-anim d3">
                <Link href="/contacto" className="button gold magnetic">Agenda tu Consulta Gratuita →</Link>
                <Link href="/casos-de-exito" className="button ghost shine-hover"><PremiumIcon name="arrow-right" size={14} /> Ver Casos de Éxito</Link>
              </div>
            </div>

            <div className="photo-stack hero-photo-anim">
              <div className="photo-frame">
                <span className="corner tl" aria-hidden="true" />
                <span className="corner br" aria-hidden="true" />
                <div className="photo hero-photo">
                  <img src="/founder-arms.jpg" alt="David Velozza" />
                  <div className="watermark">VELOZZA<br />CREATIVE</div>
                </div>
              </div>

              <div className="metric one metric-anim">
                <div className="label">Experiencia</div>
                <div className="metric-value" data-count="10" data-prefix="+">+10</div>
                <div className="sub">Años liderando en LatAm</div>
                <div className="bars">{[30, 45, 35, 60, 50, 75, 65, 90, 100].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
              </div>

              <div className="metric two metric-anim">
                <div className="label">Servicios</div>
                <div className="metric-value" data-count="8">8</div>
                <div className="sub">Líneas integrales</div>
                <div className="dots"><span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" /></div>
              </div>

              <div className="metric three metric-anim">
                <div className="label">Cobertura</div>
                <div className="score"><span data-count="100">100</span><small>%</small></div>
                <div className="sub">Digital y Presencial</div>
              </div>
            </div>
          </div>
        </section>

        <div className="arrow"><PremiumIcon name="down" size={24} /></div>

        <section className="brands">
          <div className="wrap">
            <div className="brand-copy">Clientes y aliados que han confiado en nuestro trabajo.</div>
          </div>
          <div className="brand-marquee">
            <div className="brand-list-track">
              {[...brandLogos, ...brandLogos].map((b, i) =>
                b.href ? (
                  <a key={i} href={b.href} target="_blank" rel="noopener noreferrer" className="brand-link">{b.label}</a>
                ) : (
                  <span key={i} className="brand-static">{b.label}</span>
                )
              )}
            </div>
          </div>
        </section>

        <section className="section" id="servicios">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">Nuestros Servicios</div>
              <h2 className="title">Soluciones que generan <span className="accent">resultados reales</span></h2>
              <p className="subtitle">Estrategias integrales, ejecución impecable y tecnología inteligente.</p>
            </div>
            <div className="services-grid">
              {services.map(({ icon, title, copy, slug }, i) => (
                <Link href={slug === 'contacto' ? '/contacto' : `/servicios/${slug}`} className="service-link reveal" style={{ transitionDelay: `${i * 0.08}s` }} key={title}>
                  <article className="service tilt">
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
              { value: 8, prefix: '', suffix: '', label: 'Líneas de Servicio' },
              { value: 10, prefix: '+', suffix: '', label: 'Años de Experiencia' },
              { value: 2, prefix: '', suffix: '', label: 'Mercados: Colombia y Estados Unidos' },
              { value: 100, prefix: '', suffix: '%', label: 'Digital y Presencial' },
            ].map((stat, i) => (
              <div className="stat reveal" style={{ transitionDelay: `${i * 0.08}s` }} key={stat.label}>
                <div className="value" data-count={stat.value} data-prefix={stat.prefix} data-suffix={stat.suffix}>{stat.prefix}{stat.value}{stat.suffix}</div>
                <div className="name">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="resultados">
          <div className="wrap">
            <div className="section-head reveal" style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <div className="eyebrow">Proceso</div>
                <h2 className="title">Así trabajamos<br />con <span className="accent">cada marca</span></h2>
                <p className="subtitle">Un proceso claro, sin improvisación: de la estrategia a la ejecución.</p>
              </div>
              <Link href="/servicios" className="button gold">Ver Nuestros Servicios →</Link>
            </div>
            <div className="results-grid">
              {results.map(([icon, value, label], index) => (
                <article className="result reveal tilt" style={{ transitionDelay: `${index * 0.1}s` }} key={label}>
                  <div className="thumb" style={{ background: index === 1 ? 'linear-gradient(160deg,#1a1e14 0%,#0e0c08 100%)' : index === 2 ? 'linear-gradient(160deg,#1a1214 0%,#0e0c08 100%)' : index === 3 ? 'linear-gradient(160deg,#141a1a 0%,#0e0c08 100%)' : 'linear-gradient(160deg,#1e1c14 0%,#0e0c08 100%)' }}>
                    <div className="step-eyebrow">Paso {value}</div>
                    <div className="play"><PremiumIcon name={icon as any} size={18} /></div>
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

        <section className="section" id="galeria">
          <div className="wrap">
            <div className="section-head reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>Proceso de Trabajo</div>
              <h2 className="title">Detrás de cada <span className="accent">marca</span></h2>
              <p className="subtitle">Sesiones profesionales de grabación y producción de contenido de alto impacto.</p>
            </div>
            <style>{`
              .photo-gallery {
                display: grid;
                align-items: start;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 25px;
                max-width: 1100px;
                margin-left: auto;
                margin-right: auto;
              }
              .photo-gallery-item {
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(201, 168, 76, 0.18);
                box-shadow: 0 20px 56px -18px rgba(0,0,0,.55), 0 8px 24px rgba(0,0,0,.4);
                aspect-ratio: 3 / 4;
                border-radius: 8px;
                transition: transform 220ms cubic-bezier(.16,1,.3,1), box-shadow 220ms cubic-bezier(.16,1,.3,1), border-color 220ms ease;
              }
              .photo-gallery-item:hover {
                transform: translateY(-4px);
                border-color: rgba(240,217,138,.45);
                box-shadow: 0 28px 70px -18px rgba(0,0,0,.7), 0 10px 30px rgba(0,0,0,.5);
              }
              .photo-gallery-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                transition: transform 700ms cubic-bezier(.16,1,.3,1);
              }
              .photo-gallery-item:hover img { transform: scale(1.06); }
              .photo-gallery-item::after {
                content: '';
                position: absolute;
                inset: auto 0 0 0;
                height: 100px;
                background: linear-gradient(to top, rgba(12,12,10,.96), transparent);
                pointer-events: none;
              }
              @media (min-width: 760px) {
                .photo-gallery-item.offset { margin-top: 40px; }
              }
            `}</style>
            <div className="photo-gallery">
              {[
                { src: '/photoshoot-1.jpg', alt: 'Sesión de grabación profesional - Equipo técnico' },
                { src: '/photoshoot-2.jpg', alt: 'Equipo de producción en acción' },
                { src: '/photoshoot-3.jpg', alt: 'Trabajo colaborativo de grabación' },
              ].map((photo, idx) => (
                <div key={idx} className={`photo-gallery-item tilt reveal${idx === 1 ? ' offset' : ''}`} style={{ transitionDelay: `${idx * 0.12}s` }}>
                  <img src={photo.src} alt={photo.alt} />
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="about" id="nosotros">
          <div className="wrap section about-grid">
            <div className="photo about-photo reveal">
              <img src="/founder-fulllength.jpg" alt="David Velozza" />
              <div className="watermark">David Velozza</div>
            </div>
            <div className="reveal" style={{ transitionDelay: '.15s' }}>
              <div className="eyebrow">Fundador &amp; CEO · Velozza Creative Works</div>
              <h2 className="about-title">Liderazgo.<br />Visión.<br />Ejecución.</h2>
              <p className="about-copy">Con más de 10 años de experiencia, David Velozza y su equipo ayudan a líderes y marcas a transformar su presencia y multiplicar su impacto.</p>
              <ul className="about-list">
                <li><PremiumIcon name="check" size={16} />Estratega de Marcas Personales</li>
                <li><PremiumIcon name="check" size={16} />Especialista en Producción de Contenido para Marcas Personales</li>
                <li><PremiumIcon name="check" size={16} />Fotografía y Producción Audiovisual Especializada</li>
                <li><PremiumIcon name="check" size={16} />Empresario &amp; Visionario</li>
              </ul>
              <Link href="/contacto" className="button ghost shine-hover">Más sobre David →</Link>
            </div>
          </div>
        </section>

        <section className="section" id="planes">
          <div className="wrap">
            <div className="section-head reveal" style={{ textAlign: 'center' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>Planes</div>
              <h2 className="title">Elige el plan que impulsa tu crecimiento</h2>
              <p className="subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Soluciones flexibles diseñadas para cada etapa de tu marca.</p>
            </div>

            {/* Planes Mensuales */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h3 style={{ color: '#f4f2ec', fontSize: '18px', marginBottom: '50px', textAlign: 'center', fontFamily: 'Cormorant Garamond', letterSpacing: '.05em', textTransform: 'uppercase' }}>Planes de Membresía Mensual</h3>
            </div>
            <div className="plans-grid">
              {plans.map(([name, copy, price, features], index) => (
                <article className={`plan tilt ${index === 2 ? 'featured' : ''}`} key={`${name}-${index}`}>
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
                  <Link href="/contacto" className="btn-plan shine-hover">{name === 'Elite' ? 'Hablar con un Asesor' : 'Ver Plan'}</Link>
                </article>
              ))}
            </div>

            {/* Paquetes por Sesión */}
            <div style={{ marginTop: '80px', marginBottom: '40px', textAlign: 'center' }}>
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.35), transparent)', marginBottom: '60px' }} />
              <h3 style={{ color: '#f4f2ec', fontSize: '18px', marginBottom: '50px', textAlign: 'center', fontFamily: 'Cormorant Garamond', letterSpacing: '.05em', textTransform: 'uppercase' }}>Paquetes de Producción & Redes</h3>
            </div>
            <div className="plans-grid plans-grid-3">
              <article className="plan tilt">
                <h3 className="plan-title">Pack Básico</h3>
                <p>Marca Personal · 1 día de grabación</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $660.000</span></div>
                <div className="period">por sesión</div>
                <ul className="features">
                  <li>6 videos para redes sociales (máx. 1:30 min c/u)</li>
                  <li>Máximo 7 planos de apoyo por video</li>
                  <li>10 fotos con edición premium</li>
                  <li>Asesoría profesional de guiones</li>
                  <li>Edición con subtítulos y colorización básica</li>
                  <li>Subtítulos español e inglés</li>
                  <li>Múltiples formatos (4K, HD, vertical)</li>
                </ul>
                <Link href="/contacto" className="btn-plan shine-hover">Ver Pack</Link>
              </article>
              <article className="plan featured tilt">
                <div className="badge">Recomendado</div>
                <h3 className="plan-title">Pack Premium</h3>
                <p>Marca Personal · 1 día de grabación</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $880.000</span></div>
                <div className="period">por sesión</div>
                <ul className="features">
                  <li>9 videos para redes sociales (máx. 1:30 min c/u)</li>
                  <li>Máximo 7 planos de apoyo por video</li>
                  <li>16 fotos con edición premium</li>
                  <li>Asesoría profesional de guiones</li>
                  <li>Edición con subtítulos y colorización básica</li>
                  <li>Subtítulos español e inglés</li>
                  <li>Múltiples formatos (4K, HD, vertical)</li>
                  <li>2 sesiones de coaching on-camera</li>
                </ul>
                <Link href="/contacto" className="btn-plan shine-hover">Ver Pack</Link>
              </article>
              <article className="plan tilt">
                <h3 className="plan-title">Redes Sociales</h3>
                <p>Gestión orgánica mensual de contenido</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $880.000</span></div>
                <div className="period">/mes · pago anticipado</div>
                <ul className="features">
                  <li>6 videos cortos editados</li>
                  <li>4 carruseles estratégicos</li>
                  <li>4 piezas gráficas diseñadas</li>
                  <li>Asesoría semanal de redes</li>
                  <li>Análisis mensual de desempeño</li>
                  <li>100% contenido orgánico</li>
                  <li>Calendario de publicación</li>
                </ul>
                <Link href="/contacto" className="btn-plan shine-hover">Ver Plan</Link>
              </article>
            </div>

            {/* Paquetes de Bodas & Eventos Sociales */}
            <div style={{ marginTop: '80px', marginBottom: '48px', textAlign: 'center' }}>
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.35), transparent)', marginBottom: '60px' }} />
              <h3 style={{ color: '#f4f2ec', fontSize: '18px', marginBottom: '16px', textAlign: 'center', fontFamily: 'Cormorant Garamond', letterSpacing: '.05em', textTransform: 'uppercase' }}>Bodas & Eventos Sociales</h3>
              <p style={{ color: '#7a7870', fontSize: '13px', maxWidth: '560px', margin: '0 auto' }}>Dos colecciones de cobertura fotográfica editorial, cada una diseñada para un momento distinto de tu vida social.</p>
            </div>

            {/* Sub-sección: Eventos Sociales */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <div className="eyebrow" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '10px' }}>Colección Social</div>
              <h4 style={{ color: '#f4f2ec', fontSize: '15px', fontWeight: 600, marginBottom: '10px' }}>Eventos Sociales</h4>
              <p style={{ color: '#7a7870', fontSize: '12.5px', maxWidth: '460px', margin: '0 auto' }}>Sesiones editoriales para quinceañeras, cumpleaños y celebraciones que merecen dirección visual propia.</p>
            </div>
            <div className="plans-grid plans-grid-2" style={{ marginBottom: '64px' }}>
              <article className="plan tilt">
                <h3 className="plan-title">Editorial Signature</h3>
                <p>Quinceañeras, cumpleaños y retratos pre-evento</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $450.000</span></div>
                <div className="period">por sesión</div>
                <ul className="features">
                  <li>Experiencia de modelaje pre-evento</li>
                  <li>30 fotografías high-res</li>
                  <li>Revelado de autor con color grading</li>
                  <li>Entrega en formato digital</li>
                </ul>
                <Link href="/servicios/bodas" className="btn-plan shine-hover">Ver Pack</Link>
              </article>
              <article className="plan featured tilt">
                <div className="badge">Más solicitado</div>
                <h3 className="plan-title">Social Prestige</h3>
                <p>15 años, cumpleaños y celebraciones sociales</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $600.000</span></div>
                <div className="period">por sesión</div>
                <ul className="features">
                  <li>Documentación del evento</li>
                  <li>Selección curada de 100 a 120 fotos</li>
                  <li>Narrativa documental</li>
                  <li>Entrega en formato digital</li>
                </ul>
                <Link href="/servicios/bodas" className="btn-plan shine-hover">Ver Pack</Link>
              </article>
            </div>

            {/* Sub-sección: Bodas */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <div className="eyebrow" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '10px' }}>Colección Bodas 2026</div>
              <h4 style={{ color: '#f4f2ec', fontSize: '15px', fontWeight: 600, marginBottom: '10px' }}>Bodas</h4>
              <p style={{ color: '#7a7870', fontSize: '12.5px', maxWidth: '480px', margin: '0 auto' }}>Una progresión clara, del tarifario 2026: cobertura esencial, historia completa y experiencia editorial total.</p>
            </div>
            <div className="plans-grid plans-grid-3">
              <article className="plan tilt">
                <h3 className="plan-title">Esencia Ceremonial</h3>
                <p>Bodas · Cobertura esencial</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $850.000</span></div>
                <div className="period">por evento</div>
                <ul className="features">
                  <li>Ceremonia y recepción</li>
                  <li>120 a 150 fotos narrativas</li>
                  <li>Revelado de autor</li>
                  <li>Entrega 100% digital</li>
                </ul>
                <Link href="/servicios/bodas" className="btn-plan shine-hover">Ver Pack</Link>
              </article>
              <article className="plan featured tilt">
                <div className="badge">Recomendado</div>
                <h3 className="plan-title">Crónica de Autor</h3>
                <p>Bodas · Historia completa</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $1.000.000</span></div>
                <div className="period">por evento</div>
                <ul className="features">
                  <li>Preparativos y ceremonia</li>
                  <li>Recepción y fiesta</li>
                  <li>150 a 170 fotos narrativas</li>
                  <li>Énfasis en detalles</li>
                  <li>Entrega 100% digital</li>
                </ul>
                <Link href="/servicios/bodas" className="btn-plan shine-hover">Ver Pack</Link>
              </article>
              <article className="plan tilt">
                <h3 className="plan-title">Firma Velozza</h3>
                <p>Bodas · Experiencia editorial total</p>
                <div style={{ fontSize: 9.5, color: '#7a7870' }}>Inversión</div>
                <div className="price"><span>COP $1.200.000</span></div>
                <div className="period">por evento</div>
                <ul className="features">
                  <li>Sesión pre-boda antes del evento</li>
                  <li>Cobertura de preparativos y ceremonia</li>
                  <li>Entrega de 170 a 220 fotos digitales</li>
                  <li>Revelado premium y entrega digital</li>
                </ul>
                <Link href="/servicios/bodas" className="btn-plan shine-hover">Ver Pack</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-decor parallax-layer" data-speed="0.05" style={{ width: 320, height: 320, top: -140, right: '8%' }} />
          <div className="cta-decor parallax-layer" data-speed="0.08" style={{ width: 200, height: 200, bottom: -100, left: '4%' }} />
          <div className="wrap cta-grid reveal">
            <div>
              <h2 className="cta-title">Hablemos de tu visión y construyamos tu próximo nivel.</h2>
              <p className="cta-copy">Una estrategia personalizada puede cambiar el rumbo de tu marca.</p>
              <Link href="/contacto" className="button ghost magnetic" style={{ marginTop: 28, borderColor: 'rgba(26,18,0,.2)', color: '#1a1200' }}>Agendar Ahora →</Link>
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
                <BrandLogo variant="transparent" style={{ width: 180 }} priority />
              </Link>
              <p>Construimos marcas que lideran y generan resultados.</p>
              <div className="powered">Estrategia · Producción · Tecnología</div>
              <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                <a href="tel:+573053090273" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>+57 305 309 0273</a>
                <a href="mailto:ceo@velozzacws.com" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>ceo@velozzacws.com</a>
                <a href="https://instagram.com/velozzacws" style={{ color: '#f0d98a', textDecoration: 'none', fontWeight: 700 }}>@velozzacws</a>
              </div>
              <div className="socials">
                <a className="social" href="https://api.whatsapp.com/send?phone=573053090273&text=Hola%20Velozza%2C%20quiero%20iniciar%20una%20consultor%C3%ADa%20gratuita." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><PremiumIcon name="chat" size={16} /></a>
                <a className="social" href="https://instagram.com/velozzacws" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><PremiumIcon name="instagram" size={16} /></a>
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
              <ul><li><Link href="/#nosotros">Nosotros</Link></li><li><Link href="/contacto">Contacto</Link></li><li><Link href="/clientes">Acceder</Link></li></ul>
            </div>
          </div>
          <div className="wrap bottom">
            <p>© 2026 Velozza Creative Works™. Todos los derechos reservados.</p>
            <div className="legal"><Link href="/contacto">Política de Privacidad</Link><Link href="/contacto">Términos de Servicio</Link><Link href="/contacto">Aviso Legal</Link></div>
          </div>
        </footer>

        <a href="https://api.whatsapp.com/send?phone=573053090273&text=Hola%20Velozza%2C%20quiero%20iniciar%20una%20consultor%C3%ADa%20gratuita." target="_blank" rel="noopener noreferrer" className="wa" aria-label="WhatsApp"><PremiumIcon name="chat" size={22} /></a>
      </main>
    </>
  );
}
