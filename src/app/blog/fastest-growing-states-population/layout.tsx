import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = buildMetadata({
  title: "Fastest Growing States by Population",
  description: "Fastest Growing States by Population — data-driven demographic analysis on Population Pyramids. UN World Population Prospects 2024 / US Census-based reporting.",
  path: "/blog/fastest-growing-states-population",
  type: 'article',
});

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
