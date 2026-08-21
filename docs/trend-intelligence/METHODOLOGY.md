# Velozza Trend Intelligence — Metodología

Este documento es la fuente de verdad autocontenida para el agente recurrente de
inteligencia de tendencias de Velozza Creative Works. Se ejecuta cada 2 días y
produce un reporte por cliente con qué publicar, por qué, y cuándo — basado en
investigación real (no genérica) del gremio de cada cliente.

## Por qué existe esto

Las visualizaciones del contenido de los clientes han caído. La respuesta no es
publicar más de lo mismo — es investigar qué está cambiando en cada gremio
específico y adaptar el contenido con evidencia real, citada, no intuición.

## Diagnóstico base (2026) — por qué cae el alcance orgánico, en toda la industria

- Instagram: alcance orgánico ~5–7.6% por publicación, cayó ~12% interanual. Alcance
  promedio de Reels cayó >30%. ([AutoFaceless](https://autofaceless.ai/blog/social-media-algorithm-statistics-2026), [Addictive Digital](https://addictivedigital.co.uk/the-decline-of-organic-reach-on-social-media/))
- TikTok: reproducciones cayeron ~17% interanual en algunos mercados, pero el
  engagement rate subió 49% interanual (3.70%) — alcance y engagement se están
  desacoplando. ([Deep Marketing](https://www.deepmarketing.it/en/blog/organic-reach-is-dead-real-numbers-2026), [Visual Publinet](https://visualpublinet.com/tendencias-redes-sociales-2026-instagram-tiktok/))
- Causas raíz: saturación de contenido, monetización deliberada de las plataformas
  (el espacio orgánico se cede a inventario publicitario), y el paso de distribución
  por grafo social a descubrimiento por IA — a quién sigues importa menos, qué
  publicas y cómo reacciona la gente en la primera hora importa más. ([Hootsuite](https://blog.hootsuite.com/organic-reach-declining/), [Blackbird Digital](https://www.blackbird-digital.com/insights/5-social-media-algorithm-changes-organic-reach/))
- TikTok mide "rewatch value": contenido con alta finalización pero bajo rewatch
  recibe ~67% menos distribución que contenido que la gente vuelve a ver. Los
  algoritmos priorizan tasa de finalización, rewatch, retención con sonido, y
  velocidad de comentarios en la primera hora. ([AutoFaceless](https://autofaceless.ai/blog/social-media-algorithm-statistics-2026))
- Lo que se castiga es el video genérico, repetitivo y sin identidad — no el video
  en sí. ([Flownexion](https://flownexion.com/tendencias-contenido-visual-redes-sociales-2026/))

## Qué funciona ahora

- **Carruseles**: 2–4x la tasa de guardado de los Reels, más impresiones y tiempo de
  atención en IG y LinkedIn. Encaja directo con la doctrina de carrusel de Velozza
  (situación→revelación→resolución en 4 slides). ([Content Society](https://contentsociety.co/blog/tendencias-instagram-2026))
- **Autenticidad sobre pulido de producción**: la audiencia detecta contenido con
  cara de IA o plantilla genérica y se desengancha. ([Flownexion](https://flownexion.com/tendencias-contenido-visual-redes-sociales-2026/))
- **>80% del video se ve sin sonido en la primera vista**: sin subtítulos quemados
  se pierde esa audiencia en los primeros 2 segundos. ([Tangram Publicidad](https://www.tangrampublicidad.es/blog/tendencias-de-contenido-para-redes-sociales-en-2026/))
- **Las redes ya funcionan como buscador**: el contenido debe estar pensado para
  aparecer cuando alguien busca un servicio o una pregunta, no solo para el scroll. ([Outcomm](https://outcomm.es/tendencias-redes-sociales-2026/))

## Horarios base (punto de partida — se refina por cliente si hay datos reales)

| Plataforma | Mejores ventanas | Frecuencia |
|---|---|---|
| Instagram Feed/Reels | 6–9am, 2pm, 8pm · Reels: mié 10–11am y dom 7pm | 4–5 posts/semana cada uno |
| TikTok | 6–8pm ideal · mar–jue 7–9pm · vie–sáb noche | El volumen importa más que en cualquier otra red |
| Facebook | Mar y jue 9am, o 1–3pm | 3–4 posts/semana |
| YouTube (Shorts) | Mismas ventanas que TikTok/Reels; long-form mejor tarde/noche | 1–2 long-form + Shorts del mismo shoot |

Fuentes: [Metricool](https://metricool.com/best-time-to-post-social-networks/), [SocialEcho](https://www.socialecho.net/es/blog/docs/Mejor-horario-para-publicar-en-redes-sociales-gu-a-de-datos-por-plataforma-2026), [Sprout Social](https://sproutsocial.com/insights/best-times-to-post-on-social-media/).

## El proceso, por cliente, cada ciclo

1. Gremio preciso (no genérico) — usar el roster de abajo.
2. Buscar tendencias reales y actuales del gremio específico (WebSearch), con link
   de fuente para cada afirmación. Nunca declarar una tendencia sin fuente.
3. Filtrar por el brief real del cliente (identity/pillar/architecture/canales) —
   una tendencia solo entra al reporte si puede llevar la voz real de ese cliente.
4. Mapear 3–5 piezas concretas: formato + ángulo situacional (doctrina
   Situación→Revelación→Resolución) + por qué (mecánica real, no "esto genera
   engagement") + cuándo (día/hora/canal).
5. Señalar qué dejar de hacer si el patrón repetitivo detectado coincide con lo
   que este cliente ya viene publicando.
6. **Antes de escribir el reporte de hoy, leer el reporte anterior de este mismo
   cliente** (carpeta `reportes-tendencias/`, la fecha más reciente antes de hoy)
   si existe, para dar continuidad — no contradecir sin explicar, no repetir lo
   mismo dos ciclos seguidos sin decir por qué sigue vigente.

## Template del reporte (uno por cliente, por ciclo)

```markdown
# [Cliente] — Reporte de Tendencias · [Fecha]
**Gremio:** [preciso] · **Pilar activo:** [de su brief] · **Canales:** FB/IG/TikTok/YouTube

## Diagnóstico
[Por qué pudo bajar el alcance — mecánica real + cualquier patrón específico de
este cliente. Si no hay datos de desempeño reales de este cliente, decirlo
explícitamente, no inventar cifras.]

## Continuidad con el reporte anterior
[Qué se recomendó hace 2 días, si aplica, y si sigue vigente o cambió algo]

## Tendencias del gremio esta semana
1. [Tendencia] — fuente: [link]

## Qué publicar (3-5 piezas concretas)
- [Formato] · [Ángulo situacional] · Por qué: [mecánica específica] · Cuándo: [día/hora/canal]

## Qué dejar de hacer
[Si aplica]
```

## Dónde guardar los reportes

`reportes-tendencias/YYYY-MM-DD/[slug-cliente].md` en este mismo repositorio, más
un `reportes-tendencias/YYYY-MM-DD/00-resumen.md` que indexe todos los clientes
del ciclo. Hacer commit y push al terminar cada ciclo — es lo que le da
continuidad al siguiente ciclo (2 días después) y lo que le permite a David
revisar el historial completo en GitHub.

## Roster real de clientes (verificar contra el CRM si hay acceso; si no, usar esto)

1. **Camila Restrepo — La Parrilla Verde** · Gremio: restaurante/gastronomía
   (cocina saludable, mercado colombiano) · Canales: FB/IG/TikTok/YouTube
2. **DICOLSEG LTDA** · Gremio: tecnología de seguridad y sistemas de control (B2B,
   Colombia) · Identity: "El Titán Corporativo" · Pillar: EL HACER · Trigger:
   Autoridad y Certeza · Objetivo: leads B2B calificados + contratos de
   mantenimiento largo plazo · Canales: FB/IG/TikTok/YouTube
3. **Jose Avila — Avila Internacional** · Gremio: mentoría de negocios high-ticket
   y liderazgo ejecutivo (LatAm) · Identity: "El Arquitecto del Legado" · Pillar:
   Integración Total · Trigger: Pertenencia, Aspiracional y Controversia ·
   Objetivo: apertura de mentorías High-Ticket (academia Avila Sales 365 + AI) ·
   Canales: FB/IG/TikTok/YouTube · Nota: ya existe una estrategia de contenido
   hasta diciembre 2026 — este reporte complementa, no contradice.
4. **Dra. Adriana Ortega** · Gremio: medicina alternativa, funcional e integral
   (Colombia) · Identity: "La Ciencia del Origen" · Pillar: EL SER · Trigger:
   Resolución y Novedad · Objetivo: consultas privadas de alto valor +
   posicionamiento científico · Canales: FB/IG/TikTok/YouTube
5. **Lucy Moreno** · Gremio: coaching de marca personal, nicho femenino (LatAm) ·
   Identity: "La Estratega del Bienestar" · Pillar: EL HACER y EL SER · Trigger:
   Empoderamiento y Exclusividad · Objetivo: conversión a programas grupales +
   consultoría 1:1 High-Ticket · Canales: FB/IG/TikTok/YouTube
6. **Eva Rosa Zamora — Star Light Garden and Farm** · Gremio: fundación /
   organización sin fines de lucro, neurodiversidad e inclusión (Colombia) ·
   Identity: "La Arquitecta de la Consciencia" · Pillar: EL TENER · Trigger:
   Empatía Estructurada y Trascendencia · Objetivo: captación de fondos, padrinos
   corporativos, voluntarios · Canales: FB/IG/TikTok/YouTube
7. **Dr. Juan Marulanda** · Gremio: práctica médica y soluciones clínicas /
   medicina integrativa (rejuvenecimiento, vitamina C IV, azul de metileno,
   células madre) · Identity: "El Criterio Clínico" · Pillar: EL SER · Trigger:
   Autoridad Científica y Seguridad · Objetivo: más pacientes nuevos + retención
   en tratamientos prolongados · Canales: FB/IG/TikTok/YouTube · Nota: ya existe
   un calendario de contenido (ago-sep 2026) — este reporte complementa.
8. **Fiesta Auto Insurance** · Gremio: seguros de auto, mercado latino/hispano en
   Florida, EE.UU. · Identity: "La Máquina de Conversión" · Pillar: EL HACER ·
   Trigger: Urgencia y Evitación del Dolor · Objetivo: adquisición masiva de
   pólizas, bajar CPA, dominio local · Canales: FB/IG/TikTok/YouTube
9. **Seguros Diterich** · Gremio: seguros corporativos/patrimoniales, empresa
   colombiana · Identity: "El Escudo Patrimonial" · Pillar: EL HACER y EL TENER ·
   Trigger: Certeza, Previsión y Trascendencia · Objetivo: posicionamiento premium
   + captación de carteras corporativas · Canales: FB/IG/TikTok/YouTube

## Doctrina de producción (aplica a toda idea, sin excepción)

**Situación → Revelación → Resolución**: cada pieza abre con un momento
hiper-específico y reconocible (nunca una lista tipo "3 cosas sobre X", nunca un
dato aislado), revela un insight que la audiencia no tenía, y cierra mostrando
cómo el pilar/oferta del cliente resuelve la causa raíz. Variedad de ganchos
obligatoria — nunca repetir el mismo tipo de apertura entre piezas de un mismo
reporte. Tono en 2da persona, directo. Una tendencia es un mecanismo de gancho,
nunca un reemplazo de esta doctrina ni de la voz real de marca del cliente.

## Errores comunes a evitar

- Citar una "tendencia" sin fuente/link.
- Repetir los mismos 3 tips genéricos para todos los clientes sin importar el
  gremio — todo el punto de este sistema es investigación específica por gremio.
- Recomendar un formato/tono que contradiga el trigger real del cliente solo
  porque está de moda en otro lado.
- Inventar cifras de caída de visualizaciones específicas de un cliente sin datos
  reales — decir explícitamente que no hay datos de desempeño disponibles.
