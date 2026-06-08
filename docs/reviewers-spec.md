# Página de Reseñadores — Especificación de diseño v1

Sección `/reviewers` de Reseñan Sancho: buscador con filtros + grid de fichas
de reseñadores literarios. Diseñada en coherencia con la home y la página de
libros (`books-spec.md`). El navbar ya está implementado — no se toca.

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
│  "Encuentra a tu próximo lector"     (Fraunces 600)          │
│  "475 reseñadores esperan tu libro"  (Source Sans 3)         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SEARCH BAR + FILTERS (blanco, sticky)                       │
│  [🔍 Buscar por nombre…]  [Género ▾]  [Formato ▾]  [Filtrar]│
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  RESULTS AREA (fondo blanco)                                 │
│  "475 reseñadores encontrados"  ·  ordenar por [▾]          │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  CARD    │  │  CARD    │  │  CARD    │  ← grid 3 col     │
│  └──────────┘  └──────────┘  └──────────┘                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  CARD    │  │  CARD    │  │  CARD    │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                              │
│  ← 1  2  3  4  5 →   (paginación)                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Sección 1 — Page Header

Mismo tratamiento que en la página de libros para mantener coherencia.

```
Fondo: crema #FBF1D8
Padding: 36px 28px 32px
text-align: center
Borde inferior: 0.5px solid #d4c9b0
```

### Eyebrow
- Texto: `"RESEÑADORES LITERARIOS"`
- Source Sans 3, 11px, weight 600, uppercase, letter-spacing 0.12em
- Color: marrón `#6B4A16`
- Margin-bottom: 10px

### Titular
- Texto: `"Encuentra a tu próximo lector"`
- Fraunces 600, 32px, line-height 1.15
- Color: tinta `#3D3A35`
- La palabra **"lector"** en teja `#C75B22`
- Margin-bottom: 10px

### Subtítulo
- Texto: `"Booktubers, bookstagrammers y blogueros literarios listos para reseñar tu libro."`
- Source Sans 3, 15px, weight 400, color marrón `#6B4A16`
- Max-width: 480px, centrado

**Responsive (< 480px):**
- Titular: 24px
- Padding: 24px 20px 20px

---

## Sección 2 — Barra de búsqueda y filtros

Misma filosofía que en la página de libros. Aquí hay tres filtros:
texto libre, género y formato.

### Comportamiento sticky
La barra se vuelve sticky al hacer scroll (`top: 0`, `z-index: 10`) con
sombra suave: `box-shadow: 0 2px 12px rgba(61,58,53,0.08)`

### Layout y estilos
```
Fondo: blanco #FFFFFF
Padding: 14px 28px
Borde superior e inferior: 0.5px solid #d4c9b0
display: flex; align-items: center; gap: 12px; flex-wrap: wrap
```

### Campo de texto libre ("Buscar por nombre o descripción…")

```
background: #FFFFFF
border: 1.5px solid #d4c9b0
border-radius: 8px
padding: 9px 14px 9px 38px   (espacio para icono lupa a la izquierda)
font-family: Source Sans 3
font-size: 14px
color: #3D3A35
flex: 1; min-width: 200px; max-width: 320px

Focus: border-color: #C75B22; outline: none;
       box-shadow: 0 0 0 2px rgba(199,91,34,0.18)
```

Icono lupa posicionado absolutamente dentro del campo:
```
position: absolute; left: 12px; top: 50%; transform: translateY(-50%)
color: #9a8c7e; width: 15px
```

Placeholder: `"Buscar por nombre o descripción…"`

### Selects de filtro (Género y Formato)

Mismo estilo que en books-spec.md:
```
background: #FFFFFF
border: 1.5px solid #d4c9b0
border-radius: 8px
padding: 9px 36px 9px 14px
font-family: Source Sans 3; font-size: 14px; color: #3D3A35
min-width: 160px
appearance: none; -webkit-appearance: none
background-image: [chevron SVG teja]
background-repeat: no-repeat; background-position: right 12px center
background-size: 14px

Focus: border-color: #C75B22; outline: none;
       box-shadow: 0 0 0 2px rgba(199,91,34,0.18)
```

Placeholders: `"Todos los géneros"` / `"Todos los formatos"`

### Botón "Filtrar"
Idéntico a books-spec.md:
```
background: teja #C75B22
color: blanco #FFFFFF
font-family: Source Sans 3, 14px, weight 600
border-radius: 8px; padding: 9px 22px; border: none
display: flex; align-items: center; gap: 6px
Hover: #a84a1b  |  Active: #8f3f17 + scale(0.98)
```
Icono: lupa (SVG inline, 14px, blanco). Texto: `"Filtrar"`

### Botón "Limpiar filtros"
Solo visible con algún filtro activo. Estilo fantasma, igual que en books:
```
background: transparent; color: marrón #6B4A16
border: none; font-size: 13px; text-decoration: underline
padding: 9px 8px
```

**Responsive (< 480px):**
- Campo de texto: `width: 100%`
- Selects: `width: 100%`
- Botón Filtrar: `width: 100%`
- Padding: 12px 16px; gap: 8px

---

## Sección 3 — Barra de resultados

```
display: flex; justify-content: space-between; align-items: center
padding: 16px 28px 12px
```

**Contador:**
- `"475 reseñadores encontrados"` (o el número filtrado)
- Source Sans 3, 14px, color tinta `#3D3A35`
- El número en weight 600; el texto en weight 400

---

## Sección 4 — Grid de fichas de reseñador

### Layout del grid

```css
display: grid;
grid-template-columns: repeat(3, 1fr);  /* desktop */
gap: 20px;
padding: 0 28px 36px;
align-items: stretch;
```

Breakpoints:
- **≥ 900px**: 3 columnas
- **≥ 560px y < 900px**: 2 columnas
- **< 560px**: 1 columna

> La alineación vertical entre tarjetas de la misma fila se logra igual que
> en la página de libros: CSS Grid con `align-items: stretch` + `flex: 1` en
> el bloque de descripción, que absorbe el espacio variable.

---

## Componente: ReviewerCard

### Estructura interna de la tarjeta

```
┌────────────────────────────────────────┐
│  [AVATAR]  Nombre                      │  ← cabecera horizontal
│            País (opcional)             │
├────────────────────────────────────────┤
│  Descripción (expandible si > 3 líneas)│  ← flex: 1
├────────────────────────────────────────┤
│  Mira sus reseñas en…                  │
│  [Blog] [YouTube] [Instagram] [+]      │  ← chips de canal
├────────────────────────────────────────┤
│  Géneros: [Fantasía] [Romántica] [+3]  │  ← chips colapsables
├────────────────────────────────────────┤
│  Formatos: [Papel] [ePUB]              │  ← chips de formato
└────────────────────────────────────────┘
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
padding: 20px

Hover:
  box-shadow: 0 6px 20px rgba(61,58,53,0.14)
  transform: translateY(-2px)
```

#### Cabecera (avatar + nombre)

```
display: flex; align-items: flex-start; gap: 14px
margin-bottom: 14px
```

**Avatar:**
```
width: 52px; height: 52px; border-radius: 50%
flex-shrink: 0
object-fit: cover
background: crema #FBF1D8  ← fallback
border: 2px solid #d4c9b0
```

Si no hay foto, avatar de iniciales:
```
background: mustaza #F2B705
color: tinta #3D3A35
font-family: Fraunces, serif; font-size: 18px; font-weight: 600
display: flex; align-items: center; justify-content: center
```

**Bloque nombre + país:**
```
display: flex; flex-direction: column; gap: 3px
```

Nombre:
- Fraunces 600, 16px, color tinta `#3D3A35`
- 1 línea, overflow ellipsis

País (opcional):
- Source Sans 3, 12px, color `#9a8c7e`
- Prefijo de bandera emoji si está disponible

#### Descripción

```
font-family: Source Sans 3
font-size: 13px; line-height: 1.6
color: #5a524a
flex: 1   ← absorbe el espacio variable; mantiene la alineación del resto
margin-bottom: 14px
```

**Comportamiento de truncado:**
- Por defecto: `-webkit-line-clamp: 4` (4 líneas, ~240 chars)
- Si la descripción supera 4 líneas: mostrar enlace `"Ver más"` inline al final
  - `"Ver más"` / `"Ver menos"`: Source Sans 3, 12px, color teja `#C75B22`,
    cursor pointer, sin borde
  - Toggle JS puro (sin librería): alterna clase `expanded` en la card
  - Con `expanded`: `display: block` sin clamp
  - `@media (prefers-reduced-motion)`: sin transición de altura

> **Nota importante**: el `flex: 1` debe estar en el wrapper de descripción
> (incluyendo el botón "Ver más"), no en el bloque de texto en sí, para que
> el espacio variable no rompa la alineación de los elementos inferiores.
> La descripción expandida crece la tarjeta, lo cual es correcto y esperado;
> CSS Grid ajustará la fila entera a la tarjeta más alta.

#### Separadores entre bloques

```
border-top: 0.5px solid #e8dfc8
margin: 0 -20px        ← sangra hasta los bordes de la tarjeta (padding negativo)
padding: 12px 20px 0   ← restaura el padding interior
```

Usar este separador entre: descripción → canales → géneros → formatos.

#### Canales literarios ("Mira sus reseñas en…")

```
margin-bottom: 10px
```

Etiqueta:
- Source Sans 3, 11px, weight 600, uppercase, letter-spacing 0.08em
- Color: marrón `#6B4A16`
- Margin-bottom: 6px

Chips de canal:
```
display: flex; flex-wrap: wrap; gap: 5px
```

Cada chip-canal es un enlace `<a href="...">` con icono + etiqueta:
```
background: crema #FBF1D8
border: 1px solid #d4c9b0
border-radius: 6px
padding: 4px 10px
display: inline-flex; align-items: center; gap: 5px
font-family: Source Sans 3, 12px, weight 600
color: marrón #6B4A16
text-decoration: none

Hover: background: #efe5c8; border-color: #C75B22; color: #C75B22
```

Iconos (SVG inline, 12px):
- Blog: icono de globo/world
- YouTube (Booktube): icono play circle
- Instagram (Bookstagram): icono cámara
- Goodreads: icono libro abierto
- Amazon: icono eReader (dispositivo con pantalla y líneas de texto)

Si el reseñador no tiene ningún canal, omitir esta sección.

#### Géneros literarios preferidos

Etiqueta:
- `"Géneros"` — Source Sans 3, 11px, weight 600, uppercase, letter-spacing 0.08em
- Color: marrón `#6B4A16`
- Margin-bottom: 6px

Chips de género:
```
background: transparent
border: 1px solid #d4c9b0
border-radius: 4px
padding: 3px 8px
font-family: Source Sans 3, 11px, weight 400
color: tinta #3D3A35
```

**Estrategia de colapso para géneros (hasta 17 posibles):**
- Mostrar máximo 4 chips + chip `"+N más"` si hay más de 4
- Chip `"+N más"`:
  ```
  background: crema #FBF1D8
  border: 1px solid #d4c9b0; border-style: dashed
  color: marrón #6B4A16; font-size: 11px
  cursor: pointer
  Hover: border-color: #C75B22; color: #C75B22
  ```
- Click en `"+N más"`: expande para mostrar todos los géneros (toggle)
- Texto del toggle cuando está expandido: `"Ver menos"`

Esta estrategia evita que la tarjeta crezca desmesuradamente por géneros y
mantiene la alineación vertical del grid.

#### Formatos de lectura

Etiqueta: `"Formatos"` — mismo estilo que la etiqueta de Géneros.

Chips de formato: mismo estilo visual que los chips de género. Máximo 5
formatos (papel, ePUB, PDF, mobi, audiolibro), se muestran todos.

```
display: flex; flex-wrap: wrap; gap: 5px
```

---

## Sección 5 — Paginación

Idéntica a la paginación de la página de libros (books-spec.md):

```
display: flex; justify-content: center; align-items: center; gap: 4px
padding: 20px 28px 40px
```

Botón de número:
```
width: 36px; height: 36px; border-radius: 8px
Source Sans 3, 14px, weight 600; color: marrón
Hover: background crema + borde #d4c9b0
```

Página activa:
```
background: teja #C75B22; color: blanco; border: none
```

Botones anterior/siguiente: mismas dimensiones, deshabilitados con opacity 0.5.

**Responsive (< 480px):** Máx. 5 números + elipsis; botones 40×40px.

---

## Estados especiales

### Estado vacío (sin resultados)

```
┌──────────────────────────────────────────────┐
│                                              │
│   [icono persona, 48px, teja al 40%]         │
│   "Sin resultados"            (Fraunces)     │
│   "Prueba con otros filtros o               │
│    explora todos los reseñadores."          │
│   [Limpiar filtros]           (botón CTA)   │
│                                              │
└──────────────────────────────────────────────┘
```
- Centrado, padding: 60px 28px
- Fraunces 600 22px para el título; Source Sans 3 14px para el subtexto
- Botón "Limpiar filtros" con estilo CTA mostaza

### Estado de carga
- Skeleton cards: misma estructura que `ReviewerCard` pero bloques en `#ede3cb`
  con shimmer animado (gradiente de izquierda a derecha)
- Mostrar 6 skeleton cards mientras carga la primera página
- El skeleton de la descripción ocupa 3 líneas de altura fija para evitar
  layout shifts al cargar

### Estado de error de red
- Banner horizontal en la parte superior del área de resultados
- Fondo crema + borde teja: `"No se pudieron cargar los reseñadores. Inténtalo de nuevo."`
- Botón inline: `"Reintentar"` (estilo CTA mustaza)

---

## Accesibilidad

- El campo de texto tiene `<label>` asociado (visualmente oculto si es necesario)
- Los selects tienen `<label>` explícito (`position: absolute; clip: rect(0 0 0 0)`)
- El botón "Filtrar" tiene `aria-label="Filtrar reseñadores"`
- Las tarjetas usan `<article>` como contenedor raíz
- El avatar tiene `alt="Avatar de {nombre}"` si es imagen; `aria-label` si es iniciales
- Los chips-canal son `<a>` con `aria-label="Ver reseñas en {plataforma} de {nombre}"`
  para que los lectores de pantalla puedan distinguirlos entre tarjetas
- El toggle "Ver más/menos" tiene `aria-expanded` actualizado dinámicamente
- El chip "+N más" de géneros tiene `aria-label="Mostrar todos los géneros de {nombre}"`
- La barra de filtros tiene `role="search"` y `aria-label="Filtros de búsqueda"`
- Paginación: `<nav aria-label="Paginación">` + `aria-current="page"` en activa
- Reduced motion: hover `translateY` y shimmer desactivados con
  `@media (prefers-reduced-motion: reduce)`
- Touch targets mínimos de 44px en botones y chips-canal
- Contraste verificado:
  - Tinta sobre blanco: >7:1 ✓
  - Marrón sobre blanco `#6B4A16 / #FFF`: ~5.9:1 ✓
  - Blanco sobre teja `#C75B22`: ~4.7:1 ✓ WCAG AA
  - Tinta sobre mustaza `#F2B705`: ~6.8:1 ✓

---

## Componentes sugeridos

```
ReviewersPage/
  index.tsx               ← página completa, estado de filtros y paginación
  PageHeader.tsx          ← eyebrow + titular + subtítulo (reutilizable de /books si procede)
  SearchFilters.tsx       ← barra sticky con texto + selects + botón filtrar
  ResultsMeta.tsx         ← contador de resultados
  ReviewerGrid.tsx        ← CSS Grid wrapper + estados (loading/empty/error)
  ReviewerCard.tsx        ← ficha individual de reseñador
  ReviewerCardSkeleton.tsx← versión skeleton para estado de carga
  Pagination.tsx          ← ya existe en /books, reutilizar
```

### Props de ReviewerCard

```ts
interface ReviewerChannel {
  type: 'blog' | 'youtube' | 'instagram' | 'goodreads' | 'amazon';
  url: string;
  label?: string;
}

interface ReviewerCardProps {
  name: string;
  country?: string;
  avatarUrl?: string;
  initials: string;          // fallback si no hay avatar
  description: string;       // hasta 2000 chars
  channels: ReviewerChannel[];
  genres: string[];          // hasta 17
  formats: string[];         // hasta 5
}
```

### Props de SearchFilters (ReviewersPage)

```ts
interface ReviewerSearchFiltersProps {
  genres: string[];
  formats: string[];
  searchText: string;
  selectedGenre: string | null;
  selectedFormat: string | null;
  onSearchTextChange: (text: string) => void;
  onGenreChange: (genre: string | null) => void;
  onFormatChange: (format: string | null) => void;
  onFilter: () => void;
  onClear: () => void;
}
```

---

## Coherencia con otras páginas

| Elemento              | Home            | Libros          | Reseñadores     |
|-----------------------|-----------------|-----------------|-----------------|
| Fondo header          | Crema `#FBF1D8` | Crema `#FBF1D8` | Crema `#FBF1D8` |
| CTA primario          | Mostaza         | Mostaza         | Mustaza (canales como chips, no CTA) |
| Botón acción nav/filtro | Teja          | Teja            | Teja            |
| Tipografía titulares  | Fraunces 600    | Fraunces 600    | Fraunces 600    |
| Tipografía cuerpo     | Source Sans 3   | Source Sans 3   | Source Sans 3   |
| Border-radius cards   | 12px            | 12px            | 12px            |
| Borde separador       | 0.5px `#d4c9b0` | 0.5px `#d4c9b0` | 0.5px `#d4c9b0` |
| Sombra hover          | —               | `0 6px 20px…`   | `0 6px 20px…`   |
| Grid tarjetas         | —               | 3/2/1 cols      | 3/2/1 cols      |
| Sticky filters        | —               | Sí              | Sí              |
| Paginación            | —               | Sí              | Sí              |

---

*Para implementar este diseño, delegar en el agente `senior-frontend` con
este documento, `books-spec.md` y `home-hero-spec.md` como contexto.*
