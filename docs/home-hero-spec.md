# Home — Hero & Prueba social · Especificación de diseño v5

Documento de referencia para implementar las secciones Hero y Prueba social de
la home de Reseñan Sancho. Usa el sistema de diseño ya definido en `theme.ts`.

---

## Stack y restricciones

- Next.js 9.3.1 · React 16 · TypeScript
- Material UI + styled-components
- Fuentes: Fraunces (Google Fonts, weight 600 e italic 400) + Source Sans 3
  (Google Fonts, weight 400 y 600)
- **No Tailwind**. Todo el estilo va en styled-components o `sx` prop de MUI.

---

## Tokens del sistema de diseño

```ts
// Extraídos de theme.ts — usar siempre estas variables, nunca hex sueltos
colors: {
  mustaza:     '#F2B705',  // acento de marca; texto oscuro encima
  teja:        '#C75B22',  // CTA principal; admite texto blanco
  crema:       '#FBF1D8',  // fondos suaves, hero
  tinta:       '#3D3A35',  // texto principal
  marron:      '#6B4A16',  // texto secundario, subtítulos
  blanco:      '#FFFFFF',
  bordeClaro:  '#d4c9b0',  // bordes y separadores
  arena:       '#F3DFB0',  // `sand`: fondo de la franja de reseñadores
}

typography: {
  headings: 'Fraunces, serif',       // weight 600
  body:     'Source Sans 3, sans-serif', // weight 400 / 600
}
```

---

## Sección 1 — Barra de navegación

### Estructura
```
[ marcador-logo  "Reseñan Sancho"  ]      [ Libros  Reseñadores  [Registrarse] ]
[ "Reseñan, Sancho. Señal que somos escritores." ]
```

### Especificación
- **Fondo**: blanco `#FFFFFF`
- **Borde inferior**: 0.5px solid `#d4c9b0`
- **Padding**: 12px 24px 10px
- **Alineación**: `justify-content: space-between; align-items: flex-start`

#### Logo
- Fuente Fraunces 600, 18px, color tinta `#3D3A35`
- Marcador gráfico (bookmark) a la izquierda del texto:
  - Rectángulo 8×22px, border-radius 3px 3px 4px 4px
  - Mitad superior: mustaza `#F2B705`
  - Mitad inferior (~6px): teja `#C75B22`
  - Implementar con un `<span>` con `::after`, o SVG inline simple

#### Tagline bajo el logo
- Texto: *"Reseñan, Sancho. Señal que somos escritores."*
- Fuente: Fraunces **italic** 400, 12px
- Color: marrón `#6B4A16`
- `padding-left: 16px` (alineada con el texto del logo, no con el marcador)
- `margin-top: 3px`

#### Links de navegación
- "Libros" y "Reseñadores": Source Sans 3, 13px, marrón `#6B4A16`
- Botón "Registrarse":
  - Background: teja `#C75B22`
  - Texto: blanco, 13px, weight 600
  - Border-radius: 6px · Padding: 6px 14px · Border: none

---

## Sección 2 — Hero (dos franjas)

El hero se divide en **dos franjas**, una por público y con el mismo peso
visual. Cada franja es un `<section>` con `aria-labelledby` apuntando a su
titular (el id lo genera `HeroStrip` con `useId()`). Por debajo de 1024px
se **apilan** (quien escribe arriba); desde 1024px se ponen **en dos columnas**
(quien escribe a la izquierda).

Móvil y tablet (<1024px):
```
┌──────────── crema ────────────┐
│   Que hablen de tu libro.     │
│   Un libro sin reseñas es…    │
│     ┌──────────────────┐      │
│     │ tarjeta escritor │      │
│     └──────────────────┘      │
╭──────────── arena ────────────╮
│  Que descubran tus reseñas    │
│  literarias.                  │
│  Colabora con autores y…      │
│     ┌──────────────────┐      │
│     │ tarjeta reseñador│      │
│     └──────────────────┘      │
└───────────────────────────────┘
```

Escritorio (≥1024px):
```
┌────────── crema ───────────┬────────── arena ───────────┐
│  Que hablen de             │  Que descubran tus         │
│  tu libro.                 │  reseñas literarias.       │
│  Un libro sin reseñas es…  │  Colabora con autores y…   │
│                            │                            │
│  ┌──────────────────┐      │  ┌──────────────────┐      │
│  │ tarjeta escritor │      │  │ tarjeta reseñador│      │
│  └──────────────────┘      │  └──────────────────┘      │
└────────────────────────────┴────────────────────────────┘
               [ Prueba social (sección 3) ]
```

### Franja 1 — quien escribe
- Fondo: crema `#FBF1D8`
- Titular (**único `h1` de la página**): «Que hablen de **tu libro.**»
  — «Que» sin tilde (no es pregunta); «tu libro.» en teja.
- Tagline: «Un libro sin reseñas es un libro aún sin publicar.»
- Tarjeta `writer`.

### Franja 2 — quien reseña
- Fondo: arena `#F3DFB0` (token `sand`). Se elige un tono cálido y no la tinta
  porque la tarjeta `reviewer` es tinta: nunca tarjeta tinta sobre fondo tinta.
- Apilada (<1024px): esquinas superiores redondeadas (24px móvil / 40px desde
  768px) sobre el crema de la franja 1: separación suave entre los dos
  públicos, sin imágenes.
- En columnas (≥1024px): esquinas **rectas**. La «pestaña» solo tiene sentido
  cuando una franja queda bajo la otra; al lado, una esquina superior izquierda
  redondeada solo mordería el borde junto a la cabecera. El cambio de color
  crema → arena basta para separar las dos mitades.
- Titular (`h2`): «Que descubran **tus reseñas literarias.**» — el acento en teja.
- Tagline: «Colabora con autores y editoriales.»
- Tarjeta `reviewer`.

### Tipografía (ambas franjas)
- Titular: Fraunces 600, line-height 1.12, color tinta, margin-bottom 16px.
  - h1: 28px móvil → **42px** desde 480px.
  - h2: 26px móvil → **36px** desde 480px (mismo patrón, algo menor que el h1).
  - Acento: `<em>` con `font-style: normal`, color teja.
- Tagline: Fraunces 600, 15px → 18px desde 480px, color marrón, line-height 1.5,
  max-width 420px.

### Layout
- Dentro de cada franja, siempre: texto arriba y tarjeta debajo (gap 28px). El
  orden de lectura es titular → tagline → tarjeta, y franja 1 → franja 2; el
  layout nunca reordena el DOM.
- Padding de franja: 36px 20px 40px · ≥480px: 52px 28px 48px · ≥768px: 64px 32px.
- **Móvil y tablet (<1024px)**: franjas apiladas a ancho completo, contenido con
  max-width **880px** centrado, texto centrado y tarjeta con max-width **360px**
  centrada.
- **Escritorio (≥1024px)**: `grid-template-columns: 1fr 1fr`; cada franja ocupa
  la mitad del ancho con su fondo a sangre (crema / arena). El contenido de cada
  mitad tiene max-width **440px**, centrado en su mitad, con el texto alineado a
  la izquierda y la tarjeta (max-width 360px) a la izquierda.
- **Mismo alto y tarjetas alineadas**: el grid estira las dos franjas al alto de
  la más alta, y la tarjeta lleva `margin-top: auto`, así que ambas tarjetas
  quedan pegadas al fondo de su columna a la misma altura aunque los titulares
  ocupen distinto número de líneas (se alinea el borde inferior de las tarjetas).
- **Por qué 1024 y no 768**: a 768px cada mitad deja ~320px de contenido tras el
  padding; el h1 de 42px y el h2 de 36px se partirían en 3-4 líneas y la tarjeta
  de 320px llenaría la columna entera. A 1024px quedan ~440px por columna, con
  titulares en 2-3 líneas y aire alrededor de la tarjeta. Entre 768 y 1023px se
  mantiene el apilado de móvil, que ya funciona bien a ese ancho.

### Jerarquía de encabezados
```
h1  Que hablen de tu libro.
  h3  Quiero reseñas para mi libro        (tarjeta writer)
h2  Que descubran tus reseñas literarias.
  h3  Quiero descubrir libros nuevos      (tarjeta reviewer)
```
El título de las tarjetas es siempre `h3` (`StyledTitle` se declara como `styled.h3` en `HeroCard`; no es configurable).

### Tarjetas

#### Tarjeta escritor
- Background: **teja** `#C75B22`
- Border-radius: 12px · Padding: 22px 20px 20px
- `display: flex; flex-direction: column` (para alinear el botón al fondo)
- Label «ESCRIBO LIBROS»: 10px, weight 600, uppercase, letter-spacing 0.1em, color `#f7d8c8`
- Título «Quiero reseñas para mi libro»: Fraunces 600, 17px, line-height 1.25, color blanco
- Descripción: Source Sans 3, 13px, line-height 1.55, color `#f7d8c8`, `flex: 1`
- Botón «Buscar reseñadores →» → `/reviewers`

#### Tarjeta reseñador
- Background: **tinta** `#3D3A35`
- Mismas medidas que la tarjeta escritor
- Label «ESCRIBO RESEÑAS LITERARIAS»: color `#a89880`
- Título «Quiero descubrir libros nuevos»: color crema `#FBF1D8`
- Descripción: color `#c2b49e`, `flex: 1`
- Botón «Ver libros disponibles →» → `/books`

#### Botones (ambas tarjetas)
- Background: blanco; hover: mostaza `#F2B705`
- Color texto: tinta `#3D3A35`
- Font: Source Sans 3, **14px**, weight 600
- Border-radius: 8px · Padding: 12px 16px · Border: none · min-height 44px
- Width: 100%

---

## Sección 3 — Prueba social

### Estructura
Franja blanca dividida en dos columnas iguales por un borde vertical.

```
┌──────────────────┬──────────────────┐
│      350+        │      475         │
│ Libros disponibles│ Reseñadores activos│
└──────────────────┴──────────────────┘
```

### Especificación
- Background: blanco `#FFFFFF`
- `display: grid; grid-template-columns: 1fr 1fr`
- Borde superior e inferior: 0.5px solid `#d4c9b0`
- Separador vertical entre columnas: `border-right: 0.5px solid #d4c9b0` en la primera celda

#### Cada stat
- Padding: 22px 16px · `text-align: center`
- Número: Fraunces 600, **30px**, color teja `#C75B22`
- Etiqueta: Source Sans 3, 13px, color marrón `#6B4A16`, margin-top 3px

---

## Notas de implementación

### Fuentes (Google Fonts)
Añadir en `_document.tsx` o `_app.tsx`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,400&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet" />
```

### Responsive (mobile-first)
El público es mayoritariamente móvil. Breakpoints: 480px (tipografía y
padding), 768px (padding del hero y radio de la pestaña) y 1024px (las franjas
del hero pasan a dos columnas, una al lado de la otra).

- **Franjas del hero**: apiladas por debajo de 1024px (ver sección 2)
- **Titulares**: 28px (h1) / 26px (h2) en móvil
- **Tagline**: 15px en móvil; permitir que ocupe más líneas
- **Prueba social**: mantener las dos columnas; funciona bien en móvil

### Accesibilidad
- El `<em>` de "tu libro." debe llevar `font-style: normal` para no italizar
- Touch targets de los botones: mínimo 44px de altura (el padding de 12px top+bottom sobre 14px de fuente da ~40px; añadir 2px extra si es necesario)
- Contraste verificado:
  - Blanco sobre teja `#C75B22`: ratio ~4.7:1 ✓ (WCAG AA)
  - Tinta sobre mostaza `#F2B705`: ratio ~6.8:1 ✓
  - Marrón sobre crema: ratio ~7.1:1 ✓
  - Tinta sobre arena `#F3DFB0`: ratio ~8.6:1 ✓ · Marrón sobre arena: ~6.1:1 ✓
  - Teja sobre crema (~3.8:1) y sobre arena (~3.2:1): solo AA para texto
    grande; por eso la teja se usa únicamente en el acento de los titulares
    (≥26px), nunca en texto de cuerpo.

### Componentes sugeridos
```
HeroSection/
  index.tsx          ← compone las dos franjas + prueba social
  HeroStrip.tsx      ← franja reutilizable (titular, tagline, tarjeta)
  HeroCard.tsx       ← tarjeta reutilizable (variant: 'writer' | 'reviewer')
  SocialProof.tsx    ← franja de stats
NavBar/
  index.tsx          ← nav con logo + tagline + links
```
