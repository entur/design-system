import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import type {
  ColorFormat,
  ColorSource,
  ColorTokenFinding,
  HardcodedColorFinding,
} from '../types';
import {
  SOURCE_EXTENSIONS,
  STYLE_EXTENSIONS,
  findFilesByExtension,
} from './constants';
import { legacyPathToTokenName, normalizeColor } from './styleCatalog';
import type { StyleCatalogIndex } from './styleCatalog';

/** CSS custom property read: var(--fill-background-tint-light) */
const CSS_VAR_PATTERN = /var\(\s*--([a-zA-Z0-9_-]+)/g;

/** SCSS or LESS variable read: $blue-10 / @blue-10 */
const PREPROCESSOR_VAR_PATTERN = /[$@]([a-zA-Z][a-zA-Z0-9_-]*)/g;

/** Hex colour literal. */
const HEX_PATTERN = /#([0-9a-fA-F]{3,8})\b/g;

/** Functional colour notation. */
const FUNCTIONAL_COLOR_PATTERN = /\b(rgba?|hsla?)\(\s*[^)]*\)/g;

/**
 * Named CSS colours worth flagging. Deliberately a short list of the ones that
 * actually turn up in product code — matching all 148 CSS names would flag
 * words like `tomato` inside unrelated identifiers.
 */
const NAMED_COLORS = new Set([
  'aqua',
  'black',
  'blue',
  'brown',
  'coral',
  'cyan',
  'fuchsia',
  'gold',
  'gray',
  'green',
  'grey',
  'indigo',
  'lime',
  'magenta',
  'maroon',
  'navy',
  'olive',
  'orange',
  'pink',
  'purple',
  'red',
  'salmon',
  'silver',
  'teal',
  'turquoise',
  'violet',
  'white',
  'yellow',
]);

/**
 * A named colour only counts when it is the whole declaration value, so
 * `color: red;` is a finding but `.border-red` and `$brand-red` are not.
 */
const NAMED_COLOR_DECLARATION_PATTERN =
  /:\s*([a-zA-Z]+)\s*(?:!important)?\s*[;}]/g;

/** Classify how a colour literal was written, before it is normalised. */
function detectColorFormat(literal: string): ColorFormat | null {
  const value = literal.trim().toLowerCase();
  if (value.startsWith('#')) return 'hex';
  if (value.startsWith('rgb')) return 'rgb';
  if (value.startsWith('hsl')) return 'hsl';
  if (NAMED_COLORS.has(value)) return 'named';
  return null;
}

/** Values that are keywords rather than colour choices. */
const IGNORED_COLOR_VALUES = new Set([
  'transparent',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
  'revert',
  'none',
]);

/** JS exports of @entur/tokens that hold colour objects. */
const TOKEN_OBJECT_ROOTS = new Set([
  'colors',
  'primitive',
  'semantic',
  'base',
  'data',
  'transport',
  'componentColors',
  'componentVariables',
]);

export interface AnalyzeColorTokensResult {
  tokens: ColorTokenFinding[];
  hardcoded: HardcodedColorFinding[];
  /** Number of stylesheet files inspected */
  styleFilesScanned: number;
  /** Number of source files inspected */
  sourceFilesScanned: number;
}

// ── Accumulators ────────────────────────────────────────────────────────────

interface TokenAccumulator {
  finding: ColorTokenFinding;
  files: Set<string>;
  sources: Set<ColorSource>;
}

interface HardcodedAccumulator {
  finding: HardcodedColorFinding;
  files: Set<string>;
  sources: Set<ColorSource>;
}

class ColorCollector {
  private tokens = new Map<string, TokenAccumulator>();
  private hardcoded = new Map<string, HardcodedAccumulator>();

  constructor(private catalog: StyleCatalogIndex) {}

  /** Record a reference to a token name, ignoring names not in the catalogue. */
  addToken(tokenName: string, filePath: string, source: ColorSource): void {
    const token = this.catalog.lookupToken(tokenName);
    if (!token) return;

    let entry = this.tokens.get(token.name);
    if (!entry) {
      entry = {
        finding: {
          tokenName: token.name,
          tokenLayer: token.layer,
          tokenGeneration: token.layer === 'legacy' ? 'legacy' : 'new',
          occurrenceCount: 0,
          fileCount: 0,
          sources: [],
        },
        files: new Set(),
        sources: new Set(),
      };
      this.tokens.set(token.name, entry);
    }

    entry.finding.occurrenceCount++;
    entry.files.add(filePath);
    entry.sources.add(source);
  }

  addHardcoded(
    raw: string,
    format: ColorFormat,
    filePath: string,
    source: ColorSource,
  ): void {
    const normalized = normalizeColor(raw) ?? raw.trim().toLowerCase();
    if (IGNORED_COLOR_VALUES.has(normalized)) return;

    let entry = this.hardcoded.get(normalized);
    if (!entry) {
      const match = this.catalog.findTokenByValue(normalized);
      entry = {
        finding: {
          value: normalized,
          colorFormat: format,
          occurrenceCount: 0,
          fileCount: 0,
          matchesTokenName: match?.name,
          matchesTokenLayer: match?.layer,
          sources: [],
        },
        files: new Set(),
        sources: new Set(),
      };
      this.hardcoded.set(normalized, entry);
    }

    entry.finding.occurrenceCount++;
    entry.files.add(filePath);
    entry.sources.add(source);
  }

  finalize(): Pick<AnalyzeColorTokensResult, 'tokens' | 'hardcoded'> {
    const tokens = [...this.tokens.values()].map(entry => ({
      ...entry.finding,
      fileCount: entry.files.size,
      sources: [...entry.sources].sort(),
    }));
    const hardcoded = [...this.hardcoded.values()].map(entry => ({
      ...entry.finding,
      fileCount: entry.files.size,
      sources: [...entry.sources].sort(),
    }));

    tokens.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    hardcoded.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    return { tokens, hardcoded };
  }
}

// ── Shared text scanning ────────────────────────────────────────────────────

/**
 * Scan a block of CSS-like text for token references and hardcoded colours.
 * Used for stylesheets and for CSS-in-JS template literals alike.
 */
function scanCssText(
  text: string,
  relPath: string,
  source: ColorSource,
  collector: ColorCollector,
  options: { includePreprocessorVars: boolean },
): void {
  let match: RegExpExecArray | null;

  CSS_VAR_PATTERN.lastIndex = 0;
  while ((match = CSS_VAR_PATTERN.exec(text)) !== null) {
    collector.addToken(match[1], relPath, source);
  }

  if (options.includePreprocessorVars) {
    PREPROCESSOR_VAR_PATTERN.lastIndex = 0;
    while ((match = PREPROCESSOR_VAR_PATTERN.exec(text)) !== null) {
      // Only catalogued names count, so local $spacing variables are ignored
      collector.addToken(match[1], relPath, source);
    }
  }

  HEX_PATTERN.lastIndex = 0;
  while ((match = HEX_PATTERN.exec(text)) !== null) {
    const length = match[1].length;
    if (length !== 3 && length !== 4 && length !== 6 && length !== 8) continue;
    collector.addHardcoded(match[0], 'hex', relPath, source);
  }

  FUNCTIONAL_COLOR_PATTERN.lastIndex = 0;
  while ((match = FUNCTIONAL_COLOR_PATTERN.exec(text)) !== null) {
    // A var() inside rgb() means the colour itself comes from a token
    if (match[0].includes('var(')) continue;
    const format: ColorFormat = match[1].startsWith('hsl') ? 'hsl' : 'rgb';
    collector.addHardcoded(match[0], format, relPath, source);
  }

  NAMED_COLOR_DECLARATION_PATTERN.lastIndex = 0;
  while ((match = NAMED_COLOR_DECLARATION_PATTERN.exec(text)) !== null) {
    const value = match[1].toLowerCase();
    if (NAMED_COLORS.has(value)) {
      collector.addHardcoded(value, 'named', relPath, source);
    }
  }
}

// ── Stylesheets ─────────────────────────────────────────────────────────────

function scanStylesheet(
  filePath: string,
  repoDir: string,
  collector: ColorCollector,
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }
  scanCssText(
    content,
    path.relative(repoDir, filePath),
    'stylesheet',
    collector,
    { includePreprocessorVars: true },
  );
}

// ── Source files ────────────────────────────────────────────────────────────

const TEMPLATE_TEXT_KINDS = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
]);

/**
 * Map local binding names to the @entur/tokens export they refer to.
 *
 * Handles named imports, aliases, and namespace imports; a namespace binding is
 * recorded as '*' so `tokens.colors.brand.blue` can be resolved by dropping the
 * namespace segment.
 */
function collectTokenBindings(sourceFile: ts.SourceFile): Map<string, string> {
  const bindings = new Map<string, string>();

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
    if (statement.moduleSpecifier.text !== '@entur/tokens') continue;

    const clause = statement.importClause;
    if (!clause) continue;

    const named = clause.namedBindings;
    if (named && ts.isNamespaceImport(named)) {
      bindings.set(named.name.text, '*');
    } else if (named && ts.isNamedImports(named)) {
      for (const element of named.elements) {
        const imported = element.propertyName
          ? element.propertyName.text
          : element.name.text;
        bindings.set(element.name.text, imported);
      }
    }
  }

  return bindings;
}

/** Flatten `colors.brand.blue` into ['colors', 'brand', 'blue']. */
function propertyAccessPath(
  node: ts.PropertyAccessExpression,
): string[] | null {
  const segments: string[] = [];
  let current: ts.Expression = node;

  while (ts.isPropertyAccessExpression(current)) {
    if (!ts.isIdentifier(current.name)) return null;
    segments.unshift(current.name.text);
    current = current.expression;
  }

  if (!ts.isIdentifier(current)) return null;
  segments.unshift(current.text);
  return segments;
}

function scanSourceFile(
  filePath: string,
  repoDir: string,
  collector: ColorCollector,
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }

  const relPath = path.relative(repoDir, filePath);

  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  const bindings = collectTokenBindings(sourceFile);

  const visit = (node: ts.Node): void => {
    // CSS-in-JS: styled-components, emotion, or any other template literal
    if (TEMPLATE_TEXT_KINDS.has(node.kind)) {
      scanCssText(
        (node as ts.LiteralLikeNode).text,
        relPath,
        'css-in-js',
        collector,
        { includePreprocessorVars: false },
      );
    }

    // style={{ color: '#fff' }} and other inline style objects
    if (
      ts.isJsxAttribute(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'style'
    ) {
      scanInlineStyle(node, relPath, collector);
    }

    // colors.blues.blue50 from @entur/tokens
    if (ts.isPropertyAccessExpression(node) && bindings.size > 0) {
      const segments = propertyAccessPath(node);
      if (segments && segments.length >= 2) {
        const tokenName = resolveTokenObjectPath(segments, bindings);
        if (tokenName) {
          collector.addToken(tokenName, relPath, 'js-token-object');
          // The parent access already covers the full chain
          return;
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

/**
 * Turn a resolved member-expression path into a token name.
 *
 * This closes the gap where importing `colors` only ever registered as N
 * references to the symbol, with no idea which colours were actually used.
 * Only paths that resolve to a catalogued token are counted, so typos and
 * unrelated member access fall away.
 *
 * New-generation token objects (base, semantic, …) use a different key shape
 * from their CSS custom properties, so in practice only the legacy `colors`
 * object resolves here. New-generation tokens are consumed as CSS variables,
 * which the stylesheet and CSS-in-JS passes cover.
 */
function resolveTokenObjectPath(
  segments: string[],
  bindings: Map<string, string>,
): string | null {
  const binding = bindings.get(segments[0]);
  if (!binding) return null;

  let pathSegments: string[];
  if (binding === '*') {
    // import * as tokens → tokens.colors.brand.blue
    pathSegments = segments.slice(1);
  } else {
    pathSegments = [binding, ...segments.slice(1)];
  }

  if (pathSegments.length < 2) return null;
  if (!TOKEN_OBJECT_ROOTS.has(pathSegments[0])) return null;

  // base and data are keyed by colour mode in JS but not in CSS
  if (pathSegments[1] === 'light' || pathSegments[1] === 'dark') {
    pathSegments = [pathSegments[0], ...pathSegments.slice(2)];
  }

  return legacyPathToTokenName(pathSegments.join('.'));
}

function scanInlineStyle(
  attribute: ts.JsxAttribute,
  relPath: string,
  collector: ColorCollector,
): void {
  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || TEMPLATE_TEXT_KINDS.has(node.kind)) {
      const text = (node as ts.LiteralLikeNode).text.trim();

      CSS_VAR_PATTERN.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = CSS_VAR_PATTERN.exec(text)) !== null) {
        collector.addToken(match[1], relPath, 'inline-style');
      }

      const format = detectColorFormat(text);
      if (format) {
        collector.addHardcoded(text, format, relPath, 'inline-style');
      }
    }
    ts.forEachChild(node, visit);
  };

  if (attribute.initializer) visit(attribute.initializer);
}

// ── Entry point ─────────────────────────────────────────────────────────────

/**
 * Analyze a repository's colour token usage and hardcoded colours.
 *
 * Covers stylesheets (`var(--x)`, `$x`, `@x`), CSS-in-JS template literals,
 * inline style objects, and member access on token objects imported from
 * @entur/tokens. Results are aggregated per token and per normalised colour
 * value rather than per occurrence, which keeps the event volume manageable
 * while still supporting per-repo and per-token breakdowns.
 *
 * Hardcoded colours are matched back against token values, so a repo that
 * hardcodes a colour the design system already publishes is visible as such —
 * the main signal for where a token migration will actually bite.
 */
export function analyzeColorTokens(
  repoDir: string,
  catalog: StyleCatalogIndex | null,
): AnalyzeColorTokensResult {
  if (!catalog) {
    return {
      tokens: [],
      hardcoded: [],
      styleFilesScanned: 0,
      sourceFilesScanned: 0,
    };
  }

  const collector = new ColorCollector(catalog);

  const styleFiles = findFilesByExtension(repoDir, STYLE_EXTENSIONS, {
    includeFindingsOnlyFiles: true,
  });
  for (const filePath of styleFiles) {
    scanStylesheet(filePath, repoDir, collector);
  }

  const sourceFiles = findFilesByExtension(repoDir, SOURCE_EXTENSIONS);
  for (const filePath of sourceFiles) {
    try {
      scanSourceFile(filePath, repoDir, collector);
    } catch {
      // Skip files that fail to parse
    }
  }

  return {
    ...collector.finalize(),
    styleFilesScanned: styleFiles.length,
    sourceFilesScanned: sourceFiles.length,
  };
}
