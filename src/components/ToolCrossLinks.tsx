/**
 * Standardized cross-link block for every tool page.
 * Pass the slug of the CURRENT tool — that one is filtered out so the
 * block always shows the relevant siblings + a handful of related rankings.
 *
 * Server component (pure render, no hooks). Output is inline HTML, fully
 * crawler-visible.
 */

import Link from 'next/link';

interface ToolLink {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}

// All cross-linkable tool pages. Order = visual priority when rendered.
const ALL_TOOLS: ToolLink[] = [
  { href: '/population-projection-by-country', emoji: '🔮', title: 'Population Projection 2050 & 2100', desc: 'UN-projected population for any country, any year through 2100, plus peak-year info' },
  { href: '/life-expectancy-by-country',       emoji: '🩺', title: 'Life Expectancy Calculator',         desc: 'Personal calculator + all 195 countries ranked by lifespan' },
  { href: '/fertility-rate-by-country',         emoji: '👶', title: 'Fertility Rate by Country',         desc: 'TFR + birth rate per country, below-replacement tracker' },
  { href: '/population-density-by-country',     emoji: '🏙️', title: 'Population Density by Country',     desc: 'Most & least crowded countries + "what if" comparisons' },
  { href: '/population-when-you-were-born',     emoji: '🌍', title: 'Population When You Were Born',     desc: 'World pop the day you were born vs today' },
  { href: '/population-pyramid-maker',          emoji: '🛠️', title: 'Population Pyramid Maker',         desc: 'Generate custom pyramids from country or your data · PNG/SVG' },
  { href: '/generations',                       emoji: '🎯', title: 'What Generation Am I?',             desc: 'Gen Z, Millennial, Boomer ranges + 195 country breakdowns' },
  { href: '/median-age-by-country',             emoji: '📊', title: 'Median Age by Country',             desc: 'World\'s oldest & youngest populations' },
  { href: '/dependency-ratio-calculator',       emoji: '👥', title: 'Dependency Ratio Calculator',       desc: 'Youth + elderly per 100 working-age adults' },
  { href: '/male-to-female-ratio',              emoji: '⚖️', title: 'Male to Female Ratio',              desc: 'Gender ratio per country, age band, and globally' },
  { href: '/most-populated-countries',          emoji: '🌐', title: 'Most Populated Countries',          desc: 'Every country ranked by current population' },
];

interface Props {
  currentSlug: string;             // slug of the page rendering this block (filter out)
  heading?: string;
  maxItems?: number;
}

export default function ToolCrossLinks({
  currentSlug,
  heading = 'Related demographic tools & calculators',
  maxItems = 10,
}: Props) {
  const items = ALL_TOOLS
    .filter(t => !t.href.endsWith(currentSlug))
    .slice(0, maxItems);

  return (
    <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{heading}</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {items.map(t => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block py-2 px-2 rounded hover:bg-white transition-colors border border-transparent hover:border-blue-200"
            >
              <span className="font-semibold text-blue-700 hover:text-blue-900">
                {t.emoji} {t.title}
              </span>
              <span className="block text-xs text-gray-600 mt-0.5">{t.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
