import type { Metadata } from 'next';
import { CatchAllClient } from './catch-all-client';

/**
 * SEO Metadata for the Catch-All Redirect page
 */
export const metadata: Metadata = {
  title: 'Open in Sonic',
  description: 'Redirecting you to the Sonic app home page...',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Catch-All Dynamic Route
 *
 * Route: /[...catchAll] (Matches all paths except registered ones like /song and /collection)
 *
 * Purpose:
 * Catches any undefined path/gibberish and attempts to redirect the user to the native Sonic app home page.
 */
export default function CatchAllPage() {
  return <CatchAllClient />;
}
