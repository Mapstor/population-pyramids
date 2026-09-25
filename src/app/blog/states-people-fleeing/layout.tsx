import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

export const metadata: Metadata = buildMetadata({
  title: "States People Fleeing",
  description: "States People Fleeing — data-driven demographic analysis on Population Pyramids. UN World Population Prospects 2024 / US Census-based reporting.",
  path: "/blog/states-people-fleeing",
  type: 'article',
});

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
