import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Remote Work Exodus: 15 States Where WFH Changed Everything",
  description: "Remote Work Exodus: 15 States Where WFH Changed Everything — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  alternates: { canonical: "https://populationpyramids.org/blog/remote-work-exodus-states-wfh-changed" },
  openGraph: {
    title: "Remote Work Exodus: 15 States Where WFH Changed Everything",
    description: "Remote Work Exodus: 15 States Where WFH Changed Everything — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
    type: 'article',
    url: "https://populationpyramids.org/blog/remote-work-exodus-states-wfh-changed",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Remote Work Exodus: 15 States Where WFH Changed Everything",
    description: "Remote Work Exodus: 15 States Where WFH Changed Everything — data-driven demographic analysis on PopulationPyramids.org. UN World Population Prospects 2024 / US Census-based reporting.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
