/**
 * Deep Linking Constants for Sonic App
 * Centralized configuration for app scheme, fallback URLs, and deep linking behavior
 *
 * How Deep Linking Works:
 * 1. Web user clicks link: https://sonic.app/song/abc123
 * 2. Browser attempts to open custom scheme: sonic://song/abc123
 * 3. If Sonic app is installed, it receives the deep link and navigates to the song
 * 4. If Sonic app is not installed (within 2 seconds), user sees fallback UI to download
 *
 * Expo Deep Linking Setup (app.json):
 * - Custom scheme: "sonic://" - handles sonic://song/[id]
 * - Android App Links: Will use https://sonic.app/song/[id] for better security
 * - iOS Universal Links: Will use https://sonic.app/song/[id] for seamless routing
 *
 * Android App Links Setup:
 * - Requires assetlinks.json at: public/.well-known/assetlinks.json
 * - This file verifies ownership of the domain
 * - Android verifies the JSON matches the app's signing certificate
 * - Get SHA256 fingerprint: keytool -list -v -keystore app.jks
 * - This enables secure, cookie-preserving deep links
 *
 * iOS Universal Links Setup:
 * - Requires apple-app-site-association at: public/.well-known/apple-app-site-association
 * - This file declares which URLs the app handles (no .json extension)
 * - Apple validates the file is hosted on your domain over HTTPS
 * - Enables seamless app-to-web routing without any dialogs
 * - Format includes appID: "TEAM_ID.com.sonic.app" and path patterns
 * - Get Team ID from Apple Developer account (10 character alphanumeric)
 *
 * This setup supports:
 * - Immediate app opening if installed
 * - Graceful fallback for non-installed users
 * - Dynamic app config from remote source
 * - Maintenance mode handling
 */

// ============================================================================
// APP SCHEME CONFIGURATION
// ============================================================================

/** The custom URI scheme registered in Expo app.json (app.json > scheme) */
export const APP_SCHEME = 'sonic';

/** Full app scheme prefix for deep linking */
export const APP_SCHEME_PREFIX = `${APP_SCHEME}://`;

// ============================================================================
// DEEP LINK PATHS
// ============================================================================

/** Available deep link paths in the app */
export const DEEP_LINK_PATHS = {
  song: 'song',
  collection: 'collections',
} as const;

// ============================================================================
// REMOTE APP CONFIG
// ============================================================================

/**
 * Remote app configuration source
 * This JSON file contains:
 * - Maintenance mode status
 * - Native app version info
 * - OTA update configuration
 * - Download URLs
 *
 * Structure:
 * {
 *   "maintenance": { "enabled": boolean, "message": string },
 *   "native": { "version": string, "minRequiredVersion": string, "forceUpdate": boolean, "updateUrl": string },
 *   "ota": { "version": string, "force": boolean, "message": string }
 * }
 */
export const REMOTE_CONFIG_URL =
  'https://raw.githubusercontent.com/ishan-codes-code/app-config-sonic/main/app-config.json';

/** Cache duration for remote config in milliseconds (5 minutes) */
export const CONFIG_CACHE_DURATION_MS = 5 * 60 * 1000;

// ============================================================================
// FALLBACK & STORE URLs
// ============================================================================

/**
 * Store URLs for app download
 * Used as fallback when:
 * 1. App is not installed (after 2 second timeout)
 * 2. UpdateUrl from remote config is invalid
 */
export const STORE_URLS = {
  playStore: 'https://play.google.com/store/apps/details?id=com.sonic.app',
  appStore: 'https://apps.apple.com/app/sonic-music/id1234567890', // TODO: Replace with actual app ID
} as const;

// ============================================================================
// DEEP LINKING BEHAVIOR
// ============================================================================

/**
 * Timeout duration before showing fallback UI
 * If the app doesn't open within this time, the user likely doesn't have it installed
 * Standard is 2000ms (2 seconds) as per Spotify/Apple Music patterns
 */
export const DEEP_LINK_TIMEOUT_MS = 2000;

/**
 * Additional delay before checking if app opened
 * Gives the browser time to attempt the redirect
 */
export const DEEP_LINK_CHECK_DELAY_MS = 50;

// ============================================================================
// APP METADATA
// ============================================================================

export const APP_NAME = 'Sonic';
export const APP_DESCRIPTION =
  'Your music, your way. Stream anywhere with Sonic – the ultimate music companion for Expo.';
export const APP_URL = 'https://sonic.app';
export const APP_LOGO_URL = `${APP_URL}/logo.png`;

// ============================================================================
// THEME & UI CONSTANTS
// ============================================================================

/**
 * Accent color for UI (Amber)
 * Used for loading indicators, buttons, glows, and highlights
 * Follows modern music app design patterns (Spotify, Apple Music)
 */
export const ACCENT_COLOR = '#f59e0b'; // Amber-500
export const ACCENT_COLOR_LIGHT = '#fbbf24'; // Amber-400
export const ACCENT_COLOR_DARK = '#d97706'; // Amber-600

/**
 * Font configuration
 * JetBrains Mono for modern, technical look
 */
export const FONTS = {
  mono: 'var(--font-mono)',
} as const;

// ============================================================================
// STATUS MESSAGES
// ============================================================================

export const LOADING_MESSAGES = {
  opening: 'Opening Sonic...',
  fetching: 'Fetching app info...',
  checking: 'Checking app status...',
} as const;

export const ERROR_MESSAGES = {
  notFound: 'Sonic app not detected',
  configFetchFailed: 'Failed to fetch app configuration',
  maintenance: 'Sonic is undergoing maintenance',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detect the user's platform
 * Used to serve the correct download URL
 */
export function getUserPlatform(): 'ios' | 'android' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'unknown';
}

/**
 * Get the appropriate store URL based on platform
 */
export function getStoreUrl(platform?: 'ios' | 'android'): string {
  const targetPlatform = platform || getUserPlatform();
  return targetPlatform === 'ios' ? STORE_URLS.appStore : STORE_URLS.playStore;
}
