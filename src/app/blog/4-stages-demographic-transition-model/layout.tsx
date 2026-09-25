import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "4 Stages of Demographic Transition: The Classic Model",
  description: "4 Stages of Demographic Transition: The Classic Model — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/4-stages-demographic-transition-model" },
  openGraph: {
    title: "4 Stages of Demographic Transition: The Classic Model",
    description: "4 Stages of Demographic Transition: The Classic Model — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/4-stages-demographic-transition-model",
  },
  twitter: {
    card: 'summary_large_image',
    title: "4 Stages of Demographic Transition: The Classic Model",
    description: "4 Stages of Demographic Transition: The Classic Model — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
