import { logger } from '@/lib/logger';

export interface FlagContext {
  userId?: string;
  locale?: string;
  region?: string;
  [key: string]: unknown;
}

export type FlagValue = boolean | string | number;

interface FlagClient {
  getBooleanValue: (
    key: string,
    defaultValue: boolean,
    context?: Record<string, unknown>
  ) => boolean;
  getStringValue: (
    key: string,
    defaultValue: string,
    context?: Record<string, unknown>
  ) => string;
  getNumberValue: (
    key: string,
    defaultValue: number,
    context?: Record<string, unknown>
  ) => number;
}

const CACHE_TTL = 60_000;
const cache = new Map<string, { value: FlagValue; expires: number }>();

let openFeatureClient: FlagClient | null = null;
let initPromise: Promise<void> | null = null;
let initialized = false;

async function dynamicImport(modulePath: string): Promise<Record<string, unknown> | null> {
  try {
    const mod = await import(/* webpackIgnore: true */ modulePath);
    return mod as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function initFeatureFlags(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = doInit();
  await initPromise;
}

async function doInit(): Promise<void> {
  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  if (!sdkKey) {
    logger.info('Feature flags: LaunchDarkly SDK key not set, using defaults');
    initialized = true;
    return;
  }

  const sdkMod = await dynamicImport('@openfeature/server-sdk');
  const providerMod = await dynamicImport('@openfeature/launchdarkly-provider');

  if (!sdkMod || !providerMod) {
    logger.info('Feature flags: OpenFeature packages not installed, using defaults');
    initialized = true;
    return;
  }

  try {
    const OpenFeature = sdkMod.OpenFeature as {
      setProviderAndWait: (provider: unknown) => Promise<void>;
      getClient: () => FlagClient;
    };
    const LaunchDarklyProvider = providerMod.LaunchDarklyProvider as new (
      key: string
    ) => unknown;

    const provider = new LaunchDarklyProvider(sdkKey);
    await OpenFeature.setProviderAndWait(provider);
    openFeatureClient = OpenFeature.getClient();
    initialized = true;
    logger.info('Feature flags: OpenFeature initialized with LaunchDarkly');
  } catch (error) {
    logger.warn('Feature flags: Failed to initialize, using defaults', {
      error: error instanceof Error ? error.message : String(error),
    });
    initialized = true;
  }
}

function getCached(key: string): FlagValue | undefined {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) {
    return entry.value;
  }
  cache.delete(key);
  return undefined;
}

function setCached(key: string, value: FlagValue): void {
  cache.set(key, { value, expires: Date.now() + CACHE_TTL });
}

export async function getBooleanFlag(
  key: string,
  defaultValue: boolean,
  context?: FlagContext
): Promise<boolean> {
  const cached = getCached(key);
  if (cached !== undefined) return cached as boolean;

  await initFeatureFlags();

  if (!openFeatureClient) {
    setCached(key, defaultValue);
    return defaultValue;
  }

  try {
    const value = openFeatureClient.getBooleanValue(key, defaultValue, context);
    setCached(key, value);
    return value;
  } catch {
    return defaultValue;
  }
}

export async function getStringFlag(
  key: string,
  defaultValue: string,
  context?: FlagContext
): Promise<string> {
  await initFeatureFlags();

  if (!openFeatureClient) return defaultValue;

  try {
    return openFeatureClient.getStringValue(key, defaultValue, context);
  } catch {
    return defaultValue;
  }
}

export async function getNumberFlag(
  key: string,
  defaultValue: number,
  context?: FlagContext
): Promise<number> {
  await initFeatureFlags();

  if (!openFeatureClient) return defaultValue;

  try {
    return openFeatureClient.getNumberValue(key, defaultValue, context);
  } catch {
    return defaultValue;
  }
}

export function clearFlagCache(): void {
  cache.clear();
}

export function isFeatureFlagsInitialized(): boolean {
  return initialized;
}

export const FLAG_KEYS = {
  RECOMMENDATIONS: 'recommendations',
  VIDEO_360: 'video_360',
  KILL_SWITCH_CART: 'kill_switch_cart',
  KILL_SWITCH_CHECKOUT: 'kill_switch_checkout',
  SEARCH_ENABLED: 'search_enabled',
  OAUTH_ENABLED: 'oauth_enabled',
} as const;

export async function isRecommendationsEnabled(context?: FlagContext): Promise<boolean> {
  return getBooleanFlag(FLAG_KEYS.RECOMMENDATIONS, true, context);
}

export async function isVideo360Enabled(context?: FlagContext): Promise<boolean> {
  return getBooleanFlag(FLAG_KEYS.VIDEO_360, false, context);
}

export async function isCartKillSwitchActive(context?: FlagContext): Promise<boolean> {
  return getBooleanFlag(FLAG_KEYS.KILL_SWITCH_CART, false, context);
}

export async function isCheckoutKillSwitchActive(context?: FlagContext): Promise<boolean> {
  return getBooleanFlag(FLAG_KEYS.KILL_SWITCH_CHECKOUT, false, context);
}

export async function isSearchEnabled(context?: FlagContext): Promise<boolean> {
  return getBooleanFlag(FLAG_KEYS.SEARCH_ENABLED, true, context);
}

export async function isOAuthEnabled(context?: FlagContext): Promise<boolean> {
  return getBooleanFlag(FLAG_KEYS.OAUTH_ENABLED, true, context);
}
