/**
 * App Configuration Types
 * Defines the structure of the remote app config fetched from GitHub
 * This configuration is used to determine app behavior, update status, and maintenance mode
 */

export interface AppConfigMaintenance {
  /** Whether maintenance mode is enabled */
  enabled: boolean;
  /** Message to display to users during maintenance */
  message: string;
}

export interface AppConfigNative {
  /** Current native app version (semantic versioning) */
  version: string;
  /** Minimum required version - users on older versions will see force update prompt */
  minRequiredVersion: string;
  /** Whether to force update native app */
  forceUpdate: boolean;
  /** URL to the APK or app binary for download */
  updateUrl: string;
}

export interface AppConfigOTA {
  /** Current OTA (Over-The-Air) update version */
  version: string;
  /** Whether to force OTA update */
  force: boolean;
  /** Message about the OTA update changes */
  message: string;
}

export interface AppConfig {
  /** Maintenance mode configuration */
  maintenance: AppConfigMaintenance;
  /** Native app version and update configuration */
  native: AppConfigNative;
  /** Over-The-Air update configuration */
  ota: AppConfigOTA;
}

/**
 * API Response wrapper for the app config
 * Includes metadata about the fetch
 */
export interface AppConfigResponse {
  config: AppConfig;
  fetchedAt: number;
  expiresAt: number;
}
