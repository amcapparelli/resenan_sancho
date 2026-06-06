# NavBar — Especificación de diseño v2

Sección de navegación superior de la home de Reseñan Sancho.
Incorpora el logotipo de la Identidad Corporativa (página 3 del PDF),
la tagline debajo del logo, y el botón de sesión con dos estados.

---

## Stack y restricciones

- Next.js 9.3.1 · React 16 · TypeScript
- Material UI + styled-components
- **No Tailwind**

---

## Estructura general

```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO SVG]                        Libros  Reseñadores  [BTN] │
│  Reseñan, Sancho. Señal que somos escritores.               │
└─────────────────────────────────────────────────────────────┘
```

- `display: flex; justify-content: space-between; align-items: flex-start`
- Fondo: blanco `#FFFFFF`
- Borde inferior: `0.5px solid #d4c9b0`
- Padding: `14px 28px 12px`

---

## Lado izquierdo: logo + tagline

Contenedor en columna (`flex-direction: column`, `gap: 6px`).

### Logo SVG

El logo reproduce fielmente la Identidad Corporativa (página 3):
tipografía Fraunces en dos líneas ("Reseñan" / "Sancho"), con un
marcador de libro (bookmark) superpuesto sobre la **ñ** de "Reseñan"
y sobre la **n** de "Sancho".

**Implementar como SVG inline** (no como `<img>`), para que escale
bien y permita ajustar colores desde CSS si fuera necesario.

#### Estructura del SVG (`viewBox="0 0 168 48"`, width≈168, height≈48)

```
Línea 1 — y-baseline: 20px
  "Rese"   → text x=1   y=20
  marcador → centrado sobre la ñ (x≈53)
  "ñ"      → text x=53  y=20
  "an"     → text x=68  y=20

Línea 2 — y-baseline: 44px
  "San"    → text x=1   y=44
  marcador → centrado sobre la n (x≈41)
  "n"      → text x=41  y=44
  "cho"    → text x=56  y=44
```

#### Tipografía del SVG
- `font-family="Fraunces, serif"` · `font-size="20"` · `font-weight="600"`
- `fill="#3D3A35"` (tinta)

#### Marcador (bookmark) — mismo shape en ambas posiciones

```svg
<!-- Cuerpo amarillo -->
<rect x="{x}" y="{y_top}" width="10" height="14" rx="2.5" fill="#F2B705"/>
<!-- Franja teja en la parte baja del cuerpo -->
<rect x="{x}" y="{y_top+8}" width="10" height="6" fill="#C75B22"/>
<!-- Punta en V (cola del marcador) -->
<polygon points="{x},{y_top+14} {x+5},{y_top+20} {x+10},{y_top+14}" fill="#C75B22"/>
```

Posiciones concretas:
- Marcador de la **ñ**: `x=53, y_top=1`
- Marcador de la **n**: `x=41, y_top=25`

> El marcador se superpone visualmente sobre la letra; la letra sigue
> siendo legible porque el marcador ocupa el espacio del ascendente y
> la virgulilla, no el cuerpo de la letra.

### Tagline

```
Reseñan, Sancho. Señal que somos escritores.
```

- Fuente: Fraunces **italic** 400, 12px
- Color: marrón `#6B4A16`
- `padding-left: 3px`
- `margin-top: 0` (el gap del contenedor padre lo gestiona)

---

## Lado derecho: navegación + botón de sesión

`display: flex; align-items: center; gap: 22px; padding-top: 6px`

### Links
- "Libros" y "Reseñadores"
- Source Sans 3, 13px, color marrón `#6B4A16`
- Hover: color teja `#C75B22`

### Botón de sesión — dos estados excluyentes

Renderizar condicionalmente según si el usuario tiene sesión activa.

#### Estado A — Sin sesión: botón "Login"
```
background: transparent
color: #C75B22
border: 1.5px solid #C75B22
border-radius: 6px
padding: 6px 16px
font-size: 13px · font-weight: 600
hover → background: #C75B22; color: #fff
```

#### Estado B — Con sesión: botón "Mi perfil"
```
background: #C75B22
color: #fff
border: none
border-radius: 6px
padding: 5px 14px 5px 6px
font-size: 13px · font-weight: 600
display: flex; align-items: center; gap: 8px
hover → background: #a84a1b
```

Lleva un **avatar circular** a su izquierda:
```
width: 24px · height: 24px · border-radius: 50%
background: #F2B705
color: #3D3A35 · font-size: 9px · font-weight: 700
contenido: iniciales del usuario (ej. "AL")
```

---

## Componente sugerido

```
NavBar/
  index.tsx         ← layout del header, recibe prop `isLoggedIn: boolean`
  NavLogo.tsx       ← SVG del logo + tagline
  NavActions.tsx    ← links + botón (Login | Mi perfil)
```

### Props de NavBar
```ts
interface NavBarProps {
  isLoggedIn: boolean;
  userInitials?: string; // para el avatar cuando isLoggedIn=true
}
```

---

## Accesibilidad

- El SVG del logo debe tener `aria-label="Reseñan Sancho"` y `role="img"`
- El botón "Mi perfil" debe tener `aria-label="Ir a mi perfil"` si el
  avatar no tiene texto alternativo visible
- Los links de navegación deben ser `<a>` reales con href, no `<span>`
- Touch target del botón: mínimo 44px de altura en móvil

---

## Responsive (mobile-first)

En móvil (< 480px):
- Los links "Libros" y "Reseñadores" se ocultan (o se mueven a un menú hamburguesa)
- El logo se mantiene visible
- El botón de sesión se mantiene visible siempre
