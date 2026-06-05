/**
 * Shared template for per-page Open Graph images, used by each tool's
 * opengraph-image.tsx via Next.js's file-based OG convention.
 *
 * Renders 1200x630 PNG via @vercel/og (next/og). Designed for Satori's
 * CSS subset: inline flex layout only, no className/grid, system font fallback.
 *
 * Each tool's opengraph-image.tsx calls `renderOG({...})` with its own
 * brand color + headline number, so social previews on Twitter, Facebook,
 * LinkedIn, Slack, Discord etc. show tool-specific content instead of a
 * generic site image.
 */

import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export interface OGConfig {
  badge: string;          // small uppercase label (e.g. "CALCULATOR · UN DATA")
  title: string;
  subtitle: string;
  heroValue: string;      // big headline number/string (e.g. "73.3" or "Monaco")
  heroLabel: string;      // 1-line label under hero (e.g. "world avg lifespan, years")
  accent: string;         // primary brand color hex (e.g. "#1d4ed8")
  accentLight: string;    // soft background tint hex (e.g. "#dbeafe")
  bullets?: string[];     // optional 2-3 short stats listed under the hero
}

export function renderOG(cfg: OGConfig) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${cfg.accentLight} 0%, #ffffff 50%, ${cfg.accentLight} 100%)`,
          padding: '60px 80px',
          color: '#0f172a',
        }}
      >
        {/* Header — brand mark + domain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: cfg.accent,
              borderRadius: 14,
              boxShadow: '0 4px 10px rgba(15, 23, 42, 0.15)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              PopulationPyramids
            </div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
              UN data · interactive tools · free
            </div>
          </div>
          {/* Right-side badge */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              padding: '8px 16px',
              background: 'white',
              borderRadius: 999,
              border: `2px solid ${cfg.accent}`,
              fontSize: 16,
              fontWeight: 700,
              color: cfg.accent,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {cfg.badge}
          </div>
        </div>

        {/* Title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1040 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.05,
              marginBottom: 18,
              letterSpacing: -1,
            }}
          >
            {cfg.title}
          </div>
          <div style={{ fontSize: 28, color: '#475569', lineHeight: 1.3 }}>{cfg.subtitle}</div>
        </div>

        {/* Hero stat card + optional bullets */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 32px',
              background: 'white',
              borderRadius: 18,
              border: `3px solid ${cfg.accent}`,
              minWidth: 280,
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: cfg.accent,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {cfg.heroLabel}
            </div>
            <div
              style={{
                fontSize: 96,
                fontWeight: 900,
                color: cfg.accent,
                lineHeight: 1,
                marginTop: 6,
                letterSpacing: -2,
              }}
            >
              {cfg.heroValue}
            </div>
          </div>

          {cfg.bullets && cfg.bullets.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingBottom: 8,
              }}
            >
              {cfg.bullets.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 22,
                    color: '#334155',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: cfg.accent,
                    }}
                  />
                  {b}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: 0.5,
              }}
            >
              populationpyramids.org
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
