import Link from 'next/link';
import type { LifeExpectancyData } from '@/lib/life-expectancy-loader';

interface Props {
  data: LifeExpectancyData;
  countrySlug: string;
}

// Inline SVG line chart for the historical series
function HistoricalChart({ historical, projections }: {
  historical: LifeExpectancyData['historical'];
  projections: LifeExpectancyData['projections'];
}) {
  const all = [...historical, ...projections];
  const minYear = all[0].year;
  const maxYear = all[all.length - 1].year;
  const values = all.map((d) => d.total);
  const minVal = Math.floor(Math.min(...values) / 5) * 5;
  const maxVal = Math.ceil(Math.max(...values) / 5) * 5;

  const W = 720;
  const H = 200;
  const PAD_L = 40;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const x = (year: number) => PAD_L + ((year - minYear) / (maxYear - minYear)) * innerW;
  const y = (val: number) => PAD_T + (1 - (val - minVal) / (maxVal - minVal)) * innerH;

  const histPath = historical
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.year)} ${y(d.total)}`)
    .join(' ');
  const lastHist = historical[historical.length - 1];
  const projPath = [
    `M ${x(lastHist.year)} ${y(lastHist.total)}`,
    ...projections.map((d) => `L ${x(d.year)} ${y(d.total)}`),
  ].join(' ');

  // Y-axis ticks every 5
  const yTicks: number[] = [];
  for (let v = minVal; v <= maxVal; v += 5) yTicks.push(v);
  // X-axis ticks at decades + projection markers
  const xTicks = [1950, 1970, 1990, 2010, 2024, 2050, 2100].filter(
    (yr) => yr >= minYear && yr <= maxYear
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto block"
      role="img"
      aria-label="Life expectancy historical trend"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Gridlines */}
      {yTicks.map((v) => (
        <line
          key={`gl-${v}`}
          x1={PAD_L}
          x2={W - PAD_R}
          y1={y(v)}
          y2={y(v)}
          stroke="#f1f5f9"
          strokeWidth={1}
        />
      ))}

      {/* Y-axis labels */}
      {yTicks.map((v) => (
        <text
          key={`yl-${v}`}
          x={PAD_L - 6}
          y={y(v) + 3}
          fontSize="10"
          fill="#64748b"
          textAnchor="end"
        >
          {v}
        </text>
      ))}

      {/* X-axis labels */}
      {xTicks.map((yr) => (
        <text
          key={`xl-${yr}`}
          x={x(yr)}
          y={H - 8}
          fontSize="10"
          fill="#64748b"
          textAnchor="middle"
        >
          {yr}
        </text>
      ))}

      {/* Historical area fill */}
      <path
        d={`${histPath} L ${x(lastHist.year)} ${PAD_T + innerH} L ${x(minYear)} ${PAD_T + innerH} Z`}
        fill="#dbeafe"
        opacity="0.5"
      />

      {/* Projection line (dashed) */}
      <path
        d={projPath}
        stroke="#94a3b8"
        strokeWidth={2}
        fill="none"
        strokeDasharray="4 3"
      />

      {/* Historical line */}
      <path d={histPath} stroke="#1d4ed8" strokeWidth={2.5} fill="none" />

      {/* Data points */}
      {historical.map((d) => (
        <circle
          key={`h-${d.year}`}
          cx={x(d.year)}
          cy={y(d.total)}
          r={3}
          fill="#1d4ed8"
        />
      ))}
      {projections.map((d) => (
        <circle
          key={`p-${d.year}`}
          cx={x(d.year)}
          cy={y(d.total)}
          r={3}
          fill="#94a3b8"
          stroke="white"
          strokeWidth={1}
        />
      ))}

      {/* End-point labels */}
      <text
        x={x(historical[0].year)}
        y={y(historical[0].total) - 8}
        fontSize="10"
        fontWeight="700"
        fill="#1e40af"
      >
        {historical[0].total} ({historical[0].year})
      </text>
      <text
        x={x(lastHist.year) - 4}
        y={y(lastHist.total) - 8}
        fontSize="10"
        fontWeight="700"
        fill="#1e40af"
        textAnchor="end"
      >
        {lastHist.total} ({lastHist.year})
      </text>
      <text
        x={x(projections[projections.length - 1].year)}
        y={y(projections[projections.length - 1].total) - 8}
        fontSize="10"
        fontWeight="700"
        fill="#64748b"
        textAnchor="end"
      >
        {projections[projections.length - 1].total} ({projections[projections.length - 1].year}, proj.)
      </text>

      {/* Vertical separator: end of history / start of projection */}
      <line
        x1={x(lastHist.year)}
        x2={x(lastHist.year)}
        y1={PAD_T}
        y2={PAD_T + innerH}
        stroke="#cbd5e1"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function tierLabel(rank: number, total: number) {
  if (rank <= 10) return 'Top 10 in the world';
  if (rank <= 30) return `Top ${Math.round((rank / total) * 100)}% globally`;
  if (rank <= 60) return 'Upper middle globally';
  if (rank >= total - 10) return 'Bottom 10 in the world';
  if (rank >= total - 30) return `Bottom ${Math.round(((total - rank) / total) * 100)}% globally`;
  return 'Middle of the pack globally';
}

function vsWorldPhrase(diff: number) {
  if (diff >= 10) return "Among the world's longest-lived populations.";
  if (diff >= 5) return 'Solidly above the world average.';
  if (diff >= 0) return 'Slightly above the world average.';
  if (diff >= -5) return 'Slightly below the world average.';
  if (diff >= -10) return 'Below the world average — meaningful room to improve.';
  return 'Well below the world average — among the lowest globally.';
}

function gapPhrase(gap: number) {
  if (gap >= 8) return 'Very wide — typical of high male mortality from heart disease, alcohol, or violence.';
  if (gap >= 6) return 'Wider than the world average (~5 yrs).';
  if (gap >= 4) return 'Close to the world average gender gap.';
  if (gap >= 2) return 'Narrow — uncommon in modern data.';
  return 'Very narrow — possible elevated female mortality from maternal causes.';
}

function gainPhrase(gain: number) {
  if (gain >= 30) return "Among the world's largest improvements — life expectancy roughly doubled since 1950.";
  if (gain >= 22) return 'Major gain — among the largest improvements globally since 1950.';
  if (gain >= 15) return 'Solid improvement since 1950 — typical for countries that completed the demographic transition.';
  if (gain >= 8) return 'Moderate improvement since 1950.';
  return 'Limited improvement — likely conflict, instability, or HIV/AIDS impact.';
}

export default function LifeExpectancySection({ data, countrySlug }: Props) {
  const aboveWorld = data.current.total - data.worldAverage.total;
  const gain1950to2024 = data.current.total - data.historical[0].total;
  const genderGap = data.current.female - data.current.male;
  const projection2050 = data.projections.find((p) => p.year === 2050);
  const projection2100 = data.projections.find((p) => p.year === 2100);

  // Dataset JSON-LD for this country's life expectancy
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `https://populationpyramids.org/${countrySlug}#life-expectancy-dataset`,
    name: `Life Expectancy at Birth in ${data.country}`,
    description: `Life expectancy at birth in ${data.country}, 2024: ${data.current.total} years (male ${data.current.male}, female ${data.current.female}). World rank #${data.rank.position} of ${data.rank.outOf}. Historical series 1950–${data.historical[data.historical.length - 1].year} and UN medium-variant projections to 2100.`,
    url: `https://populationpyramids.org/${countrySlug}#life-expectancy`,
    creator: {
      '@type': 'Organization',
      name: 'United Nations Department of Economic and Social Affairs, Population Division',
      url: 'https://population.un.org/',
    },
    publisher: { '@type': 'Organization', name: 'PopulationPyramids.org' },
    temporalCoverage: `1950/${data.projections[data.projections.length - 1]?.year ?? 2100}`,
    spatialCoverage: { '@type': 'Country', name: data.country },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Life Expectancy at Birth, both sexes', value: data.current.total, unitText: 'years' },
      { '@type': 'PropertyValue', name: 'Male Life Expectancy at Birth', value: data.current.male, unitText: 'years' },
      { '@type': 'PropertyValue', name: 'Female Life Expectancy at Birth', value: data.current.female, unitText: 'years' },
    ],
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8" id="life-expectancy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Life Expectancy in {data.country}</h2>
          <p className="text-xs text-gray-600 mt-0.5">
            How long the average person in {data.country} is expected to live · sourced from UN WPP 2024
          </p>
        </div>
        <span className="text-xs text-gray-500">Source: UN WPP 2024 · Updated {data.lastUpdated}</span>
      </div>

      {/* Main stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            Life expectancy 2024
          </div>
          <div className="text-3xl font-bold text-blue-900 leading-none">{data.current.total}</div>
          <div className="text-xs text-blue-700 mt-1">years · world rank #{data.rank.position}</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-600">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            vs world avg
          </div>
          <div className="text-3xl font-bold text-emerald-900 leading-none">
            {aboveWorld >= 0 ? '+' : ''}
            {aboveWorld.toFixed(1)}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            world: {data.worldAverage.total} yrs
          </div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-600">
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            Men
          </div>
          <div className="text-3xl font-bold text-indigo-900 leading-none">{data.current.male}</div>
          <div className="text-xs text-indigo-700 mt-1">
            world avg: {data.worldAverage.male} yrs
          </div>
        </div>
        <div className="bg-rose-50 rounded-lg p-4 border-l-4 border-rose-500">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            Women
          </div>
          <div className="text-3xl font-bold text-rose-900 leading-none">{data.current.female}</div>
          <div className="text-xs text-rose-700 mt-1">
            world avg: {data.worldAverage.female} yrs
          </div>
        </div>
      </div>

      {/* Interpretation cards — 3 short structured reads of the data */}
      <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-4">
        <div className="bg-blue-50/60 rounded p-3 border-l-2 border-blue-400">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Global standing</div>
          <div className="font-semibold text-gray-900 text-sm">
            {tierLabel(data.rank.position, data.rank.outOf)}
          </div>
          <div className="text-xs text-gray-700 mt-1">{vsWorldPhrase(aboveWorld)}</div>
        </div>
        <div className="bg-rose-50/60 rounded p-3 border-l-2 border-rose-400">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            Gender gap: {genderGap >= 0 ? '+' : ''}
            {genderGap.toFixed(1)} years
          </div>
          <div className="font-semibold text-gray-900 text-sm">
            Women live {genderGap.toFixed(1)} yrs longer than men
          </div>
          <div className="text-xs text-gray-700 mt-1">{gapPhrase(genderGap)}</div>
        </div>
        <div className="bg-emerald-50/60 rounded p-3 border-l-2 border-emerald-400">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            Since 1950: +{gain1950to2024.toFixed(1)} years
          </div>
          <div className="font-semibold text-gray-900 text-sm">
            From {data.historical[0].total} yrs (1950) → {data.current.total} yrs (2024)
          </div>
          <div className="text-xs text-gray-700 mt-1">{gainPhrase(gain1950to2024)}</div>
        </div>
      </div>

      {/* Historical chart */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between items-baseline mb-3 flex-wrap gap-2">
          <h3 className="text-base font-bold text-gray-900">
            Historical Trend, 1950 → 2024 (plus UN projection to 2100)
          </h3>
          <span className="text-xs text-gray-500">Solid: actual · Dashed: medium-variant projection</span>
        </div>
        <HistoricalChart historical={data.historical} projections={data.projections} />
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider">1950 baseline</div>
            <div className="font-bold text-gray-900">{data.historical[0].total} yrs</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider">2024 today</div>
            <div className="font-bold text-gray-900">{data.current.total} yrs</div>
          </div>
          <div className="bg-blue-50 rounded p-3">
            <div className="text-xs text-blue-700 uppercase tracking-wider">+ gained 1950–2024</div>
            <div className="font-bold text-blue-900">+{gain1950to2024.toFixed(1)} yrs</div>
          </div>
          <div className="bg-amber-50 rounded p-3">
            <div className="text-xs text-amber-700 uppercase tracking-wider">2050 (UN proj.)</div>
            <div className="font-bold text-amber-900">
              {projection2050 ? `${projection2050.total} yrs` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Forward-looking interpretation card */}
      {projection2050 && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          <div className="bg-amber-50/60 rounded p-3 border-l-2 border-amber-400">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              Looking ahead
            </div>
            <div className="text-sm text-gray-700">
              UN&apos;s central scenario projects{' '}
              <strong>{projection2050.total} years by 2050</strong> (
              {(projection2050.total - data.current.total).toFixed(1)} yrs more){projection2100
                ? `, and ${projection2100.total} by 2100`
                : ''}
              . These figures assume continued improvement in mortality at slowing rates — historically
              accurate for countries already in the high range.
            </div>
          </div>
        </div>
      )}

      {/* Long-range projection card */}
      {projection2100 && (
        <div className="border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Today (2024)</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{data.current.total}</div>
            <div className="text-xs text-gray-500 mt-0.5">years</div>
          </div>
          <div className="p-4 text-center bg-amber-50/50">
            <div className="text-xs text-amber-700 uppercase tracking-wider">Projection 2050</div>
            <div className="text-2xl font-bold text-amber-900 mt-1">
              {projection2050?.total ?? '—'}
            </div>
            <div className="text-xs text-amber-700 mt-0.5">
              {projection2050 ? `+${(projection2050.total - data.current.total).toFixed(1)} yrs` : ''}
            </div>
          </div>
          <div className="p-4 text-center bg-gray-50">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Projection 2100</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{projection2100.total}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              +{(projection2100.total - data.current.total).toFixed(1)} yrs
            </div>
          </div>
        </div>
      )}

      {/* Neighbor comparison */}
      {data.neighbors.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between items-baseline mb-3 flex-wrap gap-2">
            <h3 className="text-base font-bold text-gray-900">{data.country} vs Regional Neighbors</h3>
            <span className="text-xs text-gray-500">Life expectancy at birth, 2024 · UN WPP</span>
          </div>
          {(() => {
            const allCountries = [
              { name: data.country, slug: data.slug, value: data.current.total, isHome: true },
              ...data.neighbors.map((n) => ({ ...n, isHome: false })),
            ];
            const max = Math.max(...allCountries.map((c) => c.value));
            return (
              <div className="space-y-2">
                {allCountries.map((c) => {
                  const pct = (c.value / max) * 100;
                  return (
                    <div key={c.slug}>
                      <div className="flex justify-between text-sm mb-1">
                        <Link
                          href={`/${c.slug}`}
                          className={
                            c.isHome
                              ? 'font-bold text-blue-700'
                              : 'text-gray-700 hover:text-blue-700'
                          }
                        >
                          {c.name}
                          {c.isHome ? ' (this country)' : ''}
                        </Link>
                        <span className="font-semibold text-gray-900">{c.value} yrs</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded overflow-hidden">
                        <div
                          className={
                            'h-full rounded transition-all ' +
                            (c.isHome ? 'bg-blue-600' : 'bg-gray-400')
                          }
                          style={{ width: `${pct}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Source footer + cross-link to the global ranking */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 text-xs text-gray-600 flex justify-between items-baseline flex-wrap gap-2">
        <div>
          <strong>Source:</strong>{' '}
          <a
            href="https://population.un.org/wpp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 underline"
          >
            UN World Population Prospects 2024
          </a>
          . Life expectancy at birth, mid-year estimates. Medium-variant projections to 2100.
        </div>
        <Link
          href="/life-expectancy-by-country"
          className="text-blue-700 hover:text-blue-900 font-medium whitespace-nowrap"
        >
          See full world ranking →
        </Link>
      </div>
    </section>
  );
}
