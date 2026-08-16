// Only the blocks the home page mounts are re-exported here; `SectionHeading`
// and `BlockLink` are shared chrome, internal to this directory.
export { default as AboutPlatform } from './AboutPlatform';
export { default as FeaturedBooks } from './FeaturedBooks';
export { default as TopGenres } from './TopGenres';
// `export type` is required by isolatedModules: these are erased at build time.
export type { FeaturedBook } from './FeaturedBooks';
export type { TopGenre } from './TopGenres';
