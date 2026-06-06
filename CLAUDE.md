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
- Integra la API de Mailchimp para registrar usuarios automáticamente
- Despliegue: Heroku con auto-deploy desde la rama `master` de GitHub

## Cómo arrancar y probar
<!-- AJUSTA estos comandos a los reales de tu package.json -->
- Instalar: `npm install`
- Desarrollo: `npm run dev`
- Build de producción: `npm run build`

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
- Paleta de marca: azul (#1E78B6 aprox.) y amarillo de acento; ver identidad
  corporativa. Público objetivo: 16-25 años, mayoritariamente femenino;
  el tono visual debe ser fresco, dinámico y cercano.

## Plan de mejora
Hay un plan de migración y rediseño por fases en `/docs/plan-mejora.md`.
Resumen: modernizar Next.js (9 → 15) y rediseñar A LA VEZ, página por página,
manteniendo la web viva. NO hacer un rewrite de golpe.

### Estado actual
- [x] Fase A0: corregir erratas de la home ("encotrar", "liteararios")
- [x] Fase A1: definir sistema de diseño
- [x] Fase A2: estabilizar en Next 15 + React 18 + Node LTS (router actual)
- [x] Fase A3: rediseñar home hero
- [ ] Fase A5: rediseñar home header
- [ ] Fase A6: rediseñar home sections

- (actualiza esta lista según avances)