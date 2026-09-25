import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Utah vs Maine: 15-Year Age Gap Crisis",
  description: "Utah vs Maine: 15-Year Age Gap Crisis — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/utah-maine-age-gap-crisis" },
  openGraph: {
    title: "Utah vs Maine: 15-Year Age Gap Crisis",
    description: "Utah vs Maine: 15-Year Age Gap Crisis — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/utah-maine-age-gap-crisis",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Utah vs Maine: 15-Year Age Gap Crisis",
    description: "Utah vs Maine: 15-Year Age Gap Crisis — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
