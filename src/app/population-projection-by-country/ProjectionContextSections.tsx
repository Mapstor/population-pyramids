/**
 * Server-rendered context sections for the population-projection page.
 * All numbers traced to UN WPP 2024 — computed at server time from the
 * per-country projection files we just extracted.
 */

import Link from 'next/link';
import {
  fmtPop,
  fmtSign,
  fmtPercent,
  trajectoryFor,
  type SlimProjection,
} from '@/lib/population-projection-helpers';

export interface ProjectionContextProps {
  all: SlimProjection[];        // includes world at index 0 followed by countries
  worldPlace: SlimProjection;
}

export default function ProjectionContextSections({ all, worldPlace }: ProjectionContextProps) {
  const countries = all.filter(p => p.slug !== 'world');
  const fastestGrow = [...countries]
    .filter(c => c.pop2025 > 1_000_000)
    .map(c => ({ ...c, growth: c.pop2025 > 0 ? (c.pop2050 - c.pop2025) / c.pop2025 : 0 }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 10);
  const fastestShrink = [...countries]
    .filter(c => c.pop2025 > 1_000_000)
    .map(c => ({ ...c, growth: c.pop2025 > 0 ? (c.pop2050 - c.pop2025) / c.pop2025 : 0 }))
    .sort((a, b) => a.growth - b.growth)
    .slice(0, 10);
  const alreadyPeaked = countries.filter(c => c.peakYear !== null && c.peakYear <= 2025);
  const peakingBy2050 = countries.filter(c => c.peakYear !== null && c.peakYear > 2025 && c.peakYear <= 2050);
  const peakingAfter2050 = countries.filter(c => c.peakYear !== null && c.peakYear > 2050 && c.peakYear < 2100);
  const stillGrowing2100 = countries.filter(c => c.peakYear === null || c.peakYear >= 2100);

  return (
    <>
      <SectionWorldTrajectory world={worldPlace} />
      <SectionPeakBuckets
        alreadyPeaked={alreadyPeaked.length}
        peakingBy2050={peakingBy2050.length}
        peakingAfter2050={peakingAfter2050.length}
        stillGrowing2100={stillGrowing2100.length}
        countries={countries}
      />
      <SectionTopGrowShrink grow={fastestGrow} shrink={fastestShrink} />
      <SectionVariants />
      <SectionFullRanking countries={countries} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: World trajectory + key milestones
// ─────────────────────────────────────────────────────────────────────────────

function SectionWorldTrajectory({ world }: { world: SlimProjection }) {
  // Sample world series at decades
  const yearsToShow = [1950, 1975, 2000, 2025, 2050, 2075, 2100];
  const points = yearsToShow.map(y => ({ year: y, pop: world.values[String(y)] ?? 0 }));

  const width = 800;
  const height = 320;
  const padding = { top: 56, right: 28, bottom: 36, left: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const yMax = Math.max(...points.map(p => p.pop)) * 1.1;

  const xOf = (y: number) => padding.left + ((y - 1950) / (2100 - 1950)) * innerW;
  const yOf = (v: number) => padding.top + innerH - (v / yMax) * innerH;

  // Draw smooth full series too (every year for the line)
  const seriesYears: number[] = [];
  for (let y = 1950; y <= 2100; y++) seriesYears.push(y);
  const seriesPts = seriesYears
    .map(y => ({ year: y, pop: world.values[String(y)] ?? null }))
    .filter(p => p.pop !== null) as Array<{ year: number; pop: number }>;
  const obs = seriesPts.filter(p => p.year <= 2024);
  const proj = seriesPts.filter(p => p.year >= 2024);
  const obsPath = obs.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.year).toFixed(1)},${yOf(p.pop).toFixed(1)}`).join(' ');
  const projPath = proj.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.year).toFixed(1)},${yOf(p.pop).toFixed(1)}`).join(' ');
  const peakYear = world.peakYear ?? null;
  const peakPop = world.peakPopulation;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">World population trajectory through 2100</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 medium variant</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px]" role="img"
             aria-label="World population trajectory 1950 to 2100">
          <g stroke="#e5e7eb" strokeWidth={1}>
            {[0, 1, 2, 3, 4, 5].map(i => {
              const v = (yMax * i) / 5;
              return <line key={i} x1={padding.left} y1={yOf(v)} x2={padding.left + innerW} y2={yOf(v)} />;
            })}
          </g>
          <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
            {[0, 1, 2, 3, 4, 5].map(i => {
              const v = (yMax * i) / 5;
              return <text key={i} x={padding.left - 8} y={yOf(v) + 4} textAnchor="end">{fmtPop(v, 1)}</text>;
            })}
            {yearsToShow.map(t => (
              <text key={t} x={xOf(t)} y={padding.top + innerH + 18} textAnchor="middle">{t}</text>
            ))}
          </g>
          {obsPath && <path d={obsPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />}
          {projPath && <path d={projPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6,4" opacity={0.8} />}
          {/* Today vertical */}
          <line x1={xOf(2025)} y1={padding.top} x2={xOf(2025)} y2={padding.top + innerH} stroke="#16a34a" strokeWidth={1.5} strokeDasharray="3,3" />
          <text x={xOf(2025)} y={padding.top - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a"
                fontFamily="ui-sans-serif, system-ui, sans-serif">today</text>
          {/* Peak marker */}
          {peakYear !== null && peakYear >= 1950 && peakYear <= 2100 && (
            <g>
              <circle cx={xOf(peakYear)} cy={yOf(peakPop)} r={5} fill="#dc2626" stroke="white" strokeWidth={1.5} />
              <text x={xOf(peakYear)} y={yOf(peakPop) - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626"
                    fontFamily="ui-sans-serif, system-ui, sans-serif">
                world peaks ~{peakYear}
              </text>
            </g>
          )}
        </svg>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 text-sm">
          {[
            { label: '2025', value: world.pop2025, accent: 'text-blue-700 bg-blue-50 border-blue-100' },
            { label: '2050', value: world.pop2050, accent: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
            { label: '2100', value: world.pop2100, accent: 'text-purple-700 bg-purple-50 border-purple-100' },
            { label: peakYear ? `Peak (${peakYear})` : 'Still growing', value: peakPop, accent: 'text-rose-700 bg-rose-50 border-rose-100' },
          ].map(({ label, value, accent }) => (
            <div key={label} className={`rounded-lg p-3 border ${accent}`}>
              <div className="text-[10px] uppercase tracking-wider font-bold">{label}</div>
              <div className="text-xl font-bold tabular-nums">{fmtPop(value)}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-700 mt-4">
          The world's population is projected to grow from <strong>{fmtPop(world.pop2025)}</strong> today to{' '}
          <strong>{fmtPop(world.pop2050)}</strong> by 2050. UN's medium-variant projection has it peaking
          near <strong>{fmtPop(peakPop)}</strong> around <strong>{peakYear ?? 'after 2100'}</strong> before
          slowly declining — the first time in modern history the global total would begin to shrink.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: UN World Population Prospects 2024 Revision — annual world population, medium variant.
          The medium variant is UN's central published projection; low and high variants diverge by
          ~1.5 billion by 2100.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: When does each country peak?
// ─────────────────────────────────────────────────────────────────────────────

function SectionPeakBuckets({
  alreadyPeaked, peakingBy2050, peakingAfter2050, stillGrowing2100, countries,
}: {
  alreadyPeaked: number;
  peakingBy2050: number;
  peakingAfter2050: number;
  stillGrowing2100: number;
  countries: SlimProjection[];
}) {
  const total = countries.length;
  const buckets = [
    { label: 'Already past peak', count: alreadyPeaked, color: '#dc2626', desc: 'Population is already declining (mostly E. Asia + Eastern Europe).' },
    { label: 'Peaks by 2050', count: peakingBy2050, color: '#f59e0b', desc: 'Will peak within the next 25 years.' },
    { label: 'Peaks 2050–2099', count: peakingAfter2050, color: '#3b82f6', desc: 'Still growing this century but turning over before 2100.' },
    { label: 'Still growing in 2100', count: stillGrowing2100, color: '#16a34a', desc: 'Continues growing through the full projection window (mostly Sub-Saharan Africa).' },
  ];

  // Stacked bar visualization
  const width = 800;
  const height = 90;
  const padding = { top: 24, right: 28, bottom: 24, left: 28 };
  const innerW = width - padding.left - padding.right;
  const barH = 40;
  const barY = padding.top;
  let cursorX = padding.left;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">When does each country peak?</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 medium variant · {total} countries</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]" role="img"
             aria-label="Stacked bar showing how the 195 countries are distributed across peak-year categories">
          <text x={padding.left} y={padding.top - 6} fontSize={11} fontWeight={700} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            All {total} countries grouped by projected peak year
          </text>
          {buckets.map((b, i) => {
            const w = (b.count / total) * innerW;
            const x = cursorX;
            cursorX += w;
            return (
              <g key={b.label}>
                <rect x={x} y={barY} width={w} height={barH} rx={i === 0 ? 6 : 0} fill={b.color} />
                {w > 50 && (
                  <>
                    <text x={x + w / 2} y={barY + barH / 2 - 2} textAnchor="middle" fontSize={11} fontWeight={700} fill="white"
                          fontFamily="ui-sans-serif, system-ui, sans-serif">
                      {b.count}
                    </text>
                    <text x={x + w / 2} y={barY + barH / 2 + 13} textAnchor="middle" fontSize={9} fill="white" opacity={0.95}
                          fontFamily="ui-sans-serif, system-ui, sans-serif">
                      {((b.count / total) * 100).toFixed(0)}%
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-sm">
          {buckets.map(b => (
            <div key={b.label} className="border border-gray-200 rounded-lg p-3" style={{ borderTopWidth: 4, borderTopColor: b.color }}>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: b.color }}>{b.label}</div>
              <div className="text-2xl font-bold text-gray-900 tabular-nums">{b.count}</div>
              <p className="text-xs text-gray-600 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Source: Computed from UN WPP 2024 per-country annual population projections (medium variant). A
          country is counted as "past peak" if its highest annual value occurs in or before 2025.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Top 10 fastest-growing and fastest-shrinking by 2050
// ─────────────────────────────────────────────────────────────────────────────

function SectionTopGrowShrink({
  grow, shrink,
}: {
  grow: Array<SlimProjection & { growth: number }>;
  shrink: Array<SlimProjection & { growth: number }>;
}) {
  const width = 880;
  const rowHeight = 36;
  const headerH = 36;
  const height = headerH + rowHeight * 10 + 20;
  const colWidth = width / 2 - 40;
  const maxGrowth = Math.max(...grow.map(g => g.growth));
  const maxShrink = Math.abs(Math.min(...shrink.map(g => g.growth)));

  const renderRow = (entry: SlimProjection & { growth: number }, idx: number, x: number, color: string, maxAbs: number) => {
    const barW = (Math.abs(entry.growth) / maxAbs) * (colWidth - 200);
    return (
      <g key={`${entry.slug}-${x}-${idx}`}>
        <text x={x + 4} y={headerH + idx * rowHeight + 22} fontSize={12} fontWeight={700} fill="#475569"
              fontFamily="ui-sans-serif, system-ui, sans-serif">#{idx + 1}</text>
        <text x={x + 32} y={headerH + idx * rowHeight + 14} fontSize={13} fontWeight={600} fill="#0f172a"
              fontFamily="ui-sans-serif, system-ui, sans-serif">
          {entry.flag} {entry.name}
        </text>
        <rect x={x + 32} y={headerH + idx * rowHeight + 20} width={Math.max(2, barW)} height={10} rx={3} fill={color} />
        <text x={x + 36 + Math.max(2, barW)} y={headerH + idx * rowHeight + 28} fontSize={11} fontWeight={700} fill="#334155"
              fontFamily="ui-sans-serif, system-ui, sans-serif">
          {entry.growth >= 0 ? '+' : ''}{(entry.growth * 100).toFixed(0)}%
        </text>
      </g>
    );
  };

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Fastest-growing &amp; fastest-shrinking by 2050</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · % change in population 2025 → 2050</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[700px]" role="img"
             aria-label="Side-by-side ranking of the 10 fastest-growing and 10 fastest-shrinking countries by 2050">
          <text x={4} y={20} fontSize={14} fontWeight={700} fill="#16a34a"
                fontFamily="ui-sans-serif, system-ui, sans-serif">10 fastest-growing</text>
          <text x={width / 2 + 24} y={20} fontSize={14} fontWeight={700} fill="#dc2626"
                fontFamily="ui-sans-serif, system-ui, sans-serif">10 fastest-shrinking</text>
          {grow.map((c, i) => renderRow(c, i, 0, '#16a34a', maxGrowth))}
          {shrink.map((c, i) => renderRow(c, i, width / 2 + 20, '#dc2626', maxShrink))}
        </svg>
        <p className="text-sm text-gray-700 mt-4">
          The 10 fastest-growing countries are almost entirely in <strong>Sub-Saharan Africa</strong> — led by{' '}
          <Link href={`/${grow[0].slug}`} className="text-blue-700 hover:text-blue-900 underline">
            {grow[0].name}
          </Link>{' '}
          ({(grow[0].growth * 100).toFixed(0)}% gain by 2050). The fastest-shrinking list is dominated by{' '}
          <strong>East Asia and Eastern Europe</strong> — with{' '}
          <Link href={`/${shrink[0].slug}`} className="text-blue-700 hover:text-blue-900 underline">
            {shrink[0].name}
          </Link>{' '}
          projected to lose <strong>{(Math.abs(shrink[0].growth) * 100).toFixed(0)}%</strong> by mid-century.
          Excludes microstates (population &lt;1M today) so the ranking reflects countries with significant demographic weight.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: Computed from UN WPP 2024 medium-variant projections for {grow.length + shrink.length}+ countries.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: The UN's projection variants (educational)
// ─────────────────────────────────────────────────────────────────────────────

function SectionVariants() {
  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">How UN projections work</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-gray-200 rounded-lg p-4" style={{ borderTopWidth: 4, borderTopColor: '#94a3b8' }}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low variant</div>
            <p className="text-sm text-gray-700 mt-2">
              Assumes fertility falls faster than central expectations. Used as a lower bound — by 2100 the
              low variant has world population around <strong>~7.1 billion</strong> (actually below today's 8.2B).
            </p>
          </div>
          <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Medium variant ← shown here</div>
            <p className="text-sm text-gray-700 mt-2">
              UN's central published projection. Combines mid-range fertility, mortality, and migration
              assumptions. World population reaches <strong>~9.7 billion by 2050</strong> and peaks near{' '}
              <strong>10.3 billion in the 2080s</strong>. This is what every headline cites.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4" style={{ borderTopWidth: 4, borderTopColor: '#94a3b8' }}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">High variant</div>
            <p className="text-sm text-gray-700 mt-2">
              Assumes fertility holds higher than central expectations. By 2100 the high variant has world
              population around <strong>~14.4 billion</strong> — still growing, no peak in sight.
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-4">
          The three variants diverge by roughly <strong>±1.5 billion people by 2100</strong> from the medium
          central line — a wide range that reflects genuine uncertainty about future fertility, especially
          in countries where fertility is still high or rapidly declining.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Source: UN World Population Prospects 2024 Revision — Methodology Report
          (population.un.org/wpp/Publications/Files/WPP2024_Methodology.pdf). Probabilistic projections (Bayesian
          hierarchical model) are also published; the deterministic variants above are the most-cited public figures.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Full ranking table
// ─────────────────────────────────────────────────────────────────────────────

function SectionFullRanking({ countries }: { countries: SlimProjection[] }) {
  const ranked = [...countries].sort((a, b) => b.pop2050 - a.pop2050);
  return (
    <section className="bg-white rounded-xl shadow-sm mb-10 overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-baseline gap-2">
        <h2 className="text-xl font-bold text-gray-900">All {ranked.length} countries projected to 2050 &amp; 2100</h2>
        <span className="text-xs text-gray-500">Sorted by 2050 population · UN WPP 2024</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">2025</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">2050</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Δ 2025→2050</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">2100</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Δ 2025→2100</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">Peak year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ranked.map((c, i) => {
              const d50 = c.pop2025 > 0 ? ((c.pop2050 - c.pop2025) / c.pop2025) * 100 : 0;
              const d100 = c.pop2025 > 0 ? ((c.pop2100 - c.pop2025) / c.pop2025) * 100 : 0;
              return (
                <tr key={c.slug} className="hover:bg-indigo-50">
                  <td className="px-4 py-1.5 text-gray-700 font-medium">{i + 1}</td>
                  <td className="px-4 py-1.5">
                    <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">
                      {c.flag} {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-1.5 text-right text-gray-900 tabular-nums">{fmtPop(c.pop2025)}</td>
                  <td className="px-4 py-1.5 text-right text-indigo-700 font-semibold tabular-nums">{fmtPop(c.pop2050)}</td>
                  <td className={`px-4 py-1.5 text-right tabular-nums ${d50 >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {d50 >= 0 ? '+' : ''}{d50.toFixed(1)}%
                  </td>
                  <td className="px-4 py-1.5 text-right text-purple-700 tabular-nums">{fmtPop(c.pop2100)}</td>
                  <td className={`px-4 py-1.5 text-right tabular-nums ${d100 >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {d100 >= 0 ? '+' : ''}{d100.toFixed(1)}%
                  </td>
                  <td className="px-4 py-1.5 text-right text-gray-600 tabular-nums">{c.peakYear ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 text-xs text-gray-500 bg-gray-50 border-t">
        Population figures are mid-year (July 1) estimates. Source: UN World Population Prospects 2024
        Revision, medium variant. "Peak year" is the year in which UN projects that country's population
        will reach its maximum within the 1950–2100 window.
      </div>
    </section>
  );
}
