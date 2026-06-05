import Link from 'next/link';
import type { Metadata } from 'next';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { getCountryFlag } from '@/lib/country-flags';
import { CURRENT_YEAR, LAST_UPDATED_ISO } from '@/lib/site-meta';
import PyramidMaker from './PyramidMaker';
import PyramidContextSections from './PyramidContextSections';
import { STANDARD_AGE_BANDS, type PyramidRow } from '@/lib/pyramid-maker-helpers';
import ToolCrossLinks from '@/components/ToolCrossLinks';

export const revalidate = 86400;

// Year stops shipped to the client for the year slider — 9 well-spaced years
// to keep the payload small while still giving meaningful historical depth.
const SHIPPED_YEARS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025];

export const metadata: Metadata = {
  title: `Population Pyramid Maker ${CURRENT_YEAR} — Generate Custom Pyramids Free`,
  description: `Free online population pyramid generator. Pick any of 195 countries from 1950–2025 (UN data pre-loaded) or enter your own age/sex numbers. Customize colors, title, and percentages — download as PNG or SVG. Built-in anatomy guide and the three pyramid types (expansive, stationary, constrictive) with real examples.`,
  keywords:
    'population pyramid maker, population pyramid generator, make population pyramid, custom population pyramid, population pyramid creator, age pyramid maker, demographic pyramid generator, free population pyramid tool',
  openGraph: {
    title: `Population Pyramid Maker — Free Generator for Any Country or Custom Data`,
    description: `Pick any country & year (UN data) or enter your own numbers. Customize, then download PNG or SVG. Built-in anatomy guide.`,
    type: 'website',
    url: 'https://populationpyramids.org/population-pyramid-maker',
    siteName: 'Population Pyramids',
    // og:image auto-generated from src/app/population-pyramid-maker/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Population Pyramid Maker — Free PNG/SVG Generator',
    description: '195 countries 1950–2025, or paste your own data. Free download.',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/population-pyramid-maker',
  },
};

function generateSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://populationpyramids.org/population-pyramid-maker#webapp',
        name: 'Population Pyramid Maker',
        url: 'https://populationpyramids.org/population-pyramid-maker',
        applicationCategory: 'EducationalApplication',
        applicationSubCategory: 'Data visualization · demographics',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Free online generator for population pyramids. Choose any of 195 countries from 1950–2025 or enter custom age/sex data, then download as PNG or SVG.',
        featureList: [
          'Pre-loaded UN data for 195 countries from 1950 to 2025',
          'Custom age × sex data input with spreadsheet paste',
          'Customizable title, subtitle, colors, gridlines, caption',
          'Toggle between absolute counts and percentages',
          'Download as 2× retina PNG or scalable SVG',
          'Built-in anatomy diagram and the three pyramid types',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Population Pyramid Maker', item: 'https://populationpyramids.org/population-pyramid-maker' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is a population pyramid?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A population pyramid is a back-to-back bar chart that shows a country (or any group\'s) age structure: age groups on the vertical axis, population count or percentage on the horizontal axis, males on the left, females on the right. The shape reveals the demographic stage — wide base = high birth rate; narrow base + wide middle = aging society.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I make a population pyramid?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'On this page: (1) choose "From a country" and pick any of 195 countries plus a year from 1950–2025; or (2) choose "From your own data" and enter age × sex numbers in the 21-row table (or paste from a spreadsheet). The chart updates live; then click Download PNG or Download SVG.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the three types of population pyramids?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Expansive (wide base, narrow top — high birth rate, fast growth, e.g. Niger), Stationary (similar-width bars from base to middle, slow growth, e.g. United States), and Constrictive (narrow base, wide middle — below-replacement fertility, e.g. Japan or Italy). The three types correspond to stages of the demographic transition.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I use my own data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Switch to "From your own data", then fill in the male and female counts per 5-year age band. You can also paste TSV/CSV from a spreadsheet — columns are age range, male, female; the header row is optional.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does the country data come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'UN World Population Prospects 2024 Revision (population.un.org/wpp) — historical estimates 1950–2023 plus the medium-variant 2024–2025 projection. Each country\'s data is broken into 21 standard 5-year age bands (0–4 through 95–99, plus 100+).',
            },
          },
          {
            '@type': 'Question',
            name: 'What formats can I download?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'PNG at 2× retina resolution (good for slides, social, and print) or SVG (infinitely scalable vector, openable in Illustrator/Figma/Inkscape for further editing). Both are generated entirely in your browser — nothing is uploaded.',
            },
          },
        ],
      },
    ],
  };
}

// Convert a YearData ageGroups array to our PyramidRow shape (drops percentage
// fields, keeps only ageRange/male/female). Accepts the source's optional
// ageRange field and treats absent values as empty bands.
function toRows(ageGroups: Array<{ ageRange?: string; male: number; female: number }> | undefined): PyramidRow[] {
  if (!ageGroups) return STANDARD_AGE_BANDS.map(b => ({ ageRange: b, male: 0, female: 0 }));
  const lookup = new Map<string, { male: number; female: number }>();
  for (const g of ageGroups) {
    if (g.ageRange) lookup.set(g.ageRange, { male: g.male, female: g.female });
  }
  return STANDARD_AGE_BANDS.map(band => {
    const hit = lookup.get(band);
    return hit ? { ageRange: band, male: hit.male, female: hit.female } : { ageRange: band, male: 0, female: 0 };
  });
}

interface CountryOption {
  slug: string;
  name: string;
  flag: string;
  years: number[];
  rowsByYear: Record<string, PyramidRow[]>;
}

export default async function PopulationPyramidMakerPage() {
  const countriesMeta = await loadCountries();

  // Build slim, shippable per-country data: 9 years × 21 bands × {male, female}.
  const options: CountryOption[] = (
    await Promise.all(
      countriesMeta.map(async (c): Promise<CountryOption | null> => {
        try {
          const data = await loadCountryData(c.slug);
          const rowsByYear: Record<string, PyramidRow[]> = {};
          const years: number[] = [];
          for (const y of SHIPPED_YEARS) {
            const yd = data.years[String(y)];
            if (yd?.ageGroups) {
              rowsByYear[String(y)] = toRows(yd.ageGroups);
              years.push(y);
            }
          }
          if (years.length === 0) return null;
          return {
            slug: c.slug,
            name: c.name,
            flag: getCountryFlag(c.code) || '🌍',
            years,
            rowsByYear,
          };
        } catch {
          return null;
        }
      })
    )
  ).filter((o): o is CountryOption => o !== null);

  options.sort((a, b) => a.name.localeCompare(b.name));

  // Default for the maker on initial SSR render
  const defaultSlug = 'united-states';
  const defaultYear = 2025;
  const defaultCountry = options.find(o => o.slug === defaultSlug) ?? options[0];
  const initialRows = defaultCountry?.rowsByYear[String(defaultYear)]
    ?? defaultCountry?.rowsByYear[String(defaultCountry.years[defaultCountry.years.length - 1])]
    ?? STANDARD_AGE_BANDS.map(b => ({ ageRange: b, male: 0, female: 0 }));
  const initialTitle = defaultCountry ? `${defaultCountry.name} Population Pyramid ${defaultYear}` : 'Custom Population Pyramid';

  // Three SSR example pyramids for the "three types" section
  const expansiveCountry = options.find(o => o.slug === 'niger');
  const stationaryCountry = options.find(o => o.slug === 'united-states');
  const constrictiveCountry = options.find(o => o.slug === 'japan');

  const examples = {
    expansive: {
      name: expansiveCountry?.name ?? 'Niger',
      flag: expansiveCountry?.flag ?? '🌍',
      year: 2025,
      rows: expansiveCountry?.rowsByYear['2025'] ?? initialRows,
    },
    stationary: {
      name: stationaryCountry?.name ?? 'United States',
      flag: stationaryCountry?.flag ?? '🌍',
      year: 2025,
      rows: stationaryCountry?.rowsByYear['2025'] ?? initialRows,
    },
    constrictive: {
      name: constrictiveCountry?.name ?? 'Japan',
      flag: constrictiveCountry?.flag ?? '🌍',
      year: 2025,
      rows: constrictiveCountry?.rowsByYear['2025'] ?? initialRows,
    },
  };

  const schema = generateSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Pyramid Maker</li>
            </ol>
          </nav>

          {/* H1 + answer-first lede */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Population Pyramid Maker {CURRENT_YEAR}
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            Generate a publication-quality population pyramid for any of <strong>195 countries</strong> from{' '}
            <strong>1950 to 2025</strong> using UN data — or paste in your own age/sex breakdown.
            Customize the title, colors, and units, then download as <strong>PNG or SVG</strong>. Free, no
            sign-up, runs entirely in your browser.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time> · Country data:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
              UN World Population Prospects 2024
            </a>
          </p>

          {/* Maker */}
          <PyramidMaker
            countries={options}
            defaultSlug={defaultSlug}
            defaultYear={defaultYear}
            initialRows={initialRows}
            initialTitle={initialTitle}
          />

          {/* SSR-only context sections */}
          <PyramidContextSections {...examples} />

          {/* Visible FAQ */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: 'What is a population pyramid?',
                  a: 'A back-to-back bar chart showing a population\'s age structure: age groups on the Y axis, count (or %) on the X axis, males on the left, females on the right. The shape reveals demographic stage — wide base = young/growing, narrow base + wide middle = aging.',
                },
                {
                  q: 'How do I make a population pyramid here?',
                  a: 'Pick "From a country" and choose any of 195 countries + a year, OR pick "From your own data" and type or paste age × sex numbers. The chart updates live. Click Download PNG or SVG to save.',
                },
                {
                  q: 'What are the three types of population pyramids?',
                  a: 'Expansive (wide base, narrow top — Niger), Stationary (even bars from base to middle — USA), Constrictive (narrow base, wide middle — Japan). They correspond to the stages of the demographic transition.',
                },
                {
                  q: 'Can I use my own data?',
                  a: 'Yes. Switch to "From your own data". Enter male and female counts per 5-year age band, or paste TSV/CSV from a spreadsheet (columns: age range, male, female). Header row is optional.',
                },
                {
                  q: 'Where does the country data come from?',
                  a: `UN World Population Prospects ${CURRENT_YEAR} Revision (population.un.org/wpp). The maker ships 9 key years per country (1950, 1960, ..., 2025) for instant switching.`,
                },
                {
                  q: 'What formats can I download?',
                  a: 'PNG at 2× retina resolution (great for slides, social, print) or SVG (scalable vector, editable in Illustrator/Figma/Inkscape). Both are generated entirely in your browser — your data is never uploaded.',
                },
                {
                  q: 'Can I share my custom pyramid?',
                  a: 'For country mode, the page URL updates with your selections — copy and share it. For custom mode, download the PNG or SVG and share that file; custom numbers are kept in your browser only (not in the URL).',
                },
                {
                  q: 'Why are pyramids drawn with youngest at the bottom?',
                  a: 'Convention: it lets you literally see a cohort age upward over time as the chart "grows". It also makes the youth bulge — the most policy-relevant signal in fast-growing populations — visually prominent.',
                },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                  <p className="text-sm text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <ToolCrossLinks currentSlug="population-pyramid-maker" />

          {/* Sources */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources &amp; Methodology</h3>
            <ul className="space-y-1.5">
              <li>
                <strong>Country data:</strong>{' '}
                <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN World Population Prospects 2024 Revision
                </a>{' '}
                — age-by-sex population for {options.length} countries, 1950 through 2025. The maker ships
                9 key years per country ({SHIPPED_YEARS.join(', ')}); the year slider snaps to these.
              </li>
              <li>
                <strong>Age bands:</strong> 21 standard UN bands — 0-4, 5-9, …, 95-99, 100+.
              </li>
              <li>
                <strong>Rendering:</strong> All charts are inline SVG generated in your browser at render
                time. Downloads are produced client-side: SVG is the rendered chart serialized; PNG is the
                SVG rasterized to a 2× canvas. No data leaves your device.
              </li>
              <li>Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
