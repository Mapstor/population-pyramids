export interface Country {
  code: string;              // 3-letter country code (ISO 3166-1 alpha-3)
  name: string;              // Full country name
  slug: string;              // URL-friendly slug (lowercase with hyphens)
  region: string;            // UN region (e.g., "Asia", "Europe")
  subregion: string;         // UN subregion (e.g., "Eastern Asia")
  population2024: number;    // Total population in 2024
  flag: string;              // Unicode flag emoji
  iso2: string;              // 2-letter ISO code
  iso3: string;              // 3-letter ISO code
}

export interface CountryMetadata extends Country {
  availableYears: number[];  // Array of years with data
  latestYear: number;        // Most recent year with data
  earliestYear: number;      // Oldest year with data
}