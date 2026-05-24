/**
 * Deep Linking Utilities for Sonic App
 * Provides helper functions for deep linking to the Expo app
 *
 * How this works:
 * 1. buildSongDeepLink(songId) - Constructs the deep link URI
 * 2. openSong(songId) - Attempts to open the song in the Sonic app
 *
 * Deep Linking Flow:
 * - Custom URI Scheme (sonic://song/[id]):
 *   Used by the Expo app when registered in app.json with scheme: "sonic"
 *   When user clicks a link with this scheme, the OS attempts to open it with the registered app
 *
 * - Fallback Mechanism:
 *   If the app doesn't open within 2 seconds, we show the fallback UI instead
 *   This indicates the user doesn't have the app installed
 *
 * - Future: Android App Links & iOS Universal Links:
 *   Eventually, we'll migrate from custom schemes to:
 *   - Android App Links: https://sonic.app/song/[id] with assetlinks.json
 *   - iOS Universal Links: https://sonic.app/song/[id] with apple-app-site-association
 *   These are more secure and provide better UX (no "Open with..." dialog)
 *
 * @example
 * // Build a deep link
 * const deepLink = buildSongDeepLink('abc123');
 * // Result: "sonic://song/abc123"
 *
 * @example
 * // Open a song in the Sonic app
 * openSong('abc123');
 * // Browser attempts to open sonic://song/abc123
 * // If app is installed, it opens
 * // If not, fallback UI appears after 2 seconds
 */


import { APP_SCHEME_PREFIX, DEEP_LINK_PATHS } from "./constants";

/**
 * Build a deep link URI for opening a song in Sonic
 *
 * Deep Link Structure:
 * sonic://song/[songId]
 *
 * When clicked/opened:
 * 1. Browser recognizes the custom scheme (sonic://)
 * 2. OS checks if any app is registered for this scheme
 * 3. If Sonic is installed, OS launches it with the deep link
 * 4. Expo app handles the deep link with its navigation config
 *
 * @param songId - The ID of the song to open
 * @returns The complete deep link URI
 *
 * @example
 * const deepLink = buildSongDeepLink('abc123');
 * // Returns: "sonic://song/abc123"
 */
export function buildSongDeepLink(songId: string, isRemote?: boolean): string {
  if (!songId || typeof songId !== "string") {
    throw new Error("Invalid songId provided to buildSongDeepLink");
  }

  // Sanitize songId - remove any URL-unsafe characters
  const sanitizedId = encodeURIComponent(songId);

  let deepLink = `${APP_SCHEME_PREFIX}${DEEP_LINK_PATHS.song}/${sanitizedId}`;
  if (isRemote !== undefined) {
    deepLink += `?isRemote=${isRemote}`;
  }
  return deepLink;
}

/**
 * Build a deep link URI for opening a collection in Sonic
 *
 * Deep Link Structure:
 * sonic://collections/[collectionId]?isRemote=true
 *
 * @param collectionId - The ID of the collection to open
 * @param isRemote - Whether the collection is remote
 * @returns The complete deep link URI
 */
export function buildCollectionDeepLink(
  collectionId: string,
  isRemote?: boolean,
): string {
  if (!collectionId || typeof collectionId !== "string") {
    throw new Error("Invalid collectionId provided to buildCollectionDeepLink");
  }

  // Sanitize collectionId - remove any URL-unsafe characters
  const sanitizedId = encodeURIComponent(collectionId);

  let deepLink = `${APP_SCHEME_PREFIX}${DEEP_LINK_PATHS.collection}/${sanitizedId}`;
  if (isRemote !== undefined) {
    deepLink += `?isRemote=${isRemote}`;
  }

  return deepLink;
}

/**
 * Attempt to open a song in the Sonic app
 *
 * This function:
 * 1. Builds the deep link using the custom URI scheme
 * 2. Attempts to navigate to the deep link
 * 3. Returns a promise that resolves when the attempt completes
 *
 * Important:
 * - There's no way to detect if the app actually opened (browser limitation)
 * - This function doesn't fail if the app isn't installed
 * - The caller should implement a timeout to show fallback UI
 *
 * Browser Behavior:
 * - If the app is installed and registered for the scheme, it opens
 * - If the app is not installed, nothing happens (silently fails)
 * - Some browsers (like Chrome on Android) may show a fallback option
 *
 * @param songId - The ID of the song to open
 * @returns Promise that resolves after the navigation attempt
 *
 * @example
 * // Attempt to open a song
 * await openSong('abc123');
 *
 * // Set a timeout for the fallback UI
 * const fallbackTimer = setTimeout(() => {
 *   showFallbackUI(); // Show "Download App" UI
 * }, 2000);
 *
 * // If user navigates away, clear the timer
 * return () => clearTimeout(fallbackTimer);
 */
export function openSong(songId: string, isRemote?: boolean): void {
  try {
    const deepLink = buildSongDeepLink(songId, isRemote);
    console.debug("[Sonic] Attempting to open deep link:", deepLink);
    window.location.href = deepLink;
  } catch (error) {
    console.error("[Sonic] Error attempting to open deep link:", error);
  }
}

/**
 * Attempt to open a collection in the Sonic app
 *
 * @param collectionId - The ID of the collection to open
 * @param isRemote - Whether the collection is remote
 * @returns Promise that resolves after the navigation attempt
 */
export function openCollection(collectionId: string, isRemote?: boolean): void {
  try {
    const deepLink = buildCollectionDeepLink(collectionId, isRemote);
    console.debug("[Sonic] Attempting to open deep link:", deepLink);
    window.location.href = deepLink;
  } catch (error) {
    console.error("[Sonic] Error attempting to open deep link:", error);
  }
}

/**
 * Check if we're on a mobile device
 * Useful for deciding whether to show deep linking UI
 *
 * @returns true if the user is on a mobile device (iOS or Android)
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
    ua,
  );
}

/**
 * Check if we're on iOS
 * Useful for platform-specific handling
 *
 * @returns true if the user is on iOS (iPhone, iPad, iPod)
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

/**
 * Check if we're on Android
 * Useful for platform-specific handling
 *
 * @returns true if the user is on Android
 */
export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  return /android/.test(ua);
}
