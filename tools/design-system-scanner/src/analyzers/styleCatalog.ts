import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import type {
  CatalogClassName,
  CatalogColorToken,
  ClassGeneration,
  ColorTokenLayer,
  StyleCatalog,
} from '../types';

/**
 * Builds the catalogue of internal CSS class names and colour tokens that the
 * design system publishes, straight from the monorepo's own sources.
 *
 * Deliberately reads `src/`, not `dist/`: no package is built in the scan
 * workflow, and `dist/` is not committed. It also needs no network access and no
 * TypeScript program, which is what separates it from scripts/generate-catalog.ts.
 */

/** The global contrast utility is referenced by every package; attribute it to utils. */
const SHARED_UTILITY_CLASSES: Record<string, string> = {
  'eds-contrast': '@entur/utils',
};

/** Colour token JSON exports in packages/tokens/src, mapped to their layer. */
const TOKEN_JSON_LAYERS: Array<{ file: string; layer: ColorTokenLayer }> = [
  { file: 'primitive.json', layer: 'primitive' },
  { file: 'semantic.json', layer: 'semantic' },
  { file: 'base.json', layer: 'base' },
  { file: 'data.json', layer: 'data' },
  { file: 'transport.json', layer: 'transport' },
];

/**
 * Which layer to prefer when several tokens resolve to the same colour value.
 * Consumer-facing layers first, so "you hardcoded #181c56" suggests a base or
 * semantic token rather than the primitive it happens to alias.
 */
const VALUE_MATCH_PRIORITY: ColorTokenLayer[] = [
  'base',
  'semantic',
  'component',
  'primitive',
  'legacy',
  'transport',
  'data',
];

// ── SCSS class name extraction ──────────────────────────────────────────────

function stripScssComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const LEADING_CLASS_PATTERN = /^\.(eds-[a-zA-Z0-9_-]+)/;

/**
 * Extract the class names a stylesheet *declares*, as opposed to merely
 * references.
 *
 * A class counts as declared when it is the leading compound of a resolved
 * selector: `.eds-heading {}` and its nested `&--xl {}` declare `eds-heading`
 * and `eds-heading--xl`, while `.eds-navigation-card .eds-paragraph {}` in
 * @entur/layout only references `eds-paragraph`, which @entur/typography owns.
 * Without that distinction every package that styles typography inside its own
 * components would claim typography's class names.
 *
 * At-rule wrappers (@layer, @media, @supports) are transparent, which matters
 * because the beta styles wrap everything in `@layer components.primitives`.
 */
export function extractDeclaredClassNames(scssSource: string): string[] {
  const source = stripScssComments(scssSource);
  const declared = new Set<string>();
  // null marks an at-rule wrapper, which does not contribute to selector nesting
  const stack: (string | null)[] = [];
  let buffer = '';

  const parentSelector = (): string => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const entry = stack[i];
      if (entry !== null) return entry;
    }
    return '';
  };

  for (const char of source) {
    if (char === '{') {
      const selector = buffer.trim();
      buffer = '';

      if (selector.startsWith('@')) {
        stack.push(null);
        continue;
      }

      const parent = parentSelector();
      const resolved: string[] = [];

      for (const rawPart of selector.split(',')) {
        const part = rawPart.trim();
        if (!part) continue;
        if (part.includes('&')) {
          resolved.push(part.split('&').join(parent).trim());
        } else {
          resolved.push(parent ? `${parent} ${part}` : part);
        }
      }

      for (const candidate of resolved) {
        const match = LEADING_CLASS_PATTERN.exec(candidate);
        // SCSS interpolation (&--type-#{$t}) leaves a truncated stem behind
        if (match && !match[1].endsWith('-')) declared.add(match[1]);
      }

      stack.push(resolved[0] ?? '');
    } else if (char === '}') {
      buffer = '';
      stack.pop();
    } else if (char === ';') {
      buffer = '';
    } else {
      buffer += char;
    }
  }

  return [...declared];
}

/** Strip the BEM modifier suffix: "eds-text--paragraph" → "eds-text". */
export function toBaseClass(className: string): string {
  const index = className.indexOf('--');
  return index === -1 ? className : className.slice(0, index);
}

function collectScssFiles(dir: string, acc: string[] = []): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      collectScssFiles(full, acc);
    } else if (/\.s[ac]ss$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function buildClassNames(packagesRoot: string): CatalogClassName[] {
  const result = new Map<string, CatalogClassName>();

  let packageDirs: fs.Dirent[];
  try {
    packageDirs = fs.readdirSync(packagesRoot, { withFileTypes: true });
  } catch {
    return [];
  }

  for (const dir of packageDirs) {
    if (!dir.isDirectory()) continue;
    const packageName = `@entur/${dir.name}`;
    const srcDir = path.join(packagesRoot, dir.name, 'src');

    for (const file of collectScssFiles(srcDir)) {
      // The beta entry points live under src/beta, which is how the two
      // generations of a package's styles are told apart.
      const generation: ClassGeneration = file.split(path.sep).includes('beta')
        ? 'beta'
        : 'legacy';

      let source: string;
      try {
        source = fs.readFileSync(file, 'utf-8');
      } catch {
        continue;
      }

      for (const className of extractDeclaredClassNames(source)) {
        const owner = SHARED_UTILITY_CLASSES[className] ?? packageName;
        const key = `${className}::${generation}`;
        if (result.has(key)) continue;
        result.set(key, {
          className,
          baseClass: toBaseClass(className),
          packageName: owner,
          generation,
        });
      }
    }
  }

  return [...result.values()].sort((a, b) =>
    a.className.localeCompare(b.className),
  );
}

// ── Colour token extraction ─────────────────────────────────────────────────

interface FigmaVariable {
  name?: string;
  value?: string;
}

interface FigmaMode {
  mode?: { name?: string };
  color?: FigmaVariable[];
}

interface FigmaCategory {
  name?: string;
  values?: FigmaMode[];
}

/**
 * Mirrors toKebabCase in packages/tokens/src/buildVariables.ts, which turns a
 * Figma variable name into its CSS custom property: "Fill/Background/Tint/Light"
 * → "fill-background-tint-light". Reimplemented rather than imported because the
 * scan workflow installs only this workspace's dependencies, so the tokens
 * package's own deps are absent. styleCatalog.test.ts guards against drift.
 */
export function figmaNameToTokenName(name: string): string {
  return name.replace(/\//g, '-').replace(/\s/g, '').toLowerCase();
}

/**
 * Mirrors the legacy token naming in packages/tokens/bin/build-legacy-tokens.ts,
 * which flattens the token object and applies case.kebab(case.camel(key)):
 * "colors.blues.blue50" → "colors-blues-blue50".
 */
export function legacyPathToTokenName(dottedPath: string): string {
  const camel = dottedPath.replace(/\.(\w)/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
  return camel.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Hex values for the named CSS colours the scanner reports, so a named colour
 * can still be matched against a token value.
 */
const NAMED_COLOR_HEX: Record<string, string> = {
  aqua: '#00ffff',
  black: '#000000',
  blue: '#0000ff',
  brown: '#a52a2a',
  coral: '#ff7f50',
  cyan: '#00ffff',
  fuchsia: '#ff00ff',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  grey: '#808080',
  indigo: '#4b0082',
  lime: '#00ff00',
  magenta: '#ff00ff',
  maroon: '#800000',
  navy: '#000080',
  olive: '#808000',
  orange: '#ffa500',
  pink: '#ffc0cb',
  purple: '#800080',
  red: '#ff0000',
  salmon: '#fa8072',
  silver: '#c0c0c0',
  teal: '#008080',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  white: '#ffffff',
  yellow: '#ffff00',
};

/** Normalise a colour literal to lowercase hex, or null if not convertible. */
export function normalizeColor(raw: string): string | null {
  const value = raw.trim().toLowerCase();

  const named = NAMED_COLOR_HEX[value];
  if (named) return named;

  const hex = /^#([0-9a-f]{3,8})$/.exec(value);
  if (hex) {
    const d = hex[1];
    if (d.length === 3) {
      return `#${d[0]}${d[0]}${d[1]}${d[1]}${d[2]}${d[2]}`;
    }
    if (d.length === 4) {
      return `#${d[0]}${d[0]}${d[1]}${d[1]}${d[2]}${d[2]}${d[3]}${d[3]}`;
    }
    if (d.length === 6 || d.length === 8) return `#${d}`;
    return null;
  }

  const rgb = /^rgba?\(([^)]+)\)$/.exec(value);
  if (rgb) {
    const parts = rgb[1]
      .split(/[,/\s]+/)
      .map(p => p.trim())
      .filter(Boolean);
    if (parts.length < 3) return null;
    const channels = parts
      .slice(0, 3)
      .map(p =>
        p.endsWith('%')
          ? Math.round((parseFloat(p) / 100) * 255)
          : Math.round(parseFloat(p)),
      );
    if (channels.some(c => Number.isNaN(c) || c < 0 || c > 255)) return null;
    return '#' + channels.map(c => c.toString(16).padStart(2, '0')).join('');
  }

  return null;
}

function readJsonTokens(
  filePath: string,
  layer: ColorTokenLayer,
  categoryName?: string,
): CatalogColorToken[] {
  let parsed: FigmaCategory[];
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const categories = categoryName
    ? parsed.filter(c => c.name === categoryName)
    : parsed;

  const tokens: CatalogColorToken[] = [];
  for (const category of categories) {
    for (const mode of category.values ?? []) {
      for (const variable of mode.color ?? []) {
        if (!variable.name) continue;
        tokens.push({
          name: figmaNameToTokenName(variable.name),
          layer,
          value: variable.value ? normalizeColor(variable.value) : null,
        });
      }
    }
  }
  return tokens;
}

/**
 * Read the `colors` object out of packages/tokens/src/legacy-tokens.ts.
 *
 * Parsed with the TypeScript AST rather than imported, because importing pulls
 * in hex-rgb and the rest of the tokens package's dependency tree.
 */
function readLegacyColorTokens(filePath: string): CatalogColorToken[] {
  let source: string;
  try {
    source = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return [];
  }

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  const tokens: CatalogColorToken[] = [];

  const walk = (node: ts.ObjectLiteralExpression, prefix: string): void => {
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = ts.isIdentifier(property.name)
        ? property.name.text
        : ts.isStringLiteral(property.name)
        ? property.name.text
        : null;
      if (!key) continue;

      const dottedPath = prefix ? `${prefix}.${key}` : key;

      if (ts.isObjectLiteralExpression(property.initializer)) {
        // `.rem` sub-objects hold sizes, not colours, and are excluded upstream too
        if (key === 'rem') continue;
        walk(property.initializer, dottedPath);
      } else if (ts.isStringLiteral(property.initializer)) {
        tokens.push({
          name: legacyPathToTokenName(dottedPath),
          layer: 'legacy',
          value: normalizeColor(property.initializer.text),
        });
      }
    }
  };

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      if (declaration.name.text !== 'colors') continue;
      if (
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        walk(declaration.initializer, 'colors');
      }
    }
  }

  return tokens;
}

function buildColorTokens(packagesRoot: string): CatalogColorToken[] {
  const tokensSrc = path.join(packagesRoot, 'tokens', 'src');
  const collected: CatalogColorToken[] = [];

  for (const { file, layer } of TOKEN_JSON_LAYERS) {
    collected.push(...readJsonTokens(path.join(tokensSrc, file), layer));
  }

  collected.push(
    ...readJsonTokens(
      path.join(tokensSrc, 'component.json'),
      'component',
      'Component colors',
    ),
  );

  collected.push(
    ...readLegacyColorTokens(path.join(tokensSrc, 'legacy-tokens.ts')),
  );

  // One entry per token name. base and data declare each name in both light and
  // dark mode; the first (light) value is kept as the representative one.
  const byName = new Map<string, CatalogColorToken>();
  for (const token of collected) {
    const existing = byName.get(token.name);
    if (!existing) {
      byName.set(token.name, token);
    } else if (existing.value === null && token.value !== null) {
      byName.set(token.name, token);
    }
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// ── Catalogue assembly and lookup ───────────────────────────────────────────

/**
 * Locate the monorepo's packages directory. The scanner lives inside
 * entur/design-system, so walking up from this module finds it in both the
 * built (dist/analyzers) and ts-jest (src/analyzers) layouts.
 */
export function resolvePackagesRoot(explicit?: string): string | null {
  const candidates = explicit ? [path.resolve(explicit)] : [];

  if (!explicit) {
    let dir = __dirname;
    for (let i = 0; i < 8; i++) {
      candidates.push(path.join(dir, 'packages'));
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  for (const candidate of candidates) {
    if (
      fs.existsSync(path.join(candidate, 'tokens', 'src', 'primitive.json'))
    ) {
      return candidate;
    }
  }
  return null;
}

export function buildStyleCatalog(packagesRoot: string): StyleCatalog {
  return {
    classNames: buildClassNames(packagesRoot),
    colorTokens: buildColorTokens(packagesRoot),
  };
}

/** Result of classifying an .eds-* class name found in consumer code. */
export interface ClassClassification {
  packageName: string | null;
  baseClass: string | null;
  generation: ClassGeneration;
}

/** Indexed catalogue with the lookups the analyzers need. */
export interface StyleCatalogIndex {
  catalog: StyleCatalog;
  /** Classify an .eds-* class name (without the leading dot). */
  classifyClass(className: string): ClassClassification;
  /** Look up a colour token by name (without sigil). */
  lookupToken(tokenName: string): CatalogColorToken | undefined;
  /** Find a token whose value equals the given colour, normalised. */
  findTokenByValue(color: string): CatalogColorToken | undefined;
}

export function indexStyleCatalog(catalog: StyleCatalog): StyleCatalogIndex {
  const byClassName = new Map<string, CatalogClassName[]>();
  const byBaseClass = new Map<string, CatalogClassName[]>();

  for (const entry of catalog.classNames) {
    const exact = byClassName.get(entry.className) ?? [];
    exact.push(entry);
    byClassName.set(entry.className, exact);

    const base = byBaseClass.get(entry.baseClass) ?? [];
    base.push(entry);
    byBaseClass.set(entry.baseClass, base);
  }

  const tokensByName = new Map<string, CatalogColorToken>();
  for (const token of catalog.colorTokens) {
    tokensByName.set(token.name, token);
  }

  const tokensByValue = new Map<string, CatalogColorToken>();
  for (const token of catalog.colorTokens) {
    if (!token.value) continue;
    const existing = tokensByValue.get(token.value);
    if (
      !existing ||
      VALUE_MATCH_PRIORITY.indexOf(token.layer) <
        VALUE_MATCH_PRIORITY.indexOf(existing.layer)
    ) {
      tokensByValue.set(token.value, token);
    }
  }

  const collapse = (matches: CatalogClassName[]): ClassClassification => {
    const packages = new Set(matches.map(m => m.packageName));
    const generations = new Set(matches.map(m => m.generation));
    return {
      packageName: packages.size === 1 ? [...packages][0] : null,
      baseClass: matches[0].baseClass,
      generation: generations.size === 1 ? [...generations][0] : 'unknown',
    };
  };

  return {
    catalog,

    classifyClass(className: string): ClassClassification {
      const exact = byClassName.get(className);
      if (exact) return collapse(exact);

      // Modifier classes are often built by SCSS interpolation and so never
      // appear literally in the source; fall back to the base class.
      const base = toBaseClass(className);
      const byBase = byBaseClass.get(base);
      if (byBase) return collapse(byBase);

      return { packageName: null, baseClass: null, generation: 'unknown' };
    },

    lookupToken(tokenName: string): CatalogColorToken | undefined {
      return tokensByName.get(tokenName.toLowerCase());
    },

    findTokenByValue(color: string): CatalogColorToken | undefined {
      const normalized = normalizeColor(color);
      if (!normalized) return undefined;
      return tokensByValue.get(normalized);
    },
  };
}

/** Build and index the catalogue, or return null when packages/ is unavailable. */
export function loadStyleCatalog(
  packagesRoot?: string,
): StyleCatalogIndex | null {
  const root = resolvePackagesRoot(packagesRoot);
  if (!root) return null;
  return indexStyleCatalog(buildStyleCatalog(root));
}
