import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "States People Fleeing",
  description: "States People Fleeing — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/states-people-fleeing" },
  openGraph: {
    title: "States People Fleeing",
    description: "States People Fleeing — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/states-people-fleeing",
  },
  twitter: {
    card: 'summary_large_image',
    title: "States People Fleeing",
    description: "States People Fleeing — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
