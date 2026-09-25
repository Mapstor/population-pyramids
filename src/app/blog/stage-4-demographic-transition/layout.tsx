import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Stage 4 Demographic Transition: Low Stationary",
  description: "Stage 4 Demographic Transition: Low Stationary — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/stage-4-demographic-transition" },
  openGraph: {
    title: "Stage 4 Demographic Transition: Low Stationary",
    description: "Stage 4 Demographic Transition: Low Stationary — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/stage-4-demographic-transition",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Stage 4 Demographic Transition: Low Stationary",
    description: "Stage 4 Demographic Transition: Low Stationary — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
