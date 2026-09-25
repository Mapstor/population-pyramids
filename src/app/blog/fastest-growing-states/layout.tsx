import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "15 Fastest Growing US States",
  description: "15 Fastest Growing US States — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/fastest-growing-states" },
  openGraph: {
    title: "15 Fastest Growing US States",
    description: "15 Fastest Growing US States — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/fastest-growing-states",
  },
  twitter: {
    card: 'summary_large_image',
    title: "15 Fastest Growing US States",
    description: "15 Fastest Growing US States — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
