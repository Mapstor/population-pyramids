import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Climate Refugees: 12 States Americans Flee Due to Weather",
  description: "Climate Refugees: 12 States Americans Flee Due to Weather — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/climate-refugees-states-flee-weather" },
  openGraph: {
    title: "Climate Refugees: 12 States Americans Flee Due to Weather",
    description: "Climate Refugees: 12 States Americans Flee Due to Weather — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/climate-refugees-states-flee-weather",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Climate Refugees: 12 States Americans Flee Due to Weather",
    description: "Climate Refugees: 12 States Americans Flee Due to Weather — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
