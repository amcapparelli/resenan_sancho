# Modal de contacto ("Pedir ejemplar") — Especificación de rediseño v2

Rediseño del modal que usa un reseñador para pedir un ejemplar de un libro.
Añade contexto del libro y consejos amables para reducir las solicitudes sin
intención real de reseñar, sin tocar el texto legal de consentimiento.

> **Supersede una nota anterior:** `book-detail-spec.md` decía "reutilizar el
> modal de mensaje existente sin modificarlo". Este documento sí lo modifica;
> a partir de aquí, esta spec manda sobre esa nota.

Mockup interactivo de referencia: `modal-contacto-mockup.html` (adjunto en la
misma entrega). Reproduce fielmente estilos y comportamiento; úsalo para
comprobar detalles visuales que el texto no capture.

---

## 1. Objetivo

Que el reseñador, antes de enviar la solicitud, tenga claro (a) qué recibe el
autor con su mensaje y (b) qué se espera de él si acepta el ejemplar —
manteniendo el formulario corto y sin fricción, en un tono cercano y sin
sonar a advertencia legal.

## 2. Dónde se abre

Se abre al pulsar "Pedir un ejemplar" desde la ficha de libro
(`book-detail-spec.md`, sección CTA) y desde las tarjetas de resultados en
`/books`, allí donde ya se dispara hoy. No cambia el disparador, solo el
contenido del modal.

## 3. Stack y restricciones

Next.js 15.5.x · React 18 · TypeScript · Material UI + styled-components ·
Pages Router. Sin Tailwind. Sigue las mismas convenciones de
`books-spec.md` / `account-spec.md`.

## 4. Tokens

```ts
colors: {
  mustaza:     '#F2B705',
  teja:        '#C75B22',
  tejaHover:   '#a84a1b',
  tejaActive:  '#8f3f17',
  crema:       '#FBF1D8',
  tinta:       '#3D3A35',
  marron:      '#6B4A16',
  blanco:      '#FFFFFF',
  bordeClaro:  '#d4c9b0',
  bordeInterno:'#e8dfc8',
  textoSecundario: '#9a8c7e',
  textoCuerpo: '#5a524a',   // color de párrafo de la caja de consejos
  rojo:        '#DE4A10',   // solo error
}
fonts: {
  display: 'Fraunces', weight 600,   // título del modal
  body: 'Source Sans 3', weight 400/600,
}
```

---

## 5. Maquetación

### Escritorio (≥ 900px) — modal centrado

```
┌────────────────────────────────────────┐
│ [x]                                    │
│  [portada 40×54]  Título del libro      │
│                    de {Autor}           │
│                                          │
│  Pedir este ejemplar        (Fraunces)  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │ 🔖  Antes de pedirlo, asegúrate   │  │
│  │     de que te interesa de verdad… │  │
│  │     Y si al final no puedes...    │  │
│  └──────────────────────────────────┘  │
│                                          │
│  Tu mensaje para {Autor}                │
│  Preséntate y cuéntale qué te ha…       │
│  ┌──────────────────────────────────┐  │
│  │                                    │  │
│  │  (textarea)                       │  │
│  │                                    │  │
│  └──────────────────────────────────┘  │
│                              0 / 2000   │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │ ☐ Al enviar el mensaje le...      │  │
│  └──────────────────────────────────┘  │
│                                          │
│                  [Cancelar] [Enviar →]  │
└────────────────────────────────────────┘
   max-width: 480px · border-radius: 14px
```

### Móvil (< 900px) — hoja inferior (bottom sheet)

Mismo contenido y orden. Cambios de layout:
- El modal se ancla abajo (`align-items: flex-end` en el overlay), ocupa el
  100% del ancho, esquinas redondeadas solo arriba (`16px 16px 0 0`).
- `max-height: 92vh`, scroll interno si el contenido no cabe.
- Footer: botones apilados a ancho completo, `Enviar mensaje` arriba,
  `Cancelar` debajo (`flex-direction: column-reverse`).
- Título del modal baja a 20px.

> El público de la plataforma es mayoritariamente móvil (ver
> `sistema-diseno-resenan-sancho.md`); el bottom sheet es más cómodo de
> alcanzar con el pulgar que un modal centrado pequeño.

---

## 6. Secciones, en detalle

### 6.1 Botón cerrar
```
position: absolute; top: 14px; right: 14px
width/height: 36px; border-radius: 50%
color: marrón #6B4A16; background: transparent
Hover: background: crema #FBF1D8
```
Icono X, 16px, `stroke-width: 2`. `aria-label="Cerrar"`.

### 6.2 Contexto del libro
```
display: flex; align-items: center; gap: 12px
margin-bottom: 16px (12px en móvil, < 900px)
```
- Miniatura de portada 40×54 (ratio 3:4), `border-radius: 5px`, fondo crema,
  borde `1px solid #d4c9b0`. Fallback: icono de libro (mismo patrón que
  `account-spec.md` → "Mis libros").
- Título del libro: Source Sans 3, 13px, weight 600, tinta, una línea con
  ellipsis.
- Autor: `de {Nombre} {Apellido}` — Source Sans 3, 12px, `#9a8c7e`, una línea
  con ellipsis. Aquí sí va el nombre completo (a diferencia del título, §6.3):
  la altura de esta fila la fija la portada de 54px, así que un nombre largo
  no cuesta alto, y si no cabe se recorta con ellipsis. Cuando no hay apellido
  se muestra solo el nombre, sin espacio sobrante.

### 6.3 Título del modal
`Pedir este ejemplar a {Nombre del autor}` — Fraunces 600, 22px (20px en
móvil), tinta. Solo el nombre de pila, nunca el apellido: con apellido el
título pasa de una línea a dos en móvil (~34 caracteres frente a los ~29 que
caben a 20px en 360px) y se come el margen recuperado en la revisión de
2026-08-21. `margin-bottom: 14px` (10px en móvil).

### 6.4 Caja de consejos (elemento nuevo)
```
background: crema #FBF1D8
border: 1px solid #d4c9b0
border-radius: 10px
padding: 16px 16px 16px 14px (14px vertical en móvil, < 900px)
margin-bottom: 22px (16px en móvil)
display: flex; gap: 12px
```
- Icono a la izquierda: marcador de libros de la marca (mismo motivo que el
  logo, ver `sistema-diseno-resenan-sancho.md`), 18×22px, relleno teja.
- Texto: Source Sans 3, 13.5px, line-height 1.6, color marrón `#6B4A16`.
  Lista (`<ul>` real, sin titulillo) de dos consejos muy cortos, `~6px` entre
  ítems y `padding-left` reducido a `16-18px` (el de por defecto se come el
  ancho disponible). Copy exacto en la sección 11 — **no parafrasear**.

> **Revisión (2026-08-21).** Antes eran dos párrafos largos. Se acortaron a una
> lista de dos ítems porque la caja era el bloque más alto del modal y obligaba
> a hacer scroll para ver la casilla de consentimiento y el botón de enviar. De
> paso se eliminó la frase "Aprovecha el mensaje para presentarte y contar en
> qué blog o canal la vas a publicar…", que duplicaba el texto de ayuda del
> campo de mensaje (§6.5) a pocos elementos de distancia en pantalla. Ese texto
> de ayuda no cambia. El `min-height: 130px` del textarea se mantiene por
> decisión expresa: la altura se recupera de los márgenes, no del área de
> escritura.

### 6.5 Campo de mensaje
Reutiliza el patrón de textarea + contador ya definido en
`account-spec.md` (Espacios literarios, bloque "Cómo te gusta reseñar"):
```
label: 13px, weight 600, marrón, margin-bottom 5px
field-help (nuevo, entre label y textarea): 12px, #9a8c7e, margin-bottom 8px
textarea: min-height 130px, border 1.5px #d4c9b0, border-radius 8px,
          padding 12px 14px, Source Sans 3 14px, line-height 1.6
  Focus: border-color teja, box-shadow 0 0 0 2px rgba(199,91,34,0.18)
contador: 12px, #9a8c7e, alineado a la derecha, margin-top 6px
  Por encima de 1800 caracteres pasa a color teja (mismo criterio que el
  resto del producto).
```
- Label: `Tu mensaje` — sin el nombre del autor. Desde que el título (§6.3) lo
  nombra, repetirlo aquí era la cuarta aparición del mismo nombre en un modal
  corto. El placeholder sí lo conserva.
- Field-help: copy exacto en sección 11.
- Placeholder: copy exacto en sección 11.
- `maxLength`: 2000.

### 6.6 Checkbox de consentimiento
**Texto sin cambios** respecto al modal actual:
> "Al enviar el mensaje le facilitaremos tu email al autor para que se ponga
> en contacto contigo. Marca esta casilla si estás de acuerdo."

Estilo (nuevo, antes era un checkbox suelto):
```
display: flex; align-items: flex-start; gap: 10px
padding: 14px
background: #FAF6EC
border: 1px solid #d4c9b0; border-radius: 10px
checkbox: 18×18px, accent-color teja, cursor pointer
label: 12.5px, line-height 1.55, color #5a524a, cursor pointer
```
`<input type="checkbox">` real con `<label>` asociado (no div clicable).

### 6.7 Footer
```
padding: 20px 26px 26px (16px 20px 22px en móvil)
display: flex; gap: 10px; justify-content: flex-end (column-reverse en móvil)
border-top: 0.5px solid #e8dfc8
```
- `Cancelar` — botón secundario (contorno teja), cierra el modal sin enviar.
- `Enviar mensaje` — botón primario (teja sólido). Ver lógica de habilitación
  en la sección 7.

---

## 7. Lógica de habilitación del botón "Enviar mensaje"

**Requisito explícito:** el botón debe estar deshabilitado por defecto y
habilitarse únicamente cuando se cumplen **las dos condiciones a la vez**:

1. El checkbox de consentimiento está marcado.
2. El textarea tiene contenido real (no vacío ni solo espacios en blanco).

Si en cualquier momento deja de cumplirse una de las dos (se desmarca el
checkbox, o se borra todo el texto), el botón vuelve a deshabilitarse
inmediatamente — no hace falta un segundo intento de envío para que se
bloquee.

Implementación sugerida (estado derivado, no un tercer estado a sincronizar):

```ts
const isSendEnabled = consentChecked && message.trim().length > 0;

<button
  disabled={!isSendEnabled}
  aria-disabled={!isSendEnabled}
  onClick={handleSend}
>
  Enviar mensaje
</button>
```

Evitar guardar `isSendEnabled` como estado propio con un `useEffect` que lo
recalcule — al ser un valor derivado de `consentChecked` y `message`, calcularlo
directamente en el render evita un ciclo de sincronización innecesario y un
posible frame de desfase.

No se pide (a menos que se indique lo contrario) una longitud mínima de
caracteres distinta de "no vacío" — un espacio en blanco no cuenta como
contenido, pero un mensaje de una sola palabra sí habilita el botón.

---

## 8. Props / componentes sugeridos

```
ContactModal/
  index.tsx              ← estado del formulario, lógica de habilitación, submit
  BookContextHeader.tsx  ← miniatura + título + autor
  TipsBox.tsx             ← caja de consejos (icono + 2 párrafos, contenido fijo)
  MessageField.tsx        ← label + help + textarea + contador (reutilizable,
                             ya existe un patrón similar en Espacios literarios;
                             auditar antes de crear uno nuevo)
  ConsentCheckbox.tsx     ← checkbox + label con el texto legal
```

```ts
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    coverUrl?: string;
  };
  author: {
    firstName: string;
    /** Puede venir vacío: muchos autores independientes solo registran nombre. */
    lastName?: string;
  };
  onSubmit: (message: string) => Promise<void>;
}
```

`author.firstName` alimenta el título del modal (§6.3) y el placeholder del
mensaje. El nombre completo (`firstName` + `lastName`, uniendo solo las partes
no vacías) alimenta la línea de autor del contexto del libro (§6.2). Son dos
valores distintos para dos sitios distintos, a propósito: el título va sin
apellido para no partirse en dos líneas en móvil, y el contexto sí lo lleva
porque esa fila no crece de alto. Pasar los nombres ya resueltos, no
reconstruirlos dentro del componente.

---

## 9. Estados

- **Carga inicial:** ninguno relevante (el modal no hace fetch propio; recibe
  `book`/`author` ya cargados por la página que lo abre).
- **Envío en curso:** el botón `Enviar mensaje` pasa a estado loading
  (spinner 16px + texto `Enviando…`), disabled mientras dura, mismo patrón
  que el resto del producto (`account-spec.md` → "Guardado de formularios").
- **Éxito:** cerrar el modal y mostrar el mismo patrón de toast/banner de
  éxito ya usado en la cuenta (fondo crema, borde `#4a9b5f`, icono check).
  Texto: `Mensaje enviado`.
- **Error:** banner dentro del modal (no cierra), mismo patrón de error del
  resto del producto (fondo `#fdf3ee`, borde teja, icono ⚠, botón
  `Reintentar`). Texto: `No se pudo enviar el mensaje. Inténtalo de nuevo.`

---

## 10. Accesibilidad

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` apuntando al
  título del modal.
- Foco atrapado dentro del modal mientras está abierto; `Esc` cierra; el foco
  vuelve al botón que abrió el modal al cerrarse (mismo patrón que el modal
  de eliminar cuenta en `account-spec.md`).
- Textarea y checkbox con `<label>` real asociado (no placeholders como única
  referencia).
- Botón "Enviar mensaje" deshabilitado: usar `disabled` **y** `aria-disabled`
  juntos; no ocultar el motivo — el texto de ayuda del textarea y el propio
  checkbox ya comunican qué falta, no hace falta un mensaje adicional de
  error mientras el usuario simplemente no ha terminado de rellenar.
- Contraste verificado (mismos valores que el resto del producto):
  marrón `#6B4A16` sobre crema `#FBF1D8`: ~4.6:1 ✓ · blanco sobre teja
  `#C75B22`: ~4.7:1 ✓ WCAG AA.
- Touch targets ≥ 44px en botones y checkbox (el checkbox visual es 18px,
  pero su área táctil —incluyendo el padding de la fila— debe alcanzar 44px).
- `prefers-reduced-motion`: sin animación de entrada/salida del modal más
  allá de una transición de opacidad simple.

---

## 11. Copy exacto

No parafrasear ninguno de estos textos al implementar:

| Elemento | Texto |
|---|---|
| Título del modal | `Pedir este ejemplar a {Nombre del autor}` (solo nombre de pila) |
| Caja de consejos, ítem 1 | `Pídelo solo si te apetece leerlo y reseñarlo.` |
| Caja de consejos, ítem 2 | `Si al final no puedes, avísale: mejor que el silencio.` |
| Label del textarea | `Tu mensaje` |
| Autor en el contexto del libro | `de {Nombre} {Apellido}` (solo el nombre si no hay apellido) |
| Ayuda bajo el label | `Preséntate y cuéntale qué te ha llamado la atención del libro. Si tu blog o canal no aparece aún en tu perfil, menciónalo aquí.` |
| Placeholder del textarea | `Hola {Nombre}, soy… y escribo reseñas en… Me interesa tu libro porque…` |
| Checkbox (sin cambios) | `Al enviar el mensaje le facilitaremos tu email al autor para que se ponga en contacto contigo. Marca esta casilla si estás de acuerdo.` |
| Botón secundario | `Cancelar` |
| Botón primario | `Enviar mensaje` (loading: `Enviando…`) |
| Toast de éxito | `Mensaje enviado` |
| Banner de error | `No se pudo enviar el mensaje. Inténtalo de nuevo.` |

---

## 12. Coherencia con otras páginas

| Elemento | Resto del producto | Este modal |
|---|---|---|
| Tipografía titulares | Fraunces 600 | Fraunces 600 |
| Tipografía cuerpo/UI | Source Sans 3 | Source Sans 3 |
| CTA primario | Teja (acciones de negocio) | Teja (`Enviar mensaje`) |
| Border-radius contenedor | 12px (cards) / 10px (paneles) | 14px (modal) |
| Caja destacada informativa | Crema, borde `#d4c9b0` (igual que tips-box) | Igual |
| Botón deshabilitado | Opacidad reducida + `disabled` | Igual |

---

*Para implementar, delegar en el agente `senior-frontend` con este documento,
el mockup `modal-contacto-mockup.html` y `book-detail-spec.md` como contexto.
Antes de escribir código, auditar si ya existe un componente de textarea con
contador reutilizable (Espacios literarios lo usa) para no duplicarlo.*
