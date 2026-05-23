'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Music, Download, AlertCircle, Zap, Disc3 } from 'lucide-react';
import { openSong, isMobileDevice } from '@/lib/deep-link';
import { fetchRemoteConfig } from '@/lib/fetch-config';
import { DEEP_LINK_TIMEOUT_MS, LOADING_MESSAGES, ERROR_MESSAGES, getStoreUrl } from '@/lib/constants';
import type { AppConfig } from '@/types/app-config';

interface SongDeepLinkClientProps {
  songId: string;
}

type PageState = 'loading' | 'opening' | 'fetching' | 'fallback' | 'maintenance';

/**
 * Song Deep Link Client Component
 *
 * This client component handles all the interactive deep linking logic:
 * 1. Attempts to open the Sonic app with a deep link
 * 2. Fetches remote app configuration
 * 3. Handles timeouts and fallbacks
 * 4. Manages maintenance mode
 * 5. Displays polished loading and fallback UIs
 *
 * The component uses a state machine approach:
 * - 'loading': Initial state, showing "Fetching app info..."
 * - 'opening': Attempting to open the app with deep link
 * - 'fallback': App didn't open within 2 seconds, show download UI
 * - 'maintenance': Remote config indicates maintenance mode
 *
 * Key Features:
 * - Proper cleanup of timers to prevent memory leaks
 * - Dark theme with Amber accents
 * - Mobile-first responsive design
 * - JetBrains Mono typography
 * - Graceful error handling
 */
export function SongDeepLinkClient({ songId }: SongDeepLinkClientProps) {
  // State management
  const [pageState, setPageState] = useState<PageState>('loading');
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [configError, setConfigError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs to manage timers for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  /**
   * Main effect: Initialize deep linking flow
   *
   * Sequence:
   * 1. Fetch remote app config
   * 2. Check if maintenance mode is enabled
   *    - If yes, show maintenance screen
   *    - If no, proceed to attempt deep link
   * 3. Attempt to open the app
   * 4. Set timeout for fallback UI (2 seconds)
   */
  useEffect(() => {
    // Detect if we're on mobile (more reliable deep linking)
    setIsMobile(isMobileDevice());

    // Async function to orchestrate the deep linking flow
    const initializeDeepLink = async () => {
      try {
        // Step 1: Fetch remote app configuration
        // This tells us about maintenance mode, updates, and download URLs
        setPageState('fetching');
        const config = await fetchRemoteConfig();

        if (!mountedRef.current) return;

        setAppConfig(config);

        // Step 2: Check for maintenance mode
        // If enabled, show maintenance screen instead of attempting to open app
        if (config.maintenance.enabled) {
          setPageState('maintenance');
          return;
        }

        // Step 3: Attempt to open the song in Sonic app
        setPageState('opening');
        await openSong(songId);

        if (!mountedRef.current) return;

        // Step 4: Set timeout for fallback UI
        // If the app didn't open within 2 seconds, the user probably doesn't have it
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setPageState('fallback');
          }
        }, DEEP_LINK_TIMEOUT_MS);
      } catch (error) {
        console.error('[Sonic] Error in deep link initialization:', error);

        if (!mountedRef.current) return;

        setConfigError(true);
        setPageState('fallback');
      }
    };

    initializeDeepLink();

    // Cleanup function: Clear timers and mark as unmounted
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [songId]);

  /**
   * Handle download button click
   * Navigates to the app store (Play Store or App Store based on device)
   */
  const handleDownloadClick = useCallback(() => {
    const url = appConfig?.native.updateUrl || getStoreUrl();
    window.location.href = url;
  }, [appConfig]);

  /**
   * Render loading state
   * Shows "Fetching app info..." with elegant spinner
   */
  function renderLoading() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-4">
        {/* Spinner Container */}
        <div className="relative w-16 h-16 mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 border-r-amber-400 animate-spin"></div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-500/10 to-amber-600/5 animate-pulse"></div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          </div>
        </div>

        {/* Loading Message */}
        <p
          className="text-lg text-neutral-200 font-medium tracking-tight"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {LOADING_MESSAGES.fetching}
        </p>

        {/* Subtitle */}
        <p className="text-sm text-neutral-500 mt-3">
          Checking app status...
        </p>
      </div>
    );
  }

  /**
   * Render opening state
   * Shows "Opening Sonic..." while waiting for app to open
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
   * Shows "Sonic app not detected" with download option
   */
  function renderFallback() {
    const downloadUrl = appConfig?.native.updateUrl || getStoreUrl();

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-4">
        {/* Sonic Logo / Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center">
            <Disc3 className="w-12 h-12 text-amber-500" />
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
          The Sonic app isn't currently installed on this device. Download it
          now to start streaming your favorite music.
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

        {/* Error State Indicator */}
        {configError && (
          <p className="text-xs text-neutral-600 mt-6">
            Note: Using default download URL
          </p>
        )}
      </div>
    );
  }

  /**
   * Render maintenance state
   * Shows maintenance message when maintenance.enabled === true
   */
  function renderMaintenance() {
    const message = appConfig?.maintenance.message || 'Sonic is undergoing scheduled maintenance.';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-4">
        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center">
            <Zap className="w-12 h-12 text-amber-500" />
          </div>
        </div>

        {/* Status Title */}
        <h1
          className="text-3xl font-bold text-white mb-2 tracking-tight"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Maintenance Mode
        </h1>

        {/* Status Message */}
        <p className="text-amber-500 text-center mb-6 max-w-md font-medium">
          {message}
        </p>

        {/* Description */}
        <p className="text-sm text-neutral-500 text-center max-w-md mb-8">
          We're making Sonic even better. We'll be back soon!
        </p>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs text-neutral-400">Maintenance in progress</span>
        </div>
      </div>
    );
  }

  /**
   * State-based rendering
   * Displays the appropriate UI based on the current state
   */
  switch (pageState) {
    case 'loading':
      return renderLoading();
    case 'opening':
      return renderOpening();
    case 'fallback':
      return renderFallback();
    case 'maintenance':
      return renderMaintenance();
    default:
      return renderLoading();
  }
}
