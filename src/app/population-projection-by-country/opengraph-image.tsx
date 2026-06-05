import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const alt = 'Population Projection by Country 2025–2100 — UN medium variant calculator + peak year per country';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOG({
    badge: 'Projection · UN WPP 2024',
    title: 'Population Projection 2025 → 2100',
    subtitle: "When does each country's population peak? When will the world?",
    heroValue: '10.3B',
    heroLabel: 'projected world peak (~2080s)',
    accent: '#0369a1',
    accentLight: '#e0f2fe',
    bullets: [
      'World: 8.2B today → 9.7B by 2050',
      '46 countries already past peak',
      '67 still growing through 2100',
    ],
  });
}
