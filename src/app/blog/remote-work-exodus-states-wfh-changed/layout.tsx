import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = buildMetadata({
  title: "Remote Work Exodus: 15 States Where WFH Changed Everything",
  description: "Remote Work Exodus: 15 States Where WFH Changed Everything — data-driven demographic analysis on Population Pyramids. UN World Population Prospects 2024 / US Census-based reporting.",
  path: "/blog/remote-work-exodus-states-wfh-changed",
  type: 'article',
});

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
