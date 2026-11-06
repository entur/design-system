import * as fs from 'fs';
import * as path from 'path';
import { symbolKey } from './analyzers/packageAnalyzer';
import type { DesignSystemCatalog } from './types';

/** The catalog.json shipped next to the scanner (same path from src/ and dist/). */
export const DEFAULT_CATALOG_PATH = path.resolve(
  __dirname,
  '..',
  'catalog.json',
);

/** Read a catalog, or null when the file is missing or unreadable. */
export function loadCatalog(
  catalogPath: string = DEFAULT_CATALOG_PATH,
): DesignSystemCatalog | null {
  try {
    return JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  } catch {
    return null;
  }
}

/** symbolKey(package, subpath, component) → enum-like prop names. */
export type EnumPropIndex = Map<string, Set<string>>;

export function buildEnumPropIndex(
  catalog: DesignSystemCatalog | null,
): EnumPropIndex {
  const index: EnumPropIndex = new Map();
  for (const pkg of catalog?.packages ?? []) {
    for (const symbol of pkg.symbols) {
      if (!symbol.enumProps?.length) continue;
      index.set(
        symbolKey(pkg.packageName, pkg.deepImportPath, symbol.symbolName),
        new Set(symbol.enumProps),
      );
    }
  }
  return index;
}
