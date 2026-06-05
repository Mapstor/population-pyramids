/**
 * Pure, SSR-safe population pyramid SVG. No hooks, no effects — renders
 * identically on server and client. Used by:
 *  - the live preview in the maker (client island)
 *  - the SSR demonstration pyramids in PyramidContextSections
 *  - eventually, downloadable PNG/SVG exports
 *
 * Anti-overlap discipline:
 *  - Generous padding for axis labels and titles
 *  - Age labels centered on the axis, never on bars
 *  - Percentage labels at bar ends in a distinct color, only when bar is wide enough
 *  - Caption pinned to the bottom in its own row
 */

import { fmtAxisCount, type PyramidRow, type PyramidStyle } from '@/lib/pyramid-maker-helpers';

interface Props {
  rows: PyramidRow[];                      // youngest first → drawn bottom-up
  style: PyramidStyle;
  width?: number;
  height?: number;
  /** When true, axis values are rendered as % of total; bars are width-scaled by % too. */
  pctMode?: boolean;
}

export default function PyramidSVG({
  rows,
  style,
  width = 900,
  height = 540,
  pctMode,
}: Props) {
  const padTop = style.title || style.subtitle ? 64 : 36;
  const padBottom = 56;
  const padLeftRight = 30;
  const labelWidth = 56; // center age-label column

  const useMode: 'pop' | 'pct' = pctMode || style.showPercentages ? 'pct' : 'pop';

  const total = rows.reduce((s, r) => s + r.male + r.female, 0);
  // Per-row plotted values (absolute counts or percentages of total)
  const plotted = rows.map(r => ({
    ageRange: r.ageRange,
    male: useMode === 'pct' && total > 0 ? (r.male / total) * 100 : r.male,
    female: useMode === 'pct' && total > 0 ? (r.female / total) * 100 : r.female,
  }));

  const innerW = width - 2 * padLeftRight - labelWidth;
  const halfW = innerW / 2;
  const innerH = height - padTop - padBottom;
  const bandH = innerH / rows.length;

  // Scale: cap to the widest row across both sexes
  const maxVal = Math.max(...plotted.flatMap(p => [p.male, p.female]), useMode === 'pct' ? 1 : 1);
  // Pick nice axis ticks
  const ticks = (() => {
    const desiredSteps = 4;
    const rawStep = maxVal / desiredSteps;
    // Round step up to a "nice" number
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const niceMultipliers = [1, 2, 2.5, 5, 10];
    let step = mag;
    for (const m of niceMultipliers) {
      if (m * mag >= rawStep) { step = m * mag; break; }
    }
    const xmax = Math.ceil(maxVal / step) * step;
    const out: number[] = [];
    for (let v = 0; v <= xmax + step / 100; v += step) out.push(v);
    return { values: out, xmax };
  })();

  // X helpers — left side counts grow leftward, right side rightward
  const centerX = padLeftRight + halfW + labelWidth / 2;
  const leftEdgeX = centerX - labelWidth / 2;
  const rightEdgeX = centerX + labelWidth / 2;
  const xLeft = (v: number) => leftEdgeX - (v / ticks.xmax) * halfW;
  const xRight = (v: number) => rightEdgeX + (v / ticks.xmax) * halfW;

  const barH = Math.max(2, bandH - 3);
  // Render youngest at the bottom — so we draw rows[0] (e.g. "0-4") at the bottom band.
  function rowY(i: number) {
    return padTop + innerH - (i + 1) * bandH + (bandH - barH) / 2;
  }
  function rowMidY(i: number) {
    return padTop + innerH - (i + 0.5) * bandH;
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="w-full h-auto max-w-full"
        role="img"
        aria-label={`Population pyramid for ${rows.length} age bands, total ${total.toLocaleString()}`}
        style={{ background: 'white' }}
      >
        {/* Title + subtitle */}
        {style.title && (
          <text x={width / 2} y={26} textAnchor="middle" fontSize={20} fontWeight={700} fill="#0f172a"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            {style.title}
          </text>
        )}
        {style.subtitle && (
          <text x={width / 2} y={48} textAnchor="middle" fontSize={13} fill="#475569"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            {style.subtitle}
          </text>
        )}

        {/* Sex labels above the two halves */}
        <text x={padLeftRight + halfW / 2} y={padTop - 8} textAnchor="middle" fontSize={12} fontWeight={700}
              fill={style.maleColor} fontFamily="ui-sans-serif, system-ui, sans-serif">MALE</text>
        <text x={width - padLeftRight - halfW / 2} y={padTop - 8} textAnchor="middle" fontSize={12} fontWeight={700}
              fill={style.femaleColor} fontFamily="ui-sans-serif, system-ui, sans-serif">FEMALE</text>

        {/* Gridlines */}
        {style.showGridlines && (
          <g stroke="#e5e7eb" strokeWidth={1}>
            {ticks.values.slice(1).map(v => (
              <g key={`g-${v}`}>
                <line x1={xLeft(v)} y1={padTop} x2={xLeft(v)} y2={padTop + innerH} />
                <line x1={xRight(v)} y1={padTop} x2={xRight(v)} y2={padTop + innerH} />
              </g>
            ))}
          </g>
        )}

        {/* X axis ticks + labels */}
        <g fontSize={10} fill="#6b7280" fontFamily="ui-sans-serif, system-ui, sans-serif">
          {ticks.values.map(v => (
            <g key={`tk-${v}`}>
              {v > 0 && (
                <>
                  <text x={xLeft(v)} y={padTop + innerH + 14} textAnchor="middle">{fmtAxisCount(v, useMode)}</text>
                  <text x={xRight(v)} y={padTop + innerH + 14} textAnchor="middle">{fmtAxisCount(v, useMode)}</text>
                </>
              )}
            </g>
          ))}
          {/* axis baselines */}
          <line x1={leftEdgeX - halfW} y1={padTop + innerH} x2={leftEdgeX} y2={padTop + innerH} stroke="#475569" strokeWidth={1} />
          <line x1={rightEdgeX} y1={padTop + innerH} x2={rightEdgeX + halfW} y2={padTop + innerH} stroke="#475569" strokeWidth={1} />
        </g>

        {/* Bars */}
        {plotted.map((p, i) => {
          const y = rowY(i);
          const mid = rowMidY(i);
          const lBarW = (p.male / ticks.xmax) * halfW;
          const rBarW = (p.female / ticks.xmax) * halfW;

          return (
            <g key={p.ageRange}>
              {/* Center label */}
              <text x={centerX} y={mid + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#334155"
                    fontFamily="ui-sans-serif, system-ui, sans-serif">
                {p.ageRange}
              </text>
              {/* Male bar (grows left from leftEdgeX) */}
              {p.male > 0 && (
                <>
                  <rect x={leftEdgeX - lBarW} y={y} width={lBarW} height={barH}
                        fill={style.maleColor} opacity={0.92} />
                  {/* Only show value label if bar is wide enough to not collide with center label */}
                  {lBarW > 32 && (
                    <text x={leftEdgeX - lBarW + 4} y={mid + 4} textAnchor="start" fontSize={9} fill="white"
                          fontWeight={600} fontFamily="ui-sans-serif, system-ui, sans-serif">
                      {fmtAxisCount(p.male, useMode)}
                    </text>
                  )}
                </>
              )}
              {/* Female bar (grows right from rightEdgeX) */}
              {p.female > 0 && (
                <>
                  <rect x={rightEdgeX} y={y} width={rBarW} height={barH}
                        fill={style.femaleColor} opacity={0.92} />
                  {rBarW > 32 && (
                    <text x={rightEdgeX + rBarW - 4} y={mid + 4} textAnchor="end" fontSize={9} fill="white"
                          fontWeight={600} fontFamily="ui-sans-serif, system-ui, sans-serif">
                      {fmtAxisCount(p.female, useMode)}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}

        {/* X axis legend */}
        <text x={width / 2} y={height - 24} textAnchor="middle" fontSize={11} fill="#475569"
              fontFamily="ui-sans-serif, system-ui, sans-serif">
          {useMode === 'pct' ? 'percentage of total population' : 'population count'}
        </text>

        {/* Caption / source line — pinned to absolute bottom */}
        {style.caption && (
          <text x={width / 2} y={height - 8} textAnchor="middle" fontSize={10} fill="#94a3b8"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            {style.caption}
          </text>
        )}
      </svg>
    </div>
  );
}
