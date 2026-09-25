import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = buildMetadata({
  title: "Nevada vs West Virginia: Boom vs Bust Population Gap",
  description: "Nevada vs West Virginia: Boom vs Bust Population Gap — data-driven demographic analysis on Population Pyramids. UN World Population Prospects 2024 / US Census-based reporting.",
  path: "/blog/nevada-west-virginia-population-gap",
  type: 'article',
});

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
