import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Male to Female Ratio by Country 2026 | Gender Ratio Map',
  description: 'See the male to female ratio for all 195 countries. Global ratio is 101.2 males per 100 females. Interactive map, rankings, and sex ratio by age group from UN data.',
  keywords: 'male to female ratio, gender ratio, sex ratio by country, male female population, men to women ratio, population by gender, male to female world ratio, american population by gender',
  openGraph: {
    title: 'Male to Female Ratio by Country 2026 | Gender Ratio Map',
    description: 'See the male to female ratio for all 195 countries. Interactive map, rankings, and sex ratio by age group from UN data.',
    url: 'https://populationpyramids.org/male-to-female-ratio',
    siteName: 'Population Pyramids',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://populationpyramids.org/api/og-gender-ratio',
        width: 1200,
        height: 630,
        alt: 'World Male to Female Ratio Map - Interactive Gender Demographics',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Male to Female Ratio by Country 2026',
    description: 'Interactive gender ratio map and data for all countries. See how sex ratios change with age.',
    images: ['https://populationpyramids.org/api/og-gender-ratio'],
  },
  alternates: {
    canonical: 'https://populationpyramids.org/male-to-female-ratio',
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