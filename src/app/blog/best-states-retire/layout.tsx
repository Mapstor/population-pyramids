import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Best States to Retire",
  description: "Best States to Retire — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/best-states-retire" },
  openGraph: {
    title: "Best States to Retire",
    description: "Best States to Retire — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/best-states-retire",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Best States to Retire",
    description: "Best States to Retire — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
