'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  lifeExpectancy?: number;
  lifeExpectancyMale?: number;
  lifeExpectancyFemale?: number;
  fertilityRate?: number;             // TFR — children per woman
  belowReplacementSince?: number | null; // year crossed below 2.1, or null
}

type Mode = 'population' | 'area' | 'life-expectancy' | 'fertility-rate' | 'population-density';

export interface ExtraMarker {
  slug: string;
  label: string; // e.g. "1", "2"… for rank, or anything else
  name: string;  // country name for hover/tooltip
  x: number;     // viewBox-pixel coords (already projected)
  y: number;
}

export interface RegionPreset {
  id: string;
  label: string;
  /** null = reset to full world view */
  view: { x: number; y: number; w: number; h: number } | null;
}

interface Props {
  features: MapFeature[];
  dataByAlpha: Record<string, CountryMapDatum>;
  title?: string;
  hint?: string;
  source?: string;
  highlightedSlugs?: string[];
  mode?: Mode;
  worldLandArea?: number;
  extraMarkers?: ExtraMarker[];
  /** Optional one-click region buttons rendered above the map. */
  regionPresets?: RegionPreset[];
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

const LE_LEGEND = [
  { label: 'No data', color: '#e5e7eb' },
  { label: '<60 yrs', color: '#7f1d1d' },
  { label: '60–65', color: '#c2410c' },
  { label: '65–72', color: '#ea580c' },
  { label: '72–78', color: '#facc15' },
  { label: '78–82', color: '#84cc16' },
  { label: '82+ yrs', color: '#15803d' },
];

// Diverging palette pivoted around replacement (2.1). Cool blues for
// "below replacement" (population shrinking from births alone), green at
// replacement, warm hues for high-fertility / fast-growing populations.
const FERTILITY_LEGEND = [
  { label: 'No data', color: '#e5e7eb' },
  { label: '<1.5', color: '#4338ca' },
  { label: '1.5–2.1', color: '#818cf8' },
  { label: '2.1–3', color: '#4ade80' },
  { label: '3–4', color: '#facc15' },
  { label: '4–5', color: '#f97316' },
  { label: '5+ children', color: '#b91c1c' },
];

// Sequential purple palette, pale → dark. Distinct hue from the other modes
// so users immediately read "this map is showing density".
const DENSITY_LEGEND = [
  { label: 'No data', color: '#e5e7eb' },
  { label: '<10/km²', color: '#ede9fe' },
  { label: '10–50', color: '#c4b5fd' },
  { label: '50–100', color: '#a78bfa' },
  { label: '100–200', color: '#8b5cf6' },
  { label: '200–500', color: '#7c3aed' },
  { label: '500–1,000', color: '#6d28d9' },
  { label: '1,000+', color: '#4c1d95' },
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

function getLEFill(le: number | undefined): string {
  if (!le || le <= 0) return '#e5e7eb';
  if (le >= 82) return '#15803d';
  if (le >= 78) return '#84cc16';
  if (le >= 72) return '#facc15';
  if (le >= 65) return '#ea580c';
  if (le >= 60) return '#c2410c';
  return '#7f1d1d';
}

function getFertilityFill(tfr: number | undefined): string {
  if (tfr === undefined || tfr === null || tfr <= 0) return '#e5e7eb';
  if (tfr >= 5) return '#b91c1c';
  if (tfr >= 4) return '#f97316';
  if (tfr >= 3) return '#facc15';
  if (tfr >= 2.1) return '#4ade80';
  if (tfr >= 1.5) return '#818cf8';
  return '#4338ca';
}

function getDensityFill(d: number | undefined): string {
  if (d === undefined || d === null || d <= 0) return '#e5e7eb';
  if (d >= 1000) return '#4c1d95';
  if (d >= 500) return '#6d28d9';
  if (d >= 200) return '#7c3aed';
  if (d >= 100) return '#8b5cf6';
  if (d >= 50) return '#a78bfa';
  if (d >= 10) return '#c4b5fd';
  return '#ede9fe';
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

const VB_W = 960;
const VB_H = 480;
const MAX_ZOOM = 20;
const MIN_VB_W = VB_W / MAX_ZOOM;

interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

const BASE_VIEW: View = { x: 0, y: 0, w: VB_W, h: VB_H };

function clampView(v: View): View {
  const w = Math.max(MIN_VB_W, Math.min(VB_W, v.w));
  const h = w * (VB_H / VB_W);
  const x = Math.max(0, Math.min(VB_W - w, v.x));
  const y = Math.max(0, Math.min(VB_H - h, v.y));
  return { x, y, w, h };
}

export default function WorldPopulationMap({
  features,
  dataByAlpha,
  title = 'World Population Map 2024',
  hint = 'Hover any country to see details · Click to open its full demographics page',
  source = 'Source: UN WPP 2024 (population) · Natural Earth via world-atlas (boundaries)',
  highlightedSlugs,
  mode = 'population',
  worldLandArea,
  extraMarkers,
  regionPresets,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState<MapFeature | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [view, setView] = useState<View>(BASE_VIEW);

  // Mirror view into a ref so the native wheel listener (attached once) can
  // read the latest value without re-binding on every state change.
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const dragRef = useRef<{
    startClientX: number;
    startClientY: number;
    startView: View;
    rectW: number;
    rectH: number;
  } | null>(null);
  // True if the most recent pointer interaction moved the pointer enough to
  // count as a drag — used to suppress the click-to-navigate that would
  // otherwise fire on pointerup.
  const draggedRef = useRef(false);

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

  // ---- Zoom & pan helpers --------------------------------------------------

  const zoomFactor = VB_W / view.w; // 1 at world view, larger as we zoom in
  const isZoomed = zoomFactor > 1.02;

  const applyZoom = useCallback(
    (multiplier: number, anchor: { x: number; y: number }) => {
      const v = viewRef.current;
      const targetW = Math.max(MIN_VB_W, Math.min(VB_W, v.w / multiplier));
      const targetH = targetW * (VB_H / VB_W);
      const scaleChange = targetW / v.w;
      const newX = anchor.x - (anchor.x - v.x) * scaleChange;
      const newY = anchor.y - (anchor.y - v.y) * scaleChange;
      setView(clampView({ x: newX, y: newY, w: targetW, h: targetH }));
    },
    []
  );

  const zoomIn = useCallback(() => {
    const v = viewRef.current;
    applyZoom(1.6, { x: v.x + v.w / 2, y: v.y + v.h / 2 });
  }, [applyZoom]);

  const zoomOut = useCallback(() => {
    const v = viewRef.current;
    applyZoom(1 / 1.6, { x: v.x + v.w / 2, y: v.y + v.h / 2 });
  }, [applyZoom]);

  const reset = useCallback(() => setView(BASE_VIEW), []);

  const jumpTo = useCallback((preset: RegionPreset) => {
    if (preset.view) setView(clampView(preset.view));
    else setView(BASE_VIEW);
  }, []);

  // Native wheel listener so we can call preventDefault (React onWheel is
  // passive). Bound once; reads the latest view via viewRef.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const v = viewRef.current;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const anchor = { x: v.x + v.w * px, y: v.y + v.h * py };
      const factor = e.deltaY < 0 ? 1.25 : 0.8;
      const targetW = Math.max(MIN_VB_W, Math.min(VB_W, v.w / factor));
      const targetH = targetW * (VB_H / VB_W);
      const scaleChange = targetW / v.w;
      const newX = anchor.x - (anchor.x - v.x) * scaleChange;
      const newY = anchor.y - (anchor.y - v.y) * scaleChange;
      setView(clampView({ x: newX, y: newY, w: targetW, h: targetH }));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    try {
      svgRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* some browsers throw if capture not allowed; safe to ignore */
    }
    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startView: view,
      rectW: rect.width,
      rectH: rect.height,
    };
    draggedRef.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    // tooltip position update (only when not dragging)
    const wrapRect = wrapperRef.current?.getBoundingClientRect();
    if (wrapRect) {
      setPos({ x: e.clientX - wrapRect.left, y: e.clientY - wrapRect.top });
    }
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startClientX;
    const dy = e.clientY - d.startClientY;
    if (!draggedRef.current && Math.abs(dx) + Math.abs(dy) > 5) {
      draggedRef.current = true;
      setHovered(null); // suppress hover bubble during drag
    }
    if (!draggedRef.current) return;
    const sx = d.startView.w / d.rectW;
    const sy = d.startView.h / d.rectH;
    setView(
      clampView({
        x: d.startView.x - dx * sx,
        y: d.startView.y - dy * sy,
        w: d.startView.w,
        h: d.startView.h,
      })
    );
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    dragRef.current = null;
    // Keep draggedRef true through the next click event, then reset on next pointerdown.
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

  const legend =
    mode === 'area'
      ? AREA_LEGEND
      : mode === 'life-expectancy'
      ? LE_LEGEND
      : mode === 'fertility-rate'
      ? FERTILITY_LEGEND
      : mode === 'population-density'
      ? DENSITY_LEGEND
      : POP_LEGEND;
  const legendLabel =
    mode === 'area'
      ? 'Land area:'
      : mode === 'life-expectancy'
      ? 'Life expectancy:'
      : mode === 'fertility-rate'
      ? 'Fertility rate (TFR):'
      : mode === 'population-density'
      ? 'Density (people/km²):'
      : 'Population:';
  const badgeFill =
    mode === 'area'
      ? '#064e3b'
      : mode === 'life-expectancy'
      ? '#15803d'
      : mode === 'fertility-rate'
      ? '#9f1239'
      : mode === 'population-density'
      ? '#4c1d95'
      : '#1e3a8a';
  const badgeRing =
    mode === 'area'
      ? '#ecfdf5'
      : mode === 'life-expectancy'
      ? '#f0fdf4'
      : mode === 'fertility-rate'
      ? '#fff1f2'
      : mode === 'population-density'
      ? '#ede9fe'
      : '#dbeafe';

  // Scale geometry that's specified in viewBox units so it stays visually
  // proportional as we zoom in. Without this, a r=11 pin at zoom=8 fills 9%
  // of the screen.
  const markerScale = 1 / Math.max(1, Math.sqrt(zoomFactor));
  const pinR = Math.max(5, 11 * markerScale);
  const pinNeedleH = Math.max(7, 14 * markerScale);
  const pinNeedleStroke = Math.max(0.7, 1.5 * markerScale);
  const pinTextSize = Math.max(8, 11 * markerScale);
  const pinRingStroke = Math.max(0.8, 2 * markerScale);
  const badgeR = Math.max(6, 12 * markerScale);
  const badgeRingStroke = Math.max(1, 2.5 * markerScale);
  const badgeTextSize = Math.max(8, 11 * markerScale);

  const cursorClass = dragRef.current
    ? 'cursor-grabbing'
    : isZoomed
    ? 'cursor-grab'
    : 'cursor-default';

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

      {/* Region jump bar (optional) */}
      {regionPresets && regionPresets.length > 0 && (
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Jump to:</span>
          {regionPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => jumpTo(p)}
              className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded hover:border-blue-500 hover:text-blue-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Map + floating tooltip */}
      <div
        ref={wrapperRef}
        className="relative px-2 py-2 bg-slate-50"
        onMouseLeave={() => {
          if (!dragRef.current) {
            setHovered(null);
            setPos(null);
          }
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          className={`w-full h-auto block ${cursorClass}`}
          role="img"
          aria-label={title}
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: 'none' }}
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
              } else if (mode === 'life-expectancy') {
                fill = getLEFill(d?.lifeExpectancy);
              } else if (mode === 'fertility-rate') {
                fill = getFertilityFill(d?.fertilityRate);
              } else if (mode === 'population-density') {
                fill = getDensityFill(d?.densityPerKm2);
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
                  strokeWidth={isActive ? 1.4 : 0.6}
                  vectorEffect="non-scaling-stroke"
                  onPointerEnter={() => {
                    if (!dragRef.current) setHovered(f);
                  }}
                  onClick={() => {
                    if (draggedRef.current) {
                      // suppress click that came from a drag
                      draggedRef.current = false;
                      return;
                    }
                    if (slug) window.location.href = `/${slug}`;
                  }}
                  className={
                    d
                      ? 'transition-opacity hover:opacity-80 focus:outline-none'
                      : 'transition-opacity'
                  }
                  data-country={f.isoAlpha3 ?? ''}
                  data-name={f.name}
                />
              );
            })}

            {/* Pin markers for countries too small to render as paths */}
            {extraMarkers &&
              extraMarkers.map((m) => (
                <g key={`marker-${m.slug}`} style={{ pointerEvents: 'none' }}>
                  <line
                    x1={m.x}
                    y1={m.y}
                    x2={m.x}
                    y2={m.y - pinNeedleH}
                    stroke={badgeFill}
                    strokeWidth={pinNeedleStroke}
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={m.x}
                    cy={m.y - pinNeedleH - pinR + 4}
                    r={pinR}
                    fill={badgeFill}
                    stroke={badgeRing}
                    strokeWidth={pinRingStroke}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={m.x}
                    y={m.y - pinNeedleH - pinR + 4.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={pinTextSize}
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {m.label}
                  </text>
                  <title>{m.name}</title>
                </g>
              ))}

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
                      r={badgeR}
                      fill={badgeFill}
                      stroke={badgeRing}
                      strokeWidth={badgeRingStroke}
                      vectorEffect="non-scaling-stroke"
                    />
                    <text
                      x={cx}
                      y={cy + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={badgeTextSize}
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

        {/* Zoom controls — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-md ring-1 ring-gray-200 p-1">
          <button
            type="button"
            onClick={zoomIn}
            aria-label="Zoom in"
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100 hover:text-blue-700 text-lg font-bold leading-none"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Zoom out"
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100 hover:text-blue-700 text-lg font-bold leading-none"
          >
            −
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset view"
            title="Reset to world view"
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100 hover:text-blue-700 text-base leading-none"
          >
            ⌖
          </button>
        </div>

        {/* Zoom indicator + hint — bottom right */}
        {isZoomed && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 pointer-events-none">
            Zoom {zoomFactor.toFixed(1)}× · drag to pan
          </div>
        )}

        {/* Floating info bubble */}
        {hovered && pos && !dragRef.current && (
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
                      : mode === 'life-expectancy'
                      ? 'linear-gradient(90deg, #15803d, #84cc16)'
                      : mode === 'fertility-rate'
                      ? 'linear-gradient(90deg, #9f1239, #f97316)'
                      : mode === 'population-density'
                      ? 'linear-gradient(90deg, #4c1d95, #a78bfa)'
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
                      : mode === 'life-expectancy' && data.lifeExpectancy
                      ? `#${
                          Object.values(dataByAlpha)
                            .filter((d2) => d2.lifeExpectancy != null)
                            .sort((a, b) => (b.lifeExpectancy ?? 0) - (a.lifeExpectancy ?? 0))
                            .findIndex((d2) => d2.slug === data.slug) + 1
                        } by life expectancy`
                      : mode === 'fertility-rate' && data.fertilityRate
                      ? `#${
                          Object.values(dataByAlpha)
                            .filter((d2) => d2.fertilityRate != null)
                            .sort((a, b) => (b.fertilityRate ?? 0) - (a.fertilityRate ?? 0))
                            .findIndex((d2) => d2.slug === data.slug) + 1
                        } by fertility rate`
                      : mode === 'population-density' && data.densityPerKm2 > 0
                      ? `#${
                          Object.values(dataByAlpha)
                            .filter((d2) => d2.densityPerKm2 > 0)
                            .sort((a, b) => b.densityPerKm2 - a.densityPerKm2)
                            .findIndex((d2) => d2.slug === data.slug) + 1
                        } by density`
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
                    <div className="rounded p-2" style={{ backgroundColor: '#ecfdf5' }}>
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
                  ) : mode === 'life-expectancy' && data.lifeExpectancy != null ? (
                    <div className="rounded p-2" style={{ backgroundColor: '#f0fdf4' }}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-green-900">
                        Life expectancy 2024
                      </div>
                      <div className="text-xl font-bold text-green-900 leading-tight">
                        {data.lifeExpectancy.toFixed(1)} <span className="text-sm">yrs</span>
                      </div>
                      <div className="text-[10px] text-green-800 mt-0.5">
                        M {data.lifeExpectancyMale?.toFixed(1) ?? '—'} · F {data.lifeExpectancyFemale?.toFixed(1) ?? '—'} · UN WPP 2024
                      </div>
                    </div>
                  ) : mode === 'fertility-rate' && data.fertilityRate != null ? (
                    <div className="rounded p-2" style={{ backgroundColor: '#fff1f2' }}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-900">
                        Fertility rate 2024
                      </div>
                      <div className="text-xl font-bold text-rose-900 leading-tight">
                        {data.fertilityRate.toFixed(2)} <span className="text-sm">children/woman</span>
                      </div>
                      <div className="text-[10px] text-rose-800 mt-0.5">
                        {data.fertilityRate < 2.1
                          ? data.belowReplacementSince
                            ? `Below replacement since ${data.belowReplacementSince}`
                            : 'Below replacement (2.1)'
                          : `Above replacement (+${(data.fertilityRate - 2.1).toFixed(2)} vs 2.1)`}
                        {' '}· UN WPP 2024
                      </div>
                    </div>
                  ) : mode === 'population-density' && data.densityPerKm2 > 0 ? (
                    <div className="rounded p-2" style={{ backgroundColor: '#ede9fe' }}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                        Population density
                      </div>
                      <div className="text-xl font-bold text-purple-900 leading-tight">
                        {formatDensity(data.densityPerKm2)} <span className="text-sm">/km²</span>
                      </div>
                      <div className="text-[10px] text-purple-800 mt-0.5">
                        {formatDensity(data.densityPerKm2 * 0.386102)}/mi² · UN WPP 2024 ÷ CIA Factbook
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
                    {mode === 'fertility-rate' && data.fertilityRate != null ? (
                      <>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            vs 2.1
                          </div>
                          <div className={`font-semibold ${data.fertilityRate < 2.1 ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {data.fertilityRate >= 2.1 ? '+' : ''}{(data.fertilityRate - 2.1).toFixed(2)}
                          </div>
                          <div className="text-[8px] text-gray-500">replacement</div>
                        </div>
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
                            Region
                          </div>
                          <div className="font-semibold text-gray-900 text-[11px] leading-tight">
                            {data.region}
                          </div>
                        </div>
                      </>
                    ) : mode === 'population-density' && data.densityPerKm2 > 0 ? (
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
                            Land area
                          </div>
                          <div className="font-semibold text-gray-900 text-[11px]">
                            {data.areaKm2 >= 1_000_000
                              ? `${(data.areaKm2 / 1_000_000).toFixed(2)}M`
                              : data.areaKm2 >= 1000
                              ? `${Math.round(data.areaKm2 / 1000)}K`
                              : Math.round(data.areaKm2).toString()}<span className="text-[9px]"> km²</span>
                          </div>
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
                    ) : mode === 'life-expectancy' && data.lifeExpectancy != null ? (
                      <>
                        <div className="bg-gray-50 rounded p-1.5 text-center">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                            Gender gap
                          </div>
                          <div className="font-semibold text-gray-900">
                            {data.lifeExpectancyFemale != null && data.lifeExpectancyMale != null
                              ? `+${(data.lifeExpectancyFemale - data.lifeExpectancyMale).toFixed(1)}`
                              : '—'}
                          </div>
                          <div className="text-[8px] text-gray-500">F − M yrs</div>
                        </div>
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
                            Region
                          </div>
                          <div className="font-semibold text-gray-900 text-[11px] leading-tight">
                            {data.region}
                          </div>
                        </div>
                      </>
                    ) : mode === 'area' ? (
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

        {!hovered && !isZoomed && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-gray-600 shadow-sm ring-1 ring-gray-200 pointer-events-none">
            <span className="font-medium text-gray-900">Hover</span> for details ·{' '}
            <span className="font-medium text-gray-900">Click</span> to open ·{' '}
            <span className="font-medium text-gray-900">Scroll</span> to zoom
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

      {!isHighlightMode && !extraMarkers && (
        <div className="px-6 py-2 border-t border-gray-200 text-xs text-gray-500 bg-gray-50">
          Tiny island nations (Vatican City, Monaco, Nauru, Tuvalu, Marshall Is., etc.) are below the
          110-meter resolution of the base map and don&apos;t appear here. See the full ranking
          table below for every country.
        </div>
      )}
    </div>
  );
}
