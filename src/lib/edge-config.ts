import { logger } from '@/lib/logger';

export interface EdgeConfigData {
  bannerMessage?: string;
  bannerType?: 'info' | 'warning' | 'error';
  killSwitches?: Record<string, boolean>;
  featuredProducts?: string[];
  maintenanceMode?: boolean;
}

const CACHE_TTL = 30_000;
let cachedData: { data: EdgeConfigData; expires: number } | null = null;

let edgeConfigClient: Record<string, unknown> | null = null;
let initAttempted = false;

async function dynamicImport(modulePath: string): Promise<Record<string, unknown> | null> {
  try {
    const mod = await import(/* webpackIgnore: true */ modulePath);
    return mod as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function initEdgeConfig(): Promise<void> {
  if (initAttempted) return;
  initAttempted = true;

  const connectionString = process.env.EDGE_CONFIG;
  if (!connectionString) {
    logger.info('Edge Config: No connection string set, using defaults');
    return;
  }

  const mod = await dynamicImport('@vercel/edge-config');
  if (!mod) {
    logger.info('Edge Config: @vercel/edge-config not installed, using defaults');
    return;
  }

  try {
    const createClient = mod.createClient as (conn: string) => Record<string, unknown>;
    edgeConfigClient = createClient(connectionString);
    logger.info('Edge Config: Initialized');
  } catch (error) {
    logger.warn('Edge Config: Failed to initialize', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function getFromEdgeConfig<T>(key: string): Promise<T | undefined> {
  if (!edgeConfigClient) return undefined;
  try {
    const get = edgeConfigClient.get as (k: string) => Promise<T | undefined>;
    return await get(key);
  } catch {
    return undefined;
  }
}

export async function getEdgeConfig(): Promise<EdgeConfigData> {
  if (cachedData && cachedData.expires > Date.now()) {
    return cachedData.data;
  }

  await initEdgeConfig();

  if (!edgeConfigClient) {
    const defaults: EdgeConfigData = {
      bannerMessage: undefined,
      killSwitches: {},
      featuredProducts: [],
      maintenanceMode: false,
    };
    cachedData = { data: defaults, expires: Date.now() + CACHE_TTL };
    return defaults;
  }

  const [bannerMessage, bannerType, killSwitches, featuredProducts, maintenanceMode] =
    await Promise.all([
      getFromEdgeConfig<string>('banner_message'),
      getFromEdgeConfig<'info' | 'warning' | 'error'>('banner_type'),
      getFromEdgeConfig<Record<string, boolean>>('kill_switches'),
      getFromEdgeConfig<string[]>('featured_products'),
      getFromEdgeConfig<boolean>('maintenance_mode'),
    ]);

  const data: EdgeConfigData = {
    bannerMessage,
    bannerType: bannerType ?? 'info',
    killSwitches: killSwitches ?? {},
    featuredProducts: featuredProducts ?? [],
    maintenanceMode: maintenanceMode ?? false,
  };

  cachedData = { data, expires: Date.now() + CACHE_TTL };
  return data;
}

export async function getKillSwitch(name: string): Promise<boolean> {
  const config = await getEdgeConfig();
  return config.killSwitches?.[name] === true;
}

export async function getBannerMessage(): Promise<{
  message?: string;
  type: 'info' | 'warning' | 'error';
}> {
  const config = await getEdgeConfig();
  return {
    message: config.bannerMessage,
    type: config.bannerType ?? 'info',
  };
}

export async function isMaintenanceMode(): Promise<boolean> {
  const config = await getEdgeConfig();
  return config.maintenanceMode === true;
}

export function clearEdgeConfigCache(): void {
  cachedData = null;
}

export function isEdgeConfigInitialized(): boolean {
  return initAttempted;
}
