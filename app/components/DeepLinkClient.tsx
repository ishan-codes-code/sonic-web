'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Download } from 'lucide-react';
import { openSong, openCollection } from '@/lib/deep-link';
import { fetchRemoteConfig } from '@/lib/fetch-config';
import { DEEP_LINK_TIMEOUT_MS, LOADING_MESSAGES, ERROR_MESSAGES, getStoreUrl } from '@/lib/constants';
import type { AppConfig } from '@/types/app-config';

interface DeepLinkClientProps {
  id: string;
  isRemote?: boolean;
  type: 'song' | 'collection';
  icon: React.ReactNode;
  fallbackDescription: string;
}

type PageState = 'opening' | 'fallback';

export function DeepLinkClient({ id, isRemote, type, icon, fallbackDescription }: DeepLinkClientProps) {
  const [pageState, setPageState] = useState<PageState>('opening');
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  // Refs to manage timers for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  /**
   * Initialize deep linking flow
   */
  useEffect(() => {
    // Attempt to open the item in Sonic app immediately
    if (type === 'song') {
      openSong(id, isRemote);
    } else {
      openCollection(id, isRemote);
    }

    // Fetch config asynchronously in the background to resolve the download URL
    fetchRemoteConfig()
      .then((config) => {
        if (mountedRef.current) {
          setAppConfig(config);
        }
      })
      .catch((error) => {
        console.error('[Sonic] Error fetching remote config:', error);
      });

    // Set timeout for fallback UI
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setPageState('fallback');
      }
    }, DEEP_LINK_TIMEOUT_MS);

    // Cleanup function: Clear timers and mark as unmounted
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, isRemote, type]);

  /**
   * Handle download button click
   */
  const handleDownloadClick = useCallback(() => {
    const url = appConfig?.native.updateUrl || getStoreUrl();
    window.location.href = url;
  }, [appConfig]);

  /**
   * Render opening state
   */
  function renderOpening() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-4">
        {/* Animated logo pulse */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 animate-pulse"></div>
          <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-amber-400/20 animate-ping"></div>
        </div>

        {/* Opening Message */}
        <p
          className="text-xl text-amber-500 font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {LOADING_MESSAGES.opening}
        </p>

        {/* Subtitle */}
        <p className="text-sm text-neutral-500 mt-4">
          Launching Sonic app...
        </p>
      </div>
    );
  }

  /**
   * Render fallback state
   */
  function renderFallback() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-4">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* App Name */}
        <h1
          className="text-3xl font-bold text-white mb-2 tracking-tight"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Sonic
        </h1>

        {/* Status Message */}
        <p className="text-neutral-400 text-center mb-2">
          {ERROR_MESSAGES.notFound}
        </p>

        {/* Description */}
        <p className="text-sm text-neutral-500 text-center max-w-md mb-8">
          {fallbackDescription}
        </p>

        {/* Download Button */}
        <button
          onClick={handleDownloadClick}
          className="relative px-8 py-3 rounded-lg font-semibold text-black transition-all duration-300 overflow-hidden group mb-6"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 group-hover:from-amber-300 group-hover:to-amber-400 transition-all duration-300"></div>

          {/* Button text */}
          <span className="relative flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download App
          </span>
        </button>

        {/* Info Section */}
        <div className="mt-8 p-6 rounded-lg bg-neutral-900 border border-neutral-800 max-w-md">
          <h3
            className="text-sm font-semibold text-neutral-200 mb-3"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            About Sonic
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Stream, discover, and share music with Sonic. Your music, your way.
            Available on all devices.
          </p>
        </div>
      </div>
    );
  }

  switch (pageState) {
    case 'opening':
      return renderOpening();
    case 'fallback':
      return renderFallback();
    default:
      return renderOpening();
  }
}
