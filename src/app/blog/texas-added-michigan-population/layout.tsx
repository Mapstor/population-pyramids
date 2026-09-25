import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = buildMetadata({
  title: "Texas Added an Entire Michigan Since 2000",
  description: "Texas Added an Entire Michigan Since 2000 — data-driven demographic analysis on Population Pyramids. UN World Population Prospects 2024 / US Census-based reporting.",
  path: "/blog/texas-added-michigan-population",
  type: 'article',
});

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
