// ============================================================================
//  courses-catalog.js — Mini Cursos Velozza: contenido fijo, compartido por
//  todos los clientes (no es contenido editable por cliente, es un recurso
//  de formación que la agencia construyó una vez). Lo único dinámico por
//  cliente es el progreso (qué lecciones marcó como completadas) — eso vive
//  en db.json, no aquí. Igual que brand-profiles.js: módulo de solo lectura.
//
//  Cada lección usa el mismo formato "markdown-lite" que ya renderiza
//  MarkdownLite en agency.html/index.html (Tendencias) — encabezados ##,
//  negrita **, listas -, links [texto](url) — para reusar ese componente
//  sin escribir un segundo parser.
// ============================================================================

export const COURSES_CATALOG = [
  {
    id: "hablar-camara",
    categoria: "PRESENCIA EN CÁMARA",
    title: "Hablar frente a cámara",
    subtitle: "Grábate con seguridad, sin sonar a comercial",
    icon: "video",
    resumen: "Lo que separa a alguien que \"se ve incómodo grabando\" de alguien que conecta en cámara no es carisma innato — son 5 hábitos concretos y entrenables.",
    lecciones: [
      {
        id: "l1", titulo: "El primer segundo decide todo", minutos: 6,
        cuerpo: `## Por qué el primer segundo pesa más que los otros 29
En redes, nadie te debe atención — la tienes que ganar en el primer segundo o la pierdes. La mayoría de la gente arranca su video con "Hola, soy [nombre] y hoy quiero hablarles de..." — eso es exactamente lo que el cerebro de tu audiencia usa para decidir seguir scrolleando.

## La regla
Nunca abras con tu nombre, tu cargo, ni un saludo genérico. Abre con la situación, la pregunta, o la afirmación que tu audiencia ya se está preguntando en su cabeza en ese momento.

- Mal: "Hola, soy la Dra. Ortega y hoy les voy a hablar de la inflamación crónica."
- Bien: "Si te despiertas cansado aunque duermas 8 horas, esto te va a interesar."

## El error que parece un gancho pero no lo es
Muchas personas ya saben que "no debo abrir con mi nombre" y resuelven el problema abriendo con una pregunta genérica tipo "¿Sabías que...?" o "¿Te ha pasado que...?". El problema es que una pregunta genérica cae en el mismo pozo que un saludo: no le da al cerebro nada específico que reconocer. Una pregunta solo funciona como gancho si la persona podría responder "sí, exactamente eso" en menos de un segundo — no "tal vez, depende".

## Los 4 tipos de gancho que sí funcionan
- Situación reconocible: "Si te despiertas cansado aunque duermas 8 horas..."
- Contraste con una creencia común: "Todo el mundo cree que X, pero en realidad..."
- Cifra o dato concreto: "El 80% de las personas que grabo cometen este mismo error."
- Consecuencia directa: "Esto te está costando clientes y ni siquiera lo sabes."

Cualquiera de estos cuatro funciona mejor que una pregunta abierta, porque todos apuntan a algo específico, no a una categoría general.

## Cómo saber si tu gancho es suficientemente específico
Antes de grabar, hazte esta prueba: si le dijeras esa misma frase a 10 personas de tu audiencia, ¿al menos 7 asentirían de inmediato reconociéndose en ella? Si la respuesta es "depende de la persona", el gancho todavía es muy genérico — hay que aterrizarlo más en algo concreto que tu audiencia viva.

## Cómo adaptar esto a distintos formatos
En un Reel o TikTok tienes literalmente un segundo antes de que el algoritmo decida si le muestra tu video a más gente — ahí el gancho debe ser inmediato, sin ninguna introducción visual previa (ni logo, ni intro animada). En un video más largo (YouTube, webinar grabado) tienes un poco más de margen, pero la regla no cambia: los primeros 5-8 segundos siguen decidiendo si alguien se queda, solo que el "primer segundo" se estira ligeramente. No confundas más tiempo de formato con permiso para abrir más lento.

## Ejercicio
Toma tu último video grabado. Lee en voz alta las primeras 2 frases. Si suena a presentación, reescríbelas como una situación que tu audiencia reconoce en sí misma, y clasifícala en uno de los 4 tipos de gancho de arriba antes de volver a grabar.`,
        accionables: ["Elimina \"hola, soy [nombre]\" de tu apertura","Escribe 3 ganchos distintos antes de grabar y elige el más específico","Aplica la prueba de \"seguirían 7 de 10\" a tu gancho antes de grabar","Clasifica tu gancho en uno de los 4 tipos (situación, contraste, cifra, consecuencia)","Graba la apertura sola, en loop, hasta que salga natural sin leer"],
      },
      {
        id: "l2", titulo: "Mirar al lente, no a la pantalla", minutos: 5,
        cuerpo: `## El error que rompe la conexión
Cuando grabas con el celular, es instintivo mirar tu propia cara en la pantalla en vez del lente de la cámara. El resultado se ve, aunque no sepas nombrarlo: la audiencia siente que le estás hablando "de lado", nunca directo a los ojos.

## La corrección
Pon un punto pequeño de cinta o un sticker justo al lado del lente (no sobre la pantalla) y entrena la mirada hacia ahí. Al principio se siente forzado — a las pocas tomas se vuelve automático. Mientras más cerca grabes el celular de tu cara, mayor es el desfase entre pantalla y lente, así que necesitas ser más deliberado con la posición exacta de la marca.

## Por qué el ojo humano detecta esto aunque no sepa explicarlo
El cerebro humano tiene una capacidad especializada para detectar hacia dónde mira otra persona — es una habilidad ligada a la supervivencia, saber si alguien te está prestando atención o no. Por eso, aunque tu audiencia no pueda explicar técnicamente qué está mal, sí percibe con precisión cuando la mirada está desviada apenas unos centímetros del lente.

## El error opuesto: la mirada fija que incomoda
Corregir el error de mirar a la pantalla no significa clavar los ojos en el lente sin parpadear ni moverse. Una mirada humana real parpadea, se relaja un instante entre frases, y vuelve — igual que en una conversación cara a cara. Fijar la mirada de forma antinatural genera el mismo tipo de incomodidad que mirar de lado, solo que por una razón distinta.

## Ajustar la técnica según tu setup
Si grabas con el celular muy cerca de tu cara, el desfase entre pantalla y lente es proporcionalmente mayor — necesitas ser más deliberado con la marca. Si grabas con una cámara en trípode a distancia, el desfase es menor y el ojo humano lo perdona más fácilmente. En ambos casos la marca junto al lente es la solución, pero cuánto tienes que "forzarlo" al principio cambia según la distancia real de grabación.

## Qué hacer si lees de un teleprompter o notas en pantalla
Si usas teleprompter, el texto suele estar justo debajo o al lado del lente — en teoría resuelve el problema porque tus ojos ya están cerca de la cámara. El riesgo aquí es distinto: leer con los ojos moviéndose de izquierda a derecha se nota en cámara como un microtemblor de la mirada. La solución sigue la misma lógica de fondo: practica la frase antes de que ruede la cámara para poder decirla mirando fijo al lente, en vez de perseguir el texto línea por línea.

## Ejercicio
Pon una marca física junto al lente antes de grabar. Graba 15 segundos mirando solo esa marca, parpadeando y relajando la mirada con naturalidad entre frases. Revisa el resultado en pantalla completa: ¿se siente como si te hablara directo a ti, sin sonar forzado ni ausente?`,
        accionables: ["Pon una marca física junto al lente antes de grabar","Ajusta la posición de la marca según qué tan cerca grabas del lente","Parpadea y relaja la mirada entre frases, no la fijes sin moverte","Graba 15 segundos mirando solo esa marca","Revisa el resultado: ¿se siente como si te hablara a ti directamente?"],
      },
      {
        id: "l3", titulo: "Habla más lento de lo que se siente natural", minutos: 5,
        cuerpo: `## Por qué te sientes lento pero se ve normal
Cuando grabas con nervios, el ritmo natural se acelera sin que lo notes — es una reacción física del cuerpo bajo adrenalina, no falta de preparación. El problema es que lo que a ti te suena "ya muy lento" en el momento de grabar, en el video final se ve completamente normal, porque tu percepción interna del tiempo está acelerada por esa misma adrenalina.

## La técnica
Después de cada idea completa, deja un silencio de medio segundo antes de seguir. Ese silencio no se siente como un error en el video — se siente como alguien que piensa antes de hablar, que es exactamente la señal de autoridad que quieres dar.

## Dónde meter las pausas
- Después del gancho inicial (antes de explicar por qué importa)
- Antes de la idea más importante del video (crea expectativa)
- Al cerrar, antes del llamado a la acción

## El error opuesto: llenar la pausa con sonido
Cuando alguien identifica que necesita pausar más, el error común es reemplazar el silencio por un sonido de transición ("eh", "entonces", "bueno") en vez de un silencio real. Eso no es una pausa — es una muletilla con otro disfraz. La pausa solo funciona si es silencio puro; el sonido de relleno reintroduce exactamente el problema que estabas tratando de resolver.

## Cómo saber si tu pausa se sintió forzada
Una pausa bien puesta no rompe el ritmo de la idea — separa dos ideas distintas. Si al escuchar de vuelta la pausa se siente como una interrupción en medio de una sola idea, está mal ubicada; muévela al punto donde termina una idea y empieza la siguiente, no a la mitad de una frase. Una señal clara de que la pausa está bien puesta: si la quitas y unes las dos frases, deberían sonar como dos ideas distintas pegadas de golpe, no como una sola frase partida a la mitad sin razón.

## Qué pasa si editas después
Si vas a editar el video y cortar silencios "muertos" automáticamente con software, ten cuidado: muchos editores de corte automático eliminan exactamente las pausas intencionales que le dan autoridad a tu discurso, dejando un ritmo acelerado y sin respiro. Si usas corte automático de silencios, ajusta el umbral para que no borre pausas de menos de un segundo, o revisa manualmente antes de publicar.

## Ejercicio de calibración
Graba la misma frase tres veces: sin pausas, con una pausa exagerada, y con una pausa intermedia. Escucha las tres seguidas. La mayoría de la gente, al comparar objetivamente, elige la versión con pausa intermedia o incluso la exagerada — porque lo que se siente "raro" al grabar casi nunca es lo que se ve raro al reproducir.`,
        accionables: ["Marca en tu guion dónde van las 2-3 pausas intencionales","Reemplaza cualquier sonido de relleno (eh, entonces) por silencio real","Ubica cada pausa al final de una idea completa, nunca a la mitad de una frase","Graba una toma exagerando la lentitud — casi siempre se ve mejor de lo que se siente","Compara dos tomas del mismo guion, una rápida y una con pausas, y elige objetivamente"],
      },
      {
        id: "l4", titulo: "Qué hacer con las manos y el cuerpo", minutos: 5,
        cuerpo: `## El problema no son las manos, es la rigidez
La mayoría de la incomodidad en cámara no viene de qué hacer con las manos — viene de congelar todo el cuerpo por miedo a "hacer algo raro". Un cuerpo completamente inmóvil se ve más incómodo que uno que se mueve un poco de más.

## La regla simple
Deja que las manos acompañen lo que estás diciendo, igual que lo harías explicándole algo a un amigo. Si estás contando algo importante, un gesto natural refuerza el punto. Si no sabes qué hacer, sostener algo (un marcador, una libreta) le da a las manos un lugar natural donde estar.

## Lo que sí evitar
- Cruzar los brazos (cierra la energía)
- Tocarte la cara o el cabello repetidamente (distrae y se lee como nervios)
- Mecerte de un lado a otro sin parar

## Por qué la inmovilidad total se lee peor que el exceso de movimiento
Un cuerpo completamente quieto activa la misma señal visual que el cerebro asocia con nerviosismo contenido — piensa en cómo se ve alguien "congelado" en una entrevista de trabajo. Un poco de movimiento natural (peso que cambia de pie a pie, cabeza que se inclina levemente) es justamente lo que hace que una persona se vea presente y relajada, no rígida.

## El gesto que nace del contenido, no el gesto ensayado
La diferencia entre un gesto que se ve natural y uno que se ve actuado no es la coreografía — es el origen. Un gesto natural nace de lo que estás diciendo en ese momento (abres las manos al decir "todo esto se conecta", cuentas con los dedos al decir "primero... segundo..."). Un gesto ensayado se nota porque llega desconectado de la palabra que lo acompaña. No memorices gestos — deja que surjan de la idea.

## Si grabas de pie: qué hacer con las piernas
El mismo principio de "movimiento leve, no rigidez" aplica de la cintura para abajo. Pararse con el peso completamente fijo en ambas piernas, como en posición de firmes, se ve tan tenso como los brazos cruzados. Un peso ligeramente distribuido, con la posibilidad de moverte un paso durante una transición de idea, se ve más natural que una estatua.

## Si grabas sentado
Sentarte no elimina el problema de la rigidez — solo lo traslada. Sentarte en el borde de la silla, con la espalda ligeramente inclinada hacia adelante (no hundida en el respaldo), transmite más energía y presencia que sentarte totalmente recto o recostado hacia atrás. La inclinación leve hacia la cámara es, de hecho, la misma señal de "estoy involucrado en lo que digo" que buscas también con las manos.

## Ejercicio
Graba dos versiones del mismo guion: una donde intentas controlar conscientemente cada gesto, y otra donde simplemente hablas como si le explicaras la idea a un amigo sentado enfrente. Compara — casi siempre la segunda versión gana, porque los gestos que nacen del contenido superan a los coreografiados.`,
        accionables: ["Graba un video sin pensar en las manos — revisa qué hicieron naturalmente","Si se congelan, sostén algo relacionado al tema (un producto, notas, una taza)","Elimina el cruce de brazos como postura de apertura","Deja que un gesto surja de una palabra específica en vez de planearlo antes","Si grabas de pie, distribuye el peso entre ambas piernas en vez de pararte rígido"],
      },
      {
        id: "l5", titulo: "Grabar 10 tomas sin sonar repetitivo", minutos: 6,
        cuerpo: `## El problema del día de grabación en lote
Cuando grabas varios videos el mismo día (lo cual es lo correcto para ser eficiente), el riesgo real es que todos abran igual — mismo tono, misma energía, mismo tipo de gancho — y se sientan como la misma persona clonada 10 veces.

## La solución: variar el tipo de apertura
Antes de grabar, anota qué tipo de gancho usará cada video, y que ninguno se repita en la misma sesión:
- Una pregunta directa a cámara
- Una afirmación contraria a lo que la gente cree
- Una escena o momento específico ("Ayer un paciente me dijo...")
- Un dato o cifra concreta
- Una declaración de postura fuerte

## Bonus: cambia algo físico entre tomas
Un cambio de plano, de fondo, o de ropa entre grabaciones ayuda a que cada pieza se sienta como su propio momento, no como parte de una línea de producción.

## Por qué tu audiencia nota el patrón aunque no vea los videos seguidos
Aunque publiques los videos en días distintos, muchos seguidores frecuentes ven varios en la misma semana, y el algoritmo tiende a mostrar contenido del mismo creador de forma agrupada a quien más interactúa con tu cuenta. Eso significa que la "sesión de lote" sí se percibe como bloque, aunque tú la hayas planeado como piezas separadas — por eso la variación no es un detalle estético, es funcional.

## El error de variar el gancho pero no la energía
Cambiar el tipo de apertura ayuda, pero si mantienes exactamente el mismo tono de voz, la misma velocidad y el mismo nivel de energía en los 10 videos, la sensación de "clon" persiste aunque los ganchos sean distintos. La energía (más calmada, más directa, más entusiasta) también debe variar entre tomas, no solo la estructura del gancho.

## Cómo ordenar la sesión para maximizar variación
No grabes los 10 videos con el mismo tema en el mismo orden en que se te ocurrieron — agrupa por tipo de energía y alterna: un video de tono serio, uno más ligero, uno con dato duro, uno más conversacional. Grabar en el orden en que se te ocurren las ideas casi siempre produce una energía plana, porque tiendes a mantener el mismo estado de ánimo de una toma a la siguiente.

## Qué hacer si no puedes cambiar de ropa o fondo
Si grabas todo en el mismo lugar y no puedes cambiar de outfit (por ejemplo, si es contenido corporativo con dress code fijo), la variación tiene que venir de otro lado: cambia el encuadre (más cerca, más lejos, otro ángulo de cámara), la hora del día si la luz natural varía, o el orden de las frases dentro del gancho. La variedad no depende de tener recursos de producción — depende de que decidas variar al menos una variable visible por toma.

## Checklist antes de una sesión de lote
- Lista de ganchos, uno por video, sin repetir tipo
- Nivel de energía asignado a cada video (no todos "alto" ni todos "calmado")
- Al menos un cambio físico (plano, fondo o prenda) cada 2-3 tomas
- Orden de grabación mezclado, no cronológico según se te ocurrieron las ideas`,
        accionables: ["Antes de grabar, asigna un tipo de gancho distinto a cada video de la sesión","Varía el nivel de energía entre tomas, no solo el tipo de gancho","Ordena tu sesión mezclando tono/energía en vez de grabar en el orden en que se te ocurrieron las ideas","Revisa tus últimos 5 videos publicados: ¿cuántos abren igual?","Si grabas 3+ videos seguidos, cambia algo visible (plano, fondo o prenda) cada 2-3 tomas"],
      },
    ],
  },
  {
    id: "vestimenta-profesion",
    categoria: "IMAGEN PROFESIONAL",
    title: "Cómo vestirte según tu profesión",
    subtitle: "Lo que tu ropa comunica antes de que digas una palabra",
    icon: "shirt",
    resumen: "La ropa es la primera pieza de contenido que tu audiencia procesa — decide en segundos si te percibe como una autoridad en tu área antes de escuchar una sola frase.",
    lecciones: [
      {
        id: "l1", titulo: "La primera impresión se decide en 3 segundos", minutos: 5,
        cuerpo: `## Lo que pasa antes de que hables
Antes de procesar lo que dices, quien te ve ya formó una primera impresión basada en tu imagen — es automático, no es superficialidad del espectador, es cómo funciona la atención humana. Esa primera impresión no decide si te cree, pero sí decide con qué nivel de atención te va a escuchar.

## La pregunta que reemplaza a "¿qué me pongo?"
En vez de pensar en moda o en lo que te gusta usar, pregúntate: "¿esto comunica lo que quiero que mi audiencia asuma de mí en los primeros 3 segundos?" — autoridad, cercanía, cuidado, seriedad, según lo que tu marca necesite proyectar.

## No se trata de vestir "elegante" siempre
Un coach de bienestar en traje formal puede transmitir distancia, no autoridad. Un abogado en ropa muy casual puede restar seriedad. El objetivo es coherencia entre tu vestuario y lo que tu audiencia espera de tu rol — no un estándar único.

## El mecanismo detrás: por qué el cerebro decide tan rápido
Esto tiene nombre en psicología social: "thin-slicing" — la capacidad del cerebro de formar un juicio bastante preciso sobre competencia, estatus o calidez con solo unos segundos de información visual, sin necesidad de datos adicionales. No es un defecto del espectador ni algo que puedas "educar" para que no pase — es un mecanismo automático de cómo procesamos personas nuevas, y funciona igual en un feed de redes que en una sala de juntas.

## El error de vestir para ti mismo en vez de para el rol
Mucha gente elige su vestuario de grabación pensando "qué me gusta usar" en vez de "qué necesita ver mi audiencia de mí en este rol específico". Un ejemplo: dos personas con el mismo mensaje sobre finanzas personales — una con camisa formal, otra con playera de gráfico y gorra. El contenido puede ser idéntico en calidad, pero la primera impresión de "sabe de lo que habla" ya está sesgada antes de la primera frase, y ese sesgo es difícil de revertir después.

## La prueba de coherencia
Antes de grabar, pregúntate: si un desconocido pausara el video en el segundo 1 sin sonido, ¿la imagen sola comunicaría el rol que quieres ocupar en la mente de esa persona (experto, cercano, autoridad, creativo)? Si la imagen podría pertenecer a cualquier otro contexto sin cambiar nada, no está haciendo su trabajo.

## Diferencia entre una foto fija y un video en movimiento
En una foto, la audiencia tiene tiempo ilimitado para examinar cada detalle de tu vestuario, así que la coherencia debe ser casi perfecta en una sola imagen. En video, la primera impresión se forma con la imagen en movimiento, la postura y hasta el fondo detrás de ti, no solo la prenda — por eso la misma ropa puede leerse distinto en una foto de perfil que en un clip donde también entran en juego tu lenguaje corporal y el entorno.`,
        accionables: ["Escribe en una frase qué quieres que tu audiencia asuma de ti en 3 segundos","Revisa tus últimos 5 videos: ¿tu vestuario coincide con esa frase?","Identifica una prenda que usas seguido que contradice esa imagen","Haz la prueba de pausar tu video en el segundo 1 sin sonido: ¿la imagen sola comunica el rol que buscas?","Diferencia entre \"qué me gusta usar\" y \"qué necesita ver mi audiencia de mí\" antes de elegir vestuario"],
      },
      {
        id: "l2", titulo: "Reglas por sector", minutos: 7,
        cuerpo: `## Antes de elegir: la pregunta que define tu sector
No se trata de memorizar reglas de moda por industria — se trata de entender qué expectativa inconsciente ya trae tu audiencia sobre alguien en tu profesión, y decidir si la vas a cumplir, superar, o romper deliberadamente. La mayoría de los errores de vestuario no son "verse mal" — son contradecir sin querer una expectativa que ya existía antes de que aparecieras.

## Salud / medicina
La bata o el uniforme clínico comunica autoridad instantánea — úsalo en contenido educativo/clínico. Para contenido más personal (detrás de cámaras, historia personal), ropa formal sin bata también funciona, pero evita ropa deportiva o muy casual: baja la percepción de rigor científico. El error más común en este sector es sobrecorregir hacia la informalidad para "parecer cercano" — pero en salud, cercanía sin autoridad genera desconfianza, no conexión; la gente quiere sentir que quien le habla de su salud sabe lo que dice.

## Legal / finanzas / seguros / corporativo
La formalidad es el default esperado — camisa o blusa con cuello, colores sobrios (azul marino, gris, blanco, negro). El error más común no es "ser muy formal", es la inconsistencia: un video en traje y el siguiente en camiseta rompe la percepción de seriedad construida. Este sector es el que menos margen tiene para variación — la audiencia asocia formalidad constante con estabilidad financiera/legal, así que la variabilidad de vestuario se lee, aunque sea inconscientemente, como variabilidad de criterio.

## Coaching / desarrollo personal / marca personal
Aquí hay más libertad, pero libertad no es descuido — la clave es un estilo reconocible y repetible (tu "uniforme de marca"), no ropa distinta cada vez. La coherencia visual entre videos construye reconocimiento igual que un logo. El riesgo específico de este sector es el extremo opuesto al legal: tanta libertad que cada video se siente de una persona distinta, lo cual diluye el reconocimiento de marca en vez de reforzarlo.

## Eventos, fotografía, creativos
El vestuario puede ser más expresivo, pero debe reflejar tu propio nivel de cuidado estético — si vendes producción visual de alto nivel, tu imagen personal es la primera prueba de ese nivel. Aquí el error común es exactamente el opuesto a los sectores formales: usar la "libertad creativa" como excusa para descuido, cuando en realidad este sector es donde más se examina el detalle visual, porque es literalmente lo que vendes.

## Si tu sector no encaja exactamente en ninguno de estos 4
La mayoría de las profesiones se ubican en algún punto entre estos cuatro extremos. Identifica cuál de los dos ejes pesa más para tu audiencia — ¿necesitan sentir que eres formal/serio, o que eres cercano/accesible? — y elige el perfil que más se le parezca como punto de partida, ajustando desde ahí.

## Un matiz: la plataforma también ajusta la formalidad
Un mismo perfil profesional puede ajustar ligeramente su formalidad según la plataforma — LinkedIn tiende a esperar más formalidad que Instagram o TikTok, incluso para la misma persona y el mismo sector. Esto no contradice la coherencia de marca: significa tener un rango dentro de tu perfil (por ejemplo, blazer en LinkedIn, la misma camisa sin blazer en Reels) en vez de una sola prenda fija para toda plataforma.`,
        accionables: ["Identifica cuál de estos 4 perfiles corresponde a tu negocio","Lista 3 prendas que ya tienes y encajan en ese perfil","Aparta las prendas que contradicen el perfil para no usarlas en contenido","Identifica el error específico de tu sector (sobre-informalidad en salud, inconsistencia en legal/finanzas, ropa distinta cada vez en coaching, descuido en creativos) y revisa si lo estás cometiendo","Si tu profesión no encaja en los 4 perfiles, identifica qué eje pesa más (formal/serio vs. cercano/accesible) para tu audiencia"],
      },
      {
        id: "l3", titulo: "Colores y patrones que funcionan en cámara", minutos: 5,
        cuerpo: `## Lo que la cámara hace distinto al ojo humano
Una cámara no capta los colores exactamente como el ojo — algunos colores "vibran" o generan un efecto de interferencia (muaré) que en persona no se nota. Esto pasa porque el sensor de la cámara captura la imagen en una cuadrícula de píxeles; cuando un patrón repetitivo muy fino (como rayas delgadas) tiene una frecuencia parecida a esa cuadrícula, las dos interfieren entre sí y generan un patrón ondulante que no existe en la prenda real — es un problema técnico del sensor, no una percepción exagerada.

## Evitar
- Blanco puro pegado a la piel muy clara (puede "quemar" la exposición y perder definición del rostro)
- Patrones muy finos y repetitivos (rayas delgadas, cuadros pequeños) — generan vibración visual en video
- Rojo muy saturado en cámaras de gama media — puede verse artificial

## Preferir
- Colores sólidos de saturación media (azul, verde oscuro, vino, camel)
- Contraste moderado con el fondo donde grabas — si tu fondo es claro, evita ropa muy clara que te "funda" con él
- Un color de marca reconocible que uses de forma consistente en tu contenido (refuerza identidad visual)

## Cómo hacer una prueba rápida antes de una sesión importante
Si tienes duda sobre una prenda específica, grábate 5 segundos con ella puesta, en la misma luz donde vas a grabar el contenido real, y revisa el clip en pantalla completa (no en la miniatura). El muaré y los problemas de exposición casi siempre son invisibles en una miniatura pequeña pero evidentes a tamaño completo — por eso mucha gente los descubre ya publicado.

## El matiz del contraste con tu tono de piel
Más allá del fondo, el contraste entre la ropa y tu propio tono de piel también importa: una prenda muy parecida en tono a tu piel puede "fundir" el cuello con la cara y perder definición del rostro, igual que el problema del blanco puro en piel clara. La regla no es "usar cierto color" sino evitar que ropa y piel se vean como una sola masa continua en cámara.

## El caso especial del negro
El negro suele considerarse seguro, pero en cámaras de gama media con poca luz puede perder toda textura y verse como una mancha plana sin forma — literalmente "come" los detalles de la prenda y a veces hasta el contorno del cuerpo. Si vas a usar negro, asegúrate de tener suficiente luz de contorno (rim light) o un fondo con algo de contraste para no fundirte con él.

## Qué hacer si ya grabaste con un color problemático
Si ya grabaste y notas muaré o pérdida de definición en la edición, hay poco que la edición pueda arreglar del color en sí — el muaré casi no se corrige bien en post — pero sí puedes mitigar el daño ajustando levemente la nitidez y la exposición del clip, o priorizando esas tomas como material de apoyo en vez de plano principal, donde el problema es menos evidente.`,
        accionables: ["Revisa tu fondo de grabación habitual y elige 2-3 colores de ropa que contrasten bien con él","Elimina de tu rotación de grabación cualquier prenda de rayas finas o cuadros pequeños","Define un color \"de marca\" que uses seguido en tu contenido","Antes de una sesión importante, graba 5 segundos de prueba con la prenda dudosa y revísalo a pantalla completa","Si usas negro, verifica que tengas suficiente luz de contorno para no perder la forma del cuerpo"],
      },
      {
        id: "l4", titulo: "Vestuario para grabar en lote", minutos: 5,
        cuerpo: `## El reto de grabar varios videos el mismo día
Grabar en lote (batch) es lo más eficiente, pero publicar 8 videos con la misma ropa exacta, subidos en días distintos, puede leerse como que llevas semanas sin renovar contenido — o generar confusión sobre cuándo se grabó cada uno.

## La solución simple
Ten 2-3 combinaciones distintas dentro de tu mismo estilo de marca (mismo nivel de formalidad, misma paleta) y cambia entre ellas cada 2-4 videos durante la sesión de grabación. No es necesario un vestuario nuevo por video — solo suficiente variación para que no se note que fue el mismo día.

## Bonus
Cambiar de plano o fondo junto con la ropa refuerza aún más la sensación de que cada pieza es su propio momento, no una línea de producción.

## Por qué esto afecta la percepción de qué tan "activo" estás
Más allá de verse repetitivo, publicar muchos videos con la misma ropa exacta puede generar una duda específica en la audiencia: "¿esto es contenido nuevo o es lo mismo de hace semanas reciclado?" — esa duda, aunque sea injustificada, reduce ligeramente la sensación de que tu cuenta está activa y produciendo contenido fresco, que es justo la percepción que quieres reforzar al publicar seguido.

## Cómo planear las combinaciones antes del día de grabación
No decidas la ropa la misma mañana de grabar — prepara las 2-3 combinaciones la noche anterior (o antes), ya elegidas y listas, para no perder tiempo de sesión decidiendo entre tomas. Un método simple: numera las combinaciones (1, 2, 3) y asigna cuál usar según el bloque de videos que vas a grabar, no al azar.

## El error de cambiar demasiado
El error opuesto también existe: algunas personas, al escuchar "varía tu vestuario", terminan usando 6-8 outfits completamente distintos en una sola sesión, lo cual rompe la coherencia de marca construida en la lección de vestimenta por sector. La variación debe ser sutil — dentro del mismo nivel de formalidad y la misma paleta — no un cambio de estilo completo cada dos videos.

## Ejemplo concreto de 3 combinaciones dentro de un mismo perfil
Para alguien en el perfil de coaching/marca personal: (1) camisa lisa color base + blazer, (2) la misma camisa sin blazer, arremangada, (3) suéter de cuello redondo en un color complementario de la misma paleta. Las tres viven en el mismo mundo visual, pero ninguna es idéntica a la otra — eso es exactamente el balance que buscas.

## El caso del contenido evergreen
Si algunos de los videos de tu sesión de lote se van a publicar meses después (contenido evergreen), evita vestuario claramente asociado a una temporada o tendencia pasajera. Un video que se ve "vestido para hoy" pierde vigencia visual mucho antes que el contenido en sí, y se nota que es una pieza vieja cuando se publica fuera de su momento original.`,
        accionables: ["Prepara 2-3 outfits dentro de tu mismo estilo antes del día de grabación","Numera y planea tus combinaciones la noche antes, no la misma mañana de grabar","Alterna de outfit cada 2-4 videos durante la sesión","Verifica que tus outfits varíen dentro de la misma paleta y nivel de formalidad, sin saltar a un estilo distinto","Si es posible, cambia también el fondo o el plano entre outfits"],
      },
    ],
  },
  {
    id: "expresion-oral",
    categoria: "COMUNICACIÓN",
    title: "Expresión oral",
    subtitle: "Comunicar con claridad, sin sonar ensayado",
    icon: "chat",
    resumen: "La claridad vence a la elocuencia casi siempre — la mayoría de la gente que \"no sabe hablar en público\" en realidad solo nunca aprendió una estructura simple para organizar lo que quiere decir.",
    lecciones: [
      {
        id: "l1", titulo: "Claridad antes que elocuencia", minutos: 8,
        cuerpo: `## El error más común
Muchas personas creen que hablar bien significa usar palabras sofisticadas o sonar "profesional". El resultado real casi siempre es lo contrario: mientras más complicado el lenguaje, más se pierde la audiencia — y perder a la audiencia es el único fracaso real en comunicación. No importa cuánto sepas del tema si nadie te sigue después de la primera frase.

Esto pasa porque la sofisticación verbal casi nunca viene de dominio real del tema — viene de inseguridad. Cuando alguien no está seguro de que su idea sea suficientemente valiosa, la envuelve en lenguaje complicado para que suene más importante. El efecto es el contrario: el oyente interpreta la complejidad innecesaria como que ni el que habla tiene claro lo que quiere decir.

## La prueba simple
Si tuvieras que explicarle esta misma idea a un familiar que no sabe nada del tema, ¿usarías estas mismas palabras? Si no, esas no son las palabras correctas para tu contenido tampoco — salvo que tu audiencia sea 100% técnica. Esta prueba funciona incluso para contenido dirigido a expertos: la claridad no le resta rigor a una idea, solo le quita el ruido que no aporta nada al mensaje.

## Por qué tu cerebro te traiciona al hablar en vivo
Cuando hablas sin guion, tu memoria de trabajo — la parte del cerebro que sostiene información mientras la usas — solo puede manejar 3 o 4 piezas de información a la vez antes de empezar a perder el hilo. Cada cláusula subordinada, cada paréntesis mental ("bueno, esto también depende de..."), consume espacio en esa memoria limitada. Por eso las frases largas y con muchas ideas encadenadas se sienten "correctas" mientras las dices, pero confunden a quien escucha: tu cerebro sí tiene el contexto completo, el del oyente no.

## La estructura mínima que siempre funciona
1. La idea principal, en una frase, dicha primero
2. El "por qué" o el contexto que la sostiene
3. Qué hacer con esa información

Decir la idea principal al final (como una gran revelación) funciona en storytelling, pero en contenido educativo/profesional casi siempre es mejor decirla primero y después sostenerla — así el oyente sabe desde el segundo uno hacia dónde va la idea, y puede seguir el resto sin cargar toda la estructura en la cabeza.

## El error opuesto: simplificar de más
Claridad no es lo mismo que simpleza vacía. Si tu audiencia es técnica o ya tiene contexto del tema, sobre-simplificar suena condescendiente y le resta autoridad a tu mensaje — es el mismo error, en dirección contraria. La regla no es "usa palabras fáciles siempre", es "usa exactamente la complejidad que tu audiencia necesita para entender, ni una gota más".

## Antes y después
Mal: "La disfunción mitocondrial subyacente puede manifestarse en sintomatología de fatiga crónica incluso en presencia de patrones de sueño aparentemente adecuados."
Bien: "Si te despiertas cansado aunque duermas 8 horas, el problema casi nunca es cuánto dormiste — es algo pasando a nivel celular que ni el mejor descanso arregla."
Misma información, misma seriedad del tema — pero la segunda versión la puede seguir cualquiera, y eso la hace más persuasiva, no menos.`,
        accionables: ["Toma tu último guion y subraya cualquier palabra que un familiar no entendería sin explicación","Reescribe la idea principal como la primera frase, no la última","Practica explicando tu tema a alguien fuera de tu industria y nota dónde se pierde","Cuenta cuántas ideas metes en una sola frase — si son más de 2, divide la frase","Identifica una frase de tu contenido reciente donde simplificaste de más y perdiste autoridad frente a tu audiencia técnica"],
      },
      {
        id: "l2", titulo: "Identificar y quitar las muletillas", minutos: 8,
        cuerpo: `## Por qué no las notas tú mismo
Las muletillas ("eh", "o sea", "como que", "¿sí?") son automáticas — el cerebro las usa para ganar tiempo mientras piensa la siguiente idea, y por eso son casi invisibles para quien las dice. Nadie decide conscientemente decir "eh" — es un reflejo que llena el silencio mientras el cerebro busca la siguiente palabra, y como ocurre en la misma fracción de segundo en que estás pensando, tu atención está en la idea, no en el sonido que acabas de hacer.

## Cómo encontrarlas
Graba 60 segundos hablando de cualquier tema sin guion y escúchalo de vuelta. Vas a notar patrones que se repiten — casi todos tenemos 1 o 2 muletillas "favoritas" que se repiten mucho más que las demás. La primera vez que te escuches vas a sentir que exageraste — es normal, porque en vivo esos sonidos ocupan mucho menos espacio de atención del que ocupan al escucharlos de vuelta, sin el contexto de estar pensando en tiempo real.

## Por qué sí importan (más allá de la estética)
Cada muletilla es una micro-señal de duda que tu audiencia procesa aunque no la nombre conscientemente. Un video con muchas muletillas comunica "esta persona está improvisando" incluso si el contenido es excelente — y esa sensación de improvisación reduce la percepción de autoridad más de lo que reduce cualquier error de contenido real.

## Cómo quitarlas (no es fuerza de voluntad)
La muletilla ocupa el espacio de una pausa que te da miedo dejar en silencio. La solución no es "no decirla" — es reemplazarla conscientemente por un silencio breve. Un silencio de medio segundo se siente incómodo para quien habla, pero se ve natural y seguro para quien escucha. Intentar "no decir la muletilla" sin darle a ese espacio un reemplazo casi nunca funciona, porque el cerebro sigue necesitando ese tiempo para pensar — solo cambia de sonido a otro sonido distinto.

## La técnica del silencio contado
Practica contando mentalmente "uno, dos" en silencio cada vez que sientas el impulso de decir tu muletilla. Al principio se siente eterno — en el video se ve como una pausa natural de alguien que piensa antes de hablar. Practicarlo en frases cortas y aisladas, no en el guion completo, acelera el aprendizaje porque puedes repetir la misma frase 5-6 veces seguidas hasta que el silencio se sienta automático.

## Un matiz: no toda pausa necesita estar vacía
En conversación natural (no en contenido guionado), frases puente cortas como "y aquí está lo interesante" o "vamos a ver" cumplen una función real de transición, no son muletillas vacías — la diferencia es que aportan información direccional. La muletilla vacía no dice nada; la frase puente sí.`,
        accionables: ["Graba 60 segundos sin guion y transcribe mentalmente tus muletillas más repetidas","Identifica tu muletilla #1 (la más frecuente)","Practica un video de 30 segundos reemplazando esa muletilla por una pausa de silencio","Repite la técnica del silencio contado en frases cortas y aisladas antes de aplicarla en un guion completo","Pide a alguien cercano que te avise cada vez que la use en conversación normal, no solo grabando"],
      },
      {
        id: "l3", titulo: "Storytelling básico: situación → revelación → resolución", minutos: 9,
        cuerpo: `## Por qué esta estructura funciona siempre
La mente humana está entrenada para prestar atención a una historia con esta forma: algo pasa (situación), aprendemos algo que no sabíamos (revelación), y eso cambia lo que hacemos después (resolución). Casi cualquier contenido —un consejo, un caso, una opinión— se puede empaquetar en esta forma. La razón de fondo es que el cerebro predice constantemente qué va a pasar después, y cuando la revelación contradice esa predicción, libera un pico de atención que un dato aislado nunca genera.

## Cómo aplicarlo a un consejo simple
En vez de decir directamente "hay que hidratarse bien" (dato aislado, se olvida rápido), cuéntalo como:
- Situación: "Un paciente me decía que tomaba 8 vasos de agua al día y aun así se sentía deshidratado"
- Revelación: "El problema no era cuánta agua tomaba, sino cuándo — todo de una vez en vez de repartido"
- Resolución: "Repartir la misma cantidad en el día cambió completamente cómo se sentía"

## Qué hace que una situación sea "contable"
No cualquier situación funciona como gancho — la situación necesita un detalle específico y verificable (una cifra, una frase textual, un momento concreto) para sentirse real. "Un paciente tenía problemas de hidratación" es genérico y no engancha; "un paciente tomaba 8 vasos de agua al día y aun así se sentía deshidratado" tiene un número y una contradicción concretos, y eso es lo que hace que la audiencia quiera saber qué pasó.

## Cómo practicar: la versión de 3 frases
Antes de grabar, escribe la historia en exactamente 3 frases — una por cada parte de la estructura. Si no te alcanza una frase para la situación, probablemente estás incluyendo detalles que no importan para el punto que quieres hacer. Practicar la versión comprimida primero te obliga a identificar cuál es el detalle esencial de cada parte, y después puedes expandirla con naturalidad al grabar.

## El error a evitar
Nunca abrir con una lista tipo "3 tips sobre X" — eso es un dato aislado disfrazado de estructura, y no genera la misma retención que una situación reconocible. Una lista le dice al cerebro "aquí no hay nada que predecir", y sin esa expectativa, la atención cae mucho más rápido incluso si el contenido de la lista es bueno.

## Cuándo NO usar esta estructura
En formatos muy cortos (menos de 15 segundos) o cuando la audiencia ya busca activamente una respuesta puntual (por ejemplo, respondiendo una pregunta directa en comentarios), ir directo a la resolución sin construir la situación es más efectivo — el storytelling necesita espacio para funcionar, y forzarlo en un formato que no lo tiene se siente como relleno.

## Reutilizar la misma historia sin que se sienta repetida
Una buena historia real no se agota en un solo video — puedes contar la misma situación varias veces si cambias qué revelación destacas. La historia del paciente y el agua puede usarse para hablar de hidratación, de horarios, o de cómo un mal hábito se disfraza de buen hábito, según qué parte de la revelación pongas al centro. Lo que hace que se sienta repetida no es reusar el hecho, es repetir exactamente el mismo ángulo.`,
        accionables: ["Toma un consejo genérico que sueles dar y reescríbelo con esta estructura de 3 partes","Evita abrir cualquier pieza con \"3 cosas sobre...\" de ahora en adelante","Practica contando la misma historia en 30 segundos sin perder ninguna de las 3 partes","Antes de grabar, escribe tu historia en exactamente 3 frases (una por parte) para encontrar el detalle esencial","Identifica un dato aislado que sueles usar y conviértelo en una situación con un detalle específico"],
      },
      {
        id: "l4", titulo: "Tono y énfasis: sonar seguro sin sonar agresivo", minutos: 8,
        cuerpo: `## La diferencia entre autoridad y agresividad
Autoridad viene de la certeza en lo que dices, no del volumen ni de la velocidad. Hablar más fuerte o más rápido para sonar convencido casi siempre logra el efecto contrario — se lee como necesidad de convencer, no como certeza real.

## Por qué el volumen alto se percibe como inseguridad
Subir el volumen para enfatizar es una señal biológica de urgencia — el cerebro humano asocia el volumen alto sostenido con estrés o alarma, no con calma segura. Alguien genuinamente seguro de lo que dice no necesita gritarlo, porque no está compitiendo por ser creído — solo lo está afirmando. Por eso un tono controlado, incluso bajo, comunica más certeza que uno elevado.

## Dónde poner el énfasis
No enfatices toda la frase — enfatiza solo la palabra o frase que realmente importa. "Esto SÍ funciona" comunica más seguridad que gritar la frase entera, porque el contraste (resto normal, una palabra marcada) es lo que el oído percibe como intención real. Si todo suena igual de fuerte, el oído no tiene ninguna señal que le diga qué es lo importante — es como subrayar cada palabra de un texto: al final, nada está subrayado.

## El ritmo también es énfasis
El volumen no es la única herramienta — bajar la velocidad justo antes de la palabra clave genera la misma sensación de peso que subir el volumen, pero sin el riesgo de sonar agresivo. Una pausa de una fracción de segundo antes de la palabra importante hace que el oyente se incline mentalmente hacia lo que sigue, antes incluso de escucharlo.

## Cómo practicar con un texto que no es tuyo
Toma un párrafo de una noticia o un texto neutro (no tu propio guion, para quitar la presión de "decirlo bien") y léelo en voz alta 3 veces, marcando una palabra distinta como énfasis cada vez. Practicar con material ajeno te deja enfocarte solo en la mecánica del énfasis, sin la carga extra de estar pensando en tu propio contenido al mismo tiempo — después, la técnica se transfiere directo a tus guiones.

## Cuándo la certeza cruza a arrogancia
Hay una línea fina entre sonar seguro y sonar como si no aceptaras ser cuestionado. Frases absolutas sin matiz ("esto siempre funciona", "no hay otra forma") empujan hacia la arrogancia aunque el tono de voz sea perfecto — la seguridad real deja espacio para el matiz ("esto funciona en la mayoría de los casos que he visto") sin perder autoridad, porque la honestidad sobre los límites de una afirmación es en sí misma una señal de dominio del tema.

## Cómo se ve esto aplicado a un guion completo
Toma un guion de 30 segundos y márcalo antes de grabar: subraya solo 2 o 3 palabras en todo el texto como puntos de énfasis real, y anota dónde va una micro-pausa de ritmo. Grabarlo así, con decisiones tomadas de antemano, evita el patrón más común — enfatizar todo por instinto en el momento— y te deja concentrarte en decir el contenido con naturalidad mientras el énfasis ya está resuelto.`,
        accionables: ["Elige una frase clave de tu próximo video y decide qué UNA palabra merece el énfasis","Practica la frase completa con volumen normal, marcando solo esa palabra","Evita subir el volumen general como forma de sonar convencido","Practica bajar la velocidad (no el volumen) justo antes de la palabra clave, como alternativa","Revisa tu guion en busca de afirmaciones absolutas (\"siempre\", \"nunca\") y decide si necesitan un matiz"],
      },
    ],
  },
  {
    id: "asesoria-imagen",
    categoria: "ASESORÍA DE IMAGEN",
    title: "Guía práctica de asesoría de imagen",
    subtitle: "Construir una imagen coherente con tu marca personal",
    icon: "user",
    resumen: "Tu imagen es contenido antes de publicar cualquier contenido — la gente forma una opinión sobre ti con solo ver tu foto de perfil, antes de leer una sola palabra tuya.",
    lecciones: [
      {
        id: "l1", titulo: "Diagnóstico: lo que transmites hoy vs. lo que quieres transmitir", minutos: 9,
        cuerpo: `## El ejercicio de honestidad
Antes de cambiar nada, hay que ver con claridad el punto de partida. Mira tus últimas 9 fotos o videos publicados como si fueras un extraño viéndolos por primera vez — sin el contexto que tú sí tienes sobre quién eres.

## Por qué te cuesta verte objetivamente
Existe un sesgo real y documentado: cuanto más expuesto estás a tu propia imagen, más neutral o incluso más favorable te parece, aunque objetivamente no haya cambiado nada — es el mismo mecanismo por el que una canción que odiabas empieza a gustarte después de escucharla suficientes veces. Por eso mirar tus propias fotos "como extraño" es difícil de verdad: tu cerebro ya procesó esas imágenes cientos de veces y dejó de verlas con ojos frescos.

## Las 3 preguntas
1. ¿Qué palabra usaría un desconocido para describir a esta persona con solo ver esto? (autoridad, cercanía, lujo, sencillez, energía...)
2. ¿Esa palabra coincide con lo que tu marca necesita proyectar?
3. Si no coincide, ¿qué elemento concreto está generando esa desconexión? (vestuario, fondo, expresión, calidad de imagen)

## Cómo conseguir una segunda opinión que sirva
Pedirle a alguien cercano "¿qué te parece esta foto?" casi nunca da información útil — la respuesta social por defecto es "se ve bien". En vez de eso, muestra la foto sin contexto (sin decir de qué se trata tu marca) y pregunta específicamente: "si no supieras nada de mí, ¿a qué se dedicaría esta persona?". Esa pregunta obliga a una respuesta concreta, no a un cumplido reflejo.

## Un diagnóstico aplicado
Una asesora financiera revisó sus últimas fotos y la palabra que surgió entre sus contactos fue "cercana" — buena palabra, pero su marca necesitaba también "confiable con dinero grande". Al mirar el elemento concreto, el problema no era la ropa (ya era formal) sino el fondo: todas las fotos tenían un fondo doméstico, casual, que contradecía la seriedad del vestuario. El ajuste no fue reinventar su imagen — fue cambiar dónde se paraba para grabar.

## Qué hacer con lo que encuentres
Este diagnóstico no es sobre "verse bien" en un sentido estético general — es sobre coherencia entre tu imagen y tu propuesta de valor. Un experto en finanzas de alto nivel con fotos casuales de baja calidad genera una desconexión real, aunque su contenido sea excelente. El objetivo del ejercicio no es sentirte mal con lo que encuentres, sino aislar el elemento exacto que hay que ajustar — casi nunca es "todo", casi siempre es uno o dos elementos concretos.

## Con qué frecuencia repetir el diagnóstico
No es un ejercicio de una sola vez. Tu marca evoluciona — cambias de servicio, subes de nivel, te diriges a un público distinto — y tu imagen necesita revisarse cada vez que eso pasa, no solo al principio. Repetir estas 3 preguntas cada 3-4 meses, o cada vez que sientas que tu contenido "ya no te representa del todo", evita que la desconexión se acumule sin que la notes, porque el mismo sesgo de familiaridad que te impide verte objetivamente hoy sigue actuando después.`,
        accionables: ["Mira tus últimas 9 publicaciones como si fueras un desconocido","Escribe la palabra que crees que un extraño usaría para describirte","Identifica el elemento concreto (no la sensación general) que más contradice la imagen que buscas","Pide a alguien que no conozca tu marca que describa \"a qué se dedicaría esta persona\" solo con una foto","Compara la palabra que buscabas transmitir con la que realmente recibiste, y anota la diferencia exacta"],
      },
      {
        id: "l2", titulo: "Construir tu \"uniforme de marca personal\"", minutos: 8,
        cuerpo: `## Qué es un uniforme de marca
No es usar literalmente la misma ropa siempre — es tener 2-3 combinaciones dentro de la misma paleta y nivel de formalidad, que uses de forma repetida y reconocible. Las marcas y personas más reconocibles tienen un estilo visual consistente, no una closet infinita de opciones distintas.

## Por qué funciona
La repetición visual construye reconocimiento — igual que un logo o una paleta de colores. Cuando tu audiencia ve tu contenido, una imagen coherente refuerza inconscientemente "ya conozco a esta persona/marca" incluso antes de leer el contenido.

## El costo oculto de la variedad infinita
Cada vez que te paras frente al clóset sin un sistema, tomas una decisión nueva desde cero — y esa decisión consume energía mental que podrías usar en el contenido mismo. Además, la variedad total tiene un costo de marca: si cada video te ves distinto, tu audiencia no construye una imagen mental estable de quién eres, y esa imagen estable es justo lo que hace que alguien te reconozca en un feed lleno de contenido.

## Cómo construirlo
Elige 2-3 colores base (tu paleta personal), un nivel de formalidad fijo según tu sector, y 2-3 combinaciones completas dentro de esos parámetros. No necesitas ropa nueva — la mayoría de la gente ya tiene estas piezas, solo nunca las organizó como sistema.

## Un ejemplo real de uniforme
Un consultor de negocios definió su uniforme como: camisa de vestir en 3 tonos (blanco, azul claro, gris), sin corbata, con blazer oscuro opcional según el contexto (formal vs. cercano). Con solo esas variables ya cubre presentaciones formales, contenido casual de redes, y eventos — sin tener que pensar en una combinación nueva cada vez, y sin verse repetitivo porque los 3 tonos rotan.

## Cómo variar sin romper el sistema
Un uniforme de marca no significa cero variación — significa variación dentro de límites definidos. Puedes agregar un accesorio distinto, cambiar el color de una sola prenda dentro de tu paleta, o ajustar el nivel de formalidad según el contexto, siempre que el conjunto siga siendo reconociblemente "tú". El riesgo no es variar — es variar fuera de la paleta, porque ahí es donde se rompe el reconocimiento que llevas tiempo construyendo.

## Cuándo sí actualizar el uniforme
Un uniforme de marca no es permanente — es una herramienta, no una cárcel. Si tu negocio cambia de nivel (por ejemplo, empiezas a atender clientes de mayor presupuesto) o tu paleta actual ya no coincide con lo que quieres proyectar, actualízala deliberadamente, no por aburrimiento. La diferencia entre "evolucionar el uniforme" y "perder la consistencia" es que la actualización es una decisión consciente y de una sola vez, no una deriva lenta donde cada semana usas algo un poco distinto sin darte cuenta.`,
        accionables: ["Elige 2-3 colores base para tu paleta personal","Arma 2-3 combinaciones completas dentro de esa paleta con ropa que ya tienes","Guarda fotos de referencia de esas combinaciones para no tener que decidir cada vez que grabas","Define qué puedes variar (accesorios, una prenda) sin salir de tu paleta base","Revisa tus últimos 10 posts: ¿ya existe un patrón de colores que puedas formalizar como tu uniforme?"],
      },
      {
        id: "l3", titulo: "Grooming y detalles que se notan en cámara", minutos: 8,
        cuerpo: `## Lo que la cámara amplifica
Detalles que en persona pasan desapercibidos (brillo en la piel, cabello despeinado, vello facial descuidado) se notan mucho más en video que en persona, especialmente en primer plano — la cámara es menos generosa que el espejo.

## Por qué la luz artificial empeora todo esto
La luz artificial (aros de luz, focos, luz de ventana indirecta) tiende a ser más dura y direccional que la luz ambiental a la que tu ojo está acostumbrado, y eso exagera el brillo en zonas como la frente y la nariz — zonas donde la piel produce más grasa naturalmente. Tu ojo compensa esto en tiempo real sin que lo notes; el sensor de la cámara no compensa nada, solo captura el reflejo tal cual es.

## Checklist rápido antes de grabar
- Piel: un toque de polvo matificante evita brillos bajo luz artificial, incluso en hombres
- Cabello: peinado hacia el estilo que usas siempre — la variación día a día distrae más de lo que parece
- Vello facial: definido, no a medio crecer sin forma
- Dientes/labios: hidratados, sin residuos visibles de comida o café antes de grabar

## Una rutina de 5 minutos que cubre todo
No necesitas un proceso elaborado — necesitas uno consistente. Antes de cada sesión: primero revisa la piel bajo la luz que vas a usar, no bajo otra luz, porque el brillo cambia según la fuente; después ajusta el cabello al estilo fijo que definiste como tu imagen habitual; por último revisa dientes y labios en el espejo del celular, no en un espejo normal, porque la cámara frontal se parece más a cómo te va a captar la cámara real.

## El error de corregir a medio grabar
Interrumpir una grabación para "arreglarte" en cámara (tocarte el pelo, limpiarte la cara) rompe la continuidad del video y, peor, le muestra a tu audiencia una inseguridad que antes no habían notado. La revisión debe pasar antes de que empiece la grabación, no durante — si notas algo a mitad de toma, es mejor cortar, ajustar fuera de cámara, y retomar desde el inicio de esa idea.

## Lo que no hay que sobre-corregir
El objetivo no es verse "producido" o artificial — es verse como la mejor versión natural y consistente de ti mismo, no una versión irreconocible del día a día.

## Un matiz según el dispositivo
El grooming que necesitas cambia según qué cámara uses. Una cámara de celular moderna suaviza más la piel de forma automática que una cámara réflex o una webcam de escritorio, que capturan cada detalle sin ningún filtro implícito. Si grabas con distintos dispositivos según el formato (celular para redes, cámara para contenido de mayor producción), vale la pena revisar tu checklist de grooming con más cuidado en el dispositivo que menos perdona — así nunca te sorprende un detalle que en el celular jamás se hubiera notado.`,
        accionables: ["Arma un checklist de 60 segundos de grooming antes de cada grabación","Prueba un polvo matificante ligero si sueles brillar bajo luz artificial","Define un peinado/corte consistente que uses en todo tu contenido de un mismo periodo","Revisa tu imagen bajo la luz real que vas a usar para grabar, no bajo otra luz distinta","Si notas algo a mitad de grabación, corta y ajusta fuera de cámara en vez de corregir en vivo"],
      },
      {
        id: "l4", titulo: "Coherencia entre tu imagen física y tu feed visual", minutos: 8,
        cuerpo: `## La desconexión más común
Muchas marcas personales invierten en una paleta de colores y estética cuidada para su feed, pero la imagen física de la persona (ropa, fondo, luz) no tiene ninguna relación visual con esa paleta — se siente como dos marcas distintas conviviendo en la misma cuenta.

## Por qué el ojo lo detecta aunque no sepa explicarlo
El cerebro humano procesa patrones visuales antes de procesar contenido — es instantáneo, no analítico. Cuando abres un feed y hay coherencia de color y estilo, tu cerebro lo procesa como "orden", que se traduce inconscientemente en "profesionalismo" o "cuidado". Cuando hay incoherencia, el cerebro no necesariamente piensa "esto no combina" — pero sí procesa una sensación vaga de desorden que reduce la confianza, aunque la persona que mira el feed no sepa nombrar por qué.

## Cómo alinearlo
Si tu marca usa dorados y tonos cálidos oscuros, tu vestuario y fondo de grabación deberían vivir dentro de esa misma familia de color cuando sea posible — no necesitas literalmente vestir del color de tu logo, pero sí evitar contradicciones fuertes (fondo azul frío con marca de identidad cálida y dorada, por ejemplo).

## Auditoría rápida de tu feed actual
Abre tu perfil y míralo como cuadrícula, no publicación por publicación (así es como realmente lo ve alguien que te descubre por primera vez). Pregúntate: si tapara el logo y el nombre, ¿se ve como una sola marca o como contenido de varias personas distintas? Las piezas que más rompen el patrón suelen ser las fotos personales o de "detrás de cámaras" — justo las que menos se piensan con la paleta de marca en mente.

## Un matiz importante: no es literalismo
Alinear tu imagen con tu paleta no significa vestir literalmente del color exacto de tu logo en cada pieza — eso se ve forzado y, llevado al extremo, empieza a parecer disfraz. Se trata de evitar contradicciones de temperatura de color (cálido vs. frío) y de nivel de saturación (colores vibrantes vs. apagados), no de calcar el código de color exacto en cada prenda.

## Resultado
Cuando la imagen física y el feed visual están alineados, cada pieza de contenido se siente parte de un mismo universo de marca — eso es lo que hace que una cuenta se vea "profesional" incluso sin un presupuesto de producción enorme.

## Un caso común: el fondo que nadie planeó
La causa de incoherencia más frecuente no es la ropa — es el fondo de grabación. La mayoría de la gente graba donde le queda cómodo (una pared cualquiera, un rincón de casa) sin haber decidido si ese fondo pertenece a la paleta de marca. Antes de invertir en vestuario nuevo, revisa primero tu fondo habitual: cambiarlo o ajustarlo con elementos simples (una tela, una planta, un panel de color) suele resolver más incoherencia visual que cualquier otro ajuste, y con menos esfuerzo.`,
        accionables: ["Compara tu paleta de marca (feed, logo) con los colores que sueles usar frente a cámara","Identifica una contradicción de color entre tu imagen física y tu identidad visual","Ajusta tu fondo de grabación o vestuario para acercarlo a tu paleta de marca","Mira tu feed como cuadrícula completa (no publicación por publicación) y detecta qué piezas rompen el patrón","Revisa específicamente tus fotos \"detrás de cámaras\" o personales — suelen ser las que menos alineadas están con la paleta"],
      },
    ],
  },
  {
    id: "poses-camara",
    categoria: "FOTOGRAFÍA Y POSES",
    title: "Mejores poses para posar frente a cámara",
    subtitle: "Fotos seguras que sirven para cualquier sesión",
    icon: "camera",
    resumen: "La mayoría de la incomodidad al posar viene de no tener un repertorio — con 5 poses base entrenadas, cualquier sesión de fotos deja de sentirse improvisada.",
    lecciones: [
      {
        id: "l1", titulo: "Postura base: la posición de autoridad", minutos: 6,
        cuerpo: `## Por qué la postura es la base de todo
Antes de pensar en ángulos o expresión, la postura decide el 80% de cómo se percibe una foto. Hombros caídos y espalda encorvada comunican incomodidad, aunque la expresión facial sea perfecta — el cerebro humano procesa la forma general del cuerpo antes de fijarse en la cara, así que una postura tensa "contamina" la lectura de una sonrisa genuina.

## La corrección de 3 puntos
1. Hombros hacia abajo y atrás (no rígidos, solo relajados fuera de las orejas)
2. Columna alargada, como si un hilo tirara suavemente desde la coronilla
3. Barbilla ligeramente hacia adelante y abajo, nunca hacia arriba (evita el ángulo de "mentón levantado" que suele leerse como distancia o arrogancia)

## El error de sobrecorregir: la postura militar
Cuando alguien escucha "hombros atrás" casi siempre exagera: saca el pecho, endereza la espalda como una tabla y termina en una postura rígida de firmes militares. Esto se ve igual de mal que estar encorvado, solo que en la dirección opuesta — se lee como tensión, no como seguridad. La corrección correcta se siente casi como un alivio, no como un esfuerzo: si sientes que estás "sosteniendo" la postura con fuerza, la pasaste de largo.

## Cómo practicarlo
Frente a un espejo, deja caer los hombros como si soltaras una mochila pesada — esa es la posición relajada correcta, no la posición rígida de "cuadrarse" para la foto. Repite el movimiento completo (encoger los hombros hacia las orejas y luego soltarlos hacia abajo) 3-4 veces hasta reconocer la sensación de dónde caen naturalmente. Ese es el punto que buscas replicar frente a la cámara, sin tener que pensarlo conscientemente cada vez.

## La versión sentada de la misma postura
La mayoría de la gente solo entrena esta postura de pie y luego se sorprende de que en fotos sentado (una entrevista, un escritorio) se ve encorvada otra vez. Los mismos 3 puntos aplican sentado, con un ajuste: siéntate en el borde delantero de la silla en vez de recostarte en el respaldo — recostarte empuja los hombros hacia adelante y colapsa la postura, incluso si arriba del pecho intentas mantenerla derecha.

## Antes y después: qué cambia realmente
La diferencia entre una foto con esta postura y una sin ella no es sutil una vez que sabes verla: los hombros caídos generan una línea de cuello más corta y "apilan" la cabeza sobre el cuerpo sin espacio visual; la columna alargada crea una línea de cuello más larga y separa la cabeza del resto del cuerpo, que es justo lo que el ojo lee como presencia. Compara dos fotos tuyas —una con hombros caídos y otra con la corrección de 3 puntos— y vas a notar que la segunda "respira" más, aunque el encuadre sea idéntico.

## Por qué también te ayuda a sentirte más seguro
Esta corrección no solo cambia cómo te ve la cámara — cambia cómo te sientes tú mientras te fotografían. El cuerpo manda señales al cerebro tanto como el cerebro manda señales al cuerpo: sostener una postura encorvada varios minutos frente a una cámara activa la misma sensación física que el estrés, y eso alimenta más incomodidad de la que ya sentías al empezar. Corregir la postura antes de la sesión no es solo estético — corta ese ciclo antes de que empiece, en vez de intentar "verte relajado" mientras el cuerpo manda la señal contraria.`,
        accionables: ["Practica frente al espejo la corrección de 3 puntos hasta que se sienta natural","Antes de la próxima sesión de fotos, revisa hombros-columna-barbilla como checklist","Evita el mentón hacia arriba como pose de \"seguridad\" — se lee distinto de lo que se siente","Prueba la corrección también sentado, en el borde de la silla, no recostado","Toma dos fotos de prueba (hombros caídos vs. corrección) y compáralas para entrenar el ojo"],
      },
      {
        id: "l2", titulo: "Ángulos que favorecen", minutos: 6,
        cuerpo: `## Por qué nunca de frente plano
Pararse completamente de frente a la cámara, con los hombros paralelos al lente, es el ángulo menos favorecedor para casi cualquier cuerpo — se ve más ancho y más estático de lo que realmente es, porque la cámara aplana en 2D lo que en la vida real tiene profundidad.

## La técnica del ángulo de 3/4
Girar el cuerpo ligeramente (unos 30-45 grados) respecto a la cámara, dejando un hombro más cerca del lente que el otro, crea profundidad y dinamismo en la imagen — es el ángulo que usan casi todos los fotógrafos profesionales como base, y funciona igual de bien en foto de estudio que en una selfie con el celular.

## Qué hacer con la cara
La cara puede seguir mirando directo a la cámara aunque el cuerpo esté en ángulo — de hecho, ese contraste (cuerpo en ángulo, mirada directa) suele verse más seguro que alinear todo el cuerpo de frente, porque comunica que estás eligiendo mirar a cámara, no que quedaste atrapado de frente a ella.

## El error del giro exagerado
Si el 3/4 se ve bien, muchos asumen que girar más (casi de perfil, 80-90 grados) se ve todavía mejor — es al revés. Pasado los 45-50 grados, el cuerpo empieza a perder la línea de hombros que da la sensación de dirigirse hacia la cámara, y la pose se lee como "de espaldas casi" en vez de "en ángulo". El punto óptimo real está entre 30 y 45 grados; más que eso resta, no suma.

## Por qué casi todos tienen un "lado bueno"
La cara humana no es simétrica — la mayoría de las personas tiene un lado ligeramente más fotogénico que el otro (una ceja más alta, un pómulo más marcado), y por eso algunas fotos tuyas te gustan más que otras aunque la pose sea casi idéntica. No es superstición: toma 4-5 fotos alternando qué hombro queda más cerca de la cámara y vas a notar que consistentemente prefieres las de un lado. Una vez que lo identifiques, ese es tu ángulo por defecto para cualquier sesión futura.

## La altura de la cámara también es un ángulo
El giro horizontal (3/4) es solo un eje — la altura de la cámara es el otro y casi siempre se ignora. Una cámara ligeramente por encima de los ojos, mirando ligeramente hacia abajo, favorece casi cualquier rostro porque alarga el cuello y reduce la papada visual; una cámara por debajo de los ojos hace exactamente lo contrario. Si quien te fotografía es más bajo que tú o dispara desde la cadera, pide que suba el encuadre antes de seguir tomando fotos.

## La distancia a la cámara también distorsiona el ángulo
Un ángulo de 3/4 correcto puede arruinarse si estás demasiado cerca del lente: a poca distancia, cualquier cámara (especialmente la de un celular) exagera lo que está más cerca del lente y comprime lo que está más lejos, lo que puede hacer que un hombro se vea desproporcionado frente al otro. Da un paso atrás de lo que te parece natural — la mayoría de la gente posa demasiado cerca de la cámara — y deja que el fotógrafo se acerque con zoom óptico si necesita el encuadre más cerrado.`,
        accionables: ["Practica el giro de 3/4 frente a un espejo o cámara del celular","Compara una foto de frente plano vs. una en ángulo — nota la diferencia","Mantén la mirada directa a cámara incluso con el cuerpo girado","Identifica tu \"lado bueno\" alternando el hombro más cercano a la cámara en varias fotos","Pide que la cámara se posicione ligeramente por encima de tus ojos, no por debajo"],
      },
      {
        id: "l3", titulo: "Qué hacer con las manos en fotos", minutos: 6,
        cuerpo: `## El problema universal
Casi todo el mundo, sin excepción, no sabe qué hacer con las manos frente a una cámara de fotos — y por eso terminan rígidas pegadas al cuerpo o escondidas, lo cual se ve igual de forzado que dejarlas colgando sin propósito.

## Por qué las manos delatan más nerviosismo que la cara
La cara es la parte del cuerpo que más conscientemente controlamos frente a una cámara — por eso puede "mentir" con una sonrisa aunque haya tensión de fondo. Las manos, en cambio, casi nadie las piensa, así que delatan el nerviosismo real: dedos rígidos, puños apretados o manos que se mueven buscando dónde esconderse. Resolver la pose de manos no es un detalle estético, es lo que hace que el resto del cuerpo también se relaje.

## Soluciones que siempre funcionan
- Una mano en el bolsillo (solo el pulgar visible, no todo el puño metido) — instantáneamente se ve más natural
- Sostener algo relacionado a tu trabajo (una libreta, un producto, unas gafas)
- Un brazo cruzado suavemente al frente, con la otra mano tocando ligeramente el brazo o el mentón
- Manos entrelazadas al frente, a la altura de la cintura, sin apretar

## El detalle que arruina cualquiera de estas poses
Todas las poses de arriba dejan de funcionar si las manos están tensas — dedos completamente rectos y pegados, o un puño cerrado con fuerza, se nota incluso en fotos pequeñas o de perfil de redes. La corrección es simple: deja los dedos ligeramente curvados, como si sostuvieras un huevo sin apretarlo. Es la misma lógica que la postura de hombros de la lección anterior — la versión relajada casi siempre se ve mejor que la versión "controlada".

## Manos ocupadas: la solución que nadie usa lo suficiente
La forma más fácil de que las manos se vean naturales es dándoles una tarea real — sostener una taza, pasar una página, ajustar un reloj. Cuando las manos tienen un propósito, el cerebro deja de pensarlas conscientemente y el resultado se ve espontáneo en vez de posado, incluso si la "tarea" está completamente actuada para la foto.

## Cómo practicar esto en 5 minutos
Párate frente a un espejo o la cámara del celular en modo selfie y prueba las 4 poses de manos en secuencia, sosteniendo cada una unos 5 segundos. No busques "la correcta" — busca cuál se siente menos forzada para tu cuerpo. La mayoría de la gente tiene una pose de manos que le sale natural casi de inmediato y dos o tres que nunca van a sentirse cómodas, y está bien quedarse solo con la que funciona.

## El hábito nervioso de tocarte el pelo o la ropa
Cuando no sabemos qué hacer con las manos, el instinto es buscarles una tarea automática — ajustar el pelo, estirar la ropa, tocarte los lentes — una y otra vez durante la sesión. El problema no es hacerlo una vez (se ve natural), es repetirlo cada 10 segundos, porque ahí deja de leerse como gesto y empieza a leerse como tic nervioso en las fotos en ráfaga. Si notas que tu mano vuelve siempre al mismo lugar, es señal de que necesitas una de las 4 poses de manos como default, en vez de repetir el gesto nervioso.

## Lo que evitar
Brazos completamente pegados y rectos al cuerpo (se ve rígido) y manos completamente escondidas en ambos bolsillos a la vez (se ve desconectado, como si quisieras salir del encuadre).`,
        accionables: ["Practica las 4 poses de manos frente a un espejo antes de tu próxima sesión","Elige tu favorita como pose \"segura\" por defecto","Evita ambos bolsillos a la vez o brazos completamente rectos","Prueba dar a tus manos una tarea real (sostener algo) en vez de solo posarlas","Revisa que los dedos estén ligeramente curvados, nunca rectos ni en puño"],
      },
      {
        id: "l4", titulo: "Expresión facial natural", minutos: 5,
        cuerpo: `## Por qué la sonrisa forzada se nota
Una sonrisa sostenida por varios segundos mientras el fotógrafo ajusta la cámara casi siempre se ve tensa en la foto final — los músculos de una sonrisa genuina no aguantan más de 1-2 segundos sin verse forzados, así que sostenerla más tiempo del necesario trabaja en tu contra.

## La técnica
En vez de sonreír y sostenerlo, sonríe justo antes del clic — piensa en algo genuinamente gracioso o agradable en el momento exacto de la foto, no antes. Reír brevemente y volver a una expresión neutral relajada entre tomas también ayuda a resetear la tensión facial acumulada.

## La sonrisa que no llega a los ojos
Hay una razón técnica por la que algunas sonrisas se ven falsas incluso cuando la boca está perfectamente curveada: una sonrisa genuina activa también los músculos alrededor de los ojos (se entrecierran ligeramente, aparecen líneas en las esquinas), y una sonrisa solo de boca no lo hace. El cerebro humano detecta esa discrepancia en fracciones de segundo, aunque no sepa explicar por qué la foto "se siente rara". Para verificarlo, sonríe frente a un espejo tapándote la boca con la mano — si los ojos no cambian, la sonrisa completa tampoco se va a ver genuina.

## El error de decir "whisky" o "cheese"
Pedir que alguien diga una palabra para "forzar" la sonrisa es casi siempre contraproducente: la boca queda en una posición articulada, no relajada, y la sonrisa se ve más como una mueca fonética que una expresión real. Es mejor generar la sonrisa con algo que realmente resulte gracioso o cómodo en el momento (un comentario, una anécdota) que con una instrucción mecánica repetida en cada toma.

## Los ojos, no solo la boca
Además de la sonrisa, hacia dónde miras justo antes del clic cambia el resultado — mirar brevemente hacia otro punto (el suelo, un lado) y volver a la cámara justo antes de la toma genera una mirada más viva que sostener el contacto visual todo el tiempo que dura el ajuste de cámara, porque evita el parpadeo forzado y la mirada fija que se lee como "congelada" en la foto final.

## Alternativa a la sonrisa
No todas las fotos necesitan sonrisa — una expresión neutral pero relajada (labios sueltos, mirada suave) puede comunicar más seriedad/autoridad cuando eso es lo que la marca necesita, sin verse fría ni distante.

## Cómo resetear entre tomas
Cuando una sesión se alarga, la cara empieza a acumular tensión sin que te des cuenta — sonreír, aguantar, sonreír, aguantar. Entre cada toma, sacude la cara literalmente (mueve la mandíbula, parpadea fuerte, exhala) antes de volver a posar. Este reset de dos segundos evita que la sonrisa número 15 de la sesión se vea más forzada que la número 2, que es justo lo que pasa cuando no se hace este pequeño corte.

## Foto vs. video: un ajuste de duración
Todo lo anterior aplica más fuerte en foto que en video: una foto congela un instante, así que una sonrisa sostenida 1-2 segundos ya es demasiado tiempo. En video, en cambio, la expresión tiene que sostenerse naturalmente durante toda la toma, así que la técnica cambia — ahí lo que ayuda es no sonreír de forma constante sino dejar que la expresión varíe con lo que estás diciendo, igual que pasaría en una conversación real.`,
        accionables: ["Practica sonreír justo antes del \"clic\" en vez de sostenerla","Toma varias fotos seguidas dejando resetear la expresión entre cada una","Prueba una expresión neutral relajada como alternativa a la sonrisa para contenido más serio","Verifica frente al espejo que tu sonrisa también mueve los ojos, no solo la boca","Evita decir palabras forzadas tipo \"whisky\"; genera la sonrisa con algo real en el momento"],
      },
      {
        id: "l5", titulo: "Serie de 5 poses seguras para cualquier sesión", minutos: 6,
        cuerpo: `## Tu repertorio base
Con estas 5 poses cubres la mayoría de necesidades de contenido (perfil, feed, portada de video, material de prensa) sin tener que improvisar cada vez. No es una lista de posturas al azar — cada una resuelve una necesidad de contenido distinta, así que antes de una sesión vale la pena pensar para qué vas a usar la foto (perfil, anuncio, prensa) y priorizar según eso.

1. **Retrato de autoridad**: 3/4 de cuerpo, mirada directa, manos en pose segura (bolsillo o brazos cruzados suaves). Esta pose resume las lecciones 1 a 3 de este curso en una sola imagen — postura de 3 puntos, ángulo de 3/4, manos resueltas. Úsala cuando quieras la foto que va a representar tu marca por defecto: la que aparece en tu web, tu perfil de LinkedIn o la portada de una propuesta. Si solo vas a tomar una foto en toda la sesión, que sea esta.

2. **Media distancia caminando**: cuerpo en movimiento leve, mirada hacia adelante (no a cámara) — genera sensación de dinamismo. El error más común aquí es caminar demasiado lento o demasiado consciente de la cámara, lo cual se nota en el resultado; funciona mejor si caminas de verdad hacia un punto real (una puerta, el final del pasillo) varias veces mientras el fotógrafo dispara en ráfaga, en vez de "actuar" un paso aislado.

3. **Sentado, apoyado**: sentado en un escritorio o mesa, ligeramente apoyado, transmite cercanía y accesibilidad. A diferencia del retrato de autoridad (que comunica distancia profesional), esta pose funciona mejor para contenido donde quieres verte accesible — bio de equipo, contenido educativo, "detrás de cámaras". El apoyo ligero (un codo o una mano en la mesa) es lo que evita que sentado se vea rígido; sentarse completamente derecho sin apoyo produce el mismo problema de tensión que la postura militar de la lección 1.

4. **Detalle de trabajo**: manos haciendo algo relacionado a tu profesión (escribiendo, sosteniendo una herramienta) — foto de "detrás de cámaras". Es la aplicación directa de la solución de "manos ocupadas" de la lección 3: al darle a las manos una tarea real, toda la pose se relaja sin que tengas que pensarla. Funciona especialmente bien para contenido de redes que necesita sentirse auténtico y no posado, como un reel o una historia.

5. **Retrato cercano**: primer plano del rostro y hombros, expresión relajada, ideal para foto de perfil. Aquí es donde más se nota la técnica de expresión de la lección 4 — a esta distancia, la diferencia entre una sonrisa que llega a los ojos y una que no es mucho más visible que en un plano general, así que vale la pena tomar varias tomas seguidas con reset entre cada una.

## Cómo usarlas
No necesitas las 5 en cada sesión — pero tenerlas como repertorio elimina la sensación de "no sé cómo posar" que es la razón #1 por la que la gente evita hacerse fotos profesionales.

## Qué pasa si una pose no te sale bien
Es normal que una o dos de estas cinco poses no te salgan naturales de inmediato — cada cuerpo tiene poses que le resultan más cómodas que otras, igual que pasa con el "lado bueno" de la lección 2. Si una pose se ve forzada en las pruebas, no insistas en ella para la sesión real: prioriza las 2-3 que sí te salen bien y constrúyelas en distintos encuadres (más cerca, más lejos, distinto fondo) antes de forzar una quinta que no funciona para ti.

## Cómo combinarlas en una sola sesión
Un orden que funciona bien en la práctica: empieza con el retrato de autoridad (es la más "fácil" porque ya la practicaste en las lecciones anteriores y te calienta para el resto), sigue con detalle de trabajo y sentado-apoyado (las más relajadas, buenas para soltar tensión), y cierra con caminando y retrato cercano (las que requieren más tomas repetidas para acertar). Llegar a las poses más exigentes ya "calentado" cambia notablemente el resultado comparado con empezar por ahí.`,
        accionables: ["Guarda esta lista de 5 poses como referencia para tu próxima sesión","Practica cada una frente al espejo al menos una vez antes de la sesión real","Comparte esta lista con tu fotógrafo antes de la sesión para agilizar el proceso","Identifica cuáles 2-3 poses te salen más naturales y prioriza esas si el tiempo de sesión es corto","Usa el orden sugerido (autoridad → trabajo/sentado → caminando/cercano) para calentar antes de las poses más exigentes"],
      },
    ],
  },
];

export const getCourse = (id) => COURSES_CATALOG.find(c => c.id === id);

export const totalLessonsCount = () => COURSES_CATALOG.reduce((sum, c) => sum + c.lecciones.length, 0);
