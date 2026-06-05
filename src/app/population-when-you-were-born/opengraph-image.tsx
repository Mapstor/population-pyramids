import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const alt = 'Population When You Were Born — World population then vs today, with country breakdowns';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOG({
    badge: 'Birth-year calculator · UN data',
    title: 'Population When You Were Born',
    subtitle: 'How much has the world grown in your lifetime?',
    heroValue: '×3.3',
    heroLabel: 'world population vs 1950',
    accent: '#1d4ed8',
    accentLight: '#dbeafe',
    bullets: [
      'World: 2.5B (1950) → 8.2B today',
      '8B milestone reached Nov 2022',
      'Country lens for all 195 countries',
    ],
  });
}
