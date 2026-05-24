import type { Metadata } from 'next';
import { CollectionDeepLinkClient } from './collection-deep-link-client';

interface RouteProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ isRemote?: string }>;
}

function isValidId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id) ||
         /^\d+$/.test(id);
}

/**
 * Dynamic page metadata generation for Collection deep link page
 */
export async function generateMetadata(
  { params, searchParams }: RouteProps
): Promise<Metadata> {
  const { id } = await params;
  const { isRemote } = await searchParams;

  // Sanitize and validate collection ID
  const collectionId = decodeURIComponent(id);

  if (!isValidId(collectionId)) {
    return {
      title: 'Open in Sonic',
      description: 'Open this in the Sonic music app.',
      robots: { index: false, follow: false },
    };
  }

  const isRemoteBool = isRemote !== undefined && isRemote !== 'false';

  return {
    title: `Sonic Collection - ${collectionId}`,
    description: `Open this collection in the Sonic music app. ${
      isRemoteBool ? 'Accessing remote collection.' : ''
    } If you don't have Sonic installed, download it now.`,

    // Open Graph metadata for social sharing
    openGraph: {
      title: `Sonic Collection - ${collectionId}`,
      description: 'Stream this collection with Sonic, the ultimate music app for everyone.',
      type: 'music.playlist',
      siteName: 'Sonic',
    },

    // Twitter Card metadata for Twitter sharing
    twitter: {
      card: 'summary_large_image',
      title: `Sonic Collection - ${collectionId}`,
      description: 'Stream this collection with Sonic, the ultimate music app for everyone.',
      creator: '@sonichg',
    },

    // Standard metadata
    robots: {
      index: true,
      follow: true,
    },

    // Indicates this is a transient page
    alternates: {
      canonical: `https://sonic.app/collections/${collectionId}${
        isRemoteBool ? '?isRemote=true' : ''
      }`,
    },
  };
}

/**
 * Collection Deep Link Page
 *
 * Route: /collection/[id]
 * Optional Query: ?isRemote=true
 *
 * Purpose:
 * Handles deep linking for Sonic music collections.
 * Attempts to launch the native app using: sonic://collection/[id]?isRemote=true
 */
export default async function CollectionPage({
  params,
  searchParams,
}: RouteProps) {
  const { id } = await params;
  const { isRemote } = await searchParams;
  const collectionId = decodeURIComponent(id);
  const isRemoteBool = isRemote !== undefined && isRemote !== 'false';

  // The actual deep linking logic runs on the client
  return <CollectionDeepLinkClient collectionId={collectionId} isRemote={isRemoteBool} />;
}
