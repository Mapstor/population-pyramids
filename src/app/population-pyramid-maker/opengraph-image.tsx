import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const alt = 'Population Pyramid Maker — free generator for any country or custom data, PNG/SVG download';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOG({
    badge: 'Free maker · PNG / SVG download',
    title: 'Population Pyramid Maker',
    subtitle: 'Generate publication-quality pyramids from UN data or your own numbers.',
    heroValue: '195',
    heroLabel: 'countries · 1950–2025 · free',
    accent: '#ea580c',
    accentLight: '#ffedd5',
    bullets: [
      '2-mode: country picker or paste your data',
      'Customize colors, title, units',
      'Download PNG (2× retina) or SVG',
    ],
  });
}
