import type { Metadata } from 'next';
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '@/lib/site-meta';

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateCountryMetadata(
  countryName: string,
  year: number,
  totalPopulation: number,
  dailyBirths?: number,
  birthRate?: number
): Metadata {
  const slug = generateSlug(countryName);
  const canonicalUrl = absoluteUrl(`/${slug}`);
  // T2 Step 7: births boilerplate removed (computed births are wrong until T4).
  // The live country route no longer uses this helper (it builds metadata via
  // buildMetadata); kept here for the legacy page-partial.tsx only.
  const title = `${countryName} Population Pyramid ${year} - Demographics & Age Structure`;
  const description = `Interactive population pyramid for ${countryName} in ${year}. Total population: ${formatNumber(totalPopulation)}. View age distribution and demographic trends.`;

  const baseKeywords = [
    `${countryName.toLowerCase()} population pyramid`,
    `${countryName.toLowerCase()} demographics`,
    `${countryName.toLowerCase()} age distribution`,
    `${countryName.toLowerCase()} population ${year}`,
  ];

  const birthKeywords = dailyBirths ? [
    `how many babies born in ${countryName.toLowerCase()} per day`,
    `${countryName.toLowerCase()} births per day`,
    `${countryName.toLowerCase()} daily birth rate`,
    `${countryName.toLowerCase()} birth statistics`,
    `${countryName.toLowerCase()} births per hour`,
    `${countryName.toLowerCase()} annual births`,
    `babies born in ${countryName.toLowerCase()}`,
    `${countryName.toLowerCase()} birth rate ${year}`,
  ] : [];

  return {
    title,
    description,
    keywords: [...baseKeywords, ...birthKeywords],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
  };
}
