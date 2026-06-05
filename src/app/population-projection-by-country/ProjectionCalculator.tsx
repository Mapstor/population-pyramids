'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProjectionChart from './ProjectionChart';
import {
  computeResult,
  clampYear,
  fmtPop,
  fmtPercent,
  fmtSign,
  trajectoryFor,
  PROJECTION_MIN_YEAR,
  PROJECTION_MAX_YEAR,
  PROJECTION_REFERENCE_YEAR,
  type SlimProjection,
} from '@/lib/population-projection-helpers';

interface Props {
  places: SlimProjection[];               // alphabetical, world at index 0
  defaultSlug: string;
  defaultYear: number;
  defaultBirthYear: number;               // optional identity-hook input
}

export default function ProjectionCalculator({ places, defaultSlug, defaultYear, defaultBirthYear }: Props) {
  const [slug, setSlug] = useState(defaultSlug);
  const [yearStr, setYearStr] = useState(String(defaultYear));
  const [birthYearStr, setBirthYearStr] = useState(String(defaultBirthYear));
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareSlug, setCompareSlug] = useState<string>('united-states');

  // Hydrate from URL params after mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const qSlug = p.get('country');
    const qYear = p.get('year');
    const qBirth = p.get('birthYear');
    const qCompare = p.get('compare');
    if (qSlug && places.some(x => x.slug === qSlug)) setSlug(qSlug);
    if (qYear) setYearStr(String(clampYear(parseInt(qYear, 10))));
    if (qBirth) setBirthYearStr(qBirth);
    if (qCompare && places.some(x => x.slug === qCompare)) {
      setCompareSlug(qCompare);
      setCompareEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL mirror
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    p.set('country', slug);
    p.set('year', yearStr);
    if (birthYearStr) p.set('birthYear', birthYearStr); else p.delete('birthYear');
    if (compareEnabled && compareSlug) p.set('compare', compareSlug); else p.delete('compare');
    window.history.replaceState(null, '', `${window.location.pathname}?${p.toString()}`);
  }, [slug, yearStr, birthYearStr, compareEnabled, compareSlug]);

  const place = useMemo(() => places.find(p => p.slug === slug) ?? places[0], [slug, places]);
  const compare = useMemo(
    () => (compareEnabled ? places.find(p => p.slug === compareSlug) ?? null : null),
    [compareEnabled, compareSlug, places]
  );
  const year = clampYear(parseInt(yearStr, 10));
  const birthYear = parseInt(birthYearStr, 10);
  const result = useMemo(() => computeResult(place, year), [place, year]);
  const compareResult = useMemo(() => (compare ? computeResult(compare, year) : null), [compare, year]);

  const trajectory = trajectoryFor(place);
  const trajLabel =
    trajectory === 'past-peak' ? '📉 Already past peak'
    : trajectory === 'rapid-growth' ? '🚀 Rapid growth ahead'
    : trajectory === 'moderate-growth' ? '➡️ Moderate growth'
    : '⚖️ Plateauing';

  // Identity-hook computation: where will the world (or country) be when user reaches a milestone?
  const currentAge = Number.isFinite(birthYear) ? Math.max(0, PROJECTION_REFERENCE_YEAR - birthYear) : null;
  const yearAt65 = Number.isFinite(birthYear) ? birthYear + 65 : null;
  const yearAt80 = Number.isFinite(birthYear) ? birthYear + 80 : null;
  const popAt65 = yearAt65 && yearAt65 <= 2100 ? place.values[String(clampYear(yearAt65))] : null;
  const popAt80 = yearAt80 && yearAt80 <= 2100 ? place.values[String(clampYear(yearAt80))] : null;

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-2xl border-2 border-indigo-200 p-5 sm:p-7 mb-8 shadow-lg">
      <div className="flex flex-wrap items-baseline gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🔮 Population Projection Calculator</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 medium variant · 1950 → 2100</span>
      </div>
      <p className="text-sm text-gray-700 mb-5">
        Pick any country and a future year to see UN's medium-variant population projection. Add a comparison
        country, or your birth year for a personal angle ("when I turn 65, the world will be…").
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label htmlFor="pp-place" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Country
          </label>
          <select
            id="pp-place"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base font-medium bg-white"
          >
            {places.map(p => (
              <option key={p.slug} value={p.slug}>
                {p.flag} {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pp-year" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Projection year: <span className="text-indigo-700 tabular-nums">{year}</span>
          </label>
          <input
            id="pp-year"
            type="range"
            min={PROJECTION_REFERENCE_YEAR}
            max={PROJECTION_MAX_YEAR}
            value={yearStr}
            onChange={e => setYearStr(e.target.value)}
            className="w-full accent-indigo-600"
            list="pp-year-ticks"
          />
          <datalist id="pp-year-ticks">
            {[2025, 2030, 2040, 2050, 2060, 2075, 2100].map(y => (
              <option key={y} value={y} label={String(y)} />
            ))}
          </datalist>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>2025</span><span>2050</span><span>2075</span><span>2100</span>
          </div>
        </div>
      </div>

      {/* Optional birth year for identity hook */}
      <div className="mb-3">
        <label htmlFor="pp-birth" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          Your birth year <span className="text-gray-400 font-normal">(optional — for personal milestones)</span>
        </label>
        <input
          id="pp-birth"
          type="number"
          inputMode="numeric"
          min={1925}
          max={2025}
          value={birthYearStr}
          onChange={e => setBirthYearStr(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 1990"
        />
      </div>

      {/* Compare-with toggle */}
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
            <select
              value={compareSlug}
              onChange={e => setCompareSlug(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-base font-medium bg-white"
            >
              {places.filter(p => p.slug !== slug).map(p => (
                <option key={p.slug} value={p.slug}>{p.flag} {p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hero answer card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">UN projection</div>
          <div className="text-xs text-gray-500">{place.flag} {place.name} · {trajLabel}</div>
        </div>
        {result.popAtYear !== null ? (
          <p className="text-lg sm:text-xl text-gray-900 leading-relaxed">
            In <strong className="text-indigo-700 tabular-nums">{year}</strong>, <strong>{place.name}</strong> is
            projected to have <strong className="text-indigo-700 text-2xl sm:text-3xl tabular-nums">{fmtPop(result.popAtYear)}</strong> people —{' '}
            {result.delta !== null && Math.abs(result.delta) > 0 && (
              <>
                <strong>{fmtSign(result.delta)}{fmtPop(Math.abs(result.delta))}</strong>{' '}
                ({result.growthPercent !== null && result.growthPercent !== 0 ? <>{fmtSign(result.growthPercent)}{fmtPercent(Math.abs(result.growthPercent))}</> : '±0%'}){' '}
                vs <strong className="tabular-nums">{fmtPop(result.popToday)}</strong> today.
              </>
            )}
            {result.delta === 0 && <> roughly the same as today.</>}
          </p>
        ) : (
          <p className="text-base text-gray-700">No projection data for {place.name} in {year}.</p>
        )}

        {/* Peak callout */}
        {place.peakYear !== null && (
          <div className={`mt-4 p-4 rounded-lg border ${result.hasPeaked ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${result.hasPeaked ? 'text-rose-700' : 'text-emerald-700'}`}>
              {result.hasPeaked ? '📉 Already past peak' : '🚀 Peak coming'}
            </div>
            <p className="text-sm text-gray-800">
              {result.hasPeaked ? (
                <>
                  {place.name} peaked at <strong>{fmtPop(place.peakPopulation)}</strong> in <strong>{place.peakYear}</strong>{' '}
                  — that's <strong>{Math.abs(result.yearsToOrFromPeak ?? 0)} years ago</strong>. Population is now declining.
                </>
              ) : place.peakYear < 2100 ? (
                <>
                  UN projects {place.name}'s population to peak at <strong>{fmtPop(place.peakPopulation)}</strong> in{' '}
                  <strong>{place.peakYear}</strong> — about <strong>{result.yearsToOrFromPeak} years from now</strong> — then decline.
                </>
              ) : (
                <>
                  UN projects {place.name} still growing through 2100, reaching <strong>{fmtPop(place.peakPopulation)}</strong> people. No peak yet within the projection window.
                </>
              )}
            </p>
          </div>
        )}

        {/* Stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">today (2025)</div>
            <div className="text-2xl font-bold text-blue-700 tabular-nums">{fmtPop(place.pop2025)}</div>
            <div className="text-xs text-gray-600">people</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            <div className="text-[10px] uppercase tracking-wider text-indigo-700 font-bold">2050</div>
            <div className="text-2xl font-bold text-indigo-700 tabular-nums">{fmtPop(place.pop2050)}</div>
            <div className="text-xs text-gray-600">
              {place.pop2025 > 0 && <>{fmtSign(place.pop2050 - place.pop2025)}{fmtPercent(((place.pop2050 - place.pop2025) / place.pop2025) * 100)}</>}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">2100</div>
            <div className="text-2xl font-bold text-purple-700 tabular-nums">{fmtPop(place.pop2100)}</div>
            <div className="text-xs text-gray-600">
              {place.pop2025 > 0 && <>{fmtSign(place.pop2100 - place.pop2025)}{fmtPercent(((place.pop2100 - place.pop2025) / place.pop2025) * 100)}</>}
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">peak</div>
            <div className="text-2xl font-bold text-amber-700 tabular-nums">
              {place.peakYear !== null ? (place.peakYear === 2100 ? '>2100' : place.peakYear) : '—'}
            </div>
            <div className="text-xs text-gray-600">
              {place.peakYear !== null ? fmtPop(place.peakPopulation) : ''}
            </div>
          </div>
        </div>

        {/* Birth-year identity insights */}
        {currentAge !== null && currentAge >= 0 && currentAge <= 130 && (
          <ul className="mt-5 space-y-2 text-sm text-gray-700">
            {popAt65 && (
              <li className="flex gap-2">
                <span aria-hidden>🎂</span>
                <span>
                  When you turn <strong>65</strong> in <strong>{yearAt65}</strong>, {place.name}'s population is projected to be{' '}
                  <strong className="tabular-nums">{fmtPop(popAt65)}</strong>{' '}
                  ({fmtSign(popAt65 - place.pop2025)}{fmtPercent(((popAt65 - place.pop2025) / place.pop2025) * 100)} vs today).
                </span>
              </li>
            )}
            {popAt80 && (
              <li className="flex gap-2">
                <span aria-hidden>🔮</span>
                <span>
                  When you turn <strong>80</strong> in <strong>{yearAt80}</strong>: <strong className="tabular-nums">{fmtPop(popAt80)}</strong>{' '}
                  ({fmtSign(popAt80 - place.pop2025)}{fmtPercent(((popAt80 - place.pop2025) / place.pop2025) * 100)} vs today).
                </span>
              </li>
            )}
          </ul>
        )}

        {/* Compare callout */}
        {compareResult && compareResult.popAtYear !== null && result.popAtYear !== null && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              vs {compare!.flag} {compare!.name}
            </div>
            <p className="text-sm text-gray-800">
              In {year}, <strong>{compare!.name}</strong> is projected at{' '}
              <strong>{fmtPop(compareResult.popAtYear)}</strong> ({fmtSign(compareResult.delta ?? 0)}{fmtPercent(Math.abs(compareResult.growthPercent ?? 0))} vs its 2025).
              {' '}{compareResult.popAtYear < result.popAtYear
                ? <>That's <strong>{fmtPop(result.popAtYear - compareResult.popAtYear)} fewer</strong> people than {place.name}.</>
                : <>That's <strong>{fmtPop(compareResult.popAtYear - result.popAtYear)} more</strong> people than {place.name}.</>}
            </p>
          </div>
        )}

        <p className="mt-5 text-xs text-gray-500 italic border-t border-gray-100 pt-3">
          ⓘ Source: UN World Population Prospects 2024 Revision, medium variant (population.un.org/wpp).
          UN also publishes low- and high-variant projections that diverge substantially after 2050 —
          the medium variant is the central published estimate.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">📈 Population trajectory 1950 → 2100</h3>
          <span className="text-xs text-gray-500">{place.flag} {place.name}{compare ? ` vs ${compare.flag} ${compare.name}` : ''}</span>
        </div>
        <ProjectionChart primary={place} compare={compare} targetYear={year} />
        <p className="text-xs text-gray-600 mt-3">
          Solid blue line: UN estimates 1950–2024 (history). Dashed line: medium-variant projection 2025–2100.
          Green marker is 2025 (today); purple marker tracks the slider year; red marker (if shown) is the
          projected peak.
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Tip: this URL updates as you change inputs — copy and share.{' '}
        <Link href="/population-when-you-were-born" className="text-blue-700 hover:text-blue-900 underline">
          See world population when you were born →
        </Link>{' '}·{' '}
        <Link href="/life-expectancy-by-country" className="text-blue-700 hover:text-blue-900 underline">
          How long will I live? →
        </Link>
      </div>
    </section>
  );
}
