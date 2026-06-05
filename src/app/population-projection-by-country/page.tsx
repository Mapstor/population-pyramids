import Link from 'next/link';
import type { Metadata } from 'next';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { getCountryFlag } from '@/lib/country-flags';
import { CURRENT_YEAR, LAST_UPDATED_ISO } from '@/lib/site-meta';
import ProjectionCalculator from './ProjectionCalculator';
import ProjectionContextSections from './ProjectionContextSections';
import ToolCrossLinks from '@/components/ToolCrossLinks';
import {
  fmtPop,
  fmtPercent,
  toSlim,
  type ProjectionRecord,
  type SlimProjection,
} from '@/lib/population-projection-helpers';

export const revalidate = 86400;

const PROJECTION_DIR = join(process.cwd(), 'src', 'data', 'population-projections');

export const metadata: Metadata = {
  title: `Population Projection by Country 2025–2100 — UN Medium Variant`,
  description: `Personal population projection calculator + every country's UN-projected population in 2025, 2050, 2100, and any year in between. World population reaches 9.7 billion by 2050 and peaks near 10.3 billion in the 2080s. Includes peak year per country, fastest-growing, fastest-shrinking, and the gap between the UN's low / medium / high variants. UN World Population Prospects 2024 Revision, medium variant.`,
  keywords:
    'world population 2050, world population 2100, population projection by country, future population, [country] population 2050, [country] population 2100, UN population projection, world population peak, when does world population peak, future population calculator, demographic projections',
  openGraph: {
    title: `Population Projection by Country 2025–2100`,
    description: `Pick any country & projection year (2025-2100) using UN data. See when each country peaks and how the global total reaches 10.3B before declining.`,
    type: 'website',
    url: 'https://populationpyramids.org/population-projection-by-country',
    siteName: 'Population Pyramids',
    // og:image auto-generated from src/app/population-projection-by-country/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Population Projection by Country — UN WPP 2024',
    description: 'World peaks at 10.3B in the 2080s. Calculator + every country to 2100.',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/population-projection-by-country',
  },
};

function loadProjectionFile(slug: string): ProjectionRecord | null {
  const f = join(PROJECTION_DIR, `${slug}.json`);
  if (!existsSync(f)) return null;
  try {
    return JSON.parse(readFileSync(f, 'utf-8')) as ProjectionRecord;
  } catch {
    return null;
  }
}

function generateSchema(worldPlace: SlimProjection, countries: SlimProjection[]) {
  const fastestShrink = [...countries].filter(c => c.pop2025 > 1_000_000).sort((a, b) => (a.pop2050 - a.pop2025) / a.pop2025 - (b.pop2050 - b.pop2025) / b.pop2025)[0];
  const fastestGrow = [...countries].filter(c => c.pop2025 > 1_000_000).sort((a, b) => (b.pop2050 - b.pop2025) / b.pop2025 - (a.pop2050 - a.pop2025) / a.pop2025)[0];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://populationpyramids.org/population-projection-by-country#webapp',
        name: 'Population Projection Calculator 2025–2100',
        url: 'https://populationpyramids.org/population-projection-by-country',
        applicationCategory: 'EducationalApplication',
        applicationSubCategory: 'Demographics Tool',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'Interactive tool to look up the UN-projected population of any country in any year from 2025 to 2100, with personal milestones and country comparisons.',
        featureList: [
          'Population projection for any country, any year 2025-2100',
          'Identifies the year each country peaks (and many already have)',
          'Personal milestones — population when you turn 65, 80',
          'Compare any two countries side by side',
          'Full ranking by 2050 and 2100 populations',
        ],
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/population-projection-by-country#dataset',
        name: 'World Population Projection by Country, 1950–2100',
        description: 'Annual total population for 195 countries plus the world aggregate, 1950 estimates and medium-variant projections to 2100. Source: UN World Population Prospects 2024 Revision.',
        creator: { '@type': 'Organization', name: 'United Nations Department of Economic and Social Affairs, Population Division', url: 'https://population.un.org/' },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        temporalCoverage: '1950/2100',
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Population Projection', item: 'https://populationpyramids.org/population-projection-by-country' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What will the world population be in 2050?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `UN World Population Prospects 2024 (medium variant) projects world population at approximately ${fmtPop(worldPlace.pop2050)} in 2050 — up from ${fmtPop(worldPlace.pop2025)} today. Almost all of this growth (>95%) comes from Sub-Saharan Africa; East Asia and most of Europe are already shrinking.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What will the world population be in 2100?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `UN WPP 2024 medium-variant projection: approximately ${fmtPop(worldPlace.pop2100)} in 2100 — only slightly higher than the projected peak. The low variant gives ~7.1 billion, the high variant ~14.4 billion. The medium variant has world population peaking near ${fmtPop(worldPlace.peakPopulation)} around ${worldPlace.peakYear ?? 'the 2080s'} before slow decline.`,
            },
          },
          {
            '@type': 'Question',
            name: 'When will world population peak?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `UN's medium-variant projection has the world's population peaking around ${worldPlace.peakYear ?? 'the 2080s'} at approximately ${fmtPop(worldPlace.peakPopulation)}, then slowly declining. This would be the first sustained decline in modern human history.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which countries are growing fastest?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Among countries with more than 1 million people today, ${fastestGrow?.name ?? 'Niger'} is projected to grow fastest by 2050 (about +${fastestGrow ? Math.round(((fastestGrow.pop2050 - fastestGrow.pop2025) / fastestGrow.pop2025) * 100) : '?'}%). The 10 fastest-growing countries are essentially all in Sub-Saharan Africa, driven by still-high fertility rates and a young base population.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which countries are shrinking fastest?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${fastestShrink?.name ?? 'Ukraine'} tops the list, projected to lose about ${fastestShrink ? Math.round(Math.abs(((fastestShrink.pop2050 - fastestShrink.pop2025) / fastestShrink.pop2025) * 100)) : '?'}% of its population by 2050. East Asia (China, Japan, S. Korea, Taiwan) and Eastern Europe (Ukraine, Bulgaria, Latvia, Lithuania) dominate the list. Italy, Greece, Portugal, and Cuba are notable Western and Latin American entrants.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How accurate are UN population projections?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Short-term projections (10-20 years) are highly accurate because most people who will be alive then are already born. Long-term projections (50+ years) carry real uncertainty — UN publishes low/medium/high variants that diverge by ±1.5 billion at 2100. The biggest source of uncertainty is future fertility, especially in countries currently in fast demographic transition.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does this data come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `UN World Population Prospects 2024 Revision (population.un.org/wpp), medium variant. Annual total population (mid-year July 1) for 195 countries, 1950–2100. Last updated ${LAST_UPDATED_ISO}.`,
            },
          },
        ],
      },
    ],
  };
}

export default async function PopulationProjectionByCountryPage() {
  // Load country metadata + region map (region comes from the regular population/<slug>.json file)
  const countriesMeta = await loadCountries();
  const regionBySlug = new Map<string, string>();
  await Promise.all(
    countriesMeta.map(async c => {
      try {
        const data = await loadCountryData(c.slug);
        regionBySlug.set(c.slug, (data as any).region || 'Unknown');
      } catch {
        regionBySlug.set(c.slug, 'Unknown');
      }
    })
  );

  // Load all projection files
  const projectionFiles = readdirSync(PROJECTION_DIR).filter(f => f.endsWith('.json'));
  const records: ProjectionRecord[] = [];
  for (const f of projectionFiles) {
    try {
      const rec = JSON.parse(readFileSync(join(PROJECTION_DIR, f), 'utf-8')) as ProjectionRecord;
      records.push(rec);
    } catch {
      // skip
    }
  }

  // Build slim places — world first, then countries alphabetical
  const worldRec = records.find(r => r.slug === 'world');
  const worldPlace: SlimProjection = worldRec
    ? toSlim(worldRec, '🌍', 'World')
    : {
        slug: 'world',
        name: 'World',
        flag: '🌍',
        region: 'World',
        pop2025: 0, pop2050: 0, pop2100: 0,
        peakYear: null, peakPopulation: 0,
        values: {},
      };
  const countryPlaces: SlimProjection[] = records
    .filter(r => r.slug !== 'world')
    .map(r => {
      const meta = countriesMeta.find(c => c.slug === r.slug);
      const flag = meta ? getCountryFlag(meta.code) || '🌍' : '🌍';
      const region = regionBySlug.get(r.slug) || 'Unknown';
      return toSlim(r, flag, region);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const allPlaces: SlimProjection[] = [worldPlace, ...countryPlaces];

  const schema = generateSchema(worldPlace, countryPlaces);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Population Projection</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Population Projection by Country 2025–2100
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            UN World Population Prospects 2024 (medium variant) projects world population to grow from{' '}
            <strong>{fmtPop(worldPlace.pop2025)}</strong> today to <strong>{fmtPop(worldPlace.pop2050)}</strong> by 2050, peaking
            near <strong>{fmtPop(worldPlace.peakPopulation)}</strong> around <strong>{worldPlace.peakYear ?? '2080s'}</strong> before slow
            decline. Pick any country and any year below for its projected population.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time> · Source:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
              UN World Population Prospects 2024 Revision
            </a>{' '}(medium variant)
          </p>

          <ProjectionCalculator
            places={allPlaces}
            defaultSlug="world"
            defaultYear={2050}
            defaultBirthYear={1990}
          />

          <ProjectionContextSections all={allPlaces} worldPlace={worldPlace} />

          {/* Visible FAQ */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: 'What will the world population be in 2050?',
                  a: `UN's medium variant: ~${fmtPop(worldPlace.pop2050)}, up from ${fmtPop(worldPlace.pop2025)} today. Almost all of the growth comes from Sub-Saharan Africa; East Asia and most of Europe are already shrinking.`,
                },
                {
                  q: 'What will the world population be in 2100?',
                  a: `~${fmtPop(worldPlace.pop2100)} (medium variant). The low variant gives ~7.1B, high variant ~14.4B. Medium peaks near ${fmtPop(worldPlace.peakPopulation)} around ${worldPlace.peakYear ?? 'the 2080s'} before slow decline.`,
                },
                {
                  q: 'When will the world population peak?',
                  a: `UN medium variant has world population peaking near ${fmtPop(worldPlace.peakPopulation)} around ${worldPlace.peakYear ?? 'the 2080s'}. This would be the first sustained decline in modern human history.`,
                },
                {
                  q: 'Which countries are growing fastest?',
                  a: 'Mostly Sub-Saharan Africa. Niger, DRC, Chad, Somalia, Tanzania and others are projected to roughly double in size by 2050. Pakistan, Nigeria, and Egypt are the demographic giants in this group.',
                },
                {
                  q: 'Which countries are shrinking fastest?',
                  a: 'East Asia (China, Japan, S. Korea, Taiwan) and Eastern Europe (Ukraine, Bulgaria, Latvia, Lithuania) dominate. Italy, Greece, Portugal, and Cuba are notable entrants from Western Europe and Latin America.',
                },
                {
                  q: 'How accurate are UN population projections?',
                  a: 'Short-term (10-20 years): very accurate, since most future people are already born. Long-term (50+ years): real uncertainty — low/medium/high variants diverge by ±1.5B at 2100. Biggest unknown: future fertility in countries still in transition.',
                },
                {
                  q: 'What\'s the difference between low/medium/high variants?',
                  a: 'They use different fertility assumptions. The medium variant is UN\'s central published projection; it gets cited in 99% of news. Low/high are bounds, not strict confidence intervals — they assume fertility falls faster or stays higher than the central path.',
                },
                {
                  q: 'Where does this data come from?',
                  a: `UN World Population Prospects 2024 Revision (population.un.org/wpp), extracted from the official Demographic Indicators dataset, medium variant. Annual total population (mid-year July 1) for 195 countries, 1950–2100. Last updated ${LAST_UPDATED_ISO}.`,
                },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                  <p className="text-sm text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <ToolCrossLinks currentSlug="population-projection-by-country" />

          {/* Sources */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources &amp; Methodology</h3>
            <ul className="space-y-1.5">
              <li>
                <strong>Primary source:</strong>{' '}
                <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN World Population Prospects 2024 Revision
                </a>{' '}
                — annual mid-year (Jul 1) total population for 195 countries, 1950–2100, medium variant.
                Extracted from the official Demographic Indicators dataset (column index: 12, in thousands).
              </li>
              <li>
                <strong>Variants:</strong> UN publishes low, medium, and high variants plus a probabilistic
                Bayesian projection. The medium variant is the central published figure and is shown here.
              </li>
              <li>
                <strong>Methodology:</strong>{' '}
                <a href="https://population.un.org/wpp/Publications/Files/WPP2024_Methodology.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN WPP 2024 Methodology Report
                </a>{' '}
                — fertility, mortality and migration assumptions; uncertainty intervals.
              </li>
              <li>
                <strong>Coverage:</strong> {countryPlaces.length} countries + world aggregate. Data file
                shipped: {(countryPlaces.length * 150 * 8 / 1024).toFixed(0)} KB raw per render, gzipped
                far smaller. All charts and tables on this page are inline SVG generated server-side from
                primary sources — no third-party tracking or external chart libraries.
              </li>
              <li>Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
