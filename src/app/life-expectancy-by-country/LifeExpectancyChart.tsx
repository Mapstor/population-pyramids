/**
 * Inline SVG life-expectancy trend chart. Renders identically on server and
 * client (no hooks, no effects), so the chart is present in the SSR HTML —
 * critical for AI/SERP extraction.
 */

import type { SlimCountryLE, Sex } from '@/lib/life-expectancy-helpers';
import { leAtYear } from '@/lib/life-expectancy-helpers';

interface Props {
  primary: SlimCountryLE;
  compare?: SlimCountryLE | null;
  birthYear: number;
  sex: Sex;
  worldAverage: number;
  width?: number;
  height?: number;
}

const X_START = 1950;
const X_END = 2100;

export default function LifeExpectancyChart({
  primary,
  compare,
  birthYear,
  sex,
  worldAverage,
  width = 800,
  height = 360,
}: Props) {
  const padding = { top: 24, right: 24, bottom: 36, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Build year ticks every 25 years.
  const xTicks = [1950, 1975, 2000, 2025, 2050, 2075, 2100];

  // Y range: dynamic to data with a small pad.
  const samplePoints: number[] = [];
  const sampleEvery = 5;
  for (let y = X_START; y <= X_END; y += sampleEvery) {
    const a = leAtYear(primary, y, sex);
    if (a !== null) samplePoints.push(a);
    if (compare) {
      const b = leAtYear(compare, y, sex);
      if (b !== null) samplePoints.push(b);
    }
  }
  samplePoints.push(worldAverage);
  const dataMin = Math.min(...samplePoints);
  const dataMax = Math.max(...samplePoints);
  const yMin = Math.max(0, Math.floor((dataMin - 5) / 5) * 5);
  const yMax = Math.ceil((dataMax + 5) / 5) * 5;
  const yRange = yMax - yMin;
  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax; v += 10) yTicks.push(v);

  function xOf(year: number) {
    return padding.left + ((year - X_START) / (X_END - X_START)) * innerW;
  }
  function yOf(value: number) {
    return padding.top + innerH - ((value - yMin) / yRange) * innerH;
  }

  // Build a smooth-ish path from interpolated samples.
  function pathFor(country: SlimCountryLE): string {
    const pts: Array<[number, number]> = [];
    for (let y = X_START; y <= X_END; y += 2) {
      const v = leAtYear(country, y, sex);
      if (v !== null) pts.push([xOf(y), yOf(v)]);
    }
    if (pts.length === 0) return '';
    return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  }

  const primaryPath = pathFor(primary);
  const comparePath = compare ? pathFor(compare) : null;

  // Markers — derived from the user's birth year + sex.
  const expectedLifespan =
    sex === 'total' ? primary.current.total : sex === 'male' ? primary.current.male : primary.current.female;
  const projectedDeathYear = Math.min(X_END, Math.round(birthYear + expectedLifespan));
  const birthLE = leAtYear(primary, birthYear, sex);
  const deathLE = leAtYear(primary, projectedDeathYear, sex) ?? expectedLifespan;
  const currentLE = leAtYear(primary, 2026, sex) ?? expectedLifespan;

  // Shaded "lifetime so far" segment between birth year and 2026.
  const lifetimeStart = Math.max(X_START, birthYear);
  const lifetimeEnd = 2026;
  const lifetimeBounded = lifetimeEnd > lifetimeStart;

  // Build the shaded polygon following the primary curve from birth year → 2026,
  // then back along the X axis.
  function lifetimePolygon(): string {
    if (!lifetimeBounded) return '';
    const top: Array<[number, number]> = [];
    for (let y = lifetimeStart; y <= lifetimeEnd; y += 1) {
      const v = leAtYear(primary, y, sex);
      if (v !== null) top.push([xOf(y), yOf(v)]);
    }
    if (top.length === 0) return '';
    const xLeft = top[0][0];
    const xRight = top[top.length - 1][0];
    const yBase = yOf(yMin);
    const head = top.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    return `${head} L${xRight.toFixed(1)},${yBase.toFixed(1)} L${xLeft.toFixed(1)},${yBase.toFixed(1)} Z`;
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Life expectancy trend for ${primary.name}${compare ? ` vs ${compare.name}` : ''} from 1950 to 2100`}
      >
        {/* Background grid */}
        <g stroke="#e5e7eb" strokeWidth={1}>
          {yTicks.map(v => (
            <line key={`yg-${v}`} x1={padding.left} y1={yOf(v)} x2={padding.left + innerW} y2={yOf(v)} />
          ))}
          {xTicks.map(t => (
            <line key={`xg-${t}`} x1={xOf(t)} y1={padding.top} x2={xOf(t)} y2={padding.top + innerH} strokeDasharray="2,3" opacity={0.5} />
          ))}
        </g>

        {/* Axis labels */}
        <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
          {yTicks.map(v => (
            <text key={`yt-${v}`} x={padding.left - 8} y={yOf(v) + 4} textAnchor="end">{v}</text>
          ))}
          {xTicks.map(t => (
            <text key={`xt-${t}`} x={xOf(t)} y={padding.top + innerH + 18} textAnchor="middle">{t}</text>
          ))}
          <text x={padding.left - 36} y={padding.top + innerH / 2} transform={`rotate(-90, ${padding.left - 36}, ${padding.top + innerH / 2})`} textAnchor="middle" fontSize={10}>
            life expectancy (years)
          </text>
        </g>

        {/* World average reference line */}
        <line
          x1={padding.left}
          y1={yOf(worldAverage)}
          x2={padding.left + innerW}
          y2={yOf(worldAverage)}
          stroke="#9ca3af"
          strokeWidth={1.25}
          strokeDasharray="4,4"
        />
        <text x={padding.left + innerW - 4} y={yOf(worldAverage) - 4} fontSize={10} fill="#6b7280" textAnchor="end" fontFamily="ui-sans-serif, system-ui, sans-serif">
          world avg {worldAverage.toFixed(1)}
        </text>

        {/* Lifetime so far — shaded area under the primary curve from birth → today */}
        {lifetimeBounded && (
          <path d={lifetimePolygon()} fill="#1d4ed8" opacity={0.10} />
        )}

        {/* Compare country curve (drawn underneath, muted) */}
        {comparePath && (
          <path d={comparePath} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
        )}

        {/* Primary country curve */}
        <path d={primaryPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* Birth-year marker */}
        {birthYear >= X_START && birthYear <= X_END && (
          <g>
            <line x1={xOf(birthYear)} y1={padding.top} x2={xOf(birthYear)} y2={padding.top + innerH} stroke="#16a34a" strokeWidth={1.5} />
            {birthLE !== null && (
              <circle cx={xOf(birthYear)} cy={yOf(birthLE)} r={4} fill="#16a34a" stroke="white" strokeWidth={1.5} />
            )}
            <text x={xOf(birthYear)} y={padding.top - 6} textAnchor="middle" fontSize={10} fill="#16a34a" fontWeight={600} fontFamily="ui-sans-serif, system-ui, sans-serif">
              born {birthYear}
            </text>
          </g>
        )}

        {/* "Today" marker (2026) */}
        <g>
          <line x1={xOf(2026)} y1={padding.top} x2={xOf(2026)} y2={padding.top + innerH} stroke="#1d4ed8" strokeWidth={1} strokeDasharray="3,3" opacity={0.7} />
          <circle cx={xOf(2026)} cy={yOf(currentLE)} r={4} fill="#1d4ed8" stroke="white" strokeWidth={1.5} />
        </g>

        {/* Projected death-year marker */}
        {projectedDeathYear > 2026 && projectedDeathYear <= X_END && (
          <g>
            <circle cx={xOf(projectedDeathYear)} cy={yOf(deathLE)} r={5} fill="#dc2626" stroke="white" strokeWidth={1.5} />
            <text x={xOf(projectedDeathYear)} y={yOf(deathLE) - 8} textAnchor="middle" fontSize={10} fill="#dc2626" fontWeight={700} fontFamily="ui-sans-serif, system-ui, sans-serif">
              ~{projectedDeathYear}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-blue-700" /> {primary.name}</span>
        {compare && (
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-amber-500" /> {compare.name}</span>
        )}
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 border-t border-dashed border-gray-400" /> world avg</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-green-600" /> born</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-blue-700" /> today</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-red-600" /> projected end</span>
      </div>
    </div>
  );
}
