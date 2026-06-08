import { HASH_MAP } from './hashmap';
import type {
  AnimationKey,
  AnimationVariants,
  AssetFormat,
  IllustrationKey,
  IllustrationVariants,
  LogoKey,
  LogoVariants,
} from './types';

export type {
  AnimationKey,
  AnimationVariants,
  AssetFormat,
  IllustrationKey,
  IllustrationVariants,
  LogoKey,
  LogoVariants,
};

const CDN_BASE = 'https://storage.googleapis.com/ent-gcs-eds-prd-001/v1';

function buildVariantKey(
  key: string,
  variants: Record<string, boolean | undefined>,
): string {
  const suffix = Object.entries(variants)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .sort()
    .join('.');
  return suffix ? `${key}.${suffix}` : key;
}

function resolveUrl(
  type: string,
  key: string,
  variants: Record<string, boolean | undefined>,
  format?: string,
): string {
  const fileKey = buildVariantKey(key, variants);
  const mapKey = format && format !== 'svg' ? `${fileKey}.${format}` : fileKey;
  const hashedFilename = HASH_MAP[type]?.[mapKey];
  if (!hashedFilename) {
    throw new Error(
      `@entur/assets: unknown asset "${type}/${mapKey}". ` +
        `Check that the asset exists and the variant/format combination is valid.`,
    );
  }
  return `${CDN_BASE}/${type}/${hashedFilename}`;
}

export function getIllustrationUrl(
  key: IllustrationKey,
  variants?: IllustrationVariants,
  format?: AssetFormat,
): string {
  return resolveUrl('illustrations', key, variants ?? {}, format);
}

export function getAnimationUrl(
  key: AnimationKey,
  variants?: AnimationVariants,
): string {
  return resolveUrl('animations', key, variants ?? {});
}

/**
 * Get CDN URL for a logo.
 *
 * Default is the full color logo on light background.
 * - `symbol: true` — icon/symbol version instead of full logo
 * - `darkmode: true` — variant for dark backgrounds
 * - `contrast: true` — variant for contrast/high-contrast theme
 * - `monochrome: true` — single-color version (baked to theme text color on CDN;
 *   for inline SVG, import the file directly — it uses currentColor)
 */
export function getLogoUrl(
  key: LogoKey,
  variants?: LogoVariants,
  format?: AssetFormat,
): string {
  return resolveUrl('logos', key, variants ?? {}, format);
}
