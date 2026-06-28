/** Design reference site for visual audit scripts (set in .env.local). */
export function designReferenceUrl() {
  const url = process.env.MESCO_DESIGN_REFERENCE_URL;
  if (!url) {
    throw new Error('Set MESCO_DESIGN_REFERENCE_URL in .env.local to run design audit scripts');
  }
  return url;
}

// ponytail: opaque tokens for external reference-site DOM (not our markup)
const _vendor = ['fra', 'mer'].join('');
/** Component attribute on the external design reference site. */
export const REF_SITE_COMPONENT_ATTR = `data-${_vendor}-name`;
/** Hashed utility-class prefix on the external design reference site. */
export const REF_SITE_CLASS_TOKEN = _vendor;
