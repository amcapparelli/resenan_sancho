# Home — Sección "Qué es Reseñan Sancho" · Especificación

Contenido y diseño de la sección informativa/SEO de home. No requiere
backend: es contenido estático, ya redactado, para maquetar directamente.
Complementa `home-highlights-spec.md` (que sí requiere backend).

Pensada para colocarse **antes** de la sección "Algunos de los libros
disponibles para reseñar" (ver captura de la implementación actual), como
primer bloque de contenido tras el hero.

---

## Objetivo

- Dar contexto textual real de qué es la plataforma, para SEO (relevancia
  semántica: hoy la home tiene muy poco contenido sustancial).
- Dirigir tráfico hacia los servicios de promoción para autores.
- Mantener tono positivo — sin contraponerse a "otros sitios" ni usar
  enfoques negativos (nada de "sin intermediarios ni algoritmos opacos").

---

## Contenido (texto final aprobado)

**Encabezado:**
> ¿Qué es Reseñan Sancho?

**Párrafo 1:**
> Reseñan Sancho conecta a personas que escriben con personas que
> reseñan. Cada libro encuentra a quien puede leerlo con criterio, y cada
> reseñador encuentra libros que encajan con lo que le gusta leer.

**Párrafo 2:**
> Además, ofrecemos servicios pensados para dar más visibilidad a tu
> libro que ayudan a que más reseñadores lo descubran.

---

## Estructura visual

- Fondo: `crema` (`#FBF1D8`) — mantiene la alternancia crema/blanco entre
  secciones de home. **Nota de implementación:** al insertar esta sección se
  invirtieron los fondos de los dos bloques siguientes para no dejar dos
  cremas seguidos. Secuencia final: hero (crema) → SocialProof (blanco) →
  Qué es (crema) → Libros disponibles (blanco) → Géneros (crema).
- Título: Fraunces 600, ~22px, color `tinta` (`#3D3A35`).
- Párrafos: Source Sans 3, ~14px, line-height ~1.65. Párrafo 1 en `tinta`,
  párrafo 2 en `marrón` (`#6B4A16`) para diferenciar sutilmente el mensaje
  de producto del mensaje descriptivo.
- Ancho de párrafos: max-width ~520px, no ocupar todo el ancho del
  contenedor — mejora la legibilidad.

No incluye los chips de género que aparecían en el mockup original de
Projects — esos ya están cubiertos, y mejor resueltos, por la sección
"Géneros más populares" que `senior-frontend` implementó a partir
de `home-highlights-spec.md`. No duplicar esa función aquí.

---

## Nota sobre gender-neutral copy

El texto anterior ya sigue la convención de lenguaje neutro del sistema de
diseño (`sistema-diseno-resenan-sancho.md`): "personas que escriben",
"personas que reseñan", "cada reseñador" en genérico. Mantener esa
convención si se retoca el copy.

---

## Checklist de implementación

- [ ] Maquetar sección estática con el texto de arriba (sin llamada a
      backend, contenido hardcoded en el componente o en un archivo de
      copy si el proyecto ya centraliza textos).
- [ ] Colocar entre el hero y la sección "Algunos de los libros disponibles
      para reseñar".
- [ ] Revisar con `frontend-reviewer` coherencia de estilos con el resto
      de secciones de home ya implementadas.
