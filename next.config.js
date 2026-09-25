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
