import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const alt = 'Life Expectancy Calculator & Ranking by Country — personal lifespan estimate from UN WPP 2024';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOG({
    badge: 'Calculator · UN data',
    title: 'Life Expectancy by Country',
    subtitle: "How long will you live? Personal calculator + all 195 countries ranked.",
    heroValue: '73.3',
    heroLabel: 'world avg lifespan, years',
    accent: '#15803d',
    accentLight: '#dcfce7',
    bullets: [
      'Monaco leads at 86.5 years',
      '~30-year gap top vs bottom',
      'Male / female + projections to 2100',
    ],
  });
}
