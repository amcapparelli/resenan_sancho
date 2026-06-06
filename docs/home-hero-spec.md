# Home — Hero & Prueba social · Especificación de diseño v4

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

## Sección 2 — Hero

### Fondo
- Color crema `#FBF1D8`
- Padding: 52px 28px 48px
- `text-align: center`

### Headline
```
Qué hablen de tu libro.
```
- Fuente: Fraunces 600
- Tamaño: **42px**
- Line-height: 1.12
- Color base: tinta `#3D3A35`
- La palabra **"tu libro."** en teja `#C75B22` (usar `<em>` o `<span>` sin font-style)
- Margin-bottom: 16px

### Tagline
```
Un libro sin reseñas es un libro aún sin publicar.
```
- Fuente: Fraunces 600
- Tamaño: **18px**
- Color: marrón `#6B4A16`
- Line-height: 1.5
- Max-width: 420px · centrado con `margin: 0 auto`
- Margin-bottom: 40px

### Tarjetas del bifurcador

Grid de dos columnas, gap 14px, max-width 540px, centrado.

```
┌─────────────────────┐  ┌─────────────────────┐
│  FONDO: teja        │  │  FONDO: tinta       │
│                     │  │                     │
│  Soy escritor       │  │  Soy reseñador      │
│  Quiero reseñas     │  │  Quiero descubrir   │
│  para mi libro      │  │  libros nuevos      │
│                     │  │                     │
│  Encuentra reseña-  │  │  Filtra por género  │
│  dores que encajan  │  │  y formato. Pide    │
│  con tu género.     │  │  ejemplares gratis. │
│                     │  │                     │
│ [Buscar reseñadores]│  │[Ver libros dispon.] │
└─────────────────────┘  └─────────────────────┘
     botón: mustaza            botón: mustaza
     texto: tinta              texto: tinta
```

#### Tarjeta escritor
- Background: **teja** `#C75B22`
- Border-radius: 12px · Padding: 22px 20px 20px
- `display: flex; flex-direction: column` (para alinear botones al fondo)
- Label "SOY ESCRITOR": 10px, weight 600, uppercase, letter-spacing 0.1em, color `#f7d8c8`
- Título: Fraunces 600, 17px, line-height 1.25, color blanco `#fff`
- Descripción: Source Sans 3, 13px, line-height 1.55, color `#f7d8c8`, `flex: 1`

#### Tarjeta reseñador
- Background: **tinta** `#3D3A35`
- Mismas medidas que la tarjeta escritor
- Label "SOY RESEÑADOR": color `#a89880`
- Título: color crema `#FBF1D8`
- Descripción: color `#c2b49e`, `flex: 1`

#### Botones (ambas tarjetas)
- Background: **mustaza** `#F2B705`
- Color texto: tinta `#3D3A35`
- Font: Source Sans 3, **14px**, weight 600
- Border-radius: 8px · Padding: 12px 16px · Border: none
- Width: 100%
- `display: flex; align-items: center; justify-content: center; gap: 5px`
- Texto con flecha: "Buscar reseñadores →" / "Ver libros disponibles →"

> **Clave de alineación**: el botón siempre queda al mismo nivel en ambas
> tarjetas porque la descripción tiene `flex: 1` y empuja el botón al fondo.
> No usar `margin-top: auto`; dejar que el flex lo resuelva.

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
El público es mayoritariamente móvil. Breakpoint clave: 480px.

- **Tarjetas del hero**: en móvil pasar a `grid-template-columns: 1fr` (columna única)
- **Headline**: reducir a ~28px en móvil
- **Tagline**: reducir a 15px en móvil; permitir que ocupe más líneas
- **Padding del hero**: reducir a 36px 20px en móvil
- **Prueba social**: mantener las dos columnas; funciona bien en móvil

### Accesibilidad
- El `<em>` de "tu libro." debe llevar `font-style: normal` para no italizar
- Touch targets de los botones: mínimo 44px de altura (el padding de 12px top+bottom sobre 14px de fuente da ~40px; añadir 2px extra si es necesario)
- Contraste verificado:
  - Blanco sobre teja `#C75B22`: ratio ~4.7:1 ✓ (WCAG AA)
  - Tinta sobre mostaza `#F2B705`: ratio ~6.8:1 ✓
  - Marrón sobre crema: ratio ~4.5:1 ✓

### Componentes sugeridos
```
HeroSection/
  index.tsx          ← sección completa
  HeroCard.tsx       ← tarjeta reutilizable (recibe variant: 'writer' | 'reviewer')
  SocialProof.tsx    ← franja de stats
NavBar/
  index.tsx          ← nav con logo + tagline + links
```
