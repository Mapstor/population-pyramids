import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Median Age by Country 2026: Oldest & Youngest Populations',
    description: 'See median age for all 195 countries ranked. US median age is 38.5 years (#62 globally). Japan is oldest at 48.9 years, Niger youngest at 14.8. Interactive map and data from UN.',
    path: '/median-age-by-country',
    image: '/api/og-median-age',
    imageAlt: 'World Median Age Map - Oldest and Youngest Populations',
  }),
  keywords: 'median age by country, median age, median age united states, what is median age, median age world, youngest population, oldest population, average age of american population, median age by state',
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