/**
 * T5a: country-template logic derived only from the UN data (wpp2024 + the
 * population files). No hardcoded per-country facts. Reference year is 2026.
 */
import { cache } from 'react';
import { getWpp, getWorld } from '@/lib/wpp2024';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { REFERENCE_YEAR } from '@/lib/site-meta';
import { possessiveStart, sentenceStart } from '@/lib/country-names';
import { popWords } from '@/lib/country-format';
import type { YearData } from '@/types/population';

const U15 = ['0-4', '5-9', '10-14'];
const O65 = ['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'];
const W15_64 = ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64'];
const MID = ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49'];
const VATICAN = 'vatican-city';

const f1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
const f2 = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

function shareOf(yd: YearData, bands: string[]): number {
  const t = yd.totalPopulation;
  if (!t) return 0;
  return (yd.ageGroups.filter((a) => bands.includes(a.ageRange ?? '')).reduce((s, a) => s + (a.total ?? 0), 0) / t) * 100;
}
/** working-age (15–64) share; exported for the dividend series. */
export function workingShare(yd: YearData): number {
  return shareOf(yd, W15_64);
}
export function dependencyRatio(yd: YearData): number {
  const w = shareOf(yd, W15_64);
  return w > 0 ? ((shareOf(yd, U15) + shareOf(yd, O65)) / w) * 100 : 0;
}

/** Pyramid type from a single year's age bands (pure). */
export function pyramidTypeOf(yd: YearData): 'expansive' | 'constrictive' | 'stationary' {
  const u15 = shareOf(yd, U15);
  if (u15 >= 30) return 'expansive';
  const band04 = yd.ageGroups.find((a) => a.ageRange === '0-4')?.total ?? 0;
  const maxMid = Math.max(0, ...yd.ageGroups.filter((a) => MID.includes(a.ageRange ?? '')).map((a) => a.total ?? 0));
  if (u15 < 20 && maxMid > 0 && band04 <= 0.85 * maxMid) return 'constrictive';
  return 'stationary';
}

const dataOf = cache(async (slug: string) => {
  const [w, pd] = await Promise.all([getWpp(slug), loadCountryData(slug).catch(() => null)]);
  return { w, pd };
});
/** The reference year for a slug: 2026, or its latest available year if earlier (vatican → 2023). */
function refYear(pd: { years: Record<string, YearData> } | null): number {
  if (!pd) return REFERENCE_YEAR;
  const ys = Object.keys(pd.years).map(Number).filter((y) => y <= REFERENCE_YEAR);
  return ys.length ? Math.max(...ys) : REFERENCE_YEAR;
}

/** Rank wording: rank 1 → "the highest", 2 → "the 2nd-highest"; near the bottom → "the lowest"/"the 2nd-lowest". */
export function rankWord(rank: number, N: number): string {
  const ord = (k: number) => {
    const v = k % 100;
    const s = ['th', 'st', 'nd', 'rd'];
    return `${k}${s[(v - 20) % 10] || s[v] || s[0]}`;
  };
  if (rank <= Math.ceil(N / 2)) return rank === 1 ? 'the highest' : `the ${ord(rank)}-highest`;
  const k = N + 1 - rank;
  return k === 1 ? 'the lowest' : `the ${ord(k)}-lowest`;
}

// ---- (a) DTM stage ----
export interface DtmResult { stage: 2 | 3 | 4 | 5; sentence: string; link: string; }
export const dtmStage = cache(async (slug: string, year: number = REFERENCE_YEAR): Promise<DtmResult | null> => {
  if (slug === VATICAN) return null;
  const { w } = await dataOf(slug);
  const y = w?.years[String(year)];
  if (!y || y.natChangeRate == null || y.tfr == null || y.cbr == null || y.cdr == null) return null;
  const cbr = f1(y.cbr), cdr = f1(y.cdr), tfr = f2(y.tfr), growth = f1(y.growthRatePct ?? 0);
  let stage: 2 | 3 | 4 | 5, sentence: string;
  if (y.natChangeRate < 0) {
    stage = 5;
    sentence = `Stage 5 (natural decrease): deaths outnumber births — ${cbr} births and ${cdr} deaths per 1,000 people in ${year}.`;
  } else if (y.tfr < 2.1) {
    stage = 4;
    sentence = `Stage 4 (low birth and death rates): fertility is below the replacement level of 2.1 (${tfr} children per woman), and births still exceed deaths (${cbr} vs ${cdr} per 1,000).`;
  } else if (y.cbr < 30) {
    stage = 3;
    sentence = `Stage 3 (falling birth rate): ${tfr} children per woman and ${cbr} births per 1,000, with a low death rate (${cdr}).`;
  } else {
    stage = 2;
    sentence = `Stage 2 (high birth rate, falling death rate): ${cbr} births and ${cdr} deaths per 1,000, so the population grows about ${growth}% a year.`;
  }
  return { stage, sentence, link: `/blog/stage-${stage}-demographic-transition` };
});

// ---- (b) pyramid type ----
export const pyramidType = cache(async (slug: string, year?: number): Promise<'expansive' | 'constrictive' | 'stationary' | null> => {
  const { pd } = await dataOf(slug);
  const yr = year ?? refYear(pd);
  const py = pd?.years[String(yr)];
  return py ? pyramidTypeOf(py) : null;
});

// ---- (c) dividend status ----
export interface DividendResult { status: 'closed' | 'open' | 'opening' | 'at its peak'; sentence: string; peakYear: number; peak: number; now: number; }
export const dividendStatus = cache(async (slug: string): Promise<DividendResult | null> => {
  const { pd } = await dataOf(slug);
  if (!pd) return null;
  const name = (pd as { countryName?: string }).countryName ?? slug;
  let peakYear = 0, peak = -1;
  for (let y = 1950; y <= 2030; y++) {
    const py = pd.years[String(y)];
    if (!py) continue;
    const w = workingShare(py);
    if (w > peak) { peak = w; peakYear = y; }
  }
  const nowY = pd.years[String(REFERENCE_YEAR)];
  if (peak < 0 || !nowY) return null;
  const now = workingShare(nowY);
  const dep = dependencyRatio(nowY);
  const s2016 = pd.years['2016'] ? workingShare(pd.years['2016']) : now;
  let status: DividendResult['status'], sentence: string;
  if (peakYear <= 2023) {
    status = 'closed';
    sentence = `${possessiveStart(name)} working-age share peaked in ${peakYear} at ${f1(peak)}% and is ${f1(now)}% in ${REFERENCE_YEAR}.`;
  } else if (peakYear >= 2029) {
    status = dep >= 60 ? 'opening' : 'open';
    sentence = `The working-age share is still rising, from ${f1(s2016)}% in 2016 to ${f1(now)}% in ${REFERENCE_YEAR} (dependency ratio ${f1(dep)}).`;
  } else {
    status = 'at its peak';
    sentence = `${possessiveStart(name)} working-age share is projected to peak in ${peakYear} at ${f1(peak)}%.`;
  }
  return { status, sentence, peakYear, peak, now };
});

// ---- (d) aging speed ----
export const agingSpeed = cache(async (slug: string): Promise<{ sentence: string } | null> => {
  const { pd } = await dataOf(slug);
  const world = await getWorld();
  if (!pd) return null;
  const name = (pd as { countryName?: string }).countryName ?? slug;
  const m2016 = pd.years['2016']?.medianAge, m2026 = pd.years[String(REFERENCE_YEAR)]?.medianAge;
  const wm2016 = world.years['2016']?.medianAge, wm2026 = world.years[String(REFERENCE_YEAR)]?.medianAge;
  if (m2016 == null || m2026 == null || wm2016 == null || wm2026 == null) return null;
  const c = m2026 - m2016, w = wm2026 - wm2016;
  const rel = c > w ? 'faster' : 'slower';
  const sign = (v: number) => (v >= 0 ? '+' : '');
  return { sentence: `${possessiveStart(name)} median age changed by ${sign(c)}${f1(c)} years from 2016 to ${REFERENCE_YEAR}, ${rel} than the world average (${sign(w)}${f1(w)} years).` };
});

// ---- (e) future trend ----
export const futureTrend = cache(async (slug: string): Promise<{ population: string; medianAge: string; pop2050: number; pctChange: number } | null> => {
  const { w, pd } = await dataOf(slug);
  if (!w) return null;
  const name = (pd as { countryName?: string })?.countryName ?? slug;
  const now = w.years[String(REFERENCE_YEAR)], y2050 = w.years['2050'];
  if (!now || !y2050 || now.pop == null || y2050.pop == null) return null;
  const pct = ((y2050.pop - now.pop) / now.pop) * 100;
  const grow = pct >= 0;
  const population = `${sentenceStart(name)} is projected to ${grow ? 'grow' : 'shrink'} to ${popWords(y2050.pop)} people by 2050 (${grow ? '+' : ''}${f1(pct)}% from ${REFERENCE_YEAR}).`;
  const m26 = now.medianAge ?? 0, m50 = y2050.medianAge ?? 0;
  const medianAge = `The median age ${m50 >= m26 ? 'rises' : 'falls'} from ${f1(m26)} in ${REFERENCE_YEAR} to ${f1(m50)} by 2050.`;
  return { population, medianAge, pop2050: y2050.pop, pctChange: pct };
});

// ---- ranks across all 194 countries (median age, 65+ share, under-15 share) ----
export const metricRankings = cache(async (year: number = REFERENCE_YEAR) => {
  const countries = await loadCountries();
  const rows: { slug: string; name: string; median: number; o65: number; u15: number }[] = [];
  await Promise.all(
    countries.map(async (c) => {
      if (c.slug === VATICAN) return;
      const { w, pd } = await dataOf(c.slug);
      const wy = w?.years[String(year)];
      const py = pd?.years[String(year)];
      if (!wy || !py || wy.medianAge == null) return;
      rows.push({ slug: c.slug, name: c.name, median: wy.medianAge, o65: shareOf(py, O65), u15: shareOf(py, U15) });
    })
  );
  const rankMap = (key: 'median' | 'o65' | 'u15') => {
    const sorted = [...rows].sort((a, b) => b[key] - a[key] || a.name.localeCompare(b.name));
    const m: Record<string, number> = {};
    sorted.forEach((r, i) => { m[r.slug] = i + 1; });
    return m;
  };
  return { N: rows.length, median: rankMap('median'), o65: rankMap('o65'), u15: rankMap('u15') };
});

// ---- (f) key facts (exactly four) ----
export interface Fact { icon: string; text: string; category: string; }
export const keyFacts = cache(async (slug: string): Promise<Fact[]> => {
  if (slug === VATICAN) return [];
  const { w, pd } = await dataOf(slug);
  const ranks = await metricRankings();
  if (!w || !pd) return [];
  const name = (pd as { countryName?: string }).countryName ?? slug;
  const y = w.years[String(REFERENCE_YEAR)], py = pd.years[String(REFERENCE_YEAR)], y1970 = w.years['1970'];
  if (!y || !py || y.pop == null) return [];
  const facts: Fact[] = [];

  // 1. population 2026 + % change since 1970
  if (y1970 && y1970.pop) {
    const pct = ((y.pop - y1970.pop) / y1970.pop) * 100;
    facts.push({ icon: '👥', category: 'growth',
      text: `${sentenceStart(name)} has ${popWords(y.pop)} people in ${REFERENCE_YEAR}, ${pct >= 0 ? 'up' : 'down'} ${f1(Math.abs(pct))}% from ${popWords(y1970.pop)} in 1970.` });
  } else {
    facts.push({ icon: '👥', category: 'growth', text: `${sentenceStart(name)} has ${popWords(y.pop)} people in ${REFERENCE_YEAR}.` });
  }

  // 2. natural change (UN projection)
  const nat = (y.deaths ?? 0) - (y.births ?? 0);
  facts.push({ icon: '⚖️', category: 'natural-change',
    text: nat > 0
      ? `Deaths outnumber births by ${Math.abs(nat).toLocaleString('en-US')} (UN projection for ${REFERENCE_YEAR}).`
      : `Births outnumber deaths by ${Math.abs(nat).toLocaleString('en-US')} (UN projection for ${REFERENCE_YEAR}).` });

  // 3–4. the two most distinctive of {median age, 65+ share, under-15 share}
  const N = ranks.N;
  const metrics = [
    { key: 'median', label: 'Median age', value: f1(y.medianAge ?? 0), suffix: '', rank: ranks.median[slug], order: 0 },
    { key: 'o65', label: '65+ share', value: f1(shareOf(py, O65)), suffix: '%', rank: ranks.o65[slug], order: 1 },
    { key: 'u15', label: 'Under-15 share', value: f1(shareOf(py, U15)), suffix: '%', rank: ranks.u15[slug], order: 2 },
  ].filter((m) => typeof m.rank === 'number');
  metrics.sort((a, b) => {
    const da = Math.min(a.rank, N + 1 - a.rank), db = Math.min(b.rank, N + 1 - b.rank);
    return da - db || a.order - b.order;
  });
  for (const m of metrics.slice(0, 2)) {
    facts.push({ icon: m.key === 'median' ? '📊' : m.key === 'o65' ? '👴' : '🧒', category: 'rank',
      text: `${m.label} ${m.value}${m.suffix} — ${rankWord(m.rank, N)} of ${N} countries.` });
  }
  return facts;
});

/** Human label for a fertility level, by TFR. */
export function fertilityBand(tfr: number): string {
  if (tfr >= 4) return 'high fertility';
  if (tfr >= 2.1) return 'above replacement';
  if (tfr >= 1.3) return 'below replacement';
  return 'very low (lowest-low) fertility';
}
/** Threshold labels used by the glossary / "What This Means". */
export function under15Band(pct: number): string {
  if (pct < 15) return 'very small';
  if (pct < 25) return 'moderate';
  if (pct < 35) return 'large';
  return 'very large';
}
export function over65Band(pct: number): string {
  if (pct < 7) return 'young';
  if (pct < 14) return 'ageing';
  if (pct < 21) return 'aged';
  return 'super-aged';
}
export function dependencyBand(ratio: number): string {
  if (ratio < 50) return 'low';
  if (ratio <= 65) return 'moderate';
  return 'high';
}
