'use client';

import { useRef, useState } from 'react';

export interface MapFeature {
  isoAlpha3: string | null;
  name: string;
  path: string;
  centroid: [number, number] | null;
}

export interface CountryMapDatum {
  population2024: number;
  worldPopulationShare: number;
  slug: string;
  medianAge2024: number;
  densityPerKm2: number;
  region: string;
  areaKm2: number;
}

type Mode = 'population' | 'area';

interface Props {
  features: MapFeature[];
  dataByAlpha: Record<string, CountryMapDatum>;
  /** Optional title shown in the map header */
  title?: string;
  /** Subtitle / hint text below the title */
  hint?: string;
  /** Optional source attribution shown in the header */
  source?: string;
  /** When provided, only these slugs are colored on the choropleth; rest grey.
   *  Position in the array is treated as the rank for the badge label. */
  highlightedSlugs?: string[];
  /** 'population' (default) or 'area' — controls coloring metric + tooltip emphasis */
  mode?: Mode;
  /** Total world land area (for area-mode share calc). If not provided, computed from data. */
  worldLandArea?: number;
}

const POP_LEGEND = [
  { label: 'No data', color: '#e5e7eb' },
  { label: '<1M', color: '#dbeafe' },
  { label: '1–10M', color: '#93c5fd' },
  { label: '10–50M', color: '#60a5fa' },
  { label: '50–200M', color: '#3b82f6' },
  { label: '200M–1B', color: '#1d4ed8' },
  { label: '>1B', color: '#1e3a8a' },
];

const AREA_LEGEND = [
  { label: 'No data', color: '#e5e7eb' },
  { label: '<100K', color: '#a7f3d0' },
  { label: '100K–500K', color: '#34d399' },
  { label: '500K–1M', color: '#10b981' },
  { label: '1M–3M', color: '#047857' },
  { label: '3M–10M', color: '#065f46' },
  { label: '>10M km²', color: '#064e3b' },
];

function getPopFill(pop: number | undefined): string {
  if (!pop || pop <= 0) return '#e5e7eb';
  if (pop >= 1_000_000_000) return '#1e3a8a';
  if (pop >= 200_000_000) return '#1d4ed8';
  if (pop >= 50_000_000) return '#3b82f6';
  if (pop >= 10_000_000) return '#60a5fa';
  if (pop >= 1_000_000) return '#93c5fd';
  return '#dbeafe';
}

function getAreaFill(km2: number | undefined): string {
  if (!km2 || km2 <= 0) return '#e5e7eb';
  if (km2 >= 10_000_000) return '#064e3b';
  if (km2 >= 3_000_000) return '#065f46';
  if (km2 >= 1_000_000) return '#047857';
  if (km2 >= 500_000) return '#10b981';
  if (km2 >= 100_000) return '#34d399';
  return '#a7f3d0';
}

function formatDensity(d: number): string {
  if (d >= 1000) return Math.round(d).toLocaleString();
  if (d >= 10) return d.toFixed(1);
  return d.toFixed(2);
}

function formatArea(km2: number): string {
  if (km2 >= 1_000_000) return `${(km2 / 1_000_000).toFixed(2)}M km²`;
  return `${Math.round(km2).toLocaleString()} km²`;
}

const TIP_W = 280;
const TIP_H = 220;
const TIP_OFFSET = 14;

export default function WorldPopulationMap({
  features,
  dataByAlpha,
  title = 'World Population Map 2024',
  hint = 'Hover any country to see details · Click to open its full demographics page',
  source = 'Source: UN WPP 2024 (population) · Natural Earth via world-atlas (boundaries)',
  highlightedSlugs,
  mode = 'population',
  worldLandArea,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<MapFeature | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const isHighlightMode = !!highlightedSlugs && highlightedSlugs.length > 0;
  const highlightSet = isHighlightMode ? new Set(highlightedSlugs) : null;
  const rankBySlug: Record<string, number> = {};
  if (highlightedSlugs) {
    highlightedSlugs.forEach((slug, i) => {
      rankBySlug[slug] = i + 1;
    });
  }

  const computedWorldLandArea =
    worldLandArea ??
    Object.values(dataByAlpha).reduce((s, d) => s + (d.areaKm2 || 0), 0);

  const data = hovered?.isoAlpha3 ? dataByAlpha[hovered.isoAlpha3] : null;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  let tipLeft = 0;
  let tipTop = 0;
  let tipPlacement: 'br' | 'bl' | 'tr' | 'tl' = 'br';
  if (pos && wrapperRef.current) {
    const w = wrapperRef.current.clientWidth;
    const h = wrapperRef.current.clientHeight;
    const flipX = pos.x + TIP_W + TIP_OFFSET > w;
    const flipY = pos.y + TIP_H + TIP_OFFSET > h;
    tipLeft = flipX ? Math.max(8, pos.x - TIP_W - TIP_OFFSET) : pos.x + TIP_OFFSET;
    tipTop = flipY ? Math.max(8, pos.y - TIP_H - TIP_OFFSET) : pos.y + TIP_OFFSET;
    tipPlacement = ((flipY ? 't' : 'b') + (flipX ? 'l' : 'r')) as 'br' | 'bl' | 'tr' | 'tl';
  }

  const legend = mode === 'area' ? AREA_LEGEND : POP_LEGEND;
  const legendLabel = mode === 'area' ? 'Land area:' : 'Population:';
  const badgeFill = mode === 'area' ? '#064e3b' : '#1e3a8a';
  const badgeRing = mode === 'area' ? '#ecfdf5' : '#dbeafe';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-600 mt-0.5">{hint}</p>
        </div>
        <div className="text-xs text-gray-500">{source}</div>
      </div>

      {/* Map + floating tooltip */}
      <div
        ref={wrapperRef}
        className="relative px-2 py-2 bg-slate-50"
        onMouseLeave={() => {
          setHovered(null);
          setPos(null);
        }}
      >
        <svg
          viewBox="0 0 960 480"
          className="w-full h-auto block"
          role="img"
          aria-label={title}
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleMove}
        >
          <g>
            {features.map((f) => {
              const d = f.isoAlpha3 ? dataByAlpha[f.isoAlpha3] : null;
              const inHighlight = !isHighlightMode || (d ? highlightSet!.has(d.slug) : false);
              let fill: string;
              if (isHighlightMode && !inHighlight) {
                fill = '#e5e7eb';
              } else if (mode === 'area') {
                fill = getAreaFill(d?.areaKm2);
              } else {
                fill = getPopFill(d?.population2024);
              }
              const isActive = hovered?.name === f.name;
              const slug = d?.slug;
              return (
                <path
                  key={f.name}
                  d={f.path}
                  fill={fill}
                  stroke={isActive ? '#0f172a' : '#ffffff'}
                  strokeWidth={isActive ? 1.2 : 0.4}
                  onMouseEnter={() => setHovered(f)}
                  onClick={() => {
                    if (slug) window.location.href = `/${slug}`;
                  }}
                  className={
                    d
                      ? 'cursor-pointer transition-opacity hover:opacity-80 focus:outline-none'
                      : 'transition-opacity'
                  }
                  data-country={f.isoAlpha3 ?? ''}
                  data-name={f.name}
                />
              );
            })}

            {/* Rank badges for highlighted countries */}
            {isHighlightMode &&
              features.map((f) => {
                const d = f.isoAlpha3 ? dataByAlpha[f.isoAlpha3] : null;
                if (!d || !f.centroid) return null;
                const rank = rankBySlug[d.slug];
                if (!rank) return null;
                const [cx, cy] = f.centroid;
                return (
                  <g key={`badge-${f.name}`} style={{ pointerEvents: 'none' }}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={12}
                      fill={badgeFill}
                      stroke={badgeRing}
                      strokeWidth={2.5}
                    />
                    <text
                      x={cx}
                      y={cy + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      {rank}
                    </text>
                  </g>
                );
              })}
          </g>
        </svg>

        {/* Floating info bubble */}
        {hovered && pos && (
          <div
            className="absolute pointer-events-none z-20"
            style={{ left: tipLeft, top: tipTop, width: TIP_W }}
            aria-live="polite"
          >
            <div className="bg-white rounded-lg shadow-xl ring-1 ring-gray-200 overflow-hidden">
              <div
                className="px-3 py-2 text-white"
                style={{
                  background:
                    mode === 'area'
                      ? 'linear-gradient(90deg, #065f46, #10b981)'
                      : 'linear-gradient(90deg, #1e3a8a, #4f46e5)',
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {data && isHighlightMode && rankBySlug[data.slug]
                    ? `#${rankBySlug[data.slug]} in this ranking`
                    : data
                    ? mode === 'area'
                      ? `#${
                          Object.values(dataByAlpha)
                            .sort((a, b) => b.areaKm2 - a.areaKm2)
                            .findIndex((d2) => d2.slug === data.slug) + 1
                        } by area`
                      : `#${
                          Object.values(dataByAlpha)
                            .sort((a, b) => b.population2024 - a.population2024)
                            .findIndex((d2) => d2.slug === data.slug) + 1
                        } by population`
                    : 'No data'}
                </div>
                <div className="text-base font-bold leading-tight">{hovered.name}</div>
              </div>

              {data ? (
                <div className="p-3 space-y-2">
                  {mode === 'area' ? (
                    <div
                      className="rounded p-2"
                      style={{ backgroundColor: '#ecfdf5' }}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                        Land area
                      </div>
                      <div className="text-xl font-bold text-emerald-900 leading-tight">
                        {formatArea(data.areaKm2)}
                      </div>
                      <div className="text-[10px] text-emerald-800 mt-0.5">
                        {((data.areaKm2 / computedWorldLandArea) * 100).toFixed(2)}% of world land · CIA Factbook
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded p-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                        Population 2024
                      </div>
                      <div className="text-xl font-bold text-blue-900 leading-tight">
                        {data.population2024.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-blue-800 mt-0.5">
                        {data.worldPopulationShare.toFixed(2)}% of world · UN WPP 2024
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {mode === 'area' ? (
                      <>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            Population
                          </div>
                          <div className="font-semibold text-gray-900 text-[11px]">
                            {data.population2024 >= 1_000_000
                              ? `${(data.population2024 / 1_000_000).toFixed(0)}M`
                              : data.population2024.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            Density
                          </div>
                          <div className="font-semibold text-gray-900">
                            {data.densityPerKm2 > 0 ? formatDensity(data.densityPerKm2) : '—'}
                          </div>
                          <div className="text-[8px] text-gray-500">/km²</div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            Region
                          </div>
                          <div className="font-semibold text-gray-900 text-[11px] leading-tight">
                            {data.region}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            Median age
                          </div>
                          <div className="font-semibold text-gray-900">
                            {data.medianAge2024 > 0 ? data.medianAge2024.toFixed(1) : '—'}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            Density
                          </div>
                          <div className="font-semibold text-gray-900">
                            {data.densityPerKm2 > 0 ? formatDensity(data.densityPerKm2) : '—'}
                          </div>
                          <div className="text-[8px] text-gray-500">/km²</div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            Region
                          </div>
                          <div className="font-semibold text-gray-900 text-[11px] leading-tight">
                            {data.region}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="text-[11px] text-blue-700 font-medium border-t border-gray-100 pt-1.5">
                    Click to view {hovered.name} demographics →
                  </div>
                </div>
              ) : (
                <div className="p-3 text-xs text-gray-600">
                  Detailed data not available for this territory (dependency or disputed area).
                </div>
              )}
            </div>

            <span
              className={
                'absolute w-2.5 h-2.5 bg-white ring-1 ring-gray-200 transform rotate-45 ' +
                (tipPlacement === 'br'
                  ? '-top-1 -left-1'
                  : tipPlacement === 'bl'
                  ? '-top-1 -right-1'
                  : tipPlacement === 'tr'
                  ? '-bottom-1 -left-1'
                  : '-bottom-1 -right-1')
              }
              aria-hidden="true"
            />
          </div>
        )}

        {!hovered && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-gray-600 shadow-sm ring-1 ring-gray-200 pointer-events-none">
            <span className="font-medium text-gray-900">Hover</span> any country for details ·{' '}
            <span className="font-medium text-gray-900">Click</span> to open
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center flex-wrap gap-3 text-xs">
        <span className="font-medium text-gray-700">{legendLabel}</span>
        {legend.map((b) => (
          <span key={b.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-4 h-4 rounded-sm border border-gray-300"
              style={{ backgroundColor: b.color }}
              aria-hidden="true"
            />
            <span className="text-gray-700">{b.label}</span>
          </span>
        ))}
      </div>

      {!isHighlightMode && (
        <div className="px-6 py-2 border-t border-gray-200 text-xs text-gray-500 bg-gray-50">
          Tiny island nations (Vatican City, Monaco, Nauru, Tuvalu, Marshall Is., etc.) are below the
          110-meter resolution of the base map and don&apos;t appear here. See the full ranking
          table below for every country.
        </div>
      )}
    </div>
  );
}
