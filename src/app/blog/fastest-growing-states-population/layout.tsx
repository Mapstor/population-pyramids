import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fastest Growing States by Population",
  description: "Fastest Growing States by Population — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/fastest-growing-states-population" },
  openGraph: {
    title: "Fastest Growing States by Population",
    description: "Fastest Growing States by Population — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/fastest-growing-states-population",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fastest Growing States by Population",
    description: "Fastest Growing States by Population — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
