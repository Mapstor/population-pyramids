import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Stage 5 Demographic Transition: Population Decline",
  description: "Stage 5 Demographic Transition: Population Decline — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/stage-5-demographic-transition" },
  openGraph: {
    title: "Stage 5 Demographic Transition: Population Decline",
    description: "Stage 5 Demographic Transition: Population Decline — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/stage-5-demographic-transition",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Stage 5 Demographic Transition: Population Decline",
    description: "Stage 5 Demographic Transition: Population Decline — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
