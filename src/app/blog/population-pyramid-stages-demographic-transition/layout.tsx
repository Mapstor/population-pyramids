import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "5 Population Pyramid Stages: Demographic Transition Model",
  description: "5 Population Pyramid Stages: Demographic Transition Model — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/population-pyramid-stages-demographic-transition" },
  openGraph: {
    title: "5 Population Pyramid Stages: Demographic Transition Model",
    description: "5 Population Pyramid Stages: Demographic Transition Model — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/population-pyramid-stages-demographic-transition",
  },
  twitter: {
    card: 'summary_large_image',
    title: "5 Population Pyramid Stages: Demographic Transition Model",
    description: "5 Population Pyramid Stages: Demographic Transition Model — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
