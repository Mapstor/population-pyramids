/**
 * Inline SVG area chart of a place's population 1950 → present, with the
 * user's birth year marked and the "your lifetime" segment shaded. Renders
 * identically on server and client so the chart is in the SSR HTML.
 */

import {
  popAtYear,
  MIN_BIRTH_YEAR,
  DATA_LATEST_YEAR,
  fmtMultiplier,
  type SlimPlace,
} from '@/lib/population-when-born-helpers';

interface Props {
  place: SlimPlace;
  birthYear: number;
  width?: number;
  height?: number;
}

const X_START = MIN_BIRTH_YEAR; // 1950
const X_END = DATA_LATEST_YEAR;  // 2025

export default function PopulationCurveChart({
  place,
  birthYear,
  width = 800,
  height = 360,
}: Props) {
  const padding = { top: 28, right: 24, bottom: 36, left: 64 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Sample full series
  const points: Array<{ x: number; y: number; year: number; pop: number }> = [];
  for (let y = X_START; y <= X_END; y++) {
    const p = popAtYear(place, y);
    if (p !== null) {
      points.push({ x: 0, y: 0, year: y, pop: p }); // x/y filled below
    }
  }
  if (points.length === 0) {
    return <div className="text-sm text-gray-500">No population data available.</div>;
  }

  const popMin = 0;
  const popMax = Math.max(...points.map(p => p.pop));
  const popRange = popMax - popMin;

  function xOf(year: number) {
    return padding.left + ((year - X_START) / (X_END - X_START)) * innerW;
  }
  function yOf(pop: number) {
    return padding.top + innerH - ((pop - popMin) / popRange) * innerH;
  }

  // Fill x/y
  points.forEach(p => {
    p.x = xOf(p.year);
    p.y = yOf(p.pop);
  });

  // Build full-area path (1950 → 2025)
  const fullLinePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  const yBase = yOf(0);
  const fullAreaPath =
    `${fullLinePath} L${points[points.length - 1].x.toFixed(1)},${yBase.toFixed(1)} ` +
    `L${points[0].x.toFixed(1)},${yBase.toFixed(1)} Z`;

  // Build "since you were born" segment area
  const lifetimePoints = points.filter(p => p.year >= birthYear);
  const lifetimeAreaPath = lifetimePoints.length > 1
    ? `${lifetimePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} ` +
      `L${lifetimePoints[lifetimePoints.length - 1].x.toFixed(1)},${yBase.toFixed(1)} ` +
      `L${lifetimePoints[0].x.toFixed(1)},${yBase.toFixed(1)} Z`
    : '';

  // Markers
  const popAtBirth = popAtYear(place, birthYear);
  const popLatest = points[points.length - 1].pop;
  const multiplier = popAtBirth && popAtBirth > 0 ? popLatest / popAtBirth : null;

  // Y axis ticks
  const yTickCount = 5;
  const yTicks: number[] = [];
  for (let i = 0; i <= yTickCount; i++) {
    yTicks.push((popRange * i) / yTickCount);
  }

  // X axis ticks every 10 years
  const xTicks: number[] = [];
  for (let y = 1950; y <= 2025; y += 15) xTicks.push(y);
  if (xTicks[xTicks.length - 1] !== 2025) xTicks.push(2025);

  function fmtAxis(v: number): string {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)}M`;
    if (v >= 1_000) return `${Math.round(v / 1_000)}K`;
    return String(Math.round(v));
  }

  // Gradient ID has to be unique-ish per render to avoid SVG ID collisions if
  // two charts ever live on the same page.
  const gradId = `pwb-grad-${place.slug}`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Population of ${place.name} from 1950 to ${X_END}, with year ${birthYear} marked`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.08} />
          </linearGradient>
        </defs>

        {/* gridlines */}
        <g stroke="#e5e7eb" strokeWidth={1}>
          {yTicks.map((t, i) => (
            <line key={`yg-${i}`} x1={padding.left} y1={yOf(t)} x2={padding.left + innerW} y2={yOf(t)} />
          ))}
        </g>

        {/* axis labels */}
        <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
          {yTicks.map((t, i) => (
            <text key={`yt-${i}`} x={padding.left - 8} y={yOf(t) + 4} textAnchor="end">
              {fmtAxis(t)}
            </text>
          ))}
          {xTicks.map(t => (
            <text key={`xt-${t}`} x={xOf(t)} y={padding.top + innerH + 18} textAnchor="middle">
              {t}
            </text>
          ))}
          <text x={padding.left - 50} y={padding.top + innerH / 2}
                transform={`rotate(-90, ${padding.left - 50}, ${padding.top + innerH / 2})`}
                textAnchor="middle" fontSize={10}>
            population
          </text>
        </g>

        {/* Full area (faint) */}
        <path d={fullAreaPath} fill={`url(#${gradId})`} />

        {/* Outline of the curve */}
        <path d={fullLinePath} fill="none" stroke="#1d4ed8" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* "Your lifetime" segment — stronger overlay */}
        {lifetimeAreaPath && (
          <path d={lifetimeAreaPath} fill="#f59e0b" opacity={0.35} />
        )}

        {/* Birth-year marker */}
        {birthYear >= X_START && birthYear <= X_END && popAtBirth !== null && (
          <g>
            <line x1={xOf(birthYear)} y1={padding.top} x2={xOf(birthYear)} y2={yBase} stroke="#16a34a" strokeWidth={1.5} />
            <circle cx={xOf(birthYear)} cy={yOf(popAtBirth)} r={5} fill="#16a34a" stroke="white" strokeWidth={1.5} />
            <text x={xOf(birthYear)} y={padding.top - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              born {birthYear}
            </text>
            <text x={xOf(birthYear) + 8} y={yOf(popAtBirth) - 8} textAnchor="start" fontSize={10} fill="#15803d"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              {fmtAxis(popAtBirth)}
            </text>
          </g>
        )}

        {/* Today marker */}
        <g>
          <circle cx={xOf(X_END)} cy={yOf(popLatest)} r={5} fill="#1d4ed8" stroke="white" strokeWidth={1.5} />
          <text x={xOf(X_END)} y={padding.top - 6} textAnchor="end" fontSize={11} fontWeight={700} fill="#1d4ed8"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            today
          </text>
          <text x={xOf(X_END) - 8} y={yOf(popLatest) - 8} textAnchor="end" fontSize={10} fill="#1e40af"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            {fmtAxis(popLatest)}
          </text>
        </g>

        {/* Multiplier annotation floating over the shaded lifetime region */}
        {multiplier !== null && lifetimePoints.length > 5 && (
          <g>
            {(() => {
              const midIndex = Math.floor(lifetimePoints.length / 2);
              const mid = lifetimePoints[midIndex];
              const labelY = (mid.y + yBase) / 2;
              return (
                <>
                  <rect x={mid.x - 36} y={labelY - 14} width={72} height={26} rx={6} fill="white" stroke="#f59e0b" strokeWidth={1.25} opacity={0.96} />
                  <text x={mid.x} y={labelY + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="#b45309"
                        fontFamily="ui-sans-serif, system-ui, sans-serif">
                    {fmtMultiplier(multiplier)}
                  </text>
                </>
              );
            })()}
          </g>
        )}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 h-2 bg-blue-500/30 border-t-2 border-blue-700" />
          {place.name} population
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 h-2 bg-amber-400/60" />
          since you were born
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
          birth year
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-700" />
          today
        </span>
      </div>
    </div>
  );
}
