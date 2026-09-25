/**
 * Number formatting for country-page copy. Distinct from lib/number-format.ts
 * (which fixes 2 decimals everywhere) — these follow the T2 spec exactly and
 * choose the unit AFTER rounding so "1000K" / "1000.0M" can never appear.
 */

/** English ordinal: 1st, 2nd, 3rd, 4th, 11th, 21st, 101st, 111th. */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

/**
 * Compact population label:
 *   >= 999,950,000  -> "1.46B"   (2 decimals)
 *   >= 999,500      -> "123.1M"  (1 decimal)
 *   >= 10,000       -> "398K"    (0 decimals)
 *   below           -> exact with commas ("9,492")
 * Thresholds are the rounding boundaries, so the mantissa never reaches 1000.
 */
export function popShort(n: number): string {
  if (n >= 999_950_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 999_500) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString('en-US');
}

/**
 * Population in words:
 *   >= 999,950,000  -> "1.46 billion" (2 decimals)
 *   >= 999,500      -> "123.1 million" (1 decimal)
 *   below           -> exact with commas ("9,492")
 */
export function popWords(n: number): string {
  if (n >= 999_950_000) return `${(n / 1_000_000_000).toFixed(2)} billion`;
  if (n >= 999_500) return `${(n / 1_000_000).toFixed(1)} million`;
  return n.toLocaleString('en-US');
}

/** Exact integer with thousands separators, e.g. 123103488 -> "123,103,488". */
export function popExact(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

/** Share of world population as a %, 2 decimals; below 0.005% -> "less than 0.01%". */
export function formatShare(sharePct: number): string {
  if (sharePct < 0.005) return 'less than 0.01%';
  return `${sharePct.toFixed(2)}%`;
}

/** "the most in the world" for rank 1, else "{ordinal} in the world". */
export function rankShort(rank: number): string {
  return rank === 1 ? 'the most in the world' : `${ordinal(rank)} in the world`;
}
