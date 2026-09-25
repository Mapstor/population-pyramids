import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/site-meta';

// /states is a Client Component, which cannot export metadata itself; this
// server layout supplies its title/canonical/openGraph. Copy is the page's own
// H1 + intro paragraph.
export const metadata: Metadata = buildMetadata({
  title: 'US States Demographics',
  description:
    'Comprehensive population data for all 50 US states. Explore growth trends, demographic patterns, and migration flows across America.',
  path: '/states',
});

export default function StatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
