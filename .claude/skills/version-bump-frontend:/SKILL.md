---
name: version-bump-frontend
description: >
  Mantiene actualizado el número de versión del frontend en package.json
  siguiendo versionado semántico (MAJOR.MINOR.PATCH). Úsala SIEMPRE que vayas a
  crear una pull request en el repositorio del frontend, antes de abrirla: el
  número de versión debe subir en el mismo commit/PR según el tipo de cambio.
  Aplica también si el usuario pide "subir la versión", "bump", "preparar una
  release" o menciona la versión del package.json del frontend. Infiere el tipo
  de incremento a partir del cambio y propónlo; si hay duda razonable, pregunta
  antes de decidir.
---

# Version bump — Frontend

Sube el número de versión en `package.json` del frontend al preparar una pull
request, siguiendo versionado semántico: `MAJOR.MINOR.PATCH`.

## Cuándo se aplica

Cada vez que vayas a crear una PR en el repo del frontend. El bump va incluido
en la misma PR (no en una aparte), idealmente como último commit antes de abrirla.

## Reglas de incremento

Dado `MAJOR.MINOR.PATCH` (p. ej. `9.3.1`):

- **PATCH** (tercer dígito): fix menor. Correcciones de bugs, ajustes de copy,
  erratas, retoques de estilo puntuales, cambios que no añaden funcionalidad ni
  alteran la apariencia general. Ej.: `9.3.1 → 9.3.2`.
- **MINOR** (segundo dígito): nueva feature. Una página nueva, un componente
  nuevo, un filtro nuevo, una capacidad que antes no existía, sin rediseño
  global. Al subir MINOR, el PATCH vuelve a `0`. Ej.: `9.3.2 → 9.4.0`.
- **MAJOR** (primer dígito): cambio grande. En el frontend, esto incluye:
  - **Cambio de diseño significativo**: rediseño de una página completa con el
    nuevo sistema de diseño, cambio de identidad visual, migración del look &
    feel de una sección entera.
  - **Actualización de librerías importantes** (no menores): subir de major a
    React, Next.js, Material UI, TypeScript; migración de Pages Router a App
    Router; cambios estructurales del stack.

  Al subir MAJOR, MINOR y PATCH vuelven a `0`. Ej.: `9.4.0 → 10.0.0`.

> Una actualización de librería **menor** (patch/minor de una dependencia,
> bumps de seguridad rutinarios) NO es MAJOR: trátala como PATCH salvo que
> introduzca una feature visible (entonces MINOR).

## Cómo decidir (híbrido: inferir + confirmar si dudas)

1. Mira el conjunto de cambios de la PR (diff, archivos tocados, descripción).
2. Clasifícalo en PATCH / MINOR / MAJOR según las reglas de arriba.
3. **Si el tipo es claro**, propón el nuevo número y aplícalo, dejándolo dicho
   en el resumen: "Subo de `9.3.1` a `9.4.0` (MINOR: nueva página de detalle)".
4. **Si hay duda razonable** (p. ej. un rediseño parcial que no sabes si cuenta
   como "significativo", o varios cambios de distinto nivel mezclados),
   **pregunta antes de decidir**, ofreciendo la opción que crees correcta y la
   alternativa. Cuando se mezclan varios cambios, manda el de mayor nivel.

## Cómo aplicar el bump

1. Lee la versión actual en `package.json` (campo `version`).
2. Calcula la nueva según la regla, reseteando a `0` los dígitos inferiores.
3. Edita **solo** el campo `version` de `package.json`. No toques otros campos
   ni reordenes el archivo.
4. Si el proyecto tiene `package-lock.json`, actualiza también ahí el campo
   `version` de nivel raíz para que coincida (no regeneres todo el lockfile).
5. Haz un commit dedicado y descriptivo, p. ej.:
   `chore(release): bump version to 9.4.0`.

## Lo que NO haces

- No subes la versión sin saber el tipo de cambio: si dudas, pregunta.
- No tratas un bump de seguridad rutinario de una dependencia como MAJOR.
- No editas el changelog ni etiquetas releases salvo que te lo pidan.
- No tocas la versión directamente en `master`: el bump va en la rama de la PR
  (Heroku auto-despliega desde `master`).
