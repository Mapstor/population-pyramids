'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LifeExpectancyChart from './LifeExpectancyChart';
import {
  computeResult,
  clampBirthYear,
  fmtYears,
  fmtDelta,
  rankLabel,
  MIN_BIRTH_YEAR,
  MAX_BIRTH_YEAR,
  REFERENCE_YEAR,
  type Sex,
  type SlimCountryLE,
} from '@/lib/life-expectancy-helpers';

interface Props {
  slimCountries: SlimCountryLE[];
  defaultSlug: string;
  defaultBirthYear: number;
  defaultSex: Sex;
}

const SEX_OPTIONS: Array<{ value: Sex; label: string; emoji: string }> = [
  { value: 'total', label: 'Both averaged', emoji: '🌐' },
  { value: 'female', label: 'Female', emoji: '👩' },
  { value: 'male', label: 'Male', emoji: '👨' },
];

export default function LifeExpectancyCalculator({
  slimCountries,
  defaultSlug,
  defaultBirthYear,
  defaultSex,
}: Props) {
  const [slug, setSlug] = useState(defaultSlug);
  const [birthYearStr, setBirthYearStr] = useState(String(defaultBirthYear));
  const [sex, setSex] = useState<Sex>(defaultSex);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareSlug, setCompareSlug] = useState<string>('');

  // Hydrate from URL params after mount (SSR uses defaults; this enables ?country=…&birthYear=…&sex=…&compare=…).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qCountry = params.get('country');
    const qBirth = params.get('birthYear');
    const qSex = params.get('sex');
    const qCompare = params.get('compare');
    if (qCountry && slimCountries.some(c => c.slug === qCountry)) setSlug(qCountry);
    if (qBirth) {
      const n = parseInt(qBirth, 10);
      if (!Number.isNaN(n)) setBirthYearStr(String(clampBirthYear(n)));
    }
    if (qSex === 'male' || qSex === 'female' || qSex === 'total') setSex(qSex);
    if (qCompare && slimCountries.some(c => c.slug === qCompare)) {
      setCompareSlug(qCompare);
      setCompareEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror state back to the URL (replace, not push — keeps history clean).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('country', slug);
    params.set('birthYear', birthYearStr);
    params.set('sex', sex);
    if (compareEnabled && compareSlug) {
      params.set('compare', compareSlug);
    } else {
      params.delete('compare');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [slug, birthYearStr, sex, compareEnabled, compareSlug]);

  const country = useMemo(
    () => slimCountries.find(c => c.slug === slug) ?? slimCountries[0],
    [slug, slimCountries]
  );
  const compareCountry = useMemo(
    () => (compareEnabled && compareSlug ? slimCountries.find(c => c.slug === compareSlug) ?? null : null),
    [compareEnabled, compareSlug, slimCountries]
  );

  const birthYear = useMemo(() => {
    const n = parseInt(birthYearStr, 10);
    return clampBirthYear(n);
  }, [birthYearStr]);

  const result = useMemo(() => computeResult(country, birthYear, sex), [country, birthYear, sex]);
  const compareResult = useMemo(
    () => (compareCountry ? computeResult(compareCountry, birthYear, sex) : null),
    [compareCountry, birthYear, sex]
  );

  const yearsLeft = Math.max(0, result.expectedLifespan - result.currentAge);
  // Article-free so the prose reads "A 36-year-old woman in …" / "A 36-year-old in …" cleanly.
  const sexNoun = sex === 'female' ? 'woman ' : sex === 'male' ? 'man ' : '';
  const sexLabelShort = sex === 'female' ? 'women' : sex === 'male' ? 'men' : 'people';

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-2xl border-2 border-blue-200 p-5 sm:p-7 mb-8 shadow-lg">
      <div className="flex flex-wrap items-baseline gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🔮 Life Expectancy Calculator</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · estimate, not a prediction</span>
      </div>
      <p className="text-sm text-gray-700 mb-5">
        Enter your birth year, sex, and country to see how long people like you statistically live — and how that
        compares with the year you were born.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <label htmlFor="le-birth-year" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Birth year
          </label>
          <input
            id="le-birth-year"
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
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Sex</label>
          <div className="inline-flex w-full bg-white border-2 border-blue-300 rounded-lg overflow-hidden">
            {SEX_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSex(opt.value)}
                className={`flex-1 px-2 py-2.5 text-sm font-medium transition ${
                  sex === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
                aria-pressed={sex === opt.value}
              >
                <span className="mr-1">{opt.emoji}</span>
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden">{opt.value === 'total' ? 'Both' : opt.value === 'female' ? 'F' : 'M'}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="le-country" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Country
          </label>
          <select
            id="le-country"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium bg-white"
          >
            {slimCountries.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compare toggle + second picker */}
      <div className="mb-5">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={compareEnabled}
            onChange={e => {
              setCompareEnabled(e.target.checked);
              if (e.target.checked && !compareSlug) {
                // Default compare pick: world's #1 LE country if user is on USA, else USA.
                const fallback = slug === 'monaco' ? 'united-states' : 'monaco';
                setCompareSlug(fallback);
              }
            }}
            className="w-4 h-4 accent-amber-500"
          />
          <span className="font-medium">Compare with another country</span>
        </label>
        {compareEnabled && (
          <div className="mt-2">
            <select
              value={compareSlug}
              onChange={e => setCompareSlug(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-base font-medium bg-white"
            >
              <option value="">Select comparison country…</option>
              {slimCountries.filter(c => c.slug !== slug).map(c => (
                <option key={c.slug} value={c.slug}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Result card (SSR-rendered with defaults, updates on input) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your statistical lifespan</div>
          <div className="text-xs text-gray-500">{country.flag} {country.name} · {rankLabel(country.rank.position, country.rank.outOf)}</div>
        </div>

        <p className="text-lg sm:text-xl text-gray-900 leading-relaxed">
          A {result.currentAge}-year-old {sexNoun}in <strong>{country.name}</strong> can statistically expect to
          live to <strong className="text-blue-700 text-2xl sm:text-3xl tabular-nums">{fmtYears(result.expectedLifespan)}</strong>{' '}
          years — about <strong className="tabular-nums">{fmtYears(yearsLeft, 0)}</strong> more years from today, based on
          current UN mortality data.
        </p>

        {/* Stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">expected age</div>
            <div className="text-2xl font-bold text-blue-700 tabular-nums">{fmtYears(result.expectedLifespan)}</div>
            <div className="text-xs text-gray-600">years · ~{result.projectedDeathYear}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="text-[10px] uppercase tracking-wider text-green-700 font-bold">when you were born</div>
            <div className="text-2xl font-bold text-green-700 tabular-nums">
              {result.leAtBirth !== null ? fmtYears(result.leAtBirth) : '—'}
            </div>
            <div className="text-xs text-gray-600">
              {result.deltaSinceBirth !== null
                ? <>{fmtDelta(result.deltaSinceBirth)} years since</>
                : 'no historical data'}
            </div>
          </div>

          <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
            <div className="text-[10px] uppercase tracking-wider text-rose-700 font-bold">sex gap</div>
            <div className="text-2xl font-bold text-rose-700 tabular-nums">
              +{fmtYears(result.sexGapYears)}
            </div>
            <div className="text-xs text-gray-600">F live longer than M</div>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">vs world avg</div>
            <div className={`text-2xl font-bold tabular-nums ${result.vsWorld >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {fmtDelta(result.vsWorld)}
            </div>
            <div className="text-xs text-gray-600">world: {fmtYears(result.worldAvg)} yrs</div>
          </div>
        </div>

        {/* Insight bullets */}
        <ul className="mt-5 space-y-2 text-sm text-gray-700">
          {result.deltaSinceBirth !== null && Math.abs(result.deltaSinceBirth) >= 0.5 && (
            <li className="flex gap-2">
              <span aria-hidden>📈</span>
              <span>
                When you were born in <strong>{birthYear}</strong>, life expectancy in {country.name} was{' '}
                <strong>{fmtYears(result.leAtBirth!)} years</strong>. Today it's{' '}
                <strong>{fmtYears(result.expectedLifespan)}</strong> —{' '}
                <strong className={result.deltaSinceBirth > 0 ? 'text-emerald-700' : 'text-red-600'}>
                  {result.deltaSinceBirth > 0 ? 'gained' : 'lost'} {fmtYears(Math.abs(result.deltaSinceBirth))} years
                </strong>{' '}
                in your lifetime.
              </span>
            </li>
          )}
          {result.projectedAt65 !== null && (
            <li className="flex gap-2">
              <span aria-hidden>🔮</span>
              <span>
                By the time you turn 65 (in {birthYear + 65}), the UN projects {country.name}'s life expectancy
                to be <strong>{fmtYears(result.projectedAt65)} years</strong>.
              </span>
            </li>
          )}
          <li className="flex gap-2">
            <span aria-hidden>🌍</span>
            <span>
              {country.name} ranks <strong>{rankLabel(country.rank.position, country.rank.outOf)}</strong> globally.
              The world average is {fmtYears(result.worldAvg)} years for {sexLabelShort}.
            </span>
          </li>
        </ul>

        {/* Compare panel */}
        {compareResult && (
          <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                vs {compareResult.country.flag} {compareResult.country.name}
              </div>
              <div className="text-xs text-amber-700">rank {rankLabel(compareResult.country.rank.position, compareResult.country.rank.outOf)}</div>
            </div>
            <p className="text-sm text-gray-800">
              A {compareResult.currentAge}-year-old {sexNoun}in <strong>{compareResult.country.name}</strong>{' '}
              expects to live to <strong>{fmtYears(compareResult.expectedLifespan)} years</strong>.{' '}
              {compareResult.expectedLifespan > result.expectedLifespan ? (
                <>That's <strong className="text-emerald-700">+{fmtYears(compareResult.expectedLifespan - result.expectedLifespan)} years longer</strong> than in {country.name}.</>
              ) : compareResult.expectedLifespan < result.expectedLifespan ? (
                <>That's <strong className="text-red-600">{fmtYears(compareResult.expectedLifespan - result.expectedLifespan)} years shorter</strong> than in {country.name}.</>
              ) : (
                <>The two are essentially identical.</>
              )}
            </p>
          </div>
        )}

        {/* Honest framing */}
        <p className="mt-5 text-xs text-gray-500 italic border-t border-gray-100 pt-3">
          ⓘ This is a statistical estimate from current UN mortality data for {country.name} — not a personal health
          prediction. Life expectancy at birth is a period measure: what a newborn would live if today's age-specific
          mortality rates remained constant. Per-age conditional probabilities (e.g., "chance of reaching 90") require
          full UN life tables and are not shown in this version.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">📊 Life expectancy trend, 1950–2100</h3>
          <span className="text-xs text-gray-500">UN WPP 2024 · interpolated between estimate &amp; projection points</span>
        </div>
        <LifeExpectancyChart
          primary={country}
          compare={compareCountry}
          birthYear={birthYear}
          sex={sex}
          worldAverage={result.worldAvg}
        />
        <p className="text-xs text-gray-600 mt-3">
          The shaded region is your lifetime so far ({birthYear}–{REFERENCE_YEAR}). The red dot marks the country's
          life-expectancy value in the year you'd statistically reach it.
        </p>
      </div>

      {/* Share link helper */}
      <div className="mt-4 text-xs text-gray-500">
        Tip: this URL updates as you change inputs — copy and share to send your result.{' '}
        <Link href="/generations" className="text-blue-700 hover:text-blue-900 underline">
          See what generation you belong to →
        </Link>
      </div>
    </section>
  );
}
