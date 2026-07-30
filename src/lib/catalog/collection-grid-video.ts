export interface CollectionGridVideoConfig {
  src: string;
  alt: string;
}

const COLLECTION_GRID_VIDEOS: Record<string, CollectionGridVideoConfig> = {
  'jardim-oriental': {
    src: '/Video%20New%20Collections.mp4',
    alt: 'New Collections',
  },
};

export function getCollectionGridVideo(handle: string): CollectionGridVideoConfig | null {
  return COLLECTION_GRID_VIDEOS[handle] ?? null;
}

/** Number of product slots replaced by the grid video on the first row. */
export const COLLECTION_GRID_VIDEO_SLOT_COUNT = 2;
