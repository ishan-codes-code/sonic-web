/**
 * Remote App Configuration Fetcher
 * Handles fetching, caching, and validating the app config from the remote GitHub source
 *
 * This utility:
 * - Fetches app config JSON from GitHub
 * - Implements browser-based caching (sessionStorage)
 * - Validates the config structure
 * - Provides fallback defaults if fetch fails
 * - Handles errors gracefully
 */

import { REMOTE_CONFIG_URL, CONFIG_CACHE_DURATION_MS } from './constants';
import type { AppConfig, AppConfigResponse } from '@/types/app-config';

/**
 * Cache key for storing config in sessionStorage
 */
const CACHE_KEY = 'sonic:app-config-cache';

/**
 * Default/fallback app configuration
 * Used if remote fetch fails to maintain app functionality
 */
const DEFAULT_CONFIG: AppConfig = {
  maintenance: {
    enabled: false,
    message: '',
  },
  native: {
    version: '1.0.0',
    minRequiredVersion: '1.0.0',
    forceUpdate: false,
    updateUrl: 'https://play.google.com/store/apps/details?id=com.sonic.app',
  },
  ota: {
    version: '1.0.0',
    force: false,
    message: '',
  },
};

/**
 * Validates that the fetched config has the required structure
 * Ensures data integrity before using it in the app
 */
function validateConfig(config: unknown): config is AppConfig {
  if (!config || typeof config !== 'object') return false;

  const cfg = config as Record<string, unknown>;

  // Check maintenance object
  if (!cfg.maintenance || typeof cfg.maintenance !== 'object') return false;
  const maint = cfg.maintenance as Record<string, unknown>;
  if (typeof maint.enabled !== 'boolean' || typeof maint.message !== 'string')
    return false;

  // Check native object
  if (!cfg.native || typeof cfg.native !== 'object') return false;
  const native = cfg.native as Record<string, unknown>;
  if (
    typeof native.version !== 'string' ||
    typeof native.minRequiredVersion !== 'string' ||
    typeof native.forceUpdate !== 'boolean' ||
    typeof native.updateUrl !== 'string'
  )
    return false;

  // Check ota object
  if (!cfg.ota || typeof cfg.ota !== 'object') return false;
  const ota = cfg.ota as Record<string, unknown>;
  if (
    typeof ota.version !== 'string' ||
    typeof ota.force !== 'boolean' ||
    typeof ota.message !== 'string'
  )
    return false;

  return true;
}

/**
 * Try to get cached config from sessionStorage
 * Returns null if cache doesn't exist or has expired
 */
function getCachedConfig(): AppConfig | null {
  try {
    if (typeof window === 'undefined') return null;

    const cached = window.sessionStorage?.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed: AppConfigResponse = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired
    if (parsed.expiresAt && now > parsed.expiresAt) {
      window.sessionStorage?.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.config;
  } catch (error) {
    // Silently fail - cache might be corrupted
    console.debug('[Sonic] Failed to retrieve cached config:', error);
    return null;
  }
}

/**
 * Store config in sessionStorage with expiration time
 */
function setCachedConfig(config: AppConfig): void {
  try {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const response: AppConfigResponse = {
      config,
      fetchedAt: now,
      expiresAt: now + CONFIG_CACHE_DURATION_MS,
    };

    window.sessionStorage?.setItem(CACHE_KEY, JSON.stringify(response));
  } catch (error) {
    // Silently fail - storage might be full or disabled
    console.debug('[Sonic] Failed to cache config:', error);
  }
}

/**
 * Fetch the app configuration from the remote GitHub source
 *
 * Behavior:
 * 1. Check if config is cached and valid (not expired)
 * 2. If cached, return immediately
 * 3. If not cached or expired, fetch from remote URL
 * 4. Validate the fetched config structure
 * 5. Cache the valid config
 * 6. Return the config or default if fetch fails
 *
 * @returns Promise<AppConfig> - The app configuration (or defaults if fetch fails)
 *
 * @example
 * const config = await fetchRemoteConfig();
 * if (config.maintenance.enabled) {
 *   showMaintenanceScreen(config.maintenance.message);
 * }
 */
export async function fetchRemoteConfig(): Promise<AppConfig> {
  try {
    // Try to get cached config first (browser-side caching)
    const cachedConfig = getCachedConfig();
    if (cachedConfig) {
      console.debug('[Sonic] Using cached app config');
      return cachedConfig;
    }

    console.debug('[Sonic] Fetching remote app config from:', REMOTE_CONFIG_URL);

    const response = await fetch(REMOTE_CONFIG_URL, {
      // Don't cache at HTTP level - we manage caching in sessionStorage
      cache: 'no-store',
      // 5 second timeout for remote config fetch
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch config: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate the fetched config
    if (!validateConfig(data)) {
      throw new Error('Invalid app config structure');
    }

    // Cache the valid config
    setCachedConfig(data);

    console.debug('[Sonic] Successfully fetched and cached app config');
    return data;
  } catch (error) {
    console.warn('[Sonic] Error fetching remote config, using defaults:', error);
    // Return default config if fetch fails
    // This ensures the app still works even if GitHub is unreachable
    return DEFAULT_CONFIG;
  }
}

/**
 * Clear the cached config
 * Useful for testing or when you want to force a fresh fetch
 */
export function clearConfigCache(): void {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage?.removeItem(CACHE_KEY);
  } catch (error) {
    console.debug('[Sonic] Failed to clear config cache:', error);
  }
}
