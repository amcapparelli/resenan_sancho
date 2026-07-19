# Modal de servicios de promoción — Especificación de diseño v2

Modal que se abre desde el botón `Promocionar` de cada fila de libro en
**Mis libros** (`account-spec.md`, Sección 5). Es el único punto de venta del
producto: aquí la persona autora contrata ejemplares y servicios de difusión
para un libro concreto.

Coherente con `account-spec.md`, `book-detail-spec.md` y
`sistema-diseno-resenan-sancho.md`.

> **v2 (esta versión):** los 4 servicios van en **una sola fila horizontal**,
> con icono, badge, título, precio y botón **alineados en la misma banda** en
> las 4 tarjetas. El servicio gratuito deja de ser un bloque aparte y entra en
> la fila como una tarjeta más.

---

## Stack y restricciones

- Next.js 9.3.1 · **React 18** · TypeScript
- Material UI (`Dialog`) + styled-components
- Fuentes: Fraunces 600 (titulares) · Source Sans 3 400/600 (cuerpo y UI)
- **No Tailwind**
- El pago sigue abriendo el modal de tarjeta existente (Stripe). Esta spec
  **no** rediseña el checkout: termina en el clic del CTA.

---

## Objetivo de la pantalla

Que la persona autora **vea los 4 servicios de un vistazo y los compare sin
scroll**, entendiendo qué gana con cada uno.

Objetivos secundarios:
1. Confirmar sin ambigüedad **para qué libro** está contratando.
2. Hacer visible el estado actual (`X ejemplares disponibles`) para que la
   decisión tenga contexto.
3. Comparación **justa**: mismos elementos, en el mismo sitio, en las 4 tarjetas.

---

## Decisión de layout: fila única con bandas alineadas

Las 4 tarjetas comparten una rejilla con **7 bandas horizontales**. Todas las
tarjetas empiezan y terminan cada banda a la misma altura, independientemente
de la longitud de su texto.

```
        ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
banda 1 │   🎁    │  │   📚    │  │   ⭐    │  │   🚀    │  icono (44px, centrado)
banda 2 │         │  │         │  │  NUEVO  │  │MÁS ELEG.│  badge (reservada aunque vacía)
banda 3 │2 ejempl.│  │ Añade 5 │  │  Libro  │  │ ¡Quiero │  título (Fraunces, centrado)
        │ gratis  │  │ejemplar.│  │destacado│  │acelerar!│
banda 4 │ Gratis  │  │ 9,90 €  │  │  25 €   │  │ 69,90 € │  precio + "pago único"
        ├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤  ← separador .5px
banda 5 │ Empieza │  │ Vuelve a│  │ Leemos  │  │Recomend.│  beneficio + bullets
        │ ✓ ...   │  │ ✓ ...   │  │ ✓ ...   │  │ ✓ ...   │  (banda flexible, 1fr)
        │         │  │         │  │ ✓ ...   │  │ ✓ ...   │
banda 6 │[Activar]│  │[Lo quie]│  │[Lo quie]│  │[Lo quie]│  CTA
banda 7 │Cómo f. ▾│  │Cómo f. ▾│  │Cómo f. ▾│  │Cómo f. ▾│  disclosure (+ panel)
        └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

### Cómo se consigue la alineación (sin JavaScript)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto auto 1fr auto auto;
  gap: 14px;
}
.card {
  grid-row: span 7;
  display: grid;
  grid-template-rows: subgrid;   /* hereda las bandas del padre */
  row-gap: 10px;
}
```

- Cada banda toma la altura del contenido más alto de las 4 tarjetas; las demás
  se acomodan. **El título de dos líneas de una tarjeta empuja la banda entera**,
  así que los precios siguen alineados.
- La **banda 5 es `1fr`**: absorbe todo el espacio sobrante, lo que deja los
  CTA siempre en la misma altura aunque una tarjeta tenga 2 bullets y otra 3.
- **Fallback**: `@supports not (grid-template-rows: subgrid)` → cada tarjeta
  pasa a flex column con `min-height` fijos en las bandas de título (42px) y
  precio (56px). Menos exacto pero suficiente. Subgrid tiene soporte en todos
  los navegadores actuales; el fallback es red de seguridad, no plan A.

### Por qué el disclosure va DEBAJO del CTA (banda 7)

Es el cambio que hace que el layout aguante. Si "Cómo funciona" estuviera antes
del botón, abrirlo empujaría el CTA hacia abajo y rompería la alineación en el
momento en que la persona está comparando. Colocado al final, el panel se
despliega hacia abajo, **fuera de la zona alineada**, y nada se mueve.

### Por qué el servicio gratuito está en la fila

En v1 iba fuera, como bloque aparte. Con fila única, sacarlo obligaría a
recorrerlo aparte y rompería la comparación. Dentro de la fila mantiene su
diferencia con señales suaves: **borde discontinuo**, icono en verde éxito,
precio `Gratis` en verde (no en teja) y **CTA secundario** (borde verde, fondo
transparente) frente a los tres botones sólidos de teja. Se distingue sin
gritar y sin salirse de la rejilla.

---

## Catálogo de servicios (modelo de datos)

El modal recibe un array y lo pinta; no conoce los servicios uno a uno.

```ts
interface PromotionService {
  key: string;              // 'freeCopies' | 'copies5' | 'featuredWeek' | 'boost25'
  free?: boolean;           // trato visual del gratuito
  name: string;             // título de la tarjeta (banda 3)
  priceCents: number;       // 0 → se pinta "Gratis"
  benefit: string;          // una línea, siempre visible
  bullets: string[];        // 2–3 puntos, siempre visibles
  details: string;          // texto largo, plegado tras "Cómo funciona"
  icon: IconKey;
  badge?: 'popular' | 'nuevo';
  ctaLabel: string;
  oneTimeOnly?: boolean;    // el gratuito solo se reclama una vez por libro
}
```

> **Nota sobre crecimiento:** este layout está pensado para **4 servicios en
> una fila**. Con 5, la fila deja de caber cómodamente en escritorio y habrá que
> replantear la estructura (rejilla 3+2, o página propia). Queda anotado, no
> resuelto: no se sacrifica el diseño de hoy por un caso hipotético.

### Contenido de los 4 servicios

**1 · `freeCopies` — `Gratis` · `incluido`** · icono 🎁 · `oneTimeOnly: true`
- **Título:** `2 ejemplares gratis`
- **Beneficio:** `Empieza a recibir solicitudes de reseñadores sin coste.`
- **Bullets:** `2 ejemplares disponibles` · `Aviso por email en cada solicitud`
- **CTA:** `Activar gratis` (secundario verde)
- **Detalle:** Por cada libro puedes ofrecer gratuitamente 2 ejemplares para que
  los reseñadores literarios contacten contigo y te los soliciten. Cada vez que
  alguien solicite un ejemplar te avisaremos por email para que te pongas en
  contacto con esa persona, y se descontará de tus ejemplares disponibles.

**2 · `copies5` — `9,90 €` · `pago único`** · icono 📚
- **Título:** `Añade 5 ejemplares`
- **Beneficio:** `Vuelve a aparecer en las búsquedas cuando se te agoten.`
- **Bullets:** `+5 ejemplares disponibles` · `Acumulable: puedes repetirlo`
- **CTA:** `Lo quiero`
- **Detalle:** Puedes añadir de 5 en 5 tantas veces como quieras; cada compra se
  suma a los ejemplares que ya tengas disponibles. Cada vez que alguien te pida
  un ejemplar te avisaremos por email para que os pongáis en contacto, y se
  descontará de tus ejemplares disponibles.

**3 · `featuredWeek` — `25 €` · `pago único`** · icono ⭐ · badge `nuevo`
- **Título:** `Libro destacado de la semana`
- **Beneficio:** `Leemos tu novela, la sellamos como recomendada y la ponemos
  arriba del todo.`
- **Bullets:** `Sello «Libro recomendado»` · `Posición destacada en la búsqueda`
  · `Durante una semana`
- **CTA:** `Lo quiero`
- **Detalle:** Leemos tu novela y, si la recomendamos, recibe el sello de «Libro
  recomendado» de Reseñan, Sancho. Durante una semana ocupará un lugar destacado
  en la página de búsqueda de libros, por encima del resto de resultados, con el
  sello visible en su portada.
- ⚠️ Funcionalidad **pendiente de desarrollo** (ver Fases).

**4 · `boost25` — `69,90 €` · `pago único`** · icono 🚀 · badge `popular`
- **Título:** `¡Quiero acelerar!`
- **Beneficio:** `Recomendamos tu novela por email a reseñadores de tu género.`
- **Bullets:** `Email a reseñadores de tu género` · `+25 ejemplares disponibles`
  · `Leemos tu novela`
- **CTA:** `Lo quiero`
- **Detalle:** Leemos tu novela y contactamos por email con los reseñadores
  literarios especializados en su género para recomendarla destacando sus
  virtudes. Además añadimos 25 ejemplares disponibles para que puedan
  solicitártelos.

> **Copy:** español neutro en cuanto al género en toda la UI. Claves, nombres de
> variable, componentes y ficheros, en inglés.
>
> **Longitud de los bullets:** máximo ~34 caracteres. Con 4 columnas el ancho
> útil es ~200px; un bullet largo salta a dos líneas y engorda la banda para
> todos. Es la única restricción editorial fuerte de este diseño.

---

## Maquetación por breakpoint

| | Escritorio (≥ 900px) | Tablet (560–899px) | Móvil (< 560px) |
|---|---|---|---|
| Modal | `max-width: 1040px`, radio 14px | `calc(100% - 32px)` | `fullScreen`, radio 0 |
| Rejilla | 4 columnas, subgrid | 2 columnas, flex column | 1 columna |
| Alineación entre bandas | sí (subgrid) | dentro de la fila de 2 | no aplica |
| Cabecera | portada 56×75, título 22px | igual | portada 44×58, título 17px |
| CTA | ancho completo de la columna | igual | ancho completo, 48px alto |

Por debajo de 900px se abandona el subgrid (`grid-template-rows: none`, tarjetas
en flex column con `.b-content { flex: 1 }`): en 2 columnas la alineación
estricta ya no aporta y sí produce huecos feos.

Alto del modal: `max-height: 86vh`; el cuerpo hace `overflow-y: auto`, cabecera
y pie **sticky**. En escritorio la fila debe caber **sin scroll**: es el punto
de todo el rediseño. Si con el contenido real no cupiera, recortar bullets
antes que reducir el tamaño del precio o del CTA.

---

## Componentes y estilos

### Overlay
```
background: rgba(61, 58, 53, 0.55)   ← tinta, no negro
backdrop-filter: blur(2px)
```

### Contenedor del modal
```
background: #FAF6EC             ← fondoApp (área autenticada)
border-radius: 14px             (0 en móvil fullscreen)
box-shadow: 0 24px 60px rgba(61,58,53,.28)
max-width: 1040px; max-height: 86vh
display: flex; flex-direction: column; overflow: hidden
```

### Cabecera (sticky)
```
background: #FBF1D8; border-bottom: 1px solid #d4c9b0
padding: 18px 22px
display: flex; align-items: center; gap: 14px
```
- **Miniatura de portada** 56×75px, `border-radius: 6px`, `object-fit: cover`,
  `box-shadow: 0 2px 6px rgba(61,58,53,.18)`. Fallback: icono sobre `#efe5c8`.
- **Eyebrow** `PROMOCIONA ESTE LIBRO`: Source Sans 3 11px weight 600, uppercase,
  `letter-spacing: .1em`, marrón `#6B4A16`.
- **Título del libro**: Fraunces 600, 22px, tinta, `line-clamp: 2`.
  > Se conserva la intención del titular actual («¡Promociona este libro: X!»)
  > separando etiqueta y título, para que el nombre de la novela sea lo grande.
- **Estado de ejemplares**: punto 8px + texto, Source Sans 3 12px weight 600.
  - `> 0`: punto `#4a9b5f`, `X ejemplares disponibles`, color marrón.
  - `0`: punto teja, `Sin ejemplares · tu libro no aparece en las búsquedas`,
    color teja. **Nunca solo color**: el texto lo dice.
- **Cerrar** `✕`: 40×40px, arriba a la derecha, radio 8px, hover `#efe5c8`.

### Encabezado del cuerpo
`Elige cómo impulsarlo` — Fraunces 600, 18px · subtítulo `Pago único, sin
suscripción.` — Source Sans 3, 13px, `#9a8c7e`.

### Tarjeta (`ServiceCard`)
```
background: #FFFFFF
border: 1px solid #d4c9b0
border-radius: 12px
padding: 18px 16px 16px
row-gap: 10px
transition: transform .15s, box-shadow .15s, border-color .15s

Hover: translateY(-2px); box-shadow 0 8px 20px rgba(61,58,53,.10);
       border-color: #C75B22
Variante popular:  border: 1.5px solid #C75B22; box-shadow: 0 4px 14px rgba(199,91,34,.10)
Variante free:     border-style: dashed
Variante claimed:  background: #FBF1D8
```

### Bandas

**1 · Icono** — círculo 44px, `background: #FBF1D8`, glifo teja, centrado.
En la tarjeta gratuita: fondo `rgba(74,155,95,.10)`, glifo `#3a7a4b`.

**2 · Badge** — banda con `min-height: 20px` **reservada aunque esté vacía**
(es lo que mantiene los títulos alineados). Centrada.
- `popular` → `Más elegido`, fondo mostaza `#F2B705`, texto tinta.
- `nuevo` → `Nuevo`, fondo crema, borde teja, texto teja.
- `done` → `✓ Ya activado`, verde outline (estado del gratuito reclamado).
- 10px weight 600 uppercase, `letter-spacing: .08em`, `padding: 3px 8px`,
  `border-radius: 4px`. **Máximo un `popular` a la vez.**

**3 · Título** — Fraunces 600, 16px, `line-height: 1.28`, centrado, tinta.

**4 · Precio** — centrado, con `border-bottom: .5px solid #e8dfc8` y
`padding-bottom: 10px` (el separador cierra visualmente el bloque "identidad
del servicio" y arranca el de "qué incluye").
- Cifra: Fraunces 600, **26px**, teja `#C75B22`.
- Debajo: `pago único` — Source Sans 3, 11px, `#9a8c7e`.
- Gratuito: cifra `Gratis` a 22px en `#3a7a4b`, subtítulo `incluido`.
- Formateo siempre con `Intl.NumberFormat('es-ES', { style:'currency',
  currency:'EUR' })` a partir de `priceCents`. Nunca precios en el copy.

**5 · Contenido** (`1fr`) — beneficio (Source Sans 3 13px, `line-height 1.5`,
`#5a524a`) + bullets con check `✓` teja (verde en el gratuito), 12.5px, `gap: 5px`.

**6 · CTA**
```
Primario:   background #C75B22; color #fff; 15px weight 600;
            border-radius 8px; width 100%; min-height 46px
            Hover #ad4c1b · Active scale(.985)
            Focus-visible: outline 2px #3D3A35, offset 2px
Secundario (gratuito): fondo transparente; borde 1.5px #4a9b5f; color #3a7a4b
Loading:    spinner 16px + 'Abriendo pago…', disabled
```
> **Por qué teja y no mostaza:** el sistema reserva la mostaza para el CTA
> público «pedir ejemplar» y como acento de marca; la teja es el color de
> confirmar dentro del área personal. Además la mostaza es clara y no admite
> texto blanco.

**7 · Disclosure** `Cómo funciona`
```
Trigger: <button> real, Source Sans 3 13px weight 600, marrón, centrado,
         chevron ▾ que rota 180° al abrir, min-height 32px
Panel:   background #FBF1D8; border-radius 8px; padding 11px 12px;
         Source Sans 3 12.5px; line-height 1.55; color #5a524a
```
- `aria-expanded` + `aria-controls`; panel cerrado con `hidden`.
- **Varios paneles abiertos a la vez** (no acordeón excluyente): querrán comparar.
- `prefers-reduced-motion`: sin animación de altura ni rotación.

### Pie (sticky)
```
background: #FBF1D8; border-top: 1px solid #d4c9b0; padding: 12px 22px
Source Sans 3 12px, marrón
```
`🔒 Pago seguro con tarjeta · Pago único, sin suscripción · ¿Dudas? Escríbenos.`

---

## Estados

**Gratuito ya reclamado** — badge pasa a `✓ Ya activado` (verde), fondo de la
tarjeta a crema, borde discontinuo, y el CTA se **sustituye por texto estático**
en la banda 6: `Ya has añadido tus 2 ejemplares gratuitos de este libro.`
(12.5px, `#9a8c7e`, centrado, alineado abajo). Nunca un botón deshabilitado sin
explicación.

**Servicio deshabilitado por variable de entorno** — **no se renderiza**. La
rejilla ajusta sus columnas al número de servicios activos
(`repeat(n, 1fr)` con n = activos, máximo 4), de modo que con 3 servicios la
fila sigue equilibrada en lugar de dejar un hueco.

**Catálogo vacío** — estado vacío centrado: icono, `Ahora mismo no hay
servicios disponibles`, subtexto `Estamos preparando novedades. Vuelve a
intentarlo en unos días.`, botón `Cerrar`.

**Compra en curso** — el CTA pulsado entra en loading; **los demás CTA se
deshabilitan** (evita dobles compras) pero el modal no se bloquea. El modal de
servicios permanece montado bajo el de pago: al cancelar se vuelve aquí.

**Error al iniciar el pago** — banner sobre la rejilla: `background: #fdf3ee;
border: 1px solid #C75B22; border-radius: 8px; padding: 10px 14px`, icono ⚠ +
`No se pudo abrir el pago. Inténtalo de nuevo.` + acción `Reintentar`.

**Carga del catálogo** — 4 skeletons con la misma estructura de bandas (bloques
`#ede3cb`, shimmer desactivable con `prefers-reduced-motion`).

---

## Accesibilidad

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` apuntando al
  **título del libro** (no a la etiqueta). MUI `Dialog` lo aporta; verificarlo.
- **Foco atrapado**; al abrir, el foco va al contenedor o al título, **no al
  primer CTA** (evita compras accidentales con Enter).
- `Esc` cierra; al cerrar, el foco **vuelve al botón `Promocionar`** que lo abrió.
- Scroll del `body` bloqueado mientras el modal está abierto.
- La rejilla es una `<ul>`; cada tarjeta, un `<li>` con `<article>` dentro.
- Cada CTA con `aria-label` desambiguado: `"Contratar Añade 5 ejemplares para
  {título}"` — hay 4 botones casi idénticos en pantalla.
- **Orden de tabulación:** recorre tarjeta por tarjeta (CTA, luego su
  disclosure), no banda por banda. Con grid es fácil que el orden visual y el
  del DOM se desincronicen: aquí coinciden porque cada tarjeta es un único
  elemento del DOM con sus bandas dentro.
- Touch targets ≥ 44px (CTA 46px; disclosure 32px de alto con padding extendido
  a 44px en móvil).
- `prefers-reduced-motion`: sin `translateY` en hover, sin animación de
  disclosure, sin shimmer.
- Contrastes verificados:
  - Tinta `#3D3A35` sobre blanco / `#FAF6EC`: > 7:1 ✓
  - Blanco sobre teja `#C75B22`: ~4.7:1 ✓ AA
  - `#3a7a4b` sobre blanco: ~4.9:1 ✓ AA
  - Marrón `#6B4A16` sobre blanco: ~5.9:1 ✓
  - Tinta sobre mostaza (badge `popular`): ~6.8:1 ✓
  - `#5a524a` sobre blanco: ~7.5:1 ✓
  - `#9a8c7e` sobre blanco: ~3.1:1 → **solo metadatos no esenciales**
    (`pago único`, nota del reclamado). Nada necesario para decidir va en ese color.

---

## Habilitar / deshabilitar por variable de entorno

### Convención
```
PROMO_SERVICE_FREE_COPIES_ENABLED=true
PROMO_SERVICE_COPIES_5_ENABLED=true
PROMO_SERVICE_FEATURED_WEEK_ENABLED=false
PROMO_SERVICE_BOOST_25_ENABLED=true
```
Valor `'true'` (string) habilita; **cualquier otro valor o su ausencia
deshabilita**. Fallar cerrado es lo correcto en algo que cobra dinero: una
variable mal escrita no debe dejar un servicio activo por accidente. Excepción
razonable: `FREE_COPIES` puede tener default `true`.

### Punto crítico: en Next.js 9 las `NEXT_PUBLIC_*` se congelan en el build

Se **inlinean en el bundle al compilar**, así que cambiarlas en Heroku no haría
nada sin redesplegar — justo lo que se quiere evitar.

- ❌ **No** leer `NEXT_PUBLIC_PROMO_SERVICE_*` desde el componente.
- ✅ El **backend** (Express) expone el catálogo ya filtrado:
  `GET /api/promotion-services` → solo los servicios con flag activo. Node lee
  `process.env` en **runtime**, y Heroku reinicia el dyno al guardar una config
  var: efecto inmediato, sin despliegue.

### Validación en servidor (no negociable)
El filtrado del frontend es **presentación, no seguridad**. El endpoint que crea
la sesión de pago debe **volver a comprobar el flag** del servicio solicitado y
rechazar con `409` si está deshabilitado. Si no, se puede comprar un servicio
apagado llamando a la API directamente.

### Consecuencia para el frontend
`PromoteServicesModal` recibe el catálogo por props (o lo pide al montar) y
**no filtra por sí mismo**: componente puro y testeable.

---

## Componentes sugeridos

```
PromoteServicesModal/
  index.tsx            ← Dialog, cabecera, pie, orquestación de estados
  ModalHeader.tsx      ← portada + título + estado de ejemplares
  ServiceGrid.tsx      ← rejilla subgrid + estados loading/empty/error
  ServiceCard.tsx      ← tarjeta con las 7 bandas
  ServiceDetails.tsx   ← disclosure "Cómo funciona"
  PriceTag.tsx         ← formateo y jerarquía del precio (incluye "Gratis")
  types.ts             ← PromotionService
```

```ts
interface PromoteServicesModalProps {
  open: boolean;
  onClose: () => void;
  book: { id: string; title: string; coverUrl?: string; availableCopies: number };
  services: PromotionService[];           // ya filtrados por el backend
  freeCopiesClaimed: boolean;
  onSelectService: (key: string) => void; // abre el modal de pago
  loading?: boolean;
  error?: string | null;
}

interface ServiceCardProps {
  service: PromotionService;
  bookTitle: string;      // para el aria-label del CTA
  onSelect: () => void;
  busy?: boolean;         // este CTA en loading
  disabled?: boolean;     // otro CTA está en loading
  claimed?: boolean;      // solo aplica al gratuito
}
```

> `ServiceCard` y `ServiceGrid` **no deben saber que están dentro de un modal**:
> si algún día esto crece a una página propia, se reutilizan tal cual.

---

## Propuesta al sistema de diseño

1. **`Badge` / `Pill`** (variantes `popular` mostaza, `nuevo` teja outline,
   `exito` verde). Ya aparecía informalmente en `books-spec.md` y
   `account-spec.md`. Unificarlo.
2. **`Disclosure`** (trigger + panel con `aria-expanded`): se repite en Ayuda
   del área personal y aquí.
3. **`PriceTag`**: formateo de moneda + jerarquía tipográfica, con caso `Gratis`.
4. **`Modal` base del producto**: overlay tinta + blur, cabecera/pie sticky,
   `fullScreen` bajo 560px, foco atrapado y retorno de foco. Hoy cada modal
   (contactar autora, eliminar cuenta, este) lo resuelve por su cuenta.
5. **Patrón `AlignedCardRow`** (rejilla subgrid con bandas): reutilizable en
   cualquier comparativa futura de opciones.

---

## Notas de implementación por fases

**Fase 1 (ahora):** rediseño del modal + catálogo declarativo + flags de
entorno + endpoint filtrado + validación en el pago.
`featuredWeek` se lanza con flag en **`false`** hasta que exista la
funcionalidad: el catálogo ya lo contempla y nadie puede comprarlo. Cuando esté
listo, se pone a `true` sin desplegar.

**Fase 2 (después):** funcionalidad real de "Libro destacado de la semana"
(sello en la portada, ordenación en `/books`, posible bloque en la home,
caducidad semanal). Necesitará spec propia: al menos un campo `featuredUntil`
en el modelo de libro y una decisión sobre qué ocurre si hay más de un
destacado activo a la vez.

---

*Para implementar: delegar en `senior-frontend` con este documento, más
`account-spec.md` y `sistema-diseno-resenan-sancho.md` como contexto. El
endpoint, los flags y la validación del pago van a `senior-backend` (atención a
la regla de Stripe: cambios verificados solo en modo test).*
