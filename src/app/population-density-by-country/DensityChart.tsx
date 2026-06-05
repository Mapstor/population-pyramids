/**
 * Inline SVG showing density-over-time for the selected country.
 * Density is people / area; area is essentially constant so this is really
 * a per-km² projection of the population curve. Renders identically on
 * server and client — present in SSR HTML.
 */

import {
  densityAtYear,
  fmtDensity,
  type SlimDensityPlace,
} from '@/lib/population-density-helpers';

interface Props {
  primary: SlimDensityPlace;
  compare?: SlimDensityPlace | null;
  width?: number;
  height?: number;
}

const X_START = 1950;
const X_END = 2025;

export default function DensityChart({ primary, compare, width = 800, height = 320 }: Props) {
  const padding = { top: 40, right: 30, bottom: 36, left: 64 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Build series for primary + (optional) compare
  function sample(p: SlimDensityPlace): Array<{ x: number; y: number; year: number; density: number }> {
    const out: Array<{ x: number; y: number; year: number; density: number }> = [];
    for (let y = X_START; y <= X_END; y++) {
      const d = densityAtYear(p, y);
      if (d !== null) out.push({ x: 0, y: 0, year: y, density: d });
    }
    return out;
  }

  const primaryPts = sample(primary);
  const comparePts = compare ? sample(compare) : [];
  if (primaryPts.length === 0) {
    return <div className="text-sm text-gray-500">No density data available for {primary.name}.</div>;
  }

  // Y scale (linear) — generous max
  const allDensities = [...primaryPts.map(p => p.density), ...comparePts.map(p => p.density)];
  const dMax = Math.max(...allDensities);
  const yMax = Math.ceil(dMax * 1.1);
  const yMin = 0;

  const xOf = (year: number) => padding.left + ((year - X_START) / (X_END - X_START)) * innerW;
  const yOf = (d: number) => padding.top + innerH - ((d - yMin) / (yMax - yMin)) * innerH;

  primaryPts.forEach(p => { p.x = xOf(p.year); p.y = yOf(p.density); });
  comparePts.forEach(p => { p.x = xOf(p.year); p.y = yOf(p.density); });

  const primaryPath = primaryPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const comparePath = comparePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Area under primary
  const primaryArea =
    primaryPts.length > 1
      ? `${primaryPath} L${primaryPts[primaryPts.length - 1].x.toFixed(1)},${yOf(0).toFixed(1)} L${primaryPts[0].x.toFixed(1)},${yOf(0).toFixed(1)} Z`
      : '';

  // Tick generation, deliberately well-spaced to prevent label collision
  const xTicks: number[] = [1950, 1970, 1990, 2010, 2025];
  const yTickCount = 5;
  const yTicks: number[] = [];
  for (let i = 0; i <= yTickCount; i++) yTicks.push((yMax * i) / yTickCount);

  const fmtYTick = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    if (v >= 100) return Math.round(v).toString();
    if (v >= 10) return v.toFixed(0);
    return v.toFixed(1);
  };

  const latestPrimary = primaryPts[primaryPts.length - 1];
  const earliestPrimary = primaryPts[0];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img"
           aria-label={`Population density over time for ${primary.name}, from ${earliestPrimary.year} to ${latestPrimary.year}`}>
        {/* gridlines */}
        <g stroke="#e5e7eb" strokeWidth={1}>
          {yTicks.map((v, i) => (
            <line key={`yg-${i}`} x1={padding.left} y1={yOf(v)} x2={padding.left + innerW} y2={yOf(v)} />
          ))}
        </g>

        {/* axis labels */}
        <g fontSize={11} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
          {yTicks.map((v, i) => (
            <text key={`yt-${i}`} x={padding.left - 8} y={yOf(v) + 4} textAnchor="end">{fmtYTick(v)}</text>
          ))}
          {xTicks.map(t => (
            <text key={`xt-${t}`} x={xOf(t)} y={padding.top + innerH + 18} textAnchor="middle">{t}</text>
          ))}
          <text x={padding.left - 50} y={padding.top + innerH / 2}
                transform={`rotate(-90, ${padding.left - 50}, ${padding.top + innerH / 2})`}
                textAnchor="middle" fontSize={10}>people per km²</text>
        </g>

        {/* primary area + line */}
        {primaryArea && <path d={primaryArea} fill="#7c3aed" opacity={0.15} />}
        <path d={primaryPath} fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* compare line (dashed) */}
        {comparePath && (
          <path d={comparePath} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* end markers */}
        <circle cx={latestPrimary.x} cy={latestPrimary.y} r={5} fill="#7c3aed" stroke="white" strokeWidth={1.5} />
        <text x={latestPrimary.x - 6} y={latestPrimary.y - 10} textAnchor="end" fontSize={11} fontWeight={700} fill="#5b21b6"
              fontFamily="ui-sans-serif, system-ui, sans-serif">
          {fmtDensity(latestPrimary.density)}/km²
        </text>
        {compare && comparePts.length > 0 && (
          <>
            <circle cx={comparePts[comparePts.length - 1].x} cy={comparePts[comparePts.length - 1].y} r={5}
                    fill="#f59e0b" stroke="white" strokeWidth={1.5} />
            <text x={comparePts[comparePts.length - 1].x - 6} y={comparePts[comparePts.length - 1].y - 10} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              {fmtDensity(comparePts[comparePts.length - 1].density)}/km²
            </text>
          </>
        )}

        {/* origin marker */}
        <circle cx={earliestPrimary.x} cy={earliestPrimary.y} r={4} fill="#7c3aed" stroke="white" strokeWidth={1.5} opacity={0.7} />
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-purple-600" /> {primary.name} density/km²</span>
        {compare && <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-amber-500" /> {compare.name}</span>}
      </div>
    </div>
  );
}
