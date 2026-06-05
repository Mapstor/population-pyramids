/**
 * Server-rendered context sections for the "Population when you were born"
 * page. All numbers traced to primary sources cited inline. SVGs are inline
 * (no canvas, no client library) so they ship in the SSR HTML — readable by
 * crawlers and AI extractors, and laid out with generous padding to avoid
 * label/data collisions.
 */

import Link from 'next/link';
import { fmtPop, fmtMultiplier, fmtPercent } from '@/lib/population-when-born-helpers';

export interface MilestoneEntry {
  year: number;      // year world crossed this threshold
  pop: number;       // population at threshold, in billions
  label: string;     // "1 billion" / "8 billion"
  yearsSincePrev?: number;
  source: 'HYDE' | 'UN' | 'UN-projected';
}

export interface GrowthRatePoint {
  year: number;
  rate: number;      // % year-over-year
}

export interface TopTenEntry {
  rank: number;
  slug: string;
  name: string;
  flag: string;
  pop: number;
}

export interface RegionEntry {
  name: string;
  pop1950: number;
  popLatest: number;
  multiplier: number;
}

export interface PopulationContextProps {
  milestones: MilestoneEntry[];
  growthRateSeries: GrowthRatePoint[];
  peakGrowth: GrowthRatePoint;
  latestGrowth: GrowthRatePoint;
  topTen1950: TopTenEntry[];
  topTen2025: TopTenEntry[];
  regions: RegionEntry[];
  worldPop1950: number;
  worldPopLatest: number;
}

// World total fertility rate from UN WPP 2024 (primary source). Five-year
// rolling averages from population.un.org/wpp Indicators → "Total Fertility
// Rate" → World aggregate. Hardcoded here because it's an authoritative
// published series we don't otherwise ingest at the world level.
const WORLD_TFR_SERIES: Array<{ year: number; tfr: number }> = [
  { year: 1950, tfr: 4.97 },
  { year: 1960, tfr: 4.95 },
  { year: 1965, tfr: 5.05 }, // peak
  { year: 1970, tfr: 4.83 },
  { year: 1980, tfr: 3.58 },
  { year: 1990, tfr: 3.16 },
  { year: 2000, tfr: 2.69 },
  { year: 2010, tfr: 2.51 },
  { year: 2020, tfr: 2.32 },
  { year: 2024, tfr: 2.25 },
  { year: 2030, tfr: 2.16 }, // medium-variant projection
  { year: 2050, tfr: 2.10 },
  { year: 2075, tfr: 1.94 },
  { year: 2100, tfr: 1.84 },
];
const REPLACEMENT_TFR = 2.1;

export default function PopulationContextSections(props: PopulationContextProps) {
  return (
    <>
      <SectionTimeline milestones={props.milestones} />
      <SectionGrowthRate
        series={props.growthRateSeries}
        peak={props.peakGrowth}
        latest={props.latestGrowth}
      />
      <SectionFertility />
      <SectionTopTen then1950={props.topTen1950} now={props.topTen2025} />
      <SectionRegions regions={props.regions} />
      <SectionEverLived worldPopLatest={props.worldPopLatest} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — Timeline of billion milestones
// ─────────────────────────────────────────────────────────────────────────────

function SectionTimeline({ milestones }: { milestones: MilestoneEntry[] }) {
  const minYear = 1800;
  const maxYear = 2100;
  const width = 900;
  const height = 220;
  const padding = { top: 60, right: 36, bottom: 50, left: 36 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const baseY = padding.top + innerH / 2;

  const xOf = (y: number) => padding.left + ((y - minYear) / (maxYear - minYear)) * innerW;

  // Decade ticks for the time axis
  const decadeTicks: number[] = [];
  for (let y = 1800; y <= 2100; y += 50) decadeTicks.push(y);

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">When the world reached each billion people</h2>
        <span className="text-xs text-gray-500">Sources: UN WPP 2024 · HYDE 3.3</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[700px]" role="img"
             aria-label="Timeline of world population milestones from 1 billion (1804) to 10 billion (projected 2058)">
          {/* baseline */}
          <line x1={padding.left} y1={baseY} x2={padding.left + innerW} y2={baseY}
                stroke="#94a3b8" strokeWidth={2} />
          {/* decade ticks below baseline */}
          {decadeTicks.map(y => (
            <g key={y}>
              <line x1={xOf(y)} y1={baseY} x2={xOf(y)} y2={baseY + 5} stroke="#94a3b8" strokeWidth={1} />
              <text x={xOf(y)} y={baseY + 18} fontSize={11} textAnchor="middle" fill="#475569"
                    fontFamily="ui-sans-serif, system-ui, sans-serif">{y}</text>
            </g>
          ))}

          {/* milestone markers + alternating-side labels to avoid collision */}
          {milestones.map((m, i) => {
            const above = i % 2 === 0;
            const labelY = above ? baseY - 18 : baseY + 32;
            const yearY = above ? baseY - 36 : baseY + 50;
            const color = m.source === 'UN-projected' ? '#94a3b8' : m.source === 'HYDE' ? '#0ea5e9' : '#1d4ed8';
            const fill = m.source === 'UN-projected' ? 'white' : color;
            const isProjected = m.source === 'UN-projected';
            return (
              <g key={m.label}>
                <line x1={xOf(m.year)} y1={above ? baseY - 6 : baseY + 6}
                      x2={xOf(m.year)} y2={above ? labelY + 4 : labelY - 14}
                      stroke={color} strokeWidth={1} strokeDasharray={isProjected ? '3,3' : ''} />
                <circle cx={xOf(m.year)} cy={baseY} r={6} fill={fill} stroke={color} strokeWidth={2} />
                <text x={xOf(m.year)} y={labelY} fontSize={12} fontWeight={700} textAnchor="middle"
                      fill={color} fontFamily="ui-sans-serif, system-ui, sans-serif">{m.label}</text>
                <text x={xOf(m.year)} y={yearY} fontSize={10} textAnchor="middle"
                      fill="#64748b" fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {isProjected ? `~${m.year}` : m.year}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-sm text-gray-700">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Doubling gap shrinks</div>
            It took <strong>123 years</strong> for the world to add its second billion (1804→1927), but only{' '}
            <strong>12 years</strong> from 7B to 8B (2011→2022).
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-md p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Doubling gap widens again</div>
            UN projects ~<strong>21 years</strong> from 8B to 9B and another ~<strong>21 years</strong> from
            9B to 10B — the slowdown is real.
          </div>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-md p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Peak in the 2080s</div>
            Medium-variant projection: world population peaks near <strong>10.3 billion</strong> in the
            2080s, then slow decline to ~10.2B by 2100.
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Pre-1950 milestones: HYDE 3.3 historical population database (Klein Goldewijk et al., PBL Netherlands
          Environmental Assessment Agency). 1950 onwards and projections to 2100: United Nations, World Population
          Prospects 2024 Revision, medium variant (population.un.org/wpp). Filled circles = observed; hollow = projected.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Annual growth rate over time
// ─────────────────────────────────────────────────────────────────────────────

function SectionGrowthRate({ series, peak, latest }: { series: GrowthRatePoint[]; peak: GrowthRatePoint; latest: GrowthRatePoint }) {
  const width = 800;
  const height = 360;
  const padding = { top: 56, right: 24, bottom: 44, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xMin = series[0].year;
  const xMax = series[series.length - 1].year;
  const yMax = Math.ceil(Math.max(...series.map(p => p.rate)) * 2) / 2 + 0.1; // round up to 0.5
  const yMin = Math.min(0, Math.floor(Math.min(...series.map(p => p.rate)) * 2) / 2);

  const xOf = (y: number) => padding.left + ((y - xMin) / (xMax - xMin)) * innerW;
  const yOf = (v: number) => padding.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const pathD = series.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.year).toFixed(1)},${yOf(p.rate).toFixed(1)}`).join(' ');

  // Tick generation, spaced enough to avoid label collisions
  const xTicks: number[] = [];
  for (let y = 1960; y <= 2020; y += 20) xTicks.push(y);
  xTicks.push(xMax);
  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax; v += 0.5) yTicks.push(parseFloat(v.toFixed(1)));

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">World population growth rate, year over year</h2>
        <span className="text-xs text-gray-500">Computed from UN WPP 2024 annual world estimates</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px]" role="img"
             aria-label={`World annual population growth rate from ${xMin} to ${xMax}, peaked at ${peak.rate.toFixed(2)}% in ${peak.year}`}>
          {/* gridlines */}
          <g stroke="#e5e7eb" strokeWidth={1}>
            {yTicks.map(v => (
              <line key={`yg-${v}`} x1={padding.left} y1={yOf(v)} x2={padding.left + innerW} y2={yOf(v)} />
            ))}
          </g>
          {/* axis labels */}
          <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
            {yTicks.map(v => (
              <text key={`yt-${v}`} x={padding.left - 8} y={yOf(v) + 4} textAnchor="end">{v.toFixed(1)}%</text>
            ))}
            {xTicks.map(t => (
              <text key={`xt-${t}`} x={xOf(t)} y={padding.top + innerH + 18} textAnchor="middle">{t}</text>
            ))}
            <text x={padding.left - 42} y={padding.top + innerH / 2}
                  transform={`rotate(-90, ${padding.left - 42}, ${padding.top + innerH / 2})`}
                  textAnchor="middle" fontSize={10}>annual growth rate</text>
          </g>

          {/* zero reference line */}
          <line x1={padding.left} y1={yOf(0)} x2={padding.left + innerW} y2={yOf(0)}
                stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />

          {/* curve */}
          <path d={pathD} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {/* peak marker + label */}
          <g>
            <circle cx={xOf(peak.year)} cy={yOf(peak.rate)} r={5} fill="#dc2626" stroke="white" strokeWidth={1.5} />
            <line x1={xOf(peak.year)} y1={yOf(peak.rate)} x2={xOf(peak.year)} y2={padding.top + 18} stroke="#dc2626" strokeWidth={1} strokeDasharray="3,3" />
            <text x={xOf(peak.year)} y={padding.top + 12} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              Peak: {peak.rate.toFixed(2)}% in {peak.year}
            </text>
          </g>

          {/* latest marker + label */}
          <g>
            <circle cx={xOf(latest.year)} cy={yOf(latest.rate)} r={5} fill="#1d4ed8" stroke="white" strokeWidth={1.5} />
            <text x={xOf(latest.year) - 6} y={yOf(latest.rate) - 10} textAnchor="end" fontSize={11} fontWeight={700} fill="#1d4ed8"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              Today: {latest.rate.toFixed(2)}%
            </text>
          </g>
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          Growth rate peaked at <strong>{peak.rate.toFixed(2)}% per year in {peak.year}</strong> — the moment the
          world added humans fastest in relative terms. It has fallen by more than half since, to{' '}
          <strong>{latest.rate.toFixed(2)}%</strong> today. Slower percentage growth on a larger base still means
          tens of millions of additional people per year, but the curve is unmistakably bending.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: Computed from United Nations, World Population Prospects 2024 Revision — annual world
          total population, with year-over-year percent change.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — World total fertility rate
// ─────────────────────────────────────────────────────────────────────────────

function SectionFertility() {
  const series = WORLD_TFR_SERIES;
  const width = 800;
  const height = 360;
  const padding = { top: 56, right: 28, bottom: 44, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xMin = 1950;
  const xMax = 2100;
  const yMin = 0;
  const yMax = 6;

  const xOf = (y: number) => padding.left + ((y - xMin) / (xMax - xMin)) * innerW;
  const yOf = (v: number) => padding.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  // Split into observed (≤2024) and projected (>2024) so we can dash the future.
  const observed = series.filter(p => p.year <= 2024);
  const projected = series.filter(p => p.year >= 2024);
  const pathObserved = observed.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.year).toFixed(1)},${yOf(p.tfr).toFixed(1)}`).join(' ');
  const pathProjected = projected.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.year).toFixed(1)},${yOf(p.tfr).toFixed(1)}`).join(' ');

  const xTicks = [1950, 1970, 1990, 2010, 2030, 2050, 2075, 2100];
  const yTicks = [0, 1, 2, 3, 4, 5, 6];

  const peakPoint = { year: 1965, tfr: 5.05 };
  const todayPoint = { year: 2024, tfr: 2.25 };

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Why growth is slowing: world fertility collapse</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · World Total Fertility Rate</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px]" role="img"
             aria-label="World total fertility rate from 1950 to projected 2100, declining from over 5 children per woman to below 2.1">
          {/* gridlines */}
          <g stroke="#e5e7eb" strokeWidth={1}>
            {yTicks.map(v => (
              <line key={`yg-${v}`} x1={padding.left} y1={yOf(v)} x2={padding.left + innerW} y2={yOf(v)} />
            ))}
          </g>
          {/* axis labels */}
          <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
            {yTicks.map(v => (
              <text key={`yt-${v}`} x={padding.left - 8} y={yOf(v) + 4} textAnchor="end">{v}</text>
            ))}
            {xTicks.map(t => (
              <text key={`xt-${t}`} x={xOf(t)} y={padding.top + innerH + 18} textAnchor="middle">{t}</text>
            ))}
            <text x={padding.left - 42} y={padding.top + innerH / 2}
                  transform={`rotate(-90, ${padding.left - 42}, ${padding.top + innerH / 2})`}
                  textAnchor="middle" fontSize={10}>children per woman</text>
          </g>

          {/* replacement reference */}
          <line x1={padding.left} y1={yOf(REPLACEMENT_TFR)} x2={padding.left + innerW} y2={yOf(REPLACEMENT_TFR)}
                stroke="#16a34a" strokeWidth={1.5} strokeDasharray="6,4" />
          <text x={padding.left + 4} y={yOf(REPLACEMENT_TFR) - 5} fontSize={11} fill="#15803d" fontWeight={600}
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            replacement rate ({REPLACEMENT_TFR})
          </text>

          {/* observed curve */}
          <path d={pathObserved} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {/* projected curve (dashed) */}
          <path d={pathProjected} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6,4" opacity={0.7} />

          {/* peak marker */}
          <circle cx={xOf(peakPoint.year)} cy={yOf(peakPoint.tfr)} r={5} fill="#dc2626" stroke="white" strokeWidth={1.5} />
          <text x={xOf(peakPoint.year)} y={padding.top + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            Peak: 5.05 in 1965
          </text>
          <line x1={xOf(peakPoint.year)} y1={yOf(peakPoint.tfr)} x2={xOf(peakPoint.year)} y2={padding.top + 20}
                stroke="#dc2626" strokeWidth={1} strokeDasharray="3,3" />

          {/* today marker */}
          <circle cx={xOf(todayPoint.year)} cy={yOf(todayPoint.tfr)} r={5} fill="#1d4ed8" stroke="white" strokeWidth={1.5} />
          <text x={xOf(todayPoint.year) + 8} y={yOf(todayPoint.tfr) + 4} textAnchor="start" fontSize={11} fontWeight={700} fill="#1d4ed8"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            Today: 2.25
          </text>
        </svg>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-sm text-gray-700">
          <div className="bg-rose-50 border-l-4 border-rose-500 rounded-md p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">Peak (1965)</div>
            Women averaged <strong>~5 children</strong> globally. Family planning, urbanization, and falling
            child mortality had not yet reached most of the developing world.
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Today (2024)</div>
            World TFR is <strong>2.25 children per woman</strong> — only just above replacement. More than{' '}
            <strong>half the world's population</strong> already lives in countries below 2.1.
          </div>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-md p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Projected (2050)</div>
            UN central projection crosses below replacement around the late 2030s, reaching{' '}
            <strong>~2.10 by 2050</strong> and <strong>~1.84 by 2100</strong>.
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Source: United Nations, World Population Prospects 2024 Revision — World Total Fertility Rate,
          medium variant, five-year rolling averages (population.un.org/wpp). Solid line is observed; dashed
          line is medium-variant projection. Replacement level ≈ 2.1 children per woman in low-mortality
          settings.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 4 — Top 10 most populous countries: 1950 vs 2025
// ─────────────────────────────────────────────────────────────────────────────

function SectionTopTen({ then1950, now }: { then1950: TopTenEntry[]; now: TopTenEntry[] }) {
  // Color code by entry/exit status
  const slugs1950 = new Set(then1950.map(c => c.slug));
  const slugsNow = new Set(now.map(c => c.slug));

  const width = 880;
  const rowHeight = 38;
  const headerH = 36;
  const height = headerH + rowHeight * 10 + 20;
  const colLeftX = 0;
  const colRightX = width / 2 + 20;
  const colWidth = width / 2 - 40;

  // bar scaling: shared max across both years for honest comparison
  const maxPop = Math.max(then1950[0].pop, now[0].pop);

  const bar = (entry: TopTenEntry, x: number, y: number, color: string) => {
    const barW = (entry.pop / maxPop) * (colWidth - 200);
    return (
      <g key={`${entry.slug}-${y}`}>
        <text x={x + 4} y={y + 24} fontSize={12} fontWeight={700} fill="#475569"
              fontFamily="ui-sans-serif, system-ui, sans-serif">#{entry.rank}</text>
        <text x={x + 32} y={y + 14} fontSize={13} fontWeight={600} fill="#0f172a"
              fontFamily="ui-sans-serif, system-ui, sans-serif">
          <tspan>{entry.flag} {entry.name}</tspan>
        </text>
        <rect x={x + 32} y={y + 20} width={barW} height={12} rx={3} fill={color} />
        <text x={x + 36 + barW} y={y + 30} fontSize={11} fontWeight={600} fill="#334155"
              fontFamily="ui-sans-serif, system-ui, sans-serif">
          {(entry.pop / 1e6).toFixed(entry.pop > 1e9 ? 0 : 0)}M
        </text>
      </g>
    );
  };

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Top 10 most populous countries: 1950 vs today</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · present-day boundaries</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[700px]" role="img"
             aria-label="Side-by-side ranking of the ten most populous countries in 1950 versus today">
          {/* column headers */}
          <text x={colLeftX + 4} y={20} fontSize={14} fontWeight={700} fill="#1d4ed8"
                fontFamily="ui-sans-serif, system-ui, sans-serif">1950</text>
          <text x={colRightX + 4} y={20} fontSize={14} fontWeight={700} fill="#0f766e"
                fontFamily="ui-sans-serif, system-ui, sans-serif">2025</text>

          {/* left column — 1950 */}
          {then1950.map((c, i) => {
            const stillIn = slugsNow.has(c.slug);
            return bar(c, colLeftX, headerH + i * rowHeight, stillIn ? '#3b82f6' : '#cbd5e1');
          })}
          {/* right column — 2025 */}
          {now.map((c, i) => {
            const wasIn1950 = slugs1950.has(c.slug);
            return bar(c, colRightX, headerH + i * rowHeight, wasIn1950 ? '#14b8a6' : '#f59e0b');
          })}
        </svg>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs">
          <div className="flex items-center gap-2"><span className="inline-block w-4 h-3 rounded-sm bg-blue-500" /> Still in top 10 today</div>
          <div className="flex items-center gap-2"><span className="inline-block w-4 h-3 rounded-sm bg-gray-300" /> Dropped out</div>
          <div className="flex items-center gap-2"><span className="inline-block w-4 h-3 rounded-sm bg-teal-500" /> Was in top 10 in 1950</div>
          <div className="flex items-center gap-2"><span className="inline-block w-4 h-3 rounded-sm bg-amber-500" /> New entrant</div>
        </div>
        <p className="text-sm text-gray-700 mt-4">
          Four countries dropped out of the top 10 between 1950 and 2025: <strong>Germany</strong>,{' '}
          <strong>United Kingdom</strong>, <strong>Italy</strong>, and <strong>Japan</strong>. Four new
          entrants took their place: <strong>Pakistan</strong>, <strong>Nigeria</strong>,{' '}
          <strong>Bangladesh</strong>, and <strong>Ethiopia</strong>. The most dramatic single rank change
          was India overtaking China in 2023 — the first time in roughly three centuries that China was not
          the world's most populous country.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: Computed from United Nations, World Population Prospects 2024 Revision — country total
          population for 1950 and {now[0]?.pop > 0 ? '2025' : 'the latest available year'}. Historical
          countries are mapped to present-day boundaries (so "Russia 1950" means the territory of present-day
          Russia, etc.).
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 5 — Regional population growth multiplier
// ─────────────────────────────────────────────────────────────────────────────

function SectionRegions({ regions }: { regions: RegionEntry[] }) {
  const width = 800;
  const rowH = 60;
  const headerH = 24;
  const height = headerH + rowH * regions.length + 24;
  const labelX = 0;
  const barStartX = 160;
  const barAreaW = width - barStartX - 100;

  const maxMult = Math.max(...regions.map(r => r.multiplier));

  const colorFor = (m: number) =>
    m >= 5 ? '#dc2626' :
    m >= 3 ? '#f59e0b' :
    m >= 2 ? '#3b82f6' :
    '#94a3b8';

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Growth has been wildly uneven by region</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · regional aggregates, 1950 → 2025</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px]" role="img"
             aria-label="Bar chart of population growth multiplier from 1950 to 2025 for each UN world region">
          {/* header line */}
          <text x={labelX + 4} y={16} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">Region</text>
          <text x={barStartX} y={16} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">Growth multiplier · pop in 1950 → 2025</text>

          {regions.map((r, i) => {
            const y = headerH + i * rowH;
            const barW = (r.multiplier / maxMult) * barAreaW;
            const color = colorFor(r.multiplier);
            return (
              <g key={r.name}>
                {/* region name */}
                <text x={labelX + 4} y={y + 20} fontSize={14} fontWeight={700} fill="#0f172a"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">{r.name}</text>
                <text x={labelX + 4} y={y + 40} fontSize={11} fill="#64748b"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {(r.pop1950 / 1e6).toFixed(0)}M → {r.popLatest >= 1e9 ? (r.popLatest / 1e9).toFixed(2) + 'B' : (r.popLatest / 1e6).toFixed(0) + 'M'}
                </text>
                {/* bar */}
                <rect x={barStartX} y={y + 12} width={barW} height={28} rx={4} fill={color} />
                {/* multiplier label */}
                <text x={barStartX + barW + 8} y={y + 31} fontSize={14} fontWeight={700} fill={color}
                      fontFamily="ui-sans-serif, system-ui, sans-serif">×{r.multiplier.toFixed(2)}</text>
                {/* separator */}
                {i < regions.length - 1 && (
                  <line x1={labelX} y1={y + rowH - 1} x2={width - 20} y2={y + rowH - 1} stroke="#f1f5f9" strokeWidth={1} />
                )}
              </g>
            );
          })}
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          Africa's population multiplied by more than five since 1950, the steepest of any region. Europe
          barely grew at all and is now shrinking. The next century's population growth — almost all of it —
          will come from Sub-Saharan Africa. Asia, the world's largest region by population, has already
          passed its growth peak.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: Computed from United Nations, World Population Prospects 2024 Revision — sum of country
          populations in 1950 vs 2025, grouped by UN macro-region.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 6 — How many humans have ever lived
// ─────────────────────────────────────────────────────────────────────────────

function SectionEverLived({ worldPopLatest }: { worldPopLatest: number }) {
  const everLivedBillions = 117;        // PRB estimate (Carl Haub / Toshiko Kaneda, 2022 update)
  const aliveBillions = worldPopLatest / 1e9;
  const aliveShare = (aliveBillions / everLivedBillions) * 100;

  const width = 800;
  const height = 200;
  const padding = { top: 30, right: 30, bottom: 30, left: 30 };
  const innerW = width - padding.left - padding.right;
  const barH = 80;
  const barY = padding.top + 20;

  const aliveW = (aliveBillions / everLivedBillions) * innerW;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">How many humans have ever lived?</h2>
        <span className="text-xs text-gray-500">Population Reference Bureau · 2022 estimate</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]" role="img"
             aria-label={`Stacked bar showing that of approximately 117 billion humans ever born, ${aliveBillions.toFixed(2)} billion are alive today`}>
          {/* axis label */}
          <text x={padding.left} y={padding.top + 8} fontSize={12} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            117 billion humans ever born — {aliveShare.toFixed(1)}% are alive today
          </text>

          {/* alive segment */}
          <rect x={padding.left} y={barY} width={aliveW} height={barH} rx={6} fill="#1d4ed8" />
          {/* deceased segment */}
          <rect x={padding.left + aliveW} y={barY} width={innerW - aliveW} height={barH} rx={6} fill="#cbd5e1" />

          {/* Alive label — 2 rows so it fits inside the narrow ~7% segment */}
          <text x={padding.left + aliveW / 2} y={barY + barH / 2} textAnchor="middle"
                fontSize={12} fontWeight={700} fill="white"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            <tspan x={padding.left + aliveW / 2} dy="-0.15em">{aliveBillions.toFixed(2)}B</tspan>
            <tspan x={padding.left + aliveW / 2} dy="1.25em">alive</tspan>
          </text>
          {/* Right-side label — wide segment, single row is fine */}
          <text x={padding.left + aliveW + (innerW - aliveW) / 2} y={barY + barH / 2 + 5} textAnchor="middle"
                fontSize={13} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            {(everLivedBillions - aliveBillions).toFixed(0)}B who came before
          </text>

          {/* divider tick + percent */}
          <line x1={padding.left + aliveW} y1={barY - 4} x2={padding.left + aliveW} y2={barY + barH + 4}
                stroke="#1d4ed8" strokeWidth={1.5} />
          <text x={padding.left + aliveW} y={barY + barH + 22} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="#1d4ed8"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            {aliveShare.toFixed(1)}%
          </text>
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          Demographers at the Population Reference Bureau estimate that roughly <strong>117 billion humans</strong>{' '}
          have ever been born — meaning the <strong>{aliveBillions.toFixed(2)} billion alive today</strong> are
          about <strong>{aliveShare.toFixed(0)}%</strong> of every human who has ever existed. The estimate
          starts from approximately 50,000 BCE (the conventional starting point for behaviorally modern humans)
          and is sensitive to assumptions about prehistoric birth rates and child mortality, so it should be
          read as an order of magnitude rather than a precise count.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source:{' '}
          <a href="https://www.prb.org/articles/how-many-people-have-ever-lived-on-earth/" target="_blank"
             rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
            Population Reference Bureau, "How Many People Have Ever Lived on Earth?"
          </a>{' '}
          (Carl Haub original, Toshiko Kaneda 2022 update). Living-population component:{' '}
          <Link href="/" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</Link>.
        </p>
      </div>
    </section>
  );
}
