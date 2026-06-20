# Área personal — Especificación de diseño v1

Sección autenticada de Reseñan Sancho (`/account` o similar). Espacio privado
de cada usuario: actualizar perfil, gestionar espacios literarios, gestionar
libros, añadir libro y ayuda. Diseñada en coherencia con la home
(`home-hero-spec.md`), el navbar (`navbar-spec.md`) y las páginas públicas
(`books-spec.md`, `reviewers-spec.md`, `book-detail-spec.md`).

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
  // Tokens nuevos propuestos para esta sección (ver "Propuesta al sistema"):
  fondoApp:    '#FAF6EC',   // fondo de trabajo del área personal (crema desaturado)
  exito:       '#4a9b5f',   // estados de guardado correcto, disponibilidad
  peligro:     '#DE4A10',   // zona de peligro / errores (rojo de marca, ya existente)
}
```

---

## Concepto: por qué este área se ve distinta (pero no ajena)

Esta sección es privada y de trabajo, no escaparate. El usuario no viene a ser
seducido sino a hacer tareas (editar datos, subir un libro). Eso pide un tono
más sobrio que la home, **pero no gris ni corporativo**: el público joven
abandona lo que parece anticuado también aquí dentro.

Decisiones que materializan esa diferencia, manteniendo la marca:

- **Fondo de trabajo** en crema desaturado (`#FAF6EC`) en lugar del blanco puro
  del escaparate. Da calidez sin gritar.
- **Menos crema saturada y menos mostaza decorativa** que en la home. La mostaza
  aquí se reserva para el acento de "sección activa" y poco más.
- **Tarjetas/paneles blancos** sobre el fondo crema, con la misma `border-radius`
  (12px) y borde `#d4c9b0` que el resto del producto.
- **Mismo par tipográfico y misma paleta**: es inequívocamente Reseñan Sancho.
- El **CTA primario de cada formulario es teja** (`Guardar`), no mostaza, porque
  aquí la mostaza-CTA de "pedir ejemplar" no aplica y la teja comunica mejor
  "acción de confirmar" en un contexto de formulario.

---

## Layout general

Patrón maestro–detalle: **navegación** (las 5 secciones) + **área de trabajo**.
El comportamiento cambia radicalmente entre escritorio y móvil porque el público
es mayoritariamente móvil.

### Escritorio (≥ 900px): sidebar vertical persistente

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR (ya implementado — no tocar)                         │
├──────────────────────────────────────────────────────────────┤
│  ← Volver a la web   ·   Hola, {Nombre}                      │  ← barra de contexto
├───────────────┬──────────────────────────────────────────────┤
│  SIDEBAR      │  ÁREA DE TRABAJO (panel blanco sobre crema)  │
│               │                                              │
│ ▸ Perfil      │  [contenido de la sección activa]            │
│   Espacios    │                                              │
│   Mis libros  │                                              │
│   Añade libro │                                              │
│   Ayuda       │                                              │
│               │                                              │
│  (sticky)     │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

```css
display: grid;
grid-template-columns: 240px 1fr;
gap: 28px;
max-width: 1040px;
margin: 0 auto;
padding: 28px;
background: #FAF6EC;
min-height: calc(100vh - [altura navbar]);
```

### Móvil (< 900px): tabs horizontales con scroll

El sidebar no cabe. Se convierte en una **barra de pestañas horizontal scrollable**
justo bajo la barra de contexto, sticky al hacer scroll. El área de trabajo
ocupa el 100% del ancho debajo.

```
┌───────────────────────────────────┐
│  NAVBAR                           │
├───────────────────────────────────┤
│  ← Volver   ·   Hola, {Nombre}    │
├───────────────────────────────────┤
│ Perfil│Espacios│Mis libros│Añade…→ │  ← scroll horizontal, sticky
├───────────────────────────────────┤
│                                   │
│   [contenido sección activa]      │
│   (ancho completo)                │
│                                   │
└───────────────────────────────────┘
```

---

## Sección 0 — Barra de contexto (común a todo el área)

Resuelve el "enlace para volver a la web pública" que pediste, y orienta.

```
Fondo: blanco #FFFFFF
Padding: 12px 28px
Borde inferior: 0.5px solid #d4c9b0
display: flex; align-items: center; justify-content: space-between
```

Izquierda — enlace de salida:
- `← Volver a la web` — enlace real `<a href="/">`
- Source Sans 3, 13px, color marrón `#6B4A16`
- `display: inline-flex; align-items: center; gap: 5px`
- Hover: color teja `#C75B22`

Derecha — saludo:
- `Hola, {Nombre}` — Source Sans 3, 13px, color tinta `#3D3A35`
- En móvil se puede ocultar el saludo si compite por espacio.

**Responsive (< 480px):** padding 10px 16px; el saludo se trunca con ellipsis.

---

## Sección 1 — Navegación (sidebar / tabs)

Misma información, dos presentaciones según breakpoint.

### Items (orden y etiquetas)

1. **Perfil** (antes "Actualizar perfil" — etiqueta más corta para los tabs)
2. **Espacios literarios** (antes "Mis espacios literarios")
3. **Mis libros**
4. **Añade libro**
5. **Ayuda**

> Se acortan las etiquetas para que quepan como tabs en móvil sin truncar. El
> título largo descriptivo aparece como encabezado dentro de cada sección.

### Escritorio — sidebar vertical

```
position: sticky; top: [altura navbar + 12px]
display: flex; flex-direction: column; gap: 2px
```

Cada item:
```
display: flex; align-items: center; gap: 10px
padding: 11px 14px
border-radius: 8px
font-family: Source Sans 3, 14px, weight 600
color: marrón #6B4A16
background: transparent
cursor: pointer
min-height: 44px
text-align: left
```

Icono a la izquierda (SVG inline, 18px, `currentColor`):
- Perfil: usuario
- Espacios literarios: enlace/globo (canales)
- Mis libros: pila de libros
- Añade libro: `+` en círculo
- Ayuda: interrogante en círculo

Estado **hover** (item no activo):
```
background: #FFFFFF
color: tinta #3D3A35
```

Estado **activo**:
```
background: #FFFFFF
color: tinta #3D3A35
border-left: 3px solid #F2B705   ← acento mostaza de "estás aquí"
font-weight: 600
box-shadow: 0 1px 4px rgba(61,58,53,0.07)
```

> El borde mostaza a la izquierda es el único uso decorativo de mostaza en el
> área. Comunica "sección activa" sin recurrir a un fondo saturado.

### Móvil — tabs horizontales

```
display: flex; gap: 4px
overflow-x: auto;  -webkit-overflow-scrolling: touch
scrollbar-width: none   /* y ::-webkit-scrollbar { display:none } */
position: sticky; top: [altura navbar]
z-index: 10
background: #FAF6EC
padding: 8px 16px
border-bottom: 0.5px solid #d4c9b0
box-shadow: 0 2px 12px rgba(61,58,53,0.06)
```

Cada tab:
```
flex-shrink: 0
padding: 8px 14px
border-radius: 999px       ← pill
font-family: Source Sans 3, 13px, weight 600
color: marrón #6B4A16
background: #FFFFFF
border: 1px solid #d4c9b0
white-space: nowrap
min-height: 40px
```

Tab activo:
```
background: teja #C75B22
color: blanco #FFFFFF
border-color: transparent
```

> En móvil el activo va en teja sólida (no borde mostaza): un pill pequeño
> necesita relleno para leerse de un vistazo en scroll. La sección activa debe
> auto-scrollear a la vista al cargar (`scrollIntoView`).

### Accesibilidad de la navegación
- Implementar como `role="tablist"` con cada item `role="tab"` y
  `aria-selected`, o como `<nav aria-label="Secciones de tu cuenta">` con
  enlaces y `aria-current="page"` en el activo. Elegir una y ser consistente.
- Navegable por teclado: flechas entre tabs si se usa el patrón ARIA tablist.
- Touch target mínimo 44px (escritorio) / 40px (pills móvil, aceptable por ancho).

---

## Sección 2 — Panel de trabajo: contenedor común

Todas las secciones de contenido comparten este contenedor:

```
background: #FFFFFF
border: 1px solid #d4c9b0
border-radius: 12px
padding: 28px
box-shadow: 0 1px 4px rgba(61,58,53,0.07)
```

Encabezado de cada sección (patrón reutilizable `<SectionHeader>`):
```
margin-bottom: 22px
```
- Título: Fraunces 600, 22px, color tinta `#3D3A35`
- Subtítulo opcional: Source Sans 3, 14px, color marrón `#6B4A16`, margin-top 4px
- Separador inferior: `border-bottom: 0.5px solid #e8dfc8; padding-bottom: 16px`

**Responsive (< 480px):** padding del panel 20px 16px; título 20px.

---

## Sección 3 — Perfil

**Objetivo:** actualizar datos básicos de cuenta. Acción destructiva (eliminar
cuenta) separada en zona de peligro.

Encabezado: `Tu perfil` · subtítulo `Estos datos identifican tu cuenta.`

### Bloque avatar

```
display: flex; align-items: center; gap: 18px
margin-bottom: 24px
```

- Avatar circular 72px (`border-radius: 50%`, `border: 2px solid #d4c9b0`,
  `object-fit: cover`). Fallback de iniciales: fondo mostaza `#F2B705`, texto
  tinta, Fraunces 600 24px.
- Botón `Cambiar avatar` (estilo secundario, ver "Componentes/Botones"). Abre
  selector de archivo. Texto de ayuda debajo: Source Sans 3, 12px, color
  `#9a8c7e`: `JPG o PNG, máximo 2 MB.`

> Subir avatar es un cambio de imagen, no irreversible: botón secundario, sin
> confirmación. El borrado real del avatar anterior lo gestiona el backend.

### Campos del formulario

Grid de 2 columnas en escritorio, 1 en móvil:
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 16px 20px;
```

Campos:
- **Nombre** — texto, requerido.
- **Apellido** — texto, requerido.
- **Email** — texto, **disabled** (se muestra, no se edita). Ver estado disabled
  en "Componentes/Campos". Añadir nota inline: `El email no se puede cambiar.`
  (Source Sans 3, 12px, `#9a8c7e`).
- **País** — select con todos los países (ocupa ancho completo: `grid-column:
  1 / -1`). Mismo estilo de select que `books-spec.md` (chevron custom teja).

### Acción de guardado

Pie del formulario, alineado a la derecha en escritorio, ancho completo en móvil:
```
display: flex; justify-content: flex-end; gap: 12px
margin-top: 24px
padding-top: 18px
border-top: 0.5px solid #e8dfc8
```
- Botón primario `Guardar cambios` (teja). Ver feedback en "Estados".

### Zona de peligro (eliminar cuenta)

**Separada visualmente del formulario**, al final de la sección, en su propio
bloque. No es un botón más entre los campos.

```
margin-top: 32px
border: 1px solid #e7b9a3      ← teja desaturada, no rojo agresivo
border-radius: 10px
background: #fdf3ee            ← teja al ~6%
padding: 18px 20px
```

- Título: `Eliminar cuenta` — Source Sans 3, 14px, weight 600, color teja `#C75B22`
- Texto: Source Sans 3, 13px, color `#6B4A16`:
  `Se borrarán tu perfil, tus espacios literarios y los libros que hayas
  publicado. Esta acción no se puede deshacer.`
- Botón `Eliminar mi cuenta`: estilo de botón peligro (borde teja, texto teja,
  fondo transparente; hover rellena en teja con texto blanco).

**Confirmación obligatoria** (modal): no se borra al primer click.
```
Modal centrado, max-width 420px
Título (Fraunces 600, 20px): "¿Eliminar tu cuenta?"
Texto: repite qué se borra.
Para confirmar, el usuario teclea su email en un campo (prevención de errores).
El botón "Eliminar definitivamente" permanece disabled hasta que el email coincide.
Botones: [Cancelar] (secundario)  [Eliminar definitivamente] (peligro, sólido)
```

> **Nota de seguridad/UX:** el borrado de cuenta es irreversible. El patrón
> "teclea tu email para confirmar" es prevención de errores (heurística de
> Nielsen). La ejecución real del borrado y sus implicaciones (datos en
> Mailchimp, libros publicados) son responsabilidad del backend; esta spec solo
> define la barrera de confirmación en UI.

---

## Sección 4 — Espacios literarios

**Objetivo:** declarar dónde publica reseñas el usuario (lo convierte en
reseñador), sus géneros de interés y formatos. Es la sección más compleja.

Encabezado: `¿Dónde publicas tus reseñas literarias?` · subtítulo
`Añade tus canales para aparecer en el listado de reseñadores.`

### Bloque 1 — Canales (5 toggles con campos revelables)

Lista de 5 canales, cada uno una fila con toggle. Al activar, se revelan dos
campos (nombre del perfil + URL).

Canales: **Blog · Booktube · Instagram · Amazon · Goodreads**

Cada fila de canal:
```
border: 1px solid #d4c9b0
border-radius: 10px
padding: 14px 16px
margin-bottom: 10px
background: #FFFFFF
transition: border-color 0.15s
```
Fila activa (toggle ON): `border-color: #F2B705` (acento sutil de "activo").

Cabecera de la fila:
```
display: flex; align-items: center; justify-content: space-between; gap: 12px
```
- Izquierda: icono del canal (18px) + nombre (Source Sans 3, 14px, weight 600,
  tinta). Iconos coherentes con `reviewers-spec.md`: blog=globo, booktube=play
  circle, instagram=cámara, goodreads=libro abierto, amazon=eReader.
- Derecha: **toggle**. Ver componente Toggle en "Componentes".

Campos revelables (solo si toggle ON):
```
margin-top: 14px
display: grid; grid-template-columns: 1fr 1fr; gap: 12px
```
- Campo `Nombre del perfil` (ej. `@lucia.entreparrafos`)
- Campo `URL` (type=url, con validación de formato)
- En móvil: 1 columna.
- La aparición usa expand/collapse de altura; **respetar
  `prefers-reduced-motion`** (sin animación de altura, mostrar/ocultar directo).

> **Accesibilidad del revelado:** el toggle controla la visibilidad de los
> campos vía `aria-expanded` y `aria-controls`. Cuando está OFF, los campos
> ocultos no deben ser focusables (no solo `display:none` visual; quitar del
> orden de tabulación).

### Separador

`border-top: 0.5px solid #e8dfc8; margin: 24px 0`

### Bloque 2 — Géneros de interés (checkboxes múltiples)

Etiqueta de bloque: `Géneros que te interesan` (Source Sans 3, 13px, weight 600,
uppercase, letter-spacing 0.08em, marrón) + ayuda: `Marca todos los que apliquen.`

17 géneros (aventura, biografías, ciencia ficción, drama psicológico, erótica,
fantasía, ficción histórica, humor, juvenil, novela negra, para niños, poesía,
policial, romántica, suspense, terror, thriller).

**Patrón: chips seleccionables (toggle chips), no checkboxes clásicos.** Más
táctiles y acordes al tono. Cada chip es un checkbox accesible por debajo.
```
display: flex; flex-wrap: wrap; gap: 8px
```
Chip no seleccionado:
```
border: 1px solid #d4c9b0; background: #FFFFFF
color: tinta #3D3A35; border-radius: 999px
padding: 7px 14px; font-family: Source Sans 3, 13px
cursor: pointer; min-height: 40px
```
Chip seleccionado:
```
background: crema #FBF1D8
border-color: #C75B22
color: marrón #6B4A16; font-weight: 600
```
Con un check `✓` (12px) a la izquierda cuando está activo.

> **Accesibilidad:** cada chip es visualmente un botón pero semánticamente un
> `<input type="checkbox">` con `<label>` (el input oculto con clip, el chip es
> el label estilable). Así funciona teclado y lector de pantalla. Estado de
> foco visible en el chip (no solo hover). No transmitir la selección solo por
> color: el check `✓` la refuerza.

### Separador

### Bloque 3 — Cómo te gusta reseñar (textarea)

Etiqueta: `Cómo te gusta escribir tus reseñas`
Textarea:
```
width: 100%; min-height: 120px
border: 1.5px solid #d4c9b0; border-radius: 8px
padding: 12px 14px
font-family: Source Sans 3, 14px; color: tinta #3D3A35
line-height: 1.6; resize: vertical
Focus: border-color #C75B22; box-shadow: 0 0 0 2px rgba(199,91,34,0.18); outline:none
```
- Texto de ayuda (debajo de la etiqueta, antes del campo): el mismo que ya
  tienes — "Algunas ideas para contestar… (tipo de libros, entrevistas,
  sorteos, reseñas positivas y negativas, escala de puntuación, tiempo por
  reseña, etc.)". Source Sans 3, 12px, `#9a8c7e`.
- **Contador de caracteres**: `0 / 2000` abajo a la derecha, Source Sans 3, 12px,
  `#9a8c7e`. Al superar el 90% pasa a teja; bloquea (o avisa) en 2000.

### Separador

### Bloque 4 — Formatos de lectura (checkboxes múltiples)

Etiqueta: `Formatos que sueles leer`
Mismos chips seleccionables que los géneros. 5 opciones: **ePUB · PDF · mobi ·
papel · audiolibro**.

### Guardado

Mismo pie que en Perfil: botón primario `Guardar` (teja), alineado derecha en
escritorio / ancho completo en móvil, con separador superior.

---

## Sección 5 — Mis libros

**Objetivo:** ver los libros que el usuario ha publicado y gestionarlos
(promocionar / editar). Aquí viven los servicios de pago, que hoy quedan
escondidos. Esta spec los hace visibles sin convertir la sección en una tienda.

Encabezado: `Tus libros` · subtítulo `Gestiona tus libros y sus ejemplares.`

A la derecha del encabezado, un atajo (no sustituye a la pestaña "Añade libro"):
- Botón secundario `+ Añadir libro` que lleva a la sección Añade libro.

### Lista de libros (no grid de escaparate)

Aquí cada libro es una **fila de gestión**, no una BookCard de escaparate. La
información relevante es el estado de promoción y las acciones, no seducir.

Cada fila:
```
display: flex; align-items: flex-start; gap: 16px
background: #FFFFFF
border: 1px solid #d4c9b0
border-radius: 10px
padding: 16px
margin-bottom: 12px
```
- **Miniatura** de portada: 56×75px (ratio 3:4), `border-radius: 6px`,
  `object-fit: cover`. Fallback: icono de libro sobre crema.
- **Bloque central** (`flex: 1`):
  - Título: Fraunces 600, 16px, tinta. 1–2 líneas.
  - Metadatos: Source Sans 3, 12px, `#9a8c7e` — `género · formato(s)`.
  - **Estado de promoción** (lo más importante de la fila):
    - Si tiene ejemplares: badge verde — punto `●` `#4a9b5f` 8px + texto
      `X ejemplares disponibles` (Source Sans 3, 12px, weight 600, `#6B4A16`).
    - Si **no** tiene ejemplares: badge de aviso — punto `●` teja `#C75B22` +
      texto `No lo estás promocionando` (mismo tamaño). **No usar solo color:**
      el texto explícito ya transmite el estado.
- **Acciones** (columna derecha en escritorio; fila bajo el contenido en móvil):
  - `Promocionar` — botón primario teja (es la acción de negocio; merece el peso
    visual). Si el libro no tiene ejemplares, este botón gana un realce sutil:
    micro-etiqueta encima `Actívalo` o el botón con leve resalte — pero sin
    estridencias.
  - `Editar` — botón secundario.

> **Sobre "los servicios de pago quedan ocultos":** lo dejaste para más
> adelante, y esta spec no rediseña el flujo de pago. Pero sí da un primer paso
> barato: cuando un libro está sin ejemplares, su estado se ve de un vistazo
> (badge teja + "No lo estás promocionando") y el botón `Promocionar` es el CTA
> primario de la fila. Eso ya reduce el "está escondido" sin abrir el rediseño
> del checkout. Cuando quieras abordarlo, lo trataremos como flujo propio.

### Estado vacío (sin libros)

```
Centrado, padding 48px 20px
[icono libro 48px, teja al 40%]
"Aún no has publicado ningún libro"  (Fraunces 600, 20px)
"Publica tu primer libro para empezar a buscar reseñas."  (Source Sans 3, 14px, marrón)
[+ Añadir mi primer libro]  (botón primario teja)
```

### Estado de carga
Skeleton de 3 filas con la misma estructura (miniatura + 2 líneas + botones),
bloques `#ede3cb` con shimmer. Desactivar shimmer con `prefers-reduced-motion`.

---

## Sección 6 — Añade libro

**Objetivo:** formulario para publicar un libro. Es un formulario largo: hay que
cuidar el agrupado y el feedback para que no agobie en móvil.

Encabezado: `Añade un libro` · subtítulo `Publica los datos del libro que
quieres dar a reseñar.`

### Estructura del formulario

Dos columnas en escritorio: portada a la izquierda (como en la ficha pública,
para coherencia mental), datos a la derecha. Una columna en móvil (portada
arriba).

```css
display: grid;
grid-template-columns: 220px 1fr;   /* desktop */
gap: 28px;
```

#### Columna izquierda — Portada (uploader)

Zona de subida con preview:
```
aspect-ratio: 3 / 4; width: 100%
border: 1.5px dashed #d4c9b0; border-radius: 10px
background: crema #FBF1D8
display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px
cursor: pointer
```
- Sin imagen: icono de imagen (teja al 40%) + texto `Sube la portada`
  (Source Sans 3, 13px, marrón) + ayuda `JPG o PNG · 3:4 recomendado`.
- Con imagen: preview a sangre + botón pequeño `Cambiar` superpuesto abajo.
- Soporta click y arrastrar-soltar (drag&drop) en escritorio; en móvil, click.
- Estado de foco visible (es interactivo).

#### Columna derecha — Campos

```css
display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px;
```

- **Título** — texto, requerido (`grid-column: 1 / -1`).
- **Autor** — texto, **disabled**, prerelleno con nombre y apellido del usuario
  (`grid-column: 1 / -1`). Nota inline: `Se publica con tu nombre de perfil.`
- **Sinopsis** — textarea (`grid-column: 1 / -1`), hasta 2000 chars, con contador
  (mismo patrón que el textarea de Espacios literarios).
- **Editorial** — texto. Placeholder/ayuda: `Déjalo vacío si es independiente.`
- **Fecha de publicación** — date picker (abre calendario). Mismo estilo de
  campo; el icono de calendario en teja.
- **Género literario** — select (dropdown), 17 opciones. Mismo estilo de select
  del producto.
- **Nº de páginas** — número, `inputmode="numeric"`, min 1.
- **Formatos disponibles** — chips seleccionables múltiples (mismo patrón que
  Espacios literarios), `grid-column: 1 / -1`. 5 opciones: ePUB · PDF · mobi ·
  papel · audiolibro.

> **Por qué chips y no checkboxes sueltos para formatos:** unifica el lenguaje
> con la sección Espacios literarios (consistencia, heurística de Nielsen) y es
> más cómodo en móvil que checkboxes pequeños.

### Guardado

Pie estándar: botón primario `Publicar libro` (teja). Tras publicar, mensaje de
éxito y, idealmente, redirección a "Mis libros" con el nuevo libro visible
(decisión de implementación, no de esta spec).

**Recordatorio contextual** bajo el botón (Source Sans 3, 12px, `#9a8c7e`):
`Para que aparezca en las búsquedas, recuerda añadir ejemplares desde "Mis
libros".` — Resuelve un punto de confusión real (publicar ≠ aparece en
búsquedas) directamente donde ocurre.

---

## Sección 7 — Ayuda

**Objetivo:** resolver dudas frecuentes. Es solo texto; se trata como FAQ
legible, no como muro de párrafos.

Encabezado: `Ayuda` · subtítulo `Respuestas a las preguntas más habituales.`

### Formato: acordeón de preguntas

3 entradas, patrón acordeón (una pregunta abierta a la vez no es obligatorio;
permitir varias abiertas es más cómodo).

Cada entrada:
```
border: 1px solid #d4c9b0; border-radius: 10px
margin-bottom: 10px; background: #FFFFFF
```
- Cabecera (botón): pregunta en Source Sans 3, 15px, weight 600, tinta; chevron
  a la derecha que rota al abrir. `min-height: 48px`, padding 14px 16px.
- Cuerpo: Source Sans 3, 14px, line-height 1.7, color `#5a524a`, padding
  0 16px 16px.

Contenido (el que ya tienes, sin cambios de fondo):

1. **Mi libro no aparece en el listado de libros disponibles** → explicación de
   alta → Mis libros → ejemplares vía Promocionar.
2. **Mi perfil de reseñador aparece muy atrás en los resultados** → escribir a
   `alejandro@resenansancho.com`.
3. **¿Tienes una duda, comentario o algo no funciona?** → escribir a
   `alejandro@resenansancho.com`.

> Los emails se renderizan como enlaces `<a href="mailto:…">` reales.

> **Sugerencia (no bloqueante):** la pregunta 2 invita a escribir un email para
> "subir" un perfil en el ranking. Es un proceso manual que no escala; cuando
> abordes backend/automatización quizá quieras revisar ese criterio de orden.
> Fuera del alcance de esta spec de diseño.

### Acordeón — accesibilidad
- Cabecera = `<button aria-expanded>` que controla el cuerpo (`aria-controls`,
  `role="region"`). Chevron decorativo (`aria-hidden`).
- Animación de apertura respeta `prefers-reduced-motion`.

---

## Componentes compartidos

### Botones

Tres niveles, reutilizables en toda el área:

**Primario (teja)** — confirmar/guardar/acción de negocio:
```
background: teja #C75B22; color: #FFFFFF
font-family: Source Sans 3, 14px, weight 600
border-radius: 8px; padding: 11px 22px; border: none; min-height: 44px
Hover: #a84a1b   Active: #8f3f17 + scale(0.98)
```

**Secundario (contorno)** — acciones no principales (Cambiar avatar, Editar,
Añadir libro como atajo):
```
background: transparent; color: teja #C75B22
border: 1.5px solid #C75B22; border-radius: 8px
padding: 10px 20px; font-weight: 600; min-height: 44px
Hover: background: #C75B22; color: #FFFFFF
```

**Peligro** — eliminar cuenta:
```
Base: igual que secundario pero usa teja; el botón de confirmación final del
modal va sólido (fondo teja, texto blanco).
```

> No se usa el botón mostaza del escaparate ("pedir ejemplar") en el área
> personal: aquí no hay esa acción. La mostaza queda solo como acento de
> navegación activa.

### Campos de formulario (input/select/textarea)

Estilo unificado, heredado de `books-spec.md`:
```
background: #FFFFFF
border: 1.5px solid #d4c9b0; border-radius: 8px
padding: 10px 14px
font-family: Source Sans 3, 14px; color: tinta #3D3A35
min-height: 44px
Focus: border-color #C75B22; outline: none; box-shadow: 0 0 0 2px rgba(199,91,34,0.18)
```
Estado **disabled** (email, autor):
```
background: #f4eedd; color: #9a8c7e; cursor: not-allowed; border-color #e8dfc8
```
Estado **error** (validación):
```
border-color: #DE4A10
+ mensaje debajo: Source Sans 3, 12px, color #DE4A10, con icono ⚠ (no solo color)
```
Cada campo lleva `<label>` visible encima (Source Sans 3, 13px, weight 600,
marrón, margin-bottom 6px). Nada de depender solo de placeholders.

### Toggle (canales de Espacios literarios)

```
width: 44px; height: 24px; border-radius: 999px
OFF: background #d4c9b0   ON: background #C75B22
Perilla: círculo blanco 18px, se desplaza; transición 0.15s
Focus visible: box-shadow 0 0 0 2px rgba(199,91,34,0.25)
```
- Semánticamente `<input type="checkbox" role="switch">` con `<label>`.
- Respeta `prefers-reduced-motion` (sin transición de la perilla).

### Chips seleccionables (géneros, formatos)
Ver definición en Sección 4, Bloque 2. Reutilizar el mismo componente en
"Añade libro" y "Espacios literarios".

---

## Estados (transversales)

### Guardado de formularios
- **Cargando:** el botón primario pasa a estado loading (spinner 16px + texto
  `Guardando…`), disabled mientras dura.
- **Éxito:** toast/banner discreto arriba del panel: fondo crema, borde
  `#4a9b5f`, icono check, texto `Cambios guardados`. Desaparece a los ~4s.
  No usar solo color: icono + texto.
- **Error:** banner: fondo `#fdf3ee`, borde teja, icono ⚠, texto
  `No se pudieron guardar los cambios. Inténtalo de nuevo.` + acción `Reintentar`.

### Sin conexión / error de carga (Mis libros)
Banner horizontal arriba del listado, mismo patrón que `books-spec.md`.

---

## Responsive — resumen

| Aspecto              | Escritorio (≥900px)        | Móvil (<900px)                 |
|----------------------|----------------------------|--------------------------------|
| Navegación           | Sidebar vertical sticky    | Tabs horizontales scroll sticky|
| Acento sección activa| Borde izq. mostaza         | Pill teja sólido               |
| Layout área          | Grid 240px + 1fr           | 1 columna, ancho completo      |
| Formularios 2-col    | 2 columnas                 | 1 columna                      |
| Añade libro          | Portada izq + datos der    | Portada arriba, datos abajo    |
| Acciones "Mis libros"| Columna derecha de la fila | Fila bajo el contenido         |
| Pie de guardado      | Botón alineado a la derecha| Botón ancho completo           |

Breakpoint principal: **900px** (cambio sidebar↔tabs). Breakpoint secundario:
**480px** (paddings y tamaños tipográficos reducidos, formularios a 1 columna si
no lo estaban ya).

---

## Accesibilidad — resumen

- Navegación con patrón ARIA consistente (`tablist`/`tab`/`aria-selected` **o**
  `nav`+`aria-current`); navegable por teclado.
- Todos los campos con `<label>` real; estados disabled y error perceptibles sin
  depender solo del color (icono + texto).
- Toggles y chips son inputs reales por debajo (switch / checkbox) con foco
  visible; no divs clicables.
- Acordeón de Ayuda y campos revelables de canales: `aria-expanded` +
  `aria-controls`; contenido oculto fuera del orden de tabulación.
- Modal de eliminar cuenta: foco atrapado dentro del modal, `Esc` cierra,
  retorno de foco al disparador al cerrar; confirmación por escritura del email.
- `prefers-reduced-motion`: sin animaciones de altura (revelados, acordeón),
  sin shimmer en skeletons, sin transición de toggles.
- Touch targets mínimos 44px (40px aceptable solo en pills de tabs por su ancho).
- Contrastes (verificados sobre los fondos de esta sección):
  - Tinta `#3D3A35` sobre `#FAF6EC` / blanco: >7:1 ✓
  - Marrón `#6B4A16` sobre blanco: ~5.9:1 ✓
  - Blanco sobre teja `#C75B22`: ~4.7:1 ✓ WCAG AA
  - Tinta sobre mostaza `#F2B705` (solo borde/acento, poco texto): ~6.8:1 ✓

---

## Propuesta al sistema de diseño

Esta sección introduce patrones nuevos que conviene **subir al sistema de
diseño** (`theme.ts` / documento de sistema) para reutilizarlos, en lugar de
dejarlos como isla:

1. **Token `fondoApp` `#FAF6EC`**: fondo de zonas autenticadas/de trabajo.
   Diferencia "app" de "escaparate" sin romper la paleta.
2. **Token `exito` `#4a9b5f`**: ya se usaba informalmente en `book-detail-spec.md`
   para el punto de disponibilidad; conviene oficializarlo.
3. **Componente `Toggle` (switch)**: nuevo en el producto. Definir una vez.
4. **Componente `SelectableChip`** (chips de selección múltiple): generaliza los
   chips de género/formato; reutilizable en filtros futuros.
5. **Patrón `DangerZone`** (bloque de acción irreversible con confirmación por
   escritura): reutilizable para cualquier borrado futuro.
6. **Patrón `SectionHeader`** (título Fraunces + subtítulo + separador): ya
   aparece implícito en otras páginas; conviene componentizarlo.

> Decidir cuáles adoptar antes de implementar. Si se aprueban, actualizar
> `theme.ts` y el documento de sistema **antes** de pasar la implementación al
> agente `senior-frontend`.

---

## Componentes sugeridos

```
AccountPage/
  index.tsx                ← layout maestro: barra contexto + nav + sección activa
  AccountContextBar.tsx    ← "← Volver a la web" + saludo
  AccountNav.tsx           ← sidebar (desktop) / tabs (móvil), recibe sección activa
  SectionHeader.tsx        ← título + subtítulo + separador (reutilizable)
  sections/
    ProfileSection.tsx     ← formulario de perfil + DangerZone
    SpacesSection.tsx      ← canales (toggles) + géneros + textarea + formatos
    MyBooksSection.tsx     ← lista de filas de gestión + estados
    AddBookSection.tsx     ← formulario de alta de libro
    HelpSection.tsx        ← acordeón de FAQ
  components/
    Toggle.tsx             ← switch accesible
    SelectableChip.tsx     ← chip checkbox accesible (géneros/formatos)
    BookManageRow.tsx      ← fila de "Mis libros"
    CoverUploader.tsx      ← uploader de portada con preview y drag&drop
    DangerZone.tsx         ← bloque de eliminación con modal de confirmación
    CharCounter.tsx        ← contador de caracteres para textareas
    SaveBar.tsx            ← pie de guardado (botón + estados loading/éxito/error)
```

### Props principales (orientativas)

```ts
type AccountSection = 'profile' | 'spaces' | 'books' | 'addBook' | 'help';

interface AccountPageProps {
  user: { firstName: string; lastName: string; email: string;
          country: string; avatarUrl?: string; initials: string };
  activeSection: AccountSection;
}

interface BookManageRowProps {
  title: string;
  coverUrl?: string;
  genre: string;
  formats: string[];
  availableCopies: number;     // 0 → "No lo estás promocionando"
  onPromote: () => void;
  onEdit: () => void;
}

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;               // accesible
}

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}
```

---

## Coherencia con otras páginas

| Elemento              | Público (home/books/…) | Área personal            |
|-----------------------|------------------------|--------------------------|
| Fondo                 | Blanco / crema         | Crema desaturado `#FAF6EC` + paneles blancos |
| Tipografía titulares  | Fraunces 600           | Fraunces 600             |
| Tipografía cuerpo     | Source Sans 3          | Source Sans 3            |
| CTA primario          | Mostaza (pedir ejemplar)| Teja (guardar/confirmar)|
| Uso de mostaza        | Acento de marca / CTA  | Solo acento "sección activa" |
| Border-radius paneles | 12px                   | 12px (paneles) / 10px (filas, inputs) |
| Borde separador       | 0.5px `#d4c9b0`        | 0.5px `#d4c9b0` / `#e8dfc8` internos |
| Navegación            | Navbar horizontal      | Sidebar (desktop) / tabs (móvil) |

---

*Para implementar este diseño, delegar en el agente `senior-frontend` con este
documento, más `home-hero-spec.md`, `books-spec.md` y `navbar-spec.md` como
contexto. Antes de implementar, decidir qué patrones nuevos (sección "Propuesta
al sistema de diseño") se suben a `theme.ts`.*
