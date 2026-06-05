/**
 * Inline SVG fertility-rate trend chart for the calculator. Renders identically
 * on server and client (no hooks), so the chart is in SSR HTML.
 */

import {
  tfrAtYear,
  REPLACEMENT_TFR,
  type SlimFertility,
} from '@/lib/fertility-rate-helpers';

interface Props {
  primary: SlimFertility;
  birthYear: number;
  worldTfrToday: number;
  width?: number;
  height?: number;
}

const X_START = 1965;
const X_END = 2050;

export default function FertilityRateChart({
  primary,
  birthYear,
  worldTfrToday,
  width = 800,
  height = 360,
}: Props) {
  const padding = { top: 50, right: 28, bottom: 40, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Compute a generous Y range that includes both replacement line and country
  const sampleTfrs: number[] = [worldTfrToday, REPLACEMENT_TFR];
  for (let y = X_START; y <= X_END; y += 5) {
    const v = tfrAtYear(primary, y);
    if (v !== null) sampleTfrs.push(v);
  }
  const dataMax = Math.max(...sampleTfrs);
  const yMin = 0;
  const yMax = Math.ceil((dataMax + 0.5) * 2) / 2; // round up to 0.5

  const xOf = (y: number) => padding.left + ((y - X_START) / (X_END - X_START)) * innerW;
  const yOf = (v: number) => padding.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  // Build observed + projected sub-paths so we can dash the projection portion.
  const observedPts: Array<[number, number]> = [];
  const projectedPts: Array<[number, number]> = [];
  for (let y = X_START; y <= X_END; y++) {
    const v = tfrAtYear(primary, y);
    if (v === null) continue;
    const point: [number, number] = [xOf(y), yOf(v)];
    if (y <= 2024) observedPts.push(point);
    if (y >= 2024) projectedPts.push(point); // 2024 in both for continuity
  }
  const obsPath = observedPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const projPath = projectedPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const xTicks = [1965, 1980, 1995, 2010, 2025, 2040, 2050];
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += 1) yTicks.push(v);

  const birthLE = tfrAtYear(primary, birthYear);
  const currentTFR = primary.currentTFR;
  const crossing = primary.belowReplacementSince;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Total fertility rate trend for ${primary.name} from 1965 to projected 2050`}
      >
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

        {/* Replacement reference line */}
        <line x1={padding.left} y1={yOf(REPLACEMENT_TFR)} x2={padding.left + innerW} y2={yOf(REPLACEMENT_TFR)}
              stroke="#16a34a" strokeWidth={1.5} strokeDasharray="6,4" />
        <text x={padding.left + innerW - 4} y={yOf(REPLACEMENT_TFR) - 5} fontSize={11} fill="#15803d" fontWeight={600}
              textAnchor="end" fontFamily="ui-sans-serif, system-ui, sans-serif">
          replacement rate ({REPLACEMENT_TFR})
        </text>

        {/* World TFR reference line */}
        <line x1={padding.left} y1={yOf(worldTfrToday)} x2={padding.left + innerW} y2={yOf(worldTfrToday)}
              stroke="#9ca3af" strokeWidth={1} strokeDasharray="3,3" />
        <text x={padding.left + 4} y={yOf(worldTfrToday) - 4} fontSize={10} fill="#6b7280"
              fontFamily="ui-sans-serif, system-ui, sans-serif">
          world avg today ({worldTfrToday.toFixed(2)})
        </text>

        {/* Country curve — observed solid, projected dashed */}
        <path d={obsPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        <path d={projPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
              strokeDasharray="6,4" opacity={0.75} />

        {/* Crossing-below-replacement marker */}
        {crossing !== null && crossing >= X_START && crossing <= X_END && (
          <g>
            <circle cx={xOf(crossing)} cy={yOf(REPLACEMENT_TFR)} r={5} fill="#dc2626" stroke="white" strokeWidth={1.5} />
            <line x1={xOf(crossing)} y1={yOf(REPLACEMENT_TFR)} x2={xOf(crossing)} y2={padding.top + 16}
                  stroke="#dc2626" strokeWidth={1} strokeDasharray="3,3" />
            <text x={xOf(crossing)} y={padding.top + 11} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              crossed in {crossing}
            </text>
          </g>
        )}

        {/* Birth-year marker */}
        {birthYear >= X_START && birthYear <= X_END && birthLE !== null && (
          <g>
            <line x1={xOf(birthYear)} y1={padding.top} x2={xOf(birthYear)} y2={padding.top + innerH}
                  stroke="#16a34a" strokeWidth={1.5} />
            <circle cx={xOf(birthYear)} cy={yOf(birthLE)} r={5} fill="#16a34a" stroke="white" strokeWidth={1.5} />
            <text x={xOf(birthYear)} y={padding.top - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">
              born {birthYear}
            </text>
          </g>
        )}

        {/* Today marker */}
        <g>
          <line x1={xOf(2024)} y1={padding.top} x2={xOf(2024)} y2={padding.top + innerH}
                stroke="#1d4ed8" strokeWidth={1} strokeDasharray="3,3" opacity={0.6} />
          <circle cx={xOf(2024)} cy={yOf(currentTFR)} r={5} fill="#1d4ed8" stroke="white" strokeWidth={1.5} />
          <text x={xOf(2024)} y={yOf(currentTFR) - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8"
                fontFamily="ui-sans-serif, system-ui, sans-serif">
            today
          </text>
        </g>
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-blue-700" /> {primary.name} TFR</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-blue-700 opacity-60" style={{ borderTop: '1.5px dashed #1d4ed8', background: 'transparent', borderBottom: 0 }} /> projection</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-green-600" /> replacement (2.1)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-green-600" /> born</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-blue-700" /> today</span>
        {crossing !== null && (
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-red-600" /> crossed below 2.1</span>
        )}
      </div>
    </div>
  );
}
