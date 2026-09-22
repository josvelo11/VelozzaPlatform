import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';

export const revalidate = 60;
import { PremiumIcon } from '@/components/PremiumIcon';
import { WeddingCarousel } from '@/components/WeddingCarousel';
import { PhotobookCarousel } from '@/components/PhotobookCarousel';
import { generateMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';

const socialPackages = [
  {
    name: 'Colección I · Editorial Signature',
    price: '$450.000 COP',
    description: 'Ideal para quinceañeras, cumpleaños especiales y retratos previos al evento con dirección visual.',
    items: [
      'Experiencia de modelaje pre-evento',
      '30 fotografías high-res',
      'Revelado de autor con color grading',
      'Entrega en formato digital',
      'Entrega en 21 a 30 días calendario',
    ],
  },
  {
    name: 'Colección II · Social Prestige',
    price: '$600.000 COP',
    description: 'Pensado para 15 años, cumpleaños y celebraciones sociales que necesitan una narrativa documental completa.',
    items: [
      'Documentación del evento',
      'Selección curada de 100 a 120 fotos',
      'Narrativa documental',
      'Entrega en formato digital',
      'Entrega en 21 a 30 días calendario',
    ],
  },
];

const weddingPackages = [
  {
    name: 'Colección I · Esencia Ceremonial',
    subtitle: 'Cobertura esencial',
    price: '$850.000 COP',
    items: [
      'Ceremonia y recepción',
      '120 a 150 fotos narrativas',
      'Revelado de autor',
      'Entrega 100% digital',
      'Entrega en 21 a 30 días calendario',
    ],
  },
  {
    name: 'Colección II · Crónica de Autor',
    subtitle: 'Historia completa',
    price: '$1.000.000 COP',
    items: [
      'Preparativos y ceremonia',
      'Recepción y fiesta',
      '150 a 170 fotos narrativas',
      'Énfasis en detalles',
      'Entrega 100% digital',
      'Entrega en 21 a 30 días calendario',
    ],
    featured: true,
  },
  {
    name: 'Colección III · Firma Velozza',
    subtitle: 'Experiencia editorial total',
    price: '$1.200.000 COP',
    items: [
      'Sesión pre-boda antes del evento',
      'Cobertura de preparativos y ceremonia',
      'Entrega de 170 a 220 fotos digitales',
      'Revelado premium y entrega digital',
      'Entrega en 21 a 30 días calendario',
    ],
  },
];

const photobookAddons = [
  {
    name: 'PhotoBook Clásico',
    tagline: 'La opción de entrada, con acabado editorial',
    specs: ['Tamaño 22x28 cm (también en 28x22 vertical, mismo precio)', 'Tapa dura impresa y plastificada', 'Papel satinado', 'Encuadernación tipo Chanel'],
    images: [
      { src: '/photobooks/clasico/clasico-01-portada.jpg', alt: 'Portada horizontal del PhotoBook Clásico con foto de boda impresa y laminado satinado', orientation: 'horizontal' as const },
      { src: '/photobooks/clasico/clasico-05-portada-vertical.jpg', alt: 'Portada vertical del PhotoBook Clásico', orientation: 'vertical' as const },
      { src: '/photobooks/clasico/clasico-03-paginas.jpg', alt: 'Doble página abierta del PhotoBook Clásico mostrando la distribución real de varias fotos en la hoja', orientation: 'horizontal' as const },
      { src: '/photobooks/clasico/clasico-06-pagina-vertical.jpg', alt: 'Página vertical del PhotoBook Clásico con distribución de varias fotos', orientation: 'vertical' as const },
      { src: '/photobooks/clasico/clasico-02-lomo.jpg', alt: 'Detalle del lomo cosido y las hojas del PhotoBook Clásico', orientation: 'horizontal' as const },
      { src: '/photobooks/clasico/clasico-04-textura.jpg', alt: 'Textura macro del laminado satinado de la portada del PhotoBook Clásico', orientation: 'horizontal' as const },
      { src: '/photobooks/clasico/clasico-07-contexto.jpg', alt: 'PhotoBook Clásico sobre una mesa mostrando su tamaño real en contexto', orientation: 'vertical' as const },
      { src: '/photobooks/clasico/clasico-08-cover-atardecer.jpg', alt: 'Portada del PhotoBook Clásico apoyada en una superficie exterior con foto de boda al atardecer', orientation: 'horizontal' as const },
      { src: '/photobooks/clasico/clasico-09-cover-montanoso.jpg', alt: 'Portada del PhotoBook Clásico con paisaje montañoso al atardecer', orientation: 'horizontal' as const },
      { src: '/photobooks/clasico/clasico-10-lomo-rincon.jpg', alt: 'Detalle de esquina y lomo del PhotoBook Clásico con paisaje montañoso al atardecer', orientation: 'vertical' as const },
      { src: '/photobooks/clasico/clasico-11-manos.jpg', alt: 'Manos sosteniendo el PhotoBook Clásico cerrado para mostrar su tamaño real', orientation: 'vertical' as const },
    ],
    tiers: [
      { collection: 'Colección I', capacity: 'hasta 150 fotos · 40 páginas (20 hojas)', price: '$141.500 COP' },
      { collection: 'Colección II', capacity: 'hasta 170 fotos · 44 páginas (22 hojas)', price: '$151.100 COP' },
      { collection: 'Colección III', capacity: 'hasta 220 fotos · 56 páginas (28 hojas)', price: '$179.900 COP' },
    ],
  },
  {
    name: 'PhotoBook Premium',
    tagline: 'La recomendada: papel fotográfico real y apertura total',
    specs: ['Tamaño 21x27 cm horizontal (vertical es 31x21 cm, costo distinto)', 'Tapa dura en papel fotográfico plastificado', 'Papel haluro de plata', 'Encuadernación Layflat, apertura 180°'],
    images: [
      { src: '/photobooks/premium/premium-01-portada.jpg', alt: 'Portada horizontal del PhotoBook Premium con acabado fotográfico brillante', orientation: 'horizontal' as const },
      { src: '/photobooks/premium/premium-05-portada-vertical.jpg', alt: 'Portada vertical del PhotoBook Premium', orientation: 'vertical' as const },
      { src: '/photobooks/premium/premium-03-paginas.jpg', alt: 'Doble página completamente plana del PhotoBook Premium mostrando la distribución real de varias fotos', orientation: 'horizontal' as const },
      { src: '/photobooks/premium/premium-06-pagina-vertical.jpg', alt: 'Página vertical del PhotoBook Premium con distribución de varias fotos', orientation: 'vertical' as const },
      { src: '/photobooks/premium/premium-02-lomo.jpg', alt: 'Detalle del mecanismo Layflat y hojas rígidas del PhotoBook Premium', orientation: 'horizontal' as const },
      { src: '/photobooks/premium/premium-04-textura.jpg', alt: 'Textura macro del acabado fotográfico brillante de la portada del PhotoBook Premium', orientation: 'horizontal' as const },
      { src: '/photobooks/premium/premium-07-contexto.jpg', alt: 'PhotoBook Premium sobre una mesa mostrando su tamaño real en contexto', orientation: 'vertical' as const },
      { src: '/photobooks/premium/premium-08-cover-brillante.jpg', alt: 'Portada brillante del PhotoBook Premium apoyada en una superficie con foto de boda al atardecer', orientation: 'horizontal' as const },
      { src: '/photobooks/premium/premium-09-pagina-abierta.jpg', alt: 'Doble página completamente abierta del PhotoBook Premium con acabado fotográfico brillante', orientation: 'horizontal' as const },
      { src: '/photobooks/premium/premium-10-esquina.jpg', alt: 'Detalle macro de la esquina brillante del PhotoBook Premium', orientation: 'vertical' as const },
      { src: '/photobooks/premium/premium-11-manos.jpg', alt: 'Manos sosteniendo el PhotoBook Premium cerrado para mostrar su tamaño real', orientation: 'vertical' as const },
    ],
    tiers: [
      { collection: 'Colección I', capacity: 'hasta 150 fotos · 38 páginas (19 hojas)', price: '$309.350 COP' },
      { collection: 'Colección II', capacity: 'hasta 170 fotos · 44 páginas (22 hojas)', price: '$344.900 COP' },
      { collection: 'Colección III', capacity: 'hasta 220 fotos · 56 páginas (28 hojas)', price: '$416.000 COP' },
    ],
    featured: true,
  },
  {
    name: 'PhotoBook Lujo · Eco Cuero Cristal',
    tagline: 'La pieza de exhibición: portada en cuero con foto en cristal',
    specs: ['Tamaño 21x27 cm horizontal (vertical es 31x21 cm, costo distinto)', 'Tapa dura en eco cuero con foto en acrílico', 'Papel haluro de plata', 'Encuadernación Layflat, apertura 180°'],
    images: [
      { src: '/photobooks/lujo/lujo-01-portada.jpg', alt: 'Portada horizontal del PhotoBook Lujo en eco cuero con panel de cristal y foto de boda', orientation: 'horizontal' as const },
      { src: '/photobooks/lujo/lujo-05-portada-vertical.jpg', alt: 'Portada vertical del PhotoBook Lujo', orientation: 'vertical' as const },
      { src: '/photobooks/lujo/lujo-03-paginas.jpg', alt: 'Doble página plana del PhotoBook Lujo mostrando la distribución real de varias fotos', orientation: 'horizontal' as const },
      { src: '/photobooks/lujo/lujo-06-pagina-vertical.jpg', alt: 'Página vertical del PhotoBook Lujo con distribución de varias fotos', orientation: 'vertical' as const },
      { src: '/photobooks/lujo/lujo-02-lomo.jpg', alt: 'Detalle del lomo en cuero y mecanismo Layflat del PhotoBook Lujo', orientation: 'horizontal' as const },
      { src: '/photobooks/lujo/lujo-04-textura.jpg', alt: 'Textura macro del cuero y el borde de cristal del PhotoBook Lujo', orientation: 'horizontal' as const },
      { src: '/photobooks/lujo/lujo-07-contexto.jpg', alt: 'PhotoBook Lujo sobre una mesa mostrando su tamaño real en contexto', orientation: 'vertical' as const },
      { src: '/photobooks/lujo/lujo-08-cover-cuero.jpg', alt: 'Portada en eco cuero del PhotoBook Lujo con foto de boda al atardecer', orientation: 'horizontal' as const },
      { src: '/photobooks/lujo/lujo-09-pagina-abierta.jpg', alt: 'Doble página completamente abierta del PhotoBook Lujo con paisaje montañoso al atardecer', orientation: 'horizontal' as const },
      { src: '/photobooks/lujo/lujo-10-esquina.jpg', alt: 'Detalle macro de la esquina en cuero artesanal del PhotoBook Lujo', orientation: 'vertical' as const },
      { src: '/photobooks/lujo/lujo-11-manos.jpg', alt: 'Manos sosteniendo el PhotoBook Lujo cerrado para mostrar su tamaño real', orientation: 'vertical' as const },
    ],
    tiers: [
      { collection: 'Colección I', capacity: 'hasta 150 fotos · 38 páginas (19 hojas)', price: '$369.350 COP' },
      { collection: 'Colección II', capacity: 'hasta 170 fotos · 44 páginas (22 hojas)', price: '$404.900 COP' },
      { collection: 'Colección III', capacity: 'hasta 220 fotos · 56 páginas (28 hojas)', price: '$476.000 COP' },
    ],
  },
];

const portfolioGroups = [
  {
    title: 'Novia · Sesión Editorial',
    subtitle: 'Preparativos, retratos y complicidad en un mismo día de rodaje.',
    images: [
      { src: '/bodas/novia-perfil-elegante-bn.jpg', caption: 'Elegancia en silencio', alt: 'Retrato de perfil de la novia en blanco y negro con tocado de cristales', width: 1466, height: 2200 },
      { src: '/bodas/pareja-editorial-piscina-bn.jpg', caption: 'Frente a frente', alt: 'Pareja de novios espalda con espalda en blanco y negro junto a una piscina', width: 1466, height: 2200 },
      { src: '/bodas/novia-perfil-viento.jpg', caption: 'Brisa y luz', alt: 'Novia de perfil con el cabello al viento y vista a las montañas', width: 1760, height: 2200 },
      { src: '/bodas/boda-novia-vista-ciudad.jpg', caption: 'Frente al horizonte', alt: 'Novia de espaldas contemplando la vista de la ciudad y las montañas', width: 1760, height: 2200 },
      { src: '/bodas/boda-novia-brazos-terraza.jpg', caption: 'Luz de terraza', alt: 'Novia con los brazos en alto sobre una terraza con vista a las montañas', width: 1760, height: 2200 },
      { src: '/bodas/novia-perfil-mano-mejilla-bn.jpg', caption: 'Un instante para sí misma', alt: 'Novia de perfil en blanco y negro con la mano cerca del rostro', width: 1760, height: 2200 },
      { src: '/bodas/boda-retrato-novia-emotiva-bn.jpg', caption: 'Calidez en blanco y negro', alt: 'Retrato emotivo de la novia en blanco y negro con luz cálida', width: 1759, height: 2200 },
      { src: '/bodas/novia-mirada-lateral-verde.jpg', caption: 'Silencio antes del sí', alt: 'Novia apoyada en una pared oscura con mirada lateral', width: 1760, height: 2200 },
      { src: '/bodas/novia-sentada-tacones.jpg', caption: 'Un respiro antes del gran día', alt: 'Novia sentada en un sofá de cuero ajustando sus zapatos', width: 1466, height: 2200 },
      { src: '/bodas/novia-reflejo-espejo.jpg', caption: 'Reflejos de la espera', alt: 'Novia reflejada en un espejo circular durante los preparativos', width: 1760, height: 2200 },
      { src: '/bodas/novia-mano-menton-bn.jpg', caption: 'Pensando en el momento', alt: 'Retrato de la novia en blanco y negro con la mano en el mentón', width: 1466, height: 2200 },
      { src: '/bodas/novia-terraza-ciudad.jpg', caption: 'Mirando el horizonte', alt: 'Novia sentada en una terraza con vista a los edificios de la ciudad', width: 1466, height: 2200 },
      { src: '/bodas/pareja-formal-mirada-bn.jpg', caption: 'Ojos que se encuentran', alt: 'Pareja de novios mirándose fijamente en blanco y negro, ella con esmoquin blanco y negro', width: 1571, height: 2200 },
      { src: '/bodas/novia-velo-ramo-bn.jpg', caption: 'El ramo y el velo', alt: 'Novia sentada con velo y ramo de flores en blanco y negro', width: 1571, height: 2200 },
      { src: '/bodas/boda-novia-ramo-velo.jpg', caption: 'Antes de salir', alt: 'Novia sentada con velo y ramo de flores en un interior cálido', width: 1571, height: 2200 },
      { src: '/bodas/novia-vista-mar.jpg', caption: 'Frente al mar', alt: 'Novia de espaldas contemplando el mar desde una terraza, con un tocado de cristales', width: 1759, height: 2200 },
      { src: '/bodas/novia-lampara-calida.jpg', caption: 'Bajo luz cálida', alt: 'Retrato de la novia bajo una lámpara cálida rodeada de plantas tropicales', width: 1759, height: 2200 },
      { src: '/bodas/novia-mirada-frontal-mar.jpg', caption: 'Mirada de frente', alt: 'Retrato frontal de la novia con el cabello mojado y vista a las montañas', width: 1466, height: 2200 },
      { src: '/bodas/novia-espalda-lampara.jpg', caption: 'Silueta bajo la lámpara', alt: 'Novia de espaldas bajo una lámpara cálida, mirando por encima del hombro', width: 1760, height: 2200 },
    ],
  },
  {
    title: 'Pareja · Jardín Rústico',
    subtitle: 'Una historia de amor contada entre árboles, risas y luz natural.',
    images: [
      { src: '/bodas/boda-velo-abrazo-pareja.jpg', caption: 'Bajo el velo', alt: 'Novios abrazados bajo el velo en un jardín, mejilla con mejilla', width: 1466, height: 2200 },
      { src: '/bodas/boda-pareja-carga-alegria.jpg', caption: 'Volar de la felicidad', alt: 'Novio cargando a la novia entre risas en el jardín', width: 1466, height: 2200 },
      { src: '/bodas/pareja-caballito-alegria.jpg', caption: 'Un vuelo compartido', alt: 'Novia con el brazo extendido al cielo mientras su pareja la carga sonriendo', width: 1466, height: 2200 },
      { src: '/bodas/pareja-abrazo-cofia.jpg', caption: 'Un abrazo sin prisa', alt: 'Novios abrazados con los ojos cerrados en un jardín, ella con flor en la oreja', width: 1466, height: 2200 },
      { src: '/bodas/boda-pareja-flores-jardin.jpg', caption: 'Entre flores', alt: 'Novios mirándose entre flores en primer plano', width: 1571, height: 2200 },
      { src: '/bodas/novia-perfil-jardin-fondo.jpg', caption: 'Caminando hacia él', alt: 'Novia de perfil en primer plano con su pareja desenfocada al fondo del jardín', width: 1466, height: 2200 },
      { src: '/bodas/boda-novia-sonrisa-jardin.jpg', caption: 'Risas en el sendero', alt: 'Novia riendo con los ojos cerrados en un sendero de jardín', width: 1466, height: 2200 },
      { src: '/bodas/pareja-recostados-jardin-bn.jpg', caption: 'El mundo se detiene', alt: 'Novios recostados mirándose fijamente entre bambúes, foto en blanco y negro', width: 2200, height: 1466 },
    ],
  },
  {
    title: 'Pareja · Bajo el Velo',
    subtitle: 'El instante justo antes del sí, capturado con luz de jardín.',
    images: [
      { src: '/bodas/pareja-velo-mirada-azul.jpg', caption: 'Ajustando el velo', alt: 'Novio ajustando el velo de la novia mientras se miran en un jardín', width: 1760, height: 2200 },
      { src: '/bodas/pareja-velo-frente-frente.jpg', caption: 'Bajo el mismo velo', alt: 'Pareja de novios abrazados bajo el velo, frente con frente', width: 1466, height: 2200 },
    ],
  },
  {
    title: 'Novia · Jardín y Lago',
    subtitle: 'Retratos íntimos entre naturaleza, agua en calma y luz dorada.',
    images: [
      { src: '/bodas/boda-retrato-novia-jardin-lago.jpg', caption: 'Un momento de quietud', alt: 'Novia sentada en una banca de hierro en un jardín, con los ojos cerrados', width: 1571, height: 2200 },
      { src: '/bodas/novia-perfil-ciudad-verde.jpg', caption: 'Entre el jardín y la ciudad', alt: 'Novia de perfil con un edificio y árboles de fondo', width: 1466, height: 2200 },
      { src: '/bodas/novia-brazos-cruzados-luz.jpg', caption: 'Un momento de calma', alt: 'Novia con los brazos cruzados y ojos cerrados bajo la luz del sol', width: 1466, height: 2200 },
      { src: '/bodas/novia-caminando-jardin.jpg', caption: 'Paseo entre los árboles', alt: 'Novia caminando de perfil por un sendero de piedra junto a un lago', width: 1571, height: 2200 },
      { src: '/bodas/novia-vestido-lago-jardin.jpg', caption: 'Entre el jardín y el agua', alt: 'Novia de perfil junto a un lago rodeado de vegetación, mirando hacia abajo', width: 1760, height: 2200 },
    ],
  },
  {
    title: 'Momento Real',
    subtitle: 'Porque también documentamos la celebración tal como sucede.',
    images: [
      { src: '/bodas/boda-beso-recepcion.jpg', caption: 'El beso de la fiesta', alt: 'Novios besándose durante la recepción rodeados de invitados', width: 2200, height: 1466 },
      { src: '/bodas/boda-baile-formal-luces.jpg', caption: 'El primer baile', alt: 'Novios bailando en un salón elegante con luces doradas', width: 1571, height: 2200 },
    ],
  },
  {
    title: 'Editorial',
    subtitle: 'La misma dirección de arte, llevada a una sesión de moda atemporal.',
    images: [
      { src: '/bodas/editorial-elegancia-atemporal.jpg', caption: 'Elegancia atemporal', alt: 'Modelo con traje blanco, pañoleta y gafas de sol junto a un lago, estilo editorial en blanco y negro', width: 1571, height: 2200 },
      { src: '/bodas/editorial-mirada-lente-jardin.jpg', caption: 'Actitud en cada detalle', alt: 'Modelo con traje blanco y gafas de sol posando frente a un jardín de bambú', width: 1571, height: 2200 },
    ],
  },
  {
    title: 'XV Años · Vestido Azul',
    subtitle: 'Una noche de cuento en un salón lleno de luces cálidas.',
    images: [
      { src: '/bodas/quince-azul-lampara.jpg', caption: 'La princesa del salón', alt: 'Quinceañera con vestido azul claro bajo una lámpara de fibra natural', width: 1760, height: 2200 },
      { src: '/bodas/quince-azul-arco.jpg', caption: 'Bajo el arco', alt: 'Quinceañera posando dentro de un arco decorativo metálico', width: 1760, height: 2200 },
      { src: '/bodas/quince-azul-recostada.jpg', caption: 'Un instante de ensueño', alt: 'Quinceañera apoyada contra una pared, mirando hacia arriba', width: 1760, height: 2200 },
      { src: '/bodas/boda-quince-vestido-azul.jpg', caption: 'Quince años de magia', alt: 'Quinceañera ajustándose la tiara con vestido azul claro', width: 1760, height: 2200 },
      { src: '/bodas/quince-azul-manos-cintura.jpg', caption: 'Lista para brillar', alt: 'Quinceañera con vestido azul claro y las manos en la cintura', width: 1760, height: 2200 },
    ],
  },
  {
    title: 'XV Años · Vestido Negro y Dorado',
    subtitle: 'Elegancia dramática entre jardines y luz del atardecer.',
    images: [
      { src: '/bodas/boda-quince-vestido-negro.jpg', caption: 'Como una reina', alt: 'Quinceañera con vestido negro y dorado en un jardín de bambú', width: 2200, height: 1467 },
      { src: '/bodas/quince-negro-jardin-sentada.jpg', caption: 'Un respiro de tul', alt: 'Quinceañera sentada con vestido negro y dorado en un jardín', width: 2200, height: 1466 },
      { src: '/bodas/quince-negro-mirada-cielo.jpg', caption: 'Mirando las estrellas', alt: 'Quinceañera con vestido negro y dorado mirando hacia arriba', width: 2200, height: 1466 },
      { src: '/bodas/quince-negro-mirada-atras.jpg', caption: 'Una mirada hacia atrás', alt: 'Quinceañera con vestido negro y dorado mirando por encima del hombro', width: 1467, height: 2200 },
      { src: '/bodas/quince-negro-espalda-jardin.jpg', caption: 'De espaldas al jardín', alt: 'Quinceañera de espaldas con vestido negro y dorado en un jardín', width: 1466, height: 2200 },
    ],
  },
  {
    title: 'XV Años · Vestido Rojo',
    subtitle: 'Una celebración vibrante bajo las luces de la noche.',
    images: [
      { src: '/bodas/quince-rojo-luces.jpg', caption: 'Bajo las luces de la fiesta', alt: 'Quinceañera con vestido rojo bajo una lámpara y luces colgantes', width: 1571, height: 2200 },
      { src: '/bodas/quince-rojo-espalda.jpg', caption: 'Elegancia en rojo', alt: 'Quinceañera con vestido rojo de espalda descubierta bajo las luces', width: 1571, height: 2200 },
    ],
  },
  {
    title: 'Jorge y Paola · Ceremonia',
    subtitle: 'Una boda real contada en blanco y negro, del altar a la salida.',
    images: [
      { src: '/bodas/novia-jorge-silueta-ventana.jpg', caption: 'A contraluz', alt: 'Novia de perfil a contraluz junto a una ventana, en blanco y negro', width: 1466, height: 2200 },
      { src: '/bodas/novia-jorge-perfil-luz.jpg', caption: 'Un respiro antes del sí', alt: 'Retrato de la novia en blanco y negro en un interior luminoso', width: 1466, height: 2200 },
      { src: '/bodas/novia-jorge-mirada-baja.jpg', caption: 'En calma', alt: 'Novia con la mirada baja, retrato en blanco y negro', width: 1466, height: 2200 },
      { src: '/bodas/pareja-jorge-manos-altar.jpg', caption: 'De la mano hacia el altar', alt: 'Novios de espaldas tomados de la mano frente al altar de una iglesia', width: 2200, height: 1466 },
      { src: '/bodas/pareja-jorge-ceremonia-iglesia.jpg', caption: 'Frente al altar', alt: 'Pareja de novios de pie durante la ceremonia religiosa, en blanco y negro', width: 1466, height: 2200 },
      { src: '/bodas/pareja-jorge-altar-flores.jpg', caption: 'El sí frente a todos', alt: 'Novios en el altar rodeados de flores blancas durante la ceremonia', width: 1466, height: 2200 },
      { src: '/bodas/pareja-jorge-salida-iglesia.jpg', caption: 'Ya como esposos', alt: 'Pareja de recién casados saliendo de la iglesia', width: 1466, height: 2200 },
    ],
  },
  {
    title: 'Felipe y Marcela · Luz Cálida',
    subtitle: 'Preparativos, jardín y fiesta contados con luz dorada de atardecer.',
    images: [
      { src: '/bodas/novia-felipe-puerta-madera.jpg', caption: 'Antes de salir', alt: 'Novia con vestido de novia posando frente a una puerta de madera junto a un espejo', width: 1466, height: 2200 },
      { src: '/bodas/novia-felipe-sonrisa-espejo.jpg', caption: 'Una sonrisa de complicidad', alt: 'Novia sonriendo durante los preparativos frente a un espejo', width: 1466, height: 2200 },
      { src: '/bodas/novia-felipe-mirada-lateral.jpg', caption: 'Lista para el gran día', alt: 'Retrato lateral de la novia arreglada para la boda', width: 1467, height: 2200 },
      { src: '/bodas/novia-felipe-satin-abertura.jpg', caption: 'Detalles de satín', alt: 'Novia con vestido de satín con abertura, detalle del diseño', width: 1466, height: 2200 },
      { src: '/bodas/novia-felipe-retrato-calido.jpg', caption: 'Luz cálida de interior', alt: 'Retrato cálido de la novia en un interior con luz natural', width: 1467, height: 2200 },
      { src: '/bodas/pareja-felipe-beso-mano-carruaje.jpg', caption: 'Un beso en la mano', alt: 'Novio besando la mano de la novia sobre un carruaje decorado, en blanco y negro', width: 1466, height: 2200 },
      { src: '/bodas/pareja-felipe-jardin-atardecer.jpg', caption: 'Entre jardín y atardecer', alt: 'Pareja de novios caminando por un jardín durante el atardecer', width: 2200, height: 1466 },
      { src: '/bodas/pareja-felipe-abrazo-risas.jpg', caption: 'Risas compartidas', alt: 'Novios abrazados riendo en el jardín', width: 1466, height: 2200 },
      { src: '/bodas/pareja-felipe-mirada-complice.jpg', caption: 'Miradas cómplices', alt: 'Pareja de novios mirándose con complicidad al aire libre', width: 2200, height: 1466 },
      { src: '/bodas/pareja-felipe-beso-carruaje.jpg', caption: 'El beso del carruaje', alt: 'Novios besándose sobre un carruaje decorado para la boda', width: 2200, height: 1466 },
      { src: '/bodas/pareja-felipe-caminata-jardin.jpg', caption: 'Caminando juntos', alt: 'Pareja de novios caminando tomados de la mano por el jardín', width: 1466, height: 2200 },
      { src: '/bodas/pareja-felipe-danza-luz.jpg', caption: 'El primer baile', alt: 'Novios bailando bajo luces cálidas durante la recepción', width: 1467, height: 2200 },
      { src: '/bodas/pareja-felipe-frente-frente.jpg', caption: 'Frente a frente', alt: 'Novios mirándose frente a frente, retrato íntimo', width: 1466, height: 2200 },
      { src: '/bodas/pareja-felipe-recepcion-noche.jpg', caption: 'La fiesta continúa', alt: 'Novios celebrando durante la recepción nocturna', width: 1760, height: 2200 },
    ],
  },
  {
    title: 'Novia · Instantes',
    subtitle: 'Retratos frescos y naturales, con las montañas siempre de fondo.',
    images: [
      { src: '/bodas/novia-instantes-mirada-montana.jpg', caption: 'Frente a las montañas', alt: 'Retrato de novia con vestido blanco y vista a las montañas', width: 1466, height: 2200 },
      { src: '/bodas/novia-instantes-perfil-suave.jpg', caption: 'Perfil sereno', alt: 'Novia de perfil con expresión serena', width: 1467, height: 2200 },
      { src: '/bodas/novia-instantes-sonrisa-natural.jpg', caption: 'Una sonrisa natural', alt: 'Novia sonriendo de forma natural al aire libre', width: 1760, height: 2200 },
      { src: '/bodas/novia-instantes-luz-dorada.jpg', caption: 'Bajo la luz dorada', alt: 'Retrato de la novia bajo luz dorada de atardecer', width: 1760, height: 2200 },
      { src: '/bodas/novia-instantes-mirada-frontal.jpg', caption: 'Mirada directa', alt: 'Retrato frontal de la novia con mirada segura', width: 1466, height: 2200 },
      { src: '/bodas/novia-instantes-actitud.jpg', caption: 'Con actitud', alt: 'Novia posando con actitud frente a la cámara', width: 1571, height: 2200 },
      { src: '/bodas/novia-instantes-perfil-cielo.jpg', caption: 'Entre cielo y perfil', alt: 'Novia de perfil con el cielo despejado de fondo', width: 1466, height: 2200 },
      { src: '/bodas/novia-instantes-mirada-lateral.jpg', caption: 'Una mirada de lado', alt: 'Retrato lateral de la novia con luz natural', width: 1571, height: 2200 },
    ],
  },
  {
    title: 'Pareja · Elegancia de Autor',
    subtitle: 'Saco a medida, corbatín y una historia contada en primer plano.',
    images: [
      { src: '/bodas/carrusel-pareja-11.jpg', caption: 'Un beso en la puerta', alt: 'Novio con saco oscuro y corbatín besando la frente de la novia frente a una puerta de vidrio', width: 1200, height: 1800 },
      { src: '/bodas/carrusel-pareja-09.jpg', caption: 'Un abrazo de espaldas', alt: 'Novia de espaldas abrazada por su pareja con saco oscuro y corbatín', width: 600, height: 899 },
      { src: '/bodas/carrusel-pareja-07.jpg', caption: 'Frente con frente', alt: 'Novios en blanco y negro frente con frente, él con saco oscuro y corbatín', width: 1200, height: 800 },
    ],
  },
];

const carouselImages = [
  { src: '/bodas/carrusel-pareja-04.jpg', caption: 'Lo mejor de nuestras bodas y eventos sociales', alt: 'Pareja de novios en un momento de complicidad, destacado del portafolio Velozza', width: 1200, height: 1800 },
  { src: '/bodas/carrusel-novia-01.jpg', caption: 'Retrato editorial de novia', alt: 'Retrato editorial de novia destacado del portafolio Velozza', width: 1200, height: 1800 },
  { src: '/bodas/carrusel-pareja-06.jpg', caption: 'Momentos que se sienten cine', alt: 'Pareja de novios en un momento cinematográfico, destacado del portafolio Velozza', width: 1200, height: 1910 },
  { src: '/bodas/carrusel-novia-03.jpg', caption: 'Dirección de arte en cada sesión', alt: 'Retrato de novia con dirección de arte, destacado del portafolio Velozza', width: 2200, height: 1466 },
  { src: '/bodas/carrusel-pareja-08.jpg', caption: 'Historias de amor reales', alt: 'Pareja de novios compartiendo un momento real, destacado del portafolio Velozza', width: 1200, height: 1800 },
  { src: '/bodas/carrusel-novia-05.jpg', caption: 'Elegancia en cada detalle', alt: 'Retrato elegante de novia, destacado del portafolio Velozza', width: 1080, height: 1620 },
  { src: '/bodas/carrusel-pareja-11.jpg', caption: 'La narrativa que vendemos', alt: 'Pareja de novios en un instante narrativo, destacado del portafolio Velozza', width: 1200, height: 1800 },
  { src: '/bodas/carrusel-pareja-01.jpg', caption: 'Composición y luz natural', alt: 'Pareja de novios fotografiada con luz natural, destacado del portafolio Velozza', width: 1200, height: 800 },
  { src: '/bodas/carrusel-novia-02.jpg', caption: 'Cada mirada cuenta una historia', alt: 'Retrato de novia con mirada expresiva, destacado del portafolio Velozza', width: 600, height: 900 },
  { src: '/bodas/carrusel-pareja-05.jpg', caption: 'Celebraciones que se sienten premium', alt: 'Pareja de novios en una celebración con estética premium, destacado del portafolio Velozza', width: 1200, height: 1800 },
  { src: '/bodas/carrusel-pareja-03.jpg', caption: 'Retratos con carácter', alt: 'Pareja de novios en un retrato con carácter, destacado del portafolio Velozza', width: 1200, height: 1064 },
  { src: '/bodas/carrusel-novia-04.jpg', caption: 'La firma visual Velozza', alt: 'Retrato de novia con la firma visual de Velozza, destacado del portafolio Velozza', width: 600, height: 900 },
  { src: '/bodas/carrusel-pareja-07.jpg', caption: 'Emoción documentada con estilo', alt: 'Pareja de novios en un momento emotivo documentado con estilo, destacado del portafolio Velozza', width: 1200, height: 800 },
  { src: '/bodas/carrusel-pareja-09.jpg', caption: 'Cada boda, una producción propia', alt: 'Pareja de novios fotografiada como una producción propia, destacado del portafolio Velozza', width: 600, height: 899 },
  { src: '/bodas/carrusel-pareja-02.jpg', caption: 'Detalles que hacen la diferencia', alt: 'Pareja de novios en un detalle destacado, destacado del portafolio Velozza', width: 600, height: 900 },
  { src: '/bodas/carrusel-pareja-10.jpg', caption: 'Así se ve la mejor cobertura de bodas', alt: 'Pareja de novios en la mejor cobertura de bodas, destacado del portafolio Velozza', width: 1200, height: 800 },
];

const faqs = [
  {
    question: '¿Las tarifas aplican para cualquier zona de Bogotá?',
    answer:
      'Las tarifas publicadas aplican para eventos dentro de Bogotá. Para coberturas fuera de la ciudad, el transporte (y, si aplica, alojamiento) corre por cuenta del cliente; lo coordinamos juntos antes de confirmar la fecha.',
  },
  {
    question: '¿Puedo personalizar un paquete si mi boda tiene otra estructura?',
    answer:
      'Sí. Si tu boda requiere más horas, una segunda sesión o una cobertura distinta, armamos una propuesta a medida manteniendo la línea visual y narrativa de Velozza.',
  },
  {
    question: '¿También cubres otros eventos sociales?',
    answer:
      'Sí. Además de bodas, Velozza cubre quinceañeras, cumpleaños, aniversarios, pedidas de mano y sesiones editoriales previas al evento.',
  },
  {
    question: '¿Cuánto tiempo tardan en entregar las fotos?',
    answer:
      'La entrega estándar va de 21 a 30 días calendario a partir de la fecha del evento, según el volumen de trabajo del momento — esto incluye temporada alta. Si necesitas las fotos antes de ese plazo, ofrecemos entrega prioritaria con un valor adicional — coméntanoslo al cotizar para definir el costo según la urgencia.',
  },
];

export const metadata = generateMetadata({
  title: 'Paquetes de Fotografía para Bodas 2026',
  description:
    'Página exclusiva de paquetes de fotografía social y bodas de Velozza Creative Works. Incluye tarifas 2026, portafolio de bodas y condiciones de cobertura en Bogotá.',
  keywords: [
    'fotografía de bodas bogotá',
    'paquetes de bodas 2026',
    'fotografía eventos sociales bogotá',
    'fotógrafo de bodas velozza',
  ],
  url: '/servicios/bodas',
  image: 'https://velozzacws.com/bodas/boda-pareja-piscina-infinita.jpg',
});

export default function BodasPage() {
  const schema = serviceSchema(
    'Paquetes de Fotografía para Bodas 2026',
    'Cobertura fotográfica premium para bodas y eventos sociales en Bogotá, con paquetes 2026, dirección visual y narrativa cinematográfica.',
    'https://velozzacws.com/bodas/boda-pareja-piscina-infinita.jpg',
    'https://velozzacws.com/servicios/bodas'
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Servicios', href: '/servicios' },
            { name: 'Bodas y Eventos Sociales' },
          ]}
        />

        <section className="section-shell bodas-intro-shell">
          <div className="hero-shell bodas-hero">
            <div className="hero-grid bodas-hero-grid">
              <div>
                <div className="eyebrow">Agenda 2026 abierta</div>
                <h1 className="hero-title bodas-hero-title" style={{ maxWidth: '11ch' }}>
                  Paquetes de bodas 2026 con narrativa, elegancia y una <span className="text-shimmer">firma visual inolvidable</span>
                </h1>
                <p className="hero-copy bodas-hero-copy">
                  Esta página está pensada para mostrar con claridad los paquetes de fotografía de bodas que hoy vendemos en Bogotá. Cada colección cuida los momentos más importantes de tu día con una mezcla de sensibilidad documental, retrato editorial y una entrega visual que se siente premium desde el primer vistazo.
                </p>
                <div className="hero-actions bodas-hero-actions">
                  <a
                    className="cta-primary magnetic"
                    href="https://api.whatsapp.com/send?phone=573193677929&text=Hola%20Velozza%2C%20quiero%20informacion%20sobre%20los%20paquetes%20de%20bodas%202026."
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>

              <div className="hero-side panel panel-pad">
                <figure className="hero-photo-frame">
                  <img src="/bodas/boda-pareja-piscina-infinita.jpg" alt="Pareja de novios abrazados en una piscina infinita frente a las montañas" width={1466} height={2200} draggable={false} />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="panel panel-pad">
            <div style={{ maxWidth: '760px', marginBottom: '24px' }}>
              <div className="eyebrow">Eventos sociales</div>
              <h2 className="section-title">Coberturas para eventos sociales con la misma línea premium</h2>
              <p className="section-lead" style={{ marginBottom: 0 }}>
                Además de bodas, también contamos con propuestas para celebraciones sociales que necesitan verse con criterio, elegancia y una presentación comercial seria. Este bloque complementa la oferta principal y ayuda a mostrar un portafolio de servicio más completo y profesional.
              </p>
            </div>

            <div className="package-grid two-up">
              {socialPackages.map((pkg, i) => (
                <article key={pkg.name} className="package-card social-package tilt reveal premium-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="package-head">
                    <div>
                      <p className="package-kicker">Colección social</p>
                      <h3>{pkg.name}</h3>
                    </div>
                    <div className="package-price">{pkg.price}</div>
                  </div>
                  <p className="muted" style={{ marginTop: 0 }}>{pkg.description}</p>
                  <ul className="package-list">
                    {pkg.items.map((item) => (
                      <li key={item}>
                        <PremiumIcon name="check" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="section-copy">
            <div className="eyebrow">Bodas 2026</div>
            <h2 className="section-title">Paquetes de fotografía de bodas</h2>
            <p className="section-lead">
              Los siguientes planes salen directo del tarifario 2026 y ya están listos para conversión. Presentan una progresión clara: cobertura esencial, historia completa y experiencia editorial total.
            </p>
          </div>

          <div className="package-grid three-up">
              {weddingPackages.map((pkg, i) => (
                <article key={pkg.name} className={`package-card wedding-package tilt reveal premium-card${pkg.featured ? ' featured' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="package-badge">{pkg.subtitle}</div>
                <h3>{pkg.name}</h3>
                <div className="package-price package-price-large">{pkg.price}</div>
                <ul className="package-list">
                  {pkg.items.map((item) => (
                    <li key={item}>
                      <PremiumIcon name="check" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className="cta-secondary package-action"
                  href={`https://api.whatsapp.com/send?phone=573193677929&text=${encodeURIComponent(`Hola Velozza, quiero reservar el ${pkg.name} para mi boda.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consultar este plan
                </a>
              </article>
            ))}
          </div>

          <p className="delivery-note">
            <strong>Tiempo de entrega:</strong> todos los paquetes de fotografía y eventos sociales se entregan entre <strong>21 y 30 días calendario</strong> a partir del evento, incluyendo temporada alta. Si necesitas las fotos antes de ese plazo, la entrega prioritaria tiene un valor adicional.
          </p>

        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="section-copy">
            <div className="eyebrow">Adicional</div>
            <h2 className="section-title">PhotoBook para el recuerdo</h2>
            <p className="section-lead">
              Complementa cualquier colección con un libro de fotos físico, impreso por nuestro aliado de laboratorio. Elige entre 3 acabados; el precio ya está calculado para el tope máximo de fotos de cada colección, así que nunca te vas a quedar corto de espacio.
            </p>
          </div>

          <div className="package-grid three-up">
            {photobookAddons.map((book, i) => (
              <article key={book.name} className={`package-card photobook-card tilt reveal premium-card${book.featured ? ' featured' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                {book.featured ? <div className="package-badge">Recomendado</div> : null}
                <h3>{book.name}</h3>
                <PhotobookCarousel images={book.images} />
                <p className="muted" style={{ marginTop: 0 }}>{book.tagline}</p>
                <ul className="package-list photobook-specs">
                  {book.specs.map((spec) => (
                    <li key={spec}>
                      <PremiumIcon name="check" size={16} />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
                <div className="photobook-tiers">
                  {book.tiers.map((tier) => (
                    <div key={tier.collection} className="photobook-tier-row">
                      <div>
                        <div className="photobook-tier-name">{tier.collection}</div>
                        <div className="photobook-tier-capacity">{tier.capacity}</div>
                      </div>
                      <div className="photobook-tier-price">{tier.price}</div>
                    </div>
                  ))}
                </div>
                <a
                  className="cta-secondary package-action"
                  href={`https://api.whatsapp.com/send?phone=573193677929&text=${encodeURIComponent(`Hola Velozza, quiero agregar el ${book.name} a mi paquete de boda.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Agregar este PhotoBook
                </a>
              </article>
            ))}
          </div>

          <p className="delivery-note">
            <strong>Cómo se calcula este precio:</strong> 1 hoja = 2 páginas. El precio de cada colección está calculado con una diagramación estándar de 4 fotos por página (8 por hoja) y cubre el <strong>tope máximo de fotos</strong> que entrega esa colección — si el cliente entrega menos fotos, le sobran páginas; nunca le faltan. Si el cliente pide una diagramación distinta (menos fotos por página, más fotos de página completa), el número real de hojas —y el precio— puede cambiar; en ese caso se recotiza antes de producir. Precio válido para el tamaño horizontal indicado en cada PhotoBook (22x28 cm en Clásico, 21x27 cm en Premium y Lujo). El formato vertical en Clásico cuesta igual (mismo tamaño de papel); en Premium y Lujo el vertical es una talla mayor (31x21 cm) con costo distinto — se cotiza aparte. Impreso y producido por nuestro aliado de laboratorio fotográfico; precio final sujeto a confirmación con el proveedor al momento de producción.
          </p>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="panel panel-pad portfolio-shell">
            <div className="portfolio-heading">
              <div>
                <div className="eyebrow">Fotos reales</div>
                <h2 className="section-title">Muestra de bodas y eventos sociales</h2>
                <p className="section-lead" style={{ marginBottom: 0 }}>
                  Esta muestra acompaña los paquetes con imágenes reales de nuestro trabajo, organizadas por sesión, para que la decisión de compra tenga claridad visual, estilo y confianza. Dejamos más fotografías aquí para despertar interés y llevar a la gente a ver el catálogo completo.
                </p>
                <p className="section-lead" style={{ marginTop: '10px' }}>
                  ¿No sabes cómo posar el día de tu boda? <Link href="/guia-poses-novias" style={{ color: '#f0d98a' }}>Mira nuestra guía de 70 poses para novias →</Link>
                </p>
              </div>
              <a
                className="cta-secondary"
                href="https://velozzacreative.myportfolio.com/bodas"
                target="_blank"
                rel="noreferrer"
              >
                Abrir catálogo completo
              </a>
            </div>

            {portfolioGroups.map((group) => (
              <div key={group.title} className="portfolio-group">
                <div className="portfolio-group-heading">
                  <h3>{group.title}</h3>
                  <p className="muted">{group.subtitle}</p>
                </div>
                <div className="portfolio-grid">
                  {group.images.map((image, i) => (
                    <figure key={image.src} className="portfolio-card tilt reveal shine-hover" style={{ transitionDelay: `${(i % 6) * 0.06}s` }}>
                      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" draggable={false} />
                      <figcaption>{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <WeddingCarousel
            images={carouselImages}
            title="Lo mejor de nuestro portafolio en bodas y eventos sociales"
            subtitle="Un recorrido en movimiento por nuestras bodas más recientes, antes de dar el siguiente paso."
          />
        </section>

        <section className="section-shell" style={{ paddingTop: 0 }}>
          <div className="panel panel-pad final-cta">
            <div>
              <div className="eyebrow">Reserva</div>
              <h2 className="section-title">Si tu fecha ya está definida, el siguiente paso es cotizarla hoy</h2>
              <p className="section-lead" style={{ marginBottom: 0 }}>
                Si quieres esta misma página funcionando como pieza de venta, ya está preparada para dirigir al cliente a WhatsApp o correo con una oferta clara y un portafolio coherente.
              </p>
            </div>
            <div className="hero-actions bodas-final-actions" style={{ marginTop: 0 }}>
              <Link href="/contacto" className="cta-secondary">
                Ir a contacto
              </Link>
              <a
                className="cta-primary"
                href="https://api.whatsapp.com/send?phone=573193677929&text=Hola%20Velozza%2C%20quiero%20apartar%20mi%20fecha%20para%20boda%20o%20evento%20social."
                target="_blank"
                rel="noreferrer"
              >
                Apartar mi fecha
              </a>
            </div>
          </div>
        </section>

        <FAQ items={faqs} title="Preguntas frecuentes sobre bodas y eventos sociales" />
      </main>

      <style>{`
        .bodas-intro-shell {
          padding-top: 40px;
        }

        .bodas-hero-grid {
          align-items: stretch;
        }

        .bodas-hero-title {
          max-width: 10ch;
        }

        .bodas-hero-copy {
          max-width: 58ch;
        }

        .hero-side {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.08), rgba(18, 18, 18, 0.86));
        }

        .hero-photo-frame {
          margin: 0;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(244, 207, 99, 0.18);
          min-height: 360px;
          background: #080808;
        }

        .hero-photo-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          -webkit-user-drag: none;
          user-select: none;
        }

        .package-kicker,
        .package-kicker,
        .package-badge {
          display: inline-flex;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(244, 207, 99, 0.9);
          font-size: 0.78rem;
        }

        .package-grid {
          display: grid;
          gap: 20px;
        }

        .two-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .three-up {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .catalog-announcement,
        .portfolio-heading,
        .final-cta {
          display: flex;
          gap: 24px;
          justify-content: space-between;
          align-items: end;
        }

        .catalog-announcement {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.14), rgba(18, 18, 18, 0.94));
          border-color: rgba(244, 207, 99, 0.28);
        }

        .catalog-button {
          white-space: nowrap;
        }

        .package-card {
          padding: 24px;
          border-radius: 24px;
          border: 1px solid rgba(244, 207, 99, 0.14);
          background: linear-gradient(180deg, rgba(15, 15, 15, 0.96), rgba(24, 24, 24, 0.92));
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
        }

        .package-card h3 {
          margin: 8px 0 8px;
          font-size: 2rem;
          line-height: 1;
        }

        .package-head {
          display: flex;
          gap: 16px;
          justify-content: space-between;
          align-items: flex-start;
        }

        .package-price {
          color: #f4cf63;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .package-price-large {
          margin-bottom: 18px;
        }

        .package-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }

        .package-list li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 10px;
          align-items: start;
          color: #efe9d6;
        }

        .wedding-package.featured {
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.12), rgba(17, 17, 17, 0.96));
          border-color: rgba(244, 207, 99, 0.32);
          transform: translateY(-6px);
        }

        .photobook-card.featured {
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.12), rgba(17, 17, 17, 0.96));
          border-color: rgba(244, 207, 99, 0.32);
          transform: translateY(-6px);
        }

        .photobook-specs {
          margin-bottom: 20px;
        }

        .photobook-tiers {
          display: grid;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(244, 207, 99, 0.16);
        }

        .photobook-tier-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .photobook-tier-name {
          color: #efe9d6;
          font-size: 0.92rem;
          font-weight: 600;
        }

        .photobook-tier-capacity {
          color: rgba(239, 233, 214, 0.6);
          font-size: 0.78rem;
        }

        .photobook-tier-price {
          color: #f4cf63;
          font-weight: 700;
          font-size: 1rem;
          white-space: nowrap;
        }

        .delivery-note {
          margin: 24px 0 0;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid rgba(244, 207, 99, 0.24);
          background: rgba(212, 175, 55, 0.08);
          color: #efe9d6;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .delivery-note strong {
          color: #f4cf63;
        }

        .package-action {
          width: 100%;
          margin-top: 20px;
        }

        .portfolio-shell {
          overflow: hidden;
        }

        .portfolio-group {
          margin-top: 40px;
        }

        .portfolio-group:first-of-type {
          margin-top: 28px;
        }

        .portfolio-group-heading {
          margin-bottom: 16px;
        }

        .portfolio-group-heading h3 {
          margin: 0 0 4px;
          font-size: 1.3rem;
          color: #f4cf63;
          letter-spacing: -0.01em;
        }

        .portfolio-group-heading p {
          margin: 0;
        }

        .portfolio-grid {
          columns: 3;
          column-gap: 16px;
        }

        .portfolio-card {
          margin: 0 0 16px;
          break-inside: avoid;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #121212;
          transition: border-color 220ms ease, box-shadow 220ms ease;
        }

        .portfolio-card:hover {
          border-color: rgba(244, 207, 99, 0.34);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .portfolio-card img {
          width: 100%;
          height: auto;
          display: block;
          -webkit-user-drag: none;
          user-select: none;
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .portfolio-card:hover img {
          transform: scale(1.06);
        }

        .portfolio-card figcaption {
          padding: 10px 14px;
          font-size: 0.85rem;
          color: #efe9d6;
          background: linear-gradient(180deg, rgba(15, 15, 15, 0.98), rgba(10, 10, 10, 1));
          border-top: 1px solid rgba(244, 207, 99, 0.14);
        }

        @media (max-width: 1100px) {
          .bodas-hero-title {
            max-width: 12ch;
          }
        }

        @media (max-width: 980px) {
          .bodas-intro-shell {
            padding-top: 28px;
          }

          .three-up,
          .two-up {
            grid-template-columns: 1fr 1fr;
          }

          .portfolio-grid {
            columns: 2;
          }

          .bodas-hero-grid {
            gap: 18px;
          }

          .bodas-hero-title {
            max-width: 14ch;
            margin-bottom: 12px;
          }

          .bodas-hero-copy {
            font-size: 0.98rem;
          }

          .hero-photo-frame {
            min-height: 300px;
          }

          .package-card {
            padding: 20px;
          }

          .package-card h3 {
            font-size: 1.7rem;
          }

          .wedding-package.featured {
            transform: none;
          }

          .bodas-hero-actions,
          .bodas-final-actions,
          .catalog-announcement,
          .portfolio-heading,
          .final-cta {
            align-items: flex-start;
            flex-direction: column;
          }

          .bodas-hero-actions a,
          .bodas-final-actions a,
          .catalog-button,
          .portfolio-heading a {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .bodas-intro-shell {
            padding-top: 18px;
          }

          .three-up,
          .two-up {
            grid-template-columns: 1fr;
          }

          .portfolio-grid {
            columns: 1;
          }

          .bodas-hero-title {
            max-width: none;
            font-size: clamp(2.15rem, 11vw, 3.4rem);
            line-height: 0.94;
          }

          .bodas-hero-copy {
            font-size: 0.94rem;
          }

          .eyebrow {
            font-size: 0.74rem;
          }

          .package-head {
            flex-direction: column;
          }

          .package-price {
            white-space: normal;
          }

          .package-card {
            padding: 18px;
          }

          .package-card h3 {
            font-size: 1.45rem;
          }

          .hero-photo-frame {
            min-height: 220px;
          }

          .catalog-announcement,
          .portfolio-shell,
          .final-cta {
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}