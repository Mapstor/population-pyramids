'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import FertilityRateChart from './FertilityRateChart';
import {
  computeFertilityResult,
  clampBirthYear,
  fmtTFR,
  fmtCBR,
  fmtDeltaTFR,
  fmtDeltaCBR,
  rankLabel,
  MIN_BIRTH_YEAR,
  MAX_BIRTH_YEAR,
  REPLACEMENT_TFR,
  type SlimFertility,
} from '@/lib/fertility-rate-helpers';

interface Props {
  countries: SlimFertility[];
  defaultSlug: string;
  defaultBirthYear: number;
  worldTfrToday: number;
}

export default function FertilityCalculator({
  countries,
  defaultSlug,
  defaultBirthYear,
  worldTfrToday,
}: Props) {
  const [slug, setSlug] = useState(defaultSlug);
  const [birthYearStr, setBirthYearStr] = useState(String(defaultBirthYear));

  // Hydrate from URL params after mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qCountry = params.get('country');
    const qYear = params.get('birthYear');
    if (qCountry && countries.some(c => c.slug === qCountry)) setSlug(qCountry);
    if (qYear) {
      const n = parseInt(qYear, 10);
      if (!Number.isNaN(n)) setBirthYearStr(String(clampBirthYear(n)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror state back into the URL.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('country', slug);
    params.set('birthYear', birthYearStr);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [slug, birthYearStr]);

  const country = useMemo(
    () => countries.find(c => c.slug === slug) ?? countries[0],
    [slug, countries]
  );
  const birthYear = useMemo(() => clampBirthYear(parseInt(birthYearStr, 10)), [birthYearStr]);
  const result = useMemo(() => computeFertilityResult(country, birthYear), [country, birthYear]);

  return (
    <section className="bg-gradient-to-br from-rose-50 via-white to-blue-50 rounded-2xl border-2 border-rose-200 p-5 sm:p-7 mb-8 shadow-lg">
      <div className="flex flex-wrap items-baseline gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">👶 Fertility Rate Calculator</h2>
        <span className="text-xs text-gray-500">UN WPP 2024 · TFR + CBR per country</span>
      </div>
      <p className="text-sm text-gray-700 mb-5">
        Enter your birth year and pick a country to see how its fertility rate has changed since you were born,
        whether it has dropped below the replacement rate of {REPLACEMENT_TFR}, and how it ranks globally.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="fr-birth-year" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Birth year
          </label>
          <input
            id="fr-birth-year"
            type="number"
            inputMode="numeric"
            min={MIN_BIRTH_YEAR}
            max={MAX_BIRTH_YEAR}
            value={birthYearStr}
            onChange={e => setBirthYearStr(e.target.value)}
            onBlur={() => setBirthYearStr(String(clampBirthYear(parseInt(birthYearStr, 10))))}
            className="w-full px-3 py-2.5 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-lg font-semibold bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">{MIN_BIRTH_YEAR}–{MAX_BIRTH_YEAR}</p>
        </div>

        <div>
          <label htmlFor="fr-country" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Country
          </label>
          <select
            id="fr-country"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-base font-medium bg-white"
          >
            {countries.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero answer card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fertility in {country.name}</div>
          <div className="text-xs text-gray-500">
            {country.flag} {country.name} · {rankLabel(country.rankByTFR, country.outOf)} by TFR (1 = highest)
          </div>
        </div>

        <p className="text-lg sm:text-xl text-gray-900 leading-relaxed">
          {result.tfrAtBirth !== null ? (
            <>
              When you were born in <strong>{birthYear}</strong>, women in <strong>{country.name}</strong> averaged{' '}
              <strong className="tabular-nums">{fmtTFR(result.tfrAtBirth)}</strong> children each. Today the rate is{' '}
              <strong className={`tabular-nums text-2xl sm:text-3xl ${result.belowReplacement ? 'text-rose-700' : 'text-blue-700'}`}>
                {fmtTFR(result.tfrToday)}
              </strong>
              {' '}
              {result.tfrDelta !== null && Math.abs(result.tfrDelta) >= 0.05 && (
                <>
                  — a {result.tfrDelta < 0 ? 'drop' : 'rise'} of{' '}
                  <strong>{fmtDeltaTFR(result.tfrDelta)}</strong> children per woman.{' '}
                </>
              )}
              {result.belowReplacement
                ? <strong className="text-rose-700">Below the replacement rate of {REPLACEMENT_TFR}.</strong>
                : <strong className="text-emerald-700">Still above replacement ({REPLACEMENT_TFR}).</strong>}
            </>
          ) : (
            <>No fertility data for {country.name} in {birthYear}. Try another year.</>
          )}
        </p>

        {/* Replacement-crossing callout */}
        {country.belowReplacementSince !== null && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              ⚠️ Below replacement rate
            </div>
            <p className="text-sm text-gray-800">
              {country.name} dropped below the replacement rate of {REPLACEMENT_TFR} children per woman in{' '}
              <strong>{country.belowReplacementSince}</strong> — that's{' '}
              <strong>{result.yearsBelowReplacement} years ago</strong>.{' '}
              {result.bornBeforeOrAfterCrossing === 'after'
                ? <>You were born <strong>after</strong> the crossing — your whole life has been below replacement.</>
                : result.bornBeforeOrAfterCrossing === 'before'
                ? <>You were born <strong>before</strong> the crossing, when families were still bigger on average.</>
                : null}
            </p>
          </div>
        )}
        {country.belowReplacementSince === null && country.currentTFR >= REPLACEMENT_TFR && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              Still above replacement
            </div>
            <p className="text-sm text-gray-800">
              {country.name}'s fertility rate has never dropped below {REPLACEMENT_TFR} since UN records began
              in 1965. With a current TFR of {fmtTFR(country.currentTFR)}, the population continues to grow
              from births alone.
            </p>
          </div>
        )}

        {/* Stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">TFR today</div>
            <div className="text-2xl font-bold text-blue-700 tabular-nums">{fmtTFR(result.tfrToday)}</div>
            <div className="text-xs text-gray-600">children per woman</div>
          </div>

          <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
            <div className="text-[10px] uppercase tracking-wider text-rose-700 font-bold">vs replacement</div>
            <div className={`text-2xl font-bold tabular-nums ${result.vsReplacement < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {fmtDeltaTFR(result.vsReplacement)}
            </div>
            <div className="text-xs text-gray-600">vs {REPLACEMENT_TFR}</div>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">vs world avg</div>
            <div className={`text-2xl font-bold tabular-nums ${result.vsWorld < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {fmtDeltaTFR(result.vsWorld)}
            </div>
            <div className="text-xs text-gray-600">world: {fmtTFR(worldTfrToday)}</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">birth rate (CBR)</div>
            <div className="text-2xl font-bold text-purple-700 tabular-nums">{fmtCBR(result.cbrToday)}</div>
            <div className="text-xs text-gray-600">
              births / 1,000 ppl{result.cbrDelta !== null && Math.abs(result.cbrDelta) >= 0.5 && (
                <> · {fmtDeltaCBR(result.cbrDelta)} since {birthYear}</>
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs text-gray-500 italic border-t border-gray-100 pt-3">
          ⓘ Total Fertility Rate (TFR) = the average number of children a woman would have if she lived through
          her childbearing years at current age-specific birth rates. Replacement = 2.1 children per woman (the
          rate at which a generation exactly replaces itself in low-mortality settings). Data: UN World Population
          Prospects 2024 Revision.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">📉 Fertility rate trend, 1965–2050</h3>
          <span className="text-xs text-gray-500">{country.flag} {country.name} · UN WPP 2024</span>
        </div>
        <FertilityRateChart primary={country} birthYear={birthYear} worldTfrToday={worldTfrToday} />
        <p className="text-xs text-gray-600 mt-3">
          Solid line is observed; dashed extension is the UN medium-variant projection to 2050. The green
          dashed line is the replacement rate ({REPLACEMENT_TFR}). The red dot marks the year {country.name}'s
          fertility crossed below replacement, if applicable.
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Tip: this URL updates as you change inputs — copy and share to send your result.{' '}
        <Link href="/population-when-you-were-born" className="text-blue-700 hover:text-blue-900 underline">
          See world population when you were born →
        </Link>{' '}
        ·{' '}
        <Link href="/life-expectancy-by-country" className="text-blue-700 hover:text-blue-900 underline">
          See how long you'll live →
        </Link>
      </div>
    </section>
  );
}
