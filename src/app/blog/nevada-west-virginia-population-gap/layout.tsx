import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nevada vs West Virginia: Boom vs Bust Population Gap",
  description: "Nevada vs West Virginia: Boom vs Bust Population Gap — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/nevada-west-virginia-population-gap" },
  openGraph: {
    title: "Nevada vs West Virginia: Boom vs Bust Population Gap",
    description: "Nevada vs West Virginia: Boom vs Bust Population Gap — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/nevada-west-virginia-population-gap",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nevada vs West Virginia: Boom vs Bust Population Gap",
    description: "Nevada vs West Virginia: Boom vs Bust Population Gap — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
