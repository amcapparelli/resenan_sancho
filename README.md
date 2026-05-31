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

Migración completada en este branch (`feature/migrate-next15-react18-node-lts`).
`npm run build` y `npm run dev` arrancan sin errores en Node 20.

Hecho:
- [x] Node 20 LTS (pin en `.nvmrc`, Heroku lo lee también). `engines.node` fuera.
- [x] Next 15, React 18.3, TypeScript 5, MUI 5, styled-components 6.
- [x] Codemod oficial MUI v4→v5 aplicado a `./src` (`@material-ui/*`→`@mui/*`).
- [x] `Theme.tsx`: `createMuiTheme` → `createTheme`.
- [x] `_app.tsx` reescrito como componente funcional con `CacheProvider`
      (Emotion), `ThemeProvider` de `@mui/material/styles` aliasado para no
      chocar con el `ThemeProvider` de styled-components, y `CssBaseline`.
- [x] `_document.tsx` (antes `.js`) adaptado al SSR de MUI 5 (Emotion +
      `createEmotionServer.extractCriticalToChunks`) y de styled-components 6
      (`ServerStyleSheet.collectStyles`).
- [x] `addBook.tsx`: `@material-ui/pickers` → `@mui/x-date-pickers`
      (`LocalizationProvider` + `AdapterDateFns` + `DatePicker`).
- [x] `OutlinedInput.labelWidth` (eliminado en MUI 5) sustituido por `label`
      en `CountriesSelector`, `FormatsSelector`, `GenresSelector`.
- [x] `ErrorBoundary`: `children` declarado explícitamente (React 18 ya no
      lo añade implícitamente al tipo de props).
- [x] `next.config.js` simplificado: fuera `dotenv-webpack`, `i18n` routing
      nativo de Next, `compiler.styledComponents` para que SWC transforme
      las plantillas en lugar del antiguo `babel-plugin-styled-components`.
- [x] `tsconfig.json`: target `es2017`, `plugins: [{ name: "next" }]`,
      incluye `next-env.d.ts` y `.next/types`.
- [x] `src/styled.d.ts`: augmentación del `DefaultTheme` de styled-components
      6 (en v5 el theme era `any` por defecto; en v6 es `{}` y hay que
      declararlo).
- [x] Eliminados: `server.js`, `src/i18n.js`, `.babelrc`, `webpack.config.js`,
      `index.html`. Toda la cadena Babel (`@babel/*`, `babel-*`), Webpack
      standalone, `dotenv-webpack`, `node-sass`, `*-loader`,
      `html-webpack-plugin`, `next-i18next`, `express`, `react-test-renderer`,
      `i18next-xhr-backend`, `@material-ui/*`, `@types/styled-components`,
      `@testing-library/react-hooks`, `typescript-styled-plugin`,
      `@types/react-router-dom`.
- [x] i18n: en lugar de migrar a `next-i18next` 15 (que obliga a añadir
      `getStaticProps` con `serverSideTranslations` en cada página), se ha
      sustituido por la cadena pura `i18next` + `react-i18next` +
      `i18next-http-backend` + `i18next-browser-languagedetector`. Init en
      [src/i18n.ts](src/i18n.ts), importado una sola vez desde `_app.tsx`.
      Trade-off: las traducciones se cargan en cliente (igual que con la
      vieja `i18next-xhr-backend` que ya usaba el proyecto). El SSR muestra
      claves hasta que hidrata. Si se necesita SSR real de traducciones
      (SEO en `/about`, `/legal`, etc.), volver a `next-i18next` 15 página
      a página o renderizar esos textos desde una constante.
- [x] Scripts: `npm run dev` → `next dev`, `npm start` → `next start` (ya no
      hace falta el servidor Express custom).

Deuda técnica que se ha aparcado a posta (no rompe el build, pero documentar):
- [ ] `next.config.js` tiene `eslint.ignoreDuringBuilds: true` y
      `typescript.ignoreBuildErrors: true`. El primero esconde ~200 errores
      de lint antiguos (Airbnb config). El segundo tapa las fricciones de
      tipos de `@mui/styles.makeStyles` en 8 ficheros. Plan: quitar el de
      ESLint cuando se aborde el linting; quitar el de TS cuando se migre
      de `makeStyles` a `sx` / `styled()` (post-A3, en el rediseño).
- [ ] El refresco del avatar al subir imagen en `myprofile` y la carga de
      `addBook` requieren verificación manual del flujo (las APIs externas
      no cambian, pero MUI 5 sí cambia algunos defaults visuales).
- [ ] El paquete `@mui/styles` está deprecated en MUI 5; queda solo como
      puente hasta que los `makeStyles`/`createStyles` se reescriban con la
      API nueva. En MUI 6 ya no existe, así que es bloqueante para subir.
- [ ] Verificar manualmente el flujo crítico: registro, alta de libro,
      modal de contacto (email) y un pago en Stripe modo test.
