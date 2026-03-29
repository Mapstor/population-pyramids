import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Median Age by Country 2026: Oldest & Youngest Populations',
  description: 'See median age for all 195 countries ranked. US median age is 38.5 years (#62 globally). Japan is oldest at 48.9 years, Niger youngest at 14.8. Interactive map and data from UN.',
  keywords: 'median age by country, median age, median age united states, what is median age, median age world, youngest population, oldest population, average age of american population, median age by state',
  openGraph: {
    title: 'Median Age by Country 2026: Oldest & Youngest Populations',
    description: 'Interactive median age explorer for all countries. See which populations are aging fastest and which remain young.',
    url: 'https://populationpyramids.org/median-age-by-country',
    siteName: 'Population Pyramids',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://populationpyramids.org/api/og-median-age',
        width: 1200,
        height: 630,
        alt: 'World Median Age Map - Oldest and Youngest Populations',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Median Age by Country 2026',
    description: 'Explore median ages worldwide. Japan leads at 48.9 years while Niger is youngest at 14.8.',
    images: ['https://populationpyramids.org/api/og-median-age'],
  },
  alternates: {
    canonical: 'https://populationpyramids.org/median-age-by-country',
  },
  authors: [{ name: 'Population Pyramids' }],
  creator: 'Population Pyramids',
  publisher: 'Population Pyramids',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google12f8c2f9c03913a3',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}