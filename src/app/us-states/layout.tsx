import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'US States Demographics - Population Data for All 50 States | Population Pyramids',
  description: 'Explore comprehensive demographic data, population trends, and growth rates for all 50 US states. Interactive charts and detailed statistics.',
  keywords: 'US states population, state demographics, population by state, US census data, state growth rates',
  openGraph: {
    title: 'US States Demographics - All 50 States',
    description: 'Comprehensive population data and growth trends for all US states',
    type: 'website',
    url: 'https://populationpyramids.org/us-states',
  },
};

export default function USStatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}