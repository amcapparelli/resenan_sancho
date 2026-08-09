/**
 * Guards against silent drift between the two hand-maintained image host lists.
 *
 * `OPTIMIZED_IMAGE_HOSTS` (imageHost.ts) decides which hosts we hand to
 * next/image WITHOUT `unoptimized`. If a host lives there but is missing from
 * `images.remotePatterns` in next.config.js, next/image throws at runtime while
 * optimizing it — crashing a public page. So we require the allow-list to be a
 * subset of the configured remotePatterns.
 */
import { OPTIMIZED_IMAGE_HOSTS } from './imageHost';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextConfig = require('../../next.config.js');

describe('image host allow-list', () => {
  it('is a subset of next.config.js images.remotePatterns', () => {
    const remoteHosts = (nextConfig.images?.remotePatterns ?? []).map(
      (pattern: { hostname: string }) => pattern.hostname,
    );

    OPTIMIZED_IMAGE_HOSTS.forEach((host) => {
      expect(remoteHosts).toContain(host);
    });
  });
});
