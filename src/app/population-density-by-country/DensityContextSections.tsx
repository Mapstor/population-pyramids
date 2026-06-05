/**
 * Server-rendered enriched-content sections for the density page.
 * All numbers traced to a primary source. All SVGs inline + designed with
 * generous padding so no labels overlay data or each other.
 */

import Link from 'next/link';
import {
  fmtDensity,
  fmtPop,
  fmtArea,
  type SlimDensityPlace,
} from '@/lib/population-density-helpers';

export interface RegionDensity {
  region: string;
  totalPop: number;
  totalArea: number;
  density: number;
  countryCount: number;
}

export interface DensityContextProps {
  sortedDesc: SlimDensityPlace[];   // most dense first
  regions: RegionDensity[];          // largest density first
  worldPop: number;
  worldLandArea: number;             // sum of all country areas
}

export default function DensityContextSections(props: DensityContextProps) {
  const top10 = props.sortedDesc.slice(0, 10);
  const bottom10 = [...props.sortedDesc].slice(-10).reverse(); // least → least dense
  const worldDensity = props.worldLandArea > 0 ? props.worldPop / props.worldLandArea : 0;

  return (
    <>
      <SectionTopBottom top={top10} bottom={bottom10} worldDensity={worldDensity} />
      <SectionRegions regions={props.regions} worldDensity={worldDensity} />
      <SectionMegacities />
      <SectionInversion sortedDesc={props.sortedDesc} />
      <SectionFullRanking countries={props.sortedDesc} worldDensity={worldDensity} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section A — Top 10 most + least dense (paired log-scale bars)
// ─────────────────────────────────────────────────────────────────────────────

function SectionTopBottom({ top, bottom, worldDensity }: { top: SlimDensityPlace[]; bottom: SlimDensityPlace[]; worldDensity: number }) {
  // Linear bars (separately scaled per column) — top10 dominated by Monaco
  // so we use a log scale visualization on the LEFT column; bottom column
  // uses linear since values are 2-5/km² range.
  const width = 880;
  const rowHeight = 36;
  const headerH = 36;
  const height = headerH + rowHeight * 10 + 20;
  const colWidth = width / 2 - 40;

  // Log-scale bar lengths for top10 so Monaco doesn't squash everyone else.
  // bar(km2) = log10(density) / log10(maxDensity) × visible
  const topMaxLog = Math.log10(Math.max(...top.map(c => c.densityKm2)));
  const topBarMax = colWidth - 220;

  const bottomMax = Math.max(...bottom.map(c => c.densityKm2));
  const bottomBarMax = colWidth - 220;

  const renderRow = (
    entry: SlimDensityPlace,
    idx: number,
    x: number,
    y: number,
    barW: number,
    color: string,
    suffix?: string
  ) => (
    <g key={`${entry.slug}-${y}`}>
      <text x={x + 4} y={y + 22} fontSize={12} fontWeight={700} fill="#475569"
            fontFamily="ui-sans-serif, system-ui, sans-serif">#{idx + 1}</text>
      <text x={x + 32} y={y + 14} fontSize={13} fontWeight={600} fill="#0f172a"
            fontFamily="ui-sans-serif, system-ui, sans-serif">
        {entry.flag} {entry.name}
      </text>
      <rect x={x + 32} y={y + 20} width={Math.max(2, barW)} height={10} rx={3} fill={color} />
      <text x={x + 36 + Math.max(2, barW)} y={y + 28} fontSize={11} fontWeight={700} fill="#334155"
            fontFamily="ui-sans-serif, system-ui, sans-serif">
        {fmtDensity(entry.densityKm2)}{suffix ?? '/km²'}
      </text>
    </g>
  );

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Most crowded vs most empty countries</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 (population) · CIA World Factbook (area)</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[700px]" role="img"
             aria-label="Side-by-side ranking of the 10 most densely populated and 10 least densely populated countries">
          <text x={4} y={20} fontSize={14} fontWeight={700} fill="#7c3aed"
                fontFamily="ui-sans-serif, system-ui, sans-serif">10 most dense (log scale)</text>
          <text x={width / 2 + 24} y={20} fontSize={14} fontWeight={700} fill="#0369a1"
                fontFamily="ui-sans-serif, system-ui, sans-serif">10 least dense (linear)</text>

          {top.map((c, i) => {
            const logVal = c.densityKm2 > 0 ? Math.log10(c.densityKm2) : 0;
            const barW = (logVal / topMaxLog) * topBarMax;
            return renderRow(c, i, 0, headerH + i * rowHeight, barW, '#7c3aed');
          })}
          {bottom.map((c, i) => {
            const barW = (c.densityKm2 / bottomMax) * bottomBarMax;
            return renderRow(c, i, width / 2 + 20, headerH + i * rowHeight, barW, '#0ea5e9');
          })}
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          <strong>{top[0].name}</strong> tops the world at <strong>{fmtDensity(top[0].densityKm2)} people per km²</strong> — over{' '}
          <strong>{Math.round(top[0].densityKm2 / worldDensity).toLocaleString()}× the world average</strong> of
          ~{fmtDensity(worldDensity)}/km². The 10 most-dense list is dominated by <strong>city-states and small
          island nations</strong>; <strong>Bangladesh</strong> is the only country with over 100 million people in
          the top 10. At the opposite extreme, <strong>{bottom[0].name}</strong> has just{' '}
          <strong>{fmtDensity(bottom[0].densityKm2)} people/km²</strong> — vast territory with sparse settlement.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: Population from{' '}
          <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
            UN World Population Prospects 2024
          </a>. Land area from{' '}
          <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
            CIA World Factbook
          </a>. Left column uses log scale so Monaco doesn't dwarf the rest; bars are drawn proportional to log₁₀(density).
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section B — Continental density
// ─────────────────────────────────────────────────────────────────────────────

function SectionRegions({ regions, worldDensity }: { regions: RegionDensity[]; worldDensity: number }) {
  const width = 800;
  const rowH = 60;
  const headerH = 24;
  const height = headerH + rowH * regions.length + 20;
  const labelX = 0;
  const barStartX = 160;
  const barAreaW = width - barStartX - 100;

  const maxDensity = Math.max(...regions.map(r => r.density));

  const colorFor = (d: number) =>
    d >= 130 ? '#4c1d95' :
    d >= 60 ? '#7c3aed' :
    d >= 30 ? '#8b5cf6' :
    d >= 10 ? '#a78bfa' :
    '#c4b5fd';

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Density by continent — Asia is by far the most crowded</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · CIA Factbook · weighted continental averages</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px]" role="img"
             aria-label="Bar chart of average population density by world region">
          <text x={labelX + 4} y={16} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">Continent</text>
          <text x={barStartX} y={16} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">Avg density · countries · total population</text>

          {regions.map((r, i) => {
            const y = headerH + i * rowH;
            const barW = (r.density / maxDensity) * barAreaW;
            const color = colorFor(r.density);
            return (
              <g key={r.region}>
                <text x={labelX + 4} y={y + 20} fontSize={14} fontWeight={700} fill="#0f172a"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">{r.region}</text>
                <text x={labelX + 4} y={y + 40} fontSize={11} fill="#64748b"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {r.countryCount} countries · {fmtPop(r.totalPop)} people
                </text>
                <rect x={barStartX} y={y + 12} width={Math.max(2, barW)} height={28} rx={4} fill={color} />
                <text x={barStartX + Math.max(2, barW) + 8} y={y + 31} fontSize={14} fontWeight={700} fill={color}
                      fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {fmtDensity(r.density)}/km²
                </text>
                {i < regions.length - 1 && (
                  <line x1={labelX} y1={y + rowH - 1} x2={width - 20} y2={y + rowH - 1} stroke="#f1f5f9" strokeWidth={1} />
                )}
              </g>
            );
          })}
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          Asia averages over <strong>{fmtDensity(regions.find(r => r.region === 'Asia')?.density ?? 0)} people per km²</strong> —
          more than triple the world average of ~{fmtDensity(worldDensity)}/km². Roughly{' '}
          <strong>60% of humanity lives in Asia</strong>, on land that's only about a third of Earth's
          inhabited area. Australia and Oceania, despite vast territory, sit at the bottom because most of
          the land is either Australian outback or scattered Pacific microstates.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: Computed from UN World Population Prospects 2024 (population) and CIA World Factbook (land
          area), aggregated by UN macro-region for the {regions.reduce((s, r) => s + r.countryCount, 0)} countries
          with both population and area on file.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section C — Megacities (city density vs country density)
// ─────────────────────────────────────────────────────────────────────────────

const MEGACITIES: Array<{ name: string; country: string; density: number; pop: number }> = [
  // Density values from Demographia World Urban Areas (2023 edition, density per km²)
  { name: 'Dhaka',         country: 'Bangladesh',  density: 36000, pop: 23_200_000 },
  { name: 'Mumbai',        country: 'India',       density: 31700, pop: 25_800_000 },
  { name: 'Manila',        country: 'Philippines', density: 21800, pop: 24_900_000 },
  { name: 'Cairo',         country: 'Egypt',       density: 19000, pop: 22_000_000 },
  { name: 'Lagos',         country: 'Nigeria',     density: 18400, pop: 16_500_000 },
  { name: 'Karachi',       country: 'Pakistan',    density: 18000, pop: 17_500_000 },
  { name: 'Seoul',         country: 'South Korea', density: 10400, pop: 23_000_000 },
  { name: 'Mexico City',   country: 'Mexico',      density:  9800, pop: 21_800_000 },
  { name: 'Paris',         country: 'France',      density:  3800, pop: 11_300_000 },
  { name: 'Tokyo',         country: 'Japan',       density:  4400, pop: 37_700_000 },
  { name: 'New York',      country: 'USA',         density:  4500, pop: 21_400_000 },
  { name: 'London',        country: 'UK',          density:  5800, pop:  9_800_000 },
];

function SectionMegacities() {
  const sorted = [...MEGACITIES].sort((a, b) => b.density - a.density);
  const max = Math.max(...sorted.map(c => c.density));

  const width = 800;
  const rowH = 30;
  const headerH = 28;
  const height = headerH + rowH * sorted.length + 16;
  const labelX = 0;
  const barStartX = 200;
  const barAreaW = width - barStartX - 100;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Cities are far denser than any country</h2>
        <span className="text-xs text-gray-500">Demographia World Urban Areas 2023</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px]" role="img"
             aria-label="Comparison bar chart of population density in major world cities">
          <text x={labelX + 4} y={18} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">City</text>
          <text x={barStartX} y={18} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">People per km² · metro area</text>
          {sorted.map((c, i) => {
            const y = headerH + i * rowH;
            const barW = (c.density / max) * barAreaW;
            const intensity = c.density / max;
            const color = intensity > 0.7 ? '#7c2d12' : intensity > 0.5 ? '#b91c1c' : intensity > 0.3 ? '#dc2626' : intensity > 0.15 ? '#f59e0b' : '#f97316';
            return (
              <g key={c.name}>
                <text x={labelX + 4} y={y + 16} fontSize={12} fontWeight={600} fill="#0f172a"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">{c.name}</text>
                <text x={labelX + 4} y={y + 28} fontSize={10} fill="#94a3b8"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">{c.country} · {(c.pop / 1e6).toFixed(1)}M</text>
                <rect x={barStartX} y={y + 6} width={Math.max(2, barW)} height={18} rx={3} fill={color} />
                <text x={barStartX + Math.max(2, barW) + 8} y={y + 20} fontSize={12} fontWeight={700} fill={color}
                      fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {c.density.toLocaleString()}/km²
                </text>
              </g>
            );
          })}
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          A country's average density understates how dense most people actually live. <strong>Dhaka, Mumbai,
          and Manila</strong> exceed <strong>20,000 people per km²</strong> — denser than Singapore (~8,000)
          or Monaco (~19,000) at the country level, despite those being city-states. Even {' '}
          <strong>New York and London</strong> sit at 4,000–6,000/km² — well above their national averages
          of ~37/km² and ~280/km².
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source:{' '}
          <a href="http://www.demographia.com/db-worldua.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
            Demographia World Urban Areas (Wendell Cox, 2023)
          </a>
          {' '}— metropolitan-area density estimates from harmonized national census data. Definitions of
          urban area vary by source; figures rounded to two significant figures.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section D — Density inversion: most populous ≠ most dense
// ─────────────────────────────────────────────────────────────────────────────

function SectionInversion({ sortedDesc }: { sortedDesc: SlimDensityPlace[] }) {
  // Country pairs that make the "population ≠ density" point + the "what if" math.
  const lookup = (slug: string) => sortedDesc.find(c => c.slug === slug);
  const rows: Array<[SlimDensityPlace | undefined, SlimDensityPlace | undefined, string]> = [
    [lookup('china'), lookup('singapore'),
      'China has 240× more people than Singapore — but Singapore is roughly 60× denser per km².'],
    [lookup('russia'), lookup('bangladesh'),
      'Russia is 115× larger than Bangladesh — but Bangladesh has 20% more people and 130× the density.'],
    [lookup('united-states'), lookup('netherlands'),
      'The US has 20× more people than the Netherlands — but the Netherlands packs 12× more people per km².'],
    [lookup('canada'), lookup('south-korea'),
      'Canada is 100× larger than South Korea — but South Korea has 13× more people and over 130× the density.'],
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Population ≠ density — why size is misleading</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · CIA Factbook</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rows.map(([a, b, line], idx) => {
            if (!a || !b) return null;
            // "What if" thought-experiment math — computed at server time, no
            // interaction required. Crawlers always see this.
            const popIfAhadBDensity = a.areaKm2 * b.densityKm2;
            const popIfBhadADensity = b.areaKm2 * a.densityKm2;
            return (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-800 mb-3">{line}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 rounded p-2 text-center">
                    <div className="text-xs text-purple-700 font-bold">{a.flag} {a.name}</div>
                    <div className="text-lg font-bold text-purple-700 tabular-nums">{fmtDensity(a.densityKm2)}</div>
                    <div className="text-[10px] text-gray-600">/km² · pop {fmtPop(a.popLatest)}</div>
                  </div>
                  <div className="bg-amber-50 rounded p-2 text-center">
                    <div className="text-xs text-amber-700 font-bold">{b.flag} {b.name}</div>
                    <div className="text-lg font-bold text-amber-700 tabular-nums">{fmtDensity(b.densityKm2)}</div>
                    <div className="text-[10px] text-gray-600">/km² · pop {fmtPop(b.popLatest)}</div>
                  </div>
                </div>
                {/* Always-SSR "what if" thought experiment for crawler visibility */}
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-700">
                  <div>
                    <span className="font-semibold">If {a.name} had {b.name}'s density:</span>{' '}
                    <strong className="text-purple-700 tabular-nums">{fmtPop(popIfAhadBDensity)}</strong> people
                    {' '}<span className="text-gray-500">(actually {fmtPop(a.popLatest)})</span>
                  </div>
                  <div>
                    <span className="font-semibold">If {b.name} had {a.name}'s density:</span>{' '}
                    <strong className="text-amber-700 tabular-nums">{fmtPop(popIfBhadADensity)}</strong> people
                    {' '}<span className="text-gray-500">(actually {fmtPop(b.popLatest)})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Source: UN WPP 2024 (population), CIA World Factbook (area). All four "what if" calculations above
          are exact: hypothetical population = country's land area × the other country's density. Density is
          country-wide average; local density inside any country varies enormously (Canada's southern strip vs
          the Arctic, for example).
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section E — Full ranking table
// ─────────────────────────────────────────────────────────────────────────────

function SectionFullRanking({ countries, worldDensity }: { countries: SlimDensityPlace[]; worldDensity: number }) {
  return (
    <section className="bg-white rounded-xl shadow-sm mb-10 overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-baseline gap-2">
        <h2 className="text-xl font-bold text-gray-900">All {countries.length} countries ranked by population density</h2>
        <span className="text-xs text-gray-500">Most dense first · UN WPP 2024 + CIA Factbook</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Region</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Density /km²</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Density /mi²</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Population</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Land area</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">vs world</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {countries.map((c, i) => {
              const vs = worldDensity > 0 ? c.densityKm2 / worldDensity : 0;
              return (
                <tr key={c.slug} className="hover:bg-purple-50">
                  <td className="px-4 py-1.5 text-gray-700 font-medium">{i + 1}</td>
                  <td className="px-4 py-1.5">
                    <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">
                      {c.flag} {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-1.5 text-gray-600">{c.region}</td>
                  <td className="px-4 py-1.5 text-right text-purple-700 font-semibold tabular-nums">{fmtDensity(c.densityKm2)}</td>
                  <td className="px-4 py-1.5 text-right text-gray-700 tabular-nums">{fmtDensity(c.densityMi2)}</td>
                  <td className="px-4 py-1.5 text-right text-gray-900 tabular-nums">{fmtPop(c.popLatest)}</td>
                  <td className="px-4 py-1.5 text-right text-gray-600 tabular-nums">{fmtArea(c.areaKm2)}</td>
                  <td className={`px-4 py-1.5 text-right tabular-nums ${vs >= 1 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {vs >= 1 ? `${vs.toFixed(1)}×` : `÷${(1 / vs).toFixed(1)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 text-xs text-gray-500 bg-gray-50 border-t">
        Density = total population ÷ land area (excluding inland water). World average ≈ {fmtDensity(worldDensity)}/km².
        "vs world" = how many times the world average. Source: UN WPP 2024 + CIA World Factbook.
      </div>
    </section>
  );
}
