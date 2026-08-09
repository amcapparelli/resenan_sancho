// Ambient declarations for side-effect stylesheet imports.
//
// Global CSS is imported from _app.tsx (the self-hosted @font-face rules in
// styles/fonts.css). Without these, TypeScript can't resolve a side-effect
// import of a .css/.scss file and reports "Cannot find module or type
// declarations for side-effect import". Webpack bundles the file fine; this
// only satisfies the type checker/editor. `*.module.css` keeps its more
// specific Next.js typing, so CSS Modules are unaffected.
declare module '*.css';
declare module '*.scss';
