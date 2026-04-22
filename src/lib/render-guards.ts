/**
 * Render Guards — enforcement of verified-or-omitted policy.
 *
 * RULE: If data is missing or invalid, render NOTHING. Never substitute
 * fallbacks like "N/A", "Unknown", or tier-guessed estimates.
 *
 * Usage:
 *   {hasValue(metrics.lifeExpectancy) && (
 *     <div>Life expectancy: {metrics.lifeExpectancy} years</div>
 *   )}
 *
 * Or with DataGuard component:
 *   <DataGuard when={hasAllValues(data, ['x', 'y'])}>
 *     <div>X is {data.x} and Y is {data.y}</div>
 *   </DataGuard>
 *
 * NEVER use: `|| 'N/A'`, `|| 'Unknown'`, `|| estimatedValue`.
 * These patterns silently fabricate data and violate site integrity policy.
 */

/**
 * Returns true only if value is a usable number for display.
 * Null, undefined, NaN, and Infinity all fail.
 */
export function hasValue(v: unknown): v is number {
  return typeof v === 'number' && !isNaN(v) && isFinite(v);
}

/**
 * Returns true only if all named keys on obj pass hasValue.
 */
export function hasAllValues<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
): boolean {
  return keys.every(k => hasValue(obj[k]));
}

/**
 * Returns true only if string value is non-empty (trimmed) and not a known fallback.
 */
export function hasText(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  const trimmed = v.trim();
  if (!trimmed) return false;
  const badFallbacks = ['N/A', 'n/a', 'NA', 'Unknown', 'TBD', '—', '--', 'null', 'undefined'];
  return !badFallbacks.includes(trimmed);
}