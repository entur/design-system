import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const ASSET_TYPES = ['illustrations', 'animations', 'logos'] as const;
type AssetType = (typeof ASSET_TYPES)[number];

const VALID_EXTENSIONS = new Set(['.svg', '.webp', '.png', '.gif', '.json']);

const VALID_VARIANTS: Record<AssetType, Set<string>> = {
  illustrations: new Set(['darkmode', 'circled', 'contrast']),
  animations: new Set(['darkmode', 'contrast']),
  logos: new Set(['darkmode', 'contrast', 'symbol', 'monochrome']),
};

// Monochrome SVGs use currentColor — build bakes these hex values for CDN
const MONOCHROME_BAKED_COLORS: Record<string, string> = {
  default: '#181c56', // lavender-90 (light mode text-accent)
  darkmode: '#e5e5e9', // ebony-10 (dark mode text-accent)
  contrast: '#ffffff', // contrast text-accent
};

const CONVERT_SVG_TYPES: Set<AssetType> = new Set(['illustrations', 'logos']);
const RASTER_WIDTHS = [1024] as const;

type AssetEntry = {
  name: string;
  variants: string[];
  extension: string;
  sourcePath: string;
  fileKey: string;
  hash: string;
  hashedFilename: string;
};

type GeneratedEntry = AssetEntry & {
  generated: true;
  // Raster conversions use extension in hash map key to disambiguate formats.
  // Baked monochrome SVGs do NOT — they're addressed by variant flags.
  appendExtensionToKey: boolean;
};

function hashBuffer(buf: Buffer): string {
  return createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

function hashFile(filePath: string): string {
  return hashBuffer(readFileSync(filePath));
}

function parseAssetFilename(
  filename: string,
  assetType: AssetType,
): { name: string; variants: string[]; extension: string } | null {
  const ext = extname(filename);
  if (!VALID_EXTENSIONS.has(ext)) return null;

  const stem = basename(filename, ext);
  const parts = stem.split('.');
  const name = parts[0];
  const variants = parts.slice(1);

  for (const variant of variants) {
    if (!VALID_VARIANTS[assetType].has(variant)) {
      console.warn(
        `Warning: "${variant}" is not a valid variant for ${assetType} (file: ${filename}). ` +
          `Valid variants: ${[...VALID_VARIANTS[assetType]].join(', ')}`,
      );
      return null;
    }
  }

  return { name, variants, extension: ext };
}

/**
 * Recursively scan a directory for asset files.
 * Supports subdirectories — the subdirectory path becomes part of the asset name.
 * e.g. logos/partner/ruter.svg → name "partner/ruter"
 */
function scanAssets(assetType: AssetType): AssetEntry[] {
  const dir = join(SRC, assetType);
  if (!existsSync(dir)) return [];

  const entries: AssetEntry[] = [];

  function walk(currentDir: string, prefix: string) {
    for (const file of readdirSync(currentDir)) {
      const filePath = join(currentDir, file);

      if (statSync(filePath).isDirectory()) {
        walk(filePath, prefix ? `${prefix}/${file}` : file);
        continue;
      }

      const parsed = parseAssetFilename(file, assetType);
      if (!parsed) continue;

      const fullName = prefix ? `${prefix}/${parsed.name}` : parsed.name;
      const fileKey =
        parsed.variants.length > 0
          ? `${fullName}.${parsed.variants.sort().join('.')}`
          : fullName;

      entries.push({
        name: fullName,
        variants: parsed.variants,
        extension: parsed.extension,
        sourcePath: filePath,
        fileKey,
        hash: hashFile(filePath),
        hashedFilename: `${fileKey}-${hashFile(filePath)}${parsed.extension}`,
      });
    }
  }

  walk(dir, '');
  return entries;
}

/**
 * For monochrome logo SVGs (containing currentColor), generate baked CDN variants
 * with theme-specific colors and an eds-icon--logo class on the bundled version.
 */
function generateMonochromeVariants(entries: AssetEntry[]): GeneratedEntry[] {
  const monochromeEntries = entries.filter(
    e =>
      e.extension === '.svg' &&
      e.variants.includes('monochrome') &&
      !e.variants.includes('darkmode') &&
      !e.variants.includes('contrast'),
  );

  const generated: GeneratedEntry[] = [];

  for (const entry of monochromeEntries) {
    const svgContent = readFileSync(entry.sourcePath, 'utf-8');
    if (!svgContent.includes('currentColor')) {
      console.warn(
        `Warning: monochrome SVG "${entry.fileKey}" does not contain currentColor`,
      );
      continue;
    }

    // Add eds-icon--logo class to the bundled currentColor version
    const withClass = addSvgClass(svgContent, 'eds-icon--logo');
    writeFileSync(entry.sourcePath, withClass);
    entry.hash = hashFile(entry.sourcePath);
    entry.hashedFilename = `${entry.fileKey}-${entry.hash}${entry.extension}`;

    // Generate baked darkmode and contrast variants for CDN
    for (const [mode, color] of Object.entries(MONOCHROME_BAKED_COLORS)) {
      if (mode === 'default') continue; // default monochrome uses currentColor as-is

      const bakedSvg = svgContent.replace(/currentColor/g, color);
      const buf = Buffer.from(bakedSvg, 'utf-8');
      const hash = hashBuffer(buf);

      // Insert the mode variant into the fileKey
      // e.g. "partner/ruter.monochrome" → "partner/ruter.monochrome.darkmode"
      const bakedFileKey = `${entry.fileKey}.${mode}`;
      const bakedFilename = `${bakedFileKey}-${hash}.svg`;

      // Write to dist for CDN upload
      const outDir = join(DIST, 'logos', dirname(entry.name));
      mkdirSync(outDir, { recursive: true });
      const outPath = join(
        DIST,
        'logos',
        dirname(entry.name),
        `${basename(entry.name)}.monochrome.${mode}.svg`,
      );
      writeFileSync(outPath, bakedSvg);

      generated.push({
        name: entry.name,
        variants: [...entry.variants, mode].sort(),
        extension: '.svg',
        sourcePath: outPath,
        fileKey: bakedFileKey,
        hash,
        hashedFilename: bakedFilename,
        generated: true,
        appendExtensionToKey: false,
      });
    }
  }

  return generated;
}

function addSvgClass(svg: string, className: string): string {
  return svg.replace(
    /(<svg\b[^>]*?)(\sclass="([^"]*)")?/,
    (match, before, classAttr, existingClasses) => {
      if (existingClasses) {
        if (existingClasses.split(/\s+/).includes(className)) return match;
        return `${before} class="${existingClasses} ${className}"`;
      }
      return `${before} class="${className}"`;
    },
  );
}

async function generateRasterFormats(
  assetType: AssetType,
  svgEntries: AssetEntry[],
): Promise<GeneratedEntry[]> {
  if (!CONVERT_SVG_TYPES.has(assetType)) return [];

  const svgOnly = svgEntries.filter(e => e.extension === '.svg');
  if (svgOnly.length === 0) return [];

  const generated: GeneratedEntry[] = [];

  for (const entry of svgOnly) {
    const svgBuffer = readFileSync(entry.sourcePath);
    const outDir = join(DIST, assetType, dirname(entry.name));
    mkdirSync(outDir, { recursive: true });

    for (const width of RASTER_WIDTHS) {
      for (const format of ['png', 'webp'] as const) {
        const buf = await sharp(svgBuffer, { density: 150 })
          .resize(width)
          .toFormat(format, format === 'webp' ? { quality: 90 } : {})
          .toBuffer();

        const hash = hashBuffer(buf);
        const ext = `.${format}`;
        const outName = `${basename(entry.fileKey)}${ext}`;
        const hashedName = `${entry.fileKey}-${hash}${ext}`;

        writeFileSync(join(outDir, outName), buf);

        generated.push({
          name: entry.name,
          variants: entry.variants,
          extension: ext,
          sourcePath: join(outDir, outName),
          fileKey: entry.fileKey,
          hash,
          hashedFilename: hashedName,
          generated: true,
          appendExtensionToKey: true,
        });
      }
    }
  }

  return generated;
}

function copyAssets(assetType: AssetType, entries: AssetEntry[]): void {
  for (const entry of entries) {
    const outDir = join(DIST, assetType, dirname(entry.name));
    mkdirSync(outDir, { recursive: true });
    const destFile = basename(entry.sourcePath);
    copyFileSync(entry.sourcePath, join(outDir, destFile));
  }
}

function buildHashMap(
  inventory: Record<AssetType, (AssetEntry | GeneratedEntry)[]>,
): Record<string, Record<string, string>> {
  const hashMap: Record<string, Record<string, string>> = {};

  for (const [type, entries] of Object.entries(inventory)) {
    hashMap[type] = {};
    for (const entry of entries) {
      const appendExt =
        'appendExtensionToKey' in entry && entry.appendExtensionToKey;
      const mapKey = appendExt
        ? `${entry.fileKey}${entry.extension}`
        : entry.fileKey;
      hashMap[type][mapKey] = entry.hashedFilename;
    }
  }

  return hashMap;
}

function uniqueNames(entries: AssetEntry[]): string[] {
  return [...new Set(entries.map(e => e.name))].sort();
}

function generateTypesFile(inventory: Record<AssetType, AssetEntry[]>): string {
  const illustrationKeys = uniqueNames(inventory.illustrations);
  const animationKeys = uniqueNames(inventory.animations);
  const logoKeys = uniqueNames(inventory.logos);

  const formatUnion = (keys: string[]) =>
    keys.length > 0 ? keys.map(k => `  | '${k}'`).join('\n') : '  never';

  return `export type IllustrationVariants = {
  darkmode?: boolean
  circled?: boolean
  contrast?: boolean
}

export type AnimationVariants = {
  darkmode?: boolean
  contrast?: boolean
}

export type LogoVariants = {
  symbol?: boolean
  darkmode?: boolean
  contrast?: boolean
  monochrome?: boolean
}

export type AssetType = 'illustrations' | 'animations' | 'logos'

export type AssetFormat = 'svg' | 'png' | 'webp'

// GENERATED — do not edit manually. Rebuilt by bin/build.ts from src/ file inventory.
export type IllustrationKey =
${formatUnion(illustrationKeys)}

export type AnimationKey =
${formatUnion(animationKeys)}

export type LogoKey =
${formatUnion(logoKeys)}
`;
}

function generateHashMapFile(
  hashMap: Record<string, Record<string, string>>,
): string {
  return `// GENERATED — do not edit manually. Rebuilt by bin/build.ts.
export const HASH_MAP: Record<string, Record<string, string>> = ${JSON.stringify(
    hashMap,
    null,
    2,
  )}
`;
}

async function buildUrlModule(): Promise<void> {
  const urlsDist = join(DIST, 'urls');
  mkdirSync(urlsDist, { recursive: true });

  const entryPoint = join(SRC, 'urls', 'index.ts');

  await build({
    entryPoints: [entryPoint],
    outfile: join(urlsDist, 'index.mjs'),
    format: 'esm',
    bundle: true,
    platform: 'neutral',
    target: 'es2020',
    sourcemap: true,
  });

  await build({
    entryPoints: [entryPoint],
    outfile: join(urlsDist, 'index.js'),
    format: 'cjs',
    bundle: true,
    platform: 'neutral',
    target: 'es2020',
    sourcemap: true,
  });

  const dtsContent = readFileSync(join(SRC, 'urls', 'types.ts'), 'utf-8');

  const urlDts = `${dtsContent}
export declare function getIllustrationUrl(
  key: IllustrationKey,
  variants?: IllustrationVariants,
  format?: AssetFormat,
): string

export declare function getAnimationUrl(
  key: AnimationKey,
  variants?: AnimationVariants,
): string

export declare function getLogoUrl(
  key: LogoKey,
  variants?: LogoVariants,
  format?: AssetFormat,
): string
`;
  writeFileSync(join(urlsDist, 'index.d.ts'), urlDts);
}

async function main(): Promise<void> {
  console.log('Building @entur/assets...');

  // 1. Scan all source assets (supports subdirectories)
  const sourceInventory: Record<AssetType, AssetEntry[]> = {
    illustrations: scanAssets('illustrations'),
    animations: scanAssets('animations'),
    logos: scanAssets('logos'),
  };

  const totalSource = Object.values(sourceInventory).reduce(
    (sum, entries) => sum + entries.length,
    0,
  );
  console.log(`Found ${totalSource} source assets:`);
  for (const [type, entries] of Object.entries(sourceInventory)) {
    console.log(
      `  ${type}: ${entries.length} files (${
        uniqueNames(entries).length
      } unique)`,
    );
  }

  // 2. Copy source files to dist/ (preserving subdirectory structure)
  mkdirSync(DIST, { recursive: true });
  for (const type of ASSET_TYPES) {
    copyAssets(type, sourceInventory[type]);
  }

  // 3. Generate baked monochrome variants for logo CDN
  console.log('Generating monochrome CDN variants...');
  const monochromeGenerated = generateMonochromeVariants(sourceInventory.logos);
  if (monochromeGenerated.length > 0) {
    console.log(
      `  logos: ${monochromeGenerated.length} baked monochrome variants`,
    );
  }

  // 4. Generate PNG + WebP from SVGs
  console.log('Generating raster formats from SVG...');
  const generatedByType: Record<AssetType, GeneratedEntry[]> = {
    illustrations: [],
    animations: [],
    logos: [],
  };

  for (const type of ASSET_TYPES) {
    // Include monochrome generated SVGs for raster conversion too
    const allSvgEntries = [
      ...sourceInventory[type],
      ...(type === 'logos' ? monochromeGenerated : []),
    ];
    const generated = await generateRasterFormats(type, allSvgEntries);
    generatedByType[type] = generated;
    if (generated.length > 0) {
      console.log(`  ${type}: ${generated.length} raster files generated`);
    }
  }

  // 5. Build combined inventory for hash map
  const fullInventory: Record<AssetType, (AssetEntry | GeneratedEntry)[]> = {
    illustrations: [
      ...sourceInventory.illustrations,
      ...generatedByType.illustrations,
    ],
    animations: [...sourceInventory.animations, ...generatedByType.animations],
    logos: [
      ...sourceInventory.logos,
      ...monochromeGenerated,
      ...generatedByType.logos,
    ],
  };

  // 6. Generate types and hash map into src/ (so esbuild picks them up)
  const hashMap = buildHashMap(fullInventory);
  writeFileSync(
    join(SRC, 'urls', 'types.ts'),
    generateTypesFile(sourceInventory),
  );
  writeFileSync(join(SRC, 'urls', 'hashmap.ts'), generateHashMapFile(hashMap));

  // 7. Build URL module
  await buildUrlModule();

  // 8. Write hash map JSON for CI upload script
  writeFileSync(join(DIST, 'hashmap.json'), JSON.stringify(hashMap, null, 2));

  const totalDist = Object.values(fullInventory).reduce(
    (sum, entries) => sum + entries.length,
    0,
  );
  console.log(`\nBuild complete. ${totalDist} total files in dist/.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
