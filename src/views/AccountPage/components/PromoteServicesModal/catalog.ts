import { PromotionService } from './types';

/**
 * Temporary frontend catalogue.
 *
 * The modal never reads this file: it receives the services through props, so
 * the day the backend exposes `GET /promotion-services` (with `enabled`
 * resolved from `process.env` at runtime) the only change is where
 * `MyBooksSection` gets the array from. Delete this file then.
 *
 * `id` is the value the payments backend maps to copies and price — do not
 * renumber it.
 */
const promotionServices: PromotionService[] = [
  {
    key: 'freeCopies',
    id: 1,
    copies: 2,
    priceCents: 0,
    enabled: true,
    available: true,
    free: true,
    oneTimePerBook: true,
    name: '2 ejemplares gratis',
    benefit: 'Tu libro entra en las búsquedas y pueden pedírtelo.',
    bullets: [
      '+2 ejemplares disponibles',
      'Aviso por email en cada solicitud',
      'Solo una vez por libro',
    ],
    details: 'Puedes ofrecer 2 ejemplares gratis de cada libro que subas. Cuando alguien quiera reseñarlo, te avisamos por email con sus datos para que os pongáis en contacto y le hagas llegar el ejemplar. Cada solicitud descuenta uno de tus ejemplares disponibles; cuando llegan a cero, el libro deja de aparecer en las búsquedas.',
    icon: 'gift',
    ctaLabel: 'Activar gratis',
  },
  {
    key: 'copies5',
    id: 2,
    copies: 5,
    priceCents: 990,
    enabled: true,
    available: true,
    name: 'Añade 5 ejemplares',
    benefit: 'Recarga ejemplares y sigue recibiendo solicitudes.',
    bullets: [
      '+5 ejemplares disponibles',
      'Se suman a los que ya tienes',
      'Sin caducidad',
    ],
    details: 'Puedes comprar packs de 5 ejemplares tantas veces como quieras: cada compra se suma a los que ya tengas disponibles. Cuando alguien te pida uno, te avisamos por email con sus datos para que os pongáis en contacto, y se descuenta de tu total.',
    icon: 'books',
    ctaLabel: 'Añadir 5 ejemplares',
  },
  {
    key: 'featuredWeek',
    id: 4,
    copies: 0,
    priceCents: 2490,
    // Launches switched off: the feature (badge, ranking, weekly expiry) does
    // not exist yet, so nobody can buy it.
    enabled: false,
    available: false,
    name: 'Libro destacado de la semana',
    benefit: 'Lo leemos y, si lo recomendamos, sube arriba del todo una semana.',
    bullets: [
      'Sello «Libro recomendado»',
      'Posición destacada en la búsqueda',
      'Durante una semana',
    ],
    details: 'Leemos tu libro y, si lo recomendamos, recibe el sello «Libro recomendado» de Reseñan, Sancho. Durante una semana aparecerá en un lugar destacado de la búsqueda de libros, por encima del resto de resultados y con el sello visible en su portada. Si al leerlo decidimos no recomendarlo, te lo decimos y te devolvemos el importe íntegro.',
    icon: 'star',
    badge: 'nuevo',
    ctaLabel: 'Destacar mi libro',
    ctaNote: 'Si no lo recomendamos, te devolvemos el importe.',
  },
  {
    key: 'boost25',
    id: 3,
    copies: 25,
    priceCents: 6990,
    enabled: true,
    available: true,
    requiresPaperFormat: true,
    name: 'Acelera tu libro',
    benefit: 'Recomendamos tu libro por email a reseñadores de tu género.',
    bullets: [
      'Email a reseñadores de tu género',
      '+25 ejemplares disponibles',
      'Leemos tu libro',
    ],
    details: 'Leemos tu libro y escribimos por email a los reseñadores especializados en su género para recomendárselo, destacando lo que más nos ha gustado. Además añadimos 25 ejemplares disponibles, para que quien se interese pueda pedírtelo en cuanto reciba nuestro correo. Funciona mejor cuando puedes enviar ejemplares en papel: es lo que más se pide, así que pedimos que tu libro tenga ese formato disponible. Se contrata una sola vez por libro — repetirlo llegaría a los mismos reseñadores y ya no tendría el mismo efecto.',
    icon: 'rocket',
    badge: 'topReach',
    ctaLabel: 'Acelerar mi libro',
  },
];

export default promotionServices;
