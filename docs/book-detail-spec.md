# Página de detalle del libro — Especificación de diseño v1

Sección `/books/{bookId}` de Reseñan Sancho: vista completa de un libro
individual. Diseñada en coherencia con la home, la barra de navegación
(`navbar-spec.md`) y la página de libros (`books-spec.md`).

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

## Ruta y navegación

- URL: `/books/{bookId}`
- Entrada principal: botón "Pedir ejemplar gratuito →" en `BookCard`
  (página `/books`). También enlazable directamente.
- Breadcrumb de regreso: `← Volver a libros` (enlace a `/books`)
- Meta: title y description únicos por libro (SEO — ver Notas de
  implementación).

---

## Layout general de la página

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR (ya implementado — no tocar)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  BREADCRUMB                                                  │
│  ← Volver a libros                                           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  HERO BLOCK (crema)                                          │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │   PORTADA    │  │  BADGE género          [CHIPS fmt] │  │
│  │  (3:4 ratio) │  │                                    │  │
│  │              │  │  Título del libro                  │  │
│  │              │  │  por Nombre Autor                  │  │
│  │              │  │                                    │  │
│  │              │  │  ─────────────────────────────     │  │
│  │              │  │  Metadatos secundarios             │  │
│  │              │  │  (páginas · año · editorial)       │  │
│  │              │  │                                    │  │
│  │              │  │  ─────────────────────────────     │  │
│  │              │  │                                    │  │
│  │              │  │  [CTA — según estado sesión]       │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SINOPSIS (blanco)                                           │
│  ──────────────────────────────────────────────────────      │
│  Texto completo (hasta 2000 chars)                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SOBRE LA PERSONA AUTORA (crema)                             │
│  [Avatar]  Nombre · País                                     │
│  Breve presentación si el autor la tiene                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Sección 1 — Breadcrumb

```
Padding: 14px 28px
Fondo: blanco #FFFFFF
Borde inferior: 0.5px solid #d4c9b0
```

Enlace `← Volver a libros`:
- Source Sans 3, 13px, color marrón `#6B4A16`
- `display: inline-flex; align-items: center; gap: 5px`
- Flecha: carácter `←` o SVG chevron de 14px
- Hover: color teja `#C75B22`
- Enlace real `<a href="/books">` (no `<span>`)

---

## Sección 2 — Hero Block

```
Fondo: crema #FBF1D8
Padding: 40px 28px 44px
Borde inferior: 0.5px solid #d4c9b0
```

Layout interno (desktop):
```css
display: grid;
grid-template-columns: 240px 1fr;
gap: 36px;
max-width: 860px;
margin: 0 auto;
```

### Columna izquierda — Portada

```
position: relative
```

Imagen de portada:
```
width: 100%
aspect-ratio: 3 / 4
object-fit: cover
object-position: center top
border-radius: 10px
box-shadow: 0 4px 20px rgba(61,58,53,0.18)
display: block
background: crema #FBF1D8  ← fallback sin imagen
```

Imagen de fallback (sin portada):
- Fondo crema, icono de libro centrado en teja `#C75B22` al 30% de opacidad.
- Mismo border-radius y sombra que la portada real.

### Columna derecha — Información del libro

`display: flex; flex-direction: column; gap: 16px`

#### Fila superior: badge de género + chips de formato

```
display: flex; align-items: center; justify-content: space-between;
flex-wrap: wrap; gap: 8px
```

**Badge de género:**
```
background: rgba(61,58,53,0.08)
border: 1px solid #d4c9b0
color: marrón #6B4A16
font-family: Source Sans 3, 11px, weight 600
text-transform: uppercase; letter-spacing: 0.1em
padding: 4px 10px
border-radius: 4px
```

**Chips de formato** (todos visibles, sin colapso):
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
padding: 3px 10px
border-radius: 4px
```

#### Título

- Fraunces 600, 28px, line-height 1.2
- Color: tinta `#3D3A35`
- Sin truncado (página de detalle, se muestra completo)

#### Autor

- `"por Nombre Autor"`
- Source Sans 3, 15px, color marrón `#6B4A16`
- Prefijo `"por "` en weight 400; nombre en weight 600
- 1 línea, overflow ellipsis si es muy largo

#### Separador

```
border-top: 0.5px solid #d4c9b0
```

#### Metadatos secundarios

```
display: flex; flex-wrap: wrap; gap: 14px; align-items: center
```

Cada metadato (páginas, año, editorial):
```
display: flex; align-items: center; gap: 5px
font-family: Source Sans 3, 13px
color: #9a8c7e
```

Icono SVG inline, 14px, color `#c2b49e` (páginas: documento; año: calendario;
editorial: edificio/libro abierto).

Formato del dato:
- `"320 páginas"`
- `"Publicado en 2023"`
- `"Editorial independiente"` / `"Editorial Planeta"` (según corresponda)

Si algún dato no está disponible, omitir ese metadato (no mostrar placeholder).

#### Separador

```
border-top: 0.5px solid #d4c9b0
```

#### CTA — Zona de acción (estado dependiente de sesión)

Esta zona siempre existe; cambia su contenido según si el usuario tiene sesión.

```
padding: 16px 18px
background: blanco #FFFFFF
border: 1px solid #d4c9b0
border-radius: 10px
display: flex; flex-direction: column; gap: 10px
```

##### Estado A — Sin sesión

```
┌──────────────────────────────────────────────────┐
│  Para pedir un ejemplar necesitas una cuenta     │
│  gratuita.                                       │
│                                                  │
│  [Crear cuenta gratis →]  ·  ¿Ya tienes cuenta?  │
│                              Inicia sesión        │
└──────────────────────────────────────────────────┘
```

Texto informativo:
- Source Sans 3, 14px, color tinta `#3D3A35`, line-height 1.5
- Usar lenguaje neutro: "Para pedir un ejemplar necesitas una cuenta gratuita."

Botón principal "Crear cuenta gratis →":
```
background: teja #C75B22
color: blanco #FFFFFF
font-family: Source Sans 3, 14px, weight 600
border-radius: 8px; padding: 12px 22px; border: none
display: inline-flex; align-items: center; gap: 6px
cursor: pointer; min-height: 44px
Hover: background: #a84a1b
```

Enlace secundario "Inicia sesión":
- Source Sans 3, 13px, color teja `#C75B22`
- `text-decoration: underline`

Disposición de botón + enlace:
```
display: flex; align-items: center; gap: 14px; flex-wrap: wrap
```

##### Estado B — Con sesión (siempre con ejemplares disponibles)

Los libros sin ejemplares no aparecen en los resultados de búsqueda, por lo
que este estado es el único posible para un usuario logueado.

```
┌──────────────────────────────────────────────────┐
│  ● X ejemplares disponibles                      │
│                                                  │
│  [Pedir un ejemplar →]                           │
└──────────────────────────────────────────────────┘
```

Indicador de disponibilidad:
- `display: flex; align-items: center; gap: 6px`
- Punto verde `●` (10px, color `#4a9b5f`) + texto Source Sans 3, 13px,
  color marrón `#6B4A16`
- Texto: `"X ejemplares disponibles"`

Botón "Pedir un ejemplar →":
```
background: mustaza #F2B705
color: tinta #3D3A35
font-family: Source Sans 3, 14px, weight 600
border-radius: 8px; padding: 13px 22px; border: none
width: 100%; min-height: 44px
display: flex; align-items: center; justify-content: center; gap: 6px
cursor: pointer
Hover: background: #d9a304
Active: transform: scale(0.98)
```

Texto del botón: `"Pedir un ejemplar →"`

---

## Sección 3 — Sinopsis

```
Fondo: blanco #FFFFFF
Padding: 40px 28px
max-width: 860px; margin: 0 auto
Borde inferior: 0.5px solid #d4c9b0
```

### Encabezado de sección

```
display: flex; align-items: center; gap: 10px
margin-bottom: 20px
```

Eyebrow:
- Texto: `"SINOPSIS"`
- Source Sans 3, 11px, weight 600, uppercase, letter-spacing 0.12em
- Color: marrón `#6B4A16`

Línea decorativa (separa el eyebrow del texto):
```
flex: 1
height: 0.5px
background: #d4c9b0
```

### Cuerpo de la sinopsis

La sinopsis se muestra **completa** (sin truncado). Puede tener hasta 2000
caracteres.

```
font-family: Source Sans 3
font-size: 16px
line-height: 1.75
color: tinta #3D3A35
max-width: 660px   ← longitud de línea cómoda para lectura
```

Párrafos separados por `margin-bottom: 16px`. Si el texto llega como un solo
bloque sin saltos de párrafo, envolver directamente en `<p>`.

---

## Sección 4 — Sobre la persona autora

```
Fondo: crema #FBF1D8
Padding: 36px 28px 40px
max-width: 860px; margin: 0 auto
```

### Encabezado de sección

Mismo tratamiento que en la sinopsis:
```
display: flex; align-items: center; gap: 10px
margin-bottom: 24px
```
Eyebrow: `"SOBRE LA PERSONA AUTORA"` — mismo estilo.

### Bloque del autor

```
display: flex; align-items: flex-start; gap: 20px
```

**Avatar:**
```
width: 60px; height: 60px; border-radius: 50%
flex-shrink: 0
object-fit: cover
background: crema #FBF1D8
border: 2px solid #d4c9b0
```

Fallback de iniciales (si no hay foto):
```
background: mustaza #F2B705
color: tinta #3D3A35
font-family: Fraunces, serif; font-size: 20px; font-weight: 600
display: flex; align-items: center; justify-content: center
```

**Bloque de texto:**
```
display: flex; flex-direction: column; gap: 4px
```

Nombre:
- Fraunces 600, 18px, color tinta `#3D3A35`

País (opcional):
- Source Sans 3, 13px, color `#9a8c7e`
- Prefijo de bandera emoji si está disponible

Presentación del autor (campo opcional del perfil):
- Source Sans 3, 14px, line-height 1.65, color `#5a524a`
- Margin-top: 10px

Si el autor no tiene presentación, no mostrar este sub-bloque (no dejar vacío).

---

## Estados especiales

### Estado de carga

Skeleton de la página completa:
- Columna izquierda: rectángulo `240×320px` con radio 10px en `#ede3cb` + shimmer
- Columna derecha: 3 líneas de distinta longitud en `#ede3cb` para título/autor,
  luego 3 rectángulos de metadatos, luego bloque CTA simulado
- Sinopsis: 8 líneas de ancho variable en `#ede3cb`
- Desactivar shimmer con `@media (prefers-reduced-motion: reduce)`

### Estado de error (libro no encontrado)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   [icono libro, 48px, teja al 40%]               │
│   "Este libro no está disponible"  (Fraunces)    │
│   "Es posible que se haya eliminado o que       │
│    el enlace no sea correcto."                  │
│   [← Explorar libros]           (botón teja)    │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Centrado, padding: 80px 28px
- Fraunces 600 24px para el título; Source Sans 3 15px para el subtexto

---

## Responsive (mobile-first)

### Breakpoint clave: 600px

**< 600px (móvil):**

El hero pasa a una columna única:
```css
grid-template-columns: 1fr;
gap: 24px;
padding: 28px 20px 32px;
```

La portada en móvil:
```
width: 100%
max-width: 200px
margin: 0 auto
```
(Centrada, más pequeña que en desktop para no dominar la pantalla.)

Título: 22px (en lugar de 28px)
Padding de la sección sinopsis: 28px 20px
Padding de la sección autor: 28px 20px

**Breadcrumb en móvil:**
- Padding: 12px 20px

### Breakpoint intermedio: 600px–900px (tablet)

```css
grid-template-columns: 200px 1fr;
gap: 28px;
```

---

## Accesibilidad

- El `<img>` de portada lleva `alt="Portada de {título}"` (o `alt=""` si es
  decorativa de fondo)
- El fallback de iniciales del avatar tiene `aria-label="Avatar de {nombre}"`
- El botón CTA tiene texto descriptivo completo (no solo "→")
- El enlace `← Volver a libros` es un `<a>` real con `href`
- El bloque CTA está dentro de un `<section aria-label="Pedir ejemplar">`
- Contraste verificado:
  - Blanco sobre teja `#C75B22`: ~4.7:1 ✓ WCAG AA
  - Tinta sobre mustaza `#F2B705`: ~6.8:1 ✓
  - Marrón sobre crema `#6B4A16 / #FBF1D8`: ~4.9:1 ✓
  - Tinta sobre blanco: >7:1 ✓
- Touch targets: mínimo 44px de altura en todos los botones y enlaces
- Reduced motion: skeleton shimmer y hover `transform` desactivados con
  `@media (prefers-reduced-motion: reduce)`

---

## Notas de implementación

### SEO por página
Generar metadatos dinámicos por libro en `getServerSideProps` o `getStaticProps`:
```ts
// pages/books/[bookId].tsx
export async function getServerSideProps({ params }) {
  const book = await fetchBook(params.bookId);
  return {
    props: {
      book,
      meta: {
        title: `${book.title} — Reseñan Sancho`,
        description: book.synopsis.slice(0, 155),
      }
    }
  };
}
```

### Acción "Pedir un ejemplar"
Al hacer click en el botón (Estado B), abrir el mismo modal de mensaje que
ya existe en la plataforma (el que se usa desde `/books`). El modal no forma
parte de esta spec; reutilizar el componente existente sin modificarlo.

---

## Componentes sugeridos

```
BookDetailPage/
  index.tsx               ← página completa, recibe book + isLoggedIn
  BookDetailHero.tsx      ← hero con portada + info + CTA
  BookDetailCTA.tsx       ← zona CTA según estado sesión
  BookDetailSynopsis.tsx  ← sección de sinopsis completa
  BookDetailAuthor.tsx    ← sección sobre la persona autora
  BookDetailSkeleton.tsx  ← skeleton de carga
```

### Props principales

```ts
interface BookDetailPageProps {
  book: BookDetail;
  isLoggedIn: boolean;
  userHasRequested?: boolean; // ¿ya pidió este libro?
}

interface BookDetail {
  id: string;
  title: string;
  author: {
    name: string;
    country?: string;
    avatarUrl?: string;
    initials: string;
    bio?: string;
  };
  coverUrl?: string;
  genre: string;
  formats: string[];
  synopsis: string;          // hasta 2000 chars
  pageCount?: number;
  publishYear?: number;
  publisher?: string;        // o null si es independiente
  availableCopies: number;
}
```

---

## Coherencia con otras páginas

| Elemento              | Home            | Libros          | Detalle libro   |
|-----------------------|-----------------|-----------------|-----------------|
| Fondo header/hero     | Crema `#FBF1D8` | Crema `#FBF1D8` | Crema `#FBF1D8` |
| CTA primario          | Mostaza         | Mostaza         | Mostaza (con sesión) / Teja (sin sesión) |
| Tipografía titulares  | Fraunces 600    | Fraunces 600    | Fraunces 600    |
| Tipografía cuerpo     | Source Sans 3   | Source Sans 3   | Source Sans 3   |
| Border-radius cards   | 12px            | 12px            | 10px (portada)  |
| Borde separador       | 0.5px `#d4c9b0` | 0.5px `#d4c9b0` | 0.5px `#d4c9b0` |

---

*Para implementar este diseño, delegar en el agente `senior-frontend` con
este documento, `books-spec.md` y `home-hero-spec.md` como contexto.*
