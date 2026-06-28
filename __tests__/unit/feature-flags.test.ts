import { describe, it, expect, beforeEach, vi } from 'vitest';

import { clearEdgeConfigCache, getEdgeConfig, getKillSwitch, getBannerMessage, isMaintenanceMode } from '@/lib/edge-config';
import {
  clearFlagCache,
  getBooleanFlag,
  getStringFlag,
  getNumberFlag,
  isRecommendationsEnabled,
  isVideo360Enabled,
  isCartKillSwitchActive,
  isCheckoutKillSwitchActive,
  isSearchEnabled,
  isOAuthEnabled,
  isFeatureFlagsInitialized,
  FLAG_KEYS,
} from '@/lib/feature-flags';

beforeEach(() => {
  clearFlagCache();
  clearEdgeConfigCache();
  vi.resetModules();
});

describe('getBooleanFlag', () => {
  it('returns default when LaunchDarkly not configured', async () => {
    const result = await getBooleanFlag('unknown_flag', true);
    expect(result).toBe(true);
  });

  it('returns false default when no SDK key', async () => {
    const result = await getBooleanFlag('unknown_flag', false);
    expect(result).toBe(false);
  });

  it('caches flag values', async () => {
    const result1 = await getBooleanFlag('cached_flag', true);
    const result2 = await getBooleanFlag('cached_flag', false);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it('passes context to flag evaluation', async () => {
    const result = await getBooleanFlag('test_flag', true, {
      userId: 'user-1',
      locale: 'en',
    });
    expect(typeof result).toBe('boolean');
  });
});

describe('getStringFlag', () => {
  it('returns default string when not configured', async () => {
    const result = await getStringFlag('string_flag', 'default-value');
    expect(result).toBe('default-value');
  });
});

describe('getNumberFlag', () => {
  it('returns default number when not configured', async () => {
    const result = await getNumberFlag('number_flag', 42);
    expect(result).toBe(42);
  });
});

describe('Feature flag helper functions', () => {
  it('isRecommendationsEnabled returns true by default', async () => {
    const result = await isRecommendationsEnabled();
    expect(result).toBe(true);
  });

  it('isVideo360Enabled returns false by default', async () => {
    const result = await isVideo360Enabled();
    expect(result).toBe(false);
  });

  it('isCartKillSwitchActive returns false by default', async () => {
    const result = await isCartKillSwitchActive();
    expect(result).toBe(false);
  });

  it('isCheckoutKillSwitchActive returns false by default', async () => {
    const result = await isCheckoutKillSwitchActive();
    expect(result).toBe(false);
  });

  it('isSearchEnabled returns true by default', async () => {
    const result = await isSearchEnabled();
    expect(result).toBe(true);
  });

  it('isOAuthEnabled returns true by default', async () => {
    const result = await isOAuthEnabled();
    expect(result).toBe(true);
  });

  it('accepts flag context with locale and region', async () => {
    const result = await isRecommendationsEnabled({ locale: 'pt', region: 'BR' });
    expect(result).toBe(true);
  });
});

describe('FLAG_KEYS', () => {
  it('contains recommendations key', () => {
    expect(FLAG_KEYS.RECOMMENDATIONS).toBe('recommendations');
  });

  it('contains video_360 key', () => {
    expect(FLAG_KEYS.VIDEO_360).toBe('video_360');
  });

  it('contains kill switch keys', () => {
    expect(FLAG_KEYS.KILL_SWITCH_CART).toBe('kill_switch_cart');
    expect(FLAG_KEYS.KILL_SWITCH_CHECKOUT).toBe('kill_switch_checkout');
  });

  it('contains search and oauth keys', () => {
    expect(FLAG_KEYS.SEARCH_ENABLED).toBe('search_enabled');
    expect(FLAG_KEYS.OAUTH_ENABLED).toBe('oauth_enabled');
  });
});

describe('isFeatureFlagsInitialized', () => {
  it('returns false before first call', async () => {
    vi.resetModules();
    const { isFeatureFlagsInitialized } = await import('@/lib/feature-flags');
    expect(isFeatureFlagsInitialized()).toBe(false);
  });

  it('returns true after first flag evaluation', async () => {
    await getBooleanFlag('test', true);
    expect(isFeatureFlagsInitialized()).toBe(true);
  });
});

describe('clearFlagCache', () => {
  it('clears cached values allowing re-evaluation', async () => {
    const result1 = await getBooleanFlag('clear_test', true);
    expect(result1).toBe(true);

    clearFlagCache();

    const result2 = await getBooleanFlag('clear_test', false);
    expect(result2).toBe(false);
  });
});

describe('getEdgeConfig', () => {
  it('returns defaults when Edge Config not configured', async () => {
    const config = await getEdgeConfig();
    expect(config.bannerMessage).toBeUndefined();
    expect(config.killSwitches).toEqual({});
    expect(config.featuredProducts).toEqual([]);
    expect(config.maintenanceMode).toBe(false);
  });

  it('caches config data', async () => {
    const config1 = await getEdgeConfig();
    const config2 = await getEdgeConfig();
    expect(config1).toBe(config2);
  });
});

describe('getKillSwitch', () => {
  it('returns false when kill switch not active', async () => {
    const result = await getKillSwitch('checkout');
    expect(result).toBe(false);
  });

  it('returns false for unknown switch name', async () => {
    const result = await getKillSwitch('unknown_switch');
    expect(result).toBe(false);
  });
});

describe('getBannerMessage', () => {
  it('returns undefined message with info type by default', async () => {
    const banner = await getBannerMessage();
    expect(banner.message).toBeUndefined();
    expect(banner.type).toBe('info');
  });
});

describe('isMaintenanceMode', () => {
  it('returns false by default', async () => {
    const result = await isMaintenanceMode();
    expect(result).toBe(false);
  });
});

describe('clearEdgeConfigCache', () => {
  it('clears cached config', async () => {
    const config1 = await getEdgeConfig();
    clearEdgeConfigCache();
    const config2 = await getEdgeConfig();
    expect(config1).not.toBe(config2);
  });
});
