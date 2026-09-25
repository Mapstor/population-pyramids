import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Oldest Countries in the World by Median Age",
  description: "Oldest Countries in the World by Median Age — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/oldest-countries-world-aging-population" },
  openGraph: {
    title: "Oldest Countries in the World by Median Age",
    description: "Oldest Countries in the World by Median Age — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/oldest-countries-world-aging-population",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Oldest Countries in the World by Median Age",
    description: "Oldest Countries in the World by Median Age — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
