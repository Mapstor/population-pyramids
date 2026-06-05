/**
 * Inline SVG population projection chart, 1950–2100. Renders identically on
 * server and client so the chart is present in SSR HTML.
 *
 * Visual story:
 *  - Solid blue area = historical (1950–2024)
 *  - Dashed line = medium-variant projection (2025–2100)
 *  - Red dot = peak year (if reached within window)
 *  - Green vertical marker = "today" (2025)
 *  - Optional second muted line for comparison country
 */

import { popAtYear, type SlimProjection } from '@/lib/population-projection-helpers';

interface Props {
  primary: SlimProjection;
  compare?: SlimProjection | null;
  targetYear: number; // moves with the calculator slider
  width?: number;
  height?: number;
}

const X_START = 1950;
const X_END = 2100;
const TODAY_YEAR = 2025;

export default function ProjectionChart({ primary, compare, targetYear, width = 800, height = 360 }: Props) {
  const padding = { top: 56, right: 28, bottom: 40, left: 64 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Sample series at every year (faster + smoother than skipping)
  function buildSeries(p: SlimProjection) {
    const pts: Array<{ x: number; y: number; year: number; pop: number }> = [];
    for (let y = X_START; y <= X_END; y++) {
      const v = popAtYear(p, y);
      if (v !== null) pts.push({ x: 0, y: 0, year: y, pop: v });
    }
    return pts;
  }
  const primaryPts = buildSeries(primary);
  const comparePts = compare ? buildSeries(compare) : [];
  if (primaryPts.length === 0) {
    return <div className="text-sm text-gray-500">No projection data available for {primary.name}.</div>;
  }

  // Y range: include both series + a 10% headroom
  const allPops = [...primaryPts.map(p => p.pop), ...comparePts.map(p => p.pop)];
  const yMax = Math.max(...allPops) * 1.05;
  const yMin = 0;

  const xOf = (y: number) => padding.left + ((y - X_START) / (X_END - X_START)) * innerW;
  const yOf = (v: number) => padding.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  primaryPts.forEach(p => { p.x = xOf(p.year); p.y = yOf(p.pop); });
  comparePts.forEach(p => { p.x = xOf(p.year); p.y = yOf(p.pop); });

  // Split primary into observed (≤2024) and projected (≥2025) for dash styling
  const obs = primaryPts.filter(p => p.year <= 2024);
  const proj = primaryPts.filter(p => p.year >= 2024); // 2024 in both for continuity

  const obsPath = obs.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const projPath = proj.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Build an area for the OBSERVED portion only — keeps the projection visually "lighter"
  const obsArea = obs.length > 1
    ? `${obsPath} L${obs[obs.length - 1].x.toFixed(1)},${yOf(0).toFixed(1)} L${obs[0].x.toFixed(1)},${yOf(0).toFixed(1)} Z`
    : '';

  const compareSeries = comparePts;
  const comparePathObs = compareSeries.filter(p => p.year <= 2024).map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const comparePathProj = compareSeries.filter(p => p.year >= 2024).map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Tick generation with comfortable spacing (anti-overlap)
  const xTicks = [1950, 1975, 2000, 2025, 2050, 2075, 2100];
  const yTickCount = 5;
  const yTicks: number[] = [];
  for (let i = 0; i <= yTickCount; i++) yTicks.push((yMax * i) / yTickCount);

  function fmtY(v: number) {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return Math.round(v).toString();
  }

  // Markers
  const todayPop = popAtYear(primary, TODAY_YEAR);
  const targetPop = popAtYear(primary, targetYear);
  const peakPop = primary.peakYear !== null ? popAtYear(primary, primary.peakYear) : null;
  const showPeak = primary.peakYear !== null && primary.peakYear >= X_START && primary.peakYear <= X_END;

  const gradId = `pp-grad-${primary.slug}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img"
           aria-label={`Population projection for ${primary.name} from ${X_START} to ${X_END}${compare ? ` versus ${compare.name}` : ''}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* gridlines */}
        <g stroke="#e5e7eb" strokeWidth={1}>
          {yTicks.map((v, i) => (
            <line key={`yg-${i}`} x1={padding.left} y1={yOf(v)} x2={padding.left + innerW} y2={yOf(v)} />
          ))}
        </g>

        {/* axis labels */}
        <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
          {yTicks.map((v, i) => (
            <text key={`yt-${i}`} x={padding.left - 8} y={yOf(v) + 4} textAnchor="end">{fmtY(v)}</text>
          ))}
          {xTicks.map(t => (
            <text key={`xt-${t}`} x={xOf(t)} y={padding.top + innerH + 18} textAnchor="middle">{t}</text>
          ))}
          <text x={padding.left - 50} y={padding.top + innerH / 2}
                transform={`rotate(-90, ${padding.left - 50}, ${padding.top + innerH / 2})`}
                textAnchor="middle" fontSize={10}>population</text>
        </g>

        {/* "today" vertical reference */}
        <line x1={xOf(TODAY_YEAR)} y1={padding.top} x2={xOf(TODAY_YEAR)} y2={padding.top + innerH}
              stroke="#16a34a" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.7} />
        <text x={xOf(TODAY_YEAR)} y={padding.top - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a"
              fontFamily="ui-sans-serif, system-ui, sans-serif">today</text>

        {/* observed area (primary) */}
        {obsArea && <path d={obsArea} fill={`url(#${gradId})`} />}

        {/* observed line (primary) */}
        <path d={obsPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* projected line (primary, dashed) */}
        <path d={projPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6,4" opacity={0.85} />

        {/* compare lines */}
        {comparePathObs && (
          <path d={comparePathObs} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        )}
        {comparePathProj && (
          <path d={comparePathProj} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6,4" opacity={0.85} />
        )}

        {/* Today marker dot */}
        {todayPop !== null && (
          <circle cx={xOf(TODAY_YEAR)} cy={yOf(todayPop)} r={5} fill="#16a34a" stroke="white" strokeWidth={1.5} />
        )}

        {/* Target year marker dot */}
        {targetPop !== null && targetYear !== TODAY_YEAR && (
          <g>
            <line x1={xOf(targetYear)} y1={padding.top + 18} x2={xOf(targetYear)} y2={padding.top + innerH}
                  stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.7} />
            <circle cx={xOf(targetYear)} cy={yOf(targetPop)} r={5} fill="#7c3aed" stroke="white" strokeWidth={1.5} />
            <text x={xOf(targetYear)} y={padding.top + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#7c3aed"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">{targetYear}</text>
          </g>
        )}

        {/* Peak marker — placed only if peak is within window */}
        {showPeak && peakPop !== null && primary.peakYear !== null && (
          <g>
            <circle cx={xOf(primary.peakYear)} cy={yOf(peakPop)} r={5} fill="#dc2626" stroke="white" strokeWidth={1.5} />
            <text x={xOf(primary.peakYear)} y={yOf(peakPop) - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              peak {primary.peakYear}
            </text>
          </g>
        )}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-blue-700" /> {primary.name} estimates</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t-2 border-dashed border-blue-700" /> projection</span>
        {compare && (
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-amber-500" /> {compare.name}</span>
        )}
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-green-600" /> today (2025)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-purple-600" /> chosen year</span>
        {showPeak && <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-red-600" /> projected peak</span>}
      </div>
    </div>
  );
}
