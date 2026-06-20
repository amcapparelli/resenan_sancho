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

## Workflow de PRs
- Al crear una pull request, aplica la skill `version-bump-frontend`:
  sube la versión en `package.json` (semver) según el tipo de cambio
  antes de abrir la PR.
- El bump va en la rama de la PR, nunca directo en master.

## Workflow de agents (frontend)

REGLA: toda tarea de UI (escribir, modificar o refactorizar componentes, hooks
o páginas) sigue este pipeline. La sesión principal NO implementa UI directamente;
orquesta a los subagents.

1. **Implementación → `senior-frontend`.** Delega SIEMPRE la implementación en el
   subagent `senior-frontend`. No escribas tú el componente "porque es rápido": al
   hacerlo se saltan sus reglas (inglés en código y comentarios, auditoría previa de
   componentes reutilizables, manejo de estados carga/error/vacío, limpieza de
   huérfanos tras refactor). Si la tarea es trivial, igualmente pasa por él.

2. **Revisión → `frontend-reviewer`.** Cuando `senior-frontend` termine, pasa el
   diff a `frontend-reviewer` ANTES de dar la tarea por cerrada o de hacer commit.
   Su salida es una revisión priorizada (bloqueante / recomendado / nit), no edita
   código.

3. **Corrección de hallazgos bloqueantes → de vuelta a `senior-frontend`.** Si la
   revisión marca algo bloqueante, devuelve esos puntos a `senior-frontend` para que
   los corrija, y vuelve a pasar por `frontend-reviewer`. Repite hasta que no queden
   bloqueantes.

4. **Cierre.** Solo se considera terminada una tarea de UI cuando ha pasado por
   implementación + revisión sin bloqueantes pendientes.

Notas:
- Los subagents no pueden invocarse entre sí; esta orquestación la hace SIEMPRE la
  sesión principal. Por eso el flujo vive aquí, en CLAUDE.md, y no en un agent.
- Invocar un agent con `@nombre` directamente puede saltarse este flujo: trátalo como
  excepción consciente, no como la vía por defecto.
- Para tareas de backend, el agente de implementación es `senior-backend` (sin revisor
  dedicado por ahora).

### Estado actual
- [x] Fase A0: corregir erratas de la home ("encotrar", "liteararios")
- [x] Fase A1: definir sistema de diseño
- [x] Fase A2: estabilizar en Next 15 + React 18 + Node LTS (router actual)
- [x] Fase A3: rediseñar home hero
- [x] Fase A5: rediseñar home header
- [x] Fase A6: rediseñar la sección de libros
- [x] Fase A7: rediseñar la sección de reseñadores literarios
- [x] Fase A8: rediseñar la sección de detalle de un libro.
- [x] Fase A9: rediseñar el área personal (perfil, espacios literarios, mis
  libros, añade libro y ayuda) como página única `/account`.

- (actualiza esta lista según avances)