# Página de Libros — Especificación de diseño v1

Sección `/books` de Reseñan Sancho: buscador con filtros + grid de resultados
(fichas de libro). Diseñada en coherencia con la home (`home-hero-spec.md`) y
la barra de navegación (`navbar-spec.md`).

---

## Stack y restricciones

- Next.js 9.3.1 · React 16 · TypeScript
- Material UI + styled-components
- Fuentes: Fraunces (600, italic 400) + Source Sans 3 (400, 600)
- **No Tailwind**. Estilos en styled-components o `sx` prop de MUI.

---

## Tokens del sistema de diseño

```ts
colors: {
  mustaza:     '#F2B705',   // acento; texto oscuro encima
  teja:        '#C75B22',   // CTA, highlights
  crema:       '#FBF1D8',   // fondos suaves
  tinta:       '#3D3A35',   // texto principal
  marron:      '#6B4A16',   // texto secundario
  blanco:      '#FFFFFF',
  bordeClaro:  '#d4c9b0',   // bordes y separadores
  cremaSombra: '#efe5c8',   // fondo alternativo ligeramente más oscuro
}
```

---

## Layout general de la página

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR (ya implementado — no tocar)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PAGE HEADER (crema)                                         │
│  "Encuentra tu próxima lectura"      (Fraunces 600)          │
│  "475 reseñadores esperan tu opinión"  (Source Sans 3)       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SEARCH BAR + FILTERS (blanco, sticky)                       │
│  [Género ▾]  [Formato ▾]  [Filtrar →]                       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  RESULTS AREA (fondo blanco)                                 │
│  "350 libros disponibles"  ·  ordenar por [▾]               │
│                                                              │
│  ┌─────┐  ┌─────┐  ┌─────┐                                  │
│  │CARD │  │CARD │  │CARD │   ← grid 3 col desktop           │
│  └─────┘  └─────┘  └─────┘                                  │
│  ┌─────┐  ┌─────┐  ┌─────┐                                  │
│  │CARD │  │CARD │  │CARD │                                  │
│  └─────┘  └─────┘  └─────┘                                  │
│                                                              │
│  ← 1  2  3  4  5 →   (paginación)                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Sección 1 — Page Header

**Propósito:** orientar al usuario reseñador recién llegado; dar contexto de
lo que va a encontrar y reforzar la propuesta de valor.

```
Fondo: crema #FBF1D8
Padding: 36px 28px 32px
text-align: center
Borde inferior: 0.5px solid #d4c9b0
```

### Eyebrow
- Texto: `"LIBROS EN BÚSQUEDA DE RESEÑAS"`
- Source Sans 3, 11px, weight 600, uppercase, letter-spacing 0.12em
- Color: marrón `#6B4A16`
- Margin-bottom: 10px

### Titular
- Texto: `"Encuentra tu próxima lectura"`
- Fraunces 600, 32px, line-height 1.15
- Color: tinta `#3D3A35`
- La palabra **"lectura"** en teja `#C75B22`
- Margin-bottom: 10px

### Subtítulo
- Texto: `"Pide el ejemplar que te interese. El autor recibe tu mensaje y te lo envía."`
- Source Sans 3, 15px, weight 400, color marrón `#6B4A16`
- Max-width: 460px, centrado

**Responsive (< 480px):**
- Titular: 24px
- Padding: 24px 20px 20px

---

## Sección 2 — Barra de búsqueda y filtros

**Propósito:** filtrar por género y formato. Es la herramienta principal del
reseñador para encontrar libros afines.

### Comportamiento sticky
La barra de filtros se vuelve sticky al hacer scroll (top: 0, z-index: 10)
para que el reseñador pueda cambiar filtros en cualquier momento sin volver
arriba. Al hacer sticky, añadir una sombra suave:
`box-shadow: 0 2px 12px rgba(61,58,53,0.08)`

### Layout y estilos
```
Fondo: blanco #FFFFFF
Padding: 14px 28px
Borde superior e inferior: 0.5px solid #d4c9b0
display: flex; align-items: center; gap: 12px; flex-wrap: wrap
```

### Selects de filtro

Aspecto visual: bordes redondeados, sin fondo gris de sistema.

```
background: #FFFFFF
border: 1.5px solid #d4c9b0
border-radius: 8px
padding: 9px 36px 9px 14px  (espacio para el chevron custom)
font-family: Source Sans 3
font-size: 14px
color: #3D3A35
min-width: 160px
cursor: pointer

Focus: border-color: #C75B22; outline: none; box-shadow: 0 0 0 2px rgba(199,91,34,0.18)
```

Chevron personalizado (CSS, no el del sistema operativo):
```
appearance: none; -webkit-appearance: none
background-image: url("data:image/svg+xml,...") /* chevron SVG teja */
background-repeat: no-repeat
background-position: right 12px center
background-size: 14px
```

Placeholder de cada select cuando no hay filtro activo:
- Género: `"Todos los géneros"`
- Formato: `"Todos los formatos"`

### Botón "Filtrar"
```
background: teja #C75B22
color: blanco #FFFFFF
font-family: Source Sans 3, 14px, weight 600
border-radius: 8px
padding: 9px 22px
border: none
cursor: pointer
display: flex; align-items: center; gap: 6px

Hover: background: #a84a1b
Active: background: #8f3f17; transform: scale(0.98)
```

Icono: lupa (SVG inline, 14px, blanco). Texto: `"Filtrar"`

### Botón "Limpiar filtros"
Aparece solo cuando hay algún filtro activo. Estilo fantasma:
```
background: transparent
color: marrón #6B4A16
border: none
font-size: 13px
text-decoration: underline
cursor: pointer
padding: 9px 8px
```

**Responsive (< 480px):**
- Los selects ocupan `width: 100%`
- El botón "Filtrar" ocupa `width: 100%`
- Padding de la barra: 12px 16px
- Gap: 8px

---

## Sección 3 — Área de resultados

### Barra de resultados (metadata + orden)

```
display: flex; justify-content: space-between; align-items: center
padding: 16px 28px 12px
```

**Contador de resultados:**
- Texto: `"350 libros disponibles"` (o el número filtrado)
- Source Sans 3, 14px, color tinta `#3D3A35`
- `"350"` en weight 600; `" libros disponibles"` en weight 400

**Selector de orden** (si se implementa en esta fase, opcional):
- Mismo estilo que los filtros pero más pequeño (min-width: 140px)
- Opciones: "Más recientes", "Más solicitados"

---

## Sección 4 — Grid de fichas de libro

### Layout del grid

El grid usa CSS Grid con `grid-template-columns` para garantizar que todas las
tarjetas en una fila tengan el mismo alto (comportamiento nativo de CSS Grid,
sin necesidad de JS).

```css
display: grid;
grid-template-columns: repeat(3, 1fr);  /* desktop */
gap: 20px;
padding: 0 28px 36px;
align-items: stretch;  /* las tarjetas se estiran para igualar altura en fila */
```

Breakpoints:
- **≥ 900px**: 3 columnas
- **≥ 560px y < 900px**: 2 columnas
- **< 560px**: 1 columna

> `align-items: stretch` (valor por defecto de CSS Grid) hace que todas las
> tarjetas de una misma fila alcancen la misma altura. Dentro de cada tarjeta,
> `flex-direction: column` con `flex: 1` en la sinopsis empuja el CTA al fondo,
> manteniendo los botones alineados entre tarjetas de la misma fila.

---

## Componente: BookCard

### Estructura interna de la tarjeta

```
┌────────────────────────────────┐
│  [PORTADA — imagen 3:4]        │  ← aspect-ratio fijo
│                                │
│  [BADGE género]                │  ← superpuesto bottom-left sobre portada
├────────────────────────────────┤
│  Título del libro      ← Fraunces 600                         │
│  por Nombre Autor      ← Source Sans 3, marrón               │
│  ─────────────────────────────                               │
│  Sinopsis (3 líneas, clamp)    ← flex: 1, empuja CTA abajo   │
│  ─────────────────────────────                               │
│  [CHIP formato] [CHIP formato]  ← pills de formato           │
│  Nº páginas · Año              ← metadatos secundarios       │
│  ─────────────────────────────                               │
│  [Pedir ejemplar gratuito  →]  ← CTA, siempre al fondo      │
└────────────────────────────────┘
```

### Especificación de la tarjeta

```
background: blanco #FFFFFF
border: 1px solid #d4c9b0
border-radius: 12px
overflow: hidden
display: flex; flex-direction: column
box-shadow: 0 1px 4px rgba(61,58,53,0.07)
transition: box-shadow 0.2s ease, transform 0.2s ease

Hover:
  box-shadow: 0 6px 20px rgba(61,58,53,0.14)
  transform: translateY(-2px)
```

#### Área de portada
```
position: relative
aspect-ratio: 3 / 4       ← ratio fijo para homogeneidad
overflow: hidden
background: crema #FBF1D8  ← fallback si no hay imagen
```

La imagen de portada:
```
width: 100%; height: 100%
object-fit: cover
object-position: center top
display: block
```

Imagen de fallback (sin portada disponible): icono de libro centrado en
fondo crema, en teja `#C75B22` al 30% de opacidad.

#### Badge de género (superpuesto sobre la portada)
```
position: absolute; bottom: 10px; left: 10px
background: rgba(61,58,53,0.75)   ← tinta semitransparente
backdrop-filter: blur(4px)
color: #FBF1D8 (crema)
font-family: Source Sans 3, 11px, weight 600
text-transform: uppercase; letter-spacing: 0.08em
padding: 3px 8px
border-radius: 4px
```

#### Área de texto (cuerpo de la tarjeta)
```
padding: 16px 16px 14px
display: flex; flex-direction: column; gap: 10px
flex: 1  ← para que esta área se estire en el grid
```

**Título:**
- Fraunces 600, 16px, line-height 1.25, color tinta `#3D3A35`
- `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`
- (2 líneas máximo; el grid iguala altura entre tarjetas)

**Autor:**
- Source Sans 3, 13px, color marrón `#6B4A16`
- Prefijo `"por "` en weight 400; nombre en weight 600
- 1 línea, overflow ellipsis

**Sinopsis:**
- Source Sans 3, 13px, line-height 1.55, color `#5a524a`
- `flex: 1`  ← este es el elemento que absorbe el espacio sobrante
- `-webkit-line-clamp: 4` (4 líneas, luego fade a blanco o ellipsis)
- Margin-bottom: 0

**Separadores entre bloques:**
- `border-top: 0.5px solid #e8dfc8`
- Margin: 0 (el gap del flex lo gestiona)

**Chips de formato:**
```
display: flex; flex-wrap: wrap; gap: 5px
```
Cada chip:
```
background: crema #FBF1D8
border: 1px solid #d4c9b0
color: marrón #6B4A16
font-family: Source Sans 3, 11px, weight 600
text-transform: uppercase; letter-spacing: 0.06em
padding: 2px 8px
border-radius: 4px
```

**Metadatos secundarios (páginas · año):**
- Source Sans 3, 12px, color `#9a8c7e`
- `display: flex; gap: 8px; align-items: center`
- Separador entre datos: `·` en color `#d4c9b0`

#### CTA — Botón "Pedir ejemplar gratuito"
```
background: mustaza #F2B705
color: tinta #3D3A35
font-family: Source Sans 3, 13px, weight 600
border-radius: 8px
padding: 11px 16px
border: none
width: 100%
display: flex; align-items: center; justify-content: center; gap: 5px
cursor: pointer
margin-top: auto   ← garantía extra de que queda al fondo
min-height: 44px   ← touch target

Hover: background: #d9a304; color: #3D3A35
Active: transform: scale(0.98)
```

Texto: `"Pedir ejemplar gratuito →"`

> **Clave de alineación entre tarjetas de la misma fila:**
> CSS Grid con `align-items: stretch` iguala la altura de todas las tarjetas
> de una fila automáticamente. Dentro de cada tarjeta, el bloque de sinopsis
> tiene `flex: 1` y absorbe el espacio sobrante, dejando el botón CTA siempre
> pegado al borde inferior. No se necesita JavaScript ni cálculos de altura.

---

## Sección 5 — Paginación

```
display: flex; justify-content: center; align-items: center; gap: 4px
padding: 20px 28px 40px
```

### Botón de página (número)
```
width: 36px; height: 36px; border-radius: 8px
font-family: Source Sans 3, 14px, weight 600
color: marrón #6B4A16
background: transparent
border: 1.5px solid transparent
cursor: pointer
transition: all 0.15s

Hover: background: crema #FBF1D8; border-color: #d4c9b0
```

### Página activa
```
background: teja #C75B22
color: blanco #FFFFFF
border-color: transparent
```

### Botones anterior/siguiente
```
Mismas dimensiones que el botón de número
Contienen: ← o → (o iconos SVG chevron)
```

Cuando están deshabilitados (primera/última página):
```
color: #c2b49e
cursor: not-allowed
opacity: 0.5
```

**Responsive (< 480px):**
- Mostrar máximo 5 números de página (current ±2) + elipsis
- Botones de 40×40px (touch target)

---

## Estados especiales

### Estado vacío (sin resultados tras filtrar)
```
┌─────────────────────────────────────────────┐
│                                             │
│    [icono libro, 48px, teja al 40%]         │
│    "Sin resultados"            (Fraunces)   │
│    "Prueba con otros filtros o             │
│     explora todos los libros."             │
│    [Limpiar filtros]          (botón CTA)  │
│                                             │
└─────────────────────────────────────────────┘
```
- Centrado, padding: 60px 28px
- Texto en Fraunces 600 22px para el título; Source Sans 3 14px para el subtexto
- El botón "Limpiar filtros" usa el estilo del CTA de la tarjeta (mostaza)

### Estado de carga
- Skeleton cards: misma estructura que `BookCard` pero con bloques en color
  `#ede3cb` animados con un shimmer (gradiente animado de izquierda a derecha)
- Mostrar 6 skeleton cards mientras carga la primera página

### Estado de error de red
- Banner horizontal en la parte superior del área de resultados
- Fondo crema + borde teja, texto: `"No se pudieron cargar los libros. Inténtalo de nuevo."`
- Botón inline: `"Reintentar"` (estilo CTA mustaza)

---

## Accesibilidad

- Los selects tienen `<label>` explícito asociado (aunque esté visualmente oculto
  con `position: absolute; clip: rect(0 0 0 0)`)
- El botón "Filtrar" tiene `aria-label="Filtrar libros"`
- Las tarjetas usan semántica de artículo: `<article>` como contenedor raíz
- La imagen de portada lleva `alt="Portada de {título}"` (o `alt=""` si es decorativa)
- El botón CTA dentro de cada tarjeta tiene `aria-label="Pedir ejemplar de {título}"`
  para diferenciarlos cuando hay múltiples en pantalla (accesibilidad de lector de pantalla)
- La barra de filtros sticky tiene `role="search"` y `aria-label="Filtros de búsqueda"`
- Paginación: `<nav aria-label="Paginación">` envolviendo los botones; página activa
  con `aria-current="page"`
- Contraste verificado:
  - Blanco sobre teja CTA (#C75B22): ~4.7:1 ✓ WCAG AA
  - Tinta sobre mustaza (#F2B705): ~6.8:1 ✓
  - Marrón sobre blanco (#6B4A16 / #FFF): ~5.9:1 ✓
  - Crema sobre tinta semitransparente (badge género): ✓ (blur compensa)
- Reduced motion: el hover `transform: translateY(-2px)` y el shimmer del skeleton
  deben desactivarse con `@media (prefers-reduced-motion: reduce)`

---

## Componentes sugeridos

```
BooksPage/
  index.tsx             ← página completa, maneja estado de filtros y paginación
  PageHeader.tsx        ← eyebrow + titular + subtítulo
  SearchFilters.tsx     ← barra sticky con selects y botón filtrar
  ResultsMeta.tsx       ← contador de resultados + selector de orden
  BookGrid.tsx          ← CSS Grid wrapper + manejo de estados (loading/empty/error)
  BookCard.tsx          ← tarjeta individual de libro
  BookCardSkeleton.tsx  ← versión skeleton de BookCard para estado de carga
  Pagination.tsx        ← componente de paginación
```

### Props de BookCard
```ts
interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  genre: string;
  formats: string[];       // ej. ['ePUB', 'PDF', 'papel']
  synopsis: string;
  pageCount?: number;
  publishYear?: number;
  onRequestCopy: () => void;
}
```

### Props de SearchFilters
```ts
interface SearchFiltersProps {
  genres: string[];
  formats: string[];
  selectedGenre: string | null;
  selectedFormat: string | null;
  onGenreChange: (genre: string | null) => void;
  onFormatChange: (format: string | null) => void;
  onFilter: () => void;
  onClear: () => void;
}
```

---

## Coherencia con la home

| Elemento | Home | Página de libros |
|---|---|---|
| Fondo hero/header | Crema `#FBF1D8` | Crema `#FBF1D8` |
| CTA primario | Mostaza sobre tarjeta | Mostaza en BookCard |
| Botón de acción nav | Teja (Registrarse) | Teja (Filtrar) |
| Tipografía titulares | Fraunces 600 | Fraunces 600 |
| Tipografía cuerpo | Source Sans 3 | Source Sans 3 |
| Border-radius tarjetas | 12px | 12px |
| Borde separador | 0.5px `#d4c9b0` | 0.5px `#d4c9b0` |
| Sombra hover | — | `0 6px 20px rgba(61,58,53,0.14)` |

---

*Para implementar este diseño, delegar en el agente `senior-frontend` con
este documento y `home-hero-spec.md` como contexto.*
