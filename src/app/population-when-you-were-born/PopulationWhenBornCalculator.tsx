'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PopulationCurveChart from './PopulationCurveChart';
import {
  computeResult,
  clampBirthYear,
  fmtPop,
  fmtPercent,
  fmtMultiplier,
  fmtDeltaSign,
  MIN_BIRTH_YEAR,
  MAX_BIRTH_YEAR,
  REFERENCE_YEAR,
  HEADLINE_SLUGS,
  type SlimPlace,
} from '@/lib/population-when-born-helpers';

interface Props {
  places: SlimPlace[];     // includes 'world' + 195 country slugs
  defaultSlug: string;     // 'world'
  defaultBirthYear: number;// 1990
}

export default function PopulationWhenBornCalculator({ places, defaultSlug, defaultBirthYear }: Props) {
  const [slug, setSlug] = useState(defaultSlug);
  const [birthYearStr, setBirthYearStr] = useState(String(defaultBirthYear));

  // Hydrate from URL params after mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qPlace = params.get('country') || params.get('place');
    const qYear = params.get('birthYear') || params.get('year');
    if (qPlace && places.some(p => p.slug === qPlace)) setSlug(qPlace);
    if (qYear) {
      const n = parseInt(qYear, 10);
      if (!Number.isNaN(n)) setBirthYearStr(String(clampBirthYear(n)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror state back to the URL so users can share their result.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('country', slug);
    params.set('birthYear', birthYearStr);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [slug, birthYearStr]);

  const place = useMemo(() => places.find(p => p.slug === slug) ?? places[0], [slug, places]);
  const birthYear = useMemo(() => clampBirthYear(parseInt(birthYearStr, 10)), [birthYearStr]);
  const result = useMemo(() => computeResult(place, birthYear), [place, birthYear]);

  const isWorld = place.slug === 'world';
  const placeLabel = isWorld ? 'the world' : place.name;

  // Headline comparison grid — fixed list of major countries plus world anchor
  const compareList = useMemo(() => {
    const items: SlimPlace[] = [];
    const worldPlace = places.find(p => p.slug === 'world');
    if (worldPlace) items.push(worldPlace);
    for (const headSlug of HEADLINE_SLUGS) {
      const found = places.find(p => p.slug === headSlug);
      if (found) items.push(found);
    }
    return items;
  }, [places]);

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 rounded-2xl border-2 border-blue-200 p-5 sm:p-7 mb-8 shadow-lg">
      <div className="flex flex-wrap items-baseline gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🌍 Population When You Were Born</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · 1950–{REFERENCE_YEAR - 1}</span>
      </div>
      <p className="text-sm text-gray-700 mb-5">
        Enter your birth year and pick a country (or stay on World) to see how much the population has grown
        since the day you were born.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="pwb-birth-year" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Birth year
          </label>
          <input
            id="pwb-birth-year"
            type="number"
            inputMode="numeric"
            min={MIN_BIRTH_YEAR}
            max={MAX_BIRTH_YEAR}
            value={birthYearStr}
            onChange={e => setBirthYearStr(e.target.value)}
            onBlur={() => setBirthYearStr(String(clampBirthYear(parseInt(birthYearStr, 10))))}
            className="w-full px-3 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">{MIN_BIRTH_YEAR}–{MAX_BIRTH_YEAR} · age {result.currentAge}</p>
        </div>

        <div>
          <label htmlFor="pwb-place" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Place
          </label>
          <select
            id="pwb-place"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium bg-white"
          >
            {places.map(p => (
              <option key={p.slug} value={p.slug}>
                {p.flag} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero answer card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-5">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          When you were born…
        </div>

        {result.popAtBirth !== null && result.multiplier !== null && result.growthAbsolute !== null ? (
          <p className="text-lg sm:text-xl text-gray-900 leading-relaxed">
            In <strong>{birthYear}</strong>, {placeLabel} had <strong className="text-blue-700 text-2xl sm:text-3xl tabular-nums">{fmtPop(result.popAtBirth)}</strong>{' '}
            people. Today there are <strong className="text-emerald-700 text-2xl sm:text-3xl tabular-nums">{fmtPop(result.popToday)}</strong> —
            that's <strong className="tabular-nums">{fmtDeltaSign(result.growthAbsolute)}{fmtPop(Math.abs(result.growthAbsolute))}</strong>{' '}
            people{' '}
            {result.multiplier > 1
              ? <>more than the year you were born — a <strong className="text-amber-700">{fmtMultiplier(result.multiplier)}</strong> increase ({result.growthPercent !== null && result.growthPercent > 0 ? '+' : ''}{result.growthPercent !== null ? fmtPercent(result.growthPercent) : '—'}) in your lifetime.</>
              : result.multiplier < 1
              ? <>fewer ({fmtMultiplier(result.multiplier)}, {result.growthPercent !== null ? fmtPercent(result.growthPercent) : '—'}) — {placeLabel} is one of the few places that has lost population in your lifetime.</>
              : <>essentially the same as the year you were born.</>}
          </p>
        ) : (
          <p className="text-base text-gray-700">
            No population data for {placeLabel} in {birthYear}. Try another year.
          </p>
        )}

        {/* Stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">pop in {birthYear}</div>
            <div className="text-2xl font-bold text-blue-700 tabular-nums">{result.popAtBirth !== null ? fmtPop(result.popAtBirth) : '—'}</div>
            <div className="text-xs text-gray-600">{placeLabel}</div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">pop today</div>
            <div className="text-2xl font-bold text-emerald-700 tabular-nums">{fmtPop(result.popToday)}</div>
            <div className="text-xs text-gray-600">{placeLabel}</div>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">growth multiplier</div>
            <div className="text-2xl font-bold text-amber-700 tabular-nums">
              {result.multiplier !== null ? fmtMultiplier(result.multiplier) : '—'}
            </div>
            <div className="text-xs text-gray-600">
              {result.growthPercent !== null
                ? <>{result.growthPercent > 0 ? '+' : ''}{fmtPercent(result.growthPercent)}</>
                : 'no baseline'}
            </div>
          </div>

          <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
            <div className="text-[10px] uppercase tracking-wider text-rose-700 font-bold">older than you</div>
            <div className="text-2xl font-bold text-rose-700 tabular-nums">{fmtPercent(result.fractionOlder * 100, 0)}</div>
            <div className="text-xs text-gray-600">
              {fmtPercent(result.fractionYoungerOrSame * 100, 0)} younger or same
            </div>
          </div>
        </div>

        {/* Insight bullets */}
        <ul className="mt-5 space-y-2 text-sm text-gray-700">
          {result.popDayOfBirthYearDelta !== null && result.popDayOfBirthYearDelta > 0 && (
            <li className="flex gap-2">
              <span aria-hidden>👶</span>
              <span>
                In {birthYear}, {placeLabel}'s population grew by about{' '}
                <strong className="tabular-nums">{fmtPop(result.popDayOfBirthYearDelta)}</strong> people — net additions
                that year, the broad cohort you joined.
              </span>
            </li>
          )}
          <li className="flex gap-2">
            <span aria-hidden>🎂</span>
            <span>
              Out of {placeLabel}'s {fmtPop(result.popToday)} people today, roughly{' '}
              <strong>{fmtPercent(result.fractionOlder * 100, 0)} are older than you</strong>,{' '}
              {fmtPercent(result.fractionYoungerOrSame * 100, 0)} are younger or the same age.
            </span>
          </li>
          {result.multiplier !== null && Math.abs(result.multiplier - 1) > 0.05 && (
            <li className="flex gap-2">
              <span aria-hidden>📈</span>
              <span>
                On average, {placeLabel}'s population{' '}
                {result.multiplier > 1
                  ? <>has grown by about <strong>{fmtPop(result.growthAbsolute! / Math.max(1, result.currentAge))}</strong> people per year</>
                  : <>has shrunk by about <strong>{fmtPop(Math.abs(result.growthAbsolute!) / Math.max(1, result.currentAge))}</strong> people per year</>}
                {' '}across your lifetime.
              </span>
            </li>
          )}
        </ul>

        <p className="mt-5 text-xs text-gray-500 italic border-t border-gray-100 pt-3">
          ⓘ Population figures from UN World Population Prospects 2024 (medium-variant estimates).
          "Today" reflects the latest year in the dataset ({REFERENCE_YEAR - 1}).
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">📊 Population curve 1950–{REFERENCE_YEAR - 1}</h3>
          <span className="text-xs text-gray-500">{place.flag} {place.name} · UN WPP 2024</span>
        </div>
        <PopulationCurveChart place={place} birthYear={birthYear} />
        <p className="text-xs text-gray-600 mt-3">
          The shaded amber band is your lifetime so far ({birthYear}–{REFERENCE_YEAR - 1}). The badge inside it shows
          the multiplier — how many times bigger {placeLabel} is now versus when you were born.
        </p>
      </div>

      {/* Headline comparison grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">How other places grew in your lifetime</h3>
          <span className="text-xs text-gray-500">since {birthYear} · click a card to switch</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {compareList.map(p => {
            const r = computeResult(p, birthYear);
            const active = p.slug === slug;
            return (
              <button
                key={p.slug}
                onClick={() => setSlug(p.slug)}
                aria-pressed={active}
                className={`text-left rounded-lg border-2 p-3 transition hover:shadow-md ${
                  active
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-baseline justify-between gap-1 mb-1">
                  <div className="font-bold text-sm text-gray-900 truncate">{p.flag} {p.name}</div>
                  {r.multiplier !== null && (
                    <div className={`text-xs font-bold ${
                      r.multiplier >= 2 ? 'text-emerald-700' : r.multiplier >= 1.2 ? 'text-blue-700' : r.multiplier < 1 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {fmtMultiplier(r.multiplier)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  {r.popAtBirth !== null ? fmtPop(r.popAtBirth) : '—'} → {fmtPop(r.popToday)}
                </div>
                {r.growthPercent !== null && (
                  <div className={`text-xs font-medium mt-1 ${r.growthPercent > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {r.growthPercent > 0 ? '+' : ''}{fmtPercent(r.growthPercent)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Share helper */}
      <div className="mt-4 text-xs text-gray-500">
        Tip: this URL updates as you change inputs — copy and share to send your result.{' '}
        <Link href="/generations" className="text-blue-700 hover:text-blue-900 underline">
          See what generation you belong to →
        </Link>{' '}
        ·{' '}
        <Link href="/life-expectancy-by-country" className="text-blue-700 hover:text-blue-900 underline">
          See how long you'll live →
        </Link>
      </div>
    </section>
  );
}
