# Reseñan Sancho — Frontend

Plataforma web que conecta escritores con reseñadores literarios. Filtra
por género y formato. URL en producción: https://www.resenansancho.com/

Este repo es el **frontend**. La API vive en un repo aparte.

## Stack

- **Node 20 LTS** (gestionado con `nvm`, pinneado en `.nvmrc`)
- **Next.js 15** con **Pages Router** (no migrado a App Router todavía)
- **React 18.3**
- **TypeScript 5**
- **Material UI 5** (`@mui/*`) + **styled-components 6**
- **next-i18next 15** (i18n con Pages Router)
- **Stripe** (`@stripe/stripe-js` + `@stripe/react-stripe-js`) para los pagos
- **Express** como servidor custom (para el middleware de i18n)
- Despliegue: **Heroku** con auto-deploy desde la rama `master`. Heroku lee
  la versión de Node desde `.nvmrc`.

## Requisitos previos

- `nvm` instalado (https://github.com/nvm-sh/nvm)
- Node 20 LTS:
  ```bash
  nvm install
  nvm use
  ```
  (Ambos comandos leen la versión de `.nvmrc`.)

## Cómo arrancar

```bash
nvm use            # activa Node 20 según .nvmrc
npm install        # instala dependencias
npm run dev        # arranca el servidor en http://localhost:3000
```

Variables de entorno: copia `.env` y rellena `REACT_APP_API_URL` y
`PUBLISHABLE_KEY` (Stripe).

## Scripts

| Script               | Qué hace                                   |
|----------------------|--------------------------------------------|
| `npm run dev`        | Arranca el servidor Express + Next en modo dev |
| `npm run build`      | Compila Next para producción (`next build`)|
| `npm start`          | Sirve la build de producción               |
| `npm test`           | Ejecuta los tests con Jest                 |
| `npm run coverage`   | Tests con cobertura                        |
| `npm run lint`       | ESLint sobre el código                     |
| `npm run heroku-postbuild` | Build que dispara Heroku al desplegar |

## Dependencias

### Runtime (`dependencies`)

| Paquete | Para qué sirve |
|---------|----------------|
| `next` | Framework. Pages Router + SSR. |
| `react`, `react-dom` | Librería de UI base. |
| `@mui/material` | Componentes Material UI (Button, TextField, Modal…). |
| `@mui/icons-material` | Iconos de Material UI. |
| `@mui/lab` | Componentes experimentales de MUI (Alert antiguo, etc.). |
| `@mui/styles` | API `makeStyles` (deprecada en MUI 5, mantenida por compatibilidad). |
| `@mui/x-date-pickers` | Date pickers de MUI 5 (sustituye a `@material-ui/pickers`). |
| `@emotion/react`, `@emotion/styled` | Motor de CSS-in-JS de MUI 5. **Peer dep obligatoria.** |
| `styled-components` | Capa propia de CSS-in-JS del proyecto (paralela a MUI). |
| `@stripe/stripe-js` | SDK oficial de Stripe en el cliente. |
| `@stripe/react-stripe-js` | Componentes React encima de Stripe.js. |
| `i18next` | Motor base de internacionalización. |
| `react-i18next` | Bindings de i18next para React. |
| `next-i18next` | Integración de i18next con Next.js (Pages Router). |
| `i18next-http-backend` | Carga las traducciones por HTTP (sustituye al obsoleto `i18next-xhr-backend`). |
| `i18next-browser-languagedetector` | Detecta el idioma del navegador. |
| `express` | Servidor custom (necesario hoy para el middleware de `next-i18next` en `server.js`). |
| `react-ga4` | Tracking de Google Analytics 4. |
| `date-fns` | Utilidades de fechas (usadas por el date picker). |
| `@date-io/date-fns` | Adapter de `date-fns` para los date pickers. |
| `clsx` | Helper para concatenar clases CSS condicionalmente. |
| `prop-types` | Tipado runtime de props (legacy, queda hasta migrar a TS completo). |

### Desarrollo (`devDependencies`)

| Paquete | Para qué sirve |
|---------|----------------|
| `typescript` | Compilador de TypeScript. |
| `@types/*` | Tipos de React, ReactDOM, Node. |
| `eslint` + `eslint-config-airbnb` + `eslint-config-next` + plugins | Linter. |
| `@typescript-eslint/*` | Soporte de TypeScript en ESLint. |
| `eslint-plugin-jest` | Reglas de ESLint específicas para Jest. |
| `jest` + `jest-environment-jsdom` | Tests unitarios. |
| `@testing-library/react` | Utilidades para testear componentes React 18. |

## Estado de la Fase A2 (migración Next 9 → 15)

Este branch (`feature/migrate-next15-react18-node-lts`) actualiza **solo
las dependencias y el setup**, no migra todavía el código.

Lo que YA está hecho:
- [x] `.nvmrc` pinneado a Node 20 (Heroku también lo lee).
- [x] `engines.node` eliminado de `package.json`.
- [x] `package.json` apuntando a Next 15 + React 18 + MUI 5 + styled-components 6 + TypeScript 5.
- [x] Eliminadas dependencias obsoletas: todo el bloque de Babel manual
      (`@babel/*`, `babel-*`), Webpack standalone (`webpack`, `webpack-cli`,
      `webpack-dev-server`, `*-loader`, `html-webpack-plugin`), `dotenv-webpack`,
      `node-sass`, `sass-loader`, `react-test-renderer`, `i18next-xhr-backend`,
      `@material-ui/*` (sustituidas por `@mui/*`), `@types/styled-components`
      (sc 6 trae sus propios tipos), `@testing-library/react-hooks` (mergeado
      en `@testing-library/react` 13+), `typescript-styled-plugin` y
      `@types/react-router-dom` (no se usan).

Lo que queda pendiente (próximos commits / pasos posteriores):
- [ ] Eliminar `.babelrc`, `webpack.config.js` y `babel-*` residuales — con
      Next 15 el compilador por defecto es **SWC**.
- [ ] Migrar imports `@material-ui/core` → `@mui/material`, `@material-ui/icons`
      → `@mui/icons-material`, etc. (codemod oficial:
      `npx @mui/codemod v5.0.0/preset-safe ./src`).
- [ ] Reemplazar `MuiThemeProvider` por `ThemeProvider` y `createMuiTheme`
      por `createTheme` (`src/store/context/StylesContext/Theme.ts`).
- [ ] Adaptar `src/pages/_document.js` al SSR de MUI 5 + styled-components 6
      (collectStyles cambia ligeramente).
- [ ] Reemplazar `@material-ui/pickers` por `@mui/x-date-pickers` allí donde
      se use el date picker.
- [ ] Adaptar `next.config.js` (quitar `dotenv-webpack`; Next 15 inyecta
      `process.env.NEXT_PUBLIC_*` automáticamente).
- [ ] Revisar `server.js` y `src/i18n.js` con la API nueva de `next-i18next`
      15 (la inicialización cambió respecto a la 4.x).
- [ ] Tras la migración, verificar manualmente el flujo crítico: registro,
      alta de libro, modal de contacto (email) y un pago en Stripe modo test.
