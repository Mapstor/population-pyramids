import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Half of US States Under 35: Youth vs Senior America",
  description: "Half of US States Under 35: Youth vs Senior America — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/half-states-under-35-youth-vs-senior-america" },
  openGraph: {
    title: "Half of US States Under 35: Youth vs Senior America",
    description: "Half of US States Under 35: Youth vs Senior America — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/half-states-under-35-youth-vs-senior-america",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Half of US States Under 35: Youth vs Senior America",
    description: "Half of US States Under 35: Youth vs Senior America — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
