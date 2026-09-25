import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = buildMetadata({
  title: "Oldest Countries in the World by Median Age",
  description: "Oldest Countries in the World by Median Age — data-driven demographic analysis on Population Pyramids. UN World Population Prospects 2024 / US Census-based reporting.",
  path: "/blog/oldest-countries-world-aging-population",
  type: 'article',
});

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
