/**
 * Pure helpers for the Population Pyramid Maker.
 * No React, no fetch — safe on server and client.
 */

export const STANDARD_AGE_BANDS = [
  '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39',
  '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74',
  '75-79', '80-84', '85-89', '90-94', '95-99', '100+',
] as const;

export type AgeBand = typeof STANDARD_AGE_BANDS[number];

export interface PyramidRow {
  ageRange: string;  // e.g. "0-4" or "100+"
  male: number;
  female: number;
}

export interface PyramidStyle {
  title: string;
  subtitle: string;
  maleColor: string;
  femaleColor: string;
  showGridlines: boolean;
  showPercentages: boolean;   // bars + labels in % of total instead of absolute
  caption: string;            // optional source/credit line
}

export const DEFAULT_STYLE: PyramidStyle = {
  title: '',
  subtitle: '',
  maleColor: '#3b82f6',       // blue-500
  femaleColor: '#ec4899',     // pink-500
  showGridlines: true,
  showPercentages: false,
  caption: 'Source: UN World Population Prospects 2024 · populationpyramids.org',
};

// Build an empty pyramid (21 standard bands, all zeros) — useful as default
// for the custom-data mode.
export function emptyPyramid(): PyramidRow[] {
  return STANDARD_AGE_BANDS.map(ageRange => ({ ageRange, male: 0, female: 0 }));
}

// Build a pyramid filled with zeros except for a few demonstration values —
// gives the custom mode a visible starting point instead of a blank chart.
export function seedPyramid(): PyramidRow[] {
  // ~2024 USA proportions (rough, in percentages so total = ~100)
  const usaShape: Record<string, [number, number]> = {
    '0-4':   [2.9, 2.7],
    '5-9':   [3.0, 2.8],
    '10-14': [3.0, 2.9],
    '15-19': [3.1, 2.9],
    '20-24': [3.2, 3.1],
    '25-29': [3.4, 3.2],
    '30-34': [3.5, 3.4],
    '35-39': [3.4, 3.3],
    '40-44': [3.2, 3.1],
    '45-49': [3.0, 3.0],
    '50-54': [3.0, 3.0],
    '55-59': [3.1, 3.2],
    '60-64': [3.0, 3.2],
    '65-69': [2.7, 2.9],
    '70-74': [2.2, 2.5],
    '75-79': [1.6, 1.9],
    '80-84': [1.0, 1.3],
    '85-89': [0.5, 0.8],
    '90-94': [0.2, 0.4],
    '95-99': [0.05, 0.1],
    '100+':  [0.01, 0.03],
  };
  return STANDARD_AGE_BANDS.map(ageRange => {
    const [m, f] = usaShape[ageRange] || [0, 0];
    return { ageRange, male: m, female: f };
  });
}

export interface PyramidSummary {
  total: number;
  maleTotal: number;
  femaleTotal: number;
  sexRatio: number;             // M per 100 F
  malePercent: number;
  femalePercent: number;
  largestBand: { ageRange: string; total: number; share: number };
  medianAgeBand: string;        // band containing the median
  under15Share: number;
  workingShare: number;         // 15-64
  over65Share: number;
}

export function summarize(rows: PyramidRow[]): PyramidSummary {
  const total = rows.reduce((s, r) => s + r.male + r.female, 0);
  const maleTotal = rows.reduce((s, r) => s + r.male, 0);
  const femaleTotal = rows.reduce((s, r) => s + r.female, 0);
  const sexRatio = femaleTotal > 0 ? (maleTotal / femaleTotal) * 100 : 0;

  const rowsWithTotals = rows.map(r => ({ ...r, t: r.male + r.female }));
  const largest = rowsWithTotals.reduce((best, r) => (r.t > best.t ? r : best), rowsWithTotals[0]);

  // Find band containing the median
  let cumulative = 0;
  const target = total / 2;
  let medianAgeBand = rows[Math.floor(rows.length / 2)]?.ageRange || '';
  for (const r of rowsWithTotals) {
    cumulative += r.t;
    if (cumulative >= target) {
      medianAgeBand = r.ageRange;
      break;
    }
  }

  const youthRanges = new Set(['0-4', '5-9', '10-14']);
  const elderlyRanges = new Set(['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+']);
  const youthPop = rowsWithTotals.filter(r => youthRanges.has(r.ageRange)).reduce((s, r) => s + r.t, 0);
  const elderlyPop = rowsWithTotals.filter(r => elderlyRanges.has(r.ageRange)).reduce((s, r) => s + r.t, 0);
  const workingPop = total - youthPop - elderlyPop;

  return {
    total,
    maleTotal,
    femaleTotal,
    sexRatio,
    malePercent: total > 0 ? (maleTotal / total) * 100 : 0,
    femalePercent: total > 0 ? (femaleTotal / total) * 100 : 0,
    largestBand: { ageRange: largest.ageRange, total: largest.t, share: total > 0 ? (largest.t / total) * 100 : 0 },
    medianAgeBand,
    under15Share: total > 0 ? (youthPop / total) * 100 : 0,
    workingShare: total > 0 ? (workingPop / total) * 100 : 0,
    over65Share: total > 0 ? (elderlyPop / total) * 100 : 0,
  };
}

// Format big numbers for chart axis labels.
export function fmtAxisCount(n: number, mode: 'pop' | 'pct'): string {
  if (mode === 'pct') return `${n.toFixed(1)}%`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return Math.round(n).toString();
}
