# CLAUDE.md — Reseñan Sancho (frontend)

## Qué es esto
Reseñan Sancho es una plataforma web que conecta escritores (mayoritariamente
independientes) con reseñadores literarios. En esencia es un buscador doble:
escritores buscan reseñadores, y reseñadores buscan libros, filtrando por
género literario y formato. URL: https://www.resenansancho.com/

Este repo es el FRONTEND. El backend (API) vive en un repo aparte.

## Stack actual
- Next.js 9.3.1, React ^16.13.0, TypeScript
- Node 14 (¡desactualizado! ver plan de migración)
- Material UI + styled-components para la capa de estilos
- Integra la API de Mailchimp para registrar usuarios automáticamente
- Despliegue: Heroku con auto-deploy desde la rama `master` de GitHub

## Cómo arrancar y probar
<!-- AJUSTA estos comandos a los reales de tu package.json -->
- Instalar: `npm install`
- Desarrollo: `npm run dev`
- Build de producción: `npm run build`
- (Si tienes lint/tests, añádelos aquí)

## Reglas de trabajo (IMPORTANTES)
- NUNCA trabajar directo en `master`. Crear siempre una rama aparte.
- `master` debe estar siempre sano: Heroku despliega automáticamente al
  hacer merge a `master`.
- Antes de proponer un merge a `master`, verificar a mano el flujo crítico:
  registro/alta de usuario, alta de libro, modal de contacto (que el email
  llegue), y un pago de prueba en Stripe (modo test).
- Hacer commits pequeños y descriptivos.
- NO commitear secretos (.env, claves de Stripe/Mailchimp/Mongo).

## Convenciones
- Idioma de la interfaz: español (con versión inglesa). Cuidar la ortografía
  en textos de cara al público.
- Capa de estilos: Material UI + styled-components. Todo color y tipografía
  debe venir del tema de MUI (`theme.palette.*`, `theme.typography.*`), NUNCA
  hex sueltos en componentes.
- Sistema de diseño: paleta cálida apagada + tipografía Fraunces/Source Sans 3.
  Ver "Sistema de diseño a implementar (Fase A1)" más abajo para el detalle.
- Público objetivo: 16-25 años, mayoritariamente femenino; el tono visual
  debe ser fresco, dinámico y cercano, pero "serio y desenfadado" para los
  escritores.

## Sistema de diseño a implementar (Fase A1)
Decisiones ya tomadas; esta sección es la fuente de verdad para implementarlas.
El objetivo de la Fase A1 es centralizar paleta y tipografía en un único tema
de MUI (`createTheme`) del que beban tanto los componentes de MUI como los
styled-components. No se rediseñan páginas todavía (eso es A3 en adelante);
aquí solo se monta la base.

### Paleta (cálida apagada)
Reemplaza el enum cálido puro anterior (`#FFDE00 / #EB8500 / #FAF5AE /
#DE4A10`), que tenía problemas de contraste (amarillo puro ilegible sobre
blanco). Mapeo a roles de MUI:

| Color        | Hex       | Rol en MUI                  | Uso                                  |
|--------------|-----------|-----------------------------|--------------------------------------|
| Mostaza      | `#F2B705` | `primary.main`              | Color de marca. Texto OSCURO encima. |
| Teja         | `#C75B22` | `secondary.main`            | Acción principal (botones CTA).      |
| Crema        | `#FBF1D8` | superficie cálida (`paper` destacado / banner) | Fondos suaves, hero. |
| Tinta        | `#3D3A35` | `text.primary`              | Gris cálido oscuro para texto.       |
| Marrón cálido| `#6B4A16` | `text.secondary`            | Texto secundario.                    |
| Rojo marca   | `#DE4A10` | `error.main`                | Alertas/errores (no es color de marca). |

Reglas de contraste:
- `primary.contrastText` debe ser OSCURO (la tinta), nunca blanco: el texto
  blanco sobre mostaza es ilegible.
- `secondary.contrastText` es blanco (la teja sí admite texto blanco).
- Para acciones importantes preferir `secondary` (teja) sobre `primary`
  (mostaza), porque la mostaza es un color claro y rinde peor en botones
  pequeños o texto fino.

### Tipografía (Fraunces + Source Sans 3)
Reemplaza el uso de Rambla para todo. Par tipográfico:
- Titulares (`h1`–`h6`): **Fraunces**, weight 600.
- Cuerpo y UI (resto): **Source Sans 3**, weight 400 / 600.
- Quitar las MAYÚSCULAS automáticas de los botones de MUI
  (`button.textTransform: 'none'`).

Carga de fuentes (añadir en `_document.tsx` / `<Head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
```

### Tareas concretas de la Fase A1
1. Modificar el tema de MUI (`createMuiTheme`) con la paleta y tipografía de arriba.
3. Añadir la carga de fuentes en el `<Head>` / `Meta.tsx`.
4. Definir los componentes base reutilizables como styled-components que lean del tema: botón, tarjeta de libro, tarjeta de reseñador, campos de formulario, modal de contacto.
5. Reunir 3-4 webs de referencia visual y tenerlas a mano para A3 en adelante.
6. NO rediseñar páginas todavía: A1 solo monta el sistema; el rediseño
   página a página empieza en A3.

## Plan de mejora
Hay un plan de migración y rediseño por fases en `/docs/plan-mejora.md`.
Resumen: modernizar Next.js (9 → 15) y rediseñar A LA VEZ, página por página,
manteniendo la web viva. NO hacer un rewrite de golpe.

### Estado actual
- [X] Fase A0: corregir erratas de la home ("encotrar", "liteararios")
- [ ] Fase A1: implementar sistema de diseño
- [ ] Fase A2: estabilizar en Next 15 + React 18 + Node LTS (router actual)
- [ ] Fase A3: rediseñar home
- (actualiza esta lista según avances)