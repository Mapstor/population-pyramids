export interface BarItem {
  rank: number;
  name: string;
  slug: string;
  value: number;
  formatted: string;
  share?: string;
}

interface Props {
  items: BarItem[];
  title: string;
  axisLabel: string;
  source: string;
  ticks: { value: number; label: string }[];
  color?: 'blue' | 'emerald' | 'amber';
  caption?: React.ReactNode;
}

const THEMES = {
  blue: { from: '#1e3a8a', to: '#60a5fa' },
  emerald: { from: '#065f46', to: '#10b981' },
  amber: { from: '#92400e', to: '#fbbf24' },
};

export default function RankingBarChart({
  items,
  title,
  axisLabel,
  source,
  ticks,
  color = 'blue',
  caption,
}: Props) {
  if (items.length === 0) return null;

  const max = Math.max(items[0].value, ...ticks.map((t) => t.value));
  const numItems = items.length;

  // Layout (in viewBox units)
  const W = 800;
  const ROW_H = 36;
  const HEADER_H = 12;
  const FOOTER_H = 60;
  const LEFT = 232;
  const RIGHT = 132;
  const BAR_W = W - LEFT - RIGHT;
  const H = HEADER_H + numItems * ROW_H + FOOTER_H;
  const theme = THEMES[color];
  const gradientId = `bargrad-${color}-${title.replace(/[^a-z0-9]/gi, '').slice(0, 12)}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-500">{source}</span>
      </div>

      <div className="p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label={title}
          preserveAspectRatio="xMidYMid meet"
        >
          <title>{title}</title>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={theme.from} />
              <stop offset="100%" stopColor={theme.to} />
            </linearGradient>
          </defs>

          {/* Vertical gridlines */}
          {ticks.map((t) => {
            const x = LEFT + (t.value / max) * BAR_W;
            return (
              <line
                key={`gl-${t.value}`}
                x1={x}
                x2={x}
                y1={HEADER_H}
                y2={H - FOOTER_H + 4}
                stroke="#f1f5f9"
                strokeWidth={1}
              />
            );
          })}

          {/* Bars */}
          {items.map((item, i) => {
            const y = HEADER_H + i * ROW_H;
            const barLen = Math.max(2, (item.value / max) * BAR_W);
            const barH = 22;
            const barY = y + (ROW_H - barH) / 2;

            return (
              <a key={item.slug} href={`/${item.slug}`}>
                {/* Whole-row clickable area */}
                <rect
                  x="0"
                  y={y}
                  width={W}
                  height={ROW_H}
                  fill="transparent"
                  className="cursor-pointer hover:fill-blue-50 transition-colors"
                />

                <text
                  x="20"
                  y={y + ROW_H / 2}
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#64748b"
                >
                  #{item.rank}
                </text>

                <text
                  x="58"
                  y={y + ROW_H / 2}
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#0f172a"
                >
                  {item.name}
                </text>

                <rect
                  x={LEFT}
                  y={barY}
                  width={barLen}
                  height={barH}
                  fill={`url(#${gradientId})`}
                  rx="3"
                  ry="3"
                  className="transition-opacity"
                />

                <text
                  x={LEFT + barLen + 8}
                  y={y + ROW_H / 2 - (item.share ? 5 : 0)}
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="#0f172a"
                >
                  {item.formatted}
                </text>

                {item.share && (
                  <text
                    x={LEFT + barLen + 8}
                    y={y + ROW_H / 2 + 10}
                    dominantBaseline="middle"
                    fontSize="11"
                    fill="#64748b"
                  >
                    {item.share}
                  </text>
                )}
              </a>
            );
          })}

          {/* X-axis baseline */}
          <line
            x1={LEFT}
            x2={LEFT + BAR_W}
            y1={H - FOOTER_H + 4}
            y2={H - FOOTER_H + 4}
            stroke="#cbd5e1"
            strokeWidth={1}
          />

          {/* Tick labels */}
          {ticks.map((t) => {
            const x = LEFT + (t.value / max) * BAR_W;
            return (
              <g key={`tick-${t.value}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={H - FOOTER_H + 4}
                  y2={H - FOOTER_H + 10}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={H - FOOTER_H + 26}
                  fontSize="11"
                  fill="#64748b"
                  textAnchor="middle"
                >
                  {t.label}
                </text>
              </g>
            );
          })}

          {/* Axis label */}
          <text
            x={LEFT + BAR_W / 2}
            y={H - 10}
            fontSize="11"
            fill="#94a3b8"
            textAnchor="middle"
            fontStyle="italic"
          >
            {axisLabel}
          </text>
        </svg>

        {caption && <div className="mt-3 text-sm text-gray-700 px-2">{caption}</div>}
      </div>
    </div>
  );
}
