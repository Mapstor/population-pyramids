// Universal number formatting utilities
// Ensures all numbers are rounded to maximum 2 decimal places

export function formatNumber(num: number, maxDecimals: number = 2): string {
  if (num === 0) return '0';
  
  const decimals = Math.min(maxDecimals, 2); // Enforce maximum 2 decimal places
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(decimals)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  
  return num.toFixed(decimals);
}

export function formatPercentage(num: number, maxDecimals: number = 2): string {
  if (num === 0) return '0%';
  const decimals = Math.min(maxDecimals, 2);
  return `${num.toFixed(decimals)}%`;
}

export function formatAge(age: number): string {
  return `${age.toFixed(2)} years`;
}

export function formatPopulation(population: number): string {
  return formatNumber(population, 2);
}

export function formatBillions(num: number): string {
  return `${(num / 1000000000).toFixed(2)}B`;
}

export function formatMillions(num: number): string {
  return `${(num / 1000000).toFixed(2)}M`;
}

export function formatGrowthRate(rate: number): string {
  const sign = rate >= 0 ? '+' : '';
  return `${sign}${rate.toFixed(2)}%`;
}

export function formatDecimal(num: number, maxDecimals: number = 2): string {
  const decimals = Math.min(maxDecimals, 2);
  return num.toFixed(decimals);
}

export function formatRatio(ratio: number): string {
  return ratio.toFixed(2);
}

// Chart-specific formatters
export function formatChartTooltip(value: number, unit: string = ''): string {
  return `${formatDecimal(value)}${unit}`;
}

export function formatChartPercentage(value: number): string {
  return `${formatDecimal(value)}%`;
}

// Table display formatters
export function formatTableNumber(num: number): string {
  if (num === 0) return '—';
  return formatNumber(num, 2);
}

export function formatTablePercentage(num: number): string {
  if (num === 0) return '—';
  return formatPercentage(num, 2);
}