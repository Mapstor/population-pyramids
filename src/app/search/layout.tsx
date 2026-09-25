import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

// /search is a Client Component, which cannot export metadata itself; this
// server layout supplies its title/canonical/openGraph. Copy is the page's own
// H1 + intro paragraph.
export const metadata: Metadata = buildMetadata({
  title: 'Search Countries',
  description: 'Find population pyramids for any of the 195 countries worldwide.',
  path: '/search',
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
