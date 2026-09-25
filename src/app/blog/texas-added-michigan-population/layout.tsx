import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Texas Added an Entire Michigan Since 2000",
  description: "Texas Added an Entire Michigan Since 2000 — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/texas-added-michigan-population" },
  openGraph: {
    title: "Texas Added an Entire Michigan Since 2000",
    description: "Texas Added an Entire Michigan Since 2000 — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/texas-added-michigan-population",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Texas Added an Entire Michigan Since 2000",
    description: "Texas Added an Entire Michigan Since 2000 — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
