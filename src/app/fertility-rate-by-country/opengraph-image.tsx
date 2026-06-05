import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const alt = 'Fertility Rate by Country — TFR + below-replacement tracker (UN WPP 2024)';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOG({
    badge: 'Calculator + ranking · UN data',
    title: 'Fertility Rate by Country',
    subtitle: 'Has your country dropped below the 2.1 replacement rate?',
    heroValue: '99 / 194',
    heroLabel: 'countries below replacement',
    accent: '#be185d',
    accentLight: '#fce7f3',
    bullets: [
      'South Korea: 0.72 children/woman',
      'Chad: 6.02 (global high)',
      'World TFR: 2.25 (and falling)',
    ],
  });
}
