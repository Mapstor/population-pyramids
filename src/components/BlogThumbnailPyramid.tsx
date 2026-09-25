/**
 * Server-rendered inline SVG population pyramid for use as a blog post
 * thumbnail. Pure SSR — no client JS — so it ships in the initial HTML
 * (good for AI crawlers + SEO) and never hits the network for an image.
 *
 * Each card gets its own unique gradient ID via the `idSuffix` prop so
 * multiple thumbnails on the same page don't collide.
 */

interface AgeGroup {
  ageRange: string;
  male: number;
  female: number;
}

interface Props {
  ageGroups: AgeGroup[] | null;
  label: string;
  year: number;
  idSuffix: string;
  /** UI category — drives backdrop tint. */
  theme?: 'us' | 'global' | 'featured';
}

const THEMES = {
  us: { bgFrom: '#f5f3ff', bgTo: '#fae8ff', male: '#7e22ce', female: '#db2777', accent: '#581c87' },
  global: { bgFrom: '#eff6ff', bgTo: '#e0e7ff', male: '#1d4ed8', female: '#db2777', accent: '#1e3a8a' },
  featured: { bgFrom: '#fef3c7', bgTo: '#fee2e2', male: '#b91c1c', female: '#9d174d', accent: '#7c2d12' },
};

const W = 480;
const H = 192; // matches the h-48 card slot

export default function BlogThumbnailPyramid({
  ageGroups,
  label,
  year,
  idSuffix,
  theme = 'global',
}: Props) {
  const t = THEMES[theme];
  const gradId = `pyr-bg-${idSuffix}`;

  // Layout
  const padTop = 14;
  const padBottom = 28; // room for label
  const padX = 28;
  const midGap = 8;
  const innerW = W - padX * 2;
  const halfW = (innerW - midGap) / 2;
  const innerH = H - padTop - padBottom;
  const midX = W / 2;

  let bars: React.ReactNode = null;
  if (ageGroups && ageGroups.length > 0) {
    const maxValue = Math.max(...ageGroups.flatMap((g) => [g.male, g.female])) || 1;
    const barH = innerH / ageGroups.length;
    // Oldest at top (reverse of data order — data is youngest first)
    bars = ageGroups
      .slice()
      .reverse()
      .map((g, i) => {
        const y = padTop + i * barH;
        const maleW = (g.male / maxValue) * halfW;
        const femaleW = (g.female / maxValue) * halfW;
        const rh = Math.max(1, barH - 0.4);
        return (
          <g key={g.ageRange}>
            <rect
              x={midX - midGap / 2 - maleW}
              y={y}
              width={maleW}
              height={rh}
              fill={t.male}
              opacity={0.92}
            />
            <rect
              x={midX + midGap / 2}
              y={y}
              width={femaleW}
              height={rh}
              fill={t.female}
              opacity={0.92}
            />
          </g>
        );
      });
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
      role="img"
      aria-label={`Population pyramid thumbnail for ${label}, ${year}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.bgFrom} />
          <stop offset="100%" stopColor={t.bgTo} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${gradId})`} />

      {/* Center axis line */}
      <line
        x1={midX}
        y1={padTop - 2}
        x2={midX}
        y2={H - padBottom + 2}
        stroke={t.accent}
        strokeOpacity={0.15}
        strokeWidth={1}
      />

      {bars ?? (
        <text
          x={midX}
          y={H / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fill={t.accent}
          opacity={0.5}
        >
          Pyramid data unavailable
        </text>
      )}

      {/* M / F micro-legend */}
      <g transform={`translate(${padX}, ${padTop + 4})`}>
        <rect x={0} y={0} width={8} height={8} fill={t.male} />
        <text x={12} y={7} fontSize="9" fill={t.accent} fontWeight={600}>
          M
        </text>
      </g>
      <g transform={`translate(${W - padX - 22}, ${padTop + 4})`}>
        <rect x={0} y={0} width={8} height={8} fill={t.female} />
        <text x={12} y={7} fontSize="9" fill={t.accent} fontWeight={600}>
          F
        </text>
      </g>

      {/* Label band along bottom */}
      <rect
        x={0}
        y={H - padBottom + 4}
        width={W}
        height={padBottom - 4}
        fill={t.accent}
        opacity={0.92}
      />
      <text
        x={padX / 2}
        y={H - 9}
        fontSize="12"
        fontWeight={700}
        fill="#ffffff"
        letterSpacing="0.02em"
      >
        {label.toUpperCase()} · POPULATION PYRAMID {year}
      </text>
    </svg>
  );
}
