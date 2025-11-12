/**
 * Get the current year or the latest data year, whichever is more appropriate
 */
export function getCurrentDataYear(): number {
  const currentYear = new Date().getFullYear();
  const latestDataYear = 2024; // Update this when new UN data is released
  
  // If we're still in the data year or within 1 year, show the data year
  // Otherwise, show "Latest" or current year for evergreen content
  if (currentYear <= latestDataYear + 1) {
    return latestDataYear;
  }
  
  return currentYear;
}

/**
 * Get display year for titles and content
 * Returns the year or "Latest" for evergreen content
 */
export function getDisplayYear(): string {
  const currentYear = new Date().getFullYear();
  const latestDataYear = 2024;
  
  // Within 2 years of data, show the year
  if (currentYear <= latestDataYear + 1) {
    return latestDataYear.toString();
  }
  
  // After that, use "Latest" for evergreen content
  return "Latest";
}

/**
 * Get title suffix that stays relevant
 * E.g., "in 2024" vs "Latest Data" vs "Current Trends"
 */
export function getTitleSuffix(): string {
  const currentYear = new Date().getFullYear();
  const latestDataYear = 2024;
  
  if (currentYear === latestDataYear) {
    return `in ${latestDataYear}`;
  } else if (currentYear === latestDataYear + 1) {
    return `(${latestDataYear} Data)`;
  } else {
    return "Latest Trends";
  }
}

/**
 * Format data freshness message
 */
export function getDataFreshnessMessage(): string {
  const currentYear = new Date().getFullYear();
  const latestDataYear = 2024;
  
  if (currentYear === latestDataYear) {
    return "Using latest 2024 UN World Population data";
  } else if (currentYear === latestDataYear + 1) {
    return "Based on 2024 UN World Population data (most recent available)";
  } else {
    return `Based on ${latestDataYear} UN data. Note: More recent data may be available.`;
  }
}

/**
 * Check if data might be stale
 */
export function isDataPotentiallyStale(): boolean {
  const currentYear = new Date().getFullYear();
  const latestDataYear = 2024;
  
  // Data is potentially stale if more than 2 years old
  return currentYear > latestDataYear + 2;
}

/**
 * Get evergreen title (removes year references)
 */
export function makeEvergreen(title: string): string {
  // Remove year patterns like "2024", "in 2024", "(2024 Data)"
  return title
    .replace(/\s*\(?\d{4}\s*(Data|data)?\)?/g, '')
    .replace(/\s+in\s+\d{4}/g, '')
    .replace(/\s+2024:/g, ':')
    .trim();
}

/**
 * Add current context to evergreen title
 */
export function addCurrentContext(title: string): string {
  const evergreen = makeEvergreen(title);
  const suffix = getTitleSuffix();
  
  // Don't add suffix if it's already about "Latest"
  if (suffix.includes("Latest") && evergreen.includes("Latest")) {
    return evergreen;
  }
  
  return `${evergreen} ${suffix}`.trim();
}