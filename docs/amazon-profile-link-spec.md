# Enlace de perfil de Amazon — Spec delta v1

Cambio acotado en la sección de canales del área personal (`account-spec.md`,
Sección 4, Bloque 1 · `SpacesSection.tsx`). Solo afecta al canal **Amazon**.
Todo lo no mencionado aquí sigue como está en `account-spec.md`.

---

## Problema

Mucha gente pega en el canal Amazon un enlace que no muestra sus reseñas: la
ficha de un producto, la página de su cuenta privada o un enlace acortado. El
enlace que necesitamos es el del **perfil público**, donde Amazon lista las
reseñas de esa persona:

```
https://www.amazon.es/gp/profile/amzn1.account.AE3XXXXXXXXXXXXXXX
```

Vale cualquier dominio de Amazon (.es, .com, .com.mx, .co.uk, .de…).

## Solución

1. **Guía desplegable** junto al campo URL de Amazon: explica cómo llegar a ese
   enlace sin salir del formulario.
2. **Validación con mensajes específicos** según el tipo de enlace erróneo
   (solo en el cliente).
3. **Normalización** de la URL válida antes de guardarla.
4. **Aviso no bloqueante** para los enlaces ya guardados que no son válidos.

Fuera de alcance: validación en la API, limpieza masiva de enlaces existentes
y emails a quienes los tienen. Esta spec no requiere cambios de backend.

---

## Fase 1 — Guía desplegable (solo frontend)

### Ubicación

Dentro de la fila del canal Amazon, cuando el toggle está ON, **debajo del
campo URL** (ocupa todo el ancho de la fila: `grid-column: 1 / -1`).

### Disparador

Botón de texto, no enlace (no navega):

```
¿Dónde encuentro este enlace?
```

- Source Sans 3, 13px, weight 600, color teja `#C75B22`
- Fondo transparente, sin borde, `padding: 4px 0`, `min-height: 44px`
- Chevron 12px a la derecha que rota 180° al abrir (`aria-hidden`)
- Hover: subrayado
- Semántica: `<button type="button" aria-expanded aria-controls="amazon-help">`

### Panel

```
margin-top: 8px
background: crema #FBF1D8
border: 1px solid #d4c9b0
border-radius: 8px
padding: 14px 16px
font-family: Source Sans 3, 13px; line-height: 1.6; color: tinta #3D3A35
```

Contenido (texto definitivo aprobado por `copywriter-es`; sustituye al
provisional de v1):

> Para enseñar tus reseñas publicadas, pega aquí el enlace de tu **perfil
> público de Amazon**: la página donde salen todas. No el de un libro.
>
> 1. Entra en Amazon y abre “Mi cuenta”.
> 2. Pulsa en “Mi contenido”: verás la página con tus reseñas.
> 3. Copia la dirección del navegador y pégala aquí.
>
> Lo sabrás porque la dirección contiene `/gp/profile/`.
>
> ¿No ves tus reseñas en esa página? Revisa en los ajustes de privacidad de
> Amazon que tu perfil sea público.

- Lista numerada con `<ol>`; el fragmento `/gp/profile/` en `<code>` con fondo
  `#efe5c8`, `border-radius: 4px`, `padding: 1px 5px`.
- La última línea en Source Sans 3, 12px, color marrón `#6B4A16`.

> **Ruta verificada en amazon.es:** Mi cuenta → Mi contenido abre el perfil
> público en una URL con la forma `/gp/profile/amzn1.account.…?ref_=…` (la
> normalización de la Fase 2 elimina el `ref_` y la query).
>
> Los pasos no están verificados en otros dominios de Amazon (.com, .com.mx,
> .co.uk, .de…); el nombre de los menús puede variar.

### Comportamiento

- Cerrado por defecto.
- Se abre automáticamente cuando la validación muestra un error (Fase 2).
- Expand/collapse de altura; con `prefers-reduced-motion`, mostrar/ocultar
  directo.
- Cerrado = contenido fuera del orden de tabulación.

### Criterios de prueba (Fase 1)

- [ ] Con el toggle de Amazon OFF no aparece ni el botón ni el panel.
- [ ] El botón abre y cierra el panel; `aria-expanded` cambia.
- [ ] Navegable con teclado (Tab llega al botón, Enter/Espacio lo activa).
- [ ] En móvil (375px) el panel no desborda y el texto se lee sin zoom.
- [ ] Con `prefers-reduced-motion` no hay animación.
- [ ] Ningún otro canal muestra la guía.

---

## Fase 2 — Validación y normalización (frontend)

### Clasificación de la URL

Crear una función pura y testeable, por ejemplo
`src/utils/amazonProfileUrl.ts`:

```ts
export type AmazonUrlKind =
  | 'profile'      // válido
  | 'product'      // ficha de producto
  | 'account'      // cuenta privada
  | 'short'        // enlace acortado
  | 'other';       // cualquier otra cosa

export function classifyAmazonUrl(input: string): AmazonUrlKind;
export function normalizeAmazonProfileUrl(input: string): string | null;
```

Reglas, en este orden (sobre la URL recortada; si no tiene protocolo, se
antepone `https://` antes de evaluar):

| Orden | Condición | Tipo |
| --- | --- | --- |
| 1 | Host `amzn.eu`, `amzn.to`, `a.co` | `short` |
| 2 | Host no es `amazon.<tld>` ni `www.amazon.<tld>` | `other` |
| 3 | Ruta contiene `/gp/profile/amzn1.account.` | `profile` |
| 4 | Ruta contiene `/dp/`, `/gp/product/` o `/product-reviews/` | `product` |
| 5 | Ruta empieza por `/gp/css/`, `/your-account`, `/hz/` o `/gp/your-account` | `account` |
| 6 | Resto | `other` |

Patrón de referencia para `profile`:

```ts
/^https?:\/\/(www\.)?amazon\.[a-z.]{2,6}\/gp\/profile\/(amzn1\.account\.[A-Z0-9]+)/i
```

### Normalización (solo para `profile`)

Guardar siempre la forma canónica, sin `ref=`, query ni fragmento:

```
https://www.amazon.<tld>/gp/profile/amzn1.account.<ID>
```

Ejemplo:
`amazon.es/gp/profile/amzn1.account.AE3ABC/ref=cm_cr_dp_d_gw_tr?ie=UTF8`
→ `https://www.amazon.es/gp/profile/amzn1.account.AE3ABC`

### Mensajes de error

Usan el estado de error de campo ya definido en `account-spec.md` (borde
`#DE4A10`, icono ⚠, texto 12px debajo del campo).

Texto definitivo aprobado por `copywriter-es` (sustituye al provisional de v1):

| Tipo | Mensaje |
| --- | --- |
| `product` | Este es el enlace de un producto, no de tu perfil. Necesitamos el que enseña tus reseñas. |
| `account` | Este es el enlace de tu cuenta privada: nadie más puede verlo. Necesitamos tu perfil público. |
| `short` | Es un enlace acortado. Ábrelo en el navegador y copia la dirección completa. |
| `other` | Este enlace no parece un perfil de Amazon. |

En todos los casos de error, abrir automáticamente la guía de la Fase 1.

### Cuándo se valida

- **On blur** del campo URL y **al guardar**. No mientras se escribe.
- Al corregir el valor, el error desaparece en el siguiente blur.
- Si el toggle de Amazon está ON con URL inválida, el guardado se bloquea y el
  foco va al campo con error (mismo patrón que el resto de validaciones).
- Al guardar con URL válida, el campo muestra ya la versión normalizada.

### Enlaces ya guardados (aviso no bloqueante)

Si al cargar la sección el valor guardado de Amazon no es `profile`:

- Mostrar el mensaje de su tipo como **aviso**, no como error: icono ⚠, texto
  12px color teja `#C75B22`, sin borde rojo, precedido de
  `Revisa este enlace:`.
- **No bloquea** el guardado del resto del formulario mientras ese valor no se
  toque.
- Si la persona edita el campo, pasa a aplicarse la validación normal
  (bloqueante).

> Motivo: no impedir que alguien actualice sus géneros por un enlace antiguo,
> pero sí avisarle.

### Criterios de prueba (Fase 2)

Tests unitarios de `classifyAmazonUrl` y `normalizeAmazonProfileUrl` (deben
fallar antes de implementar):

- [ ] Perfil .es, .com, .com.mx y .co.uk → `profile`
- [ ] Perfil sin protocolo (`amazon.es/gp/profile/…`) → `profile`
- [ ] Perfil con `/ref=…` y query → `profile`, normalizado sin ellos
- [ ] `/dp/B0…` y `/gp/product/…` → `product`
- [ ] `/gp/css/homepage.html` y `/hz/…` → `account`
- [ ] `amzn.eu/d/…` y `a.co/…` → `short`
- [ ] `goodreads.com/…`, texto vacío y texto sin URL → `other`
- [ ] `amazon.es.fake.com/gp/profile/amzn1.account.X` → `other`

Pruebas manuales:

- [ ] Pegar un enlace de producto: error correcto y guía abierta.
- [ ] Guardar con URL válida: se guarda la forma canónica.
- [ ] Cuenta con enlace antiguo inválido: aviso visible, se pueden guardar
      cambios en géneros sin tocar Amazon.
- [ ] Editar ese enlace antiguo y dejarlo inválido: el guardado se bloquea.

---

## Archivos afectados (orientativo)

```
src/utils/amazonProfileUrl.ts            ← nuevo: clasificación + normalización
src/utils/amazonProfileUrl.test.ts       ← nuevo
AccountPage/sections/SpacesSection.tsx   ← validación del canal Amazon
AccountPage/components/AmazonHelp.tsx    ← nuevo: botón + panel de la guía
```

---

*Implementar fase a fase con `senior-frontend`, revisando cada una con
`frontend-reviewer` antes de pasar a la siguiente. Contexto: `account-spec.md`.*
