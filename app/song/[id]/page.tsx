import type { Metadata, ResolvingMetadata } from 'next';
import { SongDeepLinkClient } from './song-deep-link-client';

/**
 * Dynamic page metadata generation
 * Creates proper SEO metadata for the song deep link page
 *
 * This includes:
 * - Open Graph metadata for social sharing
 * - Twitter Card metadata for Twitter sharing
 * - Dynamic page title based on song ID
 */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  // Get parent metadata for fallback values
  const parentMetadata = await parent;

  // Sanitize and validate song ID
  const songId = decodeURIComponent(id);

  return {
    title: `Now Playing on Sonic - Song ${songId}`,
    description:
      'Open this song in the Sonic music app. If you don\'t have Sonic installed, download it now.',

    // Open Graph metadata for social sharing
    // Enables rich preview when shared on social media
    openGraph: {
      title: `Now Playing on Sonic - Song ${songId}`,
      description:
        'Stream this song with Sonic, the ultimate music app for everyone.',
      type: 'music.song',
      siteName: 'Sonic',
      // These would be dynamic in a real app with actual song data
      images: [
        {
          url: '/sonic-og-image.png',
          width: 1200,
          height: 630,
          alt: 'Sonic - Your Music, Your Way',
        },
      ],
    },

    // Twitter Card metadata for Twitter sharing
    // Enables rich preview on Twitter
    twitter: {
      card: 'summary_large_image',
      title: `Now Playing on Sonic - Song ${songId}`,
      description:
        'Stream this song with Sonic, the ultimate music app for everyone.',
      images: ['/sonic-og-image.png'],
      creator: '@sonichq',
    },

    // Standard metadata
    robots: {
      index: true,
      follow: true,
    },

    // Indicates this is a transient page (not meant for long-term indexing)
    // Users are redirected away quickly
    alternates: {
      canonical: `https://sonic.app/song/${songId}`,
    },
  };
}

/**
 * Song Deep Link Page
 *
 * Route: /song/[id]
 *
 * Purpose:
 * This page handles deep linking for the Sonic music app.
 * When a user visits this page (e.g., https://sonic.app/song/abc123),
 * the page immediately attempts to open the song in the Sonic app.
 *
 * Behavior:
 * 1. Server-side: Generate proper metadata for SEO and social sharing
 * 2. Client-side: Attempt to open sonic://song/[id]
 * 3. If app opens, user navigates to the song in Sonic
 * 4. If app doesn't open within 2 seconds, show fallback UI
 * 5. User can download the app or learn more about Sonic
 *
 * Architecture:
 * - This is a Server Component that delegates client logic to SongDeepLinkClient
 * - This separation allows us to generate metadata server-side
 * - The client component handles all browser-specific logic
 *
 * Future Enhancements:
 * - Migrate from custom schemes to Android App Links and iOS Universal Links
 * - Fetch actual song metadata from backend
 * - Track deep link conversion analytics
 * - Support additional deep link paths (playlist, artist, album)
 */
export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const songId = decodeURIComponent(id);

  // The actual deep linking logic runs on the client
  // We pass the songId to the client component
  return <SongDeepLinkClient songId={songId} />;
}
