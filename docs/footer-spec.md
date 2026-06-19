# Footer — Especificación de diseño v1

Sección footer de Reseñan Sancho. Sustituye el footer actual manteniendo
los mismos contenidos (links legales, redes sociales, URLs) pero adaptando
el diseño al nuevo sistema visual.

---

## Stack y restricciones

- Next.js 9.3.1 · React 16 · TypeScript
- Material UI + styled-components
- Fuentes: Fraunces (weight 600) + Source Sans 3 (weight 400 y 600)
- **No Tailwind**. Estilos en styled-components o `sx` prop de MUI.

---

## Tokens del sistema de diseño

```ts
colors: {
  tinta:       '#3D3A35',  // fondo del footer
  marron:      '#6B4A16',  // logo en la franja inferior
  mustaza:     '#F2B705',  // hover de links y redes
  crema:       '#FBF1D8',
  bordeClaro:  '#d4c9b0',
}
```

---

## Estructura general

```
┌────────────────────────────────────────────────────────────┐
│  FONDO: tinta #3D3A35                                      │
│  padding: 36px 28px 20px                                   │
│                                                            │
│  ┌─────────────────────────────┐  ┌─────────────────────┐ │
│  │  AVISOS LEGALES             │  │         SÍGUENOS    │ │
│  │                             │  │                     │ │
│  │  ¿Qué es Reseñan Sancho?…  │  │  Instagram      [i] │ │
│  │  Aviso legal y Política…   │  │  Twitter / X    [i] │ │
│  │                             │  │  Facebook       [i] │ │
│  │                             │  │  Email          [i] │ │
│  └─────────────────────────────┘  └─────────────────────┘ │
│  ─────────────────────────────────────────────────────     │
│  Reseñan Sancho                                  v1.0.0   │
└────────────────────────────────────────────────────────────┘
```

---

## Layout

```css
display: grid;
grid-template-rows: 1fr auto;  /* cuerpo + franja inferior */
```

### Cuerpo (`.footer-body`)

```css
display: grid;
grid-template-columns: 1fr auto;
gap: 32px;
align-items: start;
padding-bottom: 24px;
border-bottom: 0.5px solid rgba(212, 201, 176, 0.25);
margin-bottom: 16px;
```

---

## Columna izquierda — Avisos legales

### Etiqueta de sección
- Texto: `"AVISOS LEGALES"`
- Source Sans 3, 10px, weight 600, uppercase, letter-spacing 0.1em
- Color: `#a89880`
- Margin-bottom: 12px

### Links legales

Extraer URLs y textos del footer actual del proyecto. Los dos links son:

```
Texto: "¿Qué es Reseñan Sancho? Preguntas frecuentes."
href:  /about

Texto: "Aviso legal y Política de Privacidad."
href:  /legal
```

Estilos de cada `<a>`:
```
font-family: Source Sans 3, 13px, weight 400
color: #d4c9b0
text-decoration: none
line-height: 1.45
display: block

Hover: color: #F2B705
```

Contenedor de links: `display: flex; flex-direction: column; gap: 8px`

---

## Columna derecha — Redes sociales

### Etiqueta de sección
- Texto: `"SÍGUENOS"`
- Mismo estilo que la etiqueta de la columna izquierda
- `text-align: right`
- Margin-bottom: 12px

### Links de redes

Extraer URLs del footer actual del proyecto. Redes presentes:
Instagram, Twitter / X, Facebook, Email (mailto).

Cada link es un `<a>` con:
```
display: flex
align-items: center
gap: 8px
font-size: 12px
color: #a89880
text-decoration: none
justify-content: flex-end   ← alineado a la derecha

Hover: color: #F2B705
Hover > .social-icon: border-color: #F2B705
```

Etiqueta de texto visible (accesibilidad): "Instagram", "Twitter / X",
"Facebook", "Email" — siempre visible junto al icono, no solo en
`aria-label`.

#### Icono (`.social-icon`)

```
width: 28px · height: 28px
border-radius: 6px
border: 0.5px solid rgba(212, 201, 176, 0.3)
display: flex · align-items: center · justify-content: center
flex-shrink: 0
```

Iconos SVG inline (14×14px, stroke o fill `#a89880`):
- **Instagram**: rect redondeado + círculo interior + punto superior derecho
- **Twitter / X**: glifo X (path oficial de la marca)
- **Facebook**: glifo f
- **Email**: sobre (rect + path en V)

> Todos los `<a>` de redes deben tener `aria-label` descriptivo:
> `"Reseñan Sancho en Instagram"`, `"Reseñan Sancho en Twitter"`, etc.
> El `target="_blank"` lleva `rel="noopener noreferrer"`.

---

## Franja inferior

Separada del cuerpo por el borde superior del cuerpo (ver layout).

```css
display: flex;
justify-content: space-between;
align-items: center;
```

### Logo (izquierda)
- Texto: `"Reseñan Sancho"`
- Fraunces 600, 14px, color marrón `#6B4A16`

### Versión (derecha)

Mostrar la versión del frontend extraída de `package.json` en build time.

```ts
// En el componente Footer:
import packageJson from '../../package.json';
const version = packageJson.version;
```

> En Next.js 9 con TypeScript, añadir en `tsconfig.json`:
> `"resolveJsonModule": true`
> para permitir el import de JSON.
> Si ya está activado, no tocar.

Estilos del texto de versión:
```
font-family: Source Sans 3
font-size: 11px
color: rgba(168, 152, 128, 0.6)   ← muy discreto, mismo tono que el fondo
font-variant-numeric: tabular-nums
```

Formato del texto: `v{version}` — ejemplo: `v1.0.0`

---

## Accesibilidad

- El footer usa `<footer>` como elemento raíz (semántica correcta)
- Los links legales son `<a>` reales con `href`, nunca `<span>`
- Los links de redes tienen `aria-label` descriptivo y `rel="noopener noreferrer"`
- El texto de versión va en `<span aria-hidden="true">` — es información
  para el desarrollador, no relevante para lectores de pantalla
- Contraste verificado:
  - `#d4c9b0` sobre `#3D3A35`: ratio ~5.6:1 ✓ WCAG AA
  - `#a89880` sobre `#3D3A35`: ratio ~3.2:1 (texto decorativo / pequeño,
    aceptable para etiquetas de 10px en uppercase)
  - `#F2B705` sobre `#3D3A35` en hover: ratio ~8.1:1 ✓

---

## Responsive (mobile-first)

**< 480px:**

El grid de dos columnas pasa a una columna:
```css
grid-template-columns: 1fr;
gap: 24px;
```

La columna de redes sociales:
```
align-items: flex-start   ← en móvil, alineadas a la izquierda
```

La etiqueta "SÍGUENOS":
```
text-align: left
```

Los links de redes en móvil:
```
justify-content: flex-start
```

Padding del footer en móvil: `28px 20px 16px`

---

## Componente sugerido

```
Footer/
  index.tsx        ← componente completo
```

### Props

El componente no necesita props: los links y URLs se leen del footer
actual (datos estáticos), y la versión se importa de `package.json`
en tiempo de build.

```ts
// Sin props — componente autónomo
const Footer: React.FC = () => { ... }
export default Footer;
```

---

## Notas de implementación

- **URLs y datos de redes**: copiar exactamente los href del footer
  actual del proyecto. No inventar ni hardcodear nuevos.
- **`resolveJsonModule`**: verificar que está en `true` en `tsconfig.json`
  antes de importar `package.json`. Si no está, añadirlo; es un cambio
  seguro y sin efectos secundarios en Next.js 9.
- **No eliminar el footer actual** hasta que el nuevo esté en producción
  y verificado. Trabajar en rama `feature/footer-redesign`.

---

## Coherencia con otras páginas

| Elemento            | Home (hero/stats) | Footer          |
|---------------------|-------------------|-----------------|
| Fondo               | Crema / Blanco    | Tinta `#3D3A35` |
| Tipografía títulos  | Fraunces 600      | Fraunces 600    |
| Tipografía cuerpo   | Source Sans 3     | Source Sans 3   |
| Color hover links   | Teja `#C75B22`    | Mustaza `#F2B705` (sobre oscuro) |
| Borde separador     | 0.5px `#d4c9b0`  | 0.5px `rgba(212,201,176,0.25)` |

> El hover usa mustaza en lugar de teja porque sobre el fondo oscuro
> la teja pierde contraste (~2.8:1), mientras que la mustaza alcanza
> ~8.1:1. Mismo sistema de diseño, aplicado con criterio de contraste.

---

*Para implementar este diseño, delegar en el agente `senior-frontend` con
este documento, `home-hero-spec.md` y `navbar-spec.md` como contexto.*
