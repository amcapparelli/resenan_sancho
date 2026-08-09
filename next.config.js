/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    // Covers & avatars are served from Cloudinary. Keep this in sync with the
    // allow-list in src/utils/imageHost.ts (isOptimizedImageHost).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeDetection: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Migración Fase A2: @mui/styles makeStyles types friction.
    // Quitar cuando se migre a sx/styled() (post-A3).
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
