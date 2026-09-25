import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'US States Demographics - Population Data for All 50 States',
    description: 'Explore comprehensive demographic data, population trends, and growth rates for all 50 US states. Interactive charts and detailed statistics.',
    path: '/us-states',
  }),
  keywords: 'US states population, state demographics, population by state, US census data, state growth rates',
};

export default function USStatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}