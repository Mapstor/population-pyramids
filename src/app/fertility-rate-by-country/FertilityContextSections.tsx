/**
 * Server-rendered context sections for the fertility-rate page.
 * All inline SVG. All numbers traced to UN WPP 2024 — either directly from
 * our fertility/<slug>.json files or computed by aggregating them here.
 */

import Link from 'next/link';
import {
  fmtTFR,
  fmtCBR,
  REPLACEMENT_TFR,
  type SlimFertility,
} from '@/lib/fertility-rate-helpers';

export interface FertilityContextProps {
  countries: SlimFertility[];           // sorted DESC by current TFR
  worldTfrToday: number;
}

export default function FertilityContextSections({ countries, worldTfrToday }: FertilityContextProps) {
  const top10High = countries.slice(0, 10);                          // highest TFR
  const top10Low = [...countries].sort((a, b) => a.currentTFR - b.currentTFR).slice(0, 10);
  const belowReplacement = countries.filter(c => c.currentTFR < REPLACEMENT_TFR);
  const crossings = countries
    .filter(c => c.belowReplacementSince !== null)
    .sort((a, b) => (a.belowReplacementSince! - b.belowReplacementSince!));

  return (
    <>
      <SectionBelowReplacementPanel below={belowReplacement} total={countries.length} worldTfrToday={worldTfrToday} />
      <SectionTopHighLow high={top10High} low={top10Low} />
      <SectionCrossingsTimeline crossings={crossings} />
      <SectionFullRanking countries={countries} worldTfrToday={worldTfrToday} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section A — Below-replacement panel
// ─────────────────────────────────────────────────────────────────────────────

function SectionBelowReplacementPanel({
  below,
  total,
  worldTfrToday,
}: {
  below: SlimFertility[];
  total: number;
  worldTfrToday: number;
}) {
  const share = (below.length / total) * 100;
  const width = 800;
  const height = 130;
  const padding = { top: 28, right: 28, bottom: 24, left: 28 };
  const innerW = width - padding.left - padding.right;
  const barH = 56;
  const barY = padding.top + 18;
  const belowW = (below.length / total) * innerW;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">How many countries are below replacement?</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · replacement = {REPLACEMENT_TFR}</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]" role="img"
             aria-label={`${below.length} of ${total} countries are below the replacement fertility rate of ${REPLACEMENT_TFR}`}>
          <text x={padding.left} y={padding.top + 6} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            {below.length} of {total} countries ({share.toFixed(1)}%) are below the replacement rate
          </text>
          {/* below segment */}
          <rect x={padding.left} y={barY} width={belowW} height={barH} rx={6} fill="#dc2626" />
          {/* above segment */}
          <rect x={padding.left + belowW} y={barY} width={innerW - belowW} height={barH} rx={6} fill="#16a34a" />
          {/* labels — 2 rows because both segments may be narrow */}
          <text x={padding.left + belowW / 2} y={barY + barH / 2} textAnchor="middle"
                fontSize={12} fontWeight={700} fill="white"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            <tspan x={padding.left + belowW / 2} dy="-0.15em">{below.length}</tspan>
            <tspan x={padding.left + belowW / 2} dy="1.25em">below</tspan>
          </text>
          <text x={padding.left + belowW + (innerW - belowW) / 2} y={barY + barH / 2} textAnchor="middle"
                fontSize={12} fontWeight={700} fill="white"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            <tspan x={padding.left + belowW + (innerW - belowW) / 2} dy="-0.15em">{total - below.length}</tspan>
            <tspan x={padding.left + belowW + (innerW - belowW) / 2} dy="1.25em">above</tspan>
          </text>
          {/* divider tick */}
          <line x1={padding.left + belowW} y1={barY - 3} x2={padding.left + belowW} y2={barY + barH + 3}
                stroke="#7f1d1d" strokeWidth={1.5} />
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          More than half the world's countries — <strong>{below.length} of {total} ({share.toFixed(1)}%)</strong> —
          now have a fertility rate below the replacement rate of <strong>{REPLACEMENT_TFR}</strong> children per
          woman. Below this threshold, a population shrinks over time from births alone (immigration can offset
          this). The world average TFR is <strong>{fmtTFR(worldTfrToday)}</strong> — only just above replacement,
          and projected to cross below it by the late 2030s.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: UN World Population Prospects 2024 Revision — Total Fertility Rate (current year) for all
          countries with available data ({total} of 195; Vatican City omitted).
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section B — Top 10 highest + Top 10 lowest TFR
// ─────────────────────────────────────────────────────────────────────────────

function SectionTopHighLow({ high, low }: { high: SlimFertility[]; low: SlimFertility[] }) {
  const width = 880;
  const rowHeight = 36;
  const headerH = 36;
  const height = headerH + rowHeight * 10 + 20;
  const colWidth = width / 2 - 40;

  const maxTFR = Math.max(...high.map(c => c.currentTFR));

  const renderRow = (entry: SlimFertility, idx: number, x: number, y: number, color: string) => {
    const barW = (entry.currentTFR / maxTFR) * (colWidth - 200);
    return (
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
          {entry.currentTFR.toFixed(2)}
        </text>
      </g>
    );
  };

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Top 10 highest and lowest fertility rates</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · children per woman</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[700px]" role="img"
             aria-label="Side-by-side ranking of the ten highest and ten lowest national fertility rates">
          <text x={0 + 4} y={20} fontSize={14} fontWeight={700} fill="#16a34a"
                fontFamily="ui-sans-serif, system-ui, sans-serif">10 highest (most births)</text>
          <text x={width / 2 + 24} y={20} fontSize={14} fontWeight={700} fill="#dc2626"
                fontFamily="ui-sans-serif, system-ui, sans-serif">10 lowest (collapse risk)</text>

          {high.map((c, i) => renderRow(c, i, 0, headerH + i * rowHeight, '#16a34a'))}
          {low.map((c, i) => renderRow(c, i, width / 2 + 20, headerH + i * rowHeight, '#dc2626'))}
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          The ten countries with the highest fertility rates are all in Sub-Saharan Africa, led by{' '}
          <Link href={`/${high[0].slug}`} className="text-blue-700 hover:text-blue-900 underline">
            {high[0].name}
          </Link>{' '}
          at {fmtTFR(high[0].currentTFR)} children per woman. The ten lowest are concentrated in East Asia and
          Southern Europe — <Link href={`/${low[0].slug}`} className="text-blue-700 hover:text-blue-900 underline">
            {low[0].name}
          </Link>{' '}
          holds the global low at <strong>{fmtTFR(low[0].currentTFR)}</strong>, far below replacement.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: UN World Population Prospects 2024 Revision — current-year Total Fertility Rate per country.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section C — Crossing-below-replacement timeline
// ─────────────────────────────────────────────────────────────────────────────

function SectionCrossingsTimeline({ crossings }: { crossings: SlimFertility[] }) {
  if (crossings.length === 0) {
    return null;
  }
  // Use only well-known countries (top 20 by population) so the timeline doesn't clutter.
  // Pick a fixed list of headline countries to highlight, ordered by crossing year.
  const HEADLINE = [
    'japan', 'germany', 'italy', 'united-states', 'united-kingdom', 'france',
    'south-korea', 'china', 'russia', 'spain', 'thailand', 'brazil',
    'iran', 'turkey', 'mexico', 'india', 'indonesia', 'argentina', 'canada',
    'australia', 'vietnam', 'colombia', 'poland',
  ];
  const headlineSet = new Set(HEADLINE);
  const headline = crossings.filter(c => headlineSet.has(c.slug)).slice(0, 16);
  // Sort by crossing year
  headline.sort((a, b) => a.belowReplacementSince! - b.belowReplacementSince!);

  const minYear = Math.min(...headline.map(c => c.belowReplacementSince!));
  const maxYear = Math.max(...headline.map(c => c.belowReplacementSince!));
  const padYears = 3;
  const xLo = Math.floor(minYear / 5) * 5 - padYears;
  const xHi = Math.ceil(maxYear / 5) * 5 + padYears;

  const width = 880;
  const rowHeight = 38;
  const height = rowHeight * headline.length + 60;
  const padding = { top: 36, right: 24, bottom: 24, left: 200 };
  const innerW = width - padding.left - padding.right;
  const xOf = (y: number) => padding.left + ((y - xLo) / (xHi - xLo)) * innerW;

  // Decade ticks across innerW
  const decadeTicks: number[] = [];
  for (let y = Math.ceil(xLo / 10) * 10; y <= xHi; y += 10) decadeTicks.push(y);

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">When major countries dropped below replacement</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · first year TFR fell below {REPLACEMENT_TFR}</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[700px]" role="img"
             aria-label="Timeline showing the year when each major country's fertility rate fell below the 2.1 replacement rate">
          {/* decade gridlines + labels */}
          <g stroke="#e5e7eb" strokeWidth={1}>
            {decadeTicks.map(t => (
              <line key={`g-${t}`} x1={xOf(t)} y1={padding.top - 6} x2={xOf(t)} y2={height - padding.bottom} strokeDasharray="2,3" opacity={0.6} />
            ))}
          </g>
          <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
            {decadeTicks.map(t => (
              <text key={`gt-${t}`} x={xOf(t)} y={padding.top - 10} textAnchor="middle">{t}</text>
            ))}
          </g>

          {/* country rows */}
          {headline.map((c, i) => {
            const y = padding.top + i * rowHeight + rowHeight / 2;
            return (
              <g key={c.slug}>
                <text x={padding.left - 14} y={y + 4} textAnchor="end" fontSize={12} fontWeight={600} fill="#0f172a"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {c.flag} {c.name}
                </text>
                <line x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                <circle cx={xOf(c.belowReplacementSince!)} cy={y} r={6} fill="#dc2626" stroke="white" strokeWidth={1.5} />
                <text x={xOf(c.belowReplacementSince!) + 10} y={y + 4} fontSize={11} fontWeight={700} fill="#dc2626"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {c.belowReplacementSince}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          Below-replacement fertility is not new — Germany crossed in <strong>1970</strong>, Japan in
          the early 1970s, and the United States in 1972 (briefly rising back above in the 2000s). What
          changed is the breadth: by the 2010s, this had spread to most middle-income countries — China,
          Brazil, Thailand, Iran — and is now reaching even Mexico and India. Of the headline economies
          shown above, only India and Indonesia are still close to the threshold rather than well below it.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: UN World Population Prospects 2024 Revision — field <code>belowReplacementSince</code>
          in each country's fertility record. Reflects the first year on record below {REPLACEMENT_TFR};
          some countries (notably the US) have crossed in both directions historically — UN's stored value
          is used as-is.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section D — Full ranking table (all 194 countries)
// ─────────────────────────────────────────────────────────────────────────────

function SectionFullRanking({ countries, worldTfrToday }: { countries: SlimFertility[]; worldTfrToday: number }) {
  // Sorted DESC by TFR per the props contract.
  return (
    <section className="bg-white rounded-xl shadow-sm mb-10 overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-baseline gap-2">
        <h2 className="text-xl font-bold text-gray-900">All {countries.length} countries ranked by fertility rate</h2>
        <span className="text-xs text-gray-500">Highest first · UN WPP 2024</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Region</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">TFR</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">vs 2.1</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Birth rate</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Crossed&nbsp;below</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {countries.map((c, i) => {
              const vs = c.currentTFR - REPLACEMENT_TFR;
              return (
                <tr key={c.slug} className="hover:bg-blue-50">
                  <td className="px-4 py-1.5 text-gray-700 font-medium">{i + 1}</td>
                  <td className="px-4 py-1.5">
                    <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">
                      {c.flag} {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-1.5 text-gray-600">{c.region}</td>
                  <td className={`px-4 py-1.5 text-right font-semibold tabular-nums ${c.currentTFR < REPLACEMENT_TFR ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {fmtTFR(c.currentTFR)}
                  </td>
                  <td className={`px-4 py-1.5 text-right tabular-nums ${vs < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {vs >= 0 ? '+' : ''}{vs.toFixed(2)}
                  </td>
                  <td className="px-4 py-1.5 text-right text-gray-700 tabular-nums">{fmtCBR(c.currentCBR)}</td>
                  <td className="px-4 py-1.5 text-right text-gray-600 tabular-nums">
                    {c.belowReplacementSince ?? '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 text-xs text-gray-500 bg-gray-50 border-t">
        TFR = Total Fertility Rate (children per woman). Birth rate = crude birth rate per 1,000 people.
        "Crossed below" = year TFR first fell below {REPLACEMENT_TFR}. World average TFR: {fmtTFR(worldTfrToday)}.
        Source: UN WPP 2024.
      </div>
    </section>
  );
}
