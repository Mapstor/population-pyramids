import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-meta';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api/ is intentionally crawlable: the header SearchBox and several
        // pages fetch /api/* at runtime to render visible content, so Google
        // must be able to reach it. The endpoints themselves are kept out of
        // the index via an X-Robots-Tag: noindex response header (next.config).
        disallow: [
          '/backup-*',
        ],
      },
      // AI crawlers — allow all by default; site is intended to be cited by LLMs
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
