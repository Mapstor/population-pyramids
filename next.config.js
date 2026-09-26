/**
 * All INTERNAL redirects live in one module (src/config/redirects.js) and are
 * returned from redirects() below. External-destination rules (e.g. /ads.txt)
 * remain in vercel.json. Response headers (X-Robots-Tag) stay here.
 */
const redirects = require('./src/config/redirects');

module.exports = {
  swcMinify: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // getWpp/getWorld read the wpp2024 JSON off disk (T4c server-only fs reads). The
    // country and home pages are statically generated, so those reads run at BUILD time
    // (files present under src/). We still trace the files onto those routes so any
    // runtime regeneration (ISR / on-demand revalidate) can find them. Scoped to the two
    // routes that use the layer — nothing else is pulled in.
    outputFileTracingIncludes: {
      '/[slug]': ['./src/data/wpp2024/*.json'],
      '/': ['./src/data/wpp2024/world.json'],
    },
  },
  async redirects() {
    return redirects();
  },
  async headers() {
    // Keep machine-readable endpoints out of the index. /api and /data must
    // stay crawlable (robots no longer disallows them — pages fetch /api at
    // runtime and /data JSON gets Search impressions), so noindex is enforced
    // at the response-header level instead.
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex' }];
    return [
      { source: '/api/:path*', headers: noindex },
      { source: '/data/:path*', headers: noindex },
      { source: '/sitemap.xml', headers: noindex },
    ];
  },
};
