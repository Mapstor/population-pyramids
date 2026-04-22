import * as React from 'react';

interface DataGuardProps {
  when: boolean;
  children: React.ReactNode;
}

/**
 * Renders children only if `when` is true. Renders nothing otherwise —
 * no placeholder, no fallback, no "N/A". Per verified-or-omitted policy.
 */
export function DataGuard({ when, children }: DataGuardProps) {
  if (!when) return null;
  return <>{children}</>;
}