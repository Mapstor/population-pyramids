import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const alt = 'Population Density by Country — calculator + ranking + "what if" comparisons (UN + CIA Factbook)';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOG({
    badge: 'Calculator + ranking · UN + CIA',
    title: 'Population Density by Country',
    subtitle: 'Which countries are most crowded? Calculator + every country ranked.',
    heroValue: '8,528×',
    heroLabel: 'Monaco vs Mongolia density gap',
    accent: '#7c3aed',
    accentLight: '#ede9fe',
    bullets: [
      'Monaco: 19,177 people / km²',
      'Mongolia: 2.2 people / km²',
      '"What if" hypothetical comparisons',
    ],
  });
}
