import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Male to Female Ratio by Country 2026 | Gender Ratio Map',
    description: 'See the male to female ratio for all 195 countries. Global ratio is 101.2 males per 100 females. Interactive map, rankings, and sex ratio by age group from UN data.',
    path: '/male-to-female-ratio',
    image: '/api/og-gender-ratio',
    imageAlt: 'World Male to Female Ratio Map - Interactive Gender Demographics',
  }),
  keywords: 'male to female ratio, gender ratio, sex ratio by country, male female population, men to women ratio, population by gender, male to female world ratio, american population by gender',
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