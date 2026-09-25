import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Alaska Gender Ratio: 35,924 More Men Than Women",
  description: "Alaska Gender Ratio: 35,924 More Men Than Women — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/alaska-gender-ratio-dating-crisis" },
  openGraph: {
    title: "Alaska Gender Ratio: 35,924 More Men Than Women",
    description: "Alaska Gender Ratio: 35,924 More Men Than Women — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/alaska-gender-ratio-dating-crisis",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Alaska Gender Ratio: 35,924 More Men Than Women",
    description: "Alaska Gender Ratio: 35,924 More Men Than Women — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
