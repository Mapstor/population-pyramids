'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PyramidSVG from './PyramidSVG';
import CustomDataEditor from './CustomDataEditor';
import {
  DEFAULT_STYLE,
  seedPyramid,
  summarize,
  type PyramidRow,
  type PyramidStyle,
} from '@/lib/pyramid-maker-helpers';

interface CountryOption {
  slug: string;
  name: string;
  flag: string;
  years: number[];                      // sorted ascending
  rowsByYear: Record<string, PyramidRow[]>;
}

interface Props {
  countries: CountryOption[];
  defaultSlug: string;     // e.g. 'united-states'
  defaultYear: number;     // e.g. 2025
  initialRows: PyramidRow[];  // SSR default — country + year above pre-resolved on server
  initialTitle: string;       // SSR default title
}

type Mode = 'country' | 'custom';

export default function PyramidMaker({
  countries,
  defaultSlug,
  defaultYear,
  initialRows,
  initialTitle,
}: Props) {
  const [mode, setMode] = useState<Mode>('country');
  const [slug, setSlug] = useState(defaultSlug);
  const [year, setYear] = useState(defaultYear);
  const [customRows, setCustomRows] = useState<PyramidRow[]>(() => seedPyramid().map(r => ({
    ...r,
    // Convert seed percentages into a plausible 10M-person country
    male: Math.round(r.male * 100_000),
    female: Math.round(r.female * 100_000),
  })));
  const [style, setStyle] = useState<PyramidStyle>(() => ({ ...DEFAULT_STYLE, title: initialTitle }));

  const svgWrapRef = useRef<HTMLDivElement | null>(null);

  // URL param hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const qMode = p.get('mode');
    if (qMode === 'country' || qMode === 'custom') setMode(qMode);
    const qSlug = p.get('country');
    if (qSlug && countries.some(c => c.slug === qSlug)) setSlug(qSlug);
    const qYear = parseInt(p.get('year') || '', 10);
    if (!Number.isNaN(qYear)) setYear(qYear);
    const qTitle = p.get('title');
    if (qTitle) setStyle(s => ({ ...s, title: qTitle }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL mirror (only for country mode — custom would explode the URL)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    p.set('mode', mode);
    if (mode === 'country') {
      p.set('country', slug);
      p.set('year', String(year));
    } else {
      p.delete('country');
      p.delete('year');
    }
    if (style.title && style.title !== initialTitle) p.set('title', style.title); else p.delete('title');
    window.history.replaceState(null, '', `${window.location.pathname}?${p.toString()}`);
  }, [mode, slug, year, style.title, initialTitle]);

  const country = useMemo(() => countries.find(c => c.slug === slug) ?? countries[0], [slug, countries]);
  const yearsAvailable = country?.years ?? [];

  // Active rows + computed title/subtitle based on mode
  const activeRows: PyramidRow[] = useMemo(() => {
    if (mode === 'custom') return customRows;
    if (!country) return initialRows;
    return country.rowsByYear[String(year)] ?? country.rowsByYear[String(yearsAvailable[yearsAvailable.length - 1])] ?? initialRows;
  }, [mode, customRows, country, year, yearsAvailable, initialRows]);

  const effectiveStyle: PyramidStyle = useMemo(() => {
    if (mode === 'country' && country) {
      const autoTitle = style.title || `${country.name} Population Pyramid ${year}`;
      const autoSubtitle = style.subtitle || `Total population: ${activeRows.reduce((s, r) => s + r.male + r.female, 0).toLocaleString()}`;
      return { ...style, title: autoTitle, subtitle: autoSubtitle };
    }
    return {
      ...style,
      title: style.title || 'Custom Population Pyramid',
      subtitle: style.subtitle || `Total: ${activeRows.reduce((s, r) => s + r.male + r.female, 0).toLocaleString()}`,
    };
  }, [mode, country, year, style, activeRows]);

  const summary = useMemo(() => summarize(activeRows), [activeRows]);

  // ── Download handlers ──────────────────────────────────────────────────────

  function getSvgEl(): SVGSVGElement | null {
    return svgWrapRef.current?.querySelector('svg') ?? null;
  }

  function serializeSvg(svgEl: SVGSVGElement): string {
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    return new XMLSerializer().serializeToString(clone);
  }

  function safeFilename(): string {
    const base = mode === 'country' && country
      ? `${country.slug}-pyramid-${year}`
      : 'custom-pyramid';
    return base.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  }

  function downloadSVG() {
    const svgEl = getSvgEl();
    if (!svgEl) return;
    const svgString = serializeSvg(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadPNG(scale = 2) {
    const svgEl = getSvgEl();
    if (!svgEl) return;
    const svgString = serializeSvg(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      // Try to read declared width/height; fall back to viewBox values
      let w = parseFloat(svgEl.getAttribute('width') || '0');
      let h = parseFloat(svgEl.getAttribute('height') || '0');
      if (!w || !h) {
        const vb = (svgEl.getAttribute('viewBox') || '').split(/\s+/).map(parseFloat);
        if (vb.length === 4) { w = vb[2]; h = vb[3]; }
      }
      if (!w || !h) { w = 900; h = 540; }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${safeFilename()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert('PNG export failed — try downloading the SVG instead.');
    };
    img.src = url;
  }

  function copyShareLink() {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(
      () => alert('Link copied to clipboard.'),
      () => alert('Could not copy — select the URL from the address bar instead.')
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-pink-50 rounded-2xl border-2 border-blue-200 p-5 sm:p-7 mb-8 shadow-lg">
      <div className="flex flex-wrap items-baseline gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🛠️ Population Pyramid Maker</h2>
        <span className="text-xs text-gray-500">Pick a country, or enter your own numbers</span>
      </div>
      <p className="text-sm text-gray-700 mb-5">
        Generate a publication-quality population pyramid in seconds. Choose any country and year, or paste in
        your own age/sex breakdown — then download as PNG or SVG.
      </p>

      {/* Mode tabs */}
      <div className="inline-flex bg-white border-2 border-blue-300 rounded-lg overflow-hidden mb-5">
        <button
          type="button"
          onClick={() => setMode('country')}
          aria-pressed={mode === 'country'}
          className={`px-4 py-2 text-sm font-semibold transition ${mode === 'country' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
        >
          🌍 From a country
        </button>
        <button
          type="button"
          onClick={() => setMode('custom')}
          aria-pressed={mode === 'custom'}
          className={`px-4 py-2 text-sm font-semibold transition ${mode === 'custom' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
        >
          ✏️ From your own data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: inputs (mode-dependent) */}
        <div className="lg:col-span-5 space-y-4">
          {mode === 'country' ? (
            <>
              <div>
                <label htmlFor="pm-country" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <select
                  id="pm-country"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium bg-white"
                >
                  {countries.map(c => (
                    <option key={c.slug} value={c.slug}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pm-year" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Year: <span className="text-blue-700 tabular-nums">{year}</span>
                </label>
                <input
                  id="pm-year"
                  type="range"
                  min={yearsAvailable[0] ?? 1950}
                  max={yearsAvailable[yearsAvailable.length - 1] ?? 2025}
                  value={year}
                  onChange={e => setYear(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                  list="pm-year-ticks"
                />
                <datalist id="pm-year-ticks">
                  {[1950, 1970, 1990, 2010, 2025].filter(y => yearsAvailable.includes(y)).map(y => (
                    <option key={y} value={y} label={String(y)} />
                  ))}
                </datalist>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>{yearsAvailable[0] ?? 1950}</span>
                  <span>{yearsAvailable[yearsAvailable.length - 1] ?? 2025}</span>
                </div>
              </div>
            </>
          ) : (
            <CustomDataEditor rows={customRows} onChange={setCustomRows} />
          )}

          {/* Customization controls (shared by both modes) */}
          <details className="rounded-lg border border-gray-200 bg-white" open>
            <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
              🎨 Customize
            </summary>
            <div className="px-3 py-3 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  value={style.title}
                  placeholder={mode === 'country' && country ? `${country.name} Population Pyramid ${year}` : 'Custom Population Pyramid'}
                  onChange={e => setStyle(s => ({ ...s, title: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Subtitle</label>
                <input
                  type="text"
                  value={style.subtitle}
                  placeholder="e.g. UN data, July 2024"
                  onChange={e => setStyle(s => ({ ...s, subtitle: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Male color</label>
                  <input
                    type="color"
                    value={style.maleColor}
                    onChange={e => setStyle(s => ({ ...s, maleColor: e.target.value }))}
                    className="w-full h-8 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Female color</label>
                  <input
                    type="color"
                    value={style.femaleColor}
                    onChange={e => setStyle(s => ({ ...s, femaleColor: e.target.value }))}
                    className="w-full h-8 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={style.showGridlines}
                    onChange={e => setStyle(s => ({ ...s, showGridlines: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Gridlines
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={style.showPercentages}
                    onChange={e => setStyle(s => ({ ...s, showPercentages: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Show as %
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Caption / source</label>
                <input
                  type="text"
                  value={style.caption}
                  onChange={e => setStyle(s => ({ ...s, caption: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </details>

          {/* Download actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadPNG(2)}
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              ⬇️ Download PNG
            </button>
            <button
              type="button"
              onClick={downloadSVG}
              className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-700 rounded font-semibold hover:bg-blue-50 transition flex items-center gap-1.5"
            >
              ⬇️ Download SVG
            </button>
            {mode === 'country' && (
              <button
                type="button"
                onClick={copyShareLink}
                className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50 transition flex items-center gap-1.5"
              >
                🔗 Copy share link
              </button>
            )}
          </div>
        </div>

        {/* Right column: live preview + summary */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 sm:p-3" ref={svgWrapRef}>
            <PyramidSVG rows={activeRows} style={effectiveStyle} />
          </div>

          {/* Live summary */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="bg-blue-50 rounded p-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">total</div>
              <div className="text-base font-bold text-blue-700 tabular-nums">{summary.total.toLocaleString()}</div>
            </div>
            <div className="bg-emerald-50 rounded p-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">under 15</div>
              <div className="text-base font-bold text-emerald-700 tabular-nums">{summary.under15Share.toFixed(1)}%</div>
            </div>
            <div className="bg-amber-50 rounded p-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">65+</div>
              <div className="text-base font-bold text-amber-700 tabular-nums">{summary.over65Share.toFixed(1)}%</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Sex ratio: <strong>{summary.sexRatio.toFixed(1)}</strong> males per 100 females ·{' '}
            Largest cohort: <strong>{summary.largestBand.ageRange}</strong> ({summary.largestBand.share.toFixed(1)}%) ·{' '}
            Median band: <strong>{summary.medianAgeBand}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
