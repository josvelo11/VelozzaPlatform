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
    id: 'hablar-camara',
    categoria: 'PRESENCIA EN CÁMARA',
    title: 'Hablar frente a cámara',
    subtitle: 'Grábate con seguridad, sin sonar a comercial',
    icon: 'video',
    resumen: 'Lo que separa a alguien que "se ve incómodo grabando" de alguien que conecta en cámara no es carisma innato — son 5 hábitos concretos y entrenables.',
    lecciones: [
      {
        id: 'l1', titulo: 'El primer segundo decide todo', minutos: 6,
        cuerpo: `## Por qué el primer segundo pesa más que los otros 29
En redes, nadie te debe atención — la tienes que ganar en el primer segundo o la pierdes. La mayoría de la gente arranca su video con "Hola, soy [nombre] y hoy quiero hablarles de..." — eso es exactamente lo que el cerebro de tu audiencia usa para decidir seguir scrolleando.

## La regla
Nunca abras con tu nombre, tu cargo, ni un saludo genérico. Abre con la situación, la pregunta, o la afirmación que tu audiencia ya se está preguntando en su cabeza en ese momento.

- Mal: "Hola, soy la Dra. Ortega y hoy les voy a hablar de la inflamación crónica."
- Bien: "Si te despiertas cansado aunque duermas 8 horas, esto te va a interesar."

## Ejercicio
Toma tu último video grabado. Lee en voz alta las primeras 2 frases. Si suena a presentación, reescríbelas como una situación que tu audiencia reconoce en sí misma.`,
        accionables: ['Elimina "hola, soy [nombre]" de tu apertura', 'Escribe 3 ganchos distintos antes de grabar y elige el más específico', 'Graba la apertura sola, en loop, hasta que salga natural sin leer'],
      },
      {
        id: 'l2', titulo: 'Mirar al lente, no a la pantalla', minutos: 5,
        cuerpo: `## El error que rompe la conexión
Cuando grabas con el celular, es instintivo mirar tu propia cara en la pantalla en vez del lente de la cámara. El resultado se ve, aunque no sepas nombrarlo: la audiencia siente que le estás hablando "de lado", nunca directo a los ojos.

## La corrección
Pon un punto pequeño de cinta o un sticker justo al lado del lente (no sobre la pantalla) y entrena la mirada hacia ahí. Al principio se siente forzado — a las pocas tomas se vuelve automático.

## Un matiz importante
No es mirar fijo sin parpadear — es la misma mirada natural que usarías hablando con una persona real, solo que esa persona está donde está el lente, no donde está tu reflejo.`,
        accionables: ['Pon una marca física junto al lente antes de grabar', 'Graba 15 segundos mirando solo esa marca', 'Revisa el resultado: ¿se siente como si te hablara a ti directamente?'],
      },
      {
        id: 'l3', titulo: 'Habla más lento de lo que se siente natural', minutos: 5,
        cuerpo: `## Por qué te sientes lento pero se ve normal
Cuando grabas con nervios, el ritmo natural se acelera sin que lo notes — es una reacción física, no falta de preparación. El problema es que lo que a ti te suena "ya muy lento" en el momento de grabar, en el video final se ve completamente normal.

## La técnica
Después de cada idea completa, deja un silencio de medio segundo antes de seguir. Ese silencio no se siente como un error en el video — se siente como alguien que piensa antes de hablar, que es exactamente la señal de autoridad que quieres dar.

## Dónde meter las pausas
- Después del gancho inicial (antes de explicar por qué importa)
- Antes de la idea más importante del video (crea expectativa)
- Al cerrar, antes del llamado a la acción`,
        accionables: ['Marca en tu guion dónde van las 2-3 pausas intencionales', 'Graba una toma exagerando la lentitud — casi siempre se ve mejor de lo que se siente', 'Compara dos tomas del mismo guion, una rápida y una con pausas, y elige objetivamente'],
      },
      {
        id: 'l4', titulo: 'Qué hacer con las manos y el cuerpo', minutos: 5,
        cuerpo: `## El problema no son las manos, es la rigidez
La mayoría de la incomodidad en cámara no viene de qué hacer con las manos — viene de congelar todo el cuerpo por miedo a "hacer algo raro". Un cuerpo completamente inmóvil se ve más incómodo que uno que se mueve un poco de más.

## La regla simple
Deja que las manos acompañen lo que estás diciendo, igual que lo harías explicándole algo a un amigo. Si estás contando algo importante, un gesto natural refuerza el punto. Si no sabes qué hacer, sostener algo (un marcador, una libreta) le da a las manos un lugar natural donde estar.

## Lo que sí evitar
- Cruzar los brazos (cierra la energía)
- Tocarte la cara o el cabello repetidamente (distrae y se lee como nervios)
- Mecerte de un lado a otro sin parar`,
        accionables: ['Graba un video sin pensar en las manos — revisa qué hicieron naturalmente', 'Si se congelan, sostén algo relacionado al tema (un producto, notas, una taza)', 'Elimina el cruce de brazos como postura de apertura'],
      },
      {
        id: 'l5', titulo: 'Grabar 10 tomas sin sonar repetitivo', minutos: 6,
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
Un cambio de plano, de fondo, o de ropa entre grabaciones ayuda a que cada pieza se sienta como su propio momento, no como parte de una línea de producción.`,
        accionables: ['Antes de grabar, asigna un tipo de gancho distinto a cada video de la sesión', 'Revisa tus últimos 5 videos publicados: ¿cuántos abren igual?', 'Si grabas 3+ videos seguidos, cambia algo visible (plano, fondo o prenda) cada 2-3 tomas'],
      },
    ],
  },
  {
    id: 'vestimenta-profesion',
    categoria: 'IMAGEN PROFESIONAL',
    title: 'Cómo vestirte según tu profesión',
    subtitle: 'Lo que tu ropa comunica antes de que digas una palabra',
    icon: 'shirt',
    resumen: 'La ropa es la primera pieza de contenido que tu audiencia procesa — decide en segundos si te percibe como una autoridad en tu área antes de escuchar una sola frase.',
    lecciones: [
      {
        id: 'l1', titulo: 'La primera impresión se decide en 3 segundos', minutos: 5,
        cuerpo: `## Lo que pasa antes de que hables
Antes de procesar lo que dices, quien te ve ya formó una primera impresión basada en tu imagen — es automático, no es superficialidad del espectador, es cómo funciona la atención humana. Esa primera impresión no decide si te cree, pero sí decide con qué nivel de atención te va a escuchar.

## La pregunta que reemplaza a "¿qué me pongo?"
En vez de pensar en moda o en lo que te gusta usar, pregúntate: "¿esto comunica lo que quiero que mi audiencia asuma de mí en los primeros 3 segundos?" — autoridad, cercanía, cuidado, seriedad, según lo que tu marca necesite proyectar.

## No se trata de vestir "elegante" siempre
Un coach de bienestar en traje formal puede transmitir distancia, no autoridad. Un abogado en ropa muy casual puede restar seriedad. El objetivo es coherencia entre tu vestuario y lo que tu audiencia espera de tu rol — no un estándar único.`,
        accionables: ['Escribe en una frase qué quieres que tu audiencia asuma de ti en 3 segundos', 'Revisa tus últimos 5 videos: ¿tu vestuario coincide con esa frase?', 'Identifica una prenda que usas seguido que contradice esa imagen'],
      },
      {
        id: 'l2', titulo: 'Reglas por sector', minutos: 7,
        cuerpo: `## Salud / medicina
La bata o el uniforme clínico comunica autoridad instantánea —úsalo en contenido educativo/clínico. Para contenido más personal (detrás de cámaras, historia personal), ropa formal sin bata también funciona, pero evita ropa deportiva o muy casual: baja la percepción de rigor científico.

## Legal / finanzas / seguros / corporativo
La formalidad es el default esperado — camisa o blusa con cuello, colores sobrios (azul marino, gris, blanco, negro). El error más común no es "ser muy formal", es la inconsistencia: un video en traje y el siguiente en camiseta rompe la percepción de seriedad construida.

## Coaching / desarrollo personal / marca personal
Aquí hay más libertad, pero libertad no es descuido — la clave es un estilo reconocible y repetible (tu "uniforme de marca"), no ropa distinta cada vez. La coherencia visual entre videos construye reconocimiento igual que un logo.

## Eventos, fotografía, creativos
El vestuario puede ser más expresivo, pero debe reflejar tu propio nivel de cuidado estético — si vendes producción visual de alto nivel, tu imagen personal es la primera prueba de ese nivel.`,
        accionables: ['Identifica cuál de estos 4 perfiles corresponde a tu negocio', 'Lista 3 prendas que ya tienes y encajan en ese perfil', 'Aparta las prendas que contradicen el perfil para no usarlas en contenido'],
      },
      {
        id: 'l3', titulo: 'Colores y patrones que funcionan en cámara', minutos: 5,
        cuerpo: `## Lo que la cámara hace distinto al ojo humano
Una cámara no capta los colores exactamente como el ojo — algunos colores "vibran" o generan un efecto de interferencia (muaré) que en persona no se nota.

## Evitar
- Blanco puro pegado a la piel muy clara (puede "quemar" la exposición y perder definición del rostro)
- Patrones muy finos y repetitivos (rayas delgadas, cuadros pequeños) — generan vibración visual en video
- Rojo muy saturado en cámaras de gama media — puede verse artificial

## Preferir
- Colores sólidos de saturación media (azul, verde oscuro, vino, camel)
- Contraste moderado con el fondo donde grabas — si tu fondo es claro, evita ropa muy clara que te "funda" con él
- Un color de marca reconocible que uses de forma consistente en tu contenido (refuerza identidad visual)`,
        accionables: ['Revisa tu fondo de grabación habitual y elige 2-3 colores de ropa que contrasten bien con él', 'Elimina de tu rotación de grabación cualquier prenda de rayas finas o cuadros pequeños', 'Define un color "de marca" que uses seguido en tu contenido'],
      },
      {
        id: 'l4', titulo: 'Vestuario para grabar en lote', minutos: 5,
        cuerpo: `## El reto de grabar varios videos el mismo día
Grabar en lote (batch) es lo más eficiente, pero publicar 8 videos con la misma ropa exacta, subidos en días distintos, puede leerse como que llevas semanas sin renovar contenido — o generar confusión sobre cuándo se grabó cada uno.

## La solución simple
Ten 2-3 combinaciones distintas dentro de tu mismo estilo de marca (mismo nivel de formalidad, misma paleta) y cambia entre ellas cada 2-4 videos durante la sesión de grabación. No es necesario un vestuario nuevo por video — solo suficiente variación para que no se note que fue el mismo día.

## Bonus
Cambiar de plano o fondo junto con la ropa refuerza aún más la sensación de que cada pieza es su propio momento, no una línea de producción.`,
        accionables: ['Prepara 2-3 outfits dentro de tu mismo estilo antes del día de grabación', 'Alterna de outfit cada 2-4 videos durante la sesión', 'Si es posible, cambia también el fondo o el plano entre outfits'],
      },
    ],
  },
  {
    id: 'expresion-oral',
    categoria: 'COMUNICACIÓN',
    title: 'Expresión oral',
    subtitle: 'Comunicar con claridad, sin sonar ensayado',
    icon: 'chat',
    resumen: 'La claridad vence a la elocuencia casi siempre — la mayoría de la gente que "no sabe hablar en público" en realidad solo nunca aprendió una estructura simple para organizar lo que quiere decir.',
    lecciones: [
      {
        id: 'l1', titulo: 'Claridad antes que elocuencia', minutos: 5,
        cuerpo: `## El error más común
Muchas personas creen que hablar bien significa usar palabras sofisticadas o sonar "profesional". El resultado real casi siempre es lo contrario: mientras más complicado el lenguaje, más se pierde la audiencia — y perder a la audiencia es el único fracaso real en comunicación.

## La prueba simple
Si tuvieras que explicarle esta misma idea a un familiar que no sabe nada del tema, ¿usarías estas mismas palabras? Si no, esas no son las palabras correctas para tu contenido tampoco — salvo que tu audiencia sea 100% técnica.

## La estructura mínima que siempre funciona
1. La idea principal, en una frase, dicha primero
2. El "por qué" o el contexto que la sostiene
3. Qué hacer con esa información

Decir la idea principal al final (como una gran revelación) funciona en storytelling, pero en contenido educativo/profesional casi siempre es mejor decirla primero y después sostenerla.`,
        accionables: ['Toma tu último guion y subraya cualquier palabra que un familiar no entendería sin explicación', 'Reescribe la idea principal como la primera frase, no la última', 'Practica explicando tu tema a alguien fuera de tu industria y nota dónde se pierde'],
      },
      {
        id: 'l2', titulo: 'Identificar y quitar las muletillas', minutos: 5,
        cuerpo: `## Por qué no las notas tú mismo
Las muletillas ("eh", "o sea", "como que", "¿sí?") son automáticas — el cerebro las usa para ganar tiempo mientras piensa la siguiente idea, y por eso son casi invisibles para quien las dice.

## Cómo encontrarlas
Graba 60 segundos hablando de cualquier tema sin guion y escúchalo de vuelta. Vas a notar patrones que se repiten — casi todos tenemos 1 o 2 muletillas "favoritas" que se repiten mucho más que las demás.

## Cómo quitarlas (no es fuerza de voluntad)
La muletilla ocupa el espacio de una pausa que te da miedo dejar en silencio. La solución no es "no decirla" — es reemplazarla conscientemente por un silencio breve. Un silencio de medio segundo se siente incómodo para quien habla, pero se ve natural y seguro para quien escucha.`,
        accionables: ['Graba 60 segundos sin guion y transcribe mentalmente tus muletillas más repetidas', 'Identifica tu muletilla #1 (la más frecuente)', 'Practica un video de 30 segundos reemplazando esa muletilla por una pausa de silencio'],
      },
      {
        id: 'l3', titulo: 'Storytelling básico: situación → revelación → resolución', minutos: 6,
        cuerpo: `## Por qué esta estructura funciona siempre
La mente humana está entrenada para prestar atención a una historia con esta forma: algo pasa (situación), aprendemos algo que no sabíamos (revelación), y eso cambia lo que hacemos después (resolución). Casi cualquier contenido —un consejo, un caso, una opinión— se puede empaquetar en esta forma.

## Cómo aplicarlo a un consejo simple
En vez de decir directamente "hay que hidratarse bien" (dato aislado, se olvida rápido), cuéntalo como:
- Situación: "Un paciente me decía que tomaba 8 vasos de agua al día y aun así se sentía deshidratado"
- Revelación: "El problema no era cuánta agua tomaba, sino cuándo — todo de una vez en vez de repartido"
- Resolución: "Repartir la misma cantidad en el día cambió completamente cómo se sentía"

## El error a evitar
Nunca abrir con una lista tipo "3 tips sobre X" — eso es un dato aislado disfrazado de estructura, y no genera la misma retención que una situación reconocible.`,
        accionables: ['Toma un consejo genérico que sueles dar y reescríbelo con esta estructura de 3 partes', 'Evita abrir cualquier pieza con "3 cosas sobre..." de ahora en adelante', 'Practica contando la misma historia en 30 segundos sin perder ninguna de las 3 partes'],
      },
      {
        id: 'l4', titulo: 'Tono y énfasis: sonar seguro sin sonar agresivo', minutos: 5,
        cuerpo: `## La diferencia entre autoridad y agresividad
Autoridad viene de la certeza en lo que dices, no del volumen ni de la velocidad. Hablar más fuerte o más rápido para sonar convencido casi siempre logra el efecto contrario — se lee como necesidad de convencer, no como certeza real.

## Dónde poner el énfasis
No enfatices toda la frase — enfatiza solo la palabra o frase que realmente importa. "Esto SÍ funciona" comunica más seguridad que gritar la frase entera, porque el contraste (resto normal, una palabra marcada) es lo que el oído percibe como intención real.

## Un ejercicio simple
Lee la misma frase 3 veces, cada vez enfatizando una palabra distinta, y nota cómo cambia completamente el significado percibido — eso es control de énfasis, y es entrenable como cualquier otra habilidad.`,
        accionables: ['Elige una frase clave de tu próximo video y decide qué UNA palabra merece el énfasis', 'Practica la frase completa con volumen normal, marcando solo esa palabra', 'Evita subir el volumen general como forma de sonar convencido'],
      },
    ],
  },
  {
    id: 'asesoria-imagen',
    categoria: 'ASESORÍA DE IMAGEN',
    title: 'Guía práctica de asesoría de imagen',
    subtitle: 'Construir una imagen coherente con tu marca personal',
    icon: 'user',
    resumen: 'Tu imagen es contenido antes de publicar cualquier contenido — la gente forma una opinión sobre ti con solo ver tu foto de perfil, antes de leer una sola palabra tuya.',
    lecciones: [
      {
        id: 'l1', titulo: 'Diagnóstico: lo que transmites hoy vs. lo que quieres transmitir', minutos: 6,
        cuerpo: `## El ejercicio de honestidad
Antes de cambiar nada, hay que ver con claridad el punto de partida. Mira tus últimas 9 fotos o videos publicados como si fueras un extraño viéndolos por primera vez — sin el contexto que tú sí tienes sobre quién eres.

## Las 3 preguntas
1. ¿Qué palabra usaría un desconocido para describir a esta persona con solo ver esto? (autoridad, cercanía, lujo, sencillez, energía...)
2. ¿Esa palabra coincide con lo que tu marca necesita proyectar?
3. Si no coincide, ¿qué elemento concreto está generando esa desconexión? (vestuario, fondo, expresión, calidad de imagen)

## Por qué esto no es vanidad
Este diagnóstico no es sobre "verse bien" en un sentido estético general — es sobre coherencia entre tu imagen y tu propuesta de valor. Un experto en finanzas de alto nivel con fotos casuales de baja calidad genera una desconexión real, aunque su contenido sea excelente.`,
        accionables: ['Mira tus últimas 9 publicaciones como si fueras un desconocido', 'Escribe la palabra que crees que un extraño usaría para describirte', 'Identifica el elemento concreto (no la sensación general) que más contradice la imagen que buscas'],
      },
      {
        id: 'l2', titulo: 'Construir tu "uniforme de marca personal"', minutos: 5,
        cuerpo: `## Qué es un uniforme de marca
No es usar literalmente la misma ropa siempre — es tener 2-3 combinaciones dentro de la misma paleta y nivel de formalidad, que uses de forma repetida y reconocible. Las marcas y personas más reconocibles tienen un estilo visual consistente, no una closet infinita de opciones distintas.

## Por qué funciona
La repetición visual construye reconocimiento — igual que un logo o una paleta de colores. Cuando tu audiencia ve tu contenido, una imagen coherente refuerza inconscientemente "ya conozco a esta persona/marca" incluso antes de leer el contenido.

## Cómo construirlo
Elige 2-3 colores base (tu paleta personal), un nivel de formalidad fijo según tu sector, y 2-3 combinaciones completas dentro de esos parámetros. No necesitas ropa nueva — la mayoría de la gente ya tiene estas piezas, solo nunca las organizó como sistema.`,
        accionables: ['Elige 2-3 colores base para tu paleta personal', 'Arma 2-3 combinaciones completas dentro de esa paleta con ropa que ya tienes', 'Guarda fotos de referencia de esas combinaciones para no tener que decidir cada vez que grabas'],
      },
      {
        id: 'l3', titulo: 'Grooming y detalles que se notan en cámara', minutos: 5,
        cuerpo: `## Lo que la cámara amplifica
Detalles que en persona pasan desapercibidos (brillo en la piel, cabello despeinado, vello facial descuidado) se notan mucho más en video que en persona, especialmente en primer plano — la cámara es menos generosa que el espejo.

## Checklist rápido antes de grabar
- Piel: un toque de polvo matificante evita brillos bajo luz artificial, incluso en hombres
- Cabello: peinado hacia el estilo que usas siempre — la variación día a día distrae más de lo que parece
- Vello facial: definido, no a medio crecer sin forma
- Dientes/labios: hidratados, sin residuos visibles de comida o café antes de grabar

## Lo que no hay que sobre-corregir
El objetivo no es verse "producido" o artificial — es verse como la mejor versión natural y consistente de ti mismo, no una versión irreconocible del día a día.`,
        accionables: ['Arma un checklist de 60 segundos de grooming antes de cada grabación', 'Prueba un polvo matificante ligero si sueles brillar bajo luz artificial', 'Define un peinado/corte consistente que uses en todo tu contenido de un mismo periodo'],
      },
      {
        id: 'l4', titulo: 'Coherencia entre tu imagen física y tu feed visual', minutos: 5,
        cuerpo: `## La desconexión más común
Muchas marcas personales invierten en una paleta de colores y estética cuidada para su feed, pero la imagen física de la persona (ropa, fondo, luz) no tiene ninguna relación visual con esa paleta — se siente como dos marcas distintas conviviendo en la misma cuenta.

## Cómo alinearlo
Si tu marca usa dorados y tonos cálidos oscuros, tu vestuario y fondo de grabación deberían vivir dentro de esa misma familia de color cuando sea posible — no necesitas literalmente vestir del color de tu logo, pero sí evitar contradicciones fuertes (fondo azul frío con marca de identidad cálida y dorada, por ejemplo).

## Resultado
Cuando la imagen física y el feed visual están alineados, cada pieza de contenido se siente parte de un mismo universo de marca — eso es lo que hace que una cuenta se vea "profesional" incluso sin un presupuesto de producción enorme.`,
        accionables: ['Compara tu paleta de marca (feed, logo) con los colores que sueles usar frente a cámara', 'Identifica una contradicción de color entre tu imagen física y tu identidad visual', 'Ajusta tu fondo de grabación o vestuario para acercarlo a tu paleta de marca'],
      },
    ],
  },
  {
    id: 'poses-camara',
    categoria: 'FOTOGRAFÍA Y POSES',
    title: 'Mejores poses para posar frente a cámara',
    subtitle: 'Fotos seguras que sirven para cualquier sesión',
    icon: 'camera',
    resumen: 'La mayoría de la incomodidad al posar viene de no tener un repertorio — con 5 poses base entrenadas, cualquier sesión de fotos deja de sentirse improvisada.',
    lecciones: [
      {
        id: 'l1', titulo: 'Postura base: la posición de autoridad', minutos: 5,
        cuerpo: `## Por qué la postura es la base de todo
Antes de pensar en ángulos o expresión, la postura decide el 80% de cómo se percibe una foto. Hombros caídos y espalda encorvada comunican incomodidad, aunque la expresión facial sea perfecta.

## La corrección de 3 puntos
1. Hombros hacia abajo y atrás (no rígidos, solo relajados fuera de las orejas)
2. Columna alargada, como si un hilo tirara suavemente desde la coronilla
3. Barbilla ligeramente hacia adelante y abajo, nunca hacia arriba (evita el ángulo de "mentón levantado" que suele leerse como distancia o arrogancia)

## Cómo practicarlo
Frente a un espejo, deja caer los hombros como si soltaras una mochila pesada — esa es la posición relajada correcta, no la posición rígida de "cuadrarse" para la foto.`,
        accionables: ['Practica frente al espejo la corrección de 3 puntos hasta que se sienta natural', 'Antes de la próxima sesión de fotos, revisa hombros-columna-barbilla como checklist', 'Evita el mentón hacia arriba como pose de "seguridad" — se lee distinto de lo que se siente'],
      },
      {
        id: 'l2', titulo: 'Ángulos que favorecen', minutos: 5,
        cuerpo: `## Por qué nunca de frente plano
Pararse completamente de frente a la cámara, con los hombros paralelos al lente, es el ángulo menos favorecedor para casi cualquier cuerpo — se ve más ancho y más estático de lo que realmente es.

## La técnica del ángulo de 3/4
Girar el cuerpo ligeramente (unos 30-45 grados) respecto a la cámara, dejando un hombro más cerca del lente que el otro, crea profundidad y dinamismo en la imagen — es el ángulo que usan casi todos los fotógrafos profesionales como base.

## Qué hacer con la cara
La cara puede seguir mirando directo a la cámara aunque el cuerpo esté en ángulo — de hecho, ese contraste (cuerpo en ángulo, mirada directa) suele verse más seguro que alinear todo el cuerpo de frente.`,
        accionables: ['Practica el giro de 3/4 frente a un espejo o cámara del celular', 'Compara una foto de frente plano vs. una en ángulo — nota la diferencia', 'Mantén la mirada directa a cámara incluso con el cuerpo girado'],
      },
      {
        id: 'l3', titulo: 'Qué hacer con las manos en fotos', minutos: 5,
        cuerpo: `## El problema universal
Casi todo el mundo, sin excepción, no sabe qué hacer con las manos frente a una cámara de fotos — y por eso terminan rígidas pegadas al cuerpo o escondidas, lo cual se ve igual de forzado.

## Soluciones que siempre funcionan
- Una mano en el bolsillo (solo el pulgar visible, no todo el puño metido) — instantáneamente se ve más natural
- Sostener algo relacionado a tu trabajo (una libreta, un producto, unas gafas)
- Un brazo cruzado suavemente al frente, con la otra mano tocando ligeramente el brazo o el mentón
- Manos entrelazadas al frente, a la altura de la cintura, sin apretar

## Lo que evitar
Brazos completamente pegados y rectos al cuerpo (se ve rígido) y manos completamente escondidas en ambos bolsillos a la vez (se ve desconectado).`,
        accionables: ['Practica las 4 poses de manos frente a un espejo antes de tu próxima sesión', 'Elige tu favorita como pose "segura" por defecto', 'Evita ambos bolsillos a la vez o brazos completamente rectos'],
      },
      {
        id: 'l4', titulo: 'Expresión facial natural', minutos: 4,
        cuerpo: `## Por qué la sonrisa forzada se nota
Una sonrisa sostenida por varios segundos mientras el fotógrafo ajusta la cámara casi siempre se ve tensa en la foto final — los músculos de una sonrisa genuina no aguantan más de 1-2 segundos sin verse forzados.

## La técnica
En vez de sonreír y sostenerlo, sonríe justo antes del clic — piensa en algo genuinamente gracioso o agradable en el momento exacto de la foto, no antes. Reír brevemente y volver a una expresión neutral relajada entre tomas también ayuda a resetear la tensión facial.

## Alternativa a la sonrisa
No todas las fotos necesitan sonrisa — una expresión neutral pero relajada (labios sueltos, mirada suave) puede comunicar más seriedad/autoridad cuando eso es lo que la marca necesita, sin verse fría.`,
        accionables: ['Practica sonreír justo antes del "clic" en vez de sostenerla', 'Toma varias fotos seguidas dejando resetear la expresión entre cada una', 'Prueba una expresión neutral relajada como alternativa a la sonrisa para contenido más serio'],
      },
      {
        id: 'l5', titulo: 'Serie de 5 poses seguras para cualquier sesión', minutos: 4,
        cuerpo: `## Tu repertorio base
Con estas 5 poses cubres la mayoría de necesidades de contenido (perfil, feed, portada de video, material de prensa) sin tener que improvisar cada vez:

1. **Retrato de autoridad**: 3/4 de cuerpo, mirada directa, manos en pose segura (bolsillo o brazos cruzados suaves)
2. **Media distancia caminando**: cuerpo en movimiento leve, mirada hacia adelante (no a cámara) — genera sensación de dinamismo
3. **Sentado, apoyado**: sentado en un escritorio o mesa, ligeramente apoyado, transmite cercanía y accesibilidad
4. **Detalle de trabajo**: manos haciendo algo relacionado a tu profesión (escribiendo, sosteniendo una herramienta) — foto de "detrás de cámaras"
5. **Retrato cercano**: primer plano del rostro y hombros, expresión relajada, ideal para foto de perfil

## Cómo usarlas
No necesitas las 5 en cada sesión — pero tenerlas como repertorio elimina la sensación de "no sé cómo posar" que es la razón #1 por la que la gente evita hacerse fotos profesionales.`,
        accionables: ['Guarda esta lista de 5 poses como referencia para tu próxima sesión', 'Practica cada una frente al espejo al menos una vez antes de la sesión real', 'Comparte esta lista con tu fotógrafo antes de la sesión para agilizar el proceso'],
      },
    ],
  },
];

export const getCourse = (id) => COURSES_CATALOG.find(c => c.id === id);

export const totalLessonsCount = () => COURSES_CATALOG.reduce((sum, c) => sum + c.lecciones.length, 0);
