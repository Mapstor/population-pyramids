'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import DensityChart from './DensityChart';
import {
  computeResult,
  fmtDensity,
  fmtPop,
  fmtArea,
  fmtRatio,
  rankLabel,
  categoryFor,
  KM2_TO_MI2,
  type SlimDensityPlace,
} from '@/lib/population-density-helpers';

interface Props {
  places: SlimDensityPlace[];               // alphabetical
  sortedByDensity: SlimDensityPlace[];      // sorted desc for rank lookup
  defaultSlug: string;                      // 'bangladesh' (large + dense)
  defaultCompareSlug: string;               // 'united-states' (familiar reference)
}

export default function DensityCalculator({
  places,
  sortedByDensity,
  defaultSlug,
  defaultCompareSlug,
}: Props) {
  const [slug, setSlug] = useState(defaultSlug);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareSlug, setCompareSlug] = useState(defaultCompareSlug);
  const [unit, setUnit] = useState<'km2' | 'mi2'>('km2');

  // Hydrate from URL params after mount. If URL specifies ?compare=, auto-enable.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const a = p.get('country');
    const b = p.get('compare');
    const u = p.get('unit');
    if (a && places.some(x => x.slug === a)) setSlug(a);
    if (b && places.some(x => x.slug === b)) {
      setCompareSlug(b);
      setCompareEnabled(true);
    }
    if (u === 'km2' || u === 'mi2') setUnit(u);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror state back to URL — only set ?compare= when comparison is on.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    p.set('country', slug);
    if (compareEnabled && compareSlug) {
      p.set('compare', compareSlug);
    } else {
      p.delete('compare');
    }
    p.set('unit', unit);
    window.history.replaceState(null, '', `${window.location.pathname}?${p.toString()}`);
  }, [slug, compareEnabled, compareSlug, unit]);

  const place = useMemo(() => places.find(p => p.slug === slug) ?? places[0], [slug, places]);
  const compare = useMemo(
    () => (compareEnabled ? places.find(p => p.slug === compareSlug) : undefined),
    [compareEnabled, compareSlug, places]
  );
  const result = useMemo(() => computeResult(place, compare, sortedByDensity), [place, compare, sortedByDensity]);

  const useKm = unit === 'km2';
  const showDensity = (d: number) => useKm ? fmtDensity(d) : fmtDensity(d * KM2_TO_MI2);
  const unitLabel = useKm ? '/km²' : '/mi²';
  const category = categoryFor(place.densityKm2);

  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-amber-50 rounded-2xl border-2 border-purple-200 p-5 sm:p-7 mb-8 shadow-lg">
      <div className="flex flex-wrap items-baseline gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🏙️ Population Density Calculator</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 + CIA World Factbook (area)</span>
      </div>
      <p className="text-sm text-gray-700 mb-5">
        Pick any country and compare its crowding to another. See the "what if" thought experiment: if
        one country had the other's density, how many people would it have?
      </p>

      {/* Inputs — primary country + units (compare moved below as opt-in) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label htmlFor="pd-place" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Country
          </label>
          <select
            id="pd-place"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base font-medium bg-white"
          >
            {places.map(p => (
              <option key={p.slug} value={p.slug}>
                {p.flag} {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Units</label>
          <div className="inline-flex w-full bg-white border-2 border-purple-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setUnit('km2')}
              aria-pressed={useKm}
              className={`flex-1 px-3 py-2.5 text-sm font-medium transition ${useKm ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}
            >
              per km²
            </button>
            <button
              type="button"
              onClick={() => setUnit('mi2')}
              aria-pressed={!useKm}
              className={`flex-1 px-3 py-2.5 text-sm font-medium transition ${!useKm ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}
            >
              per mi²
            </button>
          </div>
        </div>
      </div>

      {/* Compare-with: explicitly optional, opt-in via toggle */}
      <div className="mb-5">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={compareEnabled}
            onChange={e => setCompareEnabled(e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          <span className="font-medium">Compare with another country <span className="text-gray-400 font-normal">(optional)</span></span>
        </label>
        {compareEnabled && (
          <div className="mt-2">
            <label htmlFor="pd-compare" className="sr-only">Comparison country</label>
            <select
              id="pd-compare"
              value={compareSlug}
              onChange={e => setCompareSlug(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-base font-medium bg-white"
            >
              {places.filter(p => p.slug !== slug).map(p => (
                <option key={p.slug} value={p.slug}>
                  {p.flag} {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hero answer */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Population density of {place.name}</div>
          <div className="text-xs text-gray-500">
            {place.flag} {place.name} · {rankLabel(result.rank, result.outOf)} most densely populated
          </div>
        </div>

        <p className="text-lg sm:text-xl text-gray-900 leading-relaxed">
          <strong>{place.name}</strong> has about{' '}
          <strong className="text-purple-700 text-2xl sm:text-3xl tabular-nums">{showDensity(place.densityKm2)}</strong>{' '}
          people{unitLabel} — <strong>{fmtPop(place.popLatest)}</strong> people on{' '}
          <strong>{fmtArea(place.areaKm2)}</strong> of land. That's <strong>{category.label.toLowerCase()}</strong>.
          {compare && result.ratio !== null && (
            <>
              {' '}It is{' '}
              <strong>
                {result.ratio >= 1
                  ? `${fmtRatio(result.ratio)} denser`
                  : `${fmtRatio(1 / result.ratio)} sparser`}
              </strong>{' '}
              than <strong>{compare.name}</strong> ({showDensity(compare.densityKm2)} people{unitLabel}).
            </>
          )}
        </p>

        {/* Stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">density</div>
            <div className="text-2xl font-bold text-purple-700 tabular-nums">{showDensity(place.densityKm2)}</div>
            <div className="text-xs text-gray-600">people{unitLabel}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">population</div>
            <div className="text-2xl font-bold text-blue-700 tabular-nums">{fmtPop(place.popLatest)}</div>
            <div className="text-xs text-gray-600">people · {place.popLatest.toLocaleString()}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">land area</div>
            <div className="text-2xl font-bold text-emerald-700 tabular-nums">{fmtArea(place.areaKm2)}</div>
            <div className="text-xs text-gray-600">{(place.areaKm2 * KM2_TO_MI2).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} mi²</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">global rank</div>
            <div className="text-2xl font-bold text-amber-700 tabular-nums">#{result.rank}</div>
            <div className="text-xs text-gray-600">of {result.outOf} ranked</div>
          </div>
        </div>

        {/* "What if" thought experiment */}
        {compare && result.popIfCompareDensity !== null && result.popIfPrimaryDensity !== null && (
          <div className="mt-5 p-4 bg-gradient-to-br from-amber-50 to-purple-50 border border-amber-200 rounded-lg">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              💭 The "what if" thought experiment
            </div>
            <ul className="space-y-2 text-sm text-gray-800">
              <li>
                <span className="font-semibold">If {place.name} had {compare.name}'s density</span>, it would hold{' '}
                <strong className="text-purple-700 tabular-nums">{fmtPop(result.popIfCompareDensity)}</strong> people
                {' '}(<span className="text-gray-600">today: {fmtPop(place.popLatest)}</span>).
              </li>
              <li>
                <span className="font-semibold">If {compare.name} had {place.name}'s density</span>, it would hold{' '}
                <strong className="text-amber-700 tabular-nums">{fmtPop(result.popIfPrimaryDensity)}</strong> people
                {' '}(<span className="text-gray-600">today: {fmtPop(compare.popLatest)}</span>).
              </li>
            </ul>
          </div>
        )}

        <p className="mt-5 text-xs text-gray-500 italic border-t border-gray-100 pt-3">
          ⓘ Density = total population ÷ land area. Land area excludes inland water bodies (CIA Factbook
          methodology). National density is the country-wide average — local density varies wildly inside
          most countries (a country with low average density can still have very dense cities).
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">📈 Density over time, 1950–2025</h3>
          <span className="text-xs text-gray-500">{place.flag} {place.name}{compare ? ` vs ${compare.flag} ${compare.name}` : ''}</span>
        </div>
        <DensityChart primary={place} compare={compare ?? null} />
        <p className="text-xs text-gray-600 mt-3">
          Density rises as population grows on essentially-constant land area. The shape mirrors the
          population curve. UN WPP 2024 population × CIA World Factbook area.
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Tip: this URL updates as you change inputs — copy and share to send your comparison.{' '}
        <Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 underline">
          See most populated countries →
        </Link>{' '}
        ·{' '}
        <Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 underline">
          See largest by area →
        </Link>
      </div>
    </section>
  );
}
