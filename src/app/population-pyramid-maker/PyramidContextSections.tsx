/**
 * SSR-only context sections for the pyramid maker page:
 *  - "Anatomy of a population pyramid"   — labeled diagram
 *  - "The three pyramid types"           — Niger / USA / Japan side-by-side
 *  - "How to read a pyramid"             — interpretation guide
 *  - "How to use this tool"              — 3-step quickstart
 *
 * Everything is server-rendered and inlined in the page HTML so it's
 * extractable by crawlers and AI without running any JavaScript.
 */

import PyramidSVG from './PyramidSVG';
import { DEFAULT_STYLE, type PyramidRow } from '@/lib/pyramid-maker-helpers';

export interface PyramidContextProps {
  expansive: { name: string; flag: string; year: number; rows: PyramidRow[] };
  constrictive: { name: string; flag: string; year: number; rows: PyramidRow[] };
  stationary: { name: string; flag: string; year: number; rows: PyramidRow[] };
}

export default function PyramidContextSections({ expansive, constrictive, stationary }: PyramidContextProps) {
  return (
    <>
      <SectionTypes expansive={expansive} constrictive={constrictive} stationary={stationary} />
      <SectionAnatomy />
      <SectionHowToRead />
      <SectionHowToUse />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: The three pyramid types (always-SSR — real data)
// ─────────────────────────────────────────────────────────────────────────────

function SectionTypes({ expansive, constrictive, stationary }: PyramidContextProps) {
  const exampleStyle = {
    ...DEFAULT_STYLE,
    showGridlines: false,
    showPercentages: true,
    caption: '',
    subtitle: '',
  };

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">The three pyramid types, with real examples</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · percentages of national population</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { kind: 'Expansive', country: expansive, color: '#16a34a', note: 'Wide base, narrow top. High birth rate, large youth cohort, short life expectancy. Population grows fast.' },
          { kind: 'Stationary', country: stationary, color: '#0ea5e9', note: 'Roughly even-width bars from base to middle. Birth rate near replacement, longer life expectancy. Population stable or slowly growing.' },
          { kind: 'Constrictive', country: constrictive, color: '#dc2626', note: 'Narrow base, wider middle. Birth rate below replacement, large elderly cohort. Population shrinks (without immigration).' },
        ].map(({ kind, country, color, note }) => (
          <div key={kind} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200" style={{ borderTop: `4px solid ${color}` }}>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{kind}</div>
              <div className="text-base font-bold text-gray-900">{country.flag} {country.name}, {country.year}</div>
            </div>
            <div className="p-2">
              <PyramidSVG rows={country.rows} style={{ ...exampleStyle, title: '', subtitle: '' }} width={420} height={360} />
            </div>
            <div className="px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-700">{note}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Source: UN World Population Prospects 2024 Revision (population.un.org/wpp) — age-by-sex breakdown
        for the year shown. Charts are percentage of total national population so the shapes are directly
        comparable despite the countries' very different sizes.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Anatomy of a population pyramid
// ─────────────────────────────────────────────────────────────────────────────

function SectionAnatomy() {
  const width = 880;
  const height = 360;
  const padding = { top: 40, right: 200, bottom: 36, left: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const labelW = 60;
  const halfW = (innerW - labelW) / 2;
  const centerX = padding.left + halfW + labelW / 2;
  const leftEdgeX = centerX - labelW / 2;
  const rightEdgeX = centerX + labelW / 2;

  // 9 bands — YOUNGEST FIRST so the renderer (which draws rows[0] at the bottom
  // via `y = innerH - (i+1) * bandH`) produces a proper pyramid: wide young
  // cohorts on the bottom, narrow elderly cohorts on top.
  const bands = [
    { label: '0-9',   m: 1.00, f: 0.94 },
    { label: '10-19', m: 0.92, f: 0.86 },
    { label: '20-29', m: 0.82, f: 0.78 },
    { label: '30-39', m: 0.78, f: 0.74 },
    { label: '40-49', m: 0.68, f: 0.66 },
    { label: '50-59', m: 0.62, f: 0.60 },
    { label: '60-69', m: 0.50, f: 0.55 },
    { label: '70-79', m: 0.32, f: 0.40 },
    { label: '80+',   m: 0.18, f: 0.28 },
  ];
  const bandH = (innerH - 4) / bands.length;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Anatomy of a population pyramid</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[640px]" role="img"
             aria-label="Labeled diagram showing the main parts of a population pyramid">

          {/* Sex labels */}
          <text x={padding.left + halfW / 2} y={padding.top - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6"
                fontFamily="ui-sans-serif, system-ui, sans-serif">MALE</text>
          <text x={width - padding.right - halfW / 2} y={padding.top - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ec4899"
                fontFamily="ui-sans-serif, system-ui, sans-serif">FEMALE</text>

          {/* Bars */}
          {bands.map((b, i) => {
            const y = padding.top + innerH - (i + 1) * bandH + 2;
            const lW = b.m * halfW;
            const rW = b.f * halfW;
            return (
              <g key={b.label}>
                <text x={centerX} y={y + bandH / 2 + 3} textAnchor="middle" fontSize={10} fontWeight={600} fill="#334155"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">{b.label}</text>
                <rect x={leftEdgeX - lW} y={y} width={lW} height={bandH - 4} fill="#3b82f6" opacity={0.85} />
                <rect x={rightEdgeX} y={y} width={rW} height={bandH - 4} fill="#ec4899" opacity={0.85} />
              </g>
            );
          })}

          {/* Annotation lines + labels. Arrows start at the right edge of the
              female bar for the annotated band and end in the right margin so
              labels never overlap bars or each other. */}
          <g fontSize={11} fontFamily="ui-sans-serif, system-ui, sans-serif">
            {/* Youth bulge — band 0 (0-9, female 0.94) is at the bottom */}
            {(() => {
              const idx = 0, f = bands[idx].f;
              const yMid = padding.top + innerH - (idx + 0.5) * bandH;
              const xStart = rightEdgeX + f * halfW;
              return (
                <>
                  <line x1={xStart} y1={yMid} x2={width - padding.right + 10} y2={yMid}
                        stroke="#16a34a" strokeWidth={1} />
                  <text x={width - padding.right + 14} y={yMid - 3} fill="#15803d" fontWeight={700}>
                    ← Wide base
                  </text>
                  <text x={width - padding.right + 14} y={yMid + 11} fill="#475569" fontSize={10}>
                    high birth rate / youth bulge
                  </text>
                </>
              );
            })()}

            {/* Working age — band 4 (40-49, female 0.66) sits mid-chart */}
            {(() => {
              const idx = 4, f = bands[idx].f;
              const yMid = padding.top + innerH - (idx + 0.5) * bandH;
              const xStart = rightEdgeX + f * halfW;
              return (
                <>
                  <line x1={xStart} y1={yMid} x2={width - padding.right + 10} y2={yMid}
                        stroke="#0ea5e9" strokeWidth={1} />
                  <text x={width - padding.right + 14} y={yMid - 3} fill="#0369a1" fontWeight={700}>
                    ← Middle bulge
                  </text>
                  <text x={width - padding.right + 14} y={yMid + 11} fill="#475569" fontSize={10}>
                    prime working-age cohort
                  </text>
                </>
              );
            })()}

            {/* Elderly — band 8 (80+, female 0.28) is at the top */}
            {(() => {
              const idx = 8, f = bands[idx].f;
              const yMid = padding.top + innerH - (idx + 0.5) * bandH;
              const xStart = rightEdgeX + f * halfW;
              return (
                <>
                  <line x1={xStart} y1={yMid} x2={width - padding.right + 10} y2={yMid}
                        stroke="#dc2626" strokeWidth={1} />
                  <text x={width - padding.right + 14} y={yMid - 3} fill="#b91c1c" fontWeight={700}>
                    ← Narrow top
                  </text>
                  <text x={width - padding.right + 14} y={yMid + 11} fill="#475569" fontSize={10}>
                    elderly (women outlive men)
                  </text>
                </>
              );
            })()}
          </g>

          {/* Baseline */}
          <line x1={padding.left} y1={padding.top + innerH} x2={padding.left + innerW + 4} y2={padding.top + innerH}
                stroke="#475569" strokeWidth={1} />
          <text x={padding.left + halfW} y={padding.top + innerH + 22} textAnchor="middle" fontSize={11} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            ← population count or % →
          </text>
        </svg>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mt-4">
          <li className="flex gap-2"><span aria-hidden>•</span> <span><strong>Y axis = age groups</strong>, youngest at the bottom (so the chart literally grows upward as a cohort ages).</span></li>
          <li className="flex gap-2"><span aria-hidden>•</span> <span><strong>X axis = population</strong> (either absolute count or % of total).</span></li>
          <li className="flex gap-2"><span aria-hidden>•</span> <span><strong>Males on the left</strong>, <strong>females on the right</strong> (a near-universal convention).</span></li>
          <li className="flex gap-2"><span aria-hidden>•</span> <span><strong>Asymmetries are stories</strong> — a wider female top means women outlive men; a missing cohort is often a war or famine.</span></li>
        </ul>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: How to read a pyramid
// ─────────────────────────────────────────────────────────────────────────────

function SectionHowToRead() {
  const items: Array<{ shape: string; meaning: string; example: string }> = [
    { shape: 'Wide base, narrow top', meaning: 'High birth rate, short life expectancy. Fast-growing population.', example: 'Niger, Chad, DR Congo' },
    { shape: 'Narrow base, wide middle', meaning: 'Low birth rate, large working-age cohort, growing elderly cohort. Population peaking or shrinking.', example: 'Japan, Italy, Germany' },
    { shape: 'Even base & middle', meaning: 'Birth rate near replacement, mortality even. Stable population.', example: 'United States, France, Australia' },
    { shape: 'Sudden indent in one band', meaning: 'A historical shock — war, famine, pandemic, one-child policy.', example: 'Ukraine 90s cohort, China 1960 (famine), Cambodia 1975-79' },
    { shape: 'Bulge in a specific age band', meaning: 'A baby boom — usually a post-war or post-policy fertility spike. Reads as an upward-moving wave over decades.', example: 'US Baby Boom (1946-64), Iran post-revolution boom' },
    { shape: 'Wider female top', meaning: 'Women outlive men. Universal in modern populations; gap is usually 3–10 years.', example: 'Russia (10+ yr gap), Sub-Saharan Africa (smaller gap)' },
  ];
  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl font-bold text-gray-900">How to read a population pyramid</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Shape on the pyramid</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">What it means</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Example countries</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(it => (
              <tr key={it.shape} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-900 font-medium">{it.shape}</td>
                <td className="px-4 py-2 text-gray-700">{it.meaning}</td>
                <td className="px-4 py-2 text-gray-600">{it.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: How to use this tool
// ─────────────────────────────────────────────────────────────────────────────

function SectionHowToUse() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">How to use this tool</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 border-t-4" style={{ borderTopColor: '#3b82f6' }}>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Step 1</div>
          <h3 className="font-semibold text-gray-900 mb-1">Pick a mode</h3>
          <p className="text-sm text-gray-700">
            Use <strong>"From a country"</strong> to pyramid any of 195 countries from 1950–2025 (UN data
            pre-loaded), or <strong>"From your own data"</strong> to enter age × sex numbers manually.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 border-t-4" style={{ borderTopColor: '#ec4899' }}>
          <div className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">Step 2</div>
          <h3 className="font-semibold text-gray-900 mb-1">Customize</h3>
          <p className="text-sm text-gray-700">
            Edit the title, subtitle, caption, and bar colors. Toggle between <strong>absolute counts</strong> and{' '}
            <strong>percentages</strong>. Show or hide gridlines.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 border-t-4" style={{ borderTopColor: '#16a34a' }}>
          <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Step 3</div>
          <h3 className="font-semibold text-gray-900 mb-1">Download or share</h3>
          <p className="text-sm text-gray-700">
            Click <strong>Download PNG</strong> for a 2× retina raster suitable for slides, or{' '}
            <strong>Download SVG</strong> for an infinitely scalable vector you can edit in Illustrator/Figma.
            The share link captures your country &amp; year selection.
          </p>
        </div>
      </div>
    </section>
  );
}
